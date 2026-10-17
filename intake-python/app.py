"""Ricevitore di prova, con apertura pubblica limitata; nessuna AI o email implicita."""
import hashlib
import io
import json
import os
import secrets
import warnings
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal
from uuid import UUID

import httpx
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, ConfigDict, EmailStr, Field, TypeAdapter, ValidationError
from starlette.responses import JSONResponse, Response
from public_gate import ORIGIN, MAX_RECORDS, PublicGate, challenge, enabled
from notices import SignedNotice, notify_saved, verify

MAX_BYTES = 8_000_000
Image.MAX_IMAGE_PIXELS = 25_000_000


class MailTestRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    request_id: UUID


def mail_configuration():
    api_key = os.environ.get('RESEND_API_KEY', '')
    if not api_key:
        raise HTTPException(503, 'Aggiungi RESEND_API_KEY nelle variabili Render.')
    try:
        recipient = str(TypeAdapter(EmailStr).validate_python(os.environ.get('SCOUTLY_TEST_EMAIL', '')))
    except ValidationError:
        raise HTTPException(503, 'Aggiungi SCOUTLY_TEST_EMAIL nelle variabili Render con la email del tuo account Resend.') from None
    return api_key, recipient


def send_test_email(request_id):
    api_key, recipient = mail_configuration()
    # Destinatario e contenuto fissati dal server: nessun invio a recapiti nel form.
    with httpx.Client(timeout=30) as client:
        response = client.post('https://api.resend.com/emails', headers={
            'Authorization': 'Bearer ' + api_key,
            'Idempotency-Key': 'scoutly-email-test/v1/' + request_id,
        }, json={
            'from': 'Scoutly test <onboarding@resend.dev>',
            'to': [recipient],
            'subject': '[Scoutly][prima-di-pubblicare] TEST TECNICO SCOUTLY — Collegamento email',
            'text': 'TEST TECNICO SCOUTLY\n\nIl collegamento Python → Resend è stato attivato per questa prova.\n'
                    'Codice richiesta simulata: ' + request_id + '\n\n'
                    'Questo messaggio non contiene una bozza AI e non è una richiesta di consulenza.\n'
                    'Le risposte automatiche ai proprietari restano disattivate.\n',
        })
        response.raise_for_status()
        provider_id = response.json().get('id')
        if not isinstance(provider_id, str) or not provider_id:
            raise RuntimeError('Risposta provider senza identificativo')
        return provider_id


class Payload(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)
    idempotency_key: UUID
    form_id: Literal['prima-di-pubblicare']
    form_version: Literal[2]
    workflow_id: Literal['annuncio-da-foto-e-descrizione']
    email: EmailStr
    name: str | None = Field(default=None, max_length=80)
    phone: str | None = Field(default=None, max_length=30)
    description: str = Field(min_length=20, max_length=4000)
    city: Literal['Milano Comune', 'Altro Comune']
    intent: Literal['Vendere', 'Affittare']
    role: Literal['Proprietario', 'Autorizzato dal proprietario', 'Altro']
    publication: Literal['Annuncio non ancora preparato', 'Bozza in preparazione', 'Annuncio già online']
    service_requested: Literal[True]
    consultation_requested: bool = False


class SupabaseStore:
    def __init__(self):
        url = os.environ.get('SUPABASE_URL', '').rstrip('/')
        key = os.environ.get('SUPABASE_SECRET_KEY', '')
        if not url.startswith('https://') or not key:
            raise HTTPException(503, 'Archivio non configurato.')
        self.client = httpx.Client(base_url=url, headers={'apikey': key}, timeout=30)

    def close(self):
        self.client.close()

    def lookup(self, key):
        response = self.client.get('/rest/v1/scoutly_requests', params={
            'idempotency_key': f'eq.{key}', 'select': 'id,payload_hash,status', 'limit': '1'})
        response.raise_for_status()
        rows = response.json()
        return rows[0] if rows else None

    def ensure_public_capacity(self):
        response = self.client.get('/rest/v1/scoutly_requests',
            params={'select': 'id', 'limit': '0'}, headers={'Prefer': 'count=exact'})
        response.raise_for_status()
        total = response.headers.get('Content-Range', '').rsplit('/', 1)[-1]
        if not total.isdigit():
            raise RuntimeError('Capienza archivio non verificabile')
        if int(total) >= MAX_RECORDS:
            raise HTTPException(429, 'La fase di prova ha raggiunto il limite di richieste. Riprova più tardi.')

    def insert(self, row):
        response = self.client.post('/rest/v1/scoutly_requests', json=row)
        if response.status_code == 409:
            return False
        response.raise_for_status()
        return True

    def upload(self, path, data, content_type):
        response = self.client.post('/storage/v1/object/scoutly-photos/' + path,
                                    content=data, headers={'Content-Type': content_type, 'x-upsert': 'false'})
        response.raise_for_status()

    def finish(self, key, photo_rows):
        if photo_rows:
            self.client.post('/rest/v1/scoutly_photos', json=photo_rows).raise_for_status()
        response = self.client.patch('/rest/v1/scoutly_requests',
            params={'id': f'eq.{key}', 'status': 'eq.uploading'},
            headers={'Prefer': 'return=representation'}, json={'status': 'received'})
        response.raise_for_status()
        if len(response.json()) != 1:
            raise RuntimeError('Stato ricezione non confermato')

    def mail_request(self, key):
        response = self.client.get('/rest/v1/scoutly_requests', params={
            'id': f'eq.{key}', 'select': 'id,status,form_id,form_version,workflow_id,email,description,answers', 'limit': '1'})
        response.raise_for_status()
        rows = response.json()
        return rows[0] if rows else None

    def claim_mail(self, key, answers):
        response = self.client.patch('/rest/v1/scoutly_requests', params={
            'id': f'eq.{key}', 'status': 'eq.received', 'answers->mail_test': 'is.null'},
            headers={'Prefer': 'return=representation'}, json={'answers': answers})
        response.raise_for_status()
        return len(response.json()) == 1

    def record_mail(self, key, answers):
        response = self.client.patch('/rest/v1/scoutly_requests', params={
            'id': f'eq.{key}', 'answers->mail_test->>status': 'eq.sending'},
            headers={'Prefer': 'return=representation'}, json={'answers': answers})
        response.raise_for_status()
        if len(response.json()) != 1:
            raise RuntimeError('Registrazione esito non confermata')

    def notice_request(self, key):
        response = self.client.get('/rest/v1/scoutly_requests', params={
            'id': f'eq.{key}', 'select': 'id,status,form_id,form_version,workflow_id,email,name,phone,description,answers,service_requested,consultation_requested', 'limit': '1'})
        response.raise_for_status()
        rows = response.json()
        return rows[0] if rows else None

    def notice_photos(self, key):
        response = self.client.get('/rest/v1/scoutly_photos', params={
            'request_id': f'eq.{key}', 'select': 'position,object_path,content_type,size_bytes', 'order': 'position.asc'})
        response.raise_for_status()
        rows = response.json()
        if len(rows) > 8 or len({r['position'] for r in rows}) != len(rows):
            raise RuntimeError('Elenco foto da verificare')
        files, total = [], 0
        for row in rows:
            extension = {'image/png': 'png', 'image/jpeg': 'jpg'}.get(row['content_type'])
            if extension is None or not 1 <= row['position'] <= 8 or row['object_path'] != f"{key}/{row['position']}.{extension}":
                raise RuntimeError('Percorso foto da verificare')
            data = bytearray()
            with self.client.stream('GET', '/storage/v1/object/authenticated/scoutly-photos/' + row['object_path']) as download:
                download.raise_for_status()
                for chunk in download.iter_bytes():
                    data.extend(chunk)
                    if total + len(data) > MAX_BYTES:
                        raise RuntimeError('Dimensioni foto da verificare')
            if len(data) != row['size_bytes']:
                raise RuntimeError('Foto incompleta')
            check_photo(data, row['content_type'])
            total += len(data)
            files.append((row['position'], row['content_type'], bytes(data)))
        return files

    def claim_notice(self, key, answers, missing):
        condition = {'answers->email_notice': 'is.null'} if missing else {'answers->email_notice->>status': 'eq.pending'}
        response = self.client.patch('/rest/v1/scoutly_requests', params={
            'id': f'eq.{key}', 'status': 'eq.received', **condition},
            headers={'Prefer': 'return=representation'}, json={'answers': answers})
        response.raise_for_status()
        return len(response.json()) == 1

    def record_notice(self, key, answers):
        response = self.client.patch('/rest/v1/scoutly_requests', params={
            'id': f'eq.{key}', 'answers->email_notice->>status': 'eq.sending'},
            headers={'Prefer': 'return=representation'}, json={'answers': answers})
        response.raise_for_status()
        if len(response.json()) != 1:
            raise RuntimeError('Esito notifica non registrato')


def accept_test_email(key, store, sender):
    row = store.mail_request(key)
    if row is None:
        raise HTTPException(404, 'Prima salva la prova con otto immagini.')
    if (row['status'] != 'received' or row['email'] != 'prova@example.com'
            or row['form_id'] != 'prima-di-pubblicare' or row['form_version'] != 2
            or row['workflow_id'] != 'annuncio-da-foto-e-descrizione'
            or not row['description'].startswith('TEST TECNICO SCOUTLY.')):
        raise HTTPException(409, 'Email di prova consentita solo per una richiesta sintetica ricevuta.')
    if not isinstance(row['answers'], dict):
        raise HTTPException(409, 'Dati della prova da verificare.')
    answers = dict(row['answers'])
    previous = answers.get('mail_test')
    if previous is not None:
        if isinstance(previous, dict) and previous.get('status') == 'accepted':
            return {'request_id': key, 'status': 'accepted', 'duplicate': True}
        raise HTTPException(409, 'Invio già tentato o in corso. Controlla Resend → Emails prima di riprovare; non creare un nuovo codice.')
    answers['mail_test'] = {'status': 'sending', 'attempted_at': datetime.now(timezone.utc).isoformat()}
    if not store.claim_mail(key, answers):
        raise HTTPException(409, 'Un invio risulta già in corso. Verifica il registro della prova.')
    try:
        provider_id = sender(key)
    except (httpx.HTTPStatusError, httpx.RequestError, RuntimeError, ValueError) as exc:
        # Un errore di rete può seguire l'invio: registrare l'incertezza e non ritentare.
        known_rejection = isinstance(exc, httpx.HTTPStatusError) and exc.response.status_code in (400, 401, 403, 404, 405, 413, 422, 429)
        status = 'rejected' if known_rejection else 'unknown'
        answers['mail_test'] = {**answers['mail_test'], 'status': status}
        store.record_mail(key, answers)
        if status == 'rejected':
            raise HTTPException(502, 'Resend ha rifiutato la prova. Controlla Resend → Emails e la chiave API; il dominio di test può inviare solo alla email del tuo account Resend.') from None
        raise HTTPException(503, 'Esito email incerto. Controlla Resend → Emails e la casella prima di qualsiasi nuovo invio.') from None
    answers['mail_test'] = {**answers['mail_test'], 'status': 'accepted', 'provider_id': provider_id}
    store.record_mail(key, answers)
    return {'request_id': key, 'status': 'accepted', 'duplicate': False}


def check_photo(data, declared_type):
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('error', Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(data)) as image:
                format_name = image.format
                image.verify()
        actual_type = {'JPEG': 'image/jpeg', 'PNG': 'image/png'}.get(format_name)
        if actual_type is None or actual_type != declared_type:
            raise ValueError('Formato non corrispondente')
        return 'jpg' if format_name == 'JPEG' else 'png'
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError,
            Image.DecompressionBombWarning):
        raise HTTPException(422, 'Una foto non è un JPG o PNG valido.') from None


def accept(payload, photos, store, public=False):
    key = str(payload.idempotency_key)
    values = payload.model_dump(mode='json')
    fingerprint = hashlib.sha256(json.dumps({
        'payload': values, 'photos': [hashlib.sha256(data).hexdigest() for data, _, _ in photos]
    }, sort_keys=True, ensure_ascii=False).encode()).hexdigest()

    def previous_receipt(row):
        if row['payload_hash'] != fingerprint:
            raise HTTPException(409, 'Codice già usato per materiale diverso.')
        if row['status'] not in ('received', 'processing', 'review', 'completed'):
            raise HTTPException(409, 'Richiesta incompleta o in corso: serve verifica, non reinviare con un nuovo codice.')
        return {'request_id': row['id'], 'status': 'received', 'duplicate': True}

    previous = store.lookup(key)
    if previous:
        return previous_receipt(previous)
    if public:
        store.ensure_public_capacity()
    row = {k: values[k] for k in ('form_id', 'form_version', 'workflow_id', 'email',
           'name', 'phone', 'description', 'service_requested', 'consultation_requested')}
    row.update(id=key, idempotency_key=key, payload_hash=fingerprint,
               answers={k: values[k] for k in ('city', 'intent', 'role', 'publication')})
    if public:
        row['answers']['email_notice'] = {'status': 'pending'}
    if not store.insert(row):
        previous = store.lookup(key)
        if not previous:
            raise HTTPException(503, 'Esito da verificare. Conserva il codice richiesta.')
        return previous_receipt(previous)
    photo_rows = []
    for position, (data, content_type, extension) in enumerate(photos, 1):
        path = f'{key}/{position}.{extension}'
        store.upload(path, data, content_type)
        photo_rows.append({'request_id': key, 'position': position, 'object_path': path,
                           'content_type': content_type, 'size_bytes': len(data)})
    store.finish(key, photo_rows)
    return {'request_id': key, 'status': 'received', 'duplicate': False}


class TestGate:
    """Autorizza prima di leggere il multipart e limita anche i body senza Content-Length."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        paths = ('/requests', '/test-email', '/notify-request', '/notifications/verify')
        if scope['type'] != 'http' or scope['path'] not in paths:
            return await self.app(scope, receive, send)
        token = os.environ.get('SCOUTLY_TEST_TOKEN', '')
        headers = dict(scope['headers'])
        supplied = headers.get(b'x-scoutly-test-token', b'').decode('latin-1')
        public_verify = scope['path'] == '/notifications/verify'
        if not public_verify and len(token) < 32:
            return await JSONResponse({'detail': 'Ricevitore di prova non configurato.'}, 503)(scope, receive, send)
        if not public_verify and not secrets.compare_digest(token.encode(), supplied.encode()):
            return await JSONResponse({'detail': 'Accesso riservato alle prove.'}, 401)(scope, receive, send)
        body = bytearray()
        while True:
            message = await receive()
            if message['type'] == 'http.disconnect':
                return
            body.extend(message.get('body', b''))
            limit = 32_000 if public_verify else (MAX_BYTES + 100_000 if scope['path'] == '/requests' else 4000)
            if len(body) > limit:
                return await JSONResponse({'detail': 'Richiesta troppo grande.'}, 413)(scope, receive, send)
            if not message.get('more_body', False):
                break
        delivered = False

        async def bounded_receive():
            nonlocal delivered
            if not delivered:
                delivered = True
                return {'type': 'http.request', 'body': bytes(body), 'more_body': False}
            return await receive()
        await self.app(scope, bounded_receive, send)


def create_app(store_factory=SupabaseStore, email_sender=send_test_email, notice_sender=None):
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
    app.add_middleware(TestGate)
    app.add_middleware(PublicGate)
    app.add_middleware(CORSMiddleware, allow_origins=[ORIGIN], allow_credentials=False,
                       allow_methods=['GET', 'POST'], allow_headers=['Content-Type', 'X-Scoutly-Challenge'])

    @app.exception_handler(RequestValidationError)
    async def invalid_request(request, exc):
        return JSONResponse({'detail': 'Formato richiesta non valido.'}, status_code=422)

    @app.get('/health')
    def health():
        return {'status': 'ok', 'mode': 'limited-public-test' if enabled() else 'private-test', 'email_enabled': False,
                'email_test_configured': bool(os.environ.get('RESEND_API_KEY') and os.environ.get('SCOUTLY_TEST_EMAIL')),
                'public_intake_enabled': enabled(), 'public_protocol': 1, 'gmail_notice_protocol': 1}

    @app.post('/notifications/verify')
    def verify_notification(body: SignedNotice):
        valid = verify(body)
        result = {'valid': valid}
        if valid:
            result.update(request_id=str(body.envelope.request_id), form_id=body.envelope.form_id,
                          form_version=body.envelope.form_version)
        return JSONResponse(result, headers={'Cache-Control': 'no-store'})

    def emit_notice(key):
        api_key, recipient = mail_configuration()
        store = store_factory()
        try:
            kwargs = {} if notice_sender is None else {'sender': notice_sender}
            return notify_saved(key, store, api_key, recipient, **kwargs)
        except (httpx.HTTPError, RuntimeError, ValueError, KeyError):
            raise HTTPException(503, 'Notifica da verificare in Supabase/Resend. Nessun retry automatico.') from None
        finally:
            store.close()

    @app.post('/notify-request')
    def notify_request(body: MailTestRequest):
        return emit_notice(str(body.request_id))

    @app.get('/public/config')
    def public_config(request: Request):
        if request.headers.get('origin') != ORIGIN:
            raise HTTPException(403, 'Apri il modulo dal sito Scoutly.')
        if not enabled():
            raise HTTPException(503, 'Invio temporaneamente non disponibile. Riprova più tardi.')
        return JSONResponse({'protocol': 1, 'challenge': challenge(), 'min_age_seconds': 3,
                             'max_photos': 8, 'max_bytes': MAX_BYTES}, headers={'Cache-Control': 'no-store'})

    @app.post('/test-email')
    def test_email(body: MailTestRequest):
        mail_configuration()
        store = store_factory()
        try:
            return accept_test_email(str(body.request_id), store, email_sender)
        except (httpx.HTTPError, RuntimeError, ValueError):
            raise HTTPException(503, 'Esito da verificare nel registro Supabase e in Resend → Emails. Nessun retry automatico.') from None
        finally:
            store.close()

    @app.get('/test')
    def test_page():
        return Response(Path(__file__).with_name('test.html').read_text(), media_type='text/html', headers={
            'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
            'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"})

    @app.get('/test.js')
    def test_script():
        return Response(Path(__file__).with_name('test.js').read_text(), media_type='text/javascript',
                        headers={'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'})

    @app.post('/requests', status_code=201)
    def receive_request(payload: str = Form(..., max_length=20_000),
                        photos: list[UploadFile] = File(default=[])):
        return save_submission(payload, photos, False)

    @app.post('/public/requests', status_code=201)
    def public_request(payload: str = Form(..., max_length=20_000),
                       photos: list[UploadFile] = File(default=[]), website: str = Form(default='', max_length=80)):
        if website:
            raise HTTPException(422, 'Controllo invio non superato. Aggiorna il modulo e riprova.')
        receipt = save_submission(payload, photos, True)
        try:
            receipt['email_notice'] = emit_notice(receipt['request_id'])['status']
        except HTTPException:
            # La richiesta salvata resta una ricevuta valida anche se la notifica fallisce.
            receipt['email_notice'] = 'review'
        return receipt

    def save_submission(payload, photos, public):
        try:
            parsed = Payload.model_validate_json(payload)
        except ValidationError:
            raise HTTPException(422, 'Dati incompleti o percorso form non riconosciuto.') from None
        if len(photos) > 8:
            raise HTTPException(422, 'Massimo otto foto.')
        validated = []
        total = 0
        for photo in photos:
            data = photo.file.read(MAX_BYTES + 1)
            total += len(data)
            if total > MAX_BYTES:
                raise HTTPException(413, 'Massimo 8 MB complessivi di foto.')
            extension = check_photo(data, photo.content_type)
            validated.append((data, photo.content_type, extension))
        store = store_factory()
        try:
            return accept(parsed, validated, store, public=public)
        except (httpx.HTTPError, RuntimeError, ValueError):
            # Un timeout può seguire una scrittura riuscita: nessun retry o cancellazione ciechi.
            raise HTTPException(503, 'Esito da verificare. Conserva il codice richiesta e non crearne uno nuovo.') from None
        finally:
            store.close()
    return app


app = create_app()

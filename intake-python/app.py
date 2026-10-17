"""Ricevitore per prove riservate; nessuna generazione AI o email implicita."""
import hashlib
import io
import json
import os
import secrets
import warnings
from pathlib import Path
from typing import Literal
from uuid import UUID

import httpx
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.exceptions import RequestValidationError
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, ConfigDict, EmailStr, Field, ValidationError
from starlette.responses import JSONResponse, Response

MAX_BYTES = 8_000_000
Image.MAX_IMAGE_PIXELS = 25_000_000


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


def accept(payload, photos, store):
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
    row = {k: values[k] for k in ('form_id', 'form_version', 'workflow_id', 'email',
           'name', 'phone', 'description', 'service_requested', 'consultation_requested')}
    row.update(id=key, idempotency_key=key, payload_hash=fingerprint,
               answers={k: values[k] for k in ('city', 'intent', 'role', 'publication')})
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
        if scope['type'] != 'http' or scope['path'] != '/requests':
            return await self.app(scope, receive, send)
        token = os.environ.get('SCOUTLY_TEST_TOKEN', '')
        headers = dict(scope['headers'])
        supplied = headers.get(b'x-scoutly-test-token', b'').decode('latin-1')
        if len(token) < 32:
            return await JSONResponse({'detail': 'Ricevitore di prova non configurato.'}, 503)(scope, receive, send)
        if not secrets.compare_digest(token.encode(), supplied.encode()):
            return await JSONResponse({'detail': 'Accesso riservato alle prove.'}, 401)(scope, receive, send)
        body = bytearray()
        while True:
            message = await receive()
            if message['type'] == 'http.disconnect':
                return
            body.extend(message.get('body', b''))
            if len(body) > MAX_BYTES + 100_000:
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


def create_app(store_factory=SupabaseStore):
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
    app.add_middleware(TestGate)

    @app.exception_handler(RequestValidationError)
    async def invalid_request(request, exc):
        return JSONResponse({'detail': 'Formato richiesta non valido.'}, status_code=422)

    @app.get('/health')
    def health():
        return {'status': 'ok', 'mode': 'private-test', 'email_enabled': False}

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
            return accept(parsed, validated, store)
        except (httpx.HTTPError, RuntimeError):
            # Un timeout può seguire una scrittura riuscita: nessun retry o cancellazione ciechi.
            raise HTTPException(503, 'Esito da verificare. Conserva il codice richiesta e non crearne uno nuovo.') from None
        finally:
            store.close()
    return app


app = create_app()

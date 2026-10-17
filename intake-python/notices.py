"""Notifiche firmate verso la casella operativa; nessuna chiamata AI esterna."""
import base64
import hashlib
import hmac
import json
import os
from html import escape
from datetime import datetime, timezone
from typing import Literal
from uuid import UUID

import httpx
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, Field

SUBJECT = '[Scoutly][prima-di-pubblicare] Prima di pubblicare — Richiesta bozza annuncio'
MARKER = 'SCOUTLY_SIGNED_NOTIFICATION_V1'


class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid')


class Photo(Strict):
    position: int = Field(ge=1, le=8)
    filename: str = Field(pattern=r'^foto-[1-8]\.(png|jpg)$')
    sha256: str = Field(pattern=r'^[0-9a-f]{64}$')
    size_bytes: int = Field(gt=0, le=8_000_000)
    content_type: Literal['image/jpeg', 'image/png']


class Answers(Strict):
    city: Literal['Milano Comune', 'Altro Comune']
    intent: Literal['Vendere', 'Affittare']
    role: Literal['Proprietario', 'Autorizzato dal proprietario', 'Altro']
    publication: Literal['Annuncio non ancora preparato', 'Bozza in preparazione', 'Annuncio già online']


class Envelope(Strict):
    notification_schema: Literal['scoutly-gmail-v1']
    request_id: UUID
    form_id: Literal['prima-di-pubblicare']
    form_name: Literal['Prima di pubblicare']
    form_version: Literal[2]
    workflow_id: Literal['annuncio-da-foto-e-descrizione']
    email: EmailStr
    name: str | None = Field(max_length=80)
    phone: str | None = Field(max_length=30)
    description: str = Field(min_length=20, max_length=4000)
    answers: Answers
    service_requested: Literal[True]
    consultation_requested: bool
    photos: list[Photo] = Field(max_length=8)


class SignedNotice(Strict):
    envelope: Envelope
    signature: str = Field(pattern=r'^[0-9a-f]{64}$')


def canonical(envelope):
    return json.dumps(envelope.model_dump(mode='json'), ensure_ascii=False,
                      sort_keys=True, separators=(',', ':')).encode()


def signature(envelope):
    secret = os.environ.get('SCOUTLY_TEST_TOKEN', '')
    if len(secret) < 32:
        raise HTTPException(503, 'Firma delle notifiche non configurata.')
    return hmac.new(secret.encode(), b'scoutly-gmail-v1\0' + canonical(envelope), hashlib.sha256).hexdigest()


def verify(notice):
    return hmac.compare_digest(signature(notice.envelope), notice.signature)


def make_envelope(row, files):
    photo_info = []
    attachments = []
    for position, content_type, data in files:
        filename = f'foto-{position}.' + ('png' if content_type == 'image/png' else 'jpg')
        photo_info.append(dict(position=position, filename=filename,
            sha256=hashlib.sha256(data).hexdigest(), size_bytes=len(data), content_type=content_type))
        attachments.append({'filename': filename, 'content': base64.b64encode(data).decode()})
    envelope = Envelope.model_validate(dict(notification_schema='scoutly-gmail-v1',
        request_id=row['id'], form_id=row['form_id'], form_name='Prima di pubblicare',
        form_version=row['form_version'], workflow_id=row['workflow_id'], email=row['email'],
        name=row['name'], phone=row['phone'], description=row['description'],
        answers={key: row['answers'][key] for key in ('city', 'intent', 'role', 'publication')},
        service_requested=row['service_requested'], consultation_requested=row['consultation_requested'],
        photos=photo_info))
    return envelope, attachments


def render_html(envelope):
    """Vista operativa: i dati firmati restano nella parte MIME text/plain."""
    def safe(value):
        return escape(str(value))

    def row(label, value):
        return ('<tr><th align="left" valign="top" style="padding:10px 12px 10px 0;'
                'font-weight:400;color:#66736c;width:35%">' + safe(label) + '</th>'
                '<td valign="top" style="padding:10px 0;overflow-wrap:anywhere">'
                + safe(value) + '</td></tr>')

    contact = ''.join(row(label, value) for label, value in [
        ('Nome', envelope.name or 'Non indicato'), ('Email', envelope.email),
        ('Telefono', envelope.phone or 'Non indicato'),
    ])
    details = ''.join(row(label, value) for label, value in [
        ('Comune', envelope.answers.city), ('Obiettivo', envelope.answers.intent),
        ('Ruolo dichiarato', envelope.answers.role), ('Pubblicazione', envelope.answers.publication),
    ])
    consultation = 'Richiesta' if envelope.consultation_requested else 'Non richiesta'
    photo_count = len(envelope.photos)
    photo_text = (f'{photo_count} foto allegate' if photo_count else 'Nessuna foto allegata')
    photo_names = ' · '.join(safe(p.filename) for p in envelope.photos)
    description = safe(envelope.description).replace('\n', '<br>')
    return f'''<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nuova richiesta Scoutly</title></head>
<body style="margin:0;padding:24px 12px;background:#f3f1e9;color:#193d31;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dedfd7;border-radius:16px">
<tr><td style="padding:28px 28px 24px;background:#193d31;border-radius:16px 16px 0 0;color:#ffffff">
<p style="margin:0 0 20px;font-family:Georgia,serif;font-size:30px">scoutly.</p>
<p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase">Nuova richiesta dal form</p>
<h1 style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:400">{safe(envelope.form_name)}</h1>
</td></tr><tr><td style="padding:28px">
<h2 style="margin:0 0 8px;font-size:19px">Chi ti ha scritto</h2>
<table width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;line-height:1.5">{contact}</table>
<div style="margin:22px 0;padding:16px;background:#eef4ef;border-left:4px solid #3f6d51">
<strong>Consulenza con un agente: {consultation}</strong>
<p style="margin:4px 0 0;font-size:14px">La richiesta della bozza è confermata. Il ricontatto resta facoltativo.</p></div>
<h2 style="margin:28px 0 8px;font-size:19px">L'immobile e il percorso</h2>
<table width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;line-height:1.5">{details}</table>
<h2 style="margin:28px 0 12px;font-size:19px">Descrizione inviata</h2>
<div style="color:#283e34;overflow-wrap:anywhere">{description}</div>
<h2 style="margin:28px 0 8px;font-size:19px">Foto</h2>
<p style="margin:0">{photo_text}</p><p style="margin:4px 0 0;font-size:13px;color:#66736c;overflow-wrap:anywhere">{photo_names}</p>
<div style="margin:28px 0 0;padding-top:20px;border-top:1px solid #dedfd7;font-size:13px;color:#66736c">
<p style="margin:0 0 8px">Materiale da verificare prima di preparare la bozza. Questa email non conferma che l'analisi sia già avvenuta.</p>
<p style="margin:0">Form: {safe(envelope.form_id)} · versione {envelope.form_version}<br>
Riferimento richiesta: <span style="overflow-wrap:anywhere">{safe(envelope.request_id)}</span></p>
</div></td></tr></table></td></tr></table></body></html>'''


def send(envelope, attachments, api_key, recipient):
    signed = SignedNotice(envelope=envelope, signature=signature(envelope))
    body = MARKER + '\n' + signed.model_dump_json() + '\n'
    with httpx.Client(timeout=30) as client:
        response = client.post('https://api.resend.com/emails', headers={
            'Authorization': 'Bearer ' + api_key,
            'Idempotency-Key': 'scoutly-gmail-notice/v1/' + str(envelope.request_id),
        }, json={'from': 'Scoutly richieste <onboarding@resend.dev>', 'to': [recipient],
                 'reply_to': str(envelope.email), 'subject': SUBJECT, 'text': body,
                 'html': render_html(envelope),
                 'attachments': attachments})
        response.raise_for_status()
        provider_id = response.json().get('id')
        if not isinstance(provider_id, str) or not provider_id:
            raise RuntimeError('Risposta provider non verificabile')
        return provider_id


def notify_saved(key, store, api_key, recipient, sender=send):
    row = store.notice_request(key)
    if row is None or row['status'] != 'received':
        raise HTTPException(409, 'Serve una richiesta completamente ricevuta.')
    answers = dict(row['answers'])
    previous = answers.get('email_notice')
    if previous is not None and not isinstance(previous, dict):
        raise HTTPException(409, 'Registro della notifica da verificare.')
    if previous is not None and previous.get('status') == 'accepted':
        return {'status': 'accepted', 'duplicate': True}
    if previous is not None and previous.get('status') != 'pending':
        raise HTTPException(409, 'Notifica già tentata o in corso: verifica Resend e Gmail prima di riprovare.')
    files = store.notice_photos(key)
    envelope, attachments = make_envelope(row, files)
    # Firmare prima del claim, così una configurazione mancante non blocca il record.
    signature(envelope)
    answers['email_notice'] = {'status': 'sending', 'attempted_at': datetime.now(timezone.utc).isoformat()}
    if not store.claim_notice(key, answers, missing=previous is None):
        raise HTTPException(409, 'Un tentativo di notifica risulta già in corso.')
    try:
        provider_id = sender(envelope, attachments, api_key, recipient)
    except (httpx.HTTPError, RuntimeError, ValueError) as exc:
        rejected = isinstance(exc, httpx.HTTPStatusError) and exc.response.status_code in (400, 401, 403, 404, 405, 413, 422, 429)
        answers['email_notice'] = {**answers['email_notice'], 'status': 'rejected' if rejected else 'unknown'}
        store.record_notice(key, answers)
        raise HTTPException(503, 'Notifica non confermata: verifica Resend e Gmail. Nessun nuovo invio automatico.') from None
    answers['email_notice'] = {**answers['email_notice'], 'status': 'accepted', 'provider_id': provider_id}
    store.record_notice(key, answers)
    return {'status': 'accepted', 'duplicate': False}

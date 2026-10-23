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
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator
from form_routes import ROUTES, check_route
from municipalities import check_municipality

SUBJECT = '[Scoutly][prima-di-pubblicare] Prima di pubblicare — Richiesta bozza annuncio'
MARKER = 'SCOUTLY_SIGNED_NOTIFICATION_V1'


class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid')


class Photo(Strict):
    position: int = Field(ge=1, le=10)
    filename: str = Field(pattern=r'^(foto-(?:[1-9]|10)|planimetria-catastale)\.(png|jpg)$')
    sha256: str = Field(pattern=r'^[0-9a-f]{64}$')
    size_bytes: int = Field(gt=0, le=8_000_000)
    content_type: Literal['image/jpeg', 'image/png']


class Answers(Strict):
    city: Literal['Milano Comune', 'Altro Comune']
    intent: Literal['Vendere', 'Affittare']
    role: Literal['Proprietario', 'Autorizzato dal proprietario', 'Altro']
    publication: Literal['Annuncio non ancora preparato', 'Bozza in preparazione', 'Annuncio già online']


class RenovationAnswers(Answers):
    target_price: int = Field(strict=True, gt=0, le=100_000_000)
    area_sqm: float = Field(gt=0, le=5000)
    zone: str = Field(min_length=2, max_length=120)
    timeframe: Literal['Entro 3 mesi', 'Tra 3 e 6 mesi', 'Oltre 6 mesi', 'Sto valutando']


class RenovationPlanAnswers(RenovationAnswers):
    floor_plan_position: int = Field(strict=True, ge=2, le=10)


class MunicipalAnswers(RenovationAnswers):
    municipality_code: str = Field(pattern=r'^\d{6}$')
    municipality_name: str = Field(min_length=2, max_length=180)


class MunicipalPlanAnswers(RenovationPlanAnswers):
    municipality_code: str = Field(pattern=r'^\d{6}$')
    municipality_name: str = Field(min_length=2, max_length=180)


class ConsultationAnswers(Strict):
    municipality_name: str = Field(min_length=2, max_length=120)
    consultation_topic: Literal['Vendita', 'Affitto', 'Presentazione dell’annuncio', 'Altro']


class Envelope(Strict):
    notification_schema: Literal['scoutly-gmail-v1']
    request_id: UUID
    form_id: Literal['prima-di-pubblicare', 'ristrutturare-o-vendere', 'consulenza']
    form_name: Literal['Prima di pubblicare', 'Ristrutturare o vendere così?', 'Consulenza gratuita']
    form_version: Literal[1, 2]
    workflow_id: Literal['annuncio-da-foto-e-descrizione', 'confronto-ristrutturare-o-vendere', 'richiesta-consulenza-diretta']
    email: EmailStr
    name: str | None = Field(max_length=80)
    phone: str | None = Field(max_length=30)
    description: str = Field(max_length=4000)
    answers: Answers | RenovationAnswers | RenovationPlanAnswers | MunicipalAnswers | MunicipalPlanAnswers | ConsultationAnswers
    service_requested: Literal[True]
    consultation_requested: bool
    photos: list[Photo] = Field(max_length=10)

    @model_validator(mode='after')
    def known_route(self):
        route = check_route(self.form_id, self.form_version, self.workflow_id)
        if self.form_name != route['form_name']:
            raise ValueError('Nome form discordante')
        if self.form_id == 'consulenza':
            if (not isinstance(self.answers, ConsultationAnswers) or self.photos
                    or not self.consultation_requested or not self.name or not self.name.strip()
                    or len(self.description) > 1000):
                raise ValueError('Richiesta consulenza non valida')
            return self
        if isinstance(self.answers, ConsultationAnswers) or len(self.description) < 20:
            raise ValueError('Dati non coerenti con il percorso')
        renovation = self.form_id == 'ristrutturare-o-vendere'
        if renovation != isinstance(self.answers, RenovationAnswers):
            raise ValueError('Dati non coerenti con il percorso')
        if renovation and (self.answers.intent != 'Vendere' or not self.photos):
            raise ValueError('Servono foto e finalità vendita')
        plan_position = getattr(self.answers, 'floor_plan_position', None)
        if getattr(self.answers, 'municipality_code', None) is not None:
            check_municipality(self.answers.municipality_code, self.answers.city, self.answers.municipality_name)
        plans = [p for p in self.photos if p.filename.startswith('planimetria-catastale.')]
        if plan_position is not None:
            if (len(plans) != 1 or plans[0].position != plan_position
                    or plan_position != len(self.photos) or len(self.photos) < 2):
                raise ValueError('Planimetria discordante')
        elif plans:
            raise ValueError('Planimetria senza metadati')
        return self


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
        prefix = ('planimetria-catastale' if row['answers'].get('floor_plan_position') == position else f'foto-{position}')
        filename = prefix + '.' + ('png' if content_type == 'image/png' else 'jpg')
        photo_info.append(dict(position=position, filename=filename,
            sha256=hashlib.sha256(data).hexdigest(), size_bytes=len(data), content_type=content_type))
        attachments.append({'filename': filename, 'content': base64.b64encode(data).decode()})
    route = check_route(row['form_id'], row['form_version'], row['workflow_id'])
    answer_keys = (('municipality_name', 'consultation_topic') if row['form_id'] == 'consulenza' else ('city', 'intent', 'role', 'publication'))
    if row['form_id'] == 'ristrutturare-o-vendere':
        answer_keys += ('target_price', 'area_sqm', 'zone', 'timeframe')
        if row['answers'].get('floor_plan_position') is not None:
            answer_keys += ('floor_plan_position',)
        if row['answers'].get('municipality_code') is not None:
            answer_keys += ('municipality_code', 'municipality_name')
    envelope = Envelope.model_validate(dict(notification_schema='scoutly-gmail-v1',
        request_id=row['id'], form_id=row['form_id'], form_name=route['form_name'],
        form_version=row['form_version'], workflow_id=row['workflow_id'], email=row['email'],
        name=row['name'], phone=row['phone'], description=row['description'],
        answers={key: row['answers'][key] for key in answer_keys},
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

    if envelope.form_id == 'consulenza':
        details = ''.join(row(label, value) for label, value in [
            ('Nome', envelope.name), ('Email', envelope.email),
            ('Comune dichiarato', envelope.answers.municipality_name),
            ('Argomento', envelope.answers.consultation_topic),
            ('Telefono', envelope.phone or 'Non indicato'),
        ])
        return ('<!doctype html><html lang="it"><body style="background:#f6f7f0;color:#19303a;font-family:Arial,sans-serif;padding:24px">'
                '<h1>Richiesta di consulenza gratuita</h1><table>' + details + '</table>'
                '<h2>Messaggio facoltativo</h2><p>' + safe(envelope.description or 'Nessun messaggio') + '</p>'
                '<p>Ricontatto richiesto esplicitamente. Gestire come consulenza: non generare una bozza di annuncio AI. '
                'Confermare disponibilità e modalità via email; nessun appuntamento già fissato.</p>'
                '<p>Riferimento: ' + safe(envelope.request_id) + '</p></body></html>')
    contact = ''.join(row(label, value) for label, value in [
        ('Nome', envelope.name or 'Non indicato'), ('Email', envelope.email),
        ('Telefono', envelope.phone or 'Non indicato'),
    ])
    details = ''.join(row(label, value) for label, value in [
        ('Comune', getattr(envelope.answers, 'municipality_name', envelope.answers.city)), ('Obiettivo', envelope.answers.intent),
        ('Ruolo dichiarato', envelope.answers.role), ('Pubblicazione', envelope.answers.publication),
    ])
    renovation = envelope.form_id == 'ristrutturare-o-vendere'
    if renovation:
        details += ''.join(row(label, value) for label, value in [
            ('Zona', envelope.answers.zone), ('Superficie dichiarata', f'{envelope.answers.area_sqm:g} m²'),
            ('Prezzo immaginato dal proprietario', f'€ {envelope.answers.target_price:,}'.replace(',', '.')),
            ('Tempi di vendita', envelope.answers.timeframe),
        ])
    consultation = 'Richiesta' if envelope.consultation_requested else 'Non richiesta'
    plan = next((p for p in envelope.photos if p.filename.startswith('planimetria-catastale.')), None)
    photo_count = len(envelope.photos) - bool(plan)
    photo_text = ('1 foto allegata' if photo_count == 1 else f'{photo_count} foto allegate' if photo_count else 'Nessuna foto allegata')
    photo_names = ' · '.join(safe(p.filename) for p in envelope.photos if p is not plan)
    plan_html = (f'<h2 style="margin:28px 0 8px;font-size:19px">Planimetria catastale</h2><p>Immagine separata allegata: {safe(plan.filename)}. Documento dichiarato dal richiedente; non attesta la conformità catastale.</p>' if plan else '')
    description = safe(envelope.description).replace('\n', '<br>')
    service_label = ('La richiesta di orientamento è confermata. La consulenza gratuita resta facoltativa.'
                     if renovation else 'La richiesta della bozza è confermata. Il ricontatto resta facoltativo.')
    result_label = ('un orientamento sui possibili interventi' if renovation else 'la bozza')
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
<p style="margin:4px 0 0;font-size:14px">{service_label}</p></div>
<h2 style="margin:28px 0 8px;font-size:19px">L'immobile e il percorso</h2>
<table width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;line-height:1.5">{details}</table>
<h2 style="margin:28px 0 12px;font-size:19px">Descrizione inviata</h2>
<div style="color:#283e34;overflow-wrap:anywhere">{description}</div>
<h2 style="margin:28px 0 8px;font-size:19px">Foto</h2>
<p style="margin:0">{photo_text}</p><p style="margin:4px 0 0;font-size:13px;color:#66736c;overflow-wrap:anywhere">{photo_names}</p>
{plan_html}
<div style="margin:28px 0 0;padding-top:20px;border-top:1px solid #dedfd7;font-size:13px;color:#66736c">
<p style="margin:0 0 8px">Materiale da verificare prima di preparare {result_label}. Questa email non conferma che l'analisi sia già avvenuta.</p>
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
                 'reply_to': str(envelope.email), 'subject': ROUTES[envelope.form_id]['email_subject'], 'text': body,
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

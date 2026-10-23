"""Controlli di base per una prova pubblica limitata, non un CAPTCHA."""
import asyncio
import hashlib
import hmac
import os
import secrets
import threading
import time
from collections import deque

from starlette.responses import JSONResponse

ORIGIN = 'https://scoutly-ai.com'
ORIGINS = (ORIGIN, 'https://dalet78.github.io')
MAX_BODY = 8_100_000
MAX_RECORDS = 20
MIN_AGE = 3
MAX_AGE = 1800


def enabled():
    return (os.environ.get('PUBLIC_INTAKE_ENABLED', '').lower() == 'true'
            and len(os.environ.get('SCOUTLY_TEST_TOKEN', '')) >= 32
            and os.environ.get('SUPABASE_URL', '').startswith('https://')
            and bool(os.environ.get('SUPABASE_SECRET_KEY')))


def challenge(now=None, origin=ORIGIN):
    if origin not in ORIGINS:
        raise ValueError('Origine non autorizzata')
    stamp = int(time.time() if now is None else now)
    message = f'{stamp}.{secrets.token_hex(16)}'
    secret = os.environ['SCOUTLY_TEST_TOKEN'].encode()
    signature = hmac.new(secret, ('public-v1/' + origin + '/' + message).encode(), hashlib.sha256).hexdigest()
    return message + '.' + signature


def valid_challenge(value, now=None, origin=ORIGIN):
    try:
        if origin not in ORIGINS or len(value) > 160:
            return False
        stamp, nonce, supplied = value.split('.')
        age = (time.time() if now is None else now) - int(stamp)
        if not MIN_AGE <= age <= MAX_AGE or len(nonce) != 32 or len(supplied) != 64:
            return False
        message = f'{stamp}.{nonce}'
        signature = hmac.new(os.environ['SCOUTLY_TEST_TOKEN'].encode(),
            ('public-v1/' + origin + '/' + message).encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(signature, supplied)
    except (ValueError, KeyError):
        return False


class PublicGate:
    def __init__(self, app):
        self.app = app
        self.slot = threading.Lock()
        self.attempts = deque()

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http' or scope['path'] != '/public/requests' or scope['method'] != 'POST':
            return await self.app(scope, receive, send)

        async def fail(code, detail):
            await JSONResponse({'detail': detail}, code, headers={'Cache-Control': 'no-store'})(scope, receive, send)

        if not enabled():
            return await fail(503, 'Invio temporaneamente non disponibile. Riprova più tardi.')
        headers = dict(scope['headers'])
        origin = headers.get(b'origin', b'').decode('latin-1')
        if origin not in ORIGINS:
            return await fail(403, 'Apri il modulo dal sito Scoutly.')
        if not valid_challenge(headers.get(b'x-scoutly-challenge', b'').decode('latin-1'), origin=origin):
            return await fail(403, 'Controllo invio scaduto o non valido. Aggiorna il collegamento e riprova con lo stesso codice.')
        if not self.slot.acquire(blocking=False):
            return await fail(429, 'È in corso un altro invio. Attendi un momento e riprova.')
        try:
            current = time.monotonic()
            while self.attempts and self.attempts[0] < current - 3600:
                self.attempts.popleft()
            if len(self.attempts) >= 60:
                return await fail(429, 'Limite temporaneo raggiunto. Riprova più tardi.')
            self.attempts.append(current)
            body = bytearray()
            deadline = current + 30
            try:
                while True:
                    message = await asyncio.wait_for(receive(), timeout=max(.01, deadline - time.monotonic()))
                    if message['type'] == 'http.disconnect':
                        return
                    body.extend(message.get('body', b''))
                    if len(body) > MAX_BODY:
                        return await fail(413, 'Massimo 10 immagini e 8 MB complessivi.')
                    if not message.get('more_body', False):
                        break
            except TimeoutError:
                return await fail(408, 'Caricamento interrotto. Riprova con lo stesso codice richiesta.')
            delivered = False

            async def bounded_receive():
                nonlocal delivered
                if not delivered:
                    delivered = True
                    return {'type': 'http.request', 'body': bytes(body), 'more_body': False}
                return await receive()
            await self.app(scope, bounded_receive, send)
        finally:
            self.slot.release()

"""Verifica una notifica letta da Gmail. JSON via stdin, nessuna credenziale richiesta."""
import json
import sys
import urllib.request

ENDPOINT = 'https://scoutly-k76y.onrender.com/notifications/verify'


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, file, code, message, headers, new_url):
        return None


def verify_remote(signed, opener=None):
    if not isinstance(signed, dict) or set(signed) != {'envelope', 'signature'}:
        raise ValueError('Formato notifica non valido')
    data = json.dumps(signed, ensure_ascii=False).encode()
    if len(data) > 32_000:
        raise ValueError('Notifica troppo grande')
    request = urllib.request.Request(ENDPOINT, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    if opener is None:
        opener = urllib.request.build_opener(NoRedirect())
    with opener.open(request, timeout=90) as response:
        result = json.loads(response.read(4096))
    if (result.get('valid') is not True or result.get('request_id') != signed['envelope'].get('request_id')
            or result.get('form_id') != 'prima-di-pubblicare' or result.get('form_version') != 2):
        raise ValueError('Firma o identità notifica non verificata')
    return {'verified': True, 'request_id': result['request_id'], 'form_id': result['form_id'], 'form_version': 2}


if __name__ == '__main__':
    try:
        raw = sys.stdin.buffer.read(32_001)
        if len(raw) > 32_000:
            raise ValueError('Input troppo grande')
        print(json.dumps(verify_remote(json.loads(raw))))
    except Exception:
        # Non stampare corpo, recapiti o firma in caso di errore.
        print('{"verified":false}')
        sys.exit(2)

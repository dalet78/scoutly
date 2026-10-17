from copy import deepcopy
import hashlib
import json
import io
import httpx

import pytest
from fastapi.testclient import TestClient

import app
import notices
from test_intake import payload, photo
from test_notices import setup, submit
from verify_notice import verify_remote


def renovation():
    return {**payload(), 'form_id': 'ristrutturare-o-vendere', 'form_version': 1,
            'workflow_id': 'confronto-ristrutturare-o-vendere', 'target_price': 300000,
            'area_sqm': 75, 'zone': 'Zona simulata', 'timeframe': 'Sto valutando'}


def test_second_form_gated_before_database_writes(setup, monkeypatch):
    client, store, sent, _ = setup
    assert submit(client, renovation(), [photo()]).status_code == 503
    assert not store.rows and not sent
    config = client.get('/public/config', headers={'Origin':app.ORIGIN}).json()
    assert not any(x['form_id'] == 'ristrutturare-o-vendere' for x in config['supported_forms'])


def test_renovation_storage_notification_verification_and_dedup(setup, monkeypatch):
    client, store, sent, _ = setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED', 'true')
    data = renovation()
    response = submit(client, data, [photo()])
    assert response.status_code == 201 and response.json()['email_notice'] == 'accepted'
    assert len(sent) == 1
    envelope = sent[0][0]
    assert envelope.form_name == 'Ristrutturare o vendere così?'
    assert envelope.answers.target_price == 300000
    assert store.rows[data['idempotency_key']]['answers']['zone'] == 'Zona simulata'
    signed = notices.SignedNotice(envelope=envelope, signature=notices.signature(envelope)).model_dump(mode='json')
    assert client.post('/notifications/verify', json=signed).json()['form_version'] == 1
    class Opener:
        def open(self, request, timeout):
            return io.BytesIO(json.dumps(client.post('/notifications/verify', json=json.loads(request.data)).json()).encode())
    assert verify_remote(signed, Opener())['form_version'] == 1
    signed['envelope']['answers']['target_price'] += 1
    assert client.post('/notifications/verify', json=signed).json()['valid'] is False
    assert submit(client, data, [photo()]).json()['duplicate'] is True and len(sent) == 1
    assert 'Prezzo immaginato dal proprietario' in notices.render_html(envelope)
    assert '300.000' in notices.render_html(envelope)
    captured = []
    original_client = httpx.Client
    def transport(request):
        captured.append(json.loads(request.content))
        return httpx.Response(200, json={'id':'synthetic'})
    monkeypatch.setattr(httpx, 'Client', lambda **kwargs: original_client(
        transport=httpx.MockTransport(transport), **kwargs))
    notices.send(envelope, sent[0][1], 're_synthetic', 'founder@example.com')
    assert captured[0]['subject'].startswith('[Scoutly][ristrutturare-o-vendere]')
    assert captured[0]['reply_to'] == str(envelope.email)


@pytest.mark.parametrize('field,value', [('form_version',2), ('workflow_id','annuncio-da-foto-e-descrizione'),
    ('target_price',None), ('target_price',-10), ('target_price',True), ('area_sqm',0),
    ('zone',''), ('timeframe',None), ('intent','Affittare')])
def test_invalid_second_form_does_not_write(setup, monkeypatch, field, value):
    client, store, sent, _ = setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED', 'true')
    data = renovation(); data[field] = value
    assert submit(client, data, [photo()]).status_code == 422
    assert not store.rows and not sent


def test_second_form_requires_photo(setup, monkeypatch):
    client, store, sent, _ = setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED', 'true')
    assert submit(client, renovation()).status_code == 422
    assert not store.rows and not sent


def test_first_form_keeps_legacy_hash_and_signed_schema(setup):
    client, store, sent, _ = setup
    data = payload()
    legacy_values = {**data,'name':None,'phone':None,'consultation_requested':False}
    expected = hashlib.sha256(json.dumps({'payload':legacy_values,'photos':[]},
        sort_keys=True,ensure_ascii=False).encode()).hexdigest()
    assert submit(client, data).status_code == 201
    assert store.rows[data['idempotency_key']]['payload_hash'] == expected
    assert set(sent[0][0].answers.model_dump()) == {'city','intent','role','publication'}
    data['target_price'] = 300000
    assert submit(client, data).status_code == 422

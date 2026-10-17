import json
from uuid import uuid4

import httpx
import pytest
from fastapi.testclient import TestClient

import app
import public_gate
from test_intake import FakeStore, payload, photo


@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setenv('SCOUTLY_TEST_TOKEN', 'x' * 40)
    monkeypatch.setenv('SUPABASE_URL', 'https://example.supabase.co')
    monkeypatch.setenv('SUPABASE_SECRET_KEY', 'sb_secret_synthetic')
    monkeypatch.setenv('PUBLIC_INTAKE_ENABLED', 'true')
    store = FakeStore()
    store.capacity_calls = 0

    def capacity():
        store.capacity_calls += 1
    store.ensure_public_capacity = capacity
    client = TestClient(app.create_app(lambda: store))
    return client, store


def headers():
    import time
    return {'Origin': public_gate.ORIGIN,
            'X-Scoutly-Challenge': public_gate.challenge(now=time.time()-4)}


def submit(client, data, files=None, website=''):
    return client.post('/public/requests', headers=headers(),
        data={'payload': json.dumps(data), 'website': website}, files=files or [])


def test_public_eight_photos_and_duplicate(setup):
    client, store = setup
    data = payload()
    response = submit(client, data, [photo() for _ in range(8)])
    assert response.status_code == 201
    assert response.headers['access-control-allow-origin'] == public_gate.ORIGIN
    assert len(store.uploads) == 8 and store.capacity_calls == 1
    assert submit(client, data, [photo() for _ in range(8)]).json()['duplicate'] is True
    assert len(store.uploads) == 8 and store.capacity_calls == 1


def test_public_config_and_cors(setup):
    client, _ = setup
    response = client.get('/public/config', headers={'Origin': public_gate.ORIGIN})
    assert response.status_code == 200
    assert response.json()['protocol'] == 1
    assert 'x' * 40 not in response.text
    assert response.headers['cache-control'] == 'no-store'
    assert client.get('/public/config').status_code == 403
    assert client.get('/public/config', headers={'Origin': 'https://evil.example'}).status_code == 403
    preflight = client.options('/public/requests', headers={'Origin': public_gate.ORIGIN,
        'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'x-scoutly-challenge'})
    assert preflight.status_code == 200
    assert 'access-control-allow-credentials' not in preflight.headers


def test_disabled_fails_closed(setup, monkeypatch):
    client, store = setup
    monkeypatch.delenv('PUBLIC_INTAKE_ENABLED')
    assert client.get('/public/config', headers={'Origin': public_gate.ORIGIN}).status_code == 503
    assert submit(client, payload()).status_code == 503
    assert not store.rows


def test_origin_challenge_and_honeypot_do_not_write(setup):
    client, store = setup
    data = {'payload': json.dumps(payload())}
    for hdr in [{}, {'Origin': public_gate.ORIGIN}, {**headers(), 'Origin': 'https://evil.example'},
                {**headers(), 'X-Scoutly-Challenge': public_gate.challenge()}]:
        assert client.post('/public/requests', data=data, headers=hdr).status_code == 403
    assert submit(client, payload(), website='filled by bot').status_code == 422
    assert not store.rows


def test_challenge_expiry_and_tampering(monkeypatch):
    monkeypatch.setenv('SCOUTLY_TEST_TOKEN', 'x' * 40)
    token = public_gate.challenge(now=1000)
    assert public_gate.valid_challenge(token, now=1004)
    assert not public_gate.valid_challenge(token, now=1001)
    assert not public_gate.valid_challenge(token, now=3000)
    assert not public_gate.valid_challenge(token[:-1]+'z', now=1004)


def test_capacity_error_is_not_success(setup):
    client, store = setup

    def full():
        raise app.HTTPException(429, 'Limite raggiunto')
    store.ensure_public_capacity = full
    assert submit(client, payload()).status_code == 429
    assert not store.rows


def test_capacity_requires_provider_count(monkeypatch):
    monkeypatch.setenv('SUPABASE_URL', 'https://example.supabase.co')
    monkeypatch.setenv('SUPABASE_SECRET_KEY', 'sb_secret_synthetic')
    store = app.SupabaseStore()
    store.client.close()
    store.client = httpx.Client(base_url='https://example.supabase.co', transport=httpx.MockTransport(
        lambda request: httpx.Response(200, headers={'Content-Range': '*/20'}, json=[])))
    with pytest.raises(app.HTTPException) as exc:
        store.ensure_public_capacity()
    assert exc.value.status_code == 429
    store.close()


def test_public_cannot_access_private_mail_api(setup):
    client, _ = setup
    assert client.post('/test-email', headers=headers(), json={'request_id': str(uuid4())}).status_code == 401


def test_rate_limit_returns_429_without_new_rows(setup):
    client, store = setup
    data = payload()
    assert submit(client, data).status_code == 201
    for _ in range(59):
        assert submit(client, data).status_code == 201
    assert submit(client, data).status_code == 429
    assert len(store.rows) == 1

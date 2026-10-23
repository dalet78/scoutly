import io
import json
from uuid import uuid4

import httpx
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app import SupabaseStore, create_app

TOKEN = 'test-only-' + 'x' * 40


class FakeStore:
    def __init__(self):
        self.rows = {}
        self.uploads = []
        self.fail_upload = False
        self.fail_finish = False

    def lookup(self, key):
        return self.rows.get(key)

    def insert(self, row):
        self.rows[row['id']] = {**row, 'status': 'uploading'}
        return True

    def upload(self, path, data, mime):
        if self.fail_upload:
            raise httpx.ConnectError('synthetic')
        self.uploads.append((path, data, mime))

    def finish(self, key, photos):
        if self.fail_finish:
            raise httpx.ReadTimeout('synthetic')
        self.rows[key]['status'] = 'received'
        self.rows[key]['photos'] = photos

    def close(self):
        pass


@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setenv('SCOUTLY_TEST_TOKEN', TOKEN)
    store = FakeStore()
    return TestClient(create_app(lambda: store)), store


def payload():
    return dict(idempotency_key=str(uuid4()), form_id='prima-di-pubblicare', form_version=2,
        workflow_id='annuncio-da-foto-e-descrizione', email='prova@example.com',
        description='TEST TECNICO SCOUTLY. Appartamento simulato per verifica.',
        city='Milano Comune', intent='Vendere', role='Proprietario',
        publication='Bozza in preparazione', service_requested=True)


def photo():
    buffer = io.BytesIO()
    Image.new('RGB', (16, 16), 'green').save(buffer, format='PNG')
    return ('photos', ('sintetica.png', buffer.getvalue(), 'image/png'))


def submit(client, data, files=None):
    return client.post('/requests', headers={'X-Scoutly-Test-Token': TOKEN},
        data={'payload': json.dumps(data)}, files=files or [])


def test_auth_and_health(setup):
    client, store = setup
    assert client.get('/health').json()['email_enabled'] is False
    assert client.post('/requests', data={'payload': 'private'}).status_code == 401
    assert not store.rows


def test_missing_configuration_fails_closed(setup, monkeypatch):
    client, _ = setup
    monkeypatch.delenv('SCOUTLY_TEST_TOKEN')
    assert submit(client, payload()).status_code == 503


def test_ten_photos_and_duplicate(setup):
    client, store = setup
    data = payload()
    response = submit(client, data, [photo() for _ in range(10)])
    assert response.status_code == 201
    assert response.json()['status'] == 'received'
    assert len(store.uploads) == 10
    assert len(store.rows[data['idempotency_key']]['photos']) == 10
    assert submit(client, data, [photo() for _ in range(10)]).json()['duplicate'] is True
    assert len(store.uploads) == 10
    data['description'] += ' materiale diverso'
    assert submit(client, data).status_code == 409


def test_text_only(setup):
    client, store = setup
    assert submit(client, payload()).status_code == 201
    assert not store.uploads


@pytest.mark.parametrize('field,value', [('form_version', 3), ('email', 'non-email'),
    ('service_requested', False), ('phone', '9' * 31), ('unexpected', 'ignored?')])
def test_bad_fields_do_not_write(setup, field, value):
    client, store = setup
    data = payload()
    data[field] = value
    assert submit(client, data).status_code == 422
    assert not store.rows


def test_fake_photo_and_eleven_files_do_not_write(setup):
    client, store = setup
    assert submit(client, payload(), [('photos', ('falsa.png', b'not image', 'image/png'))]).status_code == 422
    assert submit(client, payload(), [photo() for _ in range(11)]).status_code == 422
    assert not store.rows


@pytest.mark.parametrize('failure', ['fail_upload', 'fail_finish'])
def test_no_receipt_on_partial_or_ambiguous_save(setup, failure):
    client, store = setup
    setattr(store, failure, True)
    data = payload()
    assert submit(client, data, [photo()]).status_code == 503
    assert store.rows[data['idempotency_key']]['status'] == 'uploading'
    count = len(store.uploads)
    assert submit(client, data, [photo()]).status_code == 409
    assert len(store.uploads) == count


def test_total_limit_and_error_does_not_echo_text(setup):
    client, store = setup
    files = [('photos', ('large.png', b'x' * 8_100_001, 'image/png'))]
    assert submit(client, payload(), files).status_code == 413
    result = client.post('/requests', headers={'X-Scoutly-Test-Token': TOKEN}, data={'payload': 'SENSITIVE'})
    assert result.status_code == 422
    assert 'SENSITIVE' not in result.text
    assert not store.rows


def test_supabase_transport_contract(monkeypatch):
    monkeypatch.setenv('SUPABASE_URL', 'https://example.supabase.co')
    monkeypatch.setenv('SUPABASE_SECRET_KEY', 'sb_secret_synthetic')
    store = SupabaseStore()
    store.client.close()
    seen = []

    def handle(request):
        seen.append(request)
        assert request.headers['apikey'] == 'sb_secret_synthetic'
        assert 'authorization' not in request.headers
        if request.method == 'GET':
            return httpx.Response(200, json=[])
        if request.method == 'PATCH':
            return httpx.Response(200, json=[{'status': 'received'}])
        return httpx.Response(201, json={})

    store.client = httpx.Client(base_url='https://example.supabase.co',
        headers={'apikey': 'sb_secret_synthetic'}, transport=httpx.MockTransport(handle))
    assert store.lookup('synthetic') is None
    assert store.insert({'id': 'synthetic'}) is True
    store.upload('synthetic/1.png', b'synthetic', 'image/png')
    store.finish('synthetic', [{'position': 1}])
    assert [r.url.path for r in seen] == ['/rest/v1/scoutly_requests',
        '/rest/v1/scoutly_requests', '/storage/v1/object/scoutly-photos/synthetic/1.png',
        '/rest/v1/scoutly_photos', '/rest/v1/scoutly_requests']
    assert seen[2].headers['x-upsert'] == 'false'
    store.close()


def test_validation_error_does_not_echo_large_payload(setup):
    client, store = setup
    response = client.post('/requests', headers={'X-Scoutly-Test-Token': TOKEN},
                           data={'payload': 'PRIVATE' * 3000})
    assert response.status_code == 422
    assert 'PRIVATE' not in response.text
    assert not store.rows


def test_test_page_has_no_secrets_or_external_scripts(setup):
    client, store = setup
    page = client.get('/test')
    assert page.status_code == 200
    assert 'type="password"' in page.text
    assert TOKEN not in page.text
    assert page.headers['cache-control'] == 'no-store'
    assert "connect-src 'self'" in page.headers['content-security-policy']
    script = client.get('/test.js')
    assert script.status_code == 200
    assert TOKEN not in script.text
    assert "credentials:'omit'" in script.text
    assert not store.rows

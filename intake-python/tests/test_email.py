from copy import deepcopy
from uuid import uuid4

import httpx
import pytest
from fastapi.testclient import TestClient

import app


class MailStore:
    def __init__(self, key):
        self.row = dict(id=key, status='received', form_id='prima-di-pubblicare', form_version=2,
            workflow_id='annuncio-da-foto-e-descrizione', email='prova@example.com',
            description='TEST TECNICO SCOUTLY. Descrizione simulata.', answers={'city': 'Milano Comune'})
        self.claimed = False
        self.closed = 0
        self.fail_record = False

    def close(self):
        self.closed += 1

    def mail_request(self, key):
        return deepcopy(self.row) if self.row and key == self.row['id'] else None

    def claim_mail(self, key, answers):
        if self.claimed:
            return False
        self.claimed = True
        self.row['answers'] = deepcopy(answers)
        return True

    def record_mail(self, key, answers):
        if self.fail_record:
            raise httpx.ReadTimeout('synthetic')
        self.row['answers'] = deepcopy(answers)


@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setenv('SCOUTLY_TEST_TOKEN', 'x' * 40)
    monkeypatch.setenv('RESEND_API_KEY', 're_synthetic')
    monkeypatch.setenv('SCOUTLY_TEST_EMAIL', 'founder@example.com')
    key = str(uuid4())
    store = MailStore(key)
    calls = []

    def sender(key):
        calls.append(key)
        return 'synthetic-provider-id'

    client = TestClient(app.create_app(lambda: store, sender))
    return key, store, calls, client


def send(client, key, **extra):
    return client.post('/test-email', json={'request_id': key, **extra},
                       headers={'X-Scoutly-Test-Token': 'x' * 40})


def test_authenticated_single_send_then_duplicate(setup):
    key, store, calls, client = setup
    assert client.post('/test-email', json={'request_id': key}).status_code == 401
    assert not calls
    assert send(client, key).json() == {'request_id': key, 'status': 'accepted', 'duplicate': False}
    assert send(client, key).json()['duplicate'] is True
    assert calls == [key]
    assert store.row['answers']['city'] == 'Milano Comune'
    assert store.row['answers']['mail_test']['status'] == 'accepted'


@pytest.mark.parametrize('change', ['real', 'unknown', 'incomplete', 'metadata'])
def test_only_known_received_synthetic_request(setup, change):
    key, store, calls, client = setup
    if change == 'real':
        store.row['email'] = 'owner@example.com'
    elif change == 'unknown':
        store.row = None
    elif change == 'incomplete':
        store.row['status'] = 'uploading'
    else:
        store.row['form_version'] = 99
    assert send(client, key).status_code in (404, 409)
    assert not calls


def test_cannot_choose_recipient(setup):
    key, _, calls, client = setup
    response = send(client, key, to='other@example.com')
    assert response.status_code == 422
    assert 'other@example.com' not in response.text
    assert not calls


def test_missing_resend_key_does_not_claim(setup, monkeypatch):
    key, store, calls, client = setup
    monkeypatch.delenv('RESEND_API_KEY')
    assert send(client, key).status_code == 503
    assert not store.claimed and not calls


@pytest.mark.parametrize('failure', ['timeout', 'rejected', 'record'])
def test_ambiguous_or_rejected_send_is_never_repeated(setup, failure):
    key, store, calls, _ = setup

    def sender(key):
        calls.append(key)
        if failure == 'timeout':
            raise httpx.ReadTimeout('synthetic')
        if failure == 'rejected':
            response = httpx.Response(403, request=httpx.Request('POST', 'https://api.resend.com/emails'))
            raise httpx.HTTPStatusError('synthetic', request=response.request, response=response)
        return 'synthetic-provider-id'

    store.fail_record = failure == 'record'
    client = TestClient(app.create_app(lambda: store, sender))
    assert send(client, key).status_code in (502, 503)
    assert send(client, key).status_code == 409
    assert calls == [key]


def test_claim_conflict_does_not_send(setup):
    key, store, calls, client = setup
    store.claimed = True
    assert send(client, key).status_code == 409
    assert not calls


def test_resend_http_contract(monkeypatch):
    monkeypatch.setenv('RESEND_API_KEY', 're_synthetic')
    monkeypatch.setenv('SCOUTLY_TEST_EMAIL', 'founder@example.com')
    seen = []

    def handle(request):
        seen.append(request)
        return httpx.Response(200, json={'id': 'synthetic-provider-id'})

    original_client = httpx.Client
    monkeypatch.setattr(httpx, 'Client', lambda **kwargs: original_client(transport=httpx.MockTransport(handle), **kwargs))
    key = str(uuid4())
    assert app.send_test_email(key) == 'synthetic-provider-id'
    import json
    payload = json.loads(seen[0].content)
    assert str(seen[0].url) == 'https://api.resend.com/emails'
    assert seen[0].headers['Idempotency-Key'] == 'scoutly-email-test/v1/' + key
    assert seen[0].headers['Authorization'] == 'Bearer re_synthetic'
    assert payload['to'] == ['founder@example.com']
    assert payload['from'] == 'Scoutly test <onboarding@resend.dev>'
    assert 'TEST TECNICO SCOUTLY' in payload['subject']
    assert 'cc' not in payload and 'bcc' not in payload and 'attachments' not in payload


def test_missing_recipient_does_not_claim_or_send(setup, monkeypatch):
    key, store, calls, client = setup
    monkeypatch.delenv('SCOUTLY_TEST_EMAIL')
    assert send(client, key).status_code == 503
    assert not store.claimed and not calls

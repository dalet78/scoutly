from copy import deepcopy
import io
import json
import time

import httpx
import pytest
from fastapi.testclient import TestClient

import app
import notices
import public_gate
from test_intake import FakeStore, payload, photo
from verify_notice import ENDPOINT, verify_remote


class Store(FakeStore):
    capacity_checks = 0

    def ensure_public_capacity(self):
        self.capacity_checks += 1

    def notice_request(self, key):
        return deepcopy(self.rows.get(key))

    def notice_photos(self, key):
        return [(int(path.rsplit('/', 1)[1].split('.')[0]), mime, data)
                for path, data, mime in self.uploads if path.startswith(key+'/')]

    def claim_notice(self, key, answers, missing):
        previous = self.rows[key]['answers'].get('email_notice')
        if previous is not None and previous.get('status') != 'pending':
            return False
        self.rows[key]['answers'] = deepcopy(answers)
        return True

    def record_notice(self, key, answers):
        self.rows[key]['answers'] = deepcopy(answers)


@pytest.fixture
def setup(monkeypatch):
    for key, value in {'SCOUTLY_TEST_TOKEN':'x'*40, 'RESEND_API_KEY':'re_synthetic',
        'SCOUTLY_TEST_EMAIL':'founder@example.com', 'SUPABASE_URL':'https://example.supabase.co',
        'SUPABASE_SECRET_KEY':'sb_secret_synthetic', 'PUBLIC_INTAKE_ENABLED':'true'}.items():
        monkeypatch.setenv(key, value)
    store = Store()
    sent = []

    def sender(envelope, attachments, api_key, recipient):
        sent.append((envelope, attachments, recipient))
        return 'synthetic-provider-id'

    client = TestClient(app.create_app(lambda: store, notice_sender=sender))
    return client, store, sent, sender


def submit(client, data, files=None):
    return client.post('/public/requests', headers={'Origin':public_gate.ORIGIN,
        'X-Scoutly-Challenge':public_gate.challenge(now=time.time()-4)},
        data={'payload':json.dumps(data)}, files=files or [])


def test_new_request_forwards_once_with_photos_after_storage(setup):
    client, store, sent, _ = setup
    data = payload()
    files = [photo() for _ in range(8)]
    response = submit(client, data, files)
    assert response.status_code == 201 and response.json()['email_notice'] == 'accepted'
    assert len(sent) == 1 and len(sent[0][1]) == 8
    assert sent[0][2] == 'founder@example.com'
    assert str(sent[0][0].email) == data['email']
    assert store.rows[data['idempotency_key']]['status'] == 'received'
    assert store.rows[data['idempotency_key']]['answers']['city'] == 'Milano Comune'
    assert submit(client, data, files).json()['duplicate'] is True
    assert len(sent) == 1 and len(store.uploads) == 8


def test_incomplete_upload_never_notifies(setup):
    client, store, sent, _ = setup
    store.fail_upload = True
    assert submit(client, payload(), [photo()]).status_code == 503
    assert not sent


def test_notice_timeout_keeps_receipt_and_blocks_blind_retry(setup):
    _, store, _, _ = setup
    calls = []

    def failing(*args):
        calls.append(True)
        raise httpx.ReadTimeout('synthetic')

    client = TestClient(app.create_app(lambda:store, notice_sender=failing))
    data = payload()
    response = submit(client, data)
    assert response.status_code == 201 and response.json()['email_notice'] == 'review'
    assert store.rows[data['idempotency_key']]['answers']['email_notice']['status'] == 'unknown'
    assert submit(client, data).status_code == 201
    assert len(calls) == 1


def test_existing_request_can_be_notified_without_resubmission(setup, monkeypatch):
    client, store, sent, _ = setup
    monkeypatch.delenv('RESEND_API_KEY')
    data = payload()
    assert submit(client, data).status_code == 201
    assert not sent
    monkeypatch.setenv('RESEND_API_KEY', 're_synthetic')
    del store.rows[data['idempotency_key']]['answers']['email_notice']
    body = {'request_id':data['idempotency_key']}
    assert client.post('/notify-request', json=body).status_code == 401
    response = client.post('/notify-request', json=body, headers={'X-Scoutly-Test-Token':'x'*40})
    assert response.json()['status'] == 'accepted' and len(sent) == 1


def test_signature_prevents_recipient_or_material_tampering(setup):
    client, _, sent, _ = setup
    submit(client, payload())
    envelope = sent[0][0]
    signed = notices.SignedNotice(envelope=envelope, signature=notices.signature(envelope)).model_dump(mode='json')
    assert client.post('/notifications/verify', json=signed).json()['valid'] is True
    assert client.post('/notifications/verify', json=signed).headers['cache-control'] == 'no-store'
    signed['envelope']['email'] = 'attacker@example.com'
    assert client.post('/notifications/verify', json=signed).json() == {'valid':False}
    assert client.post('/notifications/verify', content='x'*32_001,
        headers={'Content-Type':'application/json'}).status_code == 413


def test_resend_contract_contains_reply_to_signed_fields_and_attachments(setup, monkeypatch):
    client, _, sent, _ = setup
    submit(client, payload(), [photo()])
    envelope, attachments, _ = sent[0]
    captured = []

    def transport(request):
        captured.append(request)
        return httpx.Response(200, json={'id':'synthetic'})

    original_client = httpx.Client
    monkeypatch.setattr(httpx, 'Client', lambda **kwargs: original_client(transport=httpx.MockTransport(transport), **kwargs))
    assert notices.send(envelope, attachments, 're_synthetic', 'founder@example.com') == 'synthetic'
    sent_body = json.loads(captured[0].content)
    assert sent_body['reply_to'] == str(envelope.email)
    assert sent_body['to'] == ['founder@example.com']
    assert sent_body['subject'] == notices.SUBJECT
    assert len(sent_body['attachments']) == 1
    parsed = notices.SignedNotice.model_validate_json(sent_body['text'].split('\n')[1])
    assert notices.verify(parsed)
    assert 'cc' not in sent_body and 'bcc' not in sent_body


def test_verifier_posts_only_to_fixed_endpoint_and_returns_no_contact(setup):
    client, _, sent, _ = setup
    submit(client, payload())
    envelope = sent[0][0]
    signed = notices.SignedNotice(envelope=envelope, signature=notices.signature(envelope)).model_dump(mode='json')

    class Opener:
        def open(self, request, timeout):
            assert request.full_url == ENDPOINT
            assert request.method == 'POST'
            assert str(envelope.email) not in request.full_url
            result = client.post('/notifications/verify', json=json.loads(request.data)).json()
            return io.BytesIO(json.dumps(result).encode())

    result = verify_remote(signed, Opener())
    assert result['verified'] is True and 'email' not in result

from copy import deepcopy
from uuid import uuid4
import pytest
from test_intake import photo
from test_notices import setup, submit
from notices import render_html, SignedNotice, signature, verify
from app import Payload


def payload(**overrides):
    return dict(idempotency_key=str(uuid4()), form_id='consulenza', form_version=1,
        workflow_id='richiesta-consulenza-diretta', name='Prova sintetica', email='prova@example.com',
        municipality_name='Roma', consultation_topic='Vendita', service_requested=True,
        consultation_requested=True, **overrides)


def test_consultation_minimal_saves_and_notifies_once(setup, monkeypatch):
    monkeypatch.setenv('CONSULTATION_FORM_ENABLED', 'true')
    client, store, sent, _ = setup
    data = payload()
    response = submit(client, data)
    assert response.status_code == 201
    assert response.json()['email_notice'] == 'accepted'
    row = store.rows[data['idempotency_key']]
    assert row['description'] == ''
    assert row['answers']['municipality_name'] == 'Roma'
    assert 'role' not in row['answers'] and 'intent' not in row['answers']
    envelope, attachments, _ = sent[0]
    assert envelope.form_id == 'consulenza' and not attachments
    assert envelope.consultation_requested is True
    assert verify(SignedNotice(envelope=envelope, signature=signature(envelope)))
    html = render_html(envelope)
    assert 'Richiesta di consulenza gratuita' in html and 'non generare una bozza' in html
    assert 'La richiesta della bozza è confermata' not in html
    assert submit(client, data).json()['duplicate'] is True
    assert len(sent) == 1
    changed = {**data, 'municipality_name':'Torino'}
    assert submit(client, changed).status_code == 409


def test_consultation_closed_until_activation(setup, monkeypatch):
    monkeypatch.delenv('CONSULTATION_FORM_ENABLED', raising=False)
    client, store, sent, _ = setup
    assert submit(client, payload()).status_code == 503
    assert not store.rows and not sent


@pytest.mark.parametrize('field,value', [
    ('name',''), ('name','   '), ('email','invalid'), ('municipality_name',''),
    ('consultation_topic','Prezzo inventato'), ('consultation_requested',False),
    ('service_requested',False), ('description','x'*1001),
    ('workflow_id','annuncio-da-foto-e-descrizione'),
])
def test_invalid_consultation_never_saves(setup, monkeypatch, field, value):
    monkeypatch.setenv('CONSULTATION_FORM_ENABLED','true')
    client, store, sent, _ = setup
    data=payload();data[field]=value
    assert submit(client,data).status_code == 422
    assert not store.rows and not sent


def test_consultation_rejects_photos(setup, monkeypatch):
    monkeypatch.setenv('CONSULTATION_FORM_ENABLED','true')
    client, store, sent, _ = setup
    assert submit(client,payload(),[photo()]).status_code == 422
    assert not store.rows and not sent


def test_consultation_optional_contact_and_escape(setup, monkeypatch):
    monkeypatch.setenv('CONSULTATION_FORM_ENABLED','true')
    client, _, sent, _ = setup
    data=payload(phone='000000000', description='<script>bad</script>')
    assert submit(client,data).status_code == 201
    html=render_html(sent[0][0])
    assert '<script>bad</script>' not in html and '&lt;script&gt;' in html


def test_existing_announcement_still_requires_description():
    from test_intake import payload as announcement
    data=announcement();data['description']=''
    from pydantic import ValidationError
    with pytest.raises(ValidationError):
        Payload.model_validate(data)


def test_config_only_advertises_consultation_when_enabled(setup, monkeypatch):
    import public_gate
    client, _, _, _ = setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED','true')
    monkeypatch.delenv('CONSULTATION_FORM_ENABLED',raising=False)
    config=client.get('/public/config',headers={'Origin':public_gate.ORIGIN}).json()
    assert not any(item['form_id']=='consulenza' for item in config['supported_forms'])
    monkeypatch.setenv('CONSULTATION_FORM_ENABLED','true')
    config=client.get('/public/config',headers={'Origin':public_gate.ORIGIN}).json()
    assert any(item['form_id']=='consulenza' for item in config['supported_forms'])

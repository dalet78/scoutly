import hashlib
import json

import pytest
from test_intake import photo
from test_notices import setup, submit
from test_renovation import renovation
import notices


def test_floor_plan_is_separate_signed_attachment_and_deduplicated(setup, monkeypatch):
    client, store, sent, _ = setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED','true')
    data = {**renovation(), 'floor_plan_position':2}
    response = submit(client,data,[photo(),photo()])
    assert response.status_code == 201
    envelope, attachments, _ = sent[0]
    assert [p.filename for p in envelope.photos] == ['foto-1.png','planimetria-catastale.png']
    assert [a['filename'] for a in attachments] == ['foto-1.png','planimetria-catastale.png']
    assert store.rows[data['idempotency_key']]['answers']['floor_plan_position'] == 2
    html = notices.render_html(envelope)
    assert '1 foto allegata' in html and 'Planimetria catastale' in html
    signed = notices.SignedNotice(envelope=envelope,signature=notices.signature(envelope)).model_dump(mode='json')
    assert client.post('/notifications/verify',json=signed).json()['valid'] is True
    signed['envelope']['answers'].pop('floor_plan_position')
    assert client.post('/notifications/verify',json=signed).status_code == 422
    assert submit(client,data,[photo(),photo()]).json()['duplicate'] is True and len(sent)==1


@pytest.mark.parametrize('position,count',[(1,1),(3,2),(1,2),(9,9)])
def test_invalid_plan_position_never_writes(setup, monkeypatch, position, count):
    client, store, sent, _ = setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED','true')
    assert submit(client,{**renovation(),'floor_plan_position':position},[photo() for _ in range(count)]).status_code == 422
    assert not store.rows and not sent


def test_plan_keeps_eight_image_limit_and_old_renovation_hash(setup, monkeypatch):
    client, store, sent, _ = setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED','true')
    data = {**renovation(),'floor_plan_position':8}
    assert submit(client,data,[photo() for _ in range(8)]).status_code == 201
    assert len(sent[0][1]) == 8
    old = renovation()
    values = {**old,'name':None,'phone':None,'consultation_requested':False,'area_sqm':float(old['area_sqm'])}
    raw = photo()[1][1]
    expected = hashlib.sha256(json.dumps({'payload':values,'photos':[hashlib.sha256(raw).hexdigest()]},
        sort_keys=True,ensure_ascii=False).encode()).hexdigest()
    assert submit(client,old,[photo()]).status_code == 201
    assert store.rows[old['idempotency_key']]['payload_hash'] == expected
    assert 'floor_plan_position' not in sent[1][0].answers.model_dump()

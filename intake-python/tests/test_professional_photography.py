import httpx
import pytest
from test_consultation import payload
from test_notices import setup, submit
from notices import render_html, notice_subject, send, SignedNotice, signature, verify

def test_photography_saved_and_notified_only_to_consultant(setup, monkeypatch):
    monkeypatch.setenv('CONSULTATION_FORM_ENABLED','true')
    client,store,sent,_=setup
    data=payload();data['consultation_topic']='Fotografie professionali'
    response=submit(client,data)
    assert response.status_code==201 and response.json()['email_notice']=='accepted'
    row=store.rows[data['idempotency_key']]
    assert row['answers']['consultation_topic']=='Fotografie professionali'
    assert not store.uploads
    envelope,attachments,recipient=sent[0]
    assert recipient=='founder@example.com' and attachments==[]
    assert envelope.workflow_id=='richiesta-consulenza-diretta'
    assert verify(SignedNotice(envelope=envelope,signature=signature(envelope)))
    html=render_html(envelope)
    assert 'Fotografie professionali' in html and 'Non inoltrare al fotografo' in html
    assert 'distinta dal marketing' in html and 'non generare una bozza' in html
    assert notice_subject(envelope).endswith(' — Fotografie professionali')
    assert submit(client,data).json()['duplicate'] is True
    assert len(sent)==1
    # Exercise actual provider adapter without contacting a real provider.
    import notices
    requests=[]
    def transport(request):
        requests.append(request)
        return httpx.Response(200,json={'id':'synthetic-photography-notice'})
    real_client=httpx.Client
    monkeypatch.setattr(notices.httpx,'Client',lambda **kwargs: real_client(transport=httpx.MockTransport(transport),**kwargs))
    assert send(envelope,[], 'synthetic-key',recipient)=='synthetic-photography-notice'
    import json
    body=json.loads(requests[0].content)
    assert body['to']==['founder@example.com']
    assert body['subject'].endswith(' — Fotografie professionali')
    assert body['attachments']==[]

@pytest.mark.parametrize('field,value',[('third_party_marketing',True),('photographer_authorized',True)])
def test_no_implicit_marketing_or_photographer_authorization(setup,monkeypatch,field,value):
    monkeypatch.setenv('CONSULTATION_FORM_ENABLED','true')
    client,store,sent,_=setup
    data=payload();data['consultation_topic']='Fotografie professionali';data[field]=value
    assert submit(client,data).status_code==422
    assert not store.rows and not sent

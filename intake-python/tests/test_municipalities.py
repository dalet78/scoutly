import pytest
import notices
from municipalities import MUNICIPALITIES
from test_notices import setup,submit
from test_renovation import renovation
from test_intake import photo


@pytest.mark.parametrize('code,city,name',[('015146','Milano Comune','Milano (MI)'),('058091','Altro Comune','Roma (RM)')])
@pytest.mark.parametrize('with_plan',[False,True])
def test_municipality_is_validated_saved_and_signed(setup,monkeypatch,code,city,name,with_plan):
    client,store,sent,_=setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED','true')
    data={**renovation(),'municipality_code':code,'city':city}
    if with_plan:data['floor_plan_position']=2
    assert submit(client,data,[photo(),photo()] if with_plan else [photo()]).status_code==201
    envelope=sent[0][0]
    assert envelope.answers.municipality_name==name
    assert store.rows[data['idempotency_key']]['answers']['municipality_code']==code
    assert name in notices.render_html(envelope)
    signed=notices.SignedNotice(envelope=envelope,signature=notices.signature(envelope)).model_dump(mode='json')
    assert client.post('/notifications/verify',json=signed).json()['valid'] is True
    signed['envelope']['answers']['municipality_name']='Comune inventato'
    assert client.post('/notifications/verify',json=signed).status_code==422


@pytest.mark.parametrize('code,city',[('000000','Altro Comune'),('058091','Milano Comune'),('015146','Altro Comune')])
def test_unknown_or_inconsistent_municipality_does_not_write(setup,monkeypatch,code,city):
    client,store,sent,_=setup
    monkeypatch.setenv('RENOVATION_FORM_ENABLED','true')
    assert submit(client,{**renovation(),'municipality_code':code,'city':city},[photo()]).status_code==422
    assert not store.rows and not sent


def test_istat_snapshot_has_all_unique_current_codes():
    assert len(MUNICIPALITIES)==7894
    assert MUNICIPALITIES['015146']=='Milano (MI)'

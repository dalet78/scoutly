(()=>{
const slug=document.body.dataset.tool,page=SCOUTLY_PAGES.find(p=>p.slug===slug);if(!page)return;
const config=window.SCOUTLY_LEAD_CONFIG||{},https=value=>{try{return new URL(value).protocol==='https:'}catch{return false}},live=https(config.endpoint)&&https(config.privacyUrl)&&!!config.controllerName?.trim();
const form=document.querySelector('#tool-form'),fields=document.querySelector('#fields'),result=document.querySelector('#result'),empty=document.querySelector('#empty'),error=document.querySelector('#error');
let last=null,current=0,busy=false,contactAccepted=false;const submitted=new Map();const leadId=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2);
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
const contact=el('section','form-panel');contact.append(el('h3',null,'1. Come possiamo ricontattarti?'));
[['contactName','Nome','text','name'],['contactEmail','Email','email','email'],['contactPhone','Telefono','tel','tel']].forEach(([id,label,type,auto])=>{const wrap=el('div','field'),l=el('label',null,label),input=el('input');l.htmlFor=id;input.id=input.name=id;input.type=type;input.autocomplete=auto;input.maxLength=type==='tel'?40:160;input.required=id==='contactName';wrap.append(l,input);contact.append(wrap);});
contact.append(el('p','hint',live?'Inserisci nome e almeno un recapito valido: email o telefono.':'Percorso dimostrativo: usa dati di esempio. Nessun contatto viene inviato o salvato.'));
const consentWrap=el('div','check-field'),consent=el('input'),consentLabel=el('label');consent.type='checkbox';consent.id=consent.name='contactConsent';consent.required=true;consentLabel.htmlFor=consent.id;
const consentText=live?'Chiedo di essere ricontattato da '+config.controllerName+' per questa richiesta e confermo di aver letto l’informativa privacy.':'Ho capito che sto provando il modulo con dati di esempio e che non riceverò un ricontatto.';
consentLabel.append(document.createTextNode(consentText));if(live){const link=el('a',null,' Leggi l’informativa privacy');link.href=config.privacyUrl;link.target='_blank';link.rel='noopener noreferrer';consentLabel.append(link);}consentWrap.append(consent,consentLabel);contact.append(consentWrap);fields.append(contact);
const panels=[contact];
page.fields.forEach((field,index)=>{
 const group=Math.floor(index/4)+1;
 if(!panels[group]){const panel=el('section','form-panel');panel.append(el('h3',null,page.mode==='Checklist'?'La tua checklist · parte '+group:'Il tuo caso · parte '+group));panels[group]=panel;fields.append(panel);}
 const wrap=el('div',field.type==='checkbox'?'check-field':'field'),label=el('label',null,field.label);label.htmlFor=field.id;
 const input=el(field.type==='select'?'select':'input');input.id=input.name=field.id;
 if(field.type==='select'){const first=el('option',null,'Seleziona');first.value='';input.append(first);field.options.forEach(value=>{const option=el('option',null,value);option.value=value;input.append(option);});}
 else{input.type=field.type;if(field.type==='number'){input.min=field.min;input.max=field.max;input.step=field.step;input.inputMode='decimal';}if(field.type==='text')input.maxLength=400;}
 input.required=!!field.required;
 if(field.type==='checkbox')wrap.append(input,label);else wrap.append(label,input);
 if(field.hint){const hint=el('p','hint',field.hint);hint.id=field.id+'-hint';input.setAttribute('aria-describedby',hint.id);wrap.append(hint);}
 panels[group].append(wrap);
});
const next=document.querySelector('#next'),back=document.querySelector('#back'),reset=document.querySelector('#reset');
function show(index,focus=true){current=index;panels.forEach((p,i)=>{p.hidden=i!==index;p.querySelectorAll('input,select').forEach(input=>input.disabled=i!==index)});document.querySelector('#progress-label').textContent='Passo '+(index+1)+' di '+panels.length;document.querySelector('#progress').value=index+1;document.querySelector('#progress').max=panels.length;document.querySelector('#phase').textContent=index===0?'Il tuo contatto':'Dati del caso';back.hidden=index===0;next.textContent=index===panels.length-1?(live?'Invia e mostra il riepilogo':'Mostra il riepilogo demo'):'Continua';error.textContent='';if(focus){const heading=panels[index].querySelector('h3');heading.tabIndex=-1;heading.focus();}}
function read(){return Object.fromEntries(page.fields.map(f=>{const input=document.getElementById(f.id);return [f.id,f.type==='checkbox'?input.checked:input.value.trim()]}));}
function contactData(){return {name:document.querySelector('#contactName').value.trim(),email:document.querySelector('#contactEmail').value.trim(),phone:document.querySelector('#contactPhone').value.trim(),requestedContact:live&&consent.checked};}
function invalidate(){last=null;result.hidden=true;empty.hidden=false;error.textContent='';document.querySelector('#download').disabled=true;}
function validate(index){
 if(index===0){const data=contactData();if(!data.name){error.textContent='Inserisci il tuo nome.';return false;}
 const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email),phoneOk=/^[+\d\s().-]+$/.test(data.phone)&&data.phone.replace(/\D/g,'').length>=7&&data.phone.replace(/\D/g,'').length<=15;
 if((!data.email&&!data.phone)||(data.email&&!emailOk)||(data.phone&&!phoneOk)){error.textContent='Inserisci almeno un recapito valido. Controlla ogni email o telefono compilato.';return false;}
 }
 for(const input of panels[index].querySelectorAll('input,select')){if(input.required&&input.type!=='checkbox'&&!input.value.trim()){error.textContent='Completa tutti i campi richiesti.';input.focus();return false;}if(!input.checkValidity()){input.reportValidity();return false;}}
 return true;
}
function lock(value){busy=value;next.disabled=back.disabled=reset.disabled=value;panels[current].querySelectorAll('input,select').forEach(input=>input.disabled=value);next.setAttribute('aria-busy',String(value));}
async function send(stage,data){
 if(!live)return;
 const snapshot={stage,step:current,tool:slug,intent:page.intent,contact:contactData(),answers:data,consent:{text:consentText,privacyUrl:config.privacyUrl,controllerName:config.controllerName},pageUrl:location.origin+location.pathname};
 const key=JSON.stringify(snapshot);let event=submitted.get(key);if(event?.accepted)return;
 if(!event){event={...snapshot,leadId,eventId:crypto.randomUUID?crypto.randomUUID():leadId+'-'+submitted.size,occurredAt:new Date().toISOString()};submitted.set(key,event);}
 const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),15000);
 try{const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event),signal:abort.signal});if(!response.ok)throw Error('response');const ack=await response.json();if(ack.accepted!==true)throw Error('ack');event.accepted=true;contactAccepted=true;}finally{clearTimeout(timeout);}
}
back.addEventListener('click',()=>{if(!busy){invalidate();show(current-1)}});
form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);form.addEventListener('reset',event=>{if(busy){event.preventDefault();return;}invalidate();show(0);document.querySelector('#delivery').textContent=contactAccepted?'I dati già inviati restano presso il destinatario; ricominciare non li elimina.':live?'Il contatto verrà inviato quando premi Continua.':'Demo: invio contatti non attivo.';});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;invalidate();if(!validate(current))return;
 const data=read();let output=null;
 if(current===panels.length-1){output=scoutlyCalculate(slug,data,page);if(output.error){error.textContent=output.error+' Usa Indietro per correggere i dati.';return;}}
 lock(true);
 try{await send(current===0?'contact':current===panels.length-1?'complete':'case_step',data);}
 catch{error.textContent='Invio non confermato. Controlla la connessione e riprova con il pulsante sotto. I dati restano nel modulo.';return;}
 finally{lock(false);}
 document.querySelector('#delivery').textContent=live?(current===0?'Contatto ricevuto. Completa i dettagli della richiesta.':'Dati del passaggio ricevuti.'):'Demo: nessun dato inviato, nessun ricontatto attivato.';
 if(current<panels.length-1){show(current+1);return;}
 const metrics=document.querySelector('#metrics');metrics.replaceChildren();output.rows.forEach(({label,value})=>{const item=el('div','metric');item.append(el('dt',null,label),el('dd',null,String(value)));metrics.append(item);});
 const notes=document.querySelector('#notes');notes.replaceChildren();output.notes.forEach(text=>notes.append(el('p',null,text)));
 const tasks=document.querySelector('#tasks');tasks.replaceChildren();output.tasks.forEach(text=>tasks.append(el('li',null,text)));document.querySelector('#tasks-block').hidden=!output.tasks.length;
 const profile=document.querySelector('#profile');profile.replaceChildren();page.fields.filter(f=>f.type!=='checkbox'&&String(data[f.id])!=='').forEach(f=>profile.append(el('li',null,f.label+': '+data[f.id])));
 last={data,output};empty.hidden=true;result.hidden=false;document.querySelector('#download').disabled=false;document.querySelector('#result-title').focus();
});
document.querySelector('#download').addEventListener('click',()=>{
 if(!last)return;const lines=['# '+page.title,'',new Date().toLocaleDateString('it-IT'),'','## Risultato',...last.output.rows.map(r=>r.label+': '+r.value),'',...last.output.notes,'','## Attività aperte',...last.output.tasks.map(t=>'- '+t),'','## Dati del caso',...page.fields.map(f=>f.label+': '+(f.type==='checkbox'?(last.data[f.id]?'Completato':'Da fare'):last.data[f.id])),'','## Metodo',page.method];
 const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='scoutly-'+slug+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
document.querySelector('#delivery').textContent=live?'Il contatto verrà inviato quando premi Continua.':'Demo: invio contatti non attivo.';
show(0,false);
})();

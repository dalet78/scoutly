import {contextualDescription} from '../seller-guides/request-context.mjs';
import {validatePhotos} from './upload-v3.js';
import {submitPublic,SubmissionError} from './submit-public-v1.js?v=upload-progress-1';
import {formatPrice,parsePrice,municipalityLabel,searchMunicipalities,resolveMunicipality} from './form-ui.js';
const API='https://scoutly-k76y.onrender.com';
const form=document.getElementById('request'),picker=document.getElementById('photos'),previews=document.getElementById('photo-previews');
const error=document.getElementById('upload-error'),send=document.getElementById('send'),summary=document.getElementById('photo-summary');
const connection=document.getElementById('connection-status'),reconnect=document.getElementById('reconnect');
const renovation=form.dataset?.formId==='ristrutturare-o-vendere';
const requestTopic=form.dataset?.requestTopic;
const formId=renovation?'ristrutturare-o-vendere':'prima-di-pubblicare';
const storageKey='scoutly-public-'+formId+'-v1';
const submitLabel=requestTopic?'Ricevi la lista via email →':renovation?'Ricevi il confronto via email →':'Invia descrizione e foto →';
const planPicker=renovation?document.getElementById('floor-plan'):null;
const planPreview=renovation?document.getElementById('floor-plan-preview'):null;
const planSummary=renovation?document.getElementById('floor-plan-summary'):null;
const priceInput=renovation?document.getElementById('target-price'):null;
const townInput=renovation?document.getElementById('municipality'):null;
const townOptions=renovation?document.getElementById('municipality-options'):null;
const townStatus=renovation?document.getElementById('municipality-status'):null;
const progressPanel=document.getElementById('upload-status'),progressBar=document.getElementById('upload-progress'),progressText=document.getElementById('upload-status-text');
let towns=null;
function stage(message,percent=null){
 if(!progressPanel)return;progressPanel.hidden=false;progressText.textContent=message;
 if(percent===null)progressBar.removeAttribute('value');else progressBar.value=percent;
}
function refreshTowns(){
 if(!townInput||!towns)return;
 const matches=searchMunicipalities(towns,townInput.value);townOptions.replaceChildren();
 for(const row of matches){const option=document.createElement('option');option.value=municipalityLabel(row);townOptions.append(option);}
 const selected=resolveMunicipality(towns,townInput.value);
 townInput.setCustomValidity(selected?'':'Scegli un comune italiano dall’elenco.');
 townStatus.textContent=selected?(selected[0]==='015146'?'Milano selezionato.':'Comune selezionato: '+municipalityLabel(selected)+'. Il servizio attuale copre Milano Comune; non promettiamo un confronto locale per altre zone.'):'Digita il nome e seleziona un comune dall’elenco.';
}
townInput?.addEventListener('input',refreshTowns);
townInput?.addEventListener('change',()=>{const r=towns&&resolveMunicipality(towns,townInput.value);if(r)townInput.value=municipalityLabel(r);refreshTowns();});
priceInput?.addEventListener('input',()=>{
 const before=priceInput.value,caret=priceInput.selectionStart??before.length,digits=before.slice(0,caret).replaceAll('.','').length;
 priceInput.value=formatPrice(before);
 priceInput.setCustomValidity(Number.isFinite(parsePrice(priceInput.value))?'':'Inserisci un importo positivo in euro interi, fino a 100.000.000.');
 let pos=0,count=0;while(pos<priceInput.value.length&&count<digits){if(/\d/.test(priceInput.value[pos]))count++;pos++;}
 priceInput.setSelectionRange?.(pos,pos);
});
let floorPlan=null,planUrl=null;
function material(){return floorPlan?[...photos,floorPlan]:photos;}
let photos=[],submitting=false,urls=[],gate=null,pending=null;
send.disabled=true;picker.removeAttribute('name');
planPicker?.removeAttribute('name');
function renderPlan(){
 if(!planPicker)return;
 if(planUrl)URL.revokeObjectURL(planUrl);planUrl=null;planPreview.replaceChildren();
 planPicker.files=fileList(floorPlan?[floorPlan]:[]);
 planSummary.textContent=floorPlan?'Planimetria pronta sul dispositivo: '+floorPlan.name+'. Non ancora inviata.':'Nessuna planimetria selezionata (facoltativa).';
 if(!floorPlan)return;
 const image=document.createElement('img');planUrl=URL.createObjectURL(floorPlan);image.src=planUrl;image.alt='Anteprima della planimetria catastale';image.style.maxWidth='100%';
 const remove=document.createElement('button');remove.type='button';remove.className='text-button';remove.textContent='Rimuovi planimetria';
 remove.addEventListener('click',()=>{if(submitting)return;floorPlan=null;error.textContent='';renderPlan();render();});
 planPreview.append(image,remove);
}
planPicker?.addEventListener('change',()=>{
 const selected=[...planPicker.files];if(!selected.length)return;
 const message=selected.length!==1?'Seleziona una sola planimetria.':validatePhotos([...photos,...selected]);
 if(message){error.textContent=message+' Il limite è 8 immagini totali, planimetria inclusa.';renderPlan();return;}
 floorPlan=selected[0];error.textContent='';renderPlan();render();
});
function fileList(files){const transfer=new DataTransfer();for(const file of files)transfer.items.add(file);return transfer.files;}
function render(){
 for(const url of urls)URL.revokeObjectURL(url);urls=[];previews.replaceChildren();picker.files=fileList(photos);
 photos.forEach((file,index)=>{
  const card=document.createElement('div');card.className='photo-card';const image=document.createElement('img');const url=URL.createObjectURL(file);urls.push(url);image.src=url;image.alt='Anteprima: '+file.name;
  const name=document.createElement('p');name.className='hint';name.textContent=file.name;
  const remove=document.createElement('button');remove.type='button';remove.className='text-button';remove.textContent='Rimuovi foto '+(index+1);
  remove.addEventListener('click',()=>{if(submitting)return;photos.splice(index,1);error.textContent='';render();picker.focus();});
  card.append(image,name,remove);previews.append(card);
 });
 summary.textContent=(photos.length?photos.length+' foto pronte sul dispositivo':'Nessuna foto selezionata')+(floorPlan?' + 1 planimetria':'')+' · '+(material().reduce((sum,file)=>sum+file.size,0)/1_000_000).toFixed(1)+' MB totali su 8 MB'+(material().length?'. Anteprime locali: premi il pulsante per inviarle.':'');
}
picker.addEventListener('change',()=>{
 const candidates=[...photos];for(const file of picker.files)if(!candidates.some(old=>old.name===file.name&&old.size===file.size&&old.lastModified===file.lastModified))candidates.push(file);
 const message=validatePhotos(floorPlan?[...candidates,floorPlan]:candidates);if(message){error.textContent=message+' La nuova selezione non è stata aggiunta. Il limite include la planimetria.';render();return;}
 photos=candidates;error.textContent='';render();
});
async function connect(){
 if(requestTopic&&form.dataset.requestTopicReady!=='true'){
  gate=null;send.disabled=true;reconnect.disabled=true;
  connection.textContent='Questo nuovo percorso email è in preparazione: l’invio sarà disponibile dopo l’aggiornamento dell’agente AI. Nessun dato è stato inviato.';
  return;
 }
 gate=null;send.disabled=true;reconnect.disabled=true;connection.textContent='Collegamento al servizio in corso… Può richiedere fino a un minuto.';
 let unavailable='Non riusciamo a collegarci al servizio. Le anteprime non sono state inviate: riprova il collegamento.';
 if(!submitting)stage('Collegamento al servizio…');
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),90000);
 try {
  if(townInput&&!towns){
   const catalog=await fetch('../intake-python/comuni.json',{credentials:'omit',redirect:'error',signal:controller.signal});
   if(!catalog.ok)throw new Error();const rows=await catalog.json();
   if(!Array.isArray(rows)||rows.length<7000||!rows.every(r=>Array.isArray(r)&&r.length===3&&/^\d{6}$/.test(r[0])&&typeof r[1]==='string'&&typeof r[2]==='string'))throw new Error();
   towns=rows;refreshTowns();
  }
  const response=await fetch(API+'/public/config',{credentials:'omit',redirect:'error',signal:controller.signal});
  if(!response.ok)throw new Error();const data=await response.json();
  if(data.protocol!==1||typeof data.challenge!=='string'||data.max_photos!==8||data.max_bytes!==8000000)throw new Error();
  if(renovation&&!data.supported_forms?.some(item=>item.form_id===formId&&item.form_version===1)){
   unavailable='Questo percorso non è ancora attivo. Puoi preparare le immagini, ma l’invio è disabilitato: nessun file è stato caricato.';throw new Error();}
  if((planPicker&&data.floor_plan_upload!==true)||(townInput&&data.municipality_support!==true)){
   unavailable='Il servizio sta per essere aggiornato. Le immagini sono solo anteprime locali e non sono state inviate. Riprova il collegamento più tardi.';throw new Error();}
  gate={token:data.challenge,receivedAt:Date.now(),readyAt:Date.now()+3100};
  connection.textContent='Puoi inviare la richiesta. Riceverai un codice di conferma dopo il salvataggio.';
  send.disabled=false;
 } catch {connection.textContent=unavailable;}
 finally{clearTimeout(timer);reconnect.disabled=false;if(!submitting&&progressPanel)progressPanel.hidden=true;}
}
reconnect.addEventListener('click',()=>{if(!submitting)connect();});
async function fingerprint(payload){
 const fields={...payload};delete fields.idempotency_key;
 const chunks=[JSON.stringify(fields)];
 for(const file of material()){const hash=await crypto.subtle.digest('SHA-256',await file.arrayBuffer());chunks.push([...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join(''));}
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(chunks.join('\n')));
 return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function persist(value){sessionStorage.setItem(storageKey,JSON.stringify(value));pending=value;}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(submitting)return;
 if(!form.reportValidity())return;
 if(townInput&&(!towns||!resolveMunicipality(towns,townInput.value))){error.textContent='Seleziona un comune italiano dall’elenco.';return;}
 if(renovation&&!photos.length){error.textContent='Carica almeno una foto per ricevere il confronto.';return;}
 const message=validatePhotos(material());if(message){error.textContent=message;return;}
 submitting=true;send.disabled=true;reconnect.disabled=true;picker.disabled=true;error.textContent='';send.textContent='Salvataggio in corso…';
 if(planPicker)planPicker.disabled=true;
 form.setAttribute?.('aria-busy','true');stage('Preparazione dei file. Nessun invio ancora effettuato.');
 const controller=new AbortController();let timer;
 try {
  if(!gate||Date.now()-gate.receivedAt>1200000)await connect();
  if(!gate)throw new SubmissionError('Collegamento non disponibile. Riprova più tardi.',false);
  send.disabled=true;reconnect.disabled=true;
  const data=new FormData(form);
  const payload={idempotency_key:pending?.id||crypto.randomUUID(),form_id:formId,form_version:renovation?1:2,workflow_id:renovation?'confronto-ristrutturare-o-vendere':'annuncio-da-foto-e-descrizione',
   email:String(data.get('email')||'').trim(),name:String(data.get('name')||'').trim()||null,phone:String(data.get('phone')||'').trim()||null,
   description:String(data.get('description')||'').trim(),city:data.get('city'),intent:data.get('intent'),role:data.get('role'),publication:data.get('publication'),
   service_requested:document.getElementById('service-request').checked,consultation_requested:document.getElementById('consultation').checked};
  if(renovation)Object.assign(payload,{
   target_price:parsePrice(priceInput?priceInput.value:data.get('target_price')),area_sqm:Number(data.get('area_sqm')),
   zone:String(data.get('zone')||'').trim(),timeframe:data.get('timeframe')});
  if(floorPlan)payload.floor_plan_position=photos.length+1;
  if(townInput){const town=resolveMunicipality(towns,townInput.value);payload.municipality_code=town[0];payload.city=town[0]==='015146'?'Milano Comune':'Altro Comune';}
  if(requestTopic)payload.description=contextualDescription(requestTopic,payload.description,Object.fromEntries(['luce','ambienti','ordine','dati','documenti','prezzo'].map(key=>[key,String(data.get(key)||'')])));
  const signature=await fingerprint(payload);
  if(pending?.uncertain&&pending.signature!==signature)throw new SubmissionError('Il tentativo precedente ha un esito da verificare. Mantieni gli stessi dati e foto prima di riprovare con il suo codice.');
  await new Promise(resolve=>setTimeout(resolve,Math.max(0,gate.readyAt-Date.now())));
  persist({id:payload.idempotency_key,signature,uncertain:true});
  error.textContent='Codice richiesta: '+pending.id+'. Attendi la conferma senza chiudere la pagina.';
  timer=setTimeout(()=>controller.abort(),90000);
  stage('Invio dei file in corso…',0);
  const receipt=await submitPublic({endpoint:API+'/public/requests',payload,photos:material(),website:String(data.get('website')||''),challenge:gate.token,signal:controller.signal,
   onProgress:percent=>percent===100?stage('Trasferimento completato. Attendo la conferma del salvataggio: non chiudere la pagina.'):stage(percent===null?'Invio dei file in corso…':'Invio dei file: '+percent+'%',percent)});
  stage('Richiesta salvata. Apertura della conferma…',100);
  persist({id:receipt.request_id,confirmed:true});
  location.assign((renovation?'richiesta-ristrutturare-inviata.html':'richiesta-inviata.html')+'#'+receipt.request_id);
 } catch(reason) {
  if(reason instanceof SubmissionError&&!reason.ambiguous&&pending)persist({...pending,uncertain:false});
  error.textContent=(reason instanceof SubmissionError?reason.message:'Invio non confermato. Il salvataggio potrebbe essere riuscito.')+
   (pending?.id?' Codice da conservare: '+pending.id+'. Nessun nuovo invio automatico.':'');
  gate=null;
  if(progressPanel)progressPanel.hidden=true;
 } finally {
  clearTimeout(timer);submitting=false;picker.disabled=false;send.disabled=!gate;reconnect.disabled=false;send.textContent=submitLabel;
  form.setAttribute?.('aria-busy','false');
  if(planPicker)planPicker.disabled=false;
 }
});
try {
 pending=JSON.parse(sessionStorage.getItem(storageKey)||'null');
 if(pending?.confirmed){sessionStorage.removeItem(storageKey);pending=null;}
 if(pending&&!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(pending.id))throw new Error();
 if(pending)error.textContent='Tentativo precedente da verificare. Codice: '+pending.id+'. Per riprovare usa gli stessi dati e foto.';
 if(typeof DataTransfer!=='function'||!crypto.randomUUID||!crypto.subtle)throw new Error();
 render();renderPlan();connect();
} catch {send.disabled=true;picker.disabled=true;connection.textContent='Per inviare usa un browser aggiornato con memoria di sessione disponibile.';}
window.addEventListener('pageshow',()=>{submitting=false;send.textContent=submitLabel;});

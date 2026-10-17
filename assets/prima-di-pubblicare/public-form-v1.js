import {validatePhotos} from './upload-v3.js';
import {submitPublic,SubmissionError} from './submit-public-v1.js';
const API='https://scoutly-k76y.onrender.com';
const form=document.getElementById('request'),picker=document.getElementById('photos'),previews=document.getElementById('photo-previews');
const error=document.getElementById('upload-error'),send=document.getElementById('send'),summary=document.getElementById('photo-summary');
const connection=document.getElementById('connection-status'),reconnect=document.getElementById('reconnect');
const storageKey='scoutly-public-prima-di-pubblicare-v1';
let photos=[],submitting=false,urls=[],gate=null,pending=null;
send.disabled=true;picker.removeAttribute('name');
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
 summary.textContent=photos.length?photos.length+' foto selezionate · '+(photos.reduce((sum,file)=>sum+file.size,0)/1_000_000).toFixed(1)+' MB su 8 MB':'Nessuna foto selezionata.';
}
picker.addEventListener('change',()=>{
 const candidates=[...photos];for(const file of picker.files)if(!candidates.some(old=>old.name===file.name&&old.size===file.size&&old.lastModified===file.lastModified))candidates.push(file);
 const message=validatePhotos(candidates);if(message){error.textContent=message+' La nuova selezione non è stata aggiunta.';render();return;}
 photos=candidates;error.textContent='';render();
});
async function connect(){
 gate=null;send.disabled=true;reconnect.disabled=true;connection.textContent='Preparazione invio…';
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),90000);
 try {
  const response=await fetch(API+'/public/config',{credentials:'omit',redirect:'error',signal:controller.signal});
  if(!response.ok)throw new Error();const data=await response.json();
  if(data.protocol!==1||typeof data.challenge!=='string'||data.max_photos!==8||data.max_bytes!==8000000)throw new Error();
  gate={token:data.challenge,receivedAt:Date.now(),readyAt:Date.now()+3100};
  connection.textContent='Puoi inviare la richiesta. Riceverai un codice di conferma dopo il salvataggio.';
  send.disabled=false;
 } catch {connection.textContent='Invio temporaneamente non disponibile. Il testo e le foto restano qui: riprova il collegamento tra poco.';}
 finally{clearTimeout(timer);reconnect.disabled=false;}
}
reconnect.addEventListener('click',()=>{if(!submitting)connect();});
async function fingerprint(payload){
 const material={...payload};delete material.idempotency_key;
 const chunks=[JSON.stringify(material)];
 for(const file of photos){const hash=await crypto.subtle.digest('SHA-256',await file.arrayBuffer());chunks.push([...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join(''));}
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(chunks.join('\n')));
 return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function persist(value){sessionStorage.setItem(storageKey,JSON.stringify(value));pending=value;}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(submitting)return;
 if(!form.reportValidity())return;const message=validatePhotos(photos);if(message){error.textContent=message;return;}
 submitting=true;send.disabled=true;reconnect.disabled=true;picker.disabled=true;error.textContent='';send.textContent='Salvataggio in corso…';
 const controller=new AbortController();let timer;
 try {
  if(!gate||Date.now()-gate.receivedAt>1200000)await connect();
  if(!gate)throw new SubmissionError('Collegamento non disponibile. Riprova più tardi.',false);
  send.disabled=true;reconnect.disabled=true;
  const data=new FormData(form);
  const payload={idempotency_key:pending?.id||crypto.randomUUID(),form_id:'prima-di-pubblicare',form_version:2,workflow_id:'annuncio-da-foto-e-descrizione',
   email:String(data.get('email')||'').trim(),name:String(data.get('name')||'').trim()||null,phone:String(data.get('phone')||'').trim()||null,
   description:String(data.get('description')||'').trim(),city:data.get('city'),intent:data.get('intent'),role:data.get('role'),publication:data.get('publication'),
   service_requested:document.getElementById('service-request').checked,consultation_requested:document.getElementById('consultation').checked};
  const signature=await fingerprint(payload);
  if(pending?.uncertain&&pending.signature!==signature)throw new SubmissionError('Il tentativo precedente ha un esito da verificare. Mantieni gli stessi dati e foto prima di riprovare con il suo codice.');
  await new Promise(resolve=>setTimeout(resolve,Math.max(0,gate.readyAt-Date.now())));
  persist({id:payload.idempotency_key,signature,uncertain:true});
  error.textContent='Codice richiesta: '+pending.id+'. Attendi la conferma senza chiudere la pagina.';
  timer=setTimeout(()=>controller.abort(),90000);
  const receipt=await submitPublic({endpoint:API+'/public/requests',payload,photos,website:String(data.get('website')||''),challenge:gate.token,signal:controller.signal});
  persist({id:receipt.request_id,confirmed:true});
  location.assign('richiesta-inviata.html#'+receipt.request_id);
 } catch(reason) {
  if(reason instanceof SubmissionError&&!reason.ambiguous&&pending)persist({...pending,uncertain:false});
  error.textContent=(reason instanceof SubmissionError?reason.message:'Invio non confermato. Il salvataggio potrebbe essere riuscito.')+
   (pending?.id?' Codice da conservare: '+pending.id+'. Nessun nuovo invio automatico.':'');
  gate=null;
 } finally {
  clearTimeout(timer);submitting=false;picker.disabled=false;send.disabled=false;reconnect.disabled=false;send.textContent='Invia descrizione e foto →';
 }
});
try {
 pending=JSON.parse(sessionStorage.getItem(storageKey)||'null');
 if(pending?.confirmed){sessionStorage.removeItem(storageKey);pending=null;}
 if(pending&&!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(pending.id))throw new Error();
 if(pending)error.textContent='Tentativo precedente da verificare. Codice: '+pending.id+'. Per riprovare usa gli stessi dati e foto.';
 if(typeof DataTransfer!=='function'||!crypto.randomUUID||!crypto.subtle)throw new Error();
 render();connect();
} catch {send.disabled=true;picker.disabled=true;connection.textContent='Per inviare usa un browser aggiornato con memoria di sessione disponibile.';}
window.addEventListener('pageshow',()=>{submitting=false;send.textContent='Invia descrizione e foto →';});

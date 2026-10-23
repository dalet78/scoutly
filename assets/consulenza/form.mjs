import {consultationPayload} from './request.mjs';
import {submitPublic,SubmissionError} from '../prima-di-pubblicare/submit-public-v1.js';
const API='https://scoutly-k76y.onrender.com',KEY='scoutly-consultation-v1';
const form=document.getElementById('consultation-request'),send=document.getElementById('consult-send'),reconnect=document.getElementById('consult-reconnect'),status=document.getElementById('consult-connection'),error=document.getElementById('consult-error');
let gate=null,busy=false,pending=null,storageReady=false,completed=false;
function showReceipt(value){completed=true;form.hidden=true;document.getElementById('consult-code').textContent=value.id;document.getElementById('consult-notice').textContent=value.notice==='accepted'?'La notifica è stata accettata dal servizio email.':'La richiesta è salvata; la notifica email richiede una verifica operativa.';document.getElementById('consult-success').hidden=false;document.getElementById('consult-success').focus();}
async function connect(){
 if(busy||completed||!storageReady)return;
 gate=null;send.disabled=true;reconnect.disabled=true;status.textContent='Collegamento al servizio… Può richiedere fino a un minuto.';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),90000);
 try{
  const response=await fetch(API+'/public/config',{credentials:'omit',redirect:'error',signal:controller.signal});
  if(!response.ok)throw new Error('Non riusciamo a collegarci al servizio. Riprova: nessun dato è stato inviato.');
  const config=await response.json();
  if(config.protocol!==1||typeof config.challenge!=='string')throw new Error('Configurazione non riconosciuta. Nessun dato è stato inviato.');
  if(!config.supported_forms?.some(item=>item.form_id==='consulenza'&&item.form_version===1))throw new Error('Il nuovo modulo consulenza è in preparazione. L’invio sarà disponibile dopo l’attivazione del servizio.');
  gate={token:config.challenge,ready:Date.now()+3100,expires:Date.now()+29*60*1000};
  status.textContent='Puoi inviare la richiesta. La conferma apparirà qui dopo il salvataggio.';send.disabled=false;
 }catch(e){status.textContent=e.name==='AbortError'?'Il servizio sta impiegando più tempo del previsto. Premi “Riprova il collegamento”.':e.message;}
 finally{clearTimeout(timer);reconnect.disabled=false;}
}
reconnect.addEventListener('click',connect);
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||completed)return;if(!form.reportValidity())return;
 if(!gate||Date.now()>gate.expires){await connect();return;}
 if(Date.now()<gate.ready){error.textContent='Attendi qualche secondo dopo il collegamento, poi invia.';return;}
 busy=true;
 let payload,data,hash,id;
 try{
  data=new FormData(form);id=pending?.id||crypto.randomUUID();payload=consultationPayload(data,id);
  hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(payload))))).map(v=>v.toString(16).padStart(2,'0')).join('');
  if(pending&&pending.hash!==hash)throw new Error('Il tentativo precedente va verificato prima di cambiare i dati. Conserva il codice '+pending.id+'.');
  pending={id,hash};sessionStorage.setItem(KEY,JSON.stringify(pending));
 }catch(e){busy=false;error.textContent=e.message;return;}
 busy=true;send.disabled=true;reconnect.disabled=true;form.setAttribute('aria-busy','true');error.textContent='';status.textContent='Salvataggio della richiesta…';send.textContent='Invio in corso…';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),90000);
 try{
  const receipt=await submitPublic({endpoint:API+'/public/requests',payload,photos:[],website:String(data.get('website')||''),challenge:gate.token,signal:controller.signal});
  const saved={...pending,received:true,notice:receipt.email_notice};showReceipt(saved);
  try{sessionStorage.setItem(KEY,JSON.stringify(saved));}catch{}
 }catch(e){
  error.textContent=(e instanceof SubmissionError?e.message:'Esito da verificare.')+' Codice richiesta: '+id+'.';
  status.textContent='La richiesta non è confermata. Conserva il codice e gli stessi dati; non creare un nuovo invio.';
  if(e instanceof SubmissionError&&!e.ambiguous){try{sessionStorage.removeItem(KEY);pending=null;}catch{}}
 }finally{clearTimeout(timer);busy=false;form.removeAttribute('aria-busy');send.disabled=!gate;reconnect.disabled=false;send.textContent='Richiedi il confronto gratuito ↗';}
});
try{
 if(!crypto.randomUUID||!crypto.subtle)throw new Error();
 sessionStorage.setItem(KEY+'-probe','1');sessionStorage.removeItem(KEY+'-probe');pending=JSON.parse(sessionStorage.getItem(KEY)||'null');
 if(pending&&(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(pending.id)||!/^[0-9a-f]{64}$/.test(pending.hash)))throw new Error();
 storageReady=true;
 if(pending?.received)showReceipt(pending);else{if(pending)error.textContent='Tentativo precedente da verificare: '+pending.id+'. Usa gli stessi dati.';connect();}
}catch{status.textContent='Per inviare usa un browser aggiornato con memoria di sessione disponibile.';}

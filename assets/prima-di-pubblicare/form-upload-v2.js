import {submitRequest} from './submit-request-v2.js';
import {MAX_PHOTOS,validatePhotos} from './upload.js';
const form=document.getElementById('request'),picker=document.getElementById('photos'),previews=document.getElementById('photo-previews'),attachments=document.getElementById('photo-attachments'),error=document.getElementById('upload-error'),send=document.getElementById('send'),summary=document.getElementById('photo-summary');
let photos=[],submitting=false,urls=[];
picker.removeAttribute('name');
function fileList(files){const transfer=new DataTransfer();for(const file of files)transfer.items.add(file);return transfer.files;}
function render(){
 for(const url of urls)URL.revokeObjectURL(url);urls=[];previews.replaceChildren();attachments.replaceChildren();
 picker.files=fileList(photos);
 photos.forEach((file,index)=>{
  const input=document.createElement('input');input.type='file';input.name='attachment'+(index+1);input.hidden=true;input.files=fileList([file]);attachments.append(input);
  const card=document.createElement('div');card.className='photo-card';const image=document.createElement('img');const url=URL.createObjectURL(file);urls.push(url);image.src=url;image.alt='Anteprima: '+file.name;
  const name=document.createElement('p');name.className='hint';name.textContent=file.name;
  const remove=document.createElement('button');remove.type='button';remove.className='text-button';remove.textContent='Rimuovi foto '+(index+1);remove.addEventListener('click',()=>{photos.splice(index,1);error.textContent='';render();picker.focus();});
  card.append(image,name,remove);previews.append(card);
 });
 summary.textContent=photos.length?photos.length+' foto selezionate · '+(photos.reduce((sum,file)=>sum+file.size,0)/1_000_000).toFixed(1)+' MB su 8 MB':'Nessuna foto selezionata.';
}
picker.addEventListener('change',()=>{
 const added=[...picker.files];const candidates=[...photos];
 for(const file of added)if(!candidates.some(old=>old.name===file.name&&old.size===file.size&&old.lastModified===file.lastModified))candidates.push(file);
 const message=validatePhotos(candidates);if(message){error.textContent=message+' La nuova selezione non è stata aggiunta.';render();return;}
 photos=candidates;error.textContent='';render();
});
form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(submitting)return;
 const message=validatePhotos(photos);if(message){error.textContent=message;return;}
 if(!form.reportValidity())return;
 document.getElementById('consultation-status').value=document.getElementById('consultation').checked?'Richiesta: rispondere via email per concordare il confronto':'Non richiesta: solo preparazione bozza';
 const body=new FormData(form);body.delete('_next');
 submitting=true;send.disabled=true;send.textContent='Invio in corso…';error.textContent='';form.setAttribute('aria-busy','true');
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),45000);
 try{
  await submitRequest(body,{signal:controller.signal});
  window.location.assign(new URL('richiesta-inviata.html',window.location.href).href);
 }catch(failure){
  error.textContent=failure.code==='activation_required'?'Invio non ancora attivo: Scoutly deve confermare la casella destinataria tramite l’email di attivazione FormSubmit. La richiesta non è confermata. Puoi tornare a Scoutly con il link qui sotto.':'Non possiamo confermare l’invio. I dati e le foto sono ancora qui. Per evitare doppioni non inviare di nuovo prima di aver verificato con Scoutly.';
  error.setAttribute('tabindex','-1');error.focus();send.textContent='Invio da verificare';
 }finally{clearTimeout(timeout);form.removeAttribute('aria-busy');}
});
window.addEventListener('pageshow',()=>{submitting=false;send.disabled=false;send.textContent='Invia descrizione e foto →';});
if(typeof DataTransfer!=='function'){picker.disabled=true;send.disabled=true;error.textContent='Per caricare le foto e inviare usa una versione aggiornata di Chrome, Safari, Edge o Firefox.';}
else render();

import {guidance} from './guidance.mjs';
const form=document.getElementById('guide-form'),result=document.getElementById('guide-result'),list=document.getElementById('guide-tips'),note=document.getElementById('guide-note'),error=document.getElementById('guide-error');
form.addEventListener('submit',event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 try {
  const data=Object.fromEntries(new FormData(form));
  const output=guidance(form.dataset.guide,data);
  list.replaceChildren(...output.tips.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  note.textContent=output.note;error.textContent='';result.hidden=false;
  document.getElementById('guide-result-title').focus();
 } catch {error.textContent='Completa tutte le risposte prima di continuare.';}
});

form.querySelector('button[type="submit"]').disabled=false;

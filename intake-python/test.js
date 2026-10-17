'use strict';
const tokenInput=document.getElementById('token');
const run=document.getElementById('run');
const result=document.getElementById('result');
const savedKey='scoutly-synthetic-test-v1';
let requestId;
try {
  requestId=sessionStorage.getItem(savedKey);
  if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(requestId||'')) {
    requestId=crypto.randomUUID();sessionStorage.setItem(savedKey,requestId);
  }
  document.getElementById('request-id').textContent=requestId;
  run.disabled=false;
} catch {
  result.textContent='La sessione privata non è disponibile: abilita la memoria di sessione per conservare il codice prima della prova.';
}

async function syntheticPhoto(position) {
  const canvas=document.createElement('canvas');canvas.width=96;canvas.height=64;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#d5e7dd';ctx.fillRect(0,0,96,64);
  // Solo geometria: byte stabili senza dipendenze dai font del dispositivo.
  ctx.fillStyle='#183c34';
  for(let n=0;n<position;n++)ctx.fillRect(5+n*11,12,7,40);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw new Error('Impossibile preparare le immagini simulate.');
  return blob;
}

run.addEventListener('click',async()=>{
  let token=tokenInput.value;
  tokenInput.value='';
  if(token.startsWith('sb_')) {result.textContent='Hai inserito una chiave Supabase. Usa invece SCOUTLY_TEST_TOKEN da Render.';return;}
  if(token.length<32) {result.textContent='La chiave della prova deve avere almeno 32 caratteri.';return;}
  run.disabled=true;result.textContent='Salvataggio della prova in corso…';
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),90000);
  try {
    const data=new FormData();
    data.append('payload',JSON.stringify({idempotency_key:requestId,form_id:'prima-di-pubblicare',
      form_version:2,workflow_id:'annuncio-da-foto-e-descrizione',email:'prova@example.com',
      description:'TEST TECNICO SCOUTLY. Materiale interamente simulato per verificare ricezione privata e otto immagini. Non rispondere.',
      city:'Milano Comune',intent:'Vendere',role:'Proprietario',publication:'Bozza in preparazione',
      service_requested:true,consultation_requested:false}));
    for(let position=1;position<=8;position++)data.append('photos',await syntheticPhoto(position),'sintetica-'+position+'.png');
    const pending=fetch('/requests',{method:'POST',headers:{'X-Scoutly-Test-Token':token},body:data,
      credentials:'omit',mode:'same-origin',redirect:'error',signal:controller.signal});
    token='';
    const response=await pending;
    const receipt=await response.json();
    if(!response.ok)throw new Error(typeof receipt.detail==='string'?receipt.detail:'Ricevitore non disponibile.');
    if(receipt.status!=='received'||receipt.request_id!==requestId)throw new Error('Ricevuta non verificabile.');
    result.textContent=(receipt.duplicate?'Prova già ricevuta, senza creare doppioni.':'Prova ricevuta: testo e otto immagini salvati.')+'\nCodice: '+requestId+'\nControlla ora le tabelle e la cartella in Supabase. Email e AI restano disattivate.';
    run.textContent='Verifica lo stesso invio senza creare doppioni';
  } catch(error) {
    result.textContent=(error.name==='AbortError'?'Attesa terminata: esito da verificare.':error.message)+'\nCodice da conservare: '+requestId;
  } finally {
    token='';clearTimeout(timer);run.disabled=false;
  }
});

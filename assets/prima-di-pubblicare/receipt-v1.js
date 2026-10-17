const code=location.hash.slice(1);
const valid=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(code);
if(valid){
 try{
  const pending=JSON.parse(sessionStorage.getItem('scoutly-public-prima-di-pubblicare-v1')||'null');
  if(pending?.confirmed&&pending.id===code){
   document.getElementById('confirmation-heading').textContent='La tua richiesta è salvata.';
   document.getElementById('receipt-message').textContent='Testo e foto inviati sono stati salvati nell’archivio privato Scoutly. Conserva il codice: '+code;
  }
 }catch{}
}

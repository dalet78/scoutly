export class SubmissionError extends Error {
 constructor(message,ambiguous=true){super(message);this.ambiguous=ambiguous;}
}
export async function submitPublic({endpoint,payload,photos,website='',challenge,signal,fetchImpl=fetch}) {
 const body=new FormData();body.append('payload',JSON.stringify(payload));body.append('website',website);
 photos.forEach((photo,index)=>body.append('photos',photo,'foto-'+(index+1)+(photo.type==='image/png'?'.png':'.jpg')));
 let response;
 try {response=await fetchImpl(endpoint,{method:'POST',headers:{'X-Scoutly-Challenge':challenge},body,credentials:'omit',redirect:'error',signal});}
 catch {throw new SubmissionError('Connessione interrotta o attesa terminata. Il salvataggio potrebbe essere riuscito.');}
 let receipt;
 try {receipt=await response.json();}catch {throw new SubmissionError('Risposta non verificabile. Conserva il codice richiesta.');}
 if(!response.ok)throw new SubmissionError(typeof receipt.detail==='string'?receipt.detail:'Invio non riuscito.',response.status>=500||response.status===409);
 if(receipt.status!=='received'||receipt.request_id!==payload.idempotency_key||typeof receipt.duplicate!=='boolean')throw new SubmissionError('Ricevuta non verificabile.');
 return receipt;
}

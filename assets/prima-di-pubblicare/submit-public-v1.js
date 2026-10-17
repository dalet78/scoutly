export class SubmissionError extends Error {
 constructor(message,ambiguous=true){super(message);this.ambiguous=ambiguous;}
}
export function uploadMultipart({endpoint,body,challenge,signal,onProgress,xhrFactory=()=>new XMLHttpRequest()}){
 return new Promise((resolve,reject)=>{
  const xhr=xhrFactory();let done=false;
  const finish=(fn,value)=>{if(done)return;done=true;signal?.removeEventListener('abort',abort);fn(value);};
  const fail=()=>finish(reject,new SubmissionError('Invio non confermato. Il salvataggio potrebbe essere riuscito: conserva il codice.'));
  const abort=()=>{xhr.abort();fail();};
  if(signal?.aborted){fail();return;}
  xhr.open('POST',endpoint,true);xhr.withCredentials=false;xhr.timeout=90000;
  xhr.setRequestHeader('X-Scoutly-Challenge',challenge);
  xhr.upload.onprogress=e=>onProgress?.(e.lengthComputable?Math.min(100,Math.round(100*e.loaded/e.total)):null);
  xhr.upload.onload=()=>onProgress?.(100);
  xhr.onerror=fail;xhr.ontimeout=fail;xhr.onabort=fail;
  xhr.onload=()=>{
   if(xhr.responseURL&&new URL(xhr.responseURL).href!==new URL(endpoint).href){fail();return;}
   finish(resolve,{ok:xhr.status>=200&&xhr.status<300,status:xhr.status,json:async()=>JSON.parse(xhr.responseText)});
  };
  signal?.addEventListener('abort',abort,{once:true});xhr.send(body);
 });
}
export async function submitPublic({endpoint,payload,photos,website='',challenge,signal,fetchImpl,onProgress,xhrFactory}) {
 const body=new FormData();body.append('payload',JSON.stringify(payload));body.append('website',website);
 photos.forEach((photo,index)=>body.append('photos',photo,'foto-'+(index+1)+(photo.type==='image/png'?'.png':'.jpg')));
 let response;
 try {
  if(!fetchImpl&&onProgress&&(xhrFactory||typeof XMLHttpRequest==='function'))response=await uploadMultipart({endpoint,body,challenge,signal,onProgress,xhrFactory});
  else {onProgress?.(null);response=await (fetchImpl||fetch)(endpoint,{method:'POST',headers:{'X-Scoutly-Challenge':challenge},body,credentials:'omit',redirect:'error',signal});}
 }
 catch {throw new SubmissionError('Connessione interrotta o attesa terminata. Il salvataggio potrebbe essere riuscito.');}
 let receipt;
 try {receipt=await response.json();}catch {throw new SubmissionError('Risposta non verificabile. Conserva il codice richiesta.');}
 if(!response.ok)throw new SubmissionError(typeof receipt.detail==='string'?receipt.detail:'Invio non riuscito.',response.status>=500||response.status===409||response.status===0);
 if(receipt.status!=='received'||receipt.request_id!==payload.idempotency_key||typeof receipt.duplicate!=='boolean')throw new SubmissionError('Ricevuta non verificabile.');
 return receipt;
}

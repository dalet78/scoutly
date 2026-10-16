export class DeliveryError extends Error{constructor(code,retryAfterMs=0){super(code);this.code=code;this.retryAfterMs=retryAfterMs;}}
export function notificationText(lead,{includeContact=false}={}){
 const p=lead.property;const lines=[`Scoutly — richiesta ${lead.requestId}`,`Operazione dichiarata: ${p.intent}`,`Comune dichiarato: ${p.city}`,`Pubblicazione: ${p.publication}`,`Tempi dichiarati: ${p.timing}`,`Categoria: ${lead.segment}`];
 if(includeContact)lines.push(`Nome: ${lead.contact.name}`,`Canale richiesto: ${lead.contact.preferredChannel}`,`Email: ${lead.contact.email||'non indicata'}`,`Telefono: ${lead.contact.phone||'non indicato'}`,`Fascia: ${lead.contact.timeSlot}`);
 lines.push('Richiesta volontaria di ricontatto; dati dichiarati, non verificati.');return lines.join('\n');
}
export async function sendNotification(job,lead,config,fetcher=fetch){
 if(!config.liveNotifications)return {status:'simulated',providerId:null};
 let url,options;
 if(job.channel==='email'){
  url='https://api.resend.com/emails';options={method:'POST',headers:{Authorization:`Bearer ${config.resendKey}`,'Content-Type':'application/json','Idempotency-Key':`scoutly-${job.id}`},body:JSON.stringify({from:job.target.from,to:[job.target.to],subject:`Scoutly — nuova richiesta ${lead.requestId.slice(0,8)}`,text:notificationText(lead,{includeContact:true})})};
 }else{
  url=`https://api.telegram.org/bot${config.telegramToken}/sendMessage`;options={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:job.target.chatId,text:notificationText(lead),protect_content:true,link_preview_options:{is_disabled:true}})};
 }
 let response;try{response=await fetcher(url,{...options,redirect:'error',signal:AbortSignal.timeout(config.notificationTimeoutMs)});}catch{throw new DeliveryError('NETWORK_OR_TIMEOUT');}
 if(!response.ok){const retry=Number(response.headers.get('retry-after'));throw new DeliveryError(`HTTP_${response.status}`,Number.isFinite(retry)?Math.min(retry*1000,86400000):0);}
 let data;try{data=await response.json();}catch{throw new DeliveryError('INVALID_PROVIDER_RESPONSE');}
 if(job.channel==='telegram'&&(data.ok!==true||!data.result?.message_id))throw new DeliveryError('TELEGRAM_NOT_CONFIRMED',Math.min(Number(data.parameters?.retry_after)||0,86400)*1000);
 if(job.channel==='email'&&(typeof data.id!=='string'||!data.id))throw new DeliveryError('EMAIL_NOT_CONFIRMED');
 return {status:'sent',providerId:String(job.channel==='email'?data.id:data.result.message_id).slice(0,200)};
}
export async function processNext(store,config,{now=Date.now(),fetcher=fetch}={}){
 const job=store.claim(config,now);if(!job)return false;
 const lead=store.get(job.request_id);if(!lead)return true;
 try{const result=await sendNotification(job,lead,config,fetcher);store.finish(job,result.status,result.providerId);}catch(e){store.fail(job,e instanceof DeliveryError?e.code:'DELIVERY_FAILED',config,now,e instanceof DeliveryError?e.retryAfterMs:0);}
 return true;
}

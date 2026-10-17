import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {submitPublic,SubmissionError} from '../assets/prima-di-pubblicare/submit-public-v1.js';
const id='b3e72074-656e-4184-9ad1-4012ca135fd7';
const endpoint='https://scoutly-k76y.onrender.com/public/requests';
test('sends eight files without credentials and accepts only a matching durable receipt',async()=>{
 let calls=0;
 const result=await submitPublic({endpoint,payload:{idempotency_key:id},photos:Array.from({length:8},()=>new Blob(['synthetic'],{type:'image/png'})),challenge:'public-challenge',fetchImpl:async(url,options)=>{
  calls++;assert.equal(url,endpoint);assert.equal(options.credentials,'omit');assert.equal(options.redirect,'error');
  assert.equal(options.body.getAll('photos').length,8);assert.equal(options.headers['X-Scoutly-Challenge'],'public-challenge');
  assert.equal(options.headers['X-Scoutly-Test-Token'],undefined);
  return {ok:true,json:async()=>({status:'received',request_id:id,duplicate:false})};
 }});
 assert.equal(result.request_id,id);assert.equal(calls,1);
});
for(const variant of ['network','malformed','wrong-code','error'])test('never retries or claims success for '+variant,async()=>{
 let calls=0;
 await assert.rejects(()=>submitPublic({endpoint,payload:{idempotency_key:id},photos:[],challenge:'public-challenge',fetchImpl:async()=>{
  calls++;if(variant==='network')throw Error('offline');
  if(variant==='malformed')return {ok:true,json:async()=>{throw Error('HTML response');}};
  if(variant==='error')return {ok:false,status:503,json:async()=>({detail:'Archivio non disponibile'})};
  return {ok:true,json:async()=>({status:'received',request_id:'different',duplicate:false})};
 }}),SubmissionError);
 assert.equal(calls,1);
});
function ui(sender){
 const elements=Object.fromEntries(['request','photos','photo-previews','upload-error','send','photo-summary','connection-status','reconnect','service-request','consultation'].map(name=>[name,{
  textContent:'',files:[],checked:name==='service-request',removeAttribute(){},replaceChildren(){},
  addEventListener(event,handler){this[event]=handler;},reportValidity(){return true;}
 }]));
 elements.request.fields={email:'owner@example.com',name:'',phone:'',description:'Descrizione simulata da almeno venti caratteri.',city:'Milano Comune',intent:'Vendere',role:'Proprietario',publication:'Bozza in preparazione',website:''};
 const store=new Map(),redirects=[];
 class DataTransfer {items={add:()=>{}};files=[];}
 class FakeFormData{constructor(form){this.form=form;}get(key){return this.form.fields[key];}}
 const context={document:{getElementById:key=>elements[key]},window:{addEventListener(){}},
  sessionStorage:{getItem:key=>store.get(key),setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)},
  crypto:{randomUUID:()=>id,subtle:webcrypto.subtle},DataTransfer,FormData:FakeFormData,TextEncoder,
  AbortController,Date,URL,location:{assign:url=>redirects.push(url)},
  setTimeout:(fn,delay)=>{if(delay<5000)queueMicrotask(fn);return 1;},clearTimeout(){},
  fetch:async()=>({ok:true,json:async()=>({protocol:1,challenge:'signed-public-challenge',max_photos:8,max_bytes:8000000})}),
  validatePhotos:()=>'',submitPublic:sender,SubmissionError};
 const source=readFileSync(new URL('../assets/prima-di-pubblicare/public-form-v1.js',import.meta.url),'utf8').replace(/^import .+;\n/gm,'');
 runInNewContext(source,context);
 return {elements,store,redirects};
}
test('public form redirects only after receipt and stores no contact or description',async()=>{
 const {elements,store,redirects}=ui(async options=>({status:'received',request_id:options.payload.idempotency_key,duplicate:false}));
 await new Promise(setImmediate);await elements.request.submit({preventDefault(){}});
 assert.deepEqual(redirects,['richiesta-inviata.html#'+id]);
 const saved=[...store.values()][0];assert.doesNotMatch(saved,/owner@example|Descrizione simulata/);
 assert.equal(JSON.parse(saved).confirmed,true);
});
test('ambiguous submission keeps one code and prevents changed material from being resent',async()=>{
 let calls=0;
 const {elements,store,redirects}=ui(async()=>{calls++;throw new SubmissionError('Esito incerto');});
 await new Promise(setImmediate);await elements.request.submit({preventDefault(){}});
 assert.equal(JSON.parse([...store.values()][0]).id,id);assert.equal(calls,1);assert.equal(redirects.length,0);
 elements.request.fields.description+=' Modificata.';
 await elements.request.submit({preventDefault(){}});
 assert.equal(calls,1);assert.match(elements['upload-error'].textContent,/stessi dati/);
});

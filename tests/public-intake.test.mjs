import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {formatPrice,parsePrice,municipalityLabel,searchMunicipalities,resolveMunicipality} from '../assets/prima-di-pubblicare/form-ui.js';
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
function ui(sender,options={}){
 const elements=Object.fromEntries(['request','photos','photo-previews','upload-error','send','photo-summary','connection-status','reconnect','service-request','consultation','floor-plan','floor-plan-preview','floor-plan-summary','target-price','municipality','municipality-options','municipality-status','upload-status','upload-progress','upload-status-text'].map(name=>[name,{
  dataset:options.renovation?{formId:'ristrutturare-o-vendere'}:{},setCustomValidity(value){this.validationMessage=value;},setAttribute(){},append(){},textContent:'',files:[],checked:name==='service-request',removeAttribute(){},replaceChildren(){},
  addEventListener(event,handler){this[event]=handler;},reportValidity(){return true;}
 }]));
 elements.request.fields={email:'owner@example.com',name:'',phone:'',description:'Descrizione simulata da almeno venti caratteri.',city:'Milano Comune',intent:'Vendere',role:'Proprietario',publication:'Bozza in preparazione',website:''};
 if(options.renovation)Object.assign(elements.request.fields,{target_price:'300000',area_sqm:'75',zone:'Zona simulata',timeframe:'Sto valutando'});
 elements['target-price'].value='300000';elements.municipality.value='Milano (MI)';
 const store=new Map(),redirects=[];
 class DataTransfer {items={add:()=>{}};files=[];}
 class FakeFormData{constructor(form){this.form=form;}get(key){return this.form.fields[key];}}
 const context={document:{getElementById:key=>elements[key],createElement:()=>({style:{},addEventListener(){},append(){}})},window:{addEventListener(){}},
  sessionStorage:{getItem:key=>store.get(key),setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)},
  crypto:{randomUUID:()=>id,subtle:webcrypto.subtle},DataTransfer,FormData:FakeFormData,TextEncoder,
  AbortController,Date,URL,location:{assign:url=>redirects.push(url)},
  setTimeout:(fn,delay)=>{if(delay<5000)queueMicrotask(fn);return 1;},clearTimeout(){},
  fetch:async(url)=>url.endsWith('comuni.json')?({ok:true,json:async()=>JSON.parse(readFileSync(new URL('../intake-python/comuni.json',import.meta.url),'utf8'))}):({ok:true,json:async()=>({municipality_support:true,protocol:1,challenge:'signed-public-challenge',max_photos:8,max_bytes:8000000,floor_plan_upload:options.planSupported!==false,supported_forms:options.supported===false?[]:[{form_id:'ristrutturare-o-vendere',form_version:1}]})}),
  formatPrice,parsePrice,municipalityLabel,searchMunicipalities,resolveMunicipality,validatePhotos:()=>'',submitPublic:sender,SubmissionError};
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

test('second form carries its own route, price and receipt without leaking contact into session',async()=>{
 let captured;
 const {elements,store,redirects}=ui(async options=>{captured=options.payload;return {status:'received',request_id:id};},{renovation:true});
 await new Promise(setImmediate);
 elements.photos.files=[new File(['synthetic'],'simulata.png',{type:'image/png'})];elements.photos.change();
 await elements.request.submit({preventDefault(){}});
 assert.equal(captured.form_id,'ristrutturare-o-vendere');assert.equal(captured.form_version,1);
 assert.equal(captured.target_price,300000);assert.equal(captured.area_sqm,75);
 assert.deepEqual(redirects,['richiesta-ristrutturare-inviata.html#'+id]);
 assert.ok(store.has('scoutly-public-ristrutturare-o-vendere-v1'));
 assert.doesNotMatch([...store.values()][0],/owner@example|Zona simulata|300000/);
});
test('second form refuses to submit against an older backend or without a photo',async()=>{
 for(const supported of [true,false]){
  let calls=0;const {elements}=ui(async()=>{calls++;},{renovation:true,supported});
  await new Promise(setImmediate);
  if(!supported){elements.photos.files=[new File(['synthetic'],'simulata.png',{type:'image/png'})];elements.photos.change();}
  await elements.request.submit({preventDefault(){}});
  assert.equal(calls,0);
 }
});

test('floor plan stays separate in the UI and is appended with signed routing metadata',async()=>{
 let captured;
 const {elements}=ui(async options=>{captured=options;return {status:'received',request_id:id,duplicate:false};},{renovation:true});
 await new Promise(setImmediate);
 elements.photos.files=[new File(['room'],'stanza.png',{type:'image/png'})];elements.photos.change();
 elements['floor-plan'].files=[new File(['plan'],'piantina.png',{type:'image/png'})];elements['floor-plan'].change();
 await elements.request.submit({preventDefault(){}});
 assert.equal(captured.photos.length,2);assert.equal(captured.photos[1].name,'piantina.png');
 assert.equal(captured.payload.floor_plan_position,2);
 assert.match(elements['floor-plan-summary'].textContent,/piantina/);
});
test('floor plan capability is required before a new form can submit',async()=>{
 let calls=0;
 const {elements}=ui(async()=>{calls++;},{renovation:true,planSupported:false});
 await new Promise(setImmediate);
 elements.photos.files=[new File(['room'],'stanza.png',{type:'image/png'})];elements.photos.change();
 await elements.request.submit({preventDefault(){}});
 assert.equal(calls,0);
});

test('formatted price and selected municipality become validated numeric and geographic payload',async()=>{
 let captured;
 const {elements}=ui(async options=>{captured=options.payload;return {status:'received',request_id:id,duplicate:false};},{renovation:true});
 await new Promise(setImmediate);
 elements['target-price'].value='392000';elements['target-price'].input();
 assert.equal(elements['target-price'].value,'392.000');
 elements.municipality.value='Roma (RM)';elements.municipality.change();
 elements.photos.files=[new File(['room'],'stanza.png',{type:'image/png'})];elements.photos.change();
 await elements.request.submit({preventDefault(){}});
 assert.equal(captured.target_price,392000);assert.equal(captured.municipality_code,'058091');assert.equal(captured.city,'Altro Comune');
});
test('upload progress separates transfer from durable save confirmation',async()=>{
 const {elements,redirects}=ui(async options=>{
  options.onProgress(40);assert.match(elements['upload-status-text'].textContent,/40%/);
  options.onProgress(100);assert.match(elements['upload-status-text'].textContent,/Attendo la conferma/);
  assert.equal(redirects.length,0);return {status:'received',request_id:id,duplicate:false};
 });
 await new Promise(setImmediate);await elements.request.submit({preventDefault(){}});
 assert.deepEqual(redirects,['richiesta-inviata.html#'+id]);
});
test('prices reject negatives and invented decimals while grouping thousands',()=>{
 assert.equal(formatPrice('1234567'),'1.234.567');assert.equal(parsePrice('1.234.567'),1234567);
 for(const value of ['-100','100,50','1.23','Infinity','0','100.000.001'])assert.ok(Number.isNaN(parsePrice(value)));
});
test('Italian catalogue searches accents and provinces and resolves Milano by default',()=>{
 const rows=JSON.parse(readFileSync(new URL('../intake-python/comuni.json',import.meta.url),'utf8'));
 assert.equal(rows.length,7894);assert.equal(resolveMunicipality(rows,'Milano (MI)')[0],'015146');
 assert.ok(searchMunicipalities(rows,'aglie').some(r=>r[1]==='Agliè'));
 assert.equal(resolveMunicipality(rows,'Comune inventato'),null);
});
test('XHR reports bytes without credentials and waits for a matching response',async()=>{
 let xhr,calls=0,settled=false;const progress=[];
 const promise=submitPublic({endpoint,payload:{idempotency_key:id},photos:[],challenge:'challenge',onProgress:p=>progress.push(p),
  xhrFactory:()=>xhr={upload:{},open(method,url){assert.equal(method,'POST');assert.equal(url,endpoint);},setRequestHeader(name,value){assert.equal(name,'X-Scoutly-Challenge');},send(){calls++;},abort(){}}}).then(r=>{settled=true;return r;});
 xhr.upload.onprogress({lengthComputable:true,loaded:50,total:100});xhr.upload.onload();await Promise.resolve();
 assert.deepEqual(progress,[50,100]);assert.equal(settled,false);assert.equal(xhr.withCredentials,false);
 xhr.status=201;xhr.responseURL=endpoint;xhr.responseText=JSON.stringify({status:'received',request_id:id,duplicate:false});xhr.onload();
 assert.equal((await promise).request_id,id);assert.equal(calls,1);
});
test('XHR ambiguous errors do not retry',async()=>{
 let xhr,calls=0;
 const promise=submitPublic({endpoint,payload:{idempotency_key:id},photos:[],challenge:'challenge',onProgress:()=>{},
  xhrFactory:()=>xhr={upload:{},open(){},setRequestHeader(){},send(){calls++;},abort(){}}});
 xhr.onerror();await assert.rejects(promise,SubmissionError);assert.equal(calls,1);
});

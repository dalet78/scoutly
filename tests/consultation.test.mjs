import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {consultationPayload,TOPICS} from '../assets/consulenza/request.mjs';
const data=()=>{const f=new FormData();for(const [k,v] of Object.entries({name:'Prova',email:'prova@example.com',municipality_name:'Roma',consultation_topic:'Vendita',service_request:'on'}))f.set(k,v);return f;};
test('richiesta minima dedicata: nessun annuncio o foto inventati',()=>{
 const p=consultationPayload(data(),'synthetic-id');
 assert.equal(p.form_id,'consulenza');assert.equal(p.workflow_id,'richiesta-consulenza-diretta');assert.equal(p.description,'');assert.equal(p.phone,null);assert.equal(p.consultation_requested,true);
 for(const k of ['role','publication','intent','photos'])assert.equal(k in p,false);
});
test('tutti i quattro argomenti e nessun consenso implicito',()=>{
 for(const topic of TOPICS){const f=data();f.set('consultation_topic',topic);assert.equal(consultationPayload(f,'id').consultation_topic,topic);}
 const f=data();f.delete('service_request');assert.throws(()=>consultationPayload(f,'id'));
});
test('campi obbligatori, lunghezze e argomenti sono validati',()=>{
 for(const [key,value] of [['name','  '],['municipality_name',''],['consultation_topic','Inventato'],['description','x'.repeat(1001)]]){const f=data();f.set(key,value);assert.throws(()=>consultationPayload(f,'id'));}
});
test('home collega direttamente al form e comunica AI più consulente',()=>{
 const h=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(h,/tools\/consulenza.html#percorso/);assert.match(h,/Migliora il tuo annuncio/);assert.match(h,/intelligenza artificiale/);assert.match(h,/anche senza richiederla/);
 const page=readFileSync(new URL('../tools/consulenza.html',import.meta.url),'utf8');
 assert.doesNotMatch(page,/type="file"/);assert.match(page,/Messaggio \(facoltativo\)/);assert.match(page,/role="alert"/);
});

import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {SubmissionError} from '../assets/prima-di-pubblicare/submit-public-v1.js';
const id='9bb581e9-238a-4b8b-9544-a19f924ead24';
function ui(sender,{supported=true,configError=false}={}){
 let now=100000;const store=new Map();
 const ids=['consultation-request','consult-send','consult-reconnect','consult-connection','consult-error','consult-code','consult-notice','consult-success'];
 const el=Object.fromEntries(ids.map(id=>[id,{textContent:'',hidden:false,disabled:false,addEventListener(k,fn){this[k]=fn;},reportValidity(){return true;},setAttribute(){},removeAttribute(){},focus(){}}]));
 el['consultation-request'].fields=data();
 class FakeFormData{constructor(form){this.fields=form.fields;}get(k){return this.fields.get(k);}}
 class Clock extends Date{static now(){return now;}}
 const context={document:{getElementById:k=>el[k]},FormData:FakeFormData,crypto:{randomUUID:()=>id,subtle:webcrypto.subtle},TextEncoder,Uint8Array,Array,AbortController,Date:Clock,SubmissionError,consultationPayload,submitPublic:sender,
 sessionStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
 fetch:async()=>({ok:!configError,json:async()=>({protocol:1,challenge:'synthetic',supported_forms:supported?[{form_id:'consulenza',form_version:1}]:[]})}),setTimeout:()=>1,clearTimeout(){}};
 const source=readFileSync(new URL('../assets/consulenza/form.mjs',import.meta.url),'utf8').replace(/^import .+;\n/gm,'');
 runInNewContext(source,context);
 return {el,store,advance:()=>{now+=4000;}};
}
test('modulo disabilitato quando il backend non supporta la consulenza',async()=>{
 const {el}=ui(async()=>{throw Error('not called');},{supported:false});
 await new Promise(setImmediate);
 assert.equal(el['consult-send'].disabled,true);assert.match(el['consult-connection'].textContent,/in preparazione/);
});
test('ricevuta visibile solo dopo salvataggio, sessione senza recapiti',async()=>{
 let calls=0;const {el,store,advance}=ui(async o=>{calls++;assert.equal(o.photos.length,0);return {request_id:id,status:'received',duplicate:false,email_notice:'accepted'};});
 await new Promise(setImmediate);advance();await el['consultation-request'].submit({preventDefault(){}});
 assert.equal(calls,1);assert.equal(el['consultation-request'].hidden,true);assert.equal(el['consult-success'].hidden,false);
 const saved=JSON.parse(store.get('scoutly-consultation-v1'));assert.equal(saved.received,true);
 assert.doesNotMatch(JSON.stringify(saved),/prova@example|Roma|Vendita/);
 await el['consultation-request'].submit({preventDefault(){}});assert.equal(calls,1);
});
test('errore ambiguo conserva il codice e blocca dati modificati',async()=>{
 let calls=0;const {el,store,advance}=ui(async()=>{calls++;throw new SubmissionError('Esito incerto');});
 await new Promise(setImmediate);advance();await el['consultation-request'].submit({preventDefault(){}});
 assert.equal(JSON.parse(store.get('scoutly-consultation-v1')).id,id);assert.match(el['consult-error'].textContent,/Codice richiesta/);
 el['consultation-request'].fields.set('municipality_name','Torino');
 await el['consultation-request'].submit({preventDefault(){}});
 assert.equal(calls,1);assert.match(el['consult-error'].textContent,/stessi dati|prima di cambiare/);
});

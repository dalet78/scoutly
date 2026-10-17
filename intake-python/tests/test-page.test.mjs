import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../test.js',import.meta.url),'utf8');
const id='b3e72074-656e-4184-9ad1-4012ca135fd7';
function page(fetch) {
 const elements=Object.fromEntries(['token','run','result','request-id'].map(key=>[key,{value:'',textContent:'',addEventListener(event,fn){this.click=fn;}}]));
 const storage=new Map();
 const context={document:{getElementById:key=>elements[key],createElement:()=>({getContext:()=>({fillRect(){}}),toBlob:fn=>fn(new Blob(['synthetic'],{type:'image/png'}))})},
  sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},
  crypto:{randomUUID:()=>id},setTimeout,clearTimeout,fetch,Blob,FormData,AbortController};
 runInNewContext(source,context);
 return {elements,storage};
}
test('secret is sent only in the same-origin header, field cleared, duplicate uses same ID',async()=>{
 const calls=[];
 const {elements,storage}=page(async(url,options)=>{
  calls.push({url,options});
  assert.equal(elements.token.value,'');
  return {ok:true,json:async()=>({status:'received',request_id:id,duplicate:calls.length>1})};
 });
 for(let i=0;i<2;i++){
  elements.token.value='private-test-'.padEnd(40,'x');
  await elements.run.click();
 }
 assert.equal(calls.length,2);
 for(const {url,options} of calls){
  assert.equal(url,'/requests');assert.equal(options.redirect,'error');assert.equal(options.credentials,'omit');
  assert.equal(options.body.getAll('photos').length,8);
  assert.equal(JSON.parse(options.body.get('payload')).idempotency_key,id);
 }
 assert.match(elements.result.textContent,/senza creare doppioni/);
 assert.deepEqual([...storage.values()],[id]);
});
test('network ambiguity never retries automatically or claims success',async()=>{
 let count=0;
 const {elements}=page(async()=>{count++;throw new Error('Connessione interrotta');});
 elements.token.value='private-test-'.padEnd(40,'x');
 await elements.run.click();
 assert.equal(count,1);assert.equal(elements.token.value,'');
 assert.match(elements.result.textContent,/Codice da conservare/);
 assert.doesNotMatch(elements.result.textContent,/immagini salvati/);
});
test('rejects a Supabase key before sending anything',async()=>{
 let count=0;const {elements}=page(async()=>{count++;});
 elements.token.value='sb_secret_synthetic';await elements.run.click();
 assert.equal(count,0);assert.equal(elements.token.value,'');
 assert.match(elements.result.textContent,/SCOUTLY_TEST_TOKEN/);
});

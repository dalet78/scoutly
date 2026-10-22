import test from 'node:test';
import assert from 'node:assert/strict';
import {guidance} from '../assets/seller-guides/guidance.mjs';
import {readFileSync} from 'node:fs';
test('photos: missing lighting and rooms produce targeted limited advice',()=>{
 const r=guidance('fotografie',{luce:'da-fare',ambienti:'parziale',ordine:'pronto'});
 assert.equal(r.tips.length,3);assert.match(r.tips[0],/luce naturale/);assert.match(r.tips[1],/bagno e cucina/);assert.match(r.note,/Non abbiamo esaminato/);
});
test('prepared photos do not become a quality score or guarantee',()=>{
 const r=guidance('fotografie',{luce:'pronto',ambienti:'pronto',ordine:'pronto'});
 assert.equal(r.tips.length,2);assert.match(r.tips[0],/Hai indicato/);assert.match(r.note,/non stiamo misurando/);
});
test('checklist: missing documents generate an inventory step, not a certificate',()=>{
 const r=guidance('checklist',{dati:'pronto',documenti:'da-fare',prezzo:'pronto'});
 assert.match(r.tips[0],/inventario/);assert.match(r.note,/non una verifica/);
});
test('incomplete and unknown inputs never generate a reassuring result',()=>{
 assert.throws(()=>guidance('checklist',{dati:'pronto',documenti:'parziale'}));
 assert.throws(()=>guidance('fotografie',{luce:'made-up',ambienti:'pronto',ordine:'pronto'}));
 assert.throws(()=>guidance('other',{}));
});
test('all answer combinations return only 2-3 tips and a limitation',()=>{
 for(const kind of ['fotografie','checklist'])for(const a of ['pronto','parziale','da-fare'])for(const b of ['pronto','parziale','da-fare'])for(const c of ['pronto','parziale','da-fare']){
  const keys=kind==='fotografie'?['luce','ambienti','ordine']:['dati','documenti','prezzo'];
  const r=guidance(kind,Object.fromEntries(keys.map((k,i)=>[k,[a,b,c][i]])));
  assert.ok(r.tips.length>=2&&r.tips.length<=3);assert.ok(r.note.length>20);
 }
});
test('new pages show local tips and use existing voluntary consultation route',()=>{
 const app=readFileSync(new URL('../assets/seller-guides/app.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(app,/fetch\(|XMLHttpRequest|localStorage|sessionStorage/);
 for(const page of ['fotografie-casa','checklist-vendere-casa']){
  const html=readFileSync(new URL('../tools/'+page+'.html',import.meta.url),'utf8');
  assert.match(html,/href="prima-di-pubblicare.html#percorso"/);assert.match(html,/id="guide-result"[^>]*hidden/);
  assert.doesNotMatch(html,/name="email"|name="phone"/);
 }
});

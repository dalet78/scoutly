import test from 'node:test';
import assert from 'node:assert/strict';
import {contextualDescription} from '../assets/seller-guides/request-context.mjs';
import {readFileSync} from 'node:fs';
test('ordinary requests retain their original description',()=>assert.equal(contextualDescription(undefined,'Testo originale'),'Testo originale'));
test('photo answers travel in the signed request description, not an on-page result',()=>{
 const d=contextualDescription('fotografie-casa','Descrizione del proprietario',{luce:'pronto',ambienti:'parziale',ordine:'da-fare'});
 assert.match(d,/^SCOUTLY_REQUEST_TOPIC: fotografie-casa\n/);assert.match(d,/Luce e leggibilità: Preparato/);assert.match(d,/Ambienti mostrati: Parziale/);assert.match(d,/Descrizione del proprietario$/);
});
test('checklist has its own unambiguous topic and declared answers',()=>{
 const d=contextualDescription('checklist-vendere-casa','Contesto',{dati:'pronto',documenti:'da-fare',prezzo:'parziale'});
 assert.match(d,/^SCOUTLY_REQUEST_TOPIC: checklist-vendere-casa\n/);assert.match(d,/Inventario documenti: Da preparare o verificare/);
});
test('unknown topics, invalid answers and oversized content are rejected',()=>{
 assert.throws(()=>contextualDescription('unknown','Testo',{}));
 assert.throws(()=>contextualDescription('fotografie-casa','Testo',{luce:'made-up',ambienti:'pronto',ordine:'pronto'}));
 assert.throws(()=>contextualDescription('checklist-vendere-casa','x'.repeat(4000),{dati:'pronto',documenti:'pronto',prezzo:'pronto'}));
});
test('new pages request an email response and remain paused until the AI agent is ready',()=>{
 for(const path of ['fotografie-casa','checklist-vendere-casa']){
  const html=readFileSync(new URL('../tools/'+path+'.html',import.meta.url),'utf8');
  assert.match(html,new RegExp('data-request-topic="'+path+'"'));assert.match(html,/data-request-topic-ready="false"/);
  assert.match(html,/type="email"/);assert.match(html,/public-form-v1.js\?v=ten-files/);
  assert.doesNotMatch(html,/guide-result|guide-tips|Mostra i primi suggerimenti|seller-guides\/app.mjs/);
 }
 const script=readFileSync(new URL('../assets/prima-di-pubblicare/public-form-v1.js',import.meta.url),'utf8');
 assert.match(script,/requestTopicReady!=='true'/);assert.match(script,/payload.description=contextualDescription/);
});


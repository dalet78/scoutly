import {analyzePosts,AGENTS,canonicalUrl,safeUrl,today} from './agents.js';
import {validatePost,validateCheck,parseBackup,csvCell,mergePost} from './state.js';
const $=id=>document.getElementById(id),KEY='scoutly.demo.v2';
let data,posts=[],report,editingUrl=null;
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=String(text);if(cls)e.className=cls;return e;};
function link(text,url){const a=el('a',text,'link'),valid=safeUrl(url);if(valid){a.href=valid;a.target='_blank';a.rel='noopener noreferrer';}return a;}
function button(text,fn){const b=el('button',text);b.type='button';b.onclick=fn;return b;}
function save(){try{localStorage.setItem(KEY,JSON.stringify({schemaVersion:2,posts}));$('storageMessage').textContent='Aggiunte e verifiche salvate in questo browser.';}catch{$('storageMessage').textContent='Salvataggio locale non disponibile: esporta il JSON per conservare il lavoro.';}}
function reevaluate(persist=false){report=analyzePosts(posts);render();if(persist)save();}
function evidence(parent,list){for(const e of list){const q=el('div',null,'quote');q.append(el('div',`«${e.quote}»`),el('div',e.date?`Dichiarazione: ${e.date}`:'Data della dichiarazione non verificata','sub'));if(e.url)q.append(link('Fonte della prova ↗',e.url));parent.append(q);}}
function render(){
  if(!report)return;
  const {summary}=report;$('count').textContent=summary.acquired;$('candidateCount').textContent=summary.selected+summary.review;$('excludedCount').textContent=summary.excluded;$('confirmedCount').textContent=report.records.filter(r=>r.decision!=='excluded'&&r.availability.status==='available').length;
  const view=$('view').value,category=$('filter').value,source=$('sourceFilter').value;
  const visible=report.records.filter(r=>(view==='all'||view==='candidates'&&r.decision!=='excluded'||view===r.decision)&&(!category||r.category===category)&&(!source||r.sourceType===source));
  $('resultsMeta').textContent=`${visible.length} risultati in questa vista · ${summary.duplicates} duplicati esclusi · ${summary.review} da verificare`;
  $('results').replaceChildren();if(!visible.length)$('results').append(el('p','Nessun risultato in questa selezione.','empty'));
  for(const r of visible){
    const c=el('article',null,'card');c.dataset.record=r.recordId;
    c.append(el('div',`${data.sources[r.source]?.name||'Fonte'} · ${r.location||'Comune di Milano'}`,'label'),el('h3',r.title||'Annuncio acquisito'));
    const amount=Number(String(r.price||'').replaceAll('.','').replace(',','.'));const formatted=r.price&&Number.isFinite(amount)?new Intl.NumberFormat('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2}).format(amount):r.price;
    c.append(el('div',r.price?`€ ${formatted}`:'Prezzo da rilevare','price'));const details=[r.operation==='vendita'?'prezzo richiesto':'canone mensile',r.area?`${r.area} m²`:null,r.expenses].filter(Boolean);c.append(el('div',details.join(' · '),'sub'));
    c.append(el('span',{selected:'Selezionato',review:'Da verificare',excluded:'Escluso'}[r.decision],`badge ${r.decision}`),el('span',r.category,'badge'));
    if(r.author)c.append(el('p',`Autore visibile: ${r.author}`,'sub'));
    const signal=r.evidence.filter(e=>!['weak','tenant'].includes(e.kind));if(signal.length)c.append(el('div',signal.map(e=>`«${e.quote}»`).join(' · '),'evidence'));
    if(r.decision!=='excluded'){
      const checks=el('div',null,'checks');for(const [heading,assessment] of [['Disponibilità',r.availability],['Incarico ad agenzia',r.agency]]){const box=el('div',null,'check');box.append(el('div',heading,'label'),el('strong',assessment.label),el('p',assessment.reason));checks.append(box);}c.append(checks);
    }
    if(r.reasons.length){const list=el('ul',null,'reasons');for(const reason of [...new Set(r.reasons)])list.append(el('li',reason));c.append(list);}
    if(r.duplicateOf){const target=report.records.find(other=>other.recordId===r.duplicateOf);if(target)c.append(link('Annuncio conservato ↗',target.url));}
    if(r.possibleDuplicateGroup){c.append(el('p',r.possibleDuplicateEvidence,'sub'));for(const other of report.records.filter(o=>o.recordId!==r.recordId&&o.possibleDuplicateGroup===r.possibleDuplicateGroup))c.append(link('Confronta il possibile duplicato ↗',other.url));}
    const d=el('details',null,'history');d.append(el('summary','Testo acquisito, prove e cronologia'),el('p',r.text,'full'));
    d.append(el('p',`${r.textComplete===false?'Estratti / testo parziale':'Testo completo'} · raccolta ${r.collectedAt||'non datata'} · pubblicazione ${r.publishedAt||'non verificata'}`,'sub'));
    if(r.sourceAccess)d.append(el('p',r.sourceAccess,'sub'));if(r.notes)d.append(el('p',r.notes,'sub'));if(r.cityEvidence)d.append(el('p',`Comune: ${r.cityEvidence}`,'sub'));
    evidence(d,[...r.availability.evidence,...r.agency.evidence]);for(const p of r.agency.possible){d.append(el('p','Possibile annuncio d’agenzia: '+p.matchReason,'sub'));if(p.url)d.append(link('Confronta la fonte ↗',p.url));}
    for(const check of r.checks||[]){const n=el('p',`${check.date} · ${check.kind.replaceAll('_',' ')}: ${check.text}`,'quote');d.append(n);if(check.url)d.append(link('Riferimento registrato ↗',check.url));}
    if(r.history?.length)d.append(el('p',`${r.history.length} versioni precedenti del testo conservate nel backup.`,'sub'));
    c.append(d,link('Apri l’annuncio originale ↗',r.url));
    const actions=el('div',null,'actions');if(!r.duplicateOf){actions.append(button('Registra verifica',()=>openVerification(r)),button('Prepara domande',()=>openQuestions(r)));}c.append(actions);$('results').append(c);
  }
}
function openVerification(r){editingUrl=canonicalUrl(r.url);$('verificationForm').reset();$('verificationTitle').textContent=r.title||r.url;$('verificationMessage').textContent='';$('checkDate').value=today();$('verificationDialog').showModal();}
function openQuestions(r){$('questionsText').textContent=`Buongiorno, in merito all’annuncio ${r.url}:\n\n1. È lei il proprietario dell’immobile?\n2. L’immobile è ancora disponibile? Da quale data?\n3. Ha già affidato la vendita o la locazione a un’agenzia? C’è un incarico in esclusiva?\n\nGrazie.`;$('questionsDialog').showModal();}
function upsert(post){const index=posts.findIndex(p=>canonicalUrl(p.url)===canonicalUrl(post.url));if(index<0){posts.push(post);return false;}posts[index]=mergePost(posts[index],post);return true;}
try{
  const [base,extra]=await Promise.all(['data.json','research.json'].map(async file=>{const r=await fetch(file);if(!r.ok)throw Error('Dati non disponibili');return r.json();}));
  data={...base,sources:[...base.sources,...extra.sources]};const original=base.posts.map(p=>({...p,sourceType:'facebook',operation:'affitto',textComplete:true,expenses:'circa €150 di spese condominiali',...extra.originalCheck}));
  posts=[...original,...extra.posts.map(p=>({...p,text:p.textRef?original.find(o=>o.id===p.textRef)?.text:p.text,collectedAt:extra.collectedAt,lastReadAt:extra.collectedAt,publishedAt:null}))];
  let cached=null;try{cached=localStorage.getItem(KEY);}catch{$('storageMessage').textContent='Salvataggio locale non disponibile; usa il backup JSON.';}if(cached){try{for(const p of parseBackup(JSON.parse(cached)))upsert(p);$('storageMessage').textContent='Lavoro locale ripristinato.';}catch{$('storageMessage').textContent='Il salvataggio locale non è leggibile. Il campione originale resta disponibile.';}}
  for(const [index,[name,task]] of AGENTS.entries()){const a=el('div',null,'agent');a.append(el('div',String(index+1).padStart(2,'0'),'number'));const content=el('div');content.append(el('strong',name),el('p',task));if(name==='Publisher')content.append(link('Repository GitHub ↗','https://github.com/dalet78/scoutly/tree/main/radar'));a.append(content);$('agents').append(a);}
  for(const source of data.sources){const c=el('div',null,'source');c.append(el('h3',source.name),el('div',source.status,'badge'),el('p',source.note),link('Apri la fonte ↗',source.url));$('sources').append(c);}
  reevaluate();
}catch{$('message').textContent='Impossibile caricare il campione. Ricarica la pagina o avvia la demo via web.';}
for(const id of ['view','filter','sourceFilter'])$(id).addEventListener('change',render);
$('add').onclick=()=>{$('form').reset();$('formMessage').textContent='';$('cityRow').classList.add('hidden');$('dialog').showModal();};$('close').onclick=()=>$('dialog').close();$('verificationClose').onclick=()=>$('verificationDialog').close();$('questionsClose').onclick=()=>$('questionsDialog').close();
for(const id of ['published','checkDate'])$(id).max=today();
$('group').onchange=()=>$('cityRow').classList.toggle('hidden',$('group').value!=='2');
$('form').onsubmit=e=>{e.preventDefault();if(!data)return;try{const source=Number($('group').value);if(source===2&&!$('cityCheck').checked)throw Error('Conferma il comune di Milano nella scheda.');const p=validatePost({source,url:$('url').value,title:$('title').value,author:$('author').value,text:$('text').value,textComplete:$('complete').checked,publishedAt:$('published').value||null,operation:$('operation').value,city:source===2?'Milano':undefined,cityEvidence:source===2?'Milano (MI), verificato nella scheda dall’operatore':undefined});if(posts.length>=500&&!posts.some(o=>canonicalUrl(o.url)===p.url))throw Error('Limite della demo: 500 annunci.');const updated=upsert(p);$('view').value='all';$('filter').value='';$('sourceFilter').value='';reevaluate(true);$('dialog').close();$('message').textContent=updated?'Annuncio aggiornato e rivalutato; cronologia conservata.':'Annuncio acquisito: consulta l’esito e le eventuali motivazioni di esclusione.';}catch(error){$('formMessage').textContent=error.message;}};
$('verificationForm').onsubmit=e=>{e.preventDefault();try{const raw={kind:$('checkKind').value,date:$('checkDate').value,url:$('checkUrl').value,text:$('checkText').value,matchReason:$('matchReason').value,sameProperty:$('checkRelated').checked};const proof=validateCheck(raw);const p=posts.find(p=>canonicalUrl(p.url)===editingUrl);if(!p)throw Error('Annuncio non trovato.');if(proof.kind==='duplicato_confermato'&&!report.records.some(r=>canonicalUrl(r.url)===canonicalUrl(proof.url)&&canonicalUrl(r.url)!==editingUrl&&r.decision!=='excluded'))throw Error('Indica il collegamento di un altro candidato da conservare.');p.checks=[...(p.checks||[]),proof];p.lastReadAt=today();reevaluate(true);$('verificationDialog').close();$('message').textContent='Verifica registrata. Disponibilità, incarico ed esito sono stati rivalutati.';}catch(error){$('verificationMessage').textContent=error.message;}};
function download(name,body,type){const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export').onclick=()=>{if(data)download('scoutly-backup.json',JSON.stringify({schemaVersion:2,sources:data.sources,posts,report,exportedAt:new Date().toISOString()},null,2),'application/json');};
$('csv').onclick=()=>{if(!report)return;const rows=[['Titolo','Fonte','Comune/zona','Prezzo','Spese','Esito','Inserzionista','Disponibilità','Incarico agenzia','Motivazioni','URL'],...report.records.map(r=>[r.title,data.sources[r.source]?.name,r.location||r.city,r.price,r.expenses,r.decision,r.category,r.availability.label,r.agency.label,r.reasons.join(' | '),r.url])];download('scoutly-risultati.csv','\ufeff'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n'),'text/csv;charset=utf-8');};
$('import').onclick=()=>$('backup').click();$('backup').onchange=async()=>{const file=$('backup').files[0];if(!file)return;try{if(file.size>10_000_000)throw Error('Il file supera 10 MB.');const incoming=parseBackup(JSON.parse(await file.text()));const old=[...posts];try{for(const p of incoming)upsert(p);if(posts.length>500)throw Error('Limite di 500 annunci superato.');}catch(error){posts=old;throw error;}reevaluate(true);$('message').textContent=`Backup importato: ${incoming.length} annunci rivalutati.`;}catch(error){$('message').textContent='Importazione non eseguita: '+error.message;}finally{$('backup').value='';}};

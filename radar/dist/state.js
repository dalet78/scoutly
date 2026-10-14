import {canonicalUrl,safeUrl,validDate,today} from './agents.js';
export const GROUPS=['affittimilanoprivati','1551721571652397',null,'1162454953883711',null];
const kinds=['risposta_proprietario','aggiornamento','annuncio_agenzia','nota','duplicato_confermato'];
const s=(v,max=20000)=>String(v??'').slice(0,max);
export function validatePost(raw,now=today()){
  if(!raw||typeof raw!=='object')throw Error('Annuncio non valido.');
  const source=Number(raw.source);if(!Number.isInteger(source)||source<0||source>4)throw Error('Fonte non riconosciuta.');
  const url=canonicalUrl(raw.url);if(!url)throw Error('Serve un collegamento HTTPS valido.');const u=new URL(url);
  if(source===2||source===4){if(u.hostname!=='www.subito.it'||!/^\/[a-z-]+\/[^/]+-\d+\.htm$/.test(u.pathname))throw Error('Inserisci il collegamento diretto a una scheda Subito.it.');if(raw.city!=='Milano'||!raw.cityEvidence)throw Error('Verifica nella scheda il comune di Milano (MI).');}
  else if(u.hostname!=='www.facebook.com'||!new RegExp(`^/groups/${GROUPS[source]}/posts/[0-9]+$`).test(u.pathname))throw Error('Inserisci il collegamento diretto a un post del gruppo selezionato.');
  if(String(raw.text||'').trim().length<10||String(raw.text||'').length>20000)throw Error('Inserisci un testo tra 10 e 20.000 caratteri.');
  if(raw.publishedAt&&!validDate(raw.publishedAt,now))throw Error('La data di pubblicazione non è valida o è futura.');
  const post={url,source,sourceType:source===2||source===4?'subito':'facebook',title:s(raw.title,160),author:s(raw.author,100),text:s(raw.text),textComplete:raw.textComplete!==false,publishedAt:raw.publishedAt||null,collectedAt:validDate(raw.collectedAt,now)?raw.collectedAt:now,lastReadAt:validDate(raw.lastReadAt,now)?raw.lastReadAt:now,operation:['affitto','vendita'].includes(raw.operation)?raw.operation:source===4?'vendita':'affitto',checks:[]};
  for(const field of ['id','location','expenses','notes','sourceAccess','city','cityEvidence','possibleDuplicateGroup','possibleDuplicateEvidence','advertiserEvidence','sourceRemovalEvidence','publishedLabel','email','contactEmail','phone','telephone','contactPhone'])if(raw[field])post[field]=s(raw[field],1000);
  if(raw.price!=null)post.price=s(raw.price,25);if(raw.area!=null)post.area=s(raw.area,25);
  if(raw.advertiserType==='professional'&&raw.advertiserEvidence)post.advertiserType='professional';
  post.locationConflict=raw.locationConflict===true;
  post.sourceRemoved=raw.sourceRemoved===true&&Boolean(raw.sourceRemovalEvidence);
  if(raw.checks){if(!Array.isArray(raw.checks)||raw.checks.length>100)throw Error('Troppi elementi nella cronologia.');post.checks=raw.checks.map(c=>validateCheck(c,now));}
  if(raw.history){if(!Array.isArray(raw.history)||raw.history.length>30)throw Error('Troppi aggiornamenti del testo.');post.history=raw.history.map(h=>({text:s(h.text),url:safeUrl(h.url)||null,publishedAt:validDate(h.publishedAt,now)?h.publishedAt:null,lastReadAt:validDate(h.lastReadAt,now)?h.lastReadAt:null}));}
  return post;
}
export function validateCheck(raw,now=today()){
  if(!raw||!kinds.includes(raw.kind))throw Error('Tipo di verifica non riconosciuto.');
  if(!validDate(raw.date,now))throw Error('Indica una data reale, non futura.');
  if(String(raw.text||'').trim().length<10||String(raw.text||'').length>5000)throw Error('Riporta la prova testuale (10–5.000 caratteri).');
  if(raw.url&&!safeUrl(raw.url))throw Error('Il collegamento alla prova deve essere HTTPS.');
  if(raw.kind!=='nota'&&raw.sameProperty!==true)throw Error('Conferma che la prova riguarda questo immobile.');
  if(raw.kind==='duplicato_confermato'&&(!raw.url||String(raw.matchReason||'').trim().length<20))throw Error('Indica il collegamento al risultato da conservare e almeno 20 caratteri sui riscontri del confronto.');
  return {kind:raw.kind,text:s(raw.text,5000),url:raw.url?canonicalUrl(raw.url):null,date:raw.date,observedAt:now,sameProperty:raw.sameProperty===true,matchReason:s(raw.matchReason,500),authorRole:raw.authorRole==='altro'?'altro':undefined};
}
export function parseBackup(raw,now=today()){
  if(raw?.schemaVersion!==2||!Array.isArray(raw.posts)||raw.posts.length>500)throw Error('Serve un backup Scoutly versione 2, fino a 500 annunci.');
  // Valida l'intero file prima di modificare lo stato: importazione atomica.
  return raw.posts.map(p=>validatePost(p,now));
}
export function csvCell(value){const t=String(value??'');return '"'+(/^[\s]*[=+@-]/.test(t)?"'"+t:t).replaceAll('"','""')+'"';}
export function mergePost(old,incoming){
  const versions=[...(old.history||[]),...(incoming.history||[])];
  if(old.text!==incoming.text)versions.push({text:old.text,url:old.url,publishedAt:old.publishedAt||null,lastReadAt:old.lastReadAt});
  const history=versions.filter((h,i,a)=>a.findIndex(o=>o.text===h.text&&o.publishedAt===h.publishedAt&&canonicalUrl(o.url)===canonicalUrl(h.url))===i).slice(-30);
  const checks=[...(old.checks||[]),...(incoming.checks||[])].filter((c,i,a)=>a.findIndex(o=>o.kind===c.kind&&o.text===c.text&&o.date===c.date&&canonicalUrl(o.url)===canonicalUrl(c.url)&&o.matchReason===c.matchReason&&o.sameProperty===c.sameProperty&&o.authorRole===c.authorRole)===i);
  return {...old,...incoming,checks,history};
}
export function seedFingerprint(post){return JSON.stringify(['text','title','textComplete','price','operation','sourceRemoved','sourceRemovalEvidence','advertiserType','advertiserEvidence','publishedAt','sourceAccess','notes'].map(field=>field==='price'&&post[field]!=null?String(post[field]):post[field]??null));}
export function restoreCachedPosts(seed,cached,fingerprints={}){
  const restored=seed.map(p=>({...p}));
  for(const saved of cached){const key=canonicalUrl(saved.url),index=restored.findIndex(p=>canonicalUrl(p.url)===key);if(index<0){restored.push(saved);continue;}
    const current=restored[index];
    if(seedFingerprint(saved)===seedFingerprint(current)){restored[index]=mergePost(current,{...current,checks:saved.checks||[],history:saved.history||[]});continue;}
    if(fingerprints[key]===seedFingerprint(current)){restored[index]=mergePost(current,saved);continue;}
    // Una raccolta online cambiata prevale sul vecchio snapshot locale. Le prove restano.
    const history=[...(saved.history||[])];if(saved.text!==current.text)history.push({text:saved.text,url:saved.url,publishedAt:saved.publishedAt||null,lastReadAt:saved.lastReadAt});
    restored[index]=mergePost(current,{...current,checks:saved.checks||[],history});
  }
  return restored;
}

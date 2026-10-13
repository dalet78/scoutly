// Cinque agenti a regole spiegabili: nessuna scansione remota nascosta.
export const AGENTS=[['Scout','Individua offerte immobiliari.'],['Analista','Distingue privati e operatori dalle dichiarazioni.'],['Filtro','Esclude intermediari, duplicati e annunci non validi.'],['Disponibilità','Valuta dichiarazioni datate e segnala conferme mancanti.'],['Incarico','Valuta se è dichiarata un’agenzia già incaricata.'],['Publisher','Pubblica il codice verificato in dalet78/scoutly. Agente della chat, senza credenziali nel sito.']];
export const POLICY={availabilityDays:7,agencyDays:30};
export function today(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Jerusalem'}).format(new Date());}
const norm=t=>String(t||'').normalize('NFKC').toLowerCase().replace(/[\u200b-\u200f\u034f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function safeUrl(v){try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function canonicalUrl(v){const valid=safeUrl(v);if(!valid)return null;const u=new URL(valid);u.hash='';for(const key of [...u.searchParams.keys()])if(/^(utm_|__|ref|rdid|share_url)/i.test(key))u.searchParams.delete(key);if(['facebook.com','m.facebook.com','www.facebook.com'].includes(u.hostname)){u.hostname='www.facebook.com';u.pathname=u.pathname.replace('/302986582307/','/affittimilanoprivati/').replace('/permalink/','/posts/');}u.pathname=u.pathname.replace(/\/+$/,'');return u.href;}
function dateMs(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(v)))return null;const d=new Date(v+'T00:00:00Z');return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===v?+d:null;}
export function validDate(v,now=today()){return dateMs(v)!==null&&dateMs(v)<=dateMs(now);}
function age(date,now){const a=dateMs(date),b=dateMs(now);return a===null||b===null?null:(b-a)/86400000;}
function question(text,start,end){const after=text.slice(end).split(/[.!\n]/)[0],before=text.slice(0,start).split(/[.!?\n]/).pop();return after.includes('?')||/\b(?:se|qualora|vorrei|volevo|sapere se|chiedo se|cerco)\b/i.test(before);}
function signals(text,rules){const t=String(text||'').normalize('NFKC'),out=[];for(const [kind,rule,re] of rules)for(const m of t.matchAll(re))if(!question(t,m.index,m.index+m[0].length))out.push({kind,rule,quote:m[0],start:m.index,end:m.index+m[0].length});return out;}
export function classifyAdvertiser(text,post={}){
  const t=String(text||'').normalize('NFKC');let evidence=signals(t,[
    ['private','dichiarazione privato',/\bprivato\s*[-–:]\s*no\s+agenzi[ae]\b|\bprivat[oa]\s+(?:vende|affitta)\b|\bda\s+privato(?:\s+a\s+privato)?\b|\b(?:sono|siamo)\s+(?:il\s+|la\s+|i\s+)?proprietari[oa]?\b/giu],
    ['weak','rifiuto intermediari',/\b(?:no|senza|non\s+(?:sono|siamo|è)\s+(?:un['’]?\s*|una\s+)?|nessuna?)\s*(?:agenzi[ae](?:\s+immobiliari?)?|agent[ei]\s+immobiliar[ei]|intermediari[oa]?|mediator[ei])\b/giu],
    ['agency','operatore immobiliare',/\bagenzia\s+immobiliare\b|\b(?:sono|siamo)\s+(?:un['’]?\s*|una\s+)?(?:agent[ei]\s+immobiliar[ei]|intermediari[oa]?|mediator[ei])\b|\bprovvigione\s+(?:del|pari\s+a|richiesta)\b|\b(?:tecnocasa|tecnorete|tempocasa|gabetti|re\/max|professionecasa)\b/giu],
    ['professional','servizio professionale',/\b(?:banca\s+dati|database)\b.{0,160}\b(?:quota|pagamento|abbonamento)\b|\b(?:quota|pagamento|abbonamento)\b.{0,160}\b(?:banca\s+dati|database)\b/giu],
    ['tenant','coinquilino o subentro',/\bcerchiamo\s+(?:un['’]?\s*|una\s+)?coinquilin[oa]\b|\b(?:subentro|subentri|subaffitto)\b/giu]
  ]);
  const neg=evidence.filter(e=>e.kind==='weak');evidence=evidence.filter(e=>e.kind!=='agency'||!neg.some(n=>e.start<n.end&&e.end>n.start));
  evidence=evidence.filter(e=>e.kind!=='private'||!/(?:non\s+|non\s+è\s+vero\s+che\s+)$/i.test(t.slice(Math.max(0,e.start-35),e.start)));
  if(post.advertiserType==='professional'&&post.advertiserEvidence)evidence.push({kind:'professional',rule:'badge fonte',quote:post.advertiserEvidence});
  const p=evidence.some(e=>e.kind==='private'),a=evidence.some(e=>['agency','professional'].includes(e.kind)),tenant=evidence.some(e=>e.kind==='tenant');
  return {category:p&&a?'non determinabile':a?'agenzia o intermediario':p?'privato probabile':'non determinabile',professional:a,conflict:p&&a,tenant,ownershipStatus:'non verificata',evidence};
}
export function inspectOffer(post){const t=String(post.title||'')+' '+String(post.text||''),reasons=[];
  if(!canonicalUrl(post.url))reasons.push('Collegamento assente o non valido');
  if(post.sourceRemoved)reasons.push('Annuncio rimosso dalla fonte; disponibilità dell’immobile sconosciuta');
  if(t.trim().length<20||!String(post.text||'').trim())reasons.push('Testo insufficiente');
  const property=/\b(?:appartamento|casa|bilocale|biloc|trilocale|quadrilocale|monolocale|immobile|stanza|camera|villa|attico|ufficio|negozio|box|terreno|loft)\b/i.test(t),offer=/\b(?:affittasi|vendesi|vendo|affitto|affittiamo|vendiamo|si affitta|si vende|in vendita|in affitto|si libera|disponibile|disponibilità|locazione|cedesi)\b/i.test(t)||['affitto','vendita'].includes(post.operation);
  const wanted=/\b(?:cerco|cerchiamo|sto cercando|cercasi|in cerca di)\s+(?:un['’]?\s*|una\s+)?(?:casa|appartamento|bilocale|trilocale|monolocale|stanza|camera|immobile)\b/i.test(t);
  if(wanted)reasons.push('Richiesta di casa, non offerta');if(!property||!offer)reasons.push('Offerta immobiliare non riconoscibile');
  if(post.sourceType==='subito'&&post.city!=='Milano')reasons.push('Fuori dal comune di Milano o comune non verificato');
  const m=t.match(/(?:€\s*([\d.,]+)|([\d.,]+)\s*(?:€|euro))/i);return {isOffer:!reasons.length,reasons,price:post.price||(m?(m[1]||m[2]):null),incomplete:post.textComplete===false};
}
function sources(post){return [...(post.history||[]).map(h=>({kind:'annuncio',text:h.text,url:h.url||post.url,date:h.publishedAt||null,observedAt:h.lastReadAt||h.collectedAt})),{kind:'annuncio',text:post.text,url:post.url,date:post.publishedAt||null,observedAt:post.lastReadAt||post.collectedAt},...(post.checks||[])];}
function annotate(found,s){return found.map(e=>({...e,sourceKind:s.kind,url:safeUrl(s.url)||null,date:s.date||null,observedAt:s.observedAt||null}));}
function resolve(evidence,now,maxAge){const dated=evidence.filter(e=>validDate(e.date,now)),latest=dated.length?dated.reduce((v,e)=>e.date>v?e.date:v,''):null;
  // Una prova non datata non può cancellare una dichiarazione esplicita datata.
  const current=latest?dated.filter(e=>e.date===latest):evidence,kinds=new Set(current.map(e=>e.kind)),days=age(latest,now),undatedConflict=latest&&evidence.some(e=>!validDate(e.date,now)&&!kinds.has(e.kind));return {current,latest,conflict:kinds.size>1||Boolean(undatedConflict),fresh:days!==null&&days>=0&&days<=maxAge};}
const months={gennaio:1,febbraio:2,marzo:3,aprile:4,maggio:5,giugno:6,luglio:7,agosto:8,settembre:9,ottobre:10,novembre:11,dicembre:12};
function dateFrom(text){const m=text.match(/\b(?:disponibile|liber[oa]|si libera)\s+(?:dal|da)\s*:?\s*(\d{1,2})[°º]?\s*(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+(\d{4}))?/i);if(!m){const vague=text.match(/\b(?:disponibile|liber[oa]|si libera)\s+(?:(?:dal|da)\s+)?(?:fine|inizio|metà)\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+\d{4})?/i)||text.match(/\bliber[oa]\s+al\s+rogito\b/i);return vague?{quote:vague[0],date:null}:null;}const date=m[3]?`${m[3]}-${String(months[m[2].toLowerCase()]).padStart(2,'0')}-${m[1].padStart(2,'0')}`:null;return {quote:m[0],date:dateMs(date)!==null?date:null};}
export function assessAvailability(post,now=today()){
  let evidence=[],scheduled=[];
  for(const s of sources(post)){if(!['annuncio','aggiornamento','risposta_proprietario'].includes(s.kind)||s.authorRole==='altro')continue;const t=String(s.text||'');
    const found=signals(t,[
      ['unavailable','cessata disponibilità',/\b(?:non\s+(?:è\s+)?(?:più\s+)?disponibile|(?:immobile|appartamento|casa|stanza|camera)\s+(?:è\s+)?(?:già\s+)?(?:affittat[oa]|vendut[oa]|occupat[oa])|già\s+(?:affittat[oa]|vendut[oa])|annuncio\s+(?:chiuso|ritirato)|non\s+più\s+in\s+(?:vendita|affitto))\b/giu],
      ['available','disponibilità esplicita',/\b(?:ancora\s+disponibile|(?:immobile|appartamento|casa|stanza|camera)\s+(?:è\s+)?(?:ancora\s+)?disponibile|disponibile\s+(?:da\s+subito|subito|da\s+ora)|liber[oa]\s+(?:da\s+)?subito|disponibilità\s+immediata)\b/giu]
    ]);const neg=found.filter(e=>e.kind==='unavailable');
    evidence.push(...annotate(found.filter(e=>e.kind!=='available'||!neg.some(n=>e.start<n.end&&e.end>n.start)&&!/(?:non\s+|non\s+è\s+|se\s+è\s+)$/i.test(t.slice(Math.max(0,e.start-25),e.start))&&!/^\s+(?:dal|da)\s+(?!subito|ora)/i.test(t.slice(e.end))),s));
    const d=dateFrom(t);if(d&&!question(t,t.indexOf(d.quote),t.indexOf(d.quote)+d.quote.length))scheduled.push({...d,sourceKind:s.kind,url:safeUrl(s.url),statementDate:s.date||null});
    if(s.kind==='risposta_proprietario')evidence.push(...annotate(signals(t,[['available','risposta riferita all’immobile',/\bè\s+(?:ancora\s+)?(?:disponibile|liber[oa])\b/giu]]).filter(e=>!/(?:non\s+)$/i.test(t.slice(Math.max(0,e.start-10),e.start))&&!/^\s+(?:dal|da)\s+(?!subito|ora)/i.test(t.slice(e.end))),s));
  }
  const r=resolve(evidence,now,POLICY.availabilityDays);let status='unknown',label='Disponibilità da verificare',reason='Il post visibile o recente non conferma che l’immobile sia ancora disponibile.';
  if(r.current.length){if(r.conflict){status='conflict';label='Disponibilità: fonti in conflitto';reason='Le dichiarazioni della stessa data danno esiti diversi.';}else if(!r.fresh){status='stale';label='Disponibilità da riconfermare';reason=r.latest?`Ultima dichiarazione ${r.latest}; riconfermare dopo ${POLICY.availabilityDays} giorni.`:'Dichiarazione presente ma data di pubblicazione non verificata.';}else{status=r.current[0].kind;label=status==='available'?'Disponibile · dichiarato':'Non disponibile · dichiarato';reason=`Dichiarazione del ${r.latest}. Non è una garanzia della disponibilità effettiva.`;}}
  if(status==='unknown'&&scheduled.length){status='scheduled';const d=scheduled.at(-1);label=d.date?`Dal ${d.date} · dichiarato`:`${d.quote} · data da verificare`;reason='Ingresso o liberazione dichiarati; disponibilità attuale non confermata.';}
  return {status,label,reason,evidence,scheduled,checkedAt:post.lastReadAt||null,lastStatementAt:r.latest};
}
export function assessAgency(post,now=today()){
  let evidence=[],possible=[];
  for(const s of sources(post)){const t=String(s.text||'');if(s.kind==='annuncio_agenzia'){possible.push({quote:t,url:safeUrl(s.url),date:s.date,matchReason:s.matchReason||'',sameProperty:s.sameProperty===true});continue;}if(!['annuncio','aggiornamento','risposta_proprietario'].includes(s.kind)||s.authorRole==='altro')continue;
    const found=signals(t,[
      ['no','assenza incarico dichiarata',/\b(?:non\s+(?:ho|abbiamo)\s+(?:alcun\s+)?(?:mandato|incarico)\s+(?:con|a)\s+(?:un['’]?\s*|una\s+)?agenzi[ae]|non\s+(?:ho|abbiamo)\s+affidato\s+(?:la\s+vendita|la\s+locazione|l['’]immobile|l['’]appartamento|la\s+casa)\s+(?:ad?\s+)?(?:alcuna\s+|nessuna\s+)?agenzi[ae]|nessun\s+(?:mandato|incarico)\s+(?:ad?\s+|con\s+)?agenzi[ae]|non\s+(?:sono|siamo)\s+seguit[oaie]\s+da\s+(?:un['’]?\s*|una\s+)?agenzi[ae]|non\s+mi\s+avvalgo\s+di\s+agenzi[ae])\b/giu],
      ['yes','incarico dichiarato',/\b(?:ho|abbiamo)\s+(?:già\s+)?(?:affidato|conferito|dato)\s+(?:un\s+(?:mandato|incarico)|la\s+vendita|la\s+locazione|l['’]immobile|l['’]appartamento|la\s+casa)\s+(?:ad?\s+|in\s+esclusiva\s+ad?\s+)(?:un['’]?\s*|una\s+)?agenzi[ae]\b|\b(?:sono|siamo)\s+(?:già\s+)?seguit[oaie]\s+da\s+(?:un['’]?\s*|una\s+)?agenzi[ae]\b|\b(?:immobile|appartamento|casa)\s+(?:è\s+)?(?:gestit[oa]|affidat[oa])\s+(?:a|da)\s+(?:un['’]?\s*|una\s+)?agenzi[ae]\b/giu]
    ]);const neg=found.filter(e=>e.kind==='no');evidence.push(...annotate(found.filter(e=>e.kind!=='yes'||!neg.some(n=>e.start<n.end&&e.end>n.start)&&!/(?:non\s+|non\s+è\s+vero\s+che\s+)$/i.test(t.slice(Math.max(0,e.start-35),e.start))),s));
  }
  const r=resolve(evidence,now,POLICY.agencyDays);let status='unknown',label='Incarico ad agenzia da verificare',reason='«Privato» e «no agenzie» non provano l’assenza di un incarico già conferito.';
  if(r.current.length){if(r.conflict){status='conflict';label='Incarico: dichiarazioni contrastanti';reason='Le prove della stessa data richiedono revisione.';}else if(!r.fresh){status='stale';label='Incarico da riconfermare';reason=r.latest?`Dichiarazione del ${r.latest}, riconfermare dopo ${POLICY.agencyDays} giorni.`:'La dichiarazione non ha una data verificata.';}else{status=r.current[0].kind;label=status==='yes'?'Agenzia presente · dichiarato':'Nessun incarico · dichiarato';reason=`Dichiarazione del ${r.latest}; non è una verifica documentale del mandato.`;}}
  if(possible.length&&!['yes','conflict'].includes(status)){status=status==='no'?'conflict':'possible';label=status==='conflict'?'Incarico: fonti da confrontare':'Possibile annuncio d’agenzia';reason='Confrontare lo stesso immobile e chiedere una dichiarazione attuale: un annuncio simile non dimostra un mandato.';}
  return {status,label,reason,evidence,possible,lastStatementAt:r.latest};
}
function similarity(a,b){const x=new Set(norm(a).split(' ')),y=new Set(norm(b).split(' '));let c=0;for(const w of x)if(y.has(w))c++;return c/(x.size+y.size-c||1);}
function consolidate(posts){
  const urlGroups=new Map(),textGroups=new Map(),groups=[],mapping=[];
  for(let index=0;index<posts.length;index++){
    const post=posts[index]||{},url=canonicalUrl(post.url),fingerprint=norm(post.text),author=norm(post.author),price=norm(inspectOffer(post).price);
    const textKey=post.textComplete!==false&&fingerprint.length>=100&&author?`${author}|${price}|${fingerprint}`:null;
    const group=(url&&urlGroups.get(url))||(textKey&&textGroups.get(textKey))||{primary:index,members:[]};
    if(!group.members.length)groups.push(group);group.members.push(post);mapping[index]=group;
    if(url)urlGroups.set(url,group);if(textKey)textGroups.set(textKey,group);
  }
  for(const g of groups){const first=g.members.find(p=>inspectOffer(p).isOffer)||g.members[0],siblings=g.members.filter(p=>p!==first),checks=g.members.flatMap(p=>p.checks||[]),history=[...g.members.flatMap(p=>p.history||[]),...siblings.map(p=>({text:p.text,url:p.url,publishedAt:p.publishedAt||null,lastReadAt:p.lastReadAt||p.collectedAt}))];g.effective={...first,checks,history,consolidatedFrom:siblings.map(p=>p.url)};}
  return mapping;
}
export function analyzePosts(posts,now=today()){
  const records=[],mapping=consolidate(posts);
  for(let i=0;i<posts.length;i++){const group=mapping[i],post=group.primary===i?group.effective:posts[i]||{},url=canonicalUrl(post.url),offer=inspectOffer(post),r={...post,url:url||post.url||'',recordId:post.recordId||`r-${i}`,price:offer.price,...classifyAdvertiser(String(post.title||'')+' '+String(post.text||''),post),availability:assessAvailability(post,now),agency:assessAgency(post,now),decision:'review',reasons:[],duplicateOf:null};
    const duplicate=group.primary===i?null:records[group.primary];
    if(duplicate){r.decision='excluded';r.duplicateOf=duplicate.recordId;r.reasons.push(url===canonicalUrl(duplicate.url)?'Duplicato: stesso collegamento':'Duplicato: stesso testo completo e stesso autore');records.push(r);continue;}
    if(offer.reasons.length){r.decision='excluded';r.reasons.push(...offer.reasons);}
    else if(r.professional){r.decision='excluded';r.reasons.push('Annuncio di agenzia o intermediario professionale');}
    else if(r.tenant&&!r.evidence.some(e=>e.kind==='private'&&/proprietari[oa]?/i.test(e.quote))){r.decision='excluded';r.reasons.push('Coinquilino/subentro: non è un proprietario privato dichiarato');}
    else if(r.availability.status==='unavailable'){r.decision='excluded';r.reasons.push('Immobile dichiarato non disponibile');}
    else if(r.agency.status==='yes'){r.decision='excluded';r.reasons.push('Il proprietario dichiara un’agenzia già incaricata');}
    else{if(r.conflict)r.reasons.push('Segnali contrastanti');if(r.category==='non determinabile')r.reasons.push('Ruolo inserzionista da verificare');if(offer.incomplete)r.reasons.push('Testo incompleto');if(post.locationConflict)r.reasons.push('Località contrastante nelle fonti');if(['conflict','possible','stale'].includes(r.agency.status))r.reasons.push(r.agency.label);if(['conflict','stale'].includes(r.availability.status))r.reasons.push(r.availability.label);if(!r.reasons.length)r.decision='selected';if(r.availability.status==='unknown')r.reasons.push('Disponibilità ancora da confermare');if(r.agency.status==='unknown')r.reasons.push('Incarico ad agenzia ancora da verificare');}
    records.push(r);
  }
  const unique=records.filter(r=>r.decision!=='excluded');for(let i=0;i<unique.length;i++)for(let j=i+1;j<unique.length;j++)if(norm(unique[i].text).length>100&&similarity(unique[i].text,unique[j].text)>.88){for(const r of [unique[i],unique[j]]){r.decision='review';r.reasons.push('Possibile duplicato: testo simile, verificare lo stesso immobile');}}
  for(const r of unique)if(r.possibleDuplicateGroup&&unique.some(other=>other!==r&&other.possibleDuplicateGroup===r.possibleDuplicateGroup)){r.decision='review';r.reasons.push('Possibile duplicato: confronto delle caratteristiche da completare');}
  for(const r of records){const proof=(r.checks||[]).filter(c=>c.kind==='duplicato_confermato'&&c.sameProperty&&String(c.matchReason||'').length>=20&&validDate(c.date,now)).at(-1);if(!proof)continue;const target=records.find(other=>other!==r&&canonicalUrl(other.url)===canonicalUrl(proof.url)&&other.decision!=='excluded');if(target){r.decision='excluded';r.duplicateOf=target.recordId;r.reasons=['Duplicato confermato dall’operatore: '+proof.matchReason];}}
  const active=records.filter(r=>r.decision!=='excluded');const summary={acquired:records.length,selected:records.filter(r=>r.decision==='selected').length,review:records.filter(r=>r.decision==='review').length,excluded:records.filter(r=>r.decision==='excluded').length,duplicates:records.filter(r=>r.duplicateOf).length,private:active.filter(r=>r.category==='privato probabile').length,availabilityKnown:active.filter(r=>['available','scheduled'].includes(r.availability.status)).length};
  return {schemaVersion:2,analyzedAt:now,policy:POLICY,summary,records};
}
export function findListings(posts){return analyzePosts(posts).records.filter(r=>r.decision!=='excluded');}
export function runAgents(posts,now=today()){return analyzePosts(posts,now).records.filter(r=>r.decision!=='excluded');}

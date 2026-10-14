import {canonicalUrl,safeUrl} from './agents.js';
export function assessActivity(record,records){
 const keys=r=>[safeUrl(r.authorProfileUrl)?'profile:'+canonicalUrl(r.authorProfileUrl):null,...[r.email,r.contactEmail,...Array.from(String(r.text||'').matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi),m=>m[0])].filter(Boolean).map(v=>'email:'+String(v).toLowerCase().trim()),...[r.phone,r.telephone,r.contactPhone].filter(Boolean).map(v=>'phone:'+String(v).replace(/[^0-9]/g,''))].filter(Boolean);
 const own=keys(record);if(!own.length)return {label:'Non valutabile',reason:'Profilo o contatto comune non disponibile. Il solo nome non viene usato.',related:[]};
 const related=records.filter(r=>r.recordId!==record.recordId&&r.decision!=='excluded'&&keys(r).some(k=>own.includes(k)));
 const unique=new Map();for(const r of [record,...related]){const key=r.propertyId||r.possibleDuplicateGroup||r.duplicateOf||canonicalUrl(r.url);if(!unique.has(key))unique.set(key,r);}
 if(unique.size<2)return {label:'Nessun altro immobile collegato',reason:'Nel campione raccolto non emergono altre offerte collegate allo stesso profilo o contatto.',related:[]};
 return {label:'Più offerte collegate · da verificare',reason:`${unique.size} offerte non deduplicate collegate tramite profilo o contatto comune. Verificare che siano immobili diversi e riferiti alla stessa persona prima di segnalarla come possibile operatore. Un proprietario può avere più immobili.`,related:[...unique.values()].filter(r=>r.recordId!==record.recordId)};
}

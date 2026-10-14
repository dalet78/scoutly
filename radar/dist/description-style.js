export function assessDescription(post){
 const text=String(post.text||'');
 if(post.textComplete===false||text.length<100)return {label:'Non determinabile',reason:'Testo parziale o troppo breve per una valutazione affidabile.',confidence:'bassa'};
 const professional=[...text.matchAll(/\b(?:proponiamo|soluzione abitativa|ottimo investimento|finiture di pregio|visita su appuntamento|nostra agenzia|immobile sito|zona servita)\b/gi)].map(m=>m[0]);
 const personal=[...text.matchAll(/\b(?:vendo casa mia|affitto casa mia|ci abbiamo vissuto|la mia casa|il mio appartamento|sono il proprietario|sono la proprietaria)\b/gi)].map(m=>m[0]);
 const label=professional.length&&personal.length?'Misto':professional.length>=2?'Probabilmente professionale':personal.length>=2?'Probabilmente amatoriale':'Non determinabile';
 return {label,confidence:'bassa',reason:label==='Non determinabile'?'Indizi testuali insufficienti.':`Espressioni rilevate: ${[...new Set([...professional,...personal])].map(v=>'“'+v+'”').join(', ')}.`};
}

export function formatPrice(value){
 const raw=String(value).replaceAll('.','').trim();
 if(!/^\d*$/.test(raw))return String(value);
 return raw.replace(/^0+(?=\d)/,'').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}
export function parsePrice(value){
 const raw=String(value).trim();
 if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(raw))return NaN;
 const n=Number(raw.replaceAll('.',''));return Number.isSafeInteger(n)&&n>0&&n<=100000000?n:NaN;
}
export function municipalityLabel(row){return row[1]+' ('+row[2]+')';}
const norm=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function searchMunicipalities(rows,value){
 const q=norm(value);return rows.filter(r=>norm(municipalityLabel(r)).includes(q)).slice(0,30);
}
export function resolveMunicipality(rows,value){
 const q=norm(value);const full=rows.find(r=>norm(municipalityLabel(r))===q);if(full)return full;
 const exact=rows.filter(r=>norm(r[1])===q);return exact.length===1?exact[0]:null;
}

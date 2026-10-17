export const recipient='scoutlyhome@gmail.com';
export const subject='Scoutly — Richiesta bozza annuncio';
export function buildEmail(data){
 const value=key=>String(data[key]??'').trim();
 return ['Ciao Scoutly,','vorrei richiedere una bozza del mio annuncio a partire dalle informazioni e dalle foto che allego.', '',`Nome: ${value('name')||'Non indicato'}`,`Comune: ${value('city')}`,`Progetto: ${value('intent')}`,`Ruolo: ${value('role')}`,`Pubblicazione: ${value('publication')}`,'','Descrizione / caratteristiche:',value('description'),'','Foto: da allegare a questa email prima dell’invio.','',data.consultation?'Richiedo anche un confronto con un agente che opera a Milano. Potete rispondermi via email per concordarlo.':'Richiedo soltanto la bozza dell’annuncio; non sto chiedendo il ricontatto di un agente.','','Sono consapevole che la richiesta sarà esaminata manualmente e che disponibilità e tempi sono da confermare.'].join('\n');
}
export function emailLink(body){return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;}

export const items = [
 {id:'info',label:'Informazioni della casa',next:'Completa la scheda della casa: caratteristiche note e informazioni ancora da verificare.',unknown:'Individua quali informazioni della casa mancano e chi può confermarle.'},
 {id:'documents',label:'Documenti raccolti',next:'Fai un inventario dei documenti disponibili e delle verifiche da organizzare con chi è competente.',unknown:'Fai il punto sui documenti disponibili, senza considerarli già completi o verificati.'},
 {id:'price',label:'Criterio per il prezzo',next:'Annota come vuoi scegliere il prezzo e quali confronti pertinenti ti mancano.',unknown:'Individua quali elementi ti servono per motivare il prezzo: la checklist non stima il valore.'},
 {id:'photos',label:'Fotografie',next:'Prepara fotografie leggibili degli ambienti e delle caratteristiche utili.',unknown:'Controlla quali ambienti e caratteristiche sono già rappresentati nelle fotografie.'},
 {id:'description',label:'Bozza della descrizione',next:'Prepara la descrizione usando le informazioni note, senza inventare dettagli.',unknown:'Individua le informazioni necessarie per scrivere una prima bozza.'}
];
export function buildChecklist(data){
 const groups={ready:[],missing:[],uncertain:[]};
 for(const item of items){const value=data[item.id];if(!['yes','partial','no','unknown'].includes(value))throw Error('Risposta mancante: '+item.id);groups[value==='yes'?'ready':value==='unknown'?'uncertain':'missing'].push(item);}
 const tasks=items.filter(i=>data[i.id]!=='yes').slice(0,3).map(i=>data[i.id]==='unknown'?i.unknown:i.next);
 if(!tasks.length)tasks.push('Controlla la coerenza tra fotografie, testo e informazioni. Gli elementi preparati non sono stati verificati da Scoutly.');
 const notes=[];
 if(data.city!=='milano')notes.push('Il primo servizio di confronto riguarda immobili nel Comune di Milano. Questa checklist resta una guida generale.');
 if(!['owner','authorized'].includes(data.role))notes.push('Per un eventuale confronto occorre la partecipazione del proprietario o di chi è autorizzato a decidere.');
 if(data.publication==='online')notes.push('Hai già pubblicato: puoi usare la checklist per rivedere l’annuncio. Il tuo caso è distinto dalla preparazione prima della pubblicazione.');
 if(!['apartment','house'].includes(data.type))notes.push('La tipologia dell’immobile richiede una verifica prima di un eventuale confronto con il primo agente.');
 if(data.intent==='rent')notes.push('Per l’affitto, i passi riguardano la preparazione dell’annuncio di locazione. Contratto, canone e adempimenti richiedono un approfondimento specifico.');
 if(data.intent==='unsure')notes.push('La tua intenzione è ancora da definire. Questa guida non decide se conviene vendere o affittare.');
 return {...groups,tasks,notes,prePublicationCandidate:['apartment','house'].includes(data.type)&&data.city==='milano'&&['owner','authorized'].includes(data.role)&&['sale','rent'].includes(data.intent)&&['30','90'].includes(data.timing)&&['not-started','draft'].includes(data.publication)};
}
export function exportChecklist(data,result){
 const op={sale:'Vendita',rent:'Affitto',unsure:'Sto valutando'};
 return ['SCOUTLY — PRIMA DI PUBBLICARE','',`Progetto: ${op[data.intent]||'Da definire'}`,'','GIÀ PREPARATO (secondo le tue risposte)',...result.ready.map(i=>'- '+i.label),'','DA COMPLETARE',...result.missing.map(i=>'- '+i.label),'','DA CHIARIRE',...result.uncertain.map(i=>'- '+i.label),'','I PROSSIMI PASSI',...result.tasks.map((t,i)=>`${i+1}. ${t}`),'',...result.notes,'','Guida organizzativa automatica: non esamina foto o documenti e non stima il valore dell’immobile. Nessun dato è stato inviato.'].join('\n');
}

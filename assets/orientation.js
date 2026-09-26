(function(root){
const euro=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n);
function calculate(slug,data,page){const n=id=>Number(data[id]||0),has=id=>String(data[id]??'').trim()!=='';const rows=[],notes=[...page.notes],tasks=[];const money=(label,value)=>rows.push({label,value:euro(value)});
 if(slug==='netto-vendita'&&has('price')){money('Prezzo indicato',n('price'));money('Differenza dopo i soli importi inseriti',n('price')-n('debt')-n('selling'));if(!has('debt')||!has('selling'))notes.push('Mancano alcune voci: questa differenza non è il ricavo netto completo.');}
 if(slug==='casa-piu-piccola'&&has('price')&&has('purchase')){money('Differenza fra i due prezzi indicati',n('price')-n('purchase'));notes.push('Questa differenza esclude costi, debiti, trasloco e finanziamenti. Non è liquidità già disponibile.');}
 if(slug==='seconda-casa'&&has('income')&&has('costs')){money('Incassi meno spese indicate, per anno',n('income')-n('costs'));notes.push('Il conto non aggiunge uscite che non hai incluso nella tua stima.');}
 if(slug==='casa-vuota'&&has('monthly')){money('Spese ricorrenti indicate, per anno',n('monthly')*12);money('Totale indicativo per '+n('months')+' mesi',n('monthly')*n('months')+n('once'));if(!has('once'))notes.push('Nessun altro costo è stato inserito nel periodo. Il totale può essere incompleto.');}
 if(slug==='facilita-vendita'){const checks=['documents','photos','visits'];rows.push({label:'Aspetti già pronti secondo le tue risposte',value:checks.filter(id=>data[id]==='Sì').length+' su 3'});for(const id of checks)if(data[id]!=='Sì')tasks.push({documents:'Raccogli i documenti della casa.',photos:'Prepara fotografie e planimetria leggibili.',visits:'Organizza la disponibilità per le visite.'}[id]);}
 if(slug==='checklist-vendita')tasks.push('Raccogli i documenti di provenienza.','Raccogli le planimetrie disponibili.','Fai verificare la documentazione del tuo caso.','Verifica la documentazione energetica pertinente.','Raccogli spese e lavori condominiali previsti.','Chiarisci debiti, vincoli e somme da regolare.','Confronta immobili simili e motiva il prezzo.','Valuta pulizia, ordine e piccole riparazioni.','Prepara foto e descrizione con informazioni verificabili.','Pianifica visite e disponibilità della casa.');
 if(!rows.length)rows.push({label:'Il punto da cui partire',value:page.takeaway});
 return {rows,notes,tasks};}
root.scoutlyCalculate=calculate;if(typeof module!=='undefined')module.exports=calculate;
})(typeof window!=='undefined'?window:globalThis);

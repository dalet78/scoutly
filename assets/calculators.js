(function(root){
const eur=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n);
const pct=n=>new Intl.NumberFormat('it-IT',{maximumFractionDigits:2}).format(n)+'%';
function calculate(slug,data,page){
 const n=id=>Number(data[id]||0), s=id=>String(data[id]||''), has=id=>String(data[id]??'').trim()!=='';
 const rows=[],notes=[],tasks=[];const row=(label,value)=>rows.push({label,value});const money=(label,value)=>row(label,eur(value));
 const error=message=>({error:message});
 switch(slug){
 case 'valore-casa':case 'canone-affitto': {
  if(n('low')>n('high'))return error('Il riferimento minimo non può superare quello massimo.');
  const low=n('area')*n('low'),high=n('area')*n('high');
  row(slug==='valore-casa'?'Fascia di confronto, non perizia':'Fascia di canone mensile',eur(low)+' – '+eur(high));
  if(slug==='canone-affitto')row('Canone annuo lordo, 12 mesi',eur(low*12)+' – '+eur(high*12));
  row('Fonte dichiarata',s('source'));notes.push('Nessuna quotazione in tempo reale è stata consultata. Le caratteristiche raccolte non applicano correttivi automatici.');break;
 }
 case 'vendere-o-aspettare': {
  const now=n('price')-n('nowcost'),later=n('future')-n('latercost')-n('costs');
  money('Netto dello scenario oggi',now);money('Netto dello scenario fra 12 mesi',later);money('Differenza: attesa meno oggi',later-now);money('Prezzo futuro di pareggio',now+n('latercost')+n('costs'));notes.push('Una differenza positiva favorisce numericamente l’attesa nelle sole ipotesi inserite. Non prevede l’andamento del mercato.');break;
 }
 case 'tempi-vendita': {
  const values=['a','b','c'].filter(has).map(n).sort((a,b)=>a-b);
  if(values.length===3){if(!s('source').trim())return error('Indica fonte e periodo dei tre confronti.');row('Mediana dei tre confronti',values[1]+' giorni');row('Intervallo del campione',values[0]+'–'+values[2]+' giorni');row('Fonte dichiarata',s('source'));notes.push('Tre casi non rappresentano necessariamente il mercato locale. Questi tempi non sono una previsione per il tuo immobile.');}
  else {row('Tempi locali','Non determinabili dai dati disponibili');notes.push('Hai inserito '+values.length+' confronti su 3. Per il riepilogo statistico servono tre casi completi e la loro fonte.');tasks.push('Raccogli tre vendite comparabili con date di pubblicazione e proposta accettata.','Controlla che quartiere, caratteristiche e fascia di prezzo siano confrontabili.');}break;
 }
 case 'prezzo-sbagliato': {
  const after=n('price')*(1-n('discount')/100),hold=n('delay')*n('monthly');
  money('Scarto iniziale rispetto al riferimento',n('price')-n('reference'));money('Prezzo dopo il ribasso ipotizzato',after);money('Costi di attesa',hold);money('Incasso dopo ribasso e attesa',after-hold);money('Differenza dal riferimento',after-hold-n('reference'));notes.push('Uno scarto negativo indica un importo inferiore al riferimento scelto, non una perdita accertata.');break;
 }
 case 'facilita-vendita': {
  const quiz=page.fields.filter(f=>['documents','pricecheck','conditioncheck','photos','visits','release'].includes(f.id));
  const done=quiz.filter(f=>s(f.id)==='Sì').length,partial=quiz.filter(f=>s(f.id)==='In parte').length;
  row('Aree preparate',done+' su 6');row('Aree parziali',partial);row('Aree ancora aperte',6-done-partial);
  quiz.filter(f=>s(f.id)!=='Sì').forEach(f=>tasks.push(f.label+' — '+s(f.id)));
  notes.push(done===6?'Tutte le aree risultano preparate secondo le tue risposte. Questo non garantisce una vendita facile.':'Il risultato è una mappa delle attività da preparare, non un giudizio sulla vendibilità.');break;
 }
 case 'domanda-acquirenti': {
  if(!has('requests')&&!has('matches')){row('Numero di acquirenti','Non disponibile');notes.push('Non è collegato alcun database di richieste. Il profilo è pronto per una verifica locale.');tasks.push('Raccogli richieste uniche aggiornate e compatibili per zona, metratura, tipologia e budget.');break;}
  if(!has('requests')||!has('matches')||!s('source').trim())return error('Per analizzare il campione inserisci richieste totali, compatibili e fonte con periodo.');
  if(n('matches')>n('requests'))return error('Le richieste compatibili non possono superare il totale del campione.');
  row('Compatibili nel campione dichiarato',n('matches')+' su '+n('requests'));row('Quota compatibile',n('requests')?pct(n('matches')/n('requests')*100):'Non calcolabile: campione vuoto');row('Fonte dichiarata',s('source'));notes.push('Il campione non è verificato da Scoutly. Questi numeri non rappresentano tutti gli acquirenti della zona.');break;
 }
 case 'checklist-vendita': {
  const done=page.fields.filter(f=>data[f.id]===true).length;row('Attività completate',done+' su 10');row('Avanzamento',pct(done*10));page.fields.filter(f=>data[f.id]!==true).forEach(f=>tasks.push(f.label));if(done===10)notes.push('Checklist completata secondo le tue spunte. Conserva e verifica i documenti del tuo caso.');break;
 }
 case 'costi-vendita': {
  const total=['agency','docs','works','tax','other'].reduce((a,id)=>a+n(id),0);money('Costi complessivi inseriti',total);row('Incidenza sul prezzo',pct(total/n('price')*100));money('Prezzo meno costi, prima del debito',n('price')-total);break;
 }
 case 'netto-vendita': {
  const net=n('price')-n('selling')-n('debt')-n('other');money('Residuo complessivo',net);money('Quota personale del residuo',net*n('share')/100);if(net<0)notes.push('Il saldo negativo indica somme da integrare per chiudere lo scenario.');break;
 }
 case 'ristrutturare-prima': {
  const investment=n('works')*(1+n('buffer')/100)+n('delay')*n('monthly')+n('extra');money('Investimento e attesa',investment);money('Aumento di prezzo ipotizzato',n('after')-n('before'));money('Differenza dopo i costi',n('after')-n('before')-investment);money('Prezzo dopo lavori per pareggiare',n('before')+investment);break;
 }
 case 'lavori-valore': {
  const items=['a','b','c'].map(id=>({name:s(id+'name'),cost:n(id+'cost'),gain:n(id+'gain'),net:n(id+'gain')-n(id+'cost')})).sort((a,b)=>b.net-a.net);
  items.forEach(x=>{money(x.name+' — margine ipotizzato',x.net);notes.push(x.name+': costo '+eur(x.cost)+', aumento ipotizzato '+eur(x.gain)+'.');});notes.push('Ordine per margine assoluto nelle ipotesi inserite, non raccomandazione sui lavori.');break;
 }
 case 'privato-o-agenzia': {
  const p=n('privateprice')-n('privatecost'),a=n('agentprice')-n('agentcost');money('Netto da privato, prima del tempo',p);money('Netto con agenzia, prima del tempo',a);money('Valore del tempo da privato',n('privatehours')*n('hour'));money('Valore del tempo con agenzia',n('agenthours')*n('hour'));money('Privato, includendo il valore del tempo',p-n('privatehours')*n('hour'));money('Agenzia, includendo il valore del tempo',a-n('agenthours')*n('hour'));tasks.push('Confronta chi gestisce fotografie, annunci, richieste, visite, trattativa e verifiche.','Leggi durata, eventuale esclusiva, servizi e compensi dell’incarico.');break;
 }
 case 'affittato-o-libero': {
  const a=n('occupied')-n('occupiedcost'),b=n('free')-n('freecost')+n('wait')*n('netrent')-n('waitingcost');money('Scenario vendita locato',a);money('Scenario vendita libero dopo attesa',b);money('Differenza: libero meno locato',b-a);notes.push('La fattibilità e i tempi della disponibilità non sono verificati dal calcolo.');break;
 }
 case 'arredare-casa': {
  if(n('residual')>n('setup'))return error('Il valore recuperabile non può superare il costo iniziale in questo modello.');
  const cost=n('setup')+n('extra')-n('residual'),benefit=s('goal')==='Vendita'?n('gain'):n('rentgain')*n('months');money('Costo netto dell’operazione',cost);money('Beneficio ipotizzato: '+s('goal').toLowerCase(),benefit);money('Differenza dopo i costi',benefit-cost);if(s('goal')==='Locazione')row('Mesi locati per recuperare il costo',n('rentgain')>0?Math.ceil(cost/n('rentgain')):'Non raggiungibile con incremento zero');break;
 }
 case 'vendere-reinvestire': {
  const capital=n('price')-n('selling')-n('debt');if(capital<=0)return error('Il ricavo disponibile deve essere positivo per simulare un reinvestimento. Rivedi prezzo, costi e debito.');
  const alternative=capital*n('rate')/100-n('fees');money('Capitale disponibile ipotizzato',capital);money('Flusso annuo mantenendo l’immobile',n('propertynet'));money('Flusso alternativo ipotizzato',alternative);money('Differenza dei flussi annui',alternative-n('propertynet'));row('Tasso alternativo per eguagliare il flusso',pct((n('propertynet')+n('fees'))/capital*100));notes.push('Il tasso di pareggio è un risultato matematico, non un rendimento ottenibile o consigliato.');break;
 }
 case 'immobile-ereditato': {
  const sale=n('price')-n('selling')-n('obligations'),income=n('rent')*n('months')-n('costs'),share=n('share')/100;money('Vendita: liquidità complessiva una tantum',sale);money('Vendita: quota personale',sale*share);money('Locazione: flusso annuo complessivo',income);money('Locazione: quota personale annua',income*share);money('Mantenimento: uscita personale annua',-n('costs')*share);notes.push('Una somma una tantum e un flusso annuo non sono direttamente confrontabili. Mantenendo o affittando resta anche l’immobile.');if(s('owners')!=='Unico interessato')tasks.push('Chiarisci con gli altri interessati quote, obblighi e accordi prima di usare questi scenari.');break;
 }
 case 'trasferimento': {
  money('Vendita: liquidità immediata',n('price')-n('selling')-n('debt'));money('Mantenimento: flusso in '+n('years')+' anni',-n('costs')*n('years'));money('Locazione: flusso in '+n('years')+' anni',(n('rent')*n('months')-n('costs')-n('management'))*n('years'));notes.push('Vendere converte il bene in liquidità; gli altri scenari mantengono l’immobile. I totali non confrontano l’intero patrimonio.');if(s('return')!=='No')tasks.push('Verifica se e quando potresti aver bisogno della casa per rientrare.');break;
 }
 case 'casa-piu-piccola': {
  const net=n('price')-n('selling')-n('debt'),buy=n('purchase')+n('purchasecost')+n('moving');money('Liquidità netta dalla vendita',net);money('Acquisto e trasferimento',buy);money('Saldo senza nuovo finanziamento',net-buy);money('Liquidità con nuovo finanziamento',net-buy+n('newloan'));money('Nuovo debito previsto',n('newloan'));money('Riduzione annua delle spese, prima delle nuove rate',n('currentcost')-n('newcost'));break;
 }
 case 'seconda-casa': {
  const expense=n('management')+n('maintenance')+n('tax')+n('other'),before=n('income')-expense;money('Uscite annue, escluse rate',expense);money('Flusso prima delle rate',before);money('Flusso di cassa dopo le rate',before-n('loan'));money('Incassi necessari al pareggio di cassa',expense+n('loan'));row('Flusso prima delle rate / valore',pct(before/n('value')*100));notes.push('Il rapporto sul valore non misura il rendimento totale o sul capitale proprio.');break;
 }
 case 'casa-vuota': {
  const ids=['condominio','utenze','imposte','assicurazione','manutenzione','altro'];
  const annual=ids.reduce((sum,id)=>sum+n(id)*(s(id+'period')==='Mensile'?12:1),0);
  money('Spesa ricorrente media mensile',annual/12);money('Spese ricorrenti annuali',annual);money('Spese ricorrenti per '+n('months')+' mesi',annual*n('months')/12);money('Spese una tantum',n('once'));money('Totale del periodo',annual*n('months')/12+n('once'));break;
 }
 case 'vendere-o-affittare': {
  row('Obiettivo dichiarato',s('goal'));row('Orizzonte',s('timing'));row('Profilo',s('type')+' · '+n('area')+' m² · '+s('zone'));tasks.push(s('goal')==='Vendere'?'Raccogli riferimenti di vendita di immobili simili.':s('goal')==='Affittare'?'Raccogli canoni comparabili e costi a tuo carico.':'Confronta ricavo netto di vendita e flusso annuo di locazione.');break;
 }
 default:return error('Strumento non disponibile.');
 }
 return {rows,notes,tasks};
}
root.scoutlyCalculate=calculate;if(typeof module!=='undefined')module.exports=calculate;
})(typeof window!=='undefined'?window:globalThis);

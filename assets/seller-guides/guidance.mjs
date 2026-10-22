export function guidance(kind, answers) {
 const photo = kind === 'fotografie';
 const fields = photo ? ['luce','ambienti','ordine'] : ['dati','documenti','prezzo'];
 if (!['fotografie','checklist'].includes(kind) || fields.some(key => !['pronto','parziale','da-fare'].includes(answers[key]))) throw new Error('Completa tutte le risposte.');
 const tips = [];
 if (photo) {
  if (answers.luce !== 'pronto') tips.push('Prova a fotografare con luce naturale e controlla che gli ambienti siano leggibili. Evita filtri che alterano colori o proporzioni.');
  if (answers.ambienti !== 'pronto') tips.push('Prepara una sequenza che mostri gli ambienti principali, compresi bagno e cucina. Aggiungi balcone e altri spazi esterni, se presenti.');
  if (answers.ordine !== 'pronto') tips.push('Prima degli scatti libera le superfici dagli oggetti superflui e togli dall’inquadratura persone, documenti e dettagli personali.');
  if (!tips.length) tips.push('Hai indicato una buona preparazione. Ricontrolla la foto di apertura e l’ordine degli ambienti: aiutano a capire la casa già dal primo sguardo.');
  tips.push('Confronta le immagini con la descrizione: ogni caratteristica importante dovrebbe essere mostrata o spiegata con chiarezza.');
 } else {
  if (answers.dati !== 'pronto') tips.push('Raccogli i dati che puoi confermare: superficie, piano, ascensore, spazi esterni, pertinenze e spese note. Tieni separati quelli ancora da verificare.');
  if (answers.documenti !== 'pronto') tips.push('Fai l’inventario dei documenti disponibili e di quelli mancanti. Chiedi al consulente quali controlli e quali professionisti servono per la tua situazione.');
  if (answers.prezzo !== 'pronto') tips.push('Prepara le tue domande sul prezzo e le caratteristiche della casa da discutere con il consulente. Il prezzo che hai in mente resta un’ipotesi da approfondire.');
  if (!tips.length) tips.push('Hai indicato che il materiale è raccolto. Prepara un riepilogo di dati, documenti disponibili e dubbi da portare al consulente.');
  tips.push('Segna le informazioni da confermare prima di pubblicare: anticiparle può evitare chiarimenti e lavoro da rifare.');
 }
 return {tips: tips.slice(0,3), note: photo ? 'Indicazioni basate solo sulle tue risposte. Non abbiamo esaminato le foto e non stiamo misurando l’interesse degli acquirenti.' : 'Questo è un controllo organizzativo iniziale, non una verifica dei documenti, della conformità dell’immobile o del suo valore.'};
}

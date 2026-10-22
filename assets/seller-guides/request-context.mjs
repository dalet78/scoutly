const TOPICS={
 'fotografie-casa':{fields:[['luce','Luce e leggibilità'],['ambienti','Ambienti mostrati'],['ordine','Ordine e inquadrature']]},
 'checklist-vendere-casa':{fields:[['dati','Dati principali raccolti'],['documenti','Inventario documenti'],['prezzo','Domande sul prezzo']]}
};
const LABELS={pronto:'Preparato',parziale:'Parziale','da-fare':'Da preparare o verificare'};
export function contextualDescription(topic,description,answers={}){
 if(!topic)return description;
 const spec=TOPICS[topic];if(!spec)throw new Error('Tema non riconosciuto');
 const lines=spec.fields.map(([key,label])=>{if(!Object.hasOwn(LABELS,answers[key]))throw new Error('Risposta mancante');return label+': '+LABELS[answers[key]];});
 const text=['SCOUTLY_REQUEST_TOPIC: '+topic,'Risposte dichiarate dal proprietario:',...lines,'Descrizione del proprietario:',description].join('\n');
 if(text.length>4000)throw new Error('Descrizione troppo lunga');
 return text;
}

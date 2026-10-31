export const PHOTOGRAPHY_TOPIC='Fotografie professionali';
export const PHOTOGRAPHY_CONFIRMATION='Abbiamo ricevuto la tua richiesta per le fotografie professionali. Un consulente ti contatterà per un confronto gratuito e senza impegno.';
export const DEFAULT_CONFIRMATION='Ti ricontatteremo via email o, se indicato, al numero di telefono fornito per verificare disponibilità e modalità del confronto. Nessun appuntamento è ancora fissato.';
export function requestedTopic(search){return new URLSearchParams(search).get('argomento')==='fotografie-professionali'?PHOTOGRAPHY_TOPIC:'';}

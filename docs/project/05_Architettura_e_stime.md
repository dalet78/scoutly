# Architettura e stime — A05
Proposta preliminare del team; nessun codice di prodotto realizzato.

## Architettura minima
1. Ingresso: URL e campi minimi conferiti con modalità utilizzabili; API solo dopo verifica e autorizzazione.
2. Normalizzazione: geografia, vendita/affitto, residenziale, candidato privato e grado di certezza.
3. Archivio semplice: ID annuncio, fonte, immobile candidato, agente, osservazioni e versioni.
4. Deduplica: ID/URL come regole certe; confronti prezzo/zona/caratteristiche come sospetti da verificare. Non fondere automaticamente immobili simili.
5. Selezione: regole esplicite; AI per estrazione/classificazione con possibilità di astenersi. Contenuto annunci trattato come dati, non istruzioni operative.
6. Vista agente: scheda, motivazione, feedback e ragione dello scarto.
7. Funnel: annuncio→approvato→contattato→disponibile→telefonata→appuntamento→mandato→chiusura→incasso.

Archivio e interfaccia semplici sono sufficienti alla prima prova; stack definitivo non scelto. Prima dell'uso multiagente servono separazione dati, accessi e regole di assegnazione. I dati operativi dei proprietari non vanno confusi con il vault delle note di progetto.

## Modulo successivo
Bozza messaggio, controllo del ruolo dichiarato, approvazione umana, invio solo sul canale verificato e registrazione dell'esito. Lo strumento non impersona un fotografo o un acquirente inesistenti.

## Ordini di grandezza preliminari
Assunzione: un implementatore competente, dati disponibili, nessuna app nativa e scope minimo. Una giornata-persona = 8 ore; fiducia bassa finché mancano campione e accessi. Le fasi possono sovrapporsi: non sommare meccanicamente gli intervalli.

| Fase                                   | Impegno stimato                             | Esclusioni                         |
| -------------------------------------- | ------------------------------------------- | ---------------------------------- |
| Verifica fonti e campione              | 2–5 giornate-persona, 16–40 ore             | Attese autorizzazioni e accordi    |
| Registro pilot, filtro e feedback      | 3–7 giornate-persona, 24–56 ore             | Raccolta continuativa e connettori |
| Deduplica/estrazione/report ripetibile | 5–10 giornate-persona aggiuntive, 40–80 ore | Variabilità reale delle fonti      |
| Contatto assistito                     | 3–7 giornate-persona aggiuntive, 24–56 ore  | Invio automatico e integrazioni    |
| Connettore e prodotto multiagente      | Non stimabili ora                           | Dipendenze non risolte             |

Non sono preventivi o benchmark. Il calendario dipende dalle ore settimanali di il fondatore e dalle attese; nessuna scadenza concordata. Un registro manuale per la sola raccolta del feedback può precedere lo sviluppo ed essere molto più piccolo di questi moduli.

## Aggiornamento baseline dal repository
Il repository contiene già prototipi statici inbound e Radar: [13_Progetto_e_repository](13_Progetto_e_repository.md). La frase iniziale “nessun codice di prodotto realizzato” descrive la prima analisi ed è superata quanto alla presenza di codice dimostrativo. Le stime storiche restano ordini di grandezza iniziali e non stime del lavoro residuo: prima eseguire baseline e verifica del riuso in [14_Backlog_task](14_Backlog_task.md). Nessun framework definitivo o backend lead già operativo presunto.

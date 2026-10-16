# Scoutly — definizione del progetto dal repository
Versione 0.1 — 16 ottobre 2026. A00 coordina; A03/A04/A05/A06/A07 svolti in sequenza. Specifica proposta, non approvazione di lancio.

## 1. Obiettivo e persone
Aiutare il primo agente ad acquisire opportunità residenziali da privati nel Comune di Milano, vendita e affitto con misure separate. Cliente pagante: agente; utilizzatore operativo: agente/operatore; proprietario: persona a cui il servizio si rivolge, non cliente pagante già acquisito.
Risultato iniziale: selezione utile con risparmio misurato. Risultato completo: proprietario consapevolmente disponibile al ricontatto dell’agente; non mandato o vendita garantiti.

## 2. Base tecnica osservata
Repository [dalet78/scoutly](https://github.com/dalet78/scoutly), fotografia al commit `ac3d7878c095739e82edba7bda88b42e65f7990d`. Lettura dei sorgenti tramite connettore GitHub; il clone da terminale non è riuscito per risoluzione DNS. Nessun codice modificato, test eseguito, issue creata o deployment attivato in questa analisi. Il vault resta documentazione privata, separata dal repository pubblico.

| Componente | Evidenza letta | Stato effettivamente accertato |
|---|---|---|
| Landing | `README.md`, `tools/`, `assets/tool.js`, `orientation.js` | 22 HTML e motore condiviso presenti; orientamenti e alcuni calcoli parziali, nessuna API di quotazioni collegata nei file letti |
| Raccolta inbound | `LEAD-INTEGRATION.md`, `assets/lead-config.js` | Contratto POST progressivo presente; endpoint, informativa e titolare vuoti nella configurazione letta; modalità demo |
| Radar | `radar/README.md`, `dist/app.js`, `agents.js`, `state.js` | UI e regole per analisi, verifiche datate, deduplica, cronologia, backup/CSV e persistenza locale presenti |
| Test e controlli | `radar/agents.test.js`, `package.json`, workflow YAML | Suite Node e CI Radar presenti; esito corrente non verificato in questa sessione |
| Aggiornamenti | `radar/dist/update-status.json` | File dichiara scheduleEnabled e tentativi parziali fino al 16 ottobre; non prova che il servizio scheduler sia attualmente attivo |
| Fonti | `radar/README.md`, `state.js` | Subito e gruppi Facebook già identificati/configurati nel codice; accessi attuali non verificati. idealista/Insights non compaiono come connettori nel flusso letto |

## 3. Architettura proposta: riuso prima di estensione
Conservare frontend statico HTML/CSS/JavaScript e Radar a moduli ES. Il server locale Radar è un server di file, non backend lead. Primo sviluppo: correggere avvio locale e chiarire policy, poi una sola funzione verificabile per volta. Non introdurre un framework per il solo riordino.

Due ingressi → normalizzazione minima → revisione umana → qualifica comune → consegna privata all’agente → esiti. Radar e inbound possono restare separati nell’interfaccia; ID e criteri comuni permettono un futuro raccordo. Un backend diventa necessario per contatti inbound persistenti o dati condivisi, non per la sola demo locale.

## 4. Radar — primo incremento
Inserimento di un annuncio utilizzabile → controllo Comune/operazione/residenziale → ruolo dichiarato o incerto → duplicati certi o sospetti → scheda motivata → utile/approfondire/scartare con tempo agente. Conservare scarti e prove; nessun contatto automatico. Mantenere distinte selezione dell’annuncio, disponibilità dichiarata e richiesta di ricontatto.

I sei agenti tecnici Radar non sostituiscono A00–A07: i primi sono moduli/regole e istruzioni di pubblicazione; i secondi sono ruoli di gestione del progetto. Il nome “Publisher” nel codice non autorizza a pubblicare.

## 5. Inbound — primo incremento proposto
Un solo ingresso attivo nel test; catalogo di 22 pagine conservato. Candidato raccomandato: “Vendere o affittare?”, scelta da confermare. Specificare prima un risultato utile: nel codice letto l’orientamento usa prevalentemente takeaway/note della pagina, non un motore decisionale personalizzato per questo tool.

Decisione aperta: mantenere contatto iniziale come nel repository oppure provare risultato prima del recapito come proposto in [11_Piano_esperimenti](11_Piano_esperimenti.md). Non cambiare di nascosto la regola del README. In entrambi i casi la richiesta deve indicare il soggetto e lo scopo reali, distinguere recapito per un report e disponibilità alla telefonata dell’agente. Il record va qualificato per immobile/perimetro e richiesta prima di essere consegnato.

## 6. Dati e consegna
Modello concettuale: fonte → annuncio/versione → immobile candidato → interlocutore → valutazione → richiesta di ricontatto → consegna a un agente → esiti. Ogni dato importante conserva categoria (osservato/dichiarato/inferito), fonte e data. Non inferire proprietà o assenza di mandato da foto, stile o “no agenzie”. Identità annuncio, immobile, persona e sessione web restano distinte.

Il contratto inbound già previsto usa leadId/eventId/stage: va riusato o migrato esplicitamente. Il destinatario privato dovrà validare, deduplicare eventi, preservare richieste parziali e non retrocedere quelle completate. Il frontend pubblico non contiene credenziali. Non pubblicare recapiti o registri operativi nel vault o in JSON pubblici; prima verificare i file già presenti nel repository, senza dichiarare eseguita una bonifica.

## 7. Differenze riconciliate e decisioni da prendere
| Tema | Note precedenti / repository | Trattamento |
|---|---|---|
| Software | Note: nessun codice prodotto; repository: prototipi già sviluppati | Baseline aggiornata: software dimostrativo presente, prodotto operativo e beneficio non validati. Stime vecchie da ricalcolare dopo prove di riuso |
| Gruppi Facebook | Note: URL mancanti; README Radar: gruppi identificati | Non richiedere da zero gli stessi URL; censire fonti già presenti e chiedere solo accessi/fonti aggiuntive |
| Campione e attività | Note: nessuna pipeline/test; repository contiene campioni e storico dichiarato | Dati preesistenti documentati, non una prova controllata con l’agente né evidenza di conversioni |
| Incarico agenzia | Brief ammette eventuale mandato non esclusivo; Radar esclude ogni presenza dichiarata di agenzia | Distinguere incarico esistente, esclusiva e contattabilità; decisione commerciale da confermare prima di cambiare filtro |
| Modulo inbound | Repository contatto prima delle domande; piano propone valore prima del recapito | Due alternative esplicite; scelta aperta, non regressione automatica del repository |
| Stato aggiornamenti | README parla di prima esecuzione non ancora avvenuta; JSON elenca tentativi successivi | README storico superato dal contenuto del JSON; stato live ancora non verificato. Non attivare/disattivare programmi in questa sessione |
| Avvio locale | `app.js` importa activity.js e description-style.js; server.mjs non li ammette nella propria lista | Difetto statico osservato: richieste a quei moduli riceverebbero 404 nel server letto. Correzione e smoke test prioritari; non ancora eseguiti |
| Date | Calcoli Radar oggi in Asia/Jerusalem, UI raccolta in Europe/Rome | Esplicitare fuso di dominio per scadenze Milano e testare i confini del giorno prima di modificarlo |

## 8. Misura del risultato e confini
Primo traguardo: demo locale riproducibile + feedback agente registrabile + un percorso inbound definito, ancora senza ricezione reale. Secondo: ricezione privata verificata e test controllati solo con risorse/modalità concordate. Confronto canali su costo completo per lead qualificato e, successivamente, appuntamento/mandato; il filtro da solo misura costo per annuncio utile.

Fuori dal primo incremento: 22 backend distinti, crawler generalizzato, contatti automatici, app mobile, CRM completo, Roma, segreteria, esclusiva territoriale e prezzi definitivi. I mandati e i pagamenti restano esiti futuri.

## 9. Metodo di consegna
Task atomici in [14_Backlog_task](14_Backlog_task.md). Uno stato “fatto” richiede output ed evidenza; presenza del codice non equivale a test superato. Ogni modifica tecnica passa da verifica locale e revisione, poi pubblicazione solo nell’ambito autorizzato. Nessuna scadenza o stima di calendario finché mancano capacità e accessi.

## Fonti primarie della baseline
- [README.md](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/README.md)
- [LEAD-INTEGRATION.md](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/LEAD-INTEGRATION.md)
- [assets/tool.js](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/assets/tool.js)
- [assets/lead-config.js](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/assets/lead-config.js)
- [assets/orientation.js](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/assets/orientation.js)
- [radar/README.md](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/radar/README.md)
- [radar/dist/agents.js](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/radar/dist/agents.js)
- [radar/dist/state.js](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/radar/dist/state.js)
- [radar/dist/app.js](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/radar/dist/app.js)
- [radar/server.mjs](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/radar/server.mjs)
- [radar/dist/update-status.json](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/radar/dist/update-status.json)
- [.github/workflows/scoutly-radar.yml](https://github.com/dalet78/scoutly/blob/ac3d7878c095739e82edba7bda88b42e65f7990d/.github/workflows/scoutly-radar.yml)

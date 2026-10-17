> 17 ottobre 2026 — Notifiche email impaginate in HTML: testata Scoutly, recapiti, consulenza, percorso, descrizione con a capo e numero/nome degli allegati. JSON firmato invariato nella parte MIME text/plain per l’agente; nessun dato reale nei sorgenti. 46 test Python locali passati, verifica visiva con dati simulati. Distribuire latest commit su Render per i nuovi invii; le email già consegnate conservano il formato precedente. Nessun reinvio eseguito.

> 17 ottobre 2026 — Flusso chiarito dal fondatore: form → notifica Resend alla casella operativa → agente Gmail ogni 30 minuti → risposta Gmail al richiedente. Nessuna OpenAI API su Render. Inoltro firmato, allegati, recupero della richiesta già salvata e verifica destinatario implementati; automazione aggiornata. **45 test Python + 5 JavaScript della pagina riservata passati localmente**. Serve Manual Deploy su Render e prova completa; nessuna risposta AI dal nuovo flusso dichiarata inviata. [Stato e task](39_Flusso_form_Gmail_AI.md).

> P03a (A05-BE) e P03b (A05-FE) implementati e testati localmente: endpoint pubblico e landing senza FormSubmit. P03c (A05-OPS) richiede deploy Render, PUBLIC_INTAKE_ENABLED=true e prova sintetica live; ancora aperto. P03d antispam/quote più forti prima di campagne, P04 AI/coda email ancora aperti. Salvataggio/foto/email riservata confermati dal fondatore. [Dettagli](38_Collegamento_pubblico_Render.md).

> P02: fondatore conferma ricevuta, richiesta e otto foto visibili su Supabase, doppioni riconosciuti. P04a (A05-INT): adapter Resend e pulsante invio tecnico al fondatore implementati; 29 test Python + 4 JavaScript locali passati; consegna reale ancora da verificare dopo deploy. P03 e flusso AI/email proprietari ancora aperti. Nessun destinatario proprietario abilitato dal test.

> P02, avanzamento 17 ottobre 2026: host Render avviato e `/health` verificato. Pagina di prova riservata `/test` preparata e testata localmente (16 Python + 3 JavaScript). Deploy nuova revisione e verifica effettiva record/foto in Supabase ancora da eseguire. Nessun collegamento alla landing o AI/email implicito.

> Aggiornamento 17 ottobre 2026: task ricezione privata Python/Supabase. P01 (A05-BE) codice e 15 test locali: completato. P02 (A05-OPS) Render Free e verifica salvataggio remoto: da eseguire, dipende dalle variabili server. P03 (A05-FE/BE) antispam pubblico, collegamento landing e ricevuta: da eseguire dopo P02. P04 (A05-INT) coda AI/email e prova completa: da eseguire. Fonte: [ricevitore](../../intake-python/README.md). Nessuno di P02–P04 dichiarato live.

> Priorità superata nell’ordine di esecuzione — 16 ottobre 2026: seguire [Inbound pre-pubblicazione e N01–N08](16_Inbound_pre_pubblicazione.md). Il principio 80/20 resta, Radar viene rinviato. Questo documento resta storico/inventario e non blocca la prova inbound.

# Backlog Scoutly — task piccoli
Versione 0.1 — 16 ottobre 2026. Baseline e motivazioni: [13_Progetto_e_repository](13_Progetto_e_repository.md).
Task di lavoro, non issue GitHub già create. Responsabili indicano ruoli del workflow, non persone esterne incaricate. Le righe “decisione aperta” non bloccano task indipendenti.

## Regola di esecuzione
Un task = un risultato verificabile, normalmente una modifica o una decisione. Se durante l’esecuzione supera una sessione di lavoro o coinvolge più componenti indipendenti, dividerlo prima di procedere. Nessuna durata promessa; le stime storiche non incorporano questo riuso. Stato fatto solo con evidenza allegata. Stato pronto significa lavorabile, non completato.

## Priorità iniziale aggiornata
Seguire la [Roadmap 80/20](15_Roadmap_80_20.md), M01–M08: un agente, una fonte utilizzabile, filtro e feedback manuale. Il resto è backlog successivo. Per la prova del solo filtro, i gate V02/V05/V06 non dipendono dall’implementazione R08–R10 o I13: usare il percorso manuale documentato. Restano necessarie condizioni di accesso/uso, protocollo e baseline prima del test reale. Le dipendenze complete sottostanti valgono per l’integrazione dei due canali, non obbligano a costruirli entrambi prima di apprendere.

## Ordine dei blocchi
1. Baseline e avvio locale (B): rendere verificabile ciò che esiste.
2. Policy (P): poche scelte prima dei cambiamenti di comportamento.
3. Radar (R) e fonti (F): primo beneficio misurabile.
4. Un solo percorso inbound (I): ricezione reale privata dopo prova in ambiente dedicato.
5. Validazione (V): test di servizio, poi scelta economica e prodotto successivo.

## Task e dipendenze
| ID | Task | Ruolo | Dipende da | Completato quando | Stato |
|---|---|---|---|---|---|
| B01 | Fissare baseline e inventario | A05 | — | Commit e mappa componenti in [13_Progetto_e_repository](13_Progetto_e_repository.md) | Fatto: lettura statica |
| B02 | Preparare copia di sviluppo separata dal vault | A05 | B01 | Checkout del commit; note private escluse e istruzioni repository lette | Pronto |
| B03 | Eseguire suite Radar esistente senza modifiche | A05 | B02 | Versione Node, comando, conteggi pass/fail ed errori registrati | Da fare |
| B04 | Correggere accesso ai due moduli nel server locale | A05 | B02 | activity.js e description-style.js rispondono 200; file esterni alla lista restano bloccati | Da fare |
| B05 | Verificare Radar nel browser | A05/A07 | B03,B04 | Avvio, schede, filtri vendita/affitto e dialoghi senza errori console | Da fare |
| B06 | Censire dati pubblici e dati da mantenere privati | A05 | B01 | Inventario campi/file e proposta di separazione; nessuna copia di recapiti nelle note | Da fare |
| P01 | Decidere trattamento di incarico esistente ed esclusiva | A03 + il fondatore | B01 | Tabella casi: nessun incarico/non esclusivo/esclusivo/ignoto; esito desiderato | Decisione aperta |
| P02 | Decidere immobili interi e stanze nel primo test | A04 + il fondatore | B01 | Inclusioni ed esclusioni residenziali esplicite; uffici/box/terreni esclusi dal test | Decisione aperta |
| P03 | Scegliere il primo mini-tool | A03 + il fondatore | B01 | Una pagina scelta con ipotesi e risultato atteso; raccomandato vendere/affittare | Decisione aperta |
| P04 | Scegliere posizione del recapito e scopo richiesta | A03 + il fondatore | P03 | Percorso contatto iniziale o valore iniziale deciso; distinzione report/telefonata | Decisione aperta |
| R01 | Aggiungere casi test della policy incarichi | A05/A07 | P01,B03 | Casi approvati riprodotti senza confondere incarico ed esclusiva | Da fare |
| R02 | Allineare il filtro incarichi alla policy | A05 | R01 | Esiti e motivazioni coerenti; prove e storico conservati | Da fare |
| R03 | Aggiungere test geografici e tipologie | A05/A07 | P02,B03 | Milano/hinterland/ignoto e residenziale/non residenziale coperti per ogni fonte | Da fare |
| R04 | Uniformare controllo perimetro su tutte le fonti | A05 | R03 | Dati incerti in revisione, fuori perimetro esclusi secondo policy | Da fare |
| R05 | Definire fuso e confini delle scadenze | A05 | B03 | Decisione fuso di dominio e test mezzanotte/date mancanti/soglie 7 e 30 giorni | Da fare |
| R06 | Allineare calcoli e visualizzazione delle date | A05 | R05 | Stessa policy applicata con test deterministici e data originale preservata | Da fare |
| R07 | Definire record di feedback agente | A04 | B01 | Campi utile/approfondire/scartare, motivo, già noto, tempo, agente, coorte e data | Pronto |
| R08 | Salvare feedback senza modificare la classificazione fonte | A05 | R07,B05 | Feedback sopravvive a reload e resta distinto dall’esito automatico | Da fare |
| R09 | Includere feedback in backup e ripristino | A05 | R08 | Round-trip conserva dati vecchi e nuovi; import invalido non altera stato | Da fare |
| R10 | Esportare tempi e feedback per analisi | A05/A06 | R09 | CSV con colonne coerenti, separazione vendita/affitto e celle protette | Da fare |
| F01 | Censire fonti già configurate | A05 | B01 | URL, accesso noto, data/limite, campi disponibili; niente nuova richiesta di URL già noti | Pronto |
| F02 | Preparare matrice accesso e riuso per fonte | A05 | F01 | Accesso, conservazione, uso commerciale e contatto distinti; incognite esplicite | Da fare |
| F03 | Preparare richieste campioni/licenze/preventivi | A05/A06 | F02 | Bozze per fornitori con quesiti mirati; nessun invio | Da fare |
| F04 | Verificare origine dello stato scheduler | A05 | B01 | Codice/file, dichiarazione storica e servizio live distinti; nessuna riattivazione | Da fare |
| F05 | Allineare etichette UI e README allo stato verificabile | A05 | F04 | Tentativo parziale distinto da successo; niente promessa di monitoraggio non provato | Da fare |
| I01 | Specificare domande e risultato del tool scelto | A03/A04 | P03 | Mappa risposta→indicazione utile, limiti e casi mancanti; nessuna stima inventata | Da fare |
| I02 | Implementare orientamento del solo tool scelto | A05 | I01 | Risultati dei casi concordati distinguibili e spiegabili; regressione altri tool evitata | Da fare |
| I03 | Adeguare percorso al posizionamento recapito scelto | A05 | P04,I02 | Passi/Indietro/reset coerenti; demo continua senza rete | Da fare |
| I04 | Definire dati di qualifica e richiesta di ricontatto | A04/A05 | P04 | Comune, ruolo, operazione, intenzione e richiesta distinguibili; contratto eventi versionato | Da fare |
| I05 | Scegliere destinatario privato dei lead | A05/A06 + il fondatore | I04,B06 | Soluzione, costi, accessi, esportazione e cancellazione documentati; nessun acquisto implicito | Decisione aperta |
| I06 | Specificare schema eventi e gestione fuori ordine | A05 | I04,I05 | leadId/eventId, stage, ora ricezione, idempotenza e merge definiti | Da fare |
| I07 | Realizzare persistenza privata con validazione | A05 | I06 | Evento salvato prima di accepted:true; nessun dato personale in repository pubblico | Da fare |
| I08 | Gestire doppio invio e aggiornamenti fuori ordine | A05 | I07 | Stesso eventId una registrazione; complete non retrocede a parziale | Da fare |
| I09 | Limitare invii abusivi e dimensione payload | A05 | I07 | Input malformati e sovradimensionati rifiutati; limiti richieste e CORS testati | Da fare |
| I10 | Definire soggetto, informativa e gestione richieste | il fondatore + specialista pertinente | I05 | Identità/scopo, accessi, conservazione e modalità di ricontatto definiti per il caso concreto | Dipendenza esterna |
| I11 | Collegare frontend e ricevitore in ambiente di prova | A05 | I08,I09,I10 | Solo dati fittizi; ack reale, timeout/errore/ritentativo verificati | Da fare |
| I12 | Verificare percorso mobile e accessibilità essenziale | A05/A07 | I03,I11 | Tastiera, etichette, errori, focus, risultato e reset verificati sul tool scelto | Da fare |
| I13 | Documentare avvio e aggiungere controlli inbound in CI | A05 | I12 | Comando riproducibile e casi critici eseguiti anche sui percorsi assets/tools | Da fare |
| V01 | Concordare ore, budget e modalità feedback | A01 + il fondatore/agente | B01 | Capacità, tetti e sessione disponibili scritti; nessuna data inventata | Riscontro esterno |
| V02 | Fissare coorti, baseline e soglie filtro | A04/A07 | V01,F02,R10 | Protocollo prima del test; 30–50 e soglie precedenti restano proposte finché concordate | Da fare |
| V03 | Scegliere canale di traffico e soglie inbound | A06/A07 + il fondatore | V01,P03 | Un canale disponibile, periodo e tetto spesa definiti; niente campagna attiva | Decisione aperta |
| V04 | Definire deduplica e attribuzione tra i due canali | A04/A06 | I04,R07 | Stesso immobile/persona/agente e finestra; doppie origini senza doppio conteggio | Da fare |
| V05 | Riesaminare prontezza al test | A00/A07 | B05,R10,F02,I13,V02,V03,V04 | Checklist con blocchi per canale; una demo riuscita non basta a dichiarare pilot avviato | Da fare |
| V06 | Eseguire test controllati solo dopo condizioni soddisfatte | il fondatore/agente + team | V05 | Registri reali, costi/tempi e limiti; contatti/campagne/pubblicazioni richiedono istruzione esplicita | Non avviato |
| V07 | Confrontare risultati e decidere incremento successivo | A06/A07/A00 | V06 | Annunci utili e lead distinti; denominatori, coorti e decisione procedere/iterare/fermare | Da fare |

## Prima sequenza tecnica proposta
B02 → B03/B04 → B05. Primo risultato dimostrabile: Radar avviabile localmente, controlli esistenti con esito registrato e nessun errore di caricamento dei moduli. Non partire dalla riscrittura del sito o dall’attivazione di tutti i 22 moduli.

In parallelo logico A03 chiarisce P01–P04 con il fondatore; A05 può censire fonti e dati pubblici senza aspettare scelte di prezzo. La mancanza di accesso a una fonte non impedisce test locali su fixture fittizie chiaramente identificate.

## Modello di aggiornamento per ogni task
- Input: commit e versione dei documenti.
- Cambiamento/output: file e comportamento interessati.
- Verifica: comando/prova, esito e limiti.
- Decisioni o blocchi: dato mancante, chi può fornirlo, task dipendenti.
- Prossima azione: ID successivo e responsabile.

## Dopo questo backlog
Eseguire il primo blocco tecnico quando si passa allo sviluppo. Creazione delle issue, pubblicazione e campagne sono azioni distinte; nessuna eseguita durante la pianificazione. Prezzi ed esclusiva territoriale restano rinviati.

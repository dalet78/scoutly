> 22 ottobre 2026 — UI03: due controlli guidati dedicati, Fotografie della casa e Checklist prima di vendere. Tre domande, 2–3 indicazioni condizionate alle risposte e invito al modulo esistente per chiedere consulenza gratuita. Risposte locali in memoria: nessun upload, recapito, salvataggio o nuovo workflow backend. Il questionario foto non analizza immagini; la checklist non verifica documenti o conformità. Home a quattro ingressi e sezione sulle conseguenze possibili di errori: interesse perso, chiarimenti e lavoro da rifare, senza quantità o danni economici inventati. 54 test Node locali passati, incluse tutte le 54 combinazioni di risposte dei due questionari. Nessuna automazione email modificata; automazione Scoutly non trovata tramite lookup privato in questa sessione. UI02 informativa già pubblicata tramite PR #3, build Cloudflare riuscita; nuove pagine in verifica/pubblicazione.

> 22 ottobre 2026 — UI02: su richiesta del fondatore, home riorientata a guida informativa per presentare meglio la casa in vendita: tre consigli concreti, due approfondimenti tematici e invito principale alla consulenza gratuita. Nei due form, CTA e blocco dedicato al consulente più visibili; richiesta di ricontatto ancora volontaria, separata e non preselezionata. Perizia gratuita non promessa: deliverable e modalità non ancora definiti. Bozza/risposta AI, campi, script, backend e automazioni conservati; il risultato effettivo del servizio non viene troncato o cambiato dal solo copy. 48 test Node locali passati; test del tema aggiornato per accettare una versione cache CSS nuova. Nessun invio reale. Verifica anteprima e pubblicazione in corso.

> 22 ottobre 2026 — Su richiesta del fondatore, rimossi i riferimenti a Milano dalla home (descrizione SEO, etichetta servizi e footer). Il marchio viene presentato senza vincolo geografico in vista dell'estensione futura a tutti i comuni. Nessuna promessa di copertura nazionale già attiva: perimetro dei servizi attuali, campi dei moduli e backend conservati. Verifica sorgente: nessuna occorrenza di Milano nella home; collegamenti ai due percorsi invariati.

> 22 ottobre 2026 — UI01 pubblicata su autorizzazione esplicita del fondatore: PR #2 unita in main, commit 81ab192b847ca77796b1c976b039998d8a01dd1f. Cloudflare Workers production build 50337d84-b89f-4b21-928a-8811eb91fb92 completata con successo; anche checklist, python-intake e Pages build/deploy riusciti. Tema moderno distribuito sul servizio collegato a scoutly-ai.com. Verifica diretta del dominio impedita da Netskope (Potentially Malicious Site): nessun superamento dell'avviso e nessun invio di prova. Restano da verificare dal browser del fondatore l'apertura del dominio e il collegamento backend dei moduli; anteprima grafica e contrasto già verificati nel giro precedente. Nessuna modifica a backend, CORS o filtri aziendali.

> 22 ottobre 2026 — UI01, verifica successiva: anteprima Cloudflare separata riuscita dopo aggiunta di wrangler.json (name scoutly, assets ./dist, previews vuoto), senza merge in main o deploy del dominio pubblico. URL: https://codex-modern-human-ui-20261022-scoutly.dalet-p.workers.dev/ . Controlli GitHub checklist/python-intake riusciti su 854b0a6. Browser: home desktop e mobile 320; primo form desktop e mobile 375; secondo form mobile 375 e 320. Nessuno scorrimento orizzontale ai viewport controllati. Audit DOM del contrasto dei testi su sfondi solidi: 30 elementi home, 71 primo form, 62 secondo form, nessun valore sotto la soglia usata; non è un audit WCAG completo. Corretto a capo del titolo del primo form su mobile. Nessuna richiesta inviata; la preview non è autorizzata dal CORS del backend, quindi l'invio rimane disabilitato. Non ampliare il CORS di produzione per un controllo grafico. Da decidere: merge e pubblicazione sul dominio pubblico, dopo autorizzazione esplicita.

> 22 ottobre 2026 — UI01: stile moderno petrolio/lime approvato dal fondatore in chat e implementato su home, due form attivi e due ricevute. Tema condiviso `assets/modern.css`; superfici chiare con testo scuro nei form. 48 test Node passati (`node --test tests/*.test.mjs`, Node v25.9.0), inclusi 14 controlli del tema/contrasto. Confronto strutturale: campi, consensi, attributi form e script invariati rispetto a b386c18. Contrasto nominale: etichette form 12,77:1, note 6,44:1, pulsanti 11,28:1, placeholder 5,56:1. Questi controlli non attestano tutto il contrasto renderizzato o accessibilità completa. Browser QA non completata: server locale negato dal sandbox e URL file bloccato dal browser. Nessun invio di prova o deployment eseguito. Prossimo: revisione browser desktop/mobile e pubblicazione su autorizzazione esplicita; eventuale build Cloudflare deve includere assets/modern.css.

> 17 ottobre 2026 — Correzione operativa verificata: il flag Render era attivo, ma Supabase conservava i tre CHECK limitati al primo form. Applicata nel progetto di test la migrazione supabase/002_secondo_form.sql; esito SQL riuscito. La stessa prova tecnica sintetica, prima respinta con HTTP 503, dopo la migrazione restituisce HTTP 201, status received ed email_notice accepted. Non confondere il codice di un tentativo incerto con una conferma di salvataggio. Restano da verificare una richiesta reale del secondo percorso e la relativa risposta AI; i test tecnici sono esclusi dalle risposte automatiche. Permessi, RLS e dati precedenti invariati.

> Verifica finale 17 ottobre 2026: controlli GitHub e Pages riusciti su e54e4dd. Browser pubblico: Milano predefinito, prezzo 392.000 e pulsante attivo. /health riporta renovation_form_enabled=true e /public/config espone entrambi i form, floor_plan_upload=true e municipality_support=true. La configurazione Render ora è aggiornata e abilitata; la diagnosi false sotto descrive lo stato precedente. Nessuna richiesta reale inviata in questa modifica: salvataggio remoto del secondo form, notifica e risposta completa restano da verificare con un invio autorizzato.

> 17 ottobre 2026 — UX del secondo form: anteprime locali distinte dall'invio, avanzamento byte e conferma salvataggio separati; prezzo con punti delle migliaia; ricerca comuni ISTAT con Milano predefinito. Codice/nome del comune validati e firmati, perimetro Milano invariato. 73 test Python e 17 JS pubblici locali passati. Diagnosi live: RENOVATION_FORM_ENABLED ancora false, quindi invio disabilitato; servono attivazione già prevista e latest deploy, nessun nuovo SQL.

> 17 ottobre 2026 — Agente del secondo form aggiornato: consigli pratici dalle foto con schema osservazione → intervento circoscritto → beneficio di presentazione; normalmente 2–3, solo se motivati. Nessun costo o aumento di prezzo inventato. Nessuna modifica al primo form e nessun nuovo deploy richiesto per questa modifica alle istruzioni. Restano le attivazioni backend già indicate sotto.

> 17 ottobre 2026 — Secondo form: aggiunta **planimetria catastale facoltativa come immagine separata**, anteprima/rimozione, metadati firmati e allegato dedicato. Limite 8 immagini/8 MB: con la piantina fino a 7 foto. Agente aggiornato, nessuna attestazione di conformità. 65 test Python e 11 JavaScript pubblici locali passati; nessuna nuova migrazione SQL. Serve deploy latest commit Render e prova completa.

> 17 ottobre 2026 — Secondo percorso autorizzato: **Ristrutturare o vendere così?**, con foto, prezzo ipotizzato, superficie, zona e tempi. Confronto qualitativo di tre scenari, prezzo del proprietario non validato e consulenza gratuita facoltativa. Backend, pagina, notifiche e agente Gmail aggiornati; 59 test Python e 14 JavaScript locali passati. **Da attivare:** eseguire supabase/002_secondo_form.sql, impostare RENOVATION_FORM_ENABLED=true e Manual Deploy latest commit su Render. Nessuna prova reale del secondo form ancora eseguita. [Guida e task](40_Form_ristrutturare_o_vendere.md).

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


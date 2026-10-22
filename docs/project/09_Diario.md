> 22 ottobre 2026 — UI01, verifica successiva: anteprima Cloudflare separata riuscita dopo aggiunta di wrangler.json (name scoutly, assets ./dist, previews vuoto), senza merge in main o deploy del dominio pubblico. URL: https://codex-modern-human-ui-20261022-scoutly.dalet-p.workers.dev/ . Controlli GitHub checklist/python-intake riusciti su 854b0a6. Browser: home desktop e mobile 320; primo form desktop e mobile 375; secondo form mobile 375 e 320. Nessuno scorrimento orizzontale ai viewport controllati. Audit DOM del contrasto dei testi su sfondi solidi: 30 elementi home, 71 primo form, 62 secondo form, nessun valore sotto la soglia usata; non è un audit WCAG completo. Corretto a capo del titolo del primo form su mobile. Nessuna richiesta inviata; la preview non è autorizzata dal CORS del backend, quindi l'invio rimane disabilitato. Non ampliare il CORS di produzione per un controllo grafico. Da decidere: merge e pubblicazione sul dominio pubblico, dopo autorizzazione esplicita.

> 22 ottobre 2026 — UI01: stile moderno petrolio/lime approvato dal fondatore in chat e implementato su home, due form attivi e due ricevute. Tema condiviso `assets/modern.css`; superfici chiare con testo scuro nei form. 48 test Node passati (`node --test tests/*.test.mjs`, Node v25.9.0), inclusi 14 controlli del tema/contrasto. Confronto strutturale: campi, consensi, attributi form e script invariati rispetto a b386c18. Contrasto nominale: etichette form 12,77:1, note 6,44:1, pulsanti 11,28:1, placeholder 5,56:1. Questi controlli non attestano tutto il contrasto renderizzato o accessibilità completa. Browser QA non completata: server locale negato dal sandbox e URL file bloccato dal browser. Nessun invio di prova o deployment eseguito. Prossimo: revisione browser desktop/mobile e pubblicazione su autorizzazione esplicita; eventuale build Cloudflare deve includere assets/modern.css.

> 17 ottobre 2026 — Correzione operativa verificata: il flag Render era attivo, ma Supabase conservava i tre CHECK limitati al primo form. Applicata nel progetto di test la migrazione supabase/002_secondo_form.sql; esito SQL riuscito. La stessa prova tecnica sintetica, prima respinta con HTTP 503, dopo la migrazione restituisce HTTP 201, status received ed email_notice accepted. Non confondere il codice di un tentativo incerto con una conferma di salvataggio. Restano da verificare una richiesta reale del secondo percorso e la relativa risposta AI; i test tecnici sono esclusi dalle risposte automatiche. Permessi, RLS e dati precedenti invariati.

# Diario pubblico di continuità

## 16 ottobre 2026 — Consolidamento del progetto
Riconciliati i documenti di progetto, aggiunto il canale inbound e rimossi doppioni. Preservato l’archivio privato originale senza trasferirne percorsi personali o trattative individuali.

## 16 ottobre 2026 — Baseline tecnica
Esaminato dalet78/scoutly al commit ac3d7878c095739e82edba7bda88b42e65f7990d. Riscontrati prototipi preesistenti, configurazione inbound demo, Radar con regole e test, fonti già documentate e storico dichiarato degli aggiornamenti.
Preparati [progetto](13_Progetto_e_repository.md), [backlog di 45 task](14_Backlog_task.md), [esperimenti](11_Piano_esperimenti.md) e [scheda dati](12_Scheda_feedback_e_dati.md).
Nessun test eseguito o modifica al comportamento in questa fase documentale.

## 16 ottobre 2026 — Continuità tra PC
Su richiesta del proprietario, preparata la documentazione portabile da conservare su main: AGENTS.md, guida di avvio, stato di ripresa e dossier selezionato. La revisione automatica ha respinto l’esportazione del brief originale per dettagli personali/commerciali; predisposta questa versione pubblicabile senza tali contenuti. Il vault originale resta privato.
Repository fonte del contesto condiviso, Obsidian copia opzionale. Credenziali e dati operativi browser non trasferiti. La documentazione non prova un pilot avviato né autorizza campagne o contatti.

## 16 ottobre 2026 — Priorità 80/20
Su indicazione del fondatore ridotta la roadmap iniziale al primo ciclo M01–M08: riuso Radar, una fonte utilizzabile, revisione umana, feedback privato manuale e misura del tempo. Inbound complementare in un secondo ciclo condizionato al traffico; nessuna attivazione automatica dei 22 tool. Eliminata come prerequisito del test filtro la costruzione della UI feedback e dell’inbound completo; backlog conservato per sviluppi successivi. “80/20” è criterio, non risultato quantitativo dimostrato. Nessun test di prodotto o campagna eseguiti.

## 16 ottobre 2026 — Roadmap inbound pubblicata con autorizzazione esplicita
Il fondatore ha autorizzato la pubblicazione della strategia commerciale precedentemente rimasta locale. Aggiunti piano pre-pubblicazione e task N01–N08; aggiornati stato, istruzioni, guida, indice e precedenti roadmap. Catalogo plugin verificato; suggerita la sola integrazione Windsor.ai, non ancora collegata. Team minimo e accessi in 17_Team_e_plugin_operativi.md. Nessuna campagna, contatto, attivazione endpoint o test prodotto eseguiti.

## 16 ottobre 2026 — Task ricezione sincronizzati
Su richiesta esplicita sincronizzato il piano C01–C14, con unico responsabile per task, dipendenze e criteri. Registro privato come fonte autorevole, email e Telegram notifiche; CRM rinviato. Prossimi C02/A04 e C04/A05-ARCH. Nessuna implementazione dei task o attivazione invii implicita. Sincronizzazione limitata al piano e ai punti di ripresa: prototipo B e altri documenti locali non inclusi.


## 17 ottobre 2026 — Ricevitore privato Python per test
Fondatore dichiara completati creazione progetto Supabase e script SQL. Preparato ricevitore separato FastAPI, archivio privato richieste/foto e configurazione Render Free. 15 test locali passati con archivio/trasporto simulati: otto foto, validazione, doppioni, fallimenti e timeout. Segnalazione di deprecazione Starlette TestClient/httpx, nessun test fallito. Non verificati credenziali/schema/persistenza remoti. Nessun deploy Render, modifica landing, invio email o AI attivati. Prossimo: configurazione Render e ricezione sintetica verificata in Supabase. File del fondatore assenti dal codice pubblicabile.


## 17 ottobre 2026 — Host avviato e prova riservata pronta
Log Render confermano avvio Uvicorn; controllo diretto /health risponde ok/private-test/email_enabled=false. Preparata /test con campo password per la sola chiave della prova, nessuna credenziale inclusa nei sorgenti e nessun invio AI/email. Descrizione e otto PNG sintetici, UUID conservato per evitare doppioni, nessun retry automatico su errori. 16 test Python e 3 JavaScript passati localmente; archivio/trasporto simulati, una segnalazione deprecazione TestClient/httpx. Salvataggio remoto ancora da verificare dopo il deploy della nuova revisione. Prossimo A05-OPS: esecuzione della prova e controllo tabelle/oggetti in Supabase.


## 17 ottobre 2026 — Collegamento Resend per prova singola
Fondatore conferma richiesta e otto file visibili in Supabase e configurazione account/chiave Resend su Render. Preparati endpoint riservato e pulsante email su /test: destinatario configurato soltanto nelle variabili private Render, solo richieste sintetiche ricevute, nessun contenuto o recapito arbitrario dal browser. Flag persistente prima dell'invio e chiave idempotenza provider; errori/timeout non generano retry automatici. Nessuna migrazione aggiuntiva, uso del JSON answers.mail_test. 29 test Python e 4 JavaScript locali passati con provider simulato; una segnalazione deprecazione TestClient/httpx. Invio/consegna live ancora da verificare dopo deploy. Nessun proprietario contattato, AI disattivata e landing pubblica non modificata.


## 17 ottobre 2026 — Form pubblico predisposto per Render
Fondatore conferma riuscita delle prove riservate e autorizza collegamento pubblico. Tolto FormSubmit dalla landing: multipart al nuovo endpoint, token pubblico temporaneo senza chiavi private, origine esplicita e limiti di prova, codice e ricevuta solo dopo salvataggio, nessun retry automatico. Test locali: 38 Python e 11 JavaScript passati, archivio/provider simulati. Nuova configurazione richiede PUBLIC_INTAKE_ENABLED=true e deploy Render; ricezione live ancora da verificare. Capienza iniziale 20 record totali. Nessuna nuova migrazione SQL. Nessuna generazione AI, notifica o email ai proprietari implicita; campagna non avviata.


## 17 ottobre 2026 — Flusso Gmail confermato
17 ottobre 2026 — Flusso chiarito dal fondatore: form → notifica Resend alla casella operativa → agente Gmail ogni 30 minuti → risposta Gmail al richiedente. Nessuna OpenAI API su Render. Inoltro firmato, allegati, recupero della richiesta già salvata e verifica destinatario implementati; automazione aggiornata. **45 test Python + 5 JavaScript della pagina riservata passati localmente**. Serve Manual Deploy su Render e prova completa; nessuna risposta AI dal nuovo flusso dichiarata inviata. [Stato e task](39_Flusso_form_Gmail_AI.md).



## 17 ottobre 2026 — Impaginazione notifiche
17 ottobre 2026 — Notifiche email impaginate in HTML: testata Scoutly, recapiti, consulenza, percorso, descrizione con a capo e numero/nome degli allegati. JSON firmato invariato nella parte MIME text/plain per l’agente; nessun dato reale nei sorgenti. 46 test Python locali passati, verifica visiva con dati simulati. Distribuire latest commit su Render per i nuovi invii; le email già consegnate conservano il formato precedente. Nessun reinvio eseguito.



## 17 ottobre 2026 — Secondo form
17 ottobre 2026 — Secondo percorso autorizzato: **Ristrutturare o vendere così?**, con foto, prezzo ipotizzato, superficie, zona e tempi. Confronto qualitativo di tre scenari, prezzo del proprietario non validato e consulenza gratuita facoltativa. Backend, pagina, notifiche e agente Gmail aggiornati; 59 test Python e 14 JavaScript locali passati. **Da attivare:** eseguire supabase/002_secondo_form.sql, impostare RENOVATION_FORM_ENABLED=true e Manual Deploy latest commit su Render. Nessuna prova reale del secondo form ancora eseguita. [Guida e task](40_Form_ristrutturare_o_vendere.md).



## 17 ottobre 2026 — Planimetria separata
17 ottobre 2026 — Secondo form: aggiunta **planimetria catastale facoltativa come immagine separata**, anteprima/rimozione, metadati firmati e allegato dedicato. Limite 8 immagini/8 MB: con la piantina fino a 7 foto. Agente aggiornato, nessuna attestazione di conformità. 65 test Python e 11 JavaScript pubblici locali passati; nessuna nuova migrazione SQL. Serve deploy latest commit Render e prova completa.



## 17 ottobre 2026 — Piccoli interventi dalle foto
17 ottobre 2026 — Agente del secondo form aggiornato: consigli pratici dalle foto con schema osservazione → intervento circoscritto → beneficio di presentazione; normalmente 2–3, solo se motivati. Nessun costo o aumento di prezzo inventato. Nessuna modifica al primo form e nessun nuovo deploy richiesto per questa modifica alle istruzioni. Restano le attivazioni backend già indicate sotto.



## 17 ottobre 2026 — Stato invio, importo e comuni
17 ottobre 2026 — UX del secondo form: anteprime locali distinte dall'invio, avanzamento byte e conferma salvataggio separati; prezzo con punti delle migliaia; ricerca comuni ISTAT con Milano predefinito. Codice/nome del comune validati e firmati, perimetro Milano invariato. 73 test Python e 17 JS pubblici locali passati. Diagnosi live: RENOVATION_FORM_ENABLED ancora false, quindi invio disabilitato; servono attivazione già prevista e latest deploy, nessun nuovo SQL.



## 17 ottobre 2026 — Servizio abilitato nel controllo finale
Verifica finale 17 ottobre 2026: controlli GitHub e Pages riusciti su e54e4dd. Browser pubblico: Milano predefinito, prezzo 392.000 e pulsante attivo. /health riporta renovation_form_enabled=true e /public/config espone entrambi i form, floor_plan_upload=true e municipality_support=true. La configurazione Render ora è aggiornata e abilitata; la diagnosi false sotto descrive lo stato precedente. Nessuna richiesta reale inviata in questa modifica: salvataggio remoto del secondo form, notifica e risposta completa restano da verificare con un invio autorizzato.



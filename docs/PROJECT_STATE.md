> 23 ottobre 2026 — UI05: implementati home AI + consulenza e modulo diretto tools/consulenza.html, quattro campi obbligatori e dettagli facoltativi espandibili, senza foto. Workflow backend/notifica dedicato, nessuna bozza AI. Migrazione Supabase 004 eseguita con successo; migrazione 003 per 10 immagini verificata riuscita nel pannello dell’utente e codice relativo incluso. 88 test Python e 62 Node passati localmente; archivio/email simulati. Attivazione protetta da CONSULTATION_FORM_ENABLED=true; pubblicazione e prova reale da completare. Dettagli: project/42_Consulenza_diretta.md.

> 22 ottobre 2026 — UI01, verifica successiva: anteprima Cloudflare separata riuscita dopo aggiunta di wrangler.json (name scoutly, assets ./dist, previews vuoto), senza merge in main o deploy del dominio pubblico. URL: https://codex-modern-human-ui-20261022-scoutly.dalet-p.workers.dev/ . Controlli GitHub checklist/python-intake riusciti su 854b0a6. Browser: home desktop e mobile 320; primo form desktop e mobile 375; secondo form mobile 375 e 320. Nessuno scorrimento orizzontale ai viewport controllati. Audit DOM del contrasto dei testi su sfondi solidi: 30 elementi home, 71 primo form, 62 secondo form, nessun valore sotto la soglia usata; non è un audit WCAG completo. Corretto a capo del titolo del primo form su mobile. Nessuna richiesta inviata; la preview non è autorizzata dal CORS del backend, quindi l'invio rimane disabilitato. Non ampliare il CORS di produzione per un controllo grafico. Da decidere: merge e pubblicazione sul dominio pubblico, dopo autorizzazione esplicita.

> 22 ottobre 2026 — UI01: stile moderno petrolio/lime approvato dal fondatore in chat e implementato su home, due form attivi e due ricevute. Tema condiviso `assets/modern.css`; superfici chiare con testo scuro nei form. 48 test Node passati (`node --test tests/*.test.mjs`, Node v25.9.0), inclusi 14 controlli del tema/contrasto. Confronto strutturale: campi, consensi, attributi form e script invariati rispetto a b386c18. Contrasto nominale: etichette form 12,77:1, note 6,44:1, pulsanti 11,28:1, placeholder 5,56:1. Questi controlli non attestano tutto il contrasto renderizzato o accessibilità completa. Browser QA non completata: server locale negato dal sandbox e URL file bloccato dal browser. Nessun invio di prova o deployment eseguito. Prossimo: revisione browser desktop/mobile e pubblicazione su autorizzazione esplicita; eventuale build Cloudflare deve includere assets/modern.css.

> 17 ottobre 2026 — Correzione operativa verificata: il flag Render era attivo, ma Supabase conservava i tre CHECK limitati al primo form. Applicata nel progetto di test la migrazione supabase/002_secondo_form.sql; esito SQL riuscito. La stessa prova tecnica sintetica, prima respinta con HTTP 503, dopo la migrazione restituisce HTTP 201, status received ed email_notice accepted. Non confondere il codice di un tentativo incerto con una conferma di salvataggio. Restano da verificare una richiesta reale del secondo percorso e la relativa risposta AI; i test tecnici sono esclusi dalle risposte automatiche. Permessi, RLS e dati precedenti invariati.

> Verifica finale 17 ottobre 2026: controlli GitHub e Pages riusciti su e54e4dd. Browser pubblico: Milano predefinito, prezzo 392.000 e pulsante attivo. /health riporta renovation_form_enabled=true e /public/config espone entrambi i form, floor_plan_upload=true e municipality_support=true. La configurazione Render ora è aggiornata e abilitata; la diagnosi false sotto descrive lo stato precedente. Nessuna richiesta reale inviata in questa modifica: salvataggio remoto del secondo form, notifica e risposta completa restano da verificare con un invio autorizzato.

> 17 ottobre 2026 — UX del secondo form: anteprime locali distinte dall'invio, avanzamento byte e conferma salvataggio separati; prezzo con punti delle migliaia; ricerca comuni ISTAT con Milano predefinito. Codice/nome del comune validati e firmati, perimetro Milano invariato. 73 test Python e 17 JS pubblici locali passati. Diagnosi live: RENOVATION_FORM_ENABLED ancora false, quindi invio disabilitato; servono attivazione già prevista e latest deploy, nessun nuovo SQL.

> 17 ottobre 2026 — Agente del secondo form aggiornato: consigli pratici dalle foto con schema osservazione → intervento circoscritto → beneficio di presentazione; normalmente 2–3, solo se motivati. Nessun costo o aumento di prezzo inventato. Nessuna modifica al primo form e nessun nuovo deploy richiesto per questa modifica alle istruzioni. Restano le attivazioni backend già indicate sotto.

> 17 ottobre 2026 — Secondo form: aggiunta **planimetria catastale facoltativa come immagine separata**, anteprima/rimozione, metadati firmati e allegato dedicato. Limite 8 immagini/8 MB: con la piantina fino a 7 foto. Agente aggiornato, nessuna attestazione di conformità. 65 test Python e 11 JavaScript pubblici locali passati; nessuna nuova migrazione SQL. Serve deploy latest commit Render e prova completa.

> 17 ottobre 2026 — Secondo percorso autorizzato: **Ristrutturare o vendere così?**, con foto, prezzo ipotizzato, superficie, zona e tempi. Confronto qualitativo di tre scenari, prezzo del proprietario non validato e consulenza gratuita facoltativa. Backend, pagina, notifiche e agente Gmail aggiornati; 59 test Python e 14 JavaScript locali passati. **Da attivare:** eseguire supabase/002_secondo_form.sql, impostare RENOVATION_FORM_ENABLED=true e Manual Deploy latest commit su Render. Nessuna prova reale del secondo form ancora eseguita. [Guida e task](project/40_Form_ristrutturare_o_vendere.md).

> 17 ottobre 2026 — Notifiche email impaginate in HTML: testata Scoutly, recapiti, consulenza, percorso, descrizione con a capo e numero/nome degli allegati. JSON firmato invariato nella parte MIME text/plain per l’agente; nessun dato reale nei sorgenti. 46 test Python locali passati, verifica visiva con dati simulati. Distribuire latest commit su Render per i nuovi invii; le email già consegnate conservano il formato precedente. Nessun reinvio eseguito.

> 17 ottobre 2026 — Flusso chiarito dal fondatore: form → notifica Resend alla casella operativa → agente Gmail ogni 30 minuti → risposta Gmail al richiedente. Nessuna OpenAI API su Render. Inoltro firmato, allegati, recupero della richiesta già salvata e verifica destinatario implementati; automazione aggiornata. **45 test Python + 5 JavaScript della pagina riservata passati localmente**. Serve Manual Deploy su Render e prova completa; nessuna risposta AI dal nuovo flusso dichiarata inviata. [Stato e task](project/39_Flusso_form_Gmail_AI.md).

> Verifica pubblicazione: controlli GitHub (landing e Python) e Pages riusciti su bec7bb5. Browser aggiornato: nessun FormSubmit nel modulo, messaggio di indisponibilità corretto finché Render non viene aggiornato. Controllo /health di Render ancora sulla revisione riservata; nessun invio pubblico eseguito. La verifica della ricezione pubblica richiede l'azione di configurazione/deploy sul servizio.

> 17 ottobre 2026 — Sostituzione FormSubmit predisposta sulla landing: nuovo endpoint pubblico Render/Supabase, conferma con codice dopo salvataggio, upload 8 foto/8 MB, errori senza reinvio automatico. **38 test Python + 11 JavaScript locali passati** con archivio/provider simulati. Serve distribuire latest commit e impostare PUBLIC_INTAKE_ENABLED=true su Render; finché manca, il form mostra indisponibilità e non usa FormSubmit. Limite prova 20 record totali, antispam di base; nessuna AI, notifica o risposta email ai proprietari generata dal salvataggio. [Stato e task](project/38_Collegamento_pubblico_Render.md). Il fondatore ha confermato salvataggio/foto e consegna della email tecnica nel percorso riservato.

> Configurazione aggiuntiva: impostare SCOUTLY_TEST_EMAIL su Render con la email dell'account Resend. Il recapito non viene incluso nel codice pubblico né accettato dal browser. Senza destinatario configurato nessun tentativo email viene reclamato.

> 17 ottobre 2026 — Il fondatore conferma richiesta e otto immagini visibili in Supabase; doppioni riconosciuti. Preparato collegamento Resend **solo per una email manuale di prova al fondatore**, tramite pulsante `/test`; chiave RESEND_API_KEY configurata su Render secondo dichiarazione del fondatore. Flag persistente prima dell'invio e nessun retry cieco; nessun nuovo SQL richiesto. **29 test Python + 4 JavaScript locali passati**, con provider/archivio simulati. Prossimo: deploy nuova revisione e verifica consegna della email tecnica. AI e risposte automatiche ai proprietari restano disattivate; landing pubblica ancora su FormSubmit. [Guida](../intake-python/README.md).

> 17 ottobre 2026 — Host Python avviato: verifica diretta di `/health` riuscita (`ok`, modalità private-test, email disattivata). Preparata pagina `/test` per una descrizione e otto PNG sintetici; richiede SCOUTLY_TEST_TOKEN inserito solo sul sito Render, nessuna chiave inclusa nel codice. **16 test Python + 3 test JavaScript locali passati** con archivio simulato. Nuova pagina da distribuire tramite Manual Deploy, poi verificare ricevuta e oggetti nel progetto Supabase. Ricezione remota non ancora provata; form pubblico e AI/email ancora separati. [Guida](../intake-python/README.md).

> 17 ottobre 2026 — Preparato ricevitore Python per prove riservate su Render Free + Supabase. Il fondatore dichiara progetto e SQL creati; verifica remota ancora da fare. **15 test locali passati**, con archivio/trasporto simulati. [Configurazione Render](../intake-python/README.md). Nessun deploy Render eseguito, nessun collegamento al form, nessuna email/AI da questo componente. Prossimo: configurare le variabili server e provare ricezione sintetica su Supabase; poi antispam pubblico e integrazione landing. Il monitor Gmail esistente è separato.

> 17 ottobre 2026 — Prova completa NON superata sul tratto form→casella con 8 allegati. Risposta di prova Gmail al fondatore consegnata, ma prodotta dal materiale in chat; non dimostra analisi di posta ricevuta né ciclo pianificato. [Esito e prossimo passo](project/37_Esito_prova_completa.md). Limite 8 foto/8 MB, endpoint FormSubmit assegnato e POST nativo con antispam; ricezione allegati da verificare prima di traffico reale.

> 17 ottobre 2026 — Foto selezionabili insieme con un solo selettore; aggiunta successiva e rimozione individuale. Limiti 6 foto / 8 MB invariati; verifica browser completata con due immagini sintetiche e campi allegati senza duplicati. Nessuna email aggiuntiva inviata.

> 17 ottobre 2026 — Dopo l’invio FormSubmit torna alla pagina Scoutly tools/richiesta-inviata.html, con pulsante Torna a Scoutly e link al form. Nessuna nuova email di prova inviata.

> 17 ottobre 2026 — Aggiunto telefono facoltativo al form Prima di pubblicare: inviato con il campo phone a FormSubmit; richiesta consulenza distinta, email sufficiente per ricevere la bozza. Nessuna telefonata o messaggio di prova inviato.

> 17 ottobre 2026 — Agente email aggiornato su autorizzazione esplicita del fondatore: ACTIVE, ogni 30 minuti, casella temporanea casella temporanea autorizzata. Form prima-di-pubblicare v2 riconosciuto; notifiche FormSubmit con Reply-To verificato e controllo duplicati. Posta personale estranea e test tecnici esclusi. Nessuna richiesta trovata nell’ultima ricerca; prima risposta reale e primo ciclo pianificato non ancora verificati. Le indicazioni precedenti di pausa/guardia su scoutlyhome sono superate.

> 17 ottobre 2026 — Nome e ID del form nell’oggetto email e nel payload; registro config/forms.json per i futuri ingressi. [Regole identificazione AI](project/27_Identita_form_e_routing_AI.md). Agente ancora in pausa; nessuna ricezione o risposta automatica dichiarata verificata.

> Prova browser conclusa: foto sintetica selezionata e form inviato; FormSubmit conferma il submit. Ricezione nella casella e allegato ancora da verificare. Nessun dato immobiliare reale usato. Agente automatico in pausa.

> Destinatario temporaneo confermato: casella temporanea autorizzata; Scoutly è in creazione. FormSubmit richiede attivazione su questa casella. Agente ancora in pausa.

> 17 ottobre 2026 — [Invio dal sito con foto](project/26_FormSubmit_foto.md): sostituito mailto con FormSubmit autorizzato per il test. Email e fino a sei JPG/PNG (8 MB totali); attivazione casella e ricezione allegati da verificare. Agente email ancora in pausa, parsing notifiche provider da adattare dopo prova. Le istruzioni mailto precedenti sono storico.

> Verifica 17 ottobre 2026 completata: pagina online, CI e Pages riusciti; percorso provato nel browser con dati simulati e scelta consulenza distinta. Nessuna email inviata e nessuna ricezione in casella verificata. Dettagli nel documento 24.

> Aggiornamento 17 ottobre 2026: offerta annuncio via email al posto della checklist. [Percorso attuale](project/24_Richiesta_annuncio_email.md). Pagina B adattata con preparazione email a scoutlyhome@gmail.com, allegati e invio dalla posta del proprietario. Nessun invio automatico o AI attiva; backend PR #1 separato. Prossimo A05-ARCH: ricezione privata, foto, generazione e revisione. Le priorità storiche sotto sono superate per questa offerta.

> Aggiornamento 16 ottobre 2026: sorgenti della landing B aggiunti in `tools/prima-di-pubblicare.html`, con asset isolati e sei test di logica passati. Pubblicazione richiesta su GitHub Pages: URL atteso https://dalet78.github.io/scoutly/tools/prima-di-pubblicare.html, da verificare dopo il deploy. Anteprima senza raccolta di recapiti o invii. Backend Node/SQLite nella PR #1, non distribuito né eseguibile su Pages. Le indicazioni storiche sul prototipo solo locale sono superate per la parte statica.

> Aggiornamento corrente: [task ricezione C01–C14](project/20_Task_ricezione_email_telegram.md), ciascuno con unico profilo responsabile. Scelti registro privato + email, Telegram per notifiche; CRM rinviato. Prossimi task C02 (A04 UX) e C04 (A05-ARCH); C01 raccoglie destinatari/accessi mancanti. Direzione B scelta; prototipo locale sviluppato e verificato, non incluso in questa sincronizzazione documentale. Nessun task C01–C14 dichiarato eseguito; nessun invio o deploy attivato. Le indicazioni precedenti N01 come prossimo task sono storiche.

# Stato di ripresa Scoutly
Aggiornato: 16 ottobre 2026. Curatore A00.

## Priorità e prossimo task
Preparare inbound pre-pubblicazione: una promessa, una landing, un destinatario privato e un test circoscritto. [Strategia e task N01–N08](project/16_Inbound_pre_pubblicazione.md). Primo task N01: risultato utile e sostenibile, con esempio concreto; poi scelta N02 vendita o affitto per il primo test.
La sequenza Radar-prima M01–M08 è rinviata; codice e backlog conservati. Nessun pilot o campagna avviati.

## Ultimo risultato
Pubblicazione della nuova roadmap e del [team operativo minimo](project/17_Team_e_plugin_operativi.md) autorizzata esplicitamente dal fondatore il 16 ottobre 2026, compresa la strategia commerciale del piano. Aggiornati i punti di ingresso e la continuità tra PC. Nessuna attivazione pubblicitaria, endpoint o scheduler implicita.
Plugin verificati nel catalogo: GitHub già usato; Google Drive installato; Windsor.ai suggerito, non ancora collegato; CRM e Canva facoltativi. Nessun test tecnico prodotto eseguito in questo aggiornamento.

## Stato prodotto e ipotesi
Esistono 22 landing e Radar dimostrativo. Nella baseline letta inbound è demo senza destinatario configurato. Codice esaminato inizialmente al commit ac3d7878c095739e82edba7bda88b42e65f7990d: verificare file attuali prima di intervenire.
Ipotesi: opportunità più utili arrivando prima della pubblicazione. Nessuna esclusività, conversione o disponibilità al mandato dimostrate. Offerta proposta: checklist di preparazione annuncio; non una valutazione immobiliare inventata.

## Decisioni da completare
Vendita o affitto per la prima prova; risultato e ruolo dell’agente; posizione del recapito e richiesta esplicita; destinatario privato; budget massimo, finestra e capacità di ricontatto. La preferenza per inbound non decide automaticamente questi punti. Prezzi ed esclusiva territoriale restano aperti.

## Vincoli
Milano Comune, residenziale vendita/affitto con metriche separate, proprietari/autorizzati. Richiesta di telefonata distinta da mandato. Niente identità fittizie. Dati operativi privati fuori dal repository. Nessun lancio, contatto esterno o pubblicazione prodotto autorizzati dalla sola roadmap.

## Ripresa su un altro PC
Leggere AGENTS.md, [guida](START_HERE.md), strategia 16 e piano team 17. Riprendere N01 senza chiedere di nuovo il contesto iniziale. Aggiornare questo stato, diario e task con evidenze reali prima di sincronizzare. Il backlog di 45 task è inventario, non prerequisito per completare tutto prima della prima prova.



## 22 ottobre 2026 — immagini ottimizzate
Compressione locale prima dell’invio: foto JPEG lato massimo 1920 px qualità 0,80; planimetria dedicata 2800 px qualità 0,92. Nessun ingrandimento, sfondo bianco per trasparenze, originali non caricati. Elaborazione sequenziale, invio bloccato durante la preparazione; errore conserva la selezione precedente. Limiti reali conservati: 8 immagini totali e 8 MB dopo ottimizzazione. Nessuna migrazione database applicata né aumento del limite agente. Planimetria ultima immagine: metadato nativo nel secondo modulo, nota nel testo del primo. Percorsi foto/checklist ancora sospesi per aggiornamento agente. Verifica: 55 test Node passati; verifica visiva del nuovo caricamento non eseguita.

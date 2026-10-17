# Flusso form → Gmail → AI → risposta

Decisione del fondatore, 17 ottobre 2026: il form inoltra il materiale alla casella operativa temporanea; l'agente legge le richieste riconoscendo il titolo e risponde tramite Gmail. Nessuna chiave OpenAI API richiesta su Render.

## Percorso
1. Frontend: salva descrizione, recapiti e fino a otto foto nel backend Render/Supabase.
2. Integrazioni: solo dopo salvataggio completo invia tramite Resend una notifica alla casella configurata in SCOUTLY_TEST_EMAIL, con testo e foto allegati. Oggetto: [Scoutly][prima-di-pubblicare] Prima di pubblicare — Richiesta bozza annuncio.
3. Agente email: controllo ogni 30 minuti, verifica provenienza, firma del contenuto, metadati e corrispondenza Reply-To/email. Il titolo instrada, ma da solo non autentica la richiesta.
4. Copy/revisione: bozza dichiarata assistita da AI, basata sui dati forniti; fotografie commentate solo se effettivamente accessibili e analizzate; nessun difetto inventato. Dati mancanti separati e consulenza facoltativa.
5. Agente email: risponde solo al richiedente verificato tramite Gmail. Controlla conversazione, posta inviata e codice richiesta per evitare doppioni. Nessun sollecito senza nuova risposta.

## Task piccoli
| Task | Profilo responsabile | Stato |
| --- | --- | --- |
| P04b: notifica firmata con allegati dopo salvataggio | A05-BE / integrazioni | Implementato; test simulati passati |
| P04c: routing Gmail, verifica e risposta | Agente email / orchestratore | Automazione aggiornata, intervallo 30 minuti |
| P04d: distribuzione e prova di una richiesta già ricevuta | A05-OPS | Aperto: Manual Deploy su Render |
| P04e: verifica consegna e risposta finale | QA / agente email | Aperto dopo P04d |
| P04f: recupero controllato notifiche pendenti | A05-BE / OPS | Manuale tramite pagina riservata; nessun worker di recupero |

## Attivazione
Non servono nuove variabili né migrazioni SQL se la prova Resend precedente funziona. In Render usare Manual Deploy → Deploy latest commit. Verificare /health: gmail_notice_protocol=1.

Per recuperare una richiesta già ricevuta aprire /test#CODICE, inserire SCOUTLY_TEST_TOKEN soltanto nel campo riservato e premere “Inoltra questa richiesta alla casella operativa”. Non reinviare il form. La notifica accepted non viene duplicata; sending/rejected/unknown richiedono verifica manuale, senza azzerare flag o cambiare codice. Accepted indica accettazione dal provider, non consegna.

Il servizio di prova Resend invia alla casella del fondatore configurata privatamente. La risposta al proprietario usa il connettore Gmail autorizzato. Se mancano accesso Gmail, verifica firma o Reply-To, nessuna risposta automatica.

## Evidenze e limiti
45 test Python e 5 JavaScript della pagina riservata passati localmente con archivio/provider simulati. Il fondatore dichiara riusciti salvataggio pubblico e precedente email tecnica; il nuovo inoltro completo e la risposta AI restano da verificare dal vivo dopo deploy. Nessuna nuova risposta inviata in questa modifica. Nessun recupero automatico degli invii incerti e nessuna garanzia esattamente-una-volta.

Il registro privato resta nella chat e nel sistema operativo; recapiti, foto e contenuti dei richiedenti non entrano nella repository. Nessuna campagna o pubblicazione di annunci avviata.

# Ricevitore Python — prova privata

Questo componente salva testo e foto su Supabase e inoltra le richieste pubbliche alla casella operativa tramite Resend. L’agente Gmail analizza le notifiche verificate e risponde tramite Gmail ogni 30 minuti. Il backend non esegue AI né risponde direttamente al proprietario. Le sezioni di prova private restano disponibili. È separato dal precedente backend Node/SQLite della PR #1: nessuna migrazione automatica di quel backend.

## Configurare Render

Creare **New → Web Service**, collegare `dalet78/scoutly`, branch `main`:

| Campo | Valore |
|---|---|
| Name | scoutly-intake-test |
| Language | Python 3 |
| Region | Frankfurt, se disponibile |
| Root Directory | intake-python |
| Build Command | pip install -r requirements.txt |
| Start Command | uvicorn app:app --host 0.0.0.0 --port $PORT --workers 1 --no-access-log |
| Instance Type | Free |
| Health Check Path | /health |
| Auto Deploy | Off |

Variabili da aggiungere **solo in Render → Environment**:

- `PYTHON_VERSION`: `3.14.6`, versione usata nelle verifiche locali.
- `SUPABASE_URL`: Project URL del progetto di test Supabase.
- `SUPABASE_SECRET_KEY`: chiave server `sb_secret_...` da Supabase → Settings → API Keys. Non usare una publishable key. Non incollare la chiave in chat, nel sito o in GitHub.
- `SCOUTLY_TEST_TOKEN`: stringa casuale riservata di almeno 32 caratteri generata nel gestore password. Serve solo per prove riservate; non deve entrare nel JavaScript pubblico.

Il blueprint equivalente è `render.scoutly-test.yaml` alla radice del repository: chi preferisce New Blueprint deve indicare quel percorso. Prima del deploy verificare il piano Free. Nessun disco Render è richiesto; dati e foto stanno su Supabase.

Aprire l'URL assegnato seguito da `/health`: deve mostrare `status=ok`, `mode=private-test`, `email_enabled=false`. Questo controlla il processo, **non** l'accesso al database o la presenza dello schema. Il salvataggio remoto va provato separatamente con materiale sintetico e verifica nella dashboard Supabase.

## Contratto della prova

`POST /requests`, multipart, header privato `X-Scoutly-Test-Token`. Campo testuale `payload` contenente JSON e zero–otto file sotto la chiave ripetuta `photos`. Niente URL di foto o allegati eseguibili.

Esempio sintetico di payload, sostituendo l'UUID con uno nuovo per ogni nuova richiesta (conservarlo per ritentare la stessa):

```json
{
  "idempotency_key": "b3e72074-656e-4184-9ad1-4012ca135fd7",
  "form_id": "prima-di-pubblicare",
  "form_version": 2,
  "workflow_id": "annuncio-da-foto-e-descrizione",
  "email": "prova@example.com",
  "description": "TEST TECNICO SCOUTLY. Descrizione simulata per verifica ricezione.",
  "city": "Milano Comune",
  "intent": "Vendere",
  "role": "Proprietario",
  "publication": "Bozza in preparazione",
  "service_requested": true,
  "consultation_requested": false
}
```

La risposta `201` con `request_id` e `status=received` arriva solo dopo aver salvato richiesta, file e riferimenti. Non attesta un invio email. Stessa chiave e stesso materiale già ricevuto: restituisce la ricevuta senza riscrivere foto. Stessa chiave con materiale diverso o scrittura incompleta: `409`, verifica manuale. Errore/timeout dell'archivio: `503`, nessun retry automatico e nessuna cancellazione alla cieca. Il chiamante conserva il codice, che è l'UUID fornito.

## Esecuzione e verifiche

Python 3.14.6; creare un ambiente virtuale, installare `requirements-dev.txt`, poi `python -m pytest -q`. Sono prove locali con archivio simulato e trasporto HTTP simulato: non provano credenziali, autorizzazioni o persistenza del progetto remoto. Nessuna immagine proprietario è inclusa nei test.

## Limiti prima dell'apertura pubblica

- L'accesso è riservato tramite chiave: non distribuirla nel browser. Prima di collegare la landing servono antispam e limiti di frequenza per un endpoint pubblico, oltre a CORS per l'origine concordata.
- Massimo 8 immagini JPG/PNG, 8 MB totali; formato reale controllato con Pillow e dimensioni immagine limitate. I file originali restano privati; possono contenere metadati. Nessuna analisi automatica è attivata.
- Scritture tra database e Storage non sono atomiche. Gli errori lasciano la richiesta `uploading`, con eventuali file parziali: va verificata e ripulita manualmente prima di un nuovo tentativo. Non cancellare righe senza controllare/eliminare anche i relativi oggetti Storage. Nessun job di pulizia o conservazione è ancora attivo.
- Nessun processo AI o coda di recupero sul server: il monitor Gmail riceve il materiale tramite notifiche email, senza leggere Supabase. La ricevuta di salvataggio non attesta la risposta al proprietario.
- Render Free si sospende dopo inattività; i file locali non sono persistenti. Supabase Free può essere sospeso per inattività. Nessuna garanzia di disponibilità per pilot reali.

Documentazione: [Render/FastAPI](https://render.com/docs/deploy-fastapi), [piani gratuiti](https://render.com/docs/free), [chiavi Supabase](https://supabase.com/docs/guides/getting-started/api-keys).


## Prova guidata dal browser

Dopo il deploy aprire `/test` sull'host Render. La pagina contiene soltanto un test sintetico; non espone record e non contiene chiavi. Inserire nel campo password **SCOUTLY_TEST_TOKEN**, non la Secret key Supabase. La chiave viene inviata solo al ricevitore della stessa origine nell'header HTTPS e non viene salvata nella memoria del browser. Il codice UUID della prova viene invece conservato in sessionStorage per non generare doppioni dopo un aggiornamento della pagina. Nessuna dipendenza o script esterno nella pagina.

Premere **Salva la prova con otto immagini**. Il programma prepara una descrizione simulata e otto PNG con barre numerate. Nessuna foto proprietario, generazione AI o email. Una ricevuta conferma che le scritture API sono terminate; verificare anche nel progetto Supabase una riga `received` in `scoutly_requests`, otto riferimenti in `scoutly_photos` e otto oggetti sotto quel codice in `Storage → scoutly-photos`. Le immagini non sono pubbliche. In caso di errore mantenere il codice: nessun nuovo invio con un altro UUID prima di aver verificato il tentativo precedente.

Con Auto Deploy Off, dopo ogni aggiornamento Git scegliere **Manual Deploy → Deploy latest commit** in Render. Il collegamento `/test` non è disponibile sul primo commit 87c6888.

Verifiche aggiuntive: `node --test tests/test-page.test.mjs` (Node 20+ solo per questi test; l'host resta Python). Le prove simulate coprono uso dello stesso UUID, invio della chiave solo all'origine corrente, nessun retry automatico e rifiuto di una chiave Supabase nel campo sbagliato. Il controllo `/health` dal vivo del servizio assegnato ha risposto `ok`; non dimostra ancora la ricezione remota.


## Email di prova con Resend

Dopo avere aggiunto `RESEND_API_KEY` e `SCOUTLY_TEST_EMAIL` (email del proprio account Resend) soltanto in Render e distribuito la nuova revisione, aprire `/test`, conservando la sessione della richiesta simulata già salvata. Reinserire `SCOUTLY_TEST_TOKEN` nel campo password e premere **Invia email di prova**. Non occorre reinviare le otto immagini. Il codice richiesta rimane lo stesso.

Il server espone `POST /test-email` protetto dalla stessa chiave riservata e accetta solo un UUID di richiesta. Non accetta destinatari, oggetti, testo o allegati dal browser. La richiesta deve essere ricevuta, con metadati autorizzati, email simulata `prova@example.com` e descrizione marcata TEST TECNICO SCOUTLY. L'email è inviata esclusivamente al recapito del fondatore configurato in `SCOUTLY_TEST_EMAIL` su Render (mai nel codice pubblico), dal mittente di prova `Scoutly test <onboarding@resend.dev>`. Questo richiede un account Resend associato all'indirizzo del fondatore; prima di inviare ad altri destinatari occorre un dominio verificato e una nuova integrazione del flusso reale. Non si usa la password Gmail.

Nessuna nuova migrazione SQL: lo stato tecnico viene registrato in `scoutly_requests.answers.mail_test`, mantenendo le altre risposte. Un aggiornamento condizionale del database reclama il tentativo solo se il flag manca e la richiesta è ricevuta. Il flag `sending` è scritto PRIMA di contattare Resend; `accepted` con ID provider solo dopo una risposta valida. Esito ambiguo o rifiuto restano registrati: nessun retry automatico. I click successivi con flag accepted restituiscono la ricevuta senza inviare; gli altri stati bloccano l'invio per revisione. Non azzerare il flag o creare un nuovo UUID per aggirare un errore senza controllare Resend → Emails.

Ogni chiamata include anche una chiave idempotenza Resend deterministica. Il provider conserva questa protezione per 24 ore; il registro Supabase evita di ripetere il tentativo anche oltre tale finestra. Nessuna garanzia esattamente-una-volta: se scrittura o rete risultano ambigue, serve revisione manuale. Nessuna pulizia automatica del flag o trasferimento di materiale proprietario.

`accepted` significa accettazione da parte di Resend, non recapito in Gmail: verificare casella/Spam e Resend → Emails. Oggetto: `[Scoutly][prima-di-pubblicare] TEST TECNICO SCOUTLY — Collegamento email`. Il monitor Gmail deve escluderlo dai richiedenti reali. `/health` mantiene `email_enabled=false` per le risposte automatiche e aggiunge `email_test_configured` per indicare soltanto la presenza della chiave. Non verifica che la chiave sia valida.

Prova Supabase: il fondatore ha riferito ricevuta senza doppioni e presenza della richiesta/otto foto nella dashboard. Osservazione umana dichiarata, non lettura remota dell'assistente. Invio Resend/Gmail ancora da provare al momento di questa revisione.

Fonti: https://resend.com/docs/dashboard/emails/idempotency-keys e https://resend.com/docs/api-reference/emails/send-email


## Collegare il form pubblico a Render (fase di prova limitata)

Configurazione nuova, successiva alle prove riservate: dopo aver distribuito questa revisione aggiungere su Render **PUBLIC_INTAKE_ENABLED=true**. Con valore assente o false la ricezione pubblica è chiusa. Non sono richieste nuove chiavi né migrazioni SQL. Il form pubblico non contiene SCOUTLY_TEST_TOKEN, credenziali Supabase o Resend. Il dominio mittente Resend non è necessario per il solo salvataggio; gli invii reali ai proprietari rimangono disattivati.

La landing usa `/public/config` e `/public/requests` sull'host Render. Finché Render non esegue questa revisione con la variabile attiva, il form mostra invio temporaneamente non disponibile: nessun fallback a FormSubmit o mailto. Il testo resta compilabile, ma non viene dichiarato salvato. Dopo il deploy riaprire/aggiornare la landing.

Controlli per questa prova: origine browser autorizzata esplicita, CORS senza credenziali, campo esca, token temporaneo firmato dal server con attesa minima 3 secondi e durata 30 minuti, body massimo 8,1 MB prima del parsing, massimo 8 foto/8 MB, un solo invio pubblico in corso per processo, massimo 60 tentativi/ora per processo. Una verifica del totale nel database blocca nuove richieste quando l'archivio ha già 20 righe (incluse le prove riservate e incomplete); le ricevute di richieste già salvate restano recuperabili con stesso materiale/codice. Verifica count non disponibile: nessun nuovo salvataggio. Nessun job elimina record o file per liberare spazio.

Questi sono controlli di base per poche prove: **origine/CORS e token pubblico non autenticano un proprietario e non sostituiscono un CAPTCHA**. Un client non browser può imitare l'origine e richiedere token. Il limite di tentativi si azzera al riavvio; il controllo capienza si basa invece sui record persistenti. Il conteggio non è una quota transazionale tra più processi/istanze: usare il singolo worker configurato, nessuna campagna o aumento di traffico prima di protezione antispam e quote persistenti più forti.

Il browser conserva in sessionStorage soltanto codice richiesta, hash del materiale e stato, non testo/recapiti/foto. Tentativi con esito incerto mantengono il codice e non permettono di cambiare materiale e reinviare alla cieca. Nessun retry automatico; foto e testo restano nel modulo in caso di errore. La navigazione alla pagina di conferma segue solo una ricevuta received con il codice corretto. Aprire direttamente la pagina di conferma non dichiara una richiesta salvata.

**Il salvataggio pubblico inoltra una notifica alla casella operativa.** L’analisi e la risposta appartengono all’agente Gmail, previa verifica della notifica. Il pulsante tecnico precedente resta limitato alle richieste sintetiche; il nuovo pulsante di inoltro recupera una richiesta ricevuta usando il suo codice. Distribuire questa revisione su Render prima di provare il flusso completo; vedere la sezione seguente.

Prova live dopo il deploy: compilare la landing con TEST TECNICO SCOUTLY e dati simulati, caricare immagini sintetiche, inviare una volta; verificare codice sul sito, stato received e file privati in Supabase. Controllare anche un errore di rete senza perdita del modulo. Non chiamare questa prova completa finché questi passaggi non sono realmente verificati.


## Flusso scelto dal fondatore: form → Gmail → agente → risposta Gmail

Questo è il flusso corrente; supera la proposta di eseguire l'AI su Render. **Nessuna OPENAI_API_KEY necessaria o usata da questo backend.** Dopo aver completato il salvataggio di una richiesta pubblica, il server prepara una notifica con testo, recapiti, metadati del form e foto allegate e la inoltra tramite Resend alla casella operativa configurata in SCOUTLY_TEST_EMAIL. Il Reply-To contiene l'email strutturata del richiedente. L'oggetto identifica il form: `[Scoutly][prima-di-pubblicare] Prima di pubblicare — Richiesta bozza annuncio`. Il backend non risponde al proprietario.

L'automazione Gmail esistente è stata aggiornata mantenendo il controllo ogni 30 minuti: legge le notifiche pertinenti, verifica provenienza/metadati/firma e Reply-To, analizza il materiale accessibile e risponde tramite il connettore Gmail. Verifica effettiva della prima risposta del nuovo flusso ancora da fare. Gli allegati non supportati non devono essere dichiarati analizzati.

Le notifiche Resend contengono un JSON firmato HMAC con dominio `scoutly-gmail-v1`. Il solo mittente condiviso onboarding@resend.dev non autentica Scoutly. `/notifications/verify` confronta la firma su tutti i campi normalizzati; nessun record o file viene restituito. L'agente può usare `verify_notice.py` passando l'oggetto firmato via stdin: la verifica usa POST sul solo host Scoutly, non inserisce recapiti in URL, rifiuta redirect e non stampa il corpo personale. Non eseguire allegati o seguire link delle email.

Il flag privato `answers.email_notice` è inizialmente pending nelle nuove richieste; il tentativo viene reclamato atomicamente prima dell'invio, poi registrato accepted con ID provider o rejected/unknown in caso di problemi. Una seconda elaborazione con lo stesso codice non spedisce un'altra notifica accepted. La chiave idempotenza Resend è un controllo aggiuntivo per 24 ore. Nessun retry automatico dopo esito ambiguo; nessuna garanzia esattamente-una-volta. Un errore di notifica non trasforma in fallimento il salvataggio già riuscito: la richiesta resta privata e disponibile in Supabase. Non eliminare o azzerare i flag per riprovare senza verifica di Resend/Gmail.

Non è presente un worker autonomo di recupero delle notifiche pending/unknown: occorre controllo operativo e recupero manuale; questo limite resta aperto prima di traffico reale. Non promettere recapito o tempi di risposta garantiti. Ruotare SCOUTLY_TEST_TOKEN cambia anche la chiave di firma: vecchie notifiche non ancora elaborate richiedono revisione. Le chiavi restano sul server, mai nella notifica o nei sorgenti.

### Recuperare una richiesta già salvata

Dopo **Manual Deploy → Deploy latest commit** su Render, aprire `/test#CODICE_RICHIESTA`, inserire SCOUTLY_TEST_TOKEN nel campo password e usare **Inoltra questa richiesta alla casella operativa**. Questo pulsante usa POST `/notify-request`, richiede la chiave privata e non accetta destinatari dal browser. Recupera il materiale da Supabase e usa lo stesso flag di deduplicazione del flusso pubblico. Non occorre ricaricare foto o creare una nuova richiesta. Nessuna nuova variabile né migrazione SQL sono necessarie se Resend e la casella operativa sono già configurati.

La prima richiesta di dimostrazione e il suo eventuale permesso particolare sono registrati soltanto nella chat/automazione privata, non in GitHub. Tutti gli altri test tecnici restano esclusi dall'automazione. Verificare profilo Gmail esatto e destinatario prima di qualsiasi risposta.

# Scoutly — backend ricezione richieste

Servizio indipendente dalla landing statica. Node.js **24**, SQLite su disco persistente, nessuna dipendenza npm da scaricare. Una richiesta finale volontaria viene salvata assieme alla coda di notifiche in una transazione. Solo dopo il commit viene restituito `accepted: true`. Un errore email/Telegram non elimina il lead.

**Stato:** implementato e verificato in locale con dati fittizi. Ricezione e invii esterni sono disattivati per default. Nessun deployment o account provider configurato. Il modulo della landing non è ancora collegato (C08 separato).

## Scelta tecnica 80/20

Email, Telegram e un CRM da soli non sono il registro. Per il contratto richiesto servono persistenza, idempotenza e stato notifiche. Il servizio piccolo qui implementato evita un CRM completo e lascia i provider dietro due adattatori. SQLite è adatto alla prima istanza singola con disco persistente: non scegliere un hosting con filesystem effimero o sola pubblicazione statica. Scalabilità multiistanza/distribuita e migrazione a database gestito restano successive. Non è una scelta o un acquisto di hosting.

Node 24 è richiesto anche per `node:sqlite`; usare la stessa versione in locale e CI. Non usare il Node 20 eventualmente preinstallato sul PC. Non eseguire l’API dentro GitHub Pages: Pages ospita file statici e non questa persistenza.

## Avvio locale

Dalla cartella `backend/`:

```sh
node --version
cp .env.example .env
npm test
npm start
```

Non serve `npm install`. Generare separatamente `ADMIN_TOKEN` e `RATE_LIMIT_SECRET` e inserirli **solo** nel `.env` locale:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Con la configurazione iniziale solo l’health check e i metadata disattivati sono disponibili. Per una prova locale con soli dati fittizi impostare `ACCEPT_REQUESTS=true`, `ENABLE_EMAIL=true`, `ENABLE_TELEGRAM=true`, lasciando `LIVE_NOTIFICATIONS=false`. Le notifiche passano a `simulated`, mai `sent`; il worker non chiama i provider. Gli esempi di identità/informativa non autorizzano raccolta reale.

```sh
curl http://127.0.0.1:4190/healthz
curl http://127.0.0.1:4190/v1/form-config
curl -X POST http://127.0.0.1:4190/v1/requests \
  -H 'Content-Type: application/json' \
  --data-binary @test/example-request.json
```

L’esempio è fittizio e riusa un UUID fisso: un secondo invio identico verifica il retry. Per una richiesta distinta generare un nuovo UUID; non cambiare il contenuto mantenendo lo stesso ID.

## Contratto API

- `GET /healthz`: stato processo, senza credenziali/dati personali.
- `GET /v1/form-config`: disponibilità e testo effettivo/versione della richiesta, soggetto e URL informativa. Non espone segreti.
- `POST /v1/requests`: JSON versione 1, esempio in `test/example-request.json`. Richiede ruolo/perimetro dichiarati, un recapito coerente con il canale scelto, `requestedContact: true`, accettazione e versione corrente dell’informativa/richiesta. I campi extra vengono rifiutati.
- CORS consente solo le origini esatte configurate, senza wildcard e senza `null` (apertura `file://`). Per collegare la landing durante lo sviluppo servirla da un’origine HTTP locale consentita. Nessun segreto deve essere aggiunto al browser.
- Un invio vuoto/malformato/oltre 16 KiB non viene registrato. Honeypot `website` deve essere vuoto. Rate limit SQLite: 10 tentativi/minuto per IP pseudonimizzato, inclusi i retry. Il blocco segnala `Retry-After`.
- L’ID è un UUID v4 generato dal client e mantenuto sui retry. Normalizzazione lato server prima dell’hash. Stesso ID e stesso contenuto: 200, `duplicate: true`; stesso ID con altro contenuto: 409. Non è deduplica di persona/immobile tra sessioni diverse.
- La versione di consenso cambiata produce 409 `CONSENT_VERSION_CHANGED`: rileggere configurazione e mostrare la versione corrente. Registrati testo, soggetto, URL e ora di ricezione server; nessuna data o qualifica fidata dal client.

Risposta dopo salvataggio:

```json
{"accepted":true,"requestId":"UUID","duplicate":false,"receipt":"stored","notificationStatus":"queued"}
```

`queued` non significa messaggio consegnato o letto dall’agente. Con entrambi i canali disabilitati risulta `disabled`. Gli errori restituiscono solo codici, senza eco dei recapiti o dei provider.

Questo contratto **sostituisce**, per il prototipo B, il precedente invio progressivo `contact/case_step/complete`: il server non accetta quel vecchio payload. La checklist non viene inviata prima della richiesta volontaria. Il frontend dovrà leggere `form-config` e mostrare soggetto/scopo/informativa prima dell’invio.

## Registro privato e amministrazione

Nessuna tabella è servita come file statico. Le API admin richiedono `Authorization: Bearer <ADMIN_TOKEN>` e rifiutano richieste browser con header `Origin`; non mettere il token in una dashboard pubblica. Usare un client amministrativo su dispositivo fidato via HTTPS, oppure localhost in sviluppo.

- `GET /v1/admin/leads?limit=100&offset=0`: lista paginata con dati e stato notifiche.
- `GET /v1/admin/leads/<requestId>`: dettaglio.
- `PATCH /v1/admin/leads/<requestId>` con `{"status":"contacted"}`: esiti ammessi `new`, `contacted`, `appointment`, `closed`. Sono stati operativi manuali, non prove automatiche di conversione.
- `GET /v1/admin/export`: esportazione JSON privata. Il file contiene dati personali: archiviarlo solo in una destinazione privata, mai nel repository.
- `DELETE /v1/admin/leads/<requestId>`: elimina richiesta e coda collegata. Non revoca messaggi già accettati dai provider, backup o una chiamata esterna già in corso. Un retry con quell’ID dopo la cancellazione viene trattato come nuova richiesta: evitare replay dai client.

Il segmento `pre_publication_declared` è una classificazione di dichiarazioni, non proprietà verificata, mandato o qualifica commerciale definitiva. Stanze/altro sono in `review_scope` finché la relativa policy non è decisa; fuori Milano, già pubblicato e tempi incerti restano distinguibili.

## Email e Telegram

Il worker interno controlla la coda ogni secondo, con lease di 60 secondi, timeout provider 10 secondi, massimo 5 tentativi e attese crescenti (almeno 1, 2, 4, 8 minuti). Dopo l’ultimo errore il job resta `failed`, visibile all’amministratore. Non esiste un monitoraggio esterno già attivato: l’operatore deve controllare i fallimenti.

Ogni canale è indipendente. Le destinazioni sono fotografate nel job alla ricezione, senza token; cambiare `.env` non instrada di nascosto richieste già accodate a un altro agente.

- Email: adattatore REST Resend, chiave server, mittente verificato e destinatario configurati. Oggetto con ID richiesta, senza recapiti; testo con i dati operativi minimi. Usa la chiave idempotente stabile del job.
- Telegram: Bot API `sendMessage`, token server e chat autorizzata configurati. L’agente deve avviare la chat col bot; il proprietario non deve installare Telegram. Messaggio con ID e contesto, **senza nome, email o telefono**. Nessun collegamento pubblico al dettaglio.
- `sent` significa accettato dal provider, non arrivato in inbox, letto o seguito da una telefonata.
- Garanzia: richiesta/coda transazionali e retry del medesimo evento senza duplicare lead. Le notifiche esterne sono **almeno una volta**, non esattamente una volta: un timeout dopo accettazione o un riavvio durante l’invio possono produrre un avviso duplicato, in particolare su Telegram. Resend conserva la chiave idempotente per un periodo limitato; oltre quel periodo una riconciliazione manuale è necessaria. Non promettere notifiche senza duplicati dopo downtime prolungato.
- Passare da simulazione a invii reali non rimette in coda i job `simulated`. Le richieste di prova non partono automaticamente in seguito.

Nessun provider chiamato nei test: `fetch` sostituito da risposte simulate, incluse conferme 2xx non valide e timeout.

## Sicurezza e accessi operativi

Segreti solo in variabili server; `.env`, dati, backup e file SQLite ignorati da Git. Directory dati creata 0700 e DB/backup 0600 su sistemi POSIX. Il database non è cifrato dall’applicazione: per dati reali usare volume/accessi/backup protetti ed eventuale cifratura del disco dell’host. Non condividere il DB via cartelle pubbliche.

Non ci si fida di `X-Forwarded-For`. `X-Real-IP` viene letto solo se la connessione arriva da un IP esatto in `TRUSTED_PROXY_IPS`; il proxy fidato deve sovrascrivere l’header. Senza questa configurazione tutti i visitatori dietro proxy condividono il limite del proxy. CORS e honeypot **non** impediscono bot che chiamano direttamente l’endpoint; prima di traffico pubblico verificare limitazioni all’edge/antispam, rete e volumetria. Nessuna verifica di titolarità del recapito è implementata.

In produzione il servizio rifiuta segreti mancanti, origini HTTP e, se si accettano richieste, identità/informativa non definite e durata dati non impostata. Nessuna chiave amministrativa generata o stampata all’avvio. Il reverse proxy dovrà terminare HTTPS; il server Node non viene dichiarato esposto al pubblico da questa consegna.

## Conservazione, cancellazione e backup

`RETENTION_DAYS` è una decisione operativa da concordare, non un valore legale universale. In sviluppo 0 disabilita la cancellazione; per produzione con ricezione attiva deve essere definito.

```sh
npm run backup -- /destinazione-privata/nuovo-backup.sqlite
npm run purge -- --confirm
```

Il backup usa SQLite online backup, non una copia incompleta del solo file mentre il WAL è attivo. Nessuna sovrascrittura di backup esistenti. Il purge cancella record scaduti e relative notifiche, solo con conferma esplicita; **non** crea uno scheduler o elimina vecchi backup. Definire rotazione/cancellazione dei backup e gestione delle copie email/Telegram prima della raccolta reale. `secure_delete` non è garanzia di cancellazione fisica da filesystem, snapshot o provider.

Ripristino: fermare il servizio, mantenere una copia privata dello stato corrente, ripristinare il backup in un nuovo `DATA_PATH`, verificare con invii disabilitati e controllare i job prima di riattivarli. Un backup vecchio può contenere job non più allineati agli invii reali: non riavviarli ciecamente. È stato testato il ripristino dei dati e della coda, non un piano di disaster recovery dell’hosting.

## Container e CI

Dockerfile per Node 24, utente non root e volume `/data`. Non costruito né distribuito in questa sessione. Non usare il container senza volume persistente. CI GitHub dedicata in `.github/workflows/scoutly-backend.yml` esegue i test e non distribuisce il servizio.

## Cosa manca prima dell’attivazione

1. Confermare titolare/soggetto che ricontatta, informativa/versione, durata e destinatari (C01 e parte C12).
2. Scegliere host Node 24 con disco persistente e HTTPS; nessun servizio o piano acquistato.
3. Configurare mittente/dominio e chiave email, bot/chat Telegram e segreti sul server.
4. Collegare il form B al nuovo contratto, gestire versione/privacy/attesa/errori (C02/C03/C08).
5. Test autorizzato con destinatari controllati e verifica consegna reale; invii esterni richiedono istruzione esplicita.
6. Verificare antispam/rete, backup/rotazione e gestione dei fallimenti prima di campagne.

## Fonti tecniche primarie

- [Node 24 SQLite](https://nodejs.org/docs/latest-v24.x/api/sqlite.html)
- [Resend: Send email](https://resend.com/docs/api-reference/emails/send-email)
- [Resend: idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Telegram: sendMessage](https://core.telegram.org/bots/api#sendmessage)

Questi riferimenti documentano le API; non dimostrano credenziali configurate, autorizzazione al trattamento o consegna reale.

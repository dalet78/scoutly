# Collegamento pubblico a Render — 17 ottobre 2026

Responsabile A05-BE/FE, verifica A05-OPS. Ambito: sostituire FormSubmit nel form Prima di pubblicare mantenendo 8 foto/8 MB e metadati v2. Nessuna AI o risposta email automatica attivata.

## Stato
Codice e test locali completati. Il fondatore ha confermato le prove riservate di salvataggio, foto e invio email tecnico. Nuovo endpoint pubblico e landing predisposti; ricezione pubblica live da verificare dopo deploy Render e PUBLIC_INTAKE_ENABLED=true. La landing rimuove FormSubmit; se il servizio non è pronto mostra temporaneamente indisponibile, senza un invio alternativo nascosto.

## Piccoli task
- P03a A05-BE: route pubblica, body limitato, origine e token temporaneo, campo esca, gestione capienza. Implementato e testato localmente.
- P03b A05-FE: upload multiplo, codici richiesta, errori senza perdita del modulo o retry automatici, conferma solo dopo salvataggio. Implementato e testato localmente.
- P03c A05-OPS: variabile Render, deploy latest commit, prova sintetica dalla landing e verifica archivio. Da eseguire.
- P03d A05-ARCH: antispam più forte e quote transazionali prima di traffico/campagne. Aperto.
- P04 A05-INT: generazione AI, coda email/notifiche, dominio mittente e flusso richiedenti reali. Aperto.

## Limiti della prova
Max 20 record totali nel database prima di nuove richieste pubbliche (incluse prove/incomplete). Un invio pubblico in corso e 60 tentativi/ora per processo; un solo worker. Quota persistente verificata sul database ma non transazionale tra processi. Nessuna chiave privata nel browser. I controlli di base non autenticano il proprietario e non sostituiscono un CAPTCHA; origine/token possono essere imitati da client non browser. Nessuna campagna autorizzata.

Il solo salvataggio pubblico non invia email: le richieste sono nell'archivio privato Supabase, da gestire manualmente finché P04 non è implementato. Il monitor Gmail rimane distinto e non legge il database.

## Evidenza
38 test Python locali e 11 test JavaScript locali passati (7 percorso pubblico + 4 pagina riservata), archivio/provider simulati. Una segnalazione di deprecazione TestClient/httpx, nessun fallimento. CI include ora percorso pubblico e backend Python. Verifica browser/live da registrare dopo disponibilità della revisione pubblicata. Nessun materiale proprietario incluso nel codice.

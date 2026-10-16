# Backend — consegna sviluppo e verifiche
16 ottobre 2026. Profili A05-ARCH, A05-BE, A05-INT, A05-OPS e A07 svolti in sequenza. Nessun agente in background dichiarato.

## Risultato
Backend in `backend/`: Node 24, SQLite persistente, contratto della richiesta finale, coda transazionale email/Telegram, modalità simulata, amministrazione autenticata, esportazione, cancellazione e backup. Nessuna dipendenza npm, nessuna credenziale o dato operativo nei file.

La richiesta viene confermata dopo il salvataggio di lead e coda. Le notifiche hanno stato separato, timeout, lease e ritentativi. I duplicati dello stesso evento non creano lead aggiuntivi; non è una deduplica della persona tra sessioni differenti. Una notifica può essere ripetuta dopo un timeout ambiguo: non viene promessa consegna esattamente una volta.

## Verifica effettiva
29 test superati con Node v24.19.0:
- validazione e richiesta esplicita, versione informativa, ID idempotente e conflitti;
- transazione con rollback della richiesta quando l’accodamento fallisce;
- persistenza dopo chiusura/riapertura e ripristino del backup;
- autenticazione, CORS, rate limit, dimensione, paginazione, segmenti dichiarati;
- modalità simulata senza chiamate esterne;
- adattatori provider con risposte simulate, 429/timeout/conferme mancanti;
- concorrenza delle lease, crash/retry e limite tentativi;
- HTTP reale locale con UTF-8 diviso tra chunk e body eccessivo;
- processo reale, worker simulato, SIGTERM e persistenza dopo arresto.

Comando dalla cartella backend: `node --test test/*.test.mjs`.
Prove HTTP su porte localhost effimere; nessun invio a email o Telegram. CI predisposta, esito remoto da verificare separatamente. Dockerfile predisposto ma non costruito o distribuito.

## Stato task
| Task | Stato verificabile |
|---|---|
| C01 | Aperto: identità, destinatari, disponibilità e accessi reali da fornire |
| C02/C03 | Separati: UX e testo operativo del form da integrare con i dati reali |
| C04 | Architettura minima implementata; hosting e costi operativi da scegliere |
| C05 | Contratto versione 1 implementato e documentato; non compatibile con vecchio invio progressivo |
| C06 | Template ambiente, separazione segreti e simulazione pronti; account/segreti reali non configurati |
| C07 | Persistenza/validazione/idempotenza implementate e testate |
| C08 | Frontend non collegato, fuori dalla consegna backend |
| C09 | Adattatore email implementato e testato con stub; mittente/dominio e consegna reale non verificati |
| C10 | Adattatore Telegram implementato e testato con stub; bot/chat non creati o configurati |
| C11 | Coda persistente, stati, lease e retry implementati e testati; controllo operativo fallimenti da organizzare |
| C12 | API protette, export/delete, backup e purge implementati e testati; durata, hosting, rotazione backup e accessi reali aperti |
| C13 | Test backend completati; test integrato landing, provider e mobile da eseguire dopo C08/configurazione |
| C14 | Documentazione tecnica pronta; non dichiarata attivazione operativa |

## Prossimo passo
Collegare il modulo facoltativo B al contratto API in modalità simulata (C02/C03/C08), mentre C01 raccoglie le configurazioni reali. Prima di accettare dati reali: hosting persistente/HTTPS, identità/informativa, durata, destinatari, antispam/rete e verifica invii autorizzata. Nessun deploy, contatto proprietario o campagna avviati.

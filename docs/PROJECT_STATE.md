# Stato di ripresa Scoutly
Aggiornato: 16 ottobre 2026. Curatore A00.

## Ultimo incremento
Backend in `backend/` implementato e verificato in locale: Node 24, registro SQLite, contratto richiesta finale, amministrazione autenticata, coda email/Telegram, simulazione, ritentativi, export/delete/backup. [Consegna e stato task](project/21_Backend_consegna.md).
29 test superati, incluse prove HTTP e processo/worker reali locali; provider sempre simulati. Nessuna credenziale, raccolta reale, campagna o deploy attivati. CI predisposta: verificare il suo esito remoto sulla PR.

## Prossimo lavoro
C02/C03/C08: collegare il form facoltativo della landing B al nuovo contratto `POST /v1/requests`, partendo dalla modalità simulata. Non usare il vecchio invio progressivo contact/case_step/complete.
C01 resta aperto: soggetto/identità, informativa, email destinataria, disponibilità agente, bot/chat Telegram e durata dati.
Hosting Node 24 con volume persistente e HTTPS da scegliere; SQLite non può essere ospitato in GitHub Pages o su filesystem effimero.

## Priorità prodotto
Inbound prima della pubblicazione, direzione B scelta. Un solo percorso e un solo agente prima dell’estensione; registro privato autorevole, email/Telegram notifiche, CRM rinviato. Radar e M01–M08 conservati e rinviati.
Il prototipo B rimane una copia locale non inclusa in questo incremento backend. Nessun beneficio commerciale o conversione dichiarati validati.

## Task e documenti
- [Task C01–C14 e responsabili](project/20_Task_ricezione_email_telegram.md)
- [Consegna backend e limiti](project/21_Backend_consegna.md)
- [Strategia inbound N01–N08](project/16_Inbound_pre_pubblicazione.md)
- [Team operativo](project/17_Team_e_plugin_operativi.md)
- [Guida backend](../backend/README.md)

Non marcare C09/C10 come invii reali completati: adattatori testati con stub, account/destinatari non configurati. C12 parziale per infrastruttura e policy; C13 backend superato, prova integrata frontend/provider ancora aperta.

## Vincoli
Milano Comune, residenziale vendita/affitto con metriche separate. Richiesta volontaria distinta da mandato; nessuna identità fittizia. Segreti e dati operativi fuori da Git. Registro non pubblico. Nuovi invii esterni, creazione account e deploy richiedono istruzione distinta. Prima di cambiare PC sincronizzare il codice autorizzato e verificare su quale branch è disponibile.

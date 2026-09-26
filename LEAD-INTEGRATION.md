# Raccolta contatti Scoutly

## Regola

1. Nome e almeno un recapito valido, richiesta di ricontatto e informativa.
2. Dati del caso in più passaggi.
3. Riepilogo, dopo conferma dell’ultimo invio.

Tutti i 22 strumenti adottano questo percorso. Il contatto viene acquisito prima del completamento del caso, quando l’integrazione è attiva.

## Stato attuale

Endpoint e informativa non sono stati forniti. La modalità demo non invia né conserva i dati e lo dichiara nel modulo. Non è ancora possibile ricevere contatti reali. Il completamento dei test con destinatario simulato non dimostra un’integrazione reale.

## Configurazione

In `assets/lead-config.js` compilare endpoint HTTPS, privacyUrl HTTPS e controllerName. Tutti e tre sono necessari per attivare gli invii. Il testo di richiesta ricontatto deve essere verificato rispetto all’effettivo servizio e all’informativa. Non aggiunge iscrizioni marketing.

## Contratto del destinatario

POST JSON all’endpoint configurato. Risposta positiva: HTTP 2xx con JSON `{"accepted":true}` **solo dopo aver registrato l’evento**. Altrimenti il modulo resta sul passaggio e offre un nuovo tentativo. Timeout frontend: 15 secondi.

Campi:
- `leadId`: identificatore della sessione nella pagina, comune a tutti i passaggi.
- `eventId`: identificatore dell’evento, invariato per il ritentativo dello stesso contenuto.
- `stage`: `contact`, `case_step`, `complete`.
- `step`: indice da zero; zero è il contatto.
- `tool`, `intent`: strumento e interesse dichiarato dal percorso.
- `contact`: nome, email, telefono, `requestedContact`.
- `answers`: snapshot delle risposte del caso, anche parziali.
- `consent`: testo mostrato, privacyUrl e controllerName.
- `occurredAt`: data ISO dell’evento; registrare anche l’ora di ricezione lato server.
- `pageUrl`: origine e percorso, senza parametri query.

Il destinatario deve deduplicare per eventId, aggiornare il lead tramite leadId e mantenere lo stato parziale/completato. Non sovrascrivere uno stato completo con un vecchio evento parziale. Dopo un reset nella stessa pagina rimane lo stesso leadId; ricaricare crea una nuova sessione. Reset e chiusura pagina non eliminano dati già inviati.

Validare gli input anche lato server, limitare richieste e dimensioni, applicare protezione antispam e accessi appropriati. Il frontend non può proteggere un endpoint pubblico con un segreto. Per un dominio diverso servono CORS e preflight OPTIONS autorizzati per l’origine del sito. La validazione sintattica di email/telefono non verifica la titolarità del recapito.

## Attivazione da completare

- Scegliere il destinatario effettivo (CRM, servizio form o backend con invio email).
- Configurare e provare la registrazione persistente, i ritentativi e gli aggiornamenti dei lead parziali.
- Collegare informativa e titolare effettivi.
- Eseguire un test autorizzato di ricezione dal dominio pubblico del sito.

Queste operazioni non sono completate dalla sola pubblicazione dei file su GitHub.

> Verifica 31 ottobre 2026 — Revisione PR #6: 96 test Python in CI e 70 test Node (65 frontend + 5 pagina tecnica) passati; build Cloudflare preview riuscita. Verificati nel browser pagina dedicata desktop e mobile 375, form desktop/mobile con argomento preselezionato e telefono facoltativo, scheda home a 375 e pagina fotografie a 320, senza overflow orizzontale ai viewport controllati. Preview: https://feat-professional-photography-20261031-scoutly.dalet-p.workers.dev/ . La preview usa il backend di produzione con CORS invariato: nessun invio reale eseguito. Salvataggio/notifica verificati in simulazione; consegna reale da verificare dopo il rilascio backend-prima-frontend. Nessun merge su main o deploy di produzione.

# Fotografie professionali — revisione, 31 ottobre 2026

Servizio facoltativo di un fotografo esterno. Primo contatto sempre con il consulente gratuito attraverso il workflow consulenza esistente; nessuna generazione AI, inoltro al fotografo, prenotazione o pagamento. Nessun portfolio: non sono disponibili foto autentiche autorizzate.

## Gestione operativa successiva
La richiesta iniziale NON autorizza il trasferimento al fotografo e non è consenso marketing. Il consulente chiarisce esigenze, identità del fotografo destinatario, dati strettamente necessari, finalità, prezzo e condizioni prima di qualsiasi impegno. Se il richiedente intende procedere, raccoglie un’autorizzazione specifica e documentabile.

Prima di qualsiasi passaggio, registrare nell’archivio privato, separatamente da marketing: codice richiesta originale, identità del destinatario effettivo, finalità, elenco esatto dei dati autorizzati, testo/versione dell’informazione fornita, risposta positiva dell’interessato e riferimento alla prova, canale, data/ora e operatore. Registrare separatamente data/ora e dati effettivamente trasmessi, o rifiuto/revoca. Nessun dato reale in Git. Non usare la casella marketing come prova. In assenza del record e della prova, nessun trasferimento.

Il sito non raccoglie questa seconda autorizzazione in anticipo: fotografo e condizioni non sono ancora noti. La registrazione successiva è una procedura manuale nell’archivio privato, non un invio automatizzato o una funzione amministrativa nuova.

## Rilascio
Pubblicare prima il backend aggiornato: il vecchio backend rifiuta il nuovo argomento con 422. Non occorre migrazione SQL: l’argomento è nei dati answers JSON. Poi pubblicare frontend dalla stessa revisione. Non modificare destinatari email o CORS per la preview. La ricezione live e la consegna reale vanno verificate dopo il rilascio con una richiesta sintetica autorizzata, senza condividere dati con il fotografo.

## Verifiche
Risultati e limiti riportati nella descrizione della revisione. Form e notifica verificabili con backend e provider simulati senza invii reali.

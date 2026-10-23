# Caricamento di 10 immagini

Il nuovo limite è 10 immagini totali, planimetria inclusa; il peso resta 8.000.000 byte dopo ottimizzazione.

## Attivazione
1. Eseguire supabase/003_dieci_immagini.sql nel progetto Supabase già usato da Scoutly.
2. Su Render eseguire Manual Deploy → Deploy latest commit.
3. Verificare dal form che /public/config annunci max_photos=10 e provare 10 immagini sintetiche.

Il frontend accetta i contratti da 8 e da 10 immagini e mantiene il limite di selezione a 8 fino a quando il backend non annuncia 10. Nessun dato viene cancellato; bucket e RLS invariati. Non distribuire il backend prima della migrazione.

Verifiche locali: JavaScript accetta 10 file e rifiuta 11, peso totale 8 MB preservato; sintassi JavaScript e Python verificata. Esecuzione pytest locale non disponibile (dipendenze mancanti); test backend aggiornati per ricezione, deduplica, invio notifica con 10 allegati e planimetria in posizione 10. Migrazione e deploy Render non eseguiti da questa sessione.

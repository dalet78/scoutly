# Archivio privato per il test Scoutly

Stato: il fondatore dichiara di avere eseguito lo script nel progetto Supabase il 17 ottobre 2026. Risultati e permessi remoti non verificati dall’assistente; nessuna connessione al sito attivata.

Nel progetto Supabase aprire **SQL Editor → New query**, incollare tutto `001_ricezione_privata.sql` e premere **Run** una sola volta. Lo script crea due tabelle private e il bucket privato `scoutly-photos`. Se esistono già oggetti con questi nomi, fermarsi e riconciliare lo schema; non cancellare dati per rieseguirlo.

Le verifiche finali devono mostrare RLS attivo sulle due tabelle e `public=false` sul bucket. Non sono presenti policy per utenti anonimi o autenticati: il futuro backend userà una credenziale segreta server. Non inserirla nella pagina web, in GitHub o in chat.

Il backend deve ancora implementare validazione contenuto immagini, limite complessivo 8 MB/8 foto, antispam, idempotenza con confronto hash, rimozione file parziali e passaggio da `uploading` a `received` solo dopo salvataggio completo. Non confermare una richiesta incompleta. L'eliminazione delle righe non elimina automaticamente gli oggetti Storage: serve pulizia esplicita del backend. Invio email e generazione AI non sono implementati da questo script.

Riferimenti: https://supabase.com/docs/guides/database/postgres/row-level-security e https://supabase.com/docs/guides/storage/buckets/fundamentals

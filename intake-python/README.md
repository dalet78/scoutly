# Ricevitore Python — prova privata

Questo componente salva testo e foto su Supabase prima di confermare la ricezione. Non invia email, non esegue AI e non è collegato al form pubblico. È separato dal precedente backend Node/SQLite della PR #1: nessuna migrazione automatica di quel backend.

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
- Nessuna coda email o AI; il monitor Gmail esistente non legge questo archivio. Va progettato il passaggio successivo, senza confondere la ricevuta con la risposta all'utente.
- Render Free si sospende dopo inattività; i file locali non sono persistenti. Supabase Free può essere sospeso per inattività. Nessuna garanzia di disponibilità per pilot reali.

Documentazione: [Render/FastAPI](https://render.com/docs/deploy-fastapi), [piani gratuiti](https://render.com/docs/free), [chiavi Supabase](https://supabase.com/docs/guides/getting-started/api-keys).


## Prova guidata dal browser

Dopo il deploy aprire `/test` sull'host Render. La pagina contiene soltanto un test sintetico; non espone record e non contiene chiavi. Inserire nel campo password **SCOUTLY_TEST_TOKEN**, non la Secret key Supabase. La chiave viene inviata solo al ricevitore della stessa origine nell'header HTTPS e non viene salvata nella memoria del browser. Il codice UUID della prova viene invece conservato in sessionStorage per non generare doppioni dopo un aggiornamento della pagina. Nessuna dipendenza o script esterno nella pagina.

Premere **Salva la prova con otto immagini**. Il programma prepara una descrizione simulata e otto PNG con barre numerate. Nessuna foto proprietario, generazione AI o email. Una ricevuta conferma che le scritture API sono terminate; verificare anche nel progetto Supabase una riga `received` in `scoutly_requests`, otto riferimenti in `scoutly_photos` e otto oggetti sotto quel codice in `Storage → scoutly-photos`. Le immagini non sono pubbliche. In caso di errore mantenere il codice: nessun nuovo invio con un altro UUID prima di aver verificato il tentativo precedente.

Con Auto Deploy Off, dopo ogni aggiornamento Git scegliere **Manual Deploy → Deploy latest commit** in Render. Il collegamento `/test` non è disponibile sul primo commit 87c6888.

Verifiche aggiuntive: `node --test tests/test-page.test.mjs` (Node 20+ solo per questi test; l'host resta Python). Le prove simulate coprono uso dello stesso UUID, invio della chiave solo all'origine corrente, nessun retry automatico e rifiuto di una chiave Supabase nel campo sbagliato. Il controllo `/health` dal vivo del servizio assegnato ha risposto `ok`; non dimostra ancora la ricezione remota.

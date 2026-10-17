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

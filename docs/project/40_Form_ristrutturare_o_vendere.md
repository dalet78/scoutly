# Secondo form: Ristrutturare o vendere così?

Decisione del fondatore, 17 ottobre 2026: aggiungere al percorso annuncio un confronto preliminare tra vendita nello stato attuale e interventi prima della vendita. Prezzo ipotizzato indicativo; consulenza gratuita facoltativa per approfondire.

## Dati e flusso
Pagina: tools/ristrutturare-o-vendere.html.
Registro: ristrutturare-o-vendere v1, workflow confronto-ristrutturare-o-vendere.
Oggetto notifica: [Scoutly][ristrutturare-o-vendere] Ristrutturare o vendere così? — Richiesta orientamento.
Risposta: Re: [Scoutly][ristrutturare-o-vendere] Ristrutturare o vendere così? — Il tuo confronto.

Email, comune, zona, superficie commerciale dichiarata, prezzo ipotizzato in euro, tempi, ruolo, pubblicazione, descrizione e almeno una foto. Telefono e consulenza facoltativi. Fino a 8 JPG/PNG, 8 MB totali. Casella operativa solo nella configurazione privata.

Riusa salvataggio Render/Supabase, notifica firmata Resend con allegati e risposta Gmail ogni 30 minuti. Il browser usa sessioni e ricevute separate per i due form. Primo form conserva hash e struttura firmata precedenti, per non invalidare le richieste già ricevute.

## Risposta AI
Confronto qualitativo di tre strade: vendere così, piccoli interventi e ristrutturazione. Osservazioni solo sulle foto effettivamente analizzate. Prezzo inserito dal proprietario sempre distinto da una valutazione. Nessun prezzo di mercato, costo lavori o rendimento inventato da foto; servono dati verificabili, preventivi e confronto locale. Nessuna diagnosi tecnica o garanzia di aumento del ricavo. Poche domande pertinenti e prossimo passo.

Il fondatore autorizza la proposta “consulenza gratuita” per questo secondo percorso. Consenso separato, mai preselezionato. Se già richiesta, chiedere solo canale/fascia mancanti senza promettere contatto immediato; se rifiutata, non riproporla. Nessun trasferimento dati a consulenti esterni.

## Task e responsabilità
| Task | Profilo | Stato |
| --- | --- | --- |
| R01: promessa, campi e testo pagina | A01 marketing / A05-FE | Implementato |
| R02: validazione dei due workflow, prezzo e foto | A05-BE | Implementato, test locali passati |
| R03: notifica HTML e firma dei nuovi campi | A05-INT | Implementato, test locali passati |
| R04: istruzioni e routing agente Gmail | A00 / agente email | Automazione aggiornata |
| R05: migrazione e abilitazione Render | A05-OPS | Da eseguire |
| R06: prova completa con richiesta sintetica | QA / agente email | Dopo R05 |

## Attivazione concreta
1. Supabase → SQL Editor: eseguire una volta supabase/002_secondo_form.sql. La transazione amplia solo i vincoli dei metadati; nessun record viene cancellato, nessuna modifica a RLS, accessi o bucket. In caso di errore non rimuovere vincoli manualmente: la transazione torna indietro.
2. Render → Environment: aggiungere RENOVATION_FORM_ENABLED=true, mantenendo la configurazione esistente.
3. Render → Manual Deploy → Deploy latest commit. /health deve riportare renovation_form_enabled=true; /public/config deve elencare il secondo form.
4. Aprire la nuova pagina e fare una prova sintetica chiaramente marcata TEST TECNICO SCOUTLY. Controllare ricevuta, record privato, foto e notifica. I test tecnici restano esclusi dalle risposte automatiche; per una demo serve autorizzazione specifica.
Il secondo form non invia se il backend non dichiara di supportarlo. Il primo resta disponibile con le sue regole. Non reinviare richieste incerte con nuovi codici.

## Evidenze e limiti
59 test Python e 14 JavaScript locali passati (9 ricezione pubblica + 5 pagina riservata), con provider/archivio simulati. Anteprima visiva locale verificata, nessun invio reale del secondo form. Migrazione SQL e deploy non ancora eseguiti dall'operatore; prova reale end-to-end ancora aperta. Nessuna campagna o spesa avviata.


## Planimetria catastale come immagine separata
Campo facoltativo dedicato, JPG/PNG, con anteprima e rimozione indipendenti. Massimo 8 immagini e 8 MB complessivi: con la planimetria fino a 7 foto più una piantina; almeno una foto della casa resta necessaria. Nessun PDF in questa prima versione.

La planimetria viene aggiunta per ultima nel multipart, conservata nell'archivio privato con lo stesso schema immagini e identificata da answers.floor_plan_position. L'email ha una sezione separata e un allegato planimetria-catastale.jpg/png. Posizione, nome e hash sono firmati; il campo non autentica il documento catastale. L'agente distingue foto e disegno, non attesta conformità o fattibilità dei lavori e non riporta dati personali/intestazioni della piantina. La UI invita a oscurare i dati personali non necessari.

Nessuna nuova migrazione SQL oltre a 002_secondo_form.sql già prevista per il secondo form. Aggiornare Render a latest commit; il browser richiede floor_plan_upload=true per evitare invii alla revisione precedente. Hash e firme delle richieste precedenti restano compatibili. Test locali: 65 Python e 11 JavaScript pubblici passati (più i 5 della pagina privata già verificati); provider/archivio simulati. Nessun caricamento reale di una piantina o invio email effettuato in questa modifica.

Task R07 (A05-FE/BE/INT): caricamento dedicato, metadati e notifica implementati; R08 (agente email): istruzioni aggiornate; R09 (A05-OPS/QA): deploy e verifica completa ancora da eseguire.

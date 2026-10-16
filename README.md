# Scoutly — landing autonome per acquisizione contatti

## Regola di prodotto

Ogni pagina è una landing indipendente, dedicata a una sola domanda. Nessun menu, collegamento ad altre landing, pulsante catalogo o ritorno alla homepage. La homepage pubblica presenta soltanto il marchio. L’indice locale di revisione è esterno alla cartella Website e non viene pubblicato.

Obiettivo: acquisire il contatto offrendo un primo orientamento breve e generale, non una consulenza completa o una stima di mercato inventata.

Tutte le 22 landing seguono tre passaggi:
1. Nome e almeno un recapito valido, email o telefono.
2. Prima parte delle poche domande sul caso.
3. Seconda parte e indicazioni introduttive.

I moduli hanno titoli specifici per il beneficio della pagina. Evitare formule come “Cominciamo da te”, “Come possiamo ricontattarti?” e spiegazioni tecniche del percorso. Le domande del caso sono 4–6, senza obbligare il visitatore a cercare perizie o confronti di mercato.

## Grafica

23 illustrazioni originali: una per landing e una per la homepage. Sfondo fisso su desktop, versione attenuata e riquadro illustrato su mobile. Pannelli del modulo opachi, pulsante che porta direttamente al form, nessuna parallasse. Asset locali WebP e miniature leggere per la revisione locale. Direzione creativa e prompt in DESIGN.md.

## File

- `tools/`: le 22 landing, accessibili dai rispettivi URL diretti.
- `assets/catalog.js`: titoli, offerte, domande, testi introduttivi e risposte.
- `assets/orientation.js`: brevi orientamenti e pochi conti parziali basati sugli importi facoltativi inseriti.
- `assets/tool.js`: contatto, passaggi, validazione, invio progressivo e download delle indicazioni.
- `assets/lead-config.js`: configurazione pubblica del destinatario e dell’informativa.
- `assets/editorial.css`: sfondi e presentazione responsive.
- `assets/scenes/`: immagini dedicate.

Sito statico senza librerie esterne. Per la prova locale aprire il file HTML; per la pubblicazione utilizzare un hosting statico. Non pubblicare note personali o dati operativi privati. Il dossier di progetto selezionato e autorizzato per la continuità tra PC è in `docs/project/`.

## Limiti dichiarati

Non sono collegate API di quotazioni, canoni, tempi o richieste di acquirenti. Le pagine non inventano prezzi, giorni di vendita o conteggi di persone. Le poche differenze numeriche sono esplicitamente parziali e non aggiungono importi non forniti dall’utente. Nessuna aliquota, esenzione o rendimento garantito viene calcolato.

## Ricezione contatti

Configurazione attuale: ANTEPRIMA senza invio. Mancano ancora destinatario effettivo, URL informativa e titolare. Nessun dato viene salvato nel browser o trasmesso; usare dati di esempio.

Quando configurato, il destinatario riceve il contatto già al primo Continua. I passaggi seguenti aggiornano la stessa richiesta; il modulo avanza solo dopo conferma. Gli errori non vengono mostrati come successo. Contratto e attività da completare: LEAD-INTEGRATION.md.

## Verifica

Test dei 22 percorsi, campi contatto, due passaggi del caso, Indietro e reset, esportazione, importi facoltativi e testi. Controllo delle scene locali e dell’assenza di collegamenti fra landing. Invio progressivo e ritentativo testati con un ricevitore simulato, senza trasmettere contatti reali.

Repository: https://github.com/dalet78/scoutly. Il caricamento nel repository non implica l’attivazione di GitHub Pages.

## Lavorare da più PC con Codex

Scarica o clona il branch `main`, apri la cartella e chiedi all’assistente di leggere [AGENTS.md](AGENTS.md), [START_HERE](docs/START_HERE.md) e [stato del progetto](docs/PROJECT_STATE.md). Troverà profili del team, decisioni, piano e task piccoli senza dipendere dalle chat o dal vault del primo PC.

- [Definizione progetto](docs/project/13_Progetto_e_repository.md)
- [Backlog e criteri di completamento](docs/project/14_Backlog_task.md)
- [Dossier completo](docs/project/Scoutly.md)

Prima di cambiare PC sincronizza il lavoro con Git: un download di main contiene solo file caricati nel repository. Credenziali e dati salvati nel browser non si trasferiscono. La guida descrive setup e limiti noti dell’avvio locale.

## Landing B — Prima di pubblicare

Nuova pagina indipendente: [Prima di pubblicare](tools/prima-di-pubblicare.html), pubblicata sul sito statico all’indirizzo `https://dalet78.github.io/scoutly/tools/prima-di-pubblicare.html` dopo il completamento di GitHub Pages.

Questa anteprima B genera la checklist nel browser e permette di scaricarla. Non raccoglie recapiti, non invia richieste e non usa storage del browser. Le altre 22 landing mantengono il proprio percorso; B mostra il risultato senza recapito. Gli asset isolati sono in `assets/prima-di-pubblicare/`; test: `node --test tests/prima-di-pubblicare.test.mjs`.

GitHub Pages ospita solo la parte statica. Il backend Node/SQLite rimane nella [PR #1](https://github.com/dalet78/scoutly/pull/1), non attivo su Pages. Email e Telegram restano da configurare.

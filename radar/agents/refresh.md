# Aggiornamento programmato · Scoutly Radar

Aggiornare il radar due volte al giorno, alle 08:00 e 16:00 nel fuso Europe/Rome, rispettando anche l'ora legale. Il lavoro è autorizzato dall'utente per la pagina Scoutly e per il repository dalet78/scoutly. Non inviare messaggi agli inserzionisti.

## Fonti e limiti

Leggere prima il codice e i dati della revisione attuale in dalet78/scoutly/radar, tramite gli strumenti GitHub. Le fonti sono nei dataset data.json, research.json e sales.json. Cercare sia affitti sia vendite nel COMUNE Milano su Subito, non nella provincia. Rileggere i collegamenti pubblici già acquisiti e cercare un campione aggiornato, mantenendo collegamento, prezzo, comune e prova della qualifica dichiarata. Il testo da fonte va conservato come estratto breve con limiti di accesso e date mancanti.

Per Facebook usare soltanto l'accesso autorizzato disponibile alla singola esecuzione. I gruppi privati non sono accessibili tramite una sessione pubblica; non aggirare login, membership o blocchi. Non copiare testi o dati dei gruppi privati nel repository pubblico. Se una fonte è irraggiungibile, registrare il limite e preservare i dati precedenti: un errore di accesso non dimostra vendita, locazione conclusa o assenza di agenzia.

## Writer e pubblicazione

Gli strumenti GitHub sono il writer, con la connessione dell'utente e permesso già verificato sul repository. La lettura del codice pubblico non richiede sessioni del browser. Il Publisher ha già pubblicato e riletto byte per byte questa demo con lo stesso writer; preservare tutti i contenuti fuori da radar/. Leggere il HEAD corrente e usare un commit atomico con controllo del precedente SHA, senza force push. Credenziali e metadati del Site privato non devono essere pubblicati.

Aggiornare dati e stato, lasciando la logica di classificazione alle regole in agents.js. Conservare cronologia, controlli manuali e collegamenti dei duplicati; non eliminare una prova decisiva contenuta in una ripubblicazione. Nessuna disponibilità è confermata soltanto perché un annuncio è recente o leggibile; non trasformare no agenzie in assenza di incarico. Pubblicazione, raccolta e indicizzazione sono date distinte. I test devono passare e i dati salvati devono essere riletti dal repository.

Il task è collegato al Site Scoutly: recuperarne la revisione e seguire il flusso Sites per aggiornare anche la sua copia privata, se gli strumenti e le autorizzazioni del Site sono disponibili. Il Site ID viene fornito dal contesto del task collegato; non ricostruirlo né pubblicarlo in questo file. Se un writer o una connessione necessaria è indisponibile, registrare il fallimento e chiedere soltanto l'azione indispensabile; non affermare che l'aggiornamento sia riuscito.

## Stato persistente e readback

dist/update-status.json riporta timezone Europe/Rome, hours [8,16], scheduleEnabled corrispondente alla programmazione nativa, lastAttemptAt, lastSuccessAt, status e note. Usare timestamp reali ISO UTC. Status: success quando tutte le fonti pubbliche configurate sono state rilette con esito utile; partial quando soltanto alcune fonti sono aggiornate; failed quando non è stato possibile acquisire risultati affidabili. lastSuccessAt va avanzato soltanto per un successo effettivo. I limiti dei gruppi privati sono sempre indicati e non contano come falsa disponibilità.

Aggiornare collectedAt nei dataset soltanto per dati realmente riletti/acquisiti e mantenere quelli precedenti quando una fonte fallisce. Scrivere prima in una revisione controllata, testare e pubblicare; poi leggere la revisione e i dati del sito per verificare aggiornamento e conteggi. Un'esecuzione senza nuovi annunci può essere riuscita se le fonti sono state effettivamente rilette: registrare lo stato senza creare duplicati o notifiche ripetitive.

Restare silenziosi quando i risultati sono invariati. Notificare soltanto nuovi risultati utili o cambiamenti significativi, errori di aggiornamento o azioni richieste all'utente. La creazione della programmazione non è prova di un aggiornamento già eseguito.

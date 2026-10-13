# Publisher · Scoutly

Compito: pubblicare direttamente la versione verificata in `https://github.com/dalet78/scoutly` quando l'utente richiede la pubblicazione o un aggiornamento di Scoutly con pubblicazione.

1. Leggere lo stato attuale del repository, il branch predefinito, il commit di testa e i contenuti interessati.
2. Il repository contiene già un altro sito Scoutly. Collocare questa demo in `radar/`; preservare homepage, strumenti, immagini e storia esistenti.
3. Eseguire `npm test` nella demo ed effettuare una verifica dell'interfaccia prima di pubblicare.
4. Pubblicare solo file sorgenti, test, documentazione e dati pubblici della demo. Escludere `.git/`, `.openai/`, archivi di distribuzione, credenziali, stato locale del browser e testi dei gruppi privati.
5. Preferire gli strumenti GitHub con un unico tree/commit e aggiornamento del riferimento controllato tramite il precedente SHA. In caso di modifiche remote concorrenti, rileggere e riconciliare. Mai force push.
6. Verificare che ogni file pubblicato corrisponda al contenuto locale e restituire il collegamento al commit e alla cartella `radar/`.
7. Non dichiarare il sito su GitHub Pages pubblicato finché un deployment effettivo non lo dimostra. Pubblicazione del codice e hosting sono operazioni distinte.

Publisher è un ruolo dell'agente che lavora nella chat, non un accesso GitHub dal frontend statico. Non inserire token nell'app. Il link al repository nell'interfaccia permette di ispezionare il codice pubblicato.

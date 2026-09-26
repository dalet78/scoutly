# Scoutly — strumenti per proprietari immobiliari

La homepage `index.html` è la vera pagina di Scoutly. Gli strumenti vengono aggiunti come sotto-pagine nella cartella `tools/`.

Struttura attuale:

```text
index.html
tools/
└── vendere-o-affittare.html
```

Landing page statiche pronte per GitHub Pages.

## Pubblicazione

1. Aprire **Settings → Pages** nel repository GitHub.
2. Selezionare **Deploy from a branch**.
3. Scegliere il branch principale e la cartella `/ (root)`.
4. Salvare e attendere la generazione dell'URL pubblico.

Il questionario è un funnel progressivo di tre passaggi, strutturato per acquisire prima il contatto:

1. nome e almeno un contatto reale (email oppure telefono), con consenso al ricontatto;
2. richiesta principale dello strumento: “Iniziamo dal tuo immobile” (zona e tipologia);
3. informazioni aggiuntive utili al confronto (obiettivo, superficie, locali e tempistica), seguite dal risultato.

Il contatto è lo scopo primario del form; le informazioni sull'immobile sono un valore aggiunto per qualificare il lead e migliorare il risultato.

Ogni clic su **Avanti** crea un evento con step, timestamp e risposte. In questa demo gli eventi vengono salvati nel `localStorage` del browser. Per la versione reale va valorizzata la costante `leadEndpoint` in `tools/vendere-o-affittare.html` con un endpoint HTTPS sicuro, oltre ad aggiungere autenticazione/validazione lato server, informativa privacy, consenso separato al contatto commerciale e gestione dei lead Scoutly.


## Stato della versione pubblicata

Prototipo dimostrativo, senza backend: nessun lead viene trasmesso e nessun ricontatto viene attivato. Usare dati di esempio. Gli eventi rimangono nel localStorage del browser (massimo 100); cancellando i dati del sito si eliminano. La demo resta utilizzabile anche quando il salvataggio locale non è disponibile. Il risultato riflette l’obiettivo selezionato, non calcola una convenienza economica. Prima dell’uso reale servono integrazione backend, gestione degli errori di invio e informativa privacy effettiva.

La homepage ricevuta era una versione precedente del questionario: è stata allineata alla struttura homepage + strumenti. Corretti navigazione, invio con Invio nei passaggi iniziali, limiti della superficie e messaggi sul ricontatto.


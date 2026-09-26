# Scoutly — strumenti per proprietari immobiliari

## Catalogo

22 pagine strumento: 20 nuove, più Casa vuota e Vendere o affittare già presenti. La homepage offre ricerca e filtro per tema.

- [Quanto vale la tua casa oggi?](tools/valore-casa.html) — Confronto con dati inseriti
- [Quanto puoi chiedere di affitto?](tools/canone-affitto.html) — Confronto con dati inseriti
- [Vendere ora o aspettare 12 mesi?](tools/vendere-o-aspettare.html) — Simulazione
- [Quanto tempo serve per vendere nella tua zona?](tools/tempi-vendita.html) — Dati locali da verificare
- [Quanto perderesti vendendo al prezzo sbagliato?](tools/prezzo-sbagliato.html) — Simulazione
- [La tua casa è facile o difficile da vendere?](tools/facilita-vendita.html) — Quiz di preparazione
- [Quante persone stanno cercando una casa come la tua?](tools/domanda-acquirenti.html) — Dati locali da verificare
- [Checklist: 10 cose da fare prima di mettere casa in vendita.](tools/checklist-vendita.html) — Checklist
- [Calcola i costi reali della vendita del tuo immobile.](tools/costi-vendita.html) — Calcolo
- [Quanto rimane realmente in tasca dopo la vendita?](tools/netto-vendita.html) — Calcolo
- [Ristrutturare prima di vendere: conviene?](tools/ristrutturare-prima.html) — Simulazione
- [Quali lavori aumentano davvero il valore della tua casa?](tools/lavori-valore.html) — Confronto di scenari
- [Vendere da privato o con agenzia? Calcola costi e differenze.](tools/privato-o-agenzia.html) — Confronto di scenari
- [Meglio vendere affittato o libero?](tools/affittato-o-libero.html) — Confronto di scenari
- [Conviene arredare casa prima di metterla sul mercato?](tools/arredare-casa.html) — Simulazione
- [Vendere e reinvestire: potresti ottenere un rendimento migliore?](tools/vendere-reinvestire.html) — Scenario ipotetico
- [Hai ereditato un immobile? Scopri le opzioni: vendere, affittare o mantenerlo.](tools/immobile-ereditato.html) — Confronto di scenari
- [Ti trasferisci in un’altra città? Scopri cosa conviene fare con la tua casa.](tools/trasferimento.html) — Confronto di scenari
- [I figli sono andati via? Quanto potresti ricavare passando a una casa più piccola?](tools/casa-piu-piccola.html) — Calcolo
- [La tua seconda casa ti costa più di quanto rende?](tools/seconda-casa.html) — Calcolo
- [Quanto costa mantenere una casa vuota?](tools/casa-vuota.html) — Calcolo
- [Vendere o affittare?](tools/vendere-o-affittare.html) — Percorso guidato

## Funzionamento

Sito statico senza dipendenze esterne. Aprire index.html oppure servire la cartella con un server statico. Gli asset condivisi sono in assets/. Tutte le 22 pagine richiedono JavaScript per form e calcoli. Definizioni: catalog.js; formule: calculators.js; interfaccia: tool.js.

Regola di prodotto: lo scopo è acquisire contatti. Ogni strumento segue obbligatoriamente contatto → dati del caso in più passaggi → riepilogo. Il primo passaggio chiede nome e almeno un recapito valido (email o telefono); ogni recapito compilato viene validato. Seguono gruppi di massimo quattro campi, con avanzamento, Indietro e conservazione delle risposte nella pagina.

Configurazione attuale: DEMO. Nessun dato viene salvato nel browser o trasmesso; utilizzare dati di esempio. Anche Casa vuota e Vendere o affittare usano ora lo stesso percorso condiviso. Il vecchio localStorage non viene più letto né alimentato; eventuali dati di prove precedenti possono essere eliminati cancellando i dati del sito nel browser.

Per attivare la raccolta effettiva, configurare endpoint HTTPS, URL dell’informativa privacy e nome del titolare in assets/lead-config.js, dopo aver predisposto il destinatario. Non inserire segreti nel frontend. Il sito invia il contatto al primo Continua e aggiorna la stessa richiesta ai passaggi successivi; procede solo dopo conferma esplicita del destinatario. Il contratto è in [LEAD-INTEGRATION.md](LEAD-INTEGRATION.md).

Il riepilogo può essere scaricato come testo e non include recapiti. Modificare i campi invalida il precedente risultato. Gli importi economici obbligatori richiedono zero esplicito quando non applicabili. Le formule e i limiti sono descritti in ogni pagina.

## Verifiche

Verificati i 22 percorsi nel browser: contatto obbligatorio, passaggi progressivi, riepilogo, Indietro, reset e larghezza mobile. Controllati formule numeriche, intervalli non validi, dati di mercato assenti, link locali, filtro homepage e download. Invio progressivo, errore e ritentativo con stesso identificatore verificati con un destinatario simulato: nessun contatto reale trasmesso.

## Mercato e scenari

Nessuna API di quotazioni, compravendite o richieste di acquirenti è collegata. Valore e canone richiedono confronti e fonte inseriti dall'utente. Tempi richiede tre casi per produrre minimo/mediana/massimo; domanda richiede un campione dichiarato e non estrapola il numero di acquirenti. In assenza di dati i risultati riportano l'indisponibilità e i passaggi necessari.

Gli strumenti sommano importi e confrontano scenari; non calcolano aliquote, esenzioni, conseguenze successorie, diritti di locazione o rendimenti garantiti. Le ipotesi future sono dell'utente. I confronti patrimoniali distinguono liquidità una tantum, flussi annui, debito e costi figurativi del tempo.

## Pubblicazione

Repository: https://github.com/dalet78/scoutly. Pubblicare la sola cartella Website, senza note private di Obsidian. Per GitHub Pages selezionare il branch main e la radice in Settings → Pages. La presenza dei file su GitHub non implica l'attivazione del sito pubblico.

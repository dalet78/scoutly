# Scoutly Radar · demo 02

Radar immobiliare per il **comune di Milano** con selezione dei privati, scarti spiegabili e verifiche di disponibilità/incarico ad agenzia. La demo estende il progetto iniziale Boris e usa il nome Scoutly.

**Campione del 13 ottobre 2026: 17 annunci/post acquisiti, 11 candidati da approfondire, 6 scarti.** Il campione comprende 11 post/annunci di affitto e 6 annunci di vendita: 3 vendite da privati dichiarati restano in revisione. Nessuna disponibilità attuale è stata confermata direttamente dal proprietario e nessuna assenza di incarico ad agenzia è stata verificata. Gli scarti sono una ripubblicazione, un subentro da coinquilini, tre venditori/servizi professionali e una scheda rimossa. HTTP 410 non significa che l’immobile sia stato venduto. Due loft su Subito restano possibili duplicati: i riscontri non bastano per eliminarne uno automaticamente.

## Avvio

Serve Node.js 24. Nessuna dipendenza da installare.

```sh
node server.mjs
# Aprire http://127.0.0.1:4173

node --test --test-isolation=none agents.test.js
```

Se npm è disponibile, `npm start` e `npm test` eseguono gli stessi comandi. Il contenuto di `dist/` funziona anche su un hosting statico. `index.html` alla radice rimanda a `dist/`, per consentire l’apertura da una sottocartella su GitHub Pages. La presenza del codice nel repository non prova da sola che GitHub Pages abbia pubblicato quella versione.

## Sei agenti

| Agente | Compito |
| --- | --- |
| Scout | Individua offerte, separandole dalle richieste |
| Analista | Classifica dichiarazioni di privati e operatori professionali |
| Filtro | Esclude agenzie/intermediari, duplicati certi e annunci non validi; mantiene audit |
| Disponibilità | Cerca dichiarazioni datate, gestisce ingresso futuro, scadenza e conflitti |
| Incarico | Distingue presenza/assenza dichiarata di agenzia da incarico non verificato |
| Publisher | Pubblica il codice verificato in `dalet78/scoutly/radar`, preservando il sito esistente |

I primi cinque sono moduli a regole spiegabili in `dist/agents.js`, eseguiti nel browser. La ricerca sulle pagine online è assistita dagli agenti della chat: non è attivo un crawler o un monitoraggio periodico. Publisher è un agente della chat e non un accesso GitHub dal frontend. Il suo contratto operativo è in `agents/publisher.md`. Il flusso complessivo è in `agents/workflow.md`.

## Fonti

- [Bacheca annunci Vendita/affitto case Milano](https://www.facebook.com/share/g/19TtCYiKiC/): gruppo pubblico; tre post pubblici acquisiti nel campione, incluso un duplicato.
- [CASE MILANO IN VENDITA E IN AFFITTO - Trattative tra Privati](https://www.facebook.com/share/g/18q1gmSDTn/): gruppo privato; post non accessibili nella sessione verificata.
- [Subito, appartamenti in affitto nel comune di Milano](https://www.subito.it/annunci-lombardia/affitto/appartamenti/milano/milano/): otto annunci nel campione. Il percorso comunale è distinto da quello della provincia. L’import di Subito richiede la conferma del comune nella scheda.
- [Subito, appartamenti in vendita nel comune di Milano](https://www.subito.it/annunci-lombardia/vendita/appartamenti/milano/milano/): sei annunci di vendita, con prezzo totale distinto dal canone mensile. La vista può essere filtrata per affitti e vendite.
- [|| MILANO || APPARTAMENTI & STANZE IN AFFITTO](https://www.facebook.com/share/g/1CDLw3kfDY/): gruppo privato, accessibile nella sessione autenticata verificata. Registrato tra le fonti; nessun testo di questo gruppo è incluso nei file pubblicati su GitHub.

I file `dist/data.json`, `dist/research.json` e `dist/sales.json` conservano fonti, collegamenti, testi o estratti pubblici realmente letti, stato di accesso e limiti. Le date di raccolta e indicizzazione non vengono usate come date delle dichiarazioni. Alcuni dettagli Subito erano disponibili solo tramite contenuti indicizzati; sono segnalati nell’interfaccia.

## Uso e verifiche

1. **Analizza un annuncio:** acquisisce testo e collegamento dei gruppi configurati o di Subito. Un post con lo stesso URL aggiorna il record e conserva la cronologia. Gli scarti restano consultabili.
2. **Registra verifica:** inserisce risposta di chi dichiara di essere proprietario, aggiornamento dell’inserzionista, possibile annuncio d’agenzia, nota di ricerca o duplicato confermato. Servono testo, data reale e contesto riferito allo stesso immobile. Gli agenti rivalutano l’esito.
3. **Prepara domande:** propone domande su proprietà, disponibilità, data di ingresso, agenzia ed esclusiva. Nessun messaggio viene inviato dall’app o dagli agenti senza una richiesta esplicita.
4. **Backup JSON / tabella CSV:** esporta risultati e prove. Il backup può essere reimportato, con validazione completa prima di cambiare lo stato.

Le aggiunte e le verifiche sono salvate nel browser tramite `localStorage`, senza sincronizzazione remota. Il campione pubblicato resta separato dalle aggiunte dell’utente. Se il browser non consente il salvataggio locale, usare il backup JSON.

Una disponibilità esplicita datata viene riconfermata dopo **7 giorni**; una dichiarazione sull’incarico dopo **30 giorni**. Queste sono regole della demo, definite in `POLICY`, non garanzie esterne. Dichiarazioni non datate, domande, commenti di terzi e fonti in conflitto non diventano conferme. «No agenzie» non prova l’assenza di un mandato; un annuncio simile di agenzia non prova che riguardi lo stesso immobile. Proprietà e mandato non sono verificati documentalmente.

La deduplicazione usa URL normalizzati oppure stesso autore e testo completo identico con prezzo coerente. Le prove delle versioni duplicate confluiscono nel record conservato prima della valutazione: una chiusura o un incarico più recente non viene perso. Testi simili o caratteristiche quasi identiche restano in revisione finché un operatore non conferma il duplicato con riscontri.

## Controlli

31 test verificano affitti e vendite reali, esclusione degli operatori e delle richieste, negazioni, duplicati, aggiornamenti decisivi, schede rimosse, date mancanti/future, scadenza, conflitti, comune di Milano, import sicuro, conservazione della cronologia, CSV e aggiornamenti online che non vengono sovrascritti dai vecchi snapshot del browser. Sono state verificate nel browser anche le viste candidati/scarti, la registrazione di una nota reale e il ripristino dopo ricaricamento.

## Aggiornamenti programmati

Gli aggiornamenti sono programmati alle **08:00 e 16:00, Europe/Rome (ora di Milano)**, a partire dal **14 ottobre 2026**. La programmazione nativa collegata al Site esegue ricerca e pubblicazione con le istruzioni in `agents/refresh.md`; l'attivazione è stata salvata e riletta tramite il servizio. Lo stato e l'ultima esecuzione sono riportati in `dist/update-status.json` e nell'interfaccia. La prima esecuzione programmata non è ancora avvenuta. Il passaggio all'ora legale segue il fuso Europe/Rome.

Il task usa gli strumenti GitHub come writer già verificato e aggiorna dati pubblici senza accesso obbligatorio a un browser locale. Per le fonti non accessibili conserva gli ultimi dati e registra il limite. Gli aggiornamenti del Site privato seguono il flusso Sites con il contesto e le autorizzazioni del task collegato. Non invia contatti agli inserzionisti e resta silenzioso in assenza di cambiamenti utili.

La pagina aperta controlla i propri dataset pubblicati ogni 5 minuti e ricarica soltanto quando cambiano, mantenendo i filtri. Non ricarica durante la compilazione di un modulo aperto. Questo controllo non ricerca annunci su Facebook o Subito: la ricerca è svolta dal task cloud agli orari programmati. Un aggiornamento del campione online prevale sul vecchio snapshot salvato nel browser, preservando le prove e la cronologia locali.

## Pubblicazione

Il repository di destinazione è [dalet78/scoutly](https://github.com/dalet78/scoutly). Questa demo vive in `radar/`; homepage e strumenti del sito precedente sono preservati. Publisher usa un commit controllato, verifica i file remoti e non effettua force push. Credenziali, metadati di hosting personali, screenshot di QA e testi dei gruppi privati non sono inclusi nella pubblicazione GitHub.

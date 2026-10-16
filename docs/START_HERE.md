# Riprendere Scoutly da qualsiasi PC

La repository contiene codice, contesto di progetto, profili del team e backlog. Non serve la cartella ChatGPT Work o il vault del primo PC. Chat precedenti, credenziali, storage del browser e autorizzazioni dei servizi non si trasferiscono con Git.

## Primo download
Installa Git e Node.js 24 per lavorare sul codice e avviare Radar. Per leggere documenti non serve Node.

```sh
git clone https://github.com/dalet78/scoutly.git
cd scoutly
git switch main
```

In alternativa scarica lo ZIP di main ed estrailo: include gli stessi file, ma senza cronologia e sincronizzazione Git. Apri la cartella estratta come progetto di lavoro.

## Quando cambi PC
Sul PC da cui parti salva e sincronizza il lavoro autorizzato con Git, compresi stato e backlog. I file non committati o non caricati non arriveranno sull’altro PC.

Su un clone già presente:

```sh
git status --short
git switch main
git pull --ff-only origin main
```

Se ci sono modifiche locali, riconciliale prima di cambiare branch o aggiornare; non usare reset o clean per eliminarle. Non lavorare in contemporanea su copie non sincronizzate dello stesso task.

## Cosa dire all’assistente

> Leggi AGENTS.md, docs/START_HERE.md e docs/PROJECT_STATE.md. Riprendi Scoutly dal primo task pronto del backlog, preservando modifiche locali e decisioni aperte. Prima verifica lo stato effettivo del codice. Non avviare campagne, contatti o pubblicazioni senza istruzioni.

## Ordine di lettura
- [Stato attuale e prossimo task](PROJECT_STATE.md)
- [Progetto e baseline repository](project/13_Progetto_e_repository.md)
- [Task piccoli e dipendenze](project/14_Backlog_task.md)
- [Profili e workflow](project/Team_Business_Profili_e_Workflow.md)
- [Indice del dossier](project/Scoutly.md)
- [Piano esperimenti](project/11_Piano_esperimenti.md)

## Avvio tecnico esistente
Dalla radice:

```sh
cd radar
node --version
node --test --test-isolation=none agents.test.js
node server.mjs
```

Apri http://127.0.0.1:4173. Nessuna dipendenza npm richiesta dal package attuale. Test e smoke test vanno realmente eseguiti sul PC: non sono stati eseguiti durante il trasferimento documentale. Difetto noto da verificare/correggere B04: il server locale non ammette due moduli importati dalla UI (`activity.js`, `description-style.js`). Non considerare l’avvio completo finché B05 non è passato.

Per una verifica separata del sito statico puoi aprire `tools/vendere-o-affittare.html`; la ricezione lead resta demo finché non configurata e testata. Non inserire dati reali. Non attivare endpoint come parte del semplice setup.

## Cosa resta specifico della macchina o del servizio
Permessi GitHub e accesso ai servizi si configurano sul nuovo PC; nessuna credenziale va nella repository. I record Radar salvati in localStorage restano in quel browser: un download di main non li sincronizza. Eventuali trasferimenti di dati reali richiedono un archivio privato dedicato. Stato scheduler e hosting si verificano sui servizi: un JSON versionato non dimostra un’automazione live.

## Fonte di continuità
Da questo trasferimento la repository è la fonte del contesto condiviso tra PC. Aggiorna stato, backlog e diario insieme al lavoro. Mantieni Obsidian come copia locale opzionale; i link della documentazione sono Markdown relativi e non richiedono plugin.

## Perimetro pubblico del dossier
Il repository è pubblico. Il dossier conserva il contesto necessario allo sviluppo; le versioni di brief, registro evidenze, modello economico, diario e passaggio omettono dettagli personali e condizioni di trattative individuali. Gli originali privati non sono sincronizzati. Non reinserirli automaticamente da un vault locale.

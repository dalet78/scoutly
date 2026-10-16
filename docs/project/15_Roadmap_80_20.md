# Roadmap iniziale 80/20 — Scoutly
16 ottobre 2026. A00/A03/A04/A07 in sequenza. Indirizzo richiesto: concentrare il lavoro sul minimo che produce utilità misurabile. “80/20” è una regola di priorità, non una previsione misurata di risultati o impegno.

## Scelta raccomandata
Prima rendere utile Radar a un solo agente, con una fonte praticabile e feedback semplice. Conservare vendita e affitto nel Comune di Milano, misurandoli separatamente. La fonte iniziale si sceglie in base ad accesso e uso effettivamente praticabili, non alla quantità apparente di annunci.
Inbound resta il secondo canale complementare: una sola landing e un solo destinatario privato quando esiste un canale di traffico concreto. Nessuna necessità di attivare tutte le 22 pagine per verificare il valore.

## Risultato che compriamo con il primo incremento
L’agente riceve poche schede pertinenti, con fonte, data e motivo della selezione, e può dire quali sono utili. Misuriamo se diminuisce il tempo per opportunità utile e quanto lavoro serve all’operatore.
Questa fase non promette contatti qualificati, appuntamenti, mandati o ricavi: la disponibilità al ricontatto richiede una verifica successiva.

## Primo ciclo — otto task piccoli
| Ordine | Task | Riuso backlog | Finito quando |
|---|---|---|---|
| M01 | Verificare checkout e lanciare la suite Radar esistente | B02,B03 | Comando, versione Node ed esito reale registrati; errori separati dai test non eseguiti |
| M02 | Correggere solo il blocco di avvio dei moduli e aprire Radar | B04,B05 | Moduli caricati, schede e filtri funzionanti; smoke test registrato |
| M03 | Scegliere una fonte iniziale utilizzabile | F01,F02, controllo mirato B06 | Accesso, campi e limiti di uso noti; dati reali solo se il percorso è praticabile, altrimenti fixture fittizie per la sola prova tecnica |
| M04 | Definire la tabella minima di selezione | P01,P02, porzione R03/R04 | Milano/residenziale/operazione/ruolo/duplicati con motivi; incarico ed esclusiva distinti, casi incerti in revisione umana |
| M05 | Preparare un foglio privato di feedback vuoto | R07; alternativa manuale a R08–R10 | ID scheda, utile/approfondire/scartare, motivo, già noto, minuti agente e operatore; nessun backend o nuova UI necessari |
| M06 | Concordare una sessione e una baseline comparabile | V01,V02 ridotti al filtro | Partecipante, finestra, limite ore/spesa, criteri e baseline sola ricerca/selezione fissati prima della prova |
| M07 | Preparare un piccolo lotto unico e farlo valutare nella sessione concordata | Filtro E-A; V06 limitato | Annunci e scarti campionati con regola esplicita, dati datati, tempi e valutazioni raccolti; nessun contatto a proprietari |
| M08 | Decidere se ripetere, correggere o fermare il filtro | V07 limitato | Conteggi, quota utili, duplicati, già noti, tempo per utile e costo operatore confrontati con baseline e limiti dichiarati |

M01/M02 possono procedere senza le risposte commerciali. M03 e M04 sono condizioni per un lotto reale: accesso al dato pubblico non è autorizzazione al suo riuso. M05 può essere realizzato con un file/tabella privati già disponibili, senza costruire un CRM.

Il volume iniziale va limitato dal tempo di valutazione disponibile: la prima sessione può essere di sola taratura/usabilità e non dimostrare efficacia del filtro. La proposta precedente di 30–50 annunci in cinque giorni resta una possibile prova successiva, non un requisito per avviare una sessione esplorativa né una soglia statistica. Non annunciare l’80% di beneficio sulla base di un piccolo campione.

## Semplificazioni deliberate
- Feedback manuale prima di sviluppare salvataggio, migrazioni ed esportazione nuovi.
- Raccolta circoscritta utilizzabile prima di connettori, crawler o monitoraggio esteso.
- Revisione umana dei casi ambigui prima di classificatori più sofisticati.
- Un solo agente prima di account multipli, routing o esclusiva territoriale.
- Conservare i prototipi: nessuna riscrittura grafica/framework per questo ciclo.

## Secondo ciclo — un solo inbound, condizionato
Si può anticipare questo ciclo se emerge un canale di traffico già disponibile e praticabile mentre la fonte annunci rimane bloccata: A00 registra il motivo. La scelta non è un vincolo irreversibile Radar-prima.
1. Confermare una landing e il suo risultato utile: candidato “Vendere o affittare?”, non selezionato automaticamente dalla roadmap (P03,I01).
2. Scegliere esplicitamente posizione del recapito e richiesta di ricontatto; mantenere il codice attuale finché la scelta è aperta (P04,I04).
3. Valutare un servizio form/CRM esistente compatibile con il flusso, prima di un backend su misura (I05/I06). Il ricevitore deve davvero salvare prima dell’ack, gestire ritentativi e non perdere gli aggiornamenti; se il servizio non lo supporta, semplificare esplicitamente il contratto e testarlo.
4. Collegare e verificare un solo percorso con dati fittizi; identità, informativa, accessi e gestione dati definiti prima della ricezione reale (I07–I12 o equivalente riusato).
5. Solo con canale, tetto di spesa, durata e criterio di esito concordati, preparare il test inbound (V03). Nessuna campagna o pubblicazione eseguita da questa roadmap.

## Rinviato fino a evidenza di utilità
Attivazione delle altre 21 landing, backend personalizzato se esiste riuso adeguato, automazioni di contatto, nuovi scheduler, analisi foto/stile aggiuntive, CRM completo, multiagente, app mobile, espansione geografica, prezzi ed esclusiva territoriale.
Sono attività rinviate, non file da cancellare. Lo stato dei programmi esistenti non viene alterato.

## Come si collega al backlog completo
Il [backlog di 45 task](14_Backlog_task.md) resta inventario degli sviluppi possibili. Questo documento governa l’ordine iniziale e introduce un percorso manuale alternativo.
Per la sola prova filtro, V02/V05/V06/V07 non richiedono più completamento di R08–R10 o I13: bastano feedback privato manuale, condizioni M03–M06 e controlli pertinenti al canale annunci. Le dipendenze originali restano per la prova integrata dei due canali. Nessun test manuale chiude automaticamente i task di implementazione rimandati.

## Stato e prossimo passo
Roadmap preparata, esecuzione non iniziata. Prossimo task M01, poi M02. Le decisioni mancanti vanno chieste solo quando bloccano il task relativo. Soglie e budget non inventati, pilot non dichiarato avviato.

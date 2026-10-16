> Avanzamento sviluppo: leggere [consegna backend e stato effettivo C01–C14](21_Backend_consegna.md). La tabella sottostante conserva lo stato iniziale del piano, non il consuntivo. C07/C11 implementati e testati; C09/C10 adattatori in simulazione; C08 e configurazioni reali restano aperti.

# N05 — Task: registro privato, email e Telegram
16 ottobre 2026. Input: prototipo B locale, richiesta di ricontatto volontaria, scelta email/telefono più notifiche Telegram. CRM rinviato. Piano di assegnazione: nessuno di questi incarichi è dichiarato eseguito o attivo in background.

## Obiettivo
Salvare una richiesta volontaria una sola volta in un registro privato, confermarla al proprietario e renderla gestibile dall’agente via email e notifica Telegram. La checklist resta consultabile senza lasciare recapiti. Il proprietario non deve usare Telegram.

## Profili e responsabilità
Ogni task ha un unico responsabile. Le sigle A05-* specializzano il profilo A05 esistente, senza sostituire i ruoli di business. Possono essere interpretate in sequenza oppure delegate con incarichi circoscritti. A00 integra i contributi e aggiorna lo stato; non è co-responsabile generico di tutte le implementazioni.

| Profilo | Competenza / confine |
|---|---|
| A01 — Intervistatore operativo | Raccogliere decisioni e accessi mancanti tramite il fondatore; nessun contatto esterno autonomo |
| A03 — Copywriter | Testi del modulo e messaggi, senza inventare identità o promesse |
| A04 — UX designer | Percorso, campi, stato attesa/successo/errore e accessibilità del modulo |
| A05-ARCH — Architetto | Scelta minima di ricevitore/registro/servizi e contratto dati |
| A05-BE — Sviluppatore backend | Validazione, persistenza, deduplica e stato notifiche |
| A05-FE — Sviluppatore frontend | Collegamento della landing al ricevitore, nessuna credenziale nel browser |
| A05-INT — Specialista integrazioni | Email e bot Telegram; nessuna gestione campagne |
| A05-OPS — Responsabile configurazione | Accessi, segreti, ambienti e configurazione operativa |
| A07 — QA e revisore | Verifiche indipendenti e difetti decisivi; non attestazione legale |
| A00 — Orchestratore | Integrazione finale, documentazione e passaggio di stato |

## Backlog atomico
| ID | Task | Unico responsabile | Dipende da | Criterio di completamento | Stato iniziale |
|---|---|---|---|---|---|
| C01 | Definire destinatario e gestione delle richieste | A01 — Intervistatore operativo | — | Identità del soggetto che ricontatta, email destinataria, disponibilità, referente Telegram e chi accede al registro espliciti; assenze registrate, niente credenziali in note | Da raccogliere |
| C02 | Definire il modulo facoltativo dopo il risultato | A04 — UX designer | — | Campi minimi, recapito/canale preferito e fascia oraria; layout e stati attesa/errore/successo; nessun obbligo per vedere la checklist | Pronto da progettare |
| C03 | Scrivere testo della richiesta e conferme | A03 — Copywriter | C02 | Bozze con destinatario ancora parametrico se C01 manca; scopo esplicito, nessuna iscrizione marketing implicita; informativa reale da collegare prima dell’uso | Da preparare |
| C04 | Scegliere ricevitore e registro minimi | A05-ARCH — Architetto | — | Una scelta motivata con costi da verificare, accessi, esportazione e limiti; un servizio gestito se adeguato, nessun backend su misura per principio | Pronto da progettare |
| C05 | Specificare contratto della sola richiesta finale | A05-ARCH — Architetto | C02,C04 | ID richiesta, idempotenza, campi/categorie, fonte/variante B, richiesta esplicita e versione testo/informativa, ora ricezione, risposta e errori; nessun invio progressivo delle risposte non richiesto | Da fare |
| C06 | Configurare ambiente di prova e segreti | A05-OPS — Responsabile configurazione | C04 | Variabili documentate senza valori, credenziali fuori Git/frontend/log, accessi minimi al registro; servizi sostituibili con stub locali finché mancano account | Da fare |
| C07 | Salvare e validare la richiesta | A05-BE — Sviluppatore backend | C05,C06 | Dati invalidi rifiutati; richiesta valida salvata durevolmente prima della conferma; retry stesso ID non crea nuovo lead; accesso pubblico al registro impedito; limiti input/richieste | Da fare |
| C08 | Collegare il form della landing B | A05-FE — Sviluppatore frontend | C03,C05 | Prova con ricevitore simulato: recapito coerente col canale scelto, richiesta esplicita, timeout/errore comprensibili, retry conserva ID, nessun falso successo; niente segreti o salvataggio locale di recapiti | Da fare |
| C09 | Preparare email operativa | A05-INT — Specialista integrazioni | C01,C07 | Template con ID e riepilogo minimo utile, destinatario configurabile; invio prima provato su stub, nessun dato personale superfluo nell’oggetto | Da fare |
| C10 | Preparare bot e notifica Telegram | A05-INT — Specialista integrazioni | C01,C06,C07 | Bot e chat autorizzata configurabili, segreti lato servizio; modello notifica con ID e contesto minimo, nessun recapito nel primo avviso; test su stub prima dell’invio esterno | Da fare |
| C11 | Gestire notifiche fallite e ritentativi | A05-BE — Sviluppatore backend | C07,C09,C10 | Stato invio separato dalla richiesta; errore email/Telegram non perde il lead; retry riprende le notifiche senza duplicare la richiesta; tentativi/esito consultabili senza esporre dati sensibili | Da fare |
| C12 | Verificare accesso, conservazione ed export | A05-OPS — Responsabile configurazione | C07 | Solo utenti previsti accedono; procedura di esportazione/cancellazione e durata concordata da definire prima della raccolta; backup protetto verificato senza copie nel repo | Da fare |
| C13 | Eseguire test completo con dati fittizi | A07 — QA e revisore | C07,C08,C09,C10,C11,C12 | Percorso valido, doppio clic, retry, timeout, input abusivi, errore notifica, registro non pubblico e mobile; esito e difetti registrati. Nessun invio reale implicito | Da fare |
| C14 | Consegnare pacchetto pronto per l’attivazione | A00 — Orchestratore | C13 | Documenti di setup, esiti test, destinatari da confermare, questioni dati/informativa aperte e prossima azione; nessun segreto nel commit, nessuna dichiarazione live senza prova | Da fare |

## Ordine di lavoro
Prima ondata indipendente: C02 e C04; A01 raccoglie C01 senza bloccare il prototipo locale. Poi C03/C05; C06 prepara l’ambiente mentre il frontend può lavorare con uno stub. Persistenza C07 prima degli invii; email C09 prima di aggiungere Telegram C10 se serve concentrare il lavoro. QA C13 prima della consegna C14.

## Regole tecniche del primo incremento
- Una richiesta finale volontaria: il modello di invio progressivo precedente non è un requisito di questo flusso.
- Il registro è la fonte autorevole. Email e Telegram sono notifiche, non l’unica copia del lead.
- Conferma al visitatore dopo salvataggio durevole. Non dichiarare “email consegnata” o “agente avvisato” se è soltanto registrata la richiesta.
- Richiesta esplicita non equivale a mandato o disponibilità verificata. Nessuna qualifica inventata dai soli clic.
- Telegram è facoltativo per l’agente; il proprietario lascia il canale di ricontatto che sceglie.
- In questa fase la notifica Telegram contiene ID richiesta e contesto minimo. Un futuro collegamento al dettaglio deve richiedere autenticazione, mai un URL pubblico con recapiti.
- Invii di prova esterni, creazione/configurazione account, deploy e raccolta reale sono azioni da rendere concrete e autorizzare separatamente. Test locali e stub possono avanzare prima.
- Accessi, informativa e gestione dei dati devono corrispondere al soggetto e al processo reali; nessun testo generato viene dichiarato parere professionale.

## Fuori dal primo incremento
CRM completo, pulsanti di aggiornamento stato in Telegram, assegnazione multiagente, automazioni di inseguimento, invii marketing e campagne pubblicitarie. Nessun acquisto di un servizio o numero di lead garantito.

## Prossimo incarico lavorabile
C02 ad A04: disegnare il blocco facoltativo di richiesta dopo il risultato, inclusi gli stati di errore e conferma. C04 ad A05-ARCH può essere preparato indipendentemente. Questo documento assegna i responsabili, non avvia agenti separati.

# Scoutly · flusso operativo

| Agente | Ingresso | Risultato |
| --- | --- | --- |
| Scout | Testi acquisiti con collegamento e fonte | Offerte immobiliari riconoscibili |
| Analista | Testo e badge fonte espliciti | Privato probabile, professionale, ruolo non determinabile |
| Filtro | Offerta, ruolo, URL, testo e contesto | Selezione, revisione o esclusione con motivo |
| Disponibilità | Annuncio, aggiornamenti e risposte datate | Disponibilità dichiarata, data di ingresso, conflitto o verifica mancante |
| Incarico | Dichiarazioni e possibili annunci collegati | Presenza/assenza dichiarata di agenzia o verifica mancante |
| Publisher | Codice testato e richiesta di pubblicazione | Commit verificato in dalet78/scoutly/radar |

I cinque agenti dell'app sono moduli a regole spiegabili, eseguiti nel browser. La raccolta online è assistita dagli agenti della chat. Non esiste un crawler periodico attivo. Un fallimento di accesso a una pagina non significa che l'annuncio sia venduto o affittato. Un risultato indicizzato non prova disponibilità attuale. Il Publisher non è eseguito dal pulsante di analisi: pubblica dalla chat autorizzata.

Le prove devono riguardare lo stesso immobile e avere un ruolo del dichiarante controllato dall'operatore. Una domanda, una nota di ricerca o un commento di terzi non conferma una disponibilità o un incarico. Le verifiche restano dichiarazioni; non costituiscono verifiche documentali della proprietà o dell'esclusiva.

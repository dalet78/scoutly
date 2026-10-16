# Fonti e fattibilità — ricerca preliminare
Verifica: 16 ottobre 2026. Nessun accesso API ottenuto, richiesta commerciale inviata o test di raccolta eseguito.

| Fonte | Evidenza ufficiale | Conseguenza per Scoutly |
|---|---|---|
| idealista | Search API con richiesta accesso descrivendo il progetto | Candidato; verificare copertura privati italiani, freschezza, campi, recapiti, uso commerciale e distribuzione multiagente |
| Immobiliare.it Insights | API per ricerca/consultazione annunci e altri dati immobiliari | Candidato commerciale; non provati dataset privati, recapiti e licenza per il nostro caso |
| Subito | Condizioni limitano scraping e sollecitazioni non richieste; ricerche salvate disponibili | Non assumere connettore automatico o contatto promozionale consentiti; eventuale accordo specifico |
| Gruppi Facebook | Rimozione Groups API documentata nel changelog Meta v19; raccolta automatica soggetta a termini Meta | Nessun percorso API generale verificato per i gruppi; elenco gruppi e accessi ancora mancanti |

La pagina Insights menziona “contatti degli annunci”: non possiamo dedurne automaticamente disponibilità dei recapiti personali dei proprietari o autorizzazione al loro utilizzo per acquisire mandati. I feed per caricare i propri annunci su un portale sono diversi dalle API per leggere annunci di terzi.

## Due verifiche indipendenti
1. Diritto di accedere, conservare, elaborare e distribuire i dati.
2. Modalità ammissibili per contattare il proprietario per proporre il servizio dell'agente.

Un link pubblico, un alert o l'approvazione di un messaggio da parte dell'agente non risolvono automaticamente questi punti. Il manuale è utile per studiare il processo dell'agente; non va presentato come autorizzazione al riuso commerciale. Per WhatsApp non assumere invio a freddo da numero pubblicato: le istruzioni ufficiali business richiedono opt-in e rispetto delle opposizioni; verificare il caso e il prodotto effettivi prima della fase B.

## Domande per i fornitori — bozze, non inviate
- È consentito individuare annunci di privati italiani per un servizio di acquisizione mandati destinato a più agenti?
- Quali campi identificano privato/professionista, data pubblicazione, modifiche, rimozioni e recapiti?
- Quali copertura, frequenza, latenza e limiti? Dati campione disponibili?
- Quali vincoli su conservazione, caching, elaborazione AI e redistribuzione?
- Quali canoni, costi di utilizzo e durata contrattuale?
- L'accesso ai dati include qualche facoltà di contatto o questa resta separata?

## Fonti ufficiali
- [idealista Search API](https://developers.idealista.com/access-request?action=main)
- [Immobiliare.it Insights API](https://www.immobiliare.it/insights/dati-api/)
- [Documentazione Insights](https://insights.immobiliare.it/webdocs/)
- [Condizioni Immobiliare.it](https://www.immobiliare.it/terms/)
- [Condizioni Subito](https://info.subito.it/policies/condizioni-generali.htm), sezioni 4–5
- [Ricerche salvate Subito](https://assistenza.subito.it/hc/it/articles/360002172138-Salvare-una-ricerca)
- [Changelog Graph API v19](https://developers.facebook.com/docs/graph-api/changelog/version19.0/): indicizzazione ufficiale reperita dal ricercatore, apertura diretta non riuscita; da riconfermare nella verifica implementativa.
- [Meta automated data collection](https://developers.facebook.com/documentation/development/terms-and-policies/automated-data-collection)
- [WhatsApp opt-in](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in): risultato ufficiale indicizzato, apertura diretta non riuscita.

Questa è una valutazione di fattibilità preliminare, non un parere legale né una licenza d'uso.

## Verifica mirata A05 — passaggio Codex, 16 ottobre 2026
Riaperti [idealista Search API](https://developers.idealista.com/access-request?action=main) e [Insights API](https://www.immobiliare.it/insights/dati-api/). Evidenza attuale: idealista invita a descrivere il progetto per richiedere una chiave; Insights descrive ricerca/filtro/consultazione annunci e dati tramite endpoint. Non dimostrano accesso già concesso, copertura privati italiani, disponibilità dei recapiti o licenza per acquisizione mandati e redistribuzione multiagente. Nessun form inviato, credenziale ottenuta o test API eseguito. Subito/Facebook/WhatsApp non riverificati in questo passaggio; restano da controllare prima dell’uso.

### Bozza descrizione ai fornitori — non inviata
Scoutly valuta un servizio per agenti immobiliari: selezione di annunci residenziali di privati nel Comune di Milano, vendita e affitto, con feedback dell’agente. Vorremmo verificare se il vostro accesso e la licenza consentono questo caso, l’elaborazione per terzi e un’eventuale futura distribuzione a più agenti. Servono campi e campioni documentati, limiti di conservazione/AI/redistribuzione, freschezza e preventivo. L’eventuale contatto del proprietario è una verifica distinta: quali diritti o vincoli sono espressamente previsti? I quesiti dettagliati restano quelli sopra elencati. Nessun uso consentito è presunto dalla sola risposta commerciale generica.

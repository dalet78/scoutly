# Scheda feedback annunci e dati minimi
Versione 0.1 — 16 ottobre 2026. A04/A05; revisione A07 in sequenza. Modello vuoto, non registro di annunci raccolti.
Input: [03_Pilot_e_MVP](03_Pilot_e_MVP.md), [05_Architettura_e_stime](05_Architettura_e_stime.md), [11_Piano_esperimenti](11_Piano_esperimenti.md).
Completamento: ogni valutazione collegabile a fonte, tempi, decisione e motivazione; nessun dato simulato conteggiato come osservazione.

## Scheda per annuncio
| Campo | Valore da compilare / regola |
|---|---|
| ID scheda / coorte / agente | Identificativi interni, nessun nome necessario nel vault |
| Fonte / URL / ID fonte | Obbligatori se disponibili; esplicitare ID mancante |
| Prima osservazione | Data e ora con fuso; distinta da pubblicazione |
| Pubblicazione / aggiornamento | Timestamp fonte oppure sconosciuto; mai ricostruito come certo |
| Localizzazione / certezza | Comune/zona; dichiarata, inferita o verificata; hinterland escluso |
| Operazione / tipologia | Vendita o affitto; residenziale; ignoto da approfondire |
| Prezzo | Valore e unità (totale o mensile), oppure mancante |
| Privato / proprietà | Privato dichiarato/inferito/da verificare; non equivale a proprietà verificata |
| Motivazione del filtro | Regola e dati che sostengono la selezione; incertezze esplicite |
| Duplicato / già noto | ID collegati e certezza; non fondere automaticamente immobili simili |
| Feedback agente | Utile / da approfondire / da scartare |
| Motivo feedback | Zona, operazione, tipologia, non privato, duplicato, già noto, indisponibile, altro con testo |
| Avrebbe contattato | Sì/no/non sa e motivo; intenzione, non contatto effettuato |
| Tempo | Minuti raccolta, revisione operatore e valutazione agente separati |
| Esito / autore / data | Decisione, chi valuta e quando |

## Entità e stati minimi — A05
Annuncio (ID, fonte, URL, versione, timestamp) → immobile candidato (ID separato, collegamenti e incertezze) → valutazione (agente, coorte, esito, motivo, tempi). Per fasi successive: interlocutore, disponibilità al ricontatto, canale d’origine e stati del funnel con data. Ogni transizione conserva fonte del dato e operatore; “sconosciuto” non equivale a “no”.

Deduplica: stesso ID/URL come regola certa dell’annuncio; somiglianze come candidati da revisione. Distinguere duplicato di annuncio, di immobile e di contatto verso lo stesso agente. Nessun punteggio AI prova disponibilità o proprietà. Conservare versione delle regole del filtro per confrontare coorti.

## Gestione operativa
Il vault contiene note di progetto e modelli vuoti; recapiti e dati operativi dei proprietari vanno in un archivio dedicato con accessi, conservazione e modalità definite prima della raccolta. Registrare prova della richiesta di ricontatto in quel sistema, non incollare conversazioni personali nelle note. Per il primo feedback preferire identificativi e dati minimi utilizzabili.

## Riesame degli scarti — A07
Conservare ID e ragione degli scarti nel sistema operativo; estrarre un campione con regola predeterminata e farlo valutare senza presentarlo come già inutile. Misurare utili trovati nel campione; senza campionamento adeguato non stimare il richiamo complessivo né la copertura del mercato.

# Scoutly — landing autonome per acquisizione contatti

## Regola di prodotto

Ogni pagina è una landing indipendente, dedicata a una sola domanda. Nessun menu, collegamento ad altre landing, pulsante catalogo o ritorno alla homepage. La homepage pubblica presenta soltanto il marchio. L’indice locale di revisione è esterno alla cartella Website e non viene pubblicato.

Obiettivo: acquisire il contatto offrendo un primo orientamento breve e generale, non una consulenza completa o una stima di mercato inventata.

Tutte le 22 landing seguono tre passaggi:
1. Nome e almeno un recapito valido, email o telefono.
2. Prima parte delle poche domande sul caso.
3. Seconda parte e indicazioni introduttive.

I moduli hanno titoli specifici per il beneficio della pagina. Evitare formule come “Cominciamo da te”, “Come possiamo ricontattarti?” e spiegazioni tecniche del percorso. Le domande del caso sono 4–6, senza obbligare il visitatore a cercare perizie o confronti di mercato.

## Grafica

23 illustrazioni originali: una per landing e una per la homepage. Sfondo fisso su desktop, versione attenuata e riquadro illustrato su mobile. Pannelli del modulo opachi, pulsante che porta direttamente al form, nessuna parallasse. Asset locali WebP e miniature leggere per la revisione locale. Direzione creativa e prompt in DESIGN.md.

## File

- `tools/`: le 22 landing, accessibili dai rispettivi URL diretti.
- `assets/catalog.js`: titoli, offerte, domande, testi introduttivi e risposte.
- `assets/orientation.js`: brevi orientamenti e pochi conti parziali basati sugli importi facoltativi inseriti.
- `assets/tool.js`: contatto, passaggi, validazione, invio progressivo e download delle indicazioni.
- `assets/lead-config.js`: configurazione pubblica del destinatario e dell’informativa.
- `assets/editorial.css`: sfondi e presentazione responsive.
- `assets/scenes/`: immagini dedicate.

Sito statico senza librerie esterne. Per la prova locale aprire il file HTML; per la pubblicazione utilizzare un hosting statico. Non pubblicare le note private di Obsidian.

## Limiti dichiarati

Non sono collegate API di quotazioni, canoni, tempi o richieste di acquirenti. Le pagine non inventano prezzi, giorni di vendita o conteggi di persone. Le poche differenze numeriche sono esplicitamente parziali e non aggiungono importi non forniti dall’utente. Nessuna aliquota, esenzione o rendimento garantito viene calcolato.

## Ricezione contatti

Configurazione attuale: ANTEPRIMA senza invio. Mancano ancora destinatario effettivo, URL informativa e titolare. Nessun dato viene salvato nel browser o trasmesso; usare dati di esempio.

Quando configurato, il destinatario riceve il contatto già al primo Continua. I passaggi seguenti aggiornano la stessa richiesta; il modulo avanza solo dopo conferma. Gli errori non vengono mostrati come successo. Contratto e attività da completare: LEAD-INTEGRATION.md.

## Verifica

Test dei 22 percorsi, campi contatto, due passaggi del caso, Indietro e reset, esportazione, importi facoltativi e testi. Controllo delle scene locali e dell’assenza di collegamenti fra landing. Invio progressivo e ritentativo testati con un ricevitore simulato, senza trasmettere contatti reali.

Repository: https://github.com/dalet78/scoutly. Il caricamento nel repository non implica l’attivazione di GitHub Pages.

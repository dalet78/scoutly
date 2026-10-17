# Selezione multipla foto

17 ottobre 2026. Un solo selettore permette di scegliere più JPG/PNG insieme; successive selezioni aggiungono foto alla lista, evitando lo stesso file (nome/dimensioni/data modifica). Anteprime e rimozione individuale. Limiti invariati: sei foto, 8 MB aggregati. Se il nuovo lotto supera i limiti o include file non validi, resta la selezione valida precedente e compare un errore.

Per compatibilità con il formato documentato di FormSubmit, JavaScript prepara un campo file distinto per ciascuna immagine selezionata; il selettore visibile non invia una seconda copia. Stesso POST multipart nativo, destinatario e ritorno. Il browser deve supportare DataTransfer/FileList, altrimenti mostrare errore senza fingere un invio. Nessun caricamento esterno finché l’utente invia.

Test logica file passati. Verifica browser di selezione, rimozione e campi allegati da completare dopo pubblicazione; nessuna ulteriore email di prova necessaria per il controllo frontend.


Verifica browser completata: selezionate due immagini sintetiche in un'unica apertura; due anteprime e due campi allegato, selettore senza nome per evitare doppioni; rimozione individuale riduce gli allegati a uno e poi a zero. CI e Pages riusciti. Nessun invio email aggiuntivo; consegna effettiva di più allegati in casella non ritestata.

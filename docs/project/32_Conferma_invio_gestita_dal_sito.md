# Conferma invio gestita da Scoutly

17 ottobre 2026. Segnalazione del fondatore: rimane la pagina standard FormSubmit anche dopo l'aggiunta di _next. Riprodotto con nuovo invio tecnico dalla pagina aggiornata; la sola presenza della configurazione e il test del link non erano verifica end-to-end sufficiente.

Il nuovo script intercetta l'invio e usa il percorso AJAX FormSubmit, mantenendo multipart e foto selezionate. Passa alla pagina richiesta-inviata.html soltanto dopo risposta HTTP valida e success=true. Nessuna disattivazione esplicita dell'antispam del provider. Errori, risposta HTML/inattesa o timeout conservano il modulo e mostrano invio da verificare, senza retry automatico e senza fingere conferma. Le foto restano nel browser in caso di errore.

Test locali: 7 passati tra limiti foto e invio; verifica HTTP fallito, JSON negativo/mancante, rete fallita senza retry e body multipart invariato. Prova live completa con foto da eseguire dopo deploy. Dati di prova marcati TEST TECNICO SCOUTLY esclusi dall'agente.

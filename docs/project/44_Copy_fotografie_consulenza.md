# Chiarezza della richiesta fotografie

1 novembre 2026. Revisione testi, UX, implementazione e verifica svolte in sequenza.

Il link con argomento=fotografie-professionali preselezionava il campo ma lasciava titolo e presentazione generici. Ora mostra una descrizione dedicata alle fotografie dell’appartamento, al professionista esterno e al primo contatto gratuito con il consulente. Prezzo e condizioni del servizio fotografico restano separati dal confronto gratuito. Il passaggio dei dati avviene solo dopo autorizzazione specifica successiva. Nessun caricamento richiesto.

La presentazione segue anche i cambi di argomento e ripristina i testi generali negli altri casi. Invariati payload, salvataggio, consensi e invii operativi.

Verifica: node --test tests/consultation.test.mjs — 10/10 passati, trasporto simulato. Nessun invio reale. Browser di produzione letto prima della modifica: confermata la discrepanza fra argomento preselezionato e introduzione generica. Rilascio su main bloccato dalla verifica automatica in attesa di autorizzazione esplicita alla pubblicazione. Pagina online invariata.

Prossimo passo: autorizzazione alla pubblicazione, poi verifica del nuovo testo sul dominio pubblico.

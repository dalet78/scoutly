# Origine coerente per FormSubmit

17 ottobre 2026. Attivazione specifica del percorso del modulo confermata dal fondatore. La richiesta browser cross-origin usava il solo dominio come Referer, richiedendo una distinta attivazione sulla radice; il test HTTP con Referer completo risultava invece ricevuto. L’invio ora specifica un referrer fisso e pubblico corrispondente al modulo attivato, senza query o dati del proprietario. Endpoint, destinatario e payload non cambiano. Verifica browser completa successiva da registrare.

-- Eseguire una sola volta nel SQL Editor dello stesso progetto di test.
-- Nessun record viene eliminato e RLS, bucket e permessi restano invariati.
begin;
alter table public.scoutly_requests
  drop constraint scoutly_requests_form_id_check,
  drop constraint scoutly_requests_form_version_check,
  drop constraint scoutly_requests_workflow_id_check;
alter table public.scoutly_requests add constraint scoutly_requests_form_route_check check (
  (form_id = 'prima-di-pubblicare' and form_version = 2
    and workflow_id = 'annuncio-da-foto-e-descrizione')
  or
  (form_id = 'ristrutturare-o-vendere' and form_version = 1
    and workflow_id = 'confronto-ristrutturare-o-vendere')
);
commit;

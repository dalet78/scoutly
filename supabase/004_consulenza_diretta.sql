-- Dopo la migrazione 002_secondo_form.sql. Non richiede 003_dieci_immagini.sql.
-- Mantiene richieste, foto, bucket, RLS e permessi.
begin;
alter table public.scoutly_requests drop constraint scoutly_requests_form_route_check;
alter table public.scoutly_requests add constraint scoutly_requests_form_route_check check (
 (form_id='prima-di-pubblicare' and form_version=2 and workflow_id='annuncio-da-foto-e-descrizione')
 or (form_id='ristrutturare-o-vendere' and form_version=1 and workflow_id='confronto-ristrutturare-o-vendere')
 or (form_id='consulenza' and form_version=1 and workflow_id='richiesta-consulenza-diretta')
);
alter table public.scoutly_requests drop constraint scoutly_requests_description_check;
alter table public.scoutly_requests add constraint scoutly_requests_description_check check (
 (form_id='consulenza' and length(description) between 0 and 1000)
 or (form_id<>'consulenza' and length(description) between 20 and 4000)
);
alter table public.scoutly_requests add constraint scoutly_requests_consultation_check check (
 form_id<>'consulenza' or (consultation_requested and name is not null and length(trim(name))>0)
);
commit;

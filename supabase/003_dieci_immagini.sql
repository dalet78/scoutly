-- Eseguire prima del deploy backend. Mantiene dati, RLS e bucket invariati.
begin;
alter table public.scoutly_photos drop constraint scoutly_photos_position_check;
alter table public.scoutly_photos add constraint scoutly_photos_position_check check (position between 1 and 10);
commit;

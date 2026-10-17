-- Scoutly: eseguire nel SQL Editor del progetto di test Supabase.
-- Nessun dato dimostrativo o recapito viene inserito.
begin;

create table public.scoutly_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_id text not null check (form_id = 'prima-di-pubblicare'),
  form_version integer not null check (form_version = 2),
  workflow_id text not null check (workflow_id = 'annuncio-da-foto-e-descrizione'),
  idempotency_key uuid not null unique,
  payload_hash text not null,
  email text not null check (length(email) between 3 and 254),
  phone text check (length(phone) <= 30),
  name text check (length(name) <= 80),
  description text not null check (length(description) between 20 and 4000),
  answers jsonb not null default '{}'::jsonb,
  service_requested boolean not null check (service_requested),
  consultation_requested boolean not null default false,
  status text not null default 'uploading'
    check (status in ('uploading', 'received', 'processing', 'review', 'completed', 'failed'))
);

create table public.scoutly_photos (
  request_id uuid not null references public.scoutly_requests(id) on delete cascade,
  position integer not null check (position between 1 and 8),
  object_path text not null unique,
  content_type text not null check (content_type in ('image/jpeg', 'image/png')),
  size_bytes integer not null check (size_bytes between 1 and 8000000),
  primary key (request_id, position)
);

alter table public.scoutly_requests enable row level security;
alter table public.scoutly_photos enable row level security;
revoke all on public.scoutly_requests, public.scoutly_photos from public, anon, authenticated;
grant select, insert, update, delete on public.scoutly_requests, public.scoutly_photos to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('scoutly-photos', 'scoutly-photos', false, 8000000, array['image/jpeg','image/png']);
-- Nessuna policy di accesso browser: caricamenti e lettura solo dal backend.
commit;

-- Risultato atteso: entrambe le tabelle hanno rls_attivo=true;
-- bucket scoutly-photos ha public=false.
select relname as tabella, relrowsecurity as rls_attivo
from pg_class
where oid in ('public.scoutly_requests'::regclass, 'public.scoutly_photos'::regclass);
select id, public, file_size_limit from storage.buckets where id='scoutly-photos';

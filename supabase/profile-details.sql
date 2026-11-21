alter table public.child_profiles
  add column if not exists date_of_birth date,
  add column if not exists gender text,
  add column if not exists diagnosis text,
  add column if not exists diagnosis_date date,
  add column if not exists diagnosed_by text,
  add column if not exists medical_conditions text,
  add column if not exists allergies text,
  add column if not exists medications text,
  add column if not exists calming_strategies text,
  add column if not exists strengths_interests text,
  add column if not exists care_team text,
  add column if not exists report_summary text;

create table if not exists public.child_documents (
  id text primary key default 'doc-' || gen_random_uuid()::text,
  user_id text not null,
  child_id text not null references public.child_profiles(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  file_size bigint not null check (file_size > 0),
  category text not null default 'medical_report',
  created_at timestamptz not null default now()
);

alter table public.child_documents enable row level security;

drop policy if exists "child documents owner access" on public.child_documents;
create policy "child documents owner access"
on public.child_documents for all
to authenticated
using (user_id = auth.uid()::text)
with check (
  user_id = auth.uid()::text
  and exists (
    select 1 from public.child_profiles
    where child_profiles.id = child_documents.child_id
      and child_profiles.user_id = auth.uid()::text
  )
);

grant all privileges on public.child_documents to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'child-reports',
  'child-reports',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "service role manages child reports" on storage.objects;
create policy "service role manages child reports"
on storage.objects for all
to service_role
using (bucket_id = 'child-reports')
with check (bucket_id = 'child-reports');

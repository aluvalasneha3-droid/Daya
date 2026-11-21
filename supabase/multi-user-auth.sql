-- Run once after auth is enabled in Supabase.

alter table public.daily_checkins
  add column if not exists energy_level smallint check (energy_level between 1 and 5),
  add column if not exists hyperactivity smallint check (hyperactivity between 1 and 5),
  add column if not exists social_interaction smallint check (social_interaction between 1 and 5),
  add column if not exists repetitive_behaviors smallint check (repetitive_behaviors between 1 and 5),
  add column if not exists activities text,
  add column if not exists parent_stress smallint check (parent_stress between 1 and 5),
  add column if not exists parent_notes text;

create or replace function public.handle_new_daya_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.child_profiles (
    id,
    user_id,
    name,
    sensitivities,
    triggers,
    routines
  )
  values (
    'child-' || replace(new.id::text, '-', ''),
    new.id::text,
    'My child',
    '{}',
    '{}',
    '{}'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_daya_user();

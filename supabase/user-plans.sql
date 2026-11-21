create table if not exists public.user_daily_plans (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  child_id text not null references public.child_profiles(id) on delete cascade,
  plan_date date not null,
  sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, child_id, plan_date)
);

alter table public.user_daily_plans enable row level security;

drop policy if exists "users manage their daily plans" on public.user_daily_plans;
create policy "users manage their daily plans"
on public.user_daily_plans for all
to authenticated
using (user_id = auth.uid()::text)
with check (
  user_id = auth.uid()::text
  and exists (
    select 1 from public.child_profiles
    where child_profiles.id = user_daily_plans.child_id
      and child_profiles.user_id = auth.uid()::text
  )
);

grant all privileges on public.user_daily_plans to service_role;

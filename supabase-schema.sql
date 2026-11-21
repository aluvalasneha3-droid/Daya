-- DAYA: Supabase Schema
-- Run this in the Supabase SQL Editor to set up all tables

-- Enable pgvector extension for support snippet embeddings
create extension if not exists vector;

-- ============================================
-- CHILD PROFILES
-- ============================================
create table if not exists child_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  age integer,
  sensitivities text[] default '{}',
  triggers text[] default '{}',
  routines text[] default '{}',
  communication_style text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table child_profiles enable row level security;
create policy "Users manage own children" on child_profiles
  for all using (auth.uid() = user_id);

-- ============================================
-- DAILY CHECK-INS
-- ============================================
create table if not exists daily_checkins (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  date date not null default current_date,
  sleep_quality smallint check (sleep_quality between 1 and 5),
  sleep_hours numeric(3,1),
  meal_quality smallint check (meal_quality between 1 and 5),
  mood text check (mood in ('great', 'good', 'okay', 'difficult', 'very_difficult')),
  meltdowns integer default 0,
  meltdown_triggers text,
  communication_level smallint check (communication_level between 1 and 5),
  routine_adherence smallint check (routine_adherence between 1 and 5),
  sensory_load smallint check (sensory_load between 1 and 5),
  sensory_issues text,
  difficult_period text check (difficult_period in ('morning', 'afternoon', 'evening', 'night', 'none')),
  notes text,
  created_at timestamptz default now(),
  unique(child_id, date)
);

alter table daily_checkins enable row level security;
create policy "Users manage own checkins" on daily_checkins
  for all using (auth.uid() = user_id);

create index idx_checkins_child_date on daily_checkins(child_id, date desc);

-- ============================================
-- CONVERSATIONS
-- ============================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  child_id uuid references child_profiles(id) on delete cascade,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table conversations enable row level security;
create policy "Users manage own conversations" on conversations
  for all using (auth.uid() = user_id);

-- ============================================
-- MESSAGES
-- ============================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "Users manage own messages" on messages
  for all using (
    conversation_id in (
      select id from conversations where user_id = auth.uid()
    )
  );

create index idx_messages_conversation on messages(conversation_id, created_at);

-- ============================================
-- CONVERSATION MEMORIES
-- ============================================
create table if not exists conversation_memories (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  summary text not null,
  key_topics text[] default '{}',
  emotional_context text,
  created_at timestamptz default now()
);

alter table conversation_memories enable row level security;
create policy "Users manage own memories" on conversation_memories
  for all using (auth.uid() = user_id);

create index idx_memories_child on conversation_memories(child_id, created_at desc);

-- ============================================
-- BEHAVIORAL INSIGHTS
-- ============================================
create table if not exists behavioral_insights (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references child_profiles(id) on delete cascade,
  source_check_in_ids uuid[] default '{}',
  insight_type text check (insight_type in ('correlation', 'trend', 'pattern', 'observation')),
  title text not null,
  description text not null,
  confidence numeric(3,2) check (confidence between 0 and 1),
  data_points integer default 0,
  support_tags text[] default '{}',
  created_at timestamptz default now()
);

alter table behavioral_insights enable row level security;
create policy "Users view own insights" on behavioral_insights
  for select using (
    child_id in (
      select id from child_profiles where user_id = auth.uid()
    )
  );

-- ============================================
-- SUPPORT SNIPPETS (with vector embeddings)
-- ============================================
create table if not exists support_snippets (
  id uuid primary key default gen_random_uuid(),
  category text check (category in ('calming', 'sensory', 'communication', 'routine', 'emotional')),
  title text not null,
  content text not null,
  tags text[] default '{}',
  embedding vector(1536),
  created_at timestamptz default now()
);

create index idx_snippets_embedding on support_snippets
  using ivfflat (embedding vector_cosine_ops) with (lists = 10);

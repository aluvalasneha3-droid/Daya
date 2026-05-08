-- DAYA hackathon MVP schema
-- Run in Supabase SQL editor or through the Supabase CLI.

create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists public.child_profiles (
  id text primary key default 'child-' || gen_random_uuid()::text,
  user_id text not null,
  name text not null,
  age integer,
  sensitivities text[] not null default '{}',
  triggers text[] not null default '{}',
  routines text[] not null default '{}',
  communication_style text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_checkins (
  id text primary key default 'checkin-' || gen_random_uuid()::text,
  child_id text not null references public.child_profiles(id) on delete cascade,
  user_id text not null,
  date date not null,
  sleep_quality smallint not null check (sleep_quality between 1 and 5),
  sleep_hours numeric(4, 2),
  meal_quality smallint not null check (meal_quality between 1 and 5),
  mood text not null check (mood in ('great', 'good', 'okay', 'difficult', 'very_difficult')),
  meltdowns integer not null default 0 check (meltdowns >= 0),
  meltdown_triggers text,
  communication_level smallint not null check (communication_level between 1 and 5),
  routine_adherence smallint not null check (routine_adherence between 1 and 5),
  sensory_load smallint check (sensory_load between 1 and 5),
  sensory_issues text,
  difficult_period text not null default 'none' check (difficult_period in ('morning', 'afternoon', 'evening', 'night', 'none')),
  notes text,
  created_at timestamptz not null default now(),
  unique (child_id, date)
);

create table if not exists public.conversations (
  id text primary key default 'conv-' || gen_random_uuid()::text,
  user_id text not null,
  child_id text not null references public.child_profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key default 'msg-' || gen_random_uuid()::text,
  conversation_id text not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  client_message_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (conversation_id, client_message_id)
);

create table if not exists public.conversation_memories (
  id text primary key default 'mem-' || gen_random_uuid()::text,
  child_id text not null references public.child_profiles(id) on delete cascade,
  user_id text not null,
  summary text not null,
  key_topics text[] not null default '{}',
  emotional_context text,
  created_at timestamptz not null default now()
);

create table if not exists public.behavioral_insights (
  id text primary key default 'insight-' || gen_random_uuid()::text,
  child_id text not null references public.child_profiles(id) on delete cascade,
  insight_type text not null check (insight_type in ('correlation', 'trend', 'pattern', 'observation')),
  title text not null,
  description text not null,
  confidence numeric(4, 3) not null check (confidence between 0 and 1),
  data_points integer not null default 0,
  source_check_in_ids text[] not null default '{}',
  support_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.support_snippets (
  id text primary key,
  text text not null,
  category text not null check (category in (
    'sensory_support',
    'communication',
    'routine',
    'transitions',
    'sleep',
    'food_and_eating',
    'calming_activity',
    'meltdown_recovery',
    'parent_self_care'
  )),
  triggers text[] not null default '{}',
  intent text not null check (intent in (
    'parent_tip',
    'calming_activity',
    'sensory_support',
    'communication_idea'
  )),
  source_label text not null,
  tone_reviewed boolean not null default false,
  title text,
  content text generated always as ("text") stored,
  tags text[] generated always as (triggers) stored,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists child_profiles_user_idx on public.child_profiles(user_id);
create index if not exists daily_checkins_child_date_idx on public.daily_checkins(child_id, date desc);
create index if not exists conversations_child_updated_idx on public.conversations(child_id, updated_at desc);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at asc);
create index if not exists memories_child_created_idx on public.conversation_memories(child_id, created_at desc);
create index if not exists insights_child_created_idx on public.behavioral_insights(child_id, created_at desc);
create index if not exists support_snippets_tags_idx on public.support_snippets using gin(tags);
create index if not exists support_snippets_embedding_idx
  on public.support_snippets using ivfflat (embedding vector_cosine_ops)
  with (lists = 100)
  where embedding is not null;

create or replace function public.match_support_snippets(
  query_embedding vector(1536),
  match_count int default 4,
  match_threshold float default 0.72
)
returns table (
  id text,
  category text,
  title text,
  text text,
  content text,
  triggers text[],
  intent text,
  source_label text,
  tone_reviewed boolean,
  tags text[],
  similarity float
)
language sql
stable
as $$
  select
    support_snippets.id,
    support_snippets.category,
    support_snippets.title,
    support_snippets.text,
    support_snippets.content,
    support_snippets.triggers,
    support_snippets.intent,
    support_snippets.source_label,
    support_snippets.tone_reviewed,
    support_snippets.tags,
    1 - (support_snippets.embedding <=> query_embedding) as similarity
  from public.support_snippets
  where support_snippets.embedding is not null
    and support_snippets.tone_reviewed = true
    and 1 - (support_snippets.embedding <=> query_embedding) > match_threshold
  order by support_snippets.embedding <=> query_embedding
  limit match_count;
$$;

alter table public.child_profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.conversation_memories enable row level security;
alter table public.behavioral_insights enable row level security;
alter table public.support_snippets enable row level security;

drop policy if exists "profiles owner access" on public.child_profiles;
create policy "profiles owner access"
on public.child_profiles for all
to authenticated
using (user_id = auth.uid()::text)
with check (user_id = auth.uid()::text);

drop policy if exists "checkins owner access" on public.daily_checkins;
create policy "checkins owner access"
on public.daily_checkins for all
to authenticated
using (user_id = auth.uid()::text)
with check (user_id = auth.uid()::text);

drop policy if exists "conversations owner access" on public.conversations;
create policy "conversations owner access"
on public.conversations for all
to authenticated
using (user_id = auth.uid()::text)
with check (user_id = auth.uid()::text);

drop policy if exists "messages owner access" on public.messages;
create policy "messages owner access"
on public.messages for all
to authenticated
using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()::text
  )
)
with check (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()::text
  )
);

drop policy if exists "memories owner access" on public.conversation_memories;
create policy "memories owner access"
on public.conversation_memories for all
to authenticated
using (user_id = auth.uid()::text)
with check (user_id = auth.uid()::text);

drop policy if exists "insights owner read" on public.behavioral_insights;
create policy "insights owner read"
on public.behavioral_insights for select
to authenticated
using (
  exists (
    select 1 from public.child_profiles
    where child_profiles.id = behavioral_insights.child_id
      and child_profiles.user_id = auth.uid()::text
  )
);

drop policy if exists "support snippets readable" on public.support_snippets;
create policy "support snippets readable"
on public.support_snippets for select
to authenticated
using (true);

insert into public.child_profiles (
  id,
  user_id,
  name,
  age,
  sensitivities,
  triggers,
  routines,
  communication_style,
  notes
)
values (
  'child-001',
  'demo-parent',
  'Aarav',
  6,
  array['loud noises', 'bright fluorescent lights', 'certain food textures'],
  array['sudden routine changes', 'crowded spaces', 'being rushed'],
  array['morning visual schedule', 'quiet time after school', 'bedtime story ritual'],
  'Mostly verbal with some echolalia, uses picture cards for complex needs',
  'Loves dinosaurs and water play. Has a comfort blanket named Blue.'
)
on conflict (id) do update set
  name = excluded.name,
  age = excluded.age,
  sensitivities = excluded.sensitivities,
  triggers = excluded.triggers,
  routines = excluded.routines,
  communication_style = excluded.communication_style,
  notes = excluded.notes,
  updated_at = now();

insert into public.daily_checkins (
  id,
  child_id,
  user_id,
  date,
  sleep_quality,
  sleep_hours,
  meal_quality,
  mood,
  meltdowns,
  meltdown_triggers,
  communication_level,
  routine_adherence,
  sensory_load,
  sensory_issues,
  difficult_period,
  notes
)
values
('ci-1','child-001','demo-parent','2026-04-28',4,9,4,'good',0,null,4,5,2,null,'none','Great day at school. Played with water table for 30 min.'),
('ci-2','child-001','demo-parent','2026-04-29',3,7.5,3,'okay',1,'Unexpected fire drill at school',3,3,4,'Covered ears a lot today','afternoon','Fire drill really threw him off. Took a while to settle after school.'),
('ci-3','child-001','demo-parent','2026-04-30',2,6,2,'difficult',2,'Morning routine was different because of doctor appointment',2,2,4,'Refused to wear new shirt, wanted old comfortable one','evening','Rough day. Doctor appointment disrupted everything. Clingy and tearful at bedtime.'),
('ci-4','child-001','demo-parent','2026-05-01',3,8,3,'okay',1,null,3,4,3,null,'afternoon','Better than yesterday. Back to normal routine helped.'),
('ci-5','child-001','demo-parent','2026-05-02',4,9.5,4,'good',0,null,4,5,2,null,'none','Wonderful day. Used a new word at dinner: delicious.'),
('ci-6','child-001','demo-parent','2026-05-03',5,10,5,'great',0,null,5,5,1,null,'none','Best day in weeks. Played with neighbor for 20 min. Tried cucumber.'),
('ci-7','child-001','demo-parent','2026-05-04',4,9,4,'good',0,null,4,4,2,null,'none','Solid day. Needed a little extra movement in the afternoon.'),
('ci-8','child-001','demo-parent','2026-05-05',2,6.5,3,'difficult',2,'Birthday party with loud music and many kids',2,2,5,'Overwhelmed by noise and crowd at party','evening','Left early. Needed deep pressure and Blue blanket for an hour.')
on conflict (child_id, date) do update set
  sleep_quality = excluded.sleep_quality,
  sleep_hours = excluded.sleep_hours,
  meal_quality = excluded.meal_quality,
  mood = excluded.mood,
  meltdowns = excluded.meltdowns,
  meltdown_triggers = excluded.meltdown_triggers,
  communication_level = excluded.communication_level,
  routine_adherence = excluded.routine_adherence,
  sensory_load = excluded.sensory_load,
  sensory_issues = excluded.sensory_issues,
  difficult_period = excluded.difficult_period,
  notes = excluded.notes;

insert into public.support_snippets (
  id,
  category,
  title,
  text,
  triggers,
  intent,
  source_label,
  tone_reviewed
)
values
('sensory-noise-quiet-transition','sensory_support','Quiet transition after noise','Some families find that a quiet transition after noisy places gives a child more space to settle before the next demand.',array['noise','crowd','overstimulation'],'sensory_support','daya_original_support_seed_v1',true),
('sensory-light-softening','sensory_support','Softer light','When bright light seems to add strain, one gentle environmental change is softer lighting, a cap, or a dimmer room for a short reset.',array['bright_light','overstimulation'],'sensory_support','daya_original_support_seed_v1',true),
('sensory-movement-break','sensory_support','Movement break','A short movement break before a transition may help some children feel more organized in their body before shifting activities.',array['understimulation','transition'],'sensory_support','daya_original_support_seed_v1',true),
('transition-first-then','transitions','First-then cue','A simple first-then cue can make the next step feel more predictable when a child is moving from one activity to another.',array['transition','schedule_change'],'communication_idea','daya_original_support_seed_v1',true),
('transition-warning','transitions','Gentle transition warning','Some children feel steadier when a transition is named before it happens, especially with a visual timer or repeated calm phrase.',array['transition','schedule_change'],'parent_tip','daya_original_support_seed_v1',true),
('routine-anchor','routine','One familiar anchor','On days when the routine has to change, keeping one familiar anchor can make the day feel less unpredictable.',array['schedule_change','new_environment'],'parent_tip','daya_original_support_seed_v1',true),
('sleep-bedtime-sequence','sleep','Bedtime sequence','A steady bedtime order can help the evening feel more predictable, especially after busy or sensory-heavy days.',array['tiredness','overstimulation'],'parent_tip','daya_original_support_seed_v1',true),
('sleep-after-hard-day','sleep','Lower-demand evening','After a hard day, a lower-demand evening with fewer choices may help the nervous system move toward rest.',array['tiredness','overstimulation'],'calming_activity','daya_original_support_seed_v1',true),
('food-hunger-observation','food_and_eating','Hunger as a signal','When mood dips around meals, it may be useful to gently observe timing, texture comfort, and whether hunger is hard to communicate.',array['hunger','unmet_communication_need'],'parent_tip','daya_original_support_seed_v1',true),
('food-texture-choice','food_and_eating','Predictable food choice','Offering one familiar food alongside something newer can keep mealtimes from becoming too demanding.',array['hunger','overstimulation'],'parent_tip','daya_original_support_seed_v1',true),
('communication-processing-time','communication','Processing time','A quiet pause after a question can reduce pressure and give the child more room to process before responding.',array['unmet_communication_need','overstimulation'],'communication_idea','daya_original_support_seed_v1',true),
('communication-visual-choice','communication','Visual choice','Visual choices can help when spoken language feels hard, especially for needs, transitions, or preferred calming options.',array['unmet_communication_need','transition'],'communication_idea','daya_original_support_seed_v1',true),
('calming-deep-pressure','calming_activity','Deep pressure comfort','Some children find steady deep pressure, a weighted blanket, or a familiar comfort item grounding after overwhelm.',array['overstimulation','noise'],'calming_activity','daya_original_support_seed_v1',true),
('calming-water-play','calming_activity','Water reset','A brief water activity, like washing hands slowly or playing with a small bowl of water, can be a gentle sensory reset for some children.',array['overstimulation','understimulation'],'calming_activity','daya_original_support_seed_v1',true),
('meltdown-recovery-low-language','meltdown_recovery','Lower language during recovery','After a meltdown, fewer words and a calmer environment may feel easier than questions or explanations right away.',array['overstimulation','unmet_communication_need'],'parent_tip','daya_original_support_seed_v1',true),
('meltdown-recovery-repair','meltdown_recovery','Repair later','Some families find it gentler to reconnect first and talk about what happened later, once everyone has settled.',array['overstimulation','tiredness'],'parent_tip','daya_original_support_seed_v1',true),
('parent-self-care-hard-day','parent_self_care','Parent pause','A hard day does not erase careful parenting. Even a short pause, water, or one supportive text can help the parent nervous system settle too.',array['overstimulation','tiredness'],'parent_tip','daya_original_support_seed_v1',true),
('parent-self-care-progress','parent_self_care','Progress perspective','Progress is rarely linear, and looking across weeks can reveal small gains that are hard to see inside one difficult day.',array['schedule_change','new_environment'],'parent_tip','daya_original_support_seed_v1',true)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  text = excluded.text,
  triggers = excluded.triggers,
  intent = excluded.intent,
  source_label = excluded.source_label,
  tone_reviewed = excluded.tone_reviewed;

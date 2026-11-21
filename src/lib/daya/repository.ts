import type {
  BehavioralInsight,
  ChildProfile,
  Conversation,
  ConversationMemory,
  DailyCheckIn,
  DayaContext,
  Message,
  SupportSnippet,
} from "@/types";
import { analyzeBehaviorPatterns } from "@/lib/daya/insights";
import { getSupabaseAdmin } from "@/lib/daya/supabase";

export const DEMO_USER_ID = "";
export const DEMO_CHILD_ID = "";

type LoadContextInput = {
  userId?: string;
  childId?: string;
  conversationId?: string;
};

type SaveMessageInput = {
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  clientMessageId?: string;
  metadata?: Record<string, unknown>;
};

export async function loadDayaContext({
  userId = DEMO_USER_ID,
  childId,
  conversationId,
}: LoadContextInput): Promise<DayaContext> {
  const supabase = getSupabaseAdmin();
  if (!userId) return getEmptyContext(conversationId);
  if (!supabase) throw new Error("Supabase is not configured");

  try {
    const child = await fetchChildProfile(userId, childId);
    if (!child) return getEmptyContext(conversationId);

    const [recentCheckIns, memories, storedInsights, conversation, messages] =
      await Promise.all([
        fetchRecentCheckIns(child.id),
        fetchMemories(child.id, userId),
        fetchInsights(child.id),
        conversationId ? fetchConversation(conversationId) : Promise.resolve(undefined),
        conversationId ? fetchMessages(conversationId) : Promise.resolve([]),
      ]);

    const deterministicInsights = analyzeBehaviorPatterns(recentCheckIns, child.id);
    const insights = mergeInsights(storedInsights, deterministicInsights);

    return {
      child,
      recentCheckIns,
      insights,
      memories,
      supportSnippets: [],
      conversation,
      messages,
      persistence: "supabase",
    };
  } catch (error) {
    console.error("Failed to load account context", error);
    throw error;
  }
}

export async function ensureConversation(input: {
  conversationId?: string;
  userId?: string;
  childId?: string;
  title?: string;
}) {
  const userId = input.userId ?? DEMO_USER_ID;
  const childId = input.childId ?? DEMO_CHILD_ID;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return demoConversation(input.conversationId, userId, childId, input.title);
  }

  if (input.conversationId) {
    const existing = await fetchConversation(input.conversationId);
    if (existing) return existing;
  }

  const conversation: Conversation = {
    id: createId("conv"),
    user_id: userId,
    child_id: childId,
    title: input.title ?? "DAYA conversation",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("conversations")
    .insert(conversation)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to create conversation", error);
    return demoConversation(conversation.id, userId, childId, input.title);
  }

  return data as Conversation;
}

export async function saveMessage({
  conversationId,
  role,
  content,
  clientMessageId,
  metadata,
}: SaveMessageInput) {
  const supabase = getSupabaseAdmin();
  const message: Message = {
    id: createId("msg"),
    conversation_id: conversationId,
    role,
    content,
    created_at: new Date().toISOString(),
    metadata,
  };

  if (!supabase) return message;

  const { error } = await supabase.from("messages").insert({
    id: message.id,
    conversation_id: conversationId,
    role,
    content,
    client_message_id: clientMessageId,
    metadata: metadata ?? {},
  });

  if (error && error.code !== "23505") {
    console.error("Failed to save message", error);
  }

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return message;
}

export async function saveDailyCheckIn(
  checkIn: Omit<DailyCheckIn, "id" | "created_at"> & { id?: string }
) {
  const normalized: DailyCheckIn = {
    ...checkIn,
    id: checkIn.id ?? createId("checkin"),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("daily_checkins")
    .upsert(
      {
        id: normalized.id,
        user_id: normalized.user_id ?? DEMO_USER_ID,
        child_id: normalized.child_id,
        date: normalized.date,
        sleep_quality: normalized.sleep_quality,
        sleep_hours: normalized.sleep_hours ?? null,
        meal_quality: normalized.meal_quality,
        mood: normalized.mood,
        meltdowns: normalized.meltdowns,
        meltdown_triggers: normalized.meltdown_triggers ?? null,
        communication_level: normalized.communication_level,
        routine_adherence: normalized.routine_adherence,
        sensory_load: normalized.sensory_load ?? null,
        sensory_issues: normalized.sensory_issues ?? null,
        difficult_period: normalized.difficult_period ?? "none",
        energy_level: normalized.energy_level ?? null,
        hyperactivity: normalized.hyperactivity ?? null,
        social_interaction: normalized.social_interaction ?? null,
        repetitive_behaviors: normalized.repetitive_behaviors ?? null,
        activities: normalized.activities ?? null,
        parent_stress: normalized.parent_stress ?? null,
        parent_notes: normalized.parent_notes ?? null,
        notes: normalized.notes ?? null,
      },
      { onConflict: "child_id,date" }
    )
    .select("*")
    .single();

  if (error) {
    console.error("Failed to save check-in", error);
    throw error;
  }

  return data as DailyCheckIn;
}

export async function persistInsights(insights: BehavioralInsight[]) {
  const supabase = getSupabaseAdmin();
  if (!supabase || insights.length === 0) return;

  const { error } = await supabase.from("behavioral_insights").upsert(
    insights.map((insight) => ({
      id: insight.id,
      child_id: insight.child_id,
      insight_type: insight.insight_type,
      title: insight.title,
      description: insight.description,
      confidence: insight.confidence,
      data_points: insight.data_points,
      source_check_in_ids: insight.source_check_in_ids ?? [],
      support_tags: insight.support_tags ?? [],
    })),
    { onConflict: "id" }
  );

  if (error) console.error("Failed to persist insights", error);
}

export async function saveConversationMemory(input: {
  childId: string;
  userId: string;
  userMessage: string;
  assistantMessage: string;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const summary = summarizeExchange(input.userMessage, input.assistantMessage);
  const { error } = await supabase.from("conversation_memories").insert({
    id: createId("mem"),
    child_id: input.childId,
    user_id: input.userId,
    summary,
    key_topics: extractTopics(`${input.userMessage} ${input.assistantMessage}`),
    emotional_context: inferEmotionalContext(input.userMessage),
  });

  if (error) console.error("Failed to save memory", error);
}

export async function fetchSeededSupportSnippets(): Promise<SupportSnippet[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("support_snippets")
    .select("id, category, title, text, content, triggers, intent, source_label, tone_reviewed, tags")
    .limit(50);

  if (error || !data) return [];
  return data as SupportSnippet[];
}

function getEmptyContext(conversationId?: string): DayaContext {
  return {
    child: undefined,
    recentCheckIns: [],
    insights: [],
    memories: [],
    supportSnippets: [],
    conversation: conversationId ? demoConversation(conversationId) : undefined,
    messages: [],
    persistence: "supabase",
  };
}

async function fetchChildProfile(userId: string, childId?: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return undefined;

  let query = supabase
    .from("child_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (childId) query = query.eq("id", childId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data as ChildProfile | null;
}

async function fetchRecentCheckIns(childId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("child_id", childId)
    .order("date", { ascending: false })
    .limit(30);

  if (error) throw error;
  return ((data ?? []) as DailyCheckIn[]).reverse();
}

async function fetchMemories(childId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("conversation_memories")
    .select("*")
    .eq("child_id", childId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw error;
  return (data ?? []) as ConversationMemory[];
}

async function fetchInsights(childId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("behavioral_insights")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw error;
  return (data ?? []) as BehavioralInsight[];
}

async function fetchConversation(conversationId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? undefined) as Conversation | undefined;
}

async function fetchMessages(conversationId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, role, content, created_at, metadata")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(80);

  if (error) throw error;
  return (data ?? []) as Message[];
}

function mergeInsights(
  stored: BehavioralInsight[],
  deterministic: BehavioralInsight[]
) {
  const byTitle = new Map<string, BehavioralInsight>();
  for (const insight of [...deterministic, ...stored]) {
    byTitle.set(insight.title, insight);
  }
  return [...byTitle.values()].sort(
    (a, b) => b.confidence - a.confidence || b.data_points - a.data_points
  );
}

function demoConversation(
  conversationId = "demo-conversation",
  userId = DEMO_USER_ID,
  childId = DEMO_CHILD_ID,
  title = "DAYA demo conversation"
): Conversation {
  return {
    id: conversationId,
    user_id: userId,
    child_id: childId,
    title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function summarizeExchange(userMessage: string, assistantMessage: string) {
  const user = userMessage.replace(/\s+/g, " ").trim().slice(0, 180);
  const assistant = assistantMessage.replace(/\s+/g, " ").trim().slice(0, 180);
  return `Parent shared: ${user}. DAYA responded with: ${assistant}.`;
}

function extractTopics(text: string) {
  const lower = text.toLowerCase();
  const topics = [
    "sleep",
    "food",
    "mood",
    "meltdown",
    "sensory",
    "routine",
    "communication",
    "school",
    "family",
    "transition",
    "overwhelm",
  ];

  return topics.filter((topic) => lower.includes(topic)).slice(0, 6);
}

function inferEmotionalContext(text: string) {
  const lower = text.toLowerCase();
  if (/(exhausted|tired|burned out|overwhelmed)/.test(lower)) return "exhausted";
  if (/(worried|scared|anxious|afraid)/.test(lower)) return "worried";
  if (/(happy|proud|relieved|hopeful)/.test(lower)) return "hopeful";
  if (/(frustrated|angry|upset)/.test(lower)) return "frustrated";
  return "seeking support";
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

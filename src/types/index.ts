export interface Message {
  id: string;
  conversation_id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface ChildProfile {
  id: string;
  user_id: string;
  name: string;
  age?: number;
  sensitivities: string[];
  triggers: string[];
  routines: string[];
  communication_style?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type MoodValue =
  | "great"
  | "good"
  | "okay"
  | "difficult"
  | "very_difficult";

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface DailyCheckIn {
  id: string;
  child_id: string;
  user_id?: string;
  date: string;
  sleep_quality: 1 | 2 | 3 | 4 | 5;
  sleep_hours?: number;
  meal_quality: 1 | 2 | 3 | 4 | 5;
  mood: MoodValue;
  meltdowns: number;
  meltdown_triggers?: string;
  communication_level: 1 | 2 | 3 | 4 | 5;
  routine_adherence: 1 | 2 | 3 | 4 | 5;
  sensory_load?: 1 | 2 | 3 | 4 | 5;
  sensory_issues?: string;
  difficult_period?: "morning" | "afternoon" | "evening" | "night" | "none";
  energy_level?: EnergyLevel;
  hyperactivity?: 1 | 2 | 3 | 4 | 5;
  social_interaction?: 1 | 2 | 3 | 4 | 5;
  repetitive_behaviors?: 1 | 2 | 3 | 4 | 5;
  activities?: string;
  parent_stress?: 1 | 2 | 3 | 4 | 5;
  parent_notes?: string;
  notes?: string;
  created_at: string;
}

export interface ConversationMemory {
  id: string;
  child_id: string;
  user_id: string;
  summary: string;
  key_topics: string[];
  emotional_context?: string;
  created_at: string;
}

export interface BehavioralInsight {
  id: string;
  child_id: string;
  source_check_in_ids?: string[];
  insight_type: "correlation" | "trend" | "pattern" | "observation";
  title: string;
  description: string;
  confidence: number;
  data_points: number;
  support_tags?: string[];
  created_at: string;
}

export type SupportCategory =
  | "sensory_support"
  | "communication"
  | "routine"
  | "transitions"
  | "sleep"
  | "food_and_eating"
  | "calming_activity"
  | "meltdown_recovery"
  | "parent_self_care"
  | "behavioral_support"
  | "book_knowledge";

export type SupportTrigger =
  | "noise"
  | "crowd"
  | "bright_light"
  | "schedule_change"
  | "new_environment"
  | "transition"
  | "overstimulation"
  | "understimulation"
  | "tiredness"
  | "hunger"
  | "unmet_communication_need";

export type SupportIntent =
  | "parent_tip"
  | "calming_activity"
  | "sensory_support"
  | "communication_idea";

export interface SupportSnippet {
  id: string;
  text: string;
  category: SupportCategory;
  triggers: SupportTrigger[];
  intent: SupportIntent;
  source_label: string;
  tone_reviewed: boolean;
  title?: string;
  content?: string;
  tags?: string[];
  embedding?: number[];
}

export interface Conversation {
  id: string;
  user_id: string;
  child_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface DayaContext {
  child?: ChildProfile;
  recentCheckIns: DailyCheckIn[];
  insights: BehavioralInsight[];
  memories: ConversationMemory[];
  supportSnippets: SupportSnippet[];
  conversation?: Conversation;
  messages: Message[];
  persistence: "supabase" | "demo";
}

export type SafetyCategory =
  | "none"
  | "crisis"
  | "diagnosis"
  | "medication"
  | "medical"
  | "cure_claim";

export interface SafetyAssessment {
  category: SafetyCategory;
  blocked: boolean;
  reason?: string;
  response?: string;
}

export interface ChatRequestMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export const MOOD_LABELS: Record<MoodValue, string> = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  difficult: "Difficult",
  very_difficult: "Very Difficult",
};

export const MOOD_EMOJIS: Record<MoodValue, string> = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  difficult: "😟",
  very_difficult: "😢",
};

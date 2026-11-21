import type { BehavioralInsight, DailyCheckIn, SupportSnippet } from "@/types";
import {
  getSnippetTags,
  getSnippetText,
  SUPPORT_SNIPPETS,
} from "@/lib/support-snippets";
import { BOOK_SNIPPETS, findRelevantBookSnippets } from "@/lib/daya/book-knowledge";

import { getSupabaseAdmin } from "@/lib/daya/supabase";
import {
  computeBehavioralWeights,
  type BehavioralWeights,
} from "@/lib/daya/behavioral-weights";

type RetrievalInput = {
  query: string;
  checkIns?: DailyCheckIn[];
  insights?: BehavioralInsight[];
  limit?: number;
};

export async function retrieveSupportSnippets({
  query,
  checkIns = [],
  insights = [],
  limit = 4,
}: RetrievalInput): Promise<SupportSnippet[]> {
  const triggerTerms = buildTriggerText(query, checkIns, insights);
  const vectorMatches = await retrieveFromSupabaseVector(triggerTerms, limit);

  if (vectorMatches.length > 0) return vectorMatches;

  return retrieveLocally(triggerTerms, checkIns, insights, limit);
}

export function retrieveLocally(
  query: string,
  checkIns: DailyCheckIn[] = [],
  insights: BehavioralInsight[] = [],
  limit = 4
) {
  const text = query.toLowerCase();
  const recent = checkIns.at(-1);
  const insightTags = new Set(insights.flatMap((insight) => insight.support_tags ?? []));

  const weights: BehavioralWeights | undefined =
    checkIns.length > 0
      ? computeBehavioralWeights(checkIns, insights)
      : undefined;

  const allSnippets = [...SUPPORT_SNIPPETS, ...BOOK_SNIPPETS];

  const scored = allSnippets.map((snippet) => {
    let score = 0;

    for (const tag of getSnippetTags(snippet)) {
      if (text.includes(tag.replace("_", " "))) score += 4;
      if (text.includes(tag)) score += 4;
      if (insightTags.has(tag)) score += 3;
    }

    if (text.includes(snippet.category.replaceAll("_", " "))) score += 5;
    if (text.includes(snippet.intent.replaceAll("_", " "))) score += 2;
    if (recent?.mood === "difficult" || recent?.mood === "very_difficult") {
      if (
        snippet.category === "calming_activity" ||
        snippet.category === "meltdown_recovery" ||
        snippet.category === "parent_self_care"
      ) {
        score += 2;
      }
    }
    if ((recent?.meltdowns ?? 0) > 0 && snippet.category === "meltdown_recovery") {
      score += 4;
    }
    if ((recent?.sensory_load ?? 0) >= 4 && snippet.category === "sensory_support") {
      score += 4;
    }
    if ((recent?.routine_adherence ?? 5) <= 2 && snippet.category === "routine") score += 4;
    if ((recent?.communication_level ?? 5) <= 2 && snippet.category === "communication") {
      score += 4;
    }

    // Adaptive weight boosting — snippets matching high-priority behavioral areas score higher
    if (weights) {
      score += applyWeightBoost(snippet.category, weights);
    }

    const titleWords = (snippet.title ?? "").toLowerCase().split(/\s+/);
    if (titleWords.some((word) => text.includes(word))) score += 1;

    return { snippet, score };
  });

  const baseResults = scored
    .filter((item) => item.score > 0 && item.snippet.tone_reviewed)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.snippet);

  // Merge book knowledge snippets
  const bookResults = findRelevantBookSnippets(query, 2);
  const merged = [...baseResults, ...bookResults]
    .filter((s, i, arr) => arr.findIndex((t) => t.id === s.id) === i) // dedupe
    .slice(0, limit + 1);

  return merged;
}

function applyWeightBoost(
  category: string,
  weights: BehavioralWeights
): number {
  let boost = 0;
  const cat = category.toLowerCase();

  if (cat.includes("sleep") && weights.sleep_priority >= 0.5) {
    boost += Math.round(weights.sleep_priority * 6);
  }
  if (cat.includes("sensory") && weights.sensory_priority >= 0.5) {
    boost += Math.round(weights.sensory_priority * 6);
  }
  if (cat.includes("routine") && weights.routine_priority >= 0.5) {
    boost += Math.round(weights.routine_priority * 6);
  }
  if (cat.includes("communication") && weights.communication_priority >= 0.5) {
    boost += Math.round(weights.communication_priority * 6);
  }
  if ((cat.includes("food") || cat.includes("meal")) && weights.food_priority >= 0.5) {
    boost += Math.round(weights.food_priority * 6);
  }
  if (cat.includes("meltdown") && weights.meltdown_risk >= 0.5) {
    boost += Math.round(weights.meltdown_risk * 6);
  }
  if (cat.includes("parent") && weights.parent_support_priority >= 0.5) {
    boost += Math.round(weights.parent_support_priority * 6);
  }

  if (weights.recommendation_mode === "recovery") {
    if (cat.includes("calming") || cat.includes("recovery") || cat.includes("self_care")) {
      boost += 3;
    }
  }

  return boost;
}

async function retrieveFromSupabaseVector(query: string, limit: number) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !process.env.OPENAI_API_KEY) return [];

  try {
    const embedding = await createEmbedding(query);
    if (!embedding.length) return [];

    const { data, error } = await supabase.rpc("match_support_snippets", {
      query_embedding: embedding,
      match_count: limit,
      match_threshold: 0.72,
    });

    if (error || !data) return [];

    return (data as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id),
      category: row.category as SupportSnippet["category"],
      title: typeof row.title === "string" ? row.title : undefined,
      text: String(row.text ?? row.content ?? ""),
      content: typeof row.content === "string" ? row.content : undefined,
      triggers: Array.isArray(row.triggers) ? (row.triggers as SupportSnippet["triggers"]) : [],
      intent: (row.intent as SupportSnippet["intent"]) ?? "parent_tip",
      source_label: String(row.source_label ?? "supabase_support_snippets"),
      tone_reviewed: Boolean(row.tone_reviewed ?? true),
      tags: Array.isArray(row.tags) ? (row.tags as string[]) : undefined,
    }));
  } catch {
    return [];
  }
}

async function createEmbedding(input: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
      input,
    }),
  });

  if (!response.ok) return [];

  const data = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };

  return data.data?.[0]?.embedding ?? [];
}

function buildTriggerText(
  query: string,
  checkIns: DailyCheckIn[],
  insights: BehavioralInsight[]
) {
  const recent = checkIns.at(-1);
  const recentText = recent
    ? [
        recent.mood,
        recent.meltdowns > 0 ? "meltdown" : "",
        recent.sleep_quality <= 2 ? "sleep" : "",
        recent.meal_quality <= 2 ? "food mood" : "",
        recent.routine_adherence <= 2 ? "routine transitions" : "",
        (recent.sensory_load ?? 0) >= 4 ? "sensory overwhelm" : "",
        recent.sensory_issues ?? "",
        recent.meltdown_triggers ?? "",
        recent.notes ?? "",
      ].join(" ")
    : "";

  const insightText = insights
    .flatMap((insight) => [insight.title, insight.description, ...(insight.support_tags ?? [])])
    .join(" ");

  return `${query} ${recentText} ${insightText}`.trim();
}

export { getSnippetText };

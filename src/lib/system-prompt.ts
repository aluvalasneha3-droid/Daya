import type {
  BehavioralInsight,
  ChildProfile,
  ConversationMemory,
  DailyCheckIn,
  SupportSnippet,
} from "@/types";
import { buildDayaSystemPrompt } from "@/lib/daya/prompts";

export function buildSystemPrompt(context: {
  child?: ChildProfile;
  recentCheckIns?: DailyCheckIn[];
  insights?: BehavioralInsight[];
  memories?: ConversationMemory[];
  supportSnippets?: string[] | SupportSnippet[];
}) {
  const snippets = (context.supportSnippets ?? []).map((snippet, index) =>
    typeof snippet === "string"
      ? {
          id: `snippet-${index}`,
          category: "parent_self_care" as const,
          title: "Support idea",
          text: snippet,
          content: snippet,
          triggers: [],
          intent: "parent_tip" as const,
          source_label: "legacy_inline_prompt",
          tone_reviewed: true,
        }
      : snippet
  );

  return buildDayaSystemPrompt({
    child: context.child,
    recentCheckIns: context.recentCheckIns ?? [],
    insights: context.insights ?? [],
    memories: context.memories ?? [],
    supportSnippets: snippets,
    safety: { category: "none", blocked: false },
  });
}

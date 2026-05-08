import type { BehavioralInsight, ChatRequestMessage } from "@/types";
import { createDayaResponseStream } from "@/lib/daya/ai";
import { buildDayaSystemPrompt } from "@/lib/daya/prompts";
import {
  DEMO_USER_ID,
  ensureConversation,
  loadDayaContext,
  persistInsights,
  saveConversationMemory,
  saveMessage,
} from "@/lib/daya/repository";
import { assessSafety } from "@/lib/daya/safety";
import { retrieveSupportSnippets } from "@/lib/daya/support";
import { detectIntent } from "@/lib/daya/intent";
import type { SupportedLanguage } from "@/lib/daya/i18n";
import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatBody = {
  conversationId?: string;
  childId?: string;
  userId?: string;
  messages?: ChatRequestMessage[];
  language?: SupportedLanguage;
};

// Initialize Groq natively
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const body = (await request.json()) as ChatBody;
  const messages = sanitizeMessages(body.messages ?? []);
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage?.content.trim()) {
    return Response.json({ error: "A user message is required." }, { status: 400 });
  }

  const userId = body.userId ?? DEMO_USER_ID;
  const safety = assessSafety(latestUserMessage.content);
  const context = await loadDayaContext({
    userId,
    childId: body.childId,
    conversationId: body.conversationId,
  });

  const child = context.child;
  const conversation = await ensureConversation({
    conversationId: body.conversationId,
    userId,
    childId: child?.id,
    title: titleFromMessage(latestUserMessage.content),
  });

  await saveMessage({
    conversationId: conversation.id,
    role: "user",
    content: latestUserMessage.content,
    clientMessageId: latestUserMessage.id,
    metadata: {
      safety_category: safety.category,
    },
  });

  const intentResult = detectIntent(
    latestUserMessage.content,
    context.recentCheckIns,
    context.insights
  );

  const supportSnippets = await retrieveSupportSnippets({
    query: latestUserMessage.content,
    checkIns: context.recentCheckIns,
    insights: context.insights,
  });

  const system = buildDayaSystemPrompt({
    child,
    recentCheckIns: context.recentCheckIns,
    insights: context.insights,
    memories: context.memories,
    supportSnippets,
    safety,
    responseMode: intentResult.responseMode,
    intent: intentResult.primary,
    language: body.language ?? "en",
  });

  const persistenceMetadata = {
    conversationId: conversation.id,
    childId: child?.id,
    userId,
    userMessage: latestUserMessage.content,
    safetyCategory: safety.category,
    insights: context.insights,
  };

  // ────────────────────────────────────────────────────────────────────────
  // PREMIUM AI SDK INTEGRATION (Groq / Llama 3)
  // ────────────────────────────────────────────────────────────────────────
  if (process.env.GROQ_API_KEY && (!safety.blocked || safety.category === "none")) {
    try {
      const result = streamText({
        model: groq("gemma2-9b-it"), // Google's Gemma model on Groq (fresh token bucket)
        maxRetries: 0, // Disable waiting 60s for rate limits to clear
        system: system,
        messages: messages as any[],
        temperature: 0.7, // Add a bit of warmth and variation
        async onFinish({ text }) {
          if (text.trim()) {
            await saveMessage({
              conversationId: persistenceMetadata.conversationId,
              role: "assistant",
              content: text,
              metadata: {
                provider: "groq",
                safety_category: persistenceMetadata.safetyCategory,
              },
            });

            if (persistenceMetadata.childId) {
              await Promise.all([
                saveConversationMemory({
                  childId: persistenceMetadata.childId,
                  userId: persistenceMetadata.userId,
                  userMessage: persistenceMetadata.userMessage,
                  assistantMessage: text,
                }),
                persistInsights(persistenceMetadata.insights),
              ]);
            }
          }
        },
      });

      return result.toTextStreamResponse({
        headers: {
          "X-Daya-Conversation-Id": conversation.id,
          "X-Daya-AI-Provider": "groq",
          "X-Daya-Persistence": context.persistence,
        },
      });
    } catch (error) {
      console.error("Groq stream failed, falling back to Demo Mode:", error);
      // Fall through to Demo mode below
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // FALLBACK DEMO MODE (For hackathon presentation if no API key)
  // ────────────────────────────────────────────────────────────────────────
  const { stream, provider } = await createDayaResponseStream({
    system,
    messages,
    child,
    checkIns: context.recentCheckIns,
    insights: context.insights,
    supportSnippets,
    safety,
    language: body.language ?? "en",
    intent: intentResult.primary,
  });

  const responseStream = persistAssistantAfterStream(stream, {
    ...persistenceMetadata,
    provider,
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Daya-Conversation-Id": conversation.id,
      "X-Daya-AI-Provider": provider,
      "X-Daya-Persistence": context.persistence,
    },
  });
}

function persistAssistantAfterStream(
  stream: ReadableStream<Uint8Array>,
  metadata: {
    conversationId: string;
    childId?: string;
    userId: string;
    userMessage: string;
    provider: string;
    safetyCategory: string;
    insights: BehavioralInsight[];
  }
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let assistantMessage = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          assistantMessage += decoder.decode(value, { stream: true });
          controller.enqueue(value);
        }

        assistantMessage += decoder.decode();
      } finally {
        controller.close();

        if (assistantMessage.trim()) {
          await saveMessage({
            conversationId: metadata.conversationId,
            role: "assistant",
            content: assistantMessage,
            metadata: {
              provider: metadata.provider,
              safety_category: metadata.safetyCategory,
            },
          });

          if (metadata.childId) {
            await Promise.all([
              saveConversationMemory({
                childId: metadata.childId,
                userId: metadata.userId,
                userMessage: metadata.userMessage,
                assistantMessage,
              }),
              persistInsights(metadata.insights),
            ]);
          }
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => undefined);
    },
  });
}

function sanitizeMessages(messages: ChatRequestMessage[]) {
  return messages
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-30)
    .map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content.slice(0, 6000),
      created_at: message.created_at,
    }));
}

function titleFromMessage(message: string) {
  const title = message.replace(/\s+/g, " ").trim();
  return title.length > 54 ? `${title.slice(0, 54)}...` : title || "DAYA conversation";
}

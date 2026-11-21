"use client";

import { useState, useCallback, useRef } from "react";
import type { Message } from "@/types";
import type { SupportedLanguage } from "@/lib/daya/i18n";
import { getAccessToken } from "@/lib/auth-client";

export function useChat(language: SupportedLanguage = "en") {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      abortRef.current = new AbortController();
      const accessToken = await getAccessToken();

      const allMessages = [...messages, userMessage]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ conversationId, messages: allMessages, language }),
        signal: abortRef.current.signal,
      });


      if (!response.ok) throw new Error("Chat request failed");
      const nextConversationId = response.headers.get("X-Daya-Conversation-Id");
      if (nextConversationId) setConversationId(nextConversationId);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: fullText } : m
          )
        );
      }

      fullText += decoder.decode();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content:
                  "I am having trouble connecting right now. Your notes still matter. Please try again in a moment.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [conversationId, messages, language]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, stop, conversationId };
}

"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { WelcomeScreen } from "./welcome-screen";
import { useChat } from "@/hooks/use-chat";

export function ChatView() {
  const { messages, isLoading, sendMessage, stop } = useChat();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {showWelcome ? (
        <WelcomeScreen childName="your child" onSuggestionClick={sendMessage} />
      ) : (
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto py-6 space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isStreaming={
                  isLoading &&
                  msg.role === "assistant" &&
                  i === messages.length - 1
                }
              />
            ))}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <TypingIndicator />
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>
      )}

      <ChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} />
    </div>
  );
}

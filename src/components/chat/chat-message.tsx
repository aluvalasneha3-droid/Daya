"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Message } from "@/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";
  const createdAt = message.timestamp ?? new Date(message.created_at ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex gap-3 px-4", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center mt-1">
          <span className="text-sm">🌱</span>
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-md"
            : "bg-stone-100 text-stone-800 rounded-bl-md"
        )}
      >
        <div className="whitespace-pre-wrap">
          {message.content}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-4 ml-0.5 bg-stone-400 rounded-full align-middle"
            />
          )}
        </div>
        <div
          className={cn(
            "text-[11px] mt-1.5 opacity-60",
            isUser ? "text-white/80 text-right" : "text-stone-500"
          )}
        >
          {format(createdAt, "h:mm a")}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center mt-1">
          <span className="text-sm">👤</span>
        </div>
      )}
    </motion.div>
  );
}

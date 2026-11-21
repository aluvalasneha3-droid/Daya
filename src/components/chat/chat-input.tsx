"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-stone-200 bg-white/80 backdrop-blur-xl px-4 py-3"
    >
      <div className="max-w-2xl mx-auto flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          className="min-h-[44px] max-h-[120px] resize-none rounded-xl border-stone-200 bg-stone-50 focus:bg-white focus:border-amber-300 focus:ring-amber-200 text-[15px] placeholder:text-stone-400 transition-colors"
          rows={1}
        />

        {isLoading ? (
          <Button
            onClick={onStop}
            size="icon"
            variant="outline"
            className="flex-shrink-0 h-11 w-11 rounded-xl border-stone-200 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Square className="h-4 w-4 text-red-500" />
          </Button>
        ) : (
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-30 transition-all shadow-md shadow-amber-200/50"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-center text-[11px] text-stone-400 mt-2 max-w-2xl mx-auto">
        DAYA is a support companion, not a medical professional. Always consult
        your child&apos;s care team for clinical advice.
      </p>
    </motion.div>
  );
}

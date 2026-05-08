"use client";

import { motion } from "framer-motion";
import { Heart, Sun, MessageCircle, TrendingUp } from "lucide-react";

interface WelcomeScreenProps {
  childName: string;
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  {
    icon: Sun,
    text: "How was Aarav's week overall?",
    label: "Weekly overview",
  },
  {
    icon: Heart,
    text: "He had a tough day today. Can you help me understand what might be going on?",
    label: "Tough day support",
  },
  {
    icon: TrendingUp,
    text: "Have you noticed any patterns in his sleep and mood?",
    label: "Pattern insights",
  },
  {
    icon: MessageCircle,
    text: "What are some calming strategies that might help during meltdowns?",
    label: "Calming ideas",
  },
];

export function WelcomeScreen({ childName, onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-100/50"
        >
          <span className="text-3xl">🌱</span>
        </motion.div>

        <h2 className="text-2xl font-semibold text-stone-800 mb-2">
          Welcome back
        </h2>
        <p className="text-stone-500 mb-8 text-[15px] leading-relaxed">
          I&apos;m here whenever you need to talk about {childName}&apos;s day,
          explore patterns, or just feel heard. What&apos;s on your mind?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => onSuggestionClick(s.text)}
              className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all text-left group shadow-sm"
            >
              <s.icon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-medium text-amber-600 mb-0.5">
                  {s.label}
                </p>
                <p className="text-sm text-stone-600 leading-snug">{s.text}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

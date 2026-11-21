"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
        <span className="text-sm">🌱</span>
      </div>
      <div className="bg-stone-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-stone-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

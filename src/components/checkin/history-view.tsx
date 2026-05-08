"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import type { DailyCheckIn } from "@/types";
import { MOOD_EMOJIS, MOOD_LABELS } from "@/types";

function Meter({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < value ? "bg-amber-400" : "bg-stone-200"
          }`}
        />
      ))}
    </div>
  );
}

export function HistoryView() {
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/checkin")
      .then((r) => r.json())
      .then((data) => setCheckIns(data.reverse()))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-stone-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2 overflow-y-auto">
      <div className="px-2 mb-2">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          Daily Log
        </h3>
      </div>

      {checkIns.map((ci, i) => (
        <motion.div
          key={ci.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-800">
              {format(parseISO(ci.date), "EEE, MMM d")}
            </span>
            <span className="text-lg" title={MOOD_LABELS[ci.mood]}>
              {MOOD_EMOJIS[ci.mood]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="text-stone-400 w-20">Sleep</span>
              <Meter value={ci.sleep_quality} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 w-20">Meals</span>
              <Meter value={ci.meal_quality} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 w-20">Comms</span>
              <Meter value={ci.communication_level} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 w-20">Routine</span>
              <Meter value={ci.routine_adherence} />
            </div>
          </div>

          {ci.meltdowns > 0 && (
            <div className="mt-2 text-xs text-red-500">
              {ci.meltdowns} meltdown{ci.meltdowns > 1 ? "s" : ""}
              {ci.meltdown_triggers && (
                <span className="text-stone-400 ml-1">
                  — {ci.meltdown_triggers}
                </span>
              )}
            </div>
          )}

          {ci.notes && (
            <p className="mt-2 text-xs text-stone-500 italic">{ci.notes}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

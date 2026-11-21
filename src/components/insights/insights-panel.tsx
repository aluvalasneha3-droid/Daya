"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Link2, Eye, Sparkles } from "lucide-react";
import type { BehavioralInsight } from "@/types";

const INSIGHT_ICONS = {
  correlation: Link2,
  trend: TrendingUp,
  pattern: Eye,
  observation: Sparkles,
};

const INSIGHT_COLORS = {
  correlation: "from-blue-100 to-indigo-100 text-blue-700",
  trend: "from-emerald-100 to-teal-100 text-emerald-700",
  pattern: "from-purple-100 to-violet-100 text-purple-700",
  observation: "from-amber-100 to-orange-100 text-amber-700",
};

export function InsightsPanel() {
  const [insights, setInsights] = useState<BehavioralInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then(setInsights)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-stone-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-7 w-7 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-700 mb-1">
            No patterns yet
          </h3>
          <p className="text-sm text-stone-500 max-w-xs">
            Keep logging daily check-ins and DAYA will gently surface patterns
            and observations over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      <div className="px-2 mb-2">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          Behavioral Observations
        </h3>
        <p className="text-xs text-stone-400 mt-0.5">
          Based on your recent check-ins
        </p>
      </div>

      {insights.map((insight, i) => {
        const Icon = INSIGHT_ICONS[insight.insight_type];
        const colorClass = INSIGHT_COLORS[insight.insight_type];

        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-stone-800">
                    {insight.title}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">
                    {insight.insight_type}
                  </span>
                </div>
                <p className="text-[13px] text-stone-600 leading-relaxed">
                  {insight.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-stone-400">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {insight.data_points} data points
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

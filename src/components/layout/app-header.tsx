"use client";

import { motion } from "framer-motion";

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "chat", label: "Chat" },
  { id: "checkin", label: "Check-in" },
  { id: "history", label: "History" },
  { id: "insights", label: "Insights" },
];

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
              <span className="text-sm">🌱</span>
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              DAYA
            </h1>
          </div>
          <span className="text-xs text-stone-400">private account</span>
        </div>

        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative px-3 py-2 text-sm font-medium transition-colors"
            >
              <span
                className={
                  activeTab === tab.id ? "text-amber-600" : "text-stone-500 hover:text-stone-700"
                }
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

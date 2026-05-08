"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BehavioralPage() {
  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Behavioral Insights</h1>
          <p className="text-daya-text-secondary">Longitudinal pattern detection powered by DAYA.</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-daya-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-daya-success/20 text-daya-sage-dark flex items-center justify-center">
                <TrendingUp className="size-6" />
              </div>
              <span className="text-xs font-bold text-daya-sage-dark bg-daya-sage-light px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-sm font-medium text-daya-text-secondary">Emotional Stability</h3>
            <p className="text-2xl font-bold text-daya-text mt-1">High</p>
            <p className="text-xs text-daya-text-light mt-2">Compared to last month</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-daya-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-daya-terracotta/20 text-daya-terracotta flex items-center justify-center">
                <TrendingDown className="size-6" />
              </div>
              <span className="text-xs font-bold text-daya-terracotta bg-[#FDF8F6] px-2 py-1 rounded-full">-40%</span>
            </div>
            <h3 className="text-sm font-medium text-daya-text-secondary">Meltdown Frequency</h3>
            <p className="text-2xl font-bold text-daya-text mt-1">Decreasing</p>
            <p className="text-xs text-daya-text-light mt-2">Mostly reduced during transition periods</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-daya-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="size-12 rounded-2xl bg-daya-sky/20 text-daya-sky flex items-center justify-center">
                <Activity className="size-6" />
              </div>
              <span className="text-xs font-bold text-daya-text-secondary bg-daya-cream px-2 py-1 rounded-full">Consistent</span>
            </div>
            <h3 className="text-sm font-medium text-daya-text-secondary">Sleep Architecture</h3>
            <p className="text-2xl font-bold text-daya-text mt-1">8.5 hrs avg</p>
            <p className="text-xs text-daya-text-light mt-2">Waking less frequently at 3 AM</p>
          </div>
        </div>

        {/* Charts / Visualization Mocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl p-8 border border-daya-border shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-daya-text">Sensory Overwhelm Heatmap</h3>
              <select className="text-sm bg-daya-cream border-none rounded-xl px-3 py-1 outline-none text-daya-text-secondary">
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              {/* Fake Chart representation using divs */}
              <div className="w-full flex items-end gap-2 h-40">
                {[4, 2, 8, 3, 5, 2, 1, 9, 4, 3].map((val, i) => (
                  <div key={i} className="flex-1 bg-daya-cream rounded-t-sm relative group cursor-pointer transition-all hover:bg-daya-sage-light" style={{ height: '100%' }}>
                    <div className={cn("absolute bottom-0 w-full rounded-t-sm transition-all", val > 7 ? 'bg-daya-terracotta' : val > 4 ? 'bg-daya-gold' : 'bg-daya-sage')} style={{ height: `${val * 10}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex w-full justify-between mt-4 text-xs font-medium text-daya-text-light">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#FDF8F6] rounded-2xl border border-[#F4E3DD] flex gap-3">
              <AlertCircle className="size-5 text-daya-terracotta shrink-0" />
              <p className="text-sm text-[#8A5A44] leading-relaxed">
                Notice the spike on Thursdays (Day 8). This correlates directly with the school schedule change (assembly day).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-daya-border shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-daya-text">Correlation: Sleep & Mood</h3>
              <Brain className="size-5 text-daya-text-light" />
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-daya-text">Days with &gt; 8hrs sleep</span>
                    <span className="font-bold text-daya-sage-dark">85% positive mood</span>
                  </div>
                  <div className="w-full h-3 bg-daya-cream rounded-full overflow-hidden">
                    <div className="h-full bg-daya-sage w-[85%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-daya-text">Days with &lt; 6hrs sleep</span>
                    <span className="font-bold text-daya-terracotta">20% positive mood</span>
                  </div>
                  <div className="w-full h-3 bg-daya-cream rounded-full overflow-hidden">
                    <div className="h-full bg-daya-terracotta w-[20%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

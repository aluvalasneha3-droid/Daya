"use client";

import { motion } from "framer-motion";
import { Coffee, Moon, Sun, Utensils, Zap, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const blocks = [
    {
      id: "morning",
      title: "Morning Flow",
      time: "7:00 AM - 11:30 AM",
      icon: Sun,
      color: "text-daya-sky",
      bgColor: "bg-daya-sky/20",
      borderColor: "border-daya-sky/30",
      items: [
        { type: "routine", text: "Visual schedule review immediately after waking" },
        { type: "sensory", text: "Heavy work (pushing laundry basket) before breakfast to regulate" },
        { type: "food", text: "Breakfast: Oatmeal with preferred crunchy topping (sensory safe)" },
        { type: "transition", text: "Use 5-minute countdown timer before leaving for school" },
      ]
    },
    {
      id: "afternoon",
      title: "Afternoon Recovery",
      time: "12:00 PM - 4:30 PM",
      icon: Coffee,
      color: "text-daya-sage-dark",
      bgColor: "bg-daya-sage-light",
      borderColor: "border-daya-sage/30",
      items: [
        { type: "food", text: "Lunch: Bento box presentation (foods not touching)" },
        { type: "sensory", text: "Post-school decompression: 30 mins quiet room, no demands" },
        { type: "routine", text: "Interest-led play (dinosaurs) to rebuild emotional reserves" },
      ]
    },
    {
      id: "evening",
      title: "Evening Wind Down",
      time: "5:00 PM - 8:30 PM",
      icon: Moon,
      color: "text-daya-lavender",
      bgColor: "bg-daya-lavender/30",
      borderColor: "border-daya-lavender/50",
      items: [
        { type: "food", text: "Dinner: Introduce one new vegetable alongside safe foods (no pressure)" },
        { type: "sensory", text: "Dim lights 60 minutes before bed" },
        { type: "routine", text: "Bath, PJs, read same 2 books in exact order" },
      ]
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "sensory": return <Zap className="size-4" />;
      case "food": return <Utensils className="size-4" />;
      case "transition": return <Brain className="size-4" />;
      default: return <Sparkles className="size-4" />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Tomorrow's Planner</h1>
          <p className="text-daya-text-secondary">Customized based on Aarav's recent longitudinal patterns and today's sensory load.</p>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-daya-sage-light border border-daya-sage/30 rounded-3xl p-6 flex gap-4">
          <div className="size-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Brain className="size-6 text-daya-sage-dark" />
          </div>
          <div>
            <h3 className="font-bold text-daya-text mb-1">DAYA's Logic</h3>
            <p className="text-sm text-daya-text-secondary leading-relaxed">
              Because yesterday had high auditory sensory load, tomorrow is structured as a "Recovery Day". We're prioritizing predictable routines, reducing transition demands, and keeping sensory input low.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {blocks.map((block) => (
            <motion.div 
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-daya-border overflow-hidden shadow-sm"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn("size-14 rounded-2xl flex items-center justify-center", block.bgColor, block.color)}>
                    <block.icon className="size-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-daya-text">{block.title}</h2>
                    <p className="text-sm font-medium text-daya-text-light">{block.time}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {block.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-daya-cream hover:bg-[#F2EDE4] transition-colors border border-transparent hover:border-daya-border">
                      <div className={cn("mt-0.5", 
                        item.type === "sensory" ? "text-daya-terracotta" :
                        item.type === "food" ? "text-daya-sage-dark" :
                        item.type === "transition" ? "text-daya-lavender" : "text-daya-gold"
                      )}>
                        {getIconForType(item.type)}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-daya-text-light mb-1 block">
                          {item.type}
                        </span>
                        <p className="text-sm font-medium text-daya-text leading-snug">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

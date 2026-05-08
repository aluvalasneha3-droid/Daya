"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Utensils, Activity, Brain, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CheckInPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [nightWaking, setNightWaking] = useState<string>("");
  const [appetite, setAppetite] = useState<string>("");
  const [foodSens, setFoodSens] = useState<string[]>([]);
  const [meltdown, setMeltdown] = useState<string>("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [parentFeeling, setParentFeeling] = useState<string>("");

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const toggleArrayItem = (item: string, currentArray: string[], setArray: (arr: string[]) => void) => {
    if (currentArray.includes(item)) {
      setArray(currentArray.filter(i => i !== item));
    } else {
      setArray([...currentArray, item]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sleep_quality: nightWaking === "None" ? 5 : nightWaking === "1-2 times" ? 3 : 2,
          sleep_hours: 8, // Using default from range
          meal_quality: appetite === "High" ? 5 : appetite === "Normal" ? 4 : 2,
          mood: meltdown === "No" ? "good" : "challenging",
          meltdowns: meltdown === "Yes" ? 1 : 0,
          meltdown_triggers: triggers.join(", "),
          communication_level: 3,
          routine_adherence: 3,
          sensory_load: foodSens.length > 0 ? 4 : 2,
          sensory_issues: foodSens.join(", "),
          difficult_period: "none",
          energy_level: 3,
          hyperactivity: 3,
          social_interaction: 3,
          repetitive_behaviors: 3,
          activities: "",
          parent_stress: parentFeeling.includes("Overwhelmed") || parentFeeling.includes("Burned Out") ? 5 : 2,
          parent_notes: parentFeeling,
          notes: "",
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error("Check-in submission failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 shadow-sm border border-daya-border text-center max-w-md w-full"
        >
          <div className="size-20 bg-daya-success/20 text-daya-sage-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-daya-text mb-2">Check-in Complete</h2>
          <p className="text-daya-text-secondary leading-relaxed mb-8">
            Thank you for taking a moment to log today. DAYA is analyzing this data to update tomorrow's support plan.
          </p>
          <button 
            onClick={() => window.location.href = "/dashboard"}
            className="w-full bg-daya-sage hover:bg-daya-sage-dark text-white py-3.5 rounded-xl font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 flex flex-col">
      <div className="max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col">
        
        {/* Header & Progress */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-6 text-center">Daily Check-In</h1>
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={cn(
                  "h-2 w-16 rounded-full transition-colors duration-300",
                  step >= i ? "bg-daya-sage" : "bg-daya-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-daya-border flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 h-full flex flex-col"
              >
                <div className="flex items-center gap-3 text-daya-text mb-4">
                  <Moon className="size-6 text-daya-lavender" />
                  <h2 className="text-xl font-bold">Sleep & Morning</h2>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-sm font-semibold text-daya-text mb-2 block">How many hours did Aarav sleep?</label>
                    <input type="range" min="4" max="12" step="0.5" className="w-full accent-daya-sage" defaultValue="8" />
                    <div className="flex justify-between text-xs text-daya-text-light mt-2">
                      <span>4 hrs</span>
                      <span>8 hrs</span>
                      <span>12+ hrs</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="text-sm font-semibold text-daya-text mb-3 block">Night Waking</label>
                    <div className="flex gap-3">
                      {["None", "1-2 times", "3+ times"].map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => setNightWaking(opt)}
                          className={cn(
                            "flex-1 py-3 rounded-xl border text-sm font-medium transition-colors",
                            nightWaking === opt 
                              ? "border-daya-sage bg-daya-sage-light text-daya-sage-dark" 
                              : "border-daya-border hover:border-daya-sage text-daya-text"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-daya-border">
                  <button onClick={handleNext} className="bg-daya-text text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-daya-text/90 transition-colors">
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 h-full flex flex-col"
              >
                <div className="flex items-center gap-3 text-daya-text mb-4">
                  <Utensils className="size-6 text-daya-sage-dark" />
                  <h2 className="text-xl font-bold">Food & Meals</h2>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label className="text-sm font-semibold text-daya-text mb-3 block">Appetite Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Low", "Normal", "High"].map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => setAppetite(opt)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-medium transition-colors",
                            appetite === opt 
                              ? "border-daya-sage bg-daya-sage-light text-daya-sage-dark" 
                              : "border-daya-border hover:border-daya-sage text-daya-text"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-daya-text mb-3 block">Food Sensitivities Today</label>
                    <div className="flex flex-wrap gap-2">
                      {["Texture Aversion", "Color Restriction", "Temperature Sensitive", "Only Safe Foods", "Tried New Food"].map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => toggleArrayItem(opt, foodSens, setFoodSens)}
                          className={cn(
                            "px-4 py-2 rounded-full border text-sm transition-colors",
                            foodSens.includes(opt)
                              ? "border-daya-sage bg-daya-sage text-white"
                              : "border-daya-border bg-daya-cream text-daya-text hover:bg-daya-sage-light"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-daya-border">
                  <button onClick={handlePrev} className="text-daya-text-secondary px-6 py-3 font-medium hover:bg-daya-cream rounded-xl transition-colors">Back</button>
                  <button onClick={handleNext} className="bg-daya-text text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-daya-text/90 transition-colors">
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 h-full flex flex-col"
              >
                <div className="flex items-center gap-3 text-daya-text mb-4">
                  <Zap className="size-6 text-daya-terracotta" />
                  <h2 className="text-xl font-bold">Sensory & Meltdowns</h2>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label className="text-sm font-semibold text-daya-text mb-3 block">Did Aarav experience a meltdown?</label>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setMeltdown("Yes")}
                        className={cn(
                          "flex-1 py-3 rounded-xl border text-sm font-medium transition-colors",
                          meltdown === "Yes"
                            ? "border-daya-terracotta bg-[#FDF8F6] text-daya-terracotta"
                            : "border-daya-border hover:border-daya-terracotta text-daya-text hover:bg-[#FDF8F6]"
                        )}
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setMeltdown("No")}
                        className={cn(
                          "flex-1 py-3 rounded-xl border text-sm font-medium transition-colors",
                          meltdown === "No"
                            ? "border-daya-sage bg-daya-sage-light text-daya-sage-dark"
                            : "border-daya-border hover:border-daya-sage text-daya-text hover:bg-daya-sage-light"
                        )}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-daya-text mb-3 block">Primary Triggers (if any)</label>
                    <div className="flex flex-wrap gap-2">
                      {["Auditory (Loud noises)", "Tactile (Clothing/Touch)", "Visual (Bright lights)", "Transition/Routine Change", "Social Demand", "Unknown"].map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => toggleArrayItem(opt, triggers, setTriggers)}
                          className={cn(
                            "px-4 py-2 rounded-full border text-sm transition-colors",
                            triggers.includes(opt)
                              ? "border-daya-terracotta bg-daya-terracotta text-white"
                              : "border-daya-border bg-daya-cream text-daya-text hover:bg-[#FDF8F6]"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-daya-border">
                  <button onClick={handlePrev} className="text-daya-text-secondary px-6 py-3 font-medium hover:bg-daya-cream rounded-xl transition-colors">Back</button>
                  <button onClick={handleNext} className="bg-daya-text text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-daya-text/90 transition-colors">
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 h-full flex flex-col"
              >
                <div className="flex items-center gap-3 text-daya-text mb-4">
                  <Brain className="size-6 text-daya-sky" />
                  <h2 className="text-xl font-bold">Parent Wellbeing</h2>
                </div>

                <div className="space-y-6 flex-1">
                  <p className="text-sm text-daya-text-secondary leading-relaxed">
                    DAYA cares about you, too. Your regulation is the foundation of Aarav's regulation.
                  </p>

                  <div>
                    <label className="text-sm font-semibold text-daya-text mb-3 block">How are you feeling today?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Calm & Capable", "Tired but Okay", "Overwhelmed", "Exhausted/Burned Out"].map(opt => (
                        <button 
                          key={opt} 
                          onClick={() => setParentFeeling(opt)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-medium transition-colors",
                            parentFeeling === opt
                              ? "border-daya-sky bg-daya-sky/20 text-daya-sky"
                              : "border-daya-border hover:border-daya-sky text-daya-text hover:bg-daya-sky/10"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-daya-text mb-3 block">Additional Notes for DAYA</label>
                    <textarea 
                      className="w-full bg-daya-cream border-transparent focus:border-daya-sage focus:ring-0 rounded-xl px-4 py-3 text-daya-text outline-none resize-none h-24 text-sm"
                      placeholder="e.g. He used a new word today! But the evening transition was really hard..."
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-daya-border">
                  <button onClick={handlePrev} className="text-daya-text-secondary px-6 py-3 font-medium hover:bg-daya-cream rounded-xl transition-colors">Back</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="bg-daya-sage text-white px-8 py-3 rounded-xl font-medium hover:bg-daya-sage-dark transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? "Saving..." : "Save Check-in"}
                  </button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

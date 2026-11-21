"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Moon, Utensils, Smile, AlertTriangle, MessageSquare, Clock, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MoodValue } from "@/types";
import { MOOD_EMOJIS, MOOD_LABELS } from "@/types";

interface CheckInData {
  sleep_quality: number;
  sleep_hours?: number;
  meal_quality: number;
  mood: MoodValue;
  meltdowns: number;
  meltdown_triggers?: string;
  communication_level: number;
  routine_adherence: number;
  sensory_issues?: string;
  notes?: string;
}

interface DailyCheckInProps {
  onComplete: (data: CheckInData) => void;
  onClose: () => void;
}

const STEPS = [
  { key: "sleep", label: "Sleep", icon: Moon, question: "How did your child sleep last night?" },
  { key: "meals", label: "Meals", icon: Utensils, question: "How were meals today?" },
  { key: "mood", label: "Mood", icon: Smile, question: "What was the overall mood today?" },
  { key: "meltdowns", label: "Meltdowns", icon: AlertTriangle, question: "Any meltdowns or difficult moments?" },
  { key: "communication", label: "Communication", icon: MessageSquare, question: "How was communication today?" },
  { key: "routine", label: "Routine", icon: Clock, question: "How well were routines followed?" },
  { key: "notes", label: "Notes", icon: StickyNote, question: "Anything else you'd like to note?" },
] as const;

function RatingSelector({ value, onChange, labels }: { value: number; onChange: (v: number) => void; labels: string[] }) {
  return (
    <div className="flex gap-2 justify-center mt-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
            value === n
              ? "bg-amber-500 text-white scale-110 shadow-lg shadow-amber-200"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <span className="text-lg">{n}</span>
          <span className="text-[10px] opacity-70">{labels[n - 1]}</span>
        </button>
      ))}
    </div>
  );
}

export function DailyCheckIn({ onComplete, onClose }: DailyCheckInProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CheckInData>({
    sleep_quality: 3,
    meal_quality: 3,
    mood: "okay",
    meltdowns: 0,
    communication_level: 3,
    routine_adherence: 3,
  });

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const handleNext = () => {
    if (isLast) {
      onComplete(data);
    } else {
      setStep((s) => s + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep.key) {
      case "sleep":
        return (
          <RatingSelector
            value={data.sleep_quality}
            onChange={(v) => setData({ ...data, sleep_quality: v })}
            labels={["Poor", "Fair", "Okay", "Good", "Great"]}
          />
        );
      case "meals":
        return (
          <RatingSelector
            value={data.meal_quality}
            onChange={(v) => setData({ ...data, meal_quality: v })}
            labels={["Poor", "Fair", "Okay", "Good", "Great"]}
          />
        );
      case "mood":
        return (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {(Object.entries(MOOD_LABELS) as [MoodValue, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setData({ ...data, mood: key })}
                className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                  data.mood === key
                    ? "bg-amber-500 text-white scale-105 shadow-lg shadow-amber-200"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <span>{MOOD_EMOJIS[key]}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        );
      case "meltdowns":
        return (
          <div className="space-y-4 mt-4">
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setData({ ...data, meltdowns: n })}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium transition-all ${
                    data.meltdowns === n
                      ? "bg-amber-500 text-white scale-110 shadow-lg shadow-amber-200"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {n === 5 ? "5+" : n}
                </button>
              ))}
            </div>
            {data.meltdowns > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Textarea
                  placeholder="What seemed to trigger them? (optional)"
                  value={data.meltdown_triggers || ""}
                  onChange={(e) => setData({ ...data, meltdown_triggers: e.target.value })}
                  className="mt-2 rounded-xl border-stone-200 text-sm"
                  rows={2}
                />
              </motion.div>
            )}
          </div>
        );
      case "communication":
        return (
          <RatingSelector
            value={data.communication_level}
            onChange={(v) => setData({ ...data, communication_level: v })}
            labels={["Low", "Below", "Typical", "Good", "Great"]}
          />
        );
      case "routine":
        return (
          <RatingSelector
            value={data.routine_adherence}
            onChange={(v) => setData({ ...data, routine_adherence: v })}
            labels={["None", "Some", "Most", "Well", "Fully"]}
          />
        );
      case "notes":
        return (
          <div className="mt-4">
            <Textarea
              placeholder="Any observations, wins, or concerns... (optional)"
              value={data.notes || ""}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
              className="rounded-xl border-stone-200 text-sm min-h-[100px]"
              rows={4}
            />
            <Textarea
              placeholder="Any sensory issues today? (optional)"
              value={data.sensory_issues || ""}
              onChange={(e) => setData({ ...data, sensory_issues: e.target.value })}
              className="mt-3 rounded-xl border-stone-200 text-sm"
              rows={2}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-amber-50/50 to-white">
      {/* Progress */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="text-sm text-stone-500 hover:text-stone-700">
            Cancel
          </button>
          <span className="text-xs text-stone-400">
            {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-amber-400" : "bg-stone-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm text-center"
          >
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <currentStep.icon className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-stone-800 mb-1">
              {currentStep.question}
            </h3>
            <p className="text-sm text-stone-500">
              {currentStep.label} check-in for today
            </p>

            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 flex gap-3">
        {!isFirst && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 h-12 rounded-xl border-stone-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          className={`flex-1 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-200/50 ${
            isFirst ? "w-full" : ""
          }`}
        >
          {isLast ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Complete
            </>
          ) : (
            <>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUp,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  Globe,
  HeartHandshake,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  Moon,
  ShieldCheck,
  Sparkles,
  Square,
  Utensils,
  Waves,
  Zap,
  Users,
  Repeat,
  Heart,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/hooks/use-chat";
import type {
  BehavioralInsight,
  ChildProfile,
  DailyCheckIn,
  MoodValue,
  SupportSnippet,
} from "@/types";
import { MOOD_LABELS } from "@/types";
import { getSnippetText } from "@/lib/support-snippets";
import { cn } from "@/lib/utils";
import type { TherapistReport } from "@/lib/daya/report";
import type { FoodPlan } from "@/lib/daya/food-planner";
import type { BehavioralWeights } from "@/lib/daya/behavioral-weights";
import type { RoutineChange } from "@/lib/daya/routine-detector";
import type { SupportedLanguage } from "@/lib/daya/i18n";
import {
  LANGUAGE_META,
  UI_TRANSLATIONS,
  getQuickChips,
  loadLanguagePreference,
  saveLanguagePreference,
} from "@/lib/daya/i18n";


type DayaContextResponse = {
  child?: ChildProfile;
  recentCheckIns: DailyCheckIn[];
  insights: BehavioralInsight[];
  supportSnippets: SupportSnippet[];
  persistence: "supabase" | "demo";
};

type DailyPlanResponse = {
  routinePlan: {
    title: string;
    sections: Array<{ period: string; emoji: string; label: string; items: string[] }>;
    behavioralPrep: Array<{ pattern: string; suggestion: string }>;
    parentSupport: string[];
    note: string;
  };
  foodPlan: FoodPlan;
  behavioralWeights?: BehavioralWeights;
  routineChanges?: RoutineChange[];
  child: { name: string; age?: number } | null;
  checkInCount: number;
};

type CheckInResponse = {
  summaryPrompt: string;
  behavioralWeights?: BehavioralWeights;
  routineChanges?: RoutineChange[];
};

type CheckInForm = {
  sleep_quality: number;
  sleep_hours: string;
  meal_quality: number;
  mood: MoodValue;
  meltdowns: number;
  meltdown_triggers: string;
  communication_level: number;
  routine_adherence: number;
  sensory_load: number;
  sensory_issues: string;
  difficult_period: DailyCheckIn["difficult_period"];
  energy_level: number;
  hyperactivity: number;
  social_interaction: number;
  repetitive_behaviors: number;
  activities: string;
  parent_stress: number;
  parent_notes: string;
  notes: string;
};

type ActiveTab = "chat" | "plan" | "report";

const suggestions = [
  "Aarav had a hard evening after a loud birthday party.",
  "Can you help me plan tomorrow based on today's check-in?",
  "We had a good communication day today.",
  "I'm feeling exhausted — what should tomorrow look like?",
];

const emptyForm: CheckInForm = {
  sleep_quality: 3,
  sleep_hours: "8",
  meal_quality: 3,
  mood: "okay",
  meltdowns: 0,
  meltdown_triggers: "",
  communication_level: 3,
  routine_adherence: 3,
  sensory_load: 3,
  sensory_issues: "",
  difficult_period: "none",
  energy_level: 3,
  hyperactivity: 3,
  social_interaction: 3,
  repetitive_behaviors: 2,
  activities: "",
  parent_stress: 3,
  parent_notes: "",
  notes: "",
};

export function DayaChat() {
  // ── Language state ─────────────────────────────────────────────────────────
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = UI_TRANSLATIONS[language];

  useEffect(() => {
    setLanguage(loadLanguagePreference());
  }, []);

  function changeLanguage(lang: SupportedLanguage) {
    setLanguage(lang);
    saveLanguagePreference(lang);
    setShowLangMenu(false);
  }

  // ── Chat state ─────────────────────────────────────────────────────────────
  const { messages, isLoading, sendMessage, stop } = useChat(language);
  const [input, setInput] = useState("");
  const [context, setContext] = useState<DayaContextResponse | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [savingCheckIn, setSavingCheckIn] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [behavioralWeights, setBehavioralWeights] = useState<BehavioralWeights | null>(null);
  const [routineChanges, setRoutineChanges] = useState<RoutineChange[]>([]);
  const [lastCheckInTime, setLastCheckInTime] = useState<number>(0);
  const endRef = useRef<HTMLDivElement>(null);

  // ── Voice input ────────────────────────────────────────────────────────────
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  function startVoiceInput() {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SR() as any;
    recognitionRef.current = recognition;
    const langMap: Record<string, string> = { en:"en-IN", hi:"hi-IN", ta:"ta-IN", te:"te-IN", bn:"bn-IN", mr:"mr-IN", kn:"kn-IN", gu:"gu-IN" };
    recognition.lang = langMap[language] ?? "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = Array.from(event.results as any[]).map((r: any) => r[0].transcript as string).join("");
      setInput(transcript);
    };
    recognition.start();
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  const childName = context?.child?.name ?? "Aarav";
  const topInsight = context?.insights?.[0];
  const quickChips = getQuickChips(t, childName, language);


  const refreshContext = useCallback(async () => {
    const response = await fetch("/api/context", { cache: "no-store" });
    if (!response.ok) return;
    setContext((await response.json()) as DayaContextResponse);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/context", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setContext(data as DayaContextResponse);
      })
      .finally(() => {
        if (!cancelled) setContextLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  function handleSend(message = input) {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    setActiveTab("chat");
    sendMessage(trimmed);
    setInput("");
  }

  async function handleCheckInSubmit(form: CheckInForm) {
    setSavingCheckIn(true);
    try {
      const response = await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sleep_hours: Number(form.sleep_hours) || undefined,
        }),
      });

      if (!response.ok) throw new Error("Check-in failed");
      const result = (await response.json()) as CheckInResponse;

      if (result.behavioralWeights) setBehavioralWeights(result.behavioralWeights);
      if (result.routineChanges) setRoutineChanges(result.routineChanges);
      setLastCheckInTime(Date.now());

      await refreshContext();
      setShowCheckIn(false);
      handleSend(result.summaryPrompt);
    } finally {
      setSavingCheckIn(false);
    }
  }

  return (
    <div className="flex-1 h-full overflow-hidden bg-white text-slate-950 flex flex-col">
      {/* Chat Specific Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-5 text-daya-sage-dark" />
          <h2 className="font-semibold text-daya-text">DAYA Intelligence</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl border-slate-200 bg-white px-3 text-xs"
              onClick={() => setShowLangMenu((v) => !v)}
            >
              <Globe className="size-3.5" />
              <span className="hidden sm:inline">{LANGUAGE_META[language].nativeName}</span>
              <ChevronDown className="size-3" />
            </Button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 z-50 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                >
                  {(Object.keys(LANGUAGE_META) as SupportedLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-slate-50",
                        language === lang && "bg-teal-50 font-medium text-teal-700"
                      )}
                    >
                      <span className="text-base">{LANGUAGE_META[lang].flag}</span>
                      <span>{LANGUAGE_META[lang].nativeName}</span>
                      {language === lang && <Check className="ml-auto size-3.5 text-teal-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Badge className="hidden rounded-md border-daya-sage/30 bg-daya-sage-light text-daya-sage-dark sm:inline-flex">
            {context?.persistence === "supabase" ? "Live" : "Demo"}
          </Badge>
        </div>
      </div>

      <main className="flex-1 grid grid-cols-1 overflow-hidden lg:grid-cols-[1fr_360px]">
        {activeTab === "chat" && (
          <section className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            {messages.length === 0 ? (
              <EmptyState
                childName={childName}
                topInsight={topInsight}
                contextLoading={contextLoading}
                onSuggestion={handleSend}
                onCheckIn={() => setShowCheckIn(true)}
                quickChips={quickChips}
                t={t}
              />
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="mx-auto flex max-w-3xl flex-col gap-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isLoading && <TypingRow label={t.typing} />}
                  <div ref={endRef} />
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
              <div className="mx-auto max-w-3xl">
                {/* Quick chips — only show in active message state */}
                {messages.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {quickChips.slice(0, 4).map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => handleSend(chip.message)}
                        disabled={isLoading}
                        className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-40"
                      >
                        <span>{chip.emoji}</span> {chip.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-2 rounded-lg border border-slate-200 bg-[#f8faf9] p-2 shadow-sm">
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={t.placeholder}
                    className="max-h-36 min-h-11 resize-none border-0 bg-transparent px-2 py-2 text-[15px] shadow-none focus-visible:ring-0"
                    rows={1}
                  />
                  {/* Voice input button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "size-10 rounded-lg transition",
                      isListening
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                  >
                    {isListening ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                        <MicOff className="size-4" />
                      </motion.div>
                    ) : (
                      <Mic className="size-4" />
                    )}
                  </Button>
                  {isLoading ? (
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-10 rounded-lg border-slate-200 bg-white"
                      onClick={stop}
                      aria-label="Stop response"
                    >
                      <Square className="size-4 text-rose-600" aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      className="size-10 rounded-lg bg-slate-950 text-white hover:bg-slate-800"
                      disabled={!input.trim()}
                      onClick={() => handleSend()}
                      aria-label="Send message"
                    >
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-center text-xs text-slate-500">
                  {t.disclaimer}
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "plan" && (
          <section className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            <DailyPlanView childName={childName} />
          </section>
        )}

        {activeTab === "report" && (
          <section className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            <ReportView childName={childName} />
          </section>
        )}

        <ContextPanel
          context={context}
          loading={contextLoading}
          behavioralWeights={behavioralWeights}
          routineChanges={routineChanges}
          lastCheckInTime={lastCheckInTime}
        />
      </main>

      <AnimatePresence>
        {showCheckIn && (
          <CheckInOverlay
            childName={childName}
            saving={savingCheckIn}
            onClose={() => setShowCheckIn(false)}
            onSubmit={handleCheckInSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Daily Plan View ─── */

function DailyPlanView({ childName }: { childName: string }) {
  const [plan, setPlan] = useState<DailyPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/daily-plan", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPlan(data as DailyPlanResponse);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-teal-700" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-slate-500">Unable to load plan. Try logging a check-in first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            🗓️ {plan.routinePlan.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Based on {plan.checkInCount} days of check-in data
          </p>
        </div>

        {/* Behavioral Weights Banner */}
        {plan.behavioralWeights && (
          <div className={cn(
            "rounded-lg border p-4",
            plan.behavioralWeights.recommendation_mode === "recovery"
              ? "border-rose-200 bg-rose-50/50"
              : plan.behavioralWeights.recommendation_mode === "growth"
                ? "border-green-200 bg-green-50/50"
                : "border-amber-200 bg-amber-50/50"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4" aria-hidden="true" />
                <span>
                  {plan.behavioralWeights.recommendation_mode === "recovery"
                    ? "Recovery Mode"
                    : plan.behavioralWeights.recommendation_mode === "growth"
                      ? "Growth Mode"
                      : "Stabilization Mode"}
                </span>
              </div>
              <span className="text-xs text-slate-600">
                Stability: {Math.round(plan.behavioralWeights.overall_stability * 100)}%
                {" · "}Trend: {plan.behavioralWeights.trending}
              </span>
            </div>
            {plan.behavioralWeights.active_concerns.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {plan.behavioralWeights.active_concerns.map((c) => (
                  <Badge key={c} className="rounded-md border-amber-200 bg-amber-100 text-[10px] text-amber-800">
                    {c.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Routine Changes */}
        {plan.routineChanges && plan.routineChanges.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
            <h3 className="mb-3 text-sm font-semibold text-amber-900">
              Detected Changes
            </h3>
            <ul className="space-y-2">
              {plan.routineChanges.map((change, i) => (
                <li key={i} className="text-sm">
                  <p className="font-medium text-amber-900">
                    {change.severity === "significant" ? "!!!" : change.severity === "moderate" ? "!!" : "!"}{" "}
                    {change.description}
                  </p>
                  <p className="mt-0.5 text-amber-800">{change.recommendation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Routine Sections */}
        {plan.routinePlan.sections.map((section) => (
          <div
            key={section.period}
            className="rounded-lg border border-slate-200 bg-[#f8faf9] p-4"
          >
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {section.emoji} {section.label}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-teal-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Behavioral Preparation */}
        {plan.routinePlan.behavioralPrep.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-amber-900">
              🔮 Behavioral Preparation
            </h3>
            <ul className="space-y-3">
              {plan.routinePlan.behavioralPrep.map((prep, i) => (
                <li key={i} className="text-sm">
                  <p className="font-medium text-amber-900">{prep.pattern}</p>
                  <p className="mt-1 text-amber-800">→ {prep.suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Food Plan */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            🍽️ {plan.foodPlan.title}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.foodPlan.meals.map((meal) => (
              <div key={meal.time} className="rounded-lg bg-[#f8faf9] p-3">
                <p className="mb-2 text-xs font-semibold text-slate-700">
                  {meal.emoji} {meal.label}
                </p>
                <ul className="space-y-1.5">
                  {meal.items.map((item, i) => (
                    <li key={i} className="text-xs leading-5 text-slate-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-sky-50 p-3">
            <p className="mb-1 text-xs font-semibold text-sky-800">💧 Hydration</p>
            {plan.foodPlan.hydration.map((item, i) => (
              <p key={i} className="text-xs leading-5 text-sky-700">
                • {item}
              </p>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">💛 {plan.foodPlan.note}</p>
        </div>

        {/* Parent Support */}
        {plan.routinePlan.parentSupport.length > 0 && (
          <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-rose-900">
              🤍 For You, the Parent
            </h3>
            <ul className="space-y-2">
              {plan.routinePlan.parentSupport.map((item, i) => (
                <li key={i} className="text-sm leading-6 text-rose-800">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Plan Note */}
        <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4">
          <p className="text-sm text-teal-800">💛 {plan.routinePlan.note}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Therapist Report View ─── */

function ReportView({ childName }: { childName: string }) {
  const [report, setReport] = useState<TherapistReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/report", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setReport(data as TherapistReport);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDownload() {
    const response = await fetch("/api/report?format=text", { cache: "no-store" });
    if (!response.ok) return;
    const text = await response.text();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daya-report-${childName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-teal-700" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-slate-500">Unable to generate report. Log more check-ins first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{report.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {report.period.start} to {report.period.end} · {report.period.totalDays} days
            </p>
          </div>
          <Button
            variant="outline"
            className="h-9 shrink-0 rounded-lg border-slate-200"
            onClick={handleDownload}
          >
            <Download className="size-4" aria-hidden="true" />
            Download
          </Button>
        </div>

        {report.sections.map((section, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {section.emoji} {section.title}
            </h3>
            <ul className="space-y-2">
              {section.content.map((line, j) => (
                <li key={j} className="text-sm leading-6 text-slate-700">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs leading-5 text-amber-800">
            ⚠️ {report.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty State ─── */

function EmptyState({
  childName,
  topInsight,
  contextLoading,
  onSuggestion,
  onCheckIn,
  quickChips,
  t,
}: {
  childName: string;
  topInsight?: BehavioralInsight;
  contextLoading: boolean;
  onSuggestion: (message: string) => void;
  onCheckIn: () => void;
  quickChips: Array<{ label: string; message: string; emoji: string }>;
  t: import("@/lib/daya/i18n").UIStrings;
}) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <Brain className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            {t.welcome_title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {t.welcome_sub}
          </p>
        </div>

        {contextLoading ? (
          <div className="mx-auto mb-5 flex max-w-xl items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading memory
          </div>
        ) : topInsight ? (
          <div className="mx-auto mb-5 max-w-xl rounded-lg border border-teal-200 bg-teal-50/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-teal-800">
              <Sparkles className="size-4" aria-hidden="true" />
              {topInsight.title}
            </div>
            <p className="text-sm leading-6 text-teal-950">
              {topInsight.description}
            </p>
          </div>
        ) : null}

        {/* Quick chips grid on empty state */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSuggestion(chip.message)}
              className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left text-sm leading-5 text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50"
            >
              <span className="text-base">{chip.emoji}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex justify-center">
          <Button
            variant="outline"
            className="h-10 rounded-lg border-slate-200 bg-white"
            onClick={onCheckIn}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            {t.checkin_button}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Message Bubble ─── */

function MessageBubble({ message }: { message: ReturnType<typeof useChat>["messages"][number] }) {
  const isUser = message.role === "user";
  const created = message.timestamp ?? new Date(message.created_at ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-teal-700 shadow-sm ring-1 ring-teal-200/50">
          <HeartHandshake className="size-5" aria-hidden="true" />
        </div>
      )}
      <div
        className={cn(
          "relative max-w-[min(85%,720px)] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm",
          isUser
            ? "bg-slate-950 text-white shadow-slate-950/10"
            : "border border-slate-200 bg-white/95 text-slate-800 backdrop-blur-sm shadow-slate-200/50"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Grounding Indicator (Preparatory) */}
        {!isUser && message.content.length > 50 && (
          <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] font-medium tracking-wide text-teal-700 uppercase">
            <ShieldCheck className="size-3" />
            Grounded in Daya Knowledge Base
          </div>
        )}

        <div
          className={cn(
            "mt-2 text-[10px] font-medium opacity-60",
            isUser ? "text-white" : "text-slate-400"
          )}
        >
          {format(created, "h:mm a")}
        </div>
      </div>
    </motion.div>
  );
}

function TypingRow({ label }: { label?: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
        <HeartHandshake className="size-4" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-[#f8faf9] px-4 py-3 shadow-sm">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            className="size-2 rounded-full bg-slate-400"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1, repeat: Infinity, delay: item * 0.16 }}
          />
        ))}
        {label && <span className="ml-1 text-xs text-slate-400">{label}</span>}
      </div>
    </div>
  );
}

/* ─── Context Panel ─── */

function ContextPanel({
  context,
  loading,
  behavioralWeights,
  routineChanges,
  lastCheckInTime,
}: {
  context: DayaContextResponse | null;
  loading: boolean;
  behavioralWeights: BehavioralWeights | null;
  routineChanges: RoutineChange[];
  lastCheckInTime: number;
}) {
  const latestCheckIn = context?.recentCheckIns?.at(-1);
  const support = context?.supportSnippets?.slice(0, 3) ?? [];
  const isRecent = lastCheckInTime > 0 && Date.now() - lastCheckInTime < 60_000;

  return (
    <aside className="hidden min-h-0 overflow-y-auto bg-[#f6f8f6] px-4 py-5 lg:block">
      <div className="space-y-4">
        <PanelSection
          icon={ShieldCheck}
          title="Safety Boundary"
          text="Observation, memory, and parent support only."
        />

        {/* Behavioral State — live adaptive display */}
        {behavioralWeights && (
          <section className={cn(
            "rounded-lg border p-4 shadow-sm transition-colors",
            isRecent
              ? "border-teal-300 bg-teal-50 ring-2 ring-teal-200"
              : "border-slate-200 bg-white"
          )}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Sparkles className="size-4 text-teal-700" aria-hidden="true" />
                Behavioral State
              </div>
              {isRecent && (
                <Badge className="rounded-md border-teal-300 bg-teal-100 text-[10px] text-teal-800">
                  Updated
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Mode</span>
                <Badge className={cn(
                  "rounded-md text-[10px]",
                  behavioralWeights.recommendation_mode === "recovery"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : behavioralWeights.recommendation_mode === "growth"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                )}>
                  {behavioralWeights.recommendation_mode}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Stability</span>
                <span className="font-medium text-slate-900">
                  {Math.round(behavioralWeights.overall_stability * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Trend</span>
                <span className={cn(
                  "font-medium",
                  behavioralWeights.trending === "improving" ? "text-green-700"
                    : behavioralWeights.trending === "declining" ? "text-rose-700"
                    : "text-slate-600"
                )}>
                  {behavioralWeights.trending === "improving" ? "Improving" : behavioralWeights.trending === "declining" ? "Declining" : "Stable"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Meltdown Risk</span>
                <WeightBar value={behavioralWeights.meltdown_risk} />
              </div>
              {behavioralWeights.active_concerns.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {behavioralWeights.active_concerns.slice(0, 4).map((concern) => (
                    <Badge
                      key={concern}
                      className="rounded-md border-amber-200 bg-amber-50 text-[10px] text-amber-700"
                    >
                      {concern.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              )}
              {behavioralWeights.strengths.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {behavioralWeights.strengths.slice(0, 3).map((strength) => (
                    <Badge
                      key={strength}
                      className="rounded-md border-green-200 bg-green-50 text-[10px] text-green-700"
                    >
                      {strength.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Routine Changes — displayed when detected */}
        {routineChanges.length > 0 && (
          <section className={cn(
            "rounded-lg border p-4 shadow-sm",
            isRecent ? "border-amber-300 bg-amber-50 ring-2 ring-amber-200" : "border-amber-200 bg-amber-50/50"
          )}>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-900">
              <Activity className="size-4" aria-hidden="true" />
              Detected Changes
            </div>
            <div className="space-y-2">
              {routineChanges.slice(0, 3).map((change, i) => (
                <div key={i} className="text-xs">
                  <p className="font-medium text-amber-900">
                    {change.severity === "significant" ? "!!!" : change.severity === "moderate" ? "!!" : "!"}{" "}
                    {change.description}
                  </p>
                  <p className="mt-0.5 text-amber-800">{change.recommendation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Activity className="size-4 text-rose-600" aria-hidden="true" />
            Latest Check-In
          </div>
          {loading ? (
            <SkeletonLines />
          ) : latestCheckIn ? (
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <Metric label="Sleep" value={`${latestCheckIn.sleep_quality}/5`} />
              <Metric label="Meals" value={`${latestCheckIn.meal_quality}/5`} />
              <Metric label="Mood" value={MOOD_LABELS[latestCheckIn.mood]} />
              <Metric label="Meltdowns" value={String(latestCheckIn.meltdowns)} />
              <Metric label="Routine" value={`${latestCheckIn.routine_adherence}/5`} />
              <Metric label="Sensory" value={`${latestCheckIn.sensory_load ?? 3}/5`} />
              <Metric label="Energy" value={`${latestCheckIn.energy_level ?? 3}/5`} />
              <Metric label="Parent Stress" value={`${latestCheckIn.parent_stress ?? 3}/5`} />
            </div>
          ) : (
            <p className="text-sm text-slate-500">No check-ins yet.</p>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Brain className="size-4 text-teal-700" aria-hidden="true" />
            Observed Patterns
          </div>
          {loading ? (
            <SkeletonLines />
          ) : context?.insights?.length ? (
            <div className="space-y-3">
              {context.insights.slice(0, 4).map((insight) => (
                <div key={insight.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-slate-900">
                    {insight.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Patterns will appear with more logs.</p>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
            <Waves className="size-4 text-sky-700" aria-hidden="true" />
            Support Ideas
          </div>
          {loading ? (
            <SkeletonLines />
          ) : support.length ? (
            <div className="space-y-3">
              {support.map((snippet) => (
                <div key={snippet.id}>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {snippet.category.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-700">
                    {getSnippetText(snippet)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Support ideas appear beside context.</p>
          )}
        </section>
      </div>
    </aside>
  );
}

function WeightBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-slate-200">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            pct >= 60 ? "bg-rose-500" : pct >= 35 ? "bg-amber-500" : "bg-green-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={cn(
        "text-xs font-medium",
        pct >= 60 ? "text-rose-700" : pct >= 35 ? "text-amber-700" : "text-green-700"
      )}>
        {pct}%
      </span>
    </div>
  );
}

function PanelSection({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f8faf9] p-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function SkeletonLines() {
  return (
    <div className="space-y-2">
      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

/* ─── Check-In Overlay ─── */

function CheckInOverlay({
  childName,
  saving,
  onClose,
  onSubmit,
}: {
  childName: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: CheckInForm) => void;
}) {
  const [form, setForm] = useState<CheckInForm>(emptyForm);

  const childMetrics = useMemo(
    () => [
      { key: "sleep_quality" as const, label: "Sleep", icon: Moon, value: form.sleep_quality },
      { key: "meal_quality" as const, label: "Meals", icon: Utensils, value: form.meal_quality },
      { key: "communication_level" as const, label: "Communication", icon: Brain, value: form.communication_level },
      { key: "routine_adherence" as const, label: "Routine", icon: Clock3, value: form.routine_adherence },
      { key: "sensory_load" as const, label: "Sensory load", icon: Waves, value: form.sensory_load },
      { key: "energy_level" as const, label: "Energy", icon: Zap, value: form.energy_level },
      { key: "hyperactivity" as const, label: "Hyperactivity", icon: Activity, value: form.hyperactivity },
      { key: "social_interaction" as const, label: "Social", icon: Users, value: form.social_interaction },
      { key: "repetitive_behaviors" as const, label: "Repetitive Behaviors", icon: Repeat, value: form.repetitive_behaviors },
    ],
    [form]
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-950/20 p-3 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.22 }}
        className="ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Daily check-in
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A quick log for {childName}
              </p>
            </div>
            <Button variant="ghost" className="rounded-lg" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            {/* Child Metrics */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Child&apos;s Day
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {childMetrics.map(({ key, label, icon: Icon, value }) => (
                  <div key={key} className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                        <Icon className="size-4 text-teal-700" aria-hidden="true" />
                        {label}
                      </div>
                      <span className="text-xs text-slate-400">{value}/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          aria-label={`${label} ${rating}`}
                          onClick={() =>
                            setForm((current) => ({ ...current, [key]: rating }))
                          }
                          className={cn(
                            "h-8 flex-1 rounded-md border text-xs transition",
                            value === rating
                              ? "border-teal-700 bg-teal-700 text-white"
                              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Counts */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-800">
                Sleep hours
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.sleep_hours}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sleep_hours: event.target.value,
                    }))
                  }
                  className="mt-2 h-10 rounded-lg"
                />
              </label>
              <label className="text-sm font-medium text-slate-800">
                Meltdowns
                <Input
                  type="number"
                  min="0"
                  value={form.meltdowns}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      meltdowns: Math.max(0, Number(event.target.value)),
                    }))
                  }
                  className="mt-2 h-10 rounded-lg"
                />
              </label>
            </div>

            {/* Mood */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-800">Mood</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(Object.entries(MOOD_LABELS) as [MoodValue, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, mood: key }))}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm transition",
                        form.mood === key
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Difficult period */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-800">
                Hardest part of day
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(["none", "morning", "afternoon", "evening", "night"] as const).map(
                  (period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          difficult_period: period,
                        }))
                      }
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm capitalize transition",
                        form.difficult_period === period
                          ? "border-rose-700 bg-rose-700 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {period}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Text fields */}
            <Textarea
              value={form.meltdown_triggers}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  meltdown_triggers: event.target.value,
                }))
              }
              placeholder="Meltdown triggers or context"
              className="min-h-16 rounded-lg"
            />
            <Textarea
              value={form.sensory_issues}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sensory_issues: event.target.value,
                }))
              }
              placeholder="Sensory notes"
              className="min-h-16 rounded-lg"
            />
            <Textarea
              value={form.activities}
              onChange={(event) =>
                setForm((current) => ({ ...current, activities: event.target.value }))
              }
              placeholder="Activities today (e.g., water play, drawing, outdoor walk)"
              className="min-h-16 rounded-lg"
            />
            <Textarea
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Any wins, worries, routines, meals, or communication notes"
              className="min-h-20 rounded-lg"
            />

            {/* Parent section */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                How Are You Feeling?
              </p>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Heart className="size-4 text-rose-500" aria-hidden="true" />
                    Your stress level
                  </div>
                  <span className="text-xs text-slate-400">{form.parent_stress}/5</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      aria-label={`Parent stress ${rating}`}
                      onClick={() =>
                        setForm((current) => ({ ...current, parent_stress: rating }))
                      }
                      className={cn(
                        "h-8 flex-1 rounded-md border text-xs transition",
                        form.parent_stress === rating
                          ? "border-rose-600 bg-rose-600 text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                value={form.parent_notes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, parent_notes: event.target.value }))
                }
                placeholder="How are you feeling today? (This stays private — DAYA uses it to support you better)"
                className="mt-3 min-h-20 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-4">
          <Button
            disabled={saving}
            onClick={() => onSubmit(form)}
            className="h-11 w-full rounded-lg bg-slate-950 text-white hover:bg-slate-800"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="size-4" aria-hidden="true" />
            )}
            Save and ask DAYA
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

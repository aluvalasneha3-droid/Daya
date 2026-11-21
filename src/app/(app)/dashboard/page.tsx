"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  HeartPulse,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { getAccessToken } from "@/lib/auth-client";
import type { BehavioralInsight, ChildProfile, DailyCheckIn, MoodValue } from "@/types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const periods = [
  { id: "morning", label: "Morning", icon: Sun },
  { id: "afternoon", label: "Afternoon", icon: Clock },
  { id: "evening", label: "Evening", icon: Sparkles },
  { id: "night", label: "Night", icon: Moon },
] as const;

type Period = (typeof periods)[number]["id"];
type PlanTask = {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
};
type PlanSection = { period: Period; items: PlanTask[] };
type DashboardContext = {
  child?: ChildProfile;
  recentCheckIns: DailyCheckIn[];
  insights: BehavioralInsight[];
  persistence: "supabase" | "demo";
};
type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  date: string;
  icon: typeof ClipboardList;
  color: string;
};

function localDate(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function moodLabel(mood?: MoodValue) {
  if (!mood) return "Not logged";
  return {
    great: "Great",
    good: "Good",
    okay: "Okay",
    difficult: "Difficult",
    very_difficult: "Very difficult",
  }[mood];
}

function moodValue(mood: MoodValue) {
  return {
    very_difficult: 1,
    difficult: 2,
    okay: 3,
    good: 4,
    great: 5,
  }[mood];
}

function readableDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function emptyPlan(): PlanSection[] {
  return periods.map(({ id }) => ({ period: id, items: [] }));
}

export default function DashboardPage() {
  const [today, setToday] = useState("");
  const [greeting, setGreeting] = useState("Hello");
  const [context, setContext] = useState<DashboardContext | null>(null);
  const [sections, setSections] = useState<PlanSection[]>(emptyPlan);
  const [loading, setLoading] = useState(true);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      const now = new Date();
      const hour = now.getHours();
      setToday(localDate(now));
      setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
    });
  }, []);

  useEffect(() => {
    if (!today) return;
    const controller = new AbortController();

    void (async () => {
      try {
        const token = await getAccessToken();
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
        const [contextResponse, planResponse] = await Promise.all([
          fetch("/api/context", { cache: "no-store", headers, signal: controller.signal }),
          fetch(`/api/planner?date=${encodeURIComponent(today)}`, {
            cache: "no-store",
            headers,
            signal: controller.signal,
          }),
        ]);
        const contextResult = (await contextResponse.json()) as DashboardContext & { error?: string };
        const planResult = (await planResponse.json()) as { sections?: PlanSection[]; error?: string };
        if (!contextResponse.ok) throw new Error(contextResult.error ?? "Could not load your family dashboard.");
        if (!planResponse.ok) throw new Error(planResult.error ?? "Could not load today's saved plan.");
        if (!controller.signal.aborted) {
          setContext(contextResult);
          setSections(planResult.sections ?? emptyPlan());
        }
      } catch (caught) {
        if (!controller.signal.aborted) {
          setError(caught instanceof Error ? caught.message : "Could not load your family dashboard.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [today, reloadKey]);

  if (loading || !today) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-12 rounded-full border-2 border-daya-sage border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="size-5 text-daya-sage-dark animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-medium text-daya-text-secondary">Loading your saved family data…</p>
        </div>
      </div>
    );
  }

  const childName = context?.child?.name ?? "your child";
  const checkIns = context?.recentCheckIns ?? [];
  const insights = context?.insights ?? [];
  const todayCheckIn = checkIns.find((item) => item.date === today);
  const latestCheckIn = checkIns.at(-1);
  const activeCheckIn = todayCheckIn ?? latestCheckIn;
  const completedTasks = sections.reduce(
    (count, section) => count + section.items.filter((task) => task.completed).length,
    0
  );
  const totalTasks = sections.reduce((count, section) => count + section.items.length, 0);

  const lastSevenDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${today}T00:00:00`);
    date.setDate(date.getDate() - (6 - index));
    return localDate(date);
  });
  const checkInsByDate = new Map(checkIns.map((item) => [item.date, item]));

  const activity: ActivityItem[] = [
    ...checkIns.map((item) => ({
      id: `checkin-${item.id}`,
      title: "Daily check-in",
      detail: `${moodLabel(item.mood)} mood${item.sleep_hours != null ? ` · ${item.sleep_hours} hours of sleep` : ""}${item.notes ? ` · ${item.notes}` : ""}`,
      date: item.date,
      icon: ClipboardList,
      color: "text-daya-sage-dark",
    })),
    ...insights.map((item) => ({
      id: `insight-${item.id}`,
      title: item.title,
      detail: item.description,
      date: item.created_at.slice(0, 10),
      icon: Brain,
      color: "text-[#8B75A1]",
    })),
  ]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 5);

  async function toggleTask(period: Period, task: PlanTask) {
    const previousSections = sections;
    const nextSections = sections.map((section) =>
      section.period === period
        ? {
            ...section,
            items: section.items.map((item) =>
              item.id === task.id ? { ...item, completed: !item.completed } : item
            ),
          }
        : section
    );

    setSections(nextSections);
    setSavingTaskId(task.id);
    setError("");

    try {
      const token = await getAccessToken();
      const response = await fetch("/api/planner", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ date: today, sections: nextSections }),
      });
      const result = (await response.json()) as { sections?: PlanSection[]; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not save this schedule update.");
      setSections(result.sections ?? nextSections);
    } catch (caught) {
      setSections(previousSections);
      setError(caught instanceof Error ? caught.message : "Could not save this schedule update.");
    } finally {
      setSavingTaskId(null);
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-daya-sage-dark">
              <Sun className="size-4" />
              {new Date(`${today}T00:00:00`).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="mb-2 text-3xl font-bold text-daya-text">{greeting}.</h1>
            <p className="text-daya-text-secondary">
              {activeCheckIn
                ? `Your dashboard is based on ${childName}'s saved check-ins and your schedule.`
                : `Your family dashboard is ready. Add a check-in or plan activities to see your own information here.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="group flex items-center justify-center gap-2 rounded-2xl bg-daya-sage px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-daya-sage-dark hover:shadow-lg hover:shadow-daya-sage/20"
            >
              <MessageCircle className="size-4" />
              Log a check-in
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/planner"
              className="flex items-center justify-center gap-2 rounded-2xl border border-daya-border bg-white px-5 py-3 font-medium text-daya-text transition-colors hover:bg-daya-cream"
            >
              <Calendar className="size-4" />
              Plan your day
            </Link>
          </div>
        </motion.div>

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => {
                setError("");
                setLoading(true);
                setReloadKey((key) => key + 1);
              }}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-daya-sage via-[#8DB585] to-[#7A9E70] p-6 text-white shadow-lg shadow-daya-sage/20 md:p-8"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 size-[300px] rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <HeartPulse className="size-5 text-white/80" />
                <span className="text-sm font-semibold uppercase tracking-wide text-white/80">
                  {todayCheckIn ? "Today's check-in" : "Your family's day"}
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight">
                {todayCheckIn ? moodLabel(todayCheckIn.mood) : "Your own data"}
              </p>
              <p className="mt-2 max-w-lg text-sm text-white/85">
                {todayCheckIn
                  ? `This is based on the check-in you logged today${todayCheckIn.notes ? `: “${todayCheckIn.notes}”` : "."}`
                  : "DAYA will show what you add here—no sample scores or made-up observations."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Sleep",
                  value: todayCheckIn?.sleep_hours != null ? `${todayCheckIn.sleep_hours}h` : "Not logged",
                },
                {
                  label: "Sensory load",
                  value: todayCheckIn?.sensory_load != null ? `${todayCheckIn.sensory_load} / 5` : "Not logged",
                },
                {
                  label: "Meltdowns",
                  value: todayCheckIn ? String(todayCheckIn.meltdowns) : "Not logged",
                },
              ].map((item) => (
                <div key={item.label} className="min-w-[92px] rounded-2xl bg-white/15 px-4 py-3 text-center backdrop-blur-sm">
                  <p className="text-xs font-medium text-white/75">{item.label}</p>
                  <p className="mt-1 text-lg font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Check-in days",
              value: String(checkIns.length),
              sub: checkIns.length ? "Your recorded days" : "Nothing recorded yet",
              icon: ClipboardList,
              color: "bg-daya-sky/20 text-daya-sky",
              border: "border-daya-sky/30",
            },
            {
              label: "Observations",
              value: String(insights.length),
              sub: insights.length ? "Generated from your data" : "More check-ins build your history",
              icon: Brain,
              color: "bg-daya-lavender/30 text-[#8B75A1]",
              border: "border-daya-lavender/50",
            },
            {
              label: "Today's activities",
              value: String(totalTasks),
              sub: totalTasks ? `${completedTasks} marked complete` : "Add your own activities",
              icon: Calendar,
              color: "bg-daya-success/30 text-daya-sage-dark",
              border: "border-daya-success/50",
            },
            {
              label: "Parent stress",
              value: activeCheckIn?.parent_stress != null ? `${activeCheckIn.parent_stress} / 5` : "Not logged",
              sub: activeCheckIn ? `From ${readableDate(activeCheckIn.date)} check-in` : "Optional check-in detail",
              icon: HeartPulse,
              color: "bg-daya-terracotta/20 text-daya-terracotta",
              border: "border-daya-terracotta/30",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={index + 2}
              className="rounded-3xl border border-daya-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={cn("mb-4 flex size-12 items-center justify-center rounded-2xl border", stat.color, stat.border)}>
                <stat.icon className="size-6" />
              </div>
              <p className="mb-1 text-sm font-medium text-daya-text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold text-daya-text">{stat.value}</p>
              <p className="mt-1 text-xs text-daya-text-light">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={6}
            className="rounded-3xl border border-daya-border bg-white p-8 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-daya-text">Your observations</h2>
              <Brain className="size-6 text-daya-sage" />
            </div>
            {insights.length ? (
              <div className="space-y-3">
                {insights.slice(0, 3).map((insight) => (
                  <article key={insight.id} className="rounded-2xl border border-daya-border bg-daya-cream p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-daya-sage-dark" />
                      <h3 className="text-sm font-bold text-daya-text">{insight.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-daya-text-secondary">{insight.description}</p>
                    <p className="mt-2 text-xs text-daya-text-light">
                      {insight.data_points} data point{insight.data_points === 1 ? "" : "s"} · {Math.round(insight.confidence * 100)}% confidence
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-daya-border bg-daya-cream p-6">
                <p className="font-medium text-daya-text">No personal observations yet.</p>
                <p className="mt-1 text-sm text-daya-text-secondary">
                  DAYA only shows observations generated from your own check-ins. There is no sample family data.
                </p>
                <Link href="/chat" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-daya-sage-dark">
                  Add your first check-in <ChevronRight className="size-4" />
                </Link>
              </div>
            )}
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={7}
            className="flex flex-col rounded-3xl border border-daya-border bg-white p-8 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-daya-text">Your plan for today</h2>
                <p className="mt-1 text-sm text-daya-text-light">
                  {totalTasks ? `${completedTasks} of ${totalTasks} activities complete` : "Only activities you add are shown"}
                </p>
              </div>
              <Calendar className="size-6 text-daya-sage" />
            </div>
            <div className="flex-1 space-y-4">
              {sections.map((section) => {
                const period = periods.find((item) => item.id === section.period);
                if (!period) return null;
                const Icon = period.icon;
                return (
                  <div key={section.period}>
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-daya-text-light">
                      <Icon className="size-4" />
                      {period.label}
                    </div>
                    {section.items.length ? (
                      <div className="space-y-2">
                        {section.items.map((task) => (
                          <label
                            key={task.id}
                            className="flex cursor-pointer items-start gap-3 rounded-2xl bg-daya-cream p-3 transition-colors hover:bg-[#F2EDE4]"
                          >
                            <input
                              type="checkbox"
                              aria-label={`Mark ${task.title} complete`}
                              checked={task.completed}
                              disabled={savingTaskId !== null}
                              onChange={() => void toggleTask(section.period, task)}
                              className="mt-1 size-4 accent-daya-sage-dark"
                            />
                            <span className="min-w-0 flex-1">
                              <span className={`block text-sm font-medium text-daya-text ${task.completed ? "line-through opacity-60" : ""}`}>
                                {task.title}
                              </span>
                              {task.time && <span className="text-xs text-daya-text-light">{task.time}</span>}
                              {task.description && (
                                <span className="mt-1 block whitespace-pre-wrap text-xs text-daya-text-secondary">
                                  {task.description}
                                </span>
                              )}
                            </span>
                            {task.completed && <Check className="mt-0.5 size-4 text-daya-sage-dark" />}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl border border-dashed border-daya-border px-3 py-2 text-sm text-daya-text-light">
                        Nothing planned
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {!totalTasks && (
              <p className="mt-4 text-sm text-daya-text-secondary">
                Your daily schedule is empty until you add activities in the planner.
              </p>
            )}
            <Link href="/planner" className="mt-6 block w-full">
              <span className="flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-daya-cream py-3 text-sm font-medium text-daya-text-secondary transition-colors hover:border-daya-border hover:bg-[#F2EDE4] hover:text-daya-text">
                Open Daily Planner <ChevronRight className="size-4" />
              </span>
            </Link>
          </motion.section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={8}
            className="rounded-3xl border border-daya-border bg-white p-8 shadow-sm lg:col-span-2"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-daya-text">Your 7-day mood check-ins</h2>
                <p className="mt-1 text-sm text-daya-text-light">Only days you logged are plotted.</p>
              </div>
              <BarChart3 className="size-6 text-daya-sage" />
            </div>
            <div className="mt-2 flex h-48 items-end gap-2">
              {lastSevenDates.map((date, index) => {
                const checkIn = checkInsByDate.get(date);
                const value = checkIn ? moodValue(checkIn.mood) : 0;
                const dayLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" });
                return (
                  <div key={date} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <div className="flex w-full flex-1 flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: checkIn ? `${value * 20}%` : "4%" }}
                        transition={{ delay: 0.25 + index * 0.05, duration: 0.35, ease: "easeOut" }}
                        title={checkIn ? `${dayLabel}: ${moodLabel(checkIn.mood)}` : `${dayLabel}: no check-in`}
                        className={cn(
                          "relative w-full overflow-hidden rounded-xl",
                          !checkIn ? "bg-daya-border/60" : value >= 4 ? "bg-daya-sage/70" : value === 3 ? "bg-daya-gold/70" : "bg-daya-terracotta/50"
                        )}
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-daya-text-light">{dayLabel}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-daya-text-light">
              <span>Very difficult</span>
              <span>No bar means no check-in was logged</span>
              <span>Great</span>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={9}
            className="rounded-3xl border border-daya-border bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-bold text-daya-text">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Talk to DAYA", href: "/chat", icon: MessageCircle, color: "text-[#8B75A1] bg-daya-lavender/30" },
                { label: "View your reports", href: "/reports", icon: TrendingUp, color: "text-daya-sky bg-daya-sky/20" },
                { label: "Child profile", href: "/profile", icon: Brain, color: "text-daya-sage-dark bg-daya-sage-light" },
                { label: "Medical records", href: "/medical-records", icon: HeartPulse, color: "text-daya-terracotta bg-daya-terracotta/20" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-2xl p-3 transition-all hover:bg-daya-cream"
                >
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", action.color)}>
                    <action.icon className="size-5" />
                  </div>
                  <span className="text-sm font-medium text-daya-text transition-colors group-hover:text-daya-sage-dark">{action.label}</span>
                  <ChevronRight className="ml-auto size-4 text-daya-text-light transition-colors group-hover:text-daya-sage-dark" />
                </Link>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={10}
          className="rounded-3xl border border-daya-border bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-daya-text">Your recent activity</h2>
              <p className="mt-1 text-sm text-daya-text-light">Check-ins and observations saved for your family.</p>
            </div>
            <Clock className="size-6 text-daya-sage" />
          </div>
          {activity.length ? (
            <div>
              {activity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 border-b border-daya-border/50 py-4 last:border-0">
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl bg-daya-cream", item.color)}>
                    <item.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-daya-text">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-daya-text-secondary">{item.detail}</p>
                  </div>
                  <span className="shrink-0 pt-0.5 text-xs text-daya-text-light">{readableDate(item.date)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-daya-border bg-daya-cream p-6">
              <p className="font-medium text-daya-text">No activity recorded yet.</p>
              <p className="mt-1 text-sm text-daya-text-secondary">
                When you add check-ins or DAYA finds patterns in your own history, they will appear here.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

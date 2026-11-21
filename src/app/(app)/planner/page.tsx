"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Moon, Plus, Sparkles, Sun, Trash2 } from "lucide-react";
import { getAccessToken } from "@/lib/auth-client";

const periods = [
  { id: "morning", label: "Morning", hours: "6 AM – 12 PM", icon: Sun },
  { id: "afternoon", label: "Afternoon", hours: "12 PM – 5 PM", icon: Coffee },
  { id: "evening", label: "Evening", hours: "5 PM – 9 PM", icon: Sparkles },
  { id: "night", label: "Night", hours: "9 PM onward", icon: Moon },
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
type PlanDraft = { title: string; description: string; time: string };

function emptySections(): PlanSection[] {
  return periods.map(({ id }) => ({ period: id, items: [] }));
}

function localDate() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function emptyDrafts(): Record<Period, PlanDraft> {
  return {
    morning: { title: "", description: "", time: "" },
    afternoon: { title: "", description: "", time: "" },
    evening: { title: "", description: "", time: "" },
    night: { title: "", description: "", time: "" },
  };
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [sections, setSections] = useState<PlanSection[]>(emptySections);
  const [drafts, setDrafts] = useState<Record<Period, PlanDraft>>(emptyDrafts);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    queueMicrotask(() => setSelectedDate(localDate()));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const controller = new AbortController();

    void (async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(`/api/planner?date=${encodeURIComponent(selectedDate)}`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: controller.signal,
        });
        const result = (await response.json()) as { sections?: PlanSection[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Could not load this day's plan.");
        if (!controller.signal.aborted) setSections(result.sections ?? emptySections());
      } catch (caught) {
        if (!controller.signal.aborted) {
          setError(caught instanceof Error ? caught.message : "Could not load this day's plan.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [selectedDate]);

  function updateDraft(period: Period, field: keyof PlanDraft, value: string) {
    setDrafts((previous) => ({
      ...previous,
      [period]: { ...previous[period], [field]: value },
    }));
  }

  function addTask(period: Period) {
    const draft = drafts[period];
    if (!draft.title.trim()) return;

    setSections((previous) =>
      previous.map((section) =>
        section.period === period
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  id: crypto.randomUUID(),
                  title: draft.title.trim(),
                  description: draft.description.trim(),
                  time: draft.time,
                  completed: false,
                },
              ],
            }
          : section
      )
    );
    setDrafts((previous) => ({ ...previous, [period]: emptyDrafts()[period] }));
    setNotice("");
  }

  function updateTask(period: Period, taskId: string, patch: Partial<PlanTask>) {
    setSections((previous) =>
      previous.map((section) =>
        section.period === period
          ? {
              ...section,
              items: section.items.map((task) =>
                task.id === taskId ? { ...task, ...patch } : task
              ),
            }
          : section
      )
    );
    setNotice("");
  }

  function removeTask(period: Period, taskId: string) {
    setSections((previous) =>
      previous.map((section) =>
        section.period === period
          ? { ...section, items: section.items.filter((task) => task.id !== taskId) }
          : section
      )
    );
    setNotice("");
  }

  async function savePlan() {
    if (!selectedDate) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const token = await getAccessToken();
      const response = await fetch("/api/planner", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ date: selectedDate, sections }),
      });
      const result = (await response.json()) as { sections?: PlanSection[]; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not save this day's plan.");
      setSections(result.sections ?? sections);
      setNotice("Your plan is saved to your private account.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save this day's plan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-daya-text mb-2">Your Daily Planner</h1>
            <p className="text-daya-text-secondary">
              Build the day around your family. Nothing is filled in for you.
            </p>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium text-daya-text">
            Plan date
            <input
              aria-label="Plan date"
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setLoading(true);
                setError("");
                setNotice("");
                setSections(emptySections());
                setDrafts(emptyDrafts());
              }}
              className="rounded-xl border border-daya-border bg-white px-4 py-3"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-daya-sage/30 bg-daya-sage-light p-5 text-sm leading-relaxed text-daya-text-secondary">
          Add activities, appointments, transitions, or reminders to any part of the day. Your
          schedule is private to your account and stays saved when you sign out.
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {notice}
          </p>
        )}

        {loading ? (
          <div className="rounded-3xl border border-daya-border bg-white p-8 text-center text-sm text-daya-text-secondary">
            Loading your saved plan…
          </div>
        ) : (
          <div className="space-y-6">
            {periods.map(({ id, label, hours, icon: Icon }, index) => {
              const section = sections.find((item) => item.period === id);
              const items = section?.items ?? [];
              const draft = drafts[id];

              return (
                <motion.section
                  key={id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-3xl border border-daya-border bg-white shadow-sm"
                  aria-labelledby={`period-${id}`}
                >
                  <div className="flex items-center gap-4 border-b border-daya-border p-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-daya-sage-light text-daya-sage-dark">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h2 id={`period-${id}`} className="text-xl font-bold text-daya-text">{label}</h2>
                      <p className="text-sm text-daya-text-light">{hours}</p>
                    </div>
                  </div>

                  <div className="space-y-3 p-6">
                    {items.length === 0 ? (
                      <p className="rounded-xl bg-daya-cream p-4 text-sm text-daya-text-secondary">
                        Nothing planned yet. Add what works for your family.
                      </p>
                    ) : (
                      items.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 rounded-2xl bg-daya-cream p-4">
                          <input
                            type="checkbox"
                            aria-label={`Mark ${task.title} complete`}
                            checked={task.completed}
                            onChange={(event) => updateTask(id, task.id, { completed: event.target.checked })}
                            className="mt-1 size-4 accent-daya-sage-dark"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <p className={`font-semibold text-daya-text ${task.completed ? "line-through opacity-60" : ""}`}>
                                {task.title}
                              </p>
                              {task.time && <span className="text-xs text-daya-text-light">{task.time}</span>}
                            </div>
                            {task.description && (
                              <p className="mt-1 whitespace-pre-wrap text-sm text-daya-text-secondary">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTask(id, task.id)}
                            aria-label={`Remove ${task.title}`}
                            className="rounded-lg p-2 text-daya-text-light hover:bg-white hover:text-red-600"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))
                    )}

                    <div className="grid gap-3 rounded-2xl border border-dashed border-daya-border p-4 sm:grid-cols-[auto_1fr]">
                      <label className="flex flex-col gap-2 text-xs font-medium text-daya-text-secondary">
                        Time (optional)
                        <input
                          type="time"
                          value={draft.time}
                          onChange={(event) => updateDraft(id, "time", event.target.value)}
                          className="rounded-xl border border-daya-border bg-white px-3 py-2.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-xs font-medium text-daya-text-secondary">
                        Activity
                        <input
                          value={draft.title}
                          onChange={(event) => updateDraft(id, "title", event.target.value)}
                          maxLength={120}
                          placeholder="e.g. Breakfast, school pickup, therapy"
                          className="rounded-xl border border-daya-border bg-white px-3 py-2.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-xs font-medium text-daya-text-secondary sm:col-span-2">
                        Description or notes (optional)
                        <textarea
                          value={draft.description}
                          onChange={(event) => updateDraft(id, "description", event.target.value)}
                          maxLength={2000}
                          rows={2}
                          placeholder="Add the details, preparation, or reminders you want to remember"
                          className="resize-y rounded-xl border border-daya-border bg-white px-3 py-2.5 text-sm"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => addTask(id)}
                        disabled={!draft.title.trim() || items.length >= 50}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-daya-sage-dark px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:justify-self-end"
                      >
                        <Plus className="size-4" />
                        Add to {label.toLowerCase()}
                      </button>
                    </div>
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pb-6">
          <button
            type="button"
            onClick={savePlan}
            disabled={loading || saving || !selectedDate}
            className="rounded-xl bg-daya-sage-dark px-6 py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

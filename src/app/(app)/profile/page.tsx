"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Brain, FileHeart, Heart, Pencil, Save } from "lucide-react";
import { getAccessToken } from "@/lib/auth-client";
import type { ChildProfile } from "@/types";

type ProfileForm = {
  name: string;
  age: string;
  date_of_birth: string;
  gender: string;
  diagnosis: string;
  diagnosis_date: string;
  diagnosed_by: string;
  medical_conditions: string;
  allergies: string;
  medications: string;
  communication_style: string;
  sensitivities: string;
  triggers: string;
  calming_strategies: string;
  routines: string;
  strengths_interests: string;
  care_team: string;
  report_summary: string;
  notes: string;
};

const emptyForm: ProfileForm = {
  name: "",
  age: "",
  date_of_birth: "",
  gender: "",
  diagnosis: "",
  diagnosis_date: "",
  diagnosed_by: "",
  medical_conditions: "",
  allergies: "",
  medications: "",
  communication_style: "",
  sensitivities: "",
  triggers: "",
  calming_strategies: "",
  routines: "",
  strengths_interests: "",
  care_team: "",
  report_summary: "",
  notes: "",
};

const textFields: Array<{ key: keyof ProfileForm; label: string; placeholder?: string }> = [
  { key: "name", label: "Child's name", placeholder: "Name used at home" },
  { key: "age", label: "Age", placeholder: "Age in years" },
  { key: "date_of_birth", label: "Date of birth" },
  { key: "gender", label: "Gender (optional)" },
  { key: "diagnosis", label: "Diagnosis or area of support", placeholder: "Optional; use the wording from your care team" },
  { key: "diagnosis_date", label: "Diagnosis date (optional)" },
  { key: "diagnosed_by", label: "Diagnosed by / care provider", placeholder: "Provider or clinic, if you want to record it" },
  { key: "medical_conditions", label: "Other medical or developmental notes" },
  { key: "allergies", label: "Allergies and important health alerts" },
  { key: "medications", label: "Medications (name and relevant notes)" },
  { key: "communication_style", label: "Communication and accessibility needs" },
  { key: "sensitivities", label: "Sensory sensitivities", placeholder: "Separate items with commas" },
  { key: "triggers", label: "Known stressors or triggers", placeholder: "Separate items with commas" },
  { key: "calming_strategies", label: "What helps your child feel calm?" },
  { key: "routines", label: "Helpful routines", placeholder: "Separate items with commas" },
  { key: "strengths_interests", label: "Strengths, interests, and preferences" },
  { key: "care_team", label: "Care team and contact notes" },
  { key: "report_summary", label: "Summary of previous reports or recommendations" },
  { key: "notes", label: "Anything else DAYA should know" },
];

const arrayFields = new Set<keyof ProfileForm>(["sensitivities", "triggers", "routines"]);
const multilineFields = new Set<keyof ProfileForm>([
  "medical_conditions", "allergies", "medications", "communication_style",
  "calming_strategies", "strengths_interests", "care_team", "report_summary", "notes",
]);

function formFromChild(child: ChildProfile): ProfileForm {
  return {
    name: child.name ?? "",
    age: child.age?.toString() ?? "",
    date_of_birth: child.date_of_birth ?? "",
    gender: child.gender ?? "",
    diagnosis: child.diagnosis ?? "",
    diagnosis_date: child.diagnosis_date ?? "",
    diagnosed_by: child.diagnosed_by ?? "",
    medical_conditions: child.medical_conditions ?? "",
    allergies: child.allergies ?? "",
    medications: child.medications ?? "",
    communication_style: child.communication_style ?? "",
    sensitivities: child.sensitivities?.join(", ") ?? "",
    triggers: child.triggers?.join(", ") ?? "",
    calming_strategies: child.calming_strategies ?? "",
    routines: child.routines?.join(", ") ?? "",
    strengths_interests: child.strengths_interests ?? "",
    care_team: child.care_team ?? "",
    report_summary: child.report_summary ?? "",
    notes: child.notes ?? "",
  };
}

export default function ProfilePage() {
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let active = true;
    getAccessToken()
      .then(async (token) => {
        const response = await fetch("/api/profile", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Could not load child profile.");
        if (active && data.child) {
          setChild(data.child);
          setForm(formFromChild(data.child));
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load child profile.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function saveProfile() {
    setSaving(true);
    setError("");
    try {
      const token = await getAccessToken();
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : undefined,
          sensitivities: form.sensitivities.split(",").map((value) => value.trim()).filter(Boolean),
          triggers: form.triggers.split(",").map((value) => value.trim()).filter(Boolean),
          routines: form.routines.split(",").map((value) => value.trim()).filter(Boolean),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not save child profile.");
      setChild(data.child);
      setForm(formFromChild(data.child));
      setEditing(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save child profile.");
    } finally {
      setSaving(false);
    }
  }

  const initial = child?.name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="size-24 rounded-3xl bg-gradient-to-br from-[#A8C3A0] to-[#7A9E70] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {initial}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#2F3A36]">{child?.name || "Your child's profile"}</h1>
              <p className="text-[#5F6B66] mt-1">Private information saved to your account</p>
            </div>
            <button onClick={() => editing ? void saveProfile() : setEditing(true)} disabled={saving || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF7F2] text-[#5F6B66] hover:bg-[#F2EDE4] font-medium text-sm border border-[#E8E3DC] disabled:opacity-60">
              {editing ? <><Save className="size-4" /> {saving ? "Saving..." : "Save Changes"}</> : <><Pencil className="size-4" /> {child ? "Edit Profile" : "Add Child Details"}</>}
            </button>
          </div>
        </motion.div>

        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <section className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#2F3A36] mb-2 flex items-center gap-2">
            <Heart className="size-5 text-[#A8C3A0]" /> Child Details
          </h2>
          <p className="mb-6 text-sm text-[#5F6B66]">
            Add only what you are comfortable sharing. These details help personalize support; they are not used to diagnose or prescribe.
          </p>
          {loading ? (
            <p className="text-sm text-[#5F6B66]">Loading your saved profile...</p>
          ) : editing ? (
            <div className="grid gap-5 md:grid-cols-2">
              {textFields.map(({ key, label, placeholder }) => (
                <label key={key} className={multilineFields.has(key) || key === "report_summary" ? "block md:col-span-2" : "block"}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C9691]">{label}</span>
                  {key === "date_of_birth" || key === "diagnosis_date" ? (
                    <input type="date" value={form[key]}
                      onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#2F3A36]" />
                  ) : key === "age" ? (
                    <input type="number" min="0" max="25" value={form.age} placeholder={placeholder}
                      onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#2F3A36]" />
                  ) : multilineFields.has(key) ? (
                    <textarea rows={key === "report_summary" || key === "notes" ? 4 : 3}
                      value={form[key]} placeholder={placeholder}
                      onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#2F3A36]" />
                  ) : (
                    <input value={form[key]} placeholder={placeholder}
                      onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#2F3A36]" />
                  )}
                  {arrayFields.has(key) && <span className="mt-1 block text-xs text-[#8C9691]">Separate multiple items with commas.</span>}
                </label>
              ))}
            </div>
          ) : child ? (
            <div className="grid gap-5 md:grid-cols-2">
              {textFields.map(({ key, label }) => {
                const value = arrayFields.has(key)
                  ? (child[key as "sensitivities" | "triggers" | "routines"] as string[] | undefined)?.join(", ")
                  : child[key as keyof ChildProfile];
                return (
                  <div key={key} className="border-b border-[#E8E3DC]/60 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8C9691]">{label}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-[#2F3A36]">{value || "Not provided"}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-daya-cream p-5 text-sm text-[#5F6B66]">
              No child profile yet. Select <strong>Add Child Details</strong> to add your child&apos;s information.
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#2F3A36] mb-3 flex items-center gap-2">
            <FileHeart className="size-5 text-[#A8C3A0]" /> Previous Reports
          </h2>
          <p className="text-sm leading-relaxed text-[#5F6B66]">
            You can summarize important findings and care-team recommendations in the profile. For private PDF or image uploads, open{" "}
            <a href="/medical-records" className="font-semibold text-daya-sage-dark underline">Medical Reports</a>.
            Reports are for organizing family information only; DAYA does not diagnose or prescribe.
          </p>
        </section>

        <section className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#2F3A36] mb-3 flex items-center gap-2">
            <Brain className="size-5 text-[#A8C3A0]" /> Privacy and personalization
          </h2>
          <p className="text-sm leading-relaxed text-[#5F6B66]">
            Your child profile, check-ins, chat messages, memories, and insights are separated by your account. Profile information remains saved when you sign out and back in.
          </p>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#8C9691]">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            Avoid entering information you do not need to store. Contact your medical professional about diagnosis, medication, or treatment questions.
          </p>
        </section>
      </div>
    </div>
  );
}

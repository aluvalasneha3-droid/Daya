"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Activity, BrainCircuit, AlertCircle } from "lucide-react";
import { getAccessToken } from "@/lib/auth-client";

type Report = {
  childName?: string;
  age?: number;
  reportingPeriod?: string;
  dataDepth?: number;
  stabilityTrajectory?: string;
  sensoryPatterns?: string[];
  observations?: string[];
};

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    getAccessToken().then(async (token) => {
      const response = await fetch("/api/report", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        const sections = data.sections ?? [];
        setReport({
          childName: data.child?.name,
          age: data.child?.age,
          reportingPeriod: data.period?.start
            ? `${data.period.start} - ${data.period.end}`
            : "No data",
          dataDepth: data.period?.totalDays ?? 0,
          stabilityTrajectory: sections.find((section: { title: string }) => section.title.includes("Mood") || section.title.includes("Sleep"))?.content?.join(" "),
          sensoryPatterns: sections.find((section: { title: string }) => section.title.includes("Sensory"))?.content ?? [],
          observations: sections.flatMap((section: { content?: string[] }) => section.content ?? []),
        });
      }
    });
  }, []);

  async function downloadReport() {
    const token = await getAccessToken();
    const response = await fetch("/api/report?format=text", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) return;
    const text = await response.text();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "daya-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-daya-text mb-2">Clinical Reports</h1>
            <p className="text-daya-text-secondary">Care summaries generated only from this account&apos;s observations.</p>
          </div>
          <button onClick={downloadReport}
            className="flex items-center gap-2 bg-daya-sage hover:bg-daya-sage-dark text-white px-5 py-2.5 rounded-xl font-medium shrink-0">
            <Download className="size-4" /> Download Report
          </button>
        </div>

        <div className="bg-daya-sky/20 border border-daya-sky/40 rounded-2xl p-4 flex gap-3 text-daya-text">
          <AlertCircle className="size-5 text-daya-sky shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            This report summarizes parent observations and is not a medical diagnosis.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-daya-border overflow-hidden">
          <div className="border-b border-daya-border p-8 bg-daya-cream/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-daya-text">Behavioral &amp; Sensory Summary</h2>
              <FileText className="size-6 text-daya-sage" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div><p className="text-xs text-daya-text-light uppercase mb-1">Patient</p><p className="font-semibold">{report?.childName || "Not set"}</p></div>
              <div><p className="text-xs text-daya-text-light uppercase mb-1">Age</p><p className="font-semibold">{report?.age ?? "Not set"}</p></div>
              <div><p className="text-xs text-daya-text-light uppercase mb-1">Reporting Period</p><p className="font-semibold">{report?.reportingPeriod || "No data"}</p></div>
              <div><p className="text-xs text-daya-text-light uppercase mb-1">Data Depth</p><p className="font-semibold">{report?.dataDepth ?? 0} check-ins</p></div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4"><Activity className="size-5 text-daya-sage-dark" /><h3 className="text-lg font-bold">Stability Trajectory</h3></div>
              <p className="text-sm text-daya-text-secondary">{report?.stabilityTrajectory || "Add daily check-ins to generate a stability trajectory."}</p>
            </section>
            <section>
              <div className="flex items-center gap-2 mb-4"><BrainCircuit className="size-5 text-daya-lavender" /><h3 className="text-lg font-bold">Sensory &amp; Triggers</h3></div>
              {report?.sensoryPatterns?.length ? (
                <ul className="space-y-2">{report.sensoryPatterns.map((item) => <li key={item} className="text-sm text-daya-text-secondary">- {item}</li>)}</ul>
              ) : (
                <p className="text-sm text-daya-text-secondary">No sensory observations have been logged yet.</p>
              )}
            </section>
            <section>
              <h3 className="text-lg font-bold mb-4">Observations</h3>
              {report?.observations?.length ? (
                <ul className="space-y-2">{report.observations.map((item) => <li key={item} className="text-sm text-daya-text-secondary">- {item}</li>)}</ul>
              ) : (
                <p className="text-sm text-daya-text-secondary">No behavioral observations are available yet.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

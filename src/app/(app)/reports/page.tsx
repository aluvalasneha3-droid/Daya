"use client";

import { motion } from "framer-motion";
import { Download, FileText, Calendar, Activity, BrainCircuit, Share2, AlertCircle } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-daya-text mb-2">Clinical Reports</h1>
            <p className="text-daya-text-secondary">Continuity-of-care summaries generated from 30+ days of DAYA tracking.</p>
          </div>
          <button className="flex items-center gap-2 bg-daya-sage hover:bg-daya-sage-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors shrink-0">
            <Download className="size-4" />
            Download PDF
          </button>
        </div>

        {/* Warning/Info Banner */}
        <div className="bg-daya-sky/20 border border-daya-sky/40 rounded-2xl p-4 flex gap-3 text-daya-text">
          <AlertCircle className="size-5 text-daya-sky shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            These reports are generated from parent observations and DAYA's behavioral intelligence model. They are designed to assist doctors and therapists in understanding longitudinal patterns, but do not constitute a medical diagnosis.
          </p>
        </div>

        {/* Report Preview Surface */}
        <div className="bg-white rounded-3xl shadow-sm border border-daya-border overflow-hidden">
          {/* Report Header */}
          <div className="border-b border-daya-border p-8 bg-daya-cream/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-daya-text tracking-tight">Behavioral & Sensory Summary</h2>
              <span className="text-sm font-medium text-daya-text-secondary">Generated: Oct 15, 2026</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-daya-text-light uppercase tracking-wider mb-1">Patient</p>
                <p className="font-semibold text-daya-text">Aarav</p>
              </div>
              <div>
                <p className="text-xs text-daya-text-light uppercase tracking-wider mb-1">Age</p>
                <p className="font-semibold text-daya-text">6 years, 2 months</p>
              </div>
              <div>
                <p className="text-xs text-daya-text-light uppercase tracking-wider mb-1">Reporting Period</p>
                <p className="font-semibold text-daya-text">Last 30 Days</p>
              </div>
              <div>
                <p className="text-xs text-daya-text-light uppercase tracking-wider mb-1">Data Depth</p>
                <p className="font-semibold text-daya-text">28 Check-ins</p>
              </div>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-8 space-y-10">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="size-5 text-daya-sage-dark" />
                <h3 className="text-lg font-bold text-daya-text">Stability Trajectory</h3>
              </div>
              <p className="text-sm text-daya-text-secondary leading-relaxed mb-4">
                Over the past 30 days, Aarav's overall stability index has shown an <strong>improving trend (+12%)</strong>. The most significant predictor of next-day emotional regulation continues to be sleep architecture.
              </p>
              <div className="bg-daya-cream rounded-2xl p-4 border border-daya-border/50">
                <p className="text-sm font-medium text-daya-text">Key Observation:</p>
                <p className="text-sm text-daya-text-secondary mt-1">Days following &lt;6 hours of sleep show a 65% higher incidence of sensory overwhelm by mid-afternoon.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="size-5 text-daya-lavender" />
                <h3 className="text-lg font-bold text-daya-text">Sensory & Triggers</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-daya-text-secondary">
                  <span className="mt-1.5 size-1.5 rounded-full bg-daya-lavender shrink-0" />
                  <span><strong>Auditory Sensitivity:</strong> High frequency of distress related to sudden loud noises (e.g., school bell, blender). Recovery time averages 45 minutes.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-daya-text-secondary">
                  <span className="mt-1.5 size-1.5 rounded-full bg-daya-lavender shrink-0" />
                  <span><strong>Transition Friction:</strong> Routine disruptions without prior visual scheduling resulted in meltdowns in 4 out of 5 observed instances.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-daya-text-secondary">
                  <span className="mt-1.5 size-1.5 rounded-full bg-daya-lavender shrink-0" />
                  <span><strong>Regulating Activities:</strong> Deep pressure therapy (weighted blanket) and water play consistently lower arousal states during the "Rumble" phase.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="size-5 text-daya-terracotta" />
                <h3 className="text-lg font-bold text-daya-text">Compound Stress Patterns</h3>
              </div>
              <p className="text-sm text-daya-text-secondary leading-relaxed mb-4">
                DAYA's pattern detection identified 3 "Compound Stress Days" where multiple low-level triggers accumulated into a meltdown state.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 bg-[#F9F4F4] rounded-xl p-4 border border-[#F2E8E8]">
                  <p className="text-xs font-bold text-[#B36B6B] uppercase tracking-wider mb-2">Vulnerability Window</p>
                  <p className="text-sm text-daya-text-secondary">3:00 PM - 5:00 PM (Post-school decompression)</p>
                </div>
                <div className="flex-1 bg-[#F4F9F5] rounded-xl p-4 border border-[#E8F2EA]">
                  <p className="text-xs font-bold text-[#6B9E75] uppercase tracking-wider mb-2">Successful Intervention</p>
                  <p className="text-sm text-daya-text-secondary">Immediate low-demand sensory space upon arriving home.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

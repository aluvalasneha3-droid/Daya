"use client";

import { useEffect, useState } from "react";
import { 
  Brain, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  ClipboardList,
  Sparkles,
  HeartPulse,
  Clock,
  MessageCircle,
  Activity,
  Moon,
  Sun,
  ChevronRight,
  Zap,
  Shield,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-12 rounded-full border-2 border-daya-sage border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="size-5 text-daya-sage-dark animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-daya-text-secondary font-medium">Gathering DAYA insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          className="flex flex-col gap-4 md:flex-row md:items-end justify-between"
        >
          <div>
            <p className="text-sm font-medium text-daya-sage-dark mb-1 flex items-center gap-1.5">
              <Sun className="size-4" />
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-3xl font-bold text-daya-text mb-2">{greeting}, Ananya.</h1>
            <p className="text-daya-text-secondary">Here&apos;s what DAYA has noticed about Aarav&apos;s patterns today.</p>
          </div>
          <Link 
            href="/chat"
            className="group flex items-center justify-center gap-2 bg-daya-sage hover:bg-daya-sage-dark text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-sm hover:shadow-lg hover:shadow-daya-sage/20"
          >
            <Sparkles className="size-4" />
            Talk to DAYA
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* DAYA Score Banner */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className="rounded-3xl bg-gradient-to-r from-daya-sage via-[#8DB585] to-[#7A9E70] p-6 md:p-8 text-white shadow-lg shadow-daya-sage/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[200px] h-[200px] rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-5 text-white/80" />
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">DAYA Behavioral Score</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extrabold tracking-tight">72</span>
                <span className="text-lg font-medium text-white/70">/100</span>
              </div>
              <p className="mt-2 text-sm text-white/80 max-w-md">
                Aarav&apos;s overall stability has improved 8 points this week. Sleep consistency and reduced sensory overload are the biggest contributors.
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { label: "Sleep", value: "7.2h", trend: "↑", good: true },
                { label: "Mood", value: "Okay", trend: "→", good: false },
                { label: "Sensory", value: "Low", trend: "↓", good: true },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-3 min-w-[80px] text-center">
                  <p className="text-xs text-white/70 font-medium">{item.label}</p>
                  <p className="text-lg font-bold mt-0.5">{item.value}</p>
                  <p className={cn("text-xs font-bold mt-0.5", item.good ? "text-green-200" : "text-amber-200")}>
                    {item.trend} {item.good ? "Better" : "Stable"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Data Depth", value: "32 Days", sub: "Continuous tracking", icon: ClipboardList, color: "bg-daya-sky/20 text-daya-sky", border: "border-daya-sky/30" },
            { label: "Detected Patterns", value: "6 Active", sub: "2 new this week", icon: Brain, color: "bg-daya-lavender/30 text-[#8B75A1]", border: "border-daya-lavender/50" },
            { label: "Stability Trajectory", value: "Improving", sub: "+8pts from last week", icon: TrendingUp, color: "bg-daya-success/30 text-daya-sage-dark", border: "border-daya-success/50" },
            { label: "Parent Stress Level", value: "Moderate", sub: "Down from High", icon: HeartPulse, color: "bg-daya-terracotta/20 text-daya-terracotta", border: "border-daya-terracotta/30" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 2}
              className="rounded-3xl border border-daya-border bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={cn("mb-4 flex size-12 items-center justify-center rounded-2xl border", stat.color, stat.border)}>
                <stat.icon className="size-6" />
              </div>
              <p className="text-sm font-medium text-daya-text-secondary mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-daya-text">{stat.value}</p>
              <p className="text-xs text-daya-text-light mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Insights */}
          <motion.section 
            initial="hidden" animate="visible" variants={fadeUp} custom={6}
            className="rounded-3xl border border-daya-border bg-white p-8 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-daya-text">DAYA Observations</h2>
              <Brain className="size-6 text-daya-sage" />
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-daya-cream p-5 border border-daya-border hover:border-daya-sage/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-2 rounded-full bg-daya-sage-dark" />
                  <p className="text-sm font-bold text-daya-text">Sleep-Mood Correlation</p>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-daya-sage-dark bg-daya-sage-light px-2 py-0.5 rounded-full">High Confidence</span>
                </div>
                <p className="text-sm text-daya-text-secondary leading-relaxed">
                  Aarav shows significantly higher emotional regulation on days following at least 8.5 hours of uninterrupted sleep.
                </p>
              </div>
              <div className="rounded-2xl bg-[#FDF8F6] p-5 border border-[#F4E3DD] hover:border-daya-terracotta/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-2 rounded-full bg-daya-terracotta" />
                  <p className="text-sm font-bold text-[#8A5A44]">Sensory Threshold Warning</p>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-daya-terracotta bg-daya-peach/40 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p className="text-sm text-[#8A5A44] leading-relaxed">
                  Yesterday involved high auditory sensory load. Aarav typically needs a 24-hour low-demand recovery period after days like this.
                </p>
              </div>
              <div className="rounded-2xl bg-[#F5F0F8] p-5 border border-[#E2D5ED] hover:border-daya-lavender/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-2 rounded-full bg-[#8B75A1]" />
                  <p className="text-sm font-bold text-[#5A4570]">Communication Breakthrough</p>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#8B75A1] bg-daya-lavender/30 px-2 py-0.5 rounded-full">New</span>
                </div>
                <p className="text-sm text-[#5A4570] leading-relaxed">
                  Aarav used 3-word requests unprompted during calm afternoon windows on 4 of the last 7 days.
                </p>
              </div>
            </div>
            <Link href="/behavioral" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-daya-sage-dark hover:text-daya-sage transition-colors">
              View all behavioral insights <ArrowRight className="size-4" />
            </Link>
          </motion.section>

          {/* Quick Actions / Schedule */}
          <motion.section 
            initial="hidden" animate="visible" variants={fadeUp} custom={7}
            className="rounded-3xl border border-daya-border bg-white p-8 shadow-sm flex flex-col"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-daya-text">Today&apos;s Support Flow</h2>
              <Calendar className="size-6 text-daya-sage" />
            </div>
            <div className="space-y-3 flex-1">
              {[
                { time: "Morning", task: "Predictable routine with visual schedule", status: "completed", icon: Sun },
                { time: "Lunch", task: "Safe foods (crunchy texture preferred today)", status: "completed", icon: Clock },
                { time: "Afternoon", task: "Sensory decompression (weighted blanket)", status: "current", icon: Activity },
                { time: "Evening", task: "Low-demand wind down sequence (no screens)", status: "upcoming", icon: Moon },
              ].map((item) => (
                <div key={item.time} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-daya-cream transition-colors group">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-xl shrink-0 transition-colors",
                    item.status === "completed" ? "bg-daya-success/30 text-daya-sage-dark" 
                      : item.status === "current" ? "bg-daya-gold/30 text-daya-terracotta" 
                      : "bg-daya-cream text-daya-text-light"
                  )}>
                    <item.icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-daya-text-light mb-0.5">{item.time}</p>
                    <p className="text-sm font-medium text-daya-text leading-snug">{item.task}</p>
                  </div>
                  <div className={cn(
                    "size-2.5 rounded-full mt-2 shrink-0",
                    item.status === "completed" ? "bg-daya-success" : item.status === "current" ? "bg-daya-gold animate-pulse" : "bg-daya-border"
                  )} />
                </div>
              ))}
            </div>
            <Link href="/planner" className="mt-6 w-full text-center block">
              <div className="w-full bg-daya-cream text-daya-text-secondary hover:text-daya-text hover:bg-[#F2EDE4] rounded-2xl py-3 font-medium transition-colors text-sm border border-transparent hover:border-daya-border flex items-center justify-center gap-2">
                Open Full Daily Planner <ChevronRight className="size-4" />
              </div>
            </Link>
          </motion.section>
        </div>

        {/* Weekly Trend + Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Weekly Trend */}
          <motion.section 
            initial="hidden" animate="visible" variants={fadeUp} custom={8}
            className="rounded-3xl border border-daya-border bg-white p-8 shadow-sm lg:col-span-2"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-daya-text">7-Day Stability Trend</h2>
              <BarChart3 className="size-6 text-daya-sage" />
            </div>
            <div className="flex items-end gap-2 h-48 mt-2">
              {[
                { day: "Mon", value: 55, mood: "Hard" },
                { day: "Tue", value: 45, mood: "Difficult" },
                { day: "Wed", value: 60, mood: "Okay" },
                { day: "Thu", value: 70, mood: "Good" },
                { day: "Fri", value: 65, mood: "Okay" },
                { day: "Sat", value: 80, mood: "Great" },
                { day: "Sun", value: 72, mood: "Good" },
              ].map((bar, i) => (
                <div key={bar.day} className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                  <div className="w-full flex-1 flex flex-col justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${bar.value}%` }}
                      transition={{ delay: 0.8 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                      className={cn(
                        "w-full rounded-xl transition-colors relative overflow-hidden",
                        bar.value >= 70 ? "bg-daya-sage/60" : bar.value >= 50 ? "bg-daya-gold/60" : "bg-daya-terracotta/40"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-bold text-daya-text-light uppercase">{bar.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-daya-text-light">
              <span>Lower stability</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-daya-terracotta/40" /> Hard</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-daya-gold/60" /> Okay</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-daya-sage/60" /> Good</span>
              </div>
              <span>Higher stability</span>
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section 
            initial="hidden" animate="visible" variants={fadeUp} custom={9}
            className="rounded-3xl border border-daya-border bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-daya-text mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Log Today's Check-in", href: "/checkin", icon: ClipboardList, color: "text-daya-sage-dark bg-daya-sage-light" },
                { label: "Talk to DAYA", href: "/chat", icon: MessageCircle, color: "text-[#8B75A1] bg-daya-lavender/30" },
                { label: "Start Home Therapy", href: "/home-therapies", icon: Activity, color: "text-daya-terracotta bg-daya-peach/30" },
                { label: "View Doctor Report", href: "/reports", icon: Zap, color: "text-daya-sky bg-daya-sky/20" },
                { label: "Find Therapist", href: "/therapists", icon: HeartPulse, color: "text-daya-gold bg-daya-gold/20" },
              ].map((action) => (
                <Link 
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-2xl p-3 hover:bg-daya-cream transition-all group"
                >
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", action.color)}>
                    <action.icon className="size-5" />
                  </div>
                  <span className="text-sm font-medium text-daya-text group-hover:text-daya-sage-dark transition-colors">{action.label}</span>
                  <ChevronRight className="size-4 ml-auto text-daya-text-light group-hover:text-daya-sage-dark transition-colors" />
                </Link>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Recent Activity */}
        <motion.section 
          initial="hidden" animate="visible" variants={fadeUp} custom={10}
          className="rounded-3xl border border-daya-border bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-daya-text">Recent Activity</h2>
            <Clock className="size-6 text-daya-sage" />
          </div>
          <div className="space-y-0">
            {[
              { time: "2 hours ago", event: "Daily check-in completed", detail: "Sleep 7h, Mood: Okay, Meltdowns: 0", icon: ClipboardList, color: "text-daya-sage-dark" },
              { time: "4 hours ago", event: "DAYA noticed a pattern", detail: "Routine consistency improving on school mornings", icon: Brain, color: "text-[#8B75A1]" },
              { time: "Yesterday", event: "Home therapy completed", detail: "Balloon Belly Breathing — 5 minutes", icon: Activity, color: "text-daya-terracotta" },
              { time: "Yesterday", event: "Chat conversation", detail: "Discussed meltdown recovery strategies", icon: MessageCircle, color: "text-daya-sky" },
              { time: "2 days ago", event: "Doctor report generated", detail: "14-day behavioral summary for Dr. Priya Sharma", icon: Zap, color: "text-daya-gold" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 py-4 border-b border-daya-border/50 last:border-0">
                <div className={cn("flex size-10 items-center justify-center rounded-xl bg-daya-cream shrink-0", item.color)}>
                  <item.icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-daya-text">{item.event}</p>
                  <p className="text-xs text-daya-text-secondary mt-0.5">{item.detail}</p>
                </div>
                <span className="text-xs text-daya-text-light shrink-0 pt-0.5">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Brain,
  HeartHandshake,
  Calendar,
  LineChart,
  BookOpen,
  Users,
  Utensils,
  Shield,
  ChevronRight,
  Star,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-daya-cream text-daya-text">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-daya-sage/10 bg-daya-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-daya-sage text-white">
              <HeartHandshake className="size-4" />
            </div>
            <span className="text-lg font-bold tracking-tight font-heading">DAYA</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-daya-text-secondary hover:text-daya-text transition">Features</a>
            <a href="#how" className="text-sm font-medium text-daya-text-secondary hover:text-daya-text transition">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-daya-text-secondary hover:text-daya-text transition">Pricing</a>
            <Link href="/schools" className="text-sm font-medium text-daya-text-secondary hover:text-daya-text transition">Schools</Link>
            <a href="#testimonials" className="text-sm font-medium text-daya-text-secondary hover:text-daya-text transition">Stories</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-full px-5 py-2.5 text-sm font-medium text-daya-text-secondary hover:text-daya-text transition">
              Log in
            </Link>
            <Link href="/login?mode=signup" className="rounded-full bg-daya-sage px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-daya-sage-dark transition">
              Get Started
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-daya-sage/10 bg-daya-cream px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#testimonials" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Stories</a>
              <Link href="/login?mode=signup" className="mt-2 rounded-full bg-daya-sage px-6 py-3 text-center text-sm font-semibold text-white">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-daya-sage/8 blur-3xl" />
          <div className="absolute top-20 -left-40 h-[500px] w-[500px] rounded-full bg-daya-lavender/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-daya-peach/8 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 rounded-full bg-daya-sage-light px-4 py-1.5 text-xs font-semibold text-daya-sage-dark">
                <HeartHandshake className="size-3.5" />
                Behavioral Support Companion
              </span>
            </motion.div>

            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight font-heading sm:text-5xl lg:text-6xl"
            >
              You don&apos;t have to
              <br />
              <span className="text-daya-sage-dark">navigate this alone.</span>
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-daya-text-secondary"
            >
              DAYA is an emotionally intelligent companion that helps parents of
              autistic children notice patterns, plan calmer days, and feel
              deeply supported.
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/login?mode=signup"
                className="group flex items-center gap-2 rounded-full bg-daya-sage px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-daya-sage/20 transition hover:bg-daya-sage-dark hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how"
                className="flex items-center gap-2 rounded-full border border-daya-sage/20 bg-white px-8 py-3.5 text-base font-medium text-daya-text transition hover:border-daya-sage/40 hover:bg-daya-sage-light"
              >
                See How It Works
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="border-y border-daya-sage/10 bg-white/60 py-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-daya-text-light">
            Supporting families across India
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["500+ Families", "2,400+ Check-ins Logged", "98% Parent Satisfaction", "12 Therapist Partners"].map((stat) => (
              <span key={stat} className="text-sm font-semibold text-daya-text-secondary">{stat}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
              Everything a family needs,
              <br />in one calm place.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-daya-text-secondary">
              DAYA combines behavioral intelligence, daily planning, therapy coordination, and emotional support into a single platform designed around your family.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Brain, title: "Behavioral Intelligence", desc: "AI-powered pattern detection across sleep, mood, sensory load, and communication. DAYA notices what you might miss.", color: "bg-daya-sage-light text-daya-sage-dark" },
              { icon: Calendar, title: "Adaptive Daily Plans", desc: "Personalized morning, afternoon, and evening routines that adapt based on yesterday's data and behavioral trends.", color: "bg-purple-50 text-purple-600" },
              { icon: Utensils, title: "Sensory-Friendly Meals", desc: "Food suggestions based on your child's comfort patterns, sensory load, and energy levels. Not prescriptions — gentle ideas.", color: "bg-orange-50 text-orange-500" },
              { icon: LineChart, title: "Trend Tracking", desc: "Visual behavioral trends over days and weeks. See improvements, catch regressions early, and share with your care team.", color: "bg-sky-50 text-sky-600" },
              { icon: BookOpen, title: "Therapist Reports", desc: "Downloadable continuity-of-care reports with behavioral summaries, triggers, and communication trends for your therapist.", color: "bg-amber-50 text-amber-600" },
              { icon: Users, title: "Community & Workshops", desc: "Connect with other parents in support circles, book workshops on meltdowns, sleep, and school readiness.", color: "bg-rose-50 text-rose-500" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group rounded-3xl border border-daya-sage/10 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-daya-sage/20"
              >
                <div className={`flex size-12 items-center justify-center rounded-2xl ${feature.color}`}>
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold font-heading">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-daya-text-secondary">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
              Three steps to calmer days.
            </h2>
            <p className="mt-4 text-base text-daya-text-secondary">
              No complex setup. No overwhelming intake forms. Just start sharing, and DAYA starts learning.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              { step: "01", title: "Log Your Day", desc: "A gentle 2-minute check-in covering sleep, mood, meals, sensory load, meltdowns, and how you're doing as a parent. Every detail teaches DAYA something new.", color: "bg-daya-sage-light border-daya-sage/20" },
              { step: "02", title: "DAYA Learns Patterns", desc: "DAYA detects behavioral connections you might not see — like how poor sleep on Tuesdays leads to harder Wednesdays, or how sensory overload predicts evening meltdowns.", color: "bg-purple-50 border-purple-100" },
              { step: "03", title: "Get Personalized Support", desc: "Adaptive daily plans, sensory-friendly meals, behavioral preparation, emotional support for you, and continuity-of-care reports for your therapist.", color: "bg-orange-50 border-orange-100" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`rounded-3xl border p-8 ${item.color}`}
              >
                <span className="text-4xl font-extrabold text-daya-text/10 font-heading">{item.step}</span>
                <h3 className="mt-4 text-xl font-bold font-heading">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-daya-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
              Families who feel seen.
            </h2>
            <p className="mt-4 text-base text-daya-text-secondary">
              Real parents sharing how DAYA changed their daily experience.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Ananya R.", role: "Mother of Aarav, 5", text: "For the first time, I feel like someone truly understands what our days look like. DAYA noticed a sleep-meltdown pattern I'd been missing for months.", stars: 5 },
              { name: "Rahul M.", role: "Father of Sia, 7", text: "The daily plans are a lifesaver. Instead of waking up anxious about the day, I have a gentle roadmap that actually works because it's based on Sia's real patterns.", stars: 5 },
              { name: "Priya K.", role: "Mother of Arjun, 4", text: "I cried when DAYA told me 'what you're carrying is real.' No app has ever acknowledged the parent experience like this. It doesn't just track — it cares.", stars: 5 },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-3xl border border-daya-sage/10 bg-white p-7 shadow-sm"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="size-4 fill-daya-gold text-daya-gold" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-daya-text-secondary italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-5 border-t border-daya-sage/10 pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-daya-text-light">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
              Plans that grow with your family.
            </h2>
            <p className="mt-4 text-base text-daya-text-secondary">
              Start free, upgrade when you&apos;re ready. No pressure, no lock-in.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Free Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="rounded-3xl border border-daya-sage/15 bg-daya-offwhite p-8 flex flex-col"
            >
              <div>
                <span className="text-sm font-semibold text-daya-sage-dark">Free Forever</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-daya-text font-heading">₹0</span>
                  <span className="text-sm text-daya-text-light">/month</span>
                </div>
                <p className="mt-3 text-sm text-daya-text-secondary leading-relaxed">
                  Everything you need to start understanding your child&apos;s patterns.
                </p>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {[
                  "Daily behavioral check-ins",
                  "Basic pattern detection",
                  "DAYA chat (5 conversations/day)",
                  "Community access",
                  "Simple daily planner",
                  "Therapist directory",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-daya-text-secondary">
                    <span className="mt-0.5 text-daya-sage">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className="mt-8 block w-full rounded-2xl border border-daya-sage/30 bg-white py-3 text-center text-sm font-semibold text-daya-sage-dark transition hover:bg-daya-sage-light"
              >
                Start Free
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="relative rounded-3xl border-2 border-daya-sage bg-white p-8 shadow-xl shadow-daya-sage/10 flex flex-col"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-daya-sage px-4 py-1 text-xs font-bold text-white shadow-sm">
                  Most Popular
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-daya-sage-dark">Premium Family</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-daya-text font-heading">₹499</span>
                  <span className="text-sm text-daya-text-light">/month</span>
                </div>
                <p className="mt-3 text-sm text-daya-text-secondary leading-relaxed">
                  Full behavioral intelligence and predictive planning.
                </p>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {[
                  "Everything in Free",
                  "Unlimited DAYA conversations",
                  "Advanced behavioral analytics",
                  "Predictive daily planning",
                  "Doctor-ready reports",
                  "Home therapy timers",
                  "Priority workshop booking",
                  "Multi-language support",
                  "DAYA behavioral score",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-daya-text">
                    <span className="mt-0.5 text-daya-sage">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className="mt-8 block w-full rounded-2xl bg-daya-sage py-3 text-center text-sm font-semibold text-white shadow-lg shadow-daya-sage/20 transition hover:bg-daya-sage-dark"
              >
                Start 14-Day Free Trial
              </Link>
            </motion.div>

            {/* Clinic Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-3xl border border-daya-sage/15 bg-daya-offwhite p-8 flex flex-col"
            >
              <div>
                <span className="text-sm font-semibold text-daya-sage-dark">Clinic Partner</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-daya-text font-heading">₹2,999</span>
                  <span className="text-sm text-daya-text-light">/month</span>
                </div>
                <p className="mt-3 text-sm text-daya-text-secondary leading-relaxed">
                  For therapists and clinics managing multiple children.
                </p>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {[
                  "Everything in Premium",
                  "Up to 25 child profiles",
                  "Clinic dashboard",
                  "Cross-child pattern analysis",
                  "Automated progress reports",
                  "Parent communication tools",
                  "API access",
                  "Dedicated support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-daya-text-secondary">
                    <span className="mt-0.5 text-daya-sage">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className="mt-8 block w-full rounded-2xl border border-daya-sage/30 bg-white py-3 text-center text-sm font-semibold text-daya-sage-dark transition hover:bg-daya-sage-light"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-daya-sage px-8 py-16 text-center text-white shadow-2xl shadow-daya-sage/20 sm:px-16 lg:py-20">
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
              Your child deserves to be understood.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/80">
              Start building a behavioral picture that helps you plan calmer days, celebrate progress, and feel less alone on this journey.
            </p>
            <div className="mt-10">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-daya-sage-dark shadow-lg transition hover:bg-daya-offwhite hover:shadow-xl"
              >
                Start Free Today
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-daya-sage/10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex size-8 items-center justify-center rounded-xl bg-daya-sage text-white">
                  <HeartHandshake className="size-3.5" />
                </div>
                <span className="text-base font-bold font-heading">DAYA</span>
              </div>
              <p className="text-sm text-daya-text-secondary leading-relaxed">
                An emotionally intelligent companion helping autism parents navigate daily life with more clarity, calm, and confidence.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-daya-text-light mb-4">Product</h4>
              <div className="space-y-2.5">
                <a href="#features" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Features</a>
                <a href="#pricing" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Pricing</a>
                <a href="#how" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">How It Works</a>
                <Link href="/login" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Login</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-daya-text-light mb-4">Ecosystem</h4>
              <div className="space-y-2.5">
                <Link href="/therapists" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Therapist Directory</Link>
                <Link href="/schools" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Autism Schools</Link>
                <Link href="/shadow-teachers" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Shadow Teachers</Link>
                <Link href="/community" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Parent Community</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-daya-text-light mb-4">Company</h4>
              <div className="space-y-2.5">
                <a href="#" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">About Us</a>
                <a href="#" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Privacy Policy</a>
                <a href="#" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Terms of Service</a>
                <a href="mailto:hello@daya.app" className="block text-sm text-daya-text-secondary hover:text-daya-text transition">Contact</a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-daya-sage/10 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-daya-text-light">
              © 2026 DAYA. All rights reserved. Made with ❤️ in India.
            </p>
            <p className="text-xs text-daya-text-light">
              DAYA does not diagnose or treat. Always consult your care team.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Safety */}
      <div className="fixed bottom-4 left-4 z-40 hidden lg:flex">
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs text-daya-text-light shadow-sm backdrop-blur">
          <Shield className="size-3.5 text-daya-sage" />
          Observation only. Not a medical tool.
        </div>
      </div>
    </div>
  );
}

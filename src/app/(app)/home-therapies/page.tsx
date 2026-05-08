"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake, Wind, Activity, Music, Sparkles, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const therapies = [
  {
    title: "5-Minute Sun Salutations",
    description: "A modified, gentle sequence to help ground your child in the morning. Focus on slow stretching and taking deep breaths with each pose.",
    icon: Activity,
    color: "text-daya-sage-dark",
    bgColor: "bg-daya-sage-light",
    ringColor: "text-daya-sage",
    durationMinutes: 5,
  },
  {
    title: "Balloon Belly Breathing",
    description: "Have your child lie down with a small toy on their belly. Ask them to breathe in deeply to make the toy rise, and breathe out to make it fall.",
    icon: Wind,
    color: "text-daya-sky",
    bgColor: "bg-daya-sky/20",
    ringColor: "text-daya-sky",
    durationMinutes: 3,
  },
  {
    title: "Deep Pressure Brushing",
    description: "Using a soft therapy brush, apply firm, slow strokes down the arms, back, and legs. This can help calm the nervous system before bedtime.",
    icon: HeartHandshake,
    color: "text-daya-lavender",
    bgColor: "bg-daya-lavender/20",
    ringColor: "text-daya-lavender",
    durationMinutes: 10,
  },
  {
    title: "Drumming Circle Activities",
    description: "Use simple hand drums or upside-down buckets. Creating a steady rhythm together can improve focus, motor coordination, and connection.",
    icon: Music,
    color: "text-daya-terracotta",
    bgColor: "bg-[#FDF8F6]",
    ringColor: "text-daya-terracotta",
    durationMinutes: 10,
  },
  {
    title: "Calm Movement Breaks",
    description: "Simple poses like 'Tree Pose' (Vrikshasana) or gentle swaying. Great for building body awareness and releasing pent-up energy smoothly.",
    icon: Activity,
    color: "text-daya-sage-dark",
    bgColor: "bg-daya-sage-light",
    ringColor: "text-daya-sage",
    durationMinutes: 10,
  },
  {
    title: "Guided Quiet Wind-down",
    description: "Gentle joint compressions or giving a tight 'bear hug' (if tolerated) while whispering soft, rhythmic affirmations to provide deep proprioceptive input.",
    icon: HeartHandshake,
    color: "text-daya-sky",
    bgColor: "bg-daya-sky/20",
    ringColor: "text-daya-sky",
    durationMinutes: 5,
  },
];

function TherapyCard({ therapy }: { therapy: typeof therapies[0] }) {
  const totalSeconds = therapy.durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(totalSeconds);
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-daya-border hover:shadow-md transition-shadow relative overflow-hidden flex flex-col"
    >
      {/* Background soft glow when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("absolute inset-0 opacity-[0.03] blur-3xl", therapy.bgColor)} 
          />
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`size-12 rounded-2xl flex items-center justify-center ${therapy.bgColor} ${therapy.color}`}>
          <therapy.icon className="size-6" />
        </div>
        {!isCompleted && (
          <span className="text-xs font-semibold uppercase tracking-wider text-daya-text-light bg-daya-cream px-3 py-1 rounded-full">
            {therapy.durationMinutes} mins
          </span>
        )}
      </div>
      
      <div className="relative z-10 flex-1">
        <h3 className="text-xl font-bold text-daya-text mb-2">{therapy.title}</h3>
        <p className="text-sm text-daya-text-secondary leading-relaxed mb-6">
          {therapy.description}
        </p>

        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#F4F9F5] rounded-2xl p-6 text-center border border-[#E8F2EA]"
            >
              <div className="size-12 bg-daya-success/20 text-[#6B9E75] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <p className="text-[#6B9E75] font-semibold">Wonderful job.</p>
              <p className="text-sm text-[#87B08F] mt-1">Aarav completed today's calming activity.</p>
              <button 
                onClick={resetTimer}
                className="mt-4 text-xs font-semibold text-[#6B9E75] hover:text-[#527d5a] transition-colors flex items-center gap-1 mx-auto"
              >
                <RotateCcw className="size-3" /> Play Again
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-6"
            >
              {/* Circular Progress */}
              <div className="relative size-24 shrink-0 flex items-center justify-center">
                <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-100 stroke-current"
                    strokeWidth="6"
                    cx="50"
                    cy="50"
                    r="44"
                    fill="transparent"
                  />
                  <motion.circle
                    className={cn("stroke-current transition-all duration-1000 ease-linear", therapy.ringColor)}
                    strokeWidth="6"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="44"
                    fill="transparent"
                    strokeDasharray={276.46} // 2 * pi * 44
                    strokeDashoffset={276.46 - (276.46 * progress) / 100}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-bold text-daya-text tracking-tighter">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <button
                  onClick={toggleTimer}
                  className={cn(
                    "size-12 rounded-full flex items-center justify-center text-white shadow-sm transition-all active:scale-95",
                    isActive ? "bg-daya-text hover:bg-daya-text/90" : "bg-daya-sage hover:bg-daya-sage-dark"
                  )}
                >
                  {isActive ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-1" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="size-12 rounded-full flex items-center justify-center bg-daya-cream text-daya-text-secondary hover:text-daya-text hover:bg-[#F2EDE4] transition-all active:scale-95"
                  title="Reset Timer"
                >
                  <RotateCcw className="size-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function HomeTherapiesPage() {
  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-daya-text mb-3 tracking-tight">Interactive Therapies</h1>
          <p className="text-daya-text-secondary text-lg leading-relaxed">
            A guided calming activity system you can use with Aarav right now. Choose a routine, press play, and let the gentle timers guide your moments of connection.
          </p>
        </div>

        {/* Note */}
        <div className="bg-gradient-to-r from-daya-cream to-white border border-daya-sage/20 rounded-3xl p-6 md:p-8 flex items-start gap-5 shadow-sm">
          <div className="bg-daya-sage-light p-3 rounded-2xl shadow-sm shrink-0">
            <Sparkles className="size-6 text-daya-sage-dark" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-daya-text mb-2">Create a Safe Space First</h4>
            <p className="text-daya-text-secondary leading-relaxed">
              Before starting a timer, ensure the room feels calm. Dim the lights slightly, reduce background noise, and invite Aarav to join you without pressure. Remember, these are meant to be joyful and regulating—stop the timer anytime if it feels like a demand.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 pt-4">
          {therapies.map((therapy) => (
            <TherapyCard key={therapy.title} therapy={therapy} />
          ))}
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Camera, 
  Calendar, 
  MapPin, 
  Heart, 
  Brain, 
  Stethoscope,
  Shield,
  Edit3,
  Save,
  ClipboardList,
  TrendingUp,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative">
              <div className="size-24 rounded-3xl bg-gradient-to-br from-[#A8C3A0] to-[#7A9E70] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#A8C3A0]/20">
                A
              </div>
              <button className="absolute -bottom-2 -right-2 size-8 rounded-full bg-white border border-[#E8E3DC] flex items-center justify-center text-[#5F6B66] hover:text-[#2F3A36] shadow-sm transition-colors">
                <Camera className="size-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#2F3A36]">Aarav Reddy</h1>
              <p className="text-[#5F6B66] mt-0.5">Age 5 · Male · Hyderabad, India</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-[#EEF4EC] text-[#7A9E70] text-xs font-semibold">ASD Level 1</span>
                <span className="px-3 py-1 rounded-full bg-[#F5F0F8] text-[#8B75A1] text-xs font-semibold">SPD</span>
                <span className="px-3 py-1 rounded-full bg-[#FDF8F6] text-[#D99873] text-xs font-semibold">Speech Delay</span>
              </div>
            </div>
            <button 
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF7F2] text-[#5F6B66] hover:bg-[#F2EDE4] hover:text-[#2F3A36] font-medium text-sm transition-colors border border-[#E8E3DC]"
            >
              {editing ? <><Save className="size-4" /> Save Changes</> : <><Edit3 className="size-4" /> Edit Profile</>}
            </button>
          </div>
        </motion.div>

        {/* DAYA Journey Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Days with DAYA", value: "32", icon: Calendar, color: "text-[#A8C3A0] bg-[#EEF4EC]" },
            { label: "Check-ins Logged", value: "28", icon: ClipboardList, color: "text-[#8B75A1] bg-[#F5F0F8]" },
            { label: "Patterns Found", value: "6", icon: Brain, color: "text-[#B8D7EA] bg-[#EDF5FA]" },
            { label: "Stability Score", value: "72", icon: TrendingUp, color: "text-[#D99873] bg-[#FDF8F6]" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-[#E8E3DC] p-5 shadow-sm">
              <div className={cn("size-10 rounded-xl flex items-center justify-center mb-3", stat.color)}>
                <stat.icon className="size-5" />
              </div>
              <p className="text-2xl font-bold text-[#2F3A36]">{stat.value}</p>
              <p className="text-xs text-[#8C9691] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Child Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
          >
            <h2 className="text-lg font-bold text-[#2F3A36] mb-6 flex items-center gap-2">
              <Heart className="size-5 text-[#A8C3A0]" />
              Child Details
            </h2>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: "Aarav Reddy" },
                { label: "Date of Birth", value: "March 15, 2021" },
                { label: "Gender", value: "Male" },
                { label: "Primary Diagnosis", value: "Autism Spectrum Disorder (Level 1)" },
                { label: "Co-occurring", value: "Sensory Processing Disorder, Speech Delay" },
                { label: "Diagnosis Date", value: "September 2023" },
                { label: "Diagnosed By", value: "Dr. Priya Sharma, NIMHANS" },
              ].map((field) => (
                <div key={field.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-[#E8E3DC]/50 last:border-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C9691] sm:w-36 shrink-0">{field.label}</span>
                  <span className="text-sm text-[#2F3A36] font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
          >
            <h2 className="text-lg font-bold text-[#2F3A36] mb-6 flex items-center gap-2">
              <Stethoscope className="size-5 text-[#A8C3A0]" />
              Care Team
            </h2>
            <div className="space-y-4">
              {[
                { name: "Dr. Priya Sharma", role: "Developmental Pediatrician", location: "NIMHANS, Bangalore", active: true },
                { name: "Meera Nair", role: "Occupational Therapist", location: "Samvedna Centre, Hyderabad", active: true },
                { name: "Kavitha Rao", role: "Speech Language Pathologist", location: "Asha Speech Clinic, Hyderabad", active: true },
                { name: "Rajesh Kumar", role: "Shadow Teacher", location: "Delhi Public School, Hyderabad", active: false },
              ].map((member) => (
                <div key={member.name} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#FAF7F2] transition-colors">
                  <div className="size-10 rounded-xl bg-[#EEF4EC] flex items-center justify-center text-[#7A9E70] font-bold text-sm shrink-0">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2F3A36]">{member.name}</p>
                    <p className="text-xs text-[#5F6B66]">{member.role}</p>
                    <p className="text-xs text-[#8C9691] flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3" /> {member.location}
                    </p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0",
                    member.active ? "bg-[#EEF4EC] text-[#7A9E70]" : "bg-[#FAF7F2] text-[#8C9691]"
                  )}>
                    {member.active ? "Active" : "Past"}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Known Patterns */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[#2F3A36] mb-6 flex items-center gap-2">
            <Sparkles className="size-5 text-[#A8C3A0]" />
            DAYA&apos;s Understanding of Aarav
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { category: "Known Triggers", items: ["Loud environments", "Unexpected schedule changes", "Crowded spaces", "Strong smells"], color: "border-[#F4E3DD] bg-[#FDF8F6]", text: "text-[#8A5A44]" },
              { category: "Calming Activities", items: ["Weighted blanket", "Drumming", "Water play", "Deep pressure brushing"], color: "border-[#D5E8D1] bg-[#EEF4EC]", text: "text-[#5A7A54]" },
              { category: "Communication Strengths", items: ["2-3 word requests", "Points to preferred items", "Eye contact improving", "Responds to name"], color: "border-[#E2D5ED] bg-[#F5F0F8]", text: "text-[#5A4570]" },
              { category: "Preferred Foods", items: ["Idli with sambar", "Crunchy textures", "Plain rice", "Bananas"], color: "border-[#E8DFD0] bg-[#FAF7F2]", text: "text-[#6B5F4E]" },
              { category: "Best Time Windows", items: ["Morning 8-10am", "Post-nap (3pm)", "After calming activity"], color: "border-[#CFE3EE] bg-[#EDF5FA]", text: "text-[#4A6B7D]" },
              { category: "Active Concerns", items: ["Sleep inconsistency", "Afternoon meltdowns", "Food selectivity"], color: "border-[#F4E3DD] bg-[#FDF8F6]", text: "text-[#8A5A44]" },
            ].map((section) => (
              <div key={section.category} className={cn("rounded-2xl border p-5", section.color)}>
                <h3 className={cn("text-sm font-bold mb-3", section.text)}>{section.category}</h3>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className={cn("text-xs leading-relaxed", section.text)}> • {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Safety Notice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl bg-[#FAF7F2] border border-[#E8E3DC] p-5 flex items-start gap-3"
        >
          <Shield className="size-5 text-[#A8C3A0] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#2F3A36]">Your data is private and secure</p>
            <p className="text-xs text-[#5F6B66] mt-1 leading-relaxed">
              All of Aarav&apos;s behavioral data is encrypted and stored securely. DAYA never shares your information with anyone without your explicit consent. You can export or delete all data at any time.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

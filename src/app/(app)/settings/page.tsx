"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Globe, 
  Shield, 
  Moon, 
  Palette,
  Download,
  Trash2,
  Crown,
  Check,
  ChevronRight,
  User,
  Lock,
  Mail,
  Smartphone,
  HeartHandshake
} from "lucide-react";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    checkInReminder: true,
    insightAlerts: true,
    weeklyReport: true,
    communityUpdates: false,
    workshopReminders: true,
  });

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-8">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[#2F3A36] mb-2">Settings</h1>
          <p className="text-[#5F6B66]">Manage your DAYA preferences and account.</p>
        </motion.div>

        {/* Plan Status */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl bg-gradient-to-r from-[#A8C3A0]/10 via-[#C8B6D8]/10 to-[#F4C7B8]/10 border border-[#A8C3A0]/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-[#A8C3A0]/20 flex items-center justify-center">
                <Crown className="size-6 text-[#E7C98B]" />
              </div>
              <div>
                <h3 className="font-bold text-[#2F3A36]">Premium Family Plan</h3>
                <p className="text-sm text-[#5F6B66]">₹499/month · Renews June 8, 2026</p>
              </div>
            </div>
            <button className="text-sm font-medium text-[#7A9E70] hover:text-[#5F8055] transition-colors">
              Manage Plan
            </button>
          </div>
        </motion.section>

        {/* Account */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[#2F3A36] mb-6 flex items-center gap-2">
            <User className="size-5 text-[#A8C3A0]" />
            Account
          </h2>
          <div className="space-y-4">
            {[
              { label: "Name", value: "Ananya Reddy", icon: User },
              { label: "Email", value: "ananya.reddy@email.com", icon: Mail },
              { label: "Phone", value: "+91 98765 43210", icon: Smartphone },
              { label: "Password", value: "••••••••", icon: Lock },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF7F2] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#8C9691] group-hover:text-[#5F6B66] transition-colors">
                    <field.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8C9691]">{field.label}</p>
                    <p className="text-sm text-[#2F3A36] font-medium">{field.value}</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8C9691] group-hover:text-[#5F6B66] transition-colors" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[#2F3A36] mb-6 flex items-center gap-2">
            <Bell className="size-5 text-[#A8C3A0]" />
            Notifications
          </h2>
          <div className="space-y-4">
            {[
              { key: "checkInReminder" as const, label: "Daily Check-in Reminder", desc: "Get reminded to log Aarav's day at 7:00 PM" },
              { key: "insightAlerts" as const, label: "New Insight Alerts", desc: "Be notified when DAYA detects a new behavioral pattern" },
              { key: "weeklyReport" as const, label: "Weekly Summary Report", desc: "Receive a weekly email with behavioral trends" },
              { key: "communityUpdates" as const, label: "Community Updates", desc: "New posts and replies in your parent groups" },
              { key: "workshopReminders" as const, label: "Workshop Reminders", desc: "Upcoming workshop and event notifications" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF7F2] transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#2F3A36]">{item.label}</p>
                  <p className="text-xs text-[#8C9691] mt-0.5">{item.desc}</p>
                </div>
                <button 
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={cn(
                    "relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0",
                    notifications[item.key] ? "bg-[#A8C3A0]" : "bg-[#E8E3DC]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                    notifications[item.key] ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[#2F3A36] mb-6 flex items-center gap-2">
            <Palette className="size-5 text-[#A8C3A0]" />
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF7F2] transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="size-5 text-[#8C9691]" />
                <div>
                  <p className="text-sm font-semibold text-[#2F3A36]">Language</p>
                  <p className="text-xs text-[#8C9691]">Chat and interface language</p>
                </div>
              </div>
              <span className="text-sm text-[#5F6B66] font-medium">English</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF7F2] transition-colors">
              <div className="flex items-center gap-3">
                <Moon className="size-5 text-[#8C9691]" />
                <div>
                  <p className="text-sm font-semibold text-[#2F3A36]">Theme</p>
                  <p className="text-xs text-[#8C9691]">Appearance preference</p>
                </div>
              </div>
              <span className="text-sm text-[#5F6B66] font-medium">Light (Calm)</span>
            </div>
          </div>
        </motion.section>

        {/* Data & Privacy */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-3xl bg-white border border-[#E8E3DC] p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[#2F3A36] mb-6 flex items-center gap-2">
            <Shield className="size-5 text-[#A8C3A0]" />
            Data & Privacy
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#FAF7F2] transition-colors text-left group">
              <div className="flex items-center gap-3">
                <Download className="size-5 text-[#A8C3A0]" />
                <div>
                  <p className="text-sm font-semibold text-[#2F3A36]">Export All Data</p>
                  <p className="text-xs text-[#8C9691]">Download all check-ins, insights, and reports as JSON</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-[#8C9691] group-hover:text-[#5F6B66] transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#FDF8F6] transition-colors text-left group">
              <div className="flex items-center gap-3">
                <Trash2 className="size-5 text-[#D9A5A5]" />
                <div>
                  <p className="text-sm font-semibold text-[#8A5A44]">Delete Account & Data</p>
                  <p className="text-xs text-[#8C9691]">Permanently remove all data. This action cannot be undone.</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-[#8C9691] group-hover:text-[#8A5A44] transition-colors" />
            </button>
          </div>
        </motion.section>

        {/* Save Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="flex justify-end"
        >
          <button 
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-2xl font-medium transition-all shadow-sm",
              saved 
                ? "bg-[#A8C3A0] text-white" 
                : "bg-[#2F3A36] text-white hover:bg-[#1F2A26]"
            )}
          >
            {saved ? <><Check className="size-4" /> Saved!</> : "Save Settings"}
          </button>
        </motion.div>

        {/* Footer */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HeartHandshake className="size-4 text-[#A8C3A0]" />
            <span className="text-sm font-bold text-[#2F3A36]">DAYA</span>
          </div>
          <p className="text-xs text-[#8C9691]">Version 1.0.0 · Made with ❤️ in India</p>
        </div>

      </div>
    </div>
  );
}

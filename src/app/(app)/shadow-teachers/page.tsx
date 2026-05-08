"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Clock, CheckCircle2, Languages, UserSquare2 } from "lucide-react";
import { shadowTeachers, type ShadowTeacher } from "@/lib/data/mock-directory";
import { cn } from "@/lib/utils";

export default function ShadowTeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingState, setBookingState] = useState<{ step: "idle" | "booking" | "success", teacher: ShadowTeacher | null }>({
    step: "idle",
    teacher: null,
  });

  const filteredTeachers = shadowTeachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Shadow Teachers</h1>
          <p className="text-daya-text-secondary">Find experienced professionals to support your child's integration in mainstream or specialized environments.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-daya-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-daya-text-light size-5" />
            <input
              type="text"
              placeholder="Search by name or language..."
              className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-daya-text placeholder:text-daya-text-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-3xl p-6 shadow-sm border border-daya-border flex flex-col hover:shadow-md transition-shadow">
              <div className="flex gap-4 mb-4">
                <img src={teacher.imageUrl} alt={teacher.name} className="size-20 rounded-2xl object-cover bg-daya-cream" />
                <div>
                  <h3 className="text-lg font-bold text-daya-text">{teacher.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-daya-text-secondary mb-1">
                    <UserSquare2 className="size-4" />
                    <span>{teacher.availability}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-daya-gold">
                    <Star className="size-4 fill-current" />
                    <span>{teacher.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-daya-text-secondary leading-relaxed mb-6 flex-1 line-clamp-3">
                {teacher.about}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-daya-sage-dark shrink-0" />
                  <span className="text-sm text-daya-text-secondary">{teacher.experienceYears} years of inclusive education experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <Languages className="size-5 text-daya-lavender shrink-0" />
                  <span className="text-sm text-daya-text-secondary">Speaks: {teacher.languages.join(", ")}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-daya-border mt-auto">
                <span className="font-semibold text-daya-text">{teacher.hourlyRate}</span>
                <button 
                  onClick={() => setBookingState({ step: "booking", teacher })}
                  className="bg-daya-sage hover:bg-daya-sage-dark text-white px-5 py-2 rounded-xl font-medium transition-colors"
                >
                  Request Callback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingState.step !== "idle" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-daya-text/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-daya-border"
            >
              {bookingState.step === "booking" && bookingState.teacher && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-daya-text">Request a Callback</h2>
                  <p className="text-daya-text-secondary text-sm">
                    Leave your details and <strong>{bookingState.teacher.name}</strong> will call you to discuss your child's needs and school environment.
                  </p>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-daya-text">Your Phone Number</label>
                    <input 
                      type="tel"
                      className="w-full bg-daya-cream border-transparent focus:border-daya-sage focus:ring-0 rounded-xl px-4 py-3 text-daya-text outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-daya-text">Brief Note about Support Needs</label>
                    <textarea 
                      className="w-full bg-daya-cream border-transparent focus:border-daya-sage focus:ring-0 rounded-xl px-4 py-3 text-daya-text outline-none resize-none h-24"
                      placeholder="e.g. Need support during transition periods and recess..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setBookingState({ step: "idle", teacher: null })}
                      className="flex-1 bg-daya-cream text-daya-text px-4 py-3 rounded-xl font-medium hover:bg-[#F2EDE4] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setBookingState({ step: "success", teacher: bookingState.teacher })}
                      className="flex-1 bg-daya-sage text-white px-4 py-3 rounded-xl font-medium hover:bg-daya-sage-dark transition-colors"
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              )}

              {bookingState.step === "success" && (
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="size-16 bg-daya-success/20 text-daya-sage-dark rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-daya-text">Request Sent</h2>
                  <p className="text-daya-text-secondary text-sm px-4">
                    {bookingState.teacher?.name} has received your details and will call you within the next business day.
                  </p>
                  <button 
                    onClick={() => setBookingState({ step: "idle", teacher: null })}
                    className="w-full bg-daya-cream text-daya-text px-4 py-3 rounded-xl font-medium hover:bg-[#F2EDE4] transition-colors mt-6"
                  >
                    Return to Directory
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

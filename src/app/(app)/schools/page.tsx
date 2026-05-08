"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, CheckCircle2, GraduationCap, HeartPulse } from "lucide-react";
import { schools, type School } from "@/lib/data/mock-directory";
import { cn } from "@/lib/utils";

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingState, setBookingState] = useState<{ step: "idle" | "booking" | "success", school: School | null }>({
    step: "idle",
    school: null,
  });

  const filteredSchools = schools.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Autism-Friendly Schools</h1>
          <p className="text-daya-text-secondary">Discover inclusive schools and specialized academies verified for neurodivergent support.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-daya-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-daya-text-light size-5" />
            <input
              type="text"
              placeholder="Search by school name or location..."
              className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-daya-text placeholder:text-daya-text-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchools.map((school) => (
            <div key={school.id} className="bg-white rounded-3xl p-6 shadow-sm border border-daya-border flex flex-col hover:shadow-md transition-shadow">
              
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img src={school.imageUrl} alt={school.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-daya-sage-dark flex items-center gap-1">
                  <Star className="size-3 fill-current" /> {school.rating}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-daya-text mb-1">{school.name}</h3>
                <div className="flex items-center gap-2 text-sm text-daya-text-secondary">
                  <MapPin className="size-4" />
                  <span>{school.location}</span>
                </div>
              </div>

              <p className="text-sm text-daya-text-secondary leading-relaxed mb-6 flex-1">
                {school.about}
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <HeartPulse className="size-5 text-daya-terracotta shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-daya-text">Support Level: {school.autismSupportLevel}</p>
                    <p className="text-xs text-daya-text-secondary mt-1">{school.therapiesAvailable.join(" • ")}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <GraduationCap className="size-5 text-daya-sky shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-daya-text">Facilities</p>
                    <p className="text-xs text-daya-text-secondary mt-1">{school.facilities.join(" • ")}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-daya-border mt-auto">
                <span className="font-semibold text-daya-text">{school.fees}</span>
                <button 
                  onClick={() => setBookingState({ step: "booking", school })}
                  className="bg-daya-sage hover:bg-daya-sage-dark text-white px-5 py-2 rounded-xl font-medium transition-colors"
                >
                  Request Admission Info
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
              {bookingState.step === "booking" && bookingState.school && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-daya-text">Admission Inquiry</h2>
                  <p className="text-daya-text-secondary text-sm">
                    Connect with the admissions team at <strong>{bookingState.school.name}</strong> to learn more about their program and setup a tour.
                  </p>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-daya-text">Your Child's Age</label>
                    <select className="w-full bg-daya-cream border-transparent focus:border-daya-sage focus:ring-0 rounded-xl px-4 py-3 text-daya-text outline-none">
                      <option>Early Intervention (2-5 yrs)</option>
                      <option>Elementary (6-11 yrs)</option>
                      <option>Middle School (12-14 yrs)</option>
                      <option>High School (15+ yrs)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-daya-text">Questions for Admissions</label>
                    <textarea 
                      className="w-full bg-daya-cream border-transparent focus:border-daya-sage focus:ring-0 rounded-xl px-4 py-3 text-daya-text outline-none resize-none h-24"
                      placeholder="e.g. Do you have a BCBA on staff? What is your class size ratio?"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setBookingState({ step: "idle", school: null })}
                      className="flex-1 bg-daya-cream text-daya-text px-4 py-3 rounded-xl font-medium hover:bg-[#F2EDE4] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setBookingState({ step: "success", school: bookingState.school })}
                      className="flex-1 bg-daya-sage text-white px-4 py-3 rounded-xl font-medium hover:bg-daya-sage-dark transition-colors"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </div>
              )}

              {bookingState.step === "success" && (
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="size-16 bg-daya-success/20 text-daya-sage-dark rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-daya-text">Inquiry Sent</h2>
                  <p className="text-daya-text-secondary text-sm px-4">
                    The admissions team at {bookingState.school?.name} has received your request and will reach out via email within 48 hours.
                  </p>
                  <button 
                    onClick={() => setBookingState({ step: "idle", school: null })}
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

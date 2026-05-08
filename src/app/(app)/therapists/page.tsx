"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { therapists, type Therapist } from "@/lib/data/mock-directory";
import { cn } from "@/lib/utils";

export default function TherapistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingState, setBookingState] = useState<{ step: "idle" | "booking" | "success", therapist: Therapist | null }>({
    step: "idle",
    therapist: null,
  });

  const filteredTherapists = therapists.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Find a Therapist</h1>
          <p className="text-daya-text-secondary">Discover specialized professionals experienced in neurodivergent care.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-daya-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-daya-text-light size-5" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-daya-text placeholder:text-daya-text-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTherapists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-3xl p-6 shadow-sm border border-daya-border flex flex-col hover:shadow-md transition-shadow">
              <div className="flex gap-4 mb-4">
                <img src={therapist.imageUrl} alt={therapist.name} className="size-20 rounded-2xl object-cover bg-daya-cream" />
                <div>
                  <h3 className="text-lg font-bold text-daya-text">{therapist.name}</h3>
                  <p className="text-sm text-daya-text-secondary mb-1">{therapist.specialization}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-daya-gold">
                    <Star className="size-4 fill-current" />
                    <span>{therapist.rating}</span>
                    <span className="text-daya-text-light font-normal">({therapist.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-daya-text-secondary leading-relaxed mb-6 flex-1 line-clamp-3">
                {therapist.about}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-daya-text-secondary">
                  <Clock className="size-4 text-daya-sage-dark" />
                  <span>{therapist.experienceYears} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-daya-text-secondary">
                  <Calendar className="size-4 text-daya-sage-dark" />
                  <span>Next available: {therapist.availability[0]}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-daya-border mt-auto">
                <span className="font-semibold text-daya-text">{therapist.fees}</span>
                <button 
                  onClick={() => setBookingState({ step: "booking", therapist })}
                  className="bg-daya-sage hover:bg-daya-sage-dark text-white px-5 py-2 rounded-xl font-medium transition-colors"
                >
                  Book Session
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
              {bookingState.step === "booking" && bookingState.therapist && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-daya-text">Request Session</h2>
                  <p className="text-daya-text-secondary text-sm">
                    You are requesting a session with <strong>{bookingState.therapist.name}</strong>. They will contact you to confirm the exact time.
                  </p>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-daya-text">Preferred Time Slot</label>
                    <select className="w-full bg-daya-cream border-transparent focus:border-daya-sage focus:ring-0 rounded-xl px-4 py-3 text-daya-text outline-none">
                      {bookingState.therapist.availability.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-daya-text">Note for Therapist (Optional)</label>
                    <textarea 
                      className="w-full bg-daya-cream border-transparent focus:border-daya-sage focus:ring-0 rounded-xl px-4 py-3 text-daya-text outline-none resize-none h-24"
                      placeholder="e.g. My child is currently experiencing high sensory overload..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setBookingState({ step: "idle", therapist: null })}
                      className="flex-1 bg-daya-cream text-daya-text px-4 py-3 rounded-xl font-medium hover:bg-[#F2EDE4] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setBookingState({ step: "success", therapist: bookingState.therapist })}
                      className="flex-1 bg-daya-sage text-white px-4 py-3 rounded-xl font-medium hover:bg-daya-sage-dark transition-colors"
                    >
                      Confirm Request
                    </button>
                  </div>
                </div>
              )}

              {bookingState.step === "success" && (
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="size-16 bg-daya-success/20 text-daya-sage-dark rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-daya-text">Request Submitted</h2>
                  <p className="text-daya-text-secondary text-sm px-4">
                    Your session request with {bookingState.therapist?.name} has been sent. You will receive a confirmation email shortly.
                  </p>
                  <button 
                    onClick={() => setBookingState({ step: "idle", therapist: null })}
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

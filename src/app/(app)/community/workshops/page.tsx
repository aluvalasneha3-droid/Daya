"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, BookOpen, CheckCircle2 } from "lucide-react";
import { workshops, type CommunityWorkshop } from "@/lib/data/mock-directory";
import { cn } from "@/lib/utils";

export default function WorkshopsPage() {
  const [bookingState, setBookingState] = useState<{ step: "idle" | "booking" | "success", workshop: CommunityWorkshop | null }>({
    step: "idle",
    workshop: null,
  });

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Workshops & Coaching</h1>
          <p className="text-daya-text-secondary">Join expert-led sessions designed to empower parents with practical strategies and emotional support.</p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-daya-border flex flex-col hover:shadow-md transition-shadow group">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={workshop.imageUrl} 
                  alt={workshop.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-daya-text flex items-center gap-1">
                  <BookOpen className="size-3 text-daya-sage-dark" /> {workshop.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-daya-text mb-2 leading-tight">{workshop.title}</h3>
                <p className="text-sm font-medium text-daya-sage-dark mb-4">Hosted by {workshop.host}</p>
                
                <p className="text-sm text-daya-text-secondary leading-relaxed mb-6 flex-1">
                  {workshop.description}
                </p>

                <div className="grid grid-cols-2 gap-y-3 mb-6 bg-daya-cream p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-sm text-daya-text-secondary">
                    <Calendar className="size-4 text-daya-text" />
                    <span className="font-medium text-daya-text">{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-daya-text-secondary">
                    <Clock className="size-4 text-daya-text" />
                    <span className="font-medium text-daya-text">{workshop.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-daya-text-secondary col-span-2">
                    <Users className="size-4 text-daya-text" />
                    <span>{workshop.attendees} parents attending</span>
                  </div>
                </div>

                <button 
                  onClick={() => setBookingState({ step: "booking", workshop })}
                  className="w-full bg-daya-sage hover:bg-daya-sage-dark text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Reserve Your Spot
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
              {bookingState.step === "booking" && bookingState.workshop && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-daya-text">Reserve Your Spot</h2>
                  <div className="bg-daya-cream p-4 rounded-xl mb-4">
                    <p className="font-bold text-daya-text mb-1">{bookingState.workshop.title}</p>
                    <p className="text-sm text-daya-text-secondary">{bookingState.workshop.date} at {bookingState.workshop.time}</p>
                  </div>
                  
                  <p className="text-daya-text-secondary text-sm">
                    This is a safe, judgment-free space. You can keep your camera off if you prefer. A Zoom link will be emailed to you.
                  </p>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setBookingState({ step: "idle", workshop: null })}
                      className="flex-1 bg-daya-cream text-daya-text px-4 py-3 rounded-xl font-medium hover:bg-[#F2EDE4] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setBookingState({ step: "success", workshop: bookingState.workshop })}
                      className="flex-1 bg-daya-sage text-white px-4 py-3 rounded-xl font-medium hover:bg-daya-sage-dark transition-colors"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}

              {bookingState.step === "success" && (
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="size-16 bg-daya-success/20 text-daya-sage-dark rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-daya-text">Spot Reserved</h2>
                  <p className="text-daya-text-secondary text-sm px-4">
                    You're all set! We've sent the meeting details to your email. We look forward to seeing you there.
                  </p>
                  <button 
                    onClick={() => setBookingState({ step: "idle", workshop: null })}
                    className="w-full bg-daya-cream text-daya-text px-4 py-3 rounded-xl font-medium hover:bg-[#F2EDE4] transition-colors mt-6"
                  >
                    Back to Workshops
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

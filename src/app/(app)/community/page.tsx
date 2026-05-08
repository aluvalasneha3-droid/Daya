"use client";

import Link from "next/link";
import { Users, Heart, MessageCircle, ArrowRight } from "lucide-react";

export default function CommunitiesPage() {
  const groups = [
    {
      id: "g1",
      title: "Sensory Support Circle",
      members: 1240,
      description: "A safe space to discuss sensory processing challenges, share sensory-friendly clothing brands, and vent about the hard days.",
      active: true
    },
    {
      id: "g2",
      title: "Parents of Non-Verbal Kids",
      members: 850,
      description: "Focusing on AAC devices, gestalt language processing, and finding connection beyond spoken words.",
      active: true
    },
    {
      id: "g3",
      title: "Navigating Early Intervention",
      members: 2100,
      description: "For parents of newly diagnosed children (ages 2-5). Share experiences with first therapies and preschool transitions.",
      active: true
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-daya-text mb-2">Community Support</h1>
          <p className="text-daya-text-secondary">You don't have to navigate this alone. Connect with parents who truly understand the journey.</p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-r from-daya-sage to-[#94B38C] rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-2">Upcoming Expert Workshops</h2>
            <p className="text-white/90 mb-4">
              Join our weekly live sessions with behavioral specialists, occupational therapists, and experienced parents.
            </p>
            <Link 
              href="/community/workshops"
              className="inline-flex items-center gap-2 bg-white text-daya-sage-dark px-5 py-2.5 rounded-xl font-medium hover:bg-daya-cream transition-colors"
            >
              View Schedule <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="hidden md:flex size-24 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm">
            <Heart className="size-10 text-white fill-current" />
          </div>
        </div>

        {/* Groups Grid */}
        <div>
          <h2 className="text-xl font-bold text-daya-text mb-6">Active Support Circles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-3xl p-6 border border-daya-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="size-12 bg-daya-lavender/20 text-daya-lavender rounded-2xl flex items-center justify-center mb-4">
                  <Users className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-daya-text mb-2">{group.title}</h3>
                <p className="text-sm text-daya-text-secondary mb-6 flex-1 line-clamp-3">
                  {group.description}
                </p>
                <div className="flex items-center justify-between border-t border-daya-border pt-4 mt-auto">
                  <span className="text-xs font-medium text-daya-text-light">{group.members.toLocaleString()} members</span>
                  <button className="text-sm font-medium text-daya-sage-dark hover:text-daya-sage transition-colors flex items-center gap-1">
                    Join Group <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

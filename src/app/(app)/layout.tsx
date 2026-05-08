"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { 
  MessageCircle, 
  LayoutDashboard, 
  ClipboardList, 
  HeartHandshake,
  LogOut,
  BrainCircuit,
  CalendarDays,
  GraduationCap,
  UserSquare2,
  Users,
  FileText,
  Stethoscope,
  BookOpen,
  FolderOpen,
  Activity,
  Menu,
  X,
  Sparkles,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationGroups = [
  {
    title: "Daily Support",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Daya Chat", href: "/chat", icon: MessageCircle },
      { name: "Daily Check-in", href: "/checkin", icon: ClipboardList },
      { name: "Daily Planner", href: "/planner", icon: CalendarDays },
      { name: "Home Therapies", href: "/home-therapies", icon: Activity },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { name: "Behavioral Insights", href: "/behavioral", icon: BrainCircuit },
      { name: "Medical Records", href: "/medical-records", icon: FolderOpen },
      { name: "Doctor Reports", href: "/reports", icon: FileText },
    ]
  },
  {
    title: "Continuity of Care",
    items: [
      { name: "Therapists", href: "/therapists", icon: Stethoscope },
      { name: "Autism Schools", href: "/schools", icon: GraduationCap },
      { name: "Shadow Teachers", href: "/shadow-teachers", icon: UserSquare2 },
    ]
  },
  {
    title: "Parenting",
    items: [
      { name: "Communities", href: "/community", icon: Users },
      { name: "Workshops", href: "/community/workshops", icon: BookOpen },
    ]
  },
  {
    title: "Account",
    items: [
      { name: "Child Profile", href: "/profile", icon: HeartHandshake },
    ]
  }
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-20 shrink-0 items-center px-8">
        <Link href="/" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="flex size-10 items-center justify-center rounded-2xl bg-daya-sage text-white shadow-sm">
            <HeartHandshake className="size-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-daya-text">DAYA</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-8 px-6 py-4">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-2 text-xs font-semibold tracking-wider text-daya-text-light uppercase mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                      isActive
                        ? "bg-daya-sage-light text-daya-text shadow-sm"
                        : "text-daya-text-secondary hover:bg-daya-cream hover:text-daya-text"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        isActive ? "text-daya-sage-dark" : "text-daya-text-light group-hover:text-daya-sage"
                      )}
                    />
                    {item.name}
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active-indicator"
                        className="absolute left-0 w-1 h-8 bg-daya-sage rounded-r-full" 
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Premium Card */}
      <div className="px-6 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-daya-sage/10 via-daya-lavender/10 to-daya-peach/10 border border-daya-sage/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="size-4 text-daya-gold" />
            <span className="text-xs font-bold text-daya-text uppercase tracking-wide">Premium Active</span>
          </div>
          <p className="text-[11px] text-daya-text-secondary leading-relaxed">
            Advanced analytics, predictive planning, and detailed behavioral reports.
          </p>
        </div>
      </div>

      <div className="border-t border-daya-border p-6 mt-auto shrink-0">
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-daya-cream hover:bg-[#F2EDE4] transition-colors border border-transparent hover:border-daya-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-daya-sage-light flex items-center justify-center text-daya-sage-dark font-bold text-sm">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-daya-text">Aarav&apos;s Parent</p>
              <p className="truncate text-xs text-daya-text-secondary">Premium Family</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = "/"}
            className="text-daya-text-light hover:text-daya-error transition-colors p-2 rounded-md hover:bg-white"
            title="Sign Out"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-daya-cream text-daya-text font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 border-r border-daya-border bg-daya-offwhite lg:flex lg:flex-col overflow-y-auto custom-scrollbar">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-daya-border bg-daya-offwhite/95 backdrop-blur-xl px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-daya-sage text-white shadow-sm">
            <HeartHandshake className="size-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-daya-text">DAYA</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/chat" className="flex items-center gap-1.5 rounded-xl bg-daya-sage/10 px-3 py-2 text-xs font-semibold text-daya-sage-dark">
            <Sparkles className="size-3.5" />
            Chat
          </Link>
          <button 
            onClick={() => setMobileOpen(true)}
            className="flex size-10 items-center justify-center rounded-xl bg-daya-cream text-daya-text hover:bg-[#F2EDE4] transition-colors"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 flex flex-col bg-daya-offwhite shadow-2xl lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-4 flex size-9 items-center justify-center rounded-xl bg-daya-cream text-daya-text-secondary hover:text-daya-text hover:bg-[#F2EDE4] transition-colors"
              >
                <X className="size-5" />
              </button>
              <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

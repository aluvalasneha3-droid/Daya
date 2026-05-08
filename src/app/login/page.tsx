"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeartHandshake, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-daya-cream px-5 py-12 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-daya-sage/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-daya-lavender/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] space-y-8 z-10"
      >
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-daya-sage text-white shadow-lg shadow-daya-sage/20 transition-transform hover:scale-105">
            <HeartHandshake className="size-7" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-daya-text font-heading">Welcome back</h1>
          <p className="mt-2 text-daya-text-secondary">Sign in to continue supporting Aarav.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 rounded-[2rem] border border-daya-border bg-white/80 backdrop-blur-xl p-8 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-daya-text-light ml-1">Email Address</label>
            <input 
              type="text" 
              placeholder="parent@example.com" 
              className="w-full h-12 px-4 rounded-xl border border-daya-border bg-daya-cream focus:bg-white focus:border-daya-sage focus:ring-1 focus:ring-daya-sage outline-none transition-all text-daya-text"
              defaultValue="demo@daya.app"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-daya-text-light">Password</label>
              <button 
                type="button" 
                onClick={() => alert("Password reset link sent to your email.")}
                className="text-[10px] font-bold text-daya-sage-dark hover:text-daya-sage transition-colors"
              >
                Forgot?
              </button>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-12 px-4 rounded-xl border border-daya-border bg-daya-cream focus:bg-white focus:border-daya-sage focus:ring-1 focus:ring-daya-sage outline-none transition-all text-daya-text"
              defaultValue="password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full h-14 mt-4 rounded-xl bg-daya-sage text-white font-medium hover:bg-daya-sage-dark shadow-lg shadow-daya-sage/20 transition-all active:scale-[0.98] flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <ArrowRight className="size-4" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-daya-text-secondary">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={() => alert("Thank you! An invite link will be sent to your email.")}
            className="font-bold text-daya-sage-dark hover:text-daya-sage transition-colors"
          >
            Request an Invite
          </button>
        </p>
      </motion.div>
    </div>
  );
}

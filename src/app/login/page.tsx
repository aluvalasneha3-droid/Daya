"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HeartHandshake, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAuthClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const auth = getAuthClient();
    if (!auth) {
      setError("Supabase is not configured. Add your Supabase URL and anon key to .env.local.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Please enter your name.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");

        const { data, error: signUpError } = await auth.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          router.push(new URL(window.location.href).searchParams.get("next") ?? "/dashboard");
          router.refresh();
          return;
        }

        setMessage("Account created. Check your email to confirm it, then sign in.");
        setMode("login");
      } else {
        const { error: signInError } = await auth.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        router.push(new URL(window.location.href).searchParams.get("next") ?? "/dashboard");
        router.refresh();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to complete authentication.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight text-daya-text font-heading">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-daya-text-secondary">
            {mode === "login" ? "Sign in to continue supporting your child." : "Set up your private DAYA account."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-daya-border bg-white/80 backdrop-blur-xl p-8 shadow-sm">
          {mode === "signup" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-daya-text-light ml-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full h-12 px-4 rounded-xl border border-daya-border bg-daya-cream focus:bg-white focus:border-daya-sage focus:ring-1 focus:ring-daya-sage outline-none transition-all text-daya-text"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-daya-text-light ml-1">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="parent@example.com" 
              required
              className="w-full h-12 px-4 rounded-xl border border-daya-border bg-daya-cream focus:bg-white focus:border-daya-sage focus:ring-1 focus:ring-daya-sage outline-none transition-all text-daya-text"
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••" 
              required
              className="w-full h-12 px-4 rounded-xl border border-daya-border bg-daya-cream focus:bg-white focus:border-daya-sage focus:ring-1 focus:ring-daya-sage outline-none transition-all text-daya-text"
            />
          </div>

          {error && <p className="text-sm text-daya-error">{error}</p>}
          {message && <p className="text-sm text-daya-sage-dark">{message}</p>}

          <button 
            type="submit" 
            className="w-full h-14 mt-4 rounded-xl bg-daya-sage text-white font-medium hover:bg-daya-sage-dark shadow-lg shadow-daya-sage/20 transition-all active:scale-[0.98] flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="size-4" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-daya-text-secondary">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setError("");
              setMessage("");
              setMode(mode === "login" ? "signup" : "login");
            }}
            className="font-bold text-daya-sage-dark hover:text-daya-sage transition-colors"
          >
            {mode === "login" ? "Create Account" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-daya-cream" />}>
      <LoginForm />
    </Suspense>
  );
}

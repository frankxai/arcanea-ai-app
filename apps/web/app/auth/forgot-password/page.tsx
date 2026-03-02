"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  PhEnvelope,
  PhArrowLeft,
  PhCircleNotch,
  PhWarningCircle,
  PhCheckCircle,
} from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${origin}/auth/reset-password`,
        },
      );

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Password reset link sent. Check your email.");
      router.refresh();
    } catch {
      setError("Unable to send reset email right now.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlowCard glass="none" className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-display font-bold mb-2 text-text-primary">
            Reset Password
          </h1>
          <p className="text-text-secondary text-sm font-body mb-6 leading-relaxed">
            Enter your email and we'll send a recovery link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-text-secondary font-body mb-2"
              >
                Email
              </label>
              <div className="relative">
                <PhEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-atlantean-teal-aqua/40 focus:ring-1 focus:ring-atlantean-teal-aqua/20 focus:bg-white/[0.06] outline-none transition-all duration-300 font-body text-text-primary placeholder:text-text-muted text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                <PhWarningCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm font-body">{error}</p>
              </div>
            )}
            {message && (
              <div className="flex items-start gap-2.5 rounded-xl border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/5 px-4 py-3">
                <PhCheckCircle className="w-4 h-4 text-atlantean-teal-aqua mt-0.5 shrink-0" />
                <p className="text-atlantean-teal-aqua text-sm font-body">
                  {message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-aqua/80 text-cosmic-deep font-semibold text-sm hover:shadow-[0_0_30px_rgba(127,255,212,0.25)] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <PhCircleNotch className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <Link
            href="/auth/login"
            className="flex items-center gap-2 mt-6 text-sm text-text-secondary hover:text-text-primary font-body transition-colors"
          >
            <PhArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </GlowCard>
      </motion.div>
    </div>
  );
}

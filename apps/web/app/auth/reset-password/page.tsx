"use client";

import { useEffect, useState } from "react";
import { MotionProvider, m } from "@/lib/motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  PhLock,
  PhEye,
  PhEyeSlash,
  PhCircleNotch,
  PhWarningCircle,
  PhCheckCircle,
} from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setHasRecoverySession(Boolean(session));
        }
      } catch {
        if (mounted) {
          setHasRecoverySession(false);
        }
      }
    }

    void checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch {
      setError("Unable to reset password right now.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MotionProvider>
    <div className="flex items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-12">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlowCard glass="none" className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-display font-bold mb-2 text-text-primary">
            Create New Password
          </h1>
          <p className="text-text-secondary text-sm font-body mb-6 leading-relaxed">
            Choose a strong new password for your account.
          </p>

          {hasRecoverySession === false && !message && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 mb-5">
              <PhWarningCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-sm font-body">
                This recovery link is invalid or expired.{" "}
                <Link
                  href="/auth/forgot-password"
                  className="underline hover:no-underline"
                >
                  Request a new one
                </Link>
                .
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-text-secondary font-body mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <PhLock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="New password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-atlantean-teal-aqua/40 focus:ring-1 focus:ring-atlantean-teal-aqua/20 focus:bg-white/[0.06] outline-none transition-all duration-300 font-body text-text-primary placeholder:text-text-muted text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <PhEyeSlash className="w-[18px] h-[18px]" />
                  ) : (
                    <PhEye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-text-secondary font-body mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <PhLock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Confirm password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-atlantean-teal-aqua/40 focus:ring-1 focus:ring-atlantean-teal-aqua/20 focus:bg-white/[0.06] outline-none transition-all duration-300 font-body text-text-primary placeholder:text-text-muted text-sm"
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
              disabled={isLoading || hasRecoverySession === false}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-aqua/80 text-cosmic-deep font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,188,212,0.25)] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <PhCircleNotch className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-text-secondary font-body">
            Need a new link?{" "}
            <Link
              href="/auth/forgot-password"
              className="text-atlantean-teal-aqua/70 hover:text-atlantean-teal-aqua transition-colors"
            >
              Request another reset
            </Link>
          </p>
        </GlowCard>
      </m.div>
    </div>
    </MotionProvider>
  );
}

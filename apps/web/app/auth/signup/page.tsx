"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  PhEnvelope,
  PhLock,
  PhUser,
  PhArrowRight,
  PhSparkle,
  PhEye,
  PhEyeSlash,
  PhCheck,
  PhWarningCircle,
  PhCircleNotch,
  PhGithubLogo,
} from "@/lib/phosphor-icons";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = [
    { label: "8+ characters", check: password.length >= 8 },
    { label: "Contains a number", check: /\d/.test(password) },
    { label: "Contains a letter", check: /[a-zA-Z]/.test(password) },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!passwordChecks.every((c) => c.check)) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    setIsLoading(true);

    try {
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        setError(
          "Authentication is not configured yet. Please check back soon.",
        );
        return;
      }

      const supabase = createClient();
      const origin = window.location.origin;
      const emailRedirectTo = new URL("/auth/callback", origin);
      emailRedirectTo.searchParams.set("next", "/onboarding");

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: emailRedirectTo.toString(),
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/auth/login?message=check_email");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError("");

    try {
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        setError(
          "Authentication is not configured yet. Please check back soon.",
        );
        return;
      }

      const supabase = createClient();
      const origin = window.location.origin;
      const callbackUrl = new URL("/auth/callback", origin);
      callbackUrl.searchParams.set("next", "/onboarding");

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        if (
          error.message.includes("provider") ||
          error.message.includes("Unsupported")
        ) {
          setError(
            `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-up is not available yet. Please use email and password.`,
          );
        } else {
          setError(error.message);
        }
      }
    } catch {
      setError(`Failed to sign up with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-atlantean-teal-aqua/15 to-atlantean-teal-aqua/5 border border-atlantean-teal-aqua/20">
              <PhSparkle
                className="w-8 h-8 text-atlantean-teal-aqua"
                weight="duotone"
              />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-2">
            Create Account
          </h1>
          <p className="font-body text-text-secondary text-sm">
            Start building your creative universe
          </p>
        </div>

        {/* Signup card */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          {/* Social signup buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300 font-body text-text-secondary text-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup("github")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300 font-body text-text-secondary text-sm disabled:opacity-50"
            >
              <PhGithubLogo className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-cosmic-void font-body text-xs text-text-muted">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block font-body text-sm text-text-secondary mb-2"
              >
                Name
              </label>
              <div className="relative">
                <PhUser className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-atlantean-teal-aqua/40 focus:ring-1 focus:ring-atlantean-teal-aqua/20 focus:bg-white/[0.06] outline-none transition-all duration-300 font-body text-text-primary placeholder:text-text-muted text-sm"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block font-body text-sm text-text-secondary mb-2"
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
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-atlantean-teal-aqua/40 focus:ring-1 focus:ring-atlantean-teal-aqua/20 focus:bg-white/[0.06] outline-none transition-all duration-300 font-body text-text-primary placeholder:text-text-muted text-sm"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block font-body text-sm text-text-secondary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <PhLock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
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

              {/* Password requirements */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex flex-wrap gap-x-4 gap-y-1 mt-3"
                >
                  {passwordChecks.map((check, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1.5 text-xs font-body ${
                        check.check
                          ? "text-atlantean-teal-aqua"
                          : "text-text-muted"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          check.check
                            ? "bg-atlantean-teal-aqua/20"
                            : "bg-white/[0.06]"
                        }`}
                      >
                        {check.check && (
                          <PhCheck className="w-2.5 h-2.5 text-atlantean-teal-aqua" />
                        )}
                      </div>
                      {check.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
                role="alert"
              >
                <PhWarningCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm font-body leading-relaxed">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Terms */}
            <p className="font-body text-xs text-text-muted leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-atlantean-teal-aqua/70 hover:text-atlantean-teal-aqua transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-atlantean-teal-aqua/70 hover:text-atlantean-teal-aqua transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-aqua/80 text-cosmic-deep font-semibold text-sm shadow-[0_0_20px_rgba(127,255,212,0.1)] hover:shadow-[0_0_30px_rgba(127,255,212,0.25)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <PhCircleNotch className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  Create Account
                  <PhArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-8 font-body text-text-secondary text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-atlantean-teal-aqua hover:text-atlantean-teal-aqua/80 transition-colors font-semibold"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  PhEnvelope,
  PhLock,
  PhArrowRight,
  PhSparkle,
  PhEye,
  PhEyeSlash,
  PhCircleNotch,
  PhWarningCircle,
  PhGithubLogo,
} from "@/lib/phosphor-icons";
import type { PhosphorIcon } from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";

function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <PhCircleNotch className="w-5 h-5 animate-spin" />
      <span>{text}</span>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
      role="alert"
    >
      <PhWarningCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
      <p className="text-red-400 text-sm font-body leading-relaxed">{message}</p>
    </motion.div>
  );
}

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  showToggle,
  toggleVisible,
  onToggle,
  required,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: PhosphorIcon;
  showToggle?: boolean;
  toggleVisible?: boolean;
  onToggle?: () => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-body text-sm text-text-secondary mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-atlantean-teal-aqua/40 focus:ring-1 focus:ring-atlantean-teal-aqua/20 focus:bg-white/[0.06] outline-none transition-all duration-300 font-body text-text-primary placeholder:text-text-muted text-sm"
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            aria-label={toggleVisible ? "Hide password" : "Show password"}
          >
            {toggleVisible ? (
              <PhEyeSlash className="w-[18px] h-[18px]" />
            ) : (
              <PhEye className="w-[18px] h-[18px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SocialButton({
  provider,
  icon,
  onClick,
  disabled,
}: {
  provider: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300 font-body text-text-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      {provider}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const callbackError = searchParams.get("error");
  const authMessage = searchParams.get("message");
  const nextPath = searchParams.get("next") || "/dashboard";

  const callbackErrorMessage =
    callbackError === "callback_failed"
      ? "Sign-in callback failed. Please try again."
      : callbackError === "missing_code"
        ? "Missing sign-in code. Please start the login flow again."
        : "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
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
      callbackUrl.searchParams.set("next", nextPath);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase() as "google" | "github",
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
            `${provider} sign-in is not available yet. Please use email and password.`,
          );
        } else {
          setError(error.message);
        }
      }
    } catch {
      setError(`Failed to sign in with ${provider}. Please try again.`);
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
            Welcome Back
          </h1>
          <p className="text-text-secondary font-body text-sm">
            Continue your creative journey
          </p>
        </div>

        {/* Login card */}
        <GlowCard glass="none" className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          {authMessage === "check_email" && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/5 px-4 py-3 text-sm font-body text-text-primary"
            >
              Check your email for the confirmation link to complete sign-up.
            </motion.p>
          )}

          {callbackErrorMessage && (
            <div className="mb-5">
              <ErrorMessage message={callbackErrorMessage} />
            </div>
          )}

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <SocialButton
              provider="Google"
              icon={
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
              }
              onClick={() => handleSocialLogin("Google")}
              disabled={isLoading}
            />
            <SocialButton
              provider="GitHub"
              icon={<PhGithubLogo className="w-4 h-4" />}
              onClick={() => handleSocialLogin("GitHub")}
              disabled={isLoading}
            />
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

          <form onSubmit={handleLogin} className="space-y-5">
            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={PhEnvelope}
              required
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={PhLock}
              showToggle
              toggleVisible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              required
            />

            {error && <ErrorMessage message={error} />}

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="font-body text-sm text-atlantean-teal-aqua/70 hover:text-atlantean-teal-aqua transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-aqua/80 text-cosmic-deep font-semibold text-sm shadow-[0_0_20px_rgba(0,188,212,0.1)] hover:shadow-[0_0_30px_rgba(0,188,212,0.25)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <LoadingSpinner text="Signing in..." />
              ) : (
                <>
                  <span>Sign In</span>
                  <PhArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </GlowCard>

        {/* Sign up link */}
        <p className="text-center mt-8 font-body text-text-secondary text-sm">
          New to Arcanea?{" "}
          <Link
            href="/auth/signup"
            className="text-atlantean-teal-aqua hover:text-atlantean-teal-aqua/80 transition-colors font-semibold"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

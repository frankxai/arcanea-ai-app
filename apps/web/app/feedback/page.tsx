"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PhPaperPlane,
  PhCheck,
  PhWarning,
  PhBug,
  PhLightbulb,
  PhChatCircle,
  PhSparkle,
} from "@/lib/phosphor-icons";

// ─── Types ──────────────────────────────────────────────────────────────────────

type FeedbackType = "bug" | "feature" | "general";

interface FeedbackFormData {
  type: FeedbackType;
  message: string;
  email: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

// ─── Constants ──────────────────────────────────────────────────────────────────

const FEEDBACK_TYPES: {
  value: FeedbackType;
  label: string;
  description: string;
  icon: typeof PhBug;
}[] = [
  {
    value: "bug",
    label: "Report a Disturbance",
    description: "Something is broken or behaving unexpectedly",
    icon: PhBug,
  },
  {
    value: "feature",
    label: "Envision a Feature",
    description: "A new capability or enhancement you would like to see",
    icon: PhLightbulb,
  },
  {
    value: "general",
    label: "General Transmission",
    description: "Thoughts, impressions, or anything else on your mind",
    icon: PhChatCircle,
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: "general",
    message: "",
    email: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          message: formData.message.trim(),
          email: formData.email.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      setSubmitState("success");
      setFormData({ type: "general", message: "", email: "" });
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setSubmitState("error");
      setErrorMessage(
        "The transmission could not reach the Guardians. Please try again."
      );
    }
  };

  const canSubmit =
    formData.message.trim().length > 0 && submitState !== "submitting";

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero */}
        <section className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-crystal/30 bg-crystal/10 mb-6">
            <PhSparkle size={16} weight="fill" className="text-crystal" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-crystal">
              Feedback
            </span>
          </div>

          <h1 className="text-fluid-3xl font-display font-bold mb-4 text-text-primary">
            Share Your{" "}
            <span className="text-gradient-brand">Vision</span>
          </h1>

          <p className="text-text-secondary font-body text-lg leading-relaxed max-w-xl mx-auto">
            Your feedback shapes the future of Arcanea. Every insight, every
            report, every idea brings us closer to the world we are building
            together.
          </p>
        </section>

        {/* Success State */}
        {submitState === "success" ? (
          <section className="glass rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-crystal/20 flex items-center justify-center mx-auto mb-6">
              <PhCheck
                size={32}
                weight="bold"
                className="text-crystal"
              />
            </div>
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">
              Transmission Received
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8 max-w-md mx-auto">
              The Guardians have received your message. Your contribution
              strengthens the realm for every creator who follows.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSubmitState("idle")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-crystal/15 text-crystal font-semibold border border-crystal/30 hover:bg-crystal/25 transition-all duration-200"
              >
                Send Another
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-text-primary font-semibold hover:border-crystal/30 transition-all duration-200"
              >
                Return Home
              </Link>
            </div>
          </section>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit}>
            {/* Feedback Type Selection */}
            <section className="mb-8">
              <label className="block text-sm font-mono tracking-widest uppercase text-crystal mb-4">
                What brings you here?
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {FEEDBACK_TYPES.map((ft) => {
                  const Icon = ft.icon;
                  const isSelected = formData.type === ft.value;
                  return (
                    <button
                      key={ft.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: ft.value })
                      }
                      className={`
                        relative p-4 rounded-xl text-left transition-all duration-200
                        ${
                          isSelected
                            ? "glass border-2 border-crystal/50 bg-crystal/8 shadow-[0_0_20px_rgba(127,255,212,0.08)]"
                            : "glass border border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                            ${
                              isSelected
                                ? "bg-crystal/20 text-crystal"
                                : "bg-white/5 text-text-muted"
                            }
                          `}
                        >
                          <Icon size={20} weight={isSelected ? "fill" : "regular"} />
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`font-semibold text-sm ${
                              isSelected
                                ? "text-crystal"
                                : "text-text-primary"
                            }`}
                          >
                            {ft.label}
                          </div>
                          <div className="text-text-muted text-xs mt-0.5 leading-relaxed">
                            {ft.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Form Fields */}
            <section className="glass rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Message */}
              <div>
                <label
                  htmlFor="feedback-message"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  Your Message <span className="text-crystal">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-cosmic-void/50 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-crystal/50 focus:ring-1 focus:ring-crystal/50 transition-all resize-none"
                  placeholder={
                    formData.type === "bug"
                      ? "Describe what happened and how to reproduce it..."
                      : formData.type === "feature"
                        ? "Describe the capability you envision..."
                        : "Share your thoughts with the realm..."
                  }
                />
                <div className="mt-1.5 text-xs text-text-muted">
                  {formData.message.trim().length > 0
                    ? `${formData.message.trim().length} characters`
                    : "Be as detailed as the vision requires"}
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label
                  htmlFor="feedback-email"
                  className="block text-sm font-medium text-text-secondary mb-2"
                >
                  Email{" "}
                  <span className="text-text-muted font-normal">
                    (optional — only if you want a response)
                  </span>
                </label>
                <input
                  type="email"
                  id="feedback-email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-cosmic-void/50 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-crystal/50 focus:ring-1 focus:ring-crystal/50 transition-all"
                  placeholder="creator@arcanea.ai"
                />
              </div>

              {/* Error State */}
              {submitState === "error" && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <PhWarning
                    size={20}
                    weight="fill"
                    className="text-red-400 shrink-0 mt-0.5"
                  />
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`
                  w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl
                  font-semibold text-base transition-all duration-200
                  ${
                    canSubmit
                      ? "bg-crystal text-cosmic-deep shadow-[0_0_24px_rgba(127,255,212,0.2)] hover:shadow-[0_0_32px_rgba(127,255,212,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-white/5 text-text-muted border border-white/10 cursor-not-allowed"
                  }
                `}
              >
                {submitState === "submitting" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cosmic-deep/30 border-t-cosmic-deep rounded-full animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <PhPaperPlane size={20} weight="fill" />
                    Send Transmission
                  </>
                )}
              </button>
            </section>
          </form>
        )}

        {/* Bottom Note */}
        <p className="text-center text-text-muted text-xs mt-8 leading-relaxed max-w-md mx-auto">
          All feedback is reviewed by the Arcanea team. For urgent matters or
          security concerns, reach out directly at{" "}
          <a
            href="mailto:hello@arcanea.ai"
            className="text-crystal hover:underline"
          >
            hello@arcanea.ai
          </a>
        </p>
      </main>
    </div>
  );
}

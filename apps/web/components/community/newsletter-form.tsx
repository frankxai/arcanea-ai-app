"use client";

import { type FormEvent, useId, useRef, useState } from "react";
import { submitWaitlist } from "@/lib/waitlist/submit";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// Adapted from draft #403; uses the durable waitlist contract merged in #458.
export function NewsletterForm() {
  const id = useId();
  const pending = useRef(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    pending.current = true;
    setStatus("submitting");
    setMessage("");
    try {
      const result = await submitWaitlist(email, "community_footer");
      if (result.success) {
        form.reset();
        setStatus("success");
        setMessage("Your interest in Arcanea updates is saved.");
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    } finally {
      pending.current = false;
    }
  }

  return (
    <form
      aria-label="Arcanea updates signup"
      aria-busy={status === "submitting"}
      className="max-w-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          aria-describedby={`${id}-status`}
          placeholder="Your email address"
          required
          maxLength={320}
          disabled={status === "submitting"}
          onChange={() => {
            if (status === "success" || status === "error") {
              setStatus("idle");
              setMessage("");
            }
          }}
          className="min-w-0 flex-1 px-4 py-3 rounded-xl liquid-glass border border-white/[0.06] bg-white/[0.04] text-text-primary placeholder-text-muted font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/40 transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm shadow-glow-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/70 focus:ring-offset-2 focus:ring-offset-cosmic-void disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Saving..." : "Keep me updated"}
        </button>
      </div>
      <p
        id={`${id}-status`}
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className="mt-3 text-sm text-text-muted"
      >
        {message}
      </p>
    </form>
  );
}

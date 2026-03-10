"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNCIL_ADVISORS } from "@/lib/council/types";

const FREQUENCY_OPTIONS = COUNCIL_ADVISORS.map((a) => ({
  hz: a.frequency_alignment,
  label: `${a.frequency_alignment} Hz — ${a.domain} (${a.character})`,
  color: a.color,
}));

interface FormState {
  name: string;
  domain: string;
  frequency: number;
  capability: string;
  traits: string;
  visualDesc: string;
}

export default function CreateAdvisorPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    domain: "",
    frequency: 528,
    capability: "",
    traits: "",
    visualDesc: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedFreq = FREQUENCY_OPTIONS.find((f) => f.hz === form.frequency);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "frequency" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.domain.trim() || !form.capability.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/council/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          luminor_name: form.name.trim(),
          luminor_domain: form.domain.trim(),
          frequency_alignment: form.frequency,
          imprint_capability: form.capability.trim(),
          personality_traits: form.traits.trim() || undefined,
          visual_description: form.visualDesc.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        console.error('Failed to create advisor:', error);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to create advisor:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div
            className="mx-auto w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: `radial-gradient(circle, ${selectedFreq?.color}30, transparent 70%)`,
              border: `1px solid ${selectedFreq?.color}50`,
              boxShadow: `0 0 30px ${selectedFreq?.color}30`,
            }}
          >
            {form.name.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="font-display text-3xl font-bold text-white">
            {form.name} is ready
          </h2>
          <p className="font-body text-white/50 leading-relaxed">
            Your custom advisor now holds a seat in your Council, specializing
            in {form.domain}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/council"
              className="px-6 py-3 rounded-xl font-display font-semibold text-sm border border-[#00bcd4]/30 text-[#00bcd4] transition-all hover:bg-[#00bcd4]/[0.07]"
            >
              View the Council
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "",
                  domain: "",
                  frequency: 528,
                  capability: "",
                  traits: "",
                  visualDesc: "",
                });
              }}
              className="px-6 py-3 rounded-xl font-display font-semibold text-sm border border-white/[0.08] text-white/60 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/council"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
        >
          &larr; Council
        </Link>
        <h1 className="font-display text-4xl font-bold text-white leading-tight">
          Create a{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #00bcd4, #0d47a1)",
            }}
          >
            Custom Advisor
          </span>
        </h1>
        <p className="font-body text-white/50 leading-relaxed">
          Define a new advisor for your Council. Give it a name, a domain of
          expertise, and describe what it brings to the table.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="font-mono text-xs text-white/50 uppercase tracking-widest"
          >
            Advisor Name <span className="text-[#00bcd4]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Prism, Forge, Signal, Anchor"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-display text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/40 focus:bg-white/[0.05] transition-all"
          />
          <p className="font-body text-[11px] text-white/25">
            Short, meaningful names work best. Think: real words with weight.
          </p>
        </div>

        {/* Domain */}
        <div className="space-y-2">
          <label
            htmlFor="domain"
            className="block font-mono text-xs text-white/50 uppercase tracking-widest"
          >
            Domain of Expertise <span className="text-[#00bcd4]">*</span>
          </label>
          <input
            id="domain"
            name="domain"
            type="text"
            required
            value={form.domain}
            onChange={handleChange}
            placeholder="e.g. Brand Strategy, User Research, Data Analysis"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/40 focus:bg-white/[0.05] transition-all"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <label
            htmlFor="frequency"
            className="block font-mono text-xs text-white/50 uppercase tracking-widest"
          >
            Frequency Alignment
          </label>
          <div className="relative">
            <select
              id="frequency"
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/[0.08] bg-[hsl(240,6%,7%)] px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-[#00bcd4]/40 transition-all appearance-none cursor-pointer"
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.hz} value={opt.hz}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedFreq && (
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedFreq.color }}
              />
            )}
          </div>
        </div>

        {/* Capability */}
        <div className="space-y-2">
          <label
            htmlFor="capability"
            className="block font-mono text-xs text-white/50 uppercase tracking-widest"
          >
            Core Capability{" "}
            <span className="text-[#00bcd4]">*</span>
          </label>
          <p className="font-body text-xs text-white/30 leading-relaxed">
            What does this advisor deliver? What perspective does it bring?
          </p>
          <textarea
            id="capability"
            name="capability"
            required
            rows={3}
            value={form.capability}
            onChange={handleChange}
            placeholder="e.g. Identifies blind spots in brand positioning and suggests repositioning strategies"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/40 focus:bg-white/[0.05] transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Personality Traits (optional) */}
        <div className="space-y-2">
          <label
            htmlFor="traits"
            className="block font-mono text-xs text-white/50 uppercase tracking-widest"
          >
            Personality Traits{" "}
            <span className="text-white/20">(optional)</span>
          </label>
          <input
            id="traits"
            name="traits"
            type="text"
            value={form.traits}
            onChange={handleChange}
            placeholder="e.g. Direct, data-driven, challenges assumptions"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/40 focus:bg-white/[0.05] transition-all"
          />
        </div>

        {/* Visual Description (optional) */}
        <div className="space-y-2">
          <label
            htmlFor="visualDesc"
            className="block font-mono text-xs text-white/50 uppercase tracking-widest"
          >
            Visual Description{" "}
            <span className="text-white/20">(optional)</span>
          </label>
          <textarea
            id="visualDesc"
            name="visualDesc"
            rows={2}
            value={form.visualDesc}
            onChange={handleChange}
            placeholder="e.g. Cool blue aura, geometric patterns, speaks in diagrams"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/40 focus:bg-white/[0.05] transition-all resize-none"
          />
        </div>

        {/* Preview chip */}
        {form.name && selectedFreq && (
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all"
            style={{
              borderColor: `${selectedFreq.color}30`,
              background: `${selectedFreq.color}08`,
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-sm text-white"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${selectedFreq.color}60, ${selectedFreq.color}20)`,
                boxShadow: `0 0 14px ${selectedFreq.color}40`,
              }}
            >
              {form.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p
                className="font-display text-sm font-bold"
                style={{ color: selectedFreq.color }}
              >
                {form.name}
              </p>
              <p className="font-mono text-[10px] text-white/40">
                {form.domain || "Domain TBD"} &middot; {form.frequency} Hz
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !form.name.trim() ||
              !form.domain.trim() ||
              !form.capability.trim()
            }
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none"
            style={{
              background: isSubmitting
                ? "#00bcd4aa"
                : "linear-gradient(135deg, #00bcd4, #0d47a1)",
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  aria-hidden
                />
                Creating...
              </>
            ) : (
              "Add to Council"
            )}
          </button>
          <Link
            href="/council"
            className="px-5 py-3.5 rounded-xl font-display font-semibold text-sm border border-white/[0.08] text-white/50 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

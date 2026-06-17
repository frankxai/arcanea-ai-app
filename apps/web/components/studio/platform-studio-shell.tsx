"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, Sparkle, Terminal, Upload } from "@/lib/phosphor-icons";
import { STUDIO_MODES, type StudioMode } from "./platform-studios";

export interface PlatformStudioShellProps {
  studio: StudioMode;
  related?: StudioMode[];
  label?: string;
  title?: string;
  subtitle?: string;
}

function Pill({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 34%, transparent)`,
        background: `color-mix(in srgb, ${accent} 10%, transparent)`,
        color: accent,
      }}
    >
      {children}
    </span>
  );
}

function WorkflowPreview({ studio }: { studio: StudioMode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/28">
            Workflow
          </p>
          <p className="mt-1 text-sm text-white/60">{studio.output}</p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: `color-mix(in srgb, ${studio.accent} 14%, transparent)`,
            color: studio.accent,
          }}
        >
          Generate * {studio.cost}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {studio.workflow.map((step, index) => (
          <div
            key={step}
            className="relative min-h-28 rounded-xl border border-white/[0.06] bg-[var(--arc-cosmic-void)]/70 p-3"
          >
            <span className="text-[10px] font-mono text-white/25">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 text-sm font-display font-semibold text-white/80">
              {step}
            </p>
            {index < studio.workflow.length - 1 && (
              <span
                className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rounded-full border border-white/[0.08] bg-[var(--arc-cosmic-void)] text-center text-[10px] text-white/30 md:block"
                aria-hidden
              >
                -
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductionBoard({ studio }: { studio: StudioMode }) {
  const nodes = [
    { label: "Prompt", detail: studio.assetHint },
    { label: "Studio", detail: studio.name },
    { label: "Media", detail: studio.media.label },
    { label: "Agent", detail: studio.commands[0] },
    { label: "Export", detail: "vault, repo, package" },
  ];

  const connectors = [
    "Claude",
    "Codex",
    "Cursor",
    "Vercel",
    studio.id === "game" ? "Godot" : studio.id === "music" ? "Suno" : studio.id === "cinema" ? "Runway" : "Arcanea Vault",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
              Canvas graph
            </p>
            <h2 className="mt-2 text-2xl font-display font-semibold text-white/85">
              One prompt becomes a production system
            </h2>
          </div>
          <Pill accent={studio.accent}>Node workflow</Pill>
        </div>

        <div className="relative min-h-[320px] rounded-2xl border border-white/[0.06] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent)] p-4">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative grid h-full gap-3 md:grid-cols-5">
            {nodes.map((node, index) => (
              <m.div
                key={`${studio.id}-node-${node.label}`}
                className="relative flex min-h-32 flex-col justify-between rounded-2xl border border-white/[0.08] bg-black/35 p-3 backdrop-blur-md"
                initial={{ opacity: 0.55, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
              >
                {index < nodes.length - 1 && (
                  <m.span
                    className="absolute -right-3 top-1/2 hidden h-px w-6 bg-white/22 md:block"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.2 }}
                    aria-hidden
                  />
                )}
                <span className="text-[10px] font-mono text-white/28">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-base font-display font-semibold text-white/86">{node.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/42">{node.detail}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
                Video assembly
              </p>
              <h3 className="mt-2 text-xl font-display font-semibold text-white/82">
                Shot beats ready for render tools
              </h3>
            </div>
            <span className="text-xs font-mono" style={{ color: studio.accent }}>
              {studio.media.frames.length} shots
            </span>
          </div>
          <div className="space-y-2">
            {studio.media.frames.map((frame, index) => (
              <div key={`${studio.id}-video-${index}`} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/24 p-3">
                <div className="relative h-10 w-16 overflow-hidden rounded-lg bg-white/[0.04]">
                  <m.div
                    className="absolute inset-y-0 left-0 w-1/2"
                    style={{ background: studio.accent }}
                    animate={{ x: ["-80%", "220%"] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.24, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 bg-black/45" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/28">
                    Shot {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="text-sm font-semibold text-white/75">{frame}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
            Connector lane
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {connectors.map((connector) => (
              <span
                key={`${studio.id}-connector-${connector}`}
                className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-white/58"
              >
                {connector}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/28 p-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">
              Agent script
            </p>
            <code className="mt-2 block text-xs leading-relaxed text-white/60">
              {`${studio.commands[0]} -> ${studio.commands[1]} -> ${studio.commands[2]}`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaStage({ studio }: { studio: StudioMode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-3 shadow-2xl shadow-black/35">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.10),transparent_28%),linear-gradient(140deg,rgba(0,188,212,0.10),transparent_42%)]" />
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black">
        <div className="relative aspect-[16/10]">
          <Image
            src={studio.media.poster}
            alt={`${studio.name} generated media preview`}
            fill
            sizes="(min-width: 1024px) 460px, 100vw"
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.86),rgba(0,0,0,0.12)_50%,rgba(0,0,0,0.52))]" />
          <m.div
            className="absolute left-0 right-0 top-1/2 h-px bg-white/40"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "100%", opacity: [0, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/[0.12] bg-black/35 px-3 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/65">
              {studio.media.label}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {studio.media.frames.map((frame, index) => (
                <m.div
                  key={frame}
                  className="min-w-24 flex-1 rounded-xl border border-white/[0.10] bg-black/42 p-2 backdrop-blur-md"
                  initial={{ opacity: 0.42, y: 8 }}
                  animate={{ opacity: [0.42, 1, 0.42], y: [8, 0, 8] }}
                  transition={{ duration: 3.4, repeat: Infinity, delay: index * 0.34, ease: "easeInOut" }}
                >
                  <p className="text-[9px] font-mono text-white/35">SHOT {String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-xs font-semibold text-white/78">{frame}</p>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-3 grid gap-3 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30">
          <div className="relative aspect-[4/3]">
            <Image
              src={studio.media.secondary}
              alt={`${studio.name} reference asset`}
              fill
              sizes="220px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),transparent_55%)]" />
            <p className="absolute bottom-3 left-3 right-3 text-xs font-mono uppercase tracking-[0.16em] text-white/62">
              Asset reference
            </p>
          </div>
        </div>
        <div className="grid content-between gap-3 rounded-2xl border border-white/[0.08] bg-black/24 p-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/28">
              Production proof
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/58">{studio.proof}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {studio.stats.map((stat, index) => (
              <div key={`${studio.id}-stat-${index}`} className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-2">
                <p className="text-[11px] font-mono text-white/65">{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptPanel({ studio }: { studio: StudioMode }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[var(--arc-cosmic-void)]/75 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
        </div>
        <Pill accent={studio.accent}>{studio.eyebrow}</Pill>
      </div>
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${studio.gradient} p-5`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.45),transparent)]" />
        <div className="relative min-h-56">
          <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/45">
            Media preview
          </p>
          <div className="mt-12 max-w-sm">
            <h2 className="text-2xl font-display font-bold tracking-[-0.03em] text-white">
              {studio.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/62">{studio.proof}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-2">
            {studio.presets.map((preset, index) => (
              <span
                key={`${studio.id}-preset-${index}`}
                className="rounded-full border border-white/[0.10] bg-black/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-white/60"
              >
                {preset}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-white/28">
          <Upload size={14} />
          Reference assets
          <span style={{ color: studio.accent }}>{studio.assetHint}</span>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm text-white/70">
          {studio.prompt}
        </div>
        <Link
          href={studio.href}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.01]"
          style={{
            background: studio.accent,
            color: "var(--arc-cosmic-void)",
          }}
        >
          <Sparkle size={16} weight="duotone" />
          Generate * {studio.cost}
        </Link>
      </div>
    </div>
  );
}

export function StudioDirectory({ currentId }: { currentId?: StudioMode["id"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STUDIO_MODES.map((studio) => (
        <Link
          key={studio.id}
          href={studio.href}
          className={`group rounded-2xl border p-4 transition-all hover:-translate-y-1 ${
            currentId === studio.id
              ? "border-white/[0.18] bg-white/[0.07]"
              : "border-white/[0.06] bg-white/[0.025] hover:border-white/[0.14]"
          }`}
        >
          <div className={`mb-4 h-24 rounded-xl bg-gradient-to-br ${studio.gradient} opacity-90`} />
          <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: studio.accent }}>
            {studio.eyebrow}
          </p>
          <h3 className="mt-2 text-base font-display font-semibold text-white/86">
            {studio.name}
          </h3>
          <p className="mt-2 min-h-10 text-xs leading-relaxed text-white/40">
            {studio.proof}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function PlatformStudioShell({
  studio,
  related,
  label,
  title,
  subtitle,
}: PlatformStudioShellProps) {
  const relatedStudios = related ?? STUDIO_MODES.filter((item) => item.id !== studio.id).slice(0, 4);

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen overflow-hidden bg-[var(--arc-cosmic-void)]">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,188,212,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(197,162,111,0.10),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1fr_500px] lg:px-8 lg:pt-16">
          <m.div
            className="flex min-h-[620px] flex-col justify-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="mb-5 flex flex-wrap gap-2">
            <Pill accent={studio.accent}>{label ?? "Arcanea studios"}</Pill>
            <Pill accent="var(--arc-brand-arcanean-gold)">Open core</Pill>
            <Pill accent="var(--arc-brand-atlantean-teal)">MCP ready</Pill>
          </div>
          <h1 className="max-w-4xl text-5xl font-display font-bold leading-[0.96] tracking-[-0.045em] text-white md:text-7xl">
            {title ?? studio.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/48">
            {subtitle ?? studio.output}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={studio.href}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              style={{ background: studio.accent, color: "var(--arc-cosmic-void)" }}
            >
              Open {studio.name}
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href="/mcp"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/70 hover:border-white/[0.16] hover:text-white"
            >
              <Terminal size={16} />
              Use with Claude or Codex
            </Link>
          </div>
          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {studio.commands.map((command) => (
              <div key={command} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/25">
                  MCP tool
                </p>
                <code className="mt-2 block text-xs" style={{ color: studio.accent }}>
                  {command}
                </code>
              </div>
            ))}
          </div>
          </m.div>
          <m.div
            className="grid gap-4"
            initial={{ opacity: 0, x: 28, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            <MediaStage studio={studio} />
            <PromptPanel studio={studio} />
          </m.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <WorkflowPreview studio={studio} />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <ProductionBoard studio={studio} />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/25">
              Studio map
            </p>
            <h2 className="mt-2 text-2xl font-display font-semibold text-white/85">
              Connected creative surfaces
            </h2>
          </div>
          <Link href="/create" className="text-xs font-mono uppercase tracking-[0.16em] text-white/38 hover:text-white/70">
            Universal create
          </Link>
        </div>
        <StudioDirectory currentId={studio.id} />
        {relatedStudios.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {relatedStudios.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-xs text-white/45 hover:border-white/[0.14] hover:text-white/75"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </section>
      </main>
    </LazyMotion>
  );
}

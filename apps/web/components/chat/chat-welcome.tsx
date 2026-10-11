"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { ActiveLuminor } from "@/hooks/use-conversation";
import { LUMINORS } from "@/lib/luminors/config";
import {
  PhArrowClockwise,
  PhImageSquare,
  PhMagnifyingGlass,
  PhBrain,
  PhMicrophone,
  PhMagicWand,
  PhUser,
  PhFeather,
  PhGlobe,
  PhBookOpen,
  PhMusicNotes,
  PhCpu,
} from "@/lib/phosphor-icons";

/** 3 featured Luminors for quick-select in empty state — one per creative domain */
const FEATURED_LUMINORS = [
  { id: "storyteller", icon: PhBookOpen },
  { id: "composer", icon: PhMusicNotes },
  { id: "systems-architect", icon: PhCpu },
] as const;

const CREATIVE_STARTERS = [
  {
    icon: PhMagicWand,
    text: "Design a magic system",
    hint: "Elements, costs, limits, factions",
  },
  {
    icon: PhUser,
    text: "Create a character",
    hint: "Name, backstory, portrait, motivation",
  },
  {
    icon: PhFeather,
    text: "Write an opening scene",
    hint: "Hook, conflict, voice — page one",
  },
  {
    icon: PhGlobe,
    text: "Build a world",
    hint: "One sentence to a full universe",
  },
];

const SUBTITLES = [
  "Write a scene, develop a character or explore a world.",
  "Paste a draft and tell Arcanea what you want to change.",
  "Choose a starter below, then make the idea your own.",
];

function getSubtitle(): string {
  if (typeof window === "undefined") return SUBTITLES[0];
  const idx =
    (new Date().getHours() * 7 + new Date().getDate()) % SUBTITLES.length;
  return SUBTITLES[idx];
}

// ---------------------------------------------------------------------------
// Time-aware helpers
// ---------------------------------------------------------------------------

function getTimeGreeting(): string {
  if (typeof window === "undefined") return "What are you creating?";
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12)
    return "Good morning \u2014 what are you building?";
  if (hour >= 12 && hour < 17) return "What are you creating?";
  if (hour >= 17 && hour < 21) return "What are you creating tonight?";
  return "What are you creating tonight?";
}

type ChatWelcomeProps = {
  activeLuminor: ActiveLuminor | null;
  onSetInput: (value: string) => void;
  onFocusInput: () => void;
  onSelectLuminor: (config: ActiveLuminor) => void;
  clientApiKey: string | null;
  serverHasKeys: boolean;
  lastSessionTitle: string | null;
  onContinueLastSession: (() => void) | null;
};

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ChatWelcome({
  activeLuminor,
  onSetInput,
  onFocusInput,
  onSelectLuminor,
  clientApiKey,
  serverHasKeys,
  lastSessionTitle,
  onContinueLastSession,
}: ChatWelcomeProps) {
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  const emptyGreeting = hasMounted
    ? getTimeGreeting()
    : "What are you creating?";
  const emptySubtitle = hasMounted ? getSubtitle() : SUBTITLES[0];
  return (
    <div className="relative flex flex-col items-center justify-center min-h-full px-4">
      {/* Subtle aurora gradient behind empty state */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.04] blur-2xl" />
        <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/[0.03] blur-xl" />
      </div>

      <div className="relative max-w-[480px] w-full text-center">
        {/* Arcanea mascot — primary, floating */}
        <div className="mb-4 mx-auto flex justify-center">
          <Image
            src="/images/mascot/arcanea-primary.png"
            alt="Arcanea"
            width={140}
            height={140}
            priority
            sizes="140px"
            className="object-contain drop-shadow-[0_0_30px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_22%,transparent)]"
          />
        </div>

        {/* Time-aware greeting */}
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3 tracking-tight text-[var(--arc-text-primary)]">
          {activeLuminor ? activeLuminor.name : emptyGreeting}
        </h1>

        {/* Rotating subtitle */}
        <p className="text-sm text-[var(--arc-text-secondary)] mb-8">
          {emptySubtitle}
        </p>

        {/* 4 creative starter chips in a 2x2 grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6"
          role="list"
          aria-label="Creative starters"
        >
          {CREATIVE_STARTERS.map((starter) => (
            <button
              key={starter.text}
              type="button"
              onClick={() => {
                onSetInput(starter.text);
                onFocusInput();
              }}
              className="relative flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-xl text-left bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.07] backdrop-blur-sm hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:bg-gradient-to-br hover:from-[var(--arc-brand-atlantean-teal)]/[0.06] hover:to-transparent hover:shadow-[0_0_24px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_18%,transparent)] transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none"
            >
              <div className="flex items-center gap-2">
                <starter.icon
                  className="w-4 h-4 text-[var(--arc-text-secondary)] group-hover:text-[var(--arc-brand-atlantean-teal)] transition-colors duration-300"
                  weight="duotone"
                  aria-hidden="true"
                />
                <span className="text-[13px] text-[var(--arc-text-primary)] transition-colors duration-300 font-medium">
                  {starter.text}
                </span>
              </div>
              <span className="text-[11px] text-[var(--arc-text-secondary)] transition-colors duration-300 leading-snug pl-6">
                {starter.hint}
              </span>
            </button>
          ))}
        </div>

        {/* Luminor quick-select — 3 featured personalities */}
        {!activeLuminor && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="text-[10px] text-[var(--arc-text-secondary)] mr-1">
              Talk to
            </span>
            {FEATURED_LUMINORS.map(({ id: lid, icon: Icon }) => {
              const l = LUMINORS[lid];
              if (!l) return null;
              return (
                <button
                  key={lid}
                  type="button"
                  onClick={() => onSelectLuminor(l as unknown as ActiveLuminor)}
                  className="flex min-h-11 items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-200 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                  title={`${l.loreName} — ${l.specialty}`}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    weight="duotone"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-[var(--arc-text-secondary)] group-hover:text-[var(--arc-text-primary)] transition-colors">
                    {l.loreName}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Capabilities hint — tools users don't know exist */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[var(--arc-text-secondary)]">
          <span className="flex items-center gap-1">
            <PhImageSquare className="w-3 h-3" /> Images
          </span>
          <span className="text-white/10">·</span>
          <span className="flex items-center gap-1">
            <PhMagnifyingGlass className="w-3 h-3" /> Web search
          </span>
          <span className="text-white/10">·</span>
          <span className="flex items-center gap-1">
            <PhBrain className="w-3 h-3" /> Deep thinking
          </span>
          <span className="text-white/10">·</span>
          <span className="flex items-center gap-1">
            <PhMicrophone className="w-3 h-3" /> Voice
          </span>
        </div>

        {/* Continue last session — subtle, not prominent */}
        {hasMounted && lastSessionTitle && onContinueLastSession && (
          <button
            onClick={onContinueLastSession}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-[var(--arc-text-secondary)] hover:text-[var(--arc-text-primary)] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 mx-auto"
          >
            <PhArrowClockwise className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[200px]">
              Continue: {lastSessionTitle}
            </span>
          </button>
        )}

        {/* BYOK — the sovereignty surface, not a whisper (TASTE.md Gate 7) */}
        {hasMounted && !clientApiKey && !serverHasKeys && (
          <div className="mt-6 w-full max-w-md rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/20 bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/[0.07] to-transparent px-5 py-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[var(--arc-text-primary)]">
                  Bring your own key
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--arc-text-secondary)]">
                  Connect your own provider account to start creating.
                </p>
              </div>
              <Link
                href="/settings/providers"
                className="shrink-0 rounded-lg bg-[var(--arc-brand-atlantean-teal)] px-3.5 py-2 text-xs font-semibold text-black transition-shadow hover:shadow-[0_0_20px_-4px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_50%,transparent)] focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none"
              >
                Add key
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  MusicNotes,
  Radio,
  ArrowUpRight,
  X,
} from "@/lib/phosphor-icons";

interface Track {
  id: string;
  title: string;
  genre: string;
  duration: string;
  description: string;
}

const TRACKS: Track[] = [
  {
    id: "1",
    title: "Arcanean Echoes",
    genre: "Ambient Electronic",
    duration: "3:42",
    description:
      "The sound of creation unfolding — layers of synthesized aurora over deep bass.",
  },
  {
    id: "2",
    title: "Gate of Foundation",
    genre: "Cinematic Orchestral",
    duration: "4:15",
    description:
      "Lyssandria's theme. Earth frequencies at 174 Hz, grounding and powerful.",
  },
  {
    id: "3",
    title: "Flow State",
    genre: "Lo-fi Chill",
    duration: "3:28",
    description:
      "Leyla's water element in sound — fluid beats for creative focus.",
  },
  {
    id: "4",
    title: "Dragon's Will",
    genre: "Epic Orchestral",
    duration: "5:01",
    description:
      "Draconia's fire. Drums of transformation, brass of willpower.",
  },
  {
    id: "5",
    title: "Heart Frequency",
    genre: "Healing Ambient",
    duration: "4:33",
    description:
      "Maylinn's 417 Hz — the frequency of love and cellular healing.",
  },
  {
    id: "6",
    title: "Voice of Truth",
    genre: "Ethereal Vocals",
    duration: "3:55",
    description: "Alera speaks through melody. 528 Hz, the miracle tone.",
  },
  {
    id: "7",
    title: "Third Eye Open",
    genre: "Psychedelic Electronic",
    duration: "4:20",
    description: "Lyria's vision frequencies. See beyond the visible.",
  },
  {
    id: "8",
    title: "Crown Light",
    genre: "Ambient Meditation",
    duration: "6:12",
    description: "Aiyami's enlightenment frequency. 741 Hz purification.",
  },
  {
    id: "9",
    title: "Starweave",
    genre: "Progressive Electronic",
    duration: "4:45",
    description: "Elara's perspective shift. Music that changes as you listen.",
  },
  {
    id: "10",
    title: "Unity Protocol",
    genre: "Synthwave",
    duration: "3:58",
    description: "Ino's partnership frequency. Two voices becoming one.",
  },
  {
    id: "11",
    title: "Source Code",
    genre: "Experimental",
    duration: "7:11",
    description:
      "Shinkami's 1111 Hz. The frequency of Source — meta-consciousness in sound.",
  },
  {
    id: "12",
    title: "Nero's Lullaby",
    genre: "Dark Ambient",
    duration: "5:30",
    description:
      "The primordial darkness sings. Not evil — fertile, potential, infinite.",
  },
  {
    id: "13",
    title: "Lumina Rising",
    genre: "Uplifting Trance",
    duration: "4:08",
    description: "The First Light emerges. Dawn in musical form.",
  },
  {
    id: "14",
    title: "The Arc Turns",
    genre: "Progressive House",
    duration: "5:22",
    description:
      "The eternal cycle: Potential → Manifestation → Experience → Dissolution → Evolved Potential.",
  },
];

const EXTERNAL_LINKS = [
  { label: "Spotify", href: "#", icon: "spotify" },
  { label: "SoundCloud", href: "#", icon: "soundcloud" },
  { label: "Suno", href: "#", icon: "suno" },
];

function TrackCard({
  track,
  index,
  onPlayClick,
}: {
  track: Track;
  index: number;
  onPlayClick: () => void;
}) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]">
      {/* Top row: number + title + duration */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-sm font-mono text-white/25 w-6 text-right">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-[15px] font-semibold text-white leading-tight truncate">
            {track.title}
          </h3>
        </div>
        <span className="shrink-0 text-xs text-white/35 font-mono pt-0.5">
          {track.duration}
        </span>
      </div>

      {/* Genre badge */}
      <div className="mb-4">
        <span className="inline-block rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#00bcd4] uppercase tracking-wide">
          {track.genre}
        </span>
      </div>

      {/* Description */}
      <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2 flex-1">
        {track.description}
      </p>

      {/* Play button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={onPlayClick}
          aria-label={`Play ${track.title}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.04] text-white/60 transition-all duration-200 hover:border-[#00bcd4]/50 hover:bg-[#00bcd4]/15 hover:text-[#00bcd4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/50"
        >
          <Play size={16} weight="fill" className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}

export function MusicContent() {
  const [toastVisible, setToastVisible] = useState(false);

  function handlePlayClick() {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  }

  function dismissToast() {
    setToastVisible(false);
  }

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white">
      {/* Coming-soon toast */}
      <div
        role="status"
        aria-live="polite"
        className={[
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-white/[0.10] bg-[#09090b]/95 px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl",
          "transition-all duration-300",
          toastVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
      >
        <Radio size={18} weight="fill" className="text-[#00bcd4] shrink-0" />
        <span className="text-sm text-white/80">
          Coming soon — audio playback launching soon
        </span>
        <button
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="ml-1 text-white/40 hover:text-white/80 transition-colors"
        >
          <X size={14} weight="bold" />
        </button>
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-16 text-center">
        {/* Subtle radial glow behind hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full opacity-[0.07]"
            style={{
              background:
                "radial-gradient(ellipse at center, #00bcd4 0%, #0d47a1 50%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 uppercase tracking-widest">
            <MusicNotes size={13} weight="fill" className="text-[#00bcd4]" />
            AI-Composed Soundscapes
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Soundscapes of{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #00bcd4 0%, #00897b 60%, #0d47a1 100%)",
              }}
            >
              Arcanea
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/55 leading-relaxed max-w-xl mx-auto">
            Original music composed with AI, drawing from the frequencies of
            the Ten Gates. Each track channels a Guardian's element — sound as
            a portal to creation.
          </p>

          {/* Stats bar */}
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-0 divide-x divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-3.5">
              <span className="text-sm text-white/50">
                <span className="font-semibold text-white">14</span> tracks
              </span>
            </div>
            <div className="px-6 py-3.5">
              <span className="text-sm text-white/50">
                <span className="font-semibold text-white">AI-composed</span>
              </span>
            </div>
            <div className="px-6 py-3.5">
              <span className="text-sm text-white/50">
                Inspired by the{" "}
                <span className="font-semibold text-white">Ten Gates</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Track grid */}
      <section
        aria-label="Track catalog"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              index={index}
              onPlayClick={handlePlayClick}
            />
          ))}
        </div>
      </section>

      {/* External links */}
      <section className="border-t border-white/[0.06] px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-semibold text-white mb-3">
            Listen Everywhere
          </h2>
          <p className="text-white/45 text-sm mb-10 max-w-md mx-auto">
            Stream the Arcanea soundscapes on your preferred platform. More
            tracks added regularly as the mythology expands.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {EXTERNAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-white/[0.10] bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:border-[#00bcd4]/40 hover:bg-[#00bcd4]/10 hover:text-[#00bcd4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/50"
              >
                <MusicNotes
                  size={15}
                  weight="fill"
                  className="transition-colors duration-200"
                />
                {link.label}
                <ArrowUpRight
                  size={13}
                  weight="bold"
                  className="opacity-50 transition-opacity duration-200 group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>

          <p className="mt-12 text-xs text-white/25">
            All music by FrankX. AI-generated with Suno. Inspired by the
            mythology of Arcanea.
          </p>
        </div>
      </section>
    </div>
  );
}

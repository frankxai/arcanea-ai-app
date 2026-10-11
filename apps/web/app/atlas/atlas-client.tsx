"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import type {
  RealmDefinition,
  LinguisticFamily,
  TemporalEpoch,
  GateId,
} from "@arcanea/schemas";
import {
  calculateCorridorResonance,
  calculateSandersonianMagicToll,
  generateRealmName,
  traceEntityProvenance,
  type CanonicalGuardianEntity,
  type MonomythStage,
} from "@arcanea/world-engine";
import {
  Compass,
  Sparkle,
  Crown,
  ArrowsClockwise,
  Check,
  Copy,
  MapTrifold,
  Scales,
  Scroll,
} from "@/lib/phosphor-icons";
import { RealmConstellation } from "./realm-constellation";

// ---------------------------------------------------------------------------
// Props Interface
// ---------------------------------------------------------------------------

interface AtlasClientProps {
  initialRealms: Record<string, RealmDefinition>;
  linguisticFamilies: Record<string, LinguisticFamily>;
  epochs: TemporalEpoch[];
  guardians: CanonicalGuardianEntity[];
  monomythStages: MonomythStage[];
}

type TabKey =
  "cartography" | "linguistics" | "magic_toll" | "monomyth" | "provenance";

const TABS: {
  id: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "cartography", label: "Realms & Corridors", icon: MapTrifold },
  { id: "linguistics", label: "Linguistic Matrices", icon: Scroll },
  { id: "magic_toll", label: "Sandersonian Tolls", icon: Scales },
  { id: "monomyth", label: "12-Stage Monomyth", icon: Compass },
  { id: "provenance", label: "Guardian Dossiers", icon: Crown },
];

export function AtlasClient({
  initialRealms,
  linguisticFamilies,
  epochs,
  guardians,
  monomythStages,
}: AtlasClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("cartography");

  // Cartography State
  const realmKeys = Object.keys(initialRealms);
  const [selectedRealmAId, setSelectedRealmAId] = useState<string>(
    realmKeys[0] || "eldria_prime",
  );
  const [selectedRealmBId, setSelectedRealmBId] = useState<string>(
    realmKeys[1] || "veldoria",
  );

  type GeneratedNameKind =
    | "character_masculine"
    | "character_feminine"
    | "character_neutral"
    | "toponym"
    | "relic";

  // Linguistics State
  const langKeys = Object.keys(linguisticFamilies);
  const [selectedLangId, setSelectedLangId] = useState<string>(
    langKeys[0] || "eldrian",
  );
  const [generatedNameKind, setGeneratedNameKind] = useState<GeneratedNameKind>(
    "character_masculine",
  );
  const [generatedName, setGeneratedName] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sandersonian Magic Toll State
  const [selectedGateId, setSelectedGateId] = useState<GateId>("fire");
  const [selectedIntensity, setSelectedIntensity] = useState<
    "minor" | "moderate" | "severe" | "cataclysmic"
  >("moderate");

  // Monomyth State
  const [selectedStageNum, setSelectedStageNum] = useState<number>(1);

  // Provenance State
  const [selectedGuardianId, setSelectedGuardianId] = useState<string>(
    guardians[0]?.id || "lyssandria",
  );

  // Computed Corridor
  const corridorResult = useMemo(() => {
    return calculateCorridorResonance(selectedRealmAId, selectedRealmBId);
  }, [selectedRealmAId, selectedRealmBId]);

  // Computed Toll
  const magicTollResult = useMemo(() => {
    return calculateSandersonianMagicToll(selectedGateId, selectedIntensity);
  }, [selectedGateId, selectedIntensity]);

  // Active Stage
  const activeStage = useMemo(() => {
    return (
      monomythStages.find((s) => s.stageNumber === selectedStageNum) ||
      monomythStages[0]
    );
  }, [monomythStages, selectedStageNum]);

  // Active Guardian & Provenance
  const activeGuardian = useMemo(() => {
    return guardians.find((g) => g.id === selectedGuardianId) || guardians[0];
  }, [guardians, selectedGuardianId]);

  const activeProvenance = useMemo(() => {
    if (!activeGuardian) return null;
    return traceEntityProvenance(
      activeGuardian.id,
      activeGuardian.name,
      activeGuardian.realmId,
      epochs[0]?.id || "epoch_primordial",
    );
  }, [activeGuardian, epochs]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateName = () => {
    const realmForLang =
      Object.values(initialRealms).find(
        (r) => r.linguisticFamilyId === selectedLangId,
      )?.id || "eldria_prime";
    const name = generateRealmName(realmForLang, generatedNameKind);
    setGeneratedName(name);
  };

  // Deep-link hydration via URL search params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab") as TabKey | null;
    const realmA = params.get("realmA");
    const realmB = params.get("realmB");
    const gate = params.get("gate") as GateId | null;

    requestAnimationFrame(() => {
      if (
        tabParam &&
        [
          "cartography",
          "linguistics",
          "magic_toll",
          "monomyth",
          "provenance",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
      if (realmA && initialRealms[realmA]) {
        setSelectedRealmAId(realmA);
      }
      if (realmB && initialRealms[realmB]) {
        setSelectedRealmBId(realmB);
      }
      if (
        gate &&
        [
          "foundation",
          "flow",
          "fire",
          "heart",
          "voice",
          "sight",
          "crown",
          "starweaving",
          "unity",
          "source",
        ].includes(gate)
      ) {
        setSelectedGateId(gate);
      }
    });
  }, [initialRealms]);

  const handleTabChange = (tabId: TabKey) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--arc-cosmic-void,#05070f)] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[var(--arc-brand-arcanean-gold,#d4af37)]/30 selection:text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium tracking-wide text-white/70 uppercase">
              <Sparkle className="w-3.5 h-3.5 text-[var(--arc-brand-arcanean-gold,#d4af37)]" />
              <span>Universal Acoustic Cartography</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight font-serif text-white">
              The Multiverse Atlas
            </h1>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed font-sans">
              Inspect the physical leylines of the Kingdom of Light. Calculate
              Solfeggio standing-wave resonance across Realm Corridors, explore
              Tolkien-grade linguistic matrices, and measure the tactile toll of
              Sandersonian magic.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none">
            <nav className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-[var(--arc-brand-arcanean-gold,#d4af37)]" : ""}`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* TAB 1: CARTOGRAPHY & CORRIDORS */}
          {activeTab === "cartography" && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Interactive Leyline Constellation Canvas */}
              <RealmConstellation
                realms={initialRealms}
                selectedRealmAId={selectedRealmAId}
                selectedRealmBId={selectedRealmBId}
                onSelectRealmA={setSelectedRealmAId}
                onSelectRealmB={setSelectedRealmBId}
                corridorStatus={corridorResult.status}
                stability={corridorResult.stability}
                harmonicDelta={corridorResult.harmonicDelta}
              />

              {/* Realm Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.values(initialRealms).map((realm) => {
                  const isSelectedA = selectedRealmAId === realm.id;
                  const isSelectedB = selectedRealmBId === realm.id;
                  return (
                    <div
                      key={realm.id}
                      className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                        isSelectedA
                          ? "bg-emerald-500/[0.08] border-emerald-500/40 ring-1 ring-emerald-500/20"
                          : isSelectedB
                            ? "bg-cyan-500/[0.08] border-cyan-500/40 ring-1 ring-cyan-500/20"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/60">
                            {realm.settlementEra.replace("_", " ")}
                          </span>
                          <span className="text-xs font-mono font-medium text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                            {realm.frequencyHz} Hz
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {realm.name}
                          </h3>
                          <p className="text-xs text-white/50 capitalize">
                            Gate: {realm.dominantGate} · Element:{" "}
                            {realm.primaryElement}
                          </p>
                        </div>
                        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                          {realm.geography.terrain}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedRealmAId(realm.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${
                            isSelectedA
                              ? "bg-emerald-500 text-black font-semibold"
                              : "bg-white/5 hover:bg-white/10 text-white/70"
                          }`}
                        >
                          Origin (A)
                        </button>
                        <button
                          onClick={() => setSelectedRealmBId(realm.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${
                            isSelectedB
                              ? "bg-cyan-500 text-black font-semibold"
                              : "bg-white/5 hover:bg-white/10 text-white/70"
                          }`}
                        >
                          Target (B)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Corridor Resonance Calculator Panel */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                    <div>
                      <span className="text-xs uppercase font-mono text-[var(--arc-brand-arcanean-gold,#d4af37)] tracking-wider">
                        Acoustic Leyline Calculator
                      </span>
                      <h2 className="text-2xl font-serif text-white">
                        Corridor Resonance:{" "}
                        {initialRealms[selectedRealmAId]?.name} ↔{" "}
                        {initialRealms[selectedRealmBId]?.name}
                      </h2>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border uppercase tracking-wider">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          corridorResult.status === "open"
                            ? "bg-emerald-400 animate-pulse"
                            : corridorResult.status === "drifting"
                              ? "bg-amber-400 animate-pulse"
                              : "bg-rose-400"
                        }`}
                      />
                      <span>Status: {corridorResult.status}</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-xs text-white/40 block">
                        Harmonic Delta
                      </span>
                      <span className="text-xl font-mono text-white mt-1 block">
                        {corridorResult.harmonicDelta} Hz
                      </span>
                      <span className="text-[11px] text-white/40 block mt-0.5">
                        {corridorResult.harmonicDelta === 0
                          ? "Perfect lock"
                          : "Acoustic divergence"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-xs text-white/40 block">
                        Stability Index
                      </span>
                      <span className="text-xl font-mono text-white mt-1 block">
                        {(corridorResult.stability * 100).toFixed(0)}%
                      </span>
                      <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, corridorResult.stability * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-xs text-white/40 block">
                        Corridor Transit
                      </span>
                      <span className="text-xl font-mono text-white mt-1 block">
                        {corridorResult.corridorDays} Days
                      </span>
                      <span className="text-[11px] text-emerald-400 block mt-0.5">
                        {corridorResult.isAquifer
                          ? "Aquifer highway"
                          : "Sub-spatial rift"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-xs text-white/40 block">
                        Surface Transit
                      </span>
                      <span className="text-xl font-mono text-white mt-1 block">
                        {corridorResult.surfaceDays} Days
                      </span>
                      <span className="text-[11px] text-white/40 block mt-0.5">
                        Via overland terrain
                      </span>
                    </div>
                  </div>

                  {/* Physics & Environmental Insight */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/70 space-y-2">
                    <p>
                      <strong className="text-white">
                        Soil & Acoustic Resonance:
                      </strong>{" "}
                      {initialRealms[selectedRealmAId]?.geography.soilResonance}
                    </p>
                    <p>
                      <strong className="text-white">Weather Phenomena:</strong>{" "}
                      {
                        initialRealms[selectedRealmAId]?.geography
                          .weatherPhenomena
                      }
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          )}

          {/* TAB 2: LINGUISTIC MATRICES */}
          {activeTab === "linguistics" && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Language Selector */}
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.values(linguisticFamilies).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLangId(lang.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      selectedLangId === lang.id
                        ? "bg-white/[0.15] text-white border border-white/20 shadow-sm"
                        : "bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06] border border-white/[0.05]"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              {/* Language Deep Dive Card */}
              {linguisticFamilies[selectedLangId] && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Phonology Rules */}
                  <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-6">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-mono text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                        Phonological Engine ·{" "}
                        {linguisticFamilies[selectedLangId].harmonicFrequencyHz}{" "}
                        Hz
                      </span>
                      <h2 className="text-2xl font-serif text-white">
                        {linguisticFamilies[selectedLangId].name}
                      </h2>
                      <p className="text-xs text-white/50">
                        Dominant Gate:{" "}
                        {linguisticFamilies[selectedLangId].dominantGate}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                        <span className="text-xs text-white/40 block">
                          Sensory Tone
                        </span>
                        <p className="text-sm font-medium text-white">
                          &ldquo;
                          {
                            linguisticFamilies[selectedLangId].phonology
                              .sensoryTone
                          }
                          &rdquo;
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                        <span className="text-xs text-white/40 block">
                          Cadence Pattern
                        </span>
                        <p className="text-sm font-medium text-white">
                          {
                            linguisticFamilies[selectedLangId].phonology
                              .cadencePattern
                          }
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                        <span className="text-xs text-white/40 block">
                          Preferred Consonants
                        </span>
                        <p className="text-sm font-mono text-white">
                          {linguisticFamilies[
                            selectedLangId
                          ].phonology.preferredConsonants.join(", ")}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                        <span className="text-xs text-white/40 block">
                          Vowel Harmony
                        </span>
                        <p className="text-sm font-mono text-white">
                          {linguisticFamilies[
                            selectedLangId
                          ].phonology.vowelHarmony.join(" · ")}
                        </p>
                      </div>
                    </div>

                    {/* Etymological Roots Dictionary */}
                    <div className="space-y-3">
                      <span className="text-xs uppercase font-mono text-white/60 tracking-wider">
                        Core Etymological Roots
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(
                          linguisticFamilies[selectedLangId].etymologicalRoots,
                        ).map(([root, meaning]) => (
                          <div
                            key={root}
                            className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs"
                          >
                            <span className="font-mono font-semibold text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                              {root}-
                            </span>
                            <span className="text-white/60 block mt-0.5">
                              &ldquo;{meaning}&rdquo;
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Name Generator */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs uppercase font-mono text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                          Generative Tooling
                        </span>
                        <h3 className="text-xl font-serif text-white">
                          Authentic Dialect Forge
                        </h3>
                        <p className="text-xs text-white/60 mt-1">
                          Generate phonologically accurate names compliant with
                          this language&apos;s roots.
                        </p>
                      </div>

                      {/* Kind Selector */}
                      <div className="space-y-2">
                        <label className="text-xs text-white/40 block">
                          Generation Target
                        </label>
                        <select
                          value={generatedNameKind}
                          onChange={(e) =>
                            setGeneratedNameKind(
                              e.target.value as GeneratedNameKind,
                            )
                          }
                          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                        >
                          <option
                            value="character_masculine"
                            className="bg-[#0b0f19]"
                          >
                            Character (Masculine)
                          </option>
                          <option
                            value="character_feminine"
                            className="bg-[#0b0f19]"
                          >
                            Character (Feminine)
                          </option>
                          <option
                            value="character_neutral"
                            className="bg-[#0b0f19]"
                          >
                            Character (Neutral)
                          </option>
                          <option value="toponym" className="bg-[#0b0f19]">
                            Toponym (City / Landmark)
                          </option>
                          <option value="relic" className="bg-[#0b0f19]">
                            Relic / Artifact
                          </option>
                        </select>
                      </div>

                      <button
                        onClick={handleGenerateName}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold tracking-wide uppercase transition-all duration-200 border border-white/10"
                      >
                        <ArrowsClockwise className="w-4 h-4 text-[var(--arc-brand-arcanean-gold,#d4af37)]" />
                        <span>Synthesize In-Dialect</span>
                      </button>

                      {/* Output Display */}
                      {generatedName && (
                        <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15 text-center space-y-2">
                          <span className="text-xs text-white/40 block uppercase font-mono">
                            Synthesized Output
                          </span>
                          <span className="text-xl font-serif font-medium text-white block">
                            {generatedName}
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(generatedName, "gen_name")
                            }
                            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white font-mono mt-1"
                          >
                            {copiedKey === "gen_name" ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied to clipboard</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy name</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] text-[11px] text-white/40">
                      Adheres to the Five Sensory Anchor Laws: every synthesized
                      name carries tactile roots.
                    </div>
                  </div>
                </div>
              )}
            </m.div>
          )}

          {/* TAB 3: SANDERSONIAN MAGIC TOLL */}
          {activeTab === "magic_toll" && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              {/* Gate & Intensity Selectors */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-6">
                <div>
                  <span className="text-xs uppercase font-mono text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                    Sanderson&apos;s Second Law: Limitations &gt; Powers
                  </span>
                  <h2 className="text-2xl font-serif text-white mt-1">
                    The Concrete Cost of Channeling
                  </h2>
                  <p className="text-xs text-white/60 mt-1">
                    Magic is not frictionless hand-waving. Every frequency
                    channeled exerts a biological and acoustic price.
                  </p>
                </div>

                {/* Gate Selectors */}
                <div className="space-y-2">
                  <label className="text-xs text-white/40 block">
                    Select Solfeggio Gate
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        "foundation",
                        "flow",
                        "fire",
                        "heart",
                        "voice",
                        "sight",
                        "crown",
                        "starweave",
                        "unity",
                        "source",
                      ] as GateId[]
                    ).map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGateId(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                          selectedGateId === g
                            ? "bg-white/20 text-white font-semibold border border-white/20"
                            : "bg-white/[0.02] text-white/50 hover:bg-white/[0.06] border border-white/[0.04]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity Selectors */}
                <div className="space-y-2">
                  <label className="text-xs text-white/40 block">
                    Channeling Intensity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      ["minor", "moderate", "severe", "cataclysmic"] as const
                    ).map((intensity) => (
                      <button
                        key={intensity}
                        onClick={() => setSelectedIntensity(intensity)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          selectedIntensity === intensity
                            ? "bg-white/[0.12] border-white/20 text-white"
                            : "bg-white/[0.02] border-white/[0.04] text-white/50 hover:bg-white/[0.05]"
                        }`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider block">
                          {intensity}
                        </span>
                        <span className="text-[11px] text-white/40 block mt-0.5">
                          {intensity === "minor"
                            ? "Subtle cantrip"
                            : intensity === "moderate"
                              ? "Field combat"
                              : intensity === "severe"
                                ? "High trial"
                                : "Cataclysmic rupture"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toll Detail Dossier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <span className="text-xs uppercase font-mono text-rose-400 tracking-wider">
                    Physical Bodily Toll
                  </span>
                  <p className="text-base text-white leading-relaxed">
                    {magicTollResult.physicalCost}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <span className="text-xs uppercase font-mono text-amber-400 tracking-wider">
                    Sensory Feedback (Smell / Taste / Sound)
                  </span>
                  <p className="text-base text-white leading-relaxed">
                    &ldquo;{magicTollResult.sensoryFeedback}&rdquo;
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <span className="text-xs uppercase font-mono text-cyan-400 tracking-wider">
                    Hard Magic Limitation
                  </span>
                  <p className="text-base text-white leading-relaxed">
                    {magicTollResult.limitation}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider">
                    Counter-Harmonic Remedy
                  </span>
                  <p className="text-base text-white leading-relaxed">
                    {magicTollResult.counterHarmonicRemedy}
                  </p>
                </div>
              </div>
            </m.div>
          )}

          {/* TAB 4: CAMPBELL-VOGLER 12-STAGE MONOMYTH */}
          {activeTab === "monomyth" && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs uppercase font-mono text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                  The Awakening Path
                </span>
                <h2 className="text-3xl font-serif text-white">
                  The 12 Stages of the Arcanean Monomyth
                </h2>
                <p className="text-xs text-white/60">
                  Every hero&apos;s arc synchronizes with the Ten Solfeggio
                  Gates, progressing from the mundane Foundation (174 Hz) to the
                  sovereign Source (1111 Hz).
                </p>
              </div>

              {/* Stepper Timeline */}
              <div className="flex items-center overflow-x-auto gap-2 pb-2 scrollbar-none">
                {monomythStages.map((stage) => {
                  const isCurrent = stage.stageNumber === selectedStageNum;
                  return (
                    <button
                      key={stage.stageNumber}
                      onClick={() => setSelectedStageNum(stage.stageNumber)}
                      className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-left border transition-all ${
                        isCurrent
                          ? "bg-white/[0.12] border-white/20 text-white"
                          : "bg-white/[0.02] border-white/[0.04] text-white/50 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-white/40 block">
                        Stage {stage.stageNumber} · {stage.frequencyHz} Hz
                      </span>
                      <span className="text-xs font-medium block whitespace-nowrap mt-0.5">
                        {stage.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Detailed Card */}
              {activeStage && (
                <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                    <div>
                      <span className="text-xs uppercase font-mono text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                        Stage {activeStage.stageNumber} of 12 · Gate of{" "}
                        {activeStage.gateId} ({activeStage.frequencyHz} Hz)
                      </span>
                      <h3 className="text-3xl font-serif text-white mt-1">
                        {activeStage.name}
                      </h3>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 self-start sm:self-auto">
                      Archetype: {activeStage.archetypeRole}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                      <span className="text-xs uppercase font-mono text-amber-400 tracking-wider">
                        Narrative Tension & Challenge
                      </span>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {activeStage.narrativeTension}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                      <span className="text-xs uppercase font-mono text-cyan-400 tracking-wider">
                        Sensory Threshold (Physical Anchors)
                      </span>
                      <p className="text-sm text-white/80 leading-relaxed">
                        &ldquo;{activeStage.sensoryThreshold}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 space-y-1">
                    <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider">
                      Transformation Milestone
                    </span>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {activeStage.transformationMilestone}
                    </p>
                  </div>
                </div>
              )}
            </m.div>
          )}

          {/* TAB 5: CANONICAL GUARDIAN DOSSIERS & PROVENANCE */}
          {activeTab === "provenance" && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              {/* Guardian Selector */}
              <div className="flex flex-wrap gap-2 justify-center">
                {guardians.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGuardianId(g.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      selectedGuardianId === g.id
                        ? "bg-white/[0.15] text-white border border-white/20 shadow-sm"
                        : "bg-white/[0.02] text-white/50 hover:bg-white/[0.06] border border-white/[0.04]"
                    }`}
                  >
                    Gate {g.gateNumber}: {g.name}
                  </button>
                ))}
              </div>

              {/* Dossier Card */}
              {activeGuardian && activeProvenance && (
                <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                    <div>
                      <span className="text-xs uppercase font-mono text-[var(--arc-brand-arcanean-gold,#d4af37)]">
                        Gate {activeGuardian.gateNumber} ·{" "}
                        {activeGuardian.frequencyHz} Hz ·{" "}
                        {activeGuardian.element}
                      </span>
                      <h3 className="text-3xl font-serif text-white mt-1">
                        {activeGuardian.name} — {activeGuardian.title}
                      </h3>
                      <p className="text-xs text-white/50 mt-1">
                        Bonded Godbeast: {activeGuardian.godbeast} · Origin
                        Realm: {activeGuardian.realmId}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleCopy(
                          JSON.stringify(activeProvenance, null, 2),
                          "prov_json",
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono transition-colors self-start sm:self-auto"
                    >
                      {copiedKey === "prov_json" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Provenance JSON</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Export Schema Record</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-xs text-white/40 block">
                        Tactile Physical Anchor
                      </span>
                      <p className="text-sm text-white font-medium">
                        {activeGuardian.tactileAnchor}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-xs text-white/40 block">
                        Linguistic Root & Meaning
                      </span>
                      <p className="text-sm text-white font-medium">
                        &ldquo;{activeProvenance.linguisticRoot.literalMeaning}
                        &rdquo; (Root:{" "}
                        {activeProvenance.linguisticRoot.etymologicalSource})
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-xs text-white/40 block">
                      Deep-Time Provenance & Causality Path
                    </span>
                    <p className="text-xs font-mono text-white/70 leading-relaxed">
                      {activeProvenance.temporalCausalityPath[0]?.eventSummary}
                    </p>
                    <p className="text-[11px] text-white/50 font-mono mt-1">
                      Modification:{" "}
                      {
                        activeProvenance.temporalCausalityPath[0]
                          ?.physicalModification
                      }
                    </p>
                  </div>
                </div>
              )}
            </m.div>
          )}

          {/* Bottom Footnote & Lore Bridge */}
          <div className="pt-12 border-t border-white/[0.06] text-center text-xs text-white/40 space-y-2">
            <p>
              Arcanea Living Worlds Engine · Grounded in the Ten Solfeggio Gates
              (174–1111 Hz) and the Primordial Duality.
            </p>
            <div className="flex items-center justify-center gap-4 text-white/60">
              <Link
                href="/lore"
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                Canonical Lore
              </Link>
              <span>·</span>
              <Link
                href="/worlds"
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                World Weaver
              </Link>
              <span>·</span>
              <Link
                href="/quiz"
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                Awakening Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

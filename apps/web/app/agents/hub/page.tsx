"use client";

import { useState, useMemo } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { CosmicParticles } from "@/components/magic/particles";
import { TextReveal, AuroraText, GradientText } from "@/components/magic/text-reveal";
import { SkillTree, MasteryRadial, GATE_BRANCHES } from "@/components/agents/skill-tree";
import { GateAgentCard } from "@/components/agents/gate-agent-card";

// ---------------------------------------------------------------------------
// Gate filter tabs
// ---------------------------------------------------------------------------

const GATE_TABS = [
  { key: "all", label: "All" },
  ...GATE_BRANCHES.map((b) => ({ key: b.gate, label: b.gate })),
];

// ---------------------------------------------------------------------------
// Flatten all skills into a list for the agent grid
// ---------------------------------------------------------------------------

const ALL_SKILLS = GATE_BRANCHES.flatMap((branch) =>
  branch.skills.map((skill) => ({
    ...skill,
    gateColor: branch.color,
    guardian: branch.guardian,
  })),
);

// ---------------------------------------------------------------------------
// Demo mastery data — normally from user state / Supabase
// ---------------------------------------------------------------------------

const DEMO_MASTERY: Record<string, number> = {
  Foundation: 72,
  Flow: 58,
  Fire: 85,
  Heart: 45,
  Voice: 63,
  Sight: 38,
  Crown: 22,
  Shift: 50,
  Unity: 30,
  Source: 15,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AgentHubPage() {
  const [activeGate, setActiveGate] = useState<string | null>(null);
  const [selectedSkillFromTree, setSelectedSkillFromTree] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    if (!activeGate || activeGate === "all") return ALL_SKILLS;
    return ALL_SKILLS.filter((s) => s.gate === activeGate);
  }, [activeGate]);

  const activeGateColor = activeGate
    ? GATE_BRANCHES.find((b) => b.gate === activeGate)?.color ?? "#7fffd4"
    : "#7fffd4";

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-12 overflow-hidden">
          <CosmicParticles />

          {/* Ambient orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#7fffd4]/8 rounded-full blur-3xl animate-float pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#78a6ff]/8 rounded-full blur-3xl animate-float-slow pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 right-1/3 w-52 h-52 bg-[#ffd700]/5 rounded-full blur-3xl animate-pulse pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#7fffd4] font-mono text-sm tracking-widest mb-4 uppercase">
                AgentHub
              </p>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                <span className="text-white">The Arcanea </span>
                <AuroraText>AgentHub</AuroraText>
              </h1>

              <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-3">
                Master the Gates. Command the Agents.
              </p>

              <p className="text-white/40 max-w-2xl mx-auto">
                Ten branches of power. Fifty skills to unlock. Navigate the star-map, discover your
                path, and activate the skills that shape your creative destiny.
              </p>
            </m.div>
          </div>
        </section>

        {/* ── Skill Tree ───────────────────────────────────────── */}
        <section className="py-8 relative" aria-labelledby="skill-tree-heading">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(127,255,212,0.03) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <TextReveal className="text-center mb-6">
              <h2 id="skill-tree-heading" className="text-2xl md:text-3xl font-display font-bold mb-2">
                The <GradientText>Star Map</GradientText>
              </h2>
              <p className="text-sm text-white/40">
                Click a node to explore. Click a Gate name to filter.
              </p>
            </TextReveal>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-4 md:p-6 backdrop-blur-sm"
            >
              <SkillTree
                onSelectGate={(g) => setActiveGate(g)}
                onSelectSkill={(s) => setSelectedSkillFromTree(s?.gate ?? null)}
                className="min-h-[400px] md:min-h-[550px]"
              />
            </m.div>
          </div>
        </section>

        {/* ── Agent Grid ───────────────────────────────────────── */}
        <section className="py-16" aria-labelledby="agents-heading">
          <div className="max-w-7xl mx-auto px-6">
            <TextReveal className="text-center mb-8">
              <h2 id="agents-heading" className="text-2xl md:text-3xl font-display font-bold mb-2">
                Gate <GradientText>Skills</GradientText>
              </h2>
              <p className="text-sm text-white/40">
                {activeGate
                  ? `Showing skills from the ${activeGate} Gate`
                  : "All 50 skills across the Ten Gates"}
              </p>
            </TextReveal>

            {/* Filter tabs */}
            <div
              className="flex flex-wrap justify-center gap-2 mb-10"
              role="tablist"
              aria-label="Gate filter"
            >
              {GATE_TABS.map((tab) => {
                const isActive =
                  tab.key === "all"
                    ? !activeGate || activeGate === "all"
                    : activeGate === tab.key;
                const tabColor =
                  tab.key === "all"
                    ? "#7fffd4"
                    : GATE_BRANCHES.find((b) => b.gate === tab.key)?.color ?? "#7fffd4";

                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveGate(tab.key === "all" ? null : tab.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 ${
                      isActive
                        ? "shadow-lg"
                        : "border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.03]"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${tabColor}18`,
                            borderColor: `${tabColor}50`,
                            color: tabColor,
                            boxShadow: `0 0 12px ${tabColor}15`,
                          }
                        : undefined
                    }
                  >
                    {tab.key === "all" ? (
                      <span className="flex items-center gap-1.5">
                        All
                        <span
                          className={`text-[10px] font-mono rounded-full px-1.5 py-0.5 ${
                            isActive ? "bg-white/10" : "bg-white/5 text-white/30"
                          }`}
                        >
                          50
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tabColor }}
                        />
                        {tab.label}
                        <span
                          className={`text-[10px] font-mono rounded-full px-1.5 py-0.5 ${
                            isActive ? "bg-white/10" : "bg-white/5 text-white/30"
                          }`}
                        >
                          5
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSkills.map((skill, i) => (
                <m.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                  className="h-full"
                >
                  <GateAgentCard
                    id={skill.id}
                    name={skill.name}
                    description={skill.description}
                    gate={skill.gate}
                    gateColor={skill.gateColor}
                    tier={skill.tier}
                  />
                </m.div>
              ))}
            </div>

            <p className="text-center text-sm text-white/30 mt-8">
              Showing {filteredSkills.length} of 50 skills
            </p>
          </div>
        </section>

        {/* ── Mastery Section ──────────────────────────────────── */}
        <section className="py-20 bg-white/[0.02] relative overflow-hidden" aria-labelledby="mastery-heading">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#7fffd4]/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <TextReveal className="text-center mb-10">
              <h2 id="mastery-heading" className="text-2xl md:text-3xl font-display font-bold mb-2">
                Your <GradientText>Mastery</GradientText>
              </h2>
              <p className="text-sm text-white/40">
                Progress across all Ten Gates
              </p>
            </TextReveal>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              {/* Radial chart */}
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0"
              >
                <MasteryRadial mastery={DEMO_MASTERY} />
              </m.div>

              {/* Path summary */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 space-y-4"
              >
                <h3 className="text-lg font-display font-bold text-white mb-4">Your Path</h3>
                {GATE_BRANCHES.map((branch) => {
                  const pct = DEMO_MASTERY[branch.gate] ?? 0;
                  return (
                    <div key={branch.gate} className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: branch.color }}
                      />
                      <span className="text-xs text-white/60 w-20 flex-shrink-0">{branch.gate}</span>
                      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <m.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: branch.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40 font-mono w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Current Rank</span>
                    <span className="text-sm font-bold text-[#a78bfa]">Master</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-white/40">Gates Opened</span>
                    <span className="text-sm font-bold text-[#7fffd4]">6 / 10</span>
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-20 relative overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#7fffd4]/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <TextReveal>
              <p className="text-[#7fffd4] font-mono text-sm tracking-widest mb-4 uppercase">Begin</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Every Master Was Once <AuroraText>Apprentice</AuroraText>
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Start with the Foundation Gate and work your way to Source. Each skill unlocked
                deepens your creative intelligence and expands what your agents can do.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <m.a
                  href="/agents"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] text-gray-950 font-bold rounded-xl shadow-lg shadow-[#7fffd4]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
                >
                  Browse Agents
                </m.a>
                <m.a
                  href="/academy"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#7fffd4]/40 text-[#7fffd4] font-bold rounded-xl hover:bg-[#7fffd4]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
                >
                  Enter the Academy
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </m.a>
              </div>
            </TextReveal>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}

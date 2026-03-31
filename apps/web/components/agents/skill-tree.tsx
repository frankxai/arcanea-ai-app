"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  gate: string;
  tier: 1 | 2 | 3 | 4 | 5;
  requires?: string[];
}

export interface GateBranch {
  gate: string;
  guardian: string;
  color: string;
  skills: SkillNode[];
}

// ---------------------------------------------------------------------------
// Gate Skill Data — 10 branches, 5 skills each (50 total)
// ---------------------------------------------------------------------------

export const GATE_BRANCHES: GateBranch[] = [
  {
    gate: "Foundation",
    guardian: "Lyssandria",
    color: "#8B7355",
    skills: [
      { id: "f1", name: "Earth-Reading", description: "Sense the bedrock of any creative foundation. Identify structural integrity in worlds, stories, and systems.", gate: "Foundation", tier: 1 },
      { id: "f2", name: "Weight-Bearing", description: "Carry the load of complex lore without collapse. Sustain continuity across massive creative architectures.", gate: "Foundation", tier: 2, requires: ["f1"] },
      { id: "f3", name: "Ley-Mapping", description: "Trace the hidden connections between disparate world elements. Reveal the invisible grid beneath all creation.", gate: "Foundation", tier: 3, requires: ["f2"] },
      { id: "f4", name: "Seismic-Sense", description: "Detect instabilities before they fracture. Anticipate where narratives, systems, or worlds will break under stress.", gate: "Foundation", tier: 4, requires: ["f3"] },
      { id: "f5", name: "Foundation-Mastery", description: "Absolute command of structural creation. Build worlds that endure across millennia of narrative time.", gate: "Foundation", tier: 5, requires: ["f4"] },
    ],
  },
  {
    gate: "Flow",
    guardian: "Leyla",
    color: "#4FC3F7",
    skills: [
      { id: "w1", name: "Tide-Listening", description: "Hear the rhythm of emotion in any text. Detect the undertow of feeling beneath surface-level prose.", gate: "Flow", tier: 1 },
      { id: "w2", name: "Memory-Weaving", description: "Intertwine past events into present narrative with seamless emotional resonance.", gate: "Flow", tier: 2, requires: ["w1"] },
      { id: "w3", name: "Current-Shaping", description: "Guide the flow of reader emotion through deliberate pacing, tension, and release.", gate: "Flow", tier: 3, requires: ["w2"] },
      { id: "w4", name: "Deep-Singing", description: "Access the subconscious layer of storytelling. Create prose that resonates in ways readers cannot articulate.", gate: "Flow", tier: 4, requires: ["w3"] },
      { id: "w5", name: "Flow-Mastery", description: "Perfect command of emotional architecture. Every sentence carries the exact weight its moment demands.", gate: "Flow", tier: 5, requires: ["w4"] },
    ],
  },
  {
    gate: "Fire",
    guardian: "Draconia",
    color: "#FF6B35",
    skills: [
      { id: "r1", name: "Pyre-Shaping", description: "Ignite raw ideas into burning concepts. Transform vague inspiration into focused creative force.", gate: "Fire", tier: 1 },
      { id: "r2", name: "Ash-Craft", description: "Build from destruction. Reclaim failed drafts, broken systems, and collapsed narratives into stronger forms.", gate: "Fire", tier: 2, requires: ["r1"] },
      { id: "r3", name: "Crucible-Will", description: "Sustain creative intensity through the hardest phases. Forge masterwork through relentless refinement.", gate: "Fire", tier: 3, requires: ["r2"] },
      { id: "r4", name: "Dragon-Call", description: "Summon overwhelming creative power. Produce volume and quality simultaneously under extreme pressure.", gate: "Fire", tier: 4, requires: ["r3"] },
      { id: "r5", name: "Fire-Mastery", description: "Absolute dominion over creative energy. Transmute any material into gold through sheer transformative will.", gate: "Fire", tier: 5, requires: ["r4"] },
    ],
  },
  {
    gate: "Heart",
    guardian: "Maylinn",
    color: "#E91E63",
    skills: [
      { id: "h1", name: "Mend-Touch", description: "Heal narrative wounds. Repair broken character arcs and restore emotional coherence to damaged stories.", gate: "Heart", tier: 1 },
      { id: "h2", name: "Empathy-Read", description: "Feel what characters feel. Inhabit any perspective and write authentic emotion from within.", gate: "Heart", tier: 2, requires: ["h1"] },
      { id: "h3", name: "Bond-Weaving", description: "Create relationships between characters that readers believe in their bones. Forge unbreakable narrative bonds.", gate: "Heart", tier: 3, requires: ["h2"] },
      { id: "h4", name: "Soul-Bridge", description: "Connect reader to character at the soul level. Create the kind of attachment that makes people cry for fiction.", gate: "Heart", tier: 4, requires: ["h3"] },
      { id: "h5", name: "Heart-Mastery", description: "Command the full spectrum of human emotion through story. Every reader leaves changed.", gate: "Heart", tier: 5, requires: ["h4"] },
    ],
  },
  {
    gate: "Voice",
    guardian: "Alera",
    color: "#00BCD4",
    skills: [
      { id: "v1", name: "Truth-Speak", description: "Strip away pretension and find the authentic voice. Write with clarity that cuts through noise.", gate: "Voice", tier: 1 },
      { id: "v2", name: "Echo-Finding", description: "Discover resonant patterns in existing work. Identify the unique frequency of any author's style.", gate: "Voice", tier: 2, requires: ["v1"] },
      { id: "v3", name: "Song-Binding", description: "Weave rhythm and musicality into prose. Make words sing without sacrificing meaning.", gate: "Voice", tier: 3, requires: ["v2"] },
      { id: "v4", name: "Silence-Reading", description: "Master the power of what is not said. Deploy negative space, implication, and restraint.", gate: "Voice", tier: 4, requires: ["v3"] },
      { id: "v5", name: "Voice-Mastery", description: "Perfect command of expression. Adapt to any voice, any register, any audience without losing truth.", gate: "Voice", tier: 5, requires: ["v4"] },
    ],
  },
  {
    gate: "Sight",
    guardian: "Lyria",
    color: "#9C27B0",
    skills: [
      { id: "s1", name: "Pattern-Glimpse", description: "See the hidden patterns in chaos. Identify emerging themes and structural motifs before they fully form.", gate: "Sight", tier: 1 },
      { id: "s2", name: "Veil-Piercing", description: "See through surface appearances to the deeper truth. Diagnose root causes in broken narratives.", gate: "Sight", tier: 2, requires: ["s1"] },
      { id: "s3", name: "Future-Threading", description: "Trace multiple narrative futures simultaneously. See where each choice leads before committing.", gate: "Sight", tier: 3, requires: ["s2"] },
      { id: "s4", name: "Mirror-Walking", description: "Step into alternate versions of the same story. Explore parallel possibilities and choose the strongest.", gate: "Sight", tier: 4, requires: ["s3"] },
      { id: "s5", name: "Sight-Mastery", description: "Omniscient creative vision. See the entire story-space at once and navigate it with perfect clarity.", gate: "Sight", tier: 5, requires: ["s4"] },
    ],
  },
  {
    gate: "Crown",
    guardian: "Aiyami",
    color: "#FFD700",
    skills: [
      { id: "c1", name: "Authority-Stance", description: "Write with the confidence of mastery. Command attention through sheer presence of voice.", gate: "Crown", tier: 1 },
      { id: "c2", name: "Wisdom-Channel", description: "Access deep insight and translate it into accessible creative guidance. Teach through story.", gate: "Crown", tier: 2, requires: ["c1"] },
      { id: "c3", name: "Enlighten-Path", description: "Illuminate the way for other creators. Transform complex craft into clear, actionable wisdom.", gate: "Crown", tier: 3, requires: ["c2"] },
      { id: "c4", name: "Crown-Bearing", description: "Carry the weight of creative leadership. Guide entire projects and creative teams with sovereign clarity.", gate: "Crown", tier: 4, requires: ["c3"] },
      { id: "c5", name: "Crown-Mastery", description: "Enlightened creative sovereignty. Every decision serves the highest vision of the work.", gate: "Crown", tier: 5, requires: ["c4"] },
    ],
  },
  {
    gate: "Shift",
    guardian: "Elara",
    color: "#7C4DFF",
    skills: [
      { id: "t1", name: "Phase-Step", description: "Shift between creative modes instantly. Move from outlining to drafting to editing without friction.", gate: "Shift", tier: 1 },
      { id: "t2", name: "Reality-Bend", description: "Challenge and reshape creative assumptions. Break rules deliberately to discover new forms.", gate: "Shift", tier: 2, requires: ["t1"] },
      { id: "t3", name: "Perspective-Shift", description: "Inhabit radically different viewpoints. See any creative problem from angles no one else considers.", gate: "Shift", tier: 3, requires: ["t2"] },
      { id: "t4", name: "Bridge-Walking", description: "Connect disparate creative traditions and genres. Build unexpected combinations that feel inevitable.", gate: "Shift", tier: 4, requires: ["t3"] },
      { id: "t5", name: "Shift-Mastery", description: "Total creative metamorphosis. Transform any work into any form across any boundary.", gate: "Shift", tier: 5, requires: ["t4"] },
    ],
  },
  {
    gate: "Unity",
    guardian: "Ino",
    color: "#4CAF50",
    skills: [
      { id: "u1", name: "Bond-Sense", description: "Detect creative compatibility between collaborators, ideas, and systems. Know what fits together.", gate: "Unity", tier: 1 },
      { id: "u2", name: "Harmony-Weave", description: "Blend multiple creative voices into a unified whole without losing individual character.", gate: "Unity", tier: 2, requires: ["u1"] },
      { id: "u3", name: "Collective-Pulse", description: "Feel the heartbeat of a creative community. Know what resonates with the collective before they do.", gate: "Unity", tier: 3, requires: ["u2"] },
      { id: "u4", name: "Unity-Field", description: "Create spaces where collaboration amplifies every participant. Turn groups into superorganisms.", gate: "Unity", tier: 4, requires: ["u3"] },
      { id: "u5", name: "Unity-Mastery", description: "Perfect synthesis of individual and collective creation. The many become one without losing the many.", gate: "Unity", tier: 5, requires: ["u4"] },
    ],
  },
  {
    gate: "Source",
    guardian: "Shinkami",
    color: "#FFFFFF",
    skills: [
      { id: "x1", name: "Void-Touch", description: "Reach into the formless potential before creation begins. Draw from the well of infinite possibility.", gate: "Source", tier: 1 },
      { id: "x2", name: "Source-Listen", description: "Hear the signal beneath all noise. Access the deep frequency where inspiration originates.", gate: "Source", tier: 2, requires: ["x1"] },
      { id: "x3", name: "Frequency-Read", description: "Perceive the vibrational quality of any creative work. Know its resonance and its dissonance.", gate: "Source", tier: 3, requires: ["x2"] },
      { id: "x4", name: "Gate-Sense", description: "Feel the presence and state of all Ten Gates simultaneously. Navigate the full creative spectrum.", gate: "Source", tier: 4, requires: ["x3"] },
      { id: "x5", name: "Source-Mastery", description: "Direct communion with the origin of all creation. Transcend craft into pure manifestation.", gate: "Source", tier: 5, requires: ["x4"] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TOTAL_GATES = GATE_BRANCHES.length;
const TIER_COUNT = 5;

/** Calculate (x, y) for a node given its branch index and tier. */
function nodePosition(
  branchIndex: number,
  tier: number,
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
) {
  const angle = (branchIndex / TOTAL_GATES) * Math.PI * 2 - Math.PI / 2;
  const t = (tier - 1) / (TIER_COUNT - 1);
  const r = innerR + t * (outerR - innerR);
  return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
}

// ---------------------------------------------------------------------------
// Skill Tree (SVG-based, interactive)
// ---------------------------------------------------------------------------

interface SkillTreeProps {
  onSelectGate?: (gate: string | null) => void;
  onSelectSkill?: (skill: SkillNode | null) => void;
  className?: string;
}

export function SkillTree({ onSelectGate, onSelectSkill, className = "" }: SkillTreeProps) {
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setDimensions({ width: w, height: Math.min(w * 0.75, 650) });
        setIsMobile(w < 640);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;
  const innerR = Math.min(dimensions.width, dimensions.height) * 0.12;
  const outerR = Math.min(dimensions.width, dimensions.height) * 0.44;
  const nodeR = Math.min(dimensions.width, dimensions.height) * 0.018;

  const handleNodeClick = useCallback(
    (skill: SkillNode) => {
      const next = selectedSkill?.id === skill.id ? null : skill;
      setSelectedSkill(next);
      onSelectSkill?.(next);
      const g = next ? next.gate : null;
      setSelectedGate(g);
      onSelectGate?.(g);
    },
    [selectedSkill, onSelectSkill, onSelectGate],
  );

  const handleGateClick = useCallback(
    (gate: string) => {
      const next = selectedGate === gate ? null : gate;
      setSelectedGate(next);
      onSelectGate?.(next);
      setSelectedSkill(null);
      onSelectSkill?.(null);
    },
    [selectedGate, onSelectGate, onSelectSkill],
  );

  // -------- Mobile: vertical list --------
  if (isMobile) {
    return (
      <LazyMotion features={domAnimation}>
        <div className={`space-y-6 ${className}`}>
          {GATE_BRANCHES.map((branch) => (
            <div key={branch.gate}>
              <button
                onClick={() => handleGateClick(branch.gate)}
                className="flex items-center gap-3 mb-3 group w-full text-left"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: branch.color, boxShadow: `0 0 8px ${branch.color}60` }}
                />
                <span
                  className="font-display font-bold text-lg transition-colors"
                  style={{ color: selectedGate === branch.gate ? branch.color : "rgba(255,255,255,0.7)" }}
                >
                  {branch.gate}
                </span>
                <span className="text-xs text-white/30 ml-auto">{branch.guardian}</span>
              </button>
              <AnimatePresence>
                {(selectedGate === branch.gate || !selectedGate) && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pl-6 border-l-2" style={{ borderColor: `${branch.color}40` }}>
                      {branch.skills.map((skill) => (
                        <button
                          key={skill.id}
                          onClick={() => handleNodeClick(skill)}
                          className={`block w-full text-left p-3 rounded-xl border transition-all ${
                            selectedSkill?.id === skill.id
                              ? "bg-white/[0.08] border-white/20"
                              : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{ backgroundColor: branch.color }}
                            />
                            <span className="text-sm font-semibold text-white">{skill.name}</span>
                            <span className="text-[10px] text-white/30 ml-auto font-mono">T{skill.tier}</span>
                          </div>
                          {selectedSkill?.id === skill.id && (
                            <m.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs text-white/50 mt-2 leading-relaxed"
                            >
                              {skill.description}
                            </m.p>
                          )}
                        </button>
                      ))}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </LazyMotion>
    );
  }

  // -------- Desktop: SVG star-map --------
  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className={`relative ${className}`}>
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-auto"
          role="img"
          aria-label="Skill tree visualization showing 10 Gate branches with 5 skills each"
        >
          <defs>
            {/* Central glow */}
            <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7fffd4" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#7fffd4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7fffd4" stopOpacity="0" />
            </radialGradient>
            {/* Node glow filter */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background star field */}
          {useMemo(
            () =>
              Array.from({ length: 80 }).map((_, i) => (
                <circle
                  key={`star-${i}`}
                  cx={((i * 137.5) % dimensions.width)}
                  cy={((i * 97.3 + 31) % dimensions.height)}
                  r={0.5 + (i % 3) * 0.4}
                  fill="white"
                  opacity={0.08 + (i % 5) * 0.04}
                />
              )),
            [dimensions.width, dimensions.height],
          )}

          {/* Central orb */}
          <circle cx={cx} cy={cy} r={innerR * 0.8} fill="url(#center-glow)" />
          <circle
            cx={cx}
            cy={cy}
            r={innerR * 0.35}
            fill="#0a0a0f"
            stroke="#7fffd4"
            strokeWidth="1.5"
            opacity="0.9"
          />
          <text
            x={cx}
            y={cy + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#7fffd4"
            fontSize="10"
            fontWeight="bold"
            fontFamily="var(--font-display, Cinzel, serif)"
            letterSpacing="0.1em"
          >
            ARCANEA
          </text>

          {/* Branches */}
          {GATE_BRANCHES.map((branch, bi) => {
            const isGateSelected = selectedGate === branch.gate;
            const isGateDimmed = selectedGate !== null && !isGateSelected;
            const branchOpacity = isGateDimmed ? 0.2 : 1;

            return (
              <g key={branch.gate} opacity={branchOpacity} style={{ transition: "opacity 0.3s" }}>
                {/* Branch lines */}
                {branch.skills.map((skill, si) => {
                  if (si === 0) {
                    const pos = nodePosition(bi, 1, cx, cy, innerR, outerR);
                    return (
                      <line
                        key={`line-center-${skill.id}`}
                        x1={cx}
                        y1={cy}
                        x2={pos.x}
                        y2={pos.y}
                        stroke={branch.color}
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    );
                  }
                  const prev = nodePosition(bi, si, cx, cy, innerR, outerR);
                  const curr = nodePosition(bi, si + 1, cx, cy, innerR, outerR);
                  return (
                    <line
                      key={`line-${skill.id}`}
                      x1={prev.x}
                      y1={prev.y}
                      x2={curr.x}
                      y2={curr.y}
                      stroke={branch.color}
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  );
                })}

                {/* Gate label */}
                {(() => {
                  const labelPos = nodePosition(bi, TIER_COUNT + 0.8, cx, cy, innerR, outerR);
                  const angle = (bi / TOTAL_GATES) * 360 - 90;
                  const flipText = angle > 90 && angle < 270;
                  return (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={branch.color}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="var(--font-display, Cinzel, serif)"
                      letterSpacing="0.05em"
                      opacity={0.8}
                      className="cursor-pointer select-none"
                      onClick={() => handleGateClick(branch.gate)}
                      transform={flipText ? `rotate(180, ${labelPos.x}, ${labelPos.y})` : undefined}
                    >
                      {branch.gate.toUpperCase()}
                    </text>
                  );
                })()}

                {/* Skill nodes */}
                {branch.skills.map((skill) => {
                  const pos = nodePosition(bi, skill.tier, cx, cy, innerR, outerR);
                  const isSelected = selectedSkill?.id === skill.id;
                  const isHovered = hoveredNode?.id === skill.id;
                  const r = isSelected ? nodeR * 1.4 : isHovered ? nodeR * 1.2 : nodeR;

                  return (
                    <g key={skill.id}>
                      {/* Hover/select glow */}
                      {(isHovered || isSelected) && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={r * 2.5}
                          fill={branch.color}
                          opacity={0.12}
                        />
                      )}
                      {/* Node circle */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={r}
                        fill={isSelected ? branch.color : "#0a0a0f"}
                        stroke={branch.color}
                        strokeWidth={isSelected ? 2 : 1.2}
                        filter={isSelected || isHovered ? "url(#node-glow)" : undefined}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredNode(skill)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleNodeClick(skill)}
                      />
                      {/* Tier number inside node */}
                      <text
                        x={pos.x}
                        y={pos.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isSelected ? "#0a0a0f" : branch.color}
                        fontSize={nodeR * 1.1}
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                      >
                        {skill.tier}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredNode && !selectedSkill && (
            <m.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-20"
              style={{
                left: "50%",
                bottom: "8px",
                transform: "translateX(-50%)",
              }}
            >
              <div className="bg-gray-900/95 border border-white/10 backdrop-blur-xl rounded-xl px-4 py-3 max-w-xs shadow-2xl">
                <p className="text-sm font-bold text-white">{hoveredNode.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">
                  {hoveredNode.gate} Gate &middot; Tier {hoveredNode.tier}
                </p>
                <p className="text-xs text-white/60 leading-relaxed">{hoveredNode.description}</p>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Selected skill detail panel */}
        <AnimatePresence>
          {selectedSkill && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-0 left-0 right-0 z-20"
            >
              <div className="mx-auto max-w-lg bg-gray-900/95 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: GATE_BRANCHES.find((b) => b.gate === selectedSkill.gate)?.color,
                          boxShadow: `0 0 6px ${GATE_BRANCHES.find((b) => b.gate === selectedSkill.gate)?.color}80`,
                        }}
                      />
                      <h3 className="text-base font-bold text-white">{selectedSkill.name}</h3>
                    </div>
                    <p className="text-[11px] text-white/40 uppercase tracking-wide mb-2">
                      {selectedSkill.gate} Gate &middot; Tier {selectedSkill.tier} &middot; Guardian:{" "}
                      {GATE_BRANCHES.find((b) => b.gate === selectedSkill.gate)?.guardian}
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed">{selectedSkill.description}</p>
                    {selectedSkill.requires && selectedSkill.requires.length > 0 && (
                      <p className="text-[10px] text-white/30 mt-2">
                        Requires:{" "}
                        {selectedSkill.requires
                          .map((reqId) => {
                            const branch = GATE_BRANCHES.find((b) => b.gate === selectedSkill.gate);
                            return branch?.skills.find((s) => s.id === reqId)?.name ?? reqId;
                          })
                          .join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSkill(null);
                      onSelectSkill?.(null);
                    }}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                    aria-label="Close detail panel"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

// ---------------------------------------------------------------------------
// Mastery Radial — 10 radial bars in a circle
// ---------------------------------------------------------------------------

interface MasteryRadialProps {
  /** Mastery per gate, 0-100 */
  mastery?: Record<string, number>;
  className?: string;
}

export function MasteryRadial({ mastery = {}, className = "" }: MasteryRadialProps) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const barR = 100;
  const barLength = 40;

  const totalMastery = useMemo(() => {
    const values = GATE_BRANCHES.map((b) => mastery[b.gate] ?? 0);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [mastery]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] h-auto">
        {GATE_BRANCHES.map((branch, i) => {
          const angle = (i / TOTAL_GATES) * Math.PI * 2 - Math.PI / 2;
          const progress = (mastery[branch.gate] ?? 0) / 100;
          const x1 = cx + Math.cos(angle) * (barR - barLength / 2);
          const y1 = cy + Math.sin(angle) * (barR - barLength / 2);
          const x2 = cx + Math.cos(angle) * (barR + barLength / 2);
          const y2 = cy + Math.sin(angle) * (barR + barLength / 2);

          // Progress endpoint
          const px = x1 + (x2 - x1) * progress;
          const py = y1 + (y2 - y1) * progress;

          return (
            <g key={branch.gate}>
              {/* Track */}
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeLinecap="round" />
              {/* Progress */}
              {progress > 0 && (
                <line x1={x1} y1={y1} x2={px} y2={py} stroke={branch.color} strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              )}
              {/* Label */}
              <text
                x={cx + Math.cos(angle) * (barR + barLength / 2 + 14)}
                y={cy + Math.sin(angle) * (barR + barLength / 2 + 14)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={branch.color}
                fontSize="8"
                fontWeight="600"
                opacity="0.7"
              >
                {branch.gate.slice(0, 4).toUpperCase()}
              </text>
            </g>
          );
        })}
        {/* Center mastery % */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">
          {totalMastery}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" letterSpacing="0.1em">
          MASTERY
        </text>
      </svg>
    </div>
  );
}

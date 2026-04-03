/**
 * World Intelligence Engine
 *
 * The brain of Arcanea MCP. Analyzes world state, detects narrative gaps,
 * generates conflicts, weaves story arcs, and tells the creator what to build next.
 *
 * This is what makes arcanea-mcp genius — not just generation tools,
 * but an intelligence that UNDERSTANDS your world and guides creation.
 */

import {
  type CreationNode,
  type CreationEdge,
  getGraphNodes,
  getGraphEdges,
  getGraphSummary,
} from "./creation-graph.js";

// ── World Analysis Types ─────────────────────────────────────────────

interface WorldGap {
  type: "missing_role" | "missing_element" | "missing_location" | "orphan" | "dead_end" | "narrative_gap" | "power_imbalance" | "faction_void";
  severity: "critical" | "important" | "nice_to_have";
  description: string;
  suggestion: string;
  toolToUse: string;
  toolArgs?: Record<string, any>;
}

interface NarrativeArc {
  title: string;
  type: "origin" | "conflict" | "quest" | "transformation" | "revelation" | "war" | "redemption";
  acts: Array<{
    act: number;
    title: string;
    summary: string;
    involvedCreations: string[];
    keyEvent: string;
  }>;
  stakes: string;
  theme: string;
  estimatedChapters: number;
}

interface ConflictSeed {
  title: string;
  type: "personal" | "political" | "elemental" | "cosmic" | "moral" | "survival";
  aggressors: string[];
  defenders: string[];
  stakes: string;
  rootCause: string;
  escalation: string[];
  possibleResolutions: string[];
  moralComplexity: string;
}

interface WorldReport {
  health: number; // 0-100
  grade: string;
  strengths: string[];
  gaps: WorldGap[];
  nextActions: Array<{ priority: number; action: string; tool: string }>;
  narrativePotential: string;
  worldPersonality: string;
}

// ── Elemental Balance Analysis ───────────────────────────────────────

const ALL_ELEMENTS = ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"] as const;

function analyzeElementalBalance(nodes: CreationNode[]): {
  distribution: Record<string, number>;
  dominant: string | null;
  missing: string[];
  balanced: boolean;
} {
  const distribution: Record<string, number> = {};
  ALL_ELEMENTS.forEach(e => distribution[e] = 0);

  for (const node of nodes) {
    const elem = node.element || node.metadata?.primaryElement || node.metadata?.dominantElement;
    if (elem && distribution[elem] !== undefined) {
      distribution[elem]++;
    }
  }

  const counts = Object.values(distribution);
  const total = counts.reduce((a, b) => a + b, 0);
  const missing = ALL_ELEMENTS.filter(e => distribution[e] === 0);
  const max = Math.max(...counts);
  const dominant = max > 0 ? Object.entries(distribution).find(([, v]) => v === max)?.[0] || null : null;
  const balanced = total > 0 && max <= total / ALL_ELEMENTS.length * 2;

  return { distribution, dominant, missing: [...missing], balanced };
}

// ── Role Analysis ────────────────────────────────────────────────────

const NARRATIVE_ROLES = [
  "hero", "mentor", "villain", "trickster", "guardian",
  "healer", "scholar", "warrior", "diplomat", "outcast"
] as const;

function detectRoles(nodes: CreationNode[]): {
  filled: string[];
  missing: string[];
  duplicates: string[];
} {
  const characters = nodes.filter(n => n.type === "character");
  const roleSignals: Record<string, string[]> = {
    hero: ["protagonist", "chosen", "destined", "brave", "Luminor"],
    mentor: ["teacher", "guide", "elder", "master", "sage", "Archmage"],
    villain: ["dark", "corrupt", "fallen", "shadow", "enemy"],
    trickster: ["cunning", "chaotic", "wild", "shapeshifter"],
    guardian: ["protector", "shield", "warden", "sentinel"],
    healer: ["heal", "restore", "mend", "Water", "Heart"],
    scholar: ["study", "research", "lore", "knowledge", "library"],
    warrior: ["fight", "battle", "sword", "Fire", "strength"],
    diplomat: ["peace", "negotiate", "bridge", "unity", "Wind"],
    outcast: ["exile", "alone", "wanderer", "lost", "Void"],
  };

  const detectedRoles = new Set<string>();
  const roleCounts: Record<string, number> = {};

  for (const char of characters) {
    const text = JSON.stringify(char.metadata).toLowerCase() + " " + char.name.toLowerCase() + " " + (char.metadata?.rank || "").toLowerCase();
    for (const [role, signals] of Object.entries(roleSignals)) {
      if (signals.some(s => text.includes(s.toLowerCase()))) {
        detectedRoles.add(role);
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      }
    }
  }

  const filled = [...detectedRoles];
  const missing = NARRATIVE_ROLES.filter(r => !detectedRoles.has(r));
  const duplicates = Object.entries(roleCounts).filter(([, c]) => c > 2).map(([r]) => r);

  return { filled: [...filled], missing: [...missing], duplicates };
}

// ── Gap Detection ────────────────────────────────────────────────────

function detectGaps(nodes: CreationNode[], edges: CreationEdge[]): WorldGap[] {
  const gaps: WorldGap[] = [];
  const characters = nodes.filter(n => n.type === "character");
  const locations = nodes.filter(n => n.type === "location");
  const creatures = nodes.filter(n => n.type === "creature");
  const artifacts = nodes.filter(n => n.type === "artifact");

  // 1. No characters — world is empty
  if (characters.length === 0) {
    gaps.push({
      type: "missing_role",
      severity: "critical",
      description: "Your world has no characters. Stories need people.",
      suggestion: "Create a founding character — someone who embodies your world's central tension.",
      toolToUse: "generate_character",
      toolArgs: { gatesOpen: 5 },
    });
  }

  // 2. Characters but no locations — where do they live?
  if (characters.length > 0 && locations.length === 0) {
    gaps.push({
      type: "missing_location",
      severity: "critical",
      description: "Your characters exist in a void. Where do they live, train, fight?",
      suggestion: "Create your world's central hub — an academy, city, or sacred place.",
      toolToUse: "generate_location",
    });
  }

  // 3. Orphan creations — not connected to anything
  const connectedIds = new Set<string>();
  edges.forEach(e => { connectedIds.add(e.sourceId); connectedIds.add(e.targetId); });
  const orphans = nodes.filter(n => !connectedIds.has(n.id));
  if (orphans.length > 0 && nodes.length > 3) {
    gaps.push({
      type: "orphan",
      severity: "important",
      description: `${orphans.length} creation(s) are disconnected from your world: ${orphans.map(o => o.name).join(", ")}. Isolated elements weaken narrative cohesion.`,
      suggestion: `Link them: use link_creations to connect ${orphans[0]?.name} to another creation.`,
      toolToUse: "link_creations",
    });
  }

  // 4. Elemental gaps
  const balance = analyzeElementalBalance(nodes);
  if (balance.missing.length > 0 && nodes.length >= 5) {
    gaps.push({
      type: "missing_element",
      severity: balance.missing.length >= 3 ? "important" : "nice_to_have",
      description: `Your world lacks ${balance.missing.join(", ")} element(s). ${balance.dominant ? `It's dominated by ${balance.dominant}.` : ""}`,
      suggestion: `Create a ${balance.missing[0]} character or location to balance your world.`,
      toolToUse: "generate_character",
      toolArgs: { primaryElement: balance.missing[0] },
    });
  }

  // 5. No villain / no conflict source
  const roles = detectRoles(nodes);
  if (characters.length >= 3 && !roles.filled.includes("villain")) {
    gaps.push({
      type: "narrative_gap",
      severity: "important",
      description: "Your world has heroes but no antagonist. Without opposition, there's no story tension.",
      suggestion: "Create a character with legitimate grievances who opposes your heroes — not evil for evil's sake, but someone who believes they're right.",
      toolToUse: "generate_character",
      toolArgs: { archetype: "antagonist" },
    });
  }

  // 6. No artifacts — nothing to quest for
  if (characters.length >= 3 && artifacts.length === 0) {
    gaps.push({
      type: "narrative_gap",
      severity: "nice_to_have",
      description: "Your world has no artifacts. Legendary objects drive quests, create dilemmas, and embody your world's history.",
      suggestion: "Create a legendary artifact connected to your founding character.",
      toolToUse: "generate_artifact",
      toolArgs: { power: "legendary" },
    });
  }

  // 7. Power imbalance
  const gateLevels = characters.map(c => c.gate || c.metadata?.gatesOpen || 1);
  const avgGate = gateLevels.reduce((a, b) => a + b, 0) / Math.max(gateLevels.length, 1);
  if (avgGate > 7 && characters.length >= 3) {
    gaps.push({
      type: "power_imbalance",
      severity: "important",
      description: `Average power level is ${avgGate.toFixed(1)}/10 — everyone is too powerful. Stories need underdogs, growth arcs, and vulnerability.`,
      suggestion: "Create an Apprentice (1-2 gates) character who must grow. The audience roots for the underdog.",
      toolToUse: "generate_character",
      toolArgs: { gatesOpen: 2 },
    });
  }

  // 8. Dead-end characters (connected in but not out)
  if (edges.length > 3) {
    const outgoing = new Map<string, number>();
    const incoming = new Map<string, number>();
    edges.forEach(e => {
      outgoing.set(e.sourceId, (outgoing.get(e.sourceId) || 0) + 1);
      incoming.set(e.targetId, (incoming.get(e.targetId) || 0) + 1);
    });
    const deadEnds = characters.filter(c =>
      (incoming.get(c.id) || 0) > 0 && (outgoing.get(c.id) || 0) === 0
    );
    if (deadEnds.length > 0) {
      gaps.push({
        type: "dead_end",
        severity: "nice_to_have",
        description: `${deadEnds.map(d => d.name).join(", ")} receive connections but don't give any. They're passive — give them agency.`,
        suggestion: `Link ${deadEnds[0]?.name} as the source of a relationship (guards, opposes, mentors someone).`,
        toolToUse: "link_creations",
      });
    }
  }

  return gaps;
}

// ── Conflict Generator ───────────────────────────────────────────────

export function generateConflict(sessionId: string): ConflictSeed | null {
  const nodes = getGraphNodes(sessionId);
  const edges = getGraphEdges(sessionId);
  const characters = nodes.filter(n => n.type === "character");

  if (characters.length < 2) return null;

  // Find characters with different elements — natural tension
  const elementGroups = new Map<string, CreationNode[]>();
  characters.forEach(c => {
    const elem = c.element || c.metadata?.primaryElement || "Unknown";
    if (!elementGroups.has(elem)) elementGroups.set(elem, []);
    elementGroups.get(elem)!.push(c);
  });

  const elements = [...elementGroups.keys()];
  if (elements.length < 2) {
    // Same element — create internal conflict
    const chars = characters.slice(0, 2);
    return {
      title: `The Schism of ${chars[0].element || "Power"}`,
      type: "personal",
      aggressors: [chars[0].name],
      defenders: [chars[1].name],
      stakes: `Control over the ${chars[0].element || "fundamental"} paradigm that defines their shared tradition.`,
      rootCause: `Both believe they are the true inheritor of their element's legacy, but their philosophies diverge — ${chars[0].name} seeks preservation while ${chars[1].name} demands evolution.`,
      escalation: [
        "Philosophical disagreement becomes public",
        "Allies are forced to choose sides",
        "A sacred artifact or location becomes contested ground",
        "Violence erupts at a pivotal moment",
        "The conflict threatens to fracture the element itself"
      ],
      possibleResolutions: [
        "One proves the other wrong through sacrifice",
        "A third character reveals both perspectives are incomplete",
        "External threat forces reconciliation",
        "One falls, but their philosophy lives on in a student"
      ],
      moralComplexity: "Both sides have legitimate claims. The audience should struggle to pick a side."
    };
  }

  // Different elements — elemental war
  const elem1 = elements[0];
  const elem2 = elements[elements.length > 2 ? Math.floor(Math.random() * elements.length) : 1];
  const group1 = elementGroups.get(elem1)!;
  const group2 = elementGroups.get(elem2)!;

  const oppositions: Record<string, string> = {
    "Fire": "Water", "Water": "Fire",
    "Earth": "Wind", "Wind": "Earth",
    "Void": "Spirit", "Spirit": "Void"
  };

  const isNaturalOpposition = oppositions[elem1] === elem2;

  return {
    title: isNaturalOpposition
      ? `The ${elem1}-${elem2} War`
      : `The ${group1[0].name} Rebellion`,
    type: isNaturalOpposition ? "elemental" : "political",
    aggressors: group1.map(c => c.name),
    defenders: group2.map(c => c.name),
    stakes: isNaturalOpposition
      ? `The balance of ${elem1} and ${elem2} — if one dominates, the world's fundamental forces become unstable.`
      : `${group1[0].name}'s faction seeks to overthrow the existing order that favors ${elem2} practitioners.`,
    rootCause: isNaturalOpposition
      ? `Ancient enmity between ${elem1} and ${elem2} is reignited when a Gate Resonance Event amplifies both elements beyond safe levels.`
      : `Systemic injustice: ${elem1} practitioners have been marginalized by ${elem2}-dominant institutions for generations.`,
    escalation: [
      "Border incidents and provocations",
      "Diplomatic channels collapse",
      "First blood — an incident neither side planned",
      "Alliances form and the conflict spreads",
      "A weapon or power is unleashed that threatens both sides",
      "The world itself begins to fracture from elemental imbalance"
    ],
    possibleResolutions: [
      "A character who bridges both elements forces a ceasefire",
      "The true enemy (Malachar's influence) is revealed behind the conflict",
      "Mutual destruction becomes so imminent that survival demands peace",
      "A new Gate opens that only combined elements can traverse"
    ],
    moralComplexity: isNaturalOpposition
      ? "Neither element is wrong to exist. The conflict is about coexistence vs dominance."
      : "The rebels have legitimate grievances, but their methods cause suffering. The establishment maintains order but enforces injustice."
  };
}

// ── Narrative Arc Weaver ─────────────────────────────────────────────

export function weaveNarrative(sessionId: string): NarrativeArc | null {
  const nodes = getGraphNodes(sessionId);
  const edges = getGraphEdges(sessionId);
  const characters = nodes.filter(n => n.type === "character");
  const locations = nodes.filter(n => n.type === "location");
  const artifacts = nodes.filter(n => n.type === "artifact");

  if (characters.length < 2) return null;

  // Find the most connected character — likely the protagonist
  const connectionCount = new Map<string, number>();
  edges.forEach(e => {
    connectionCount.set(e.sourceId, (connectionCount.get(e.sourceId) || 0) + 1);
    connectionCount.set(e.targetId, (connectionCount.get(e.targetId) || 0) + 1);
  });

  const sortedChars = [...characters].sort((a, b) =>
    (connectionCount.get(b.id) || 0) - (connectionCount.get(a.id) || 0)
  );

  const protagonist = sortedChars[0];
  const deuteragonist = sortedChars.length > 1 ? sortedChars[1] : null;
  const antagonist = sortedChars.find(c => {
    const meta = JSON.stringify(c.metadata).toLowerCase();
    return meta.includes("dark") || meta.includes("shadow") || meta.includes("enemy") || meta.includes("villain");
  }) || sortedChars[sortedChars.length - 1];

  const protGate = protagonist.gate || protagonist.metadata?.gatesOpen || 1;
  const isOrigin = protGate <= 3;
  const questObject = artifacts[0]?.name || "the lost knowledge of the Ancients";
  const mainLocation = locations[0]?.name || "the Academy";

  const arc: NarrativeArc = isOrigin ? {
    title: `The Awakening of ${protagonist.name}`,
    type: "origin",
    theme: "Discovering power means discovering responsibility",
    stakes: `If ${protagonist.name} fails to master their ${protagonist.element || "elemental"} gift, the imbalance threatens ${mainLocation} and everyone in it.`,
    estimatedChapters: 12,
    acts: [
      {
        act: 1,
        title: "The Spark",
        summary: `${protagonist.name} discovers their ${protagonist.element || "elemental"} affinity under unexpected circumstances. They are brought to ${mainLocation} where they must prove they belong.`,
        involvedCreations: [protagonist.name, mainLocation],
        keyEvent: `${protagonist.name}'s power manifests uncontrollably in a public moment — both a revelation and a crisis.`
      },
      {
        act: 2,
        title: "The Crucible",
        summary: `${protagonist.name} trains under ${deuteragonist?.name || "a reluctant mentor"}, faces rivals, and discovers ${questObject}. But ${antagonist.name} has their own claim to power.`,
        involvedCreations: [protagonist.name, deuteragonist?.name || "mentor", antagonist.name, questObject].filter(Boolean) as string[],
        keyEvent: `${protagonist.name} fails catastrophically — their power turns against them, forcing them to confront what they're really afraid of.`
      },
      {
        act: 3,
        title: "The Gate",
        summary: `${protagonist.name} must face ${antagonist.name} at a Gate trial where the cost of failure isn't death — it's losing the ability to feel their element forever.`,
        involvedCreations: [protagonist.name, antagonist.name],
        keyEvent: `${protagonist.name} opens their next Gate, but the price is something they love. Victory is real, but it doesn't feel like winning.`
      }
    ]
  } : {
    title: `The ${protagonist.metadata?.rank || "Master"}'s Dilemma`,
    type: "transformation",
    theme: "Power without wisdom is a prison",
    stakes: `${protagonist.name} must choose between their power and their purpose — and the wrong choice could shatter the Gate system itself.`,
    estimatedChapters: 16,
    acts: [
      {
        act: 1,
        title: "The Weight",
        summary: `${protagonist.name}, a respected ${protagonist.metadata?.rank || "Master"}, discovers a crack in the Gate system — a vulnerability that ${antagonist.name} is already exploiting.`,
        involvedCreations: [protagonist.name, antagonist.name],
        keyEvent: `A Gate fails for the first time in recorded history. The Guardian attached to it goes silent.`
      },
      {
        act: 2,
        title: "The Descent",
        summary: `Investigating the Gate failure leads ${protagonist.name} into territory where their rank means nothing. Old alliances fracture. ${deuteragonist?.name || "An unlikely ally"} holds a key piece of the puzzle.`,
        involvedCreations: [protagonist.name, deuteragonist?.name || "ally", antagonist.name].filter(Boolean) as string[],
        keyEvent: `${protagonist.name} discovers the Gate system was never what they were taught — it's a seal, not a ladder. What it's sealing is waking up.`
      },
      {
        act: 3,
        title: "The Source",
        summary: `${protagonist.name} must descend to the Source Gate — where Shinkami watches. But ${antagonist.name} is already there, and they're not wrong about everything.`,
        involvedCreations: [protagonist.name, antagonist.name, "Shinkami"],
        keyEvent: `The seal breaks. What emerges isn't a monster — it's a truth. The real enemy was the lie the Gate system was built on.`
      },
      {
        act: 4,
        title: "The New Frequency",
        summary: `${protagonist.name} must rebuild what they destroyed. Not the old system — something better. But it costs them their highest Gate.`,
        involvedCreations: nodes.map(n => n.name),
        keyEvent: `${protagonist.name} closes their own Gate voluntarily — the first time in history a Luminor has chosen to step backward. The world changes.`
      }
    ]
  };

  return arc;
}

// ── World Report ─────────────────────────────────────────────────────

export function generateWorldReport(sessionId: string): WorldReport {
  const nodes = getGraphNodes(sessionId);
  const edges = getGraphEdges(sessionId);
  const gaps = detectGaps(nodes, edges);
  const roles = detectRoles(nodes);
  const balance = analyzeElementalBalance(nodes);
  const summary = getGraphSummary(sessionId);

  // Calculate health score
  let health = 100;
  gaps.forEach(g => {
    if (g.severity === "critical") health -= 25;
    else if (g.severity === "important") health -= 10;
    else health -= 5;
  });
  health = Math.max(0, Math.min(100, health));

  // Strengths
  const strengths: string[] = [];
  if (nodes.length >= 5) strengths.push(`Rich world with ${nodes.length} creations`);
  if (edges.length >= 3) strengths.push(`${edges.length} relationships create narrative density`);
  if (balance.balanced) strengths.push("Elemental balance — your world feels complete");
  if (roles.filled.length >= 5) strengths.push(`${roles.filled.length} narrative roles filled — story-ready`);
  if (roles.filled.includes("villain")) strengths.push("Antagonist present — natural tension exists");
  if (nodes.filter(n => n.type === "artifact").length > 0) strengths.push("Artifacts provide quest hooks and lore depth");
  if (strengths.length === 0) strengths.push("Every world starts somewhere. The first creation is the hardest.");

  // Grade
  const grade = health >= 90 ? "S" : health >= 80 ? "A" : health >= 70 ? "B" : health >= 55 ? "C" : health >= 35 ? "D" : "F";

  // Next actions
  const nextActions = gaps
    .sort((a, b) => {
      const sev = { critical: 0, important: 1, nice_to_have: 2 };
      return sev[a.severity] - sev[b.severity];
    })
    .slice(0, 5)
    .map((g, i) => ({
      priority: i + 1,
      action: g.suggestion,
      tool: g.toolToUse,
    }));

  // World personality
  const typeCount = {
    characters: nodes.filter(n => n.type === "character").length,
    locations: nodes.filter(n => n.type === "location").length,
    creatures: nodes.filter(n => n.type === "creature").length,
    artifacts: nodes.filter(n => n.type === "artifact").length,
  };

  let worldPersonality = "Your world is a blank canvas — everything is possible.";
  if (typeCount.characters > typeCount.locations * 2) worldPersonality = "Character-driven world — rich in personality, light on setting. Consider building the places these people inhabit.";
  else if (typeCount.locations > typeCount.characters * 2) worldPersonality = "Setting-driven world — vivid landscapes awaiting inhabitants. Populate your world with characters who have reasons to be there.";
  else if (typeCount.creatures > typeCount.characters) worldPersonality = "Bestiary-heavy world — an ecosystem teeming with life. Now add the humanoids who navigate this wilderness.";
  else if (typeCount.artifacts > 2 && typeCount.characters > 2) worldPersonality = "Artifact-rich world — history is embedded in objects. Your world has depth and mystery.";

  // Narrative potential
  let narrativePotential = "Not yet story-ready";
  if (roles.filled.includes("hero") && roles.filled.includes("villain")) {
    narrativePotential = "Story-ready: protagonist and antagonist exist. Use weave_narrative to generate a plot.";
  } else if (roles.filled.length >= 3) {
    narrativePotential = "Almost story-ready: multiple roles filled. Add an antagonist to unlock narrative potential.";
  } else if (nodes.length >= 5) {
    narrativePotential = "World is rich but lacks role clarity. Sharpen character motivations.";
  }

  return {
    health,
    grade,
    strengths,
    gaps,
    nextActions,
    narrativePotential,
    worldPersonality,
  };
}

// ── Export helpers for graph access ───────────────────────────────────

export { detectGaps, analyzeElementalBalance, detectRoles };

// Genesis — one sentence becomes a World Bible (a WorldSpec).
// Deterministic offline by default (reproducible, no API key needed); LLM-pluggable for richness.

import { createHash } from "node:crypto";
import { slugify } from "./manifest.mjs";

const STOP = new Set("a an the of in on at to and or but is are was were where when which that this with as by for from into your you".split(" "));
const MOOD_HINTS = [
  [/\b(star|space|galaxy|orbit|cyber|android|mech|quantum|neon)\b/i, "sci-fi"],
  [/\b(blood|haunt|ghost|rot|plague|nightmare|cursed|dread)\b/i, "horror"],
  [/\b(gear|brass|steam|clockwork|airship)\b/i, "steampunk"],
  [/\b(god|myth|titan|olymp|pantheon|divine)\b/i, "mythological"],
  [/\b(void|cosmic|memory|dream|astral|eternal|infinite)\b/i, "cosmic"],
];

function seedInt(s) {
  const d = createHash("sha256").update(s).digest();
  return (d[0] << 24) | (d[1] << 16) | (d[2] << 8) | d[3];
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function keywords(sentence) {
  return [...new Set(sentence.toLowerCase().match(/[a-z]+/g) || [])].filter((w) => w.length > 3 && !STOP.has(w));
}

function paletteFromSeed(s) {
  const d = createHash("sha256").update("palette:" + s).digest();
  const hex = (i) => "#" + d.slice(i, i + 3).toString("hex");
  return [hex(0), hex(3), hex(6), hex(9)];
}

function moodFor(sentence) {
  for (const [re, mood] of MOOD_HINTS) if (re.test(sentence)) return mood;
  return "fantasy";
}

function titleCase(w) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

/** Deterministic World Bible from a sentence. */
export function genesisOffline(sentence, { idSeed } = {}) {
  const kw = keywords(sentence);
  const rng = mulberry32(seedInt(sentence));
  const anchor = kw[0] || "world";
  const second = kw[1] || "myth";
  const name = `The ${titleCase(second)} of ${titleCase(anchor)}`;
  const mood = moodFor(sentence);

  const laws = [
    `${titleCase(anchor)} obeys one rule above all: ${kw[2] || "balance"} cannot be faked.`,
    `Every act of ${kw[1] || "creation"} leaves a mark that cannot be unmade.`,
    `What is given freely grows; what is taken by force decays.`,
  ];

  const characterSeeds = [
    { name: titleCase(anchor) + (rng() > 0.5 ? "a" : "us"), role: "keeper", trait: kw[2] || "watchful" },
    { name: titleCase(second) + (rng() > 0.5 ? "el" : "ir"), role: "wanderer", trait: kw[3] || "restless" },
  ];

  return {
    name,
    idSeed: idSeed || sentence,
    genesisPrompt: sentence,
    tagline: `A ${mood} world born from: "${sentence}".`,
    premise: `In ${name}, ${sentence}. Those who live here have learned to shape their fate around it.`,
    laws,
    mood,
    visualDna: { palette: paletteFromSeed(sentence), style: `${mood} · ${kw.slice(0, 3).join(", ")}`, motifs: kw.slice(0, 4) },
    theme: { audio: "", prompt: `${mood} ambient evoking ${kw.slice(0, 3).join(", ")}` },
    characters: characterSeeds.map((c) => ({
      name: c.name,
      role: c.role,
      persona: `${c.name} is ${c.trait}, a ${c.role} of ${name}.`,
      backstory: `Shaped by the world's first law, ${c.name} carries the memory of how ${anchor} came to be.`,
    })),
    locations: [{ name: `The ${titleCase(anchor)} Reach`, description: `The heart of ${name}, where ${kw[0] || "everything"} began.` }],
    agents: [
      { id: "lore-keeper", harness: "claude", role: "Maintain canon consistency and deepen lore." },
      { id: "cartographer", harness: "gemini", role: "Generate locations and the world map." },
      { id: "composer", harness: "any", role: "Produce the world's soundtrack.", skill: "suno-prompt-architect" },
    ],
  };
}

/**
 * Genesis with optional LLM enrichment.
 * @param {string} sentence
 * @param {{ llm?: (prompt:string)=>Promise<object>, idSeed?:string }} opts
 */
export async function genesis(sentence, opts = {}) {
  const base = genesisOffline(sentence, opts);
  if (!opts.llm) return base;
  try {
    const enriched = await opts.llm(
      `Return JSON matching an Arcanea WorldSpec (name, premise, laws[3], mood, visualDna{palette[],style,motifs[]}, characters[{name,role,persona,backstory}]) for the world seed: "${sentence}".`,
    );
    return { ...base, ...enriched, idSeed: base.idSeed, genesisPrompt: sentence, slug: slugify(enriched?.name || base.name) };
  } catch {
    return base; // never let a flaky model block creation
  }
}

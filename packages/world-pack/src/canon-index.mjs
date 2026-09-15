// Canon index extractor.
//
// CANON_LOCKED.md is the source of truth, not a copy of it. This reads that
// document and derives a machine-checkable index, so the conflict detector can
// never drift from the canon the way a second hardcoded table would.

import { createHash } from "node:crypto";

const STATUS_FROM_MARK = [
  [/LOCKED/i, "locked"],
  [/STAGING/i, "staging"],
  [/EVOLVING/i, "evolving"],
];

function statusOf(text, fallback = "staging") {
  for (const [re, status] of STATUS_FROM_MARK) if (re.test(text)) return status;
  return fallback;
}

function stripCell(cell) {
  return String(cell)
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .trim();
}

// Zero-width, joiner, soft-hyphen and bidi-control characters render as nothing,
// so "Ly\u200Bria" displays as "Lyria". They are removed, never treated as a break.
const INVISIBLE =
  /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u3164\uFFA0]/g;

// Lowercase Cyrillic and Greek letters that are visually interchangeable with a
// Latin letter. A confusable skeleton, not a transliteration: its only job is to
// stop "Lуria" (Cyrillic u) from being a different key than "Lyria".
const CONFUSABLES = new Map(
  Object.entries({
    а: "a",
    б: "b",
    в: "b",
    е: "e",
    ё: "e",
    і: "i",
    ї: "i",
    ј: "j",
    к: "k",
    м: "m",
    н: "h",
    о: "o",
    р: "p",
    с: "c",
    т: "t",
    у: "y",
    х: "x",
    ѕ: "s",
    ԁ: "d",
    ԛ: "q",
    ԝ: "w",
    һ: "h",
    ɡ: "g",
    α: "a",
    β: "b",
    ε: "e",
    η: "n",
    ι: "i",
    κ: "k",
    ν: "v",
    ο: "o",
    ρ: "p",
    τ: "t",
    υ: "u",
    χ: "x",
    γ: "y",
    ω: "w",
  }),
);

/**
 * Case, punctuation, diacritics, width, invisible characters and look-alike
 * letters are not a way around a locked name. "Lyría!", "Ｌｙｒｉａ", "Ly\u200Bria" and
 * "Lуria" all normalize to "lyria".
 */
export function normalizeName(name) {
  const folded = String(name ?? "")
    .normalize("NFKC")
    .replace(INVISIBLE, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  let skeleton = "";
  for (const ch of folded) skeleton += CONFUSABLES.get(ch) ?? ch;
  return skeleton.replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

const ARTICLE = /^(?:an?|the)\s+/i;

/**
 * Turn the document's locked truths into machine-checkable contradiction triggers.
 * Two shapes carry almost all of them:
 *   "<subject> is|are NOT|never <forbidden>"
 *   "<subject> is|are <something>, not <forbidden>"
 * A trigger fires when the subject and the forbidden phrase co-occur in one node's
 * prose without a negation in front of the phrase. This is what makes the same 20
 * rules useful against a creator's own canon, not just Arcanea's.
 */
export function contradictionTriggersFrom(lockedTruths) {
  const triggers = [];
  const add = (subject, forbidden, source) => {
    const phrase = normalizeName(String(forbidden).replace(ARTICLE, ""));
    const subj = normalizeName(subject);
    if (!phrase || !subj || subj.length < 3 || phrase.length < 3) return;
    if (triggers.some((t) => t.subject === subj && t.forbidden === phrase))
      return;
    triggers.push({
      subject: subj,
      subjectLabel: String(subject).trim(),
      forbidden: phrase,
      source,
    });
  };
  for (const truth of lockedTruths) {
    const negated = truth.match(
      /^(.{2,48}?)\s+(?:is|are)\s+(?:NOT|never)\s+([^.;:(),—]{2,60})/i,
    );
    if (negated) add(negated[1], negated[2], truth);
    const contrasted = truth.match(
      /^(.{2,48}?)\s+(?:is|are)\s+[^.;:]{2,80}?,\s*(?:but\s+)?not\s+([^.;:(),—]{2,60})/i,
    );
    if (contrasted) add(contrasted[1], contrasted[2], truth);
  }
  return triggers;
}

const TRUTH_LABEL = /\*\*LOCKED TRUTHS?:\*\*[ \t]*(.*)$/;
const TRUTH_BLOCK_END =
  /^\s*(?:#{1,6}\s|\||-{3,}\s*$|\*{3,}\s*$|_{3,}\s*$|>|\*\*[^*]+:\*\*)/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+(.*)$/;

/**
 * Read every **LOCKED TRUTHS:** block as a block rather than one regex over one
 * layout: an inline truth, any list marker, numbered items, blank lines between
 * items, the continuation lines of a wrapped item, a paragraph under the label,
 * and a document that ends without a newline. A label that yields no truth is
 * returned in `unparsed` so it can be reported; nothing is dropped silently.
 */
export function parseLockedTruths(md) {
  const lines = String(md).split(/\r?\n/);
  const clean = (text) => text.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  const truths = [];
  const unparsed = [];
  for (let i = 0; i < lines.length; i++) {
    const label = lines[i].match(TRUTH_LABEL);
    if (!label) continue;
    const found = clean(label[1]) ? [label[1]] : [];
    let open = null; // the item that still accepts continuation lines
    let j = i + 1;
    for (; j < lines.length; j++) {
      const line = lines[j];
      if (!line.trim()) {
        open = null;
        continue;
      }
      if (TRUTH_BLOCK_END.test(line)) break;
      const item = line.match(LIST_ITEM);
      if (item) {
        found.push(item[1]);
        open = found.length - 1;
      } else if (open !== null) {
        found[open] += ` ${line.trim()}`;
      } else if (found.length === 0) {
        found.push(line);
        open = 0;
      } else {
        break;
      }
    }
    const cleaned = found.map(clean).filter(Boolean);
    if (cleaned.length) truths.push(...cleaned);
    else
      unparsed.push({
        line: i + 1,
        text: lines
          .slice(i, Math.min(j, i + 4))
          .join("\n")
          .trim(),
      });
    i = j - 1;
  }
  return { truths, unparsed };
}

/** Parse every pipe table in the document into { header:[], rows:[[]] }. */
export function parseTables(md) {
  const lines = md.split(/\r?\n/);
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1] || "";
    const isHeader = /^\s*\|.*\|\s*$/.test(line);
    const isRule = /^\s*\|[\s:|-]+\|\s*$/.test(next);
    if (isHeader && isRule) {
      const header = line.split("|").slice(1, -1).map(stripCell);
      const rows = [];
      i += 2;
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        rows.push(lines[i].split("|").slice(1, -1).map(stripCell));
        i += 1;
      }
      tables.push({ header, rows });
      continue;
    }
    i += 1;
  }
  return tables;
}

function findTable(tables, ...required) {
  return tables.find((t) =>
    required.every((h) =>
      t.header.some((c) => c.toLowerCase() === h.toLowerCase()),
    ),
  );
}

function col(table, name) {
  return table.header.findIndex((c) => c.toLowerCase() === name.toLowerCase());
}

/**
 * Build the canon index from the raw CANON_LOCKED.md text.
 * @param {string} md
 * @returns {CanonIndex}
 */
export function buildCanonIndex(md) {
  const tables = parseTables(md);
  const names = new Map(); // lowercased name -> { name, kind, status, note }
  // `attributes` is what canon itself says about the entry; a canon-layer node
  // claiming the entry must agree with it field for field.
  const register = (name, kind, status, note, attributes) => {
    const key = String(name).toLowerCase();
    if (!name || names.has(key)) return;
    names.set(key, { name, kind, status, note, attributes });
  };

  // Primordial duality
  const duality = findTable(tables, "Entity", "Aspect", "Nature");
  const primordials = [];
  if (duality) {
    const ie = col(duality, "Entity");
    for (const r of duality.rows) {
      primordials.push({
        name: r[ie],
        aspect: r[col(duality, "Aspect")],
        nature: r[col(duality, "Nature")],
      });
      register(r[ie], "primordial", "locked");
    }
  }

  // Elements
  const elementsT = findTable(tables, "Element", "Domain", "Color");
  const elements = [];
  if (elementsT) {
    for (const r of elementsT.rows) {
      // "Void/Spirit" is one canon row covering two element names.
      const raw = r[col(elementsT, "Element")];
      for (const part of raw.split("/")) {
        elements.push(part.trim());
        register(part.trim(), "element", "locked");
      }
    }
  }

  // Ten Gates
  const gatesT = findTable(tables, "Gate", "Frequency", "Godbeast");
  const gates = [];
  if (gatesT) {
    const iGate = col(gatesT, "Gate");
    const iFreq = col(gatesT, "Frequency");
    const iGod = gatesT.header.findIndex((c) => /god\/goddess/i.test(c));
    const iBeast = col(gatesT, "Godbeast");
    const iDomain = col(gatesT, "Domain");
    gatesT.rows.forEach((r, idx) => {
      const gate = {
        index: idx + 1,
        name: r[iGate],
        frequencyHz: Number(String(r[iFreq]).replace(/[^\d.]/g, "")),
        god: r[iGod],
        godbeast: r[iBeast],
        domain: r[iDomain],
      };
      gates.push(gate);
      register(gate.name, "gate", "locked", undefined, {
        gate: gate.index,
        frequencyHz: gate.frequencyHz,
        guardian: gate.god,
        godbeast: gate.godbeast,
      });
      register(gate.god, "god", "locked", `Gate ${gate.index}`, {
        gate: gate.index,
        frequencyHz: gate.frequencyHz,
        godbeast: gate.godbeast,
      });
      register(gate.godbeast, "godbeast", "locked", `bonded to ${gate.god}`, {
        gate: gate.index,
        guardian: gate.god,
      });
    });
  }

  // Magic ranks
  const ranksT = findTable(tables, "Gates Open", "Rank");
  const ranks = [];
  if (ranksT) {
    for (const r of ranksT.rows) {
      const span = r[col(ranksT, "Gates Open")];
      const [min, max] = span.split("-").map((n) => Number(n.trim()));
      const rank = {
        rank: r[col(ranksT, "Rank")],
        minGates: min,
        maxGates: Number.isFinite(max) ? max : min,
      };
      ranks.push(rank);
      register(rank.rank, "rank", "locked");
    }
  }

  // Seven Wisdoms
  const wisdomsT = findTable(tables, "Wisdom", "Archive", "Element");
  const wisdoms = [];
  if (wisdomsT) {
    for (const r of wisdomsT.rows) {
      const w = {
        name: r[col(wisdomsT, "Wisdom")],
        archive: r[col(wisdomsT, "Archive")],
        element: r[col(wisdomsT, "Element")],
      };
      wisdoms.push(w);
      register(w.name, "wisdom", "locked");
    }
  }

  // Seven Academy Houses — a numbered list, not a table.
  const houses = [];
  for (const m of md.matchAll(/^\d+\.\s+\*\*House ([A-Za-z]+)\*\*/gm)) {
    houses.push(m[1]);
    register(`House ${m[1]}`, "house", "locked");
  }

  // Eight Origin Classes (closed set, staging)
  const originT = findTable(tables, "Origin Class", "Power Source");
  const originClasses = [];
  if (originT) {
    const iName = col(originT, "Origin Class");
    const iStatus = col(originT, "Status");
    for (const r of originT.rows) {
      const name = r[iName].replace(/\s*\(.*\)\s*$/, "");
      const status = iStatus >= 0 ? statusOf(r[iStatus]) : "staging";
      originClasses.push({
        name,
        status,
        powerSource: r[col(originT, "Power Source")],
      });
      register(name, "origin-class", status);
    }
  }

  // Terminology ledger
  const termsT = findTable(tables, "Term", "Definition", "Status");
  const terms = [];
  if (termsT) {
    const iTerm = col(termsT, "Term");
    const iStatus = col(termsT, "Status");
    for (const r of termsT.rows) {
      const t = {
        term: r[iTerm],
        status: statusOf(r[iStatus]),
        definition: r[col(termsT, "Definition")],
      };
      terms.push(t);
      register(t.term, "term", t.status, t.definition);
    }
  }

  // The Dark Lord — a locked ### heading inside a (LOCKED ✅) tier.
  for (const m of md.matchAll(
    /^##\s+TIER[^\n]*\(LOCKED[^\n]*\)\s*\n([\s\S]*?)(?=\n##\s|\n---\s*\n##|$)/gm,
  )) {
    for (const h of m[1].matchAll(/^###\s+([A-Z][A-Za-z'’ -]+)\s*$/gm)) {
      register(h[1].trim(), "figure", "locked");
    }
  }

  // Locked truths — the assertions a generated draft is most likely to violate.
  const { truths: lockedTruths, unparsed: unparsedTruthBlocks } =
    parseLockedTruths(md);

  // The universe this document governs, taken from its own title ("# ARCANEA
  // CANON — ..."). A canon-layer node is only canon if it resolves here, so the
  // universe node has to be in the registry like everything else.
  const titled =
    md.match(/^#\s+([A-Za-z][A-Za-z' -]{1,40}?)\s+CANON\b/im) ||
    md.match(/^#\s+([A-Za-z][A-Za-z' -]{1,40})\s*$/m);
  const universeName = titled ? titleCase(titled[1].trim()) : null;
  if (universeName)
    register(
      universeName,
      "universe",
      "locked",
      "the universe this canon governs",
    );

  const sourceHash = `sha256:${createHash("sha256").update(md).digest("hex")}`;
  const entries = [...names.values()];
  const namesNormalized = {};
  for (const entry of entries) {
    const key = normalizeName(entry.name);
    if (key && !namesNormalized[key]) namesNormalized[key] = entry;
  }

  return {
    format: "ArcaneaCanonIndex.v1",
    sourceHash,
    universeName,
    /** The owner id a canon-layer node must carry to be attested. */
    canonOwner: universeName
      ? normalizeName(universeName).replace(/\s+/g, "-")
      : null,
    profile: universeName === "Arcanea" ? "arcanea" : "custom",
    extractedAt: null, // callers stamp this; keeping it null keeps the index hashable
    primordials,
    elements,
    gates,
    ranks,
    wisdoms,
    houses,
    originClasses,
    terms,
    lockedTruths,
    unparsedTruthBlocks,
    contradictionTriggers: contradictionTriggersFrom(lockedTruths),
    names: Object.fromEntries(names),
    namesNormalized,
  };
}

function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Convenience: read the canon document off disk and index it. */
export async function loadCanonIndex(path) {
  const { readFile } = await import("node:fs/promises");
  return buildCanonIndex(await readFile(path, "utf8"));
}

/** Look up a canon name, case-insensitively. */
export function canonName(index, name) {
  if (!name) return null;
  const direct = index.names[String(name).toLowerCase()];
  if (direct) return direct;
  const norm = normalizeName(name);
  return (norm && index.namesNormalized?.[norm]) || null;
}

/**
 * Looser lookup: does this string *contain* a canon name as a whole token run?
 * "Lyria the Radiant" is a locked name with a hat on, and the exact-key detector
 * walked straight past it.
 * @returns {null | {entry:object, match:"exact"|"contains", canonName:string}}
 */
export function canonNameLoose(index, candidate) {
  const norm = normalizeName(candidate);
  if (!norm) return null;
  const exact = index.namesNormalized?.[norm];
  if (exact) return { entry: exact, match: "exact", canonName: exact.name };
  const tokens = norm.split(" ");
  const byFirstToken = looseIndex(index);
  for (let i = 0; i < tokens.length; i++) {
    for (const { run, entry } of byFirstToken.get(tokens[i]) ?? []) {
      if (
        i + run.length <= tokens.length &&
        run.every((t, j) => t === tokens[i + j])
      )
        return { entry, match: "contains", canonName: entry.name };
    }
  }
  return null;
}

const LOOSE_INDEX = new WeakMap();

// Canon names grouped by their first token, built once per index. A lookup then
// costs the candidate's own tokens, not every name in canon: scanning all names
// per node was nodes x terms and let a large canon stall the checker.
function looseIndex(index) {
  let byFirstToken = LOOSE_INDEX.get(index);
  if (byFirstToken) return byFirstToken;
  byFirstToken = new Map();
  for (const [key, entry] of Object.entries(index.namesNormalized || {})) {
    if (key.length < 4) continue; // three-letter canon names would swallow ordinary prose
    const run = key.split(" ");
    const bucket = byFirstToken.get(run[0]);
    if (bucket) bucket.push({ run, entry });
    else byFirstToken.set(run[0], [{ run, entry }]);
  }
  LOOSE_INDEX.set(index, byFirstToken);
  return byFirstToken;
}

/** Entity types that can legitimately BE a canon entry of each kind. */
const KIND_TYPES = Object.freeze({
  universe: ["Universe"],
  primordial: ["Character"],
  god: ["Character"],
  figure: ["Character"],
  godbeast: ["Creature"],
  house: ["Faction"],
  gate: ["Law", "Location", "Power"],
  element: ["Power", "Law"],
  rank: ["Law"],
  wisdom: ["Law", "Power"],
  "origin-class": ["Law", "Faction"],
  term: ["Law", "Power", "Object", "Event", "Location", "Faction", "Creature"],
});

/** Names a node offers for itself. An alias of a locked name is still that name. */
export function nameCandidates(node) {
  const attrs = node?.attributes || {};
  const raw = [
    node?.name,
    ...(Array.isArray(attrs.aliases) ? attrs.aliases : []),
    ...(Array.isArray(attrs.alsoKnownAs) ? attrs.alsoKnownAs : []),
    attrs.alias,
    attrs.trueName,
  ];
  return raw.filter((n) => typeof n === "string" && n.trim().length > 0);
}

/**
 * The layer a node ACTUALLY has, as opposed to the one it declares.
 *
 * `layer:"canon"` is not self-declarable. Canon identity is rebuilt from the
 * canon document and compared field by field: the node's NAME must resolve to a
 * LOCKED entry (an id is a label the pack chose, never evidence), its type must be
 * one that entry can be, every attribute canon fixes must agree, no alias may be
 * a different canon name, and the owner must be the canon owner. Any mismatch
 * demotes the node and is reported.
 *
 * @returns {{layer:string, declared:string, attested:boolean, entry:object|null, reason:string|null, problems:string[]}}
 */
export function deriveLayer(index, node) {
  const declared = node?.layer ?? null;
  if (declared !== "canon")
    return {
      layer: declared,
      declared,
      attested: false,
      entry: null,
      reason: null,
      problems: [],
    };

  const entry = canonName(index, node?.name);
  const problems = [];
  if (!entry) {
    problems.push(
      `'${node?.name}' does not resolve in the canon index for ${index?.universeName ?? "this canon"}`,
    );
  } else {
    if (entry.status !== "locked")
      problems.push(`'${entry.name}' is ${entry.status} in canon, not locked`);
    const types = KIND_TYPES[entry.kind];
    if (types && !types.includes(node?.type))
      problems.push(
        `'${entry.name}' is a canon ${entry.kind}; a ${node?.type} node cannot be it (expected ${types.join(" or ")})`,
      );
    for (const [key, expected] of Object.entries(entry.attributes || {})) {
      const actual = node?.attributes?.[key];
      if (actual != null && String(actual) !== String(expected))
        problems.push(
          `attributes.${key} is '${actual}', canon says '${expected}'`,
        );
    }
    for (const alias of nameCandidates(node)) {
      if (alias === node.name) continue;
      const hit = canonNameLoose(index, alias);
      if (hit && hit.entry !== entry)
        problems.push(
          `alias '${alias}' is the canon name '${hit.entry.name}', not '${entry.name}'`,
        );
    }
  }
  const owner = node?.governance?.owner ?? null;
  const ownerOk =
    Boolean(index?.canonOwner) &&
    normalizeName(owner) === normalizeName(index.canonOwner);
  if (!ownerOk)
    problems.push(
      `owner '${owner ?? "(none)"}' is not the canon owner '${index?.canonOwner}'`,
    );

  if (!problems.length)
    return {
      layer: "canon",
      declared,
      attested: true,
      entry,
      reason: null,
      problems,
    };
  return {
    layer: "user",
    declared,
    attested: false,
    entry,
    reason: problems.join("; "),
    problems,
  };
}

const NEGATORS = new Set([
  "not",
  "never",
  "no",
  "nor",
  "neither",
  "isnt",
  "arent",
  "wasnt",
  "werent",
  "cannot",
  "cant",
]);
const PRONOUNS = new Set([
  "he",
  "she",
  "they",
  "it",
  "him",
  "her",
  "them",
  "his",
  "their",
  "its",
]);
const COPULAS = new Set([
  "is",
  "are",
  "was",
  "were",
  "am",
  "be",
  "been",
  "being",
]);

function runIndexes(tokens, run) {
  const at = [];
  for (let i = 0; i + run.length <= tokens.length; i++)
    if (run.every((t, j) => t === tokens[i + j])) at.push(i);
  return at;
}

/** Free text as sentences of normalized tokens, split before punctuation is stripped. */
export function sentencesOf(prose) {
  return String(prose ?? "")
    .split(/(?<=[.!?;])\s+|\n+/)
    .map((sentence) => normalizeName(sentence))
    .filter(Boolean)
    .map((sentence) => sentence.split(" "));
}

// A negator up to three tokens before the phrase negates it, and only inside the
// phrase's own sentence. "rather than" negates; "rather" on its own does not.
function negatedAt(tokens, at) {
  for (let k = Math.max(0, at - 3); k < at; k++) {
    if (NEGATORS.has(tokens[k])) return true;
    if (tokens[k] === "rather" && tokens[k + 1] === "than") return true;
  }
  return false;
}

// A sentence speaks about the subject if it names the subject or names no one
// else: a pronoun opener ("He is evil.") or a verbless fragment ("Purely evil.").
function aboutSubject(tokens, subject) {
  return (
    runIndexes(tokens, subject).length > 0 ||
    PRONOUNS.has(tokens[0]) ||
    !tokens.some((t) => COPULAS.has(t))
  );
}

/**
 * Which locked truths does this prose contradict?
 *
 * A trigger fires when the node's prose names the subject and some sentence about
 * that subject asserts the forbidden phrase without a negation in that same
 * sentence. "Nero is not evil." restates canon; "Malachar is not kind. Purely
 * evil." breaks it, because the first sentence's "not" does not reach the second.
 * Derived from the document, so the same machinery works against any canon.
 */
export function contradictionsIn(prose, triggers) {
  const sentences = sentencesOf(prose);
  if (!sentences.length) return [];
  const hits = [];
  for (const t of triggers || []) {
    const subject = t.subject.split(" ");
    if (!sentences.some((s) => runIndexes(s, subject).length)) continue;
    const forbidden = t.forbidden.split(" ");
    const asserted = sentences.some(
      (s) =>
        aboutSubject(s, subject) &&
        runIndexes(s, forbidden).some((at) => !negatedAt(s, at)),
    );
    if (asserted) hits.push(t);
  }
  return hits;
}

/** The rank a character with `gatesOpen` gates must hold, per the canon table. */
export function rankForGates(index, gatesOpen) {
  const hit = index.ranks.find(
    (r) => gatesOpen >= r.minGates && gatesOpen <= r.maxGates,
  );
  return hit ? hit.rank : null;
}

export function gateByIndex(index, n) {
  return index.gates.find((g) => g.index === n) || null;
}

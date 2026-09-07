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

/**
 * Case, punctuation and diacritics are not a way around a locked name.
 * "Lyría!" and "lyria" normalize to the same key.
 */
export function normalizeName(name) {
  return String(name ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
    if (triggers.some((t) => t.subject === subj && t.forbidden === phrase)) return;
    triggers.push({ subject: subj, subjectLabel: String(subject).trim(), forbidden: phrase, source });
  };
  for (const truth of lockedTruths) {
    const negated = truth.match(/^(.{2,48}?)\s+(?:is|are)\s+(?:NOT|never)\s+([^.;:()]{2,60})/i);
    if (negated) add(negated[1], negated[2], truth);
    const contrasted = truth.match(/^(.{2,48}?)\s+(?:is|are)\s+[^.;:]{2,80}?,\s*(?:but\s+)?not\s+([^.;:()]{2,60})/i);
    if (contrasted) add(contrasted[1], contrasted[2], truth);
  }
  return triggers;
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
  return tables.find((t) => required.every((h) => t.header.some((c) => c.toLowerCase() === h.toLowerCase())));
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
  const register = (name, kind, status, note) => {
    const key = String(name).toLowerCase();
    if (!name || names.has(key)) return;
    names.set(key, { name, kind, status, note });
  };

  // Primordial duality
  const duality = findTable(tables, "Entity", "Aspect", "Nature");
  const primordials = [];
  if (duality) {
    const ie = col(duality, "Entity");
    for (const r of duality.rows) {
      primordials.push({ name: r[ie], aspect: r[col(duality, "Aspect")], nature: r[col(duality, "Nature")] });
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
      register(gate.name, "gate", "locked");
      register(gate.god, "god", "locked", `Gate ${gate.index}`);
      register(gate.godbeast, "godbeast", "locked", `bonded to ${gate.god}`);
    });
  }

  // Magic ranks
  const ranksT = findTable(tables, "Gates Open", "Rank");
  const ranks = [];
  if (ranksT) {
    for (const r of ranksT.rows) {
      const span = r[col(ranksT, "Gates Open")];
      const [min, max] = span.split("-").map((n) => Number(n.trim()));
      const rank = { rank: r[col(ranksT, "Rank")], minGates: min, maxGates: Number.isFinite(max) ? max : min };
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
      originClasses.push({ name, status, powerSource: r[col(originT, "Power Source")] });
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
      const t = { term: r[iTerm], status: statusOf(r[iStatus]), definition: r[col(termsT, "Definition")] };
      terms.push(t);
      register(t.term, "term", t.status, t.definition);
    }
  }

  // The Dark Lord — a locked ### heading inside a (LOCKED ✅) tier.
  for (const m of md.matchAll(/^##\s+TIER[^\n]*\(LOCKED[^\n]*\)\s*\n([\s\S]*?)(?=\n##\s|\n---\s*\n##|$)/gm)) {
    for (const h of m[1].matchAll(/^###\s+([A-Z][A-Za-z'’ -]+)\s*$/gm)) {
      register(h[1].trim(), "figure", "locked");
    }
  }

  // Locked truths — the assertions a generated draft is most likely to violate.
  const lockedTruths = [];
  for (const m of md.matchAll(/\*\*LOCKED TRUTHS?:\*\*[ \t]*([^\n]*)\n((?:[ \t]*-[ \t]+[^\n]*\n)*)/g)) {
    const inline = m[1].trim();
    if (inline) lockedTruths.push(inline.replace(/\*\*/g, ""));
    for (const b of m[2].matchAll(/^\s*-\s+(.*)$/gm)) lockedTruths.push(b[1].replace(/\*\*/g, "").trim());
  }

  // The universe this document governs, taken from its own title ("# ARCANEA
  // CANON — ..."). A canon-layer node is only canon if it resolves here, so the
  // universe node has to be in the registry like everything else.
  const titled = md.match(/^#\s+([A-Za-z][A-Za-z' -]{1,40}?)\s+CANON\b/im) || md.match(/^#\s+([A-Za-z][A-Za-z' -]{1,40})\s*$/m);
  const universeName = titled ? titleCase(titled[1].trim()) : null;
  if (universeName) register(universeName, "universe", "locked", "the universe this canon governs");

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
    canonOwner: universeName ? normalizeName(universeName).replace(/\s+/g, "-") : null,
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
  for (const [key, entry] of Object.entries(index.namesNormalized || {})) {
    if (key.length < 4) continue; // three-letter canon names would swallow ordinary prose
    const kt = key.split(" ");
    for (let i = 0; i + kt.length <= tokens.length; i++) {
      if (kt.every((t, j) => t === tokens[i + j])) return { entry, match: "contains", canonName: entry.name };
    }
  }
  return null;
}

/**
 * The layer a node ACTUALLY has, as opposed to the one it declares.
 *
 * `layer:"canon"` is not self-declarable. A node is canon only if its name (or
 * id) resolves to a LOCKED entry in the index built from the canon document, and
 * it is owned by that document's owner. Anything else claiming canon is treated
 * as the ordinary user claim it is — and reported.
 *
 * @returns {{layer:string, declared:string, attested:boolean, entry:object|null, reason:string|null}}
 */
export function deriveLayer(index, node) {
  const declared = node?.layer ?? null;
  if (declared !== "canon") return { layer: declared, declared, attested: false, entry: null, reason: null };

  const entry = canonName(index, node?.name) || canonName(index, node?.id);
  const owner = node?.governance?.owner ?? null;
  const ownerOk = Boolean(index?.canonOwner) && normalizeName(owner) === normalizeName(index.canonOwner);
  if (entry && entry.status === "locked" && ownerOk) return { layer: "canon", declared, attested: true, entry, reason: null };

  const reason = !entry
    ? `'${node?.name}' does not resolve in the canon index for ${index?.universeName ?? "this canon"}`
    : entry.status !== "locked"
      ? `'${entry.name}' is ${entry.status} in canon, not locked`
      : `owner '${owner ?? "(none)"}' is not the canon owner '${index.canonOwner}'`;
  return { layer: "user", declared, attested: false, entry, reason };
}

const NEGATORS = new Set(["not", "never", "no", "nor", "isnt", "arent", "wasnt", "werent", "cannot", "cant", "rather"]);

function runIndexes(tokens, run) {
  const at = [];
  for (let i = 0; i + run.length <= tokens.length; i++) if (run.every((t, j) => t === tokens[i + j])) at.push(i);
  return at;
}

/**
 * Which locked truths does this prose contradict?
 *
 * A trigger fires when the subject and the forbidden phrase co-occur and the
 * phrase is not itself negated — "Nero is not evil" restates canon rather than
 * breaking it. Derived from the document, so the same machinery works against a
 * creator's own canon.
 */
export function contradictionsIn(prose, triggers) {
  const norm = normalizeName(prose);
  if (!norm) return [];
  const tokens = norm.split(" ");
  const hits = [];
  for (const t of triggers || []) {
    if (!runIndexes(tokens, t.subject.split(" ")).length) continue;
    const asserted = runIndexes(tokens, t.forbidden.split(" ")).some(
      (at) => !NEGATORS.has(tokens[at - 1]) && !NEGATORS.has(tokens[at - 2]),
    );
    if (asserted) hits.push(t);
  }
  return hits;
}

/** The rank a character with `gatesOpen` gates must hold, per the canon table. */
export function rankForGates(index, gatesOpen) {
  const hit = index.ranks.find((r) => gatesOpen >= r.minGates && gatesOpen <= r.maxGates);
  return hit ? hit.rank : null;
}

export function gateByIndex(index, n) {
  return index.gates.find((g) => g.index === n) || null;
}

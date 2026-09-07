// Branching, diffing, and merging a world pack.
//
// Canon is protected structurally: a non-canon branch can never overwrite a
// canon-layer node. That is a merge conflict, not a silent last-write-wins.

import { deterministicId, packDigest } from "./pack.mjs";
import { deriveLayer } from "./canon-index.mjs";

function byId(list) {
  return new Map((list || []).map((n) => [n.id, n]));
}

function fieldPaths(node) {
  const out = {};
  const walk = (value, path) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const k of Object.keys(value)) walk(value[k], path ? `${path}.${k}` : k);
    } else {
      out[path] = value;
    }
  };
  walk(node, "");
  return out;
}

/**
 * Structural diff between two packs.
 * @returns {{added:Array, removed:Array, changed:Array<{id:string, type:string, fields:Array}>}}
 */
export function diffPacks(base, head) {
  const a = byId(base.nodes);
  const b = byId(head.nodes);
  const added = [...b.values()].filter((n) => !a.has(n.id));
  const removed = [...a.values()].filter((n) => !b.has(n.id));
  const changed = [];
  for (const [id, before] of a) {
    const after = b.get(id);
    if (!after) continue;
    const fa = fieldPaths(before);
    const fb = fieldPaths(after);
    const paths = new Set([...Object.keys(fa), ...Object.keys(fb)]);
    const fields = [];
    for (const p of paths) {
      if (JSON.stringify(fa[p]) !== JSON.stringify(fb[p])) fields.push({ path: p, base: fa[p] ?? null, head: fb[p] ?? null });
    }
    if (fields.length) changed.push({ id, type: after.type, name: after.name, fields });
  }
  return { added, removed, changed };
}

/** Open a branch off a pack's current head. Nodes are not copied; the branch is a pointer. */
export function branchPack(pack, { name, from = "main", owner, at = "1970-01-01T00:00:00.000Z" }) {
  const parent = pack.branches.find((b) => b.id === from);
  if (!parent) throw new Error(`no such branch: ${from}`);
  const id = name;
  if (pack.branches.some((b) => b.id === id)) throw new Error(`branch already exists: ${id}`);
  return {
    ...pack,
    branches: [
      ...pack.branches,
      { id, type: "Branch", name, parent: from, head: parent.head, owner, createdAt: at, forkedFrom: parent.head },
    ],
  };
}

/**
 * Three-way merge of `theirs` into `ours`, against their common `ancestor`.
 *
 * Conflicts (never auto-resolved):
 *  - merge.canon-protected  — a non-canon edit touching a canon-layer node
 *  - merge.divergent-field  — both sides changed the same field differently
 *  - merge.delete-vs-edit   — one side removed a node the other edited
 */
export function mergeBranch(ancestor, ours, theirs, { by, at = "1970-01-01T00:00:00.000Z", intoBranch = "main", canon = null } = {}) {
  const base = byId(ancestor.nodes);
  const a = byId(ours.nodes);
  const b = byId(theirs.nodes);
  const conflicts = [];
  const merged = new Map(a);

  for (const [id, theirNode] of b) {
    const baseNode = base.get(id);
    const ourNode = a.get(id);

    if (!ourNode && !baseNode) {
      merged.set(id, theirNode); // new on their side
      continue;
    }

    if (!ourNode && baseNode) {
      conflicts.push({
        ruleId: "merge.delete-vs-edit",
        nodeId: id,
        message: `'${theirNode.name}' was removed on the target branch but edited on the incoming branch`,
      });
      continue;
    }

    if (JSON.stringify(ourNode) === JSON.stringify(theirNode)) continue;

    // Protection is decided by what the TARGET node is, never by what the
    // incoming node says it is. An attacker who keeps `layer:"canon"` on their
    // edit was previously waved through by the old `theirNode.layer !== "canon"`
    // guard — the one shape the refusal test never modelled.
    const target = canon ? deriveLayer(canon, ourNode) : null;
    if (ourNode.layer === "canon" || target?.attested) {
      conflicts.push({
        ruleId: "merge.canon-protected",
        nodeId: id,
        message: `'${ourNode.name}' is canon-layer; a ${theirNode.layer} branch cannot rewrite it`,
        attested: target ? target.attested : null,
      });
      continue;
    }

    const fBase = baseNode ? fieldPaths(baseNode) : {};
    const fOurs = fieldPaths(ourNode);
    const fTheirs = fieldPaths(theirNode);
    const next = JSON.parse(JSON.stringify(ourNode));
    let blocked = false;

    for (const path of new Set([...Object.keys(fOurs), ...Object.keys(fTheirs)])) {
      const bv = JSON.stringify(fBase[path]);
      const ov = JSON.stringify(fOurs[path]);
      const tv = JSON.stringify(fTheirs[path]);
      if (tv === ov) continue;
      if (ov === bv) {
        setPath(next, path, fTheirs[path]); // only they changed it
      } else if (tv !== bv) {
        blocked = true;
        conflicts.push({
          ruleId: "merge.divergent-field",
          nodeId: id,
          path,
          ours: fOurs[path] ?? null,
          theirs: fTheirs[path] ?? null,
          message: `both branches changed ${id}.${path}`,
        });
      }
    }
    if (!blocked) merged.set(id, next);
  }

  const relIds = new Set(ours.relationships.map((r) => r.id));
  const relationships = [...ours.relationships, ...theirs.relationships.filter((r) => !relIds.has(r.id))];

  // A merge inherits the incoming branch's history, or every node stamped with
  // that branch and its versions would point at ledgers the merged pack lacks.
  const union = (mine, other) => {
    const seen = new Set((mine || []).map((x) => x.id));
    return [...(mine || []), ...(other || []).filter((x) => !seen.has(x.id))];
  };
  const mergedPack = {
    ...ours,
    nodes: [...merged.values()],
    relationships,
    branches: union(ours.branches, theirs.branches),
    versions: union(ours.versions, theirs.versions),
    sources: union(ours.sources, theirs.sources),
  };
  if (conflicts.length) return { merged: null, conflicts, pack: ours };

  const versionId = deterministicId("ver", `${ours.world.id}:merge:${ours.versions.length + 1}`);
  const oursHead = ours.branches.find((br) => br.id === intoBranch)?.head ?? null;
  const theirsHead = theirs.branches.find((br) => br.id !== intoBranch)?.head ?? null;
  const withVersion = {
    ...mergedPack,
    versions: [
      ...mergedPack.versions,
      {
        id: versionId,
        type: "Version",
        branch: intoBranch,
        parents: [oursHead, theirsHead].filter(Boolean),
        createdAt: at,
        createdBy: by,
        message: `merge into ${intoBranch}`,
        digest: packDigest(mergedPack),
      },
    ],
    branches: mergedPack.branches.map((br) => (br.id === intoBranch ? { ...br, head: versionId } : br)),
  };
  return { merged: withVersion, conflicts: [], pack: withVersion };
}

function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

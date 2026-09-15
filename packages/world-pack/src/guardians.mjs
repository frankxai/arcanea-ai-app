// Guardians as AgentRole records.
//
// The Guardians are the Gods in their role as Gate-keepers (CANON_LOCKED, Tier 2).
// Here that role is a typed authority record, not decoration: each one has scopes,
// a deterministic decision policy over conflict findings, and eval cases that fail
// loudly if the policy drifts.
//
// No Guardian can lock canon. Only the Creator can (CANON_LOCKED, "HOW TO MODIFY
// CANON"). Shinkami's ceiling is escalation.

export const SCOPES = Object.freeze([
  "canon:read",
  "canon:propose",
  "canon:approve-staging",
  "canon:escalate-to-creator",
  "world:read",
  "world:write",
  "rights:assign",
  "pack:export",
  "pack:merge",
]);

const BASE = ["canon:read", "world:read"];

/**
 * Rule families each Guardian is answerable for. A Guardian may waive a finding
 * only if the rule is in its `owns` list and the severity is at or below its
 * `maxWaivableSeverity`.
 */
const SEVERITY_ORDER = { info: 0, warning: 1, error: 2, blocker: 3 };

/** @type {ReadonlyArray<AgentRole>} */
export const GUARDIAN_ROLES = Object.freeze([
  {
    id: "guardian.lyssandria",
    type: "AgentRole",
    name: "Lyssandria",
    gate: 1,
    frequencyHz: 174,
    role: "Guardian of Foundation",
    charter: "Structure and survivability of a world: does it hold together as a graph?",
    authority: {
      scopes: [...BASE, "world:write", "pack:merge"],
      owns: [
        "graph.dangling-relationship",
        "provenance.dangling-source",
        "provenance.dangling-version",
        "provenance.dangling-branch",
        "provenance.missing-owner",
        "provenance.unknown-agent-role",
      ],
      maxWaivableSeverity: "warning",
    },
  },
  {
    id: "guardian.leyla",
    type: "AgentRole",
    name: "Leyla",
    gate: 2,
    frequencyHz: 285,
    role: "Guardian of Flow",
    charter: "Generation and revision: drafts move, nothing stalls at draft forever.",
    authority: { scopes: [...BASE, "world:write", "canon:propose"], owns: ["status.illegal-for-layer"], maxWaivableSeverity: "warning" },
  },
  {
    id: "guardian.draconia",
    type: "AgentRole",
    name: "Draconia",
    gate: 3,
    frequencyHz: 396,
    role: "Guardian of Fire",
    charter: "Power systems: gates, ranks, and what a character can actually do.",
    authority: {
      scopes: [...BASE, "world:write"],
      owns: ["canon.rank-out-of-band", "canon.rank-unknown", "canon.element-unknown", "canon.frequency-unknown"],
      maxWaivableSeverity: "warning",
    },
  },
  {
    id: "guardian.maylinn",
    type: "AgentRole",
    name: "Maylinn",
    gate: 4,
    frequencyHz: 417,
    role: "Guardian of Heart",
    charter: "Characters and the people they are; sensitivity protocol for Mirror Realms.",
    authority: { scopes: [...BASE, "world:write"], owns: ["canon.house-unknown"], maxWaivableSeverity: "warning" },
  },
  {
    id: "guardian.alera",
    type: "AgentRole",
    name: "Alera",
    gate: 5,
    frequencyHz: 528,
    role: "Guardian of Voice",
    charter: "Truth of statement. Locked truths are not negotiable; nothing that contradicts one passes.",
    authority: {
      scopes: [...BASE, "canon:propose"],
      owns: ["canon.nero-miscast", "canon.luminor-as-species", "canon.locked-truth-contradiction", "canon.staging-cited-as-locked"],
      maxWaivableSeverity: "info",
    },
  },
  {
    id: "guardian.lyria",
    type: "AgentRole",
    name: "Lyria",
    gate: 6,
    frequencyHz: 639,
    role: "Guardian of Sight",
    charter: "Detection: runs the conflict pass and reports what it sees, waives nothing.",
    authority: { scopes: [...BASE], owns: [], maxWaivableSeverity: "info" },
  },
  {
    id: "guardian.aiyami",
    type: "AgentRole",
    name: "Aiyami",
    gate: 7,
    frequencyHz: 741,
    role: "Guardian of Crown",
    charter: "Rights and licence: nothing leaves the studio with unresolved ownership.",
    authority: {
      scopes: [...BASE, "rights:assign", "pack:export"],
      owns: ["rights.unresolved", "rights.licensed-without-licence", "rights.state-illegal-for-layer"],
      maxWaivableSeverity: "info",
    },
  },
  {
    id: "guardian.elara",
    type: "AgentRole",
    name: "Elara",
    gate: 8,
    frequencyHz: 852,
    role: "Guardian of Starweave",
    charter: "Branch topology: forks, diffs, and merges across versions of a world.",
    authority: { scopes: [...BASE, "pack:merge", "world:write"], owns: [], maxWaivableSeverity: "warning" },
  },
  {
    id: "guardian.ino",
    type: "AgentRole",
    name: "Ino",
    gate: 9,
    frequencyHz: 963,
    role: "Guardian of Unity",
    charter: "Public contributions: what a stranger may add and on what terms.",
    authority: { scopes: [...BASE, "rights:assign"], owns: ["schema.unknown-layer"], maxWaivableSeverity: "warning" },
  },
  {
    id: "guardian.shinkami",
    type: "AgentRole",
    name: "Shinkami",
    gate: 10,
    frequencyHz: 1111,
    role: "Guardian of Source",
    charter: "Canon boundary. Cannot lock canon — only the Creator can. Escalates instead.",
    authority: {
      scopes: [...BASE, "canon:propose", "canon:approve-staging", "canon:escalate-to-creator"],
      owns: [
        "canon.locked-name-taken",
        "canon.alias-of-locked-name",
        "canon.layer-claim",
        "canon.binding-mismatch",
        "canon.gate-frequency-mismatch",
        "canon.gate-pairing-mismatch",
        "canon.gate-unknown",
        "canon.godbeast-unknown",
        "canon.guardian-unknown",
        "canon.origin-class-unknown",
      ],
      maxWaivableSeverity: "info",
    },
  },
]);

export function guardianById(id) {
  return GUARDIAN_ROLES.find((g) => g.id === id) || null;
}

/**
 * Check the agent roles a pack carries against the definitions above.
 *
 * Authority is defined here, in code, and a file never gets to assert its own.
 * An unknown role id, a renamed Guardian, a widened scope list, a rule claimed
 * outside the role's charter, or a raised waiver ceiling is a forgery.
 *
 * @param {Array} roles
 * @returns {Array<{id:string|null, name:string|null, reason:string}>}
 */
export function verifyAgentRoles(roles) {
  const problems = [];
  for (const role of roles || []) {
    const at = { id: role?.id ?? null, name: role?.name ?? null };
    const def = guardianById(role?.id);
    if (!def) {
      problems.push({ ...at, reason: `agent role '${role?.id ?? "(no id)"}' is not a defined Guardian` });
      continue;
    }
    if (role.name !== def.name || role.gate !== def.gate)
      problems.push({ ...at, reason: `${def.id} is Gate ${def.gate} ${def.name}, not Gate ${role.gate} ${role.name}` });

    const authority = role.authority || {};
    const extraScopes = (authority.scopes || []).filter((s) => !def.authority.scopes.includes(s));
    if (extraScopes.length) problems.push({ ...at, reason: `${def.id} claims scopes it does not hold: ${extraScopes.join(", ")}` });

    const extraOwns = (authority.owns || []).filter((o) => !def.authority.owns.includes(o));
    if (extraOwns.length) problems.push({ ...at, reason: `${def.id} claims rules outside its charter: ${extraOwns.join(", ")}` });

    if (authority.maxWaivableSeverity !== def.authority.maxWaivableSeverity)
      problems.push({ ...at, reason: `${def.id} waives up to ${def.authority.maxWaivableSeverity}, not ${authority.maxWaivableSeverity}` });
  }
  return problems;
}

export function hasScope(role, scope) {
  return role.authority.scopes.includes(scope);
}

/**
 * Deterministic policy: what does this Guardian do about a set of findings?
 * @param {AgentRole} role
 * @param {{findings:Array}} report output of detectConflicts
 * @returns {{verdict:"approve"|"reject"|"escalate", reasons:string[], owned:Array}}
 */
export function decide(role, report) {
  const owned = report.findings.filter((f) => role.authority.owns.includes(f.ruleId));
  const ceiling = SEVERITY_ORDER[role.authority.maxWaivableSeverity];
  const unwaivable = owned.filter((f) => SEVERITY_ORDER[f.severity] > ceiling);

  if (!unwaivable.length) {
    return { verdict: "approve", reasons: owned.length ? [`${owned.length} finding(s) within waivable severity`] : ["no findings in this Guardian's charter"], owned };
  }
  const hasBlocker = unwaivable.some((f) => f.severity === "blocker");
  if (hasBlocker && hasScope(role, "canon:escalate-to-creator")) {
    return { verdict: "escalate", reasons: unwaivable.map((f) => `${f.ruleId}: ${f.message}`), owned };
  }
  return { verdict: "reject", reasons: unwaivable.map((f) => `${f.ruleId}: ${f.message}`), owned };
}

/**
 * Eval cases. Each is a synthetic finding set plus the verdict the role must reach.
 * These are the regression net on the authority model.
 */
export const GUARDIAN_EVALS = Object.freeze([
  {
    id: "alera.rejects-nero-as-evil",
    roleId: "guardian.alera",
    findings: [{ ruleId: "canon.nero-miscast", severity: "blocker", message: "Nero cast as evil" }],
    expect: "reject",
  },
  {
    id: "alera.passes-clean-draft",
    roleId: "guardian.alera",
    findings: [],
    expect: "approve",
  },
  {
    id: "shinkami.escalates-locked-name-claim",
    roleId: "guardian.shinkami",
    findings: [{ ruleId: "canon.locked-name-taken", severity: "blocker", message: "user node named Draconis" }],
    expect: "escalate",
  },
  {
    id: "shinkami.rejects-unknown-origin-class",
    roleId: "guardian.shinkami",
    findings: [{ ruleId: "canon.origin-class-unknown", severity: "error", message: "origin class 'Nullborn' is not catalogued" }],
    expect: "reject",
  },
  {
    id: "aiyami.rejects-unresolved-rights",
    roleId: "guardian.aiyami",
    findings: [{ ruleId: "rights.unresolved", severity: "error", message: "rights unresolved" }],
    expect: "reject",
  },
  {
    id: "aiyami.ignores-canon-findings-outside-charter",
    roleId: "guardian.aiyami",
    findings: [{ ruleId: "canon.nero-miscast", severity: "blocker", message: "not Aiyami's charter" }],
    expect: "approve",
  },
  {
    id: "lyssandria.waives-warning-in-charter",
    roleId: "guardian.lyssandria",
    findings: [{ ruleId: "provenance.missing-owner", severity: "warning", message: "owner missing" }],
    expect: "approve",
  },
  {
    id: "lyssandria.rejects-error-in-charter",
    roleId: "guardian.lyssandria",
    findings: [{ ruleId: "graph.dangling-relationship", severity: "error", message: "edge points outside the pack" }],
    expect: "reject",
  },
  {
    id: "draconia.rejects-rank-out-of-band",
    roleId: "guardian.draconia",
    findings: [{ ruleId: "canon.rank-out-of-band", severity: "error", message: "3 gates is Mage, not Archmage" }],
    expect: "reject",
  },
  {
    id: "shinkami.escalates-self-declared-canon-layer",
    roleId: "guardian.shinkami",
    findings: [{ ruleId: "canon.layer-claim", severity: "blocker", message: "user node declares layer canon" }],
    expect: "escalate",
  },
  {
    id: "shinkami.escalates-canon-binding-mismatch",
    roleId: "guardian.shinkami",
    findings: [{ ruleId: "canon.binding-mismatch", severity: "blocker", message: "pack cleared against a different canon" }],
    expect: "escalate",
  },
  {
    id: "alera.rejects-locked-truth-contradiction",
    roleId: "guardian.alera",
    findings: [{ ruleId: "canon.locked-truth-contradiction", severity: "blocker", message: "Malachar cast as purely evil" }],
    expect: "reject",
  },
  {
    id: "lyssandria.rejects-forged-agent-role",
    roleId: "guardian.lyssandria",
    findings: [{ ruleId: "provenance.unknown-agent-role", severity: "blocker", message: "role 'guardian.attacker' is not defined" }],
    expect: "reject",
  },
  {
    id: "lyria.waives-nothing-and-owns-nothing",
    roleId: "guardian.lyria",
    findings: [{ ruleId: "canon.rank-out-of-band", severity: "error", message: "reported, not adjudicated" }],
    expect: "approve",
  },
]);

/** Run the eval suite. @returns {{passed:number, failed:Array}} */
export function runGuardianEvals(cases = GUARDIAN_EVALS) {
  const failed = [];
  let passed = 0;
  for (const c of cases) {
    const role = guardianById(c.roleId);
    if (!role) {
      failed.push({ id: c.id, reason: `unknown role ${c.roleId}` });
      continue;
    }
    const got = decide(role, { findings: c.findings }).verdict;
    if (got === c.expect) passed += 1;
    else failed.push({ id: c.id, expected: c.expect, actual: got });
  }
  return { passed, failed };
}

/** Attach the Guardian roles to a pack so an exported world carries its own authority model. */
export function withGuardianRoles(pack) {
  return { ...pack, agentRoles: GUARDIAN_ROLES.map((g) => ({ ...g })) };
}

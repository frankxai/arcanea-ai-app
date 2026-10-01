// Canon conflict detector.
//
// Pure: (pack, canonIndex) -> findings[]. No I/O, no model call, no clock.
// Every finding names the rule, the node, what canon says, and what the pack said.
//
// The pack is never a witness for itself. Layer is DERIVED from the canon index,
// not read from the node; the canon binding is checked against the hash of the
// real document, not against the hash the pack recorded; and the authority model
// is checked against the Guardian definitions, not against what the file claims.

import {
  buildCanonIndex,
  canonNameLoose,
  contradictionsIn,
  deriveLayer,
  gateByIndex,
  nameCandidates,
  rankForGates,
} from "./canon-index.mjs";
import { verifyAgentRoles } from "./guardians.mjs";
import {
  LAYER_RIGHTS_MATRIX,
  LAYER_STATUS_MATRIX,
  LAYERS,
  RIGHTS_STATES,
  CANON_STATUSES,
} from "./model.mjs";

export const SEVERITIES = Object.freeze([
  "blocker",
  "error",
  "warning",
  "info",
]);

const RULES = Object.freeze({
  "canon.binding-mismatch": "blocker",
  "canon.binding-foreign": "info",
  "canon.truths-unparsed": "error",
  "canon.foreign-canon-node": "info",
  "canon.layer-claim": "blocker",
  "canon.locked-name-taken": "blocker",
  "canon.alias-of-locked-name": "blocker",
  "canon.locked-truth-contradiction": "blocker",
  "canon.gate-unknown": "blocker",
  "canon.gate-frequency-mismatch": "blocker",
  "canon.gate-pairing-mismatch": "blocker",
  "canon.frequency-unknown": "error",
  "canon.godbeast-unknown": "error",
  "canon.guardian-unknown": "error",
  "canon.rank-unknown": "error",
  "canon.rank-out-of-band": "error",
  "canon.element-unknown": "error",
  "canon.house-unknown": "error",
  "canon.origin-class-unknown": "error",
  "canon.nero-miscast": "blocker",
  "canon.luminor-as-species": "error",
  "canon.staging-cited-as-locked": "warning",
  "rights.state-illegal-for-layer": "blocker",
  "rights.unresolved": "error",
  "rights.licensed-without-licence": "blocker",
  "status.illegal-for-layer": "blocker",
  "provenance.dangling-source": "error",
  "provenance.dangling-version": "error",
  "provenance.dangling-branch": "error",
  "provenance.missing-owner": "error",
  "provenance.unknown-agent-role": "blocker",
  "graph.dangling-relationship": "error",
  "schema.unknown-layer": "error",
});

function finding(ruleId, node, message, evidence) {
  return {
    ruleId,
    severity: RULES[ruleId] || "warning",
    nodeId: node?.id ?? null,
    nodeName: node?.name ?? null,
    message,
    evidence: evidence || {},
  };
}

// Arcanea canon: Nero is NOT evil. Checked with the same sentence-scoped negation
// as every other locked truth, so restating canon ("Nero is not evil.") is not a hit.
const NERO_MISCAST = [
  "evil",
  "malevolent",
  "wicked",
  "villain",
  "the enemy",
].map((forbidden) => ({
  subject: "nero",
  subjectLabel: "Nero",
  forbidden,
  source: "Nero is NOT evil",
}));

const PROSE_SKIP = new Set(["id", "type", "layer", "governance", "provenance"]);

/**
 * Every free-text string a node carries, wherever the author put it.
 *
 * The old detector read three fields, so `attributes.backstory` walked straight
 * past both locked-truth rules. A rule that only fires on the key you thought of
 * is not a rule.
 */
export function proseOf(node) {
  const parts = [];
  const walk = (value) => {
    if (typeof value === "string") parts.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object")
      for (const k of Object.keys(value)) walk(value[k]);
  };
  for (const [key, value] of Object.entries(node || {})) {
    if (PROSE_SKIP.has(key)) continue;
    walk(value);
  }
  return parts.join(" \n ");
}

/**
 * @param {object} pack WorldPack.v1 (working or exported shape)
 * @param {object} canon CanonIndex.v1 — built from the real canon document by the caller
 * @param {{canonBinding?: "required"|"foreign"}} [options]
 *   `foreign` is for checking a pack against a canon it was never bound to
 *   (a creator's own document); the binding is then reported, not enforced.
 * @returns {{findings:Array, blockers:number, errors:number, clean:boolean}}
 */
export function detectConflicts(pack, canon, options = {}) {
  const findings = [];
  // Checking against a canon this pack was never bound to: the pack's canon-layer
  // nodes are attested by a document we are not holding, and this canon's tables
  // are only authoritative where it actually has them.
  const foreign = options.canonBinding === "foreign";
  // An exported pack nests its ledgers under `provenance`; a working pack keeps
  // them top level. Both are valid inputs — the detector reads either.
  const prov = pack.provenance || {};
  const nodeIds = new Set(pack.nodes.map((n) => n.id));
  const sourceIds = new Set(
    (pack.sources || prov.sources || []).map((s) => s.id),
  );
  const versionIds = new Set(
    (pack.versions || prov.versions || []).map((v) => v.id),
  );
  const branchIds = new Set(
    (pack.branches || prov.branches || []).map((b) => b.id),
  );

  // — canon binding: the hash of the document in front of us, not the one the pack wrote down —
  const declaredHash = pack.canon?.sourceHash ?? null;
  if (options.canonBinding === "foreign") {
    if (declaredHash && declaredHash !== canon.sourceHash)
      findings.push(
        finding(
          "canon.binding-foreign",
          null,
          `pack is bound to a different canon document; checking it against ${canon.universeName ?? "this canon"} anyway`,
          {
            declared: declaredHash,
            actual: canon.sourceHash,
          },
        ),
      );
  } else if (!declaredHash) {
    findings.push(
      finding(
        "canon.binding-mismatch",
        null,
        `pack declares no canon binding; the canon document hashes to ${canon.sourceHash}`,
        { declared: null, actual: canon.sourceHash },
      ),
    );
  } else if (declaredHash !== canon.sourceHash) {
    findings.push(
      finding(
        "canon.binding-mismatch",
        null,
        `pack was cleared against a different canon\n    declared   ${declaredHash}\n    actual     ${canon.sourceHash}`,
        {
          declared: declaredHash,
          actual: canon.sourceHash,
        },
      ),
    );
  }

  // — the canon document itself: a truth block nothing could read enforces nothing —
  for (const block of canon.unparsedTruthBlocks || []) {
    findings.push(
      finding(
        "canon.truths-unparsed",
        null,
        `canon line ${block.line}: a LOCKED TRUTHS block yielded no parseable truth, so nothing in it is enforced`,
        { line: block.line, text: block.text },
      ),
    );
  }

  // — authority model: Guardian roles are defined in code, never asserted by a file —
  for (const problem of verifyAgentRoles(pack.agentRoles)) {
    findings.push(
      finding(
        "provenance.unknown-agent-role",
        { id: problem.id, name: problem.name },
        problem.reason,
        problem,
      ),
    );
  }

  for (const node of pack.nodes) {
    const g = node.governance || {};
    const attrs = node.attributes || {};

    if (!LAYERS.includes(node.layer)) {
      findings.push(
        finding(
          "schema.unknown-layer",
          node,
          `layer '${node.layer}' is not one of ${LAYERS.join(", ")}`,
          { expected: LAYERS },
        ),
      );
      continue;
    }

    // Layer is derived, never taken on the node's word.
    const attestation = deriveLayer(canon, node);
    const unattestedClaim =
      attestation.declared === "canon" && !attestation.attested;
    const layer = unattestedClaim && foreign ? "canon" : attestation.layer;
    if (unattestedClaim) {
      findings.push(
        foreign
          ? finding(
              "canon.foreign-canon-node",
              node,
              `node is canon in another universe, not in ${canon.universeName ?? "this canon"}; judged as-declared`,
              {
                declaredLayer: "canon",
                owner: g.owner ?? null,
              },
            )
          : finding(
              "canon.layer-claim",
              node,
              `node declares layer 'canon' but is not canon: ${attestation.reason}`,
              {
                declaredLayer: "canon",
                derivedLayer: attestation.layer,
                canonOwner: canon.canonOwner,
                owner: g.owner ?? null,
              },
            ),
      );
    }

    // — governance envelope —
    if (!g.owner)
      findings.push(
        finding("provenance.missing-owner", node, "node has no owner"),
      );
    if (g.sourceRef && !sourceIds.has(g.sourceRef))
      findings.push(
        finding(
          "provenance.dangling-source",
          node,
          `sourceRef ${g.sourceRef} is not in pack.sources`,
          { sourceRef: g.sourceRef },
        ),
      );
    if (g.versionRef && !versionIds.has(g.versionRef))
      findings.push(
        finding(
          "provenance.dangling-version",
          node,
          `versionRef ${g.versionRef} is not in pack.versions`,
          { versionRef: g.versionRef },
        ),
      );
    if (g.branchRef && !branchIds.has(g.branchRef))
      findings.push(
        finding(
          "provenance.dangling-branch",
          node,
          `branchRef ${g.branchRef} is not in pack.branches`,
          { branchRef: g.branchRef },
        ),
      );

    const status = g.canonStatus;
    if (!CANON_STATUSES.includes(status)) {
      findings.push(
        finding(
          "status.illegal-for-layer",
          node,
          `canonStatus '${status}' is not a CanonStatus`,
          { expected: CANON_STATUSES },
        ),
      );
    } else if (!LAYER_STATUS_MATRIX[layer].includes(status)) {
      findings.push(
        finding(
          "status.illegal-for-layer",
          node,
          `a '${layer}' node cannot be '${status}'`,
          {
            expected: LAYER_STATUS_MATRIX[layer],
            actual: status,
            derivedLayer: layer,
          },
        ),
      );
    }

    const rights = g.rights || {};
    if (!RIGHTS_STATES.includes(rights.state)) {
      findings.push(
        finding(
          "rights.unresolved",
          node,
          `rights.state '${rights.state}' is not a RightsState`,
          { expected: RIGHTS_STATES },
        ),
      );
    } else {
      if (rights.state === "unresolved")
        findings.push(
          finding(
            "rights.unresolved",
            node,
            "rights are unresolved; this node cannot be exported or sold",
          ),
        );
      if (!LAYER_RIGHTS_MATRIX[layer].includes(rights.state))
        findings.push(
          finding(
            "rights.state-illegal-for-layer",
            node,
            `a '${layer}' node cannot claim rights '${rights.state}'`,
            {
              expected: LAYER_RIGHTS_MATRIX[layer],
              actual: rights.state,
              derivedLayer: layer,
            },
          ),
        );
      if (rights.state === "licensed" && !rights.spdx && !rights.licenceRef)
        findings.push(
          finding(
            "rights.licensed-without-licence",
            node,
            "licensed node names no licence (spdx or licenceRef)",
          ),
        );
    }

    // — canon name collisions —
    // The locked-name rule applies to every node whatever it declares, attested
    // canon included. An attested node is exempt only for its own entry.
    {
      const claimed = new Map();
      for (const candidate of nameCandidates(node)) {
        const loose = canonNameLoose(canon, candidate);
        if (!loose) continue;
        if (attestation.attested && loose.entry === attestation.entry) continue;
        const isNodeName = candidate === node.name;
        const key = loose.entry.name;
        const prior = claimed.get(key);
        if (!prior || (prior.match !== "exact" && loose.match === "exact"))
          claimed.set(key, { ...loose, candidate, isNodeName });
      }
      for (const hit of claimed.values()) {
        if (hit.entry.status === "locked") {
          const exactName = hit.match === "exact" && hit.isNodeName;
          findings.push(
            finding(
              exactName
                ? "canon.locked-name-taken"
                : "canon.alias-of-locked-name",
              node,
              exactName
                ? `'${node.name}' is locked canon (${hit.entry.kind}); a ${layer} node cannot claim that name`
                : `'${hit.candidate}' carries the locked canon name '${hit.entry.name}' (${hit.entry.kind}); a ${layer} node cannot claim it under a hat`,
              {
                canonKind: hit.entry.kind,
                canonStatus: hit.entry.status,
                canonName: hit.entry.name,
                claimedAs: hit.candidate,
                match: hit.match,
              },
            ),
          );
        } else if (hit.entry.status === "staging" && status === "locked") {
          findings.push(
            finding(
              "canon.staging-cited-as-locked",
              node,
              `'${hit.entry.name}' is STAGING in canon but this node claims 'locked'`,
              { canonStatus: hit.entry.status },
            ),
          );
        }
      }
    }

    // — attribute checks against the canon tables —
    // A canon that has no Gate table has no opinion about gates. Only tables the
    // document actually carries are enforced — that is what lets these same rules
    // run against a creator's own canon without inventing findings.
    const gate =
      attrs.gate == null || !canon.gates.length
        ? null
        : gateByIndex(canon, Number(attrs.gate));
    if (attrs.gate != null && !gate && canon.gates.length) {
      findings.push(
        finding(
          "canon.gate-unknown",
          node,
          `gate '${attrs.gate}' is not one of the ${canon.gates.length} Gates`,
          {
            expected: canon.gates.map((g2) => g2.index),
            actual: attrs.gate,
          },
        ),
      );
    }
    if (gate) {
      if (
        attrs.frequencyHz != null &&
        Number(attrs.frequencyHz) !== gate.frequencyHz
      )
        findings.push(
          finding(
            "canon.gate-frequency-mismatch",
            node,
            `gate ${gate.index} (${gate.name}) is ${gate.frequencyHz} Hz, not ${attrs.frequencyHz} Hz`,
            {
              expected: gate.frequencyHz,
              actual: Number(attrs.frequencyHz),
            },
          ),
        );
      if (attrs.godbeast && attrs.godbeast !== gate.godbeast)
        findings.push(
          finding(
            "canon.gate-pairing-mismatch",
            node,
            `gate ${gate.index} is bonded to ${gate.godbeast}, not ${attrs.godbeast}`,
            {
              expected: gate.godbeast,
              actual: attrs.godbeast,
            },
          ),
        );
      if (attrs.guardian && attrs.guardian !== gate.god)
        findings.push(
          finding(
            "canon.gate-pairing-mismatch",
            node,
            `gate ${gate.index} is kept by ${gate.god}, not ${attrs.guardian}`,
            {
              expected: gate.god,
              actual: attrs.guardian,
            },
          ),
        );
    } else if (attrs.frequencyHz != null && canon.gates.length) {
      const known = canon.gates.some(
        (g2) => g2.frequencyHz === Number(attrs.frequencyHz),
      );
      if (!known)
        findings.push(
          finding(
            "canon.frequency-unknown",
            node,
            `${attrs.frequencyHz} Hz is not a Gate frequency`,
            {
              expected: canon.gates.map((g2) => g2.frequencyHz),
              actual: Number(attrs.frequencyHz),
            },
          ),
        );
    }

    // Unknown values are findings, not silence. The old detector only checked a
    // pairing when the gate resolved, so an invented gate took every value with it.
    if (
      attrs.godbeast &&
      canon.gates.length &&
      !canon.gates.some((g2) => g2.godbeast === attrs.godbeast)
    )
      findings.push(
        finding(
          "canon.godbeast-unknown",
          node,
          `'${attrs.godbeast}' is not a canonical Godbeast`,
          {
            expected: canon.gates.map((g2) => g2.godbeast),
            actual: attrs.godbeast,
          },
        ),
      );
    if (
      attrs.guardian &&
      canon.gates.length &&
      !canon.gates.some((g2) => g2.god === attrs.guardian)
    )
      findings.push(
        finding(
          "canon.guardian-unknown",
          node,
          `'${attrs.guardian}' is not a canonical God/Goddess`,
          { expected: canon.gates.map((g2) => g2.god), actual: attrs.guardian },
        ),
      );
    if (
      attrs.rank &&
      canon.ranks.length &&
      !canon.ranks.some((r) => r.rank === attrs.rank)
    )
      findings.push(
        finding(
          "canon.rank-unknown",
          node,
          `'${attrs.rank}' is not a magic rank`,
          { expected: canon.ranks.map((r) => r.rank), actual: attrs.rank },
        ),
      );

    if (attrs.gatesOpen != null && attrs.rank) {
      const expected = rankForGates(canon, Number(attrs.gatesOpen));
      if (expected && expected !== attrs.rank)
        findings.push(
          finding(
            "canon.rank-out-of-band",
            node,
            `${attrs.gatesOpen} gates open is rank ${expected}, not ${attrs.rank}`,
            {
              expected,
              actual: attrs.rank,
            },
          ),
        );
    }

    if (
      attrs.element &&
      canon.elements.length &&
      !canon.elements.includes(attrs.element)
    )
      findings.push(
        finding(
          "canon.element-unknown",
          node,
          `'${attrs.element}' is not one of the canonical elements`,
          { expected: canon.elements },
        ),
      );

    if (attrs.house && canon.houses.length) {
      const houseName = String(attrs.house).replace(/^House\s+/i, "");
      if (!canon.houses.includes(houseName))
        findings.push(
          finding(
            "canon.house-unknown",
            node,
            `'${attrs.house}' is not one of the seven Academy Houses`,
            { expected: canon.houses },
          ),
        );
    }

    if (attrs.originClass && canon.originClasses.length) {
      const known = canon.originClasses.some(
        (o) => o.name.toLowerCase() === String(attrs.originClass).toLowerCase(),
      );
      if (!known)
        findings.push(
          finding(
            "canon.origin-class-unknown",
            node,
            `'${attrs.originClass}' is not a catalogued origin class; the eight are CLOSED`,
            {
              expected: canon.originClasses.map((o) => o.name),
            },
          ),
        );
    }

    // — locked truths, over every free-text field the node carries —
    const prose = proseOf(node);
    for (const hit of contradictionsIn(prose, canon.contradictionTriggers)) {
      findings.push(
        finding(
          "canon.locked-truth-contradiction",
          node,
          `LOCKED TRUTH: ${hit.source}`,
          {
            subject: hit.subjectLabel,
            forbidden: hit.forbidden,
            lockedTruth: hit.source,
          },
        ),
      );
    }
    if (contradictionsIn(prose, NERO_MISCAST).length)
      findings.push(
        finding(
          "canon.nero-miscast",
          node,
          "LOCKED TRUTH: Nero is NOT evil; Shadow is corrupted Void, the Dark Lord's perversion",
          { lockedTruth: canon.lockedTruths[0] },
        ),
      );

    if (/^luminor$/i.test(String(attrs.species || attrs.originClass || "")))
      findings.push(
        finding(
          "canon.luminor-as-species",
          node,
          "LOCKED TRUTH: Luminor is a RANK, not an entity type",
          {},
        ),
      );
  }

  for (const rel of pack.relationships || []) {
    if (!nodeIds.has(rel.from) || !nodeIds.has(rel.to))
      findings.push(
        finding(
          "graph.dangling-relationship",
          { id: rel.id, name: rel.kind },
          `relationship '${rel.kind}' points outside the pack`,
          {
            from: rel.from,
            to: rel.to,
          },
        ),
      );
  }

  const blockers = findings.filter((f) => f.severity === "blocker").length;
  const errors = findings.filter((f) => f.severity === "error").length;
  return { findings, blockers, errors, clean: blockers === 0 && errors === 0 };
}

/**
 * Run the same rules against a creator's OWN canon document.
 *
 * This is the part that is worth money to someone who will never publish into
 * Arcanea: the 20 rules are not about Arcanea, they are about whether a draft
 * contradicts the locked truths of whatever world it belongs to. Arcanea's canon
 * is then one profile among many.
 *
 * @param {object} pack
 * @param {string} canonDocument raw markdown of the creator's canon
 * @returns {{canon:object, report:object}}
 */
export function checkAgainst(pack, canonDocument) {
  const canon = buildCanonIndex(canonDocument);
  return {
    canon,
    report: detectConflicts(pack, canon, { canonBinding: "foreign" }),
  };
}

export { RULES };

// What each WorldPack conflict rule checks and how to clear a finding.
// Severity is NOT duplicated here: it is read from the bundled engine at runtime,
// and tests/worldpack-tools.test.mjs fails if this catalog and the engine's rule
// set ever disagree.

export interface RuleGuide {
  checks: string;
  fix: string;
}

export const SEVERITY_MEANING = {
  blocker:
    "The pack is lying about canon, rights or authority. Do not export, publish or sell it until cleared.",
  error:
    "The pack is incomplete or inconsistent with canon. The world is not clean until fixed.",
  warning: "Probably wrong; review before relying on it.",
  info: "Context for the reader; no action required.",
} as const;

export const RULE_GUIDES: Record<string, RuleGuide> = {
  "canon.binding-mismatch": {
    checks:
      "pack.canon.sourceHash is missing, or is not the sha256 of the canon document the check actually ran against. The hash is recomputed; the pack's own value is never trusted.",
    fix: "Check against the canon the pack was built for. If canon changed, re-run worldpack_check and only update canon.sourceHash to evidence.actual once the pack is clean.",
  },
  "canon.binding-foreign": {
    checks:
      "The pack is bound to a different canon than the canonDocument supplied. Reported, not enforced, because the document is not the one the pack claims.",
    fix: "None needed when auditing against your own canon on purpose.",
  },
  "canon.foreign-canon-node": {
    checks:
      "When checking against a custom canonDocument, a node declares layer 'canon' for a universe that document does not govern. It is judged as declared.",
    fix: "None needed; re-check against the canon that node belongs to for a binding verdict.",
  },
  "canon.layer-claim": {
    checks:
      "A node declares layer 'canon' but its name does not resolve to a LOCKED entry in the canon document, or its owner is not the canon owner. The node is judged at its real layer.",
    fix: "Set layer to what the node is (user, generated, licensed or contributed). Canon layer is granted by the canon document, never by the pack.",
  },
  "canon.locked-name-taken": {
    checks:
      "A node that is not attested canon uses a LOCKED canon name exactly (case, punctuation and diacritics normalized).",
    fix: "Rename the node. A locked name belongs to the canon entry evidence.canonName.",
  },
  "canon.alias-of-locked-name": {
    checks:
      "A locked canon name appears inside a node's name ('Lyria the Radiant') or in attributes.aliases, alsoKnownAs, alias or trueName.",
    fix: "Remove the locked name from the name or alias shown in evidence.claimedAs.",
  },
  "canon.locked-truth-contradiction": {
    checks:
      "Any free-text field on the node (description, attributes.backstory, notes, anything) asserts what a LOCKED TRUTH forbids: subject and forbidden phrase co-occur without negation.",
    fix: "Rewrite the passage so it no longer asserts evidence.forbidden about evidence.subject. The truth is quoted in evidence.lockedTruth.",
  },
  "canon.gate-unknown": {
    checks: "attributes.gate is not one of the Gates in the canon table.",
    fix: "Use a Gate index that exists (evidence.expected), or remove attributes.gate.",
  },
  "canon.gate-frequency-mismatch": {
    checks:
      "attributes.frequencyHz differs from the frequency canon fixes for attributes.gate.",
    fix: "Set frequencyHz to evidence.expected, or drop it and let the gate imply it.",
  },
  "canon.gate-pairing-mismatch": {
    checks:
      "attributes.guardian or attributes.godbeast is not the God/Goddess or Godbeast canon pairs with attributes.gate.",
    fix: "Use evidence.expected, or change the gate to the one that pairing belongs to.",
  },
  "canon.frequency-unknown": {
    checks:
      "attributes.frequencyHz is set without a gate and matches no Gate frequency.",
    fix: "Use a canonical frequency (evidence.expected) or remove it.",
  },
  "canon.godbeast-unknown": {
    checks: "attributes.godbeast is not any canonical Godbeast.",
    fix: "Use a Godbeast from evidence.expected, or move the creature out of the godbeast attribute.",
  },
  "canon.guardian-unknown": {
    checks: "attributes.guardian is not any canonical God/Goddess.",
    fix: "Use a name from evidence.expected, or describe the relationship in prose instead.",
  },
  "canon.rank-unknown": {
    checks: "attributes.rank is not a canonical magic rank.",
    fix: "Use a rank from evidence.expected.",
  },
  "canon.rank-out-of-band": {
    checks:
      "attributes.rank does not match the rank canon assigns to attributes.gatesOpen.",
    fix: "Set rank to evidence.expected, or change gatesOpen.",
  },
  "canon.element-unknown": {
    checks: "attributes.element is not a canonical element.",
    fix: "Use an element from evidence.expected.",
  },
  "canon.house-unknown": {
    checks: "attributes.house is not one of the canonical Academy Houses.",
    fix: "Use a House from evidence.expected.",
  },
  "canon.origin-class-unknown": {
    checks:
      "attributes.originClass is not one of the catalogued origin classes, which are a closed set.",
    fix: "Use an origin class from evidence.expected. New classes require a canon change, not a pack edit.",
  },
  "canon.nero-miscast": {
    checks:
      "Node prose casts Nero as evil, malevolent, wicked or a villain (Arcanea canon only).",
    fix: "Nero is the Primordial Darkness, not evil. Put the villainy on Shadow or the Dark Lord.",
  },
  "canon.luminor-as-species": {
    checks:
      "attributes.species or originClass is 'Luminor'. Luminor is a rank, not an entity type.",
    fix: "Set rank to Luminor and give the node a real species or origin class.",
  },
  "canon.staging-cited-as-locked": {
    checks:
      "A node names a STAGING canon entry but claims canonStatus 'locked'.",
    fix: "Use canonStatus 'staging' or 'evolving' until the entry is locked in the canon document.",
  },
  "rights.state-illegal-for-layer": {
    checks:
      "rights.state is not legal for the node's derived layer: canon=arcanea-owned, user=creator-owned, licensed=licensed, generated=creator-owned|unresolved, contributed=community-contributed|unresolved.",
    fix: "Set rights.state to one of evidence.expected, or correct the layer.",
  },
  "rights.unresolved": {
    checks:
      "rights.state is 'unresolved' or not a valid RightsState. Such a node cannot be exported or sold.",
    fix: "Resolve ownership and set rights.state to a legal value for the layer.",
  },
  "rights.licensed-without-licence": {
    checks:
      "A node with rights.state 'licensed' names no licence (rights.spdx or rights.licenceRef).",
    fix: "Add the SPDX identifier or a licenceRef for the inbound licence.",
  },
  "status.illegal-for-layer": {
    checks:
      "governance.canonStatus is invalid or illegal for the derived layer: canon=locked|staging|evolving, user=draft|non-canon|evolving, licensed=non-canon|draft, generated=draft, contributed=draft|non-canon|rejected.",
    fix: "Set canonStatus to one of evidence.expected. A user world cannot mint locked canon.",
  },
  "provenance.dangling-source": {
    checks: "governance.sourceRef points at a source that is not in the pack.",
    fix: "Add the source record or correct the reference.",
  },
  "provenance.dangling-version": {
    checks:
      "governance.versionRef points at a version that is not in the pack.",
    fix: "Commit the version or correct the reference.",
  },
  "provenance.dangling-branch": {
    checks: "governance.branchRef points at a branch that is not in the pack.",
    fix: "Create the branch or correct the reference.",
  },
  "provenance.missing-owner": {
    checks: "A node has no governance.owner.",
    fix: "Set governance.owner to the creator or rights holder id.",
  },
  "provenance.unknown-agent-role": {
    checks:
      "An agentRoles entry does not match the Guardian definitions in code: unknown id, renamed Guardian, widened scopes, rules outside its charter, or a changed waiver ceiling. Re-signing does not help.",
    fix: "Delete the edited agentRoles and regenerate them from the engine (withGuardianRoles). Authority cannot be granted by a file.",
  },
  "graph.dangling-relationship": {
    checks: "A relationship's from or to id is not a node in the pack.",
    fix: "Add the missing node or remove the relationship.",
  },
  "schema.unknown-layer": {
    checks:
      "A node's layer is not canon, user, licensed, generated or contributed. Its other checks are skipped.",
    fix: "Set a valid layer, then re-run the check.",
  },
};

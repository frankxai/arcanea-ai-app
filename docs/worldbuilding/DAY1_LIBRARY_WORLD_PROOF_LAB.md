# Arcanea day-1 library: world builder tooling and World Proof Lab outline

This document stages the day-1 canon library for world builders in Arcanea. It provides four operational templates with a worked example for each, built on sourced claims and canon provenance metadata.

## Overview and canon provenance framework

Every canon artifact requires explicit provenance fields to distinguish accepted facts from proposed additions and unresolved conflicts.

### Canon provenance schema specification

All templates embed the following provenance schema:

```json
{
  "artifact_id": "string",
  "world_handle": "string",
  "provenance_status": "accepted | proposal | conflict | rejected",
  "source_citation": "string",
  "author_did": "string",
  "revision_clock": "integer",
  "dependent_artifacts": ["string"]
}
```

---

## 1. Series bible template and worked example

### Template structure

- **High concept and core seed**: Primary premise and environmental stakes.
- **World rules and sourced claims**: Natural or magical mechanics backed by citations.
- **Primary cast and relationships**: Character roles and structural ties.
- **Canon provenance**: Metadata tracking state and sources.

### Worked example: Tide Archive

- **High concept and core seed**: A coastal archive where damaged memories are repaired by exchanging lived experiences.
- **World rules and sourced claims**:
  - _Rule_: A damaged memory can be repaired only with an equally specific memory (`apps/web/public/downloads/arcanea-world-starter.md`).
  - _Cost_: The repairer permanently loses their lived connection to the surrendered memory (`apps/web/public/downloads/arcanea-world-starter.md`).
  - _Setting_: The Tide Archives occupy four coral spires in the Atlantean Depths (`book/worldbuilding/world-atlas.md`).
- **Primary cast**:
  - Mara: Senior archivist seeking to preserve her father's memory for her brother.
  - Sessa: Head archivist governing restricted access collections.
- **Canon provenance**:
  - `artifact_id`: `bible-tide-archive-001`
  - `provenance_status`: `accepted`
  - `source_citation`: `apps/web/public/downloads/arcanea-world-starter.md`

---

## 2. Campaign ledger template and worked example

### Template structure

- **Session summary and world state delta**: Events that changed accepted facts.
- **Player decisions and trade-offs**: Irreversible choices made in session.
- **Updated claim register**: New facts or modified world parameters.
- **Canon provenance**: Metadata tracking session updates.

### Worked example: Low Tide session 04

- **Session summary and world state delta**: Mara repaired her father's photograph at the repair lamp during low tide, surrendering her personal memory of the harbor steps.
- **Player decisions and trade-offs**: Mara gave away her own summer memory to restore her father's likeness for her younger brother.
- **Updated claim register**:
  - Mara remembers that the harbor event occurred, but no longer experiences the sensation of being present.
  - The restored photograph remains physically stable under copper repair light.
- **Canon provenance**:
  - `artifact_id`: `ledger-low-tide-s04`
  - `provenance_status`: `accepted`
  - `source_citation`: `apps/web/public/downloads/arcanea-world-starter.md#the-repair`

---

## 3. Quest kit template and worked example

### Template structure

- **Quest objective and trigger**: Narrative call to action and starting conditions.
- **Obstacles and world rule enforcement**: How world constraints block immediate success.
- **Consequences and branching outcomes**: Measurable states resulting from resolution.
- **Canon provenance**: Metadata tracking quest validity.

### Worked example: The broken lamp of Tide Archive

- **Quest objective and trigger**: Restore the light of the central copper repair lamp before high tide floods the outer stair.
- **Obstacles and world rule enforcement**:
  - The lamp requires a willing memory sacrifice; simple physical fuel or magical channeling fails.
  - Salt-clouded glass must be cleared using historical vellum cleaner from Sessa's desk.
- **Consequences and branching outcomes**:
  - _Success_: The lamp ignites; memory repairs can proceed for one tide cycle.
  - _Failure_: The memory record dissolves into salt water and becomes unrecoverable.
- **Canon provenance**:
  - `artifact_id`: `quest-broken-lamp-01`
  - `provenance_status`: `accepted`
  - `source_citation`: `apps/web/public/downloads/arcanea-world-starter.md#the-repair`

---

## 4. Visual novel branch kit template and worked example

### Template structure

- **Node identifier and dialogue state**: Scene position and current speaker choices.
- **Decision point and rule test**: The choice presented to the player grounded in world laws.
- **State mutation and narrative routing**: How state flags update after choice execution.
- **Canon provenance**: Metadata tracking branch authenticity.

### Worked example: Mara at low tide

- **Node identifier and dialogue state**: Node `VN-TIDE-01` (Archive lower desk). Mara stands before the copper dish as the tide bell strikes.
- **Decision point and rule test**:
  - _Option A_: Offer the memory of counting ferry departures. (Fails rule: memory is too general).
  - _Option B_: Offer the summer memory of the harbor steps with her brother. (Succeeds rule: specific personal memory).
- **State mutation and narrative routing**:
  - _Option A selected_: Dialogue output: "The photograph did not want a season. It wanted a person." Node loops to `VN-TIDE-01`.
  - _Option B selected_: State flag `mara_harbor_memory` set to `false`. Father's portrait restored. Route to `VN-TIDE-02`.
- **Canon provenance**:
  - `artifact_id`: `vn-mara-low-tide-branch`
  - `provenance_status`: `accepted`
  - `source_citation`: `apps/web/public/downloads/arcanea-world-starter.md#the-repair`

---

## World Proof Lab outline

The World Proof Lab is an automated verification suite that validates world assets against canon rules before publication.

### Core verification stages

1. **Schema validation**: Verifies structural completeness of series bibles, campaign ledgers, quest kits, and visual novel branch kits.
2. **Provenance verification**: Confirms all claims link to valid source citations (`apps/web/public/downloads/arcanea-world-starter.md` or `docs/canon/ARCANEA_UNIVERSE_CANON.md`).
3. **Rule consistency check**: Detects contradictions between proposed scene outcomes and established world constraints.
4. **Execution command and output protocol**: Runs `pnpm test` or local suite checks to guarantee deterministic JSON and Markdown output.

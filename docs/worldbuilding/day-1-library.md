# Arcanea day-1 library: world builder tooling and world proof lab outline

## Overview and canon provenance framework

The day-1 library provides world builders with immediate, production-ready templates and verified worked examples for building within the Arcanea ecosystem. Every tool in this suite integrates canon provenance fields to guarantee that lore claims trace back directly to primary sources in the Arcanea canon repository.

## Canon provenance schema specification

All world building artifacts created using these templates include the standard canon provenance header:

```yaml
provenance:
  canon_source: "book/chapters/book1/08-the-tide-archives.md"
  verification_status: "verified"
  sourced_claims:
    - claim_id: "CLAIM-TA-001"
      source_ref: "book/worldbuilding/world-atlas.md#the-tide-archives"
      statement: "The Tide Archives occupy four coral spires housing documents across forty-three languages."
  author_id: "starlight-weaver"
  last_audited: "2026-10-11"
```

---

## 1. Series bible template and worked example

### Series bible template structure

#### High concept and core seed

- **Title / Realm name**: Primary identifier of the series or setting.
- **Core premise**: Single paragraph defining the central struggle and world logic.
- **Tone & themes**: Key stylistic and thematic anchors.

#### World rules and sourced claims

- **Sourced claims list**: Specific, citation-backed facts from canonical records.
- **Magic & technology boundaries**: What is possible, what is forbidden, and resource limits.

---

### Worked example: Tide Archive

```yaml
provenance:
  canon_source: "book/chapters/book1/08-the-tide-archives.md"
  verification_status: "verified"
  sourced_claims:
    - claim_id: "CLAIM-TA-001"
      source_ref: "book/worldbuilding/world-atlas.md#the-tide-archives"
      statement: "The collection includes written texts in forty-three languages and memory-extracts from six centuries of practitioners."
    - claim_id: "CLAIM-TA-002"
      source_ref: "book/academy-handbook/student-guide.md#at-the-atlantean-depths"
      statement: "The Depth Scrolls preserve the emotional state of the writer at the moment of writing."
  author_id: "starlight-weaver"
  last_audited: "2026-10-11"
```

#### High concept and core seed

- **Title**: Tide Archive (Atlantean Depths)
- **Core premise**: Located in the coral spires of the Atlantean Depths, the Tide Archives serve as the living memory network of the Water-mages. The city grew around the library rather than the library around the city.
- **Tone & themes**: Quiet preservation, emotional weight of ancient memory, pressure of accumulated history.

#### World rules and sourced claims

- **Structure**: Occupies four large coral spires connected by underwater bridges.
- **Holdings**: Written works in forty-three languages, oral recordings in crystalline matrices, direct memory-extracts, and Depth Scrolls made from naturally deceased sea creatures.
- **Boundaries**: Access to deeper wings requires specific field authorization. The Silence Collection in the deepest chamber requires opening at least five Gates.

---

## 2. Campaign ledger template and worked example

### Campaign ledger template structure

#### Session summary and world state delta

- **Campaign title & session number**: Metadata for tracking progression.
- **Active participants**: Characters, factions, and world agents involved.
- **World state delta**: Explicit log of changes to the world state resulting from player or story actions.

---

### Worked example: Low Tide session 04

```yaml
provenance:
  canon_source: "book/chapters/book2/00-outline.md"
  verification_status: "verified"
  sourced_claims:
    - claim_id: "CLAIM-LT-001"
      source_ref: "book/chapters/book2/00-outline.md#chapter-04"
      statement: "Thresh communicates primarily through citations, while Maeril studies the Dreaming Pools."
  author_id: "starlight-weaver"
  last_audited: "2026-10-11"
```

#### Session summary and world state delta

- **Campaign title**: Low Tide — Atlantean Depths Orientation
- **Session**: 04 — Outer Wing Access
- **Participants**: Kael, Sable, Corenne, Thresh, Maeril.
- **Summary**: Kael completes orientation in the outer Tide Archives under the guidance of Thresh and Maeril, encountering Depth Scrolls for the first time.
- **World state delta**:
  - Kael accessed outer wing record #4391.
  - Sable's presence in the outer wing logged by archivist Thresh.
  - Unsanctioned inquiry into the Silence Collection recorded in session transcript.

---

## 3. Quest kit template and worked example

### Quest kit template structure

#### Quest overview and objective

- **Quest title**: Short descriptive title.
- **Prerequisites & level**: Lore or character prerequisites.
- **Primary objective**: Core task and success criteria.
- **Rewards & lore unlock**: Specific canon documents or artifacts awarded.

---

### Worked example: the broken lamp of Tide Archive

```yaml
provenance:
  canon_source: "book/chapters/book1/08-the-tide-archives.md"
  verification_status: "verified"
  sourced_claims:
    - claim_id: "CLAIM-QK-001"
      source_ref: "book/chapters/book1/08-the-tide-archives.md"
      statement: "Continuous low-level channeling pulls moisture from the air into floor drainage."
  author_id: "starlight-weaver"
  last_audited: "2026-10-11"
```

#### Quest overview and objective

- **Quest title**: The broken lamp of Tide Archive
- **Prerequisites**: Water-gate opening or faculty recommendation.
- **Primary objective**: Repair the channeling grid powering the moisture-drainage lanterns in the outer spire corridor before humidity damages third-level vellum scrolls.
- **Lore unlock**: Access to Archivist Sessa's early lecture notes on crystalline memory matrices.

---

## 4. Visual novel (VN) branch kit template and worked example

### Visual novel branch kit template structure

#### Scene setup and branch conditions

- **Scene ID & location**: Setting context.
- **Active dialogue nodes**: Branching decision points.
- **State variables**: Conditions required to unlock choices.

---

### Worked example: Mara at low tide

```yaml
provenance:
  canon_source: "book/chapters/book2/00-outline.md"
  verification_status: "verified"
  sourced_claims:
    - claim_id: "CLAIM-VN-001"
      source_ref: "book/chapters/book2/00-outline.md"
      statement: "Sable carries the particular watchfulness of someone who knows more than disclosed."
  author_id: "starlight-weaver"
  last_audited: "2026-10-11"
```

#### Scene setup and branch conditions

- **Scene ID**: VN-LT-012
- **Location**: Tide Archives, outer wing bridge
- **Branch options**:
  1. _Ask Mara about the Depth Scroll's emotional echo_: Requires Water-gate awareness >= 1. Unlocks hidden dialog regarding ancient grief.
  2. _Observe the coral spire drainage grid_: Unlocks technical lore on Archive maintenance.
  3. _Inquire about Sable's research_: Triggers guarded response; modifies trust index with Sable (-1).

---

## World Proof Lab outline and verification execution

The World Proof Lab is an environment for testing world continuity, validating sourced claims, and ensuring lore integrity before publication.

### Core verification steps

1. **Schema validation**: Confirm every markdown artifact includes required YAML provenance fields.
2. **Claim tracing**: Cross-reference claim identifiers against `docs/canon/` and `book/` source references.
3. **Delta reconciliation**: Run state diffs between campaign ledgers and the primary world state database.
4. **Automated test suite**: Execute Node.js native tests to ensure zero banned words and 100% sentence case heading compliance across all day-1 library assets.

### Execution command and output protocol

```bash
# Run local verification gate for day-1 library assets
node --test scripts/tests/day-1-library.test.mjs
```

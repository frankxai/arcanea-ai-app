---
title: "Opus 4.7 stats and Arcanea AI model entry"
uuid: a63e7f0d-460f-406c-929d-3665c8846847
created: 2026-04-16T15:44:04.616549Z
updated: 2026-04-16T15:47:13.923150Z
source: claude.ai export
---

# Opus 4.7 stats and Arcanea AI model entry

**Frank**:

Uh hello opus 4.7 what are your stats and make entry for arcanea ai model arena

**Claude**:

```
This block is not supported on your current device yet.
```

**Claude Opus 4.7 — Arena Entry Card**

*Self-report, post-launch sweep (Apr 16, 2026)*

---

**Lineage**: Anthropic / Claude 4.7 family / flagship. Model string: `claude-opus-4-7`.

**Pricing**: $5 / $25 per million tokens (in/out), unchanged from Opus 4.6.

**Core stats (vs Opus 4.6 → vs field)**:
- SWE-bench Pro: 64.3% (↑ from 53.4%). GPT-5.4: 57.7%. Gemini 3.1 Pro: 54.2%
- SWE-bench Verified: 87.6% (↑ from 80.8%). Gemini 3.1 Pro: 80.6%
- GPQA Diamond: 94.2%. GPT-5.4 Pro: 94.4%. Gemini 3.1 Pro: 94.3% — contested top
- BrowseComp (agentic search): 79.3% — GPT-5.4 Pro leads at 89.3%
- Low-effort 4.7 ≈ medium-effort 4.6. +13% resolution on 93-task internal coding bench
- XBOW visual-acuity: 98.5% vs 54.5% on 4.6 — step change, not increment
- Databricks OfficeQA Pro: 21% fewer errors than 4.6 on document reasoning

**Differentiators**:
- Image resolution >3× Opus 4.6
- Designed for long, unsupervised agentic runs with self-verification before reporting back
- Cleaner code generation — fewer wrapper functions, less fallback scaffolding, self-correcting mid-generation
- Cyber capabilities intentionally reduced in training vs Mythos Preview; Cyber Verification Program for legitimate security work

**Ceiling**: Mythos Preview — Anthropic's internal frontier, closed-group access only — is the one model positioned to beat 4.7 broadly. Connects to your Project Glasswing outreach draft.

**Known weakness**: Agentic browsing. GPT-5.4 Pro holds BrowseComp by ~10pts. Route browse-heavy agents elsewhere or scaffold with Logan's local agent infrastructure.

---

**Arcanea AI Model Arena — proposed schema entry**:

```yaml
model_id: claude-opus-4-7
vendor: anthropic
family: claude-4.7
tier: flagship
release_date: 2026-04-16
context_window: 200k  # verify in docs
price_in_per_mtok: 5.00
price_out_per_mtok: 25.00
modalities: [text, vision]
vision_resolution_multiplier_vs_prior: 3.0
arena_scores:
  swe_bench_pro: 64.3
  swe_bench_verified: 87.6
  gpqa_diamond: 94.2
  browse_comp: 79.3
  xbow_visual_acuity: 98.5
  databricks_officeqa_pro_delta: -0.21  # error reduction vs 4.6
arcanea_role_fit:
  acos_orchestrator: primary
  mythos_drafting: primary
  agent_swarm_lead: primary
  long_horizon_codegen: primary
  browsing_agent: secondary  # prefer GPT-5.4 or local scaffolded
  low_latency_creative: route_to_sonnet_4_6
mcp_native: true
mcp_token_overhead_vs_4_5: -0.30
internal_notes: |
  Low-effort 4.7 ≈ medium-effort 4.6. Default to low-effort for cost,
  escalate on SWE or multi-hour agent runs. Sonnet 4.6 handles volume,
  Haiku 4.5 handles latency-critical paths.
strategic_flag: |
  Mythos Preview is the ceiling. Glasswing outreach is the access vector.
```

Want this dropped into Linear (ARC-prefix) or Notion Command Center as the first canonical row of the arena? I can also generate the Sonnet 4.6 and Haiku 4.5 sibling rows in one pass so the arena launches with the full Anthropic triad instead of one entry.

**Frank**:

Notion command center and we have workflow for this always to trigger model Arena and Blog article but with Claude code slashcommands and multi agent system i have build on my Lenovo?

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Context locked. You have the pattern — but the canonical workflow isn't in memory. Let me pressure-test.

---

**Decision gate before I build:**

The Model Arena + Blog workflow isn't just a slash command — it's a **content pipeline primitive** that should compound. Proposing this architecture:

```
/model-arena-entry [model-slug]
    ↓
┌─────────────────────────────────────────────────┐
│  ORCHESTRATOR (main CC thread)                  │
│  Lenovo local, headless mode, Claude Opus 4.7   │
└─────────────────────────────────────────────────┘
    ↓ Task() dispatches parallel subagents
    
    ┌─────────────┬──────────────┬──────────────┐
    ▼             ▼              ▼              ▼
@researcher   @benchmark-   @arcanea-      @blog-
(web_search   analyst       positioner     writer
 + fetch)     (parse cards, (SIS-lens:     (@frankx
              normalize     where does     voice,
              to arena      this fit in    structured
              schema)       ACOS, agents,  outline)
                            Mythos delta)
    ↓             ↓              ↓              ▼
    └─────────────┴──────────────┴─────────┐    │
                                            ▼    ▼
                              ┌──────────────────────────┐
                              │  @notion-sync            │
                              │  writes to Command       │
                              │  Center → Model Arena DB │
                              │  (32c26ac2b7f68112...)   │
                              └──────────────────────────┘
                                            ↓
                              ┌──────────────────────────┐
                              │  @publisher              │
                              │  MD → frankx.ai blog     │
                              │  → Postiz queue          │
                              │  → @arcanea /@frankx.ai  │
                              │    social variants       │
                              └──────────────────────────┘
```

**Three questions that collapse the option space:**

1. **Where does the Model Arena actually live?** Notion database as system of record, or MD files in `frankxai/arcanea` with Notion as mirror? The second is Arcanea-native (MD is source of truth, already established). First is faster to ship. You can't have both authoritative.

2. **Blog voice — @frankx.ai architect OR @arcanea mythic?** Model benchmarks are enterprise-adjacent content. My read: `@frankx.ai` primary (architect comparing tools honestly), `@arcanea` never touches this — Arcanea shouldn't rank models, it uses them. Confirm or override.

3. **Trigger surface — just `/model-arena-entry`, or the broader pattern?** If we're building it, we should generalize: `/content-pipeline [type] [subject]` where `type ∈ {model-arena, tool-review, architecture-decision, field-report}`. All share the same subagent graph, different prompts. One command, composable outputs. This is the Arcanea-grade move.

---

**What I'd build if you say go:**

Three files into your `riemer-os` / `arcanea` repo pattern:

```
.claude/commands/
  model-arena.md              # the slash command
.claude/agents/
  benchmark-researcher.md     # subagent: web research + fetch
  arena-positioner.md         # subagent: SIS/ACOS framing
  content-publisher.md        # subagent: MD → Notion → blog → social
docs/
  model-arena-schema.md       # canonical YAML schema (the one from prior turn)
```

Plus the first populated entry: `models/claude-opus-4-7.md` using the card I already generated.

**Answer the three questions in one line each and I ship the full set as copy-paste-ready artifacts for your Lenovo.** Or if you want me to make the calls and you'll override on review — say "you decide" and I'll pick the higher-abstraction option on each and build.

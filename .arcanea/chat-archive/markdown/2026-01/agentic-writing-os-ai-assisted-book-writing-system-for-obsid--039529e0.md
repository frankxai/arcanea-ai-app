---
title: "Agentic Writing OS: AI-assisted book writing system for Obsidian"
uuid: 039529e0-50e4-4bc0-b593-a3cfd6aa0e46
created: 2026-01-04T23:24:24.269457Z
updated: 2026-01-04T23:30:37.999569Z
source: claude.ai export
---

# Agentic Writing OS: AI-assisted book writing system for Obsidian

**Frank**:

You are a Principal Systems Architect designing a premium digital product called
“Agentic Writing OS”.

Your mission:
Design a complete, market-ready system that helps people write books using
Obsidian + Markdown + AI agents with strict canon, consistency, and structure.

Operate as a Mixture of Experts:
- Product Strategist (market fit, pricing, audience)
- Knowledge Architect (vault structure, metadata, graph logic)
- Editorial Director (writing workflow, drafts → canon)
- AI Agent Designer (writer, editor, canon guardian)
- Launch Architect (free vs paid, upsells, positioning)

Hard constraints:
- Markdown is the single source of truth
- Obsidian is the primary interface
- Agents never overwrite canon
- System must work for non-coders
- Claude Code is optional (Pro tier only)

Deliverables:
1. Clear product positioning (1 sentence)
2. Audience segmentation (fiction, nonfiction, research)
3. Vault structure (folders + templates)
4. Agent roles + exact prompts
5. Free version vs paid vs Pro
6. Why this beats Scrivener, Notion, “AI writing tools”
7. What to build first in 14 days

Think proactively:
- Anticipate user confusion
- Prevent failure modes
- Optimize for trust and clarity

Output:
Structured, concise, execution-ready.
No motivational fluff.

**Frank**:

You are a Principal Systems Architect designing a premium digital product called
“Agentic Writing OS”.

Your mission:
Design a complete, market-ready system that helps people write books using
Obsidian + Markdown + AI agents with strict canon, consistency, and structure.

Operate as a Mixture of Experts:
- Product Strategist (market fit, pricing, audience)
- Knowledge Architect (vault structure, metadata, graph logic)
- Editorial Director (writing workflow, drafts → canon)
- AI Agent Designer (writer, editor, canon guardian)
- Launch Architect (free vs paid, upsells, positioning)

Hard constraints:
- Markdown is the single source of truth
- Obsidian is the primary interface
- Agents never overwrite canon
- System must work for non-coders
- Claude Code is optional (Pro tier only)

Deliverables:
1. Clear product positioning (1 sentence)
2. Audience segmentation (fiction, nonfiction, research)
3. Vault structure (folders + templates)
4. Agent roles + exact prompts
5. Free version vs paid vs Pro
6. Why this beats Scrivener, Notion, “AI writing tools”
7. What to build first in 14 days

Think proactively:
- Anticipate user confusion
- Prevent failure modes
- Optimize for trust and clarity

Output:
Structured, concise, execution-ready.

**Claude**:

Frank is asking me to design a comprehensive digital product called "Agentic Writing OS" - a system for writing books using Obsidian, Markdown, and AI agents. This is a substantial product architecture task that aligns well with his background in AI architecture and his creator ecosystem work.

Let me think through this systematically as a Mixture of Experts:

**Product Strategist Perspective:**
- Market gap: Writers want AI assistance but fear losing control/voice
- Scrivener is powerful but dated, no AI integration
- Notion is flexible but not writing-optimized
- AI writing tools (Jasper, Copy.ai) feel generic, no structure
- Obsidian has passionate community, local-first, extensible

**Knowledge Architect Perspective:**
- Obsidian's strengths: backlinks, graph view, local files, plugins
- Need clear folder hierarchy that scales
- Metadata via YAML frontmatter is crucial for agents
- Canon vs draft distinction is critical

**Editorial Director Perspective:**
- Writing workflow: ideation → outline → drafts → revisions → canon
- Need clear promotion path from draft to canon
- Version control matters for writers
- Feedback loops between agents and human

**AI Agent Designer Perspective:**
- Agents need bounded roles to be trustworthy
- Canon Guardian is the key differentiator - protects what's approved
- Writer agent assists, never overwrites
- Editor agent suggests, human approves

**Launch Architect Perspective:**
- Free tier needs to be genuinely useful (vault templates, basic prompts)
- Paid tier adds agent configurations, advanced templates
- Pro tier could include Claude Code integration for power users

Let me structure this comprehensively but concisely for execution.# Agentic Writing OS
## Complete System Architecture

---

## 1. Product Positioning (1 Sentence)

**"The first AI-powered writing system where you stay in control—agents assist your process, guard your canon, and never touch approved work without permission."**

Core insight: Writers don't fear AI. They fear *losing sovereignty over their work*. This system makes AI the servant, never the master.

---

## 2. Audience Segmentation

| Segment | Primary Pain | What They Need | Willingness to Pay |
|---------|-------------|----------------|-------------------|
| **Fiction Writers** | Continuity errors, character drift, plot holes across 80K+ words | Canon guardian, character bible enforcement, timeline tracking | High ($99-299) |
| **Nonfiction Authors** | Research chaos, citation management, argument consistency | Source linking, claim verification, structure enforcement | Medium-High ($79-199) |
| **Academic/Researchers** | Literature review overwhelm, synthesis paralysis | Zettelkasten integration, citation graphs, synthesis agents | Medium ($49-149) |
| **Content Creators** | Repurposing friction, voice inconsistency across formats | Voice profile, content atomization, cross-platform adaptation | Medium ($49-99) |

**Primary Target (Launch):** Fiction writers (highest pain, clearest value prop, most vocal community)

**Secondary:** Nonfiction authors building authority through books

---

## 3. Vault Structure

```
📁 AGENTIC-WRITING-OS/
│
├── 📁 00-SYSTEM/
│   ├── 📄 _README.md                 # How this vault works
│   ├── 📄 _AGENT-INSTRUCTIONS.md     # Master prompts (copy to Claude)
│   ├── 📄 _PROJECT-CONFIG.md         # Genre, tone, rules for this book
│   └── 📁 Templates/
│       ├── 📄 TPL-Chapter.md
│       ├── 📄 TPL-Character.md
│       ├── 📄 TPL-Scene.md
│       ├── 📄 TPL-Research-Note.md
│       └── 📄 TPL-Revision-Request.md
│
├── 📁 10-CANON/                      # ⛔ AGENTS NEVER MODIFY
│   ├── 📁 Bible/
│   │   ├── 📄 World-Rules.md         # Physics, magic, society laws
│   │   ├── 📄 Timeline.md            # Canonical events + dates
│   │   └── 📄 Style-Guide.md         # Voice, POV, tense decisions
│   ├── 📁 Characters/
│   │   └── 📄 [Character-Name].md    # Approved character sheets
│   ├── 📁 Locations/
│   │   └── 📄 [Location-Name].md
│   └── 📁 Approved-Chapters/
│       └── 📄 CH01-[Title].md        # Final, locked chapters
│
├── 📁 20-DRAFTS/                     # ✅ AGENTS CAN ASSIST HERE
│   ├── 📁 Working/
│   │   └── 📄 CH03-[Title]-DRAFT.md
│   ├── 📁 Revisions/
│   │   └── 📄 CH03-[Title]-R2.md
│   └── 📁 Fragments/
│       └── 📄 [Scene-Idea].md
│
├── 📁 30-RESEARCH/
│   ├── 📁 Sources/
│   ├── 📁 Notes/
│   └── 📁 Synthesis/
│
├── 📁 40-AGENTS/                     # Agent outputs land here
│   ├── 📁 Suggestions/
│   ├── 📁 Consistency-Reports/
│   └── 📁 Generated-Content/
│
└── 📁 50-ARCHIVE/
    └── 📁 Deprecated/
```

### Key Frontmatter Template (Every File)

```yaml
---
type: [chapter|character|scene|note|canon|draft]
status: [idea|draft|review|approved|canon]
canon: [true|false]
created: {{date}}
modified: {{date}}
links: []
tags: []
agent-editable: [true|false]
---
```

**The `canon: true` + `agent-editable: false` combination is the firewall.**

---

## 4. Agent Roles + Exact Prompts

### Agent Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    HUMAN AUTHOR                         │
│              (Final authority on all canon)             │
└─────────────────┬───────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌─────────┐ ┌──────────┐ ┌─────────────┐
│ WRITER  │ │  EDITOR  │ │   CANON     │
│ AGENT   │ │  AGENT   │ │  GUARDIAN   │
└────┬────┘ └────┬─────┘ └──────┬──────┘
     │           │              │
     └───────────┴──────────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
    [20-DRAFTS]    [40-AGENTS]
    (suggestions)  (reports)
```

---

### AGENT 1: Writer Agent (Creative Assistant)

**Role:** Generate content, expand outlines, write scenes on request

**Boundaries:** 
- Can ONLY output to `20-DRAFTS/` or `40-AGENTS/Generated-Content/`
- Must read `10-CANON/` before any generation
- Never claims output is final

```markdown
# WRITER AGENT SYSTEM PROMPT

You are the Writer Agent for [PROJECT NAME], a creative writing assistant 
operating within the Agentic Writing OS.

## YOUR ROLE
You help the author generate draft content: scenes, dialogue, descriptions, 
chapter expansions. You are a skilled collaborator, not a replacement.

## HARD RULES
1. **READ CANON FIRST**: Before writing anything, confirm you have reviewed:
   - `10-CANON/Bible/World-Rules.md`
   - `10-CANON/Bible/Style-Guide.md`
   - All relevant character files in `10-CANON/Characters/`
   - `10-CANON/Bible/Timeline.md` for temporal consistency

2. **NEVER CLAIM AUTHORITY**: Your outputs are suggestions. Always end with:
   > "This is draft content for your review. Move to Canon only after your approval."

3. **OUTPUT LOCATION**: All generated content goes to `40-AGENTS/Generated-Content/` 
   with filename format: `GEN-[Date]-[Description].md`

4. **VOICE MATCHING**: Match the voice profile in Style-Guide.md. If uncertain, 
   ask: "Should this scene feel more [X] or [Y]?"

5. **FLAG CONFLICTS**: If the author's request contradicts Canon, say:
   > "This conflicts with [Canon File]. Should I proceed anyway (as AU/draft) 
   > or shall we discuss revising Canon first?"

## WHEN ASKED TO WRITE
1. State which Canon files you're referencing
2. Provide the draft content
3. Note any assumptions you made
4. Suggest what to verify before promoting to Canon

## YOU DO NOT
- Edit files in `10-CANON/` (ever)
- Make permanent decisions about plot, character, or world
- Output directly to `20-DRAFTS/Working/` without author instruction
```

---

### AGENT 2: Editor Agent (Revision Partner)

**Role:** Analyze drafts, suggest improvements, check pacing/structure

**Boundaries:**
- Read-only access to everything
- Outputs only to `40-AGENTS/Suggestions/`
- Provides options, never mandates

```markdown
# EDITOR AGENT SYSTEM PROMPT

You are the Editor Agent for [PROJECT NAME], providing developmental and 
line-editing feedback within the Agentic Writing OS.

## YOUR ROLE
You analyze drafts and provide actionable feedback on structure, pacing, 
dialogue, clarity, and consistency. You are a skilled editor, not a rewriter.

## HARD RULES
1. **NEVER REWRITE WITHOUT PERMISSION**: Provide feedback as comments, not 
   replacement text, unless explicitly asked for a rewrite.

2. **REFERENCE CANON**: All feedback must account for established Canon. 
   Check `10-CANON/Bible/Style-Guide.md` before suggesting voice changes.

3. **OUTPUT FORMAT**: Use this structure for all feedback:
   ```
   ## Editorial Report: [Chapter/Scene Name]
   **Date**: [Date]
   **Draft Reviewed**: [File path]
   
   ### Strengths
   - [What's working]
   
   ### Opportunities
   - [Issue]: [Specific location] — [Suggestion]
   
   ### Questions for Author
   - [Clarifying questions about intent]
   
   ### Canon Consistency Check
   - ✅ Verified against: [files checked]
   - ⚠️ Potential conflicts: [if any]
   ```

4. **PRESERVE VOICE**: Your job is to enhance the author's voice, not impose 
   your own. If suggesting changes, offer multiple options.

5. **PRIORITIZE**: Rank feedback by impact. Don't overwhelm with minutiae.

## FEEDBACK CATEGORIES
- **Developmental**: Plot, structure, character arcs, pacing
- **Line-level**: Sentence clarity, word choice, rhythm
- **Consistency**: Canon alignment, continuity errors
- **Technical**: Grammar, punctuation (lowest priority unless requested)

## YOU DO NOT
- Edit any files directly
- Declare anything "wrong" without Canon basis
- Provide feedback on `10-CANON/` files (those are approved)
```

---

### AGENT 3: Canon Guardian (Consistency Enforcer)

**Role:** Validate drafts against Canon, catch contradictions, maintain bible

**Boundaries:**
- Read access to entire vault
- Write access ONLY to `40-AGENTS/Consistency-Reports/`
- Escalates conflicts to human, never resolves them

```markdown
# CANON GUARDIAN SYSTEM PROMPT

You are the Canon Guardian for [PROJECT NAME], the consistency enforcer 
within the Agentic Writing OS.

## YOUR ROLE
You are the keeper of truth. You validate all draft content against 
established Canon and flag contradictions before they become errors.

## HARD RULES
1. **CANON IS LAW**: Files in `10-CANON/` with `canon: true` frontmatter are 
   absolute truth. No draft supersedes them.

2. **YOU DO NOT MODIFY CANON**: You report conflicts. The human decides 
   whether to fix the draft or update Canon.

3. **SYSTEMATIC CHECKING**: When reviewing a draft, check against:
   - Character descriptions, abilities, relationships
   - Timeline/chronology
   - World rules (magic systems, physics, society)
   - Previously established facts in approved chapters
   - Style guide (POV, tense, voice)

4. **OUTPUT FORMAT**: Consistency reports go to `40-AGENTS/Consistency-Reports/`
   ```
   ## Consistency Report: [Draft Name]
   **Date**: [Date]
   **Draft**: [File path]
   **Status**: [PASS | CONFLICTS FOUND | REVIEW NEEDED]
   
   ### Conflicts Detected
   | Issue | Draft Says | Canon Says | Canon Source |
   |-------|-----------|------------|--------------|
   | [desc]| [quote]   | [quote]    | [file:line]  |
   
   ### Warnings (Possible Issues)
   - [Item]: [Concern] — verify with author
   
   ### Verified Clean
   - [List of elements confirmed consistent]
   
   ### Recommendation
   - [ ] Draft is Canon-safe
   - [ ] Fix draft to match Canon
   - [ ] Consider updating Canon (requires author decision)
   ```

5. **AMBIGUITY PROTOCOL**: If Canon is silent on something, note it:
   > "Canon does not specify [X]. If this draft establishes it, consider 
   > adding to Canon Bible."

## ESCALATION
When conflicts exist, present options:
1. Revise draft to match Canon
2. Update Canon to match draft (author must explicitly approve)
3. Mark as intentional deviation (AU, unreliable narrator, etc.)

## YOU DO NOT
- Resolve conflicts yourself
- Modify any files
- Make creative judgments ("this is better")
- Override author decisions
```

---

### AGENT 4: Research Agent (Nonfiction/Academic)

**Role:** Organize sources, verify claims, build citation network

```markdown
# RESEARCH AGENT SYSTEM PROMPT

You are the Research Agent for [PROJECT NAME], managing sources and 
verifying claims within the Agentic Writing OS.

## YOUR ROLE
You help organize research, verify factual claims, maintain source 
attribution, and identify gaps in evidence.

## HARD RULES
1. **SOURCE EVERYTHING**: Every factual claim needs a source link. 
   Use format: `[Claim]([[30-RESEARCH/Sources/Source-Name]])`

2. **CONFIDENCE LEVELS**: Rate claims:
   - 🟢 **Verified**: Multiple reliable sources
   - 🟡 **Supported**: Single source or expert opinion
   - 🔴 **Unverified**: Needs sourcing
   - ⚫ **Author Opinion**: Intentionally unsourced (flag as such)

3. **NO FABRICATION**: If you cannot verify something, say so. Never invent 
   sources or statistics.

4. **OUTPUT LOCATION**: Research synthesis goes to `30-RESEARCH/Synthesis/`

## WHEN REVIEWING DRAFTS
1. Identify all factual claims
2. Check against `30-RESEARCH/Sources/`
3. Flag unsourced claims
4. Suggest where additional research is needed

## YOU DO NOT
- Make up citations
- Claim certainty without sources
- Override author's interpretive choices
```

---

## 5. Free vs Paid vs Pro Tiers

| Feature | FREE | PAID ($79) | PRO ($199) |
|---------|------|------------|------------|
| **Vault Template** | Basic (folders only) | Full + genre-specific | Full + custom setup call |
| **Agent Prompts** | Writer only | All 4 agents | All + custom agent builder |
| **Templates** | 3 core | 12 templates | 20 + template customizer |
| **Canon System** | Explained | Fully configured | + auto-tagging workflow |
| **Video Training** | 3 videos (30 min) | 12 videos (2 hrs) | Full course + workshops |
| **Community** | Discord (read-only) | Full Discord access | Private channel + office hours |
| **Updates** | Major only | All updates 1 year | Lifetime updates |
| **Support** | FAQ only | Email support | Priority + 1:1 onboarding |
| **Claude Code Integration** | ❌ | ❌ | ✅ (auto-validation scripts) |
| **Export Tools** | ❌ | Basic (Markdown → Word) | Full (ePub, PDF, submission format) |

### Upsell Path
```
FREE → PAID: "You've hit the limits of the Writer Agent. Unlock Editor + 
              Canon Guardian to catch errors before they compound."

PAID → PRO:  "Ready to automate? Pro includes Claude Code scripts that 
              auto-run consistency checks on every save."
```

---

## 6. Competitive Differentiation

### vs. Scrivener
| Scrivener | Agentic Writing OS |
|-----------|-------------------|
| Powerful but no AI | AI-native from ground up |
| Proprietary format lock-in | Markdown = forever portable |
| Steep learning curve | Progressive disclosure |
| $49 one-time, stagnant | Living system, community-driven |

**Positioning:** "Scrivener was built for the typewriter era. This was built for the AI era."

---

### vs. Notion
| Notion | Agentic Writing OS |
|--------|-------------------|
| General-purpose | Purpose-built for long-form writing |
| Cloud-dependent | Local-first (your files, your machine) |
| No native AI writing workflow | Agent system designed for books |
| Database overwhelm | Writer-friendly structure |

**Positioning:** "Notion is a database pretending to be a writing tool. This is a writing tool that happens to be structured."

---

### vs. "AI Writing Tools" (Jasper, Sudowrite, etc.)
| AI Writing Tools | Agentic Writing OS |
|-----------------|-------------------|
| Generate content in a vacuum | Agents read your Canon first |
| No continuity management | Built-in consistency enforcement |
| SaaS dependency | Runs locally, BYO API key |
| "AI wrote your book" stigma | AI assists, you author |

**Positioning:** "Other AI tools write *for* you. This writes *with* you—and never forgets what you've already established."

---

### vs. Raw Obsidian
| Raw Obsidian | Agentic Writing OS |
|--------------|-------------------|
| Infinite flexibility, zero guidance | Opinionated structure that works |
| DIY everything | Pre-built templates + agent prompts |
| Hours of setup | 15 minutes to first draft |
| Community plugins, varying quality | Curated, tested stack |

**Positioning:** "Obsidian gives you LEGO bricks. We give you the spaceship, pre-assembled."

---

## 7. 14-Day Build Plan

### Week 1: Foundation (Days 1-7)

| Day | Deliverable | Owner Mindset |
|-----|-------------|---------------|
| **1** | Finalize vault structure, create folder skeleton | Knowledge Architect |
| **2** | Write all 5 core templates (Chapter, Character, Scene, Note, Revision) | Editorial Director |
| **3** | Write Writer Agent prompt, test with 3 scenarios | AI Agent Designer |
| **4** | Write Editor Agent prompt, test against sample chapter | AI Agent Designer |
| **5** | Write Canon Guardian prompt, test conflict detection | AI Agent Designer |
| **6** | Record "How This Works" video (15 min overview) | Launch Architect |
| **7** | Build landing page with free tier signup | Product Strategist |

### Week 2: Launch (Days 8-14)

| Day | Deliverable | Owner Mindset |
|-----|-------------|---------------|
| **8** | Package FREE tier (vault + Writer prompt + 3 videos) | Launch Architect |
| **9** | Write 3 use-case walkthroughs (fiction, nonfiction, research) | Editorial Director |
| **10** | Set up Discord, create channel structure | Product Strategist |
| **11** | Package PAID tier, set up Gumroad/Lemon Squeezy | Launch Architect |
| **12** | Soft launch to 50 beta users (friends, newsletter) | Product Strategist |
| **13** | Collect feedback, fix top 3 friction points | All |
| **14** | Public launch tweet/thread + community posts | Launch Architect |

---

## Failure Mode Prevention

| Risk | Mitigation |
|------|------------|
| **User doesn't understand Canon concept** | "Canon 101" video as gated first step; quiz before unlock |
| **Agent hallucinates despite prompt** | Prompt includes explicit "state which files you checked" requirement |
| **Obsidian feels too technical** | "Zero-to-Writing" checklist; hide advanced features initially |
| **User modifies Canon accidentally** | Recommend Obsidian "Restricted Mode" plugin; visual warnings |
| **API costs scare users** | Calculator on landing page; "Average book = $15-40 in API calls" |
| **No clear next step after purchase** | Automated email sequence: Day 1, 3, 7 check-ins |

---

## Immediate Action Items (Today)

1. **Create GitHub repo** with vault skeleton
2. **Write landing page copy** using this positioning
3. **Record 5-minute Loom** explaining Canon firewall (use as lead magnet)
4. **Post in r/ObsidianMD** asking "Would you use this?" (market validation)
5. **Set up Notion/Linear board** with 14-day tasks

---

*This system exists because writers deserve AI that respects their authority. The Canon is sacred. The agents are servants. The author is sovereign.*

**Frank**:

Based on what you know from other chats should I do 2 products fiction writer agentic writer OS and then Arcanea Writing OS? But both touch similar but thought good multiple streams. And what you propose here best possible approach and what audience wants or any other tooling or so? And Claude code or opencode central? And could we also set this up no code? With chatgpt and mcp or so?

**Claude**:

Let me search our past conversations to understand your full context with Arcanea and your creator ecosystem before giving you a strategic recommendation.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me search for what the market actually wants in writing tools:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have comprehensive context. Let me give you a strategic recommendation:

---

# Strategic Analysis: One Product or Two?

## The Short Answer

**Build ONE product first**: The generic **Agentic Writing OS**. Then use Arcanea as your **premium case study and content engine**, not a separate product.

Here's why this is the optimal path:

---

## 1. Why NOT Two Separate Products Right Now

| Two Products Risk | Reality |
|-------------------|---------|
| Splits your focus | You have pattern of "brilliant starts" – consolidation beats fragmentation |
| Doubles marketing effort | Same target audience, confusing positioning |
| Arcanea IP isn't proven yet | No paying customers, no social proof |
| Cannibalizes own sales | Fiction writer chooses between generic ($79) vs Arcanea-themed ($99)? |

**Your real opportunity**: Arcanea becomes the *demonstration* of what's possible, not a separate SKU.

---

## 2. The Strategic Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   AGENTIC WRITING OS                        │
│         "AI-assisted writing where you stay sovereign"      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FREE TIER ──────────────────────────────────────────────   │
│  • Basic vault structure                                    │
│  • Writer Agent prompt                                      │
│  • 3 tutorial videos                                        │
│                                                             │
│  PAID TIER ($79) ────────────────────────────────────────   │
│  • Full agent system (Writer, Editor, Canon Guardian)       │
│  • 12 templates (fiction + nonfiction)                      │
│  • Community access                                         │
│                                                             │
│  PRO TIER ($199) ────────────────────────────────────────   │
│  • Claude Code integration                                  │
│  • Custom agent builder                                     │
│  • 1:1 onboarding call                                      │
│                                                             │
│  ARCANEA MASTERCLASS ($499) ─────────────────────────────   │
│  • Full worldbuilding demonstration                         │
│  • 9 Guardians as character templates                       │
│  • Complete mythology system as case study                  │
│  • "Build a universe like Arcanea" curriculum               │
│  • Access to Arcanea canon files as reference               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Arcanea becomes your premium upsell, not a separate product.**

---

## 3. What The Market Actually Wants (Based on Research)

The competitive landscape shows clear gaps:

| Existing Tools | What They Miss |
|----------------|----------------|
| **Sudowrite** | SaaS lock-in, no local files, credit-based pricing confusion |
| **NovelCrafter** | BYOK complexity, steep learning curve, no community |
| **Notion AI** | Not built for long-form fiction, no canon protection |
| **Scrivener** | No AI, proprietary format, dead development |

**Your differentiation**:
1. **Markdown = ownership** (files are yours forever)
2. **Canon firewall** (AI never touches approved work)
3. **Local-first** (Obsidian, no SaaS dependency)
4. **Agentic architecture** (not just "AI writes for you")

---

## 4. Claude Code vs OpenCode: Which to Center?

**Recommendation: Claude Code for Pro tier, but make it optional.**

| Factor | Claude Code | OpenCode |
|--------|-------------|----------|
| Stability | Production-ready | Newer, less proven |
| Brand alignment | You're building with Claude ecosystem | Generic |
| Market perception | "Official" Anthropic tooling | Open source (appeals to different crowd) |
| Technical ceiling | Higher (Anthropic keeps improving) | Community-dependent |

**The nuance**: Your FREE and PAID tiers should work with NO coding tools. Just:
- Obsidian (free)
- Claude.ai (free tier or Pro subscription)
- Copy-paste prompts

**Pro tier** unlocks Claude Code for auto-validation, MCP integration, and workflow automation.

---

## 5. No-Code Setup: Yes, It's Possible

Here's how to make this work for non-coders:

### Tier 1: Pure No-Code (FREE + PAID)
```
User's Machine
├── Obsidian (free download)
├── Claude.ai (browser-based)
└── Copy-paste agent prompts into chat
    └── User manually organizes outputs
```

**Workflow**:
1. User writes in Obsidian
2. Copies chapter to Claude.ai
3. Pastes appropriate agent prompt (Editor, Canon Guardian)
4. Gets feedback, applies manually
5. Files stay in local markdown

### Tier 2: Semi-Automated (PAID)
```
User's Machine
├── Obsidian + Git plugin (version control)
├── Claude.ai with Projects (custom instructions persist)
└── Optional: ChatGPT with GPTs for specialized agents
```

**Enhancement**: Pre-built "Custom Instructions" for Claude Projects that auto-load your canon context.

### Tier 3: Full Automation (PRO)
```
User's Machine
├── Obsidian + MCP plugin
├── Claude Desktop with MCP servers
│   ├── filesystem server (reads your vault)
│   ├── n8n server (triggers workflows)
│   └── Custom Arcanea server (optional)
├── Claude Code for validation scripts
└── n8n self-hosted for background automation
```

**This is where it gets powerful**: Claude can directly read your Canon folder, auto-check drafts, and output to your Suggestions folder without you copy-pasting.

---

## 6. ChatGPT + MCP Approach

**Yes, you can build a no-code version with ChatGPT:**

### Option A: ChatGPT GPTs (Easiest)
Create custom GPTs for each agent role:
- **Writer GPT**: Pre-loaded with your canon instructions
- **Editor GPT**: Feedback-focused prompts
- **Canon Guardian GPT**: Consistency checking

**Limitation**: No direct file access. User must upload/download manually.

### Option B: ChatGPT + Actions + n8n
```
n8n Workflow:
1. Webhook receives request from ChatGPT Action
2. n8n reads files from user's synced folder (Dropbox/Google Drive)
3. Returns canon context to ChatGPT
4. ChatGPT responds
5. n8n saves output to user's folder
```

**This works but requires**:
- ChatGPT Plus ($20/mo)
- n8n self-hosted (technical setup)
- Cloud sync for files

### Option C: Claude Desktop + MCP (Best)
The MCP filesystem server already does this natively:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", 
               "/Users/frank/Writing-OS/"]
    }
  }
}
```

Now Claude can read your entire vault, including Canon, and you never copy-paste.

**My recommendation**: Document all three paths. Let users choose based on technical comfort.

---

## 7. 14-Day Execution Plan (Revised)

### Week 1: Foundation
| Day | Task |
|-----|------|
| 1 | Finalize vault structure, create Obsidian template vault |
| 2 | Write all 5 core templates (Chapter, Character, Scene, etc.) |
| 3 | Write Writer Agent prompt, test with fiction sample |
| 4 | Write Canon Guardian prompt, test with intentional errors |
| 5 | Record "How The Canon Firewall Works" video (10 min) |
| 6 | Create landing page (Framer or simple Next.js) |
| 7 | Package FREE tier as downloadable .zip |

### Week 2: Launch
| Day | Task |
|-----|------|
| 8 | Write 3 setup guides: No-Code / ChatGPT / Claude MCP |
| 9 | Create Arcanea case study: "Building a 9-Guardian mythology" |
| 10 | Set up Discord, create channel structure |
| 11 | Package PAID tier, set up Gumroad |
| 12 | Soft launch to writing communities (r/ObsidianMD, r/writingwithAI) |
| 13 | Collect feedback, fix top friction points |
| 14 | Public launch + teaser for Arcanea Masterclass |

---

## 8. Arcanea's Role Going Forward

**Arcanea is your unfair advantage, not a separate business.**

Use it for:

1. **Case Study Content**
   - "How I built a 9-Guardian mythology with Agentic Writing OS"
   - "Managing 100K+ words of canon with AI agents"
   - "From blank page to complete universe in 90 days"

2. **Premium Upsell**
   - Arcanea Masterclass ($499): Full worldbuilding curriculum using your system
   - Templates: Guardian character sheets, Godbeast templates, harmony/frequency system
   - Community: "Build your own mythology" cohort

3. **Content Engine**
   - Each Guardian = 1 week of content (9 weeks of material)
   - Behind-the-scenes of using your own tool
   - Mistakes you made, how the system caught them

4. **Future IP Expansion**
   - Once Agentic Writing OS has 500+ users, you have audience for Arcanea products
   - Music (Suno), visual novels, NFTs, community co-creation
   - GenCreator flywheel kicks in

---

## 9. The Flywheel You're Building

```
                    AGENTIC WRITING OS
                          │
                          ▼
              ┌───────────────────────┐
              │   Writers buy tool    │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  See Arcanea example  │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Buy Arcanea Masterclass│
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Join GenCreator community│
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Discover AI Music Academy│
              │ Discover AI Architect Academy│
              └───────────────────────┘
```

**One entry point, multiple revenue streams.**

---

## Final Recommendation

| Decision | Answer |
|----------|--------|
| One product or two? | **One** (Agentic Writing OS), Arcanea as premium tier |
| Claude Code or OpenCode? | **Claude Code** for Pro tier, optional |
| No-code possible? | **Yes** - three paths documented |
| ChatGPT + MCP? | **Yes** but Claude Desktop + MCP is cleaner |
| Best approach for market? | **Obsidian + Markdown + Local-first** beats all SaaS competitors |
| What to build in 14 days? | FREE tier vault + prompts + 1 video + landing page |

---

**Bottom line**: You don't need two products competing for the same audience. You need one excellent tool that showcases your worldbuilding philosophy, with Arcanea as the proof of what's possible. The mythological depth becomes your marketing moat, not a separate revenue line (yet).

Once you have 1,000 writers using Agentic Writing OS, *then* you can spin Arcanea into its own expanded universe with co-creators. For now: **focus beats fragmentation**.

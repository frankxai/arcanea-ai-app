---
title: "Guardian council music distribution system"
uuid: c6a44786-7d1f-4cd6-b8a4-5d7755553a78
created: 2026-02-22T17:01:44.806640Z
updated: 2026-02-22T18:03:41.637680Z
source: claude.ai export
---

# Guardian council music distribution system

**Frank**:

Around building a PRT building with Cloud World or Cloud Code however, this works in the best possible way, what we have determined there. Research them, the other plans that we have. Yeah. Please let me know what's the ideal strategy. That which we should put into action for next week. That when I produce a new song, create social medias, post or something like this, these agents can distribute them on all channels in the best possible way professionally. Well thought out, a council of marketing and design grants. Who help monitor and manage all of this for me.

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Good context. The music distribution chat from Feb 16 is the most relevant — you've already got the core architecture mapped. Let me synthesize the actual next-week execution plan.

---

## The Architecture: "Guardian Council" Content Distribution System

Your stack is already determined: **n8n (Railway) + Claude API + MCP servers + platform APIs**. The question is just build sequence.

---

### The Mental Model

Think of it as three layers:

**Intake** → you create a song/post/visual and drop it somewhere (Notion, a folder, a webhook)
**Council** → specialized Claude agents process it: one for copy, one for platform strategy, one for visual brief, one for scheduling logic
**Dispatch** → n8n routes the output to each channel with platform-native formatting

The "council of marketing and design agents" you described maps exactly to this: each agent has a role, a persona if you want (Lyssandria handles aesthetic decisions, etc.), and a SKILL.md that constrains its behavior.

---

### Next Week: What to Actually Build

**Monday/Tuesday — Core workflow skeleton**

Build one end-to-end path in n8n: Suno RSS/webhook → Claude API (copy generation) → Reddit post. This proves the pipe. Don't touch Instagram or TikTok yet.

The Claude node prompt should be role-differentiated: "You are FrankX's distribution strategist. Given this song title, genre, and mood, generate platform-specific copy for [platform]." One call per platform variant, or a structured JSON output you parse downstream.

**Wednesday — Platform expansion + SKILL.md files**

Write three Claude Code SKILL.md files:
- `music-distribution.md` — how to write copy for each platform, tone per brand (FrankX vs Arcanea vs AI Music Academy), hashtag logic
- `visual-brief.md` — how to generate Midjourney/image prompt from song metadata  
- `scheduling-logic.md` — posting time optimization per platform

These become the persistent intelligence layer. Claude Code reads them when building or debugging workflows.

**Thursday — Guardian Council structure**

Assign agent roles explicitly in your n8n workflow as separate Claude API calls:
- **Strategist** (which channels, when, which audience angle)  
- **Copywriter** (platform-native text)
- **Visual Director** (image prompt or asset brief)
- **Scheduler** (optimal timing, queue management)

Each is a separate node with a distinct system prompt. This is your "council" — not a metaphor, a literal workflow structure.

**Friday — Monitoring layer**

One n8n workflow that pings you daily with: what posted, what performed, what failed. Slack or Notion. Keeps the system auditable without you babysitting it.

---

### The Claude Code vs Claude.ai Distinction

Use **Claude Code** to *build* the n8n workflows and SKILL.md files — it's your architect.
Use **Claude API inside n8n** as the runtime council — it's the executing intelligence.
Claude.ai (here) is your strategic sounding board — use it to think, not to ship.

---

### One Decision You Need to Make Now

Your three brands have different aesthetics and audiences. The distribution system needs to know: **does one song get posted under all three brands with different angles, or does each brand have its own content calendar?**

That's the architectural fork. If cross-brand, you need a brand-routing agent as the first node. If single-brand-per-content-type, the workflow is simpler and you can layer multi-brand later.

Which is it?

**Frank**:

I want to use claude code node within n8n. And also have additional openclaw workers that help abd make this whole system bigger and more genius

**Claude**:

```
This block is not supported on your current device yet.
```

Good. The architecture is clear from prior context. Here's the precision build plan:

---

## The Stack: n8n + Claude Code Node + OpenClaw Workers

### How These Three Layers Actually Relate

```
OpenClaw (always-on, messaging interface)
    ↓ triggers via webhook
n8n (orchestrator + workflow logic)
    ↓ Claude Code node (builds/modifies workflows, writes SKILL.md)
    ↓ Claude API nodes (council agents — copy, strategy, visual brief)
    ↓ platform dispatch (Reddit, Instagram, Buffer, etc.)
```

OpenClaw is your **command interface** — you message it on WhatsApp/Telegram and it triggers n8n. n8n is the **nervous system**. Claude Code node inside n8n is the **builder agent** that can write new workflows and skills on demand. The council agents are **specialized Claude API calls** with role-specific system prompts.

---

### The Claude Code Node in n8n — What This Actually Means

There's an important distinction: n8n doesn't have a native "Claude Code" node. What you're building is:

**Option A (Practical now):** n8n → SSH/shell node → executes `claude` CLI on your Railway server → output piped back into workflow

**Option B (Cleaner):** n8n → HTTP Request node → Claude API with a system prompt that *instructs it to act as a code/build agent* → structured JSON output → downstream nodes execute it

**Option C (Most powerful):** n8n → MCP node → Claude Code running as an MCP server → Claude Code has filesystem access and can write SKILL.md files, generate new n8n workflow JSONs, push to GitHub

Option C is the architecture you want. Claude Code as an MCP server that n8n can call. It means your distribution system can **self-modify** — when a new platform needs a workflow, the Claude Code MCP writes the n8n workflow JSON and imports it.

---

### OpenClaw Workers — The Expansion Layer

Each OpenClaw worker is a distinct agent persona running its own OpenClaw instance with a different SOUL.md. In your case:

- **Distribution Worker** — handles posting logic, timing, platform rules
- **Copy Worker** — generates all text variants per platform
- **Visual Worker** — generates image prompts, briefs for Midjourney
- **Analytics Worker** — monitors performance, reports back

These run in parallel. n8n routes tasks to them via webhook. Each reports back with structured output. The "council" is literally this — n8n fans out to all four, collects responses, synthesizes into a publish-ready package.

---

### Next Week Build Sequence

**Day 1-2: Core pipe**
Get one OpenClaw instance running on Railway (separate service from n8n). Wire it to Telegram. Confirm you can message it and it triggers an n8n webhook. That's the proof of command flow.

**Day 3: Claude Code MCP server**
Run `claude` with `--mcp` flag on your Railway instance. Connect n8n to it via HTTP. Test: send it a task ("write a Reddit post for this song metadata") and confirm structured output returns to n8n.

**Day 4: Council architecture**
Build four separate Claude API nodes in n8n with differentiated system prompts — your four workers. Each gets the same input (song metadata), each returns its specialized output. Merge node collects all four.

**Day 5: First end-to-end**
Suno RSS → n8n → Council (4 parallel Claude calls) → OpenClaw worker dispatches to Reddit + schedules Instagram via Buffer API. Log everything to Supabase.

---

### The One Configuration Decision

OpenClaw workers can either be **stateless** (each run is fresh) or **stateful** (persistent memory via their SOUL.md + memory file). For the council, stateful is the right call — your Copy Worker should remember which hooks worked on Reddit last week, which subreddits responded, what voice your audience prefers.

That means each worker needs a memory store. Simplest implementation: each OpenClaw worker has a Supabase table it reads/writes. The Analytics Worker updates it. The Copy Worker consults it before generating.

This is the difference between a distribution tool and an intelligent council that gets smarter over time.

---

Confirm which Railway template you're using for n8n — the `n8n-worker` template or the standard one — and I'll give you the exact service configuration for adding OpenClaw as a sibling service.

---
title: "Multi-agent orchestrator workflow system"
uuid: 54ad76a5-a873-409b-bf01-4c23b582ae64
created: 2026-02-27T13:00:26.947845Z
updated: 2026-02-27T13:01:00.375129Z
source: claude.ai export
---

# Multi-agent orchestrator workflow system

**Frank**:

Which also has a voice agent to maybe even a very sophisticated from 11 Labs. They, have a specific API. Where, you know, those agents have a 30 format. Their devices. Something else. Good. Yeah. I'll suggest there. And then I think the key or, yeah, maybe you suggest to me what are the key workflows that we can build combining what you can do. Notes that trigger it. And that need to run and build some of the foundation for COVID. How would we try to achieve, and what we're trying to build across all of the brands that you know about, how do we have different flows for Arcadia, for that person, then we're all unified. Blackmaster, multi agent, orchestrator, can, based on any input that I provide to it, gets triggered from the trigger the right code with the right skill mark and the answer to the PC speakers. Who can help to execute, to plan, and implement, and visually also showcase what has been built in a vision board. Yeah. I think, like, a whiteboard or something that feels so good. Then all of the direct can be logged and visualized there, outputs produced, Yeah. Just a very genius system that you suggests to me that we are building up any NNM templates that you suggest to clone or starting from scratch. Suggest

**Claude**:

# Starlight Intelligence System — Architecture Brief

## The Core Thesis

You're describing a **Brand-Aware Multi-Agent OS** — a single orchestration layer that understands *which brand context is active*, routes inputs to specialized sub-agents, executes with the right tools/voice/persona, and externalizes everything to a living visual canvas.

The master metaphor: **a conductor who knows which orchestra is playing.**

---

## System Architecture

```
INPUT LAYER
  Voice (ElevenLabs Conversational AI) + Text + Webhook triggers
       ↓
STARLIGHT ORCHESTRATOR (n8n Master Router)
  → Brand Context Classifier (Claude)
  → Intent Router → [Plan / Create / Execute / Log]
       ↓
BRAND SUB-AGENTS
  Arcanea Agent      → lore, music briefs, Guardian activations, Suno prompts
  FrankX Agent       → content strategy, LinkedIn, speaking, B2B positioning
  AI Architect Agent → enterprise playbooks, course content, OCI/RAG frameworks
  GenCreator Agent   → community drops, collab briefs, retreat coordination
       ↓
SKILL LAYER (MCP / APIs)
  Suno | ElevenLabs | Notion | Supabase | Vercel | Claude Code | Calendar
       ↓
OUTPUT + LOGGING LAYER
  Notion Vision Board (Kanban + Gallery + Timeline)
  Auto-logged: decision made → output produced → status
```

---

## The Voice Layer (ElevenLabs Conversational AI)

Their API supports **Agents with custom personas, knowledge bases, and tool-calling.** Key design:

- One agent per brand persona (Arcanea speaks differently than FrankX)
- Each agent has a **system prompt** embedding brand voice, active goals, and skill boundaries
- Tool-call out to n8n webhooks → triggers the full downstream execution pipeline
- Response streamed back to speaker — completing the loop

ElevenLabs Conversational AI now supports **custom LLM backends** — meaning you can route through Claude for the reasoning layer while keeping EL for voice synthesis. That's the move.

---

## The 5 Foundation Workflows to Build First

**1. Brand Context Router**
Input → Claude classifies brand + intent → routes to correct sub-agent webhook
Start here. Everything depends on this.

**2. Arcanea Lore-to-Music Pipeline**
Voice/text prompt → Guardian/Vel'Tara context injected → Suno prompt generated → queued → output logged to Notion with metadata

**3. FrankX Content Engine**
Raw idea → Claude drafts LinkedIn/newsletter/script → routed to approval queue → published on confirmation → logged

**4. AI Architect Course Builder**
Topic input → outline generated → slide brief + module structure → Notion page created → linked to course roadmap

**5. Vision Board Auto-Logger**
Every agent output triggers a Notion database write: brand, date, type, status, output link → filtered views per brand + master timeline

---

## The Notion Vision Board Schema

```
Properties:
  Brand          [Arcanea | FrankX | AIA | GenCreator]
  Intent         [Create | Plan | Execute | Reflect]
  Input Summary  [text]
  Output Type    [Song | Post | Lore | Brief | Course Module | Decision]
  Output Link    [URL]
  Agent Used     [Arcanea | FrankX | AIA | Orchestrator]
  Status         [Generated | In Review | Published | Archived]
  Date           [auto]
```

Three views: **Kanban by Status**, **Gallery by Brand**, **Timeline by Date**. This becomes your external memory of everything the system has ever built.

---

## n8n Starting Point

Clone or start from the **AI Agent + Webhook + Notion integration** template, then layer:
- Initial webhook → Claude classifier node → Switch node (brand router) → sub-workflow per brand
- Each sub-workflow is its own n8n workflow, callable as a sub-execution

Don't build monolithically. Each brand agent should be an **independently testable sub-workflow** that the master orchestrator calls. This is where most people collapse complexity — keep the router thin, push logic into the sub-agents.

---

## First Build Sequence

1. Notion Vision Board schema (30 min)
2. Master webhook + Claude brand classifier in n8n (1 hour)
3. Arcanea sub-agent with Suno output + Notion logger (2 hours)
4. ElevenLabs Conversational AI agent for Arcanea, connected to the n8n webhook (1-2 hours)
5. Expand to FrankX agent

The ElevenLabs agent for Arcanea is the highest-signal demo — voice-activated Guardian lore that produces music and logs to a vision board. That's the proof of concept that makes everything else legible.

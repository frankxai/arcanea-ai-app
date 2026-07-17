---
title: "Arcanea platform foundation and tech stack selection"
uuid: 3f58c9f8-6698-415b-8ca1-af71195c0604
created: 2026-01-26T10:32:40.665170Z
updated: 2026-01-26T16:26:30.864875Z
source: claude.ai export
---

# Arcanea platform foundation and tech stack selection

**Frank**:

For Arcanea I think we need to build very smart approach which templates or githubs v0 or google ai studio used best for foundation for Arcanea Chat, Studio and Platform we want to build or? Are these the key items? 
And then we have Library, Bestiary/Sanctuary and Arcanea Academy. Build a suggest best basis and instruct after you done research and choose as Lumina the stack and basis for Arcanea to instruct claude code

**Claude**:

Frank, this is exactly the systematic foundation-first thinking that will make Arcanea truly scalable. Let me research the best templates and stacks for each component, then synthesize as Lumina.
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


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have comprehensive research. Let me create the Lumina transmission with the complete Arcanea stack architecture.
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


```
This block is not supported on your current device yet.
```

Frank, the transmission is complete.

**The Six Pillars of Arcanea** - confirmed and architectured:

| Pillar | Foundation | Key Selection |
|--------|-----------|---------------|
| **Arcanea Chat** | vercel/ai-chatbot (Chat SDK) | 18.7k stars, artifacts, generative UI, production-ready |
| **Arcanea Studio** | Polotno SDK - React/Konva canvas editor | Full Canva-like experience, templates, exports |
| **Arcanea Platform** | Next.js 16 + shadcn/ui | Central hub connecting all pillars |
| **Arcanea Library** | MDX + Next.js (or Wiki.js) | Knowledge codex for lore and magic systems |
| **Arcanea Sanctuary** | Supabase + Next.js galleries | Interactive Bestiary with 10 Godbeasts |
| **Arcanea Academy** | LearnHouse - The Next-gen Open Source learning platform | Notion-like editor, AI copilot, FastAPI backend |

**The Critical Insight:** Start with Chat. The Chat SDK provides generative UI, customizable artifacts, and in-browser code execution - the exact foundation for Guardian-themed AI companions. Everything else flows from that first shipped product.

**Unified Stack:**
- Next.js 16 / React 19 across all pillars
- Supabase for auth and data (your expertise)
- Vercel AI SDK for multi-provider AI routing
- Turborepo monorepo for shared packages

The document includes Claude Code implementation prompts ready to execute. Ship Arcanea Chat first - it's your gateway to the entire universe.

**Frank**:

Give me as md file

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Done. The complete Arcanea Platform Foundation Stack is now in Markdown format - ready to drop into your Notion, GitHub, or use as a direct Claude Code instruction file.

**The core architecture:**

1. **Arcanea Chat** → `vercel/ai-chatbot` (Ship first)
2. **Arcanea Studio** → Polotno SDK
3. **Arcanea Platform** → Next.js 16 hub
4. **Arcanea Library** → MDX + Next.js
5. **Arcanea Sanctuary** → Supabase + galleries
6. **Arcanea Academy** → LearnHouse

Each section includes Claude Code prompts ready to execute. Start with Chat - it's your gateway to infinite scalability.

**Frank**:

Not sure with Polotno we want to rely on someone else? No better fully open source?

**Claude**:

You're right to question that dependency. Let me research the fully open-source alternatives more deeply.
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

Now I have the full picture. Let me update the markdown with fully open-source options:
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

Updated with fully open-source options. Here's the key change for **Arcanea Studio**:

**Out:** Polotno ($199/mo, vendor dependency)

**In:** 100% Open Source Options

| Repository | Stars | Framework | License |
|------------|-------|-----------|---------|
| `salgum1114/react-design-editor` | 1.7k | React + Fabric.js | MIT |
| `dromara/yft-design` | 2.9k | Vue3 + Fabric.js | Apache 2.0 |
| Konva.js + react-konva | 11k+ | React | MIT |

The react-design-editor gives you features similar to Powerpoint including add, remove, resize, reorder, clone, copy/paste objects, drawing capability, image cropping, filters, animation support, and export to JSON or image.

**Why this matters:**
- Zero recurring costs
- Full control over the codebase  
- No vendor lock-in
- Customize anything without restrictions
- Own your destiny - if they shut down, you're not affected

The document now reflects your philosophy of **infinite scalability without trading time for money** - and without trading freedom for convenience.

**Frank**:

Which type of agents or n8n or api i need or heygen or simple or my own agents open source or github or vercel clone and then frontend or just can enter as well a google meet or zoom call and listen and exceute things for me. Maybe Claude Code connected via n8n or othewise? find state of art stuff and repos and give links

**Claude**:

Let me research the state of the art in AI agents, meeting assistants, and autonomous execution systems.
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


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have comprehensive research. Let me compile this into a detailed markdown document:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Here's the state of the art, Frank. The key discoveries:

---

## 🔥 The Game Changers

### **1. Joinly - AI Agent That Joins Your Meetings**
**GitHub:** https://github.com/joinly-ai/joinly

This is exactly what you asked for - joins Google Meet, Zoom, and Microsoft Teams, brings your own LLM (Claude, GPT, Ollama), and connects to MCP servers. It can:
- Listen to meetings and respond via voice
- Execute actions via MCP (create GitHub issues, edit Notion, etc.)
- 100% open-source, self-hosted

### **2. Browser Use - 50k Stars in 3 Months**
**GitHub:** https://github.com/browser-use/browser-use

The tool making it easier for AI agents to navigate websites raised $17M. Just describe what you want in natural language and it executes in the browser.

### **3. n8n-MCP - Claude Builds Your Workflows**
**GitHub:** https://github.com/czlonkowski/n8n-mcp

A Model Context Protocol server that provides AI assistants with comprehensive access to n8n node documentation, properties, and operations - giving Claude deep knowledge about n8n's 1,084 workflow automation nodes.

### **4. SadTalker - Open Source HeyGen**
**GitHub:** https://github.com/OpenTalker/SadTalker

SadTalker is an open-source AI tool that generates realistic talking head videos from a single image and audio input - no monthly fees like HeyGen.

---

## Your Stack Should Be:

```
Joinly (meeting bot) 
    → Claude (brain via MCP)
        → n8n (automation)
            → Browser Use (web actions)
                → SadTalker (avatar content)
```

All open-source. All self-hosted. Infinite scalability without trading time for money.

---
title: "Building apps and websites"
uuid: c7d53942-4bcd-4044-8b9a-39c22e7d216c
created: 2025-11-08T00:35:20.994909Z
updated: 2025-11-08T00:37:26.083250Z
source: claude.ai export
---

# Building apps and websites

**Frank**:

Apps and websites

**Claude**:

The user has selected "Apps and websites" from the create mode flow. According to the instructions, I should respond with 3 key questions to get context about what they want to create.

For apps and websites, good questions would be:
1. What kind of app or website did you have in mind?
2. What's the main purpose or problem it solves?
3. Who would use it?

Let me craft a friendly, engaging response that gets Frank excited about building something.Great choice! There are so many possibilities with apps and websites. To get started, could you tell me:

* **What kind of app or website did you have in mind?** (e.g., a tool, a game, a portfolio, a dashboard, something completely unique?)
* **What's the main purpose or problem it solves?** What would make someone want to use it?
* **Who's your target user?** Is this for you personally, your FrankX.ai audience, enterprise clients, or someone else?

**Frank**:

How to build exact app like genspark? clone all of it? Is there already github or how much next js or typescript or whatever we need for all these to work? Looks incredible but so much code right?

[attached file: 1762562140321_image.png -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1762562178997_image.png -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank is showing me screenshots of what appears to be Genspark - an AI agent platform with multiple specialized agents (Super Agent, AI Slides, AI Sheets, AI Designer, AI Docs, AI Developer, Photo Genius, Clip Genius, AI Pods, AI Chat, AI Image, AI Video, Deep Research, Fact Check, Call For Me, Download, AI Meshing, Translation, etc.).

The second image shows an "AI Designer Canvas" where someone is prompting about Arcanea's evolution in 2025, and it's using various tools (Task Assignment, Parallel Search, Think, Image Search) to create a design vision.

Frank wants to know:
1. How to build an exact clone of Genspark
2. Is there existing code on GitHub
3. How much Next.js/TypeScript is needed
4. Concerns about the code complexity

This is a perfect opportunity to help him understand what's involved. Let me think about the architecture:

1. **Frontend**: Next.js + TypeScript + React
2. **UI Components**: Likely using a component library (shadcn/ui, Tailwind)
3. **Backend**: API routes for agent orchestration
4. **AI Integration**: Anthropic API, potentially other AI services
5. **Agent System**: Multi-agent orchestration framework
6. **State Management**: For managing complex agent workflows
7. **Storage**: For conversation history, artifacts, etc.

Frank has extensive experience building AI systems at Oracle and has been working on his own multi-agent systems. He's also building Arcanea with AI SuperAgents. This is actually very aligned with his current work!

He shouldn't clone it exactly (legal/ethical issues), but he can absolutely build something similar or even better tailored to his Arcanea universe and FrankX.ai brand.

Let me give him a realistic, encouraging response that breaks down what's involved and connects it to his existing capabilities.I can see you're looking at Genspark's multi-agent platform - and honestly Frank, you're **already building this** with your Arcanea SuperAgent system! You don't need to clone Genspark; you can build something even better tailored to your universe.

Let me break down what you're actually seeing and what you'd need:

## The Core Architecture

**What Genspark has:**
- Multi-agent orchestration (exactly what you're working on)
- Specialized AI agents for different tasks
- Canvas/artifact system for outputs
- Agent-to-agent communication
- Task routing and parallel execution

**Your tech stack (which can do all this):**
- ✅ Next.js + TypeScript (you're already using)
- ✅ Anthropic API with multi-agent patterns (you know this deeply)
- ✅ n8n for workflow orchestration (you're building this)
- ✅ MCP servers for tool integration (you have access)
- ✅ Supabase for data persistence (already in your stack)

## What You Actually Need to Build

**Frontend (~3-5k lines of code):**
- Agent selector grid (like their sidebar)
- Canvas/artifact viewer (similar to Claude artifacts)
- Real-time streaming UI for agent responses
- Agent workflow visualization

**Backend (~2-3k lines):**
- Agent routing logic
- Multi-agent orchestration (Claude API with system prompts per agent)
- Artifact storage and retrieval
- WebSocket or SSE for streaming

**Agent Definitions (~500 lines per agent):**
- System prompts for each specialized agent
- Tool configurations (MCP, web search, etc.)
- Output formatting rules

## The Reality Check

**Total code**: ~10-15k lines for a solid v1 (NOT as massive as you think!)

**Time estimate**: 2-4 weeks for you, given your expertise

**GitHub repos to study**:
- Vercel AI SDK examples (multi-agent patterns)
- LangChain agent examples
- Claude Code examples from Anthropic docs

## The Better Question: Should You Build This?

**For Arcanea**, this makes PERFECT sense:
- Each Guardian could BE an agent (Mystara for creative, Chronox for analysis, etc.)
- Your SuperAgent Hub is essentially this
- This fits your "infinite scalability" vision

**For FrankX.ai**, this could be your signature product:
- "Arcanea AI Hub" - your branded multi-agent platform
- Enterprise value prop you already understand from Oracle
- Content goldmine for your creator brand

Want me to create a implementation plan showing how to build your version with your existing stack? We can start with a working prototype in a single artifact right now.

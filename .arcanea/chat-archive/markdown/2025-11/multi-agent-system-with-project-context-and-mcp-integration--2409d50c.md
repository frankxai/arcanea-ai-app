---
title: "Multi-agent system with project context and MCP integration"
uuid: 2409d50c-9f2b-48a0-acf8-d5687fe9cf02
created: 2025-11-07T13:07:54.401014Z
updated: 2025-11-07T13:12:17.149283Z
source: claude.ai export
---

# Multi-agent system with project context and MCP integration

**Frank**:

Hey. Currently, I'm not too happy with the cloth I wish you a voice. Talk back. At the same time, I really appreciate the, CP server connection that you offer. And, yeah, that you can trigger these tools. At the same time, I'm thinking if we should be building, like, a custom system with multi agents. That are each based on the dedicated projects that we are working on. And can trigger actions for the guitar, can trigger a coding, agent, for example, through the MCP server connect. And, yeah, where the large language model also can base its answers based on the complete context of each project that each projects that I open up right, the voice model, everything's tightly interconnected. Is there anything that offers this out of the box? Or, yeah, do we need to custom build custom set this up in some way So this works really seamless.

**Claude**:

I hear your frustration with Claude's voice interface while appreciating the MCP server capabilities. Your vision is actually quite sophisticated - you're describing a context-aware, multi-agent orchestration system where each agent:

1. Has full project context when activated
2. Can trigger specialized sub-agents (coding, actions, etc.) via MCP
3. Maintains state and memory across the project lifecycle
4. Integrates voice interaction seamlessly

**What exists today:**

- **LibreChat** - You're already familiar with this. It has MCP support and multi-agent capabilities, but the project-context awareness and orchestration layer you're describing would need custom work
- **Langchain/LangGraph** - Great for building custom multi-agent systems with state management, but you'd be building from scratch
- **CrewAI/AutoGen** - Multi-agent frameworks, but again require significant custom development
- **Dust.tt** - Comes closest with its "assistants" that can have context and trigger tools, but doesn't have the tight project-based architecture you want

**The reality:** Nothing offers this out-of-the-box the way you're envisioning it.

**What you'd need to build:**

Given your Oracle AI Architect experience and the fact you're already building sophisticated systems with n8n and MCP servers, I think you'd need:

1. **Context Layer**: A system that loads full project context (from Notion/Linear/code repos) when you "open" a project
2. **Router Agent**: Master orchestrator that understands intent and routes to specialized agents
3. **Agent Fleet**: Coding agent, action agent, research agent - each with MCP connections
4. **State Management**: Probably Supabase or similar to maintain conversation/project state
5. **Voice Interface**: Custom integration (Whisper + TTS) since you're unhappy with Claude's current voice

This aligns perfectly with your **Starlight Intelligence System** architecture and could be a flagship product for FrankX.ai.

**The question is**: Do you want to build this as infrastructure for your own work, or is this actually a product opportunity? Because what you're describing sounds like something many AI-forward teams would pay for.

**Frank**:

So let's think about how we practically put this into production. Do we set up LibreChat and through Verso, for example, Does it deliver the capabilities that I need? And then we have 11 laps as the voice model potentially. And can we then set up the project or the agent orchestration so it's interconnected with the GitHub? The virtual deployments, and Notion pages that are connected to each of these projects, or how do we right, like, what's the whole comprehensive setup requirements that we have so this will works pretty well. Yeah. And at the same time, how can we make ourselves autonomous as possible so the agents can also trigger downstream tasks and execute with the MCP servers. Retrieve information so we don't need so many vector embeddings or anything. But all can work a seamless fashion. Through the system that we built. And if we utilize lope chat, do we need to additionally also an item for some of the multi agent workflows or like, creating or maybe that's the main objective. What I misunderstand I misunderstanding that the conceptualization should be happening N8N. I'm currently not an expert within it. So I would like just, yeah, that you suggest also based on all our projects that we before Kenya and more, Each of them have their own project bases. They're on GitHub. Right? Their own, vision. How do we connect this and then everything else that will build up over time with the correct eGentix system And then also very smooth interface. And how much work does it take to build this up? How much cost can we expect through the API calls? I assume, actually, it might be even cheaper. Interacting with this system day by day instead of paying for clothe codes €100 per month or so. So, yeah, it might be worth really worth it to to set this up and make this my primary way of operating. But need your sophisticated proposal how?

**Claude**:

Let me map out a comprehensive production system for you, Frank. This is actually a perfect fit for your AI Architect skillset and could become your primary operating environment.

## **System Architecture Proposal**

### **Core Stack**

**1. LibreChat (Frontend + Orchestration Hub)**
- Hosted on Vercel or your own VPS
- Handles: UI, conversation state, MCP server connections
- Multi-agent/multi-model support built-in
- **Verdict**: Yes, use LibreChat as your primary interface

**2. N8N (Agentic Workflow Orchestration)**
- This is where the magic happens for autonomous multi-agent workflows
- **Purpose**: Create "project agents" that can execute complex workflows autonomously
- Each project (FrankX.ai, Arcanea, AI Architect Academy) gets its own workflow
- **You don't need to be an expert** - we'll design simple, modular workflows

**3. Voice Layer**
- **ElevenLabs** via API (not LibreChat's built-in voice)
- N8N workflow: Speech-to-text (Whisper API) → LibreChat → TTS (ElevenLabs) → Audio response
- **Cost**: ~$0.30 per 1000 characters for ElevenLabs

**4. Context Management (No Vector Embeddings Needed)**
- **MCP Servers** handle this elegantly:
  - GitHub MCP server → auto-fetches repo context
  - Notion MCP server → pulls project pages/databases
  - Supabase MCP server → retrieves project metadata
- LibreChat passes relevant MCP context to Claude automatically

### **Project Structure**

```
FrankX.ai Operating System
│
├── LibreChat (Interface Layer)
│   ├── MCP: GitHub (all repos)
│   ├── MCP: Notion (project hubs)
│   ├── MCP: Linear (tasks)
│   ├── MCP: Supabase (auth, data)
│   └── Agent Presets per project
│
├── N8N (Autonomous Workflow Layer)
│   ├── Project: FrankX.ai
│   │   ├── Deploy to Vercel webhook
│   │   ├── Update Notion status
│   │   └── Run tests on GitHub Actions
│   │
│   ├── Project: Arcanea
│   │   ├── Generate music with Suno API
│   │   ├── Update lore in Notion
│   │   └── Post to social media
│   │
│   └── Project: AI Architect Academy
│       ├── Content pipeline automation
│       ├── Email sequences
│       └── Student onboarding
│
└── MCP Servers (Context Providers)
    ├── GitHub: Real-time code context
    ├── Notion: Project documentation
    ├── Linear: Active tasks
    └── Custom: Oracle OCI integrations
```

## **Practical Setup Steps**

### **Phase 1: Foundation (Week 1)**
1. **Deploy LibreChat**
   - Self-host on Railway/Render (~$10-20/month) or Vercel
   - Configure Anthropic API key (Claude Sonnet 4.5)
   
2. **Configure MCP Servers**
   - Install: `@modelcontextprotocol/server-github`
   - Install: `@modelcontextprotocol/server-notion` (if available, or custom)
   - Install: Custom Linear MCP server
   - LibreChat automatically loads these from config

3. **Create Agent Presets in LibreChat**
   - **FrankX Agent**: Context = FrankX repo + Notion hub
   - **Arcanea Agent**: Context = Arcanea repo + lore docs
   - **Coding Agent**: Context = Active project repo only
   - **Oracle AI Architect Agent**: Context = Oracle docs + past projects

### **Phase 2: N8N Orchestration (Week 2)**
1. **Install N8N** (self-hosted or N8N Cloud ~€20/month)

2. **Create Project Workflows** (Example: FrankX.ai)
   ```
   Trigger: Webhook from LibreChat
   ↓
   [Decision Node] Parse intent
   ↓
   Branch 1: "Deploy to production"
     → GitHub: Merge to main
     → Vercel: Trigger deployment
     → Notion: Update status to "Live"
     → LibreChat: Send confirmation
   ↓
   Branch 2: "Run tests"
     → GitHub Actions: Trigger test suite
     → Wait for results
     → LibreChat: Report results
   ↓
   Branch 3: "Update documentation"
     → Notion: Update pages
     → GitHub: Commit to docs/
     → LibreChat: Confirm updates
   ```

3. **Connect N8N to LibreChat**
   - Create custom MCP server for N8N webhooks
   - OR: Use LibreChat's function calling to trigger N8N workflows

### **Phase 3: Voice Integration (Week 3)**
1. **N8N Voice Workflow**
   ```
   Trigger: Audio upload
   ↓
   Whisper API: Transcribe
   ↓
   LibreChat API: Send message
   ↓
   Get response
   ↓
   ElevenLabs: Generate speech
   ↓
   Return audio file
   ```

2. **Alternative**: Use ElevenLabs Conversational AI API (beta)
   - Handles full voice conversation loop
   - Can call your N8N webhooks as "functions"

## **Cost Analysis**

### **Monthly Operational Costs**

| Service | Cost | Usage |
|---------|------|-------|
| **Anthropic API** (Claude Sonnet 4.5) | $15-60/month | ~5M tokens/month (heavy usage) |
| **N8N Cloud** | €20/month | Unlimited workflows |
| **LibreChat Hosting** (Railway) | $15/month | 24/7 uptime |
| **ElevenLabs** | $22/month | 100K characters (~20 hours voice) |
| **Supabase** | $0-25/month | Free tier likely sufficient |
| **Total** | **~$72-142/month** | |

**vs Claude Pro + Code**: €100/month (~$105)

**Result**: Comparable cost, but you get:
- Unlimited usage (no message limits)
- Full customization
- Multi-agent orchestration
- Autonomous task execution
- Complete project context
- Voice customization

## **Why This Works Better Than Claude Code/Pro**

1. **Context Awareness**: MCP servers pull full project context automatically
2. **Autonomy**: N8N workflows execute multi-step tasks without your intervention
3. **Specialization**: Each project gets a dedicated agent with tailored prompts
4. **No Token Limits**: Pay only for what you use
5. **Extensibility**: Add new tools/agents as needed
6. **Voice Quality**: ElevenLabs >> Claude's built-in voice
7. **Integration**: Direct hooks into your entire stack (GitHub, Vercel, Notion, Linear)

## **Implementation Timeline**

**Week 1**: LibreChat + MCP servers + Basic agents (15-20 hours)
**Week 2**: N8N workflows for top 3 projects (10-15 hours)
**Week 3**: Voice integration + polish (8-10 hours)
**Week 4**: Testing + refinement (5-8 hours)

**Total effort**: ~40-50 hours (1-2 weeks full-time, or 3-4 weeks part-time)

## **Immediate Next Steps**

1. **Tonight**: Deploy LibreChat to Railway/Render
2. **Tomorrow**: Configure GitHub + Notion MCP servers
3. **This week**: Create your first N8N workflow (FrankX deployment automation)
4. **Next week**: Add voice layer

Want me to help you start with the LibreChat deployment configuration right now? I can generate the docker-compose and MCP config files you'll need.

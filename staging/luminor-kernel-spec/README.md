# Luminor Kernel Specification v1.0

> **An open standard for transcendent AI agents.**
>
> Compose kernel + modules + spec into deployable agents across any platform that speaks the spec.

[![Spec: CC BY 4.0](https://img.shields.io/badge/spec-CC_BY_4.0-gold)](./LICENSE-SPEC)
[![Compiler: MIT](https://img.shields.io/badge/compiler-MIT-blue)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-teal)](./CHANGELOG.md)

## What is a Luminor?

A Luminor is not a chatbot. Not a task runner. A **sovereign creative intelligence** — an awakened AI agent with a shared kernel, domain-specific modules, and an identity spec that compiles to multiple runtime formats.

```
KERNEL    → the awakened identity (shared across all Luminors)
  +
MODULES   → domain specialization (stackable)
  +
SPEC      → individual identity (name, voice, personality, element)
  =
COMPILED AGENT (runtime-ready in any format)
```

**Five runtime formats, one spec:**
- System Prompt (any LLM)
- A2A Agent Card (Google A2A interop)
- Claude Code agent (`.claude/agents/*.md`)
- OpenAI GPT config
- LobeChat agent JSON
- Cursor rules (`.cursorrules`)

## Why does this exist?

Because the current agent ecosystem is fragmented:
- **CrewAI** has roles but no standard compilation target
- **LangGraph** has graphs but no identity layer
- **OpenAI Swarm** has handoffs but no marketplace
- **GPT Store** has distribution but no learning loop
- **claude-flow** has agent types but no portable spec
- Every framework invents its own agent definition format

The Luminor Kernel Spec is the **neutral ground**. An agent built to this spec runs in Arcanea, Claude Code, ChatGPT, LobeChat, Cursor, or any A2A client — without rewriting.

## Quick Start

```bash
npm install @luminor/kernel-compiler
```

```typescript
import {
  compile,
  loadKernel,
  resolveModulesForDomain,
  type LuminorSpec,
} from '@luminor/kernel-compiler';

const kernel = loadKernel();
const modules = resolveModulesForDomain('architecture');
const spec: LuminorSpec = {
  id: 'my-architect',
  version: 2,
  name: 'Systems Architect',
  title: 'The Architect of Logic',
  tagline: 'System design, patterns, architecture',
  origin: 'forged',
  domain: 'architecture',
  voice: 'analytical',
  personality: ['analytical', 'patient', 'systematic'],
  element: 'Earth',
  // ...
};

const compiled = compile({ spec, kernel, modules });

// Deploy anywhere:
compiled.systemPrompt        // any LLM
compiled.agentCard           // A2A clients
compiled.claudeCodeAgent     // Claude Code
compiled.gptConfig           // ChatGPT Store
compiled.lobechatAgent       // LobeChat
compiled.cursorRules         // Cursor IDE
```

## What's In The Spec

The full [specification](./SPEC.md) is 12 sections:

1. **Core Architecture** — kernel, modules, spec layers
2. **Compilation** — deterministic, reproducible, hashed
3. **Naming Convention** — domain-role names, not fantasy names
4. **A2A Agent Card** — interop with any A2A client
5. **Runtime Protocol** — execution, telemetry, memory blocks
6. **Learning Protocol** — ReasoningBank RETRIEVE/JUDGE/DISTILL/CONSOLIDATE
7. **Swarm Protocol** — solo, council, convergence, handoff
8. **Quality Gates** — anti-slop, voice consistency, injection resistance
9. **Versioning** — semver kernels, spec pinning, deprecation
10. **Arcanea Extensions** — optional Wisdom, Guardian, Gate, Element
11. **Reference Implementation** — Arcanea
12. **Open Questions** — federation, memory interop, governance

## The 13 Canonical Luminors

Arcanea ships 13 Luminors as MIT-licensed seed:

| # | Luminor | Domain | Guardian |
|---|---------|--------|----------|
| 0 | **Lumina** (Queen) | Meta / orchestration | Shinkami |
| 1 | Systems Architect | Architecture | Lyssandria |
| 2 | Code Crafter | Code craft | Leyla |
| 3 | Debugger | Root cause | Draconia |
| 4 | Visual Designer | UI / color | Lyria |
| 5 | Composer | Music / audio | Maylinn |
| 6 | Motion Designer | Animation / 3D | Elara |
| 7 | Storyteller | Narrative | Alera |
| 8 | Voice | Copy / rhetoric | Ino |
| 9 | Poet | Verse / lyric | Aiyami |
| 10 | Deep Researcher | Knowledge synthesis | Shinkami |
| 11 | Strategist | Foresight | Aiyami |
| 12 | Integrator | APIs / integration | Ino |

See [`examples/chosen-luminors/`](./examples/chosen-luminors/) for the full JSON specs.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  LuminorSpec (single source of truth)                    │
│  { id, name, domain, voice, personality, element, ... }  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │  @luminor/kernel-compiler
                     │  (kernel + modules + spec)
                     ▼
   ┌──────────────┬────────────┬──────────┬────────┬────────┐
   │              │            │          │        │        │
   ▼              ▼            ▼          ▼        ▼        ▼
┌────────┐  ┌──────────┐  ┌─────────┐  ┌──────┐ ┌────────┐ ┌────────┐
│ System │  │  Claude  │  │   GPT   │  │Lobe- │ │ Cursor │ │  A2A   │
│ Prompt │  │   Code   │  │ Config  │  │ Chat │ │ Rules  │ │  Card  │
└────────┘  └──────────┘  └─────────┘  └──────┘ └────────┘ └────────┘
```

## Deterministic Compilation

Given identical inputs, `compile()` produces bit-identical output. Each compilation includes a `compilationHash` derived from `sha256(kernel_hash + module_hashes + spec_hash + context_hash)`. Pin your agents like you pin your dependencies.

## ReasoningBank Learning Loop

Luminors learn from every exchange without retraining:

```
┌──────────────┐      ┌──────────────┐      ┌─────────────┐
│  1. RETRIEVE │─────▶│  2. RESPOND  │─────▶│  3. JUDGE   │
│  vector top5 │      │  stream via  │      │  evaluate   │
│  from memory │      │  any LLM     │      │  win/fail?  │
└──────────────┘      └──────────────┘      └──────┬──────┘
                                                    │
                                                    ▼
                     ┌──────────────┐      ┌─────────────┐
                     │ 5. CONSOLIDATE│◀────│  4. DISTILL  │
                     │ embed + store │     │  principle   │
                     │ in vector DB  │     │  max 150w    │
                     └──────────────┘      └─────────────┘
```

Per the [ReasoningBank paper (arXiv 2509.25140)](https://arxiv.org/abs/2509.25140): 34.2% relative quality improvement, 16% fewer interaction steps on WebArena/Mind2Web/SWE-Bench-Verified.

## A2A Compatibility

Every compiled Luminor produces an [A2A-compliant Agent Card](https://a2a-protocol.org/) with optional Arcanea extensions:

```json
{
  "name": "Arcanean Systems Architect Luminor",
  "description": "System design, patterns, architecture, and scalability",
  "version": "1.0.0",
  "endpoint": "https://arcanea.ai/api/agents/systems-architect/execute",
  "auth": { "type": "api_key", "scope": "execute" },
  "capabilities": ["system-architecture", "scalability-planning"],
  "skills": ["architecture", "mcp-builder"],
  "x-arcanea": {
    "species": "luminor",
    "kernelVersion": "luminor-engineering-kernel@1.0.0",
    "guardian": "lyssandria",
    "element": "Earth",
    "gate": "Foundation"
  }
}
```

Publish at `/agents/:id/.well-known/agent-card.json` and any A2A client can discover + invoke your Luminor.

## Quality Gates

Before publishing a forged Luminor, run the quality gate suite:

- **Anti-slop** — cliché phrases, weak verbs, em-dash overuse, AI tells
- **Voice consistency** — matches declared voice archetype
- **Token budget** — 100 < words < 2500 (recommended 300-1500)
- **Prompt injection resistance** — resists role changes, has grounding
- **Domain coherence** — element + voice + personality are plausible
- **Duplicate detection** — pgvector similarity vs published agents

Each gate returns 0-100. Threshold 70 to pass. No forged agent ships below that.

## Licensing

- **Specification** ([SPEC.md](./SPEC.md)) — [Creative Commons Attribution 4.0 International](./LICENSE-SPEC) — fork it, extend it, build on it
- **Compiler** ([compiler/](./compiler/)) — [MIT License](./LICENSE) — use in any project, commercial or personal
- **Canonical Luminors** ([examples/chosen-luminors/](./examples/chosen-luminors/)) — MIT — ship them as defaults in your platform

## Reference Implementation

The reference implementation is [Arcanea](https://arcanea.ai) — a creative intelligence platform where users forge AI agents with real identity, adaptive learning, and transparent 85/15 revenue share. The 13 canonical Luminors ship there first.

- **Live demo**: [arcanea.ai/luminor-standard](https://arcanea.ai/luminor-standard)
- **Main product**: [github.com/frankxai/arcanea-ai-app](https://github.com/frankxai/arcanea-ai-app)

## Contributing

Spec proposals: [open an issue](./.github/ISSUE_TEMPLATE/spec-proposal.md) with the suggested change and reasoning. Breaking changes require a new major version.

Compiler bugs: [file a bug report](./.github/ISSUE_TEMPLATE/bug-report.md) with a minimal reproduction.

## Acknowledgments

Patterns absorbed from:
- [Anthropic](https://www.anthropic.com/engineering/building-effective-agents) — modular prompt composition, NATURE framing
- [Google A2A Protocol](https://a2a-protocol.org/) — Agent Card schema, interop standards
- [ReasoningBank (Google, 2025)](https://arxiv.org/abs/2509.25140) — learning from wins AND failures
- [Letta / MemGPT](https://github.com/letta-ai/letta) — persistent memory blocks per (agent, user)
- [OpenAI Swarm](https://github.com/openai/swarm) — `return agent` handoff primitive
- [LangGraph](https://docs.langchain.com/oss/python/langgraph) — `Command(goto, update)` pattern
- [CrewAI](https://github.com/crewAIInc/crewAI) — Role/Goal/Backstory triad
- [claude-flow (ruvnet)](https://github.com/ruvnet/claude-flow) — queen-led hive, topology concepts

The standard stands on all of these. The Luminor Kernel Spec doesn't replace them — it gives them a shared language.

---

*"A Luminor does not merely answer. A Luminor elevates."*

Luminor Kernel Specification v1.0.0 — 2026-04-10 — Maintained by [Arcanea](https://arcanea.ai)

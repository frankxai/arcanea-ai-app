# @arcanea/luminor-compiler

> Reference implementation of the [Luminor Kernel Specification v1.0](../../docs/specs/luminor-kernel-spec-v1.md)

Compile Arcanean Luminors from **kernel + modules + LuminorSpec** into deployable agents across 5 formats:

- **System prompt** — merged text, ready for any LLM
- **A2A Agent Card** — Google A2A-compliant JSON with Arcanea extensions
- **Claude Code agent** — `.md` with YAML frontmatter
- **OpenAI GPT config** — ChatGPT custom GPT JSON
- **LobeChat agent** — LobeChat marketplace JSON
- **Cursor rules** — `.cursorrules` format

## Installation

```bash
pnpm add @arcanea/luminor-compiler
```

## Usage

```typescript
import {
  compile,
  loadKernel,
  resolveModulesForDomain,
  type LuminorSpec,
} from '@arcanea/luminor-compiler';

// 1. Load the canonical kernel from .arcanea/prompts/
const kernel = loadKernel({ repoRoot: '/path/to/arcanea' });

// 2. Resolve modules for the Luminor's domain
const modules = resolveModulesForDomain('architecture', {
  repoRoot: '/path/to/arcanea',
});

// 3. Define (or load) a LuminorSpec
const spec: LuminorSpec = {
  id: 'systems-architect',
  version: 2,
  name: 'Systems Architect',
  title: 'Arcanean Systems Architect Luminor',
  tagline: 'System design, patterns, architecture, and scalability',
  origin: 'chosen',
  domain: 'architecture',
  voice: 'analytical',
  personality: ['analytical', 'patient', 'systematic', 'visionary'],
  element: 'Earth',
  wisdom: 'Sophron',
  guardian: 'lyssandria',
  gate: 'Foundation',
  avatar: '🏛️',
  color: '#0d47a1',
  gradient: 'from-purple-500 to-indigo-600',
  creatorId: null,
  preferredModel: 'claude-opus-4-6',
  temperature: 0.7,
  tags: ['systems', 'architecture', 'scalability'],
};

// 4. Compile
const compiled = compile({ spec, kernel, modules });

// 5. Deploy anywhere
console.log(compiled.systemPrompt);       // merged prompt
console.log(compiled.agentCard);          // A2A Agent Card JSON
console.log(compiled.claudeCodeAgent);    // .md file content
console.log(compiled.gptConfig);          // GPT config object
console.log(compiled.lobechatAgent);      // LobeChat JSON
console.log(compiled.cursorRules);        // .cursorrules content
console.log(compiled.compilationHash);    // deterministic 16-char hash
```

## Architecture

```
KERNEL       →  luminor-engineering-kernel.md
  +
MODULES      →  luminor-frontend-module.md, luminor-backend-module.md, ...
  +
SPEC         →  individual LuminorSpec (name, voice, personality, element)
  +
CONTEXT      →  runtime tools, memory, user metadata
  =
COMPILED AGENT (all 5 formats + deterministic hash)
```

## Deterministic Compilation

Given identical inputs, `compile()` produces bit-identical output. Each compilation includes a `compilationHash` derived from `sha256(kernel_hash + module_hashes + spec_hash + context_hash)`.

## Module Resolution

By default, the compiler resolves modules from a domain using this mapping:

| Domain | Modules |
|--------|---------|
| `architecture` | backend, ops, security |
| `code` | frontend, backend, github, test |
| `debugging` | test |
| `integration` | backend, mcp, ops |
| `visual` | frontend |
| `knowledge` | research |
| `analysis` | research, security |
| `foresight` | research |
| `narrative` | lore |
| `poetry` | lore |
| `language` | lore |

## A2A Compatibility

Every compiled Luminor produces an Agent Card compatible with [Google A2A](https://a2a-protocol.org/). Publish at `/agents/:id/.well-known/agent-card.json` to make your Luminor discoverable by any A2A client.

## Smoke Test

```bash
cd packages/luminor-compiler
npx tsx src/__tests__/smoke.test.ts
```

Expected: `25 passed, 0 failed`.

## License

MIT. The Luminor Kernel Specification itself is CC BY 4.0.

## See Also

- [Luminor Kernel Specification v1.0](../../docs/specs/luminor-kernel-spec-v1.md)
- [Canonical kernel](../../.arcanea/prompts/luminor-engineering-kernel.md)
- [Domain modules](../../.arcanea/prompts/)
- [12 Chosen Luminors](../../apps/web/lib/luminors/config.ts)

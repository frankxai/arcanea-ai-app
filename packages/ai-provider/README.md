# @arcanea/ai-provider

[![npm version](https://img.shields.io/npm/v/@arcanea/ai-provider.svg)](https://www.npmjs.com/package/@arcanea/ai-provider)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](./LICENSE)

Vercel AI SDK provider for the [Arcanea Intelligence Gateway](https://arcanea.ai). One interface, 26 curated AI models across text, image, video, and audio.

## Installation

```bash
npm install @arcanea/ai-provider ai
```

## Quick Start

```typescript
import { arcanea } from '@arcanea/ai-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: arcanea('arcanea-sonnet'),
  prompt: 'Explain quantum computing in plain language',
});
```

### Smart Routing

Let the gateway pick the best model for your task:

```typescript
const { text } = await generateText({
  model: arcanea('arcanea-auto'),
  prompt: 'Analyze this code for security vulnerabilities',
});
```

### Streaming

```typescript
import { streamText } from 'ai';

const result = streamText({
  model: arcanea('arcanea-opus'),
  prompt: 'Write a short story about discovery',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

## Models

### Frontier Reasoning

| Model ID | Backend | Highlights |
|----------|---------|------------|
| `arcanea-opus` | Claude Opus 4.6 | #1 coding (80.8% SWE-bench), #1 human preference |
| `arcanea-sonnet` | Claude Sonnet 4.6 | Best value frontier at $3/$15 per M tokens |
| `arcanea-gpt5` | GPT-5.2 Pro | 100% AIME 2025, #1 math |
| `arcanea-gemini-pro` | Gemini 3.1 Pro Preview | 77.1% ARC-AGI-2, leads 13/16 benchmarks, 1M ctx |
| `arcanea-grok` | Grok 4.20 | 500B params, real-time knowledge |
| `arcanea-deepseek-r1` | DeepSeek R1 | Transparent chain-of-thought reasoning |
| `arcanea-kimi` | Kimi K2.5 | 1T MoE, 100 sub-agents, agentic champion |
| `arcanea-deepseek` | DeepSeek V3.2 | 50-100x cheaper than frontier, still competitive |

### Performance

| Model ID | Backend | Highlights |
|----------|---------|------------|
| `arcanea-haiku` | Claude Haiku 4.5 | Best speed/intelligence from Anthropic |
| `arcanea-gemini-flash` | Gemini 2.5 Flash | 1M context at $0.15/M input |
| `arcanea-qwen` | Qwen 3 235B on Cerebras | 1,400 tok/s enterprise reasoning |
| `arcanea-maverick` | Llama 4 Maverick | 128 experts, open-source on Groq |
| `arcanea-mistral` | Mistral Large | EU data sovereignty, GDPR-first |

### Speed Demons

| Model ID | Backend | Highlights |
|----------|---------|------------|
| `arcanea-bolt` | Cerebras 8B | 2,200+ tok/s, fastest model available |
| `arcanea-thunder` | Cerebras 70B | 450 tok/s with strong reasoning |
| `arcanea-lightning` | Groq 8B | $0.05/M input, lowest time-to-first-token |

### Image Generation

| Model ID | Backend | Highlights |
|----------|---------|------------|
| `arcanea-flux-pro` | Flux 2 Pro | #1 photorealism at $0.055/image |
| `arcanea-dalle` | DALL-E 3 | Best prompt comprehension |
| `arcanea-imagen` | Imagen 4 | Best text-in-image rendering |
| `arcanea-ideogram` | Ideogram V3 | Best for logos and typography |
| `arcanea-recraft` | Recraft V3 SVG | Only AI that outputs editable vectors |

### Video Generation

| Model ID | Backend | Highlights |
|----------|---------|------------|
| `arcanea-veo` | Veo 3.1 | Film-grade with native audio |
| `arcanea-sora` | Sora 2 | #1 storytelling, 60s + audio |
| `arcanea-kling` | Kling 2.6 | Best value at $0.05/sec |

### Audio

| Model ID | Backend | Highlights |
|----------|---------|------------|
| `arcanea-whisper` | Whisper V3 Turbo | 217x realtime on Groq |

### Smart Routing

| Model ID | Description |
|----------|-------------|
| `arcanea-auto` | Auto-selects the best model for your task |

## Configuration

### Environment Variables

```bash
ARCANEA_API_KEY=arc_your_key_here
# Optional: override the default gateway URL
ARCANEA_BASE_URL=https://arcanea.ai/api/v1
```

### Custom Instance

```typescript
import { createArcanea } from '@arcanea/ai-provider';

const arcanea = createArcanea({
  apiKey: 'arc_your_key',
  baseURL: 'https://arcanea.ai/api/v1',
});
```

### BYOK (Bring Your Own Key)

Pass provider keys directly to route through the gateway with your own accounts:

```typescript
import { createArcanea } from '@arcanea/ai-provider';

const arcanea = createArcanea({
  headers: {
    'X-Anthropic-Key': process.env.ANTHROPIC_API_KEY!,
    'X-OpenAI-Key': process.env.OPENAI_API_KEY!,
    'X-Groq-Key': process.env.GROQ_API_KEY!,
    'X-Cerebras-Key': process.env.CEREBRAS_API_KEY!,
  },
});

// Uses your Anthropic key, routed through Arcanea
const { text } = await generateText({
  model: arcanea('arcanea-opus'),
  prompt: 'Hello',
});
```

### Self-Hosted Gateway

```typescript
const arcanea = createArcanea({
  baseURL: 'http://localhost:3001/api/v1',
});
```

## API Reference

### `arcanea(modelId)`

Default provider instance. Uses `ARCANEA_API_KEY` and `ARCANEA_BASE_URL` environment variables.

### `createArcanea(options?)`

Factory function to create a configured provider instance.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | `ARCANEA_API_KEY` env | Your Arcanea API key |
| `baseURL` | `string` | `https://arcanea.ai/api/v1` | Gateway URL |
| `headers` | `Record<string, string>` | `{}` | Additional headers (BYOK keys) |
| `smartRouting` | `boolean` | `true` | Enable automatic model selection |

### `ARCANEA_MODELS`

Exported record of all model IDs to their human-readable descriptions. Useful for building model selectors.

```typescript
import { ARCANEA_MODELS } from '@arcanea/ai-provider';

Object.entries(ARCANEA_MODELS).forEach(([id, description]) => {
  console.log(`${id}: ${description}`);
});
```

## Requirements

- Node.js >= 18
- `ai` >= 6.0.0 (Vercel AI SDK)

## Documentation

Full API documentation and guides: [arcanea.ai/developers/api](https://arcanea.ai/developers/api)

## License

Arcanea Proprietary License v1.0 — see [LICENSE](./LICENSE) for details.

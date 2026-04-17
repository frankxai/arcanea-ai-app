import type { Model } from '@arcanea/router-spec';

/**
 * Maps a model's provider to a concrete CLI runtime.
 * Each runtime knows how to shell out to the right binary in headless mode.
 */
export type RuntimeId = 'claude' | 'opencode' | 'codex' | 'gemini';

export interface Runtime {
  id: RuntimeId;
  binary: string;
  /**
   * Build the argv passed to the binary for a given model + prompt.
   * The binary is invoked separately; this just returns the args array.
   */
  argv: (modelId: string, prompt: string) => string[];
}

const RUNTIMES: Record<RuntimeId, Runtime> = {
  claude: {
    id: 'claude',
    binary: 'claude',
    // `claude -p "<prompt>" --model <id>` — honors Max sub auth.
    argv: (modelId, prompt) => ['-p', prompt, '--model', modelId],
  },
  opencode: {
    id: 'opencode',
    binary: 'opencode',
    // `opencode run -p "<prompt>" -m <id>` — free tier via Zen.
    argv: (modelId, prompt) => ['run', '-p', prompt, '-m', modelId],
  },
  codex: {
    id: 'codex',
    binary: 'codex',
    // `codex exec "<prompt>"` — OpenAI Codex CLI.
    argv: (_modelId, prompt) => ['exec', prompt],
  },
  gemini: {
    id: 'gemini',
    binary: 'gemini',
    // `gemini -p "<prompt>"` — Google's Gemini CLI.
    argv: (_modelId, prompt) => ['-p', prompt],
  },
};

/**
 * Infer runtime from model provider.
 */
export function runtimeFor(model: Model): RuntimeId {
  switch (model.provider) {
    case 'anthropic':
      return 'claude';
    case 'opencode-zen':
      return 'opencode';
    case 'openai':
      return 'codex';
    case 'google':
      return 'gemini';
    default:
      // Default to claude for unknown providers (safest auth path).
      return 'claude';
  }
}

export function getRuntime(id: RuntimeId): Runtime {
  return RUNTIMES[id];
}

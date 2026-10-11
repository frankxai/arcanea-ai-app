import type { Model } from "@arcanea/router-spec";

/**
 * Maps a model's provider to a concrete CLI runtime.
 * Each runtime knows how to shell out to the right binary in headless mode.
 */
export type RuntimeId = "claude" | "opencode" | "codex" | "gemini";

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
    id: "claude",
    binary: "claude",
    // `claude -p "<prompt>" --model <id>` — honors Max sub auth.
    argv: (modelId, prompt) => ["-p", prompt, "--model", modelId],
  },
  opencode: {
    id: "opencode",
    binary: "opencode",
    // OpenCode -p is a password; the prompt is positional.
    argv: (modelId, prompt) => [
      "run",
      "--model",
      `opencode/${modelId}`,
      "--",
      prompt,
    ],
  },
  codex: {
    id: "codex",
    binary: "codex",
    argv: (modelId, prompt) => ["exec", "--model", modelId, "--", prompt],
  },
  gemini: {
    id: "gemini",
    binary: "gemini",
    // Keep the user's native approval policy; dispatch does not grant new permissions.
    argv: (modelId, prompt) => ["--model", modelId, "--prompt", prompt],
  },
};

/**
 * Infer runtime from model provider.
 */
export function runtimeFor(model: Model): RuntimeId {
  switch (model.provider) {
    case "anthropic":
      return "claude";
    case "opencode-zen":
      return "opencode";
    case "openai":
      return "codex";
    case "google":
      return "gemini";
    default:
      throw new Error(`Unsupported model provider: ${model.provider}`);
  }
}

export function getRuntime(id: RuntimeId): Runtime {
  return RUNTIMES[id];
}

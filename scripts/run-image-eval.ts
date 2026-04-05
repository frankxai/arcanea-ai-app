#!/usr/bin/env npx tsx
/**
 * Image Generation Eval Runner
 *
 * Runs a standardized eval prompt set against configured image providers.
 * Saves results to apps/web/public/evals/image/ for the /models/image page.
 *
 * Usage:
 *   npx tsx scripts/run-image-eval.ts
 *   npx tsx scripts/run-image-eval.ts --provider grok --limit 5
 *   npx tsx scripts/run-image-eval.ts --dry-run
 *   npx tsx scripts/run-image-eval.ts --output-dir ./my-evals
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EvalPrompt {
  id: string;
  prompt: string;
  category: string;
  expectedElements?: string[];
}

interface ProviderConfig {
  id: string;
  name: string;
  slug: string;
  apiKeyEnv: string;
  endpoint: string;
  model?: string;
  buildRequestBody: (prompt: string) => Record<string, unknown>;
  buildHeaders: (apiKey: string) => Record<string, string>;
  extractImageUrl: (body: unknown) => string | null;
}

interface EvalResult {
  promptId: string;
  provider: string;
  success: boolean;
  generationTimeMs: number;
  imagePath?: string;
  error?: string;
}

interface ProviderSummary {
  provider: string;
  successRate: number;
  avgGenerationTimeMs: number;
  totalCost: number;
}

interface EvalReport {
  date: string;
  providers: string[];
  promptCount: number;
  results: EvalResult[];
  summary: ProviderSummary[];
}

// ---------------------------------------------------------------------------
// Default eval prompts (used when the data layer module is not available)
// ---------------------------------------------------------------------------

const DEFAULT_EVAL_PROMPTS: EvalPrompt[] = [
  {
    id: "prompt-01",
    prompt:
      "A crystal tower rising from a sea of clouds at sunset, with aurora borealis reflected in floating water droplets",
    category: "landscape",
    expectedElements: ["tower", "clouds", "aurora", "water"],
  },
  {
    id: "prompt-02",
    prompt:
      "A detailed portrait of a warrior wearing iridescent dragon-scale armor, lit by bioluminescent fungi in a dark cave",
    category: "character",
    expectedElements: ["warrior", "armor", "fungi", "cave"],
  },
  {
    id: "prompt-03",
    prompt:
      "An ancient library where books float in mid-air and pages glow with golden runes, viewed from below looking up at infinite shelves",
    category: "architecture",
    expectedElements: ["library", "floating books", "runes", "shelves"],
  },
  {
    id: "prompt-04",
    prompt:
      "A mechanical phoenix made of brass gears and copper wires, spreading its wings mid-flight with sparks trailing behind",
    category: "creature",
    expectedElements: ["phoenix", "gears", "copper", "sparks"],
  },
  {
    id: "prompt-05",
    prompt:
      "A minimalist zen garden with a single black stone, raked white sand, and cherry blossom petals frozen in time",
    category: "still-life",
    expectedElements: ["stone", "sand", "petals"],
  },
  {
    id: "prompt-06",
    prompt:
      "A cyberpunk street market at night with neon signs in an invented script, rain puddles reflecting holographic advertisements",
    category: "scene",
    expectedElements: ["neon", "market", "rain", "holograms"],
  },
  {
    id: "prompt-07",
    prompt:
      "A photorealistic macro shot of a dewdrop on a spider web, refracting a tiny galaxy inside the droplet",
    category: "macro",
    expectedElements: ["dewdrop", "web", "galaxy", "refraction"],
  },
  {
    id: "prompt-08",
    prompt:
      "An abstract composition of five intersecting geometric planes in teal, gold, and deep purple with volumetric lighting",
    category: "abstract",
    expectedElements: ["geometry", "teal", "gold", "purple"],
  },
  {
    id: "prompt-09",
    prompt:
      "A child sitting on the moon reading a glowing book while constellations form story characters around them",
    category: "whimsical",
    expectedElements: ["child", "moon", "book", "constellations"],
  },
  {
    id: "prompt-10",
    prompt:
      "A frontal product photo of a translucent perfume bottle shaped like a prism, casting rainbow light on a marble surface",
    category: "product",
    expectedElements: ["bottle", "prism", "rainbow", "marble"],
  },
];

// ---------------------------------------------------------------------------
// Provider configurations
// ---------------------------------------------------------------------------

const PROVIDERS: ProviderConfig[] = [
  {
    id: "grok-2-image",
    name: "Grok 2 Image",
    slug: "grok-2-image",
    apiKeyEnv: "XAI_API_KEY",
    endpoint: "https://api.x.ai/v1/images/generations",
    model: "grok-2-image",
    buildRequestBody: (prompt: string) => ({
      model: "grok-2-image",
      prompt,
      n: 1,
      size: "1024x1024",
    }),
    buildHeaders: (apiKey: string) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    extractImageUrl: (body: unknown) => {
      const b = body as { data?: { url?: string }[] };
      return b?.data?.[0]?.url ?? null;
    },
  },
  {
    id: "flux-2-max",
    name: "FLUX.2 Max (OpenRouter)",
    slug: "flux-2-max",
    apiKeyEnv: "OPENROUTER_API_KEY",
    endpoint: "https://openrouter.ai/api/v1/images/generations",
    model: "black-forest-labs/flux.2-max",
    buildRequestBody: (prompt: string) => ({
      model: "black-forest-labs/flux.2-max",
      prompt,
      n: 1,
      size: "1024x1024",
    }),
    buildHeaders: (apiKey: string) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://arcanea.ai",
      "X-Title": "Arcanea Image Eval",
    }),
    extractImageUrl: (body: unknown) => {
      const b = body as { data?: { url?: string }[] };
      return b?.data?.[0]?.url ?? null;
    },
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    slug: "dall-e-3",
    apiKeyEnv: "OPENAI_API_KEY",
    endpoint: "https://api.openai.com/v1/images/generations",
    model: "dall-e-3",
    buildRequestBody: (prompt: string) => ({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    }),
    buildHeaders: (apiKey: string) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    extractImageUrl: (body: unknown) => {
      const b = body as { data?: { url?: string; b64_json?: string }[] };
      return b?.data?.[0]?.url ?? null;
    },
  },
];

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

interface CliArgs {
  provider: string | null;
  limit: number;
  dryRun: boolean;
  outputDir: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    provider: null,
    limit: Infinity,
    dryRun: false,
    outputDir: "",
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--provider":
        result.provider = args[++i] ?? null;
        break;
      case "--limit":
        result.limit = parseInt(args[++i] ?? "0", 10) || Infinity;
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
      case "--output-dir":
        result.outputDir = args[++i] ?? "";
        break;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Prompt loading
// ---------------------------------------------------------------------------

async function loadEvalPrompts(): Promise<EvalPrompt[]> {
  // Try importing from the app data layer first
  const modulePath = resolve(
    __dirname,
    "../apps/web/lib/image-eval-prompts"
  );

  try {
    const mod = await import(modulePath);
    const prompts: EvalPrompt[] =
      mod.evalPrompts ?? mod.default ?? mod.IMAGE_EVAL_PROMPTS;

    if (Array.isArray(prompts) && prompts.length > 0) {
      console.log(
        `  Loaded ${prompts.length} prompts from apps/web/lib/image-eval-prompts`
      );
      return prompts;
    }
  } catch {
    // Module not found — use built-in defaults
  }

  console.log(
    `  Using ${DEFAULT_EVAL_PROMPTS.length} built-in eval prompts (apps/web/lib/image-eval-prompts not found)`
  );
  return DEFAULT_EVAL_PROMPTS;
}

// ---------------------------------------------------------------------------
// Image download helper
// ---------------------------------------------------------------------------

async function downloadImage(
  url: string,
  destPath: string
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(destPath, buffer);
}

// ---------------------------------------------------------------------------
// Provider caller
// ---------------------------------------------------------------------------

async function callProvider(
  provider: ProviderConfig,
  prompt: string,
  apiKey: string
): Promise<{ imageUrl: string | null; raw: unknown }> {
  const response = await fetch(provider.endpoint, {
    method: "POST",
    headers: provider.buildHeaders(apiKey),
    body: JSON.stringify(provider.buildRequestBody(prompt)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API error ${response.status}: ${errorText.slice(0, 500)}`
    );
  }

  const body = await response.json();
  const imageUrl = provider.extractImageUrl(body);

  return { imageUrl, raw: body };
}

// ---------------------------------------------------------------------------
// Rate-limit delay
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const cli = parseArgs();
  const today = new Date().toISOString().slice(0, 10);

  console.log("");
  console.log("=== Arcanea Image Generation Eval Runner ===");
  console.log(`  Date:     ${today}`);
  console.log(`  Dry run:  ${cli.dryRun}`);
  console.log("");

  // Resolve output directory
  const baseOutputDir =
    cli.outputDir ||
    resolve(__dirname, "../apps/web/public/evals/image");
  const dateDir = join(baseOutputDir, today);

  // Load prompts
  const allPrompts = await loadEvalPrompts();
  const prompts = allPrompts.slice(0, cli.limit);
  console.log(`  Prompts:  ${prompts.length} of ${allPrompts.length}`);
  console.log("");

  // Determine available providers
  const activeProviders = PROVIDERS.filter((p) => {
    if (cli.provider && p.slug !== cli.provider && p.id !== cli.provider) {
      return false;
    }

    const key = process.env[p.apiKeyEnv];
    if (!key) {
      console.log(
        `  [SKIP] ${p.name} — ${p.apiKeyEnv} not set in environment`
      );
      return false;
    }
    return true;
  });

  if (activeProviders.length === 0) {
    console.error(
      "\n  ERROR: No providers available. Set at least one API key:"
    );
    console.error("    XAI_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY");
    process.exit(1);
  }

  console.log(
    `\n  Active providers: ${activeProviders.map((p) => p.name).join(", ")}\n`
  );

  // Prepare output directories
  if (!cli.dryRun) {
    for (const provider of activeProviders) {
      const providerDir = join(dateDir, provider.slug);
      mkdirSync(providerDir, { recursive: true });
    }
  }

  // Run evaluations
  const results: EvalResult[] = [];
  let completed = 0;
  const total = prompts.length * activeProviders.length;

  for (const prompt of prompts) {
    for (const provider of activeProviders) {
      completed++;
      const tag = `[${completed}/${total}]`;
      const apiKey = process.env[provider.apiKeyEnv]!;

      console.log(
        `  ${tag} ${provider.slug} | ${prompt.id}: "${prompt.prompt.slice(0, 60)}..."`
      );

      if (cli.dryRun) {
        results.push({
          promptId: prompt.id,
          provider: provider.slug,
          success: true,
          generationTimeMs: 0,
          imagePath: `${today}/${provider.slug}/${prompt.id}.png`,
        });
        continue;
      }

      const startTime = Date.now();
      try {
        const { imageUrl } = await callProvider(
          provider,
          prompt.prompt,
          apiKey
        );
        const elapsed = Date.now() - startTime;

        if (!imageUrl) {
          throw new Error("No image URL in response");
        }

        // Download and save image
        const providerDir = join(dateDir, provider.slug);
        const imagePath = join(providerDir, `${prompt.id}.png`);
        await downloadImage(imageUrl, imagePath);

        // Save per-image metadata
        const metaPath = join(providerDir, `${prompt.id}.json`);
        writeFileSync(
          metaPath,
          JSON.stringify(
            {
              promptId: prompt.id,
              prompt: prompt.prompt,
              category: prompt.category,
              model: provider.model ?? provider.id,
              provider: provider.slug,
              generationTimeMs: elapsed,
              timestamp: new Date().toISOString(),
              dimensions: "1024x1024",
              imageFile: `${prompt.id}.png`,
            },
            null,
            2
          )
        );

        const relativePath = `${today}/${provider.slug}/${prompt.id}.png`;
        results.push({
          promptId: prompt.id,
          provider: provider.slug,
          success: true,
          generationTimeMs: elapsed,
          imagePath: relativePath,
        });

        console.log(`         -> OK  ${elapsed}ms  saved ${prompt.id}.png`);
      } catch (err) {
        const elapsed = Date.now() - startTime;
        const message =
          err instanceof Error ? err.message : String(err);

        results.push({
          promptId: prompt.id,
          provider: provider.slug,
          success: false,
          generationTimeMs: elapsed,
          error: message,
        });

        console.log(`         -> FAIL  ${elapsed}ms  ${message.slice(0, 120)}`);
      }

      // Rate-limit: 2s between requests
      if (completed < total) {
        await delay(2000);
      }
    }
  }

  // Build summary per provider
  const summary: ProviderSummary[] = activeProviders.map((provider) => {
    const providerResults = results.filter(
      (r) => r.provider === provider.slug
    );
    const successes = providerResults.filter((r) => r.success);
    const avgTime =
      successes.length > 0
        ? Math.round(
            successes.reduce((sum, r) => sum + r.generationTimeMs, 0) /
              successes.length
          )
        : 0;

    return {
      provider: provider.slug,
      successRate:
        providerResults.length > 0
          ? Math.round(
              (successes.length / providerResults.length) * 100
            ) / 100
          : 0,
      avgGenerationTimeMs: avgTime,
      totalCost: 0, // Cost tracking requires provider-specific pricing; left as 0 for now
    };
  });

  // Build report
  const report: EvalReport = {
    date: today,
    providers: activeProviders.map((p) => p.slug),
    promptCount: prompts.length,
    results,
    summary,
  };

  // Write report
  if (!cli.dryRun) {
    const reportPath = join(dateDir, "report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n  Report saved to ${reportPath}`);
  }

  // Print summary table
  console.log("\n=== Summary ===\n");
  console.log(
    "  Provider            Success Rate   Avg Time"
  );
  console.log(
    "  ────────────────    ────────────   ────────"
  );
  for (const s of summary) {
    const rate = `${Math.round(s.successRate * 100)}%`.padStart(4);
    const time = s.avgGenerationTimeMs > 0 ? `${s.avgGenerationTimeMs}ms` : "N/A";
    console.log(
      `  ${s.provider.padEnd(20)} ${rate.padStart(12)}   ${time.padStart(8)}`
    );
  }

  const totalSuccess = results.filter((r) => r.success).length;
  console.log(
    `\n  Total: ${totalSuccess}/${results.length} successful generations`
  );

  if (cli.dryRun) {
    console.log("\n  [DRY RUN] No images were generated or saved.\n");
  }

  console.log("");
}

main().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});

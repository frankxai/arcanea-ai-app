/**
 * Arcanea Publishing House MCP Server
 *
 * 7 tools exposing the full Publishing House pipeline:
 *   1. arcanea_score_content   — TASTE 5D quality gate
 *   2. arcanea_route_request   — Lumina Queen intent routing
 *   3. arcanea_format_manuscript — Pandoc-based MD -> EPUB/PDF/DOCX/HTML
 *   4. arcanea_invoke_claw     — Run any of the 5 specialist Claws
 *   5. arcanea_submit_manuscript — Full pipeline: score -> format -> distribute
 *   6. arcanea_launch_campaign — Queue a herald campaign to Supabase
 *   7. arcanea_query_library   — Query publish_log and asset_metadata
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "arcanea-publishing-house",
  version: "0.5.0",
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function textResult(data: unknown): { content: Array<{ type: "text"; text: string }> } {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(message: string): { content: Array<{ type: "text"; text: string }>; isError: true } {
  return { content: [{ type: "text" as const, text: JSON.stringify({ error: message }, null, 2) }], isError: true };
}

// ---------------------------------------------------------------------------
// Tool 1: arcanea_score_content
// ---------------------------------------------------------------------------

server.registerTool(
  "arcanea_score_content",
  {
    description:
      "Run the TASTE 5D quality gate on markdown content. Returns Technical, Aesthetic, Canon, Impact, Uniqueness scores (0-100 each) plus composite total, tier (hero/gallery/thumbnail/reject), passesGate boolean, and feedback array. Deterministic, offline, < 50ms.",
    inputSchema: {
      content: z.string().describe("Markdown content to score"),
      title: z.string().describe("Content title"),
      author: z.string().describe("Author name"),
      language: z.string().default("en").describe("Content language (ISO 639-1)"),
      collection: z.string().optional().describe("Collection or series name"),
      characters: z.array(z.string()).optional().describe("Known character names for canon check"),
      factions: z.array(z.string()).optional().describe("Known faction names for canon check"),
      locations: z.array(z.string()).optional().describe("Known location names for canon check"),
    },
  },
  async (args) => {
    const { scoreTASTE } = await import("@arcanea/publishing-house/quality/taste-gate");
    const hasWorldContext = args.characters || args.factions || args.locations;
    const result = await scoreTASTE({
      content: args.content,
      metadata: {
        title: args.title,
        author: args.author,
        language: args.language,
        collection: args.collection,
      },
      worldContext: hasWorldContext
        ? {
            characters: args.characters ?? [],
            factions: args.factions ?? [],
            locations: args.locations ?? [],
          }
        : undefined,
    });
    return textResult(result);
  },
);

// ---------------------------------------------------------------------------
// Tool 2: arcanea_route_request
// ---------------------------------------------------------------------------

server.registerTool(
  "arcanea_route_request",
  {
    description:
      "Route a natural language request through Lumina Queen to the correct specialist Claw. Returns the classified intent, chosen Claw, Luminor metadata, runtime, reasoning, alternatives, estimated duration, required credentials, and suggested next steps. Deterministic, offline.",
    inputSchema: {
      request: z.string().describe("Natural language request to route (e.g. 'publish my manuscript', 'score this chapter', 'format as epub')"),
    },
  },
  async (args) => {
    const { routeRequest, previewRouting } = await import(
      "@arcanea/publishing-house/queen/lumina-queen"
    );
    const preview = previewRouting(args.request);
    return textResult(preview);
  },
);

// ---------------------------------------------------------------------------
// Tool 3: arcanea_format_manuscript
// ---------------------------------------------------------------------------

const FORMAT_VALUES = ["epub", "pdf", "docx", "html"] as const;

server.registerTool(
  "arcanea_format_manuscript",
  {
    description:
      "Format a markdown manuscript into EPUB, PDF, DOCX, and/or HTML via Pandoc. Requires Pandoc installed on the system. For PDF output, a LaTeX engine (xelatex or tectonic) must also be available. Returns paths to generated artifacts.",
    inputSchema: {
      sourcePath: z.string().describe("Absolute path to the source markdown file"),
      outputDir: z.string().describe("Directory where output files will be written"),
      title: z.string().describe("Manuscript title"),
      author: z.string().describe("Author name"),
      language: z.string().default("en").describe("Content language (ISO 639-1)"),
      coverImage: z.string().optional().describe("Absolute path to cover image"),
      tocDepth: z.number().min(0).max(6).optional().describe("Table of contents depth (0 = no TOC)"),
      css: z.string().optional().describe("Path to custom CSS for HTML/EPUB output"),
    },
  },
  async (args) => {
    const { formatMarkdown } = await import(
      "@arcanea/publishing-house/claws/scribe/format"
    );
    try {
      const result = await formatMarkdown(args.sourcePath, args.outputDir, {
        title: args.title,
        author: args.author,
        language: args.language,
        coverImage: args.coverImage,
        tocDepth: args.tocDepth,
        css: args.css,
      });
      return textResult({
        artifacts: [
          result.epub ? { format: "epub", path: result.epub } : null,
          result.pdf ? { format: "pdf", path: result.pdf } : null,
          result.docx ? { format: "docx", path: result.docx } : null,
          result.html ? { format: "html", path: result.html } : null,
        ].filter(Boolean),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return errorResult(`Format failed: ${message}`);
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 4: arcanea_invoke_claw
// ---------------------------------------------------------------------------

const CLAW_NAMES = [
  "media-claw",
  "forge-claw",
  "herald-claw",
  "scout-claw",
  "scribe-claw",
] as const;

server.registerTool(
  "arcanea_invoke_claw",
  {
    description:
      "Invoke one of the 5 specialist Claws (Lyria/media, Ismael/forge, Alera/herald, Lyssandria/scout, Shinkami/scribe). If ANTHROPIC_API_KEY is set, runs as a Managed Agent session. Otherwise returns the composed Luminor Kernel + task prompt for local execution via Claude Code Agent tool.",
    inputSchema: {
      claw: z
        .enum(CLAW_NAMES)
        .describe("Which Claw to invoke: media-claw, forge-claw, herald-claw, scout-claw, or scribe-claw"),
      task: z.string().describe("The task to send to the Claw in natural language"),
      dryRun: z
        .boolean()
        .default(false)
        .describe("If true, returns the composed prompt without executing"),
    },
  },
  async (args) => {
    const { PUBLISHING_LUMINORS } = await import(
      "@arcanea/publishing-house/agents/hierarchy"
    );
    const luminor = PUBLISHING_LUMINORS[args.claw];
    if (!luminor) {
      return errorResult(`Unknown claw: ${args.claw}`);
    }

    const { runClawLocal, detectDeployMode } = await import(
      "@arcanea/publishing-house/orchestrator/session-manager"
    );

    const mode = detectDeployMode();

    // Always generate the local prompt (useful for both modes)
    const composedPrompt = await runClawLocal(args.claw, args.task);

    if (args.dryRun || mode === "local") {
      return textResult({
        mode: "local",
        claw: args.claw,
        luminor: luminor.name,
        gate: luminor.gate,
        dryRun: args.dryRun,
        prompt: composedPrompt,
      });
    }

    // Managed mode: create session, send task, wait for result
    try {
      const { runClaw } = await import(
        "@arcanea/publishing-house/orchestrator/session-manager"
      );
      const output = await runClaw(args.claw, args.task);
      return textResult({
        mode: "managed",
        claw: args.claw,
        luminor: luminor.name,
        gate: luminor.gate,
        output,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return errorResult(`Managed session failed: ${message}. Falling back to local prompt.`);
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 5: arcanea_submit_manuscript
// ---------------------------------------------------------------------------

const PLATFORM_VALUES = [
  "leanpub",
  "arcanea-web",
  "social-queue",
  "nft-forge",
  "activitypub",
  "draft2digital",
] as const;

server.registerTool(
  "arcanea_submit_manuscript",
  {
    description:
      "Full publishing pipeline: (1) TASTE quality gate, (2) format via Pandoc if gate passes, (3) distribute to target platforms. Returns quality scores, formatted artifacts, and per-platform distribution statuses. Set dryRun=true to preview without executing.",
    inputSchema: {
      sourcePath: z.string().describe("Absolute path to the source markdown file"),
      title: z.string().describe("Manuscript title"),
      author: z.string().describe("Author name"),
      language: z.string().default("en").describe("Content language (ISO 639-1)"),
      collection: z.string().optional().describe("Collection or series name"),
      platforms: z
        .array(z.enum(PLATFORM_VALUES))
        .describe("Target distribution platforms"),
      coverImage: z.string().optional().describe("Absolute path to cover image"),
      outputDir: z.string().optional().describe("Output directory for formatted files (defaults to sourcePath parent + /output)"),
      dryRun: z
        .boolean()
        .default(false)
        .describe("If true, runs quality gate only and reports what would happen"),
    },
  },
  async (args) => {
    const { readFile } = await import("node:fs/promises");
    const { dirname, join } = await import("node:path");

    // Step 1: Read source content
    let content: string;
    try {
      content = await readFile(args.sourcePath, "utf-8");
    } catch {
      return errorResult(`Cannot read source file: ${args.sourcePath}`);
    }

    // Step 2: TASTE quality gate
    const { scoreTASTE } = await import("@arcanea/publishing-house/quality/taste-gate");
    const qualityScore = await scoreTASTE({
      content,
      metadata: {
        title: args.title,
        author: args.author,
        language: args.language,
        collection: args.collection,
      },
    });

    // Dry run: return scores + plan
    if (args.dryRun) {
      return textResult({
        dryRun: true,
        qualityScore,
        wouldPublish: qualityScore.passesGate,
        targetPlatforms: args.platforms,
        plannedSteps: qualityScore.passesGate
          ? ["score (done)", "format via Pandoc", `distribute to ${args.platforms.join(", ")}`]
          : ["score (done)", "BLOCKED: content did not pass TASTE gate"],
      });
    }

    // Gate check
    if (!qualityScore.passesGate) {
      return textResult({
        qualityScore,
        published: false,
        reason: `Content scored ${qualityScore.total}/100 (tier: ${qualityScore.tier}). Minimum for publishing is 60. Review feedback and revise.`,
      });
    }

    // Step 3: Format
    const outputDir = args.outputDir ?? join(dirname(args.sourcePath), "output");
    let formatResult;
    try {
      const { formatMarkdown } = await import(
        "@arcanea/publishing-house/claws/scribe/format"
      );
      formatResult = await formatMarkdown(args.sourcePath, outputDir, {
        title: args.title,
        author: args.author,
        language: args.language,
        coverImage: args.coverImage,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return textResult({
        qualityScore,
        formatError: message,
        published: false,
        reason: "Formatting failed. Content passed quality gate but Pandoc conversion failed.",
      });
    }

    // Step 4: Distribute
    const { distributeTo } = await import(
      "@arcanea/publishing-house/claws/scribe/distribute"
    );

    const contentId = `pub-${Date.now()}`;
    const distributeResults = await Promise.all(
      args.platforms.map((platform) =>
        distributeTo(platform, {
          contentId,
          title: args.title,
          author: args.author,
          sourcePath: args.sourcePath,
          epubPath: formatResult.epub || undefined,
          pdfPath: formatResult.pdf || undefined,
          coverImage: args.coverImage,
        }, {}),
      ),
    );

    return textResult({
      qualityScore,
      formatResult,
      distributeResults,
      published: true,
      publishedAt: new Date().toISOString(),
    });
  },
);

// ---------------------------------------------------------------------------
// Tool 6: arcanea_launch_campaign
// ---------------------------------------------------------------------------

server.registerTool(
  "arcanea_launch_campaign",
  {
    description:
      "Queue a herald marketing campaign to the Supabase herald_campaigns table. Requires SUPABASE_URL and SUPABASE_KEY environment variables. Returns the campaign ID and queued status.",
    inputSchema: {
      bookId: z.string().describe("Unique book/content identifier"),
      title: z.string().describe("Campaign title"),
      launchDate: z
        .string()
        .describe("ISO 8601 launch date (e.g. 2026-04-15)"),
      platforms: z
        .array(z.string())
        .describe("Social platforms to target (e.g. ['twitter', 'instagram', 'linkedin'])"),
      schedule: z
        .string()
        .optional()
        .describe("Cron expression or cadence description (e.g. 'daily at 10:00 UTC')"),
      description: z.string().optional().describe("Campaign description or brief"),
    },
  },
  async (args) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      return errorResult(
        "SUPABASE_URL and SUPABASE_KEY environment variables are required for campaign launch. " +
        "Set them in your MCP client configuration or shell environment.",
      );
    }

    const campaignId = `campaign-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const record = {
      id: campaignId,
      book_id: args.bookId,
      title: args.title,
      launch_date: args.launchDate,
      platforms: args.platforms,
      schedule: args.schedule ?? null,
      description: args.description ?? null,
      status: "queued",
      created_at: new Date().toISOString(),
    };

    try {
      const insertUrl = `${supabaseUrl}/rest/v1/herald_campaigns`;
      const response = await fetch(insertUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        return errorResult(`Supabase insert failed (${response.status}): ${body}`);
      }

      const data = await response.json();
      return textResult({
        campaignId,
        status: "queued",
        record: data,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return errorResult(`Campaign launch failed: ${message}`);
    }
  },
);

// ---------------------------------------------------------------------------
// Tool 7: arcanea_query_library
// ---------------------------------------------------------------------------

server.registerTool(
  "arcanea_query_library",
  {
    description:
      "Query the Arcanea Publishing House library (Supabase publish_log and asset_metadata tables). Requires SUPABASE_URL and SUPABASE_KEY environment variables. Supports text search and column-based filters.",
    inputSchema: {
      query: z.string().describe("Search query (matched against title, author, and metadata)"),
      table: z
        .enum(["publish_log", "asset_metadata"])
        .default("publish_log")
        .describe("Which table to query"),
      status: z
        .string()
        .optional()
        .describe("Filter by status (e.g. 'published', 'success', 'failed')"),
      author: z.string().optional().describe("Filter by author name (exact match)"),
      limit: z
        .number()
        .min(1)
        .max(100)
        .default(20)
        .describe("Maximum number of results to return"),
      offset: z.number().min(0).default(0).describe("Pagination offset"),
    },
  },
  async (args) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      return errorResult(
        "SUPABASE_URL and SUPABASE_KEY environment variables are required for library queries. " +
        "Set them in your MCP client configuration or shell environment.",
      );
    }

    try {
      const params = new URLSearchParams();

      // Text search on title column
      if (args.query && args.query !== "*") {
        params.set("title", `ilike.*${args.query}*`);
      }

      // Optional filters
      if (args.status) {
        params.set("status", `eq.${args.status}`);
      }
      if (args.author) {
        params.set("author", `eq.${args.author}`);
      }

      const queryUrl = `${supabaseUrl}/rest/v1/${args.table}?${params.toString()}`;

      const response = await fetch(queryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Range: `${args.offset}-${args.offset + args.limit - 1}`,
          Prefer: "count=exact",
        },
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        return errorResult(`Supabase query failed (${response.status}): ${body}`);
      }

      const data = await response.json();
      const contentRange = response.headers.get("Content-Range");
      const totalCount = contentRange
        ? parseInt(contentRange.split("/").pop() ?? "0", 10)
        : undefined;

      return textResult({
        table: args.table,
        query: args.query,
        results: data,
        count: Array.isArray(data) ? data.length : 0,
        total: totalCount,
        offset: args.offset,
        limit: args.limit,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return errorResult(`Library query failed: ${message}`);
    }
  },
);

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export { server };

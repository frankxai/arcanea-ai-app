/**
 * Arcanea Publishing House — Scribe Claw: Multi-Platform Distribution
 *
 * Connectors for distributing formatted content to Leanpub, Arcanea Web,
 * a Supabase social queue, and the NFT Forge pipeline.
 */

import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";

import type {
  Platform,
  DistributeInput,
  DistributeResult,
  DistributeConfig,
  LeanpubConfig,
  ArcaneaWebConfig,
  SocialQueueConfig,
  NftForgeConfig,
} from "./types.js";

export type {
  Platform,
  DistributeInput,
  DistributeResult,
  DistributeConfig,
};

// ---------------------------------------------------------------------------
// Leanpub Connector
// ---------------------------------------------------------------------------

async function distributeToLeanpub(
  content: DistributeInput,
  config: LeanpubConfig,
): Promise<DistributeResult> {
  const url = `https://leanpub.com/${config.slug}/preview.json`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: config.apiKey,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        platform: "leanpub",
        status: "failed",
        error: `Leanpub API returned ${response.status}: ${body}`,
      };
    }

    return {
      platform: "leanpub",
      status: "submitted",
      url: `https://leanpub.com/${config.slug}`,
    };
  } catch (err: unknown) {
    return {
      platform: "leanpub",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown Leanpub error",
    };
  }
}

// ---------------------------------------------------------------------------
// Arcanea Web Connector
// ---------------------------------------------------------------------------

async function distributeToArcaneaWeb(
  content: DistributeInput,
  config: ArcaneaWebConfig,
): Promise<DistributeResult> {
  try {
    // Copy source markdown to deploy directory
    await mkdir(config.deployDir, { recursive: true });

    const destPath = join(config.deployDir, basename(content.sourcePath));
    await copyFile(content.sourcePath, destPath);

    // Copy formatted files if available
    if (content.epubPath) {
      await copyFile(
        content.epubPath,
        join(config.deployDir, basename(content.epubPath)),
      );
    }
    if (content.pdfPath) {
      await copyFile(
        content.pdfPath,
        join(config.deployDir, basename(content.pdfPath)),
      );
    }

    // Trigger Vercel deploy if token is configured
    if (config.vercelToken && config.vercelProjectId) {
      const deployUrl = "https://api.vercel.com/v13/deployments";
      const headers: Record<string, string> = {
        Authorization: `Bearer ${config.vercelToken}`,
        "Content-Type": "application/json",
      };

      const body: Record<string, unknown> = {
        name: config.vercelProjectId,
        target: "production",
      };

      if (config.vercelTeamId) {
        body.teamId = config.vercelTeamId;
      }

      const response = await fetch(deployUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const responseBody = await response.text().catch(() => "");
        return {
          platform: "arcanea-web",
          status: "failed",
          error: `Vercel deploy returned ${response.status}: ${responseBody}`,
        };
      }

      const data = (await response.json()) as { url?: string };
      return {
        platform: "arcanea-web",
        status: "submitted",
        url: data.url ? `https://${data.url}` : undefined,
      };
    }

    // No Vercel token — files copied, manual deploy needed
    return {
      platform: "arcanea-web",
      status: "submitted",
      url: destPath,
    };
  } catch (err: unknown) {
    return {
      platform: "arcanea-web",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown deploy error",
    };
  }
}

// ---------------------------------------------------------------------------
// Social Queue Connector
// ---------------------------------------------------------------------------

async function distributeToSocialQueue(
  content: DistributeInput,
  config: SocialQueueConfig,
): Promise<DistributeResult> {
  try {
    const insertUrl = `${config.supabaseUrl}/rest/v1/social_queue`;

    const record = {
      content_id: content.contentId,
      title: content.title,
      author: content.author,
      description: content.description ?? "",
      source_path: content.sourcePath,
      cover_image: content.coverImage ?? null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    const response = await fetch(insertUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.supabaseKey,
        Authorization: `Bearer ${config.supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        platform: "social-queue",
        status: "failed",
        error: `Supabase insert returned ${response.status}: ${body}`,
      };
    }

    return {
      platform: "social-queue",
      status: "submitted",
    };
  } catch (err: unknown) {
    return {
      platform: "social-queue",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown social queue error",
    };
  }
}

// ---------------------------------------------------------------------------
// NFT Forge Connector
// ---------------------------------------------------------------------------

async function distributeToNftForge(
  content: DistributeInput,
  config: NftForgeConfig,
): Promise<DistributeResult> {
  try {
    await mkdir(config.outputDir, { recursive: true });

    // Write NFT metadata JSON
    const metadata = {
      name: content.title,
      description: content.description ?? "",
      author: content.author,
      content_id: content.contentId,
      source: content.sourcePath,
      cover_image: content.coverImage ?? null,
      created_at: new Date().toISOString(),
      ...content.metadata,
    };

    const metadataPath = join(
      config.outputDir,
      `${content.contentId}-metadata.json`,
    );
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2), "utf-8");

    // Trigger forge pipeline if URL is configured
    if (config.triggerUrl) {
      const response = await fetch(config.triggerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: content.contentId,
          metadataPath,
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        return {
          platform: "nft-forge",
          status: "failed",
          error: `NFT Forge trigger returned ${response.status}: ${body}`,
        };
      }
    }

    return {
      platform: "nft-forge",
      status: "submitted",
      url: metadataPath,
    };
  } catch (err: unknown) {
    return {
      platform: "nft-forge",
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown NFT Forge error",
    };
  }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const CONNECTOR_MAP: Record<
  Platform,
  (content: DistributeInput, config: DistributeConfig) => Promise<DistributeResult>
> = {
  leanpub: (content, config) => {
    if (!config.leanpub) {
      return Promise.resolve({
        platform: "leanpub" as const,
        status: "failed" as const,
        error: "Leanpub config not provided (slug + apiKey required)",
      });
    }
    return distributeToLeanpub(content, config.leanpub);
  },
  "arcanea-web": (content, config) => {
    if (!config.arcaneaWeb) {
      return Promise.resolve({
        platform: "arcanea-web" as const,
        status: "failed" as const,
        error: "Arcanea Web config not provided (deployDir required)",
      });
    }
    return distributeToArcaneaWeb(content, config.arcaneaWeb);
  },
  "social-queue": (content, config) => {
    if (!config.socialQueue) {
      return Promise.resolve({
        platform: "social-queue" as const,
        status: "failed" as const,
        error: "Social Queue config not provided (supabaseUrl + supabaseKey required)",
      });
    }
    return distributeToSocialQueue(content, config.socialQueue);
  },
  "nft-forge": (content, config) => {
    if (!config.nftForge) {
      return Promise.resolve({
        platform: "nft-forge" as const,
        status: "failed" as const,
        error: "NFT Forge config not provided (outputDir required)",
      });
    }
    return distributeToNftForge(content, config.nftForge);
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Distribute content to a single platform.
 *
 * @param platform - Target platform
 * @param content  - Content to distribute
 * @param config   - Platform-specific configuration
 * @returns Distribution result with status and optional URL
 */
export async function distributeTo(
  platform: Platform,
  content: DistributeInput,
  config: DistributeConfig,
): Promise<DistributeResult> {
  const connector = CONNECTOR_MAP[platform];
  if (!connector) {
    return {
      platform,
      status: "failed",
      error: `Unknown platform: ${platform}`,
    };
  }
  return connector(content, config);
}

/**
 * Distribute content to multiple platforms in parallel.
 *
 * @param content   - Content to distribute
 * @param platforms - Target platforms
 * @param config    - Platform-specific configuration
 * @returns Array of distribution results, one per platform
 */
export async function distributeToAll(
  content: DistributeInput,
  platforms: Platform[],
  config: DistributeConfig,
): Promise<DistributeResult[]> {
  return Promise.all(
    platforms.map((platform) => distributeTo(platform, content, config)),
  );
}

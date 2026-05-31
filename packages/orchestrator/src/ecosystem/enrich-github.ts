/**
 * Enrich a node with the latest commit timestamp from GitHub via Octokit.
 *
 * - `createGitHubClient` constructs an Octokit instance, optionally authed
 *   via `GITHUB_TOKEN`, with an explicit user agent.
 * - `enrichWithGitHub` returns `{ lastCommitAt }`, tolerating 404s by
 *   returning `null` so missing/private repos do not break the generator.
 * - `parseGitHubUrl` normalises full GitHub URLs to `{ owner, repo }`,
 *   stripping `.git` suffixes and rejecting non-github hosts.
 */
import { Octokit } from '@octokit/rest';

export interface EnrichmentInput {
  owner: string;
  repo: string;
  branch: string;
}

export interface EnrichmentResult {
  lastCommitAt: string | null;
}

export function createGitHubClient(): Octokit {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
    userAgent: 'arcanea-ecosystem-builder',
  });
}

export async function enrichWithGitHub(
  input: EnrichmentInput,
  client: Pick<Octokit, 'repos'>,
): Promise<EnrichmentResult> {
  try {
    const { data } = await client.repos.getCommit({
      owner: input.owner,
      repo: input.repo,
      ref: input.branch,
    });
    return { lastCommitAt: data.commit?.author?.date ?? null };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) return { lastCommitAt: null };
    throw err;
  }
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

/**
 * Merge curated manifest + sibling repo registry + monorepo scan + GitHub
 * enrichments into the final, hydrated `EcosystemNode[]` consumed by the
 * derived.ts renderer.
 *
 * Steps:
 *   1) Seed nodes from sibling repos (repos.json).
 *   2) Overlay manifest entries (manifest wins on conflict).
 *   3) Compute `consumedBy` back-references from `consumes` edges.
 *   4) Apply GitHub enrichments + status inference (status_override respected).
 *   5) Stable sort by id for diffability.
 */
import type { Manifest, EcosystemNode, Layer, Gate, Hemisphere, Status } from './schema.js';
import type { MonorepoPackage } from './scan-monorepo.js';
import type { SiblingRepo } from './scan-siblings.js';
import { inferStatus } from './infer-status.js';

export interface MergeInput {
  manifest: Manifest;
  siblingRepos: SiblingRepo[];
  monorepoPackages: MonorepoPackage[];
  enrichments: Map<string, { lastCommitAt: string | null }>;  // key: "owner/repo"
  now: string;
}

interface PartialNode {
  id: string;
  name: string;
  description: string;
  layer: Layer;
  gate: Gate;
  hemisphere: Hemisphere;
  repo?: string;
  github?: string;
  publicUrl?: string;
  packageVersion?: string;
  consumes: string[];
  consumedBy: string[];
  isExternal: boolean;
  owner?: string;
  links: Record<string, string>;
  statusOverride?: Status;
}

export function mergeAll(input: MergeInput): EcosystemNode[] {
  const { manifest, siblingRepos, monorepoPackages, enrichments, now } = input;
  const monorepoByName = new Map(monorepoPackages.map((p) => [p.name, p]));

  const byId = new Map<string, PartialNode>();

  // 1) Sibling repos seed nodes
  for (const r of siblingRepos) {
    byId.set(r.name, {
      id: r.name,
      name: r.name,
      description: r.description,
      layer: (r.layer as Layer) ?? 'product',
      gate: (r.gate as Gate) ?? 'form',
      hemisphere: (r.hemisphere as Hemisphere) ?? 'arc',
      repo: r.github,
      github: r.github.startsWith('http') ? r.github : `https://github.com/${r.github}`,
      publicUrl: r.publicUrl ?? undefined,
      consumes: [],
      consumedBy: [],
      isExternal: false,
      links: r.publicUrl ? { live: r.publicUrl } : {},
      statusOverride: r.status_override as Status | undefined,
    });
  }

  // 2) Manifest nodes overlay
  for (const n of manifest.nodes) {
    const monorepoPkg = monorepoByName.get(n.name);
    const existing = byId.get(n.id);
    byId.set(n.id, {
      ...existing,
      id: n.id,
      name: n.name,
      description: n.description ?? existing?.description ?? '',
      layer: n.layer,
      gate: n.gate,
      hemisphere: n.hemisphere,
      repo: n.repo ?? monorepoPkg?.path ?? existing?.repo,
      github: n.github ?? existing?.github,
      publicUrl: n.publicUrl ?? existing?.publicUrl,
      packageVersion: monorepoPkg?.version ?? existing?.packageVersion,
      consumes: n.consumes ?? [],
      consumedBy: existing?.consumedBy ?? [],
      isExternal: n.isExternal ?? false,
      owner: n.owner ?? existing?.owner,
      links: { ...(existing?.links ?? {}), ...(n.links ?? {}) },
      statusOverride: (n as { status_override?: Status }).status_override ?? existing?.statusOverride,
    });
  }

  // 3) Back-reference consumedBy
  for (const n of byId.values()) {
    for (const dep of n.consumes) {
      const target = byId.get(dep);
      if (target) target.consumedBy.push(n.id);
    }
  }

  // 4) Apply enrichments + status inference
  const result: EcosystemNode[] = [];
  for (const n of byId.values()) {
    const ghKey = n.github
      ? n.github.replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '')
      : null;
    const enrichment = ghKey ? enrichments.get(ghKey) : null;

    result.push({
      id: n.id,
      name: n.name,
      description: n.description,
      layer: n.layer,
      gate: n.gate,
      hemisphere: n.hemisphere,
      status: inferStatus({
        layer: n.layer,
        consumedByCount: n.consumedBy.length,
        isExternal: n.isExternal,
        statusOverride: n.statusOverride,
        publicUrl: n.publicUrl,
        lastCommitAt: enrichment?.lastCommitAt ?? undefined,
        now,
      }),
      repo: n.repo,
      github: n.github,
      publicUrl: n.publicUrl,
      packageVersion: n.packageVersion,
      lastCommitAt: enrichment?.lastCommitAt ?? undefined,
      lastVerifiedAt: now,
      consumes: n.consumes,
      consumedBy: n.consumedBy,
      isExternal: n.isExternal,
      owner: n.owner,
      links: n.links,
    });
  }

  // 5) Stable sort by id for diffability
  return result.sort((a, b) => a.id.localeCompare(b.id));
}

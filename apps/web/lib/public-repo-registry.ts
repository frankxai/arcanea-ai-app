// apps/web/lib/public-repo-registry.ts
//
// Thin adapter over the generated ecosystem source of truth.
// Reads from ./ecosystem/derived (auto-generated from .arcanea/config/{repos.json,manifest.yaml}).
// DO NOT add hand-coded data here — edit the config files and re-run `pnpm -F @arcanea/orchestrator ecosystem:build`.

import { NODES, type EcosystemNode } from './ecosystem/derived';

export type PublicRepoGroup = 'core' | 'intelligence' | 'tools' | 'protocol' | 'archive' | 'upstream';
export type PublicRepoStatus = 'public' | 'private' | 'beta' | 'unresolved' | 'upstream';

export interface PublicRepo {
  name: string;
  group: PublicRepoGroup;
  description: string;
  language: string;
  status: PublicRepoStatus;
  url: string | null;
  github: string;
  role: string;
  branch: string;
  packages: string[];
}

function statusFromNode(node: EcosystemNode): PublicRepoStatus {
  if (node.isExternal) return 'upstream';
  if (node.status === 'shipped' || node.status === 'built') return 'public';
  if (node.status === 'wip') return 'beta';
  if (node.status === 'sunset' || node.status === 'orphan') return 'unresolved';
  return 'public';
}

function groupFromNode(node: EcosystemNode): PublicRepoGroup {
  if (node.isExternal) return 'upstream';
  if (node.layer === 'substrate') return 'intelligence';
  if (node.layer === 'surface') return 'core';
  return 'tools';
}

export const PUBLIC_REPOS: PublicRepo[] = NODES
  .filter((n) => n.repo || n.github)
  .map((n) => ({
    name: n.name,
    group: groupFromNode(n),
    description: n.description,
    language: 'TypeScript',
    status: statusFromNode(n),
    url: n.publicUrl ?? n.github ?? null,
    github: n.github ?? '',
    role: n.layer,
    branch: 'main',
    packages: n.packageVersion ? [n.name] : [],
  }));

export const ARC_REPOS = PUBLIC_REPOS.filter((r) => r.group !== 'upstream');
export const ACTIVE_ARC_REPOS = ARC_REPOS.filter((r) => r.status !== 'unresolved');
export const PUBLIC_ARC_REPOS = ACTIVE_ARC_REPOS.filter((r) => r.url?.startsWith('https://github.com/'));
export const UNRESOLVED_ARC_REPOS = ARC_REPOS.filter((r) => r.status === 'unresolved');
export const UPSTREAM_REPOS = PUBLIC_REPOS.filter((r) => r.group === 'upstream');

export const PUBLIC_REPO_SUMMARY = {
  tracked: ARC_REPOS.length,
  active: ACTIVE_ARC_REPOS.length,
  public: PUBLIC_ARC_REPOS.length,
  private: ACTIVE_ARC_REPOS.filter((r) => r.status === 'private').length,
  unresolved: UNRESOLVED_ARC_REPOS.length,
  upstream: UPSTREAM_REPOS.length,
  packages: Array.from(new Set(PUBLIC_REPOS.flatMap((r) => r.packages))).length,
};

export const PUBLIC_PACKAGE_NAMES = Array.from(new Set(PUBLIC_REPOS.flatMap((r) => r.packages))).sort();

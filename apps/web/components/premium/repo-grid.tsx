/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import {
  brand,
  guardianAccents,
  semantic,
  competitorAccent,
} from "@arcanea/design-system";
import {
  PUBLIC_REPOS,
  PUBLIC_REPO_SUMMARY,
  type PublicRepoGroup,
  type PublicRepoStatus,
} from "@/lib/public-repo-registry";

// ---------------------------------------------------------------------------
// RepoGrid — Visualize the Arcanea monorepo / multi-repo landscape.
// Groups repos by function (core, packages, tools, experiments) with
// activity indicators.
// ---------------------------------------------------------------------------

export interface Repo {
  name: string;
  group: PublicRepoGroup;
  description: string;
  language: string;
  stars?: number;
  status: PublicRepoStatus;
  url: string | null;
  github: string;
  role: string;
  branch: string;
}

export const REPOS: Repo[] = PUBLIC_REPOS;

const GROUP_META: Record<Repo["group"], { label: string; color: string; description: string }> = {
  core: {
    label: "Core",
    color: brand.aquamarine,
    description: "Production app, OSS framework, and product repos",
  },
  intelligence: {
    label: "Intelligence",
    color: brand.atlanteanTeal,
    description: "Memory, substrate, and shared context systems",
  },
  tools: {
    label: "Tools",
    color: guardianAccents.lyria,
    description: "Harnesses, orchestration, CLI, and capture surfaces",
  },
  protocol: {
    label: "Protocol",
    color: brand.arcaneanGold,
    description: "Adoption kits and portable scaffolds",
  },
  archive: {
    label: "Needs verification",
    color: semantic.error,
    description: "Historical entries not linked until URLs resolve",
  },
  upstream: {
    label: "Upstream",
    color: competitorAccent,
    description: "External dependency, not an Arcanea-owned repo",
  },
};

const STATUS_LABEL: Record<PublicRepoStatus, string> = {
  public: "PUBLIC",
  private: "PRIVATE",
  beta: "BETA",
  unresolved: "UNRESOLVED",
  upstream: "UPSTREAM",
};

const STATUS_COLOR: Record<PublicRepoStatus, string> = {
  public: brand.aquamarine,
  private: brand.arcaneanGold,
  beta: brand.arcaneanGold,
  unresolved: semantic.error,
  upstream: competitorAccent,
};

function RepoCard({
  repo,
  group,
  index,
}: {
  repo: Repo;
  group: { meta: (typeof GROUP_META)[PublicRepoGroup] };
  index: number;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between mb-2">
        <div className="flex min-w-0 items-center gap-1.5 text-[13px] font-mono font-semibold text-white/85">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: group.meta.color }}
            aria-hidden="true"
          />
          <span className="truncate">{repo.name}</span>
        </div>
        <span
          className="shrink-0 text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded"
          style={{
            background: `${STATUS_COLOR[repo.status]}12`,
            color: STATUS_COLOR[repo.status],
          }}
        >
          {STATUS_LABEL[repo.status]}
        </span>
      </div>
      <p className="text-[12px] text-white/45 leading-relaxed mb-3 line-clamp-2">
        {repo.description}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/35 font-mono">
          {repo.language}
        </span>
        <span className="text-[10px] text-white/15">/</span>
        <span className="truncate text-[10px] text-white/25 group-hover:text-white/50 transition-colors">
          {repo.url ? repo.github : repo.status === "private" ? "private deployment repo" : "link withheld"}
        </span>
      </div>
    </>
  );

  const className =
    "group block p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all";

  if (!repo.url) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className={className}
      >
        {content}
      </m.div>
    );
  }

  return (
    <m.a
      href={repo.url}
      target={repo.url.startsWith("http") ? "_blank" : undefined}
      rel={repo.url.startsWith("http") ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={className}
    >
      {content}
    </m.a>
  );
}

export function RepoGrid() {
  const groups = (Object.keys(GROUP_META) as Repo["group"][]).map((g) => ({
    key: g,
    meta: GROUP_META[g],
    repos: REPOS.filter((r) => r.group === g),
  }));

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-xs leading-relaxed text-white/45">
        <span className="font-mono uppercase tracking-wider text-white/65">
          Registry truth:
        </span>{" "}
        {PUBLIC_REPO_SUMMARY.active} active Arcanea repos tracked, {PUBLIC_REPO_SUMMARY.public} public GitHub repos,{" "}
        {PUBLIC_REPO_SUMMARY.private} private production repo, {PUBLIC_REPO_SUMMARY.unresolved} unresolved historical entries.
      </div>
      {groups.map((group, groupIdx) => (
        <m.div
          key={group.key}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: groupIdx * 0.08 }}
        >
          {/* Group header */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: group.meta.color,
                boxShadow: `0 0 8px ${group.meta.color}`,
              }}
            />
            <h3
              className="text-base font-display font-bold"
              style={{ color: group.meta.color }}
            >
              {group.meta.label}
            </h3>
            <span className="text-[11px] font-mono tracking-wider uppercase text-white/30">
              {group.meta.description}
            </span>
            <span className="text-[10px] font-mono text-white/20 ml-auto">
              {group.repos.length} {group.repos.length === 1 ? "repo" : "repos"}
            </span>
          </div>

          {/* Repo cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {group.repos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} group={group} index={i} />
            ))}
          </div>
        </m.div>
      ))}
    </div>
  );
}

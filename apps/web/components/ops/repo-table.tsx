import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { RepoHealth, RepoCategory } from "@/lib/ops/types";
import { HealthBadge, BuildStatusBadge, HealthScore } from "./health-badge";

// ─── Category Header ───────────────────────────────────────────────────────

const CATEGORY_ACCENTS: Record<RepoCategory, string> = {
  Platform: "from-[#7fffd4] to-[#78a6ff]",
  Intelligence: "from-[#78a6ff] to-[#a78bfa]",
  Content: "from-[#ffd700] to-[#f59e0b]",
  Extensions: "from-[#7fffd4] to-[#34d399]",
  Skills: "from-[#a78bfa] to-[#f472b6]",
  Archive: "from-zinc-500 to-zinc-600",
};

interface CategoryGroupProps {
  category: RepoCategory;
  repos: RepoHealth[];
}

export function CategoryGroup({ category, repos }: CategoryGroupProps) {
  const healthyCount = repos.filter((r) => r.healthLevel === "healthy").length;
  const totalCount = repos.length;

  return (
    <section className="space-y-3">
      {/* Category Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-6 w-1 rounded-full bg-gradient-to-b",
              CATEGORY_ACCENTS[category],
            )}
          />
          <h3 className="font-display text-lg font-semibold tracking-wide text-white/90">
            {category}
          </h3>
          <span className="text-xs text-white/40 font-mono">
            {healthyCount}/{totalCount} healthy
          </span>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl border border-white/[0.06]"
        style={{
          background:
            "linear-gradient(145deg, rgba(18,18,24,0.75) 0%, rgba(12,12,18,0.85) 100%)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                  Repository
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                  Last Push
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white/40">
                  Issues
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white/40">
                  PRs
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white/40">
                  Build
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                  Health
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {repos.map((repo) => (
                <RepoRow key={repo.name} repo={repo} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Repo Row ──────────────────────────────────────────────────────────────

function RepoRow({ repo }: { repo: RepoHealth }) {
  const lastPushDisplay =
    repo.lastPush === "unknown"
      ? "Unknown"
      : formatRelativeTime(repo.lastPush);

  return (
    <tr className="transition-colors hover:bg-white/[0.02] group">
      {/* Name + Description */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white/90 hover:text-[#7fffd4] transition-colors font-mono text-sm"
          >
            {repo.name}
          </a>
          <span className="text-xs text-white/60 line-clamp-1">
            {repo.description}
          </span>
        </div>
      </td>

      {/* Last Push */}
      <td className="px-4 py-3 text-xs text-white/50 whitespace-nowrap">
        {lastPushDisplay}
      </td>

      {/* Issues */}
      <td className="px-4 py-3 text-center">
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            repo.openIssues > 10
              ? "text-amber-400"
              : repo.openIssues > 0
                ? "text-white/60"
                : "text-white/50",
          )}
        >
          {repo.openIssues}
        </span>
      </td>

      {/* PRs */}
      <td className="px-4 py-3 text-center">
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            repo.openPRs > 5
              ? "text-amber-400"
              : repo.openPRs > 0
                ? "text-white/60"
                : "text-white/50",
          )}
        >
          {repo.openPRs}
        </span>
      </td>

      {/* Build */}
      <td className="px-4 py-3 text-center">
        <BuildStatusBadge status={repo.buildStatus} />
      </td>

      {/* Health Score */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <HealthScore score={repo.healthScore} level={repo.healthLevel} />
          <HealthBadge level={repo.healthLevel} className="hidden sm:inline-flex" />
        </div>
      </td>
    </tr>
  );
}

// ─── Relative Time Formatting ──────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(date);
}

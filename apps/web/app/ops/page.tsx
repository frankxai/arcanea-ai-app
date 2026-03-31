import type { ReactNode } from "react";
import Link from "next/link";
import internalOpsDashboard from "@/lib/ops/internal-dashboard";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function relativeTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function levelFromOk(ok: boolean) {
  return ok ? "healthy" : "critical";
}

function pillClasses(level: "healthy" | "warning" | "critical" | "info") {
  return {
    healthy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    critical: "bg-red-500/15 text-red-300 border-red-500/25",
    info: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  }[level];
}

function StatusPill({
  level,
  children,
}: {
  level: "healthy" | "warning" | "critical" | "info";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        pillClasses(level),
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: string | number;
  sublabel: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm">
      <p className={cn("text-2xl font-bold", accent)}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">{label}</p>
      <p className="mt-2 text-xs text-white/55">{sublabel}</p>
    </div>
  );
}

function SectionTitle({
  title,
  accent,
  eyebrow,
}: {
  title: string;
  accent: string;
  eyebrow?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <div className={cn("h-7 w-1 rounded-full", accent)} />
          <h2 className="font-[Cinzel,serif] text-xl font-semibold text-white/90">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default async function OpsPage() {
  const data = await internalOpsDashboard.getInternalOpsDashboardData();
  const repoWarnings = data.repos.filter((repo) => repo.status !== "ok");
  const machineFailures =
    data.machine.groups.flatMap((group) => group.items).filter((item) => !item.ok);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(127,255,212,0.14),transparent_35%),radial-gradient(circle_at_top_right,rgba(120,166,255,0.12),transparent_32%),linear-gradient(180deg,rgba(18,18,24,0.96),rgba(8,8,12,0.98))] p-6 shadow-[0_0_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[#7fffd4]/60">
                Internal Ops Surface
              </p>
              <h1 className="font-[Cinzel,serif] text-3xl font-bold tracking-wide text-white/92 sm:text-4xl">
                Arcanea control plane made visible
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/62">
                Repo health, worktrees, machine readiness, handoff artifacts, and
                orchestrator state are rendered from the live local platform instead
                of fallback data or memory.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill level={data.machine.summary.overall === "READY" ? "healthy" : "critical"}>
                Machine {data.machine.summary.overall}
              </StatusPill>
              <StatusPill level={data.repoSummary.overall === "healthy" ? "healthy" : "warning"}>
                Repos {data.repoSummary.overall}
              </StatusPill>
              <StatusPill level={data.orchestrator.help.ok ? "healthy" : "critical"}>
                Orchestrator {data.orchestrator.help.ok ? "ready" : "blocked"}
              </StatusPill>
              <StatusPill level="info">Updated {relativeTime(data.generatedAt)}</StatusPill>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-6">
            <SummaryCard
              label="Repos"
              value={data.repoSummary.total}
              sublabel={`${data.repoSummary.ok} healthy`}
              accent="text-[#7fffd4]"
            />
            <SummaryCard
              label="Warnings"
              value={data.repoSummary.warn}
              sublabel={`${data.repoSummary.error} hard errors`}
              accent="text-amber-300"
            />
            <SummaryCard
              label="Dirty"
              value={data.repoSummary.dirty}
              sublabel="repos need slicing"
              accent="text-[#ffd700]"
            />
            <SummaryCard
              label="Smoke"
              value={data.repoSummary.smokePassed}
              sublabel={`${data.repoSummary.smokeFailed} failed`}
              accent="text-[#78a6ff]"
            />
            <SummaryCard
              label="Worktrees"
              value={data.worktrees.length}
              sublabel="attached git workspaces"
              accent="text-fuchsia-300"
            />
            <SummaryCard
              label="Handoffs"
              value={data.handoffs.length}
              sublabel="recent planning artifacts"
              accent="text-cyan-300"
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <SectionTitle
              title="Repo Constellation"
              accent="bg-gradient-to-b from-[#7fffd4] to-[#78a6ff]"
              eyebrow="Health and execution"
            />
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <div className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.8fr] gap-4 border-b border-white/[0.08] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-white/40">
                <span>Repo</span>
                <span>Branch</span>
                <span>Status</span>
                <span>Smoke</span>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {data.repos.map((repo) => {
                  const smokeTotal = repo.smokeResults?.length ?? 0;
                  const smokeFailures = repo.smokeResults?.filter((result) => !result.ok).length ?? 0;
                  const level =
                    repo.status === "error"
                      ? "critical"
                      : repo.status === "warn"
                        ? "warning"
                        : "healthy";

                  return (
                    <div key={repo.id} className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.8fr] gap-4 px-4 py-4 text-sm">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-white/88">{repo.label}</p>
                          {repo.cli?.length ? (
                            <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/45">
                              {repo.cli[0]}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-white/50">{repo.purpose}</p>
                        <p className="mt-2 text-[11px] font-mono text-white/35">{repo.path}</p>
                      </div>
                      <div className="text-xs text-white/58">
                        <p className="font-mono text-white/72">{repo.branch || "n/a"}</p>
                        <p className="mt-1 font-mono text-white/40">{repo.commit?.slice(0, 9) || "unknown"}</p>
                        {repo.dirty ? (
                          <p className="mt-2 text-amber-300/80">{repo.dirtyFileCount} dirty</p>
                        ) : (
                          <p className="mt-2 text-emerald-300/80">clean</p>
                        )}
                      </div>
                      <div className="pt-0.5">
                        <StatusPill level={level}>
                          {repo.status === "ok" ? "ok" : repo.status}
                        </StatusPill>
                      </div>
                      <div className="text-xs text-white/58">
                        <p className="text-white/72">{smokeTotal > 0 ? `${smokeTotal} checks` : "no smoke"}</p>
                        <p className={cn("mt-1", smokeFailures > 0 ? "text-red-300/85" : "text-emerald-300/85")}>
                          {smokeFailures > 0 ? `${smokeFailures} failed` : "passing"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle
              title="Machine Readiness"
              accent="bg-gradient-to-b from-[#ffd700] to-[#f97316]"
              eyebrow="Restart recovery"
            />
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/40">ops:machine</p>
                  <p className="mt-2 text-2xl font-semibold text-white/90">
                    {data.machine.summary.passed} / {data.machine.summary.passed + data.machine.summary.failed}
                  </p>
                </div>
                <StatusPill
                  level={data.machine.summary.overall === "READY" ? "healthy" : "critical"}
                >
                  {data.machine.summary.overall}
                </StatusPill>
              </div>

              <div className="mt-5 space-y-3">
                {data.machine.groups.map((group) => {
                  const failures = group.items.filter((item) => !item.ok);
                  return (
                    <div key={group.name} className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white/82">{group.name}</p>
                        <span className="text-xs text-white/45">
                          {group.items.length - failures.length}/{group.items.length}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <StatusPill key={`${group.name}-${item.label}`} level={levelFromOk(item.ok)}>
                            {item.label}
                          </StatusPill>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {machineFailures.length ? (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200/85">
                  <p className="font-medium">Current blockers</p>
                  <ul className="mt-2 space-y-1">
                    {machineFailures.map((failure) => (
                      <li key={failure.label}>
                        {failure.label}
                        {failure.detail ? ` - ${failure.detail}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <SectionTitle
              title="Worktrees"
              accent="bg-gradient-to-b from-[#a78bfa] to-[#f472b6]"
              eyebrow="Branch topology"
            />
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="space-y-3">
                {data.worktrees.map((worktree) => (
                  <div key={worktree.path} className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white/88">{worktree.path}</p>
                        <p className="mt-2 text-xs font-mono text-white/45">{worktree.head.slice(0, 12)}</p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <StatusPill level={worktree.detached ? "warning" : "healthy"}>
                          {worktree.branch || "detached"}
                        </StatusPill>
                        {worktree.prunable ? <StatusPill level="warning">prunable</StatusPill> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle
              title="Orchestrator and Flow"
              accent="bg-gradient-to-b from-[#78a6ff] to-[#7fffd4]"
              eyebrow="Multi-agent execution"
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-[Cinzel,serif] text-lg text-white/88">Arcanea Orchestrator</p>
                  <StatusPill level={data.orchestrator.help.ok ? "healthy" : "critical"}>
                    {data.orchestrator.help.ok ? "usable" : "blocked"}
                  </StatusPill>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/40">status probe</p>
                <p className="mt-2 text-sm text-white/70">{data.orchestrator.status.summary}</p>
                <pre className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-3 text-[11px] leading-5 text-white/55">
                  {data.orchestrator.status.raw || data.orchestrator.help.raw}
                </pre>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-[Cinzel,serif] text-lg text-white/88">Flow Delegation</p>
                  <StatusPill level={data.flowBridge.ok ? "healthy" : "critical"}>
                    {data.flowBridge.ok ? "bridged" : "blocked"}
                  </StatusPill>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/40">arcanea-flow ao</p>
                <p className="mt-2 text-sm text-white/70">{data.flowBridge.summary}</p>
                <pre className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-3 text-[11px] leading-5 text-white/55">
                  {data.flowBridge.raw}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionTitle
            title="Current handoffs and planning artifacts"
            accent="bg-gradient-to-b from-[#7fffd4] to-[#ffd700]"
            eyebrow="Done and next"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.handoffs.map((handoff) => (
              <div key={handoff.path} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-sm font-medium text-white/86">{handoff.name}</p>
                <p className="mt-2 text-xs text-white/50">{relativeTime(handoff.updatedAt)}</p>
                <p className="mt-3 line-clamp-2 break-all text-[11px] font-mono text-white/36">
                  {handoff.path}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Link
            href="/ops/agents"
            className="rounded-2xl border border-[#7fffd4]/20 bg-[#7fffd4]/10 p-5 transition-colors hover:bg-[#7fffd4]/15"
          >
            <p className="font-[Cinzel,serif] text-lg text-[#7fffd4]">Agents</p>
            <p className="mt-2 text-sm text-white/68">
              Registry, categories, and evaluation framing for Arcanea agents.
            </p>
          </Link>
          <Link
            href="/command-center"
            className="rounded-2xl border border-[#78a6ff]/20 bg-[#78a6ff]/10 p-5 transition-colors hover:bg-[#78a6ff]/15"
          >
            <p className="font-[Cinzel,serif] text-lg text-[#78a6ff]">Command Center</p>
            <p className="mt-2 text-sm text-white/68">
              Operational control surfaces, social, inbox, and command workflows.
            </p>
          </Link>
          <Link
            href="/projects"
            className="rounded-2xl border border-[#ffd700]/20 bg-[#ffd700]/10 p-5 transition-colors hover:bg-[#ffd700]/15"
          >
            <p className="font-[Cinzel,serif] text-lg text-[#ffd700]">Projects</p>
            <p className="mt-2 text-sm text-white/68">
              Project workspaces and the repaired integration branch flow.
            </p>
          </Link>
        </section>

        {repoWarnings.length ? (
          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
            <p className="font-[Cinzel,serif] text-lg text-amber-200">Next highest-value cleanup</p>
            <p className="mt-2 text-sm text-amber-100/80">
              Convert dirty repos into intentional slices, starting with the control-plane tranche in the main repo, then
              orchestrator productization, then flow delegation cleanup.
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}

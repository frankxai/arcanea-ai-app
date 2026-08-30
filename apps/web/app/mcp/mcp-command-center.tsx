import { LazyMotion, domAnimation, m } from "framer-motion";
import { Terminal } from "@/lib/phosphor-icons";

const MCP_HTTP = "https://www.arcanea.ai/api/mcp";

const PLATFORMS = [
  {
    name: "Claude Code",
    status: "live" as const,
    description: "Remote HTTP MCP. Public worldbuilding tools; no login.",
    install: `claude mcp add --transport http arcanea ${MCP_HTTP}`,
  },
  {
    name: "Cursor",
    status: "live" as const,
    description: "Add this to .cursor/mcp.json, then reload MCP.",
    install: JSON.stringify(
      { mcpServers: { arcanea: { url: MCP_HTTP } } },
      null,
      2,
    ),
  },
  {
    name: "Claude Desktop / local stdio",
    status: "live" as const,
    description:
      "Prefer the HTTP URL above. npm @arcanea/mcp-server@0.7.0 still declares a workspace:* dependency and cannot install from the registry.",
    install: `npx @arcanea/skills`,
  },
];

export function McpCommandCenter() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-display font-semibold tracking-[-0.03em] text-white md:text-5xl mb-4">
              Arcanea MCP Server
            </h2>
            <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-3">
              Worldbuilding tools for Claude, Cursor, and any MCP client. Ten
              Gates generators run over HTTP now.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-2 text-sm text-[var(--arc-brand-atlantean-teal)]">
              <span
                className="inline-block w-2 h-2 rounded-full bg-[var(--arc-brand-atlantean-teal)]"
                aria-hidden="true"
              />
              Live HTTP MCP · 16 public tools
            </div>
          </div>

          <div className="grid gap-6 mb-16">
            {PLATFORMS.map((platform, index) => (
              <m.article
                key={platform.name}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 font-display font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-display font-semibold text-white/90">
                        {platform.name}
                      </h3>
                      <span className="text-[11px] tracking-tight text-[var(--arc-brand-atlantean-teal)] px-2 py-0.5 rounded border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/10">
                        Live
                      </span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed mb-3">
                      {platform.description}
                    </p>
                    <pre className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/40 p-3 text-[12px] leading-relaxed text-[var(--arc-brand-atlantean-teal)]">
                      <code>{platform.install}</code>
                    </pre>
                  </div>
                </div>
              </m.article>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <h3 className="text-xl font-display font-semibold text-white/90 mb-4">
              Available now
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
                  <span className="text-xs text-white/60">→</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">HTTP MCP</p>
                  <p className="text-xs text-white/40">
                    <code className="text-[var(--arc-brand-atlantean-teal)]">
                      {MCP_HTTP}
                    </code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
                  <Terminal
                    size={12}
                    weight="duotone"
                    className="text-white/60"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Skills pack</p>
                  <p className="text-xs text-white/40">
                    <code className="text-[var(--arc-brand-atlantean-teal)]">
                      npx @arcanea/skills
                    </code>
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 pt-4 border-t border-white/[0.06] text-xs text-white/40 leading-relaxed">
              Discovery:{" "}
              <code className="text-white/55">/.well-known/mcp.json</code>
              . World-context tools stay Bearer-gated on the same path. npm
              stdio remains blocked by a workspace:* publish until a patched
              release.
            </p>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

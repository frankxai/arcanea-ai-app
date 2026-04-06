import { Metadata } from "next";
import Link from "next/link";
import { Icons } from "./developers-icons";
import {
  PACKAGES,
  TOOLS,
  QUICK_STARTS,
  CREDITS_ENDPOINTS,
  MCP_SERVERS,
  OPEN_SOURCE_REPOS,
  ARCHITECTURE_LAYERS,
} from "./developers-data";

export const metadata: Metadata = {
  title: "Developers — Build on Arcanea",
  description:
    "Build on the Arcanea platform. 27 repos, 35 npm packages, MCP server with 42 tools, and comprehensive APIs.",
  openGraph: {
    title: "Developers — Build on Arcanea",
    description:
      "Build on the Arcanea platform. 27 repos, 35 npm packages, MCP server with 42 tools, and comprehensive APIs.",
  },
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <Icons.Code />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  For Developers
                </span>
              </div>

              <h1 className="text-fluid-3xl font-display font-bold mb-4">
                Build on
                <span className="block text-gradient-brand">Arcanea</span>
              </h1>

              <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl">
                The Arcanea platform is built on a foundation of intelligent
                packages. Build creative skills, contribute to our open source
                packages, and extend the platform with the MCP server.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/frankxai/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <Icons.Github />
                  View on GitHub
                </a>
                <Link
                  href="/developers/api"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <Icons.Code />
                  API Reference
                  <Icons.ChevronRight />
                </Link>
                <Link
                  href="/skills"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <Icons.Sparkles />
                  Create a Skill
                  <Icons.ChevronRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="mb-16" aria-labelledby="packages-heading">
          <div className="mb-8">
            <h2 id="packages-heading" className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2">Intelligence Packages</h2>
            <h3 className="text-fluid-2xl font-display font-bold">The Foundation</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PACKAGES.map((pkg) => (
              <a key={pkg.name} href={pkg.href} target="_blank" rel="noopener noreferrer" className="group relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden glow-card hover-lift transition-all hover:border-white/[0.12]">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(ellipse at 30% 30%, ${pkg.color}12, transparent 65%)` }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icons.Box style={{ color: pkg.color }} />
                      <span className="font-mono text-sm text-text-primary">{pkg.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Icons.GitBranch />
                      {pkg.stars}
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed font-sans mb-4">{pkg.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full border" style={{ backgroundColor: `${pkg.color}12`, color: pkg.color, borderColor: `${pkg.color}30` }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-16" aria-labelledby="tools-heading">
          <div className="mb-8">
            <h2 id="tools-heading" className="text-xs font-mono tracking-[0.35em] uppercase text-brand-gold mb-2">Platform Tools</h2>
            <h3 className="text-fluid-2xl font-display font-bold">What you can build</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TOOLS.map((category) => (
              <div key={category.category} className="liquid-glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                  <h4 className="font-display font-semibold text-text-primary">{category.category}</h4>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-3">
                      <Icons.Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: category.color }} />
                      <div>
                        <span className="text-sm text-text-primary font-medium">{item.name}</span>
                        <p className="text-xs text-text-muted">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Starts */}
        <section className="mb-16" aria-labelledby="quickstart-heading">
          <div className="mb-8">
            <h2 id="quickstart-heading" className="text-xs font-mono tracking-[0.35em] uppercase text-earth mb-2">Quick Starts</h2>
            <h3 className="text-fluid-2xl font-display font-bold">Begin building</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {QUICK_STARTS.map((item) => {
              const ItemIcon = Icons[item.iconKey];
              return (
                <Link key={item.title} href={item.href} className="group relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden glow-card hover-lift transition-all">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(ellipse at 30% 30%, ${item.color}12, transparent 65%)` }} />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}18` }}>
                      {ItemIcon && <ItemIcon style={{ color: item.color }} />}
                    </div>
                    <h4 className="font-display font-semibold text-text-primary mb-1">{item.title}</h4>
                    <p className="text-xs text-text-muted mb-3">{item.description}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.color }}>
                      <span>Explore</span>
                      <Icons.ArrowRight />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Start Install */}
        <section className="mb-16" aria-labelledby="install-heading">
          <div className="mb-8">
            <h2 id="install-heading" className="text-xs font-mono tracking-[0.35em] uppercase text-brand-primary mb-2">Quick Start</h2>
            <h3 className="text-fluid-2xl font-display font-bold">Get up and running</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Icons.Terminal, color: "#7fffd4", title: "Install Arcanea Skills", desc: "Add 54 skills to your coding agent", cmd: "npx @arcanea/skills" },
              { icon: Icons.Sparkles, color: "#a855f7", title: "Launch Claude Arcanea", desc: "Start the Arcanea-enhanced Claude agent", cmd: "npx claude-arcanea" },
              { icon: Icons.Box, color: "#ffd700", title: "Install a Package", desc: "Add any intelligence package to your project", cmd: "npm install @arcanea/council @arcanea/rituals" },
              { icon: Icons.Server, color: "#78a6ff", title: "Start MCP Server", desc: "Run the Arcanea MCP server locally", cmd: "npx @arcanea/mcp-server" },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <div key={item.title} className="liquid-glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                      <ItemIcon style={{ color: item.color }} />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-text-primary text-sm">{item.title}</h4>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                  <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-4 overflow-x-auto">
                    <code className="font-mono text-sm" style={{ color: item.color }}>{item.cmd}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Credits API */}
        <section className="mb-16" aria-labelledby="credits-heading">
          <div className="mb-8">
            <h2 id="credits-heading" className="text-xs font-mono tracking-[0.35em] uppercase text-brand-gold mb-2">Credits API</h2>
            <h3 className="text-fluid-2xl font-display font-bold">Billing & Credits</h3>
            <p className="text-text-secondary text-sm mt-2 max-w-2xl">
              All credits endpoints require authentication via Supabase session.
              The webhook endpoint requires Stripe signature verification.
            </p>
          </div>
          <div className="space-y-3">
            {CREDITS_ENDPOINTS.map((ep) => (
              <div key={ep.path} className="liquid-glass rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center gap-3 sm:w-56 shrink-0">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${ep.method === "POST" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>{ep.method}</span>
                    <code className="text-sm font-mono text-text-primary">{ep.path}</code>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary mb-3">{ep.description}</p>
                    {ep.body && (
                      <div className="mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Body</span>
                        <div className="bg-[#0d1117] border border-white/[0.06] rounded-lg p-3 mt-1 overflow-x-auto">
                          <code className="text-xs font-mono text-[#7fffd4]">{ep.body}</code>
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Response</span>
                      <div className="bg-[#0d1117] border border-white/[0.06] rounded-lg p-3 mt-1 overflow-x-auto">
                        <code className="text-xs font-mono text-[#78a6ff]">{ep.response}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MCP Servers */}
        <section className="mb-16" aria-labelledby="mcp-heading">
          <div className="mb-8">
            <h2 id="mcp-heading" className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2">MCP Servers</h2>
            <h3 className="text-fluid-2xl font-display font-bold">Model Context Protocol</h3>
            <p className="text-text-secondary text-sm mt-2 max-w-2xl">
              Connect Arcanea tools to Claude, Cursor, Windsurf, or any MCP-compatible agent. Each server runs as a standalone process.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {MCP_SERVERS.map((server) => (
              <div key={server.name} className="liquid-glass rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: server.color }} />
                  <h4 className="font-mono text-sm font-semibold" style={{ color: server.color }}>{server.name}</h4>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">{server.description}</p>
                <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-3 overflow-x-auto">
                  <code className="font-mono text-xs" style={{ color: server.color }}>{server.install}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Source */}
        <section className="mb-16" aria-labelledby="oss-heading">
          <div className="mb-8">
            <h2 id="oss-heading" className="text-xs font-mono tracking-[0.35em] uppercase text-earth mb-2">Open Source</h2>
            <h3 className="text-fluid-2xl font-display font-bold">Build with us</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {OPEN_SOURCE_REPOS.map((repo) => (
              <a key={repo.name} href={repo.href} target="_blank" rel="noopener noreferrer" className="group liquid-glass rounded-2xl p-6 hover-lift transition-all hover:border-white/[0.12]">
                <div className="flex items-center gap-3 mb-3">
                  <Icons.Github style={{ color: repo.color }} />
                  <span className="font-mono text-sm font-semibold" style={{ color: repo.color }}>{repo.name}</span>
                  <Icons.ExternalLink className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-text-muted" />
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{repo.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-16">
          <div className="liquid-glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 text-center">Architecture Overview</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {ARCHITECTURE_LAYERS.map((layer) => {
                const LayerIcon = Icons[layer.iconKey];
                return (
                  <div key={layer.layer} className="text-center p-4 rounded-xl hover:bg-white/[0.04] transition-colors">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${layer.color}18` }}>
                      {LayerIcon && <LayerIcon style={{ color: layer.color }} />}
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm mb-2">{layer.layer}</h3>
                    <ul className="space-y-1">
                      {layer.items.map((item) => (
                        <li key={item} className="text-xs text-text-muted">{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-primary/6 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-fluid-2xl font-display font-bold mb-4">Start Building Today</h2>
              <p className="text-text-secondary font-body leading-relaxed mb-8">
                Join our developer community. Create skills, contribute to packages, and help shape the future of creative AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://github.com/frankxai/arcanea" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200">
                  <Icons.Github />
                  Explore the Repo
                </a>
                <Link href="/ecosystem" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200">
                  <Icons.Zap />
                  Full Ecosystem
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <Link href="/install" className="text-sm text-white/40 hover:text-white/70 transition-colors">Install Tools</Link>
                <span className="text-white/20">·</span>
                <Link href="/contribute" className="text-sm text-white/40 hover:text-white/70 transition-colors">Contribute</Link>
                <span className="text-white/20">·</span>
                <Link href="/docs" className="text-sm text-white/40 hover:text-white/70 transition-colors">API Docs</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

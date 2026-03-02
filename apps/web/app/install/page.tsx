'use client';

import Link from "next/link";
import {
  PhPackage,
  PhLightning,
  PhCodeBlock,
  PhTerminal,
} from '@/lib/phosphor-icons';

const INSTALL_METHODS = [
  {
    name: "npm",
    command: "npm install -g arcanea-ai",
    description: "Install globally via npm",
    icon: <PhPackage className="w-10 h-10 text-orange-400" weight="thin" />,
    gradient: "from-orange-500 to-red-500",
  },
  {
    name: "pnpm",
    command: "pnpm add -g arcanea-ai",
    description: "Install via pnpm",
    icon: <PhLightning className="w-10 h-10 text-yellow-400" weight="thin" />,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    name: "Bun",
    command: "bun add -g arcanea-ai",
    description: "Install via Bun",
    icon: <PhCodeBlock className="w-10 h-10 text-emerald-400" weight="thin" />,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Docker",
    command: "docker run -it arcanea/ai",
    description: "Run in Docker container",
    icon: <PhTerminal className="w-10 h-10 text-cyan-400" weight="thin" />,
    gradient: "from-blue-500 to-cyan-500",
  },
];

const QUICK_START = [
  {
    step: "1",
    title: "Install Arcanea",
    description: "Choose your preferred package manager",
    code: "npm install -g arcanea-ai",
  },
  {
    step: "2",
    title: "Authenticate",
    description: "Sign in with your Arcanea account",
    code: "arcanea login",
  },
  {
    step: "3",
    title: "Choose Your Intelligence",
    description: "Start a session with any of the 16 AI specialists",
    code: "arcanea chat --luminor architect",
  },
  {
    step: "4",
    title: "Create Something Amazing",
    description: "Work with AI that truly understands your craft",
    code: "Help me build a cathedral-level system",
  },
];

const INTEGRATIONS = [
  {
    name: "VS Code",
    description: "AI coding assistant in your editor",
    icon: "💜",
    status: "Available",
    link: "#",
  },
  {
    name: "Claude Code",
    description: "Arcanea skills for Claude Code",
    icon: "🧠",
    status: "Available",
    link: "#",
  },
  {
    name: "Cursor",
    description: "AI-first code editor with Arcanea",
    icon: "⌨️",
    status: "Coming Soon",
    link: "#",
  },
  {
    name: "GitHub Copilot",
    description: "AI-powered Copilot extension",
    icon: "🐙",
    status: "Coming Soon",
    link: "#",
  },
];

const FEATURES = [
  {
    title: "16 AI Specialists",
    description: "Access AI masters trained in specific creative domains",
    icon: "🌟",
  },
  {
    title: "Seven Wisdoms",
    description: "Apply proven mental models to any creative challenge",
    icon: "📚",
  },
  {
    title: "Library Access",
    description: "Browse 17 wisdom collections with 34+ texts",
    icon: "📖",
  },
  {
    title: "Academy Progression",
    description: "Track your growth from Apprentice to Luminor",
    icon: "🎓",
  },
];

export default function InstallPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,136,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-mono tracking-wider">
              GET STARTED
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Install Arcanea
            <span className="block bg-gradient-to-r from-green-400 via-atlantean-teal to-violet-400 bg-clip-text text-transparent">
              on your machine
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Run Arcanea's AI specialists locally.
            Choose your preferred package manager and start creating.
          </p>
        </section>

        {/* Install Methods */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INSTALL_METHODS.map((method) => (
              <div
                key={method.name}
                className="group p-6 rounded-2xl liquid-glass hover:border-white/[0.12] transition-all"
              >
                <div className="mb-4">{method.icon}</div>
                <h3 className="text-lg font-display font-semibold mb-2">
                  {method.name}
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  {method.description}
                </p>
                <div className="relative">
                  <code className="block px-4 py-2 rounded-lg bg-cosmic-void border border-white/[0.06] text-sm font-mono text-atlantean-teal overflow-x-auto">
                    {method.command}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Quick Start
            </h2>
            <p className="text-text-secondary">
              Four steps to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_START.map((step) => (
              <div key={step.step} className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm z-10">
                  {step.step}
                </div>
                <div className="p-6 rounded-2xl liquid-glass pt-10">
                  <h3 className="text-lg font-display font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    {step.description}
                  </p>
                  <code className="block px-3 py-2 rounded-lg bg-cosmic-void border border-white/[0.06] text-xs font-mono text-atlantean-teal">
                    {step.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              What You Get
            </h2>
            <p className="text-text-secondary">
              Everything included
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl liquid-glass hover:border-atlantean-teal/30 transition-all"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-display font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Editor Integrations
            </h2>
            <p className="text-text-secondary">
              Use Arcanea in your preferred development environment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {INTEGRATIONS.map((integration) => (
              <div
                key={integration.name}
                className="p-6 rounded-2xl liquid-glass flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <h3 className="font-display font-semibold">
                      {integration.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    integration.status === "Available"
                      ? "bg-atlantean-teal/20 text-atlantean-teal"
                      : "bg-white/[0.06] text-text-muted"
                  }`}
                >
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Terminal Preview */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
              <div className="flex items-center gap-2 px-4 py-3 bg-cosmic-surface border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-sm text-text-muted font-mono">
                  arcanea chat
                </span>
              </div>
              <div className="p-6 bg-cosmic-void font-mono text-sm">
                <div className="text-text-muted mb-2">
                  $ arcanea chat --luminor architect
                </div>
                <div className="text-atlantean-teal mb-4">
                  🤖 Connecting to System Architect...
                </div>
                <div className="text-text-secondary mb-4">
                  <span className="text-violet-400">System Architect:</span> I
                  see systems the way a master builder sees a cathedral. Every
                  component exists for a reason. What would you like to build
                  today?
                </div>
                <div className="text-text-muted">$ </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-white/[0.04]">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-atlantean-teal/20 to-violet-500/20" />
            <div className="absolute inset-0 liquid-glass" />

            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to install?
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                Choose your package manager and start working with
                Arcanea's AI specialists today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-8 py-4 rounded-xl bg-atlantean-teal text-cosmic-deep font-semibold text-lg font-mono">
                  npm install -g arcanea-ai
                </div>
                <Link
                  href="/docs"
                  className="px-8 py-4 rounded-xl border border-white/[0.12] text-white font-semibold text-lg hover:bg-white/[0.04] transition-all"
                >
                  View Documentation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

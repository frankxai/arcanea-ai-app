"use client";

import { useState } from "react";
import Link from "next/link";
import { API_SECTIONS, NAV_SECTIONS, ERROR_CODES, BASE } from "./api-data";
import { CodeBlock, EndpointCard } from "./api-components";

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("authentication");

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7fffd4]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[90rem] mx-auto flex">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/5 py-8 px-6">
          <Link
            href="/docs"
            className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#7fffd4] transition-colors mb-6 block"
          >
            &larr; Back to Docs
          </Link>
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              API Reference
            </span>
          </div>
          <nav className="space-y-1">
            {NAV_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-[#7fffd4]/10 text-[#7fffd4]"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                }`}
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-white/5">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-3">
              Base URL
            </span>
            <code className="text-xs font-mono text-[#7fffd4] break-all">
              {BASE}
            </code>
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-6">
              <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                API Reference
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 tracking-tight">
              Arcanea{" "}
              <span className="bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] bg-clip-text text-transparent">
                API
              </span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
              Build with the Creative Superintelligence. Memory, generation,
              agents, and operations — all through a unified REST API.
            </p>
          </div>

          <section id="authentication" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono bg-emerald-500/15 text-emerald-400"
              >
                01
              </span>
              Authentication
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-6">
              <p className="text-sm text-neutral-300 mb-4">
                All API requests require a Bearer token in the{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-[#7fffd4] font-mono text-xs">
                  Authorization
                </code>{" "}
                header. API keys are prefixed with{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-[#7fffd4] font-mono text-xs">
                  arc_
                </code>
                .
              </p>

              <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
                <CodeBlock
                  code={`# Include in every request\ncurl -H "Authorization: Bearer arc_XXXXX" \\\n  ${BASE}/api/memory`}
                  language="bash"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-display font-semibold text-sm mb-2">
                  Get an API Key
                </h3>
                <ol className="text-sm text-neutral-400 space-y-2 list-decimal list-inside">
                  <li>
                    Sign in at{" "}
                    <Link
                      href="/settings"
                      className="text-[#7fffd4] hover:underline"
                    >
                      arcanea.ai/settings
                    </Link>
                  </li>
                  <li>Navigate to Developer &rarr; API Keys</li>
                  <li>Click &quot;Generate New Key&quot;</li>
                  <li>Copy your key (shown only once)</li>
                </ol>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-display font-semibold text-sm mb-2">
                  Key Types
                </h3>
                <div className="space-y-2 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <code className="font-mono text-xs text-neutral-300">
                      arc_live_*
                    </code>
                    <span className="text-neutral-500">Production</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <code className="font-mono text-xs text-neutral-300">
                      arc_test_*
                    </code>
                    <span className="text-neutral-500">Development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <code className="font-mono text-xs text-neutral-300">
                      arc_agent_*
                    </code>
                    <span className="text-neutral-500">Agent-scoped</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {API_SECTIONS.map((section, sectionIdx) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-16 scroll-mt-24"
            >
              <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono"
                  style={{
                    backgroundColor: `${section.color}15`,
                    color: section.color,
                  }}
                >
                  {String(sectionIdx + 2).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <p className="text-sm text-neutral-400 mb-8 max-w-2xl">
                {section.description}
              </p>
              <div className="space-y-6">
                {section.endpoints.map((endpoint) => (
                  <EndpointCard
                    key={`${endpoint.method}-${endpoint.path}`}
                    endpoint={endpoint}
                    color={section.color}
                  />
                ))}
              </div>
            </section>
          ))}

          <section id="rate-limits" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono bg-amber-500/15 text-amber-400">
                06
              </span>
              Rate Limits
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Tier
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Requests / min
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Burst
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Daily Limit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Free</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      30
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      5
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      1,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Pro</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      120
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      20
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      10,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Team</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      500
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      50
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      100,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-300">Enterprise</td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      Custom
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      Custom
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      Unlimited
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <p className="text-sm text-neutral-400">
                Rate limit headers are included in every response:{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  X-RateLimit-Limit
                </code>
                ,{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  X-RateLimit-Remaining
                </code>
                ,{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  X-RateLimit-Reset
                </code>
                . When exceeded, the API returns{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-red-400 font-mono text-xs">
                  429 Too Many Requests
                </code>{" "}
                with a{" "}
                <code className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-xs">
                  Retry-After
                </code>{" "}
                header.
              </p>
            </div>
          </section>

          <section id="errors" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono bg-red-500/15 text-red-400">
                07
              </span>
              Error Codes
            </h2>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Code
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Meaning
                    </th>
                    <th className="text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      Resolution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ERROR_CODES.map((err) => (
                    <tr key={err.code}>
                      <td className="px-6 py-4">
                        <code
                          className={`font-mono text-xs px-2 py-1 rounded ${
                            err.code.startsWith("4")
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {err.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-neutral-300">
                        {err.meaning}
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {err.resolution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-6 py-3 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  Error Response Shape
                </span>
              </div>
              <pre className="px-6 py-4 overflow-x-auto text-[13px] leading-relaxed">
                <code className="font-mono text-red-400">
                  {`{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded the rate limit of 30 requests/min.",
    "status": 429,
    "retry_after": 12
  }
}`}
                </code>
              </pre>
            </div>
          </section>

          <div className="bg-gradient-to-br from-[#7fffd4]/10 via-white/5 to-[#78a6ff]/10 border border-white/10 rounded-2xl p-8 text-center mb-12">
            <h3 className="text-xl font-display font-bold mb-3">
              Ready to build?
            </h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
              Get your API key and start creating with the Arcanea platform
              in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-black font-semibold hover:scale-[1.03] transition-all"
              >
                Get API Key
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:border-[#7fffd4]/30 transition-all"
              >
                Back to Docs
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

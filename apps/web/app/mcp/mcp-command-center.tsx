"use client";

import { useState, type FormEvent } from "react";

const READER = "https://arcanea-reader.frankxai.workers.dev/mcp";

const TOOLS = [
  {
    name: "arcanea_rubric",
    detail: "Returns the canon-fit or visual-taste rubric. Any other name is refused.",
  },
  {
    name: "arcanea_canon_lint",
    detail: "Flags an eleventh gate, or a Guardian or godbeast on the wrong element. No model call.",
  },
  {
    name: "arcanea_score",
    detail: "A hit blocks ship. A clean draft is clear, and clear is not a score of 85.",
  },
  {
    name: "arcanea_doctor",
    detail: "Says this is the free door, with no key and no generation.",
  },
  {
    name: "arcanea_lore",
    detail: "Refuses. The world text stays in the licensed studio.",
  },
  {
    name: "arcanea_template",
    detail: "Refuses. Prompts and templates stay in the licensed studio.",
  },
];

const CONFIGS = [
  {
    name: "Codex",
    file: "~/.codex/config.toml",
    body: `[mcp_servers.arcanea]\nurl = "${READER}"`,
  },
  {
    name: "Claude Desktop",
    file: "claude_desktop_config.json",
    body: `{\n  "mcpServers": {\n    "arcanea": {\n      "url": "${READER}"\n    }\n  }\n}`,
  },
  {
    name: "Cursor",
    file: "~/.cursor/mcp.json",
    body: `{\n  "mcpServers": {\n    "arcanea": {\n      "url": "${READER}"\n    }\n  }\n}`,
  },
];

export function McpCommandCenter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
  }

  async function join(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "mcp_reader" }),
      });
      const body = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !body.success) {
        setStatus("error");
        setError(body.error ?? "We couldn't save your place just now.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("We couldn't save your place just now. Please try again in a minute.");
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-2 text-sm text-[var(--arc-brand-atlantean-teal)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--arc-brand-atlantean-teal)]" aria-hidden="true" />
            Live. No install. No API key.
          </p>
          <h2 className="mb-4 font-display text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            Arcanea reader
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/55">
            Point Claude, Codex, or Cursor at one HTTPS address. The first call can fail a draft that invents an eleventh gate.
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <p className="mb-2 text-sm text-white/45">Reader address</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="flex-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-[var(--arc-brand-atlantean-teal)]">
              {READER}
            </code>
            <button
              type="button"
              onClick={() => copy("url", READER)}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm text-white/80 hover:bg-white/[0.04]"
            >
              {copied === "url" ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/40">
            Health check: <a className="underline decoration-white/20 underline-offset-4" href="https://arcanea-reader.frankxai.workers.dev/health">/health</a>. It reports keys false and generation false.
          </p>
        </div>

        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {CONFIGS.map((item) => (
            <article key={item.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-white/90">{item.name}</h3>
                <button
                  type="button"
                  onClick={() => copy(item.name, item.body)}
                  className="text-xs text-white/50 hover:text-white/80"
                >
                  {copied === item.name ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mb-3 text-xs text-white/35">{item.file}</p>
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-white/70">{item.body}</pre>
            </article>
          ))}
        </div>

        <div className="mb-12">
          <h3 className="mb-4 font-display text-2xl font-semibold text-white/90">What the free door does</h3>
          <ul className="grid gap-3">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4">
                <code className="text-sm text-[var(--arc-brand-atlantean-teal)]">{tool.name}</code>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{tool.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12 rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/5 p-6">
          <h3 className="mb-2 font-display text-xl font-semibold text-white/90">What it will not do</h3>
          <p className="max-w-3xl text-sm leading-relaxed text-white/55">
            It does not return the world text, the prompts, or the templates. It does not generate an image. It does not spend a provider key. A clear score is not permission to publish. The studio, with the pack and a human confirm, is the later door. There is no checkout on this page, and there is no npm install command, because the public package is not ready.
          </p>
        </div>

        <form onSubmit={join} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h3 className="mb-2 font-display text-xl font-semibold text-white/90">Studio waitlist</h3>
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-white/50">
            Leave an email if you want the licensed studio when it can be installed. We will ask price, who you are, and what you are trying to make before anything is charged.
          </p>
          {status === "done" ? (
            <p className="text-sm text-[var(--arc-brand-atlantean-teal)]">You are on the studio list.</p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="mcp-waitlist-email">Email</label>
              <input
                id="mcp-waitlist-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@studio.com"
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={status === "saving"}
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-60"
              >
                {status === "saving" ? "Saving" : "Join the list"}
              </button>
            </div>
          )}
          {status === "error" ? <p className="mt-3 text-sm text-[var(--arc-brand-arcanean-gold)]">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}

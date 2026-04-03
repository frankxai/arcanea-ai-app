import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MCP Installation Guide — Arcanea Docs",
  description:
    "Install the Arcanea MCP server in Claude Code, Cursor, Windsurf, Cline, or run it in HTTP mode. Step-by-step instructions for all supported clients.",
  alternates: { canonical: "/docs/mcp/install" },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PACKAGE = "@arcanea/mcp-server";

interface Step {
  label: string;
  code: string;
  note?: string;
}

interface Client {
  id: string;
  name: string;
  badge?: string;
  steps: Step[];
}

const CLIENTS: Client[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    steps: [
      {
        label: "Add the server",
        code: `claude mcp add arcanea npx ${PACKAGE}`,
      },
      {
        label: "Verify the connection",
        code: `claude mcp list`,
        note: "You should see arcanea listed with status: connected.",
      },
      {
        label: "Start using tools",
        code: `# Inside any Claude Code session:\n/mcp arcanea generate_character --element void`,
      },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    steps: [
      {
        label: "Open or create .cursor/mcp.json in your project root",
        code: `{
  "mcpServers": {
    "arcanea": {
      "command": "npx",
      "args": ["${PACKAGE}"]
    }
  }
}`,
      },
      {
        label: "Restart Cursor",
        code: `# Cmd+Shift+P -> Reload Window`,
        note: "The Arcanea tools will appear in the MCP panel after restart.",
      },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    steps: [
      {
        label: "Open ~/.codeium/windsurf/mcp_config.json",
        code: `{
  "mcpServers": {
    "arcanea": {
      "command": "npx",
      "args": ["${PACKAGE}"]
    }
  }
}`,
        note: "The file lives at ~/.codeium/windsurf/mcp_config.json. Create it if it does not exist.",
      },
      {
        label: "Reload Windsurf",
        code: `# Cmd+Shift+P -> Reload Window`,
      },
    ],
  },
  {
    id: "cline",
    name: "Cline",
    steps: [
      {
        label: "Open the Cline MCP settings panel",
        code: `# In VS Code with Cline installed:\n# Click the MCP icon in the Cline sidebar\n# Select "Edit MCP Settings"`,
      },
      {
        label: "Add the Arcanea server",
        code: `{
  "mcpServers": {
    "arcanea": {
      "command": "npx",
      "args": ["${PACKAGE}"],
      "disabled": false,
      "autoApprove": []
    }
  }
}`,
      },
      {
        label: "Save and reconnect",
        code: `# Save the settings file\n# Cline will reconnect automatically`,
        note: "Use autoApprove to pre-approve specific tools and skip confirmation prompts.",
      },
    ],
  },
  {
    id: "http",
    name: "HTTP Mode",
    badge: "Advanced",
    steps: [
      {
        label: "Start the server in HTTP mode",
        code: `npx ${PACKAGE} --transport http --port 3100`,
        note: "The server will be available at http://localhost:3100/mcp",
      },
      {
        label: "Or run persistently with pm2",
        code: `npx pm2 start "npx ${PACKAGE} --transport http --port 3100" --name arcanea-mcp`,
      },
      {
        label: "Connect from any HTTP MCP client",
        code: `{
  "mcpServers": {
    "arcanea": {
      "url": "http://localhost:3100/mcp"
    }
  }
}`,
        note: "HTTP mode is useful for shared team environments or CI pipelines.",
      },
    ],
  },
];

const ENV_VARS = [
  {
    name: "ARCANEA_API_KEY",
    required: false,
    description: "API key for authenticated requests. Get yours at arcanea.ai/developers.",
  },
  {
    name: "ARCANEA_WORLD_ID",
    required: false,
    description: "Default world context. Tools that accept worldId will use this if not specified.",
  },
  {
    name: "ARCANEA_BASE_URL",
    required: false,
    description: "Override the API base URL. Defaults to https://arcanea.ai/api.",
  },
];

const TROUBLESHOOTING = [
  {
    problem: "Server not appearing in client",
    fix: "Restart the client after editing mcp.json. The file must be valid JSON with no trailing commas.",
  },
  {
    problem: "npx command not found",
    fix: "Ensure Node.js 18+ and npm are installed. Run: node --version && npm --version",
  },
  {
    problem: "Tools call returns 401 Unauthorized",
    fix: "Set the ARCANEA_API_KEY environment variable. Get your key at arcanea.ai/developers.",
  },
  {
    problem: "HTTP mode: connection refused",
    fix: "Check that the server started without errors and the port matches your client config. Default port is 3100.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function McpInstallPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.07),transparent_60%)]" />
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* ---- Breadcrumb ---- */}
        <nav className="pt-8 pb-2">
          <ol className="flex items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/docs" className="hover:text-zinc-300 transition-colors">
                Docs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/docs/mcp" className="hover:text-zinc-300 transition-colors">
                MCP
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[#7fffd4]">Install</li>
          </ol>
        </nav>

        {/* ---- Header ---- */}
        <section className="pb-10 pt-10">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Installation{" "}
            <span className="bg-gradient-to-r from-[#00bcd4] to-[#7fffd4] bg-clip-text text-transparent">
              Guide
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">
            The Arcanea MCP server works with any client that supports the Model
            Context Protocol. Pick your tool below.
          </p>

          {/* Requirements */}
          <div className="mt-6 flex flex-wrap gap-3">
            {["Node.js 18+", "npm / npx", "MCP-compatible client"].map((req) => (
              <span
                key={req}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-xs text-zinc-400"
              >
                {req}
              </span>
            ))}
          </div>
        </section>

        {/* ---- Client sections ---- */}
        <div className="space-y-12 pb-12">
          {CLIENTS.map((client) => (
            <section key={client.id} id={client.id}>
              <div className="mb-5 flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <h2 className="font-display text-2xl font-semibold text-white">
                  {client.name}
                </h2>
                {client.badge && (
                  <span className="rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-2.5 py-0.5 font-mono text-xs text-[#00bcd4]">
                    {client.badge}
                  </span>
                )}
              </div>

              <ol className="space-y-5">
                {client.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    {/* Step number */}
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#00bcd4]/40 bg-[#00bcd4]/10">
                      <span className="font-mono text-xs text-[#00bcd4]">{i + 1}</span>
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <p className="mb-2 text-sm font-medium text-zinc-200">
                        {step.label}
                      </p>
                      <pre className="overflow-x-auto rounded-lg border border-white/[0.06] bg-black/50 px-4 py-3 font-mono text-sm text-zinc-300">
                        <code>{step.code}</code>
                      </pre>
                      {step.note && (
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                          {step.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        {/* ---- Docker coming soon ---- */}
        <section className="pb-12">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-display text-lg font-semibold text-white">Docker</h2>
              <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
                Coming soon
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              A Docker image for the Arcanea MCP server is in progress. It will support
              environment-based configuration, health checks, and multi-world isolation.
              Subscribe to{" "}
              <Link
                href="/changelog"
                className="text-[#7fffd4] hover:text-white transition-colors"
              >
                the changelog
              </Link>{" "}
              for release updates.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-white/[0.04] bg-black/40 px-4 py-3 font-mono text-sm text-zinc-600">
              <code>{`# Not yet available\ndocker pull ghcr.io/arcanea-ai/mcp-server:latest`}</code>
            </pre>
          </div>
        </section>

        {/* ---- Environment variables ---- */}
        <section className="pb-12">
          <h2 className="font-display text-xl font-semibold text-white mb-5">
            Environment variables
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="py-3 px-5 text-left font-mono text-xs text-zinc-500 uppercase tracking-wider">
                    Variable
                  </th>
                  <th className="py-3 px-5 text-left font-mono text-xs text-zinc-500 uppercase tracking-wider">
                    Required
                  </th>
                  <th className="py-3 px-5 text-left font-mono text-xs text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {ENV_VARS.map((v) => (
                  <tr key={v.name} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 px-5">
                      <code className="font-mono text-xs text-zinc-300">{v.name}</code>
                    </td>
                    <td className="py-3.5 px-5">
                      {v.required ? (
                        <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-rose-400 bg-rose-400/10 border border-rose-400/20">
                          required
                        </span>
                      ) : (
                        <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 bg-white/[0.04] border border-white/[0.06]">
                          optional
                        </span>
                      )}
                    </td>
                    <td className="hidden py-3.5 px-5 text-xs text-zinc-500 sm:table-cell">
                      {v.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-zinc-500">
              Example — passing env vars to npx
            </p>
            <pre className="overflow-x-auto font-mono text-sm text-zinc-300">
              <code>{`ARCANEA_API_KEY=your_key ARCANEA_WORLD_ID=arcanea npx ${PACKAGE}`}</code>
            </pre>
          </div>
        </section>

        {/* ---- Troubleshooting ---- */}
        <section className="pb-20">
          <h2 className="font-display text-xl font-semibold text-white mb-5">
            Troubleshooting
          </h2>
          <div className="space-y-4">
            {TROUBLESHOOTING.map((item) => (
              <div
                key={item.problem}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <p className="font-medium text-zinc-200 mb-1.5">{item.problem}</p>
                <p className="text-sm text-zinc-500">{item.fix}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[#00bcd4]/20 bg-[#00bcd4]/5 p-5">
            <p className="text-sm text-zinc-300">
              Still stuck?{" "}
              <a
                href="https://github.com/arcanea-ai/arcanea/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7fffd4] hover:text-white transition-colors"
              >
                Open an issue on GitHub
              </a>{" "}
              or visit{" "}
              <Link
                href="/community"
                className="text-[#7fffd4] hover:text-white transition-colors"
              >
                the community
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

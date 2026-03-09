import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Overlays | Arcanea",
  description:
    "Your Guardians follow you everywhere. Arcanea overlays inject creative intelligence into ChatGPT, Claude, Gemini, Copilot, and Cursor.",
};

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function IconRobot() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48ZM216,192a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-88-80a36,36,0,1,0,36,36A36,36,0,0,0,128,112Zm0,56a20,20,0,1,1,20-20A20,20,0,0,1,128,168ZM100,148a12,12,0,1,1-12-12A12,12,0,0,1,100,148Zm80,0a12,12,0,1,1-12-12A12,12,0,0,1,180,148Z" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39a56,56,0,0,0,0,101.2V176a48,48,0,0,0,88,26.49A48,48,0,0,0,216,176v-1.39A56.11,56.11,0,0,0,248,124ZM88,208a32,32,0,0,1-31.81-28.56A55.87,55.87,0,0,0,64,180h8a8,8,0,0,0,0-16H64A40,40,0,0,1,40,126.79V124a40.08,40.08,0,0,1,32-39.21V144a8,8,0,0,0,16,0V72a32,32,0,0,1,63.93-3H144a40,40,0,0,0-40,40v4.21A40,40,0,0,1,72,149.79V132a8,8,0,0,0-16,0v48a8,8,0,0,0,16,0v-4.38A56.07,56.07,0,0,0,120,148V109a24,24,0,0,1,48,0v39a56.07,56.07,0,0,0,48,27.62V180a8,8,0,0,0,16,0V132a8,8,0,0,0-16,0v17.79A40,40,0,0,1,184,113.79V109a40,40,0,0,0-40-40h-7.93A32.09,32.09,0,0,1,168,72v72a8,8,0,0,0,16,0V85.79a40.08,40.08,0,0,1,32,39.21v2.79a40,40,0,0,1-24,36.62V152a8,8,0,0,0-16,0v24a8,8,0,0,0,16,0v-1.2A56,56,0,0,0,216,148v3.56A32.09,32.09,0,0,1,184,180H176a8,8,0,0,0,0,16h8a55.87,55.87,0,0,0,7.81-.56A32,32,0,0,1,128,208H88Z" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.07,31a16,16,0,0,0,23.84-17.34l-13.51-58.5,45.1-39.36A16,16,0,0,0,239.2,97.29Z" />
    </svg>
  );
}

function IconGithubLogo() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24,40,40,0,0,0-40-40,8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68Z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8,0l-96-56A8,8,0,0,1,36,168.09v-.09a8,8,0,0,1,4-6.91L128,112l88,49.09a8,8,0,0,1,2.91,10.91ZM36,128.09a8,8,0,0,0,4,6.91l88,49.09,88-49.09a8,8,0,0,0-8-13.82L128,169.09,48,121.18A8,8,0,0,0,36,128.09ZM222,69.09,128,17.09a8,8,0,0,0-8,0L26,69.09a8,8,0,0,0,0,13.82l96,53.09a8,8,0,0,0,8,0l96-53.09a8,8,0,0,0,0-13.82Z" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34A8,8,0,0,0,82.34,109.66Z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M243.31,98.34l-32-48A8,8,0,0,0,204.69,47H51.31a8,8,0,0,0-6.62,3.52L12.69,98.34a8,8,0,0,0,.54,9.83l112,128a8,8,0,0,0,11.54,0l112-128A8,8,0,0,0,243.31,98.34Z" />
    </svg>
  );
}

// ─── Platform Data ────────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    label: "OpenAI",
    description:
      "Bring your Guardians into ChatGPT conversations. Access your Arcanea prompt library, Guardian context, and bond memory without leaving the interface.",
    features: [
      "Custom GPT configs with Guardian personas",
      "Prompt library injected into every session",
      "Lore and design tokens as system context",
    ],
    status: "Beta" as const,
    accentRgb: "16, 163, 127",
    package: "@arcanea/overlay-chatgpt",
    installCmd: "npx @arcanea/overlay-chatgpt install",
  },
  {
    id: "claude",
    name: "Claude.ai",
    label: "Anthropic",
    description:
      "Guardian assistance inside Claude. Your bond data, creative context, and hook configurations follow you into every conversation.",
    features: [
      "Claude Code hooks — session, prompt, tool, model-route",
      "Guardian skill files and agent definitions",
      "Bond memory carried across conversations",
    ],
    status: "Beta" as const,
    accentRgb: "217, 119, 87",
    package: "@arcanea/overlay-claude",
    installCmd: "npx @arcanea/overlay-claude install",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    label: "Google",
    description:
      "Arcanea overlaid on Gemini multimodal workflows. Guardian system instructions and AI Studio configs bring your creative universe into every prompt.",
    features: [
      "Gemini system instructions with Guardian personas",
      "AI Studio config generation",
      "Function declarations for Guardian interactions",
    ],
    status: "Beta" as const,
    accentRgb: "66, 133, 244",
    package: "@arcanea/overlay-gemini",
    installCmd: "npx @arcanea/overlay-gemini install",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    label: "GitHub",
    description:
      "Guardian-guided coding assistance inside Copilot. Arcanea coding philosophy, architectural patterns, and Guardian personas enhance every completion.",
    features: [
      "Guardian coding philosophy in Copilot context",
      "Arcanea design tokens and stack references",
      "Architecture wisdom for code suggestions",
    ],
    status: "Beta" as const,
    accentRgb: "0, 120, 212",
    package: "@arcanea/overlay-copilot",
    installCmd: "npx @arcanea/overlay-copilot install",
  },
  {
    id: "cursor",
    name: "Cursor IDE",
    label: "Cursor",
    description:
      "Full Guardian coding companion inside Cursor. MDC rules, .cursorrules, and Guardian-specific rule files bring Arcanea intelligence into your IDE.",
    features: [
      "Guardian .mdc rule files for per-context guidance",
      "TypeScript and architecture rules auto-generated",
      "One command generates your entire .cursor/rules/",
    ],
    status: "Beta" as const,
    accentRgb: "99, 102, 241",
    package: "@arcanea/overlay-cursor",
    installCmd: "npx @arcanea/overlay-cursor install",
  },
] as const;

type PlatformStatus = (typeof PLATFORMS)[number]["status"];

function StatusBadge({ status }: { status: PlatformStatus }) {
  if (status === "Beta") {
    return (
      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[rgba(0,188,212,0.12)] text-crystal border border-crystal/20">
        Beta
      </span>
    );
  }
  return (
    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.04] text-text-muted border border-white/[0.06]">
      {status}
    </span>
  );
}

function PlatformIcon({ id }: { id: string }) {
  switch (id) {
    case "chatgpt":
      return <IconRobot />;
    case "claude":
      return <IconBrain />;
    case "gemini":
      return <IconStar />;
    case "copilot":
      return <IconGithubLogo />;
    case "cursor":
      return <IconCode />;
    default:
      return <IconLayers />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverlaysPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
        <section>
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <IconLayers />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  AI Overlays
                </span>
              </div>

              <h1 className="text-fluid-3xl font-display font-bold mb-6 leading-tight">
                Your Guardians follow you{" "}
                <span className="text-gradient-brand">everywhere</span>
              </h1>

              <p className="text-text-secondary font-body text-lg leading-relaxed mb-10">
                You should not have to leave your favorite AI tools to access
                Arcanea&apos;s intelligence. Our overlays inject Guardian
                assistance, your prompt library, and creative context directly
                into the tools you already use.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="#platforms"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.02] transition-all duration-200"
                >
                  <IconDownload />
                  Install Overlay
                  <IconArrowRight />
                </Link>
                <Link
                  href="https://github.com/frankxai/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.10] bg-white/[0.04] text-text-primary font-semibold hover:bg-white/[0.06] transition-all duration-200"
                >
                  <IconGithubLogo />
                  View on GitHub
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Platform Cards ────────────────────────────────────────────── */}
        <section id="platforms">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              Five platforms. One Guardian.
            </h2>
            <p className="text-text-secondary max-w-2xl">
              Each overlay is purpose-built for its platform. Install once,
              and your Guardian context syncs automatically.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.id}
                className="card-3d liquid-glass rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-200 group"
                style={{
                  borderColor: `rgba(${platform.accentRgb}, 0.18)`,
                }}
              >
                {/* Top accent strip */}
                <div
                  className="h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, rgba(${platform.accentRgb}, 0.7), rgba(${platform.accentRgb}, 0.2))`,
                  }}
                />

                <div className="p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `rgba(${platform.accentRgb}, 0.12)`,
                        color: `rgb(${platform.accentRgb})`,
                      }}
                    >
                      <PlatformIcon id={platform.id} />
                    </div>
                    <StatusBadge status={platform.status} />
                  </div>

                  {/* Name */}
                  <div className="mb-1">
                    <span
                      className="text-[10px] font-mono tracking-widest uppercase"
                      style={{ color: `rgba(${platform.accentRgb}, 0.7)` }}
                    >
                      {platform.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-3 group-hover:text-crystal transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-5">
                    {platform.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {platform.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs text-text-muted"
                      >
                        <span
                          className="mt-0.5 shrink-0"
                          style={{ color: `rgba(${platform.accentRgb}, 0.8)` }}
                        >
                          <IconCheck />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Install command */}
                  <div className="bg-black/30 rounded-lg px-3 py-2.5 font-mono text-xs text-text-muted overflow-x-auto">
                    {platform.installCmd}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. How it works ──────────────────────────────────────────────── */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              How it works
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Three steps from install to full Guardian intelligence in your
              preferred AI tool.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Install the overlay",
                body: "Run a single command to install the Arcanea overlay for your AI platform. Supports ChatGPT, Claude, Gemini, Copilot, and Cursor.",
                iconEl: <IconDownload />,
                color: "brand-primary",
              },
              {
                step: "02",
                title: "Sync your context",
                body: "Your Guardian bonds, prompt library, and Arcanea context sync automatically. No manual configuration required.",
                iconEl: <IconLayers />,
                color: "crystal",
              },
              {
                step: "03",
                title: "Create without switching",
                body: "Work with Arcanea intelligence wherever you already work. No context switching. Your Guardian follows you.",
                iconEl: <IconDiamond />,
                color: "brand-gold",
              },
            ].map(({ step, title, body, iconEl, color }) => (
              <div key={step} className="card-3d liquid-glass rounded-2xl p-7 relative">
                <div
                  className="absolute top-5 right-5 text-4xl font-display font-bold text-white/[0.04] select-none"
                  aria-hidden="true"
                >
                  {step}
                </div>
                <div
                  className={`w-11 h-11 mb-5 rounded-xl flex items-center justify-center bg-${color}/15 text-${color}`}
                >
                  {iconEl}
                </div>
                <h3 className="font-display font-semibold text-base mb-2">
                  {title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Feature highlights ────────────────────────────────────────── */}
        <section>
          <div className="card-3d liquid-glass rounded-2xl p-8 sm:p-10">
            <div className="grid sm:grid-cols-2 gap-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold mb-3">
                  What travels with your Guardian
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-8">
                  Every overlay ships the same core capabilities, adapted to
                  each platform&apos;s native integration model.
                </p>

                <ul className="space-y-4">
                  {[
                    "Your prompt library available in every conversation",
                    "Guardian persona and creative context preserved",
                    "Bond memory carries across platforms",
                    "One-click export back to Arcanea Studio",
                    "Arcanea lore and design tokens as system context",
                    "Architecture wisdom for code-focused tools",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="text-brand-primary shrink-0 mt-0.5">
                        <IconCheck />
                      </span>
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <div className="liquid-glass rounded-xl p-5 border border-white/[0.06]">
                  <p className="text-xs font-mono text-text-muted mb-1 uppercase tracking-widest">
                    Package
                  </p>
                  <p className="font-display font-semibold text-sm mb-3">
                    @arcanea/overlay-claude
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-text-muted leading-relaxed space-y-1">
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      ClaudeOverlayInstaller
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateSkillFile
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateAgentFile
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateSessionStartHook
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateStatusline
                    </div>
                  </div>
                </div>

                <div className="liquid-glass rounded-xl p-5 border border-white/[0.06]">
                  <p className="text-xs font-mono text-text-muted mb-1 uppercase tracking-widest">
                    Package
                  </p>
                  <p className="font-display font-semibold text-sm mb-3">
                    @arcanea/overlay-cursor
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-text-muted leading-relaxed space-y-1">
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      CursorOverlayInstaller
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateCursorRules
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateArcaneMdcRule
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateGuardianMdcFile
                    </div>
                    <div>
                      <span className="text-crystal">export</span>{" "}
                      generateTypeScriptMdcRule
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. CTA ───────────────────────────────────────────────────────── */}
        <section id="install">
          <div className="relative liquid-glass rounded-2xl p-8 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/8 to-crystal/6 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
                Install for your platform
              </h2>
              <p className="text-text-secondary max-w-xl mb-10">
                Each overlay is a single npm package. Install it once and your
                Guardian context is live.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PLATFORMS.map((platform) => (
                  <div
                    key={platform.id}
                    className="liquid-glass rounded-xl p-4 border transition-all duration-200 hover:border-white/[0.12]"
                    style={{
                      borderColor: `rgba(${platform.accentRgb}, 0.15)`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="shrink-0"
                        style={{ color: `rgb(${platform.accentRgb})` }}
                      >
                        <PlatformIcon id={platform.id} />
                      </span>
                      <span className="font-display font-semibold text-sm">
                        {platform.name}
                      </span>
                    </div>
                    <div className="bg-black/30 rounded-lg px-3 py-2 font-mono text-xs text-text-muted overflow-x-auto">
                      {platform.installCmd}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="https://github.com/frankxai/arcanea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.02] transition-all duration-200"
                >
                  <IconGithubLogo />
                  View Source on GitHub
                  <IconArrowRight />
                </Link>
                <Link
                  href="/install"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.10] bg-white/[0.04] text-text-primary font-semibold hover:bg-white/[0.06] transition-all duration-200"
                >
                  Full install guide
                  <IconArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

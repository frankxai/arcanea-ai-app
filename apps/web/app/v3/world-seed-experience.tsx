import Link from "next/link";
import {
  ArrowRight,
  Code,
  Globe,
  ShieldStar,
  Sparkle,
} from "@/lib/phosphor-icons";
import styles from "./world-seed.module.css";

const WORLD_LAYERS = [
  { index: "01", name: "Canon", detail: "what remains true", position: styles.nodeCanon },
  { index: "02", name: "Characters", detail: "who remains themselves", position: styles.nodeCharacters },
  { index: "03", name: "Creations", detail: "story · image · music", position: styles.nodeCreations },
  { index: "04", name: "Relationships", detail: "what connects the world", position: styles.nodeRelationships },
  { index: "05", name: "Provenance", detail: "where each truth began", position: styles.nodeProvenance },
] as const;

const LIVE_PROOF = [
  {
    status: "Source",
    title: "Versioned world state",
    body: "Canon, lore, agents, and World Engine logic live in inspectable source rather than disappearing inside a chat history.",
    href: "https://github.com/frankxai/arcanea",
    label: "Open the public source",
    Icon: Code,
  },
  {
    status: "Runtime",
    title: "54 MCP tools",
    body: "Arcanea exposes world and studio context to Claude, Codex, Cursor, and other MCP clients through one working tool surface.",
    href: "/mcp",
    label: "Inspect the MCP runtime",
    Icon: Sparkle,
  },
  {
    status: "Product",
    title: "Live on Vercel",
    body: "The product, world surfaces, library, and creation paths run today while preview and roadmap lanes remain explicitly labelled.",
    href: "/worlds",
    label: "Explore living worlds",
    Icon: Globe,
  },
  {
    status: "Authority",
    title: "Creator decides canon",
    body: "Arcanea is BYOK-first. Models can propose and extend; the creator retains the final decision about what becomes true.",
    href: "/living-lore",
    label: "Read the living canon",
    Icon: ShieldStar,
  },
] as const;

const CANON_MERGE_STEPS = [
  { number: "01", title: "Branch", body: "Create a possible reality in Git." },
  { number: "02", title: "Preview", body: "Render the branch as a live world." },
  { number: "03", title: "Detect", body: "Expose canon conflicts and lineage." },
  { number: "04", title: "Merge", body: "Let the creator decide what is true." },
] as const;

function WorldSeedDiagram() {
  return (
    <figure className={styles.figure} aria-labelledby="world-seed-caption">
      <div className={styles.diagram} aria-hidden="true">
        <div className={`${styles.orbit} ${styles.orbitOuter}`} />
        <div className={`${styles.orbit} ${styles.orbitMiddle}`} />
        <div className={`${styles.orbit} ${styles.orbitInner}`} />
        <div className={styles.continuityThread} />

        <div className={styles.seedHalo}>
          <div className={styles.seedCore}>
            <span>Creator-owned</span>
            <strong>World<br />Seed</strong>
            <small>final canon authority</small>
          </div>
        </div>

        {WORLD_LAYERS.map((layer, index) => (
          <div
            className={`${styles.layerNode} ${layer.position}`}
            key={layer.name}
            style={{ "--layer-delay": `${index * 180}ms` } as React.CSSProperties}
          >
            <span>{layer.index}</span>
            <strong>{layer.name}</strong>
            <small>{layer.detail}</small>
          </div>
        ))}
      </div>

      <figcaption id="world-seed-caption" className="sr-only">
        A creator-owned World Seed carries canon, characters, creations,
        relationships, and provenance across changing AI models and media.
      </figcaption>
      <ul className="sr-only">
        {WORLD_LAYERS.map((layer) => (
          <li key={layer.name}>{layer.name}: {layer.detail}</li>
        ))}
      </ul>
    </figure>
  );
}

export function WorldSeedExperience() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="world-seed-title">
        <div className={styles.heroGrid}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Arcanea World Engine</p>
            <h1 id="world-seed-title">
              Build a world
              <span>that remembers itself.</span>
            </h1>
            <p className={styles.lede}>
              AI can generate a character in seconds. Ask five tools to continue
              that character for a year and identity begins to drift. Arcanea
              keeps canon, characters, relationships, rules, and creative lineage
              coherent as models, sessions, and media change.
            </p>

            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/worlds/create">
                Create a world <ArrowRight size={16} weight="bold" />
              </Link>
              <Link className={styles.secondaryAction} href="/mcp">
                Inspect the engine
              </Link>
            </div>

            <dl className={styles.metrics} aria-label="Arcanea product facts">
              <div><dt>54</dt><dd>MCP tools</dd></div>
              <div><dt>13</dt><dd>Luminors</dd></div>
              <div><dt>BYOK</dt><dd>by design</dd></div>
            </dl>
          </div>

          <WorldSeedDiagram />
        </div>

        <div className={styles.truthRail}>
          <p><strong>Live now</strong> BYOK workspace · versioned lore and canon · MIT World Engine package · MCP runtime · Vercel production</p>
          <p><strong>Building next</strong> canon branches · preview worlds · creator-only merge</p>
        </div>
      </section>

      <section className={styles.proofSection} aria-labelledby="proof-title">
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>What exists today</p>
            <h2 id="proof-title">One world. Four inspectable surfaces.</h2>
          </div>
          <p>
            Arcanea is not claiming external customer traction yet. It is a live,
            founder-used proving environment with public source, a working MCP
            surface, and a production product ready for design-partner validation.
          </p>
        </header>

        <div className={styles.proofGrid}>
          {LIVE_PROOF.map(({ status, title, body, href, label, Icon }) => (
            <article className={styles.proofCard} key={title}>
              <div className={styles.proofCardTop}>
                <Icon size={19} weight="duotone" aria-hidden="true" />
                <span>{status}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <Link href={href} target={href.startsWith("http") ? "_blank" : undefined}>
                {label} <ArrowRight size={14} weight="bold" />
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.mergePanel}>
          <div className={styles.mergeCopy}>
            <div className={styles.buildBadge}>Next product slice</div>
            <p className={styles.mergeKicker}>The Canon Merge</p>
            <h2>Branch reality. Preview possible worlds. Merge canon.</h2>
            <p>
              GitHub becomes the source of possible realities. Vercel makes each
              branch tangible. Arcanea exposes conflicts and provenance before the
              creator decides which reality becomes canonical.
            </p>
          </div>

          <ol className={styles.mergeSteps}>
            {CANON_MERGE_STEPS.map((step) => (
              <li key={step.title}>
                <span>{step.number}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.partnerCallout}>
          <div>
            <p className={styles.eyebrow}>Design-partner cohort</p>
            <h2>Bring us one world that cannot afford to forget itself.</h2>
            <p>
              We are opening three pilots for narrative studios, game-world teams,
              and transmedia creators. The test is concrete: continuity, recall,
              provenance, conflict detection, and portability between models.
            </p>
          </div>
          <a
            className={styles.primaryAction}
            href="mailto:frank@arcanea.ai?subject=Arcanea%20design%20partner"
          >
            Propose a pilot <ArrowRight size={16} weight="bold" />
          </a>
        </div>
      </section>
    </>
  );
}

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
    title: "Versioned creative source",
    body: "The public Arcanea mirror exposes canon, lore, agents, and product code for inspection. The World Engine package is not yet published there.",
    href: "https://github.com/frankxai/arcanea",
    label: "Open the public source",
    Icon: Code,
  },
  {
    status: "Source",
    title: "54 MCP tools registered",
    body: "The implementation registers 54 world and studio tools in source. Client packaging and installation are being repaired before runtime claims.",
    href: "/mcp",
    label: "See MCP status",
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
    status: "Contract",
    title: "Creator remains authority",
    body: "Arcanea's product contract reserves the final canon decision for the creator. Conflict detection and merge review are the next product slice.",
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
        The proposed World Seed model connects canon, characters, creations,
        relationships, and source lineage under creator authority.
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
              is building the continuity layer for canon, relationships, rules,
              and creative lineage—so worlds can eventually move across models,
              sessions, and media without forgetting themselves.
            </p>

            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/worlds/create">
                Create a world <ArrowRight size={16} weight="bold" />
              </Link>
              <Link className={styles.secondaryAction} href="/mcp">
                Inspect MCP status
              </Link>
            </div>

            <dl className={styles.metrics} aria-label="Arcanea product facts">
              <div><dt>54</dt><dd>tools registered</dd></div>
              <div><dt>13</dt><dd>Luminors</dd></div>
              <div><dt>Live</dt><dd>on Vercel</dd></div>
            </dl>
          </div>

          <WorldSeedDiagram />
        </div>

        <div className={styles.truthRail}>
          <p><strong>Live now</strong> Vercel product · versioned lore and canon · 54 MCP tools registered in source</p>
          <p><strong>Building next</strong> client-ready MCP packaging · canon conflict detection · branch previews · creator-reviewed merge</p>
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
            founder-used proving environment with a public mirror, 54 registered
            MCP tools in source, and a Vercel product awaiting external validation.
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
              <Link
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
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
              GitHub will hold possible realities. Vercel will make each branch
              tangible. Arcanea will expose conflicts and source lineage before
              the creator reviews a canonical merge.
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
              We are seeking three design partners across narrative studios,
              game-world teams, and transmedia creators. Each pilot will measure
              continuity, recall, source linkage, conflict detection, and portability.
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

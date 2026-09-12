import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ARCANEAN_WORLD_IDENTITIES,
  getArcaneaWorld,
  getWorldVisualJob,
} from "@/lib/arcanea-constellation/schema";

import styles from "../../constellation.module.css";

interface WorldPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ARCANEAN_WORLD_IDENTITIES.worlds.map((world) => ({ id: world.id }));
}

export async function generateMetadata({
  params,
}: WorldPageProps): Promise<Metadata> {
  const { id } = await params;
  const world = getArcaneaWorld(id);
  return world
    ? {
        title: world.name + " — Arcanea World Evidence",
        description:
          world.name +
          " system thesis, story-bearing environmental action, readiness, and governed visual campaign record.",
        alternates: {
          canonical: `/constellation/worlds/${world.id}`,
        },
      }
    : { title: "World not found — Arcanea" };
}

function ListBlock({
  title,
  items,
  fallback,
}: {
  title: string;
  items: string[];
  fallback: string;
}) {
  return (
    <section className={styles.dossierBlock}>
      <h2>{title}</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{fallback}</p>
      )}
    </section>
  );
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { id } = await params;
  const world = getArcaneaWorld(id);
  if (!world) notFound();
  const visualJob = getWorldVisualJob(world);
  const worldIndex =
    ARCANEAN_WORLD_IDENTITIES.worlds.findIndex(
      (candidate) => candidate.id === world.id,
    ) + 1;

  return (
    <main className={styles.dossierPage}>
      <header className={styles.dossierHero}>
        <nav className={styles.dossierNav} aria-label="Breadcrumb">
          <Link href="/constellation#worlds">World evidence atlas</Link>
          <span>
            {String(worldIndex).padStart(2, "0")} /{" "}
            {ARCANEAN_WORLD_IDENTITIES.worlds.length}
          </span>
        </nav>
        <div className={styles.dossierHeroGrid}>
          <div className={styles.dossierIdentity}>
            <p>{world.readiness.replaceAll("-", " ")}</p>
            <h1>{world.name}</h1>
            <blockquote>{world.storyBeat}</blockquote>
          </div>
          <div className={styles.instrumentPlate}>
            <div aria-hidden={!world.campaign.publicImageUrl}>
              {world.campaign.publicImageUrl ? (
                <Image
                  src={world.campaign.publicImageUrl}
                  alt={world.name + ". Approved Arcanea campaign image."}
                  fill
                  sizes="(max-width: 640px) 100vw, 34vw"
                />
              ) : (
                <span>{String(worldIndex).padStart(2, "0")}</span>
              )}
            </div>
            <p>World-system evidence</p>
            <strong>{world.campaign.jobId}</strong>
            <small>
              {world.campaign.generationState.replaceAll("-", " ")} ·{" "}
              {world.campaign.releaseState.replaceAll("-", " ")}
            </small>
          </div>
        </div>
      </header>

      <section className={styles.dossierIntro}>
        <p className={styles.sectionIndex}>System before skyline</p>
        <h2>Geography, labor, ecology, and consequence must agree.</h2>
        <p>{world.systemThesis}</p>
      </section>

      <section className={styles.visualContract}>
        <div>
          <p className={styles.sectionIndex}>Bounded environmental contract</p>
          <h2>One inhabitable action—not a totalizing world portrait.</h2>
          <p>{world.storyBeat}</p>
        </div>
        <dl>
          <div>
            <dt>Canon state</dt>
            <dd>{world.canonState.replaceAll("_", " ")}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{world.evidenceState.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Eligibility</dt>
            <dd>{world.campaign.releaseEligibility.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Identity state</dt>
            <dd>{world.identityState.replaceAll("-", " ")}</dd>
          </div>
        </dl>
      </section>

      {world.blockedReason ? (
        <section className={styles.dossierEvidence}>
          <div>
            <p className={styles.sectionIndex}>Generation gate closed</p>
            <h2>The prerequisite protects the world.</h2>
            <p>{world.blockedReason}</p>
          </div>
          <dl>
            <div>
              <dt>Next valid state</dt>
              <dd>
                A versioned human decision or qualified review must supersede
                this blocker before a prompt may execute.
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section className={styles.dossierGrid}>
        <ListBlock
          title="Open world identity"
          items={world.openIdentityVariables}
          fallback="No silent variables remain for this bounded plate. The wider world still requires human review."
        />
        <ListBlock
          title="Required reviews"
          items={world.reviewRequirements}
          fallback="Standard canon, identity, rights, brand, and release gates apply."
        />
        <ListBlock
          title="Source records"
          items={world.sourceRefs}
          fallback="No source record supplied."
        />
      </section>

      <section className={styles.dossierEvidence}>
        <div>
          <p className={styles.sectionIndex}>Campaign lineage</p>
          <h2>The image must remain downstream of the world model.</h2>
          <p>
            Round Nine tests whether foreground work, midground social order,
            and distant ecological consequence can coexist in one navigable
            plate. Craft quality cannot override an open world identity,
            specialist gate, or canon-resource decision.
          </p>
        </div>
        <dl>
          <div>
            <dt>Study</dt>
            <dd>
              {world.campaign.jobId} · Round{" "}
              {String(world.campaign.round).padStart(2, "0")}
            </dd>
          </div>
          <div>
            <dt>Deliverable</dt>
            <dd>{visualJob?.deliverable ?? "No deliverable recorded."}</dd>
          </div>
          <div>
            <dt>Contract hash</dt>
            <dd>{visualJob?.promptContract.contractHash ?? "not compiled"}</dd>
          </div>
          <div>
            <dt>Blocker</dt>
            <dd>
              {visualJob?.blockedReason ?? "No execution blocker recorded."}
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.blueprintDownloads}>
        <div>
          <p className={styles.sectionIndex}>Continue the evidence trail</p>
          <h2>Read the world before admiring the view.</h2>
          <p>
            A strong Arcanea environment teaches how people eat, work, move,
            maintain, remember, decide, and live with the exceptional.
          </p>
        </div>
        <div>
          {visualJob ? (
            <Link href={`/constellation/prompts/${visualJob.id.toLowerCase()}`}>
              Inspect prompt contract
            </Link>
          ) : null}
          <Link href="/constellation#worlds">World atlas</Link>
          <Link href="/worlds">Arcanea worlds</Link>
          <Link href="/constellation#campaign">Campaign ledger</Link>
        </div>
      </section>
    </main>
  );
}

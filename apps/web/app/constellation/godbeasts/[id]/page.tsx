import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ARCANEAN_GODBEAST_IDENTITIES,
  getArcaneaGodbeast,
  getGodbeastVisualJobs,
} from "@/lib/arcanea-constellation/schema";

import styles from "../../constellation.module.css";

interface GodbeastPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ARCANEAN_GODBEAST_IDENTITIES.godbeasts.map((godbeast) => ({
    id: godbeast.id,
  }));
}

export async function generateMetadata({
  params,
}: GodbeastPageProps): Promise<Metadata> {
  const { id } = await params;
  const godbeast = getArcaneaGodbeast(id);
  return godbeast
    ? {
        title: godbeast.name + " — Arcanea Godbeast Evidence",
        description:
          godbeast.name +
          " locked relation, grounded function, proposed morphology, and governed visual studies.",
        alternates: {
          canonical: `/constellation/godbeasts/${godbeast.id}`,
        },
      }
    : { title: "Godbeast not found — Arcanea" };
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className={styles.dossierBlock}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function GodbeastPage({ params }: GodbeastPageProps) {
  const { id } = await params;
  const godbeast = getArcaneaGodbeast(id);
  if (!godbeast) notFound();
  const visualJobs = getGodbeastVisualJobs(godbeast);
  const godbeastIndex =
    ARCANEAN_GODBEAST_IDENTITIES.godbeasts.findIndex(
      (candidate) => candidate.id === godbeast.id,
    ) + 1;

  return (
    <main className={styles.dossierPage}>
      <header className={styles.dossierHero}>
        <nav className={styles.dossierNav} aria-label="Breadcrumb">
          <Link href="/constellation#godbeasts">Godbeast evidence atlas</Link>
          <span>
            {String(godbeastIndex).padStart(2, "0")} /{" "}
            {ARCANEAN_GODBEAST_IDENTITIES.godbeasts.length}
          </span>
        </nav>
        <div className={styles.dossierHeroGrid}>
          <div className={styles.dossierIdentity}>
            <p>
              Gate {String(godbeast.gateIndex).padStart(2, "0")} ·{" "}
              {godbeast.gate} / {godbeast.readiness.replaceAll("-", " ")}
            </p>
            <h1>{godbeast.name}</h1>
            <blockquote>{godbeast.storyBeat}</blockquote>
          </div>
          <div className={styles.instrumentPlate}>
            <div aria-hidden={!godbeast.campaign.publicImageUrl}>
              {godbeast.campaign.publicImageUrl ? (
                <Image
                  src={godbeast.campaign.publicImageUrl}
                  alt={godbeast.name + ". Approved Arcanea campaign image."}
                  fill
                  sizes="(max-width: 640px) 100vw, 34vw"
                />
              ) : (
                <span>{godbeast.chordCount}</span>
              )}
            </div>
            <p>Morphology evidence</p>
            <strong>{godbeast.campaign.morphologyJobId}</strong>
            <small>
              {godbeast.campaign.generationState.replaceAll("-", " ")} ·{" "}
              {godbeast.campaign.releaseState.replaceAll("-", " ")}
            </small>
          </div>
        </div>
      </header>

      <section className={styles.dossierIntro}>
        <p className={styles.sectionIndex}>Locally grounded function</p>
        <h2>
          {godbeast.gate} · {godbeast.chordCount} Chord
          {godbeast.chordCount === 1 ? "" : "s"}
        </h2>
        <p>{godbeast.functionalTruth}</p>
      </section>

      <section className={styles.visualContract}>
        <div>
          <p className={styles.sectionIndex}>Morphology under test</p>
          <h2>Hold the candidate. Do not promote it to canon.</h2>
          <p>{godbeast.morphologyCandidate}</p>
        </div>
        <dl>
          <div>
            <dt>Bond</dt>
            <dd>{godbeast.bondedGuardian.name}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{godbeast.evidenceState.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Eligibility</dt>
            <dd>{godbeast.campaign.releaseEligibility.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Identity lock</dt>
            <dd>Not issued. Detailed morphology remains provisional.</dd>
          </div>
        </dl>
      </section>

      {godbeast.blockedReason ? (
        <section className={styles.dossierEvidence}>
          <div>
            <p className={styles.sectionIndex}>Generation gate closed</p>
            <h2>The contradiction must be resolved first.</h2>
            <p>{godbeast.blockedReason}</p>
          </div>
          <dl>
            <div>
              <dt>Required authority</dt>
              <dd>
                Human canon decision with a versioned reconciliation receipt.
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section className={styles.dossierGrid}>
        <ListBlock
          title="Open physical identity"
          items={godbeast.openIdentityVariables}
        />
        <ListBlock
          title="Required reviews"
          items={godbeast.reviewRequirements}
        />
        <ListBlock title="Source records" items={godbeast.sourceRefs} />
      </section>

      <section className={styles.dossierEvidence}>
        <div>
          <p className={styles.sectionIndex}>Two governed studies</p>
          <h2>Morphology first. Relationship second.</h2>
          <p>
            The solo plate holds one proposed topology steady long enough to
            test silhouette, Chord count, material function, locomotion, and
            ecology. The dyad then tests reciprocal sovereignty with the bonded
            Guardian. Neither study may become an identity master while
            morphology remains provisional.
          </p>
        </div>
        <dl>
          <div>
            <dt>Morphology study</dt>
            <dd>
              {godbeast.campaign.morphologyJobId} · Round{" "}
              {String(godbeast.campaign.morphologyRound).padStart(2, "0")}
            </dd>
          </div>
          <div>
            <dt>Solo deliverable</dt>
            <dd>
              {visualJobs.morphology?.deliverable ?? "No deliverable recorded."}
            </dd>
          </div>
          <div>
            <dt>Dyad study</dt>
            <dd>
              {godbeast.campaign.dyadJobId} · Round{" "}
              {String(godbeast.campaign.dyadRound).padStart(2, "0")}
            </dd>
          </div>
          <div>
            <dt>Dyad state</dt>
            <dd>
              {visualJobs.dyad?.blockedReason ??
                visualJobs.dyad?.generationState.replaceAll("-", " ") ??
                "No dyad contract recorded."}
            </dd>
          </div>
          <div>
            <dt>Solo contract hash</dt>
            <dd>
              {visualJobs.morphology?.promptContract.contractHash ??
                "not compiled"}
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.blueprintDownloads}>
        <div>
          <p className={styles.sectionIndex}>Continue the evidence trail</p>
          <h2>See function, candidate form, and campaign together.</h2>
          <p>
            This dossier is an evidence boundary: it makes a vivid morphology
            testable without pretending that an attached proposal already
            changed Arcanea canon.
          </p>
        </div>
        <div>
          {visualJobs.morphology ? (
            <Link
              href={`/constellation/prompts/${visualJobs.morphology.id.toLowerCase()}`}
            >
              Inspect morphology prompt
            </Link>
          ) : null}
          {visualJobs.dyad ? (
            <Link
              href={`/constellation/prompts/${visualJobs.dyad.id.toLowerCase()}`}
            >
              Inspect dyad prompt
            </Link>
          ) : null}
          <Link href="/constellation#godbeasts">Godbeast atlas</Link>
          <Link href="/lore/godbeasts">Local Godbeast lore</Link>
          <Link href="/constellation#campaign">Campaign ledger</Link>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ARCANEAN_GUARDIAN_IDENTITIES,
  getArcaneaGuardian,
  getGuardianVisualJobs,
} from "@/lib/arcanea-constellation/schema";

import styles from "../../constellation.module.css";

interface GuardianPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ARCANEAN_GUARDIAN_IDENTITIES.guardians.map((guardian) => ({
    id: guardian.id,
  }));
}

export async function generateMetadata({
  params,
}: GuardianPageProps): Promise<Metadata> {
  const { id } = await params;
  const guardian = getArcaneaGuardian(id);
  return guardian
    ? {
        title: guardian.name + " — Arcanea Guardian Evidence",
        description:
          guardian.name +
          " locked relations, behavioral myth, open physical identity, and governed visual studies.",
        alternates: {
          canonical: `/constellation/guardians/${guardian.id}`,
        },
      }
    : { title: "Guardian not found — Arcanea" };
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

export default async function GuardianPage({ params }: GuardianPageProps) {
  const { id } = await params;
  const guardian = getArcaneaGuardian(id);
  if (!guardian) notFound();
  const visualJobs = getGuardianVisualJobs(guardian);
  const guardianIndex =
    ARCANEAN_GUARDIAN_IDENTITIES.guardians.findIndex(
      (candidate) => candidate.id === guardian.id,
    ) + 1;

  return (
    <main className={styles.dossierPage}>
      <header className={styles.dossierHero}>
        <nav className={styles.dossierNav} aria-label="Breadcrumb">
          <Link href="/constellation#guardians">Guardian evidence atlas</Link>
          <span>
            {String(guardianIndex).padStart(2, "0")} /{" "}
            {ARCANEAN_GUARDIAN_IDENTITIES.guardians.length}
          </span>
        </nav>
        <div className={styles.dossierHeroGrid}>
          <div className={styles.dossierIdentity}>
            <p>
              Gate {String(guardian.gateIndex).padStart(2, "0")} ·{" "}
              {guardian.gate} / {guardian.readiness.replaceAll("-", " ")}
            </p>
            <h1>{guardian.name}</h1>
            <blockquote>{guardian.storyBeat}</blockquote>
          </div>
          <div className={styles.instrumentPlate}>
            <div aria-hidden={!guardian.campaign.publicImageUrl}>
              {guardian.campaign.publicImageUrl ? (
                <Image
                  src={guardian.campaign.publicImageUrl}
                  alt={guardian.name + ". Approved Arcanea campaign image."}
                  fill
                  sizes="(max-width: 640px) 100vw, 34vw"
                />
              ) : (
                <span>{String(guardian.gateIndex).padStart(2, "0")}</span>
              )}
            </div>
            <p>Identity evidence</p>
            <strong>{guardian.campaign.identityJobId}</strong>
            <small>
              {guardian.campaign.generationState.replaceAll("-", " ")} ·{" "}
              {guardian.campaign.releaseState.replaceAll("-", " ")}
            </small>
          </div>
        </div>
      </header>

      <section className={styles.dossierIntro}>
        <p className={styles.sectionIndex}>Locked relation</p>
        <h2>
          {guardian.gate} · {guardian.domain}
        </h2>
        <p>{guardian.behaviorThesis}</p>
      </section>

      <section className={styles.visualContract}>
        <div>
          <p className={styles.sectionIndex}>Discovery focus</p>
          <h2>Show the choice. Do not invent the canon.</h2>
          <p>{guardian.discoveryFocus}</p>
        </div>
        <dl>
          <div>
            <dt>Bond</dt>
            <dd>
              {guardian.bondedGodbeast.name} ·{" "}
              {guardian.bondedGodbeast.chordCount} Chord
              {guardian.bondedGodbeast.chordCount === 1 ? "" : "s"}
            </dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{guardian.evidenceState.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Eligibility</dt>
            <dd>{guardian.campaign.releaseEligibility.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Identity lock</dt>
            <dd>Not issued. Physical embodiment remains provisional.</dd>
          </div>
        </dl>
      </section>

      <section className={styles.dossierGrid}>
        <ListBlock
          title="Open physical identity"
          items={guardian.openIdentityVariables}
        />
        <ListBlock
          title="Required reviews"
          items={guardian.reviewRequirements}
        />
        <ListBlock title="Source records" items={guardian.sourceRefs} />
      </section>

      <section className={styles.dossierEvidence}>
        <div>
          <p className={styles.sectionIndex}>Two governed studies</p>
          <h2>Identity first. Relationship second.</h2>
          <p>
            The solo plate tests whether behavior and silhouette can carry the
            Gate without costume shorthand. The dyad then tests reciprocal
            sovereignty with the bonded Godbeast. Neither study may become a
            public identity master while physical variables remain open.
          </p>
        </div>
        <dl>
          <div>
            <dt>Identity study</dt>
            <dd>
              {guardian.campaign.identityJobId} · Round{" "}
              {String(guardian.campaign.identityRound).padStart(2, "0")}
            </dd>
          </div>
          <div>
            <dt>Solo deliverable</dt>
            <dd>
              {visualJobs.identity?.deliverable ?? "No deliverable recorded."}
            </dd>
          </div>
          <div>
            <dt>Dyad study</dt>
            <dd>
              {guardian.campaign.dyadJobId} · Round{" "}
              {String(guardian.campaign.dyadRound).padStart(2, "0")}
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
              {visualJobs.identity?.promptContract.contractHash ??
                "not compiled"}
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.blueprintDownloads}>
        <div>
          <p className={styles.sectionIndex}>Continue the evidence trail</p>
          <h2>See myth, system, and campaign together.</h2>
          <p>
            The evidence atlas is the truthful bridge between locked lore and
            the visual studies that will eventually support a human identity
            decision.
          </p>
        </div>
        <div>
          {visualJobs.identity ? (
            <Link
              href={`/constellation/prompts/${visualJobs.identity.id.toLowerCase()}`}
            >
              Inspect solo prompt
            </Link>
          ) : null}
          {visualJobs.dyad ? (
            <Link
              href={`/constellation/prompts/${visualJobs.dyad.id.toLowerCase()}`}
            >
              Inspect dyad prompt
            </Link>
          ) : null}
          <Link href="/constellation#guardians">Guardian atlas</Link>
          <Link href="/lore/guardians">Locked Guardian lore</Link>
          <Link href="/constellation#campaign">Campaign ledger</Link>
        </div>
      </section>
    </main>
  );
}

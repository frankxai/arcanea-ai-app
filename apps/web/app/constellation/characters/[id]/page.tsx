import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ARCANEAN_CHARACTER_IDENTITIES,
  getArcaneaCharacter,
  getCharacterVisualJob,
} from "@/lib/arcanea-constellation/schema";

import styles from "../../constellation.module.css";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ARCANEAN_CHARACTER_IDENTITIES.characters.map((character) => ({
    id: character.id,
  }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = getArcaneaCharacter(id);
  return character
    ? {
        title: character.name + " — Arcanea Story Identity",
        description:
          character.name +
          " identity evidence, open variables, review gates, and visual campaign state.",
        alternates: {
          canonical: `/constellation/characters/${character.id}`,
        },
      }
    : { title: "Character not found — Arcanea" };
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

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = getArcaneaCharacter(id);
  if (!character) notFound();
  const visualJob = getCharacterVisualJob(character);
  const characterIndex =
    ARCANEAN_CHARACTER_IDENTITIES.characters.findIndex(
      (candidate) => candidate.id === character.id,
    ) + 1;
  const openVariables = character.openIdentityVariables.length
    ? character.openIdentityVariables
    : ["No physical variables are open in the cited manuscript record."];
  const reviews = character.reviewRequirements.length
    ? character.reviewRequirements
    : [
        "Standard canon, identity, rights, brand, sensitivity, and human release gates remain required.",
      ];

  return (
    <main className={styles.dossierPage}>
      <header className={styles.dossierHero}>
        <nav className={styles.dossierNav} aria-label="Breadcrumb">
          <Link href="/constellation#characters">Story identity atlas</Link>
          <span>
            {String(characterIndex).padStart(2, "0")} /{" "}
            {ARCANEAN_CHARACTER_IDENTITIES.characters.length}
          </span>
        </nav>
        <div className={styles.dossierHeroGrid}>
          <div className={styles.dossierIdentity}>
            <p>
              {character.series} / {character.readiness.replaceAll("-", " ")}
            </p>
            <h1>{character.name}</h1>
            <blockquote>{character.storyBeat}</blockquote>
          </div>
          <div className={styles.instrumentPlate}>
            <div aria-hidden={!character.campaign.publicImageUrl}>
              {character.campaign.publicImageUrl ? (
                <Image
                  src={character.campaign.publicImageUrl}
                  alt={character.name + ". Approved Arcanea campaign image."}
                  fill
                  sizes="(max-width: 640px) 100vw, 34vw"
                />
              ) : (
                <span>{character.name.slice(0, 1)}</span>
              )}
            </div>
            <p>Campaign evidence</p>
            <strong>{character.campaign.jobId}</strong>
            <small>
              {character.campaign.generationState.replaceAll("-", " ")} ·{" "}
              {character.campaign.releaseState.replaceAll("-", " ")}
            </small>
          </div>
        </div>
      </header>

      <section className={styles.dossierIntro}>
        <p className={styles.sectionIndex}>Identity evidence</p>
        <h2>Know what is fixed. See what is still open.</h2>
        <p>{character.description}</p>
      </section>

      <section className={styles.dossierGrid}>
        <ListBlock title="Open identity variables" items={openVariables} />
        <ListBlock title="Required reviews" items={reviews} />
        <ListBlock title="Source records" items={character.sourceRefs} />
      </section>

      <section className={styles.visualContract}>
        <div>
          <p className={styles.sectionIndex}>Visual contract</p>
          <h2>
            {character.readiness === "discovery-only"
              ? "Explore without pretending to lock."
              : character.readiness === "blocked"
                ? "Resolve the gate before generation."
                : "Hold every source-defined trait."}
          </h2>
        </div>
        <dl>
          <div>
            <dt>Readiness</dt>
            <dd>{character.readiness.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{character.evidenceState.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Eligibility</dt>
            <dd>
              {character.campaign.releaseEligibility.replaceAll("-", " ")}
            </dd>
          </div>
          <div>
            <dt>Specialist review</dt>
            <dd>
              {character.sensitivityReviewRequired
                ? "Required and must be evidenced before approval."
                : "No named specialist gate beyond the standard review path."}
            </dd>
          </div>
          {character.blockedReason ? (
            <div>
              <dt>Blocker</dt>
              <dd>{character.blockedReason}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className={styles.dossierEvidence}>
        <div>
          <p className={styles.sectionIndex}>Campaign contract</p>
          <h2>
            {visualJob?.deliverable ?? "No campaign deliverable is recorded."}
          </h2>
          <p>
            A generated image remains internal evidence until independent
            scoring and every human gate are complete. Discovery studies cannot
            be staged publicly until their open identity variables are resolved
            in a new versioned contract.
          </p>
        </div>
        <dl>
          <div>
            <dt>Round</dt>
            <dd>
              {visualJob
                ? String(visualJob.round).padStart(2, "0")
                : "unassigned"}
            </dd>
          </div>
          <div>
            <dt>Story beat</dt>
            <dd>
              {visualJob?.promptContract.storyBeat ?? character.storyBeat}
            </dd>
          </div>
          <div>
            <dt>Variation</dt>
            <dd>
              {visualJob?.promptContract.subject.allowedVariation ??
                "No prompt contract is available."}
            </dd>
          </div>
          <div>
            <dt>Contract hash</dt>
            <dd>{visualJob?.promptContract.contractHash ?? "not compiled"}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.blueprintDownloads}>
        <div>
          <p className={styles.sectionIndex}>Continue the evidence trail</p>
          <h2>See the system around the story.</h2>
          <p>
            The character atlas and campaign ledger remain the public truth
            surfaces until an approved image and story experience exist.
          </p>
        </div>
        <div>
          {visualJob ? (
            <Link href={`/constellation/prompts/${visualJob.id.toLowerCase()}`}>
              Inspect prompt contract
            </Link>
          ) : null}
          <Link href="/constellation#characters">Character atlas</Link>
          <Link href="/constellation#campaign">Campaign ledger</Link>
          <Link href="/gallery">Visual encyclopedia</Link>
        </div>
      </section>
    </main>
  );
}

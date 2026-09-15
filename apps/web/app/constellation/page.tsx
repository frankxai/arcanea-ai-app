import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ARCANEAN_CHARACTER_IDENTITIES,
  ARCANEAN_CONSTELLATION,
  ARCANEAN_GODBEAST_IDENTITIES,
  ARCANEAN_GUARDIAN_IDENTITIES,
  ARCANEAN_VISUAL_CAMPAIGN,
  ARCANEAN_WORLD_IDENTITIES,
  type ArcaneaAgent,
  type ArcaneaCharacterIdentity,
  type ArcaneaGodbeastIdentity,
  type ArcaneaGuardianIdentity,
  type ArcaneaWorldIdentity,
} from "@/lib/arcanea-constellation/schema";

import styles from "./constellation.module.css";

export const metadata: Metadata = {
  title: "Living Constellation — Arcanea",
  description:
    "Inspect Arcanea’s 16 public agent identities, their human-held authority, and the governed 100-image visual campaign.",
  alternates: { canonical: "/constellation" },
  openGraph: {
    title: "The Living Constellation — Arcanea",
    description:
      "Sixteen creative intelligences, sixty-six named identities, and one governed 100-image campaign with human-held canon and release.",
  },
};

const domainIndex = new Map(
  ARCANEAN_CONSTELLATION.domains.map((domain, index) => [domain.id, index + 1]),
);

function AgentCard({ agent }: { agent: ArcaneaAgent }) {
  const domain = agent.domain.toLowerCase();
  return (
    <Link href={`/constellation/${agent.id}`} className={styles.agentCard}>
      <div className={styles.agentTopline}>
        <span>{String(agent.order).padStart(2, "0")}</span>
        <span>{agent.domain}</span>
      </div>
      <div className={styles.instrument} aria-hidden="true">
        <span>{domainIndex.get(domain) ?? 0}</span>
      </div>
      <h3>{agent.name}</h3>
      <p className={styles.epithet}>{agent.epithet}</p>
      <p>{agent.oneLiner}</p>
      <div className={styles.cardFooter}>
        <span>{agent.instrument}</span>
        <span>Open dossier</span>
      </div>
    </Link>
  );
}

function CharacterCard({ character }: { character: ArcaneaCharacterIdentity }) {
  return (
    <Link
      href={"/constellation/characters/" + character.id}
      className={styles.characterCard}
    >
      <div className={styles.agentTopline}>
        <span>{character.campaign.jobId}</span>
        <span>{character.readiness.replaceAll("-", " ")}</span>
      </div>
      {character.campaign.publicImageUrl ? (
        <div className={styles.characterMedia}>
          <Image
            src={character.campaign.publicImageUrl}
            alt={character.name + ". Approved Arcanea campaign image."}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 28vw"
          />
        </div>
      ) : (
        <div className={styles.characterEvidence} aria-hidden="true">
          <span>{character.name.slice(0, 1)}</span>
          <small>
            {character.readiness === "blocked"
              ? "gate closed"
              : "no approved image"}
          </small>
        </div>
      )}
      <h3>{character.name}</h3>
      <p>{character.storyBeat}</p>
      <div className={styles.cardFooter}>
        <span>{character.series}</span>
        <span>Inspect identity</span>
      </div>
    </Link>
  );
}

function GuardianCard({ guardian }: { guardian: ArcaneaGuardianIdentity }) {
  return (
    <Link
      href={"/constellation/guardians/" + guardian.id}
      className={styles.characterCard}
    >
      <div className={styles.agentTopline}>
        <span>Gate {String(guardian.gateIndex).padStart(2, "0")}</span>
        <span>{guardian.readiness.replaceAll("-", " ")}</span>
      </div>
      {guardian.campaign.publicImageUrl ? (
        <div className={styles.characterMedia}>
          <Image
            src={guardian.campaign.publicImageUrl}
            alt={guardian.name + ". Approved Arcanea campaign image."}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 28vw"
          />
        </div>
      ) : (
        <div className={styles.characterEvidence} aria-hidden="true">
          <span>{String(guardian.gateIndex).padStart(2, "0")}</span>
          <small>identity still open</small>
        </div>
      )}
      <h3>{guardian.name}</h3>
      <p>{guardian.storyBeat}</p>
      <div className={styles.cardFooter}>
        <span>
          {guardian.gate} · {guardian.bondedGodbeast.name}
        </span>
        <span>Inspect evidence</span>
      </div>
    </Link>
  );
}

function GodbeastCard({ godbeast }: { godbeast: ArcaneaGodbeastIdentity }) {
  return (
    <Link
      href={"/constellation/godbeasts/" + godbeast.id}
      className={styles.characterCard}
    >
      <div className={styles.agentTopline}>
        <span>
          {godbeast.chordCount} Chord
          {godbeast.chordCount === 1 ? "" : "s"}
        </span>
        <span>{godbeast.readiness.replaceAll("-", " ")}</span>
      </div>
      {godbeast.campaign.publicImageUrl ? (
        <div className={styles.characterMedia}>
          <Image
            src={godbeast.campaign.publicImageUrl}
            alt={godbeast.name + ". Approved Arcanea campaign image."}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 28vw"
          />
        </div>
      ) : (
        <div className={styles.characterEvidence} aria-hidden="true">
          <span>{godbeast.chordCount}</span>
          <small>
            {godbeast.readiness === "blocked"
              ? "canon gate closed"
              : "candidate form only"}
          </small>
        </div>
      )}
      <h3>{godbeast.name}</h3>
      <p>{godbeast.storyBeat}</p>
      <div className={styles.cardFooter}>
        <span>
          {godbeast.gate} · {godbeast.bondedGuardian.name}
        </span>
        <span>Inspect morphology</span>
      </div>
    </Link>
  );
}

function WorldCard({ world }: { world: ArcaneaWorldIdentity }) {
  return (
    <Link
      href={"/constellation/worlds/" + world.id}
      className={styles.characterCard}
    >
      <div className={styles.agentTopline}>
        <span>{world.campaign.jobId}</span>
        <span>{world.readiness.replaceAll("-", " ")}</span>
      </div>
      {world.campaign.publicImageUrl ? (
        <div className={styles.characterMedia}>
          <Image
            src={world.campaign.publicImageUrl}
            alt={world.name + ". Approved Arcanea campaign image."}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 28vw"
          />
        </div>
      ) : (
        <div className={styles.characterEvidence} aria-hidden="true">
          <span>{String(world.campaign.round).padStart(2, "0")}</span>
          <small>
            {world.readiness === "blocked"
              ? "world gate closed"
              : "no approved plate"}
          </small>
        </div>
      )}
      <h3>{world.name}</h3>
      <p>{world.storyBeat}</p>
      <div className={styles.cardFooter}>
        <span>{world.canonState.replaceAll("_", " ")}</span>
        <span>Inspect world system</span>
      </div>
    </Link>
  );
}

export default function ConstellationPage() {
  const campaign = ARCANEAN_VISUAL_CAMPAIGN;
  const constellation = ARCANEAN_CONSTELLATION;
  const guardians = ARCANEAN_GUARDIAN_IDENTITIES.guardians;
  const godbeasts = ARCANEAN_GODBEAST_IDENTITIES.godbeasts;
  const characters = ARCANEAN_CHARACTER_IDENTITIES.characters;
  const worlds = ARCANEAN_WORLD_IDENTITIES.worlds;
  const characterSeries = [...new Set(characters.map((item) => item.series))];
  const jobs = campaign.rounds.flatMap((round) => round.jobs);
  const contractReady = jobs.filter(
    (job) => job.generationState === "planned",
  ).length;
  const blocked = jobs.filter(
    (job) => job.generationState === "blocked",
  ).length;

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="constellation-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <span>Arcanea visual intelligence</span>
            <span>Public-safe blueprint v{constellation.meta.version}</span>
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>The Living Constellation</p>
            <h1 id="constellation-title">
              Meet the minds.
              <br />
              Inspect the method.
            </h1>
            <p>
              Sixteen named creative intelligences, ten Guardian records, ten
              Godbeast morphology records, twenty story identities, ten world
              systems, one human-held approval boundary, and a governed campaign
              that turns evidence into repeatable visual language.
            </p>
            <div className={styles.heroActions}>
              <a href="#atlas" className={styles.primaryAction}>
                Explore the agents
              </a>
              <a href="#campaign" className={styles.secondaryAction}>
                Inspect the campaign
              </a>
              <Link href="/gallery" className={styles.secondaryAction}>
                See existing visual evidence
              </Link>
            </div>
          </div>
          <div className={styles.liveArtifact}>
            <div className={styles.artifactHeader}>
              <span>Campaign · evidence to image</span>
              <span className={styles.status}>
                {campaign.meta.status.replaceAll("-", " ")}
              </span>
            </div>
            <div className={styles.campaignDial}>
              <strong>{campaign.meta.totalJobs}</strong>
              <span>contracted images</span>
            </div>
            <dl className={styles.metrics}>
              <div>
                <dt>Rounds</dt>
                <dd>{campaign.rounds.length}</dd>
              </div>
              <div>
                <dt>Contract-ready</dt>
                <dd>{contractReady}</dd>
              </div>
              <div>
                <dt>Gated</dt>
                <dd>{blocked}</dd>
              </div>
              <div>
                <dt>Generated</dt>
                <dd>{campaign.meta.generatedCount}</dd>
              </div>
            </dl>
            <p className={styles.artifactTruth}>{campaign.meta.releaseTruth}</p>
          </div>
        </div>
      </section>

      <section className={styles.truthBand} aria-label="Authority boundary">
        <div>
          <span>Identity</span>
          <strong>16 existing public product names</strong>
        </div>
        <div>
          <span>Runtime</span>
          <strong>Inspectable blueprints, not autonomous authority</strong>
        </div>
        <div>
          <span>Final gate</span>
          <strong>Canon, identity, spend, and release stay human-held</strong>
        </div>
      </section>

      <section
        className={styles.section}
        id="atlas"
        aria-labelledby="agent-atlas-title"
      >
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionIndex}>01 / Agent atlas</p>
            <h2 id="agent-atlas-title">A constellation you can learn from.</h2>
          </div>
          <p>
            Each dossier teaches purpose, perspective, instrument, routes,
            outputs, stop conditions, and the exact decisions the agent must
            return to a human.
          </p>
        </header>

        {constellation.domains.map((domain) => (
          <section key={domain.id} className={styles.domainSection}>
            <div className={styles.domainRail}>
              <span>{String(domainIndex.get(domain.id)).padStart(2, "0")}</span>
              <h3>{domain.name}</h3>
              <p>{domain.operatingRule}</p>
            </div>
            <div className={styles.agentGrid}>
              {domain.agentIds.map((agentId) => {
                const agent = constellation.agents.find(
                  (candidate) => candidate.id === agentId,
                );
                return agent ? (
                  <AgentCard key={agent.id} agent={agent} />
                ) : null;
              })}
            </div>
          </section>
        ))}
      </section>

      <section
        className={styles.section}
        id="guardians"
        aria-labelledby="guardian-atlas-title"
      >
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionIndex}>02 / Guardian evidence atlas</p>
            <h2 id="guardian-atlas-title">
              Mythic behavior is not a finished face.
            </h2>
          </div>
          <p>
            Canon locks each name, Gate, domain, and bond. The behavioral myths
            give every Guardian a consequential action. Physical embodiment is
            still open, so all ten visual studies remain internal discovery—not
            identity masters.
          </p>
        </header>

        <div className={styles.readinessBand}>
          <div>
            <strong>{guardians.length}</strong>
            <span>Discovery only</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Physical identities locked</span>
          </div>
          <div>
            <strong>20</strong>
            <span>Guardian + dyad studies</span>
          </div>
          <div>
            <strong>Human</strong>
            <span>Final identity gate</span>
          </div>
        </div>

        <div className={styles.characterGrid}>
          {guardians.map((guardian) => (
            <GuardianCard key={guardian.id} guardian={guardian} />
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        id="godbeasts"
        aria-labelledby="godbeast-atlas-title"
      >
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionIndex}>03 / Godbeast evidence atlas</p>
            <h2 id="godbeast-atlas-title">
              A vivid candidate is still a candidate.
            </h2>
          </div>
          <p>
            Every dossier separates the locked Gate relation and locally
            grounded function from a creator-proposed body plan. Eight
            candidates may be explored internally; Sol and Source stay closed
            until their contradictions receive a human canon decision.
          </p>
        </header>

        <div className={styles.readinessBand}>
          <div>
            <strong>
              {
                godbeasts.filter(
                  (godbeast) => godbeast.readiness === "discovery-only",
                ).length
              }
            </strong>
            <span>Discovery candidates</span>
          </div>
          <div>
            <strong>
              {
                godbeasts.filter((godbeast) => godbeast.readiness === "blocked")
                  .length
              }
            </strong>
            <span>Contradiction gates</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Detailed identities locked</span>
          </div>
          <div>
            <strong>20</strong>
            <span>Morphology + dyad studies</span>
          </div>
        </div>

        <div className={styles.characterGrid}>
          {godbeasts.map((godbeast) => (
            <GodbeastCard key={godbeast.id} godbeast={godbeast} />
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        id="characters"
        aria-labelledby="character-atlas-title"
      >
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionIndex}>04 / Story identity atlas</p>
            <h2 id="character-atlas-title">Evidence before likeness.</h2>
          </div>
          <p>
            Every character dossier separates manuscript-defined traits from
            open identity variables, specialist review requirements, and the
            exact campaign study that may—or may not yet—be generated.
          </p>
        </header>

        <div className={styles.readinessBand}>
          {[
            ["Source complete", "source-complete"],
            ["Review required", "source-complete-review-required"],
            ["Discovery only", "discovery-only"],
            ["Blocked", "blocked"],
          ].map(([label, state]) => (
            <div key={state}>
              <strong>
                {characters.filter((item) => item.readiness === state).length}
              </strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {characterSeries.map((series, seriesIndex) => {
          const seriesCharacters = characters.filter(
            (character) => character.series === series,
          );
          const blockedInSeries = seriesCharacters.filter(
            (character) => character.readiness === "blocked",
          ).length;
          return (
            <section key={series} className={styles.domainSection}>
              <div className={styles.domainRail}>
                <span>{String(seriesIndex + 1).padStart(2, "0")}</span>
                <h3>{series}</h3>
                <p>
                  {seriesCharacters.length} contracted identity{" "}
                  {seriesCharacters.length === 1 ? "study" : "studies"};{" "}
                  {blockedInSeries} blocked.
                </p>
              </div>
              <div className={styles.characterGrid}>
                {seriesCharacters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section
        className={styles.section}
        id="worlds"
        aria-labelledby="world-atlas-title"
      >
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionIndex}>05 / World evidence atlas</p>
            <h2 id="world-atlas-title">System before skyline.</h2>
          </div>
          <p>
            Each world plate begins with geography, labor, material economy,
            ecology, and one consequential action. Source completeness applies
            to one bounded plate—not permission to invent the rest of a Realm.
          </p>
        </header>

        <div className={styles.readinessBand}>
          {[
            ["Source complete", "source-complete"],
            ["Review required", "source-complete-review-required"],
            ["Discovery only", "discovery-only"],
            ["Blocked", "blocked"],
          ].map(([label, state]) => (
            <div key={state}>
              <strong>
                {worlds.filter((world) => world.readiness === state).length}
              </strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.characterGrid}>
          {worlds.map((world) => (
            <WorldCard key={world.id} world={world} />
          ))}
        </div>
      </section>

      <section
        className={styles.directorSection}
        aria-labelledby="visual-director-title"
      >
        <div className={styles.directorMark} aria-hidden="true">
          <span>P</span>
        </div>
        <div className={styles.directorCopy}>
          <p className={styles.sectionIndex}>
            06 / Accountable visual authority
          </p>
          <h2 id="visual-director-title">Prismatic leads the image system.</h2>
          <p>{constellation.visualDirector.mandate}</p>
          <p className={styles.authorityNote}>
            {constellation.visualDirector.authority}
          </p>
        </div>
        <ol className={styles.routeList}>
          {constellation.routing.approvalPath.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={styles.section}
        id="campaign"
        aria-labelledby="campaign-title"
      >
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionIndex}>07 / Adaptive image campaign</p>
            <h2 id="campaign-title">
              One hundred studies. Reflection every ten.
            </h2>
          </div>
          <p>
            {campaign.adaptiveProtocol.firstDecision}{" "}
            {campaign.adaptiveProtocol.laterDecision}
          </p>
        </header>

        <aside className={styles.benchmarkNote} aria-label="Benchmark boundary">
          <div>
            <strong>Benchmark boundary</strong>
            <p>{campaign.adaptiveProtocol.benchmarkLimitation}</p>
          </div>
          <ul>
            {campaign.adaptiveProtocol.benchmarkAnchors.map((anchor) => (
              <li key={anchor.entityId}>
                <span>{anchor.entityId}</span>
                <p>{anchor.role}</p>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.proofIntro}>
          <strong>After the controlled benchmark</strong>
          <p>{campaign.adaptiveProtocol.laterAllocation}</p>
          <p>{campaign.adaptiveProtocol.probeInterpretation}</p>
        </div>

        <div className={styles.styleGrid}>
          {campaign.styles.map((style, index) => (
            <article key={style.id} className={styles.styleCard}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{style.name}</h3>
              <p>{style.hypothesis}</p>
              <small>{style.direction}</small>
            </article>
          ))}
        </div>

        <div className={styles.roundTable}>
          {campaign.rounds.map((round) => {
            const gated = round.jobs.filter(
              (job) => job.generationState === "blocked",
            ).length;
            const recorded = round.jobs.filter((job) => job.output).length;
            const approved = round.jobs.filter((job) =>
              ["approved", "published"].includes(job.releaseState),
            ).length;
            const published = round.jobs.filter(
              (job) => job.releaseState === "published",
            ).length;
            const roundState = published
              ? `${published} published`
              : approved
                ? `${approved} approved`
                : recorded
                  ? `${recorded} recorded`
                  : gated
                    ? `${gated} gated`
                    : "10 planned";
            return (
              <details
                key={round.round}
                className={styles.roundRow}
                open={round.round === 1}
              >
                <summary>
                  <span className={styles.roundNumber}>
                    {String(round.round).padStart(2, "0")}
                  </span>
                  <span className={styles.roundPurpose}>{round.purpose}</span>
                  <span className={styles.roundState}>{roundState}</span>
                </summary>
                <div className={styles.roundBody}>
                  <p>{round.adaptiveDecision}</p>
                  <div className={styles.jobGrid}>
                    {round.jobs.map((job) => (
                      <article
                        key={job.id}
                        className={
                          job.generationState === "blocked"
                            ? styles.jobBlocked
                            : styles.job
                        }
                      >
                        {job.output?.publicUrl ? (
                          <div className={styles.jobMedia}>
                            <Image
                              src={job.output.publicUrl}
                              alt={`${job.name}. Campaign state: ${job.releaseState.replaceAll("-", " ")}.`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
                            />
                          </div>
                        ) : null}
                        <span>{job.id}</span>
                        <strong>{job.name}</strong>
                        <small>
                          {job.subjectKind} · {job.styleState}
                        </small>
                        <small className={styles.jobState}>
                          {job.generationState.replaceAll("-", " ")} ·{" "}
                          {job.releaseState.replaceAll("-", " ")}
                        </small>
                        {job.blockedReason ? <p>{job.blockedReason}</p> : null}
                        <Link
                          href={`/constellation/prompts/${job.id.toLowerCase()}`}
                          className={styles.jobContractLink}
                        >
                          Inspect prompt contract
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section
        className={styles.methodSection}
        aria-labelledby="quality-contract-title"
      >
        <div>
          <p className={styles.sectionIndex}>08 / Quality contract</p>
          <h2 id="quality-contract-title">
            Beauty cannot average away identity failure.
          </h2>
          <p>{campaign.rubric.decision}</p>
          <div className={styles.threshold}>
            <strong>{campaign.rubric.threshold}</strong>
            <span>minimum of 50</span>
          </div>
        </div>
        <div className={styles.qualityStack}>
          <ol className={styles.rubricGrid}>
            {campaign.rubric.dimensions.map((dimension, index) => (
              <li key={dimension}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {dimension}
              </li>
            ))}
          </ol>
          <div className={styles.proofIntro}>
            <strong>Proof, not polish</strong>
            <p>{campaign.proofProtocol.reviewMethod}</p>
            <p>{campaign.proofProtocol.identityRule}</p>
          </div>
          <ol className={styles.proofLadder}>
            {campaign.proofProtocol.stages.map((stage, index) => (
              <li key={stage.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage.count}</strong>
                <h3>{stage.label}</h3>
                <p>{stage.meaning}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className={styles.downloadSection}
        aria-labelledby="teach-system-title"
      >
        <div>
          <p className={styles.sectionIndex}>09 / Teach the system</p>
          <h2 id="teach-system-title">
            Every agent blueprint ships with an explanation.
          </h2>
        </div>
        <p>
          Downloadable AGENT.md, SKILL.md, and agent-card.json files expose each
          blueprint’s inputs, outputs, stop conditions, and human gates. They
          are learning objects—not authority tokens. The historical{" "}
          {campaign.meta.previousWave.name} documents{" "}
          {campaign.meta.previousWave.inspectedImages} inspected images and{" "}
          {campaign.meta.previousWave.totalPublicationPacketAssets} intake
          records. This campaign learns from that collection without counting it
          as new output. {campaign.meta.previousWave.releaseBoundary}
        </p>
        <div className={styles.downloadActions}>
          <a
            href="/downloads/arcanea-constellation/README.md"
            className={styles.primaryAction}
          >
            Read the public pack
          </a>
          <a
            href="/downloads/arcanea-constellation/system/CONTRACTS.md"
            className={styles.secondaryAction}
          >
            Inspect the contract schemas
          </a>
          <a
            href="/downloads/arcanea-constellation/prompts/PROMPT_ATLAS.md"
            className={styles.secondaryAction}
          >
            Open all 100 prompt contracts
          </a>
          <a
            href="/downloads/arcanea-constellation/prompts/QUALITY_AUDIT.md"
            className={styles.secondaryAction}
          >
            Read the prompt quality audit
          </a>
          <a
            href="/downloads/arcanea-constellation/prompts/OPEN_DECISIONS.md"
            className={styles.secondaryAction}
          >
            Inspect the nine blocked jobs
          </a>
          <Link href="/gallery" className={styles.secondaryAction}>
            Inspect existing visual evidence
          </Link>
        </div>
      </section>
    </main>
  );
}

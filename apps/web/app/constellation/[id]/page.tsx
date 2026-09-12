import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ARCANEAN_CONSTELLATION,
  getAgentVisualJobs,
  getArcaneaAgent,
} from "@/lib/arcanea-constellation/schema";

import styles from "../constellation.module.css";

interface AgentPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ARCANEAN_CONSTELLATION.agents.map((agent) => ({ id: agent.id }));
}

export async function generateMetadata({
  params,
}: AgentPageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = getArcaneaAgent(id);
  return agent
    ? {
        title: `${agent.name} — Arcanea Living Constellation`,
        description: agent.oneLiner,
        alternates: { canonical: `/constellation/${agent.id}` },
      }
    : { title: "Agent not found — Arcanea" };
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

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;
  const agent = getArcaneaAgent(id);
  if (!agent) notFound();
  const visualJobs = getAgentVisualJobs(agent);

  return (
    <main className={styles.dossierPage}>
      <header className={styles.dossierHero}>
        <nav className={styles.dossierNav} aria-label="Breadcrumb">
          <Link href="/constellation">Living Constellation</Link>
          <span>{String(agent.order).padStart(2, "0")} / 16</span>
        </nav>
        <div className={styles.dossierHeroGrid}>
          <div className={styles.dossierIdentity}>
            <p>
              {agent.domain} / {agent.epithet}
            </p>
            <h1>{agent.name}</h1>
            <blockquote>{agent.perspective}</blockquote>
          </div>
          <div className={styles.instrumentPlate}>
            <div aria-hidden="true">
              <span>{agent.name.slice(0, 1)}</span>
            </div>
            <p>Core instrument</p>
            <strong>{agent.instrument}</strong>
            <small>{agent.visualIdentity.state.replaceAll("_", " ")}</small>
          </div>
        </div>
      </header>

      <section className={styles.dossierIntro}>
        <p className={styles.sectionIndex}>Purpose</p>
        <h2>{agent.purpose}</h2>
        <p>{agent.oneLiner}</p>
      </section>

      <section className={styles.dossierGrid}>
        <ListBlock title="Inputs" items={agent.inputs} />
        <ListBlock title="Outputs" items={agent.outputs} />
        <ListBlock title="Capabilities" items={agent.capabilities} />
        <ListBlock title="Routes" items={agent.routes} />
        <ListBlock title="Stop conditions" items={agent.stopConditions} />
        <ListBlock title="Human gates" items={agent.humanGates} />
      </section>

      <section className={styles.visualContract}>
        <div>
          <p className={styles.sectionIndex}>Visual identity candidate</p>
          <h2>A working instrument, not a mascot.</h2>
        </div>
        <dl>
          <div>
            <dt>Silhouette</dt>
            <dd>{agent.visualIdentity.silhouette}</dd>
          </div>
          <div>
            <dt>Material</dt>
            <dd>{agent.visualIdentity.material}</dd>
          </div>
          <div>
            <dt>Light</dt>
            <dd>{agent.visualIdentity.light}</dd>
          </div>
          <div>
            <dt>Working behavior</dt>
            <dd>{agent.visualIdentity.workingBehavior}</dd>
          </div>
          <div>
            <dt>Spatial rhythm</dt>
            <dd>{agent.visualIdentity.spatialRhythm}</dd>
          </div>
          <div>
            <dt>Avoid</dt>
            <dd>{agent.visualIdentity.avoid.join("; ")}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.dossierEvidence}>
        <div>
          <p className={styles.sectionIndex}>Truth and authority</p>
          <h2>Know what this identity is—and is not.</h2>
          <p>
            This is an existing public product name with a proposed operating
            and visual contract. It is not a new mythological species,
            autonomous credential, or final identity approval.
          </p>
        </div>
        <dl>
          <div>
            <dt>Identity state</dt>
            <dd>{agent.authority.identityState.replaceAll("_", " ")}</dd>
          </div>
          <div>
            <dt>Runtime state</dt>
            <dd>{agent.authority.runtimeState.replaceAll("_", " ")}</dd>
          </div>
          <div>
            <dt>Sources</dt>
            <dd>{agent.sourceRefs.join("; ")}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.agentCampaign}>
        <div>
          <p className={styles.sectionIndex}>Campaign evidence</p>
          <h2>
            {visualJobs.length || "No"} contracted visual{" "}
            {visualJobs.length === 1 ? "study" : "studies"}.
          </h2>
        </div>
        <div className={styles.agentJobs}>
          {visualJobs.map((job) => (
            <article key={job.id}>
              {job.output?.publicUrl ? (
                <div className={styles.agentJobMedia}>
                  <Image
                    src={job.output.publicUrl}
                    alt={`${job.name}. Campaign state: ${job.releaseState.replaceAll("-", " ")}.`}
                    fill
                    sizes="(max-width: 640px) 100vw, 40vw"
                  />
                </div>
              ) : null}
              <span>
                {job.id} · Round {String(job.round).padStart(2, "0")}
              </span>
              <h3>{job.name}</h3>
              <p>{job.promptContract.storyBeat}</p>
              <small>
                {job.generationState} · {job.releaseState}
              </small>
              <Link
                href={`/constellation/prompts/${job.id.toLowerCase()}`}
                className={styles.jobContractLink}
              >
                Inspect prompt contract
              </Link>
            </article>
          ))}
          {!visualJobs.length ? (
            <p>
              The current 100-image wave does not yet allocate a dedicated study
              to this identity.
            </p>
          ) : null}
        </div>
      </section>

      <section className={styles.blueprintDownloads}>
        <div>
          <p className={styles.sectionIndex}>Public-safe blueprint</p>
          <h2>Read the contract. Reuse the pattern.</h2>
          <p>
            This identity cannot lock canon, approve itself, spend, or publish.
          </p>
        </div>
        <div>
          <a href={agent.downloads.agent}>AGENT.md</a>
          <a href={agent.downloads.skill}>SKILL.md</a>
          <a href={agent.downloads.card}>agent-card.json</a>
        </div>
      </section>
    </main>
  );
}

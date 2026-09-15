import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ARCANEAN_VISUAL_CAMPAIGN,
  getVisualJob,
} from "@/lib/arcanea-constellation/schema";

import styles from "../../constellation.module.css";

interface PromptContractPageProps {
  params: Promise<{ jobId: string }>;
}

export function generateStaticParams() {
  return ARCANEAN_VISUAL_CAMPAIGN.rounds.flatMap((round) =>
    round.jobs.map((job) => ({ jobId: job.id.toLowerCase() })),
  );
}

export async function generateMetadata({
  params,
}: PromptContractPageProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = getVisualJob(jobId);
  return job
    ? {
        title: `${job.id} — ${job.name} Prompt Contract`,
        description: `Inspect the engine-neutral evidence, identity, story, composition, verification, and governance contract for ${job.name}.`,
        alternates: {
          canonical: `/constellation/prompts/${job.id.toLowerCase()}`,
        },
      }
    : { title: "Prompt contract not found — Arcanea" };
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

export default async function PromptContractPage({
  params,
}: PromptContractPageProps) {
  const { jobId } = await params;
  const job = getVisualJob(jobId);
  if (!job) notFound();

  const contract = job.promptContract;
  const style = ARCANEAN_VISUAL_CAMPAIGN.styles.find(
    (candidate) => candidate.id === job.styleState,
  );
  const downloadPath = `/downloads/arcanea-constellation/prompts/${job.id.toLowerCase()}.json`;

  return (
    <main className={styles.dossierPage}>
      <header className={styles.dossierHero}>
        <nav className={styles.dossierNav} aria-label="Breadcrumb">
          <Link href="/constellation#campaign">100-contract atlas</Link>
          <span>
            Round {String(job.round).padStart(2, "0")} / Slot{" "}
            {String(job.slot).padStart(2, "0")}
          </span>
        </nav>
        <div className={styles.dossierHeroGrid}>
          <div className={styles.dossierIdentity}>
            <p>
              {job.id} / {job.subjectKind.replaceAll("-", " ")}
            </p>
            <h1>{contract.subject.displayName}</h1>
            <blockquote>{contract.intent}</blockquote>
          </div>
          <div className={styles.instrumentPlate}>
            <div aria-hidden="true">
              <span>{String(job.round).padStart(2, "0")}</span>
            </div>
            <p>Contract state</p>
            <strong>
              {style?.name ?? job.styleState.replaceAll("-", " ")}
            </strong>
            <small>
              {job.generationState.replaceAll("-", " ")} ·{" "}
              {job.releaseState.replaceAll("-", " ")}
            </small>
          </div>
        </div>
      </header>

      <section className={styles.dossierIntro}>
        <p className={styles.sectionIndex}>Observable story moment</p>
        <h2>Generate a consequence—not a decorative portrait.</h2>
        <p>{contract.storyBeat}</p>
      </section>

      <section className={styles.visualContract}>
        <div>
          <p className={styles.sectionIndex}>Identity boundary</p>
          <h2>Hold evidence. Expose uncertainty.</h2>
          <p>{contract.subject.identityLock}</p>
        </div>
        <dl>
          <div>
            <dt>Evidence</dt>
            <dd>{contract.subject.evidenceState.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Variation</dt>
            <dd>{contract.subject.allowedVariation}</dd>
          </div>
          <div>
            <dt>Composition</dt>
            <dd>{contract.composition}</dd>
          </div>
          <div>
            <dt>Output geometry</dt>
            <dd>
              {contract.output.assetCount} × {contract.output.aspectRatio}
            </dd>
          </div>
          <div>
            <dt>Intended surface</dt>
            <dd>{contract.output.intendedSurface.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Delivery role</dt>
            <dd>{contract.output.deliveryRole}</dd>
          </div>
          <div>
            <dt>Crop safety</dt>
            <dd>{contract.output.cropSafety}</dd>
          </div>
          <div>
            <dt>Generated text</dt>
            <dd>{contract.output.generatedTextPolicy.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Light</dt>
            <dd>{contract.light}</dd>
          </div>
          <div>
            <dt>Contract hash</dt>
            <dd>{contract.contractHash}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.dossierGrid}>
        <ListBlock
          title="Open identity variables"
          items={
            contract.subject.openIdentityVariables.length
              ? contract.subject.openIdentityVariables
              : ["No identity variables are open in this cited contract."]
          }
        />
        <ListBlock
          title="Source records"
          items={contract.references.sourceRefs}
        />
        <ListBlock
          title="Required reviews"
          items={
            contract.governance.reviewRequirements.length
              ? contract.governance.reviewRequirements
              : [
                  "Standard human canon, identity, rights, brand, and release gates apply.",
                ]
          }
        />
      </section>

      <section className={styles.visualContract}>
        <div>
          <p className={styles.sectionIndex}>Render-system hypothesis</p>
          <h2>{style?.name ?? "Adaptive mode pending"}</h2>
          <p>{style?.hypothesis ?? contract.designSystem.direction}</p>
        </div>
        <dl>
          <div>
            <dt>Direction</dt>
            <dd>{contract.designSystem.direction}</dd>
          </div>
          <div>
            <dt>Color law</dt>
            <dd>{contract.designSystem.colorLaw}</dd>
          </div>
          <div>
            <dt>Escalation</dt>
            <dd>{contract.designSystem.escalation}</dd>
          </div>
          <div>
            <dt>Material law</dt>
            <dd>{contract.designSystem.materialLaw}</dd>
          </div>
          <div>
            <dt>Image typography</dt>
            <dd>{contract.designSystem.typography}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.dossierGrid}>
        <ListBlock
          title="Visible acceptance conditions"
          items={contract.constraints}
        />
        <ListBlock title="Visual exclusions" items={contract.avoid} />
        <ListBlock
          title="Deterministic verification"
          items={contract.verification.deterministicChecks}
        />
      </section>

      <section className={styles.dossierEvidence}>
        <div>
          <p className={styles.sectionIndex}>Authority boundary</p>
          <h2>A prompt contract cannot authorize itself.</h2>
          <p>
            This page exposes the engine-neutral design record. It is not an
            execution grant, provider receipt, identity approval, canon
            decision, or publication credential.
          </p>
        </div>
        <dl>
          <div>
            <dt>Release eligibility</dt>
            <dd>{job.releaseEligibility.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Rights state</dt>
            <dd>{job.rightsState.replaceAll("-", " ")}</dd>
          </div>
          <div>
            <dt>Pass threshold</dt>
            <dd>{contract.verification.passThreshold} / 50</dd>
          </div>
          <div>
            <dt>Human approval</dt>
            <dd>
              {contract.verification.humanApprovalRequired
                ? "Required after independent review."
                : "Not recorded as required."}
            </dd>
          </div>
          {job.blockedReason ? (
            <div>
              <dt>Execution blocker</dt>
              <dd>{job.blockedReason}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className={styles.blueprintDownloads}>
        <div>
          <p className={styles.sectionIndex}>Portable evidence object</p>
          <h2>Read it here. Validate it as data.</h2>
          <p>
            The JSON matches the strict public prompt-contract schema. Provider
            adapters may shorten it for image execution, but may not erase its
            evidence, verification, or governance boundary.
          </p>
        </div>
        <div>
          <a href={downloadPath}>Download contract JSON</a>
          <a href="/downloads/arcanea-constellation/prompts/PROMPT_ATLAS.md">
            Download Prompt Atlas
          </a>
          <a href="/downloads/arcanea-constellation/prompts/QUALITY_AUDIT.md">
            Read quality audit
          </a>
          {job.blockedReason ? (
            <a href="/downloads/arcanea-constellation/prompts/OPEN_DECISIONS.md">
              Inspect decision gate
            </a>
          ) : null}
          <Link href="/constellation#campaign">Return to campaign</Link>
        </div>
      </section>
    </main>
  );
}

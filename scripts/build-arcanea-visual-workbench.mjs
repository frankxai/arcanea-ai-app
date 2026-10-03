import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

const ROOT = process.cwd();
const OUTPUT_PATH = join(
  ROOT,
  "planning-with-files/arcanea-visual-workbench/index.html",
);
const OUTPUT_ROOT = dirname(OUTPUT_PATH);
const campaign = JSON.parse(
  readFileSync(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
    "utf8",
  ),
);
const constellation = JSON.parse(
  readFileSync(
    join(ROOT, "apps/web/data/arcanea-constellation.v1.json"),
    "utf8",
  ),
);
const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function label(value) {
  return String(value ?? "unknown").replaceAll(/[-_]/g, " ");
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

const compiledPrompts = new Map();
const providerExecutions = new Map();
const packsRoot = join(ROOT, "planning-with-files/arcanea-visual-campaign");
const manifestIndexPath = join(packsRoot, "execution-manifests/index.json");
if (!existsSync(manifestIndexPath)) {
  throw new Error("Execution-manifest index is missing.");
}
const manifestIndex = JSON.parse(readFileSync(manifestIndexPath, "utf8"));
const { indexHash, ...indexBody } = manifestIndex;
if (
  manifestIndex.schema !== "arcanea.provider_execution_manifest_index.v1" ||
  indexHash !== sha(indexBody)
) {
  throw new Error("Execution-manifest index is invalid.");
}
const manifestStatusByHash = new Map(
  manifestIndex.lineage.map((entry) => [entry.manifestHash, entry.status]),
);
if (existsSync(packsRoot)) {
  for (const fileName of readdirSync(packsRoot)
    .filter((name) => /^round-\d{2}-prompt-pack\.json$/.test(name))
    .sort()) {
    const pack = JSON.parse(readFileSync(join(packsRoot, fileName), "utf8"));
    const { packetHash, ...packetBody } = pack;
    if (packetHash !== sha(packetBody)) {
      throw new Error(`Prompt pack hash is invalid: ${fileName}`);
    }
    for (const job of pack.jobs) {
      if (job.compiledPrompt) compiledPrompts.set(job.id, job.compiledPrompt);
    }
  }
  for (const fileName of readdirSync(packsRoot)
    .filter((name) => /^round-\d{2}-.+-provider-pack\.json$/.test(name))
    .sort()) {
    const pack = JSON.parse(readFileSync(join(packsRoot, fileName), "utf8"));
    const { packetHash, ...packetBody } = pack;
    if (packetHash !== sha(packetBody)) {
      throw new Error(`Provider packet hash is invalid: ${fileName}`);
    }
    const manifestPath = join(ROOT, pack.executionManifest.path);
    if (!existsSync(manifestPath)) {
      throw new Error(
        `Execution manifest is missing: ${pack.executionManifest.path}`,
      );
    }
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const { manifestHash, ...manifestBody } = manifest;
    if (
      manifestHash !== sha(manifestBody) ||
      manifestHash !== pack.executionManifest.hash
    ) {
      throw new Error(`Execution manifest hash is invalid: ${fileName}`);
    }
    for (const job of pack.jobs) {
      const entries = providerExecutions.get(job.id) ?? [];
      entries.push({
        profileId: pack.profileId,
        profile: pack.profile,
        packetHash,
        promptCompilerVersion: pack.promptCompilerVersion,
        sourceContractSetHash: pack.sourceContractSetHash,
        executionManifest: pack.executionManifest,
        executionManifestStatus:
          manifestStatusByHash.get(pack.executionManifest.hash) ?? "unknown",
        ...job,
      });
      providerExecutions.set(job.id, entries);
    }
  }
}

const jobs = campaign.rounds.flatMap((round) => round.jobs);
const kinds = [...new Set(jobs.map((job) => job.subjectKind))].sort();

function renderJob(job) {
  const contract = job.promptContract;
  const compiledPrompt = compiledPrompts.get(job.id);
  const providerLanes = providerExecutions.get(job.id) ?? [];
  const search = [
    job.id,
    job.name,
    job.subjectKind,
    job.styleState,
    job.canonState,
    job.identityState,
    job.evidenceState,
    job.releaseEligibility,
    contract.storyBeat,
    ...(job.openIdentityVariables ?? []),
    ...(job.reviewRequirements ?? []),
    ...providerLanes.map((lane) => lane.profileId),
    ...job.sourceRefs,
  ]
    .join(" ")
    .toLowerCase();
  const internalImage = job.output?.storagePath
    ? relative(OUTPUT_ROOT, join(ROOT, job.output.storagePath)).replaceAll(
        "\\",
        "/",
      )
    : null;
  const cardClass =
    job.generationState === "blocked" ? "job-card blocked" : "job-card";
  return `
    <article class="${cardClass}" data-job-id="${escapeHtml(job.id)}" data-round="${job.round}" data-state="${escapeHtml(job.generationState)}" data-kind="${escapeHtml(job.subjectKind)}" data-search="${escapeHtml(search)}">
      <header class="job-head">
        <span>${escapeHtml(job.id)} · R${String(job.round).padStart(2, "0")}.${String(job.slot).padStart(2, "0")}</span>
        <span>${escapeHtml(label(job.generationState))}</span>
      </header>
      <div class="evidence-frame">
        ${
          internalImage
            ? `<img src="${escapeHtml(internalImage)}" alt="${escapeHtml(`${job.name}. Internal evidence; ${label(job.releaseState)}.`)}">`
            : `<div class="empty-evidence"><strong>${job.generationState === "blocked" ? "Gate closed" : "No binary"}</strong><span>${job.generationState === "blocked" ? "Resolve the named blocker before generation" : "Contracted, not generated"}</span></div>`
        }
      </div>
      <div class="job-copy">
        <p class="job-kind">${escapeHtml(label(job.subjectKind))} · ${escapeHtml(label(job.styleState))}</p>
        <h3>${escapeHtml(job.name)}</h3>
        <p class="story-beat">${escapeHtml(contract.storyBeat)}</p>
        ${job.blockedReason ? `<p class="blocker"><strong>Blocker:</strong> ${escapeHtml(job.blockedReason)}</p>` : ""}
      </div>
      <dl class="truth-grid">
        <div><dt>Canon</dt><dd>${escapeHtml(label(job.canonState))}</dd></div>
        <div><dt>Identity</dt><dd>${escapeHtml(label(job.identityState))}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(label(job.evidenceState))}</dd></div>
        <div><dt>Eligibility</dt><dd>${escapeHtml(label(job.releaseEligibility))}</dd></div>
        <div><dt>Rights</dt><dd>${escapeHtml(label(job.rightsState))}</dd></div>
        <div><dt>Release</dt><dd>${escapeHtml(label(job.releaseState))}</dd></div>
      </dl>
      <details>
        <summary>Identity and composition contract</summary>
        <div class="detail-body">
          <h4>Identity lock</h4>
          <p>${escapeHtml(contract.subject.identityLock)}</p>
          <h4>Allowed variation</h4>
          <p>${escapeHtml(contract.subject.allowedVariation)}</p>
          <h4>Open identity variables</h4>
          ${job.openIdentityVariables?.length ? renderList(job.openIdentityVariables) : "<p>None recorded.</p>"}
          <h4>Required specialist reviews</h4>
          ${job.reviewRequirements?.length ? renderList(job.reviewRequirements) : "<p>None beyond the standard human gates.</p>"}
          <h4>Composition</h4>
          <p>${escapeHtml(contract.composition)}</p>
          <h4>Design system</h4>
          <p>${escapeHtml(contract.designSystem.direction)}</p>
          <p>${escapeHtml(contract.designSystem.colorLaw)} ${escapeHtml(contract.designSystem.materialLaw)}</p>
        </div>
      </details>
      <details>
        <summary>Acceptance and avoid contract</summary>
        <div class="detail-columns">
          <div><h4>Must hold</h4>${renderList(contract.constraints)}</div>
          <div><h4>Must avoid</h4>${renderList(contract.avoid)}</div>
        </div>
      </details>
      <details>
        <summary>Sources and provenance</summary>
        <div class="detail-body">
          <h4>Source references</h4>
          ${renderList(job.sourceRefs)}
          <h4>Prompt contract hash</h4>
          <code>${escapeHtml(contract.contractHash)}</code>
          <h4>Output receipts</h4>
          ${job.receipts.length ? renderList(job.receipts) : "<p>None recorded.</p>"}
          <h4>Release decisions</h4>
          ${job.decisionReceipts.length ? renderList(job.decisionReceipts) : "<p>None recorded.</p>"}
        </div>
      </details>
      <details>
        <summary>${compiledPrompt ? "Compiled execution prompt" : "Compilation state"}</summary>
        <div class="detail-body">
          ${
            compiledPrompt
              ? `<pre>${escapeHtml(compiledPrompt)}</pre>`
              : `<p>Provider prose remains uncompiled until the prior ten-image reflection is valid and accepted. The engine-neutral contract above remains authoritative.</p>`
          }
        </div>
      </details>
      <details>
        <summary>Provider execution lanes · ${providerLanes.length}</summary>
        <div class="provider-grid">
          ${
            providerLanes.length
              ? providerLanes
                  .map(
                    (lane) => `<section class="provider-lane">
              <div class="provider-head"><h4>${escapeHtml(lane.profileId)}</h4><span>${escapeHtml(label(lane.executionState))}</span></div>
              <p>${escapeHtml(lane.profile.lane)}</p>
              <dl>
                <div><dt>Model policy</dt><dd>${escapeHtml(lane.profile.modelPolicy)}</dd></div>
                <div><dt>Prompt compiler</dt><dd>${escapeHtml(lane.promptCompilerVersion)}</dd></div>
                <div><dt>Prompt hash</dt><dd><code>${escapeHtml(lane.executionPromptHash ?? "gated")}</code></dd></div>
                <div><dt>Packet hash</dt><dd><code>${escapeHtml(lane.packetHash)}</code></dd></div>
                <div><dt>Contract set</dt><dd><code>${escapeHtml(lane.sourceContractSetHash)}</code></dd></div>
                <div><dt>Manifest hash</dt><dd><code>${escapeHtml(lane.executionManifest.hash)}</code></dd></div>
                <div><dt>Manifest status</dt><dd>${escapeHtml(label(lane.executionManifestStatus))}</dd></div>
                <div><dt>Manifest path</dt><dd><code>${escapeHtml(lane.executionManifest.path)}</code></dd></div>
                <div><dt>Reference maturity</dt><dd>${escapeHtml(lane.referencePlan.qualifiedIdentityReferenceSet ? "qualified set assigned" : lane.referencePlan.acceptedReferences.length ? "bounded references assigned" : "text conditioned")}</dd></div>
              </dl>
              <h5>Prompt audit</h5>
              <p>${escapeHtml(`${lane.promptAudit.words} words · ${lane.promptAudit.characters} characters · ${lane.promptAudit.imageFacingConstraintCount} image-facing constraints · ${lane.promptAudit.withheldGovernanceConstraintCount} governance constraints withheld beside the prompt · ${lane.promptAudit.operationalTermsPresent.length} operational leaks`)}</p>
              <h5>Reference plan</h5>
              <p>${escapeHtml(lane.referencePlan.stopCondition)}</p>
              <h5>Request hints</h5>
              <pre>${escapeHtml(JSON.stringify(lane.requestHints, null, 2))}</pre>
              <h5>${lane.executionPrompt ? "Visual-only execution prompt" : "Execution gate"}</h5>
              ${lane.executionPrompt ? `<pre>${escapeHtml(lane.executionPrompt)}</pre>` : `<p>${escapeHtml(lane.blockedReason ?? lane.referencePlan.stopCondition)}</p>`}
              <h5>Receipt requirements</h5>
              ${renderList(lane.receiptRequirements)}
            </section>`,
                  )
                  .join("")
              : "<p>Provider lanes compile only after this round has a valid generic prompt pack.</p>"
          }
        </div>
      </details>
    </article>`;
}

const roundSections = campaign.rounds
  .map(
    (round) => `
      <section class="round-section" data-round-section="${round.round}">
        <header class="round-heading">
          <div><span>ROUND ${String(round.round).padStart(2, "0")}</span><h2>${escapeHtml(round.purpose)}</h2></div>
          <p>${escapeHtml(round.adaptiveDecision)}</p>
        </header>
        <div class="job-grid">${round.jobs.map(renderJob).join("")}</div>
      </section>`,
  )
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Arcanea Visual Campaign Workbench</title>
  <style>
    :root{color-scheme:dark;--void:#09090b;--deep:#121826;--raised:#1b2638;--paper:#e9edc0;--ink:#09090b;--text:#e6eefc;--muted:#9bb1d0;--line:rgba(155,177,208,.22);--teal:#00bcd4;--gold:#ffd966;--fire:#ff6b35;--radius:18px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--void);color:var(--text)}a{color:inherit}button,input,select{font:inherit}
    .hero{position:relative;overflow:hidden;padding:72px max(20px,calc((100vw - 1480px)/2)) 56px;border-bottom:1px solid var(--line);background:radial-gradient(circle at 78% 25%,rgba(0,188,212,.18),transparent 32rem),linear-gradient(180deg,var(--deep),var(--void))}
    .hero:after{position:absolute;right:-180px;bottom:-360px;width:620px;height:620px;border:1px solid rgba(0,188,212,.25);border-radius:50%;content:""}.hero>*{position:relative;z-index:1}.eyebrow{display:flex;justify-content:space-between;gap:16px;padding-bottom:16px;border-bottom:1px solid var(--line);color:var(--teal);font:700 11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.16em;text-transform:uppercase}
    h1{max-width:1050px;margin:56px 0 20px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(56px,9vw,132px);font-weight:400;letter-spacing:-.07em;line-height:.83}.hero-copy{max-width:760px;color:var(--muted);font-size:18px;line-height:1.7}
    .metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1px;margin-top:44px;overflow:hidden;border:1px solid var(--line);border-radius:var(--radius);background:var(--line)}.metric{padding:18px;background:rgba(18,24,38,.88)}.metric span{display:block;color:var(--muted);font-size:11px;letter-spacing:.11em;text-transform:uppercase}.metric strong{display:block;margin-top:8px;font:400 32px/1 Georgia,serif}
    .quick-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}.quick-links a{padding:10px 14px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:12px;text-decoration:none}.quick-links a:hover,.quick-links a:focus-visible{border-color:var(--teal);color:var(--text)}
    .controls{position:sticky;z-index:20;top:0;display:grid;grid-template-columns:minmax(220px,1fr) repeat(3,minmax(150px,.28fr)) auto;gap:10px;padding:14px max(20px,calc((100vw - 1480px)/2));border-bottom:1px solid var(--line);background:rgba(9,9,11,.94);backdrop-filter:blur(18px)}.control{display:flex;min-width:0;flex-direction:column;gap:5px}.control label{color:var(--muted);font-size:10px;letter-spacing:.12em;text-transform:uppercase}.control input,.control select{width:100%;min-height:42px;padding:8px 11px;border:1px solid var(--line);border-radius:10px;outline:none;background:var(--deep);color:var(--text)}.control input:focus-visible,.control select:focus-visible{border-color:var(--teal);box-shadow:0 0 0 3px rgba(0,188,212,.16)}.result-count{align-self:end;padding:12px;color:var(--teal);font:700 11px/1 ui-monospace,monospace;white-space:nowrap}
    main{width:min(calc(100% - 40px),1480px);margin:0 auto;padding:30px 0 100px}.notice{margin:20px 0 56px;padding:18px 20px;border:1px solid rgba(255,217,102,.34);border-radius:var(--radius);background:rgba(255,217,102,.07);color:#fff3b3;font-size:14px;line-height:1.6}.round-section{margin-top:70px}.round-heading{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.55fr);gap:50px;align-items:end;padding-bottom:20px;border-bottom:1px solid var(--line)}.round-heading span{color:var(--teal);font:700 11px/1 ui-monospace,monospace;letter-spacing:.14em}.round-heading h2{max-width:780px;margin:10px 0 0;font:400 clamp(30px,4vw,58px)/.98 Georgia,serif;letter-spacing:-.045em}.round-heading p{margin:0;color:var(--muted);font-size:14px;line-height:1.6}
    .job-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:20px}.job-card{overflow:hidden;border:1px solid var(--line);border-radius:var(--radius);background:var(--deep)}.job-card.blocked{border-color:rgba(255,107,53,.5)}.job-head{display:flex;justify-content:space-between;gap:12px;padding:12px 14px;border-bottom:1px solid var(--line);color:var(--teal);font:700 11px/1.4 ui-monospace,monospace;letter-spacing:.07em;text-transform:uppercase}.evidence-frame{display:grid;min-height:240px;place-items:center;border-bottom:1px solid var(--line);background:radial-gradient(circle,rgba(0,188,212,.1),transparent 65%),var(--void)}.evidence-frame img{display:block;width:100%;height:360px;object-fit:contain;background:var(--void)}.empty-evidence{text-align:center}.empty-evidence strong{display:block;font:400 42px/1 Georgia,serif}.empty-evidence span{display:block;margin-top:10px;color:var(--muted);font-size:12px}.job-copy{padding:24px}.job-kind{margin:0;color:var(--teal);font:700 11px/1.4 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase}.job-copy h3{margin:12px 0 16px;font:400 32px/1 Georgia,serif;letter-spacing:-.03em}.story-beat{margin:0;color:var(--muted);font-size:14px;line-height:1.7}.blocker{margin:18px 0 0;padding:12px;border-left:3px solid var(--fire);background:rgba(255,107,53,.08);color:#ffd7ca;font-size:13px;line-height:1.6}
    .truth-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:0;border-top:1px solid var(--line)}.truth-grid div{padding:13px 18px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}.truth-grid dt{color:var(--teal);font:700 10px/1.2 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase}.truth-grid dd{margin:6px 0 0;color:var(--muted);font-size:12px;line-height:1.4}
    details{border-top:1px solid var(--line)}summary{padding:15px 18px;cursor:pointer;color:var(--text);font-size:13px;font-weight:650;list-style:none}summary::-webkit-details-marker{display:none}summary:after{float:right;color:var(--teal);content:"+"}details[open] summary:after{content:"−"}summary:focus-visible{outline:2px solid var(--teal);outline-offset:-4px}.detail-body,.detail-columns{padding:4px 20px 24px;color:var(--muted);font-size:13px;line-height:1.65}.detail-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.detail-body h4,.detail-columns h4{margin:18px 0 8px;color:var(--text);font:400 20px/1.2 Georgia,serif}.detail-body p{margin:0 0 10px}.detail-body ul,.detail-columns ul{margin:0;padding-left:18px}.detail-body li,.detail-columns li{margin:7px 0}.detail-body code{display:block;overflow-wrap:anywhere;color:var(--gold);font:11px/1.6 ui-monospace,monospace}pre{overflow:auto;max-height:520px;margin:0;padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--void);color:var(--text);font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap}
    .provider-grid{display:grid;gap:12px;padding:4px 18px 22px}.provider-lane{padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--void)}.provider-head{display:flex;justify-content:space-between;gap:14px;align-items:baseline}.provider-head h4{margin:0;font:400 22px/1.2 Georgia,serif}.provider-head span{color:var(--teal);font:700 10px/1.2 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase}.provider-lane>p,.provider-lane dd{color:var(--muted);font-size:12px;line-height:1.6}.provider-lane dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;margin:14px 0;background:var(--line)}.provider-lane dl div{min-width:0;padding:10px;background:var(--deep)}.provider-lane dt,.provider-lane h5{color:var(--teal);font:700 10px/1.3 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase}.provider-lane dd{margin:5px 0 0;overflow-wrap:anywhere}.provider-lane code{color:var(--gold);font:10px/1.5 ui-monospace,monospace}.provider-lane h5{margin:18px 0 8px}.provider-lane ul{margin:0;padding-left:18px;color:var(--muted);font-size:12px;line-height:1.6}
    .hidden{display:none!important}.empty-state{display:none;margin:70px 0;text-align:center;color:var(--muted)}
    @media(max-width:900px){.metrics{grid-template-columns:repeat(3,1fr)}.controls{position:static;grid-template-columns:1fr 1fr}.control:first-child{grid-column:1/-1}.result-count{align-self:center}.round-heading,.job-grid{grid-template-columns:1fr}.round-heading{gap:20px}.evidence-frame img{height:300px}}
    @media(max-width:560px){.hero{padding-top:44px}.eyebrow{flex-direction:column}h1{font-size:clamp(50px,19vw,78px)}.metrics{grid-template-columns:repeat(2,1fr)}.controls{grid-template-columns:1fr}.control:first-child{grid-column:auto}main{width:min(calc(100% - 24px),1480px)}.truth-grid,.detail-columns,.provider-lane dl{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
    @media print{.controls,.quick-links{display:none}.job-grid{display:block}.job-card{break-inside:avoid;margin:12px 0}details>div{display:block!important}}
  </style>
</head>
<body>
  <header class="hero">
    <div class="eyebrow"><span>INTERNAL PRODUCTION INSTRUMENT · DO NOT DEPLOY</span><span>Campaign ${escapeHtml(campaign.meta.campaignId)} · v${escapeHtml(campaign.meta.version)}</span></div>
    <h1>Visual campaign workbench.</h1>
    <p class="hero-copy">Inspect all one hundred identity, character, world, workflow, and regression contracts in one truth-preserving surface. Planned is not generated. Generated is not approved. Approved is not published. ${manifestIndex.current.length} manifests are current; ${manifestIndex.lineage.length - manifestIndex.current.length} immutable predecessors remain historical evidence, never execution authority.</p>
    <div class="metrics">
      <div class="metric"><span>Jobs</span><strong>${campaign.meta.totalJobs}</strong></div>
      <div class="metric"><span>Rounds</span><strong>${campaign.rounds.length}</strong></div>
      <div class="metric"><span>Generated</span><strong>${campaign.meta.generatedCount}</strong></div>
      <div class="metric"><span>Approved</span><strong>${campaign.meta.approvedCount}</strong></div>
      <div class="metric"><span>Published</span><strong>${campaign.meta.publishedCount}</strong></div>
      <div class="metric"><span>Gated</span><strong>${campaign.meta.blockedCount}</strong></div>
    </div>
    <nav class="quick-links" aria-label="Workbench references">
      <a href="../../skills/arcanea-visual-director/SKILL.md">Visual Director skill</a>
      <a href="../arcanea-visual-campaign/round-01-prompt-pack.md">Round 01 prompt pack</a>
      <a href="../../docs/design/ARCANEA_IMAGE_PROVIDER_ROUTING_V1.md">Provider routing</a>
      <a href="../../docs/design/ARCANEA_VISUAL_IDENTITY_SYSTEM_V1.md">Visual identity system</a>
      <a href="../../skills/arcanea-visual-director/references/autonomy-contract.md">Autonomy contract</a>
      <a href="../ARCANEA_LIVING_CONSTELLATION_STATE_2026-08-24.md">Current state</a>
    </nav>
  </header>
  <section class="controls" aria-label="Campaign filters">
    <div class="control"><label for="search">Search jobs, stories, sources</label><input id="search" type="search" placeholder="Prismatic, Guardian, anatomy…"></div>
    <div class="control"><label for="round">Round</label><select id="round"><option value="all">All rounds</option>${campaign.rounds.map((round) => `<option value="${round.round}">Round ${String(round.round).padStart(2, "0")}</option>`).join("")}</select></div>
    <div class="control"><label for="state">State</label><select id="state"><option value="all">All states</option><option value="planned">Planned</option><option value="review">Review</option><option value="blocked">Blocked</option></select></div>
    <div class="control"><label for="kind">Kind</label><select id="kind"><option value="all">All kinds</option>${kinds.map((kind) => `<option value="${escapeHtml(kind)}">${escapeHtml(label(kind))}</option>`).join("")}</select></div>
    <output id="result-count" class="result-count" aria-live="polite">${jobs.length} / ${jobs.length} jobs</output>
  </section>
  <main>
    <p class="notice"><strong>Truth boundary:</strong> ${escapeHtml(campaign.meta.releaseTruth)} Internal binaries are intentionally excluded from Git and deployment. This workbench may reveal unpublished prompts and must remain inside the production evidence path.</p>
    ${roundSections}
    <p id="empty-state" class="empty-state">No jobs match the current filters.</p>
  </main>
  <script>
    const cards=[...document.querySelectorAll('[data-job-id]')];
    const sections=[...document.querySelectorAll('[data-round-section]')];
    const search=document.querySelector('#search');
    const round=document.querySelector('#round');
    const state=document.querySelector('#state');
    const kind=document.querySelector('#kind');
    const resultCount=document.querySelector('#result-count');
    const emptyState=document.querySelector('#empty-state');
    function applyFilters(){
      const query=search.value.trim().toLowerCase();let visible=0;
      for(const card of cards){const show=(!query||card.dataset.search.includes(query))&&(round.value==='all'||card.dataset.round===round.value)&&(state.value==='all'||card.dataset.state===state.value)&&(kind.value==='all'||card.dataset.kind===kind.value);card.classList.toggle('hidden',!show);if(show)visible+=1}
      for(const section of sections){section.classList.toggle('hidden',![...section.querySelectorAll('[data-job-id]')].some(card=>!card.classList.contains('hidden')))}
      resultCount.textContent=visible+' / '+cards.length+' jobs';emptyState.style.display=visible?'none':'block';
    }
    for(const control of [search,round,state,kind])control.addEventListener(control===search?'input':'change',applyFilters);
  </script>
</body>
</html>`;

mkdirSync(OUTPUT_ROOT, { recursive: true });
writeFileSync(OUTPUT_PATH, html, "utf8");
console.log(
  `Built internal Arcanea visual workbench: ${jobs.length} jobs, ${compiledPrompts.size} generic prompts, ${[...providerExecutions.values()].flat().length} provider lanes, ${relative(ROOT, OUTPUT_PATH).replaceAll("\\", "/")}.`,
);

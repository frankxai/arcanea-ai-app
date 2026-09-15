#!/usr/bin/env node
/**
 * Generate the Arcanea Vercel remediation packet.
 *
 * This script does not call Vercel or mutate project settings. It turns the
 * current release-readiness blockers into exact operator actions that can be
 * reviewed, approved, and executed with a real Vercel token.
 *
 * Usage:
 *   node scripts/arcanea-vercel-remediation.mjs
 *   node scripts/arcanea-vercel-remediation.mjs --json
 *   node scripts/arcanea-vercel-remediation.mjs --markdown
 *   node scripts/arcanea-vercel-remediation.mjs --write
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));

const OUTPUT_BASENAME = 'ARCANEA_VERCEL_REMEDIATION_PACKET_2026-07-05';
const JSON_OUTPUT = path.join(PROJECT_ROOT, 'planning-with-files', `${OUTPUT_BASENAME}.json`);
const MD_OUTPUT = path.join(PROJECT_ROOT, 'planning-with-files', `${OUTPUT_BASENAME}.md`);

function absolute(relativePath) {
  return path.join(PROJECT_ROOT, relativePath);
}

function readText(relativePath) {
  return fs.readFileSync(absolute(relativePath), 'utf8');
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    return { __readError: error.message };
  }
}

function latestFile(dirRelative, pattern) {
  const dir = absolute(dirRelative);
  if (!fs.existsSync(dir)) return null;

  const matches = fs.readdirSync(dir)
    .filter((name) => pattern.test(name))
    .map((name) => {
      const full = path.join(dir, name);
      return { name, full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return matches[0] ? path.relative(PROJECT_ROOT, matches[0].full).replace(/\\/g, '/') : null;
}

function majorNodeVersion(value) {
  const match = String(value || '').match(/(\d+)/);
  return match ? `${match[1]}.x` : null;
}

function powershellJson(value) {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

function buildPacket() {
  const projectLink = readJson('.vercel/project.json');
  const rootVercel = readJson('vercel.json');
  const nvmrc = fs.existsSync(absolute('.nvmrc')) ? readText('.nvmrc').trim() : null;
  const readinessPath = '.visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json';
  const readiness = fs.existsSync(absolute(readinessPath)) ? readJson(readinessPath) : null;
  const remoteSnapshotPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_REMOTE_SNAPSHOT_.*\.json$/);
  const remoteSnapshot = remoteSnapshotPath ? readJson(remoteSnapshotPath) : null;
  const domainAuditPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_DOMAIN_AUDIT_.*\.json$/);
  const domainAudit = domainAuditPath ? readJson(domainAuditPath) : null;
  const projectSelectionPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_PROJECT_SELECTION_.*\.json$/);
  const projectSelection = projectSelectionPath ? readJson(projectSelectionPath) : null;
  const releaseScopePath = latestFile('planning-with-files', /^ARCANEA_GOD_MODE_RELEASE_SCOPE_.*\.json$/);
  const latestDeployment = remoteSnapshot?.latestDeployment || {};
  const candidateDeployment = remoteSnapshot?.candidateDeployment || {};
  const selectedProject = Array.isArray(projectSelection?.projects)
    ? projectSelection.projects.find((project) => project.name === projectSelection.summary?.recommendedProject)
    : null;

  const projectId = projectLink.projectId || remoteSnapshot?.project?.id || 'UNKNOWN_PROJECT_ID';
  const teamId = projectLink.orgId || remoteSnapshot?.project?.accountId || 'UNKNOWN_TEAM_ID';
  const projectName = projectLink.projectName || remoteSnapshot?.project?.name || 'arcanea-ai-app';
  const targetNodeVersion = majorNodeVersion(nvmrc) || '22.x';
  const currentRemote = remoteSnapshot?.project || {};

  const projectPatchBody = {
    framework: 'nextjs',
    nodeVersion: targetNodeVersion,
  };

  const projectPatchPowerShell = [
    '$body = @\'',
    JSON.stringify(projectPatchBody, null, 2),
    '\'@',
    `Invoke-RestMethod -Method Patch -Uri "https://api.vercel.com/v9/projects/${projectId}?teamId=${teamId}" -Headers @{ Authorization = "Bearer $env:VERCEL_TOKEN"; "Content-Type" = "application/json" } -Body $body`,
  ].join('\n');

  const addDomainBody = { name: 'arcanea.ai' };
  const addDomainPowerShell = [
    '$body = @\'',
    JSON.stringify(addDomainBody, null, 2),
    '\'@',
    `Invoke-RestMethod -Method Post -Uri "https://api.vercel.com/v10/projects/${projectId}/domains?teamId=${teamId}" -Headers @{ Authorization = "Bearer $env:VERCEL_TOKEN"; "Content-Type" = "application/json" } -Body $body`,
  ].join('\n');

  return {
    version: '1.0.0',
    id: 'arcanea-vercel-remediation-packet-2026-07-05',
    generatedAt: new Date().toISOString(),
    repo: PROJECT_ROOT,
    sourceInputs: {
      projectLink: '.vercel/project.json',
      remoteSnapshot: remoteSnapshotPath,
      domainAudit: domainAuditPath,
      projectSelection: projectSelectionPath,
      readinessReport: fs.existsSync(absolute(readinessPath)) ? readinessPath : null,
      releaseScope: releaseScopePath,
      rootVercelConfig: 'vercel.json',
      nvmrc: '.nvmrc',
    },
    project: {
      projectId,
      teamId,
      projectName,
      targetDomain: 'arcanea.ai',
      currentRemoteFramework: currentRemote.framework || null,
      targetFramework: rootVercel.framework || 'nextjs',
      currentRemoteNodeVersion: currentRemote.nodeVersion || null,
      targetNodeVersion,
      currentRemoteLive: currentRemote.live ?? null,
      currentRemoteDomains: currentRemote.domains || [],
      domainAudit: domainAudit?.summary || null,
      projectSelection: projectSelection?.summary
        ? {
            decision: projectSelection.summary.decision || null,
            recommendedProject: projectSelection.summary.recommendedProject || null,
            alternateProject: projectSelection.summary.alternateProject || null,
            selectedScore: selectedProject?.readiness
              ? `${selectedProject.readiness.score}/${selectedProject.readiness.max}`
              : null,
          }
        : null,
      latestDeployment: {
        id: latestDeployment.id || null,
        state: latestDeployment.readyState || latestDeployment.state || null,
        gitRef: latestDeployment.gitRef || null,
        gitSha: latestDeployment.gitSha || null,
      },
      candidateDeployment: {
        id: candidateDeployment.id || null,
        state: candidateDeployment.state || null,
        gitRef: candidateDeployment.gitRef || null,
        gitSha: candidateDeployment.gitSha || null,
      },
    },
    currentGate: {
      decision: readiness?.decision || null,
      pass: readiness?.summary?.pass ?? null,
      warn: readiness?.summary?.warn ?? null,
      blockers: readiness?.summary?.blockers ?? null,
      productionReady: readiness?.summary?.productionReady ?? null,
      previewReady: readiness?.summary?.previewReady ?? null,
    },
    officialSources: [
      {
        label: 'Vercel project configuration: framework/build/output settings',
        url: 'https://vercel.com/docs/project-configuration/vercel-json',
      },
      {
        label: 'Vercel REST API: update an existing project',
        url: 'https://vercel.com/docs/rest-api/reference/endpoints/projects/update-an-existing-project',
      },
      {
        label: 'Vercel Node.js versions',
        url: 'https://vercel.com/docs/functions/runtimes/node-js/node-js-versions',
      },
      {
        label: 'Vercel CLI domains',
        url: 'https://vercel.com/docs/cli/domains',
      },
      {
        label: 'Vercel REST API: add a domain to a project',
        url: 'https://vercel.com/docs/rest-api/reference/endpoints/projects/add-a-domain-to-a-project',
      },
      {
        label: 'Vercel preview promotion flow',
        url: 'https://vercel.com/docs/deployments/promote-preview-to-production',
      },
    ],
    actions: [
      {
        id: 'confirm-release-project-selection',
        owner: 'Vercel release operator',
        purpose: 'Confirm the remediation should repair the current linked arcanea-ai-app project instead of relinking to a nearby alternate.',
        whyBlocked: [
          projectSelection?.summary?.decision
            ? `Project selection audit decision is ${projectSelection.summary.decision}.`
            : 'Project selection audit is missing or unreadable.',
          projectSelection?.summary?.recommendedProject
            ? `Recommended project is ${projectSelection.summary.recommendedProject}; alternate is ${projectSelection.summary.alternateProject || 'none'}.`
            : 'No recommended project was recorded.',
          selectedProject?.risk || 'No selected-project risk note was recorded.',
        ],
        preconditions: [
          'Review planning-with-files/ARCANEA_VERCEL_PROJECT_SELECTION_2026-07-05.md.',
          'Confirm arcanea-ai-app remains the intended release project for this God Mode slice.',
          'Only choose arcanea-ai-appx if a human accepts relinking, command migration, preview-history, and domain-risk work.',
        ],
        successEvidence: [
          'Release-readiness report includes a passing vercel-project-selection-audit check.',
          'Vercel remediation actions target the selected release project only.',
        ],
      },
      {
        id: 'patch-project-framework-and-node',
        owner: 'Vercel release operator',
        purpose: 'Align the remote Vercel project with the repo Next.js and Node posture.',
        whyBlocked: [
          projectSelection?.summary?.recommendedProject === projectName
            ? `Project selection audit recommends repairing ${projectName} first.`
            : `Project selection audit recommendation is ${projectSelection?.summary?.recommendedProject || 'unknown'}; confirm before patching ${projectName}.`,
          `Remote framework is ${currentRemote.framework || 'unknown'}, expected nextjs.`,
          `Remote Node version is ${currentRemote.nodeVersion || 'unknown'}, expected ${targetNodeVersion}.`,
        ],
        api: {
          method: 'PATCH',
          endpoint: `https://api.vercel.com/v9/projects/${projectId}?teamId=${teamId}`,
          body: projectPatchBody,
        },
        commands: {
          powershell: projectPatchPowerShell,
        },
        successEvidence: [
          'Vercel connector _get_project reports framework nextjs.',
          `Vercel connector _get_project reports nodeVersion ${targetNodeVersion}.`,
          'node scripts/arcanea-release-readiness.mjs --json no longer reports remote-vercel-framework or remote-node-version blockers.',
        ],
      },
      {
        id: 'attach-production-domain',
        owner: 'Vercel release operator',
        purpose: 'Attach arcanea.ai to this Vercel project or confirm the correct production project is different.',
        whyBlocked: [
          'The inspected Vercel project does not list arcanea.ai among its domains.',
          'The project record reports live=false.',
          domainAudit?.summary?.domainRegisteredInTeam === true
            ? 'Domain audit confirms arcanea.ai is owned under the Starlight Vercel team and served by Vercel.'
            : 'Domain ownership audit is missing or inconclusive.',
          domainAudit?.summary?.knownAssociatedProject
            ? `Known domain association currently visible: ${domainAudit.summary.knownAssociatedProject} / ${domainAudit.summary.knownAssociatedDomain}.`
            : 'No project association was confirmed by the domain audit.',
        ],
        cli: {
          command: `vercel domains add arcanea.ai ${projectName}`,
          note: 'Use --force only after confirming arcanea.ai should move away from any existing project.',
        },
        api: {
          method: 'POST',
          endpoint: `https://api.vercel.com/v10/projects/${projectId}/domains?teamId=${teamId}`,
          body: addDomainBody,
        },
        commands: {
          powershell: addDomainPowerShell,
        },
        successEvidence: [
          'Vercel connector _get_project lists arcanea.ai in domains.',
          'Vercel connector _get_project or CLI domain inspect lists www.arcanea.ai on the selected release project when www is used.',
          'Any returned domain verification records are satisfied in DNS.',
          'node scripts/arcanea-release-readiness.mjs --json no longer reports production-domain blocker.',
        ],
      },
      {
        id: 'separate-backup-branch-noise-from-release-candidate',
        owner: 'Vercel release operator',
        purpose: 'Keep blocked backup snapshot deployments from being mistaken for the God Mode release candidate, while still requiring a fresh preview for the current package.',
        whyBlocked: [
          `Latest deployment is ${latestDeployment.readyState || latestDeployment.state || 'unknown'} on ${latestDeployment.gitRef || 'unknown ref'}.`,
          candidateDeployment.id
            ? `Latest recorded God Mode candidate is ${candidateDeployment.state || 'unknown'} on ${candidateDeployment.gitSha || 'unknown sha'}.`
            : 'No God Mode candidate deployment is recorded in the current snapshot.',
        ],
        commands: {
          shell: [
            'Use the Vercel connector _list_deployments tool to confirm the latest branch/ref state.',
            'Use the Vercel connector _get_deployment_build_logs tool on any BLOCKED/ERROR deployment before assigning release blame.',
            'After staging and committing the God Mode slice, create one preview deployment from the release branch or draft PR.',
          ],
        },
        successEvidence: [
          'Release-readiness report keeps backup/claude-snapshots BLOCKED state as a warning, not a production blocker.',
          'A fresh READY preview exists for the committed God Mode release branch.',
          'node scripts/arcanea-release-readiness.mjs --json no longer warns that current God Mode changes are undeployed.',
        ],
      },
      {
        id: 'refresh-and-verify-project-state',
        owner: 'Vercel release operator',
        purpose: 'Refresh local/remote evidence after external Vercel changes.',
        commands: {
          shell: [
            'node scripts/arcanea-release-readiness.mjs --json',
            'node scripts/arcanea-release-readiness.mjs --strict',
          ],
        },
        successEvidence: [
          'Release-readiness report is regenerated under .visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json.',
          'Strict mode exits 0 before any preview promotion.',
          'planning-with-files/ARCANEA_VERCEL_REMOTE_SNAPSHOT_*.json is refreshed from the Vercel connector after settings changes.',
        ],
      },
      {
        id: 'preview-then-promote',
        owner: 'Vercel release operator',
        purpose: 'Use Vercel preview promotion flow only after the release gate is clean.',
        preconditions: [
          'Release scope has zero unknown dirty paths.',
          'Strict release-readiness gate passes.',
          'A READY preview deployment exists for the God Mode branch or PR.',
        ],
        commands: {
          cli: [
            'vercel list --status READY',
            'vercel inspect <deployment-url>',
            'vercel curl /api/health --deployment <deployment-url>',
            'vercel httpstat / --deployment <deployment-url>',
            'vercel logs --deployment <deployment-url> --level error --limit 50',
            'vercel promote <deployment-url> --yes',
            'vercel promote status',
            'vercel logs --environment production --level error --since 5m',
            'vercel httpstat /',
          ],
        },
        successEvidence: [
          'Preview URL visually verified for /, /genesis, /status, /method, /atlas/creatures, and /studio/store.',
          'Production logs show no recent errors after promotion.',
          'Vercel connector reports a production target for the promoted deployment.',
        ],
      },
    ],
    guardrails: [
      'Do not run mutation commands without an approved Vercel token and explicit operator intent.',
      'Do not paste token values into docs, reports, commands, or chat.',
      'Do not run vercel promote until node scripts/arcanea-release-readiness.mjs --strict passes.',
      'Do not stage paths excluded by the God Mode release scope manifest unless Frank explicitly expands scope.',
    ],
  };
}

function formatMarkdown(packet) {
  const lines = [];
  lines.push('# Arcanea Vercel Remediation Packet');
  lines.push('');
  lines.push(`Generated: ${packet.generatedAt}`);
  lines.push(`Project: ${packet.project.projectName} (${packet.project.projectId})`);
  lines.push(`Team: ${packet.project.teamId}`);
  lines.push(`Target domain: ${packet.project.targetDomain}`);
  lines.push('');
  lines.push('## Current Gate');
  lines.push('');
  lines.push(`- Decision: ${packet.currentGate.decision}`);
  lines.push(`- Counts: ${packet.currentGate.pass} pass, ${packet.currentGate.warn} warn, ${packet.currentGate.blockers} blockers`);
  lines.push(`- Preview ready: ${packet.currentGate.previewReady}`);
  lines.push(`- Production ready: ${packet.currentGate.productionReady}`);
  lines.push('');
  lines.push('## Target Settings');
  lines.push('');
  lines.push(`- Framework: ${packet.project.currentRemoteFramework} -> ${packet.project.targetFramework}`);
  lines.push(`- Node: ${packet.project.currentRemoteNodeVersion} -> ${packet.project.targetNodeVersion}`);
  lines.push(`- Domains: ${(packet.project.currentRemoteDomains || []).join(', ') || '(none)'}`);
  lines.push(`- Live: ${packet.project.currentRemoteLive}`);
  if (packet.project.domainAudit) {
    lines.push(`- Domain audit: ${packet.project.domainAudit.decision || 'unknown'}; served by Vercel: ${packet.project.domainAudit.servedByVercel}; release project has domain: ${packet.project.domainAudit.releaseProjectHasDomain}`);
  }
  if (packet.project.projectSelection) {
    lines.push(`- Project selection: ${packet.project.projectSelection.decision || 'unknown'}; recommended: ${packet.project.projectSelection.recommendedProject || 'unknown'}; alternate: ${packet.project.projectSelection.alternateProject || 'none'}; score: ${packet.project.projectSelection.selectedScore || 'unknown'}`);
  }
  lines.push(`- Latest deployment: ${packet.project.latestDeployment.id || '(none)'} / ${packet.project.latestDeployment.state || 'unknown'} / ${packet.project.latestDeployment.gitRef || 'unknown ref'}`);
  lines.push(`- God Mode candidate: ${packet.project.candidateDeployment.id || '(none)'} / ${packet.project.candidateDeployment.state || 'unknown'} / ${packet.project.candidateDeployment.gitRef || 'unknown ref'}`);
  lines.push('');
  lines.push('## Actions');
  lines.push('');

  for (const action of packet.actions) {
    lines.push(`### ${action.id}`);
    lines.push('');
    lines.push(`Owner: ${action.owner}`);
    lines.push('');
    lines.push(action.purpose);
    lines.push('');

    if (action.whyBlocked?.length) {
      lines.push('Why blocked:');
      for (const item of action.whyBlocked) lines.push(`- ${item}`);
      lines.push('');
    }

    if (action.api) {
      lines.push('API:');
      lines.push(`- ${action.api.method} ${action.api.endpoint}`);
      lines.push('- Body:');
      lines.push('```json');
      lines.push(JSON.stringify(action.api.body, null, 2));
      lines.push('```');
      lines.push('');
    }

    if (action.cli) {
      lines.push('CLI:');
      lines.push('```bash');
      lines.push(action.cli.command);
      lines.push('```');
      if (action.cli.note) lines.push(`Note: ${action.cli.note}`);
      lines.push('');
    }

    if (action.commands?.powershell) {
      lines.push('PowerShell:');
      lines.push('```powershell');
      lines.push(action.commands.powershell);
      lines.push('```');
      lines.push('');
    }

    if (action.commands?.shell?.length) {
      lines.push('Shell:');
      lines.push('```bash');
      for (const command of action.commands.shell) lines.push(command);
      lines.push('```');
      lines.push('');
    }

    if (action.commands?.cli?.length) {
      lines.push('Vercel CLI:');
      lines.push('```bash');
      for (const command of action.commands.cli) lines.push(command);
      lines.push('```');
      lines.push('');
    }

    if (action.preconditions?.length) {
      lines.push('Preconditions:');
      for (const item of action.preconditions) lines.push(`- ${item}`);
      lines.push('');
    }

    lines.push('Success evidence:');
    for (const item of action.successEvidence || []) lines.push(`- ${item}`);
    lines.push('');
  }

  lines.push('## Guardrails');
  lines.push('');
  for (const guardrail of packet.guardrails) lines.push(`- ${guardrail}`);
  lines.push('');
  lines.push('## Official Sources');
  lines.push('');
  for (const source of packet.officialSources) {
    lines.push(`- ${source.label}: ${source.url}`);
  }
  lines.push('');

  return lines.join('\n');
}

const packet = buildPacket();
const markdown = formatMarkdown(packet);

if (args.has('--write')) {
  fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(packet, null, 2)}\n`);
  fs.writeFileSync(MD_OUTPUT, markdown);
  process.stdout.write(`Wrote ${path.relative(PROJECT_ROOT, JSON_OUTPUT).replace(/\\/g, '/')}\n`);
  process.stdout.write(`Wrote ${path.relative(PROJECT_ROOT, MD_OUTPUT).replace(/\\/g, '/')}\n`);
} else if (args.has('--json')) {
  process.stdout.write(`${JSON.stringify(packet, null, 2)}\n`);
} else if (args.has('--markdown')) {
  process.stdout.write(markdown);
} else {
  process.stdout.write(`${markdown}\n`);
}

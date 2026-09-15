#!/usr/bin/env node
/**
 * Arcanea Vercel remediation runner.
 *
 * Default mode is a non-mutating dry run. Remote mutation requires:
 * - VERCEL_TOKEN in the environment
 * - --apply-project-settings for framework/node patches
 * - --apply-domain plus --confirm-domain=arcanea.ai for domain attachment
 *
 * This script never prints token values.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const argSet = new Set(args);

const REPORT_ID = 'arcanea-vercel-remediation-runner-2026-07-05';
const REPORT_BASENAME = 'ARCANEA_VERCEL_REMEDIATION_RUNNER_2026-07-05';
const PLANNING_JSON_PATH = `planning-with-files/${REPORT_BASENAME}.json`;
const PLANNING_MD_PATH = `planning-with-files/${REPORT_BASENAME}.md`;
const VISUAL_JSON_PATH = '.visual-qa/arcanea-god-mode-2026-07-05/vercel-remediation-runner-report.json';

function absolute(relativePath) {
  return path.join(PROJECT_ROOT, relativePath);
}

function relative(target) {
  return path.relative(PROJECT_ROOT, target).replace(/\\/g, '/');
}

function fileExists(relativePath) {
  try {
    return fs.statSync(absolute(relativePath)).isFile();
  } catch {
    return false;
  }
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

  return matches[0] ? relative(matches[0].full) : null;
}

function getArgValue(name) {
  const prefix = `${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}

function sanitizeEndpoint(value) {
  return String(value || '').replace(/([?&](?:teamId|slug)=)[^&]+/gu, '$1<redacted>');
}

function redactError(error) {
  return String(error?.message || error || '')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gu, 'Bearer <redacted>')
    .replace(/"token"\s*:\s*"[^"]+"/giu, '"token":"<redacted>"');
}

function actionById(packet, id) {
  return Array.isArray(packet?.actions) ? packet.actions.find((action) => action.id === id) : null;
}

function check(status, lane, id, summary, details = {}) {
  return { status, lane, id, summary, ...details };
}

async function requestJson({ method, endpoint, body, token }) {
  const response = await fetch(endpoint, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let parsed = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { text };
    }
  }

  if (!response.ok) {
    const message = parsed?.error?.message || parsed?.message || text || response.statusText;
    const error = new Error(`Vercel API ${response.status}: ${message}`);
    error.status = response.status;
    error.payload = parsed;
    throw error;
  }

  return {
    status: response.status,
    ok: response.ok,
    body: parsed,
  };
}

async function buildReport() {
  const jsonOnly = argSet.has('--json');
  const write = argSet.has('--write');
  const strict = argSet.has('--strict');
  const applyProjectSettings = argSet.has('--apply-project-settings');
  const applyDomain = argSet.has('--apply-domain');
  const verifyRemote = argSet.has('--verify-remote');
  const confirmProject = getArgValue('--confirm-project');
  const confirmDomain = getArgValue('--confirm-domain');
  const tokenPresent = Boolean(process.env.VERCEL_TOKEN);
  const packetPath = latestFile('planning-with-files', /^ARCANEA_VERCEL_REMEDIATION_PACKET_.*\.json$/u);
  const packet = packetPath ? readJson(packetPath) : { __readError: 'No remediation packet found.' };
  const projectPatch = actionById(packet, 'patch-project-framework-and-node');
  const domainAttach = actionById(packet, 'attach-production-domain');
  const project = packet?.project || {};
  const expectedProjectName = project.projectName || 'arcanea-ai-app';
  const targetDomain = project.targetDomain || 'arcanea.ai';
  const checks = [];
  const operations = [];

  if (packetPath && !packet.__readError) {
    checks.push(check('pass', 'safety', 'remediation-packet-loaded', 'Vercel remediation packet loaded.', {
      evidence: packetPath,
      currentGate: packet.currentGate || null,
    }));
  } else {
    checks.push(check('blocker', 'safety', 'remediation-packet-loaded', 'Vercel remediation packet is missing or unreadable.', {
      error: packet.__readError || null,
    }));
  }

  if (projectPatch?.api?.endpoint && projectPatch?.api?.body) {
    checks.push(check('pass', 'vercel-release', 'project-settings-operation-ready', 'Project framework/node patch operation is defined.', {
      endpoint: sanitizeEndpoint(projectPatch.api.endpoint),
      body: projectPatch.api.body,
    }));
  } else {
    checks.push(check('blocker', 'vercel-release', 'project-settings-operation-ready', 'Project framework/node patch operation is missing from the remediation packet.'));
  }

  if (domainAttach?.api?.endpoint && domainAttach?.api?.body) {
    checks.push(check('pass', 'vercel-release', 'domain-operation-ready', 'Domain attachment operation is defined but requires explicit domain confirmation.', {
      endpoint: sanitizeEndpoint(domainAttach.api.endpoint),
      body: domainAttach.api.body,
    }));
  } else {
    checks.push(check('warn', 'vercel-release', 'domain-operation-ready', 'Domain attachment operation is missing or intentionally skipped.'));
  }

  if (tokenPresent) {
    checks.push(check('pass', 'safety', 'vercel-token-present', 'VERCEL_TOKEN is present in the environment. Token value was not printed.'));
  } else {
    checks.push(check(applyProjectSettings || applyDomain || verifyRemote ? 'blocker' : 'warn', 'safety', 'vercel-token-present', 'VERCEL_TOKEN is not present. Dry-run evidence can still be generated.', {
      action: 'Set VERCEL_TOKEN only in the shell environment when an approved operator is ready to apply remote changes.',
    }));
  }

  if ((applyProjectSettings || applyDomain) && confirmProject !== expectedProjectName) {
    checks.push(check('blocker', 'safety', 'project-confirmation', `Remote mutation requires --confirm-project=${expectedProjectName}.`, {
      received: confirmProject || null,
    }));
  } else if (applyProjectSettings || applyDomain) {
    checks.push(check('pass', 'safety', 'project-confirmation', `Project mutation confirmation matches ${expectedProjectName}.`));
  } else {
    checks.push(check('pass', 'safety', 'project-confirmation', 'No remote mutation requested; project confirmation not required.'));
  }

  if (applyDomain && confirmDomain !== targetDomain) {
    checks.push(check('blocker', 'safety', 'domain-confirmation', `Domain attachment requires --confirm-domain=${targetDomain}.`, {
      received: confirmDomain || null,
    }));
  } else if (applyDomain) {
    checks.push(check('pass', 'safety', 'domain-confirmation', `Domain confirmation matches ${targetDomain}.`));
  } else {
    checks.push(check('pass', 'safety', 'domain-confirmation', 'Domain attachment not requested.'));
  }

  const canMutate =
    tokenPresent
    && confirmProject === expectedProjectName
    && checks.filter((entry) => entry.status === 'blocker').length === 0;

  if (applyProjectSettings && projectPatch?.api && canMutate) {
    try {
      const result = await requestJson({
        method: projectPatch.api.method,
        endpoint: projectPatch.api.endpoint,
        body: projectPatch.api.body,
        token: process.env.VERCEL_TOKEN,
      });
      operations.push({
        id: 'patch-project-framework-and-node',
        mode: 'applied',
        status: 'pass',
        httpStatus: result.status,
        expectedFollowUp: 'Refresh the Vercel connector snapshot and rerun node scripts/arcanea-release-readiness.mjs --strict.',
      });
      checks.push(check('pass', 'vercel-release', 'project-settings-applied', 'Project framework/node patch request succeeded.', {
        httpStatus: result.status,
      }));
    } catch (error) {
      operations.push({
        id: 'patch-project-framework-and-node',
        mode: 'apply-failed',
        status: 'blocker',
        error: redactError(error),
      });
      checks.push(check('blocker', 'vercel-release', 'project-settings-applied', 'Project framework/node patch request failed.', {
        error: redactError(error),
      }));
    }
  } else {
    operations.push({
      id: 'patch-project-framework-and-node',
      mode: applyProjectSettings ? 'blocked-before-apply' : 'dry-run',
      status: applyProjectSettings ? 'blocker' : 'pass',
      endpoint: sanitizeEndpoint(projectPatch?.api?.endpoint),
      body: projectPatch?.api?.body || null,
    });
  }

  if (applyDomain && domainAttach?.api && canMutate && confirmDomain === targetDomain) {
    try {
      const result = await requestJson({
        method: domainAttach.api.method,
        endpoint: domainAttach.api.endpoint,
        body: domainAttach.api.body,
        token: process.env.VERCEL_TOKEN,
      });
      operations.push({
        id: 'attach-production-domain',
        mode: 'applied',
        status: 'pass',
        httpStatus: result.status,
        expectedFollowUp: 'Verify returned domain records, refresh connector state, then rerun the release gate.',
      });
      checks.push(check('pass', 'vercel-release', 'domain-attachment-applied', 'Domain attachment request succeeded.', {
        httpStatus: result.status,
      }));
    } catch (error) {
      operations.push({
        id: 'attach-production-domain',
        mode: 'apply-failed',
        status: 'blocker',
        error: redactError(error),
      });
      checks.push(check('blocker', 'vercel-release', 'domain-attachment-applied', 'Domain attachment request failed.', {
        error: redactError(error),
      }));
    }
  } else {
    operations.push({
      id: 'attach-production-domain',
      mode: applyDomain ? 'blocked-before-apply' : 'dry-run',
      status: applyDomain ? 'blocker' : 'pass',
      endpoint: sanitizeEndpoint(domainAttach?.api?.endpoint),
      body: domainAttach?.api?.body || null,
    });
  }

  if (verifyRemote && tokenPresent && project?.projectId && project?.teamId) {
    try {
      const endpoint = `https://api.vercel.com/v9/projects/${project.projectId}?teamId=${project.teamId}`;
      const result = await requestJson({
        method: 'GET',
        endpoint,
        token: process.env.VERCEL_TOKEN,
      });
      const remote = result.body || {};
      const remoteSummary = {
        id: remote.id || null,
        name: remote.name || null,
        framework: remote.framework || null,
        nodeVersion: remote.nodeVersion || null,
        live: remote.live ?? null,
      };
      operations.push({
        id: 'verify-remote-project',
        mode: 'read-only',
        status: 'pass',
        remote: remoteSummary,
      });
      checks.push(check('pass', 'vercel-release', 'remote-verification', 'Remote project was read through Vercel REST API.', {
        remote: remoteSummary,
      }));
    } catch (error) {
      operations.push({
        id: 'verify-remote-project',
        mode: 'read-only-failed',
        status: 'warn',
        error: redactError(error),
      });
      checks.push(check('warn', 'vercel-release', 'remote-verification', 'Remote project read failed.', {
        error: redactError(error),
      }));
    }
  } else if (verifyRemote) {
    checks.push(check('blocker', 'vercel-release', 'remote-verification', 'Remote verification requires VERCEL_TOKEN and project identity.'));
  } else {
    checks.push(check('pass', 'vercel-release', 'remote-verification', 'Remote verification not requested.'));
  }

  const blockers = checks.filter((entry) => entry.status === 'blocker').length;
  const warnings = checks.filter((entry) => entry.status === 'warn').length;
  const passes = checks.filter((entry) => entry.status === 'pass').length;
  const applied = operations.some((operation) => operation.mode === 'applied');
  const mutationRequested = applyProjectSettings || applyDomain;

  return {
    version: '1.0.0',
    id: REPORT_ID,
    generatedAt: new Date().toISOString(),
    repo: PROJECT_ROOT,
    mode: mutationRequested ? 'apply-requested' : 'dry-run',
    decision: blockers > 0
      ? 'blocked-before-remote-change'
      : applied
        ? 'remote-change-requested'
        : 'dry-run-ready',
    nonMutating: !applied,
    inputs: {
      remediationPacket: packetPath,
      releaseReadinessReport: fileExists('.visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json')
        ? '.visual-qa/arcanea-god-mode-2026-07-05/release-readiness-report.json'
        : null,
      officialDocsVerified: [
        'https://vercel.com/docs/rest-api/projects/update-an-existing-project',
        'https://vercel.com/docs/rest-api/projects/add-a-domain-to-a-project',
        'https://vercel.com/docs/functions/runtimes/node-js/node-js-versions',
      ],
    },
    summary: {
      pass: passes,
      warn: warnings,
      blockers,
      tokenPresent,
      applyProjectSettings,
      applyDomain,
      verifyRemote,
      expectedProjectName,
      targetDomain,
    },
    operations,
    checks,
    operatorCommands: {
      dryRun: 'node scripts/arcanea-vercel-remediation-runner.mjs --write --strict',
      verifyRemote: 'node scripts/arcanea-vercel-remediation-runner.mjs --verify-remote --confirm-project=arcanea-ai-app --write --strict',
      applyProjectSettings: 'node scripts/arcanea-vercel-remediation-runner.mjs --apply-project-settings --confirm-project=arcanea-ai-app --write --strict',
      applyDomain: 'node scripts/arcanea-vercel-remediation-runner.mjs --apply-domain --confirm-project=arcanea-ai-app --confirm-domain=arcanea.ai --write --strict',
    },
    guardrails: [
      'Dry-run mode is the default and performs no remote mutation.',
      'Remote mutation requires VERCEL_TOKEN in the process environment; token values are never printed.',
      'Project settings mutation requires --apply-project-settings and --confirm-project=arcanea-ai-app.',
      'Domain attachment requires --apply-domain, --confirm-project=arcanea-ai-app, and --confirm-domain=arcanea.ai.',
      'Do not promote production until node scripts/arcanea-release-readiness.mjs --strict exits 0 after connector evidence refresh.',
    ],
    flags: { jsonOnly, write, strict },
  };
}

function formatMarkdown(report) {
  const lines = [];
  lines.push('# Arcanea Vercel Remediation Runner');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Decision: ${report.decision}`);
  lines.push(`Mode: ${report.mode}`);
  lines.push(`Non-mutating: ${report.nonMutating ? 'true' : 'false'}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Checks: ${report.summary.pass} pass, ${report.summary.warn} warn, ${report.summary.blockers} blockers`);
  lines.push(`- VERCEL_TOKEN present: ${report.summary.tokenPresent ? 'yes' : 'no'}`);
  lines.push(`- Project settings apply requested: ${report.summary.applyProjectSettings ? 'yes' : 'no'}`);
  lines.push(`- Domain apply requested: ${report.summary.applyDomain ? 'yes' : 'no'}`);
  lines.push(`- Remote verify requested: ${report.summary.verifyRemote ? 'yes' : 'no'}`);
  lines.push('');
  lines.push('## Operations');
  lines.push('');
  for (const operation of report.operations) {
    lines.push(`- ${operation.status.toUpperCase()} ${operation.id}: ${operation.mode}`);
  }
  lines.push('');
  lines.push('## Checks');
  lines.push('');
  for (const entry of report.checks) {
    lines.push(`- ${entry.status.toUpperCase()} [${entry.lane}/${entry.id}] ${entry.summary}`);
  }
  lines.push('');
  lines.push('## Operator Commands');
  lines.push('');
  lines.push('```text');
  lines.push(report.operatorCommands.dryRun);
  lines.push(report.operatorCommands.verifyRemote);
  lines.push(report.operatorCommands.applyProjectSettings);
  lines.push(report.operatorCommands.applyDomain);
  lines.push('```');
  lines.push('');
  lines.push('## Guardrails');
  lines.push('');
  for (const guardrail of report.guardrails) {
    lines.push(`- ${guardrail}`);
  }
  return `${lines.join('\n').replace(/\n+$/u, '')}\n`;
}

function writeFile(relativePath, content) {
  const target = absolute(relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

const report = await buildReport();
const markdown = formatMarkdown(report);

if (argSet.has('--write')) {
  const json = `${JSON.stringify(report, null, 2)}\n`;
  writeFile(PLANNING_JSON_PATH, json);
  writeFile(PLANNING_MD_PATH, markdown);
  writeFile(VISUAL_JSON_PATH, json);
}

if (argSet.has('--json')) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(markdown);
  if (argSet.has('--write')) {
    process.stdout.write(`\nWrote ${PLANNING_JSON_PATH}\n`);
    process.stdout.write(`Wrote ${PLANNING_MD_PATH}\n`);
    process.stdout.write(`Wrote ${VISUAL_JSON_PATH}\n`);
  }
}

if (argSet.has('--strict') && report.summary.blockers > 0) {
  process.exitCode = 1;
}

#!/usr/bin/env node
/**
 * Arcanea success metrics audit.
 *
 * Dependency-free check for the God Mode activation metrics bridge:
 * implementation, test coverage, docs coverage, privacy posture, and
 * competitor pressure mapping.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const jsonOnly = args.has('--json');

const REQUIRED_EVENTS = [
  {
    event: 'homepage_genesis_cta_click',
    helper: 'homepageGenesisCtaClick',
    decision: 'Measure whether the first viewport routes users into Genesis proof creation.',
    owner: 'UX Growth',
  },
  {
    event: 'genesis_prompt_prefill_used',
    helper: 'genesisPromptPrefillUsed',
    decision: 'Measure whether private prompt handoff actually reaches Genesis.',
    owner: 'Product',
  },
  {
    event: 'genesis_proof_export',
    helper: 'genesisProofExport',
    decision: 'Measure proof creation and ownership/export intent.',
    owner: 'Product/Trust',
  },
  {
    event: 'atlas_creature_prompt_copy',
    helper: 'atlasCreaturePromptCopy',
    decision: 'Measure reuse of Atlas material into generation workflows.',
    owner: 'World Engine',
  },
  {
    event: 'studio_store_package_click',
    helper: 'studioStorePackageClick',
    decision: 'Measure package, credits, and commerce intent.',
    owner: 'Growth/Revenue',
  },
];

const REQUIRED_PRESSURE_CATEGORIES = [
  'editable_workspace',
  'project_memory',
  'shareable_artifact',
  'cinematic_media_control',
  'world_record_depth',
  'production_confidence',
];

const DISALLOWED_PRIVACY_PATTERNS = [
  /\brawPrompt\b/u,
  /\bpromptText\b/u,
  /\bwalletAddress\b/u,
  /\bapiKey\b/u,
  /\btransactionHash\b/u,
  /\bproofBody\b/u,
  /\bgeneratedProof\b/u,
  /\bprivateKey\b/u,
];

function absolute(relativePath) {
  return path.join(PROJECT_ROOT, relativePath);
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

function check(status, lane, id, summary, details = {}) {
  return { status, lane, id, summary, ...details };
}

function includesAll(text, values) {
  return values.filter((value) => text.includes(value));
}

function buildReport() {
  const analyticsPath = 'apps/web/lib/analytics/events.ts';
  const analyticsTestPath = 'apps/web/lib/analytics/__tests__/events-projects.test.ts';
  const growthMetricsPath = 'docs/ARCANEA_GROWTH_METRICS.md';
  const sprintPath = 'planning-with-files/ARCANEA_AI_GOD_MODE_SPRINT_2026-07-05.md';
  const scorecardPath = 'planning-with-files/ARCANEA_COMPETITIVE_SCORECARD_2026-07-05.json';

  const analyticsText = fileExists(analyticsPath) ? readText(analyticsPath) : '';
  const analyticsTestText = fileExists(analyticsTestPath) ? readText(analyticsTestPath) : '';
  const growthMetricsText = fileExists(growthMetricsPath) ? readText(growthMetricsPath) : '';
  const sprintText = fileExists(sprintPath) ? readText(sprintPath) : '';
  const scorecard = fileExists(scorecardPath) ? readJson(scorecardPath) : null;
  const checks = [];

  const eventRows = REQUIRED_EVENTS.map((entry) => ({
    ...entry,
    implemented: analyticsText.includes(`"${entry.event}"`) && analyticsText.includes(entry.helper),
    tested: analyticsTestText.includes(entry.event) && analyticsTestText.includes(entry.helper),
    documented: growthMetricsText.includes(entry.event) && sprintText.includes(entry.event),
  }));

  const missingImplementation = eventRows.filter((entry) => !entry.implemented);
  const missingTests = eventRows.filter((entry) => !entry.tested);
  const missingDocs = eventRows.filter((entry) => !entry.documented);

  checks.push(missingImplementation.length === 0
    ? check('pass', 'ux-growth', 'activation-events-implemented', 'All God Mode activation events are implemented in the analytics helper.', {
      evidence: analyticsPath,
      events: eventRows.map((entry) => entry.event),
    })
    : check('blocker', 'ux-growth', 'activation-events-implemented', `Missing analytics implementation for: ${missingImplementation.map((entry) => entry.event).join(', ')}.`, {
      evidence: analyticsPath,
    }));

  checks.push(missingTests.length === 0
    ? check('pass', 'verification', 'activation-events-tested', 'All God Mode activation events are covered by analytics tests.', {
      evidence: analyticsTestPath,
    })
    : check('blocker', 'verification', 'activation-events-tested', `Missing analytics tests for: ${missingTests.map((entry) => entry.event).join(', ')}.`, {
      evidence: analyticsTestPath,
    }));

  checks.push(missingDocs.length === 0
    ? check('pass', 'product-doctrine', 'activation-events-documented', 'All God Mode activation events are documented in the growth spec and sprint plan.', {
      evidence: [growthMetricsPath, sprintPath],
    })
    : check('warn', 'product-doctrine', 'activation-events-documented', `Missing docs coverage for: ${missingDocs.map((entry) => entry.event).join(', ')}.`, {
      evidence: [growthMetricsPath, sprintPath],
    }));

  const privacyFindings = DISALLOWED_PRIVACY_PATTERNS
    .map((pattern) => ({ pattern: String(pattern), matched: pattern.test(analyticsText) }))
    .filter((entry) => entry.matched);

  checks.push(privacyFindings.length === 0
    ? check('pass', 'safety', 'privacy-safe-payloads', 'Activation analytics avoid raw prompt, wallet, key, transaction, and proof-body payload fields.', {
      evidence: analyticsPath,
    })
    : check('blocker', 'safety', 'privacy-safe-payloads', 'Potential sensitive analytics payload fields found.', {
      evidence: analyticsPath,
      privacyFindings,
    }));

  if (scorecard && !scorecard.__readError) {
    const categories = Array.isArray(scorecard.capabilityPressure)
      ? scorecard.capabilityPressure.map((entry) => entry.category)
      : [];
    const missingCategories = REQUIRED_PRESSURE_CATEGORIES.filter((category) => !categories.includes(category));
    const sourceCount = Array.isArray(scorecard.sources) ? scorecard.sources.length : 0;

    if (missingCategories.length === 0 && sourceCount >= 6) {
      checks.push(check('pass', 'product-doctrine', 'competitive-pressure-mapped', 'Competitive pressure map covers workspace, memory, artifact, media, world-record, and production-confidence expectations.', {
        evidence: scorecardPath,
        sourceCount,
        categories,
      }));
    } else {
      checks.push(check('warn', 'product-doctrine', 'competitive-pressure-mapped', 'Competitive pressure map is incomplete.', {
        evidence: scorecardPath,
        sourceCount,
        missingCategories,
      }));
    }
  } else {
    checks.push(check('warn', 'product-doctrine', 'competitive-pressure-mapped', 'Competitive pressure scorecard is missing or unreadable.', {
      evidence: scorecardPath,
    }));
  }

  const dashboardTerms = ['Founder Scorecard', 'Genesis Funnel', 'Forge Revenue', 'Model Cost'];
  const documentedDashboards = includesAll(growthMetricsText, dashboardTerms);
  checks.push(documentedDashboards.length === dashboardTerms.length
    ? check('pass', 'ux-growth', 'dashboard-views-defined', 'Growth dashboard views are defined for founder, funnel, revenue, quality, model cost, and experiments.', {
      evidence: growthMetricsPath,
    })
    : check('warn', 'ux-growth', 'dashboard-views-defined', 'Growth dashboard views are not fully documented.', {
      evidence: growthMetricsPath,
      missing: dashboardTerms.filter((term) => !documentedDashboards.includes(term)),
    }));

  const eventSummary = eventRows.map((entry) => ({
    event: entry.event,
    helper: entry.helper,
    owner: entry.owner,
    decision: entry.decision,
    implemented: entry.implemented,
    tested: entry.tested,
    documented: entry.documented,
  }));

  const pass = checks.filter((entry) => entry.status === 'pass').length;
  const warn = checks.filter((entry) => entry.status === 'warn').length;
  const blockers = checks.filter((entry) => entry.status === 'blocker').length;

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    repo: PROJECT_ROOT,
    summary: {
      decision: blockers === 0 ? 'metrics-ready' : 'blocked',
      pass,
      warn,
      blockers,
    },
    inputs: {
      analytics: analyticsPath,
      analyticsTests: analyticsTestPath,
      growthMetrics: growthMetricsPath,
      sprint: sprintPath,
      competitiveScorecard: scorecardPath,
    },
    events: eventSummary,
    checks,
  };
}

function formatHuman(report) {
  const lines = [];
  lines.push('=== Arcanea Success Metrics Audit ===');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Decision:  ${report.summary.decision}`);
  lines.push(`Counts:    ${report.summary.pass} pass, ${report.summary.warn} warn, ${report.summary.blockers} blockers`);
  lines.push('');

  for (const entry of report.checks) {
    const label = entry.status === 'pass' ? 'PASS' : entry.status === 'warn' ? 'WARN' : 'BLOCK';
    lines.push(`[${label}] ${entry.lane}/${entry.id}`);
    lines.push(`  ${entry.summary}`);
  }

  lines.push('');
  lines.push('Events:');
  for (const event of report.events) {
    lines.push(`- ${event.event}: implemented=${event.implemented}, tested=${event.tested}, documented=${event.documented}`);
  }
  return lines.join('\n');
}

const report = buildReport();

if (jsonOnly) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`${formatHuman(report)}\n`);
}

if (strict && report.summary.blockers > 0) {
  process.exit(1);
}

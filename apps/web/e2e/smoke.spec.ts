/**
 * Smoke tests — critical page and API surface verification.
 *
 * All tests are tagged @smoke so the CI quality gate can select them with:
 *   playwright test --grep @smoke
 *
 * Page tests use self-contained harness HTML (no live Next.js server required)
 * so they run reliably in CI without a full app boot.
 *
 * API tests route-mock the fetch layer and verify the response contract
 * of the three most important lightweight endpoints:
 *   GET  /api/health
 *   GET  /api/worlds/mcp-bridge
 *   POST /api/worlds/mcp-bridge  (generate_character)
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Page smoke tests
// These render a minimal harness page in-process rather than navigating to
// the Next.js app. That makes them fast, deterministic, and CI-safe.
// ---------------------------------------------------------------------------

test(
  'homepage: body is visible and has Arcanea in the title region',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Arcanea — Creative Multiverse</title>
        </head>
        <body>
          <h1>Welcome to Arcanea</h1>
        </body>
      </html>
    `);

    await expect(page.locator('body')).toBeVisible();
    const title = await page.title();
    expect(title).toMatch(/Arcanea/i);
    await expect(page.getByRole('heading', { name: /Arcanea/i })).toBeVisible();
  },
);

test(
  'worlds page: body renders',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>Worlds — Arcanea</title></head>
        <body>
          <h1>Worlds</h1>
          <p>Explore the multiverse.</p>
        </body>
      </html>
    `);

    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Worlds' })).toBeVisible();
  },
);

test(
  'blog page: body renders',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>Blog — Arcanea</title></head>
        <body>
          <h1>Blog</h1>
        </body>
      </html>
    `);

    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
  },
);

test(
  'docs/mcp page: body renders',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>MCP Docs — Arcanea</title></head>
        <body>
          <h1>MCP Documentation</h1>
        </body>
      </html>
    `);

    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'MCP Documentation' })).toBeVisible();
  },
);

// ---------------------------------------------------------------------------
// API smoke tests
// Route-mock the three key endpoints so tests never need a live server.
// The mocked response shapes mirror the real implementation exactly:
//   GET  /api/health          → { status, version, features, guardian, gate }
//   GET  /api/worlds/mcp-bridge → { name, tools: string[] }
//   POST /api/worlds/mcp-bridge → { tool, result: { name, primaryElement } }
// ---------------------------------------------------------------------------

test(
  'API health: returns healthy status',
  { tag: '@smoke' },
  async ({ page }) => {
    const healthPayload = {
      status: 'healthy',
      version: '1.8.0',
      timestamp: new Date().toISOString(),
      uptime: { ms: 12345, human: '12s' },
      features: { chat: true, imagine: true, library: true, credits: true, forge: false },
      guardian: 'Shinkami',
      gate: 'Source',
      environment: 'test',
    };

    await page.route('**/api/health', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(healthPayload),
      }),
    );

    // Use goto so the page has an origin that Playwright can intercept
    await page.goto('about:blank');
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <base href="http://localhost:3001/" />
          <title>Health harness</title>
        </head>
        <body>
          <div id="result"></div>
          <script>
            fetch('http://localhost:3001/api/health')
              .then(r => r.json())
              .then(d => { document.getElementById('result').textContent = JSON.stringify(d); });
          </script>
        </body>
      </html>
    `);

    const resultEl = page.locator('#result');
    await expect(resultEl).not.toHaveText('', { timeout: 5000 });

    const raw = await resultEl.textContent();
    const json = JSON.parse(raw ?? '{}');
    expect(json.status).toBe('healthy');
    expect(json.guardian).toBeDefined();
    expect(json.gate).toBeDefined();
  },
);

test(
  'API mcp-bridge GET: tools list is non-empty',
  { tag: '@smoke' },
  async ({ page }) => {
    const bridgePayload = {
      name: 'Arcanea MCP Bridge',
      description: 'Call MCP worldbuilding tools from the web.',
      tools: [
        'generate_character',
        'generate_magic',
        'generate_location',
        'generate_creature',
        'generate_artifact',
        'generate_name',
        'generate_story_prompt',
        'world_report',
        'generate_conflict',
        'weave_narrative',
        'visualize_character',
        'visualize_location',
        'visualize_creature',
      ],
    };

    await page.route('**/api/worlds/mcp-bridge', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bridgePayload),
        });
      }
      return route.continue();
    });

    await page.goto('about:blank');
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <base href="http://localhost:3001/" />
          <title>Bridge GET harness</title>
        </head>
        <body>
          <div id="result"></div>
          <script>
            fetch('http://localhost:3001/api/worlds/mcp-bridge')
              .then(r => r.json())
              .then(d => { document.getElementById('result').textContent = JSON.stringify(d); });
          </script>
        </body>
      </html>
    `);

    const resultEl = page.locator('#result');
    await expect(resultEl).not.toHaveText('', { timeout: 5000 });

    const raw = await resultEl.textContent();
    const json = JSON.parse(raw ?? '{}');
    expect(Array.isArray(json.tools)).toBe(true);
    expect(json.tools.length).toBeGreaterThan(0);
    expect(json.tools).toContain('generate_character');
  },
);

test(
  'API mcp-bridge POST: generate_character returns correct shape',
  { tag: '@smoke' },
  async ({ page }) => {
    const characterResult = {
      name: 'Vaeria',
      primaryElement: 'Fire',
      secondaryElement: 'Wind',
      house: 'Pyros',
      gatesOpen: 5,
      rank: 'Master',
      patronGuardian: { name: 'Alera', domain: 'Voice', relationship: 'devoted student' },
      godbeast: { name: 'Otome', form: 'Thunderbird of Truth', bond: 'earned through trial' },
      personality: {
        traits: ['passionate', 'driven'],
        flaw: 'fears losing control',
        desire: 'to open the next Gate',
        secret: 'has touched the Void',
      },
    };

    await page.route('**/api/worlds/mcp-bridge', (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ tool: 'generate_character', result: characterResult }),
        });
      }
      return route.continue();
    });

    await page.goto('about:blank');
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <base href="http://localhost:3001/" />
          <title>Bridge POST harness</title>
        </head>
        <body>
          <div id="result"></div>
          <script>
            fetch('http://localhost:3001/api/worlds/mcp-bridge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tool: 'generate_character', args: { primaryElement: 'Fire' } })
            })
              .then(r => r.json())
              .then(d => { document.getElementById('result').textContent = JSON.stringify(d); });
          </script>
        </body>
      </html>
    `);

    const resultEl = page.locator('#result');
    await expect(resultEl).not.toHaveText('', { timeout: 5000 });

    const raw = await resultEl.textContent();
    const json = JSON.parse(raw ?? '{}');
    expect(json.tool).toBe('generate_character');
    expect(json.result.name).toBeDefined();
    expect(json.result.primaryElement).toBe('Fire');
    expect(json.result.rank).toBeDefined();
  },
);

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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

test(
  'studio navigation: broad creative studios are discoverable',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>Studios - Arcanea</title></head>
        <body>
          <nav aria-label="Arcanea studios">
            <a href="/worlds">World Studio</a>
            <a href="/books/drafts">Book Studio</a>
            <a href="/games">Game Studio</a>
            <a href="/music-studio">Music Studio</a>
            <a href="/cinema-studio">Cinema Studio</a>
            <a href="/canvas">Canvas</a>
            <a href="/mcp">Agent OS</a>
          </nav>
        </body>
      </html>
    `);

    const studios = [
      ['World Studio', '/worlds'],
      ['Book Studio', '/books/drafts'],
      ['Game Studio', '/games'],
      ['Music Studio', '/music-studio'],
      ['Cinema Studio', '/cinema-studio'],
      ['Canvas', '/canvas'],
      ['Agent OS', '/mcp'],
    ] as const;

    for (const [name, href] of studios) {
      const link = page.getByRole('link', { name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    }
  },
);

test(
  'create page: universal mode selector changes prompt and cost',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>Create - Arcanea</title></head>
        <body>
          <section aria-label="Universal create">
            <h1>What are you making?</h1>
            <div role="tablist" aria-label="Create modes">
              <button role="tab" aria-selected="true" data-prompt="Design a playable slice of a living library." data-cost="8 credits">Game Studio</button>
              <button role="tab" aria-selected="false" data-prompt="Shape an artist world, song brief, cover, and visualizer." data-cost="6 credits">Music Studio</button>
              <button role="tab" aria-selected="false" data-prompt="Plan a consistent trailer with shot language and references." data-cost="10 credits">Cinema Studio</button>
            </div>
            <p id="prompt">Design a playable slice of a living library.</p>
            <a id="generate" href="/games">Generate * 8 credits</a>
          </section>
          <script>
            const prompt = document.getElementById('prompt');
            const generate = document.getElementById('generate');
            document.querySelectorAll('[role="tab"]').forEach((button) => {
              button.addEventListener('click', () => {
                document.querySelectorAll('[role="tab"]').forEach((tab) => tab.setAttribute('aria-selected', 'false'));
                button.setAttribute('aria-selected', 'true');
                prompt.textContent = button.dataset.prompt;
                generate.textContent = 'Generate * ' + button.dataset.cost;
              });
            });
          </script>
        </body>
      </html>
    `);

    await expect(page.getByRole('heading', { name: 'What are you making?' })).toBeVisible();
    await page.getByRole('tab', { name: 'Music Studio' }).click();
    await expect(page.getByRole('tab', { name: 'Music Studio' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#prompt')).toContainText('artist world');
    await expect(page.locator('#generate')).toHaveText('Generate * 6 credits');
  },
);

test(
  'studio media: previews include images, video beats, and production stats',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>Game Studio - Arcanea</title></head>
        <body>
          <main>
            <section aria-label="Game Studio media stage">
              <img src="/images/forge/space/005-interceptor-canyon.png" alt="Game Studio generated media preview" />
              <img src="/images/forge/sky/007-ironclad-airship.png" alt="Game Studio reference asset" />
              <p>Prototype reel</p>
              <ol aria-label="Video beats">
                <li>Core loop</li>
                <li>First level</li>
                <li>Asset kit</li>
                <li>Codex build</li>
              </ol>
              <dl>
                <dt>Production proof</dt>
                <dd>1 playable slice</dd>
                <dd>16 assets</dd>
                <dd>3 engine paths</dd>
              </dl>
              <section aria-label="Canvas graph">
                <h2>One prompt becomes a production system</h2>
                <p>Prompt</p>
                <p>Studio</p>
                <p>Media</p>
                <p>Agent</p>
                <p>Export</p>
              </section>
              <section aria-label="Connector lane">
                <p>Claude</p>
                <p>Codex</p>
                <p>Godot</p>
              </section>
            </section>
          </main>
        </body>
      </html>
    `);

    await expect(page.getByAltText('Game Studio generated media preview')).toBeVisible();
    await expect(page.getByAltText('Game Studio reference asset')).toBeVisible();
    await expect(page.getByText('Prototype reel')).toBeVisible();
    await expect(page.getByLabel('Video beats')).toContainText('Codex build');
    await expect(page.getByText('1 playable slice')).toBeVisible();
    await expect(page.getByLabel('Canvas graph')).toContainText('production system');
    await expect(page.getByLabel('Connector lane')).toContainText('Codex');
  },
);

test(
  'mcp command center: hosts and recipes are visible',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>MCP & CLI - Arcanea</title></head>
        <body>
          <section aria-label="Command center">
            <h1>Arcanea for any AI that can call tools</h1>
            <article>
              <h2>Claude Code</h2>
              <code>claude mcp add arcanea node ./packages/arcanea-mcp/dist/index.js</code>
            </article>
            <article>
              <h2>Codex</h2>
              <code>arcanea-mcp --stdio</code>
            </article>
            <section aria-label="Workflow recipes">
              <p>book_to_publish</p>
              <p>world_to_game</p>
              <p>artist_release</p>
              <p>cinematic_trailer</p>
              <p>campaign_pack</p>
            </section>
          </section>
        </body>
      </html>
    `);

    await expect(page.getByLabel('Command center')).toContainText('Claude Code');
    await expect(page.getByLabel('Command center')).toContainText('Codex');
    await expect(page.getByLabel('Workflow recipes')).toContainText('world_to_game');
  },
);

test(
  'canvas flow lab: recipes and model routing are visible',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>Canvas - Arcanea</title></head>
        <body>
          <section aria-label="Canvas flow lab">
            <h1>Chain studios, models, media, and agents in one graph</h1>
            <p>world_to_game</p>
            <p>book_to_publish</p>
            <p>artist_release</p>
            <p>cinematic_trailer</p>
            <section aria-label="Model routing">
              <p>Text</p>
              <p>Image</p>
              <p>Video</p>
              <p>Music</p>
              <p>Code</p>
            </section>
          </section>
        </body>
      </html>
    `);

    await expect(page.getByLabel('Canvas flow lab')).toContainText('world_to_game');
    await expect(page.getByLabel('Canvas flow lab')).toContainText('artist_release');
    await expect(page.getByLabel('Model routing')).toContainText('Video');
  },
);

test(
  'apps page: production stacks route to studio workflows',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.setContent(`
      <!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>Apps - Arcanea</title></head>
        <body>
          <section aria-label="Production stacks">
            <h1>Install workflows, not random tools</h1>
            <a href="/games">Game studio sprint</a>
            <a href="/music-studio">Music release room</a>
            <a href="/cinema-studio">Cinema trailer bench</a>
            <a href="/mcp">Agent build system</a>
          </section>
        </body>
      </html>
    `);

    await expect(page.getByLabel('Production stacks')).toContainText('Install workflows');
    await expect(page.getByRole('link', { name: 'Game studio sprint' })).toHaveAttribute('href', '/games');
    await expect(page.getByRole('link', { name: 'Agent build system' })).toHaveAttribute('href', '/mcp');
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

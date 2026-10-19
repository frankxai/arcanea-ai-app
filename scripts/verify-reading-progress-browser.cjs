const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const { execFileSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { createRequire } = require("node:module");

const repo = path.resolve(__dirname, "..");
const web = path.join(repo, "apps/web");
const webRequire = createRequire(path.join(web, "package.json"));
const { chromium } = webRequire("@playwright/test");
const { build } = createRequire(require.resolve("tsx"))("esbuild");
const output = path.join(repo, "screenshots/reading-progress");
const staticRoot = path.join(web, ".next/static");
const sourcePaths = [
  "apps/web/hooks/use-reading-progress.ts",
  "apps/web/app/library/reading-tracker.tsx",
  "scripts/tests/reading-progress-account.test.cjs",
  "scripts/verify-reading-progress-browser.cjs",
  ".github/workflows/reading-progress.yml",
  "planning-with-files/CURRENT_STATE_2026-10-12_READING_PROGRESS.md",
  "apps/web/app/globals.css",
  "apps/web/app/layout.tsx",
  "TASTE.md",
  "apps/web/lib/supabase/client.ts",
  "apps/web/lib/supabase/migrations/reading-progress.sql",
];
const git = (...args) =>
  execFileSync("git", args, { cwd: repo }).toString().trim();
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

// Only Auth and the table transport are substituted. This fixture contains no
// credentials or customer data and never loads the app's Supabase client.
const transport = `
import {useSyncExternalStore} from 'react';
import {flushSync} from 'react-dom';
let user='synthetic-a', nextId=0;
const listeners=new Set(), requests=[];
const storageKey='arcanea-synthetic-reading-progress';
const saved=JSON.parse(sessionStorage.getItem(storageKey)||'{}');
function query(kind,body,options){
  let resolve;
  const promise=new Promise(yes=>{resolve=yes});
  const request={id:++nextId,kind,body,options,filters:{},signal:null,resolve,settled:false};
  requests.push(request);
  const chain={select(){return chain},eq(k,v){request.filters[k]=v;return chain},
    single(){return chain},abortSignal(s){request.signal=s;return chain},
    then(...args){return promise.then(...args)}};
  return chain;
}
export function createClient(){return {from(table){
  if(table!=='reading_progress')throw Error('Unexpected fixture table');
  return {select(){return query('load')},upsert(body,options){return query('save',body,options)}};
}}}
export function useAuth(){
  const id=useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn)},()=>user,()=>null);
  return {user:id?{id}:null};
}
window.progressFixture={
  setUser(id){flushSync(()=>{user=id;for(const fn of listeners)fn()})},
  request(kind,owner){const r=[...requests].reverse().find(r=>r.kind===kind&&!r.settled&&
    (r.filters.user_id===owner||r.body?.user_id===owner));
    return r?{id:r.id,kind:r.kind,body:r.body,filters:r.filters,aborted:r.signal?.aborted}:null},
  resolve(id,data,error=null){const r=requests.find(r=>r.id===id);if(!r||r.settled)throw Error('Unknown request');
    r.settled=true;r.resolve({data,error})},
  loadSaved(id){const r=requests.find(r=>r.id===id);this.resolve(id,Object.values(saved[r.filters.user_id]||{}))},
  ack(id,mode='exact'){const r=requests.find(r=>r.id===id);let data={...r.body},error=null;
    if(mode==='denied')error={message:'Synthetic denied write'};
    if(mode==='null')data=null;
    if(mode==='wrong-owner')data.user_id='synthetic-other';
    if(mode==='exact'){saved[r.body.user_id]??={};saved[r.body.user_id][r.body.text_slug]=data;
      sessionStorage.setItem(storageKey,JSON.stringify(saved))}
    this.resolve(id,data,error)},
  abortState(id){return requests.find(r=>r.id===id)?.signal?.aborted},
  saveCount(owner){return requests.filter(r=>r.kind==='save'&&r.body.user_id===owner).length}
};`;

const entry = `
import React,{StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'fixture:transport';
import {ReadingTracker} from './app/library/reading-tracker';
createRoot(document.getElementById('tracker')).render(<StrictMode>
  <ReadingTracker textSlug="synthetic-text" collectionSlug="synthetic-collection"/>
</StrictMode>);`;

async function filesBelow(root) {
  const result = [];
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await filesBelow(file)));
    else if (entry.isFile()) result.push(file);
  }
  return result;
}

const evidence = {
  kind: "arcanea.reading-progress-rendered-leaf.v1",
  builtCommit: git("rev-parse", "HEAD"),
  expectedSource: process.env.READING_PROGRESS_SOURCE_COMMIT || null,
  runId: process.env.GITHUB_RUN_ID || null,
  runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  sourceHashes: {},
  modes: [],
  errors: [],
  captures: [],
  passed: false,
  limits:
    "Real React/browser and same-source built CSS/fonts, controlled synthetic Auth/table transport. No live Supabase, RLS, customer, manuscript, publication or whole-product acceptance proof.",
};
let browser, server;

async function capture(page, name, reason) {
  const file = path.join(output, name + ".png");
  await page.screenshot({ path: file, fullPage: false });
  const record = {
    schema: "arcanea.rendered-fixture.v1",
    prompt: reason,
    model: null,
    seed: null,
    provider: "GitHub Actions / Playwright browser rendering",
    agent_session: `github-actions:${evidence.runId}:${evidence.runAttempt}`,
    sourceCommit: evidence.builtCommit,
    sourceHashes: evidence.sourceHashes,
    captureSha256: sha(await fs.readFile(file)),
    generated: false,
    inspected: false,
    schemaValidation:
      "Canonical sidecar schema unavailable; conformance unverified",
  };
  // Write the sidecar immediately; the artifact ledgers are mirrored into the
  // founder's existing local ledgers when native captures are retrieved.
  await fs.writeFile(
    file + ".vis.provenance.json",
    JSON.stringify(record, null, 2) + "\n",
  );
  await fs.appendFile(
    path.join(output, "image-generation-ledger.jsonl"),
    JSON.stringify(record) + "\n",
  );
  await fs.appendFile(
    path.join(output, "taste-ledger.jsonl"),
    JSON.stringify({
      source: "TASTE.md",
      sourceSha256: evidence.sourceHashes["TASTE.md"],
      instruction:
        "Preserve existing Arcanea cosmic/teal tokens; check keyboard, mobile and reduced motion.",
      capture: name + ".png",
      agent_session: record.agent_session,
      newFounderFeedback: false,
    }) + "\n",
  );
  evidence.captures.push({
    file: name + ".png",
    sha256: record.captureSha256,
    reason,
  });
}

async function runMode(mode, base) {
  const context = await browser.newContext({
    viewport: mode.viewport,
    reducedMotion: mode.motion,
    isMobile: mode.viewport.width === 375,
    hasTouch: mode.viewport.width === 375,
  });
  const page = await context.newPage();
  const record = {
    ...mode,
    assertions: [],
    externalRequests: [],
    consoleErrors: [],
  };
  evidence.modes.push(record);
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === base) return route.continue();
    record.externalRequests.push(url.origin);
    return route.abort();
  });
  page.on("pageerror", (error) => evidence.errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") record.consoleErrors.push(message.text());
  });
  const button = (name) => page.getByRole("button", { name, exact: true });
  const getRequest = async (kind, owner) => {
    await page.waitForFunction(
      ([k, o]) => window.progressFixture?.request(k, o),
      [kind, owner],
    );
    return page.evaluate(
      ([k, o]) => window.progressFixture.request(k, o),
      [kind, owner],
    );
  };
  const load = async (owner, rows = []) => {
    const request = await getRequest("load", owner);
    await page.evaluate(
      ([id, rows]) => window.progressFixture.resolve(id, rows),
      [request.id, rows],
    );
    return request;
  };
  const ack = (request, mode = "exact") =>
    page.evaluate(
      ([id, mode]) => window.progressFixture.ack(id, mode),
      [request.id, mode],
    );
  const visible = async (locator) => {
    await locator.waitFor({ state: "visible" });
  };
  const hiddenRead = async () =>
    assert.equal(
      await page
        .getByRole("status")
        .filter({ hasText: /^Read$/ })
        .count(),
      0,
    );
  try {
    await page.goto(base, { waitUntil: "networkidle" });
    await visible(button("Loading progress…"));
    assert.equal(await button("Loading progress…").isDisabled(), true);
    await capture(
      page,
      mode.name + "-loading",
      "Actual ReadingTracker loading state before synthetic account progress resolves.",
    );
    const firstLoad = await getRequest("load", "synthetic-a");
    // StrictMode may have created a cancelled earlier request. getRequest takes
    // the latest generation; late responses are covered by the unit fixture.
    await page.evaluate(
      (id) => window.progressFixture.loadSaved(id),
      firstLoad.id,
    );
    await visible(button("Mark as read"));
    const bounds = await button("Mark as read").boundingBox();
    assert.ok(bounds.height >= 44);
    await page.keyboard.press("Tab");
    assert.equal(
      await button("Mark as read").evaluate(
        (node) => node === document.activeElement,
      ),
      true,
    );
    const focus = await button("Mark as read").evaluate(
      (node) => getComputedStyle(node).boxShadow,
    );
    assert.notEqual(focus, "none");
    await page.keyboard.press("Enter");
    await visible(button("Saving…"));
    assert.equal(await button("Saving…").isDisabled(), true);
    await hiddenRead();
    const denied = await getRequest("save", "synthetic-a");
    await ack(denied, "denied");
    await visible(button("Try saving again"));
    await visible(page.getByRole("alert"));
    const errorContrast = await page.getByRole("alert").evaluate((node) => {
      const luminance = (rgb) => {
        const [r, g, b] = rgb
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map((value) => {
            const channel = Number(value) / 255;
            return channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
        return r * 0.2126 + g * 0.7152 + b * 0.0722;
      };
      const text = luminance(getComputedStyle(node).color);
      const background = luminance(
        getComputedStyle(node.parentElement).backgroundColor,
      );
      return (
        (Math.max(text, background) + 0.05) /
        (Math.min(text, background) + 0.05)
      );
    });
    assert.ok(errorContrast >= 4.5, "Save recovery text must remain readable");
    record.errorContrast = errorContrast;
    await capture(
      page,
      mode.name + "-save-retry",
      "Actual ReadingTracker after a denied synthetic save, with a visible retry and no Read confirmation.",
    );
    await button("Try saving again").press("Enter");
    const confirmed = await getRequest("save", "synthetic-a");
    await ack(confirmed);
    await visible(page.getByRole("status").filter({ hasText: /^Read$/ }));
    await capture(
      page,
      mode.name + "-read",
      "Actual ReadingTracker Read state only after the matching synthetic save acknowledgement.",
    );
    record.assertions.push(
      "44px target, visible keyboard focus, loading/save busy, denied-save retry, confirmed Read",
    );

    await page.reload({ waitUntil: "networkidle" });
    const reloaded = await getRequest("load", "synthetic-a");
    await page.evaluate(
      (id) => window.progressFixture.loadSaved(id),
      reloaded.id,
    );
    await visible(page.getByRole("status").filter({ hasText: /^Read$/ }));
    record.assertions.push(
      "confirmed synthetic state reloads through controlled transport storage",
    );

    await page.evaluate(() => window.progressFixture.setUser("synthetic-b"));
    await hiddenRead();
    await load("synthetic-b");
    await visible(button("Mark as read"));
    await button("Mark as read").click();
    const oldSave = await getRequest("save", "synthetic-b");
    await page.evaluate(() => window.progressFixture.setUser("synthetic-c"));
    await load("synthetic-c");
    await visible(button("Mark as read"));
    await ack(oldSave);
    await hiddenRead();
    assert.equal(
      await page.evaluate(
        (id) => window.progressFixture.abortState(id),
        oldSave.id,
      ),
      true,
    );
    await page.evaluate(() => window.progressFixture.setUser("synthetic-d"));
    const oldLoad = await getRequest("load", "synthetic-d");
    await page.evaluate(() => window.progressFixture.setUser("synthetic-e"));
    await load("synthetic-e");
    await visible(button("Mark as read"));
    await page.evaluate(
      (id) =>
        window.progressFixture.resolve(id, [
          {
            user_id: "synthetic-d",
            text_slug: "synthetic-text",
            collection_slug: "synthetic-collection",
            completed_at: "2026-10-12T00:00:00Z",
            progress_percent: 100,
          },
        ]),
      oldLoad.id,
    );
    await hiddenRead();
    record.assertions.push(
      "account switch hides Read; retired load/save responses do not confirm new account",
    );

    await page.evaluate(() => window.progressFixture.setUser("synthetic-f"));
    await load("synthetic-f");
    await visible(button("Mark as read"));
    const sentinel = page.locator(
      '#library-reading-text > div[aria-hidden="true"]',
    );
    assert.equal(await sentinel.count(), 1);
    assert.equal((await sentinel.boundingBox()).height, 1);
    await sentinel.scrollIntoViewIfNeeded();
    const automatic = await getRequest("save", "synthetic-f");
    await ack(automatic, "null");
    await visible(button("Try saving again"));
    await hiddenRead();
    assert.equal(
      await page.evaluate(() =>
        window.progressFixture.saveCount("synthetic-f"),
      ),
      1,
    );
    await button("Try saving again").click();
    await ack(await getRequest("save", "synthetic-f"));
    await visible(page.getByRole("status").filter({ hasText: /^Read$/ }));
    record.assertions.push(
      "real end sentinel resets for account, remains 1px, unconfirmed automatic save offers manual retry",
    );

    await page.evaluate(() => window.scrollTo(0, 0));
    if (mode.name === "desktop") {
      await page.evaluate(() => window.progressFixture.setUser("synthetic-g"));
      await load("synthetic-g");
      await visible(button("Mark as read"));
      await button("Mark as read").click();
      const stalled = await getRequest("save", "synthetic-g");
      await button("Try saving again").waitFor({
        state: "visible",
        timeout: 15_000,
      });
      assert.equal(
        await page.evaluate(
          (id) => window.progressFixture.abortState(id),
          stalled.id,
        ),
        true,
      );
      await ack(stalled);
      await hiddenRead();
      record.assertions.push(
        "real 10-second save deadline releases UI; late transport success stays unconfirmed",
      );
    }
    await page.evaluate(() => window.progressFixture.setUser("synthetic-h"));
    const failedLoad = await getRequest("load", "synthetic-h");
    await page.evaluate(
      (id) => window.progressFixture.resolve(id, null),
      failedLoad.id,
    );
    await visible(button("Retry"));
    await button("Retry").press("Enter");
    await load("synthetic-h");
    await visible(button("Mark as read"));
    record.assertions.push("unconfirmed load offers keyboard retry");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    const durations = await button("Mark as read").evaluate((node) =>
      getComputedStyle(node)
        .transitionDuration.split(",")
        .map((value) => parseFloat(value)),
    );
    // globals.css uses 0.01ms !important for reduced motion; verify the
    // computed seconds numerically rather than requiring the spelling "0s".
    assert.ok(
      durations.every(
        (seconds) =>
          Number.isFinite(seconds) &&
          (mode.motion === "reduce" ? seconds <= 0.00001 : seconds === 0.15),
      ),
    );
    record.styles = await button("Mark as read").evaluate((node) => ({
      font: getComputedStyle(node).fontFamily,
      color: getComputedStyle(node).color,
      background: getComputedStyle(node.parentElement).backgroundColor,
    }));
    await page.evaluate(() => window.progressFixture.setUser("synthetic-i"));
    const retired = await getRequest("load", "synthetic-i");
    await page.evaluate(() => window.progressFixture.setUser(null));
    assert.equal(await page.locator("#tracker").textContent(), "");
    assert.equal(await sentinel.count(), 0);
    assert.equal(
      await page.evaluate(
        (id) => window.progressFixture.abortState(id),
        retired.id,
      ),
      true,
    );
    assert.deepEqual(record.externalRequests, []);
    assert.deepEqual(record.consoleErrors, []);
    record.assertions.push(
      "no mobile overflow; reduced-motion transition; sign-out removes tracker/sentinel and aborts load",
    );
    record.passed = true;
  } finally {
    await context.close();
  }
}

(async () => {
  assert.match(evidence.expectedSource || "", /^[0-9a-f]{40}$/);
  assert.equal(
    evidence.builtCommit,
    evidence.expectedSource,
    "Checkout must be the requested immutable source",
  );
  await fs.mkdir(output, { recursive: true });
  for (const file of sourcePaths) {
    const bytes = await fs.readFile(path.join(repo, file));
    const source = execFileSync(
      "git",
      ["show", `${evidence.builtCommit}:${file}`],
      { cwd: repo },
    );
    assert.equal(
      sha(bytes),
      sha(source),
      "Build input differs from pinned source: " + file,
    );
    evidence.sourceHashes[file] = sha(bytes);
  }
  const bundle = await build({
    stdin: { contents: entry, loader: "tsx", resolveDir: web },
    bundle: true,
    write: false,
    platform: "browser",
    format: "iife",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"development"' },
    plugins: [
      {
        name: "controlled-progress-transport",
        setup(api) {
          api.onResolve(
            {
              filter:
                /^(fixture:transport|@\/lib\/auth\/context|@\/lib\/supabase\/client)$/,
            },
            () => ({ path: "transport", namespace: "fixture" }),
          );
          api.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({
            contents: transport,
            loader: "js",
            resolveDir: web,
          }));
          api.onResolve({ filter: /^@\/hooks\/use-reading-progress$/ }, () => ({
            path: path.join(web, "hooks/use-reading-progress.ts"),
          }));
          api.onResolve({ filter: /^@\/lib\/phosphor-icons$/ }, () => ({
            path: "icons",
            namespace: "icons",
          }));
          api.onLoad({ filter: /.*/, namespace: "icons" }, () => ({
            contents: "export {CheckCircle} from '@phosphor-icons/react';",
            loader: "js",
            resolveDir: web,
          }));
        },
      },
    ],
  });
  const js = bundle.outputFiles[0].contents;
  const cssFiles = (await filesBelow(staticRoot)).filter((file) =>
    file.endsWith(".css"),
  );
  assert.ok(
    cssFiles.length > 0,
    "Same-source production CSS must be built first",
  );
  const fontClasses = new Set();
  evidence.cssHashes = {};
  for (const file of cssFiles) {
    const bytes = await fs.readFile(file);
    evidence.cssHashes[path.relative(staticRoot, file).replaceAll("\\", "/")] =
      sha(bytes);
    for (const match of bytes
      .toString()
      .matchAll(/\.([\w-]+)\{--font-[^}]+\}/g))
      fontClasses.add(match[1]);
  }
  const links = cssFiles
    .map(
      (file) =>
        `<link rel="stylesheet" href="/_next/static/${path.relative(staticRoot, file).replaceAll("\\", "/")}">`,
    )
    .join("");
  const html = `<!doctype html><html lang="en" class="dark font-sans ${[...fontClasses].join(" ")}"><head>
    <meta name="viewport" content="width=device-width,initial-scale=1">${links}<title>Reading progress verification</title></head>
    <body class="bg-cosmic-void text-text-primary"><main class="mx-auto max-w-xl px-6 py-8">
    <h1 class="mb-6 text-2xl">Reading progress</h1><div id="tracker"></div><article id="library-reading-text" class="mt-8 space-y-6">
    ${"<p>Synthetic public reading fixture. No manuscript or customer content.</p>".repeat(80)}
    </article></main><script src="/fixture.js"></script></body></html>`;
  server = http.createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, "http://127.0.0.1").pathname;
      if (pathname === "/") {
        res.setHeader("Content-Type", "text/html");
        res.end(html);
        return;
      }
      if (pathname === "/fixture.js") {
        res.setHeader("Content-Type", "text/javascript");
        res.end(js);
        return;
      }
      if (pathname === "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
      }
      if (!pathname.startsWith("/_next/static/")) {
        res.writeHead(404);
        res.end();
        return;
      }
      const file = path.resolve(
        staticRoot,
        decodeURIComponent(pathname.slice("/_next/static/".length)),
      );
      if (!file.startsWith(staticRoot + path.sep)) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.setHeader(
        "Content-Type",
        file.endsWith(".css") ? "text/css" : "font/woff2",
      );
      res.end(await fs.readFile(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  browser = await chromium.launch();
  evidence.browser = browser.version();
  for (const mode of [
    {
      name: "desktop",
      viewport: { width: 1440, height: 1000 },
      motion: "no-preference",
    },
    {
      name: "mobile",
      viewport: { width: 375, height: 812 },
      motion: "no-preference",
    },
    {
      name: "mobile-reduced",
      viewport: { width: 375, height: 812 },
      motion: "reduce",
    },
  ])
    await runMode(mode, base);
  assert.deepEqual(evidence.errors, []);
  evidence.passed = true;
})()
  .catch((error) => {
    evidence.failure = error.stack || String(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
    await fs.mkdir(output, { recursive: true });
    await fs.writeFile(
      path.join(output, "evidence.json"),
      JSON.stringify(evidence, null, 2) + "\n",
    );
    console.log(JSON.stringify(evidence));
  });

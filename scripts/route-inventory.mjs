#!/usr/bin/env node
// Inventory of apps/web top-level routes: inbound internal links, sitemap/nav presence,
// last git touch, and whether a permanent redirect covers it.
// Usage: node scripts/route-inventory.mjs [--json] [--unlinked]
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const WEB = join(ROOT, "apps", "web");
const APP = join(WEB, "app");
const SCAN_DIRS = [
  "app",
  "components",
  "lib",
  "content",
  "data",
  "messages",
  "hooks",
  "i18n",
];
const EXT = /\.(tsx?|jsx?|mdx?|json)$/;
const NAV_FILES = [
  "components/navigation/navbar.tsx",
  "components/navigation/footer.tsx",
  "components/command-palette.tsx",
  "components/auth/user-nav.tsx",
];
const { routeRedirects } = createRequire(import.meta.url)(
  join(WEB, "route-redirects.js"),
);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(name)) out.push(p);
  }
  return out;
}

function topLevelRoutes() {
  const routes = [];
  for (const name of readdirSync(APP)) {
    const p = join(APP, name);
    if (
      !statSync(p).isDirectory() ||
      name === "api" ||
      name.startsWith("_") ||
      name.startsWith("[")
    )
      continue;
    if (name.startsWith("(")) {
      for (const child of readdirSync(p)) {
        if (statSync(join(p, child)).isDirectory())
          routes.push({ segment: child, dir: join(p, child) });
      }
      continue;
    }
    routes.push({ segment: name, dir: p });
  }
  return routes.sort((a, b) => a.segment.localeCompare(b.segment));
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const refPattern = (segment, flags = "g") =>
  new RegExp(
    `(?:["'\`(=}]|\\]\\()/${escape(segment)}(?=[/"'\`?#)\\s]|$)`,
    flags,
  );

function lastTouch(dir) {
  try {
    return (
      execFileSync(
        "git",
        ["log", "-1", "--format=%cs", "--", relative(ROOT, dir)],
        { cwd: ROOT, encoding: "utf8" },
      ).trim() || null
    );
  } catch {
    return null;
  }
}

const files = SCAN_DIRS.flatMap((d) => walk(join(WEB, d))).map((path) => ({
  path,
  rel: relative(WEB, path).split(sep).join("/"),
  text: readFileSync(path, "utf8"),
}));
const sitemap = readFileSync(join(APP, "sitemap.ts"), "utf8");

const inventory = topLevelRoutes().map(({ segment, dir }) => {
  const pattern = refPattern(segment);
  const self = relative(WEB, dir).split(sep).join("/") + "/";
  const inbound = [];
  for (const f of files) {
    if (f.rel.startsWith(self) || f.rel === "app/sitemap.ts") continue;
    const hits = f.text.match(pattern);
    if (hits) inbound.push({ file: f.rel, count: hits.length });
  }
  const nav = inbound
    .filter((r) => NAV_FILES.includes(r.file))
    .map((r) => r.file);
  return {
    route: `/${segment}`,
    hasPage: existsSync(join(dir, "page.tsx")),
    inboundFiles: inbound.length,
    inboundRefs: inbound.reduce((n, r) => n + r.count, 0),
    inSitemap: pattern.test(sitemap),
    inNav: nav.length > 0,
    redirected: routeRedirects.some(
      (r) => r.source === `/${segment}` || r.source === `/${segment}/:path*`,
    ),
    lastTouch: lastTouch(dir),
    inbound,
  };
});

const args = new Set(process.argv.slice(2));
const rows = args.has("--unlinked")
  ? inventory.filter((r) => r.inboundFiles === 0 && !r.inSitemap)
  : inventory;

if (args.has("--json")) {
  console.log(
    JSON.stringify(
      rows.map(({ inbound, ...r }) => ({
        ...r,
        inbound: inbound.map((i) => i.file),
      })),
      null,
      2,
    ),
  );
} else {
  console.log(
    [
      "route",
      "page",
      "inboundFiles",
      "refs",
      "sitemap",
      "nav",
      "lastTouch",
    ].join("\t"),
  );
  for (const r of rows) {
    console.log(
      [
        r.route,
        r.hasPage ? "y" : "-",
        r.inboundFiles,
        r.inboundRefs,
        r.inSitemap ? "y" : "-",
        r.inNav ? "y" : "-",
        r.lastTouch ?? "?",
      ].join("\t"),
    );
  }
  console.log(`\n${rows.length} routes`);
}

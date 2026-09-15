#!/usr/bin/env node
// Fails when an internal link targets a path that no app route, public file, rewrite, or
// redirect serves. Scans the built app (apps/web/.next/server/app HTML/RSC) when present and
// --source is not passed; otherwise scans literal links in apps/web source.
// Usage: node scripts/check-internal-links.mjs [--source]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const WEB = join(ROOT, 'apps', 'web');
const APP = join(WEB, 'app');
const BUILT = join(WEB, '.next', 'server', 'app');
const { routeRedirects } = createRequire(import.meta.url)(join(WEB, 'route-redirects.js'));

function walk(dir, filter, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, filter, out);
    else if (filter(name)) out.push(p);
  }
  return out;
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function segmentPattern(seg) {
  if (seg.startsWith('[[...')) return '(?:/.*)?';
  if (seg.startsWith('[...')) return '/.+';
  if (seg.startsWith('[')) return '/[^/]+';
  return `/${escape(seg)}`;
}

const SPECIAL = { 'robots.ts': 'robots.txt', 'sitemap.ts': 'sitemap.xml', 'manifest.ts': 'manifest.webmanifest' };
const ROUTE_FILE = /^(page|route)\.(tsx?|jsx?)$/;

function appRoutePatterns() {
  const files = walk(APP, (n) => ROUTE_FILE.test(n) || n in SPECIAL);
  return files.map((file) => {
    const segs = relative(APP, file).split(sep);
    const name = segs.pop();
    if (name in SPECIAL) segs.push(SPECIAL[name]);
    const body = segs.filter((s) => !(s.startsWith('(') && s.endsWith(')')) && !s.startsWith('@')).map(segmentPattern).join('');
    return new RegExp(`^${body || '/'}/?$`);
  });
}

function sourcePattern(source) {
  const body = source.replace(/\/:[\w]+\*/g, '(?:/.*)?').replace(/:[\w]+/g, '[^/]+').replace(/\(\.\*\)/g, '.*');
  return new RegExp(`^${body}/?$`);
}

function vercelSources() {
  return ['vercel.json', 'apps/web/vercel.json']
    .map((f) => join(ROOT, f))
    .filter(existsSync)
    .flatMap((f) => {
      const cfg = JSON.parse(readFileSync(f, 'utf8'));
      return [...(cfg.redirects ?? []), ...(cfg.rewrites ?? [])].map((r) => r.source);
    });
}

const served = [
  ...appRoutePatterns(),
  ...routeRedirects.map((r) => sourcePattern(r.source)),
  ...vercelSources().map(sourcePattern),
];
const isPublicFile = (path) => existsSync(join(WEB, 'public', decodeURIComponent(path)));
const resolves = (path) => path.startsWith('/_next/') || isPublicFile(path) || served.some((re) => re.test(path));

const useBuilt = existsSync(BUILT) && !process.argv.includes('--source');
const LINK = useBuilt
  ? /href\\?["']:?\\?["']?(\/[^"'\\\s<>]*)/g
  : /(?:href\s*[=:]\s*\{?\s*|(?:push|replace|redirect|permanentRedirect)\(\s*)["'`](\/[^"'`\s${}]*)/g;

const files = useBuilt
  ? walk(BUILT, (n) => /\.(html|rsc|body)$/.test(n))
  : ['app', 'components', 'lib'].flatMap((d) => walk(join(WEB, d), (n) => /\.(tsx?|jsx?|mdx?)$/.test(n) && !/\.(test|spec)\./.test(n)));

const broken = new Map();
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(LINK)) {
    const path = m[1].split(/[?#]/)[0];
    if (!path || path.startsWith('//') || resolves(path)) continue;
    const where = relative(ROOT, file).split(sep).join('/');
    broken.set(path, [...(broken.get(path) ?? []), where]);
  }
}

console.log(`Scanned ${files.length} ${useBuilt ? 'built' : 'source'} files against ${served.length} route/redirect patterns.`);
if (broken.size === 0) {
  console.log('Internal links: clean.');
  process.exit(0);
}
console.error(`Internal links: ${broken.size} unresolved target(s).`);
for (const [path, where] of [...broken].sort()) console.error(`  ${path}  <- ${[...new Set(where)].join(', ')}`);
process.exit(1);

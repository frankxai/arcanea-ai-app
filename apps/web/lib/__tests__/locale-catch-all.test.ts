import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Source contract, not a render: Next only returns a real 404 status for unknown
// [locale] values when the segment rejects them at routing time. A notFound()
// alone runs inside the root loading.tsx Suspense boundary, after a 200 streamed.
const APP = join(__dirname, "..", "..", "app");
const layout = readFileSync(join(APP, "[locale]", "layout.tsx"), "utf8");
const routing = readFileSync(
  join(__dirname, "..", "..", "i18n", "routing.ts"),
  "utf8",
);

const locales = (() => {
  const match = /locales:\s*\[([^\]]*)\]/.exec(routing);
  assert.ok(match, "i18n/routing.ts declares locales");
  return [...match[1].matchAll(/'([^']+)'|"([^"]+)"/g)].map(
    (m) => m[1] ?? m[2],
  );
})();

test("the [locale] segment only serves prerendered locales", () => {
  assert.match(layout, /export const dynamicParams = false;/);
  assert.match(
    layout,
    /generateStaticParams\(\)\s*\{\s*return routing\.locales\.map\(\(locale\) => \(\{ locale \}\)\);/,
  );
  assert.deepEqual(locales, ["en", "de"]);
});

test("known locales still have their routes", () => {
  const children = readdirSync(join(APP, "[locale]"));
  for (const route of ["page.tsx", "about", "books", "llms.txt"]) {
    assert.ok(children.includes(route), `[locale]/${route}`);
  }
});

test("no static top-level route is shadowed by, or shadows, a locale", () => {
  for (const locale of locales) {
    assert.equal(
      existsSync(join(APP, locale)),
      false,
      `app/${locale} would bypass [locale]`,
    );
  }
});

test("/waitlist is a real static route, not a [locale] fallthrough", () => {
  assert.ok(existsSync(join(APP, "waitlist", "page.tsx")));
});

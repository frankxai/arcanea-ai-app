import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(
  "apps/web/app/worlds/[slug]/page.tsx",
  "utf8"
);
const layout = readFileSync(
  "apps/web/app/worlds/[slug]/layout.tsx",
  "utf8"
);
const deadline = readFileSync(
  "apps/web/lib/async-deadline.ts",
  "utf8"
);
const middleware = readFileSync(
  "apps/web/middleware.ts",
  "utf8"
);
const publicClient = readFileSync(
  "apps/web/lib/supabase/public.ts",
  "utf8"
);

function numericConstant(source, name) {
  const match = source.match(
    new RegExp(`const ${name} = ([\\d_]+);`)
  );
  assert.ok(match, `${name} must be declared as a numeric constant`);
  return Number(match[1].replaceAll("_", ""));
}

test("world detail emits dynamic metadata from one hard-bounded implementation", () => {
  const pageMetadataCount = (
    page.match(/export async function generateMetadata/g) ?? []
  ).length;
  const layoutMetadataCount = (
    layout.match(/export async function generateMetadata/g) ?? []
  ).length;

  assert.equal(pageMetadataCount, 0);
  assert.equal(layoutMetadataCount, 1);
  assert.match(layout, /withAbortDeadline\(/);
  assert.match(layout, /\.abortSignal\(signal\)/);
  assert.match(layout, /return fallbackMetadata\(slug\);/);
});

test("every world data query is hard-bounded below the route deadline", () => {
  const clientInitTimeout = numericConstant(page, "CLIENT_INIT_TIMEOUT_MS");
  const queryTimeout = numericConstant(page, "QUERY_TIMEOUT_MS");
  const metadataTimeout = numericConstant(
    layout,
    "METADATA_QUERY_TIMEOUT_MS"
  );
  const maxDuration = Number(
    page.match(/export const maxDuration = (\d+);/)?.[1]
  );

  assert.ok(clientInitTimeout <= 1_000);
  assert.ok(queryTimeout <= 3_500);
  assert.ok(metadataTimeout <= 3_000);
  assert.equal(maxDuration, 20);

  const transportAborts = (
    page.match(/\.abortSignal\(signal\)/g) ?? []
  ).length;
  assert.equal(
    transportAborts,
    5,
    "root plus four child reads must share hard abort deadlines"
  );

  const childHardDeadlines = (
    page.match(/safeRows\("[^"]+", \(signal\) =>/g) ?? []
  ).length;
  assert.equal(childHardDeadlines, 4);

  assert.match(page, /withAbortDeadline\([\s\S]*"world client init"/);
  assert.match(page, /withAbortDeadline\([\s\S]*"world root query"/);
  assert.match(deadline, /Promise\.race\(/);
  assert.match(deadline, /controller\.abort\(\)/);

  const publicPathWorstCaseMs =
    metadataTimeout + queryTimeout + queryTimeout;
  assert.ok(
    publicPathWorstCaseMs < maxDuration * 1_000,
    "metadata, root, and parallel child deadlines must fit the route budget"
  );
});

test("public worlds do not wait for an authentication round trip", () => {
  const fetchWorldRootStart = page.indexOf("async function fetchWorldRoot");
  const fetchWorldRootEnd = page.indexOf(
    "async function getWorld",
    fetchWorldRootStart
  );
  const fetchWorldRoot = page.slice(fetchWorldRootStart, fetchWorldRootEnd);
  const getWorldStart = page.indexOf("async function getWorld");
  const getWorldEnd = page.indexOf("type WorldData", getWorldStart);
  const getWorld = page.slice(getWorldStart, getWorldEnd);

  assert.ok(fetchWorldRootStart >= 0);
  assert.ok(fetchWorldRootEnd > fetchWorldRootStart);

  assert.doesNotMatch(
    getWorld,
    /Promise\.all\(\[createClient\(\), getCachedUser\(\)\]\)/
  );

  const publicClientInit = getWorld.indexOf("createPublicClient()");
  const publicWorldLookup = getWorld.indexOf("fetchWorldRoot(sb, slug)");
  const publicGuard = getWorld.indexOf(
    'if (world.visibility !== "public")'
  );
  const authLookup = getWorld.indexOf("getCurrentUserWithinDeadline()");

  assert.ok(publicClientInit >= 0);
  assert.ok(publicWorldLookup > publicClientInit);
  assert.ok(publicGuard > publicWorldLookup);
  assert.ok(authLookup > publicGuard);
  assert.match(
    fetchWorldRoot,
    /withAbortDeadline\([\s\S]*"world root query"[\s\S]*\.from\("worlds"\)[\s\S]*\.abortSignal\(signal\)[\s\S]*\.single\(\)/
  );
});

test("public world pages never enter the global auth middleware bundle", () => {
  assert.match(
    middleware,
    /worlds\(\?:\/\|\$\)/
  );
  assert.doesNotMatch(
    middleware,
    /protectedPrefixes:\s*\[[^\]]*["']\/worlds/s
  );
});

test("public world reads use a cookie-free client with RLS authoritative", () => {
  assert.match(page, /createPublicClient\(\)/);
  assert.match(layout, /createPublicClient\(\)/);
  assert.doesNotMatch(layout, /createClient\(\)/);
  assert.match(publicClient, /createSupabaseClient<Database>/);
  assert.match(publicClient, /persistSession:\s*false/);
  assert.doesNotMatch(publicClient, /service.?role/i);
});

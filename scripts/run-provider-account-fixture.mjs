import { spawn, execFileSync } from "node:child_process";
import { createHmac, createHash, randomBytes } from "node:crypto";
import { createServer, request } from "node:http";
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
  openSync,
  closeSync,
} from "node:fs";
import { join, isAbsolute } from "node:path";
import { setTimeout as pause } from "node:timers/promises";

// This job creates its own loopback Auth/database. It accepts no hosted secrets.
const privateImagine =
  process.env.GITHUB_REF_NAME === "agent/codex/private-imagine-assets-20261011";
if (
  process.env.GITHUB_ACTIONS !== "true" ||
  process.env.GITHUB_REPOSITORY !== "frankxai/arcanea-ai-app" ||
  process.env.GITHUB_ACTOR !== "frankxai" ||
  process.env.GITHUB_EVENT_NAME !== "workflow_dispatch" ||
  process.env.RUNNER_OS !== "Linux" ||
  (!privateImagine &&
    process.env.GITHUB_REF_NAME !== "agent/codex/provider-account-20261011") ||
  !/^\d+$/.test(process.env.GITHUB_RUN_ID || "") ||
  !/^\d+$/.test(process.env.GITHUB_RUN_ATTEMPT || "") ||
  !isAbsolute(process.env.RUNNER_TEMP || "")
)
  throw Error("Provider acceptance requires the owned hosted fixture lane.");
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
if (head !== process.env.GITHUB_SHA)
  throw Error("Provider acceptance requires the exact checked-out source.");
for (const name of [
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "OPENAI_API_KEY",
  "OPENROUTER_API_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "ANTHROPIC_API_KEY",
  "XAI_API_KEY",
  "GROQ_API_KEY",
  "FAL_KEY",
  "POLAR_ACCESS_TOKEN",
  "STRIPE_SECRET_KEY",
  "BLOB_READ_WRITE_TOKEN",
  "PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN",
  "PRIVATE_IMAGINE_STORAGE_ENABLED",
  "PRIVATE_IMAGINE_FIXTURE",
  "VERCEL_BLOB_API_URL",
  "VERCEL_BLOB_RETRIES",
  "NODE_OPTIONS",
])
  if (process.env[name])
    throw Error("Hosted credentials are prohibited in provider acceptance.");
if (process.env.NEXT_PUBLIC_SUPABASE_URL)
  throw Error("An inherited Supabase project is prohibited in this fixture.");

const output = privateImagine
  ? "screenshots/private-imagine"
  : "screenshots/provider-settings";
mkdirSync(output, { recursive: true });
const network = `${privateImagine ? "private-imagine" : "provider-settings"}-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
const configPath = join(process.env.RUNNER_TEMP, `${network}.private.json`);
function createPrivateConfiguration(path) {
  const descriptor = openSync(path, "wx", 0o600);
  return {
    write: (configuration) =>
      writeFileSync(descriptor, JSON.stringify(configuration)),
    remove: () => {
      try {
        closeSync(descriptor);
      } finally {
        rmSync(path, { force: true });
      }
    },
  };
}
const secret = randomBytes(32).toString("hex");
const password = randomBytes(24).toString("hex");
const jwt = (role) => {
  const encode = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const body = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ role, iss: "supabase", iat: now, exp: now + 3600 })}`;
  return `${body}.${createHmac("sha256", secret).update(body).digest("base64url")}`;
};
const anon = jwt("anon");
const admin = jwt("service_role");
const containers = [];
const children = new Set();
let gateway;
let networkCreated = false;
let privateConfiguration;
let phase = "private-configuration-admission";
const receipt = {
  head,
  backend: "disposable PostgreSQL/GoTrue/PostgREST",
  productionWrites: 0,
  scope: privateImagine
    ? "Compiled private Imagine with real isolated password login/Postgres and actual Blob SDK using a bounded undici fixture; no live provider or paid creation acceptance"
    : "Compiled settings and real isolated password login; no production clone or provider output",
  passed: false,
  images: {},
  sourceHashes: {},
};
for (const file of [
  "scripts/run-provider-account-fixture.mjs",
  "scripts/verify-provider-settings-browser.cjs",
  "scripts/tests/provider-fixture-private-config.test.cjs",
  "supabase/tests/world-creator-service-fixture.sql",
  "apps/web/app/settings/providers/page.tsx",
  "apps/web/lib/auth/context.tsx",
  "apps/web/lib/ai/provider-preferences.ts",
  "apps/web/lib/supabase/middleware.ts",
  ...(privateImagine
    ? [
        "scripts/private-imagine-blob-fixture.cjs",
        "scripts/verify-private-imagine-browser.cjs",
        "scripts/tests/private-imagine-blob-fixture.test.cjs",
        "supabase/migrations/20261011000001_private_imagine_assets.sql",
        "apps/web/app/api/imagine/save/route.ts",
        "apps/web/app/api/imagine/gallery/route.ts",
        "apps/web/app/api/imagine/assets/[id]/route.ts",
        "apps/web/lib/imagine/private-assets-server.ts",
        "apps/web/lib/imagine/private-assets.ts",
        "apps/web/lib/imagine-favorites.ts",
        "apps/web/app/imagine/page.tsx",
        "apps/web/components/imagine/ImageCard.tsx",
        "apps/web/components/imagine/FavoritesPanel.tsx",
      ]
    : []),
])
  receipt.sourceHashes[file] = createHash("sha256")
    .update(readFileSync(file))
    .digest("hex");

const docker = (args, input) =>
  execFileSync("docker", args, {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 120000,
  }).trim();
function container(label, image, env, publish) {
  const name = `${network}-${label}`;
  const args = [
    "run",
    "--detach",
    "--name",
    name,
    "--network",
    network,
    "--network-alias",
    label,
    "--memory",
    "512m",
    "--cpus",
    "1",
  ];
  if (publish) args.push("--publish", `127.0.0.1:${publish}`);
  for (const [key, value] of Object.entries(env))
    args.push("--env", `${key}=${value}`);
  containers.push(name);
  docker([...args, image]);
  receipt.images[label] = docker(["inspect", "--format", "{{.Image}}", name]);
}
async function ready(url) {
  for (let index = 0; index < 60; index++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) return;
    } catch {
      // Only this job's loopback service is being polled.
    }
    await pause(500);
  }
  throw Error("The fixture service did not become ready.");
}
const inherited = Object.fromEntries(
  Object.entries(process.env).filter(
    ([name]) =>
      !/(?:KEY|TOKEN|PASSWORD|SECRET)$/.test(name) &&
      !/^(?:NEXT_PUBLIC_SUPABASE|SUPABASE_SERVICE|DATABASE_URL|DIRECT_URL|BILLING_RELEASE)/.test(
        name,
      ),
  ),
);
const env = {
  ...inherited,
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
  ...(privateImagine
    ? { PRIVATE_IMAGINE_FIXTURE: configPath }
    : { PROVIDER_SETTINGS_FIXTURE: configPath }),
};
async function run(command, args, timeoutMs) {
  const child = spawn(command, args, { env, stdio: "ignore", detached: true });
  children.add(child);
  const timer = setTimeout(() => {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      /* Own child already exited. */
    }
  }, timeoutMs);
  try {
    const code = await new Promise((done, reject) => {
      child.once("error", reject);
      child.once("exit", done);
    });
    if (code !== 0) throw Error("The private fixture command failed.");
  } finally {
    clearTimeout(timer);
    children.delete(child);
  }
}

try {
  privateConfiguration = createPrivateConfiguration(configPath);
  phase = "container-admission";
  docker(["network", "create", network]);
  networkCreated = true;
  container("db", "postgres:17", { POSTGRES_PASSWORD: password });
  const db = `${network}-db`;
  phase = "database-readiness";
  let dbReady = false;
  for (let index = 0; index < 60; index++) {
    try {
      docker(["exec", db, "pg_isready", "-h", "127.0.0.1", "-U", "postgres"]);
      dbReady = true;
      break;
    } catch {
      await pause(500);
    }
  }
  if (!dbReady) throw Error("The fixture database did not become ready.");
  phase = "schema-bootstrap";
  // Reuse the accepted projection fixture unchanged; never read production rows.
  docker(
    [
      "exec",
      "-i",
      db,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-v",
      `fixture_password=${password}`,
    ],
    readFileSync("supabase/tests/world-creator-service-fixture.sql", "utf8"),
  );
  container(
    "auth",
    "supabase/gotrue:v2.196.0",
    {
      GOTRUE_API_HOST: "0.0.0.0",
      GOTRUE_API_PORT: "9999",
      API_EXTERNAL_URL: "http://127.0.0.1:54321/auth/v1",
      GOTRUE_DB_DRIVER: "postgres",
      GOTRUE_DB_DATABASE_URL: `postgres://supabase_auth_admin:${password}@db:5432/postgres`,
      GOTRUE_SITE_URL: "http://localhost:3001",
      GOTRUE_URI_ALLOW_LIST: "http://localhost:3001/**",
      GOTRUE_DISABLE_SIGNUP: "true",
      GOTRUE_EXTERNAL_EMAIL_ENABLED: "true",
      GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED: "false",
      GOTRUE_MAILER_AUTOCONFIRM: "true",
      GOTRUE_JWT_ADMIN_ROLES: "service_role",
      GOTRUE_JWT_AUD: "authenticated",
      GOTRUE_JWT_DEFAULT_GROUP_NAME: "authenticated",
      GOTRUE_JWT_EXP: "3600",
      GOTRUE_JWT_SECRET: secret,
    },
    "54323:9999",
  );
  phase = "auth-readiness";
  await ready("http://127.0.0.1:54323/health");
  docker([
    "exec",
    db,
    "psql",
    "-U",
    "postgres",
    "-v",
    "ON_ERROR_STOP=1",
    "-c",
    "create or replace function auth.uid() returns uuid language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid $$;",
  ]);
  if (privateImagine) {
    phase = "private-image-migration";
    docker([
      "exec",
      db,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      "create or replace function auth.role() returns text language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')) $$;",
    ]);
    docker(
      ["exec", "-i", db, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1"],
      readFileSync(
        "supabase/migrations/20261011000001_private_imagine_assets.sql",
        "utf8",
      ),
    );
  }
  container(
    "rest",
    "postgrest/postgrest:v14.17",
    {
      PGRST_DB_URI: `postgres://authenticator:${password}@db:5432/postgres`,
      PGRST_DB_SCHEMAS: "public",
      PGRST_DB_ANON_ROLE: "anon",
      PGRST_JWT_SECRET: secret,
    },
    "54322:3000",
  );
  gateway = createServer((incoming, response) => {
    const auth = incoming.url?.startsWith("/auth/v1/");
    const rest = incoming.url?.startsWith("/rest/v1/");
    if (!auth && !rest) {
      response.writeHead(404).end();
      return;
    }
    const cors = {
      "access-control-allow-origin": "http://localhost:3001",
      "access-control-allow-headers":
        "authorization,apikey,content-type,x-client-info,x-supabase-api-version,x-supabase-client-platform,x-supabase-client-platform-version,x-supabase-client-runtime,x-supabase-client-runtime-version",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      vary: "Origin",
    };
    if (incoming.method === "OPTIONS") {
      response.writeHead(204, cors).end();
      return;
    }
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port: auth ? 54323 : 54322,
        path: incoming.url.slice(8),
        method: incoming.method,
        headers: incoming.headers,
        timeout: 10000,
      },
      (res) => {
        response.writeHead(res.statusCode, { ...res.headers, ...cors });
        res.pipe(response);
      },
    );
    upstream.on("timeout", () => upstream.destroy());
    upstream.on("error", () => {
      if (!response.headersSent) response.writeHead(503, cors);
      response.end();
    });
    incoming.on("aborted", () => upstream.destroy());
    incoming.pipe(upstream);
  });
  gateway.requestTimeout = 15000;
  gateway.headersTimeout = 10000;
  await new Promise((done) => gateway.listen(54321, "127.0.0.1", done));
  await ready("http://127.0.0.1:54321/rest/v1/");
  phase = "account-bootstrap";
  const accounts = [];
  for (let index = 0; index < 2; index++) {
    const account = {
      email: `provider-${index}@example.invalid`,
      password: randomBytes(24).toString("hex"),
    };
    const response = await fetch("http://127.0.0.1:54321/auth/v1/admin/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${admin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...account, email_confirm: true }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw Error("The disposable account could not be created.");
    account.id = (await response.json()).id;
    if (
      !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
        account.id,
      )
    )
      throw Error("Invalid fixture account identity.");
    docker([
      "exec",
      db,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      `insert into public.profiles(id,username,full_name) values ('${account.id}','fixture-${index}','Fixture ${index}');`,
    ]);
    if (privateImagine)
      docker([
        "exec",
        db,
        "psql",
        "-U",
        "postgres",
        "-v",
        "ON_ERROR_STOP=1",
        "-c",
        `insert into public.imagine_storage_accounts(user_id,capacity_bytes) values ('${account.id}',${index === 0 ? 16384 : 0});`,
      ]);
    accounts.push(account);
  }
  const blob = privateImagine
    ? {
        token: `vercel_blob_rw_arcaneafixture_${randomBytes(24).toString("hex")}`,
        apiOrigin: "https://blob-fixture.invalid",
        interruptedAssetIds: [
          "11111111-1111-4111-8111-111111111111",
          "22222222-2222-4222-8222-222222222222",
          "33333333-3333-4333-8333-333333333333",
        ],
      }
    : null;
  privateConfiguration.write({
    head,
    base: "http://localhost:3001",
    supabaseUrl: "http://127.0.0.1:54321",
    accounts,
    output,
    ...(privateImagine ? { blob } : {}),
  });
  phase = "compiled-app-build";
  await run("pnpm", ["turbo", "run", "build", "--filter=@arcanea/web"], 600000);
  phase = "browser-install";
  await run(
    "pnpm",
    [
      "--dir",
      "apps/web",
      "exec",
      "playwright",
      "install",
      "--with-deps",
      "chromium",
    ],
    120000,
  );
  phase = "app-readiness";
  const server = privateImagine
    ? spawn(
        "node",
        [
          "--require",
          join(process.cwd(), "scripts/private-imagine-blob-fixture.cjs"),
          join(process.cwd(), "apps/web/node_modules/next/dist/bin/next"),
          "start",
          "apps/web",
          "-H",
          "127.0.0.1",
          "-p",
          "3001",
        ],
        {
          env: {
            ...env,
            SUPABASE_SERVICE_ROLE_KEY: admin,
            PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN: blob.token,
            PRIVATE_IMAGINE_STORAGE_ENABLED: "true",
            VERCEL_BLOB_API_URL: blob.apiOrigin,
            VERCEL_BLOB_RETRIES: "0",
          },
          stdio: "ignore",
          detached: true,
        },
      )
    : spawn(
        "pnpm",
        [
          "--dir",
          "apps/web",
          "exec",
          "next",
          "start",
          "-H",
          "127.0.0.1",
          "-p",
          "3001",
        ],
        { env, stdio: "ignore", detached: true },
      );
  children.add(server);
  await ready("http://localhost:3001/auth/login");
  phase = privateImagine
    ? "protected-private-image-acceptance"
    : "protected-settings-acceptance";
  await run(
    "node",
    [
      privateImagine
        ? "scripts/verify-private-imagine-browser.cjs"
        : "scripts/verify-provider-settings-browser.cjs",
    ],
    privateImagine ? 360000 : 240000,
  );
  const acceptance = JSON.parse(
    readFileSync(`${output}/browser-evidence.json`, "utf8"),
  );
  if (
    acceptance.head !== head ||
    acceptance.passed !== true ||
    acceptance.realPasswordLogins !== 9 ||
    (privateImagine
      ? acceptance.liveSupplierPosts !== 0 || acceptance.modes.length !== 3
      : acceptance.aiPosts !== 0)
  )
    throw Error("The settings receipt did not earn exact-source acceptance.");
  if (privateImagine) {
    const storage = JSON.parse(
      readFileSync(`${output}/blob-transport-receipt.json`, "utf8"),
    );
    if (
      storage.puts < 3 ||
      storage.uncertainPuts !== 3 ||
      storage.invalidRequests !== 0 ||
      storage.productionWrites !== 0 ||
      storage.externalNetworkAllowed !== false
    )
      throw Error("Private SDK transport receipt is incomplete.");
    receipt.storage = storage;
    const accounting = JSON.parse(
      docker([
        "exec",
        db,
        "psql",
        "-U",
        "postgres",
        "-At",
        "-v",
        "ON_ERROR_STOP=1",
        "-c",
        "select json_build_object('readyBytes',coalesce((select sum(byte_size) from public.imagine_private_assets where status='ready'),0),'reservedBytes',coalesce((select sum(reserved_bytes) from public.imagine_storage_accounts),0),'usedBytes',coalesce((select sum(used_bytes) from public.imagine_storage_accounts),0),'rightsUnverified',not exists(select 1 from public.imagine_private_assets where rights_status <> 'unverified' or visibility <> 'private')); ",
      ]),
    );
    if (
      accounting.readyBytes !== accounting.usedBytes ||
      accounting.reservedBytes !== 0 ||
      !accounting.rightsUnverified
    )
      throw Error("Private accounting does not match retained ready bytes.");
    receipt.accounting = accounting;
  }
  receipt.acceptance = acceptance;
  receipt.passed = true;
} catch {
  receipt.failurePhase = phase;
  receipt.failure =
    "The isolated provider settings acceptance did not complete.";
  process.exitCode = 1;
  console.error(
    "Provider settings fixture failed; inspect safe retained evidence.",
  );
} finally {
  for (const child of children) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      /* Own child already exited. */
    }
  }
  gateway?.closeAllConnections();
  gateway?.close();
  const cleanupFailures = [];
  for (const name of containers.reverse()) {
    try {
      docker(["rm", "--force", name]);
    } catch {
      cleanupFailures.push("container");
    }
  }
  if (networkCreated) {
    try {
      docker(["network", "rm", network]);
    } catch {
      cleanupFailures.push("network");
    }
  }
  if (privateConfiguration) {
    try {
      privateConfiguration.remove();
    } catch {
      cleanupFailures.push("private-configuration");
    }
  }
  receipt.cleanup = {
    privateConfigurationRemoved:
      !privateConfiguration || !existsSync(configPath),
    failures: cleanupFailures,
  };
  if (cleanupFailures.length) {
    receipt.passed = false;
    process.exitCode = 1;
  }
  writeFileSync(
    `${output}/service-receipt.json`,
    JSON.stringify(receipt, null, 2),
  );
  console.log(
    JSON.stringify({
      head,
      phase,
      passed: receipt.passed,
      cleanupFailures: cleanupFailures.length,
    }),
  );
}

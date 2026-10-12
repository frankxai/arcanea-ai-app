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
import { createRequire } from "node:module";
import { setTimeout as pause } from "node:timers/promises";

// Reuses the accepted provider-account runner bootstrap at e07d568.
// This job creates its own loopback Auth/database and accepts no hosted secrets.
if (
  process.env.GITHUB_ACTIONS !== "true" ||
  process.env.GITHUB_REPOSITORY !== "frankxai/arcanea-ai-app" ||
  process.env.GITHUB_ACTOR !== "frankxai" ||
  process.env.GITHUB_EVENT_NAME !== "workflow_dispatch" ||
  process.env.RUNNER_OS !== "Linux" ||
  process.env.GITHUB_REF_NAME !==
    "agent/codex/project-document-recovery-20261011" ||
  !/^\d+$/.test(process.env.GITHUB_RUN_ID || "") ||
  !/^\d+$/.test(process.env.GITHUB_RUN_ATTEMPT || "") ||
  !isAbsolute(process.env.RUNNER_TEMP || "")
)
  throw Error("Document acceptance requires the owned hosted fixture lane.");
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
if (head !== process.env.GITHUB_SHA)
  throw Error("Document acceptance requires the exact checked-out source.");
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
])
  if (process.env[name])
    throw Error("Hosted credentials are prohibited in document acceptance.");
if (process.env.NEXT_PUBLIC_SUPABASE_URL)
  throw Error("An inherited Supabase project is prohibited in this fixture.");
for (const name of [
  "PRIVATE_IMAGINE_STORAGE_ENABLED",
  "DOCUMENT_MEDIA_BLOB_FIXTURE",
  "VERCEL_BLOB_API_URL",
  "NEXT_PUBLIC_VERCEL_BLOB_API_URL",
  "NODE_OPTIONS",
])
  if (process.env[name])
    throw Error("Inherited storage or preload configuration is prohibited.");

const output = "screenshots/project-document-service";
mkdirSync(output, { recursive: true });
const network = `project-document-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
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
  scope:
    "Compiled project documents and actual owner-scoped PostgreSQL with real isolated password login; no production clone or supplier output",
  passed: false,
  images: {},
  sourceHashes: {},
};
for (const file of [
  "scripts/run-project-document-service-fixture.mjs",
  "scripts/verify-project-document-browser.cjs",
  "scripts/document-media-blob-fixture.cjs",
  "scripts/tests/document-media-blob-fixture.test.cjs",
  "apps/web/lib/docs/media.ts",
  "apps/web/lib/docs/media-client.ts",
  "apps/web/lib/docs/media-outbox.ts",
  "scripts/tests/document-media-outbox.test.cjs",
  "apps/web/lib/docs/media-server.ts",
  "apps/web/lib/docs/portable-export.ts",
  "apps/web/app/api/projects/[id]/docs/[docId]/media/route.ts",
  "apps/web/app/api/projects/[id]/docs/[docId]/media/[assetId]/route.ts",
  "supabase/migrations/20261011000001_private_imagine_assets.sql",
  "supabase/migrations/20261012000001_project_doc_media.sql",
  "scripts/tests/provider-fixture-private-config.test.cjs",
  "supabase/tests/world-creator-service-fixture.sql",
  "apps/web/app/projects/[id]/docs/[docId]/page.tsx",
  "apps/web/app/api/projects/[id]/docs/[docId]/route.ts",
  "apps/web/app/api/projects/[id]/docs/route.ts",
  "apps/web/lib/docs/client.ts",
  "apps/web/lib/docs/save.ts",
  "apps/web/lib/author/draft-session.ts",
  "supabase/migrations/20261011131128_project_doc_revisions.sql",
  "apps/web/lib/auth/context.tsx",
  "apps/web/lib/ai/provider-preferences.ts",
  "apps/web/lib/supabase/middleware.ts",
  "apps/web/components/navigation/footer.tsx",
  "apps/web/app/layout.tsx",
  "apps/web/app/globals.css",
  "apps/web/components/navigation/navbar.tsx",
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
  PROJECT_DOCUMENT_FIXTURE: configPath,
};
const blobToken = `vercel_blob_rw_arcaneafixture_${randomBytes(24).toString("hex")}`;
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
  phase = "actual-document-migration";
  docker(
    ["exec", "-i", db, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1"],
    readFileSync(
      "supabase/migrations/20261011131128_project_doc_revisions.sql",
      "utf8",
    ),
  );
  // Explicit client grants and the actual migration's RLS/functions are exercised.
  docker(
    ["exec", "-i", db, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1"],
    "create or replace function auth.role() returns text language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role') $$;",
  );
  for (const migration of [
    "supabase/migrations/20261011000001_private_imagine_assets.sql",
    "supabase/migrations/20261012000001_project_doc_media.sql",
  ])
    docker(
      ["exec", "-i", db, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1"],
      readFileSync(migration, "utf8"),
    );
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
      email: `document-${index}@example.invalid`,
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
    accounts.push(account);
    docker([
      "exec",
      db,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      `insert into public.imagine_storage_accounts(user_id,capacity_bytes) values ('${account.id}',67108864);`,
    ]);
  }
  privateConfiguration.write({
    head,
    base: "http://localhost:3001",
    supabaseUrl: "http://127.0.0.1:54321",
    accounts,
    output,
    admin,
    blob: { token: blobToken },
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
  phase = "browser-original-restart";
  await run(
    process.execPath,
    ["--test", "scripts/tests/document-media-outbox.test.cjs"],
    90000,
  );
  receipt.browserOriginalRestartPassed = true;
  phase = "app-readiness";
  // Only the app child receives disposable admin/storage credentials. Browser
  // login still uses real isolated Auth, and all app authorization stays active.
  const serverEnv = {
    ...env,
    SUPABASE_SERVICE_ROLE_KEY: admin,
    PRIVATE_IMAGINE_STORAGE_ENABLED: "true",
    PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN: blobToken,
    VERCEL_BLOB_API_URL: "https://blob-fixture.invalid",
    DOCUMENT_MEDIA_BLOB_FIXTURE: configPath,
  };
  const server = spawn(
    process.execPath,
    [
      "--require",
      join(process.cwd(), "scripts/document-media-blob-fixture.cjs"),
      createRequire(join(process.cwd(), "apps/web/package.json")).resolve(
        "next/dist/bin/next",
      ),
      "start",
      "apps/web",
      "-H",
      "127.0.0.1",
      "-p",
      "3001",
    ],
    { env: serverEnv, stdio: "ignore", detached: true },
  );
  children.add(server);
  await ready("http://localhost:3001/auth/login");
  phase = "protected-document-acceptance";
  await run("node", ["scripts/verify-project-document-browser.cjs"], 240000);
  const acceptance = JSON.parse(
    readFileSync(`${output}/browser-evidence.json`, "utf8"),
  );
  if (
    acceptance.head !== head ||
    acceptance.passed !== true ||
    acceptance.realPasswordLogins !== 9 ||
    acceptance.supplierPosts !== 0
  )
    throw Error("The document receipt did not earn exact-source acceptance.");
  receipt.acceptance = acceptance;
  const transport = JSON.parse(
    readFileSync(`${output}/blob-transport-receipt.json`, "utf8"),
  );
  if (
    transport.puts !== 3 ||
    transport.productionWrites !== 0 ||
    transport.invalidRequests !== 0 ||
    !transport.objects.every((object) => object.size === 10485760) ||
    transport.reads < 9
  )
    throw Error(
      "The actual client/private SDK transport did not earn acceptance.",
    );
  receipt.blobTransport = transport;
  receipt.passed = true;
} catch {
  receipt.failurePhase = phase;
  receipt.failure =
    "The isolated project document acceptance did not complete.";
  process.exitCode = 1;
  console.error(
    "Project document fixture failed; inspect safe retained evidence.",
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

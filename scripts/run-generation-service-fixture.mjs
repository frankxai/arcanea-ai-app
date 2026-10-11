import { spawn, execFileSync } from "node:child_process";
import { createHmac, createHash, randomBytes } from "node:crypto";
import { createServer, request } from "node:http";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as pause } from "node:timers/promises";

// This runner owns disposable containers and a loopback-only gateway.
// Never use a hosted URL/key. The app receives only this disposable database's ephemeral service token.
if (
  process.env.GITHUB_ACTIONS !== "true" ||
  process.env.GITHUB_REPOSITORY !== "frankxai/arcanea-ai-app" ||
  process.env.GITHUB_REF_NAME !== "agent/codex/generation-admission-20261011"
)
  throw Error(
    "Disposable generation acceptance is restricted to the owned hosted lane.",
  );
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
// No inherited hosted provider, service credential or money rail may enter this fixture.
for (const key of [
  "SUPABASE_SERVICE_ROLE_KEY",
  "XAI_API_KEY",
  "OPENROUTER_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "FAL_KEY",
  "POLAR_ACCESS_TOKEN",
  "STRIPE_SECRET_KEY",
])
  if (process.env[key])
    throw Error(
      "Hosted credentials are prohibited in disposable generation acceptance",
    );
if (head !== process.env.GITHUB_SHA)
  throw Error("Acceptance must use the exact checked-out head.");
if (process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw Error("No inherited administrative credential is permitted.");
// Reuses the accepted world fixture bootstrap at8b91ac129e; the world runner is unchanged.
const output = "screenshots/generation-service";
mkdirSync(output, { recursive: true });
const secret = randomBytes(32).toString("hex");
const password = randomBytes(24).toString("hex");
function jwt(role) {
  const encoded = (x) => Buffer.from(JSON.stringify(x)).toString("base64url");
  const body = `${encoded({ alg: "HS256", typ: "JWT" })}.${encoded({ role, iss: "supabase", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 })}`;
  return `${body}.${createHmac("sha256", secret).update(body).digest("base64url")}`;
}
const anon = jwt("anon"),
  admin = jwt("service_role");
const network = `generation-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
const containers = [];
const children = new Set();
let gateway;
const fixtureKey = `fixture-${randomBytes(32).toString("hex")}`;
const jobs = new Map();
const supplier = { submissions: 0, polls: 0 };
const configPath = join(
  process.env.RUNNER_TEMP,
  "generation-fixture.private.json",
);
const receipt = {
  head,
  backend: "disposable Supabase Auth/PostgREST/PostgreSQL",
  productionWrites: 0,
  csp: "Disposable loopback browser exception only; production HTTPS CSP is unchanged and is not certified",
  providerCalls: 0,
  providerRequestsAttempted: 0,
  scope:
    "Actual password login, PostgreSQL billing recovery and rendered clients; deterministic supplier fixture, no production clone",
  passed: false,
};
let phase = "container-admission";
const acceptanceStarted = Date.now();
// Controlled phase names and the public source revision are safe diagnostics.
// Provider responses, child logs, private config and credentials stay private.
const heartbeat = setInterval(() => {
  console.log(
    JSON.stringify({
      fixture: "generation",
      head,
      phase,
      elapsedSeconds: Math.floor((Date.now() - acceptanceStarted) / 1000),
    }),
  );
}, 30000);
heartbeat.unref();

const docker = (args) =>
  execFileSync("docker", args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 120000,
  }).trim();
function container(label, image, env, port) {
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
  if (label === "db" || label === "audit-db")
    args.push(
      "--mount",
      `type=bind,source=${resolve("supabase")},target=/fixtures,readonly`,
    );
  if (port) args.push("--publish", `127.0.0.1:${port}`);
  for (const [key, value] of Object.entries(env))
    args.push("--env", `${key}=${value}`);
  args.push(image);
  // Record the name before starting so a partial startup is still cleaned up.
  containers.push(name);
  docker(args);
  receipt.images ??= {};
  receipt.images[label] = docker(["inspect", "--format", "{{.Image}}", name]);
}
async function ready(url) {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(2000) })).ok) return;
    } catch {
      /* The session-owned resource may already have exited or produced no safe receipt. */
    }
    await pause(500);
  }
  throw Error(`Fixture readiness failed: ${new URL(url).pathname}`);
}
async function run(command, args, env, timeoutMs) {
  const child = spawn(command, args, {
    env: { ...process.env, ...env },
    // Assertions and subprocess errors can contain fixture credentials. Keep
    // subprocess output private; retain only controlled phases and safe artifacts.
    stdio: "ignore",
    detached: true,
  });
  children.add(child);
  const timer = setTimeout(() => {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      /* The session-owned resource may already have exited or produced no safe receipt. */
    }
  }, timeoutMs);
  const code = await new Promise((done, reject) => {
    child.once("error", reject);
    child.once("exit", done);
  });
  clearTimeout(timer);
  children.delete(child);
  if (code !== 0)
    throw Error(`Fixture command failed: ${command} (exit ${code})`);
}
try {
  docker(["network", "create", network]);
  container("db", "postgres:17", { POSTGRES_PASSWORD: password }, undefined);
  phase = "financial-sql-audit";
  container(
    "audit-db",
    "postgres:17",
    { POSTGRES_PASSWORD: password },
    undefined,
  );
  let auditReady = false;
  for (let i = 0; i < 60; i++) {
    try {
      docker([
        "exec",
        `${network}-audit-db`,
        "pg_isready",
        "-h",
        "127.0.0.1",
        "-U",
        "postgres",
      ]);
      auditReady = true;
      break;
    } catch {
      await pause(500);
    }
  }
  if (!auditReady) throw Error("Financial fixture database not ready");
  docker([
    "exec",
    `${network}-audit-db`,
    "psql",
    "-U",
    "postgres",
    "-v",
    "ON_ERROR_STOP=1",
    "-f",
    "/fixtures/tests/billing-kernel.sql",
  ]);
  docker([
    "exec",
    "--env",
    `PGPASSWORD=${password}`,
    `${network}-audit-db`,
    "bash",
    "/fixtures/tests/billing-concurrency.sh",
  ]);
  receipt.financialSql =
    "actual kernel and recovery migration assertions plus concurrent finalization/duplicate checks passed";
  docker(["stop", `${network}-audit-db`]);

  const db = `${network}-db`;
  let available = false;
  for (let i = 0; i < 60; i++) {
    try {
      // The entrypoint's temporary init server only listens on a Unix socket.
      // Require TCP readiness so seeding cannot race its intentional shutdown.
      docker(["exec", db, "pg_isready", "-h", "127.0.0.1", "-U", "postgres"]);
      available = true;
      break;
    } catch {
      await pause(500);
    }
  }
  if (!available) throw Error("Fixture database readiness failed.");
  execFileSync(
    "docker",
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
    {
      input: readFileSync("supabase/tests/world-creator-service-fixture.sql"),
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30000,
    },
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
    "create or replace function auth.uid() returns uuid language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid $$; alter table public.worlds add foreign key(creator_id) references auth.users(id); alter table public.world_creations add foreign key(creator_id) references auth.users(id); alter table public.world_collaborators add foreign key(user_id) references auth.users(id);",
  ]);
  phase = "generation-schema";
  for (const file of [
    "supabase/migrations/20261005000001_billing_kernel.sql",
    "supabase/migrations/20261010000001_billing_recovery.sql",
    "supabase/tests/generation-service-fixture.sql",
  ]) {
    execFileSync(
      "docker",
      ["exec", "-i", db, "psql", "-U", "postgres", "-v", "ON_ERROR_STOP=1"],
      {
        input: readFileSync(file),
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 30000,
      },
    );
    receipt.sourceHashes ??= {};
    receipt.sourceHashes[file] = createHash("sha256")
      .update(readFileSync(file))
      .digest("hex");
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
    if (incoming.url === "/fixture-state") {
      if (incoming.headers.authorization !== `Bearer ${fixtureKey}`) {
        response.writeHead(403).end();
        return;
      }
      response
        .writeHead(200, { "content-type": "application/json" })
        .end(JSON.stringify(supplier));
      return;
    }
    if (incoming.url?.startsWith("/v1/images/")) {
      if (incoming.headers.authorization !== `Bearer ${fixtureKey}`) {
        response.writeHead(403).end();
        return;
      }
      if (
        incoming.url === "/v1/images/generations" &&
        incoming.method === "POST"
      ) {
        let body = "";
        incoming.on("data", (chunk) => {
          body += chunk;
          if (body.length > 10000) incoming.destroy();
        });
        incoming.on("end", () => {
          try {
            const value = JSON.parse(body);
            if (
              value.model !== "grok-imagine-image-2.0" ||
              value.deferred !== true ||
              !Number.isInteger(value.n) ||
              value.n < 1 ||
              value.n > 4
            )
              throw Error();
            const id = `fixture-${++supplier.submissions}`;
            jobs.set(id, { ...value, firstPoll: true });
            response
              .writeHead(200, { "content-type": "application/json" })
              .end(JSON.stringify({ request_id: id }));
          } catch {
            response.writeHead(422).end();
          }
        });
        return;
      }
      if (incoming.method === "GET") {
        supplier.polls++;
        const id = incoming.url.slice("/v1/images/".length);
        const job = jobs.get(id);
        if (!job) {
          response.writeHead(404).end();
          return;
        }
        if (job.prompt.includes("interrupt-fixture") && job.firstPoll) {
          job.firstPoll = false;
          response.writeHead(503).end();
          return;
        }
        response.writeHead(200, { "content-type": "application/json" }).end(
          JSON.stringify({
            status: "done",
            data: Array.from({ length: job.n }, (_, index) => ({
              url: `https://generation-fixture.invalid/${id}-${index}.webp`,
            })),
          }),
        );
        return;
      }
      response.writeHead(405).end();
      return;
    }
    const auth = incoming.url?.startsWith("/auth/v1/");
    const rest = incoming.url?.startsWith("/rest/v1/");
    if (!auth && !rest) {
      response.writeHead(404).end();
      return;
    }
    const headers = {
      "access-control-allow-origin": "http://localhost:3001",
      "access-control-allow-headers":
        "authorization,apikey,content-type,x-client-info,x-supabase-api-version,x-supabase-client-platform,x-supabase-client-platform-version,x-supabase-client-runtime,x-supabase-client-runtime-version",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      vary: "Origin",
    };
    if (incoming.method === "OPTIONS") {
      response.writeHead(204, headers).end();
      return;
    }
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port: auth ? 54323 : 54322,
        path: incoming.url.slice(auth ? 8 : 8),
        method: incoming.method,
        headers: incoming.headers,
        timeout: 10000,
      },
      (res) => {
        response.writeHead(res.statusCode, { ...res.headers, ...headers });
        res.pipe(response);
      },
    );
    upstream.on("timeout", () => upstream.destroy());
    upstream.on("error", () => {
      if (!response.headersSent) response.writeHead(503, headers);
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
  for (let i = 0; i < 2; i++) {
    const account = {
      email: `generation-${i}@example.invalid`,
      password: randomBytes(24).toString("hex"),
    };
    const res = await fetch("http://127.0.0.1:54321/auth/v1/admin/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${admin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...account, email_confirm: true }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok)
      throw Error(`Disposable account bootstrap failed (${res.status}).`);
    account.id = (await res.json()).id;
    if (!/^[a-f0-9-]{36}$/.test(account.id))
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
      `insert into public.profiles(id,username,full_name) values ('${account.id}','fixture-${i}','Fixture ${i}');`,
    ]);
    docker([
      "exec",
      db,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      `select public.billing_ensure_account('${account.id}',25); select public.billing_grant_credits('${account.id}',975,'grant','fixture:${account.id}'); insert into public.pages(slug,owner_id,title,summary) values ('generation-fixture-${i}','${account.id}','Generation fixture article','Private deterministic acceptance');`,
    ]);
    accounts.push(account);
  }
  writeFileSync(
    configPath,
    JSON.stringify({
      head,
      base: "http://localhost:3001",
      supabaseUrl: "http://127.0.0.1:54321",
      anon,
      admin,
      fixtureKey,
      imageFile: resolve("apps/web/public/story/first-light.webp"),
      accounts,
      output,
    }),
    { mode: 0o600 },
  );
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
    GENERATION_TEST_CONFIG: configPath,
    SUPABASE_SERVICE_ROLE_KEY: admin,
    XAI_API_KEY: fixtureKey,
    GENERATION_FIXTURE_ORIGIN: "http://127.0.0.1:54321",
    OPENROUTER_API_KEY: "",
    GEMINI_API_KEY: "",
    GOOGLE_API_KEY: "",
    FAL_KEY: "",
    POLAR_ACCESS_TOKEN: "",
    BILLING_RELEASE: "",
    BLOB_READ_WRITE_TOKEN: "",
  };
  delete process.env.GITHUB_TOKEN;
  phase = "compiled-app-build";
  await run(
    "pnpm",
    ["turbo", "run", "build", "--filter=@arcanea/web"],
    env,
    600000,
  );
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
    env,
    120000,
  );
  const server = spawn(
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
    {
      env: {
        ...process.env,
        ...env,
        NODE_OPTIONS: `--import ${resolve("scripts/generation-provider-fixture.mjs")}`,
      },
      stdio: "ignore",
      detached: true,
    },
  );
  children.add(server);
  await ready("http://localhost:3001/studio/image");
  phase = "browser-acceptance";
  await run(
    "node",
    ["scripts/verify-generation-preview-browser.cjs"],
    env,
    240000,
  );
  const acceptance = JSON.parse(
    readFileSync(`${output}/browser-evidence.json`, "utf8"),
  );
  if (acceptance.head !== head || acceptance.passed !== true)
    throw Error("Generation evidence is not an exact-head acceptance pass");
  receipt.providerCalls = 0;
  receipt.fixtureSupplier = supplier;
  receipt.providerRequestsAttempted = 0;
  receipt.passed = true;
} catch {
  // Docker and authentication errors may include private environment values.
  receipt.failure = "Hosted disposable acceptance did not complete.";
  receipt.failurePhase = phase;
  try {
    const evidence = JSON.parse(
      readFileSync(`${output}/browser-evidence.json`, "utf8"),
    );
    if (evidence.head === head) {
      for (const [field, source] of [
        ["providerCalls", "actualProviderCalls"],
        ["providerRequestsAttempted", "providerRequestsAttempted"],
      ]) {
        if (
          Number.isInteger(evidence[source]) &&
          evidence[source] >= 0 &&
          evidence[source] <= 2
        )
          receipt[field] = evidence[source];
      }
    }
  } catch {
    /* The session-owned resource may already have exited or produced no safe receipt. */
  }
  // No exception, container log, token or password is emitted. The controlled
  // failure phase and masked browser screenshot are the diagnostics boundary.
  console.error(
    "Hosted disposable generation acceptance failed; inspect retained safe browser evidence.",
  );
  process.exitCode = 1;
} finally {
  clearInterval(heartbeat);
  for (const child of children) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      /* The session-owned resource may already have exited or produced no safe receipt. */
    }
  }
  gateway?.closeAllConnections();
  gateway?.close();
  for (const name of containers.reverse()) {
    try {
      docker(["rm", "--force", name]);
    } catch {
      /* The session-owned resource may already have exited or produced no safe receipt. */
    }
  }
  try {
    docker(["network", "rm", network]);
  } catch {
    /* The session-owned resource may already have exited or produced no safe receipt. */
  }
  rmSync(configPath, { force: true });
  writeFileSync(
    `${output}/service-receipt.json`,
    JSON.stringify(receipt, null, 2),
  );
}

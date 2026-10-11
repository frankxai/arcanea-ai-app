const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const { execFileSync } = require("node:child_process");

const repo = path.resolve(__dirname, "../..");
const file =
  process.env.PRIVATE_CONFIGURATION_RUNNER ??
  (process.env.PROJECT_DOCUMENT_CONFIG_FIXTURE === "true"
    ? "scripts/run-project-document-service-fixture.mjs"
    : "scripts/run-provider-account-fixture.mjs");
if (
  ![
    "scripts/run-provider-account-fixture.mjs",
    "scripts/run-reading-scene-auth-fixture.mjs",
    "scripts/run-project-document-service-fixture.mjs",
  ].includes(file)
)
  throw Error("Use an admitted fixture runner.");
const ref =
  process.env.PRIVATE_CONFIGURATION_SOURCE_REF ??
  process.env.PROVIDER_FIXTURE_SOURCE_REF;
if (ref && !/^[0-9a-f]{40}$/.test(ref))
  throw Error("Use an immutable fixture source.");
const source = ref
  ? execFileSync("git", ["show", `${ref}:${file}`], {
      cwd: repo,
      encoding: "utf8",
    })
  : fs.readFileSync(path.join(repo, file), "utf8");
const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
let factory;
let legacyWrite;
let legacyRemove;
function visit(node) {
  if (
    ts.isFunctionDeclaration(node) &&
    node.name?.text === "createPrivateConfiguration"
  )
    factory = node.getText(parsed);
  if (
    ts.isCallExpression(node) &&
    node.arguments[0]?.getText(parsed) === "configPath"
  ) {
    if (node.expression.getText(parsed) === "writeFileSync")
      legacyWrite = node.getText(parsed);
    if (node.expression.getText(parsed) === "rmSync")
      legacyRemove = node.getText(parsed);
  }
  ts.forEachChild(node, visit);
}
visit(parsed);
assert.ok(
  factory || (legacyWrite && legacyRemove),
  "Exercise the actual runner's configuration operations.",
);

function fixture(t, overrides = {}) {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "arcanea-provider-config-"),
  );
  const configPath = path.join(directory, "fixture.json");
  t.after(() => {
    assert.equal(path.dirname(configPath), directory);
    fs.rmSync(configPath, { force: true });
    fs.rmdirSync(directory);
  });
  const context = {
    exports: {},
    openSync: fs.openSync,
    closeSync: fs.closeSync,
    writeFileSync: fs.writeFileSync,
    rmSync: fs.rmSync,
    ...overrides,
  };
  if (factory) {
    vm.runInNewContext(
      `${factory}; exports.create = createPrivateConfiguration;`,
      context,
    );
  } else {
    // Reproduce a file arriving after the old existsSync admission check.
    // These are the old runner's actual write and cleanup expressions.
    context.configPath = configPath;
    context.head = "fixture-source";
    context.accounts = [];
    context.output = "fixture-output";
    context.env = { NEXT_PUBLIC_SUPABASE_URL: "http://fixture.invalid" };
    context.anon = "synthetic-fixture-value";
    vm.runInNewContext(
      `exports.create = () => ({ write: () => { ${legacyWrite}; }, remove: () => { ${legacyRemove}; } });`,
      context,
    );
  }
  return { configPath, create: () => context.exports.create(configPath) };
}

test("a file arriving before allocation is preserved and yields no cleanup handle", (t) => {
  const { configPath, create } = fixture(t);
  const sentinel = "Other owner fixture data";
  fs.writeFileSync(configPath, sentinel);
  let owned;
  assert.throws(
    () => {
      owned = create();
      owned.write({ fixture: "new configuration" });
    },
    { code: "EEXIST" },
  );
  assert.equal(owned, undefined);
  owned?.remove();
  assert.equal(fs.readFileSync(configPath, "utf8"), sentinel);
});

test("exclusive configuration writes through its owned descriptor and cleans up", (t) => {
  let opened;
  let written;
  let closed;
  const { configPath, create } = fixture(t, {
    openSync: (...args) => (opened = fs.openSync(...args)),
    writeFileSync: (target, value) => {
      written = target;
      fs.writeFileSync(target, value);
    },
    closeSync: (descriptor) => {
      closed = descriptor;
      fs.closeSync(descriptor);
    },
  });
  const owned = create();
  try {
    owned.write({ fixture: "safe configuration" });
    assert.equal(typeof opened, "number");
    assert.equal(written, opened);
    assert.deepEqual(JSON.parse(fs.readFileSync(configPath, "utf8")), {
      fixture: "safe configuration",
    });
    if (process.platform !== "win32")
      assert.equal(fs.statSync(configPath).mode & 0o777, 0o600);
  } finally {
    owned.remove();
  }
  assert.equal(closed, opened);
  assert.equal(fs.existsSync(configPath), false);
});

test("an interrupted private write still closes and removes only the owned configuration", (t) => {
  let closed = false;
  const { configPath, create } = fixture(t, {
    writeFileSync: () => {
      throw Error("Fixture write interrupted");
    },
    closeSync: (descriptor) => {
      fs.closeSync(descriptor);
      closed = true;
    },
  });
  const owned = create();
  try {
    assert.throws(
      () => owned.write({ fixture: true }),
      /Fixture write interrupted/,
    );
  } finally {
    owned.remove();
  }
  assert.equal(closed, true);
  assert.equal(fs.existsSync(configPath), false);
});

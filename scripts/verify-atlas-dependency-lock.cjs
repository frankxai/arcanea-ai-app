"use strict";
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const atlas = path.join(root, "docs/atlas");
const base = "d2285fb74f296ce783d3f0fed9bdef6959e3f9d9";
const astro = createRequire(fs.realpathSync(path.join(atlas, "node_modules/astro/package.json")));
const { load } = astro("js-yaml");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const original = (name) => execFileSync("git", ["show", `${base}:${name}`], { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
const before = load(original("docs/atlas/pnpm-lock.yaml"));
const reference = load(original("pnpm-lock.yaml"));
const actual = load(read("docs/atlas/pnpm-lock.yaml"));
const metadata = new Set(["resolution", "engines", "cpu", "os", "peerDependencies", "peerDependenciesMeta", "hasBin"]);
const state = new Set(["dependencies", "optionalDependencies", "transitivePeerDependencies", "optional"]);
const legacy = new Set(["dev", "requiresBuild"]);
const overrides = { "sharp@>=0.35.0 <0.35.5": "0.35.5", "source-map-js@>=1.0.0 <1.2.2": "1.2.2" };
const target = (name) => name === "sharp" || name === "source-map-js" || name.startsWith("@img/sharp-");
const select = (node, keys) => Object.fromEntries(Object.entries(node).filter(([key]) => keys.has(key)));

function redirect(name, version) {
  if (name === "source-map-js") {
    assert.equal(version, "1.2.1");
    return "1.2.2";
  }
  if (name.startsWith("@img/sharp-libvips-")) {
    assert.equal(version, "1.3.3");
    return "1.3.4";
  }
  if (name === "sharp" || name.startsWith("@img/sharp-")) return version.replace(/^0\.35\.4(?=\(|$)/, "0.35.5");
  return version;
}

const packages = {};
const snapshots = {};
let patched = 0;
for (const [key, value] of Object.entries(before.packages)) {
  assert.ok(key.startsWith("/"));
  for (const field of Object.keys(value)) assert.ok(metadata.has(field) || state.has(field) || legacy.has(field), `${key}: unknown legacy field ${field}`);
  let snapshot = key.slice(1);
  let plain = snapshot.split("(")[0];
  const split = plain.lastIndexOf("@");
  const name = plain.slice(0, split);
  if (target(name)) {
    const updated = `${name}@${redirect(name, plain.slice(split + 1))}`;
    snapshot = updated + snapshot.slice(plain.length);
    plain = updated;
    patched++;
  }
  const meta = target(name) ? reference.packages[plain] : select(value, metadata);
  assert.ok(meta, `missing immutable reference metadata: ${plain}`);
  if (packages[plain]) assert.deepEqual(packages[plain], meta);
  packages[plain] = meta;
  const node = structuredClone(select(value, state));
  for (const field of ["dependencies", "optionalDependencies"]) {
    if (node[field]) node[field] = Object.fromEntries(Object.entries(node[field]).map(([dependency, version]) => [dependency, redirect(dependency, version)]));
  }
  for (const [peer, options] of Object.entries(meta.peerDependenciesMeta || {})) {
    if (options.optional && Object.hasOwn(node.dependencies || {}, peer)) {
      node.optionalDependencies ??= {};
      node.optionalDependencies[peer] = node.dependencies[peer];
      delete node.dependencies[peer];
    }
  }
  if (node.dependencies && !Object.keys(node.dependencies).length) delete node.dependencies;
  assert.ok(!Object.hasOwn(snapshots, snapshot), `duplicate snapshot ${snapshot}`);
  snapshots[snapshot] = node;
}

assert.deepEqual(actual, {
  lockfileVersion: "9.0",
  settings: before.settings,
  overrides,
  importers: { ".": { dependencies: before.dependencies, devDependencies: before.devDependencies } },
  packages,
  snapshots,
});
assert.deepEqual(load(read("docs/atlas/pnpm-workspace.yaml")), { packages: ["."], allowBuilds: {}, overrides });
const manifest = JSON.parse(read("docs/atlas/package.json"));
const expectedManifest = JSON.parse(original("docs/atlas/package.json"));
expectedManifest.packageManager = JSON.parse(read("package.json")).packageManager;
assert.deepEqual(manifest, expectedManifest);
console.log(JSON.stringify({ base, snapshots: Object.keys(snapshots).length, metadataRecords: Object.keys(packages).length, patchedNodes: patched, unrelatedGraphPreserved: true }));

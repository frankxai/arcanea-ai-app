"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const repo = path.resolve(__dirname, "../..");
// An explicit package path is for the preserved upstream before/after fixture.
const entry = process.argv[2]
  ? path.resolve(process.argv[2])
  : require.resolve("fast-uri", {
      paths: [path.join(repo, "node_modules/.pnpm/node_modules")],
    });
const uri = require(entry);

test("scheme-relative encoded host letters have one canonical spelling", () => {
  const encoded = "//%41.example/";
  const literal = "//a.example/";
  assert.equal(uri.parse(encoded).host, "a.example");
  assert.equal(uri.normalize(encoded), literal);
  assert.equal(uri.normalize(uri.normalize(encoded)), literal);
  assert.equal(uri.equal(encoded, literal), true);
  assert.equal(
    uri.resolve("https://trusted.example/", "//%4Dodel.example/path"),
    uri.resolve("https://trusted.example/", "//model.example/path"),
  );
});

test("host normalization also applies to handlers that skip path normalization", () => {
  assert.equal(uri.parse("mailto://%41.example").host, "a.example");
  assert.equal(uri.normalize("mailto://%41.example"), "mailto://a.example");
  assert.equal(uri.equal("mailto://%41.example", "mailto://a.example"), true);
});

test("nested and reserved host escapes remain data", () => {
  assert.equal(uri.normalize("//%2541.example"), "//%2541.example");
  assert.equal(uri.equal("//%2541.example", "//a.example"), false);
  assert.equal(uri.normalize("//example.com%2fpath"), "//example.com%2Fpath");
  assert.equal(
    uri.normalize("http://allowed.example%255Cother.example/"),
    "http://allowed.example%255Cother.example/",
  );
});

test("userinfo, path and query retain their case-sensitive identities", () => {
  assert.equal(uri.equal("//User@%41.example/x", "//user@a.example/x"), false);
  assert.equal(uri.equal("//%41.example/Path", "//a.example/path"), false);
  assert.equal(uri.equal("//%41.example/?Token=Value", "//a.example/?token=value"), false);
});

test("IP literals and valid URI resolution keep their established meanings", () => {
  assert.equal(uri.equal("http://[2001:DB8::1]/", "http://[2001:db8::1]/"), true);
  assert.equal(uri.parse("http://127.0.0.1:8080/a").host, "127.0.0.1");
  assert.equal(uri.resolve("https://a.example/dir/file", "../next?q=One"), "https://a.example/next?q=One");
});

test("encoded path separators and dot segments are never activated", () => {
  assert.equal(uri.normalize("http://a.example/a%2fb"), "http://a.example/a%2Fb");
  assert.equal(uri.equal("http://a.example/a%2Fb", "http://a.example/a/b"), false);
  assert.equal(uri.equal("http://a.example/public/%2e%2e/admin", "http://a.example/admin"), false);
  for (const reserved of [";", "=", "&", "$", ":", "@"]) {
    const value = "http://a.example/a" + reserved + "b";
    assert.equal(uri.serialize(uri.parse(value)), value);
  }
});

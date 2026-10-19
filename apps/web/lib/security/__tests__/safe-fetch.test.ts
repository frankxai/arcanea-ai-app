/**
 * SSRF guard tests. Run with: npx tsx --test apps/web/lib/security/__tests__/safe-fetch.test.ts
 */

import assert from "node:assert/strict";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { test } from "node:test";

import {
  assertPublicUrl,
  isBlockedIp,
  safeFetchText,
  UnsafeUrlError,
} from "../safe-fetch";

const blocked = [
  "http://localhost/",
  "http://localhost./",
  "http://foo.localhost./",
  "http://printer.local./",
  "http://metadata.google.internal./",
  "http://intranet/",
  "http://127.0.0.1/",
  "http://2130706433/",
  "http://0x7f.1/",
  "http://017700000001/",
  "http://0/",
  "http://10.1.2.3/",
  "http://100.64.0.1/",
  "http://169.254.169.254/latest/meta-data",
  "http://172.20.0.1/",
  "http://192.168.1.1/",
  "http://198.18.0.1/",
  "http://192.0.0.8/",
  "http://[::1]/",
  "http://[0:0:0:0:0:0:0:1]/",
  "http://[::127.0.0.1]/",
  "http://[::ffff:127.0.0.1]/",
  "http://[::ffff:7f00:1]/",
  "http://[64:ff9b::7f00:1]/",
  "http://[64:ff9b::a9fe:a9fe]/",
  "http://[2002:7f00:1::]/",
  "http://[fd00::1]/",
  "http://[fe80::1]/",
  "http://[fec0::1]/",
  "file:///etc/passwd",
  "ftp://example.com/",
  "http://user:pw@example.com/",
];

const allowed = [
  "https://example.com/",
  "https://en.wikipedia.org/wiki/Arcanea",
  "https://sub.example.co.uk:8443/p",
  "http://8.8.8.8/",
  "http://[2606:4700:4700::1111]/",
  "http://[64:ff9b::808:808]/",
];

test("static checks block private, internal and non-http targets", () => {
  for (const url of blocked) {
    assert.throws(() => assertPublicUrl(url), UnsafeUrlError, url);
  }
});

test("static checks allow public targets", () => {
  for (const url of allowed) {
    assert.doesNotThrow(() => assertPublicUrl(url), url);
  }
});

test("isBlockedIp covers resolved addresses", () => {
  for (const ip of [
    "127.0.0.1",
    "::1",
    "10.0.0.1",
    "fd12::1",
    "::ffff:169.254.169.254",
  ]) {
    assert.equal(isBlockedIp(ip), true, ip);
  }
  for (const ip of ["1.1.1.1", "2606:4700:4700::1111"]) {
    assert.equal(isBlockedIp(ip), false, ip);
  }
});

test("a public-looking name that resolves to loopback is refused at connect time", async () => {
  const server = http
    .createServer((_, res) => res.end("secret"))
    .listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const { port } = server.address() as AddressInfo;
  try {
    // localtest.me is a public DNS name whose A/AAAA records point at loopback.
    await assert.rejects(
      safeFetchText(`http://localtest.me:${port}/`),
      /non-public address/,
    );
  } finally {
    server.close();
  }
});

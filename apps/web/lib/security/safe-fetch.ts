/**
 * Server-side fetch for URLs chosen by a user.
 *
 * The server must not become a proxy into loopback, private, link-local or
 * cloud-metadata networks (SSRF). Hostname checks alone are not enough: any
 * public DNS name can point at 127.0.0.1, and a name can re-resolve between a
 * check and the connect (DNS rebinding). So every hop is resolved here, every
 * address is checked, and the socket connects to exactly the address that was
 * checked via a custom `lookup`.
 *
 * Node runtime only.
 */

import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import http from "node:http";
import https from "node:https";
import { isIP } from "node:net";

const MAX_REDIRECTS = 3;
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 15_000;

export class UnsafeUrlError extends Error {}

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((n, part) => (n << 8) + Number(part), 0) >>> 0;
}

function inV4(ip: string, base: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

const BLOCKED_V4: [string, number][] = [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8],
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8],
  ["169.254.0.0", 16], // link-local, cloud metadata
  ["172.16.0.0", 12],
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // documentation
  ["192.168.0.0", 16],
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved + broadcast
];

/** Expand an IPv6 literal to eight 16-bit groups (handles an embedded IPv4 tail). */
function ipv6Groups(ip: string): number[] {
  let text = ip.toLowerCase().split("%")[0];
  const v4Tail = text.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (v4Tail) {
    const n = ipv4ToInt(v4Tail[1]);
    text =
      text.slice(0, -v4Tail[1].length) +
      `${(n >>> 16).toString(16)}:${(n & 0xffff).toString(16)}`;
  }
  const [head, tail] = text.split("::");
  const parse = (s: string | undefined) =>
    s ? s.split(":").map((g) => parseInt(g, 16)) : [];
  const left = parse(head);
  const right = tail === undefined ? [] : parse(tail);
  const fill =
    tail === undefined ? [] : new Array(8 - left.length - right.length).fill(0);
  return [...left, ...fill, ...right];
}

function groupsToV4(hi: number, lo: number): string {
  return [hi >> 8, hi & 0xff, lo >> 8, lo & 0xff].join(".");
}

export function isBlockedIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4)
    return BLOCKED_V4.some(([base, bits]) => inV4(ip, base, bits));
  if (version !== 6) return true; // not an IP at all: refuse rather than guess

  const g = ipv6Groups(ip);
  const allZeroTo = (n: number) => g.slice(0, n).every((x) => x === 0);
  // IPv4 carried inside IPv6 is judged by the IPv4 rules.
  if (allZeroTo(5) && g[5] === 0xffff)
    return isBlockedIp(groupsToV4(g[6], g[7])); // ::ffff:a.b.c.d
  if (allZeroTo(6)) return true; // ::, ::1, and deprecated ::a.b.c.d
  if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((x) => x === 0)) {
    return isBlockedIp(groupsToV4(g[6], g[7])); // NAT64 64:ff9b::/96
  }
  if (g[0] === 0x2002) return isBlockedIp(groupsToV4(g[1], g[2])); // 6to4
  const first = g[0];
  return (
    (first & 0xfe00) === 0xfc00 || // fc00::/7 unique-local
    (first & 0xffc0) === 0xfe80 || // fe80::/10 link-local
    (first & 0xffc0) === 0xfec0 || // fec0::/10 site-local
    (first & 0xff00) === 0xff00 || // multicast
    (first === 0x2001 && g[1] === 0x0db8) // documentation
  );
}

function blockedHostname(hostname: string): boolean {
  const host = hostname
    .replace(/^\[|\]$/g, "")
    .replace(/\.+$/, "")
    .toLowerCase();
  if (isIP(host)) return isBlockedIp(host);
  return (
    host === "" ||
    !host.includes(".") ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".home.arpa")
  );
}

/** Parse and apply the static checks. Throws UnsafeUrlError. */
export function assertPublicUrl(raw: string | URL): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new UnsafeUrlError("Invalid URL");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new UnsafeUrlError("Only http(s) URLs can be ingested");
  }
  if (parsed.username || parsed.password || blockedHostname(parsed.hostname)) {
    throw new UnsafeUrlError("URL host is not allowed");
  }
  return parsed;
}

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | LookupAddress[],
  family?: number,
) => void;

/** DNS lookup that refuses if ANY resolved address is blocked; the socket uses what it returns. */
function guardedLookup(
  hostname: string,
  options: { all?: boolean },
  callback: LookupCallback,
) {
  dnsLookup(hostname, { all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(err, "");
    const list = addresses as LookupAddress[];
    const bad = list.find((a) => isBlockedIp(a.address));
    if (!list.length || bad) {
      return callback(
        Object.assign(
          new UnsafeUrlError("URL resolves to a non-public address"),
          { code: "EUNSAFEHOST" },
        ),
        "",
      );
    }
    if (options?.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

export interface SafeResponse {
  status: number;
  url: string;
  contentType: string;
  text: string;
}

function requestOnce(
  target: URL,
  maxBytes: number,
  timeoutMs: number,
  headers: Record<string, string>,
) {
  return new Promise<{
    status: number;
    location: string | null;
    contentType: string;
    body: Buffer;
  }>((resolve, reject) => {
    const client = target.protocol === "https:" ? https : http;
    const req = client.request(
      target,
      {
        method: "GET",
        headers,
        lookup: guardedLookup as never,
        timeout: timeoutMs,
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location =
          status >= 300 && status < 400 ? (res.headers.location ?? null) : null;
        const contentType = String(res.headers["content-type"] ?? "");
        if (location || status < 200 || status >= 300) {
          res.resume(); // drain and discard: a non-2xx body is never returned
          return resolve({
            status,
            location,
            contentType,
            body: Buffer.alloc(0),
          });
        }
        const chunks: Buffer[] = [];
        let size = 0;
        res.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > maxBytes) {
            req.destroy(new Error(`Response exceeds ${maxBytes} bytes`));
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () =>
          resolve({
            status,
            location,
            contentType,
            body: Buffer.concat(chunks),
          }),
        );
        res.on("error", reject);
      },
    );
    req.on("timeout", () => req.destroy(new Error("Request timed out")));
    req.on("error", reject);
    req.end();
  });
}

/**
 * GET a user-supplied URL safely. Follows up to 3 redirects, re-checking each
 * hop. Throws UnsafeUrlError for blocked targets and Error for network issues.
 */
export async function safeFetchText(
  raw: string,
  opts: {
    headers?: Record<string, string>;
    maxBytes?: number;
    timeoutMs?: number;
  } = {},
): Promise<SafeResponse> {
  let target = assertPublicUrl(raw);
  for (let hop = 0; ; hop++) {
    const res = await requestOnce(
      target,
      opts.maxBytes ?? DEFAULT_MAX_BYTES,
      opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      opts.headers ?? {},
    );
    if (!res.location) {
      return {
        status: res.status,
        url: target.toString(),
        contentType: res.contentType,
        text: res.body.toString("utf-8"),
      };
    }
    if (hop >= MAX_REDIRECTS) throw new Error("Too many redirects");
    target = assertPublicUrl(new URL(res.location, target));
  }
}

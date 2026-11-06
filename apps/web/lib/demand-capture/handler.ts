import { createHmac, timingSafeEqual } from "node:crypto";
import type {
  DemandSignal,
  PriceBand,
  Stage,
  Urgency,
  WaitlistState,
} from "./types";
import { addToAudience, getCount, joinSignal, readSignal } from "./store";

export interface ProductConfig {
  id: string;
  stage: Stage;
  waitlist: {
    enabled: boolean;
    publicCountThreshold: number;
    foundingCohort: number;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { email: 320, name: 100, pain: 400, alternative: 200, source: 160 };

export const UPDATE_TOKEN_TTL_MS = 30 * 60 * 1000;
export const TOKEN_EXPIRED =
  "This form has expired. Enter your email again to add your answers.";

const clip = (v: unknown, n: number) =>
  typeof v === "string" ? v.trim().slice(0, n) || undefined : undefined;

const URGENCIES: Urgency[] = ["now", "this-quarter", "exploring"];
const BANDS: PriceBand[] = [
  "free-only",
  "under-25",
  "25-99",
  "100-299",
  "300-999",
  "over-1000",
  "company-pays",
];
const oneOf = <T extends string>(v: unknown, allowed: T[]) =>
  typeof v === "string" && (allowed as string[]).includes(v)
    ? (v as T)
    : undefined;

export function isTokenSecretConfigured(env: NodeJS.ProcessEnv = process.env) {
  return (env.WAITLIST_TOKEN_SECRET ?? "").length >= 32;
}

function sign(productId: string, email: string, exp: number) {
  const secret = process.env.WAITLIST_TOKEN_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("WAITLIST_TOKEN_SECRET missing");
  return createHmac("sha256", secret)
    .update(`${productId}\n${email}\n${exp}`)
    .digest("hex");
}

/**
 * Step 1 returns this so step 2 can add answers. It proves the answers come
 * from whoever just submitted the email in this session, within 30 minutes; it
 * does not prove they own the inbox. That needs email verification.
 */
export function issueUpdateToken(
  productId: string,
  email: string,
  nowMs: number,
) {
  const exp = nowMs + UPDATE_TOKEN_TTL_MS;
  return `${exp}.${sign(productId, email, exp)}`;
}

export function verifyUpdateToken(
  token: unknown,
  productId: string,
  email: string,
  nowMs: number,
) {
  if (typeof token !== "string") return false;
  const match = /^(\d{10,16})\.([0-9a-f]{64})$/.exec(token);
  if (!match) return false;
  const exp = Number(match[1]);
  if (exp < nowMs || exp > nowMs + UPDATE_TOKEN_TTL_MS) return false;
  const expected = Buffer.from(sign(productId, email, exp), "hex");
  const given = Buffer.from(match[2], "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * A count below the product's threshold is withheld, never rounded up or
 * estimated. Publishing "join 12 others" reads worse than publishing nothing,
 * and inventing a number is the one thing that would cost us the brand.
 */
export function publicState(
  product: ProductConfig,
  count: number,
  position?: number,
): WaitlistState {
  const { publicCountThreshold, foundingCohort } = product.waitlist;
  return {
    productId: product.id,
    count,
    position,
    publicCount: count >= publicCountThreshold ? count : null,
    foundingCohort,
    foundingSeatsLeft: count < foundingCohort ? foundingCohort - count : 0,
    stage: product.stage,
  };
}

export async function handleJoin(
  product: ProductConfig,
  body: Record<string, unknown>,
  req: Request,
  nowMs: number = Date.now(),
) {
  if (!product.waitlist.enabled)
    return {
      status: 404 as const,
      body: { error: "No waitlist for this product" },
    };

  const email = clip(body.email, MAX.email)?.toLowerCase();
  if (!email || !EMAIL_RE.test(email))
    return { status: 400 as const, body: { error: "Valid email required" } };
  if (body.consent !== true)
    return { status: 400 as const, body: { error: "Consent required" } };

  const answers = Object.fromEntries(
    Object.entries({
      name: clip(body.name, MAX.name),
      role: clip(body.role, MAX.name),
      pain: clip(body.pain, MAX.pain),
      urgency: oneOf(body.urgency, URGENCIES),
      priceBand: oneOf(body.priceBand, BANDS),
      alternative: clip(body.alternative, MAX.alternative),
    }).filter(([, v]) => v !== undefined),
  ) as Partial<DemandSignal>;
  const hasAnswers = Object.keys(answers).length > 0;

  if (
    hasAnswers &&
    !verifyUpdateToken(body.updateToken, product.id, email, nowMs)
  )
    return { status: 403 as const, body: { error: TOKEN_EXPIRED } };

  const existing = await readSignal(product.id, email);
  const url = new URL(req.url);
  const utm = Object.fromEntries(
    [...url.searchParams.entries()]
      .filter(([k]) => k.startsWith("utm_"))
      .slice(0, 8),
  );

  // Answers merge onto the stored record. Origin fields (createdAt, source,
  // referrer, utm) and the position belong to the first signup and never move.
  const stored: Omit<DemandSignal, "position"> = existing ?? {
    productId: product.id,
    email,
    source: clip(body.source, MAX.source) ?? url.pathname,
    referrer: clip(req.headers.get("referer"), MAX.source),
    utm: Object.keys(utm).length ? utm : undefined,
    createdAt: new Date(nowMs).toISOString(),
    consent: true as const,
  };
  const signal = {
    ...stored,
    ...answers,
    productId: product.id,
    email,
    consent: true as const,
  };

  const { position } = await joinSignal(
    signal,
    Boolean(existing) && hasAnswers,
  );

  try {
    await addToAudience(email, signal.name, product.id);
  } catch (err) {
    console.error("[waitlist] could not record pending audience delivery", err);
  }

  const count = await getCount(product.id);
  return {
    status: 200 as const,
    body: {
      ...publicState(product, count, position),
      updateToken: issueUpdateToken(product.id, email, nowMs),
    },
  };
}

export async function handleState(product: ProductConfig) {
  const count = await getCount(product.id);
  return { status: 200 as const, body: publicState(product, count) };
}

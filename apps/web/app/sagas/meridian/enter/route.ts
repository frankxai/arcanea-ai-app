import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "arcanea-meridian-entry";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function chooseVariant(request: NextRequest): "world" | "story" {
  const forced = request.nextUrl.searchParams.get("variant");
  if (forced === "world" || forced === "story") return forced;

  const sticky = request.cookies.get(COOKIE_NAME)?.value;
  if (sticky === "world" || sticky === "story") return sticky;

  return Math.random() < 0.5 ? "world" : "story";
}

export function GET(request: NextRequest) {
  const variant = chooseVariant(request);
  const destination = new URL("/sagas/meridian", request.url);
  destination.searchParams.set("entry", variant);
  destination.searchParams.set("experiment", "meridian_entry_v1");

  const response = NextResponse.redirect(destination, 307);
  response.cookies.set(COOKIE_NAME, variant, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

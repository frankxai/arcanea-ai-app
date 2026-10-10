import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  formatApiError,
  isAuthFailure,
  SIGN_IN_TO_GENERATE,
} from "../../apps/web/lib/imagine/api-error.ts";

const page = readFileSync(
  new URL("../../apps/web/app/imagine/page.tsx", import.meta.url),
  "utf8",
);
const navbar = readFileSync(
  new URL("../../apps/web/components/navigation/navbar.tsx", import.meta.url),
  "utf8",
);
const userNav = readFileSync(
  new URL("../../apps/web/components/auth/user-nav.tsx", import.meta.url),
  "utf8",
);
const authModal = readFileSync(
  new URL("../../apps/web/components/auth/auth-modal.tsx", import.meta.url),
  "utf8",
);
const splitText = readFileSync(
  new URL("../../apps/web/components/motion/split-text.tsx", import.meta.url),
  "utf8",
);
const createHub = readFileSync(
  new URL("../../apps/web/app/create/create-hub.tsx", import.meta.url),
  "utf8",
);

test("nested imagine errors stay readable and 401 is a sign-in failure", () => {
  assert.equal(
    formatApiError(
      { error: { message: "Authentication required" } },
      "fallback",
    ),
    "Authentication required",
  );
  assert.equal(
    formatApiError({ error: { code: "X" } }, "fallback"),
    "fallback",
  );
  assert.equal(
    formatApiError({ error: "Sign in to generate images" }, "fallback"),
    "Sign in to generate images",
  );
  assert.equal(formatApiError(null, "fallback"), "fallback");
  assert.equal(String({ error: { message: "x" } }), "[object Object]");
  assert.notEqual(
    formatApiError({ error: { message: "x" } }, "fallback"),
    "[object Object]",
  );
  assert.equal(isAuthFailure(401, { error: { message: "nope" } }), true);
  assert.equal(
    isAuthFailure(500, { error: "Credit admission is unavailable" }),
    false,
  );
  assert.equal(isAuthFailure(400, { error: { code: "UNAUTHORIZED" } }), true);
  assert.equal(SIGN_IN_TO_GENERATE, "Sign in to generate.");
});

test("imagine keeps idempotent image requests and surfaces sign-in beside submit", () => {
  assert.match(page, /requestImages\(/);
  assert.match(page, /formatApiError\(/);
  assert.match(page, /isAuthFailure\(/);
  assert.match(page, /SIGN_IN_TO_GENERATE/);
  assert.match(page, /<AuthModal/);
  assert.doesNotMatch(page, /new Error\(data\.error/);
  assert.doesNotMatch(page, /\[object Object\]/);
});

test("mobile nav closes before the auth modal, which sits above the menu", () => {
  assert.match(navbar, /z-\[55\]/);
  assert.match(navbar, /onAuthOpen=\{\(\) => setMobileMenuOpen\(false\)\}/);
  assert.match(userNav, /onAuthOpen\?\.\(\)/);
  assert.match(authModal, /relative z-\[70\]/);
  assert.doesNotMatch(authModal, /relative z-50/);
});

test("create heading is visible on first paint", () => {
  assert.match(splitText, /initial=\{\{ opacity: 1 \}\}/);
  assert.match(splitText, /delay: 0/);
  assert.doesNotMatch(splitText, /y: "0\.3em"/);
  assert.match(createHub, /text="What are you"/);
  assert.match(createHub, /delay=\{0\}/);
  assert.doesNotMatch(createHub, /delay=\{0\.05\}/);
  assert.doesNotMatch(createHub, /delay=\{0\.35\}/);
});

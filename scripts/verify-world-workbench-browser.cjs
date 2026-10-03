const assert = require("node:assert/strict");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);

async function verifyWorldWorkbench({ page, context, base, state, capture }) {
  const modelRequests = [];
  const runtimeErrors = [];
  const observeRequest = (request) => {
    if (
      request.method() === "POST" &&
      /\/api\/worlds\/generate(?:-image)?$/.test(
        new URL(request.url()).pathname,
      )
    )
      modelRequests.push(request.url());
  };
  const observeError = (error) => runtimeErrors.push(error.message);
  page.on("request", observeRequest);
  page.on("pageerror", observeError);
  try {
    const response = await page.goto(`${base}/`, {
      waitUntil: "domcontentloaded",
    });
    assert.equal(response.status(), 200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Build living worlds with AI agents.",
    );
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("main").count(), 1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    );
    assert.ok(overflow <= 1, `Homepage horizontal overflow: ${overflow}px`);
    if (state.forcedColors !== "active") {
      const expectedColor = await page.evaluate(() => {
        const probe = document.createElement("span");
        probe.style.color = "var(--arc-brand-atlantean-teal)";
        document.body.appendChild(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      });
      const explore = page
        .locator('section[aria-labelledby="home-title"]')
        .getByRole("link", { name: "Explore worlds", exact: true });
      await explore.hover();
      await expect(explore).toHaveCSS("color", expectedColor);
    }
    await capture(page, state, "world-workbench-home");

    const allDossiers = page.locator(
      '[aria-label="Interactive world example"]',
    );
    const dossier = page.locator(
      '[aria-label="Interactive world example"]:visible',
    );
    const dossierNodes = await allDossiers.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          width: rect.width,
          height: rect.height,
          display: style.display,
          visibility: style.visibility,
          hiddenAncestor: Boolean(
            element.closest('[hidden], [aria-hidden="true"], [inert]'),
          ),
        };
      }),
    );
    console.log(JSON.stringify({ state: state.name, dossierNodes }));
    await expect(dossier).toHaveCount(1);
    const originalBox = await dossier.boundingBox();
    for (const name of ["Characters", "Locations", "World rule"]) {
      await page.getByRole("button", { name, exact: true }).click();
      const currentBox = await dossier.boundingBox();
      assert.ok(
        Math.abs(currentBox.height - originalBox.height) <= 1,
        `Switching to ${name} changes dossier height`,
      );
      await expect(
        page.getByRole("button", { name, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
    }
    await page
      .getByRole("button", { name: "Change who pays the price" })
      .click();
    await expect(
      dossier.getByText(
        "Every book you read takes a memory from someone you love.",
        { exact: true },
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "Characters", exact: true }).click();
    await expect(
      dossier.getByText(
        "She needs a cure hidden in the stacks. Her sister would bear the cost of reading it.",
        { exact: true },
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "Locations", exact: true }).click();
    await expect(
      dossier.getByText(
        "Paired chairs and written consent. Every act of discovery binds two lives.",
        { exact: true },
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "World rule", exact: true }).click();
    await page.getByRole("button", { name: "Restore the original" }).click();
    await expect(
      dossier.getByText("Every book you read takes one memory of your own.", {
        exact: true,
      }),
    ).toBeVisible();
    await dossier.scrollIntoViewIfNeeded();
    await capture(page, state, "world-workbench-dossier");

    const workflowTitle = page.locator("#workflow-title");
    assert.match(await workflowTitle.textContent(), /can\s+build/);
    await workflowTitle.scrollIntoViewIfNeeded();
    await capture(page, state, "world-workbench-workflow");

    await page.getByRole("button", { name: "Use the library concept" }).click();
    const concept = page.getByLabel("What makes your world different?");
    const conceptText = await concept.inputValue();
    assert.ok(conceptText.includes("last library"));
    await expect(concept).toBeFocused();
    await concept.press("Tab");
    const create = page.getByRole("button", {
      name: "Create a world",
      exact: true,
    });
    await expect(create).toBeFocused();
    await create.press("Enter");
    const creatorInput = page.getByRole("textbox", {
      name: "Describe your world",
    });
    await expect(creatorInput).toHaveValue(conceptText);
    const signIn = page.getByRole("button", {
      name: "Sign in to create your world",
    });
    await expect(signIn).toBeVisible();
    await capture(page, state, "world-workbench-creator-entry");
    await signIn.click();
    await expect(page).toHaveURL(/\/auth\/login\?/);
    assert.equal(
      new URL(page.url()).searchParams.get("next"),
      "/worlds/create?resume=1",
    );
    await page
      .getByRole("link", { name: "Enter Arcanea", exact: true })
      .click();
    await expect(page).toHaveURL(/\/auth\/signup\?/);
    const signInLink = page.getByRole("link", { name: "Sign in", exact: true });
    assert.equal(
      new URL(await signInLink.getAttribute("href"), base).searchParams.get(
        "next",
      ),
      "/worlds/create?resume=1",
    );
    await page.goto(`${base}/worlds/create?resume=1`, {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("textbox", { name: "Describe your world" }),
    ).toHaveValue(conceptText);
    assert.equal(
      modelRequests.length,
      0,
      "Anonymous navigation never sends a model request",
    );
    assert.deepEqual(runtimeErrors, []);

    if (state.name === "desktop") {
      for (const [path, status] of [
        ["/api/waitlist", 400],
        ["/api/worlds/generate", 401],
        ["/api/worlds/save", 401],
      ]) {
        const result = await context.request.post(`${base}${path}`, {
          data: {},
        });
        assert.equal(
          result.status(),
          status,
          `${path} request-level access boundary`,
        );
      }
    }
    return {
      state: state.name,
      overflow,
      stableDossier: true,
      dossierNodes,
      conceptRecovery: true,
      anonymousModelRequests: modelRequests.length,
      runtimeErrors,
    };
  } finally {
    page.off("request", observeRequest);
    page.off("pageerror", observeError);
  }
}

module.exports = { verifyWorldWorkbench };

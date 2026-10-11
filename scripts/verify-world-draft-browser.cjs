const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const base = "http://127.0.0.1:3001/worlds/create?resume=1";
const output = "screenshots/world-drafts";
const currentKey = "arcanea.world-draft.v1.anonymous";
const previousKey = "arcanea.world-draft.previous.v1.anonymous";
const conceptKey = "arcanea.world-concept.anonymous";
const draft = {
  version: 1,
  description: "A library inside a dying star",
  draft_id: "aaad4508-1165-477b-a644-c9c2c81922a4",
  world: {
    name: "The last library",
    slug: "the-last-library",
    tagline: "Every memory has a home",
    description:
      "A complete synthetic draft used only for browser regression tests.",
    elements: [],
    laws: [{ name: "The cost", description: "Reading costs one memory." }],
    systems: [
      {
        name: "Memory exchange",
        type: "Economy",
        rules: "Every memory is returned when its book closes.",
      },
    ],
    characters: Array.from({ length: 4 }, (_, i) => ({
      name: `Archivist ${i + 1}`,
      backstory: `Complete backstory ${i + 1}.`,
      personality: { traits: ["Patient"], voice_style: "Soft and precise" },
    })),
    locations: Array.from({ length: 4 }, (_, i) => ({
      name: `Reading room ${i + 1}`,
      description: `Complete location ${i + 1}.`,
    })),
    first_event: {
      title: "The arrival",
      description: "A courier brings the last blank book.",
    },
    image_prompt: "A library in a dying star",
  },
};

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch();
  const evidence = {
    sourceCommit: process.env.GITHUB_SHA || null,
    modes: [],
    interactions: [],
  };
  const errors = [];
  try {
    for (const mode of [
      {
        name: "desktop",
        width: 1440,
        height: 900,
        reducedMotion: "no-preference",
      },
      {
        name: "mobile",
        width: 375,
        height: 812,
        reducedMotion: "no-preference",
      },
      {
        name: "reduced-motion",
        width: 1440,
        height: 900,
        reducedMotion: "reduce",
      },
      {
        name: "tablet",
        width: 768,
        height: 1024,
        reducedMotion: "no-preference",
      },
      {
        name: "narrow-short",
        width: 320,
        height: 640,
        reducedMotion: "reduce",
      },
    ]) {
      const context = await browser.newContext({
        viewport: { width: mode.width, height: mode.height },
        reducedMotion: mode.reducedMotion,
        acceptDownloads: true,
        permissions: ["clipboard-read", "clipboard-write"],
      });
      const page = await context.newPage();
      const button = (name) => page.getByRole("button", { name, exact: true });
      const worldTitle = page.getByRole("heading", {
        name: draft.world.name,
        exact: true,
      });
      const choice = page.getByRole("region", { name: "Choose your draft" });
      const readStorage = (key) =>
        page.evaluate((key) => sessionStorage.getItem(key), key);
      const reloadWithoutWarning = async (label) => {
        assert.equal(
          await page.evaluate(() => {
            const event = new Event("beforeunload", { cancelable: true });
            window.dispatchEvent(event);
            return event.defaultPrevented;
          }),
          false,
          `${mode.name}: ${label}; unload guard is already clean`,
        );
        let warned = false;
        let resolution;
        const resolveUnexpected = (dialog) => {
          warned = true;
          resolution = dialog.accept();
        };
        page.on("dialog", resolveUnexpected);
        try {
          await page.reload();
          if (resolution) await resolution;
          assert.equal(warned, false, `${mode.name}: ${label}`);
        } finally {
          page.off("dialog", resolveUnexpected);
        }
      };
      const confirmAction = async (trigger, message, response) => {
        const expected = page.waitForEvent("dialog");
        const action = trigger().then(
          () => null,
          (error) => error,
        );
        const dialog = await expected;
        assert.equal(dialog.type(), "confirm");
        assert.ok(
          dialog.message().includes(message),
          `${mode.name}: expected confirmation`,
        );
        await dialog[response]();
        const error = await action;
        if (error) throw error;
      };
      page.setDefaultTimeout(15000);
      page.on("pageerror", (error) => errors.push(error.message));
      let modelRequests = 0;
      await page.route("**/api/worlds/generate**", (route) => {
        modelRequests += 1;
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: '{"error":"Unexpected model request in recovery test"}',
        });
      });
      await page.goto(base);
      await expect(
        page.getByRole("textbox", { name: "Describe your world" }),
      ).toBeVisible();
      await page.evaluate(
        ({ currentKey, previousKey, conceptKey, draft }) => {
          sessionStorage.setItem(currentKey, JSON.stringify(draft));
          sessionStorage.setItem(
            previousKey,
            JSON.stringify({
              ...draft,
              draft_id: "aaad4508-1165-477b-a644-c9c2c81922a5",
              world: {
                ...draft.world,
                name: "Previous synthetic world",
                slug: "previous-synthetic-world",
              },
            }),
          );
          sessionStorage.setItem(conceptKey, "A new city beneath the sea");
        },
        { currentKey, previousKey, conceptKey, draft },
      );
      await page.reload();
      await expect(worldTitle).toBeVisible();
      await expect(choice).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Archivist 4", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Reading room 4", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(draft.world.systems[0].rules, { exact: true }),
      ).toBeVisible();
      const reflow = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        outside: Array.from(document.querySelectorAll("body *"))
          .filter((element) => {
            const box = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return (
              box.width > 0 &&
              style.visibility !== "hidden" &&
              style.display !== "none" &&
              box.right > innerWidth + 1
            );
          })
          .slice(0, 12)
          .map((element) => ({
            tag: element.tagName,
            name:
              element.getAttribute("aria-label") ||
              element.getAttribute("name"),
            right: element.getBoundingClientRect().right,
          })),
      }));
      if (reflow.scrollWidth > reflow.width + 1) {
        console.error(JSON.stringify({ mode: mode.name, reflow }));
        await page.screenshot({
          path: `${output}/${mode.name}-overflow.png`,
          fullPage: true,
        });
      }
      assert.ok(
        reflow.scrollWidth <= reflow.width + 1,
        `${mode.name}: horizontal overflow`,
      );
      for (const control of [
        page.getByRole("textbox", {
          name: "Email address for newsletter",
          exact: true,
        }),
        page
          .getByRole("contentinfo")
          .getByRole("button", { name: "Subscribe", exact: true }),
      ]) {
        const bounds = await control.boundingBox();
        assert.ok(
          bounds &&
            bounds.height >= 44 &&
            bounds.x >= 0 &&
            bounds.x + bounds.width <= mode.width + 1,
          `${mode.name}: newsletter controls fit the viewport with 44px targets`,
        );
      }
      const downloadPromise = page.waitForEvent("download");
      await button("Export draft").click();
      const download = await downloadPromise;
      assert.deepEqual(
        JSON.parse(await fs.readFile(await download.path(), "utf8")),
        draft.world,
      );
      await button("Keep this draft").click();
      await button("Copy art brief").click();
      await expect(button("Art brief copied")).toBeVisible();
      assert.equal(
        await page.evaluate(() => navigator.clipboard.readText()),
        draft.world.image_prompt,
      );
      await expect(choice).toHaveCount(0);
      assert.equal(await readStorage(conceptKey), null);
      await button("Refine").click();
      await button("Edit world draft").click();
      const editor = page.getByRole("region", {
        name: "Edit world draft",
        exact: true,
      });
      await expect(
        page.getByLabel("World name", { exact: true }),
      ).toBeFocused();
      const sectionNavigation = editor.getByRole("navigation", {
        name: "World draft sections",
      });
      const sectionNames = [
        "World details",
        "Rules",
        "Systems",
        "Characters",
        "Locations",
        "Founding event",
        "Apply or cancel",
      ];
      for (const name of [...sectionNames].reverse()) {
        await page.keyboard.press("Shift+Tab");
        await expect(
          sectionNavigation.getByRole("link", { name, exact: true }),
        ).toBeFocused();
      }
      for (const name of sectionNames) {
        const link = sectionNavigation.getByRole("link", { name, exact: true });
        await link.focus();
        await link.press("Enter");
        const target = await link.getAttribute("href");
        const position = await page.evaluate((id) => {
          const heading = document.getElementById(id);
          const box = heading.getBoundingClientRect();
          const header = document.querySelector("nav.fixed");
          const point = document.elementFromPoint(
            box.left + box.width / 2,
            box.top + box.height / 2,
          );
          return {
            focused: document.activeElement === heading,
            top: box.top,
            bottom: box.bottom,
            height: innerHeight,
            hasHeader: header !== null,
            headerBottom: header?.getBoundingClientRect().bottom ?? 0,
            unobscured: point === heading || heading.contains(point),
          };
        }, target.slice(1));
        assert.ok(
          position.hasHeader,
          `${mode.name}: fixed navbar exists before checking clearance`,
        );
        assert.ok(
          position.focused,
          `${mode.name}: ${name} receives keyboard focus`,
        );
        assert.ok(
          position.top >= position.headerBottom &&
            position.bottom <= position.height &&
            position.unobscured,
          `${mode.name}: ${name} clears the fixed header`,
        );
      }
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `${mode.name}: editor horizontal overflow`,
      );
      await page.getByLabel("World name", { exact: true }).fill("");
      await expect(button("Restore previous draft")).toBeDisabled();
      for (const name of [
        "more dramatic and epic",
        "darker and more mysterious",
        "more whimsical and playful",
        "grittier and more realistic",
        "more ancient and mythological",
      ]) {
        await expect(button(name)).toBeDisabled();
      }
      await expect(editor.getByRole("status")).toContainText(
        "Unapplied changes",
      );
      await button("Apply draft changes").click();
      await expect(editor.getByRole("alert")).toBeFocused();
      await expect(button("Export draft")).toBeDisabled();
      await page.evaluate(() => {
        window.__workingCopyURL = URL.createObjectURL;
        URL.createObjectURL = () => {
          throw new Error("Synthetic working-copy download failure");
        };
      });
      await button("Download working edits").click();
      await expect(editor.getByRole("alert")).toBeFocused();
      await expect(editor.getByRole("alert")).toContainText(
        "Your edits remain on this page",
      );
      await expect(page.getByLabel("World name", { exact: true })).toHaveValue(
        "",
      );
      await button("Download working edits").click();
      await expect(editor.getByRole("alert")).toBeFocused();
      await page.evaluate(() => {
        URL.createObjectURL = window.__workingCopyURL;
        delete window.__workingCopyURL;
      });
      const workingDownload = page.waitForEvent("download");
      await button("Download working edits").click();
      const workingCopy = JSON.parse(
        await fs.readFile(await (await workingDownload).path(), "utf8"),
      );
      assert.equal(workingCopy.format, "arcanea.world-working-edits.v1");
      assert.deepEqual(workingCopy.world, { ...draft.world, name: "" });
      assert.deepEqual(
        JSON.parse(await readStorage(currentKey)).world,
        draft.world,
        "Working-copy download must not apply edits",
      );
      await confirmAction(
        () => button("Cancel draft changes").click(),
        "Discard these unapplied draft changes?",
        "dismiss",
      );
      await expect(page.getByLabel("World name", { exact: true })).toHaveValue(
        "",
      );
      await confirmAction(
        () =>
          page
            .getByRole("link", { name: "Back to worlds", exact: true })
            .click(),
        "Leave without applying these draft changes?",
        "dismiss",
      );
      await expect(editor).toBeVisible();
      await expect(page.getByLabel("World name", { exact: true })).toHaveValue(
        "",
      );
      assert.match(page.url(), /\/worlds\/create/);
      const documentBeforeReload = await page.evaluateHandle(() => document);
      const reloadDialog = page.waitForEvent("dialog");
      const cancelledReload = page
        .reload({ waitUntil: "commit", timeout: 2000 })
        .then(
          () => null,
          (error) => error,
        );
      const warning = await reloadDialog;
      assert.equal(warning.type(), "beforeunload");
      await warning.dismiss();
      const cancellation = await cancelledReload;
      assert.ok(cancellation, "Dismissed reload must not complete navigation");
      assert.ok(
        cancellation.name === "TimeoutError" ||
          /ERR_ABORTED|Navigation.*cancel/i.test(cancellation.message),
        cancellation.message,
      );
      assert.equal(
        await page.evaluate(
          (original) => original === document,
          documentBeforeReload,
        ),
        true,
        "Cancelled reload retains the original document, not a reconstructed draft",
      );
      await documentBeforeReload.dispose();
      await expect(page.getByLabel("World name", { exact: true })).toHaveValue(
        "",
      );
      await confirmAction(
        () => button("Cancel draft changes").click(),
        "Discard these unapplied draft changes?",
        "accept",
      );
      await expect(button("Edit world draft")).toBeFocused();
      assert.deepEqual(
        JSON.parse(await readStorage(currentKey)).world,
        draft.world,
        "Confirmed cancellation preserves applied draft",
      );
      await reloadWithoutWarning(
        "Confirmed cancellation removes the warning before reopening",
      );
      await button("Edit world draft").click();
      await page
        .getByLabel("World name", { exact: true })
        .fill("The remembered library");
      await page
        .getByLabel("World name", { exact: true })
        .fill(draft.world.name);
      await reloadWithoutWarning("Reversed edits remove the reload warning");
      await page.evaluate(
        ({ currentKey, draft }) => {
          const optional = structuredClone(draft);
          delete optional.world.characters[3].backstory;
          delete optional.world.locations[3].description;
          sessionStorage.setItem(currentKey, JSON.stringify(optional));
        },
        { currentKey, draft },
      );
      await page.reload();
      await button("Edit world draft").click();
      for (const label of ["Character 4 backstory", "Location 4 description"]) {
        await page
          .getByLabel(label, { exact: true })
          .fill("Temporary working text");
        await expect(editor.getByRole("status")).toContainText(
          "Unapplied changes",
        );
        await page.getByLabel(label, { exact: true }).fill("");
        await expect(editor.getByRole("status")).toContainText(
          "No changes yet",
        );
      }
      await reloadWithoutWarning(
        "Visually reversed optional fields remove the warning",
      );
      await page.evaluate(
        ({ currentKey, draft }) => {
          sessionStorage.setItem(currentKey, JSON.stringify(draft));
        },
        { currentKey, draft },
      );
      await page.reload();
      await button("Edit world draft").click();
      await page.screenshot({
        path: `${output}/${mode.name}-editor.png`,
        fullPage: true,
        animations: "disabled",
      });
      await page
        .getByLabel("World name", { exact: true })
        .fill("The remembered library");
      await page
        .getByLabel("Rule 1 consequence", { exact: true })
        .fill("Reading costs a memory; closing the book returns it.");
      await expect(button("Export draft")).toBeDisabled();
      await button("Apply draft changes").click();
      await expect(
        page.getByRole("heading", {
          name: "The remembered library",
          exact: true,
        }),
      ).toBeVisible();
      await reloadWithoutWarning(
        "Apply removes the reload warning immediately",
      );
      await expect(
        page.getByRole("heading", {
          name: "The remembered library",
          exact: true,
        }),
      ).toBeVisible();
      await button("Edit world draft").click();
      await page
        .getByLabel("World name", { exact: true })
        .fill(draft.world.name);
      await page
        .getByLabel("Rule 1 consequence", { exact: true })
        .fill(draft.world.laws[0].description);
      await button("Apply draft changes").click();
      await confirmAction(
        () => button("Start over").click(),
        "Start a new concept?",
        "dismiss",
      );
      await expect(worldTitle).toBeVisible();
      await confirmAction(
        () => button("Start over").click(),
        "Start a new concept?",
        "accept",
      );
      await expect(
        page.getByRole("textbox", { name: "Describe your world" }),
      ).toBeVisible();
      assert.equal(await readStorage(currentKey), null);
      assert.equal(
        JSON.parse(await readStorage(previousKey)).draft_id,
        draft.draft_id,
      );
      await page.reload();
      await button("Restore previous draft").click();
      await expect(worldTitle).toBeVisible();
      await page.screenshot({
        path: `${output}/${mode.name}-restored.png`,
        fullPage: true,
        animations: "disabled",
      });
      await page.evaluate(
        (key) => sessionStorage.setItem(key, "A new city beneath the sea"),
        conceptKey,
      );
      await page.reload();
      await confirmAction(
        () => button("Use new concept").click(),
        "Start a new concept?",
        "accept",
      );
      const input = page.getByRole("textbox", { name: "Describe your world" });
      await expect(input).toHaveValue("A new city beneath the sea");
      await input.press("End");
      await input.press("Enter");
      await expect(input).toHaveValue("A new city beneath the sea\n");
      await button("Restore previous draft").click();
      await page.evaluate(() => {
        Storage.prototype.setItem = function () {
          throw new DOMException(
            "Synthetic full storage",
            "QuotaExceededError",
          );
        };
      });
      await confirmAction(
        () => button("Start over").click(),
        "Start a new concept?",
        "accept",
      );
      await expect(
        page
          .getByRole("alert")
          .filter({ hasText: "A recovery copy could not be stored" }),
      ).toContainText("A recovery copy could not be stored");
      await expect(worldTitle).toBeVisible();
      assert.equal(
        modelRequests,
        0,
        "Recovery and plain Enter must never request generation",
      );
      evidence.modes.push({ ...mode, passed: true });
      await context.close();
    }
    assert.deepEqual(errors, [], "Unexpected browser runtime errors");
    evidence.interactions = [
      "complete art brief copied without model requests",
      "complete draft inspection and exact JSON export",
      "applied creator edits survive reload without a model request",
      "section links move keyboard focus below the fixed header",
      "invalid working edits download without applying or granting export",
      "cancelled discard and cancelled browser reload preserve unapplied edits",
      "confirmed discard preserves applied draft and returns focus",
      "reversed edits remove browser reload warning",
      "explicit pending-concept choice",
      "cancel and confirm start over",
      "previous draft survives reload",
      "new concept retains previous draft",
      "plain Enter preserves multiline input",
      "full storage blocks destructive reset",
      "no implicit model calls",
    ];
    await fs.writeFile(
      `${output}/evidence.json`,
      JSON.stringify(evidence, null, 2),
    );
    console.log(JSON.stringify(evidence));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

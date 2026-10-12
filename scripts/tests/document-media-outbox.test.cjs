const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
const { createRequire } = require("node:module");
const appRequire = createRequire(path.resolve("apps/web/package.json"));

test(
  "real IndexedDB retains originals across browser restart and retires only confirmed scoped references",
  { timeout: 90000 },
  async () => {
    const root = path.resolve("apps/web/lib/docs");
    const sources = Object.fromEntries(
      ["media", "media-client", "media-outbox"].map((name) => [
        `./${name}`,
        ts.transpileModule(
          fs.readFileSync(path.join(root, `${name}.ts`), "utf8"),
          {
            compilerOptions: {
              module: ts.ModuleKind.CommonJS,
              target: ts.ScriptTarget.ES2022,
            },
          },
        ).outputText,
      ]),
    );
    const temporaryRoot = path.resolve(os.tmpdir());
    const profile = fs.mkdtempSync(
      path.join(temporaryRoot, "arcanea-doc-outbox-"),
    );
    let context;
    async function open() {
      context = await appRequire(
        "@playwright/test",
      ).chromium.launchPersistentContext(profile, { headless: true });
      await context.route("**/*", (route) =>
        route.fulfill({
          contentType: "text/html",
          body: "<!doctype html><title>Original recovery test</title>",
        }),
      );
      const page = await context.newPage();
      await page.goto("http://127.0.0.1:4177/");
      // Pass compiler output as structured data, never interpolate serialized
      // source into the JavaScript that initializes the browser fixture.
      await page.evaluate((sources) => {
        const cache = new Map();
        function load(name) {
          if (!Object.hasOwn(sources, name))
            throw Error("Only the three reviewed local modules may be loaded.");
          if (cache.has(name)) return cache.get(name).exports;
          const module = { exports: {} };
          cache.set(name, module);
          new Function("exports", "require", "module", sources[name])(
            module.exports,
            load,
            module,
          );
          return module.exports;
        }
        window.outbox = load("./media-outbox");
        window.client = load("./media-client");
        window.media = load("./media");
      }, sources);
      await page.evaluate(() => {
        window.scope = {
          ownerId: "11111111-1111-4111-8111-111111111111",
          projectId: "22222222-2222-4222-8222-222222222222",
          docId: "33333333-3333-4333-8333-333333333333",
        };
      });
      return page;
    }
    try {
      let page = await open();
      const original = await page.evaluate(async () => {
        const file = new File(
          [new Uint8Array(10 * 1024 * 1024).fill(37)],
          "original.png",
          { type: "image/png" },
        );
        const entry = await outbox.retainDocumentOriginal(
          file,
          scope,
          () => true,
        );
        return {
          sha256: entry.claim.sha256,
          assetId: entry.claim.assetId,
          fingerprint: entry.claim.fingerprint,
        };
      });
      await context.close();
      context = null;
      page = await open();
      const recovered = await page.evaluate(async () => {
        const entry = await outbox.readDocumentOriginal(scope, () => true);
        window.entry = entry;
        return {
          bytes: entry.file.size,
          name: entry.file.name,
          sha256: entry.claim.sha256,
          assetId: entry.claim.assetId,
          fingerprint: entry.claim.fingerprint,
          firstByte: new Uint8Array(await entry.file.arrayBuffer())[0],
        };
      });
      assert.deepEqual(recovered, {
        ...original,
        bytes: 10485760,
        name: "original.png",
        firstByte: 37,
      });
      assert.equal(
        await page.evaluate(async () =>
          outbox.readDocumentOriginal(
            { ...scope, ownerId: "44444444-4444-4444-8444-444444444444" },
            () => true,
          ),
        ),
        null,
      );
      assert.equal(
        await page.evaluate(async () =>
          outbox.readDocumentOriginal(
            { ...scope, docId: "44444444-4444-4444-8444-444444444444" },
            () => true,
          ),
        ),
        null,
      );
      const replay = await page.evaluate(async () => {
        let puts = 0;
        const url = await client.uploadDocumentImage(entry.file, scope, {
          current: () => true,
          upload: async () => {
            puts++;
            throw Error("A ready original must not be uploaded again");
          },
          fetch: async (_, init) => {
            const claim = JSON.parse(init.body).claim;
            return new Response(
              JSON.stringify({
                asset: {
                  ...claim,
                  status: "ready",
                  sourceStatus: "creator_supplied_unverified",
                  rightsStatus: "unverified",
                },
                url: media.documentMediaUrl(scope, claim.assetId),
              }),
            );
          },
        });
        return {
          puts,
          url,
          retained: Boolean(
            await outbox.readDocumentOriginal(scope, () => true),
          ),
        };
      });
      assert.equal(replay.puts, 0);
      assert.equal(replay.retained, true);
      const bounds = await page.evaluate(async () => {
        let replaced = false,
          stale = false;
        try {
          await outbox.retainDocumentOriginal(
            new File(["different"], "other.png", { type: "image/png" }),
            scope,
            () => true,
          );
        } catch {
          replaced = true;
        }
        try {
          await outbox.readDocumentOriginal(scope, () => false);
        } catch {
          stale = true;
        }
        const missing = await outbox.acknowledgeDocumentOriginal(
          entry,
          { type: "doc", content: [] },
          () => true,
        );
        const foreign = await outbox.acknowledgeDocumentOriginal(
          entry,
          {
            type: "doc",
            content: [
              {
                type: "image",
                attrs: {
                  src: media.documentMediaUrl(
                    { ...scope, docId: "44444444-4444-4444-8444-444444444444" },
                    entry.claim.assetId,
                  ),
                },
              },
            ],
          },
          () => true,
        );
        return {
          replaced,
          stale,
          missing,
          foreign,
          retained: Boolean(
            await outbox.readDocumentOriginal(scope, () => true),
          ),
        };
      });
      assert.deepEqual(bounds, {
        replaced: true,
        stale: true,
        missing: false,
        foreign: false,
        retained: true,
      });
      assert.equal(
        await page.evaluate(async () =>
          outbox.acknowledgeDocumentOriginal(
            entry,
            {
              type: "doc",
              content: [
                {
                  type: "image",
                  attrs: {
                    src: media.documentMediaUrl(scope, entry.claim.assetId),
                  },
                },
              ],
            },
            () => true,
          ),
        ),
        true,
      );
      assert.equal(
        await page.evaluate(async () =>
          outbox.readDocumentOriginal(scope, () => true),
        ),
        null,
      );
      const interrupted = await page.evaluate(async () => {
        const other = {
          ...scope,
          docId: "55555555-5555-4555-8555-555555555555",
        };
        const add = IDBObjectStore.prototype.add;
        let quotaDenied = false,
          staleDenied = false,
          current = true;
        try {
          IDBObjectStore.prototype.add = function () {
            throw new DOMException(
              "Synthetic exhausted browser quota",
              "QuotaExceededError",
            );
          };
          try {
            await outbox.retainDocumentOriginal(
              new File(["quota"], "quota.png", { type: "image/png" }),
              other,
              () => true,
            );
          } catch {
            quotaDenied = true;
          }
          IDBObjectStore.prototype.add = function (...args) {
            const request = add.apply(this, args);
            this.transaction.abort();
            return request;
          };
          let abortDenied = false;
          try {
            await outbox.retainDocumentOriginal(
              new File(["abort"], "abort.png", { type: "image/png" }),
              other,
              () => true,
            );
          } catch {
            abortDenied = true;
          }
          IDBObjectStore.prototype.add = add;
          const file = new File(["late"], "late.png", { type: "image/png" });
          const originalRead = file.arrayBuffer.bind(file);
          file.arrayBuffer = async () => {
            const bytes = await originalRead();
            current = false;
            return bytes;
          };
          try {
            await outbox.retainDocumentOriginal(file, other, () => current);
          } catch {
            staleDenied = true;
          }
          return {
            quotaDenied,
            abortDenied,
            staleDenied,
            missing:
              (await outbox.readDocumentOriginal(other, () => true)) === null,
          };
        } finally {
          IDBObjectStore.prototype.add = add;
        }
      });
      assert.deepEqual(interrupted, {
        quotaDenied: true,
        abortDenied: true,
        staleDenied: true,
        missing: true,
      });
      const tampered = await page.evaluate(async () => {
        await outbox.retainDocumentOriginal(
          new File(["intact"], "keep.png", { type: "image/png" }),
          scope,
          () => true,
        );
        const database = await new Promise((resolve, reject) => {
          const request = indexedDB.open("arcanea-document-originals", 1);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const key = JSON.stringify([
          scope.ownerId,
          scope.projectId,
          scope.docId,
        ]);
        await new Promise((resolve, reject) => {
          const transaction = database.transaction("originals", "readwrite");
          const store = transaction.objectStore("originals");
          const request = store.get(key);
          request.onsuccess = () =>
            store.put(
              {
                ...request.result,
                file: new File(["broken"], "keep.png", { type: "image/png" }),
              },
              key,
            );
          transaction.oncomplete = resolve;
          transaction.onabort = () => reject(transaction.error);
        });
        database.close();
        let corrupt = false,
          replaceDenied = false;
        try {
          await outbox.readDocumentOriginal(scope, () => true);
        } catch {
          corrupt = true;
        }
        try {
          await outbox.retainDocumentOriginal(
            new File(["new"], "new.png", { type: "image/png" }),
            scope,
            () => true,
          );
        } catch {
          replaceDenied = true;
        }
        return { corrupt, replaceDenied };
      });
      assert.deepEqual(tampered, { corrupt: true, replaceDenied: true });
    } finally {
      if (context) await context.close();
      assert.equal(path.dirname(path.resolve(profile)), temporaryRoot);
      assert.ok(path.basename(profile).startsWith("arcanea-doc-outbox-"));
      fs.rmSync(profile, { recursive: true, force: true });
    }
  },
);

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { createRequire } = require("node:module");
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  new Function("exports", "require", "module", code)(
    module.exports,
    (name) =>
      name.startsWith(".")
        ? load(path.resolve(path.dirname(file), name + ".ts"))
        : require(name),
    module,
  );
  return module.exports;
}
const base = path.resolve(__dirname, "../../apps/web/lib/docs");
const media = load(path.join(base, "media.ts"));
const { buildPortableDocumentExport } = load(
  path.join(base, "portable-export.ts"),
);
const { uploadDocumentImage, readPortableDocumentMedia } = load(
  path.join(base, "media-client.ts"),
);
const scope = {
  ownerId: "11111111-1111-4111-8111-111111111111",
  projectId: "22222222-2222-4222-8222-222222222222",
  docId: "33333333-3333-4333-8333-333333333333",
};
const assetId = "44444444-4444-4444-8444-444444444444";
const bytes = new Uint8Array([1, 2, 3]);
async function asset() {
  return {
    ...(await media.parseDocumentMediaClaim(
      {
        ...scope,
        assetId,
        byteSize: 3,
        mimeType: "image/png",
        sha256: await media.mediaDigest(bytes),
        filename: "map.png",
        alt: "A map",
      },
      scope,
    )),
    status: "ready",
    sourceStatus: "creator_supplied_unverified",
    rightsStatus: "unverified",
  };
}
function input(source = media.documentMediaUrl(scope, assetId)) {
  return {
    title: "My world",
    content_json: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "A chapter" }] },
        { type: "image", attrs: { src: source, alt: "A map" } },
      ],
    },
    content_text: "A chapter",
    confirmed_revision: 2,
    pending_operation: null,
  };
}
test("portable HTML contains original bytes, checksum, provenance and editable document JSON", async () => {
  const record = await asset();
  const result = await buildPortableDocumentExport(
    input(),
    scope,
    async (id) => {
      assert.equal(id, assetId);
      return { asset: record, bytes };
    },
    () => true,
  );
  assert.match(result.html, /src="data:image\/png;base64,AQID"/);
  assert.match(result.html, /<p>A chapter<\/p>/);
  const encoded = result.html.match(
    /id="arcanea-document">(.*?)<\/script>/s,
  )[1];
  const manifest = JSON.parse(encoded);
  assert.equal(manifest.assets[assetId].sha256, record.sha256);
  assert.deepEqual(
    Buffer.from(manifest.assets[assetId].imageData, "base64"),
    Buffer.from(bytes),
  );
  assert.deepEqual(manifest.content_json, input().content_json);
  assert.equal(manifest.assets[assetId].rightsStatus, "unverified");
  assert.equal(result.mediaBytes, 3);
});
test("repeated references read the original once", async () => {
  const doc = input();
  doc.content_json.content.push(doc.content_json.content[1]);
  let reads = 0;
  const result = await buildPortableDocumentExport(
    doc,
    scope,
    async () => {
      reads++;
      return { asset: await asset(), bytes };
    },
    () => true,
  );
  assert.equal(reads, 1);
  assert.equal(result.mediaCount, 1);
});
test("external/private-foreign sources are refused before any read, without changing the draft", async () => {
  for (const source of [
    "https://attacker.invalid/x.png",
    "/api/imagine/assets/44444444-4444-4444-8444-444444444444.png",
    `/api/projects/${scope.projectId}/docs/${assetId}/media/${assetId}`,
    "data:image/svg+xml,<svg>",
  ]) {
    const doc = input(source),
      original = JSON.stringify(doc);
    await assert.rejects(
      buildPortableDocumentExport(
        doc,
        scope,
        async () => {
          throw Error("Must not fetch");
        },
        () => true,
      ),
      (e) => e.status === 400,
    );
    assert.equal(JSON.stringify(doc), original);
  }
});
test("stale account and damaged bytes never produce an incomplete export", async () => {
  let current = true;
  await assert.rejects(
    buildPortableDocumentExport(
      input(),
      scope,
      async () => {
        current = false;
        return { asset: await asset(), bytes };
      },
      () => current,
    ),
    (e) => e.status === 409,
  );
  await assert.rejects(
    buildPortableDocumentExport(
      input(),
      scope,
      async () => ({ asset: await asset(), bytes: new Uint8Array([1, 2, 4]) }),
      () => true,
    ),
    (e) => e.status === 409,
  );
});
test("HTML/text/attributes cannot introduce executable scripts or remote requests", async () => {
  const doc = input();
  doc.title = "</title><script>alert(1)</script>";
  doc.content_json.content[0].content[0].text = "</p><script>alert(2)</script>";
  doc.content_json.content[1].attrs.alt = '" onerror="alert(3)';
  const result = await buildPortableDocumentExport(
    doc,
    scope,
    async () => ({ asset: await asset(), bytes }),
    () => true,
  );
  assert.ok(!result.html.includes("<script>alert"));
  assert.match(result.html, /&quot; onerror=&quot;alert\(3\)/);
  assert.match(result.html, /default-src 'none'; img-src data:/);
  const manifest = JSON.parse(
    result.html.match(/id="arcanea-document">(.*?)<\/script>/s)[1],
  );
  assert.equal(manifest.title, doc.title);
});
test("complex or oversized drafts fail before any media read", async () => {
  const doc = input();
  doc.content_text = "x".repeat(1024 * 1024 + 1);
  await assert.rejects(
    buildPortableDocumentExport(
      doc,
      scope,
      async () => {
        throw Error("No reads");
      },
      () => true,
    ),
    (e) => e.status === 413,
  );
  const nested = input();
  let node = nested.content_json;
  for (let i = 0; i < 65; i++) {
    const next = { type: "doc", content: [] };
    node.content = [next];
    node = next;
  }
  await assert.rejects(
    buildPortableDocumentExport(
      nested,
      scope,
      async () => {
        throw Error("No reads");
      },
      () => true,
    ),
    (e) => e.status === 413,
  );
});

const response = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
test("actual server adapter reads installed private SDK bytes and decodes them before completion", async () => {
  const appRequire = createRequire(path.resolve("apps/web/package.json"));
  const sdkRequire = createRequire(appRequire.resolve("@vercel/blob"));
  const { MockAgent, getGlobalDispatcher, setGlobalDispatcher } =
    sdkRequire("undici");
  assert.equal(typeof appRequire("@vercel/blob").get, "function");
  const server = { exports: {} };
  const code = ts.transpileModule(
    fs.readFileSync(path.join(base, "media-server.ts"), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    },
  ).outputText;
  new Function("exports", "require", "module", code)(
    server.exports,
    (name) => {
      if (name === "./media") return media;
      // This adapter test never creates a real or synthetic Auth/database client.
      if (name === "@/lib/supabase/server")
        return new Proxy(
          {},
          {
            get() {
              throw Error("Unexpected database access");
            },
          },
        );
      return appRequire(name);
    },
    server,
  );
  const png = await appRequire("sharp")({
    create: {
      width: 2,
      height: 2,
      channels: 3,
      background: { r: 1, g: 2, b: 3 },
    },
  })
    .png()
    .toBuffer();
  const claim = await media.parseDocumentMediaClaim(
    {
      ...scope,
      assetId,
      byteSize: png.length,
      mimeType: "image/png",
      sha256: await media.mediaDigest(png),
      filename: "map.png",
      alt: "A map",
    },
    scope,
  );
  const token = "vercel_blob_rw_arcaneafixture_" + "0".repeat(48);
  const oldDispatcher = getGlobalDispatcher(),
    agent = new MockAgent();
  agent.disableNetConnect();
  let reads = 0,
    completions = 0;
  agent
    .get("https://arcaneafixture.private.blob.vercel-storage.com")
    .intercept({ method: "GET", path: /^\/document-private\// })
    .reply((options) => {
      reads++;
      assert.equal(
        new URL(options.path, "https://fixture.invalid").pathname.slice(1),
        media.documentMediaPath(claim),
      );
      assert.match(options.path, /[?&]cache=0(?:&|$)/);
      assert.equal(options.headers.authorization, `Bearer ${token}`);
      return {
        statusCode: 200,
        data: png,
        responseOptions: {
          headers: {
            "content-type": "image/png",
            "content-length": String(png.length),
            etag: claim.sha256,
          },
        },
      };
    })
    .persist();
  const record = (status) => ({
    ...claim,
    status,
    sourceStatus: "creator_supplied_unverified",
    rightsStatus: "unverified",
  });
  setGlobalDispatcher(agent);
  try {
    const store = server.exports.documentMediaStore(token);
    const saved = await media.finalizeDocumentMedia(
      claim,
      {
        reserve: async () => record("reserved"),
        complete: async () => {
          completions++;
          return record("ready");
        },
      },
      store,
      server.exports.decodeDocumentMedia,
    );
    assert.equal(saved.status, "ready");
    assert.equal(completions, 1);
    await assert.rejects(
      store.read(media.documentMediaPath(claim), png.length - 1),
      (error) => error.status === 503,
    );
    await assert.rejects(
      server.exports.decodeDocumentMedia(png, "image/jpeg"),
      (error) => error.status === 400,
    );
    await assert.rejects(
      server.exports.decodeDocumentMedia(
        new Uint8Array([1, 2, 3]),
        "image/png",
      ),
      (error) => error.status === 400,
    );
    assert.equal(reads, 2);
  } finally {
    setGlobalDispatcher(oldDispatcher);
    await agent.close();
  }
});
test("lost direct-upload acknowledgement is reconciled without a second put or new ID", async () => {
  let stored = false,
    puts = 0;
  const identities = [];
  const options = {
    current: () => true,
    fetch: async (_url, request) => {
      const claim = JSON.parse(request.body).claim;
      identities.push(claim.assetId);
      if (!stored) return response(425, { error: "Not uploaded yet" });
      return response(200, {
        asset: {
          ...claim,
          status: "ready",
          sourceStatus: "creator_supplied_unverified",
          rightsStatus: "unverified",
        },
        url: media.documentMediaUrl(scope, claim.assetId),
      });
    },
    upload: async (pathname, original, settings) => {
      puts++;
      assert.equal(settings.access, "private");
      assert.equal(settings.multipart, false);
      assert.ok(
        pathname.startsWith(
          `document-private/${scope.ownerId}/${scope.projectId}/${scope.docId}/`,
        ),
      );
      assert.equal(original.size, 3);
      stored = true;
      throw Error("Lost put acknowledgement");
    },
  };
  const original = new File([bytes], "map.png", { type: "image/png" });
  const first = await uploadDocumentImage(original, scope, options);
  const reopened = await uploadDocumentImage(original, scope, options);
  assert.equal(first, reopened);
  assert.equal(puts, 1);
  assert.equal(new Set(identities).size, 1);
  assert.deepEqual(new Uint8Array(await original.arrayBuffer()), bytes);
});

test("a lost completion transport retains the original and stops before another upload", async () => {
  let puts = 0;
  await assert.rejects(
    uploadDocumentImage(
      new File([bytes], "map.png", { type: "image/png" }),
      scope,
      {
        current: () => true,
        fetch: async () => {
          throw new TypeError("Failed to fetch");
        },
        upload: async () => {
          puts++;
        },
      },
    ),
    (error) =>
      error.status === 503 && /original file.*retry/.test(error.message),
  );
  assert.equal(puts, 0);
});
test("uncertain finalization and storage denial stop before any new put", async () => {
  for (const status of [503, 507, 401, 409]) {
    let puts = 0;
    await assert.rejects(
      uploadDocumentImage(
        new File([bytes], "map.png", { type: "image/png" }),
        scope,
        {
          current: () => true,
          fetch: async () => response(status, { error: "Unconfirmed" }),
          upload: async () => {
            puts++;
          },
        },
      ),
      (e) => e.status === status,
    );
    assert.equal(puts, 0);
  }
});
test("account changes suppress late media receipt and never start a put", async () => {
  let current = true,
    puts = 0;
  await assert.rejects(
    uploadDocumentImage(
      new File([bytes], "map.png", { type: "image/png" }),
      scope,
      {
        current: () => current,
        fetch: async () => {
          current = false;
          return response(425, { error: "Not uploaded" });
        },
        upload: async () => {
          puts++;
        },
      },
    ),
    (e) => e.status === 409,
  );
  assert.equal(puts, 0);
});
test("portable reader bounds actual bytes and rejects a different asset's receipt", async () => {
  const record = await asset();
  const options = {
    current: () => true,
    fetch: async (url) =>
      url.endsWith("?metadata=1")
        ? response(200, {
            asset: record,
            url: media.documentMediaUrl(scope, assetId),
          })
        : new Response(bytes, { headers: { "Content-Type": "image/png" } }),
  };
  const reopened = await readPortableDocumentMedia(scope, assetId, options);
  assert.deepEqual(reopened.bytes, bytes);
  await assert.rejects(
    readPortableDocumentMedia(
      scope,
      "55555555-5555-4555-8555-555555555555",
      options,
    ),
    (e) => e.status === 409,
  );
  options.fetch = async (url) =>
    url.endsWith("?metadata=1")
      ? response(200, {
          asset: record,
          url: media.documentMediaUrl(scope, assetId),
        })
      : new Response(new Uint8Array([1, 2, 3, 4]), {
          headers: { "Content-Type": "image/png" },
        });
  await assert.rejects(
    readPortableDocumentMedia(scope, assetId, options),
    (e) => e.status === 503,
  );
});

function editorHarness(onImageUpload, overrides = {}) {
  const appRequire = createRequire(
    path.resolve(__dirname, "../../apps/web/package.json"),
  );
  const React = appRequire("react");
  const { renderToStaticMarkup } = appRequire("react-dom/server");
  let upload;
  let extensions;
  const Wrapper = (props) => {
    if (props.extensions) extensions = props.extensions;
    return React.createElement("div", null, props.children);
  };
  const extension = { configure: () => ({}), extend: () => extension };
  const novel = new Proxy(
    {
      createImageUpload: (options) => {
        upload = options;
        return () => {};
      },
      createSuggestionItems: (items) => items,
      ...overrides,
    },
    {
      get: (target, name) =>
        name in target
          ? target[name]
          : String(name).startsWith("Editor") || name === "ImageResizer"
            ? Wrapper
            : extension,
    },
  );
  const filename = path.resolve(base, "../../components/docs/doc-editor.tsx");
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  new Function("exports", "require", "module", code)(
    module.exports,
    (name) => (name === "novel" ? novel : appRequire(name)),
    module,
  );
  const html = renderToStaticMarkup(
    React.createElement(module.exports.DocEditor, { onImageUpload }),
  );
  return { html, upload, extensions };
}

test("actual editor installs the real Novel upload plugin and inserts a verified image without losing its placeholder state", async () => {
  const filename = fs.realpathSync(
    path.resolve("apps/web/node_modules/novel/dist/index.js"),
  );
  const novelRequire = createRequire(filename);
  const source = fs.readFileSync(filename, "utf8");
  const parsed = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const variables = new Map(),
    functions = [],
    exports = new Map();
  for (const statement of parsed.statements) {
    if (ts.isVariableStatement(statement))
      for (const node of statement.declarationList.declarations)
        variables.set(
          node.name.getText(parsed),
          node.initializer?.getText(parsed),
        );
    if (ts.isFunctionDeclaration(statement))
      functions.push(statement.getText(parsed));
    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    )
      for (const entry of statement.exportClause.elements)
        exports.set(
          entry.name.text,
          entry.propertyName?.text ?? entry.name.text,
        );
  }
  const key = [...variables].find(([, value]) =>
    value?.startsWith('new PluginKey("upload-image")'),
  );
  assert.ok(key, "Use the installed library's actual upload key");
  const plugin = exports.get("UploadImagesPlugin"),
    upload = exports.get("createImageUpload");
  const helper = functions.find((fn) => fn.includes(`${key[0]}.getState(`));
  assert.ok(plugin && upload && helper);
  const { Plugin, PluginKey, EditorState } = novelRequire("@tiptap/pm/state");
  const { DecorationSet, Decoration } = novelRequire("@tiptap/pm/view");
  const { Schema } = novelRequire("@tiptap/pm/model");
  class Reader {
    readAsDataURL() {
      this.result = "data:image/png;base64,AQID";
      queueMicrotask(() => this.onload?.());
    }
  }
  const pipeline = new Function(
    "Plugin",
    "PluginKey",
    "DecorationSet",
    "Decoration",
    "document",
    "FileReader",
    `const ${key[0]}=${key[1]}; const ${plugin}=${variables.get(plugin)}; ${helper}; const ${upload}=${variables.get(upload)}; return {plugin:${plugin},upload:${upload},key:${key[0]}};`,
  )(
    Plugin,
    PluginKey,
    DecorationSet,
    Decoration,
    { createElement: () => ({ setAttribute() {}, appendChild() {} }) },
    Reader,
  );
  const image = novelRequire("@tiptap/extension-image").default;
  const { extensions } = editorHarness(async () => "unused", {
    TiptapImage: image,
    UploadImagesPlugin: pipeline.plugin,
  });
  const imageExtension = extensions.find(
    (extension) => extension.name === "image",
  );
  assert.equal(
    typeof imageExtension.config.addProseMirrorPlugins,
    "function",
    "Image uploads require the real plugin in the editor, not only an image node",
  );
  const plugins = imageExtension.config.addProseMirrorPlugins.call({
    parent: () => [],
  });
  const schema = new Schema({
    nodes: {
      doc: { content: "block+" },
      paragraph: { group: "block", content: "inline*" },
      text: { group: "inline" },
      image: { group: "block", attrs: { src: {} } },
    },
  });
  const view = {
    state: EditorState.create({ schema, plugins }),
    dispatch(transaction) {
      this.state = this.state.apply(transaction);
    },
  };
  assert.ok(pipeline.key.getState(view.state));
  let finish;
  const pending = new Promise((resolve) => {
    finish = resolve;
  });
  pipeline.upload({ validateFn: () => true, onUpload: () => pending })(
    new File([bytes], "map.png", { type: "image/png" }),
    view,
    view.state.selection.from,
  );
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(pipeline.key.getState(view.state).find().length, 1);
  finish(media.documentMediaUrl(scope, assetId));
  await new Promise((resolve) => setImmediate(resolve));
  const images = [];
  view.state.doc.descendants((node) => {
    if (node.type.name === "image") images.push(node.attrs.src);
  });
  assert.deepEqual(images, [media.documentMediaUrl(scope, assetId)]);
  assert.equal(pipeline.key.getState(view.state).find().length, 0);
});
test("actual editor exposes private image input and keeps original identity after a failed upload", async () => {
  let attempts = 0;
  const original = new File([bytes], "map.png", { type: "image/png" });
  const { html, upload } = editorHarness(async (file) => {
    assert.equal(file, original);
    if (++attempts === 1) throw Error("Storage unavailable");
    return media.documentMediaUrl(scope, assetId);
  });
  assert.match(html, />Add image<\/button>/);
  assert.match(html, /min-h-11/);
  assert.match(html, /up to 10 MiB/);
  assert.equal(upload.validateFn(original), true);
  await assert.rejects(upload.onUpload(original), /Storage unavailable/);
  await assert.rejects(
    upload.onUpload(new File([bytes], "another.png", { type: "image/png" })),
    /pending image/,
  );
  assert.equal(
    await upload.onUpload(original),
    media.documentMediaUrl(scope, assetId),
  );
  assert.equal(attempts, 2);
});
test("actual editor refuses active-content images before upload callback", () => {
  const { upload } = editorHarness(async () => {
    throw Error("No upload");
  });
  assert.equal(
    upload.validateFn(
      new File(["<svg/>"], "map.svg", { type: "image/svg+xml" }),
    ),
    false,
  );
});

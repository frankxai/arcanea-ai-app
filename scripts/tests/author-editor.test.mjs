import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import test from "node:test";
import { mountComponent } from "./helpers/hook-harness.mjs";

const path = "apps/web/app/studio/author/components/author-editor.tsx";
const payload = (text) => ({
  content_json: {
    type: "doc",
    content: [
      { type: "paragraph", content: text ? [{ type: "text", text }] : [] },
    ],
  },
  content_text: text,
  word_count: text.split(/\s+/).filter(Boolean).length,
});
const ok = () => ({
  ok: true,
  status: 200,
  json: async () => ({ success: true, source: "draft" }),
});
function setup(fetch, globals = {}) {
  const listeners = new Map();
  const view = mountComponent(path, "AuthorEditor", {
    modules: { "@/components/docs/doc-editor": { DocEditor: "editor" } },
    globals: {
      fetch,
      window: {
        addEventListener(name, handler) {
          listeners.set(name, handler);
        },
        removeEventListener(name) {
          listeners.delete(name);
        },
      },
      ...globals,
    },
    props: {
      bookSlug: "example",
      chapterSlug: "chapter-1",
      initialHtml: "<p>Initial</p>",
    },
  });
  return { view, listeners };
}
async function settle(view) {
  await setImmediate();
  view.render();
}

test("initial chapter HTML reaches the dedicated parser input", () => {
  const { view } = setup(async () => ok());
  const editor = view.find("editor");
  assert.equal(editor.props.initialHtml, "<p>Initial</p>");
  assert.equal(editor.props.initialContent, undefined);
  view.unmount();
});

test("expired authentication retains unsaved state and warns before leaving", async () => {
  const { view, listeners } = setup(async () => ({ ok: false, status: 401 }));
  view.find("editor").props.onSave(payload("A draft worth keeping"));
  await settle(view);
  assert.match(view.text(), /unsaved/i);
  let prevented = false;
  listeners.get("beforeunload")?.({
    preventDefault() {
      prevented = true;
    },
  });
  assert.equal(prevented, true);
  assert.ok(view.findButton("Retry save"));
  assert.ok(view.findButton("Download text"));
  view.unmount();
});

test("edits are marked immediately, before the autosave delay", () => {
  const { view, listeners } = setup(async () => ok());
  assert.equal(typeof view.find("editor").props.onChange, "function");
  view.find("editor").props.onChange(payload("Fresh words"));
  view.render();
  assert.match(view.text(), /unsaved/i);
  let prevented = false;
  listeners.get("beforeunload")?.({
    preventDefault() {
      prevented = true;
    },
  });
  assert.equal(prevented, true);
  view.unmount();
});

test("a failed HTTP response provides a retry; only confirmed success clears unsaved", async () => {
  let calls = 0;
  const { view, listeners } = setup(async () =>
    ++calls === 1 ? { ok: false, status: 503 } : ok(),
  );
  view.find("editor").props.onSave(payload("Saved after retry"));
  await settle(view);
  assert.match(view.text(), /could not save/i);
  view.findButton("Retry save").props.onClick();
  await settle(view);
  assert.equal(calls, 2);
  assert.match(view.text(), /draft saved/i);
  assert.doesNotMatch(view.text(), /unsaved/i);
  let prevented = false;
  listeners.get("beforeunload")?.({
    preventDefault() {
      prevented = true;
    },
  });
  assert.equal(prevented, false);
  view.unmount();
});

test("overlapping saves are serialized so older writes cannot finish after newer writes", async () => {
  const calls = [];
  const resolvers = [];
  const { view } = setup((url, init) => {
    calls.push(JSON.parse(init.body).content);
    return new Promise((resolve) => resolvers.push(resolve));
  });
  view.find("editor").props.onSave(payload("First"));
  view.render();
  view.find("editor").props.onSave(payload("Second"));
  view.render();
  assert.deepEqual(calls, ["First"]);
  resolvers[0](ok());
  await settle(view);
  assert.deepEqual(calls, ["First", "Second"]);
  assert.doesNotMatch(view.text(), /draft saved/i);
  resolvers[1](ok());
  await settle(view);
  assert.match(view.text(), /draft saved/i);
  view.unmount();
});

test("a save response never marks later unsent edits as saved", async () => {
  let resolve;
  const { view } = setup(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  view.find("editor").props.onSave(payload("Earlier"));
  view.render();
  view.find("editor").props.onChange(payload("Newer, waiting for debounce"));
  resolve(ok());
  await settle(view);
  assert.match(view.text(), /unsaved/i);
  assert.doesNotMatch(view.text(), /draft saved/i);
  view.unmount();
});

test("keyboard save includes an intentionally empty chapter", async () => {
  const calls = [];
  const { view, listeners } = setup(async (url, init) => {
    calls.push(JSON.parse(init.body).content);
    return ok();
  });
  view.find("editor").props.onChange(payload(""));
  view.render();
  let prevented = false;
  listeners.get("keydown")({
    key: "s",
    ctrlKey: true,
    preventDefault() {
      prevented = true;
    },
  });
  await settle(view);
  assert.equal(prevented, true);
  assert.deepEqual(calls, [""]);
  view.unmount();
});

for (const [label, response] of [
  ["an empty success body", {}],
  ["a published response", { success: true, source: "published" }],
  ["an unconfirmed draft", { source: "draft" }],
]) {
  test(`keeps unsaved edits after ${label}`, async () => {
    const { view } = setup(async () => ({
      ok: true,
      json: async () => response,
    }));
    view.find("editor").props.onSave(payload("Keep this"));
    await settle(view);
    assert.match(view.text(), /unsaved/i);
    assert.ok(view.findButton("Retry save"));
    view.unmount();
  });
}

test("network failures retain a retry and never show success", async () => {
  const { view } = setup(async () => {
    throw new TypeError("Network unavailable");
  });
  view.find("editor").props.onSave(payload("Offline"));
  await settle(view);
  assert.match(view.text(), /unsaved/i);
  assert.doesNotMatch(view.text(), /draft saved/i);
  assert.ok(view.findButton("Retry save"));
  view.unmount();
});

test("queued saves coalesce to the latest snapshot and duplicate saves do not write twice", async () => {
  const calls = [],
    resolvers = [];
  const { view } = setup((url, init) => {
    calls.push(JSON.parse(init.body).content);
    return new Promise((resolve) => resolvers.push(resolve));
  });
  const save = (text) => view.find("editor").props.onSave(payload(text));
  save("First");
  save("Second");
  save("Third");
  resolvers[0](ok());
  await settle(view);
  assert.deepEqual(calls, ["First", "Third"]);
  resolvers[1](ok());
  await settle(view);
  await save("Third");
  assert.deepEqual(calls, ["First", "Third"]);
  view.unmount();
});

test("download exports the newest text even while an earlier save is in flight", async () => {
  let resolve,
    exportedBlob,
    clicked = false,
    removed = false;
  const link = {
    click() {
      clicked = true;
    },
    remove() {
      removed = true;
    },
  };
  const revoked = [];
  const { view } = setup(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
    {
      URL: {
        createObjectURL(blob) {
          exportedBlob = blob;
          return "blob:draft";
        },
        revokeObjectURL(url) {
          revoked.push(url);
        },
      },
      document: { createElement: () => link, body: { appendChild() {} } },
      setTimeout(callback) {
        callback();
      },
    },
  );
  view.find("editor").props.onSave(payload("Earlier"));
  view.find("editor").props.onChange(payload("Latest words"));
  view.render();
  view.findButton("Download text").props.onClick();
  assert.equal(await exportedBlob.text(), "Latest words");
  assert.equal(link.download, "example-chapter-1-draft.txt");
  assert.equal(clicked, true);
  assert.equal(removed, true);
  assert.deepEqual(revoked, ["blob:draft"]);
  resolve(ok());
  await settle(view);
  assert.match(view.text(), /unsaved/i);
  view.unmount();
});

import assert from "node:assert/strict";
import test from "node:test";
import { mountComponent } from "./helpers/hook-harness.mjs";

const extension = { configure: () => ({}) };
const novel = Object.fromEntries(
  [
    "EditorRoot",
    "EditorContent",
    "EditorBubble",
    "EditorBubbleItem",
    "EditorCommand",
    "EditorCommandList",
    "EditorCommandItem",
    "EditorCommandEmpty",
    "ImageResizer",
  ].map((name) => [name, name]),
);
for (const name of [
  "StarterKit",
  "TiptapLink",
  "TiptapImage",
  "TiptapUnderline",
  "TaskList",
  "TaskItem",
  "TextStyle",
  "Color",
  "HighlightExtension",
  "Placeholder",
  "CodeBlockLowlight",
  "HorizontalRule",
  "CharacterCount",
  "GlobalDragHandle",
])
  novel[name] = extension;
novel.createImageUpload = () => () => {};
novel.createSuggestionItems = (items) => items;

function setup(props = {}) {
  const timers = new Map();
  let id = 0;
  const view = mountComponent(
    "apps/web/components/docs/doc-editor.tsx",
    "DocEditor",
    {
      modules: { novel },
      globals: {
        setTimeout(callback) {
          timers.set(++id, callback);
          return id;
        },
        clearTimeout(timer) {
          timers.delete(timer);
        },
      },
      props,
    },
  );
  return {
    view,
    timers,
    update(text) {
      const editor = {
        getJSON: () => ({ type: "doc", content: [] }),
        getText: () => text,
        storage: {},
      };
      view.find("EditorContent").props.onUpdate({ editor });
      return editor;
    },
    async flush() {
      const batch = [...timers.values()];
      timers.clear();
      for (const callback of batch) await callback();
    },
  };
}

test("a change reaches its parent immediately and saves only after the debounce", async () => {
  const changes = [],
    saves = [];
  const { update, flush, view } = setup({
    onChange: (value) => changes.push(value),
    onSave: (value) => saves.push(value),
  });
  update("An immediate change");
  assert.equal(changes.length, 1);
  assert.equal(changes[0].word_count, 3);
  assert.equal(saves.length, 0);
  await flush();
  assert.equal(saves[0].content_text, "An immediate change");
  view.unmount();
});

test("replacing a save callback does not flush early and the latest callback receives the save", async () => {
  const first = [],
    second = [];
  const { view, update, flush } = setup({
    onSave: (value) => first.push(value),
  });
  update("Still typing");
  view.render({ onSave: (value) => second.push(value) });
  assert.equal(first.length, 0);
  assert.equal(second.length, 0);
  await flush();
  assert.equal(first.length, 0);
  assert.equal(second[0].content_text, "Still typing");
  view.unmount();
});

test("an already completed save is not repeated on unmount", async () => {
  const saves = [];
  const { view, update, flush } = setup({
    onSave: (value) => saves.push(value),
  });
  update("Saved once");
  await flush();
  view.unmount();
  assert.equal(saves.length, 1);
});

test("unmount flushes the latest captured snapshot without reading a destroyed editor", () => {
  const saves = [];
  const { view, update, timers } = setup({
    onSave: (value) => saves.push(value),
  });
  update("First");
  const editor = update("Latest two words");
  editor.getJSON = editor.getText = () => {
    throw new Error("Editor destroyed");
  };
  view.unmount();
  assert.equal(timers.size, 0);
  assert.equal(saves.length, 1);
  assert.equal(saves[0].content_text, "Latest two words");
  assert.equal(saves[0].word_count, 3);
});

test("change reporting works without a save callback", () => {
  const changes = [];
  const { view, update, timers } = setup({
    onChange: (value) => changes.push(value),
  });
  update("Local editor");
  assert.equal(changes.length, 1);
  assert.equal(timers.size, 0);
  view.unmount();
});

test("HTML chapters use the parser without generating an edit or autosave", () => {
  const parsed = [],
    changes = [],
    saves = [];
  const html = "<h1>A chapter</h1><p>Words with <em>meaning</em>.</p>";
  const { view, timers } = setup({
    initialHtml: html,
    onChange: (value) => changes.push(value),
    onSave: (value) => saves.push(value),
  });
  const content = view.find("EditorContent");
  assert.equal(content.props.initialContent, undefined);
  content.props.onCreate({
    editor: {
      commands: {
        setContent(value, emitUpdate) {
          parsed.push({ value, emitUpdate });
        },
      },
    },
  });
  assert.deepEqual(parsed, [{ value: html, emitUpdate: false }]);
  assert.equal(changes.length, 0);
  assert.equal(saves.length, 0);
  assert.equal(timers.size, 0);
  view.unmount();
});

test("stored JSON takes precedence over the HTML fallback", () => {
  const json = { type: "doc", content: [{ type: "paragraph" }] };
  const { view } = setup({
    initialContent: json,
    initialHtml: "<p>Fallback</p>",
  });
  const content = view.find("EditorContent");
  assert.equal(content.props.initialContent, json);
  content.props.onCreate({
    editor: {
      commands: {
        setContent() {
          assert.fail("Stored JSON must not be overwritten");
        },
      },
    },
  });
  view.unmount();
});

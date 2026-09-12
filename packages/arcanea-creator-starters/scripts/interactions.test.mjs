import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const script = await readFile(
  new URL("../src/interactions.js", import.meta.url),
  "utf8",
);
// Lightweight event fixtures test the shipped script without launching a browser.
class Element {
  constructor(data = {}) {
    this.dataset = data;
    this.events = {};
    this.attrs = {};
    this.value = "";
    this.textContent = "";
    this.hidden = false;
    this.disabled = false;
  }
  addEventListener(name, fn) {
    this.events[name] = fn;
  }
  setAttribute(key, value) {
    this.attrs[key] = value;
  }
  removeAttribute(key) {
    delete this.attrs[key];
  }
  focus() {
    this.focused = true;
  }
  async emit(name) {
    await this.events[name]?.({ preventDefault() {} });
  }
}
function boot(map, href = "https://example.org/index.html") {
  const copied = [],
    urls = [];
  const document = {
    querySelector: (key) => map[key]?.[0] || null,
    querySelectorAll: (key) => map[key] || [],
    body: { classList: { contains: () => false, remove() {} } },
    addEventListener() {},
  };
  vm.runInNewContext(script, {
    document,
    location: new URL(href),
    URL,
    URLSearchParams,
    history: { replaceState: (_, __, url) => urls.push(String(url)) },
    navigator: { clipboard: { writeText: async (text) => copied.push(text) } },
    window: { addEventListener() {} },
    setTimeout,
    clearTimeout,
  });
  return { copied, urls };
}
test("gallery restores a shared category/search and can recover from empty results", async () => {
  const search = new Element(),
    status = new Element(),
    empty = new Element(),
    reset = new Element();
  const filters = ["all", "music", "labs", "tools"].map(
    (filter) => new Element({ filter }),
  );
  const cards = [
    new Element({
      category: "music",
      searchText: "session release listening room",
    }),
    new Element({
      category: "labs",
      searchText: "margin research publication",
    }),
    new Element({ category: "tools", searchText: "patch developer json" }),
  ];
  const { urls } = boot(
    {
      "[data-search]": [search],
      "[data-filter]": filters,
      "[data-category]": cards,
      "[data-filter-status]": [status],
      "[data-empty]": [empty],
      "[data-reset-search]": [reset],
    },
    "https://example.org/index.html?category=music&q=release",
  );
  assert.deepEqual(
    cards.map((c) => c.hidden),
    [false, true, true],
  );
  assert.equal(status.textContent, "1 starter shown");
  assert.equal(filters[1].attrs["aria-pressed"], "true");
  search.value = "nothing-matches";
  await search.emit("input");
  assert.equal(empty.hidden, false);
  assert.equal(status.textContent, "0 starters shown");
  await reset.emit("click");
  assert.ok(cards.every((c) => !c.hidden));
  assert.equal(search.focused, true);
  assert.equal(urls.at(-1), "https://example.org/index.html");
});
test("JSON workbench preserves invalid input, clears output, and prevents stale copying", async () => {
  const form = new Element(),
    input = new Element(),
    output = new Element(),
    status = new Element(),
    state = new Element(),
    copy = new Element(),
    example = new Element();
  input.value = '{"sample":true}';
  output.textContent = input.value;
  const { copied } = boot({
    "[data-json-form]": [form],
    "#json-input": [input],
    "[data-json-output]": [output],
    "[data-json-status]": [status],
    "[data-json-state]": [state],
    "[data-copy-json]": [copy],
    "[data-json-example]": [example],
  });
  input.value =
    '{"message":"<script>alert(1)</script>","__proto__":{"safe":true}}';
  await input.emit("input");
  assert.equal(copy.disabled, true);
  await form.emit("submit");
  assert.equal(copy.disabled, false);
  assert.equal(
    JSON.parse(output.textContent).message,
    "<script>alert(1)</script>",
  );
  assert.match(status.textContent, /No schema check/);
  await copy.emit("click");
  assert.equal(copied.length, 1);
  input.value = '{"broken":';
  await input.emit("input");
  await form.emit("submit");
  assert.equal(input.value, '{"broken":');
  assert.equal(input.attrs["aria-invalid"], "true");
  assert.match(output.textContent, /No formatted output/);
  assert.equal(copy.disabled, true);
  await copy.emit("click");
  assert.equal(copied.length, 1);
  await example.emit("click");
  assert.equal(input.value, '{"sample":true}');
  await form.emit("submit");
  assert.equal(copy.disabled, false);
  assert.equal(input.attrs["aria-invalid"], undefined);
});

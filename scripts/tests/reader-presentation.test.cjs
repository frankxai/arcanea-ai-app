"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const { createRequire } = require("node:module");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

const repo = path.resolve(__dirname, "../..");
const appRequire = createRequire(path.join(repo, "apps/web/package.json"));
const ts = appRequire("typescript");
const React = appRequire("react");
const { renderToStaticMarkup } = appRequire("react-dom/server");
const bookTitle = "The clocktower";
const title = "The missing bell";
const prose =
  "Mara heard the silence before she noticed the empty tower.\n\n## The stairway\n\nShe climbed.\n";
const manuscript = `# THE CLOCKTOWER\n\n## The missing bell\n\n---\n\n${prose}`;

// Execute actual components with actual React and Markdown. Only unrelated
// framework/media children are replaced; this is not a browser acceptance test.
function loadTs(relative, dependencies) {
  const filename = path.join(repo, relative);
  // Sparse local checkout: read unchanged dependencies from this Git revision.
  // CI has the full checkout; edited components always come from the worktree.
  const source = fs.existsSync(filename)
    ? fs.readFileSync(filename, "utf8")
    : execFileSync("git", ["show", `HEAD:${relative}`], {
        cwd: repo,
        encoding: "utf8",
      });
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const module = { exports: {} };
  const localRequire = (name) => {
    if (Object.hasOwn(dependencies, name)) return dependencies[name];
    if (name === "@/lib/content/reader-presentation")
      return loadTs("apps/web/lib/content/reader-presentation.ts", {});
    if (name === "react" || name === "react/jsx-runtime")
      return appRequire(name);
    throw Error(`Unadmitted component import: ${name}`);
  };
  vm.runInNewContext(
    compiled,
    { module, exports: module.exports, require: localRequire },
    { filename },
  );
  return module.exports;
}

async function renderReader(content, metadata = { bookTitle, title }) {
  const Markdown = await import(
    pathToFileURL(appRequire.resolve("react-markdown")).href
  );
  const noop = () => null;
  const ChatMarkdown = loadTs("apps/web/components/chat/chat-markdown.tsx", {
    "next/image": noop,
    "react-markdown": { __esModule: true, default: Markdown.default },
    "./code-block": ({ children }) =>
      React.createElement("code", null, children),
    "./image-lightbox": { ImageLightbox: noop },
    "@/lib/phosphor-icons": { ArrowsOut: noop },
  }).default;
  let sceneSource;
  const { ChapterReader } = loadTs(
    "apps/web/components/saga/chapter-reader.tsx",
    {
      "next/link": ({ children, ...props }) =>
        React.createElement("a", props, children),
      "next/navigation": { useRouter: () => ({ push: noop }) },
      "@/components/chat/chat-markdown": ChatMarkdown,
      "./reading-toolbar": { ReadingToolbar: noop },
      "./scene-visualizer": {
        SceneVisualizer: (props) => {
          sceneSource = props.sourceText;
          return null;
        },
      },
    },
  );
  const html = renderToStaticMarkup(
    React.createElement(ChapterReader, {
      bookId: "reader-render-fixture",
      ...metadata,
      content,
      chapterNumber: 1,
      totalChapters: 2,
      wordCount: 20,
      readTime: 1,
      prev: null,
      next: { id: "the-stairway", title: "The stairway" },
    }),
  );
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>(.*?)<\/h\1>/gs)].map(
    (match) => ({
      level: Number(match[1]),
      text: match[2]
        .replace(/<[^>]*>/g, "")
        .replace(
          /&#x([\da-f]+);|&#(\d+);|&(amp|lt|gt|quot|apos);/gi,
          (_, hex, decimal, named) =>
            hex || decimal
              ? String.fromCodePoint(parseInt(hex || decimal, hex ? 16 : 10))
              : { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[
                  named.toLowerCase()
                ],
        ),
    }),
  );
  return { html, headings, sceneSource };
}

test("actual chapter render presents its title once and omits repeated opening book metadata", async () => {
  const rendered = await renderReader(manuscript);
  assert.equal(rendered.headings.filter((h) => h.text === title).length, 1);
  assert.equal(
    rendered.headings.filter(
      (h) => h.text.toLowerCase() === bookTitle.toLowerCase(),
    ).length,
    0,
  );
  assert.ok(rendered.html.includes("Mara heard the silence"));
  assert.ok(rendered.headings.some((h) => h.text === "The stairway"));
});

test("actual reader passes the complete original manuscript to scene creation", async () => {
  const rendered = await renderReader(manuscript);
  assert.equal(rendered.sceneSource, manuscript);
});

test("actual reader preserves meaningful opening headings that differ from metadata", async () => {
  const content = "# A letter from Mara\n\n## Before the bell\n\n" + prose;
  const rendered = await renderReader(content);
  assert.ok(rendered.headings.some((h) => h.text === "A letter from Mara"));
  assert.ok(rendered.headings.some((h) => h.text === "Before the bell"));
  assert.equal(rendered.sceneSource, content);
});

const { getReaderContent } = loadTs(
  "apps/web/lib/content/reader-presentation.ts",
  {},
);

test("display projection preserves all remaining manuscript bytes", () => {
  assert.equal(getReaderContent(manuscript, bookTitle, title), prose);
  const crlf =
    "\r\n# THE CLOCKTOWER\r\n\r\n## The missing bell\r\n___\r\n\r\n" +
    prose.replaceAll("\n", "\r\n");
  assert.equal(
    getReaderContent(crlf, bookTitle, title),
    prose.replaceAll("\n", "\r\n"),
  );
  assert.equal(
    getReaderContent("## The missing bell\n\n" + prose, bookTitle, title),
    prose,
  );
});

test("only opening metadata is consumed, each title at most once", () => {
  const remainder = prose + "\n## The missing bell\n\nA later section.\n";
  assert.equal(
    getReaderContent("# THE CLOCKTOWER\n\n" + remainder, bookTitle, title),
    remainder,
  );
  const repeat = "## The missing bell\n\n" + prose;
  assert.equal(
    getReaderContent("## The missing bell\n\n" + repeat, bookTitle, title),
    repeat,
  );
});

test("nonmatching opening content is returned byte-for-byte", () => {
  for (const prefix of [
    "An author's note.\n\n",
    "# Another book\n\n",
    "### The missing bell\n\n",
    "```md\n# THE CLOCKTOWER\n```\n\n",
    "> # THE CLOCKTOWER\n\n",
    "    # THE CLOCKTOWER\n\n",
    "# **The clocktower**\n\n",
    "---\n\n",
    "<h1>The clocktower</h1>\n\n",
    "| title |\n| --- |\n| The clocktower |\n\n",
  ]) {
    const source = "\n" + prefix + manuscript;
    assert.equal(getReaderContent(source, bookTitle, title), source);
  }
});

test("a matching title cannot consume meaningful following content", () => {
  for (const suffix of [
    "# Another book\n\n" + prose,
    "### The missing bell\n\n" + prose,
    "```md\n## The missing bell\n```\n",
    "> ## The missing bell\n",
    "A dedication.\n\n## The missing bell\n" + prose,
  ]) {
    assert.equal(
      getReaderContent("# THE CLOCKTOWER\n\n" + suffix, bookTitle, title),
      suffix,
    );
  }
});

test("Unicode title comparison leaves original prose unchanged", () => {
  const body = "Caf\u00e9, bell, and silence.\r\n";
  assert.equal(
    getReaderContent("# CAFE\u0301\r\n\r\n" + body, "Caf\u00e9", "Chapter"),
    body,
  );
  assert.equal(getReaderContent("\nunchanged\r\n", "", ""), "\nunchanged\r\n");
  assert.equal(getReaderContent("", bookTitle, title), "");
});

test("numbered chapter headings match the existing loader conventions only", () => {
  for (const heading of [
    "Chapter One: The missing bell",
    "Chapter 2: The missing bell",
    "Kapitel 3: The missing bell",
    "Capítulo 4: The missing bell",
  ]) {
    assert.equal(
      getReaderContent(`# ${heading}\n\n${prose}`, bookTitle, title),
      prose,
    );
  }
  const source = "# Chapter One: An unrelated chapter\n\n" + prose;
  assert.equal(getReaderContent(source, bookTitle, title), source);
});

test("legacy book and series headings are kept before an exact numbered chapter title", () => {
  const prefix =
    "# The Gate of Foundation\n\n## Book One of the Arcanea Saga\n\n---\n\n";
  const source = prefix + "# Chapter One: The missing bell\n\n" + prose;
  assert.equal(getReaderContent(source, bookTitle, title), prefix + prose);
  for (const interruption of [
    "A dedication.\n\n",
    "```md\n# a heading\n```\n\n",
    "> A quotation.\n\n",
    "### A section\n\n",
  ]) {
    const content =
      prefix + interruption + "# Chapter One: The missing bell\n\n" + prose;
    assert.equal(getReaderContent(content, bookTitle, title), content);
  }
});

test("actual featured legacy chapters preserve their book/series and original scene source", async () => {
  const matter = appRequire("gray-matter");
  const { chapterTitleFromMarkdown } = loadTs(
    "apps/web/lib/saga/chapter-files.ts",
    { "gray-matter": matter },
  );
  for (const filename of [
    "01-the-storm-that-remembered.md",
    "04-the-triennium.md",
    "10-the-foundation-opens.md",
  ]) {
    const markdown = execFileSync(
      "git",
      ["show", `HEAD:book/chapters/book1/${filename}`],
      { cwd: repo, encoding: "utf8" },
    );
    const title = chapterTitleFromMarkdown(markdown, filename);
    const content = matter(markdown).content;
    const rendered = await renderReader(content, {
      bookTitle: "The Three Academies",
      title,
    });
    assert.equal(
      rendered.headings.filter(
        (h) => h.text.replace(/^Chapter\s+\w+:\s+/, "") === title,
      ).length,
      1,
      filename,
    );
    assert.ok(
      rendered.headings.some((h) => h.text === "The Gate of Foundation"),
      filename,
    );
    assert.ok(
      rendered.headings.some((h) => h.text === "Book One of the Arcanea Saga"),
      filename,
    );
    assert.equal(rendered.sceneSource, content, filename);
  }
});

test("four actual public entry manuscripts render one opening chapter title and preserve scene source", async () => {
  const matter = appRequire("gray-matter");
  const { chapterTitleFromMarkdown } = loadTs(
    "apps/web/lib/saga/chapter-files.ts",
    { "gray-matter": matter },
  );
  const entries = [
    ["forge-of-ruin", "00-prologue.md", "The Forge of Ruin"],
    ["heart-of-pyrathis", "01-the-cold-season.md", "The Heart of Pyrathis"],
    ["tides-of-silence", "01-the-gyres-hymn.md", "The Tides of Silence"],
    ["song-of-van-linh", "01-subject-7.md", "The Girl Who Heard the River"],
  ];
  for (const [id, filename, book] of entries) {
    const markdown = execFileSync(
      "git",
      ["show", `HEAD:book/${id}/chapters/${filename}`],
      { cwd: repo, encoding: "utf8" },
    );
    const chapter = chapterTitleFromMarkdown(markdown, filename);
    const content = matter(markdown).content;
    const rendered = await renderReader(content, {
      bookTitle: book,
      title: chapter,
    });
    assert.deepEqual(rendered.headings[0], { level: 1, text: chapter }, id);
    assert.ok(
      !rendered.headings
        .slice(1)
        .some((h) => h.text.toLowerCase() === book.toLowerCase()),
      id,
    );
    assert.ok(
      !rendered.headings
        .slice(1)
        .some((h) => h.text.replace(/^Chapter\s+\w+:\s+/, "") === chapter),
      id,
    );
    assert.equal(rendered.sceneSource, content, id);
    const display = getReaderContent(content, book, chapter);
    assert.ok(content.endsWith(display), id);
    assert.ok(display.length > 500, id);
  }
});

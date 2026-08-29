'use strict';

const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { mkdir, readFile, readdir, stat, writeFile } = require('node:fs/promises');
const path = require('node:path');
const JSZip = require('jszip');

const BOOK_ID = 'the-last-free-path';
const EDITION_ID = 'book-01-founding-cinematic';
const TITLE = 'The Last Free Path';
const SERIES = 'Chronicles of Arcanea';
const DESCRIPTION = 'Three young makers enter the Academies. The first lesson is who gets to own the person being taught.';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const CHAPTER_DIR = path.join(
  REPO_ROOT,
  'book',
  'chronicles-of-arcanea',
  'book-01-the-three-academies',
  'cinematic-edition',
  'chapters',
);

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const result = { draft: false, releaseDate: new Date().toISOString().slice(0, 10) };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--draft') {
      result.draft = true;
      continue;
    }
    if (!token.startsWith('--')) fail(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`Missing value for ${token}`);
    index += 1;
    if (token === '--out') result.out = path.resolve(value);
    else if (token === '--cover') result.cover = path.resolve(value);
    else if (token === '--author') result.author = value.trim();
    else if (token === '--release-date') result.releaseDate = value.trim();
    else fail(`Unknown argument: ${token}`);
  }

  if (!result.out) fail('Pass an explicit output directory with --out.');
  if (!result.author) fail('Pass the approved publication name with --author.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result.releaseDate)) fail('--release-date must be YYYY-MM-DD.');
  if (!result.draft && !result.cover) fail('A release build requires --cover. Use --draft only for internal layout QA.');
  return result;
}

function parseFrontmatter(raw, filename) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) fail(`${filename} is missing frontmatter.`);
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const divider = line.indexOf(':');
    if (divider < 0) continue;
    data[line.slice(0, divider).trim()] = line.slice(divider + 1).trim();
  }
  return { data, content: raw.slice(match[0].length) };
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderInline(value) {
  return escapeXml(value).replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

function renderParagraphs(markdown, filename) {
  const body = markdown.replace(/^#\s+.+\r?\n+/, '').trim();
  if (/^(?:>|##|[-*+]\s)/m.test(body)) {
    fail(`${filename} contains block Markdown the edition renderer does not handle.`);
  }
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map((lines) => {
      if (lines.every((line) => /^\d+\.\s+/.test(line))) {
        const items = lines
          .map((line) => `<li>${renderInline(line.replace(/^\d+\.\s+/, ''))}</li>`)
          .join('');
        return `<ol class="story-list">${items}</ol>`;
      }
      if (lines.some((line) => /^\d+\.\s+/.test(line))) {
        fail(`${filename} contains a numbered list mixed with prose in one block.`);
      }
      return `<p>${renderInline(lines.join(' '))}</p>`;
    })
    .join('\n');
}

function chapterNumber(filename) {
  const match = filename.match(/^chapter-(\d+)-/);
  return match ? Number.parseInt(match[1], 10) : Number.NaN;
}

async function loadChapters() {
  const files = (await readdir(CHAPTER_DIR))
    .filter((filename) => /^chapter-\d+-.+\.md$/.test(filename))
    .sort();
  if (files.length !== 32) fail(`Expected 32 chapters, found ${files.length}.`);

  const chapters = [];
  for (const filename of files) {
    const raw = await readFile(path.join(CHAPTER_DIR, filename), 'utf8');
    const { data, content } = parseFrontmatter(raw, filename);
    const number = chapterNumber(filename);
    if (data.status !== 'revised-draft') fail(`${filename} has release-ineligible status: ${data.status || 'missing'}.`);
    if (!data.title) fail(`${filename} is missing a title.`);
    chapters.push({
      number,
      id: `chapter-${String(number).padStart(2, '0')}`,
      title: data.title,
      pov: data.pov || '',
      movement: data.movement || '',
      xhtml: renderParagraphs(content, filename),
      wordCount: content
        .replace(/^#\s+.+$/m, '')
        .replace(/[*_`#]/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
      sourceSha256: sha256(raw),
    });
  }

  chapters.sort((left, right) => left.number - right.number);
  chapters.forEach((chapter, index) => {
    if (chapter.number !== index + 1) fail(`Chapter sequence breaks at ${chapter.number}.`);
  });
  return chapters;
}

function xhtmlDocument(title, body, bodyClass = '') {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body class="${escapeXml(bodyClass)}">
${body}
</body>
</html>`;
}

function chapterXhtml(chapter) {
  return xhtmlDocument(
    `${chapter.number}. ${chapter.title}`,
    `<article epub:type="chapter">
  <header class="chapter-header">
    <p class="chapter-number">Chapter ${chapter.number}</p>
    <h1>${escapeXml(chapter.title)}</h1>
    <p class="chapter-pov">${escapeXml(chapter.pov)}</p>
  </header>
  <div class="prose">${chapter.xhtml}</div>
</article>`,
    'chapter',
  );
}

function navXhtml(chapters, hasCover) {
  const entries = chapters
    .map((chapter) => `      <li><a href="${chapter.id}.xhtml">${chapter.number}. ${escapeXml(chapter.title)}</a></li>`)
    .join('\n');
  const landmarks = hasCover
    ? '      <li><a epub:type="cover" href="cover.xhtml">Cover</a></li>\n'
    : '';
  return xhtmlDocument(
    'Contents',
    `<nav epub:type="toc" id="toc">
  <h1>Contents</h1>
  <ol>
${entries}
  </ol>
</nav>
<nav epub:type="landmarks" hidden="hidden">
  <ol>
${landmarks}      <li><a epub:type="bodymatter" href="chapter-01.xhtml">Start reading</a></li>
  </ol>
</nav>`,
    'navigation',
  );
}

function contentOpf(chapters, author, releaseDate, cover) {
  const chapterItems = chapters
    .map((chapter) => `    <item id="${chapter.id}" href="${chapter.id}.xhtml" media-type="application/xhtml+xml" />`)
    .join('\n');
  const spineItems = chapters
    .map((chapter) => `    <itemref idref="${chapter.id}" />`)
    .join('\n');
  const coverItems = cover
    ? `    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml" />
    <item id="cover-image" href="${escapeXml(cover.filename)}" media-type="${cover.mediaType}" properties="cover-image" />\n`
    : '';
  const coverSpine = cover ? '    <itemref idref="cover-page" linear="no" />\n' : '';
  return `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="edition-id" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="edition-id">urn:arcanea:${BOOK_ID}:${EDITION_ID}</dc:identifier>
    <dc:title>${TITLE}</dc:title>
    <dc:creator>${escapeXml(author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:publisher>Arcanea</dc:publisher>
    <dc:description>${escapeXml(DESCRIPTION)}</dc:description>
    <dc:date>${releaseDate}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')}</meta>
    <meta property="belongs-to-collection">${SERIES}</meta>
    <meta property="collection-type">series</meta>
    <meta property="group-position">1</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="title-page" href="title.xhtml" media-type="application/xhtml+xml" />
    <item id="css" href="styles.css" media-type="text/css" />
${coverItems}${chapterItems}
  </manifest>
  <spine>
${coverSpine}    <itemref idref="title-page" />
${spineItems}
  </spine>
</package>`;
}

const EPUB_CSS = `
@charset "utf-8";
html { color: #211f1a; background: #fff; }
body { margin: 0 5%; font-family: Georgia, "Times New Roman", serif; line-height: 1.62; }
.title-page, .cover { text-align: center; }
.title-page { padding-top: 20vh; }
.eyebrow, .chapter-number, .chapter-pov { font-family: sans-serif; font-size: .72em; letter-spacing: .08em; color: #78603b; }
h1 { font-size: 2em; line-height: 1.08; font-weight: 500; }
.series { margin-top: 2em; }
.chapter-header { margin: 18vh 0 4em; text-align: center; break-after: avoid; }
.prose { max-width: 38em; margin: 0 auto; }
.prose p { margin: 0; text-indent: 1.25em; orphans: 2; widows: 2; }
.prose p:first-child { text-indent: 0; }
.prose p:first-child::first-letter { float: left; font-size: 3.35em; line-height: .82; padding: .08em .08em 0 0; color: #78603b; }
.story-list { margin: 1.2em 0 1.2em 1.4em; padding: 0; }
.story-list li { margin: .28em 0; }
em { font-style: italic; }
nav ol { padding-left: 1.4em; }
nav li { margin: .55em 0; }
nav a { color: inherit; text-decoration: none; }
.cover img { display: block; width: 100%; height: auto; margin: 0 auto; }
`;

const PRINT_CSS = `
@page { size: 6in 9in; margin: .78in .7in .76in; }
@page:first { margin: 0; }
html { color: #211f1a; background: white; font-family: Georgia, "Times New Roman", serif; }
body { margin: 0; font-size: 10.7pt; line-height: 1.48; }
.cover-page { width: 6in; height: 9in; break-after: page; overflow: hidden; }
.cover-page img { width: 100%; height: 100%; object-fit: cover; }
.title-page { height: 7.45in; break-after: page; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.title-page h1 { max-width: 4.5in; margin: .2in 0; font-size: 32pt; font-weight: 500; line-height: 1.05; }
.eyebrow, .chapter-number, .chapter-pov { font-family: Arial, sans-serif; font-size: 7.8pt; letter-spacing: .08em; color: #78603b; }
.contents { break-after: page; }
.contents ol { columns: 2; column-gap: .4in; padding-left: .25in; }
.contents li { break-inside: avoid; margin: 0 0 .09in; }
.contents a { color: inherit; text-decoration: none; }
.chapter { break-before: page; }
.chapter-header { min-height: 2.15in; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; text-align: center; }
.chapter-header h1 { max-width: 4.2in; margin: .12in 0; font-size: 22pt; line-height: 1.05; font-weight: 500; }
.prose { text-align: justify; hyphens: auto; }
.prose p { margin: 0; text-indent: .22in; orphans: 2; widows: 2; }
.prose p:first-child { text-indent: 0; }
.prose p:first-child::first-letter { float: left; font-size: 40pt; line-height: .78; padding: .07in .06in 0 0; color: #78603b; }
.story-list { margin: .16in 0 .16in .28in; padding: 0; }
.story-list li { margin: .035in 0; }
em { font-style: italic; }
`;

function titlePage(author) {
  return `<section class="title-page">
  <p class="eyebrow">${SERIES} · Book one</p>
  <h1>${TITLE}</h1>
  <p class="series">Founding cinematic edition</p>
  <p>${escapeXml(author)}</p>
</section>`;
}

function printHtml(chapters, author, cover) {
  const contents = chapters
    .map((chapter) => `<li><a href="#${chapter.id}">${chapter.number}. ${escapeXml(chapter.title)}</a></li>`)
    .join('\n');
  const chapterBodies = chapters
    .map((chapter) => `<article class="chapter" id="${chapter.id}">
  <header class="chapter-header">
    <p class="chapter-number">Chapter ${chapter.number}</p>
    <h1>${escapeXml(chapter.title)}</h1>
    <p class="chapter-pov">${escapeXml(chapter.pov)}</p>
  </header>
  <div class="prose">${chapter.xhtml}</div>
</article>`)
    .join('\n');
  const coverMarkup = cover
    ? `<section class="cover-page"><img src="${cover.dataUrl}" alt="Cover artwork for ${TITLE}" /></section>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${TITLE}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
${coverMarkup}
${titlePage(author)}
<nav class="contents" aria-label="Contents"><h1>Contents</h1><ol>${contents}</ol></nav>
${chapterBodies}
</body>
</html>`;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function loadCover(coverPath) {
  if (!coverPath) return null;
  const coverStat = await stat(coverPath).catch(() => null);
  if (!coverStat?.isFile()) fail(`Cover not found: ${coverPath}`);
  const extension = path.extname(coverPath).toLowerCase();
  const mediaType = extension === '.png' ? 'image/png' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : null;
  if (!mediaType) fail('Cover must be a PNG or JPEG.');
  const bytes = await readFile(coverPath);
  const filename = `cover${extension === '.jpeg' ? '.jpg' : extension}`;
  return {
    bytes,
    filename,
    mediaType,
    dataUrl: `data:${mediaType};base64,${bytes.toString('base64')}`,
    sha256: sha256(bytes),
  };
}

function sourceState(draft) {
  let commit;
  let changes;
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    changes = execFileSync(
      'git',
      ['status', '--porcelain', '--untracked-files=normal'],
      { cwd: REPO_ROOT, encoding: 'utf8' },
    ).trim();
  } catch {
    if (!draft) fail('Release builds require readable git provenance.');
    return { commit: null, dirty: true };
  }
  if (changes && !draft) {
    fail('Release builds require a clean git worktree. Commit or remove source changes first.');
  }
  return { commit, dirty: Boolean(changes) };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const [chapters, cover] = await Promise.all([loadChapters(), loadCover(options.cover)]);
  const provenance = sourceState(options.draft);
  await mkdir(options.out, { recursive: true });

  const zip = new JSZip();
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles>
</container>`);
  zip.file('OEBPS/styles.css', EPUB_CSS);
  zip.file('OEBPS/nav.xhtml', navXhtml(chapters, Boolean(cover)));
  zip.file('OEBPS/title.xhtml', xhtmlDocument(TITLE, titlePage(options.author), 'title-page'));
  if (cover) {
    zip.file(`OEBPS/${cover.filename}`, cover.bytes);
    zip.file('OEBPS/cover.xhtml', xhtmlDocument(
      `Cover — ${TITLE}`,
      `<div class="cover"><img src="${cover.filename}" alt="Cover artwork for ${TITLE}" /></div>`,
      'cover',
    ));
  }
  for (const chapter of chapters) zip.file(`OEBPS/${chapter.id}.xhtml`, chapterXhtml(chapter));
  zip.file('OEBPS/content.opf', contentOpf(chapters, options.author, options.releaseDate, cover));

  const epubBytes = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    mimeType: 'application/epub+zip',
    platform: 'UNIX',
  });
  const html = printHtml(chapters, options.author, cover);
  const epubPath = path.join(options.out, `${BOOK_ID}.epub`);
  const htmlPath = path.join(options.out, `${BOOK_ID}-print-source.html`);
  await Promise.all([
    writeFile(epubPath, epubBytes),
    writeFile(htmlPath, html, 'utf8'),
  ]);

  const manifest = {
    bookId: BOOK_ID,
    editionId: EDITION_ID,
    title: TITLE,
    series: SERIES,
    author: options.author,
    draft: options.draft,
    releaseDate: options.releaseDate,
    generatedAt: new Date().toISOString(),
    sourceCommit: provenance.commit,
    sourceDirty: provenance.dirty,
    manuscriptSha256: sha256(chapters.map((chapter) => `${chapter.number}:${chapter.sourceSha256}`).join('\n')),
    chapterCount: chapters.length,
    wordCount: chapters.reduce((total, chapter) => total + chapter.wordCount, 0),
    cover: cover ? { filename: cover.filename, sha256: cover.sha256 } : null,
    files: [
      { filename: path.basename(epubPath), bytes: epubBytes.length, sha256: sha256(epubBytes), format: 'EPUB 3' },
      { filename: path.basename(htmlPath), bytes: Buffer.byteLength(html), sha256: sha256(html), format: 'HTML print source' },
    ],
    pending: ['screen PDF render', 'print PDF render', 'cinematic artbook PDF', 'accessibility audit', 'EPUB conformance check', 'human approval'],
  };
  await writeFile(path.join(options.out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  process.stdout.write(`Built draft=${options.draft} chapters=${chapters.length} words=${manifest.wordCount} out=${options.out}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

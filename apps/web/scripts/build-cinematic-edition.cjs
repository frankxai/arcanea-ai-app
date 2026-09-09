'use strict';

const { lstat, readFile, readdir, realpath, writeFile } = require('node:fs/promises');
const path = require('node:path');
const {
  BOOK_DIR,
  EXPECTED_BOOK_ID,
  EXPECTED_EDITION_ID,
  EXPECTED_SERIES,
  EXPECTED_TITLE,
  REPO_ROOT,
  assertOutputFile,
  assertReleaseApproval,
  ensureOutputDirectory,
  fail,
  loadSpecification,
  normalizedPath,
  repositoryState,
  sha256,
  trackedHeadRecord,
  validateReleaseDate,
  workingTreeRecord,
} = require('./cinematic-edition-contract.cjs');

const BOOK_ID = EXPECTED_BOOK_ID;
const EDITION_ID = EXPECTED_EDITION_ID;
const TITLE = EXPECTED_TITLE;
const SERIES = EXPECTED_SERIES;
const DESCRIPTION = 'Three young makers enter the Academies. The first lesson is who gets to own the person being taught.';
const CHAPTER_DIR = path.join(BOOK_DIR, 'chapters');
const DRAFT_BYLINE = 'Byline pending approval';
const DRAFT_NOTICE = 'Protected staging proof · Not for distribution';

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
  validateReleaseDate(result.releaseDate);
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

async function loadChapters(draft) {
  const files = (await readdir(CHAPTER_DIR))
    .filter((filename) => /^chapter-\d+-.+\.md$/.test(filename))
    .sort();
  if (files.length !== 32) fail(`Expected 32 chapters, found ${files.length}.`);

  const chapters = [];
  for (const filename of files) {
    const absolute = path.join(CHAPTER_DIR, filename);
    const source = draft
      ? await workingTreeRecord(absolute, `Chapter source ${filename}`)
      : await trackedHeadRecord(absolute, `Chapter source ${filename}`);
    const raw = source.bytes.toString('utf8');
    const { data, content } = parseFrontmatter(raw, filename);
    const number = chapterNumber(filename);
    const allowedStatus = draft
      ? ['revised-draft', 'release-approved'].includes(data.status)
      : data.status === 'release-approved';
    if (!allowedStatus) {
      const required = draft ? 'revised-draft or release-approved' : 'release-approved';
      fail(`${filename} has status ${data.status || 'missing'}; ${required} is required.`);
    }
    if (!data.title) fail(`${filename} is missing a title.`);
    chapters.push({
      number,
      id: `chapter-${String(number).padStart(2, '0')}`,
      filename,
      repoPath: source.relative,
      title: data.title,
      pov: data.pov || '',
      movement: data.movement || '',
      status: data.status,
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

function chapterXhtml(chapter, draft = false) {
  return xhtmlDocument(
    `${chapter.number}. ${chapter.title}`,
    `<article epub:type="chapter">
  <header class="chapter-header">
    ${draft ? `<p class="draft-mark">${DRAFT_NOTICE}</p>` : ''}
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

function contentOpf(chapters, author, releaseDate, cover, draft = false) {
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
    <dc:title>${draft ? `${TITLE} — protected staging proof` : TITLE}</dc:title>
    <dc:creator>${escapeXml(author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:publisher>${draft ? 'Arcanea internal proof' : 'Arcanea'}</dc:publisher>
    <dc:description>${escapeXml(draft ? `${DRAFT_NOTICE}. ${DESCRIPTION}` : DESCRIPTION)}</dc:description>
    <dc:rights>${draft ? DRAFT_NOTICE : 'Publication rights recorded in the edition manifest.'}</dc:rights>
${draft ? '' : `    <dc:date>${releaseDate}</dc:date>\n`}    <meta property="dcterms:modified">${releaseDate}T00:00:00Z</meta>
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
.draft-mark { margin: 0 0 1.2em; font-family: sans-serif; font-size: .66em; letter-spacing: .05em; color: #8b2f2f; }
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
.draft .cover-page { position: relative; }
.draft-cover-mark { position: absolute; left: .22in; right: .22in; bottom: .22in; z-index: 2; padding: .08in .12in; background: rgba(255,255,255,.92); border: 1px solid #8b2f2f; color: #742626; font: 700 8pt/1.2 system-ui, sans-serif; text-align: center; }
.draft::before { content: "Protected staging · Not for distribution"; position: fixed; z-index: 20; top: .14in; right: .18in; color: #8b2f2f; font: 700 6.8pt/1 system-ui, sans-serif; letter-spacing: .04em; }
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
.draft-mark { margin: 0 0 .15in; color: #8b2f2f; font: 700 7.5pt/1.2 system-ui, sans-serif; letter-spacing: .04em; }
em { font-style: italic; }
`;

function titlePage(author, draft = false) {
  return `<section class="title-page">
  ${draft ? `<p class="draft-mark">${DRAFT_NOTICE}</p>` : ''}
  <p class="eyebrow">${SERIES} · Book one</p>
  <h1>${TITLE}</h1>
  <p class="series">${draft ? 'Founding cinematic edition · protected proof' : 'Founding cinematic edition'}</p>
  <p>${escapeXml(author)}</p>
</section>`;
}

function printHtml(chapters, author, cover, draft = false) {
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
    ? `<section class="cover-page"><img src="${cover.dataUrl}" alt="Cover artwork for ${TITLE}" />${draft ? `<div class="draft-cover-mark">${DRAFT_NOTICE}</div>` : ''}</section>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${TITLE}</title>
  <style>${PRINT_CSS}</style>
</head>
<body${draft ? ' class="draft"' : ''}>
${coverMarkup}
${titlePage(author, draft)}
<nav class="contents" aria-label="Contents"><h1>Contents</h1><ol>${contents}</ol></nav>
${chapterBodies}
</body>
</html>`;
}

function imageDimensions(bytes, mediaType) {
  if (mediaType === 'image/png') {
    const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature)) fail('Cover has an invalid PNG header.');
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) fail('Cover has an invalid JPEG header.');
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) fail('Cover has a truncated JPEG segment.');
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  fail('Cover JPEG dimensions are unavailable.');
}

async function loadCover(coverPath, spec, draft) {
  if (!coverPath) return null;
  const expectedPath = path.resolve(REPO_ROOT, spec.cover.path);
  if (normalizedPath(coverPath) !== normalizedPath(expectedPath)) {
    fail(`Cover must use the edition specification asset: ${spec.cover.path}.`);
  }
  const coverStat = await lstat(expectedPath).catch(() => null);
  if (!coverStat?.isFile() || coverStat.isSymbolicLink()) fail(`Cover must be a regular file, not a link: ${expectedPath}`);
  const coverReal = await realpath(expectedPath);
  if (normalizedPath(coverReal) !== normalizedPath(expectedPath)) fail('Cover resolves through an alias or linked parent.');
  const source = draft
    ? { bytes: await readFile(coverReal), relative: spec.cover.path }
    : await trackedHeadRecord(coverReal, 'Edition cover');
  const extension = path.extname(coverReal).toLowerCase();
  const mediaType = extension === '.png' ? 'image/png' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : null;
  if (!mediaType) fail('Cover must be a PNG or JPEG.');
  const bytes = source.bytes;
  const digest = sha256(bytes);
  if (digest !== spec.cover.sha256) fail('Cover does not match its edition specification SHA-256.');
  const dimensions = imageDimensions(bytes, mediaType);
  if (dimensions.width !== spec.cover.width || dimensions.height !== spec.cover.height) {
    fail(`Cover dimensions are ${dimensions.width}×${dimensions.height}; expected ${spec.cover.width}×${spec.cover.height}.`);
  }
  const filename = `cover${extension === '.jpeg' ? '.jpg' : extension}`;
  return {
    assetId: spec.cover.assetId,
    bytes,
    filename,
    mediaType,
    repoPath: source.relative,
    width: dimensions.width,
    height: dimensions.height,
    status: spec.cover.status,
    approvalReceipts: { ...spec.cover.approvalReceipts },
    dataUrl: `data:${mediaType};base64,${bytes.toString('base64')}`,
    sha256: digest,
  };
}

function addZipFile(zip, filename, content, archiveDate, options = {}) {
  zip.file(filename, content, { createFolders: false, date: archiveDate, ...options });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const JSZip = require('jszip');
  const provenance = repositoryState(options.draft);
  const { spec, receipt: specReceipt } = await loadSpecification(options.draft);
  const chapters = await loadChapters(options.draft);
  const manuscriptSha256 = sha256(chapters.map((chapter) => `${chapter.number}:${chapter.sourceSha256}`).join('\n'));
  assertReleaseApproval(spec, options.draft, options.author, manuscriptSha256);
  const displayAuthor = options.draft ? DRAFT_BYLINE : options.author;
  const [cover, outputDirectory] = await Promise.all([
    loadCover(options.cover, spec, options.draft),
    ensureOutputDirectory(options.out),
  ]);
  options.out = outputDirectory;
  const archiveDate = new Date(`${options.releaseDate}T00:00:00Z`);

  const zip = new JSZip();
  addZipFile(zip, 'mimetype', 'application/epub+zip', archiveDate, { compression: 'STORE' });
  addZipFile(zip, 'META-INF/container.xml', `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles>
</container>`, archiveDate);
  addZipFile(zip, 'OEBPS/styles.css', EPUB_CSS, archiveDate);
  addZipFile(zip, 'OEBPS/nav.xhtml', navXhtml(chapters, Boolean(cover)), archiveDate);
  addZipFile(zip, 'OEBPS/title.xhtml', xhtmlDocument(TITLE, titlePage(displayAuthor, options.draft), 'title-page'), archiveDate);
  if (cover) {
    addZipFile(zip, `OEBPS/${cover.filename}`, cover.bytes, archiveDate);
    addZipFile(zip, 'OEBPS/cover.xhtml', xhtmlDocument(
      `Cover — ${TITLE}`,
      `<div class="cover"><img src="${cover.filename}" alt="Cover artwork for ${TITLE}" />${options.draft ? `<p class="draft-mark">${DRAFT_NOTICE}</p>` : ''}</div>`,
      'cover',
    ), archiveDate);
  }
  for (const chapter of chapters) {
    addZipFile(zip, `OEBPS/${chapter.id}.xhtml`, chapterXhtml(chapter, options.draft), archiveDate);
  }
  addZipFile(zip, 'OEBPS/content.opf', contentOpf(
    chapters,
    displayAuthor,
    options.releaseDate,
    cover,
    options.draft,
  ), archiveDate);

  const epubBytes = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    mimeType: 'application/epub+zip',
    platform: 'UNIX',
  });
  const html = printHtml(chapters, displayAuthor, cover, options.draft);
  const epubPath = path.join(options.out, `${BOOK_ID}.epub`);
  const htmlPath = path.join(options.out, `${BOOK_ID}-print-source.html`);
  const manifestPath = path.join(options.out, 'manifest.json');
  await Promise.all([
    assertOutputFile(epubPath, 'EPUB output'),
    assertOutputFile(htmlPath, 'Print source output'),
    assertOutputFile(manifestPath, 'Edition manifest output'),
  ]);
  await Promise.all([
    writeFile(epubPath, epubBytes),
    writeFile(htmlPath, html, 'utf8'),
  ]);

  const manifest = {
    bookId: BOOK_ID,
    editionId: EDITION_ID,
    title: TITLE,
    series: SERIES,
    author: displayAuthor,
    draft: options.draft,
    releaseDate: options.releaseDate,
    generatedAt: new Date().toISOString(),
    sourceCommit: provenance.commit,
    sourceDirty: provenance.dirty,
    manuscriptSha256,
    chapterCount: chapters.length,
    wordCount: chapters.reduce((total, chapter) => total + chapter.wordCount, 0),
    cover: cover ? {
      assetId: cover.assetId,
      filename: cover.filename,
      path: cover.repoPath,
      sha256: cover.sha256,
      width: cover.width,
      height: cover.height,
      status: cover.status,
      approvalReceipts: cover.approvalReceipts,
    } : null,
    edition: {
      status: spec.status,
      manuscriptStatus: spec.manuscriptStatus,
      titleStatus: spec.titleStatus,
      rightsStatus: spec.rightsStatus,
      approvedManuscriptSha256: spec.approvedManuscriptSha256,
      humanApprovals: { ...spec.humanApprovals },
      approvalReceipts: { ...spec.approvalReceipts },
      publication: { ...spec.publication },
      spec: specReceipt,
      requiredReleaseChapterStatus: 'release-approved',
      chapters: chapters.map((chapter) => ({
        number: chapter.number,
        filename: chapter.filename,
        path: chapter.repoPath,
        status: chapter.status,
        sha256: chapter.sourceSha256,
      })),
    },
    files: [
      { filename: path.basename(epubPath), bytes: epubBytes.length, sha256: sha256(epubBytes), format: 'EPUB 3' },
      { filename: path.basename(htmlPath), bytes: Buffer.byteLength(html), sha256: sha256(html), format: 'HTML print source' },
    ],
    pending: ['screen PDF render', 'print PDF render', 'cinematic artbook PDF', 'accessibility audit', 'EPUB conformance check', 'human approval'],
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  process.stdout.write(`Built draft=${options.draft} chapters=${chapters.length} words=${manifest.wordCount} out=${options.out}\n`);
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  contentOpf,
  imageDimensions,
  loadChapters,
  loadCover,
  parseArgs,
  printHtml,
  renderParagraphs,
};

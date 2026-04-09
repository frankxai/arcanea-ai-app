/**
 * Arcanea Publishing House — Scribe Claw: Content Formatting Pipeline
 *
 * Reads a markdown source file and generates EPUB, PDF, DOCX, and HTML
 * outputs via Pandoc shell commands. Handles front matter extraction and
 * metadata injection.
 */

import { execFile } from "node:child_process";
import { readFile, mkdir, access } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { promisify } from "node:util";

import type { FormatOptions, FormatResult, FrontMatter } from "./types.js";

export type { FormatOptions, FormatResult, FrontMatter };

const execFileAsync = promisify(execFile);

// ---------------------------------------------------------------------------
// Front matter extraction
// ---------------------------------------------------------------------------

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Extract YAML-style front matter from markdown content.
 * Returns the parsed key-value pairs and the body without front matter.
 */
export function extractFrontMatter(
  content: string,
): { frontMatter: FrontMatter; body: string } {
  const match = FRONT_MATTER_RE.exec(content);
  if (!match) {
    return { frontMatter: {}, body: content };
  }

  const raw = match[1];
  const frontMatter: FrontMatter = {};

  for (const line of raw.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) {
      frontMatter[key] = value;
    }
  }

  const body = content.slice(match[0].length).trimStart();
  return { frontMatter, body };
}

// ---------------------------------------------------------------------------
// Pandoc helpers
// ---------------------------------------------------------------------------

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

async function pandocAvailable(): Promise<boolean> {
  try {
    await execFileAsync("pandoc", ["--version"]);
    return true;
  } catch {
    return false;
  }
}

function buildPandocArgs(
  sourcePath: string,
  outputPath: string,
  options: FormatOptions,
  extraArgs: string[] = [],
): string[] {
  const args: string[] = [
    sourcePath,
    "-o",
    outputPath,
    "--metadata",
    `title=${options.title}`,
    "--metadata",
    `author=${options.author}`,
    "--metadata",
    `lang=${options.language}`,
    "--metadata",
    `date=${new Date().toISOString().slice(0, 10)}`,
  ];

  if (options.tocDepth !== undefined && options.tocDepth > 0) {
    args.push("--toc", `--toc-depth=${options.tocDepth}`);
  }

  if (options.coverImage) {
    args.push("--metadata", `cover-image=${options.coverImage}`);
  }

  args.push(...extraArgs);
  return args;
}

async function runPandoc(args: string[]): Promise<void> {
  try {
    await execFileAsync("pandoc", args, { timeout: 120_000 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown pandoc error";
    throw new Error(`Pandoc conversion failed: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Format a markdown file into EPUB, PDF, DOCX, and HTML outputs.
 *
 * Requires Pandoc to be installed on the system. For PDF output, a LaTeX
 * engine (e.g. xelatex or tectonic) must also be available. If PDF
 * generation fails, the result will contain an empty string for `pdf`.
 *
 * @param sourcePath - Absolute path to the source markdown file
 * @param outputDir  - Directory where output files will be written
 * @param options    - Format configuration (title, author, language, etc.)
 * @returns Paths to the generated output files
 * @throws If pandoc is not installed or the source file cannot be read
 */
export async function formatMarkdown(
  sourcePath: string,
  outputDir: string,
  options: FormatOptions,
): Promise<FormatResult> {
  // Validate pandoc availability
  const hasPandoc = await pandocAvailable();
  if (!hasPandoc) {
    throw new Error(
      "Pandoc is not installed or not in PATH. Install from https://pandoc.org/installing.html",
    );
  }

  // Validate source file exists
  try {
    await access(sourcePath);
  } catch {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  // Read source to extract front matter (may override options)
  const raw = await readFile(sourcePath, "utf-8");
  const { frontMatter } = extractFrontMatter(raw);

  // Merge front matter into options (explicit options take precedence)
  const mergedOptions: FormatOptions = {
    title: options.title || frontMatter.title || "Untitled",
    author: options.author || frontMatter.author || "Unknown",
    language: options.language || frontMatter.language || "en",
    coverImage: options.coverImage,
    tocDepth: options.tocDepth,
    css: options.css,
  };

  await ensureDir(outputDir);

  const stem = basename(sourcePath, extname(sourcePath));

  const epubPath = join(outputDir, `${stem}.epub`);
  const pdfPath = join(outputDir, `${stem}.pdf`);
  const docxPath = join(outputDir, `${stem}.docx`);
  const htmlPath = join(outputDir, `${stem}.html`);

  // Build CSS args for HTML and EPUB
  const cssArgs: string[] = mergedOptions.css
    ? ["--css", mergedOptions.css]
    : [];

  // Run all conversions — EPUB, DOCX, HTML in parallel. PDF may fail
  // if no LaTeX engine is available, so we handle it gracefully.
  const conversions = [
    runPandoc(
      buildPandocArgs(sourcePath, epubPath, mergedOptions, [
        "--epub-chapter-level=2",
        ...cssArgs,
      ]),
    ),
    runPandoc(
      buildPandocArgs(sourcePath, docxPath, mergedOptions),
    ),
    runPandoc(
      buildPandocArgs(sourcePath, htmlPath, mergedOptions, [
        "--standalone",
        "--self-contained",
        ...cssArgs,
      ]),
    ),
  ];

  // PDF conversion (may fail without LaTeX)
  const pdfConversion = runPandoc(
    buildPandocArgs(sourcePath, pdfPath, mergedOptions, [
      "--pdf-engine=xelatex",
    ]),
  ).catch(() => null);

  const [, , , pdfResult] = await Promise.all([
    ...conversions,
    pdfConversion,
  ]);

  return {
    epub: epubPath,
    pdf: pdfResult === null ? "" : pdfPath,
    docx: docxPath,
    html: htmlPath,
  };
}

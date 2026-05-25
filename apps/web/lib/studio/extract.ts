/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Binary file → markdown-friendly text extraction
 *
 * Supports:
 *   - PDF via `unpdf` (edge-friendly, no native deps)
 *   - DOCX via `mammoth` (extracts to HTML then to markdown)
 *   - Plain text / markdown (passthrough)
 *
 * Falls back to the filename + "unsupported file type" note when we can't
 * extract — the doc still lands in the vault as a reference record.
 */

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB cap — generous but not open door

export interface ExtractResult {
  text: string;
  mimeType: string;
  pageCount?: number;
  warning?: string;
}

function isPdf(mimeType: string, name: string): boolean {
  return mimeType === 'application/pdf' || /\.pdf$/i.test(name);
}

function isDocx(mimeType: string, name: string): boolean {
  return (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    /\.docx$/i.test(name)
  );
}

function isTextLike(mimeType: string, name: string): boolean {
  if (mimeType.startsWith('text/')) return true;
  return /\.(md|mdx|txt|json|yaml|yml|csv|tsv)$/i.test(name);
}

/**
 * Convert Mammoth's minimal HTML output to markdown.
 * Handles headings, bold, em, lists, paragraphs. Dependency-free.
 */
function mammothHtmlToMarkdown(html: string): string {
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function extractFile(file: {
  name: string;
  mimeType: string;
  bytes: ArrayBuffer;
}): Promise<ExtractResult> {
  if (file.bytes.byteLength > MAX_BYTES) {
    throw new Error(`File exceeds ${MAX_BYTES / 1024 / 1024} MB limit`);
  }

  // Text / markdown passthrough
  if (isTextLike(file.mimeType, file.name)) {
    const text = new TextDecoder('utf-8').decode(file.bytes);
    return { text, mimeType: file.mimeType || 'text/plain' };
  }

  // PDF
  if (isPdf(file.mimeType, file.name)) {
    try {
      const { getDocumentProxy, extractText } = await import('unpdf');
      const pdf = await getDocumentProxy(new Uint8Array(file.bytes));
      const { text, totalPages } = await extractText(pdf, { mergePages: true });
      const merged = Array.isArray(text) ? text.join('\n\n') : String(text ?? '');
      return {
        text: merged.trim(),
        mimeType: 'application/pdf',
        pageCount: totalPages,
      };
    } catch (e) {
      throw new Error(
        `PDF extraction failed: ${e instanceof Error ? e.message : 'unknown'}`,
      );
    }
  }

  // DOCX
  if (isDocx(file.mimeType, file.name)) {
    try {
      const mammoth = await import('mammoth');
      // Node Buffer path works in Node runtime; Edge needs ArrayBuffer input
      // mammoth accepts { arrayBuffer: ... } in both runtimes
      const { value: html, messages } = await mammoth.convertToHtml({
        arrayBuffer: file.bytes,
      });
      const markdown = mammothHtmlToMarkdown(html);
      const warning = messages.length > 0 ? messages.map((m) => m.message).join('; ') : undefined;
      return {
        text: markdown,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        warning,
      };
    } catch (e) {
      throw new Error(
        `DOCX extraction failed: ${e instanceof Error ? e.message : 'unknown'}`,
      );
    }
  }

  throw new Error(`Unsupported file type: ${file.mimeType || file.name}`);
}

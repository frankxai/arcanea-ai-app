/**
 * Generate a unique ID (no external deps).
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Count words in a string.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Slugify a title for filenames.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '');
}

/**
 * Sanitize text content — strip HTML tags, normalize whitespace.
 */
export function sanitizeText(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

/**
 * Extract text content from a DOM element, preserving code blocks.
 */
export function extractTextFromElement(el: Element): string {
  const parts: string[] = [];

  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.textContent || '');
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tag = element.tagName.toLowerCase();

      if (tag === 'pre' || tag === 'code') {
        const lang = element.className.match(/language-(\w+)/)?.[1] || '';
        const code = element.textContent || '';
        parts.push(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
      } else if (tag === 'br') {
        parts.push('\n');
      } else if (tag === 'p') {
        parts.push(`\n${extractTextFromElement(element)}\n`);
      } else if (tag === 'img') {
        const src = element.getAttribute('src') || '';
        const alt = element.getAttribute('alt') || 'image';
        parts.push(`\n![${alt}](${src})\n`);
      } else if (tag === 'a') {
        const href = element.getAttribute('href') || '';
        const text = element.textContent || href;
        parts.push(`[${text}](${href})`);
      } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        const level = parseInt(tag[1]);
        const prefix = '#'.repeat(level);
        parts.push(`\n${prefix} ${element.textContent || ''}\n`);
      } else if (tag === 'li') {
        parts.push(`\n- ${extractTextFromElement(element)}`);
      } else if (tag === 'ol') {
        const items = element.querySelectorAll(':scope > li');
        items.forEach((li, i) => {
          parts.push(`\n${i + 1}. ${extractTextFromElement(li)}`);
        });
      } else if (tag === 'strong' || tag === 'b') {
        parts.push(`**${element.textContent || ''}**`);
      } else if (tag === 'em' || tag === 'i') {
        parts.push(`*${element.textContent || ''}*`);
      } else {
        parts.push(extractTextFromElement(element));
      }
    }
  }

  return parts.join('');
}

/**
 * Wait for a DOM element to appear.
 */
export function waitForElement(
  selector: string,
  timeout = 5000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

/**
 * Format a timestamp as ISO date string.
 */
export function formatDate(ts: number): string {
  return new Date(ts).toISOString();
}

/**
 * Safely query all matching elements and return as array.
 */
export function queryAll(selector: string, root: Element | Document = document): Element[] {
  return Array.from(root.querySelectorAll(selector));
}

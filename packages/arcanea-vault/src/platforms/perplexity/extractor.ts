import type {
  PlatformExtractor,
  PlatformSelectors,
  ExportedConversation,
  ExportedMessage,
  ExportedArtifact,
  ExportedImage,
  Citation,
} from '../../shared/types';
import { PERPLEXITY_SELECTORS } from './selectors';
import { generateId, countWords, extractTextFromElement, queryAll } from '../../shared/utils';

export class PerplexityExtractor implements PlatformExtractor {
  readonly platform = 'perplexity' as const;

  matchUrl(url: string): boolean {
    return /perplexity\.ai/.test(url);
  }

  getSelectors(): PlatformSelectors {
    return PERPLEXITY_SELECTORS;
  }

  async extractCurrentConversation(): Promise<ExportedConversation> {
    const sel = PERPLEXITY_SELECTORS;
    const messages = this.extractMessages(sel);
    const artifacts = this.extractCodeBlocks(sel);
    const images = this.extractImages(sel);
    const citations = this.extractCitations(sel);
    const title = this.extractTitle();
    const fullText = messages.map((m) => m.content).join(' ');

    return {
      id: this.extractConversationId(),
      platform: 'perplexity',
      title,
      messages,
      artifacts,
      images,
      exportedAt: Date.now(),
      metadata: {
        model: this.detectModel(),
        messageCount: messages.length,
        wordCount: countWords(fullText),
        hasCode: artifacts.length > 0,
        hasImages: images.length > 0,
        hasArtifacts: false,
        citations,
      },
    };
  }

  private extractMessages(sel: PlatformSelectors): ExportedMessage[] {
    const messages: ExportedMessage[] = [];

    // Perplexity uses query/answer pairs
    const queryBlocks = queryAll(sel.userMessage);
    const answerBlocks = queryAll(sel.assistantMessage);

    // Interleave: query → answer → query → answer ...
    const maxLen = Math.max(queryBlocks.length, answerBlocks.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < queryBlocks.length) {
        const content = extractTextFromElement(queryBlocks[i]);
        if (content.trim()) {
          messages.push({ role: 'user', content: content.trim() });
        }
      }
      if (i < answerBlocks.length) {
        const content = extractTextFromElement(answerBlocks[i]);
        if (content.trim()) {
          messages.push({
            role: 'assistant',
            content: content.trim(),
            model: this.detectModel(),
          });
        }
      }
    }

    return messages;
  }

  private extractCodeBlocks(sel: PlatformSelectors): ExportedArtifact[] {
    const artifacts: ExportedArtifact[] = [];
    const codeBlocks = queryAll(sel.codeBlock);

    for (const block of codeBlocks) {
      const language = block.className.match(/language-(\w+)/)?.[1] || 'text';
      const code = block.textContent || '';
      if (!code.trim()) continue;

      artifacts.push({
        id: generateId(),
        type: 'code',
        title: `Code (${language})`,
        content: code,
        language,
      });
    }

    return artifacts;
  }

  private extractImages(sel: PlatformSelectors): ExportedImage[] {
    const images: ExportedImage[] = [];
    if (!sel.imageBlock) return images;

    const imgEls = queryAll(sel.imageBlock);
    for (const img of imgEls) {
      const src = img.getAttribute('src');
      if (!src) continue;

      images.push({
        id: generateId(),
        url: src,
        prompt: img.getAttribute('alt') || undefined,
      });
    }

    return images;
  }

  private extractCitations(sel: PlatformSelectors): Citation[] {
    const citations: Citation[] = [];
    if (!sel.citationBlock) return citations;

    const seen = new Set<string>();
    const citationEls = queryAll(sel.citationBlock);

    for (const el of citationEls) {
      const url = el.getAttribute('href');
      if (!url || seen.has(url)) continue;
      seen.add(url);

      const title = el.textContent?.trim() || el.getAttribute('title') || url;
      const snippet = el.closest('[data-testid="source-card"]')?.querySelector('.text-sm')?.textContent?.trim();

      citations.push({ title, url, snippet });
    }

    return citations;
  }

  private extractTitle(): string {
    const titleEl = document.querySelector('title');
    const title = titleEl?.textContent || '';
    const cleaned = title.replace(/\s*[-|]\s*Perplexity$/i, '').trim();
    return cleaned || 'Untitled Perplexity Search';
  }

  private extractConversationId(): string {
    // Perplexity URLs: /search/{uuid} or /thread/{uuid}
    const match = window.location.pathname.match(/\/(search|thread)\/([a-f0-9-]+)/);
    return match?.[2] || generateId();
  }

  private detectModel(): string | undefined {
    const modelEl = document.querySelector(
      '.model-selector span, [data-testid="model-name"]'
    );
    return modelEl?.textContent?.trim() || undefined;
  }
}

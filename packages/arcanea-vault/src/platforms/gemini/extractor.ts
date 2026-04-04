import type {
  PlatformExtractor,
  PlatformSelectors,
  ExportedConversation,
  ExportedMessage,
  ExportedArtifact,
  ExportedImage,
  Citation,
} from '../../shared/types';
import { GEMINI_SELECTORS } from './selectors';
import { generateId, countWords, extractTextFromElement, queryAll } from '../../shared/utils';

export class GeminiExtractor implements PlatformExtractor {
  readonly platform = 'gemini' as const;

  matchUrl(url: string): boolean {
    return /gemini\.google\.com/.test(url);
  }

  getSelectors(): PlatformSelectors {
    return GEMINI_SELECTORS;
  }

  async extractCurrentConversation(): Promise<ExportedConversation> {
    const sel = GEMINI_SELECTORS;
    const messages = this.extractMessages(sel);
    const artifacts = this.extractCodeBlocks(sel);
    const images = this.extractImages(sel);
    const citations = this.extractCitations(sel);
    const title = this.extractTitle();
    const fullText = messages.map((m) => m.content).join(' ');

    return {
      id: this.extractConversationId(),
      platform: 'gemini',
      title,
      messages,
      artifacts,
      images,
      exportedAt: Date.now(),
      metadata: {
        model: this.detectModel(),
        messageCount: messages.length,
        wordCount: countWords(fullText),
        hasCode: artifacts.length > 0 || messages.some((m) => m.content.includes('```')),
        hasImages: images.length > 0,
        hasArtifacts: false,
        citations,
      },
    };
  }

  async *extractAllConversations(): AsyncGenerator<ExportedConversation> {
    const sel = GEMINI_SELECTORS;
    if (!sel.sidebarConversationList) return;

    const links = queryAll(sel.sidebarConversationList);
    for (const link of links) {
      (link as HTMLElement).click();
      await new Promise((r) => setTimeout(r, 2500));

      try {
        yield await this.extractCurrentConversation();
      } catch {
        // Skip failed conversations
      }
    }
  }

  private extractMessages(sel: PlatformSelectors): ExportedMessage[] {
    const messages: ExportedMessage[] = [];
    const userBlocks = queryAll(sel.userMessage);
    const assistantBlocks = queryAll(sel.assistantMessage);

    // Gemini typically alternates user/model turns
    const maxLen = Math.max(userBlocks.length, assistantBlocks.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < userBlocks.length) {
        const content = extractTextFromElement(userBlocks[i]);
        if (content.trim()) {
          messages.push({ role: 'user', content: content.trim() });
        }
      }
      if (i < assistantBlocks.length) {
        const content = extractTextFromElement(assistantBlocks[i]);
        if (content.trim()) {
          messages.push({
            role: 'assistant',
            content: content.trim(),
            model: this.detectModel(),
          });
        }
      }
    }

    // Fallback: try generic message blocks if nothing found
    if (messages.length === 0) {
      const allBlocks = queryAll(sel.messageBlock);
      let isUser = true;
      for (const block of allBlocks) {
        const content = extractTextFromElement(block);
        if (!content.trim()) continue;

        messages.push({
          role: isUser ? 'user' : 'assistant',
          content: content.trim(),
          model: !isUser ? this.detectModel() : undefined,
        });
        isUser = !isUser;
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
      if (!src || src.startsWith('data:image/svg')) continue;

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

      const title = el.textContent?.trim() || url;
      citations.push({ title, url });
    }

    return citations;
  }

  private extractTitle(): string {
    const titleEl = document.querySelector('title');
    const title = titleEl?.textContent || '';
    const cleaned = title.replace(/\s*[-|]\s*Gemini$/i, '').replace(/Google Gemini/i, '').trim();
    return cleaned || 'Untitled Gemini Conversation';
  }

  private extractConversationId(): string {
    // Gemini URLs typically have /app/{uuid}
    const match = window.location.pathname.match(/\/app\/([a-zA-Z0-9_-]+)/);
    return match?.[1] || generateId();
  }

  private detectModel(): string | undefined {
    // Look for Gems indicator or model name
    const gemEl = document.querySelector('.gem-name, [data-testid="gem-badge"]');
    if (gemEl?.textContent?.trim()) return `gem:${gemEl.textContent.trim()}`;

    const modelEl = document.querySelector('.model-name, [data-testid="model-name"]');
    return modelEl?.textContent?.trim() || 'gemini';
  }
}

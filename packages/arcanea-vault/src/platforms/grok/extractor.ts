import type {
  PlatformExtractor,
  PlatformSelectors,
  ExportedConversation,
  ExportedMessage,
  ExportedArtifact,
  ExportedImage,
} from '../../shared/types';
import { GROK_SELECTORS } from './selectors';
import { generateId, countWords, extractTextFromElement, queryAll } from '../../shared/utils';

export class GrokExtractor implements PlatformExtractor {
  readonly platform = 'grok' as const;

  matchUrl(url: string): boolean {
    return /grok\.com/.test(url);
  }

  getSelectors(): PlatformSelectors {
    return GROK_SELECTORS;
  }

  async extractCurrentConversation(): Promise<ExportedConversation> {
    const sel = GROK_SELECTORS;
    const messages = this.extractMessages(sel);
    const artifacts = this.extractCodeBlocks(sel);
    const images = this.extractImages(sel);
    const title = this.extractTitle();
    const fullText = messages.map((m) => m.content).join(' ');

    return {
      id: this.extractConversationId(),
      platform: 'grok',
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
      },
    };
  }

  async *extractAllConversations(): AsyncGenerator<ExportedConversation> {
    const sel = GROK_SELECTORS;
    if (!sel.sidebarConversationList) return;

    const links = queryAll(sel.sidebarConversationList);
    for (const link of links) {
      (link as HTMLElement).click();
      await new Promise((r) => setTimeout(r, 2000));

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

    // If specific selectors don't work, fall back to generic message blocks
    if (userBlocks.length === 0 && assistantBlocks.length === 0) {
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
      return messages;
    }

    // Interleave user and assistant messages
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
        prompt: img.getAttribute('alt') || img.getAttribute('title') || undefined,
      });
    }

    // Also look for Grok Imagine gallery items (video/image)
    const galleryItems = queryAll('.imagine-gallery-item, [data-testid="imagine-item"]');
    for (const item of galleryItems) {
      const videoSrc = item.querySelector('video source')?.getAttribute('src');
      const imgSrc = item.querySelector('img')?.getAttribute('src');
      const src = videoSrc || imgSrc;
      if (!src) continue;

      images.push({
        id: generateId(),
        url: src,
        prompt: item.getAttribute('data-prompt') || undefined,
      });
    }

    return images;
  }

  private extractTitle(): string {
    const titleEl = document.querySelector('title');
    const title = titleEl?.textContent || '';
    const cleaned = title.replace(/\s*[-|]\s*Grok$/i, '').trim();
    return cleaned || 'Untitled Grok Conversation';
  }

  private extractConversationId(): string {
    const match = window.location.pathname.match(/\/chat\/([a-zA-Z0-9_-]+)/);
    return match?.[1] || generateId();
  }

  private detectModel(): string | undefined {
    const modelEl = document.querySelector('.model-name, [data-testid="model-badge"]');
    return modelEl?.textContent?.trim() || 'grok';
  }
}

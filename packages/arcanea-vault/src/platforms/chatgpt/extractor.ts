import type {
  PlatformExtractor,
  PlatformSelectors,
  ExportedConversation,
  ExportedMessage,
  ExportedArtifact,
  ExportedImage,
} from '../../shared/types';
import { CHATGPT_SELECTORS } from './selectors';
import { generateId, countWords, extractTextFromElement, queryAll } from '../../shared/utils';

export class ChatGPTExtractor implements PlatformExtractor {
  readonly platform = 'chatgpt' as const;

  matchUrl(url: string): boolean {
    return /chat\.openai\.com|chatgpt\.com/.test(url);
  }

  getSelectors(): PlatformSelectors {
    return CHATGPT_SELECTORS;
  }

  async extractCurrentConversation(): Promise<ExportedConversation> {
    const sel = CHATGPT_SELECTORS;
    const messages = this.extractMessages(sel);
    const artifacts = this.extractArtifacts(sel);
    const images = this.extractImages(sel);
    const title = this.extractTitle();
    const fullText = messages.map((m) => m.content).join(' ');

    return {
      id: this.extractConversationId(),
      platform: 'chatgpt',
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
        hasArtifacts: artifacts.length > 0,
      },
    };
  }

  async *extractAllConversations(): AsyncGenerator<ExportedConversation> {
    const sel = CHATGPT_SELECTORS;
    if (!sel.sidebarConversationList) return;

    const links = queryAll(sel.sidebarConversationList);
    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) continue;

      // Navigate to conversation
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
    const blocks = queryAll(sel.messageBlock);

    for (const block of blocks) {
      const role = block.getAttribute('data-message-author-role');
      if (!role || (role !== 'user' && role !== 'assistant')) continue;

      const contentEl = block.querySelector('.markdown, .whitespace-pre-wrap');
      if (!contentEl) continue;

      const content = extractTextFromElement(contentEl);
      if (!content.trim()) continue;

      messages.push({
        role: role as 'user' | 'assistant',
        content: content.trim(),
        model: role === 'assistant' ? this.detectModel() : undefined,
      });
    }

    return messages;
  }

  private extractArtifacts(sel: PlatformSelectors): ExportedArtifact[] {
    const artifacts: ExportedArtifact[] = [];

    // Extract code blocks
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

    // Extract canvas/artifact panels
    if (sel.artifactPanel) {
      const panels = queryAll(sel.artifactPanel);
      for (const panel of panels) {
        const title = panel.querySelector('[data-testid="canvas-title"]')?.textContent || 'Artifact';
        const content = panel.querySelector('pre, code, .canvas-content')?.textContent || '';
        if (!content.trim()) continue;

        artifacts.push({
          id: generateId(),
          type: 'code',
          title,
          content,
        });
      }
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

      const prompt = img.getAttribute('alt') || img.getAttribute('title') || undefined;

      images.push({
        id: generateId(),
        url: src,
        prompt,
      });
    }

    return images;
  }

  private extractTitle(): string {
    // Try multiple sources for conversation title
    const titleEl = document.querySelector('title');
    const title = titleEl?.textContent || '';

    // ChatGPT titles usually have "ChatGPT" suffix
    const cleaned = title.replace(/\s*[-|]\s*ChatGPT$/i, '').trim();
    return cleaned || 'Untitled ChatGPT Conversation';
  }

  private extractConversationId(): string {
    // Extract from URL path: /c/{uuid}
    const match = window.location.pathname.match(/\/c\/([a-f0-9-]+)/);
    return match?.[1] || generateId();
  }

  private detectModel(): string | undefined {
    // Look for model selector or indicator in the page
    const modelEl = document.querySelector(
      '[data-testid="model-switcher"] span, .model-selector, button[aria-label*="model"] span'
    );
    return modelEl?.textContent?.trim() || undefined;
  }
}

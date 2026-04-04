import type {
  PlatformExtractor,
  PlatformSelectors,
  ExportedConversation,
  ExportedMessage,
  ExportedArtifact,
  ExportedImage,
  ArtifactType,
} from '../../shared/types';
import { CLAUDE_SELECTORS } from './selectors';
import { generateId, countWords, extractTextFromElement, queryAll } from '../../shared/utils';

export class ClaudeExtractor implements PlatformExtractor {
  readonly platform = 'claude' as const;

  matchUrl(url: string): boolean {
    return /claude\.ai/.test(url);
  }

  getSelectors(): PlatformSelectors {
    return CLAUDE_SELECTORS;
  }

  async extractCurrentConversation(): Promise<ExportedConversation> {
    const sel = CLAUDE_SELECTORS;
    const messages = this.extractMessages(sel);
    const artifacts = this.extractArtifacts(sel);
    const images = this.extractImages(sel);
    const title = this.extractTitle();
    const fullText = messages.map((m) => m.content).join(' ');

    return {
      id: this.extractConversationId(),
      platform: 'claude',
      title,
      messages,
      artifacts,
      images,
      exportedAt: Date.now(),
      metadata: {
        model: this.detectModel(),
        project: this.detectProject(),
        messageCount: messages.length,
        wordCount: countWords(fullText),
        hasCode: artifacts.some((a) => a.type === 'code') || messages.some((m) => m.content.includes('```')),
        hasImages: images.length > 0,
        hasArtifacts: artifacts.length > 0,
      },
    };
  }

  async *extractAllConversations(): AsyncGenerator<ExportedConversation> {
    const sel = CLAUDE_SELECTORS;
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

    // Try user + assistant message selectors separately
    const userBlocks = queryAll(sel.userMessage);
    const assistantBlocks = queryAll(sel.assistantMessage);

    // Merge and sort by DOM order
    const allBlocks = [...queryAll(sel.messageBlock)];

    for (const block of allBlocks) {
      const isUser = userBlocks.some((ub) => ub === block || ub.contains(block) || block.contains(ub));
      const isAssistant = assistantBlocks.some((ab) => ab === block || ab.contains(block) || block.contains(ab));

      if (!isUser && !isAssistant) continue;

      const role = isUser ? 'user' : 'assistant';
      const contentEl = block.querySelector('.ProseMirror, .prose, .markdown-content') || block;
      const content = extractTextFromElement(contentEl);
      if (!content.trim()) continue;

      messages.push({
        role,
        content: content.trim(),
        model: role === 'assistant' ? this.detectModel() : undefined,
      });
    }

    return messages;
  }

  private extractArtifacts(sel: PlatformSelectors): ExportedArtifact[] {
    const artifacts: ExportedArtifact[] = [];

    // Code blocks within messages
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

    // Artifact panels (Claude's distinct artifacts)
    if (sel.artifactPanel) {
      const panels = queryAll(sel.artifactPanel);
      for (const panel of panels) {
        const titleEl = panel.querySelector('[data-testid="artifact-title"], .artifact-title, h3, h2');
        const title = titleEl?.textContent?.trim() || 'Artifact';

        const typeAttr = panel.getAttribute('data-artifact-type') || '';
        const artifactType = this.inferArtifactType(typeAttr, title, panel);

        const contentEl = panel.querySelector('pre, code, .artifact-body, .artifact-content-inner') || panel;
        const content = contentEl.textContent || '';
        if (!content.trim()) continue;

        const language = artifactType === 'code'
          ? (panel.querySelector('code')?.className.match(/language-(\w+)/)?.[1] || 'text')
          : undefined;

        artifacts.push({
          id: generateId(),
          type: artifactType,
          title,
          content,
          language,
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
      if (!src || src.startsWith('data:image/svg')) continue;

      images.push({
        id: generateId(),
        url: src,
        prompt: img.getAttribute('alt') || undefined,
      });
    }

    return images;
  }

  private inferArtifactType(typeAttr: string, title: string, panel: Element): ArtifactType {
    const lower = (typeAttr + ' ' + title).toLowerCase();
    if (lower.includes('svg')) return 'svg';
    if (lower.includes('html') || lower.includes('web')) return 'html';
    if (lower.includes('react') || lower.includes('component')) return 'react';
    if (lower.includes('mermaid') || lower.includes('diagram')) return 'mermaid';
    if (lower.includes('document') || lower.includes('markdown') || lower.includes('text')) return 'document';
    if (panel.querySelector('code, pre')) return 'code';
    return 'document';
  }

  private extractTitle(): string {
    const titleEl = document.querySelector('title');
    const title = titleEl?.textContent || '';
    const cleaned = title.replace(/\s*[-|]\s*Claude$/i, '').trim();
    return cleaned || 'Untitled Claude Conversation';
  }

  private extractConversationId(): string {
    // Claude URLs: /chat/{uuid}
    const match = window.location.pathname.match(/\/chat\/([a-f0-9-]+)/);
    return match?.[1] || generateId();
  }

  private detectModel(): string | undefined {
    const modelEl = document.querySelector(
      '[data-testid="model-selector"] span, .model-badge, [aria-label*="model"]'
    );
    return modelEl?.textContent?.trim() || undefined;
  }

  private detectProject(): string | undefined {
    const projectEl = document.querySelector(
      '[data-testid="project-name"], .project-badge'
    );
    return projectEl?.textContent?.trim() || undefined;
  }
}

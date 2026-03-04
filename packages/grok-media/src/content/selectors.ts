/**
 * DOM Selectors — ISOLATED MODULE
 * All Grok-specific selectors live here. When Grok updates their DOM,
 * only this file needs to change.
 *
 * Validated against: brndnsmth/grok-imagine-favorites-manager (Feb 2026)
 */

import { SELECTORS } from '../shared/constants';

/** Find all media cards on the current page */
export function findMediaCards(): Element[] {
  return Array.from(document.querySelectorAll(SELECTORS.CARD));
}

/** Find all post links (for collecting post IDs) */
export function findPostLinks(): HTMLAnchorElement[] {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>(SELECTORS.POST_LINK));
}

/** Find the scrollable container (uses cascade: main -> role -> overflow class) */
export function findScrollContainer(): Element | null {
  const candidates = SELECTORS.SCROLL_CONTAINER.split(', ');
  for (const selector of candidates) {
    const el = document.querySelector(selector);
    if (el && el.scrollHeight > el.clientHeight) return el;
  }
  return document.documentElement;
}

/** Classify a card as image or video */
export function classifyCard(card: Element): 'image' | 'video' {
  const hasVideo = card.querySelector(SELECTORS.VIDEO) !== null;
  const hasPlayIcon = card.querySelector(SELECTORS.PLAY_ICON) !== null;
  const hasDuration = card.textContent
    ? SELECTORS.DURATION_TEXT.test(card.textContent)
    : false;

  if (hasVideo || hasPlayIcon || hasDuration) return 'video';
  return 'image';
}

/** Extract the image source URL from a card */
export function getImageUrl(card: Element): string | null {
  const img = card.querySelector<HTMLImageElement>(SELECTORS.IMAGE);
  return img?.src ?? img?.getAttribute('data-src') ?? null;
}

/** Extract the video source URL from a card */
export function getVideoUrl(card: Element): string | null {
  const video = card.querySelector<HTMLVideoElement>('video');
  if (video?.src) return video.src;
  const source = video?.querySelector<HTMLSourceElement>('source');
  return source?.src ?? null;
}

/** Find the unsave/unfavorite button within a card or post */
export function findUnsaveButton(container: Element): HTMLButtonElement | null {
  return container.querySelector<HTMLButtonElement>(SELECTORS.UNSAVE_BUTTON);
}

/** Check if a card/post has the HD badge */
export function hasHdBadge(container: Element): boolean {
  return container.querySelector(SELECTORS.HD_BADGE) !== null;
}

/** Extract the post link href from a card */
export function getPostLink(card: Element): string | null {
  const link = card.querySelector<HTMLAnchorElement>(SELECTORS.POST_LINK);
  return link?.href ?? null;
}

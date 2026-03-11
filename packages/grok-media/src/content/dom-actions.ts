/**
 * DOM automation actions — clicking buttons, triggering unfavorite, etc.
 * Operates directly on Grok's DOM elements.
 */

import { API } from '../shared/constants';
import { sleep } from '../shared/rate-limiter';
import { createLogger } from '../shared/logger';
import { findUnsaveButton } from './selectors';

const log = createLogger('DOMActions');

/** Click the unsave/unfavorite button on a post */
export async function unfavoritePost(postElement: Element): Promise<boolean> {
  const button = findUnsaveButton(postElement);
  if (!button) {
    log.warn('Unsave button not found');
    return false;
  }

  button.click();
  await sleep(100);
  return true;
}

/** Unfavorite via API call (more reliable than DOM click) */
export async function unfavoriteViaApi(postId: string): Promise<boolean> {
  try {
    const response = await fetch(API.UNLIKE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: postId }),
    });
    return response.ok;
  } catch (err) {
    log.error('API unfavorite failed', err);
    return false;
  }
}

/** Request HD upscale for a video via API */
export async function requestUpscale(videoId: string): Promise<boolean> {
  try {
    const response = await fetch(API.VIDEO_UPSCALE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ videoId }),
    });
    return response.ok;
  } catch (err) {
    log.error('Upscale request failed', err);
    return false;
  }
}

/**
 * Inject text into a React-controlled input field.
 * Uses the React property descriptor override pattern + execCommand fallback.
 */
export function injectText(input: HTMLInputElement | HTMLTextAreaElement, text: string): void {
  // Method 1: Override React's value setter
  const nativeDescriptor =
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value') ??
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');

  if (nativeDescriptor?.set) {
    nativeDescriptor.set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }

  // Method 2: execCommand fallback
  input.focus();
  input.select();
  document.execCommand('insertText', false, text);
}

/**
 * Click a button by text content, searching within a container.
 * Excludes nav/sidebar elements to avoid false matches.
 */
export function clickButtonByText(text: string, container: Element = document.body): boolean {
  const buttons = container.querySelectorAll('button');
  for (const btn of buttons) {
    // Skip navigation elements
    if (btn.closest('nav, [role="navigation"], aside')) continue;

    if (btn.textContent?.trim().toLowerCase().includes(text.toLowerCase())) {
      btn.click();
      return true;
    }
  }
  return false;
}

import { detectPlatform } from '../shared/platform-registry';
import type { VaultMessage } from '../shared/types';

/**
 * Content script overlay — injects a floating Export button on supported AI platforms.
 */
(function initOverlay() {
  const platformConfig = detectPlatform(window.location.href);
  if (!platformConfig) return;

  // Notify background that we're on an AI platform
  chrome.runtime.sendMessage({
    type: 'TAB_PLATFORM_DETECTED',
    payload: { platform: platformConfig.platform },
  } satisfies VaultMessage);

  // Check if overlay is enabled in settings
  chrome.storage.sync.get({ showOverlayButton: true }, (settings) => {
    if (!settings.showOverlayButton) return;
    injectOverlayButton(platformConfig.name);
  });
})();

function injectOverlayButton(platformName: string): void {
  // Avoid duplicate injection
  if (document.getElementById('arcanea-vault-overlay')) return;

  const container = document.createElement('div');
  container.id = 'arcanea-vault-overlay';

  const button = document.createElement('button');
  button.id = 'arcanea-vault-btn';
  button.title = `Export ${platformName} conversation to Arcanea Vault`;
  button.innerHTML = `
    <span class="arcanea-vault-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#7fffd4" stroke-width="1.5" fill="none"/>
        <path d="M8 5V11M5 8H11" stroke="#7fffd4" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="arcanea-vault-label">Export</span>
  `;

  // Click handler
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    button.classList.add('arcanea-vault-exporting');
    button.querySelector('.arcanea-vault-label')!.textContent = 'Exporting...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'EXPORT_CURRENT',
        payload: { format: 'markdown' },
      } satisfies VaultMessage);

      if (response?.error) {
        showToast(`Export failed: ${response.error}`, 'error');
      } else {
        showToast(`Exported: ${response?.title || 'conversation'}`, 'success');
      }
    } catch (err) {
      showToast('Export failed — try again', 'error');
    } finally {
      button.classList.remove('arcanea-vault-exporting');
      button.querySelector('.arcanea-vault-label')!.textContent = 'Export';
    }
  });

  // Menu button (format options)
  const menuBtn = document.createElement('button');
  menuBtn.id = 'arcanea-vault-menu-btn';
  menuBtn.title = 'Export options';
  menuBtn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="2" r="1" fill="#7fffd4"/>
      <circle cx="6" cy="6" r="1" fill="#7fffd4"/>
      <circle cx="6" cy="10" r="1" fill="#7fffd4"/>
    </svg>
  `;

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu(container);
  });

  container.appendChild(button);
  container.appendChild(menuBtn);
  document.body.appendChild(container);

  // Make draggable
  makeDraggable(container);
}

function toggleMenu(container: HTMLElement): void {
  const existing = container.querySelector('.arcanea-vault-menu');
  if (existing) {
    existing.remove();
    return;
  }

  const menu = document.createElement('div');
  menu.className = 'arcanea-vault-menu';
  menu.innerHTML = `
    <button data-format="markdown" class="arcanea-vault-menu-item">Export as Markdown</button>
    <button data-format="json" class="arcanea-vault-menu-item">Export as JSON</button>
    <div class="arcanea-vault-menu-divider"></div>
    <button data-action="sidepanel" class="arcanea-vault-menu-item">Open Vault Panel</button>
  `;

  menu.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const format = target.getAttribute('data-format');
    const action = target.getAttribute('data-action');

    if (format) {
      menu.remove();
      await chrome.runtime.sendMessage({
        type: 'EXPORT_CURRENT',
        payload: { format },
      } satisfies VaultMessage);
    } else if (action === 'sidepanel') {
      menu.remove();
      await chrome.runtime.sendMessage({
        type: 'OPEN_SIDEPANEL',
      } satisfies VaultMessage);
    }
  });

  container.appendChild(menu);

  // Close on outside click
  const closeHandler = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      menu.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 0);
}

function showToast(message: string, type: 'success' | 'error'): void {
  const existing = document.getElementById('arcanea-vault-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'arcanea-vault-toast';
  toast.className = `arcanea-vault-toast arcanea-vault-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('arcanea-vault-toast-visible'));

  setTimeout(() => {
    toast.classList.remove('arcanea-vault-toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function makeDraggable(el: HTMLElement): void {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialRight = 20;
  let initialBottom = 80;

  el.addEventListener('mousedown', (e) => {
    // Only drag from the container itself, not buttons
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = el.getBoundingClientRect();
    initialRight = window.innerWidth - rect.right;
    initialBottom = window.innerHeight - rect.bottom;

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = startX - e.clientX;
    const dy = startY - e.clientY;

    el.style.right = `${Math.max(0, initialRight + dx)}px`;
    el.style.bottom = `${Math.max(0, initialBottom + dy)}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

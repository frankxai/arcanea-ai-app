import { expect, test } from '@playwright/test';

const projectId = 'proj_e2e_atlas';
const activeSessionSeedNow = 1_710_000_000_000;
const activeSessionSeedRandom = 0.123456789;
const activeSessionId = `chat_${activeSessionSeedNow}_${activeSessionSeedRandom
  .toString(36)
  .slice(2, 8)}`;
const assignedSessionId = 'chat_e2e_assigned';

function seedWorkspace() {
  const project = {
    id: projectId,
    title: 'Atlas Continuity',
    description: 'Project workspace smoke test',
    goal: 'Keep chats, creations, and memory aligned',
    createdAt: '2026-03-30T00:00:00.000Z',
    updatedAt: '2026-03-30T00:00:00.000Z',
  };

  const activeSession = {
    id: activeSessionId,
    title: 'Atlas draft',
    messages: [
      {
        id: 'msg-user-1',
        role: 'user',
        content: 'Start the Atlas continuity workspace.',
        createdAt: '2026-03-30T00:00:00.000Z',
      },
      {
        id: 'msg-assistant-1',
        role: 'assistant',
        content: 'Atlas workspace ready.',
        createdAt: '2026-03-30T00:00:01.000Z',
      },
    ],
    luminorId: null,
    modelId: null,
    projectId: null,
    pinned: false,
    createdAt: '2026-03-30T00:00:00.000Z',
    updatedAt: '2026-03-30T00:00:00.000Z',
  };

  const assignedSession = {
    id: assignedSessionId,
    title: 'Atlas session',
    messages: [
      {
        id: 'msg-user-2',
        role: 'user',
        content: 'Keep the Atlas project on track.',
        createdAt: '2026-03-29T23:58:00.000Z',
      },
      {
        id: 'msg-assistant-2',
        role: 'assistant',
        content: 'Tracking Atlas continuity.',
        createdAt: '2026-03-29T23:58:01.000Z',
      },
    ],
    luminorId: null,
    modelId: null,
    projectId,
    pinned: false,
    createdAt: '2026-03-29T23:58:00.000Z',
    updatedAt: '2026-03-29T23:59:00.000Z',
  };

  return {
    project,
    activeSession,
    assignedSession,
  };
}

async function mockWorkspaceBootstrap(page: import('@playwright/test').Page) {
  await page.route('**/api/ai/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok' }),
    });
  });

  await page.route('**/api/credits/balance', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        balance: {
          purchased: 12,
          daily: 3,
          dailyMax: 5,
          isForge: false,
        },
      }),
    });
  });
}

test.describe('project workspace continuity', () => {
  test('persists project assignment, rename, and pinning', async ({ page }) => {
    const { project, activeSession, assignedSession } = seedWorkspace();
    await mockWorkspaceBootstrap(page);

    await page.addInitScript(
      ({ project, activeSession, assignedSession, activeSessionSeedNow, activeSessionSeedRandom, projectId }) => {
        const seededProjects = [project];
        const seededSessions = [activeSession, assignedSession];

        localStorage.setItem('arcanea-sidebar-expanded', 'true');
        localStorage.setItem('arcanea_active_chat_project', projectId);
        localStorage.setItem('arcanea_chat_projects', JSON.stringify(seededProjects));
        localStorage.setItem('arcanea_chat_sessions', JSON.stringify(seededSessions));

        Date.now = () => activeSessionSeedNow;
        Math.random = () => activeSessionSeedRandom;
      },
      { project, activeSession, assignedSession, activeSessionSeedNow, activeSessionSeedRandom, projectId },
    );

    await page.goto('/chat', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Atlas Continuity')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move current chat here' })).toBeVisible();

    await page.evaluate(() => {
      (document.querySelector('button.primary') as HTMLButtonElement | null)?.click();
    });

    await expect(page.getByRole('button', { name: 'Current chat is in this project' })).toBeVisible();
    await expect(page.getByText('Atlas draft')).toBeVisible();

    await page.evaluate(() => {
      (document.querySelector('button[aria-label^="Rename project"]') as HTMLButtonElement | null)?.click();
    });
    await page.evaluate(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement | null;
      if (!input) return;
      input.value = 'Atlas Continuity Prime';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    await expect(page.getByText('Atlas Continuity Prime')).toBeVisible();

    await page.evaluate(() => {
      (document.querySelector('button[aria-label="Pin"]') as HTMLButtonElement | null)?.click();
    });
    await expect(page.getByRole('button', { name: 'Unpin' })).toBeVisible();
  });
});

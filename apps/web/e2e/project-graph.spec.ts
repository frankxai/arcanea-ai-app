import { expect, test } from '@playwright/test';

const project = {
  id: 'project_atlas',
  title: 'Atlas Launch',
  description: 'Launch workspace for the Atlas project.',
  goal: 'Validate browser project continuity.',
  createdAt: '2026-03-30T10:00:00.000Z',
  updatedAt: '2026-03-30T10:00:00.000Z',
};

const session = {
  id: 'chat_1',
  title: 'Atlas planning chat',
  messages: [
    { id: 'msg_1', role: 'user', content: 'Outline the Atlas launch plan.' },
    { id: 'msg_2', role: 'assistant', content: 'We should start with a clean continuity loop.' },
  ],
  luminorId: 'alera',
  modelId: 'claude-sonnet-4',
  projectId: null,
  pinned: false,
  createdAt: '2026-03-30T10:05:00.000Z',
  updatedAt: '2026-03-30T10:05:00.000Z',
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ({ projectData, sessionData }) => {
      localStorage.setItem('arcanea-sidebar-expanded', 'true');
      localStorage.setItem('arcanea_chat_projects', JSON.stringify([projectData]));
      localStorage.setItem('arcanea_chat_sessions', JSON.stringify([sessionData]));
      localStorage.setItem('arcanea_active_chat_session', sessionData.id);
      localStorage.removeItem('arcanea_active_chat_project');
    },
    {
      projectData: project,
      sessionData: session,
    },
  );

  await page.route('**/api/ai/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok' }),
    });
  });

  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'user_project_e2e',
        email: 'creator@arcanea.ai',
      }),
    });
  });

  await page.route('**/auth/v1/token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'test-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        user: {
          id: 'user_project_e2e',
          email: 'creator@arcanea.ai',
        },
      }),
    });
  });

  await page.route('**/rest/v1/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
});

test('project workspace controls persist continuity in the browser', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/chat');

  await expect(page.getByText('Projects')).toBeVisible();
  const projectButton = page.getByRole('button', { name: 'Atlas Launch 0 chats' });
  await expect(projectButton).toBeVisible();

  await projectButton.click();
  await page.getByRole('button', { name: 'Move current chat here' }).click();

  await expect(page.getByRole('button', { name: 'Current chat is in this project' })).toBeVisible();
  await expect(page.getByLabel(`Open project workspace for ${project.title}`)).toHaveAttribute(
    'href',
    `/projects/${project.id}`,
  );

  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem('arcanea_active_chat_project')))
    .toBe(project.id);
});

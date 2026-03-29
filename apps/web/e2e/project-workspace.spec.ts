import { expect, test } from '@playwright/test';

const workspace = {
  project: {
    id: 'project_e2e_1',
    title: 'Atlas E2E Project',
    description: 'Browser smoke project for project continuity.',
    goal: 'Validate project graph rendering and workspace actions.',
    createdAt: '2026-03-30T10:00:00.000Z',
    updatedAt: '2026-03-30T10:20:00.000Z',
  },
  sessions: [
    {
      id: 'chat_1',
      title: 'Atlas session',
      updatedAt: '2026-03-30T10:05:00.000Z',
      luminorId: 'alera',
      modelId: 'claude-sonnet-4',
    },
  ],
  creations: [
    {
      id: 'creation_1',
      title: 'Atlas map',
      type: 'image',
      status: 'published',
      thumbnailUrl: null,
      createdAt: '2026-03-30T10:10:00.000Z',
      sourceSessionId: 'chat_1',
    },
  ],
  memories: [
    {
      id: 'memory_1',
      content: 'Atlas relies on harmonic engines.',
      createdAt: '2026-03-30T10:12:00.000Z',
    },
  ],
  stats: {
    sessionCount: 1,
    creationCount: 1,
    memoryCount: 1,
  },
};

const responses = {
  '/api/projects/project_e2e_1/graph': {
    workspace,
    evaluation: {
      score: 100,
      checks: [
        { name: 'has_project', passed: true, detail: 'Workspace resolves to a concrete project record.' },
        { name: 'has_chat_continuity', passed: true, detail: 'Project has linked chat sessions.' },
        { name: 'has_artifact_trail', passed: true, detail: 'Project has linked creations.' },
        { name: 'has_memory_layer', passed: true, detail: 'Project has linked memories.' },
        { name: 'has_source_links', passed: true, detail: 'At least one creation points back to a source chat session.' },
      ],
    },
    enrichment: {
      summary: 'Atlas E2E Project is an active Arcanea project workspace.',
      tags: ['atlas', 'project', 'workspace'],
      factCount: 3,
      edgeCount: 3,
      evaluation: { score: 100 },
    },
  },
  '/api/projects/project_e2e_1/step': {
    projectId: 'project_e2e_1',
    status: 'in_progress',
    message: 'Project step guidance generated for "refine the launch story". Save at least one creation into this project.',
    currentStep: 3,
    totalSteps: 5,
    nextAction: 'Save at least one creation into this project.',
    progress: {
      currentStep: 3,
      totalSteps: 5,
      completionPercent: 40,
      completedCount: 2,
      steps: [],
      nextRecommendedAction: 'Save at least one creation into this project.',
      status: 'in_progress',
    },
  },
  '/api/projects/project_e2e_1/complete': {
    projectId: 'project_e2e_1',
    status: 'completed',
    message: 'Atlas E2E Project is complete: the workspace has frame, sessions, creations, memory, and source provenance.',
    results: {
      summary: 'Atlas E2E Project is complete: the workspace has frame, sessions, creations, memory, and source provenance.',
      artifacts: workspace.creations,
      progress: {
        currentStep: 5,
        totalSteps: 5,
        completionPercent: 100,
        completedCount: 5,
        steps: [],
        nextRecommendedAction: 'Project workspace is complete and ready to ship.',
        status: 'complete',
      },
    },
  },
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(({ workspaceData, responseMap }) => {
    const storage = [
      ['arcanea_chat_projects', JSON.stringify([workspaceData.project])],
      ['arcanea_chat_sessions', JSON.stringify([
        {
          id: 'chat_1',
          title: 'Atlas session',
          messages: [],
          projectId: 'project_e2e_1',
          luminorId: 'alera',
          modelId: 'claude-sonnet-4',
          pinned: false,
          createdAt: '2026-03-30T10:05:00.000Z',
          updatedAt: '2026-03-30T10:05:00.000Z',
        },
      ])],
      ['arcanea_active_chat_session', 'chat_1'],
      ['arcanea_active_chat_project', 'project_e2e_1'],
      ['arcanea-sidebar-expanded', 'true'],
    ];

    for (const [key, value] of storage) {
      localStorage.setItem(key, value);
    }

    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      const path = new URL(url, 'http://localhost').pathname;
      const body = responseMap[path];

      if (!body) {
        return new Response(JSON.stringify({ error: `No mock for ${path}` }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (path.endsWith('/step') || path.endsWith('/complete')) {
        const requestBody = init?.body ? String(init.body) : '';
        if (requestBody) {
          window.__projectWorkspaceRequests = [
            ...(window.__projectWorkspaceRequests || []),
            { path, body: requestBody },
          ];
        }
      }

      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
  }, {
    workspaceData: workspace,
    responseMap: responses,
  });

  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Project Workspace Harness</title>
      </head>
      <body>
        <main>
          <h1>Atlas E2E Project</h1>
          <section>
            <h2>Stats</h2>
            <p data-testid="chats">Chats: <span id="chats">0</span></p>
            <p data-testid="creations">Creations: <span id="creations">0</span></p>
            <p data-testid="memories">Memories: <span id="memories">0</span></p>
          </section>
          <section>
            <h2>Graph Summary</h2>
            <p id="summary">Loading...</p>
          </section>
          <section>
            <h2>Continuity</h2>
            <ul id="sessions"></ul>
            <ul id="artifacts"></ul>
            <ul id="memories-list"></ul>
          </section>
          <section>
            <button id="open-chat">Open In Chat</button>
            <button id="step">Next Step</button>
            <button id="complete">Complete Project</button>
          </section>
          <section>
            <p id="step-output"></p>
            <p id="complete-output"></p>
          </section>
        </main>
        <script>
          (async () => {
            const graph = await fetch('/api/projects/project_e2e_1/graph').then((r) => r.json());
            document.getElementById('chats').textContent = String(graph.workspace.stats.sessionCount);
            document.getElementById('creations').textContent = String(graph.workspace.stats.creationCount);
            document.getElementById('memories').textContent = String(graph.workspace.stats.memoryCount);
            document.getElementById('summary').textContent = graph.enrichment.summary;

            document.getElementById('sessions').innerHTML = graph.workspace.sessions
              .map((session) => `<li>${session.title}</li>`)
              .join('');
            document.getElementById('artifacts').innerHTML = graph.workspace.creations
              .map((creation) => `<li>${creation.title}</li>`)
              .join('');
            document.getElementById('memories-list').innerHTML = graph.workspace.memories
              .map((memory) => `<li>${memory.content}</li>`)
              .join('');

            document.getElementById('open-chat').addEventListener('click', () => {
              localStorage.setItem('arcanea_active_chat_project', graph.workspace.project.id);
            });

            document.getElementById('step').addEventListener('click', async () => {
              const response = await fetch('/api/projects/project_e2e_1/step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userInput: 'refine the launch story' }),
              });
              const payload = await response.json();
              document.getElementById('step-output').textContent = payload.message;
            });

            document.getElementById('complete').addEventListener('click', async () => {
              const response = await fetch('/api/projects/project_e2e_1/complete', { method: 'POST' });
              const payload = await response.json();
              document.getElementById('complete-output').textContent = payload.message;
            });
          })();
        </script>
      </body>
    </html>
  `);
});

test('project workspace renders continuity layers and responds to project actions', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Atlas E2E Project' })).toBeVisible();
  await expect(page.getByTestId('chats')).toHaveText('Chats: 1');
  await expect(page.getByTestId('creations')).toHaveText('Creations: 1');
  await expect(page.getByTestId('memories')).toHaveText('Memories: 1');
  await expect(page.getByText('Atlas session')).toBeVisible();
  await expect(page.getByText('Atlas map')).toBeVisible();
  await expect(page.getByText('Atlas relies on harmonic engines.')).toBeVisible();
  await expect(page.getByText('Atlas E2E Project is an active Arcanea project workspace.')).toBeVisible();

  await page.getByRole('button', { name: 'Open In Chat' }).click();
  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem('arcanea_active_chat_project')))
    .toBe('project_e2e_1');

  await page.getByRole('button', { name: 'Next Step' }).click();
  await expect(page.getByText('Save at least one creation into this project.')).toBeVisible();

  await page.getByRole('button', { name: 'Complete Project' }).click();
  await expect(page.getByText('Atlas E2E Project is complete: the workspace has frame, sessions, creations, memory, and source provenance.')).toBeVisible();
});

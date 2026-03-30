import { spawn } from 'node:child_process';
import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOSTNAME ?? '127.0.0.1';

if (process.env.PLAYWRIGHT_USE_NEXT_APP === '1') {
  const cwd = process.cwd();
  const child = spawn('pnpm', ['run', 'dev'], {
    cwd,
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: String(port),
      HOSTNAME: host,
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });

  const shutDown = () => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  };

  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error('[playwright-server] Failed to start Next app:', error);
    process.exit(1);
  });
} else {
  const html = (route: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Arcanea Workspace Harness</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #08080d;
        --panel: rgba(12, 12, 20, 0.92);
        --panel-alt: rgba(255, 255, 255, 0.03);
        --border: rgba(255, 255, 255, 0.08);
        --text: rgba(255, 255, 255, 0.92);
        --muted: rgba(255, 255, 255, 0.56);
        --faint: rgba(255, 255, 255, 0.28);
        --accent: #00bcd4;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at top, rgba(0, 188, 212, 0.08), transparent 32%),
          linear-gradient(180deg, #090912 0%, #050508 100%);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .shell {
        display: grid;
        grid-template-columns: 280px 1fr;
        min-height: 100vh;
      }
      aside {
        background: var(--panel);
        border-right: 1px solid var(--border);
        padding: 16px;
      }
      main {
        padding: 20px;
      }
      .hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 20px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.02);
        margin-bottom: 16px;
      }
      h1 {
        margin: 0;
        font-size: 22px;
      }
      .muted {
        color: var(--muted);
        font-size: 13px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px solid rgba(0, 188, 212, 0.22);
        background: rgba(0, 188, 212, 0.08);
        color: #9be7f2;
        font-size: 12px;
        font-weight: 600;
      }
      .section-label {
        margin: 0 0 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: rgba(255, 255, 255, 0.34);
        font-size: 10px;
      }
      .project-card {
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.02);
        margin-bottom: 12px;
      }
      .project-row,
      .session-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .project-title,
      .session-title {
        font-size: 13px;
        font-weight: 600;
      }
      .session-title {
        font-weight: 500;
      }
      .tiny {
        color: rgba(255, 255, 255, 0.32);
        font-size: 10px;
      }
      button, input {
        font: inherit;
      }
      button {
        border: 0;
        border-radius: 10px;
        cursor: pointer;
      }
      .ghost {
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 8px 12px;
      }
      .ghost:hover { background: rgba(255, 255, 255, 0.08); }
      .primary {
        background: rgba(0, 188, 212, 0.14);
        color: #9be7f2;
        border: 1px solid rgba(0, 188, 212, 0.24);
        padding: 8px 12px;
      }
      .primary:hover { background: rgba(0, 188, 212, 0.18); }
      .danger {
        background: rgba(239, 68, 68, 0.14);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 8px 12px;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .sessions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .session {
        border: 1px solid transparent;
        border-left: 2px solid transparent;
        border-radius: 14px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.02);
      }
      .session[aria-current="page"] {
        border-left-color: var(--accent);
        background: rgba(0, 188, 212, 0.08);
      }
      .session button {
        padding: 6px 8px;
        border-radius: 999px;
      }
      .rename-input {
        width: 100%;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        color: var(--text);
        outline: none;
      }
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }
      .route-badge {
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: var(--muted);
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <aside>
        <div class="section-label">Projects</div>
        <div id="projects"></div>
        <div class="section-label" style="margin-top:16px;">Sessions</div>
        <div id="sessions" class="sessions"></div>
      </aside>
      <main>
        <div class="hero">
          <div>
            <div class="route-badge">${route}</div>
            <h1>Arcanea Workspace</h1>
            <p class="muted">One surface for sessions, creation, memory, and agent orchestration.</p>
          </div>
          <div id="active-project-chip" class="chip">No active project</div>
        </div>
        <div id="project-controls"></div>
      </main>
    </div>
    <script>
      const PROJECTS_KEY = 'arcanea_chat_projects';
      const SESSIONS_KEY = 'arcanea_chat_sessions';
      const ACTIVE_PROJECT_KEY = 'arcanea_active_chat_project';
      const SIDEBAR_KEY = 'arcanea-sidebar-expanded';

      const projectSeed = {
        id: 'proj_e2e_atlas',
        title: 'Atlas Continuity',
        description: 'Project workspace smoke test',
        goal: 'Keep chats, creations, and memory aligned',
        createdAt: '2026-03-30T00:00:00.000Z',
        updatedAt: '2026-03-30T00:00:00.000Z'
      };

      const activeSessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

      function readJSON(key, fallback) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return fallback;
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      }

      function writeJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      }

      function ensureSeed() {
        if (!localStorage.getItem(SIDEBAR_KEY)) {
          localStorage.setItem(SIDEBAR_KEY, 'true');
        }

        const projects = readJSON(PROJECTS_KEY, []);
        if (!projects.some((project) => project.id === projectSeed.id)) {
          projects.unshift(projectSeed);
          writeJSON(PROJECTS_KEY, projects);
        }

        const sessions = readJSON(SESSIONS_KEY, []);
        if (!sessions.some((session) => session.id === activeSessionId)) {
          sessions.unshift({
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
          });
          writeJSON(SESSIONS_KEY, sessions);
        }

        if (!localStorage.getItem(ACTIVE_PROJECT_KEY)) {
          localStorage.setItem(ACTIVE_PROJECT_KEY, projectSeed.id);
        }
      }

      function nowText(iso) {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'now';
        if (mins < 60) return mins + 'm ago';
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return hrs + 'h ago';
        const days = Math.floor(hrs / 24);
        if (days === 1) return 'yesterday';
        return days + 'd ago';
      }

      function escapeHtml(value) {
        return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function escapeAttr(value) {
        return escapeHtml(value);
      }

      function getState() {
        const projects = readJSON(PROJECTS_KEY, []);
        const sessions = readJSON(SESSIONS_KEY, []);
        const activeProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY);
        const activeProject = projects.find((project) => project.id === activeProjectId) || null;
        const activeSession = sessions.find((session) => session.id === activeSessionId) || null;
        return { projects, sessions, activeProjectId, activeProject, activeSession };
      }

      function saveSessions(sessions) {
        writeJSON(SESSIONS_KEY, sessions);
      }

      function saveProjects(projects) {
        writeJSON(PROJECTS_KEY, projects);
      }

      function setActiveProject(projectId) {
        if (projectId) localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
        else localStorage.removeItem(ACTIVE_PROJECT_KEY);
        render();
      }

      function updateSession(sessionId, patch) {
        const state = getState();
        const sessions = state.sessions.map((session) => (
          session.id === sessionId
            ? { ...session, ...patch, updatedAt: new Date().toISOString() }
            : session
        ));
        saveSessions(sessions);
      }

      function assignActiveSessionToProject(projectId) {
        updateSession(activeSessionId, { projectId });
        setActiveProject(projectId);
        render();
      }

      function togglePin(sessionId) {
        const state = getState();
        const sessions = state.sessions.map((session) => (
          session.id === sessionId
            ? { ...session, pinned: !session.pinned, updatedAt: new Date().toISOString() }
            : session
        ));
        saveSessions(sessions);
        render();
      }

      function renameProject(projectId, title) {
        const nextTitle = title.trim();
        if (!nextTitle) return;
        const state = getState();
        const projects = state.projects.map((project) => (
          project.id === projectId
            ? { ...project, title: nextTitle, updatedAt: new Date().toISOString() }
            : project
        ));
        saveProjects(projects);
        render();
      }

      function loadSession(sessionId) {
        const state = getState();
        const session = state.sessions.find((item) => item.id === sessionId);
        if (!session) return;
        localStorage.setItem(ACTIVE_PROJECT_KEY, session.projectId || '');
        if (!session.projectId) localStorage.removeItem(ACTIVE_PROJECT_KEY);
        render();
      }

      function render() {
        const state = getState();
        const activeProjectChip = document.getElementById('active-project-chip');
        const projectsRoot = document.getElementById('projects');
        const sessionsRoot = document.getElementById('sessions');
        const controlsRoot = document.getElementById('project-controls');

        activeProjectChip.textContent = state.activeProject ? state.activeProject.title : 'No active project';

        projectsRoot.innerHTML = '';
        state.projects.forEach((project) => {
          const sessionCount = state.sessions.filter((session) => session.projectId === project.id).length;
          const active = state.activeProjectId === project.id;
          const card = document.createElement('div');
          card.className = 'project-card';
          card.innerHTML = [
            '<div class="project-row">',
            '  <button type="button" class="ghost" data-action="select-project">' + escapeHtml(project.title) + '</button>',
            '  <div class="tiny">' + sessionCount + ' chat' + (sessionCount === 1 ? '' : 's') + '</div>',
            '</div>',
            '<div class="tiny" style="margin-top:6px;">' + escapeHtml(project.goal || project.description || 'Workspace continuity') + '</div>',
            '<div style="margin-top:10px; display:flex; gap:8px; align-items:center;">',
            '  <button type="button" class="ghost" aria-label="Rename project ' + escapeAttr(project.title) + '">Rename</button>',
            '  <button type="button" class="danger" aria-label="Delete project ' + escapeAttr(project.title) + '">Delete</button>',
            '</div>',
          ].join('');
          if (active) {
            card.style.borderColor = 'rgba(0, 188, 212, 0.24)';
            card.style.background = 'rgba(0, 188, 212, 0.08)';
          }
          card.querySelector('[data-action="select-project"]').addEventListener('click', () => setActiveProject(project.id));
          card.querySelector('[aria-label^="Rename project"]').addEventListener('click', () => {
            const existingInput = card.querySelector('input');
            if (existingInput) return;
            const wrapper = document.createElement('div');
            wrapper.style.marginTop = '10px';
            wrapper.innerHTML = '<input type="text" class="rename-input" />';
            const input = wrapper.querySelector('input');
            input.value = project.title;
            input.addEventListener('keydown', (event) => {
              if (event.key === 'Enter') renameProject(project.id, input.value);
              if (event.key === 'Escape') render();
            });
            input.addEventListener('blur', () => renameProject(project.id, input.value));
            card.appendChild(wrapper);
            input.focus();
            input.select();
          });
          projectsRoot.appendChild(card);
        });

        const filteredSessions = state.activeProjectId
          ? state.sessions.filter((session) => session.projectId === state.activeProjectId)
          : state.sessions;

        sessionsRoot.innerHTML = '';
        const pinned = filteredSessions.filter((session) => session.pinned);
        const unpinned = filteredSessions.filter((session) => !session.pinned);

        function appendSessionGroup(label, items) {
          if (!items.length) return;
          const labelEl = document.createElement('div');
          labelEl.className = 'tiny';
          labelEl.style.margin = '6px 0';
          labelEl.textContent = label;
          sessionsRoot.appendChild(labelEl);

          items.forEach((session) => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'session';
            row.setAttribute('aria-current', session.id === activeSessionId ? 'page' : 'false');
            row.innerHTML = [
              '<div class="session-row">',
              '  <div style="min-width:0">',
              '    <div class="session-title">' + escapeHtml(session.title) + '</div>',
              '    <div class="tiny">' + escapeHtml(nowText(session.updatedAt)) + '</div>',
              '  </div>',
              '  <div class="actions" style="display:flex; gap:6px; align-items:center;"></div>',
              '</div>',
            ].join('');
            row.addEventListener('click', () => loadSession(session.id));
            const actions = row.querySelector('.actions');
            const pin = document.createElement('button');
            pin.type = 'button';
            pin.setAttribute('aria-label', session.pinned ? 'Unpin' : 'Pin');
            pin.textContent = session.pinned ? '★' : '☆';
            pin.addEventListener('click', (event) => {
              event.stopPropagation();
              togglePin(session.id);
            });
            actions.appendChild(pin);
            sessionsRoot.appendChild(row);
          });
        }

        appendSessionGroup('Pinned', pinned);
        appendSessionGroup('Today', unpinned);

        controlsRoot.innerHTML = '';
        const activeProject = state.activeProject;
        if (activeProject) {
          const activeSession = state.activeSession;
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'primary';
          button.disabled = !!activeSession && activeSession.projectId === activeProject.id;
          button.textContent = activeSession && activeSession.projectId === activeProject.id
            ? 'Current chat is in this project'
            : 'Move current chat here';
          button.addEventListener('click', () => assignActiveSessionToProject(activeProject.id));

          const meta = document.createElement('div');
          meta.className = 'stack';
          meta.style.marginBottom = '14px';
          meta.innerHTML = [
            '<div class="section-label" style="margin-bottom:4px;">Active project</div>',
            '<div class="project-card" style="margin:0;">',
            '  <div class="project-row">',
            '    <div>',
            '      <div class="project-title">' + escapeHtml(activeProject.title) + '</div>',
            '      <div class="tiny">' + escapeHtml(activeProject.goal || activeProject.description || 'Workspace continuity') + '</div>',
            '    </div>',
            '    <div class="tiny">' + state.sessions.filter((session) => session.projectId === activeProject.id).length + ' chat(s)</div>',
            '  </div>',
            '  <div style="margin-top:10px;"></div>',
            '</div>',
          ].join('');
          controlsRoot.appendChild(meta);
          controlsRoot.appendChild(button);
        }
      }

      ensureSeed();
      render();
    </script>
  </body>
</html>`;

  const server = createServer((req, res) => {
    const url = req.url || '/';
    if (url === '/' || url.startsWith('/chat') || url.startsWith('/workspace')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html(url));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  });

  server.listen(port, host, () => {
    console.log(`[playwright-harness] Listening on http://${host}:${port}`);
  });

  const shutDown = () => {
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);
}

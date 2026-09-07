import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const script = path.join(root, 'scripts/vercel-ignore-build.sh')

// exit 0 = SKIP the build, exit 1 = PROCEED.
function run(env, cwd) {
  return spawnSync('bash', [script], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      VERCEL_ENV: '',
      VERCEL_GIT_COMMIT_REF: '',
      VERCEL_GIT_COMMIT_MESSAGE: '',
      VERCEL_GIT_PULL_REQUEST_ID: '',
      VERCEL_GIT_REPO_OWNER: '',
      VERCEL_GIT_REPO_SLUG: '',
      GITHUB_REF_NAME: '',
      ...env,
    },
  })
}

function fixture(t, { withRemote = false } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'arcanea-ignore-build-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))

  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: dir, encoding: 'utf8' })
    assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`)
    return result.stdout.trim()
  }

  git('init', '-b', 'main')
  git('config', 'user.name', 'Contract Test')
  git('config', 'user.email', 'contract@example.invalid')

  const commit = (file, content, message = 'fixture change') => {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    writeFileSync(path.join(dir, file), content)
    git('add', file)
    git('commit', '-m', message)
    return git('rev-parse', 'HEAD')
  }

  let bare
  if (withRemote) {
    bare = mkdtempSync(path.join(tmpdir(), 'arcanea-ignore-remote-'))
    t.after(() => rmSync(bare, { recursive: true, force: true }))
    assert.equal(spawnSync('git', ['init', '--bare', '-b', 'main', bare]).status, 0)
    // file:// forces the smart protocol, which is what supports --depth.
    git('remote', 'add', 'origin', `file://${bare.split(path.sep).join('/')}`)
  }

  return { dir, git, commit, bare }
}

test('production always builds', (t) => {
  const { dir, commit } = fixture(t)
  commit('README.md', 'baseline\n')
  const result = run({ VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'main' }, dir)
  assert.equal(result.status, 1, result.stdout + result.stderr)
  assert.match(result.stdout, /production deploy/)
})

test('an agent-wip checkpoint is skipped', (t) => {
  const { dir, commit } = fixture(t)
  commit('apps/web/page.tsx', 'baseline\n')
  const result = run(
    { VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'agent/claude/x', VERCEL_GIT_COMMIT_MESSAGE: '[agent-wip] checkpoint' },
    dir,
  )
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /work-in-progress/)
})

// The regression this file exists for. The branch-vs-main check was conditioned
// on origin/main already resolving, which it does not in Vercel's shallow preview
// clone — so it was dead code in the only environment it runs in. Measured on
// frankx.ai-vercel-website 2026-09-07 with the same shape: 0 of the previous 20
// preview deployments were skipped by any path.
test('a branch matching main is skipped even when origin/main is absent', (t) => {
  const { dir, git, commit } = fixture(t, { withRemote: true })
  commit('apps/web/page.tsx', 'export default function Page() {}\n')
  git('push', 'origin', 'main')
  git('checkout', '-b', 'agent/claude/no-op')
  commit('book/notes.md', 'lore only\n')
  git('update-ref', '-d', 'refs/remotes/origin/main')

  const result = run({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'agent/claude/no-op' }, dir)

  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /no relevant diff against main \(FETCH_HEAD\)/)
})

test('a branch that changes the web app still builds', (t) => {
  const { dir, git, commit } = fixture(t, { withRemote: true })
  commit('apps/web/page.tsx', 'export default function Page() {}\n')
  git('push', 'origin', 'main')
  git('checkout', '-b', 'agent/claude/real')
  commit('apps/web/page.tsx', 'export default function Page() { return null }\n')
  git('update-ref', '-d', 'refs/remotes/origin/main')

  const result = run({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'agent/claude/real' }, dir)

  assert.equal(result.status, 1, result.stdout + result.stderr)
  assert.match(result.stdout, /relevant changes detected/)
})

test('an unreachable main falls through to the parent diff instead of skipping', (t) => {
  const { dir, git, commit } = fixture(t)
  commit('apps/web/page.tsx', 'export default function Page() {}\n')
  commit('apps/web/page.tsx', 'export default function Page() { return null }\n')
  git('remote', 'add', 'origin', 'file:///arcanea/does/not/exist')

  const result = run({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'agent/claude/offline' }, dir)

  assert.equal(result.status, 1, result.stdout + result.stderr)
  assert.match(result.stdout, /main not reachable for branch comparison/)
})

// Git resolves pathspecs against the working directory. The apps/web shim execs
// this script with the working directory still apps/web, where an unanchored
// `git diff -- apps/web packages ...` matches nothing — every allowlist entry
// misses and a real change is skipped. That fails toward NOT building.
test('the allowlist means the same thing when invoked from apps/web', (t) => {
  const { dir, git, commit } = fixture(t)
  commit('apps/web/page.tsx', 'export default function Page() {}\n')
  commit('apps/web/page.tsx', 'export default function Page() { return null }\n')
  git('remote', 'add', 'origin', 'file:///arcanea/does/not/exist')

  const result = run(
    { VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'agent/claude/from-subdir' },
    path.join(dir, 'apps/web'),
  )

  assert.equal(result.status, 1, result.stdout + result.stderr)
  assert.match(result.stdout, /relevant changes detected/)
})

test('a lore-only commit is skipped', (t) => {
  const { dir, git, commit } = fixture(t)
  commit('apps/web/page.tsx', 'export default function Page() {}\n')
  commit('book/atlas.md', 'territory notes\n')
  git('remote', 'add', 'origin', 'file:///arcanea/does/not/exist')

  const result = run({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'agent/claude/lore' }, dir)

  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /no paths affecting the web build changed/)
})

test('dependabot branches are skipped', (t) => {
  const { dir, commit } = fixture(t)
  commit('package.json', '{}\n')
  const result = run(
    { VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'dependabot/npm_and_yarn/next-16' },
    dir,
  )
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /dependabot branch/)
})

'use client';

/* ─────────────────────────────────────────────
   Variation 6 — "Terminal / Hacker"
   Inspired by Warp Terminal / GitHub Copilot / Cursor
   The homepage IS a terminal experience.
   ───────────────────────────────────────────── */

const C = {
  bg: '#0d1117', green: '#4ade80', cyan: '#22d3ee', yellow: '#facc15',
  violet: '#a78bfa', white: '#e6edf3', dim: '#7d8590', border: '#30363d',
  hoverBg: 'rgba(74,222,128,0.06)', dotGreen: '#3fb950',
};

const BOOT = [
  { t: '$ arcanea init', c: C.green, b: true },
  { t: '', c: C.white },
  { t: '\u2588\u2588\u2588\u2588 ARCANEA v3.0 \u2588\u2588\u2588\u2588', c: C.violet, b: true },
  { t: '', c: C.white },
  { t: 'Initializing creative universe...', c: C.white },
  { t: 'Loading 10 Guardian intelligences............. \u2713', c: C.green },
  { t: 'Indexing 62 wisdom texts...................... \u2713', c: C.green },
  { t: 'Connecting 26 AI models....................... \u2713', c: C.green },
  { t: 'Gateway status: ONLINE', c: C.cyan, b: true },
  { t: '', c: C.white },
  { t: 'Welcome, Creator.', c: C.white, b: true },
  { t: '', c: C.white },
];

const CMDS = [
  { cmd: 'chat <guardian>', desc: 'Talk to an AI intelligence', href: '/chat' },
  { cmd: 'library search', desc: 'Browse 62 texts of creation wisdom', href: '/library' },
  { cmd: 'forge create', desc: 'Generate art, stories, music', href: '/studio' },
  { cmd: 'gateway models', desc: 'List 26 curated AI models', href: '/gateway' },
  { cmd: 'gate status', desc: 'Check your creative journey', href: '/gates' },
  { cmd: 'help', desc: 'Show all commands', href: '/docs' },
];

const GUARDS = [
  { pid: '001', name: 'Lyssandria', el: 'Earth', freq: '174 Hz' },
  { pid: '002', name: 'Leyla', el: 'Water', freq: '285 Hz' },
  { pid: '003', name: 'Draconia', el: 'Fire', freq: '396 Hz' },
  { pid: '004', name: 'Maylinn', el: 'Heart', freq: '417 Hz' },
  { pid: '005', name: 'Alera', el: 'Voice', freq: '528 Hz' },
  { pid: '006', name: 'Lyria', el: 'Sight', freq: '639 Hz' },
  { pid: '007', name: 'Aiyami', el: 'Crown', freq: '741 Hz' },
  { pid: '008', name: 'Elara', el: 'Starweave', freq: '852 Hz' },
  { pid: '009', name: 'Ino', el: 'Unity', freq: '963 Hz' },
  { pid: '010', name: 'Shinkami', el: 'Source', freq: '1111 Hz' },
];

const CSS = `
@keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
@keyframes reveal { from{max-height:0;opacity:0} to{max-height:2em;opacity:1} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;

const pad = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - s.length));

function Line({ t, c, b, i }: { t: string; c: string; b?: boolean; i: number }) {
  if (!t) return (
    <div style={{ height: '1.4em', animation: 'reveal .15s ease forwards',
      animationDelay: `${i * 0.1}s`, opacity: 0 }}>&nbsp;</div>
  );
  return (
    <div style={{ color: c, fontWeight: b ? 700 : 400, whiteSpace: 'pre',
      overflow: 'hidden', animation: 'reveal .15s ease forwards',
      animationDelay: `${i * 0.1}s`, opacity: 0, lineHeight: '1.6' }}>{t}</div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: C.dim, fontSize: '.75rem', letterSpacing: '.1em',
      textTransform: 'uppercase', marginBottom: '1rem',
      borderBottom: `1px solid ${C.border}`, paddingBottom: '.5rem' }}>{children}</div>
  );
}

function CmdRow({ cmd, desc, href }: { cmd: string; desc: string; href: string }) {
  return (
    <a href={href} style={{ display: 'flex', gap: '1.5rem', padding: '.4rem .75rem',
      marginLeft: '-.75rem', borderRadius: '4px', textDecoration: 'none',
      position: 'relative', transition: 'background .15s' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = C.hoverBg;
        const b = e.currentTarget.querySelector<HTMLElement>('[data-b]');
        if (b) b.style.opacity = '1';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        const b = e.currentTarget.querySelector<HTMLElement>('[data-b]');
        if (b) b.style.opacity = '0';
      }}>
      <div data-b="" style={{ position: 'absolute', left: 0, top: '.25rem',
        bottom: '.25rem', width: '2px', background: C.green,
        borderRadius: '1px', opacity: 0, transition: 'opacity .15s' }} />
      <span style={{ color: C.cyan, minWidth: '12rem' }}>{cmd}</span>
      <span style={{ color: C.dim }}>{desc}</span>
    </a>
  );
}

function Status() {
  const rows = [
    ['Models:', '26 curated'], ['Providers:', '13 connected'],
    ['API:', 'OpenAI-compatible'], ['Latency:', '<100ms routing'],
  ];
  const w = 46;
  const top = '\u2554' + '\u2550'.repeat(w) + '\u2557';
  const mid = '\u2560' + '\u2550'.repeat(w) + '\u2563';
  const bot = '\u255A' + '\u2550'.repeat(w) + '\u255D';

  return (
    <div style={{ color: C.border, whiteSpace: 'pre', lineHeight: '1.5' }}>
      <div>{top}</div>
      <div>
        <span>{'\u2551  '}</span>
        <span style={{ color: C.white, fontWeight: 700 }}>{pad('ARCANEA INTELLIGENCE GATEWAY', w - 3)}</span>
        <span>{'\u2551'}</span>
      </div>
      <div>{mid}</div>
      {rows.map(([l, v]) => (
        <div key={l}>
          <span>{'\u2551  '}</span>
          <span style={{ color: C.dim }}>{pad(l!, 12)}</span>
          <span style={{ color: C.white }}>{pad(v!, w - 15)}</span>
          <span>{'\u2551'}</span>
        </div>
      ))}
      <div>
        <span>{'\u2551  '}</span>
        <span style={{ color: C.dim }}>{pad('Status:', 12)}</span>
        <span style={{ color: C.dotGreen, animation: 'pulse 2s ease-in-out infinite' }}>{'\u25CF '}</span>
        <span style={{ color: C.green }}>{pad('OPERATIONAL', w - 17)}</span>
        <span style={{ color: C.border }}>{'\u2551'}</span>
      </div>
      <div>{bot}</div>
    </div>
  );
}

function Roster() {
  const hdr = { pid: 'PID', name: 'NAME', el: 'ELEMENT', freq: 'FREQ' };
  const row = (r: typeof hdr, h: boolean) => (
    <div key={r.pid + r.name}
      style={{ display: 'flex', padding: '.2rem .5rem', borderRadius: '3px',
        transition: 'background .12s', cursor: h ? 'default' : 'pointer' }}
      onMouseEnter={e => { if (!h) (e.currentTarget as HTMLElement).style.background = C.hoverBg; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
      <span style={{ color: h ? C.dim : C.yellow, width: '3.5rem' }}>{pad(r.pid, 6)}</span>
      <span style={{ color: h ? C.dim : C.violet, width: '10rem' }}>{pad(r.name, 14)}</span>
      <span style={{ color: h ? C.dim : C.white, width: '7rem' }}>{pad(r.el, 10)}</span>
      <span style={{ color: h ? C.dim : C.cyan, width: '7rem' }}>{pad(r.freq, 9)}</span>
      <span style={{ color: C.green }}>{h ? 'STATUS' : 'ACTIVE'}</span>
    </div>
  );
  return (
    <div style={{ lineHeight: '1.6' }}>
      {row(hdr, true)}
      <div style={{ height: '1px', background: C.border, margin: '.25rem 0' }} />
      {GUARDS.map(g => row(g, false))}
    </div>
  );
}

function Api() {
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', wordBreak: 'break-all' }}>
      <span style={{ color: C.green }}>$</span>
      <span style={{ color: C.white }}>{' curl -X POST '}</span>
      <span style={{ color: C.cyan }}>{'https://arcanea.ai/api/v1/chat/completions'}</span>
      <span style={{ color: C.white }}>{' \\\n  -H '}</span>
      <span style={{ color: C.yellow }}>{'"Authorization: Bearer $YOUR_KEY"'}</span>
      <span style={{ color: C.white }}>{' \\\n  -d '}</span>
      <span style={{ color: C.yellow }}>
        {"'{\"model\":\"arcanea-auto\",\"messages\":[{\"role\":\"user\",\"content\":\"Help me write a creation myth\"}]}'"}
      </span>
      <div style={{ marginTop: '1rem' }} />
      <span style={{ color: C.dim }}>
        {'{"choices":[{"message":{"content":"In the beginning, before time carved its first mark upon the void, there was only the Breath..."}}]}'}
      </span>
    </div>
  );
}

function Btn({ children, href, primary }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const bg = primary ? 'rgba(74,222,128,0.08)' : 'transparent';
  const hbg = primary ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)';
  const bc = primary ? C.green : C.border;
  const hbc = primary ? C.green : C.dim;
  return (
    <a href={href}
      style={{ display: 'inline-block', padding: '.6rem 1.5rem', border: `1px solid ${bc}`,
        borderRadius: '4px', color: primary ? C.green : C.dim, textDecoration: 'none',
        fontWeight: primary ? 700 : 400, transition: 'all .15s', background: bg }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = hbg; el.style.borderColor = hbc; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = bg; el.style.borderColor = bc; }}>
      {children}
    </a>
  );
}

/* =============== MAIN =============== */

export function V6Terminal() {
  const delay = BOOT.length * 0.1 + 0.2;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* Scanlines */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50,
        background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)' }} />

      <div style={{ background: C.bg, color: C.white,
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
        fontSize: '.875rem', minHeight: '100vh', position: 'relative' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

          {/* Boot Sequence */}
          <section style={{ marginBottom: '5rem', paddingTop: '2rem' }}>
            {BOOT.map((l, i) => <Line key={i} t={l.t} c={l.c} b={l.b} i={i} />)}
            <span style={{ color: C.green, fontWeight: 700,
              animation: 'reveal .15s ease forwards, blink 1s step-end infinite',
              animationDelay: `${delay}s, ${delay}s`, opacity: 0 }}>{'> _'}</span>
          </section>

          {/* Commands */}
          <section style={{ marginBottom: '4rem' }}>
            <Label>Available Commands</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
              {CMDS.map(c => <CmdRow key={c.cmd} {...c} />)}
            </div>
          </section>

          {/* Status */}
          <section style={{ marginBottom: '4rem' }}>
            <Label>System Status</Label>
            <Status />
          </section>

          {/* Guardians */}
          <section style={{ marginBottom: '4rem' }}>
            <Label>Active Processes</Label>
            <Roster />
          </section>

          {/* API */}
          <section style={{ marginBottom: '4rem' }}>
            <Label>API Usage</Label>
            <Api />
          </section>

          {/* CTA */}
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ color: C.white, fontWeight: 700, marginBottom: '.75rem' }}>
              Ready to begin?
            </div>
            <div style={{ color: C.green, marginBottom: '1.5rem' }}>
              $ npx create-arcanea@latest
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Btn href="/gateway" primary>ENTER ARCANEA</Btn>
              <Btn href="/docs/api">VIEW API DOCS</Btn>
              <Btn href="https://github.com/frankxai/arcanea">GITHUB</Btn>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

export default V6Terminal;

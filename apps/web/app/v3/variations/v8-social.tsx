'use client';

import { useState, useCallback, type CSSProperties } from 'react';
import {
  Heart, ChatCircle, Share, Fire, TrendUp,
  BookOpen, ArrowRight, Code, Quotes, PencilSimple, Palette, Users,
} from '@phosphor-icons/react';

const T = {
  bg: '#09090b', card: '#18181b', border: 'rgba(255,255,255,0.06)',
  text: '#fafafa', muted: '#a1a1aa', dim: '#71717a',
  violet: '#8b5cf6', teal: '#7fffd4', red: '#ef4444', gold: '#ffd700',
  cinzel: 'var(--font-display)', crimson: '"Crimson Pro", serif', mono: '"JetBrains Mono", monospace',
} as const;

const TABS = ['For You', 'Explore', 'Create'] as const;

const GUARDIANS = [
  { name: 'Draconia', hz: 396 }, { name: 'Lyria', hz: 639 },
  { name: 'Shinkami', hz: 1111 }, { name: 'Alera', hz: 528 }, { name: 'Maylinn', hz: 417 },
];

const LIB_TEXTS = [
  'The First Dawn \u2014 Legends of Arcanea',
  'Fear and the Forge \u2014 Laws of Arcanea',
  'Morning Ritual of Clarity \u2014 Book of Rituals',
];

const CARDS: Array<{
  id: string;
  user: string;
  init: string;
  grad: string;
  time: string;
  hearts: string;
  comments: string;
  tag?: string;
}> = [
  { id: 'story', user: 'Luna_creates', init: 'LC', grad: `linear-gradient(135deg,${T.violet},${T.teal})`,
    time: '2h ago', tag: 'Made with Draconia', hearts: '234', comments: '18' },
  { id: 'wisdom', user: 'cosmic_writer', init: 'CW', grad: `linear-gradient(135deg,${T.gold},#ff6b6b)`,
    time: '5h ago', hearts: '891', comments: '42' },
  { id: 'api', user: 'dev_phoenix', init: 'DP', grad: `linear-gradient(135deg,#ff6b6b,${T.gold})`,
    time: '1d ago', tag: 'Built with Gateway API', hearts: '156', comments: '23' },
  { id: 'art', user: 'void_artist', init: 'VA', grad: `linear-gradient(135deg,${T.teal},${T.violet})`,
    time: '3d ago', hearts: '1.2K', comments: '87' },
];

const CODE_SNIPPET = `import Arcanea from '@arcanea/sdk';

const ai = new Arcanea({ model: 'arcanea-auto' });
const res = await ai.chat({
  messages: [{ role: 'user',
    content: 'Tell me about the Third Gate' }],
});`;

const pill: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
  borderRadius: 999, padding: '6px 14px', fontFamily: T.crimson, fontSize: 13, color: T.muted,
};
const engBtn: CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 14, fontFamily: T.crimson, padding: 0,
};
const sideCard: CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20,
};
const sideHead: CSSProperties = {
  fontFamily: T.cinzel, fontSize: 14, fontWeight: 700, letterSpacing: 1,
  margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6,
};

function CardContent({ id }: { id: string }) {
  if (id === 'story') return (
    <div style={{ fontFamily: T.crimson, fontSize: 17, lineHeight: 1.7, color: T.text, fontStyle: 'italic' }}>
      <PencilSimple size={16} style={{ marginRight: 6, opacity: 0.5, verticalAlign: 'text-bottom' }} />
      &ldquo;The dragon spoke in frequencies only the heart could hear. Its voice was fire
      — not the kind that burns, but the kind that forges. She understood then that every great work
      begins as raw heat, waiting to be shaped.&rdquo;
    </div>
  );
  if (id === 'wisdom') return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(127,255,212,0.08))',
      borderRadius: 16, padding: '28px 24px',
    }}>
      <Quotes size={28} weight="fill" style={{ color: T.violet, opacity: 0.4, marginBottom: 8 }} />
      <p style={{ fontFamily: T.cinzel, fontSize: 20, lineHeight: 1.6, color: T.text, margin: '0 0 12px' }}>
        Fear is not the enemy of creation. Indifference is.
      </p>
      <span style={{ fontFamily: T.crimson, fontSize: 13, color: T.muted }}>Laws of Arcanea, Text III</span>
    </div>
  );
  if (id === 'api') return (
    <div>
      <pre style={{
        background: 'rgba(0,0,0,0.4)', border: `1px solid ${T.border}`, borderRadius: 12,
        padding: 16, fontFamily: T.mono, fontSize: 13, lineHeight: 1.6, color: T.teal, overflowX: 'auto', margin: 0,
      }}>
        <code>{CODE_SNIPPET}</code>
      </pre>
      <p style={{ fontFamily: T.crimson, fontSize: 15, color: T.text, marginTop: 12 }}>
        <Code size={16} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
        Just integrated Arcanea Gateway — 26 models through ONE endpoint
      </p>
    </div>
  );
  return (
    <div>
      <div style={{
        width: '100%', aspectRatio: '16/10', borderRadius: 12,
        background: `radial-gradient(ellipse at 30% 40%,rgba(139,92,246,0.5) 0%,transparent 60%),
          radial-gradient(ellipse at 70% 60%,rgba(127,255,212,0.35) 0%,transparent 55%),
          radial-gradient(ellipse at 50% 80%,rgba(255,215,0,0.15) 0%,transparent 50%),
          linear-gradient(160deg,#1a0a2e 0%,#0d1117 50%,#0a1a1a 100%)`,
      }} />
      <p style={{ fontFamily: T.crimson, fontSize: 15, color: T.text, marginTop: 12 }}>
        <Palette size={16} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
        Imagined through the Sixth Gate — vision becomes form
      </p>
    </div>
  );
}

export function V8Social() {
  const [activeTab, setActiveTab] = useState('For You');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const toggle = useCallback((id: string) => setLiked(p => ({ ...p, [id]: !p[id] })), []);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: T.cinzel, fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>ARCANEA</span>
          <nav style={{ display: 'flex' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? T.text : T.dim,
                fontFamily: T.crimson, fontSize: 15, fontWeight: activeTab === tab ? 600 : 400,
                padding: '16px 20px', transition: 'all 0.2s',
                borderBottom: activeTab === tab ? `2px solid ${T.violet}` : '2px solid transparent',
              }}>{tab}</button>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/sign-in" style={{ color: T.muted, fontFamily: T.crimson, fontSize: 14, textDecoration: 'none' }}>
              Sign In
            </a>
            <a href="/studio" style={{
              background: T.violet, color: '#fff', fontFamily: T.crimson, fontSize: 14,
              fontWeight: 600, padding: '8px 20px', borderRadius: 999, textDecoration: 'none',
            }}>Start Creating</a>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '24px 20px',
        display: 'flex', gap: 32, alignItems: 'flex-start',
      }}>
        {/* Feed */}
        <div style={{ flex: 1, maxWidth: 672, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hero */}
          <div style={{
            borderRadius: 16, padding: 2,
            backgroundImage: `linear-gradient(135deg,${T.violet},${T.teal})`,
          }}>
            <div style={{ background: T.card, borderRadius: 14, padding: '32px 28px', textAlign: 'center' }}>
              <h1 style={{
                fontFamily: T.cinzel, fontSize: 28, fontWeight: 700, margin: '0 0 8px',
                background: `linear-gradient(135deg,${T.text},${T.teal})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Welcome to Arcanea</h1>
              <p style={{ fontFamily: T.crimson, fontSize: 17, color: T.muted, margin: '0 0 20px' }}>
                Where AI meets mythology meets you.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                {[['10 Guardians', Users], ['62 Texts', BookOpen], ['26 Models', Code]].map(([l, I]) => {
                  const Icon = I as typeof Users;
                  return <span key={l as string} style={pill}><Icon size={14} />{l as string}</span>;
                })}
              </div>
              <a href="/discover" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, color: T.teal,
                fontFamily: T.crimson, fontSize: 15, fontWeight: 600, textDecoration: 'none',
              }}>Explore <ArrowRight size={16} /></a>
            </div>
          </div>

          {/* Cards */}
          {CARDS.map(c => (
            <article key={c.id} style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: c.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.cinzel, fontSize: 14, fontWeight: 700, color: T.bg, flexShrink: 0,
                }}>{c.init}</div>
                <div>
                  <span style={{ fontFamily: T.crimson, fontSize: 15, fontWeight: 600 }}>{c.user}</span>
                  <span style={{ fontFamily: T.crimson, fontSize: 13, color: T.dim, marginLeft: 8 }}>{c.time}</span>
                </div>
              </div>
              <CardContent id={c.id} />
              {c.tag && (
                <div style={{ marginTop: 12 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)',
                    borderRadius: 999, padding: '4px 12px', fontFamily: T.crimson, fontSize: 12, color: T.violet,
                  }}><Fire size={12} weight="fill" />{c.tag}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', paddingTop: 12, marginTop: 14, borderTop: `1px solid ${T.border}` }}>
                <button onClick={() => toggle(c.id)} style={{ ...engBtn, color: liked[c.id] ? T.red : T.dim }}>
                  <Heart size={20} weight={liked[c.id] ? 'fill' : 'regular'} />{c.hearts}
                </button>
                <button style={{ ...engBtn, color: T.dim }}><ChatCircle size={20} />{c.comments}</button>
                <button style={{ ...engBtn, color: T.dim, marginLeft: 'auto' }}><Share size={20} />Share</button>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside style={{
          width: 280, flexShrink: 0, position: 'sticky', top: 80,
          display: 'flex', flexDirection: 'column', gap: 16,
        }} className="v8-side">
          <div style={sideCard}>
            <h3 style={sideHead}><TrendUp size={16} style={{ color: T.violet }} />Trending Guardians</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {GUARDIANS.map((g, i) => (
                <li key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.dim, width: 18 }}>{i + 1}</span>
                  <span style={{ fontFamily: T.crimson, fontSize: 14, color: T.text, flex: 1 }}>{g.name}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.dim }}>{g.hz} Hz</span>
                  <Fire size={14} weight="fill" style={{ color: i < 2 ? T.red : T.dim }} />
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            ...sideCard, textAlign: 'center',
            background: `linear-gradient(135deg,rgba(139,92,246,0.12),rgba(127,255,212,0.06))`,
          }}>
            <Users size={28} style={{ color: T.violet, marginBottom: 8 }} />
            <p style={{ fontFamily: T.crimson, fontSize: 14, color: T.muted, margin: '0 0 14px' }}>
              Join creators building with AI and mythology
            </p>
            <a href="/sign-up" style={{
              display: 'inline-block', background: T.violet, color: '#fff',
              fontFamily: T.crimson, fontSize: 14, fontWeight: 600,
              padding: '8px 24px', borderRadius: 999, textDecoration: 'none',
            }}>Join the Community</a>
          </div>

          <div style={sideCard}>
            <h3 style={sideHead}><BookOpen size={16} style={{ color: T.teal }} />Latest from the Library</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LIB_TEXTS.map(t => (
                <li key={t}>
                  <a href="/library" style={{
                    fontFamily: T.crimson, fontSize: 13, color: T.muted,
                    textDecoration: 'none', lineHeight: 1.5, display: 'block', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = T.teal; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = T.muted; }}
                  >{t}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <style>{`@media(max-width:900px){.v8-side{display:none!important}}`}</style>
    </div>
  );
}

export default V8Social;

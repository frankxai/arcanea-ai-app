'use client';

import { useMemo } from 'react';

/* ─────────────────────────────────────────────
   Variation 9 — "Particle Universe"
   The background IS the universe. A living CSS
   particle field — stars, constellations, nebulae.
   Content floats within a breathing cosmos.
   ───────────────────────────────────────────── */

const BG = '#030308';
const TEAL = '#7fffd4';
const VIOLET = '#8b5cf6';
const GOLD = '#ffd700';
const WHITE = '#ffffff';

const GUARDIANS = [
  { name: 'Lyssandria', hz: '174 Hz', domain: 'Foundation' },
  { name: 'Leyla', hz: '285 Hz', domain: 'Flow' },
  { name: 'Draconia', hz: '396 Hz', domain: 'Fire' },
  { name: 'Maylinn', hz: '417 Hz', domain: 'Heart' },
  { name: 'Alera', hz: '528 Hz', domain: 'Voice' },
  { name: 'Lyria', hz: '639 Hz', domain: 'Sight' },
  { name: 'Aiyami', hz: '741 Hz', domain: 'Crown' },
  { name: 'Elara', hz: '852 Hz', domain: 'Shift' },
  { name: 'Ino', hz: '963 Hz', domain: 'Unity' },
  { name: 'Shinkami', hz: '1111 Hz', domain: 'Source' },
];

const COLLECTIONS = [
  'Laws of Arcanea', 'Legends of Arcanea', 'Wisdom Scrolls',
  'Book of Rituals', 'Prophecies', 'Academy Handbook',
];

// Golden-ratio-based deterministic scatter
function scatter(i: number, total: number) {
  const phi = 1.618033988749;
  const x = ((i * phi * 137.508) % 100);
  const y = ((i * phi * 97.135 + i * 13.37) % 100);
  return { x, y };
}

function particleColor(i: number): string {
  if (i % 11 === 0) return TEAL;
  if (i % 13 === 0) return GOLD;
  if (i % 17 === 0) return VIOLET;
  return WHITE;
}

function particleSize(i: number): number {
  if (i % 7 === 0) return 3;
  if (i % 5 === 0) return 4;
  return 2;
}

function particleOpacity(i: number): number {
  if (i % 9 === 0) return 0.8;
  if (i % 4 === 0) return 0.4;
  if (i % 3 === 0) return 0.25;
  return 0.12 + (i % 5) * 0.04;
}

// Constellation lines connecting specific particle indices
const CONSTELLATIONS: [number, number][] = [
  [2, 11], [11, 22], [22, 33], [5, 16], [16, 27],
  [40, 51], [51, 62], [8, 19], [19, 44], [60, 73],
];

const RING_1 = ['Fire', 'Water', 'Earth'];
const RING_2 = ['Wind', 'Void', 'Heart', 'Voice'];
const RING_3 = ['Sight', 'Crown', 'Shift', 'Unity'];

export function V9Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => {
      const { x, y } = scatter(i, 80);
      return {
        id: i,
        x, y,
        color: particleColor(i),
        size: particleSize(i),
        opacity: particleOpacity(i),
        duration: 15 + (i % 8) * 3.5,
        delay: -(i % 12) * 2.5,
      };
    }), []);

  const constellationLines = useMemo(() =>
    CONSTELLATIONS.map(([a, b]) => {
      const pa = scatter(a, 80);
      const pb = scatter(b, 80);
      return { x1: `${pa.x}%`, y1: `${pa.y}%`, x2: `${pb.x}%`, y2: `${pb.y}%` };
    }), []);

  return (
    <div style={{ background: BG, color: WHITE, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(6px, -10px); }
          50% { transform: translate(-4px, -18px); }
          75% { transform: translate(8px, -6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px 4px ${TEAL}44; }
          50% { opacity: 0.6; box-shadow: 0 0 24px 8px ${TEAL}66; }
        }
        @keyframes orbitSpin1 { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes orbitSpin2 { from { transform: translate(-50%,-50%) rotate(120deg); } to { transform: translate(-50%,-50%) rotate(480deg); } }
        @keyframes orbitSpin3 { from { transform: translate(-50%,-50%) rotate(240deg); } to { transform: translate(-50%,-50%) rotate(600deg); } }
        .orbit-label { transition: text-shadow 0.3s, opacity 0.3s; cursor: default; }
        .orbit-label:hover { text-shadow: 0 0 16px ${TEAL}; opacity: 1 !important; }
        .glass-btn {
          display: inline-block; padding: 14px 40px; border-radius: 999px;
          border: 1px solid ${TEAL}66; background: rgba(127,255,212,0.06);
          color: ${TEAL}; font-family: 'Cinzel', serif; font-size: 15px;
          letter-spacing: 0.12em; cursor: pointer; transition: all 0.3s;
          text-decoration: none;
        }
        .glass-btn:hover { background: rgba(127,255,212,0.14); box-shadow: 0 0 30px ${TEAL}33; }
        .glass-btn-solid {
          display: inline-block; padding: 16px 48px; border-radius: 999px;
          border: none; background: ${TEAL}; color: ${BG};
          font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700;
          letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s;
          text-decoration: none;
        }
        .glass-btn-solid:hover { box-shadow: 0 0 40px ${TEAL}66; transform: scale(1.04); }
      `}</style>

      {/* ── Particle field ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color, opacity: p.opacity,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }} />
        ))}
        {/* Constellation SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {constellationLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke={WHITE} strokeWidth={0.5} opacity={0.05} />
          ))}
        </svg>
      </div>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', zIndex: 1, minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '0 24px',
      }}>
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 16, letterSpacing: '0.3em',
          textTransform: 'uppercase', opacity: 0.6, marginBottom: 24,
        }}>ARCANEA</p>
        <h1 style={{
          fontFamily: "'Cinzel', serif", fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 400, lineHeight: 1.15, maxWidth: 800, margin: '0 0 28px',
        }}>The Universe That Creates With You</h1>
        <p style={{ fontSize: 18, opacity: 0.55, maxWidth: 540, margin: '0 0 44px', lineHeight: 1.6 }}>
          10 intelligences. 62 texts. 26 models. Infinite creation.
        </p>
        <a href="/discover" className="glass-btn">Enter the Universe</a>
      </section>

      {/* ── ORBITAL SHOWCASE ── */}
      <section style={{
        position: 'relative', zIndex: 1, height: 620,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '40px auto 80px',
      }}>
        {/* Center — The Source */}
        <div style={{
          position: 'absolute', textAlign: 'center', zIndex: 3,
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%', background: TEAL,
            margin: '0 auto 10px', animation: 'pulse 3s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, opacity: 0.7, letterSpacing: '0.15em' }}>
            THE SOURCE
          </span>
          <div style={{ fontSize: 11, opacity: 0.35, marginTop: 2 }}>1111 Hz</div>
        </div>

        {/* Ring 1 */}
        <div style={{
          position: 'absolute', width: 200, height: 200,
          border: `1px solid rgba(255,255,255,0.06)`, borderRadius: '50%',
          left: '50%', top: '50%', animation: 'orbitSpin1 60s linear infinite',
        }}>
          {RING_1.map((name, i) => {
            const angle = (i / RING_1.length) * 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <span key={name} className="orbit-label" style={{
                position: 'absolute', fontSize: 12, opacity: 0.5,
                fontFamily: "'Cinzel', serif", letterSpacing: '0.08em',
                left: `calc(50% + ${Math.cos(rad) * 100}px)`,
                top: `calc(50% + ${Math.sin(rad) * 100}px)`,
                transform: 'translate(-50%,-50%)',
              }}>{name}</span>
            );
          })}
        </div>

        {/* Ring 2 */}
        <div style={{
          position: 'absolute', width: 340, height: 340,
          border: `1px solid rgba(255,255,255,0.04)`, borderRadius: '50%',
          left: '50%', top: '50%', animation: 'orbitSpin2 90s linear infinite',
        }}>
          {RING_2.map((name, i) => {
            const angle = (i / RING_2.length) * 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <span key={name} className="orbit-label" style={{
                position: 'absolute', fontSize: 12, opacity: 0.4,
                fontFamily: "'Cinzel', serif", letterSpacing: '0.08em',
                left: `calc(50% + ${Math.cos(rad) * 170}px)`,
                top: `calc(50% + ${Math.sin(rad) * 170}px)`,
                transform: 'translate(-50%,-50%)',
              }}>{name}</span>
            );
          })}
        </div>

        {/* Ring 3 */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          border: `1px solid rgba(255,255,255,0.03)`, borderRadius: '50%',
          left: '50%', top: '50%', animation: 'orbitSpin3 120s linear infinite',
        }}>
          {RING_3.map((name, i) => {
            const angle = (i / RING_3.length) * 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <span key={name} className="orbit-label" style={{
                position: 'absolute', fontSize: 12, opacity: 0.35,
                fontFamily: "'Cinzel', serif", letterSpacing: '0.08em',
                left: `calc(50% + ${Math.cos(rad) * 250}px)`,
                top: `calc(50% + ${Math.sin(rad) * 250}px)`,
                transform: 'translate(-50%,-50%)',
              }}>{name}</span>
            );
          })}
        </div>
      </section>

      {/* ── NEBULA 1: Guardians (teal) ── */}
      <section style={{
        position: 'relative', zIndex: 1, maxWidth: 720,
        margin: '0 auto', padding: '100px 24px', textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 500px 400px at 50% 40%, ${TEAL}0d, transparent)`,
        }} />
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: 16 }}>
          The Guardians
        </h2>
        <p style={{ fontSize: 17, opacity: 0.5, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
          10 archetypal AI intelligences, each attuned to a different frequency of creation.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12, textAlign: 'left',
        }}>
          {GUARDIANS.map(g => (
            <div key={g.name} style={{
              padding: '12px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ fontSize: 14, fontFamily: "'Cinzel', serif", marginBottom: 2 }}>{g.name}</div>
              <div style={{ fontSize: 12, opacity: 0.35 }}>{g.hz} &middot; {g.domain}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEBULA 2: Library (violet) ── */}
      <section style={{
        position: 'relative', zIndex: 1, maxWidth: 720,
        margin: '0 auto', padding: '100px 24px', textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 500px 400px at 50% 40%, ${VIOLET}0d, transparent)`,
        }} />
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: 16 }}>
          The Library
        </h2>
        <p style={{ fontSize: 17, opacity: 0.5, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px' }}>
          62 texts of wisdom. Not entertainment &mdash; equipment for living.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {COLLECTIONS.map(c => (
            <span key={c} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13,
              border: `1px solid ${VIOLET}33`, color: `${VIOLET}cc`,
              background: `${VIOLET}08`,
            }}>{c}</span>
          ))}
        </div>
      </section>

      {/* ── NEBULA 3: Gateway (gold) ── */}
      <section style={{
        position: 'relative', zIndex: 1, maxWidth: 720,
        margin: '0 auto', padding: '100px 24px', textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 500px 400px at 50% 40%, ${GOLD}0a, transparent)`,
        }} />
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px, 3.5vw, 40px)', marginBottom: 16 }}>
          The Gateway
        </h2>
        <p style={{ fontSize: 17, opacity: 0.5, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px' }}>
          26 curated AI models. 13 providers. One API.
        </p>
        <pre style={{
          textAlign: 'left', padding: 24, borderRadius: 12,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          fontSize: 13, lineHeight: 1.7, overflowX: 'auto', color: 'rgba(255,255,255,0.65)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
{`const response = await arcanea.chat({
  model: "claude-sonnet-4-20250514",
  guardian: "Draconia",  // Fire intelligence
  message: "Help me transform this idea"
});`}
        </pre>
      </section>

      {/* ── DEEP SPACE CTA ── */}
      <section style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        padding: '120px 24px 160px',
      }}>
        {/* Denser particles at bottom */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 800px 400px at 50% 80%, ${TEAL}08, transparent)`,
        }} />
        {particles.slice(0, 30).map(p => (
          <div key={`btm-${p.id}`} style={{
            position: 'absolute',
            left: `${(p.x + 10) % 100}%`,
            top: `${60 + (p.y % 40)}%`,
            width: 2, height: 2, borderRadius: '50%',
            background: WHITE, opacity: 0.08 + (p.id % 4) * 0.04,
            animation: `particleFloat ${p.duration + 5}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
          }} />
        ))}
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: 'clamp(22px, 3vw, 32px)',
          opacity: 0.7, marginBottom: 40, lineHeight: 1.4,
        }}>
          Your story is waiting in the stars.
        </p>
        <a href="/discover" className="glass-btn-solid">Begin</a>
      </section>
    </div>
  );
}

export default V9Particles;

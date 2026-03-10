'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Fire, Drop, Leaf, Wind, Spiral, BookOpen, Lightning, ArrowRight } from '@phosphor-icons/react';

const GUARDIANS = [
  { name: 'Lyssandria', element: 'Earth', hz: 174, icon: Leaf },
  { name: 'Leyla', element: 'Water', hz: 285, icon: Drop },
  { name: 'Draconia', element: 'Fire', hz: 396, icon: Fire },
  { name: 'Maylinn', element: 'Heart', hz: 417, icon: Leaf },
  { name: 'Alera', element: 'Voice', hz: 528, icon: Wind },
  { name: 'Lyria', element: 'Sight', hz: 639, icon: Spiral },
  { name: 'Aiyami', element: 'Crown', hz: 741, icon: Lightning },
  { name: 'Elara', element: 'Starweave', hz: 852, icon: Wind },
  { name: 'Ino', element: 'Unity', hz: 963, icon: Drop },
  { name: 'Shinkami', element: 'Source', hz: 1111, icon: Spiral },
];

const S = {
  cinzel: 'Cinzel, serif',
  crimson: 'Crimson Pro, serif',
  mono: 'JetBrains Mono, monospace',
  bg: '#0a0a0f',
  text: '#e8e6e1',
  teal: '#7fffd4',
  gold: '#c5a55a',
  dim: 'rgba(232,230,225,0.55)',
  glass: 'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(255,255,255,0.06)',
  codeBg: 'rgba(255,255,255,0.02)',
} as const;

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const CSS = `
.reveal-item { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
.revealed .reveal-item, .reveal-item.revealed { opacity: 1; transform: translateY(0); }
.revealed .reveal-item:nth-child(2) { transition-delay: 0.12s; }
.revealed .reveal-item:nth-child(3) { transition-delay: 0.24s; }
@keyframes auroraBreath { 0%,100% { opacity:0.15; transform:scale(1) translate(-50%,-50%); } 50% { opacity:0.25; transform:scale(1.08) translate(-50%,-50%); } }
@keyframes floatBook { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
.gs::-webkit-scrollbar { display:none; } .gs { -ms-overflow-style:none; scrollbar-width:none; }
`;

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );
    el.querySelectorAll('.reveal-item').forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);
  return ref;
}

function GlassBtn({ href, color, children }: { href: string; color: string; children: React.ReactNode }) {
  const border = color === S.teal ? 'rgba(127,255,212,0.2)' : 'rgba(197,165,90,0.25)';
  const bg = color === S.teal ? 'rgba(127,255,212,0.04)' : 'rgba(197,165,90,0.04)';
  const hBg = color === S.teal ? 'rgba(127,255,212,0.1)' : 'rgba(197,165,90,0.1)';
  const hBorder = color === S.teal ? 'rgba(127,255,212,0.4)' : 'rgba(197,165,90,0.45)';
  return (
    <a href={href} className="inline-flex items-center gap-2 mt-10"
      style={{ fontFamily: S.cinzel, fontSize: '14px', letterSpacing: '0.12em', color, padding: '14px 36px', border: `1px solid ${border}`, borderRadius: '8px', background: bg, backdropFilter: 'blur(12px)', transition: 'all 0.3s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = hBg; e.currentTarget.style.borderColor = hBorder; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; }}
    >{children}</a>
  );
}

function MockupBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: S.codeBg, border: `1px solid ${S.glassBorder}`, borderRadius: '12px', padding: '24px', fontFamily: S.mono, fontSize: '13px', color: 'rgba(232,230,225,0.5)', lineHeight: 1.8, width: '100%', maxWidth: '400px' }}>
      {children}
    </div>
  );
}

function CinemaPanel({ title, subtitle, align, children }: { title: string; subtitle: string; align: 'left' | 'center' | 'right'; children: React.ReactNode }) {
  const ta = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  const fd = align === 'right' ? 'flex-row-reverse' : 'flex-row';
  return (
    <section className="reveal-item relative flex items-center" style={{ minHeight: '80vh', padding: '80px 0' }}>
      <div className={`mx-auto w-full max-w-6xl px-6 flex ${fd} items-center gap-16 flex-wrap lg:flex-nowrap`}>
        <div className={`flex-1 min-w-[280px] ${ta}`}>
          <h2 style={{ fontFamily: S.cinzel, fontSize: 'clamp(32px,5vw,48px)', color: S.text, lineHeight: 1.2, letterSpacing: '0.04em' }}>{title}</h2>
          <p className="mt-5" style={{ fontFamily: S.crimson, fontSize: '18px', color: 'rgba(232,230,225,0.6)', lineHeight: 1.7, maxWidth: align === 'center' ? '540px' : '440px', margin: align === 'center' ? '20px auto 0' : undefined }}>{subtitle}</p>
        </div>
        <div className="flex-1 min-w-[280px] flex items-center justify-center">{children}</div>
      </div>
    </section>
  );
}

export function V1Cinematic() {
  const revealRef = useScrollReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback((dir: number) => { scrollRef.current?.scrollBy({ left: dir * 264, behavior: 'smooth' }); }, []);

  return (
    <div ref={revealRef} style={{ background: S.bg, color: S.text, minHeight: '100vh' }}>
      {/* Film grain */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]" style={{ opacity: 0.03, backgroundImage: NOISE_SVG, backgroundSize: '128px' }} />
      <style>{CSS}</style>

      {/* HERO */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ height: '100vh' }}>
        {/* Letterbox bars */}
        {(['top', 'bottom'] as const).map((pos) => (
          <div key={pos} className={`absolute left-0 right-0 z-20 ${pos === 'top' ? 'top-0' : 'bottom-0'}`}
            style={{ height: 'calc((100vh - 100vw / 2.39) / 2)', minHeight: '40px', maxHeight: '100px', background: '#000' }} />
        ))}
        {/* Aurora glow */}
        <div aria-hidden className="absolute pointer-events-none"
          style={{ top: '50%', left: '50%', width: '700px', height: '400px', background: `radial-gradient(ellipse, rgba(127,255,212,0.12) 0%, rgba(127,255,212,0.03) 40%, transparent 70%)`, animation: 'auroraBreath 8s ease-in-out infinite', transformOrigin: '0 0' }} />
        <div className="relative z-10 text-center px-6" style={{ maxWidth: '900px' }}>
          <h1 style={{ fontFamily: S.cinzel, fontSize: 'clamp(40px,8vw,110px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '0.02em' }}>
            Where AI Meets Mythology
          </h1>
          <p className="mt-6" style={{ fontFamily: S.crimson, fontSize: 'clamp(16px,2vw,20px)', color: S.dim, lineHeight: 1.6, maxWidth: '520px', margin: '24px auto 0' }}>
            Create with 10 archetypal intelligences. Build worlds that breathe.
          </p>
          <GlassBtn href="/studio" color={S.teal}>Enter <ArrowRight size={16} weight="bold" /></GlassBtn>
        </div>
      </section>

      {/* GUARDIAN SHOWCASE */}
      <section className="reveal-item py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center mb-12" style={{ fontFamily: S.cinzel, fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '0.04em' }}>
            The Ten Guardians
          </h2>
          <div className="relative">
            <div ref={scrollRef} className="gs flex gap-6 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory', padding: '0 20px' }}>
              {GUARDIANS.map((g) => {
                const Icon = g.icon;
                return (
                  <div key={g.name} className="flex-shrink-0 snap-center flex flex-col items-center justify-end"
                    style={{ width: '240px', height: '320px', background: S.glass, border: `1px solid ${S.glassBorder}`, borderRadius: '12px', padding: '24px 20px', backdropFilter: 'blur(8px)' }}>
                    <Icon size={28} weight="light" color={S.teal} />
                    <p className="mt-4 text-center" style={{ fontFamily: S.cinzel, fontSize: '18px', letterSpacing: '0.08em' }}>{g.name}</p>
                    <p className="mt-1" style={{ fontFamily: S.mono, fontSize: '12px', color: S.teal, opacity: 0.7 }}>{g.hz} Hz</p>
                    <p className="mt-1" style={{ fontFamily: S.crimson, fontSize: '14px', color: 'rgba(232,230,225,0.5)' }}>{g.element}</p>
                  </div>
                );
              })}
            </div>
            {[-1, 1].map((dir) => (
              <button key={dir} onClick={() => scroll(dir)} aria-label={dir < 0 ? 'Scroll left' : 'Scroll right'}
                className={`absolute ${dir < 0 ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center`}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <ArrowRight size={16} weight="bold" color={S.teal} style={dir < 0 ? { transform: 'rotate(180deg)' } : undefined} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMA PANELS */}
      <CinemaPanel title="Forge" subtitle="Create with AI that understands narrative, mythology, and world-building. From characters to cosmologies, shape living universes." align="left">
        <MockupBox>
          <div style={{ color: 'rgba(127,255,212,0.6)' }}>{'// forge a new world'}</div>
          <div><span style={{ color: S.gold }}>const</span> <span style={{ color: S.text }}>world</span>{' = '}<span style={{ color: S.gold }}>await</span> <span style={{ color: S.teal }}>forge</span>{'({'}</div>
          <div className="pl-4">{'name: '}<span style={{ color: S.teal }}>{'"Eldara"'}</span>,</div>
          <div className="pl-4">{'element: '}<span style={{ color: S.teal }}>{'"fire"'}</span>,</div>
          <div className="pl-4">{'guardian: '}<span style={{ color: S.teal }}>{'"Draconia"'}</span></div>
          <div>{'});'}</div>
        </MockupBox>
      </CinemaPanel>

      <CinemaPanel title="Library" subtitle="62 wisdom texts across 17 collections. Laws, parables, prophecies, and meditations. Ancient frameworks for modern creators." align="center">
        <div className="relative w-full" style={{ height: '240px' }}>
          {[{ t: '10%', l: '15%', d: '0s', s: 24 }, { t: '25%', r: '20%', d: '1.5s', s: 20 }, { b: '30%', l: '25%', d: '0.8s', s: 22 }, { t: '60%', r: '10%', d: '2.2s', s: 18 }, { b: '15%', l: '45%', d: '1.2s', s: 26 }].map((p, i) => (
            <div key={i} className="absolute" style={{ top: p.t, bottom: p.b, left: p.l, right: p.r, animation: `floatBook 6s ease-in-out ${p.d} infinite` }}>
              <BookOpen size={p.s} weight="light" color="rgba(127,255,212,0.3)" />
            </div>
          ))}
        </div>
      </CinemaPanel>

      <CinemaPanel title="Gateway" subtitle="26 AI models behind a single API. Claude, Gemini, GPT, and more. One endpoint, every intelligence." align="right">
        <MockupBox>
          <div style={{ color: 'rgba(197,165,90,0.7)' }}>POST /api/gateway</div>
          <div className="mt-2">{'{'}</div>
          <div className="pl-4">{'"model": '}<span style={{ color: S.teal }}>{'"claude-opus"'}</span>,</div>
          <div className="pl-4">{'"prompt": '}<span style={{ color: S.teal }}>{'"Describe the Gate of Fire"'}</span></div>
          <div>{'}'}</div>
          <div className="mt-3" style={{ color: 'rgba(127,255,212,0.4)' }}>{'// 26 models. One endpoint.'}</div>
        </MockupBox>
      </CinemaPanel>

      {/* CTA */}
      <section className="reveal-item flex flex-col items-center justify-center py-32 px-6">
        <h2 style={{ fontFamily: S.cinzel, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '0.04em', textAlign: 'center' }}>
          Begin Your Story
        </h2>
        <GlassBtn href="/discover" color={S.gold}>Start Creating <ArrowRight size={16} weight="bold" /></GlassBtn>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 mx-auto max-w-6xl"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', fontFamily: S.crimson, fontSize: '14px', color: 'rgba(232,230,225,0.3)' }}>
        <span style={{ fontFamily: S.cinzel, fontSize: '13px', letterSpacing: '0.1em', color: 'rgba(232,230,225,0.4)' }}>Arcanea</span>
        <div className="flex gap-6">
          {['About', 'Library', 'Studio'].map((l) => (
            <a key={l} href={`/${l.toLowerCase()}`} className="hover:opacity-70 transition-opacity">{l}</a>
          ))}
        </div>
        <span>&copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default V1Cinematic;

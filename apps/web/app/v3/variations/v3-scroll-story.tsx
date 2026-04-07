'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Fire, Drop, Leaf, Wind, Spiral, Lightning, Heart, Eye, Crown,
  Sun, BookOpen, ArrowRight, Terminal,
} from '@phosphor-icons/react';
import type { PhosphorIcon } from '@phosphor-icons/react';

// --- Data ---
const A = '#7fffd4'; // accent
const GUARDIANS: { name: string; el: string; hz: number; c: string; Icon: PhosphorIcon }[] = [
  { name: 'Lyssandria', el: 'Earth',  hz: 174,  c: '#4ade80', Icon: Leaf },
  { name: 'Leyla',      el: 'Water',  hz: 285,  c: '#60a5fa', Icon: Drop },
  { name: 'Draconia',   el: 'Fire',   hz: 396,  c: '#f87171', Icon: Fire },
  { name: 'Maylinn',    el: 'Heart',  hz: 417,  c: '#f472b6', Icon: Heart },
  { name: 'Alera',      el: 'Voice',  hz: 528,  c: '#a78bfa', Icon: Wind },
  { name: 'Lyria',      el: 'Sight',  hz: 639,  c: '#c084fc', Icon: Eye },
  { name: 'Aiyami',     el: 'Crown',  hz: 741,  c: '#fbbf24', Icon: Crown },
  { name: 'Elara',      el: 'Starweave',  hz: 852,  c: '#94a3b8', Icon: Spiral },
  { name: 'Ino',        el: 'Unity',  hz: 963,  c: '#7fffd4', Icon: Lightning },
  { name: 'Shinkami',   el: 'Source', hz: 1111, c: '#ffd700', Icon: Sun },
];
const HERO_LINES = [
  'In the beginning, there was Lumina \u2014 the First Light.',
  'And from the Void, Nero whispered potential into being.',
  'Now it\u2019s your turn to create.',
];
const LIB_CATS = ['Laws','Poetry','Legends','Parables','Rituals','Prophecies','Meditations','Chronicles','Dialogues'];
const PROVIDERS = ['Anthropic','OpenAI','Google','xAI','Groq','Cerebras','Mistral','Meta'];
const TERM_LINES = [
  '$ curl -X POST https://arcanea.ai/api/gateway \\',
  '  -H "Authorization: Bearer arc_..." \\',
  '  -d \'{"model":"claude-opus","prompt":"..."}\'',
  '',
  '{ "response": "The Gate of Fire blazes...",',
  '  "model": "claude-opus",',
  '  "tokens": 142 }',
];

// --- Hook: scroll progress within a section ---
function useSectionScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      setT(Math.max(0, Math.min(1, -r.top / (el.offsetHeight - window.innerHeight))));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return t;
}

// --- Scroll Progress Bar ---
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <div aria-hidden className="fixed left-0 top-0 z-50" style={{ width: 3, height: '100vh' }}>
      <div style={{ width: '100%', height: `${p}%`, background: `linear-gradient(to bottom, ${A}, rgba(127,255,212,0.3))`, transition: 'height 60ms linear' }} />
    </div>
  );
}

// --- Chapter 0: Hero ---
function ChapterHero() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useSectionScroll(ref);
  const words = HERO_LINES.flatMap(l => l.split(' '));
  const total = words.length;
  const vis = Math.floor(Math.min(t / 0.8, 1) * total);
  const ctaOn = t > 0.85;
  let wi = 0;
  return (
    <section ref={ref} style={{ height: '300vh', position: 'relative', background: '#000' }}>
      <div className="sticky top-0 flex flex-col items-center justify-center px-6" style={{ height: '100vh', maxWidth: 720, margin: '0 auto' }}>
        <div className="text-center">
          {HERO_LINES.map((line, li) => {
            const lineWords = line.split(' ');
            const spans = lineWords.map((w, j) => {
              const idx = wi++;
              const on = idx < vis;
              return <span key={`${li}-${j}`} style={{ opacity: on ? 1 : 0, transform: on ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline-block', marginRight: '0.3em' }}>{w}</span>;
            });
            return (
              <p key={li} className={li === 2 ? 'mt-8' : 'mt-2'} style={{
                fontFamily: 'Newsreader, serif', lineHeight: 1.6,
                fontSize: li === 2 ? 'clamp(20px,3vw,28px)' : 'clamp(22px,3.5vw,32px)',
                fontStyle: li < 2 ? 'italic' : 'normal', color: li === 2 ? A : '#d4d4d4',
              }}>{spans}</p>
            );
          })}
        </div>
        <a href="/discover" className="inline-flex items-center gap-2 mt-12" style={{
          fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.12em', color: A,
          padding: '14px 40px', border: `1px solid rgba(127,255,212,${ctaOn ? 0.3 : 0})`,
          borderRadius: 8, background: `rgba(127,255,212,${ctaOn ? 0.05 : 0})`,
          opacity: ctaOn ? 1 : 0, transform: ctaOn ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s ease', pointerEvents: ctaOn ? 'auto' : 'none',
        }}>Begin <ArrowRight size={16} weight="bold" /></a>
      </div>
    </section>
  );
}

// --- Divider ---
const Div = () => <div aria-hidden style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(127,255,212,0.15), transparent)', margin: '0 auto', maxWidth: 600 }} />;

// --- Chapter 1: Guardians ---
function ChapterGuardians() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useSectionScroll(ref);
  const idx = Math.floor(t * GUARDIANS.length);
  return (
    <section ref={ref} style={{ height: `${GUARDIANS.length * 20 + 100}vh`, position: 'relative', background: '#000' }}>
      <div className="sticky top-0 flex flex-col md:flex-row items-start md:items-center" style={{ height: '100vh', padding: '0 clamp(24px,6vw,80px)' }}>
        <div className="w-full md:w-1/3 pt-16 md:pt-0">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,56px)', color: '#d4d4d4', letterSpacing: '0.04em', lineHeight: 1.15 }}>
            The Ten<br />Guardians
          </h2>
          <p className="mt-4" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(127,255,212,0.5)' }}>
            {idx >= 0 && idx < GUARDIANS.length ? `${GUARDIANS[idx].hz} Hz` : '\u00A0'}
          </p>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-3 mt-8 md:mt-0">
          {GUARDIANS.map((g, i) => {
            const on = i <= idx, act = i === idx;
            return (
              <div key={g.name} className="flex items-center gap-4" style={{
                opacity: on ? (act ? 1 : 0.35) : 0,
                transform: on ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <g.Icon size={act ? 24 : 18} weight={act ? 'fill' : 'light'} color={act ? g.c : 'rgba(212,212,212,0.3)'} style={{ transition: 'all 0.4s ease', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-display)', letterSpacing: '0.06em', transition: 'all 0.4s ease',
                  fontSize: act ? 'clamp(20px,2.5vw,32px)' : 'clamp(16px,2vw,22px)',
                  color: act ? g.c : 'rgba(212,212,212,0.3)',
                }}>{g.name}</span>
                {act && <span style={{ fontFamily: 'Newsreader, serif', fontSize: 14, color: 'rgba(212,212,212,0.4)', marginLeft: 8 }}>{g.el}</span>}
                {act && <div aria-hidden style={{ width: 40, height: 40, borderRadius: '50%', background: `radial-gradient(circle, ${g.c}22, transparent 70%)`, position: 'absolute', right: 'clamp(24px,6vw,80px)', filter: 'blur(12px)' }} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- Chapter 2: Library ---
function ChapterLibrary() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useSectionScroll(ref);
  const ms = [1, 17, 34, 62];
  const count = ms[Math.min(Math.floor(t * ms.length), ms.length - 1)];
  const catVis = Math.floor(t * (LIB_CATS.length + 2));
  const qVis = t > 0.75;
  const bookPos: { top?: string; bottom?: string; left?: string; right?: string; d: number; s: number }[] = [
    { top: '12%', left: '8%', d: 0, s: 28 }, { top: '20%', right: '12%', d: 1.5, s: 22 },
    { bottom: '25%', left: '15%', d: 0.7, s: 24 }, { top: '65%', right: '8%', d: 2, s: 20 },
    { bottom: '10%', left: '50%', d: 1.2, s: 26 },
  ];
  return (
    <section ref={ref} style={{ height: '250vh', position: 'relative', background: '#000' }}>
      <div className="sticky top-0 flex flex-col items-center justify-center px-6" style={{ height: '100vh' }}>
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          {bookPos.map((p, i) => (
            <div key={i} className="absolute" style={{ top: p.top, left: p.left, right: p.right, bottom: p.bottom, animation: `v3Float 6s ease-in-out ${p.d}s infinite`, opacity: t > 0.1 ? 0.2 : 0, transition: 'opacity 0.8s ease' }}>
              <BookOpen size={p.s} weight="light" color={A} />
            </div>
          ))}
        </div>
        <div className="text-center relative z-10">
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(48px,10vw,96px)', color: A, fontWeight: 300, transition: 'all 0.3s ease' }}>{count}</p>
          <p style={{ fontFamily: 'Newsreader, serif', fontSize: 18, color: 'rgba(212,212,212,0.5)', marginTop: 4 }}>texts of creation wisdom</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-lg mx-auto">
            {LIB_CATS.map((cat, i) => (
              <span key={cat} style={{
                fontFamily: 'Newsreader, serif', fontSize: 14, color: '#d4d4d4',
                padding: '4px 14px', border: '1px solid rgba(212,212,212,0.1)', borderRadius: 20,
                opacity: i < catVis ? 1 : 0, transform: i < catVis ? 'scale(1)' : 'scale(0.8)',
                transition: `all 0.4s ease ${i * 0.05}s`,
              }}>{cat}</span>
            ))}
          </div>
          <p className="mt-10 mx-auto" style={{
            fontFamily: 'Newsreader, serif', fontSize: 'clamp(16px,2vw,22px)', fontStyle: 'italic',
            color: 'rgba(212,212,212,0.6)', maxWidth: 480,
            opacity: qVis ? 1 : 0, transform: qVis ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.7s ease',
          }}>&ldquo;These books are not entertainment. They are equipment for living.&rdquo;</p>
        </div>
      </div>
    </section>
  );
}

// --- Chapter 3: Gateway ---
function ChapterGateway() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useSectionScroll(ref);
  const vLines = Math.floor(t * (TERM_LINES.length + 3));
  const showC = t > 0.5, showP = t > 0.65;
  const lineColor = (l: string) => l.startsWith('$') ? A : (l.startsWith('{') || l.startsWith('  "')) ? 'rgba(127,255,212,0.6)' : 'rgba(212,212,212,0.5)';
  return (
    <section ref={ref} style={{ height: '200vh', position: 'relative', background: '#000' }}>
      <div className="sticky top-0 flex flex-col items-center justify-center px-6" style={{ height: '100vh' }}>
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <Terminal size={20} weight="bold" color={A} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,40px)', color: '#d4d4d4', letterSpacing: '0.04em' }}>The Intelligence Gateway</h2>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(11px,1.4vw,14px)', lineHeight: 1.8 }}>
            <div className="flex gap-2 mb-4">
              {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
            </div>
            {TERM_LINES.map((l, i) => (
              <div key={i} style={{ color: lineColor(l), opacity: i < vLines ? 1 : 0, transform: i < vLines ? 'translateX(0)' : 'translateX(-8px)', transition: 'all 0.3s ease', minHeight: l === '' ? '1em' : undefined }}>{l}</div>
            ))}
            {vLines > TERM_LINES.length && <div className="mt-2" style={{ color: 'rgba(127,255,212,0.3)', animation: 'v3Blink 1s step-end infinite' }}>_</div>}
          </div>
          <div className="flex items-center justify-between mt-8">
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: A, opacity: showC ? 1 : 0, transition: 'opacity 0.5s ease' }}>26 curated models</p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(212,212,212,0.3)', opacity: showC ? 1 : 0, transition: 'opacity 0.5s ease' }}>One endpoint</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4" style={{ opacity: showP ? 1 : 0, transform: showP ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.5s ease' }}>
            {PROVIDERS.map(p => <span key={p} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(212,212,212,0.35)' }}>{p}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Chapter 4: CTA ---
function ChapterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className="relative flex flex-col items-center justify-center overflow-hidden" style={{ height: '100vh', background: '#000' }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${8 + (i * 7.5) % 84}%`, bottom: -4, width: 2, height: 2, borderRadius: '50%', background: A, opacity: on ? 0.3 : 0, animation: on ? `v3Rise ${4 + (i % 3) * 2}s linear ${i * 0.4}s infinite` : 'none' }} />
        ))}
      </div>
      <div className="text-center px-6 relative z-10" style={{ opacity: on ? 1 : 0, transform: on ? 'translateY(0)' : 'translateY(24px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <p style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(18px,2.5vw,24px)', fontStyle: 'italic', color: 'rgba(212,212,212,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
          Enter seeking. Leave transformed.<br />Return whenever needed.
        </p>
        <a href="/discover" className="group inline-flex items-center gap-2 mt-12" style={{
          fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.15em', color: '#000',
          padding: '16px 52px', borderRadius: 8, background: A,
          boxShadow: '0 0 30px rgba(127,255,212,0.15), 0 0 60px rgba(127,255,212,0.05)', transition: 'all 0.3s ease',
        }}>
          Begin <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}

// --- Keyframes ---
const STYLES = `
@keyframes v3Float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
@keyframes v3Blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes v3Rise { 0%{transform:translateY(0);opacity:0.3} 80%{opacity:0.15} 100%{transform:translateY(-100vh);opacity:0} }
`;

// --- Export ---
export function V3ScrollStory() {
  return (
    <div style={{ background: '#000', color: '#d4d4d4', minHeight: '100vh' }}>
      <style>{STYLES}</style>
      <ScrollProgress />
      <ChapterHero />
      <Div />
      <ChapterGuardians />
      <Div />
      <ChapterLibrary />
      <Div />
      <ChapterGateway />
      <Div />
      <ChapterCTA />
    </div>
  );
}

export default V3ScrollStory;

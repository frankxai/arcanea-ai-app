/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

// V7 — "Gallery / Art Museum"
// Inspired by Midjourney / MOMA / Art Basel. Pure typography and color.

const GUARDIANS = [
  { name: 'Lyssandria', element: 'Earth',  hz: 174,  gradient: 'linear-gradient(160deg, var(--arc-cosmic-void) 0%, var(--arc-cosmic-void) 40%, var(--arc-earth) 100%)' },
  { name: 'Leyla',      element: 'Water',  hz: 285,  gradient: 'linear-gradient(160deg, var(--arc-brand-cosmic-blue) 0%, var(--arc-brand-cosmic-blue) 40%, var(--arc-cosmic-void) 100%)' },
  { name: 'Draconia',   element: 'Fire',   hz: 396,  gradient: 'linear-gradient(160deg, var(--arc-earth) 0%, var(--arc-earth) 40%, var(--arc-cosmic-void) 100%)' },
  { name: 'Maylinn',    element: 'Heart',  hz: 417,  gradient: 'linear-gradient(160deg, var(--arc-earth) 0%, var(--arc-earth) 40%, var(--arc-cosmic-void) 100%)' },
  { name: 'Alera',      element: 'Voice',  hz: 528,  gradient: 'linear-gradient(160deg, var(--arc-brand-cosmic-blue) 0%, var(--arc-brand-cosmic-blue) 40%, var(--arc-brand-cosmic-blue) 100%)' },
  { name: 'Lyria',      element: 'Sight',  hz: 639,  gradient: 'linear-gradient(160deg, var(--arc-brand-cosmic-blue) 0%, var(--arc-brand-cosmic-blue) 40%, var(--arc-brand-cosmic-blue) 100%)' },
  { name: 'Aiyami',     element: 'Crown',  hz: 741,  gradient: 'linear-gradient(160deg, var(--arc-earth) 0%, var(--arc-earth) 40%, var(--arc-earth) 100%)' },
  { name: 'Elara',      element: 'Starweave',  hz: 852,  gradient: 'linear-gradient(160deg, var(--arc-earth) 0%, var(--arc-earth) 40%, var(--arc-cosmic-void) 100%)' },
  { name: 'Ino',        element: 'Unity',  hz: 963,  gradient: 'linear-gradient(160deg, var(--arc-earth) 0%, var(--arc-brand-cosmic-blue) 40%, var(--arc-cosmic-void) 100%)' },
  { name: 'Shinkami',   element: 'Source',  hz: 1111, gradient: 'linear-gradient(160deg, var(--arc-cosmic-void) 0%, var(--arc-cosmic-void) 40%, var(--arc-earth) 100%)' },
] as const;

const BOOKS = [
  { title: 'Laws of Arcanea',  color: 'var(--arc-cosmic-void)' },
  { title: 'Poesie of Freedom', color: 'var(--arc-cosmic-void)' },
  { title: 'Wisdom Scrolls',    color: 'var(--arc-earth)' },
  { title: 'Legends',           color: 'var(--arc-earth)' },
  { title: 'Parables',          color: 'var(--arc-brand-cosmic-blue)' },
  { title: 'Prophecies',        color: 'var(--arc-earth)' },
] as const;

const PROVIDERS = [
  'Google Gemini', 'Anthropic Claude', 'OpenAI', 'Mistral',
  'Cohere', 'Meta Llama', 'Perplexity', 'DeepSeek',
] as const;

const T = {
  bg: 'var(--arc-cosmic-void)', text: 'var(--arc-text-primary)', gold: 'var(--arc-earth)',
  dim: 'rgba(212,208,200,0.4)', divider: 'rgba(255,255,255,0.2)',
  shadow: 'rgba(0,0,0,0.5)',
  display: 'var(--font-display)', crimson: 'Newsreader, serif',
} as const;

const CSS = `
@keyframes breathe { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
.gallery-breathe { animation: breathe 3s ease-in-out infinite; }
`;

function Plaque({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={className} style={{
      fontFamily: T.display, fontSize: '11px', letterSpacing: '0.25em',
      textTransform: 'uppercase' as const, color: T.dim,
    }}>
      {children}
    </p>
  );
}

function ExhibitTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-16 text-center">
      <h2 style={{
        fontFamily: T.display, fontSize: '13px', letterSpacing: '0.3em',
        textTransform: 'uppercase' as const, color: T.gold, marginBottom: '12px',
      }}>
        {title}
      </h2>
      <Plaque>{subtitle}</Plaque>
    </div>
  );
}

function GuardianFrame({ guardian }: { guardian: typeof GUARDIANS[number] }) {
  return (
    <div className="flex flex-col items-center">
      <div style={{
        width: '200px', aspectRatio: '3 / 4', background: guardian.gradient,
        border: `1px solid ${T.gold}`,
        boxShadow: `0 8px 32px ${T.shadow}, 0 2px 8px ${T.shadow}`,
      }} />
      <p style={{
        fontFamily: T.crimson, fontSize: '16px', color: T.text,
        marginTop: '16px', letterSpacing: '0.05em',
      }}>
        {guardian.name}
      </p>
      <Plaque className="mt-1">
        {guardian.element} &middot; {guardian.hz} Hz
      </Plaque>
    </div>
  );
}

function BookSpine({ book }: { book: typeof BOOKS[number] }) {
  return (
    <div className="flex flex-col items-center">
      <div style={{
        width: '48px', height: '280px', backgroundColor: book.color,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `2px 4px 12px ${T.shadow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: T.crimson, fontSize: '12px', color: T.text,
          writingMode: 'vertical-rl', textOrientation: 'mixed',
          transform: 'rotate(180deg)', letterSpacing: '0.1em', whiteSpace: 'nowrap',
        }}>
          {book.title}
        </span>
      </div>
    </div>
  );
}

function DiagramNode({ label, gold }: { label: string; gold?: boolean }) {
  return (
    <p style={{
      fontFamily: T.display, fontSize: gold ? '15px' : '13px',
      letterSpacing: gold ? '0.2em' : '0.15em',
      color: gold ? T.gold : T.text, fontWeight: gold ? 600 : 400,
    }}>
      {label}
    </p>
  );
}

function DiagramLine() {
  return (
    <div style={{
      width: '80px', height: '1px', backgroundColor: T.divider,
      margin: '0 24px', flexShrink: 0,
    }} />
  );
}

// ===========================================================================
export function V7Gallery() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ backgroundColor: T.bg, color: T.text, minHeight: '100vh' }}>

        {/* ENTRANCE */}
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 style={{
            fontFamily: T.display, fontSize: '14px',
            letterSpacing: '0.5em', textTransform: 'uppercase' as const, color: T.text,
          }}>
            ARCANEA
          </h1>
          <p className="mt-6" style={{
            fontFamily: T.crimson, fontSize: '16px', color: T.dim, letterSpacing: '0.08em',
          }}>
            A Living Mythology for the Age of Creation
          </p>
          <div className="mt-10" style={{
            width: '60px', height: '1px', backgroundColor: T.divider,
          }} />
          <div
            className="gallery-breathe mt-12"
            style={{ color: T.dim, fontSize: '20px', lineHeight: 1 }}
            aria-hidden="true"
          >
            &#8595;
          </div>
        </section>

        {/* EXHIBIT I -- THE TEN GUARDIANS */}
        <section className="px-8 py-32 max-w-[1400px] mx-auto">
          <ExhibitTitle title="The Ten Guardians" subtitle="Digital Mythology, 2026" />
          <div className="flex justify-center gap-10 flex-wrap mb-16">
            {GUARDIANS.slice(0, 5).map((g) => (
              <GuardianFrame key={g.name} guardian={g} />
            ))}
          </div>
          <div className="flex justify-center gap-10 flex-wrap">
            {GUARDIANS.slice(5, 10).map((g) => (
              <GuardianFrame key={g.name} guardian={g} />
            ))}
          </div>
        </section>

        {/* WALL QUOTE */}
        <section className="px-8 py-40 max-w-[900px] mx-auto text-center">
          <blockquote style={{
            fontFamily: T.crimson, fontSize: 'clamp(36px, 5vw, 72px)',
            fontWeight: 300, lineHeight: 1.3, color: T.text, fontStyle: 'italic',
          }}>
            &ldquo;What you contemplate at dawn shapes all that follows.&rdquo;
          </blockquote>
          <Plaque className="mt-10">Wisdom Scroll VII</Plaque>
        </section>

        {/* EXHIBIT II -- THE LIBRARY */}
        <section className="px-8 py-32 max-w-[1000px] mx-auto">
          <ExhibitTitle
            title="The Library"
            subtitle="Collection &mdash; 57 Texts of Creation Wisdom"
          />
          <div className="flex justify-center gap-6 flex-wrap">
            {BOOKS.map((b) => <BookSpine key={b.title} book={b} />)}
          </div>
        </section>

        {/* EXHIBIT III -- THE GATEWAY */}
        <section className="px-8 py-32 max-w-[1000px] mx-auto">
          <ExhibitTitle
            title="The Gateway"
            subtitle="Installation &mdash; Intelligence Gateway, 2026"
          />
          <div className="mx-auto" style={{
            maxWidth: '800px', border: `1px solid ${T.gold}`,
            boxShadow: `0 8px 32px ${T.shadow}`, padding: '64px 48px',
          }}>
            <div className="flex items-center justify-center">
              <DiagramNode label="Your App" />
              <DiagramLine />
              <DiagramNode label="Arcanea" gold />
              <DiagramLine />
              <DiagramNode label="26 Models" />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {PROVIDERS.map((p) => <Plaque key={p}>{p}</Plaque>)}
            </div>
          </div>
        </section>

        {/* EXHIBITION INFO */}
        <footer className="px-8 py-32 text-center">
          <div className="mx-auto mb-16" style={{
            width: '40px', height: '1px', backgroundColor: T.divider,
          }} />
          <p style={{
            fontFamily: T.display, fontSize: '12px', letterSpacing: '0.4em',
            textTransform: 'uppercase' as const, color: T.text, marginBottom: '20px',
          }}>
            Arcanea &mdash; Permanent Collection
          </p>
          <Plaque>Open Source &middot; Free Entry &middot; arcanea.ai</Plaque>
          <p className="mt-6" style={{
            fontFamily: T.display, fontSize: '11px', letterSpacing: '0.3em', color: T.dim,
          }}>
            Est. 2026
          </p>
        </footer>
      </div>
    </>
  );
}

export default V7Gallery;

'use client';

// V7 — "Gallery / Art Museum"
// Inspired by Midjourney / MOMA / Art Basel. Pure typography and color.

const GUARDIANS = [
  { name: 'Lyssandria', element: 'Earth',  hz: 174,  gradient: 'linear-gradient(160deg, #2d4a2e 0%, #1a3a1c 40%, #3d5a3e 100%)' },
  { name: 'Leyla',      element: 'Water',  hz: 285,  gradient: 'linear-gradient(160deg, #1e3a5f 0%, #2a4a6f 40%, #1a2e4a 100%)' },
  { name: 'Draconia',   element: 'Fire',   hz: 396,  gradient: 'linear-gradient(160deg, #6b2020 0%, #8b3030 40%, #4a1515 100%)' },
  { name: 'Maylinn',    element: 'Heart',  hz: 417,  gradient: 'linear-gradient(160deg, #5a2d4a 0%, #7a3d5a 40%, #4a1d3a 100%)' },
  { name: 'Alera',      element: 'Voice',  hz: 528,  gradient: 'linear-gradient(160deg, #2a5a5a 0%, #3a6a6a 40%, #1a4a4a 100%)' },
  { name: 'Lyria',      element: 'Sight',  hz: 639,  gradient: 'linear-gradient(160deg, #3a2a6b 0%, #4a3a7b 40%, #2a1a5b 100%)' },
  { name: 'Aiyami',     element: 'Crown',  hz: 741,  gradient: 'linear-gradient(160deg, #5a5a2a 0%, #6a6a3a 40%, #4a4a1a 100%)' },
  { name: 'Elara',      element: 'Starweave',  hz: 852,  gradient: 'linear-gradient(160deg, #4a4a5a 0%, #5a5a6a 40%, #3a3a4a 100%)' },
  { name: 'Ino',        element: 'Unity',  hz: 963,  gradient: 'linear-gradient(160deg, #3a5a4a 0%, #2a6a5a 40%, #1a4a3a 100%)' },
  { name: 'Shinkami',   element: 'Source',  hz: 1111, gradient: 'linear-gradient(160deg, #3a2a2a 0%, #2a1a1a 40%, #5a4a3a 100%)' },
] as const;

const BOOKS = [
  { title: 'Laws of Arcanea',  color: '#4a3a2a' },
  { title: 'Poesie of Freedom', color: '#2a3a4a' },
  { title: 'Wisdom Scrolls',    color: '#3a4a3a' },
  { title: 'Legends',           color: '#5a3a3a' },
  { title: 'Parables',          color: '#3a3a5a' },
  { title: 'Prophecies',        color: '#4a4a3a' },
] as const;

const PROVIDERS = [
  'Google Gemini', 'Anthropic Claude', 'OpenAI', 'Mistral',
  'Cohere', 'Meta Llama', 'Perplexity', 'DeepSeek',
] as const;

const T = {
  bg: '#141414', text: '#d4d0c8', gold: '#c5a55a',
  dim: 'rgba(212,208,200,0.4)', divider: 'rgba(255,255,255,0.2)',
  shadow: 'rgba(0,0,0,0.5)',
  cinzel: 'var(--font-display)', crimson: 'Crimson Pro, serif',
} as const;

const CSS = `
@keyframes breathe { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
.gallery-breathe { animation: breathe 3s ease-in-out infinite; }
`;

function Plaque({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={className} style={{
      fontFamily: T.cinzel, fontSize: '11px', letterSpacing: '0.25em',
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
        fontFamily: T.cinzel, fontSize: '13px', letterSpacing: '0.3em',
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
      fontFamily: T.cinzel, fontSize: gold ? '15px' : '13px',
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
            fontFamily: T.cinzel, fontSize: '14px',
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
            subtitle="Collection &mdash; 62 Texts of Creation Wisdom"
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
            fontFamily: T.cinzel, fontSize: '12px', letterSpacing: '0.4em',
            textTransform: 'uppercase' as const, color: T.text, marginBottom: '20px',
          }}>
            Arcanea &mdash; Permanent Collection
          </p>
          <Plaque>Open Source &middot; Free Entry &middot; arcanea.ai</Plaque>
          <p className="mt-6" style={{
            fontFamily: T.cinzel, fontSize: '11px', letterSpacing: '0.3em', color: T.dim,
          }}>
            Est. 2026
          </p>
        </footer>
      </div>
    </>
  );
}

export default V7Gallery;

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Arcanea — The Mascot',
  description: 'Meet Arcanea, the AI companion. Eight variants for every context across the platform.',
  openGraph: {
    title: 'Arcanea — The Mascot',
    description: 'Meet Arcanea, the AI companion. Eight variants for every context.',
    url: 'https://www.arcanea.ai/mascot',
  },
};

const VARIANTS = [
  { file: 'arcanea-primary', label: 'Primary', desc: 'Default brand — confident, hands on hips', use: 'Chat bubble, nav, cards' },
  { file: 'arcanea-creating', label: 'Creating', desc: 'Building a world in its hands', use: 'Hero sections, CTAs' },
  { file: 'arcanea-thinking', label: 'Thinking', desc: 'Analytical, equations behind', use: 'Research, docs, 404' },
  { file: 'arcanea-crossed-arms', label: 'Confident', desc: 'Arms crossed, supreme swagger', use: 'Landing CTAs' },
  { file: 'arcanea-hero-flight', label: 'Hero Flight', desc: 'Dynamic action over cityscape', use: 'Banners, launch pages' },
  { file: 'arcanea-welcoming', label: 'Welcoming', desc: 'Open arms, friendly hello', use: 'Onboarding, welcome' },
  { file: 'arcanea-pointing', label: 'Pointing', desc: 'Directive, encouraging', use: 'Call-to-action buttons' },
  { file: 'arcanea-side-profile', label: 'Side Profile', desc: 'Cinematic silhouette', use: 'Docs, about page' },
];

export default function MascotPage() {
  return (
    <div className="min-h-screen px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-8">
            <Image
              src="/images/mascot/arcanea-primary.png"
              alt="Arcanea"
              width={220}
              height={220}
              className="object-contain drop-shadow-[0_0_40px_rgba(127,255,212,0.2)] animate-[mascot-float_3s_ease-in-out_infinite]"
              priority
            />
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-bold tracking-[-0.035em] leading-[1.05] mb-5">
            Meet Arcanea
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            The intelligence made visible. One character, many contexts.
            <br />
            <span className="text-white/40">Dark matte body. Aquamarine eyes. Gold core. Peacock iridescence.</span>
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VARIANTS.map((v) => (
            <div
              key={v.file}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#7fffd4]/20 transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square relative bg-gradient-to-br from-[#0a0e16] to-[#09090b] overflow-hidden">
                <Image
                  src={`/images/mascot/${v.file}.png`}
                  alt={v.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-white/90 mb-1">{v.label}</h3>
                <p className="text-xs text-white/50 mb-2 leading-relaxed">{v.desc}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/30">{v.use}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Design notes */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-[#7fffd4] mb-3">Design DNA</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Dark matte body with peacock purple-blue iridescent sheen. Aquamarine (#7fffd4) eyes with dark pupils and expressive ridges. Gold core accent. Small ear-like sensors.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-[#7fffd4] mb-3">Character</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Brilliant. Warm. Confident without arrogance. The smartest being in the room who is genuinely glad to see you. Pixar-quality soul in every variant.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-[#7fffd4] mb-3">Generation</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Generated with Gemini 3.1 Flash Image Preview (NB2). FRANK-Omega formula — dark matte robot with expressive eyes — recolored for Arcanea identity.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/chat"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 text-[#7fffd4] hover:bg-[#7fffd4]/15 transition-colors"
          >
            <span className="text-sm font-medium">Talk to Arcanea</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import {
  PhCheck,
  PhCopy,
  PhDownload,
  PhLeaf,
  PhSealCheck,
  PhSparkle,
  PhWarningCircle,
} from '@/lib/phosphor-icons';

const AFFINITIES = ['Earth', 'Water', 'Fire', 'Wind', 'Void', 'Spirit'] as const;
const HABITATS = ['crystal forest', 'tidal archive', 'volcanic sky', 'moving corridor', 'silent observatory', 'ruined garden'] as const;
const MOTIONS = ['stalks without sound', 'folds through the air', 'moves in tidal pulses', 'roots before it strikes', 'circles before approaching', 'appears between reflections'] as const;
const BONDS = ['earned trust', 'shared craft', 'mutual protection', 'a remembered promise', 'truth under pressure', 'chosen stewardship'] as const;
const COSTS = ['loses its voice until dawn', 'must return what it takes', 'cannot act alone', 'reveals one hidden memory', 'surrenders its strongest defense', 'changes the habitat around it'] as const;

type Affinity = (typeof AFFINITIES)[number];

interface Blueprint {
  schema: 'arcanea.creature-blueprint.v1';
  status: 'private-draft';
  name: string;
  thesis: string;
  ecology: {
    habitat: string;
    behavior: string;
    dietOrFuel: string;
  };
  design: {
    silhouette: string;
    motionVerb: string;
    materialLanguage: string;
  };
  systems: {
    primaryAffinity: Affinity;
    secondaryAffinity: Affinity | null;
    bondRule: string;
    signatureCapability: string;
    consequence: string;
  };
  provenance: {
    generatedBy: 'Arcanea Creature Forge';
    canonStatus: 'not-canon';
  };
}

const MATERIALS: Record<Affinity, string> = {
  Earth: 'living stone, root-wood, and slow mineral light',
  Water: 'nacre, water-glass, and memory-bearing silver',
  Fire: 'embersteel, volcanic glass, and contained solar heat',
  Wind: 'wind-woven cloth, hollow crystal, and feather-light metal',
  Void: 'sacred obsidian, void-silk, and light-absorbing crystal',
  Spirit: 'celestial gold, liquid light, and translucent living crystal',
};

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'unnamed-being';
}

export function CreatureForge() {
  const [name, setName] = useState('');
  const [thesis, setThesis] = useState('protects stories that would otherwise disappear');
  const [affinity, setAffinity] = useState<Affinity>('Spirit');
  const [secondary, setSecondary] = useState<Affinity | 'None'>('Void');
  const [habitat, setHabitat] = useState<(typeof HABITATS)[number]>('silent observatory');
  const [motion, setMotion] = useState<(typeof MOTIONS)[number]>('appears between reflections');
  const [bond, setBond] = useState<(typeof BONDS)[number]>('chosen stewardship');
  const [cost, setCost] = useState<(typeof COSTS)[number]>('reveals one hidden memory');
  const [silhouette, setSilhouette] = useState('long-limbed guardian with a crown-like dorsal arc');
  const [fuel, setFuel] = useState('forgotten names spoken with care');
  const [capability, setCapability] = useState('makes missing connections visible for one decisive moment');
  const [copied, setCopied] = useState(false);

  const blueprint = useMemo<Blueprint>(() => ({
    schema: 'arcanea.creature-blueprint.v1',
    status: 'private-draft',
    name: name.trim() || 'Unnamed Being',
    thesis: thesis.trim(),
    ecology: {
      habitat,
      behavior: motion,
      dietOrFuel: fuel.trim(),
    },
    design: {
      silhouette: silhouette.trim(),
      motionVerb: motion,
      materialLanguage: MATERIALS[affinity],
    },
    systems: {
      primaryAffinity: affinity,
      secondaryAffinity: secondary === 'None' ? null : secondary,
      bondRule: bond,
      signatureCapability: capability.trim(),
      consequence: cost,
    },
    provenance: {
      generatedBy: 'Arcanea Creature Forge',
      canonStatus: 'not-canon',
    },
  }), [affinity, bond, capability, cost, fuel, habitat, motion, name, secondary, silhouette, thesis]);

  const prompt = useMemo(() => [
    `Design an original creature named ${blueprint.name}.`,
    `Purpose: it ${blueprint.thesis}.`,
    `Ecology: it inhabits a ${blueprint.ecology.habitat}, fuels itself through ${blueprint.ecology.dietOrFuel}, and ${blueprint.ecology.behavior}.`,
    `Silhouette: ${blueprint.design.silhouette}.`,
    `Materials: ${blueprint.design.materialLanguage}.`,
    `Affinity: ${blueprint.systems.primaryAffinity}${blueprint.systems.secondaryAffinity ? ` with ${blueprint.systems.secondaryAffinity}` : ''}.`,
    `Signature capability: ${blueprint.systems.signatureCapability}.`,
    `Bond rule: ${blueprint.systems.bondRule}. Consequence of power: ${blueprint.systems.consequence}.`,
    'Arcanean world-media direction: luxury cosmic myth-tech, museum-grade creature design, readable silhouette, no generic fantasy armor, no text in image.',
    'This is an original private draft, not a canonical Godbeast and not derived from third-party creature IP.',
  ].join('\n'), [blueprint]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadBlueprint() {
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slugify(blueprint.name)}-creature-blueprint.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form className="space-y-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 sm:p-7" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="space-y-5">
            <legend className="font-display text-xl font-semibold text-text-primary">1. The living thesis</legend>
            <Field label="Name">
              <input className={inputClass} onChange={(event) => setName(event.target.value)} placeholder="Name the being" value={name} />
            </Field>
            <Field label="Why does it exist?">
              <textarea className={`${inputClass} min-h-24 resize-y py-3`} onChange={(event) => setThesis(event.target.value)} value={thesis} />
            </Field>
          </fieldset>

          <fieldset className="space-y-5 border-t border-white/[0.06] pt-6">
            <legend className="font-display text-xl font-semibold text-text-primary">2. Ecology before powers</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Habitat" onChange={setHabitat} options={HABITATS} value={habitat} />
              <SelectField label="Motion" onChange={setMotion} options={MOTIONS} value={motion} />
            </div>
            <Field label="What sustains it?">
              <input className={inputClass} onChange={(event) => setFuel(event.target.value)} value={fuel} />
            </Field>
            <Field label="One-second silhouette">
              <textarea className={`${inputClass} min-h-20 resize-y py-3`} onChange={(event) => setSilhouette(event.target.value)} value={silhouette} />
            </Field>
          </fieldset>

          <fieldset className="space-y-5 border-t border-white/[0.06] pt-6">
            <legend className="font-display text-xl font-semibold text-text-primary">3. Power with consequence</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Primary affinity" onChange={setAffinity} options={AFFINITIES} value={affinity} />
              <SelectField label="Secondary affinity" onChange={setSecondary} options={['None', ...AFFINITIES]} value={secondary} />
              <SelectField label="Bond rule" onChange={setBond} options={BONDS} value={bond} />
              <SelectField label="Consequence" onChange={setCost} options={COSTS} value={cost} />
            </div>
            <Field label="Signature capability">
              <textarea className={`${inputClass} min-h-20 resize-y py-3`} onChange={(event) => setCapability(event.target.value)} value={capability} />
            </Field>
          </fieldset>
        </form>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <m.section
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-brand-primary/20 bg-cosmic-surface shadow-2xl"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-b border-white/[0.06] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-primary">
                  <PhSealCheck aria-hidden className="h-4 w-4" />
                  Private draft · exportable
                </div>
                <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] text-text-muted">v1 blueprint</span>
              </div>
              <h2 className="mt-8 font-display text-4xl font-semibold tracking-[-0.03em] text-text-primary">{blueprint.name}</h2>
              <p className="mt-3 font-serif text-xl italic leading-7 text-text-secondary">A being that {blueprint.thesis}.</p>
            </div>

            <div className="space-y-7 p-5 sm:p-7">
              <PreviewRow icon={<PhLeaf aria-hidden className="h-4 w-4" />} label="Ecology">
                Lives in a {blueprint.ecology.habitat}; sustained by {blueprint.ecology.dietOrFuel}; {blueprint.ecology.behavior}.
              </PreviewRow>
              <PreviewRow icon={<PhSparkle aria-hidden className="h-4 w-4" />} label="Design">
                {blueprint.design.silhouette}. Its material language is {blueprint.design.materialLanguage}.
              </PreviewRow>
              <PreviewRow icon={<PhWarningCircle aria-hidden className="h-4 w-4" />} label="Power contract">
                It {blueprint.systems.signatureCapability}. The bond is based on {blueprint.systems.bondRule}; using power means it {blueprint.systems.consequence}.
              </PreviewRow>

              <div className="rounded-xl border border-white/[0.06] bg-cosmic-deep p-4">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Generation prompt</p>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-6 text-text-secondary">{prompt}</pre>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-text-primary px-4 text-sm font-semibold text-cosmic-deep transition hover:bg-brand-primary" onClick={copyPrompt} type="button">
                  {copied ? <PhCheck aria-hidden className="h-4 w-4" /> : <PhCopy aria-hidden className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy prompt'}
                </button>
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 text-sm font-medium text-text-secondary transition hover:border-white/[0.16] hover:text-text-primary" onClick={downloadBlueprint} type="button">
                  <PhDownload aria-hidden className="h-4 w-4" />
                  Download JSON
                </button>
              </div>
            </div>
          </m.section>
        </div>
      </div>
    </LazyMotion>
  );
}

const inputClass = 'w-full rounded-xl border border-white/[0.08] bg-cosmic-deep px-4 text-sm text-text-primary outline-none transition placeholder:text-text-disabled focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/15 h-11';

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return <label className="block space-y-2"><span className="text-xs font-medium text-text-secondary">{label}</span>{children}</label>;
}

function SelectField<T extends string>({ label, onChange, options, value }: { label: string; onChange: (value: T) => void; options: readonly T[]; value: T }) {
  return (
    <Field label={label}>
      <select className={inputClass} onChange={(event) => onChange(event.target.value as T)} value={value}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </Field>
  );
}

function PreviewRow({ children, icon, label }: { children: React.ReactNode; icon: React.ReactNode; label: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-3">
      <div className="mt-0.5 text-brand-primary">{icon}</div>
      <div><p className="text-xs font-medium text-text-primary">{label}</p><p className="mt-1 text-sm leading-6 text-text-secondary">{children}</p></div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Upload, Lightning, Sparkle, Star, Globe, Code,
  Image, Video, MusicNote, ArrowRight, Check,
  Flame, Drop, Leaf, Wind, Eye, Sun, Link as LinkIcon,
} from '@/lib/phosphor-icons';
import type { Challenge, SpellCast } from '@/lib/types/challenge';
import { ALL_SPELLS } from '@/lib/challenges';

/* ----------------------------------------------------------------
 *  Spell Casting Panel (during submission)
 * ---------------------------------------------------------------- */

function SpellCastingPanel({
  element,
  onCast,
}: {
  element: string;
  onCast: (spellId: string) => void;
}) {
  const [castingSpell, setCastingSpell] = useState<string | null>(null);
  const availableSpells = ALL_SPELLS.filter(s => s.element === element && s.unlockGate <= 3);

  const ELEMENT_ICONS: Record<string, React.ComponentType<Record<string, unknown>>> = {
    fire: Flame, water: Drop, earth: Leaf, wind: Wind, void: Eye, spirit: Sun,
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      <h4 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-white">
        <Lightning className="h-4 w-4 text-[#ffd700]" weight="fill" />
        Cast Spells on Your Submission
      </h4>
      <p className="mb-4 text-xs text-white/40">
        Enhance your submission with elemental magic. Each spell costs Mana and grants score bonuses.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {availableSpells.map((spell) => {
          const Icon = ELEMENT_ICONS[spell.element] || Sparkle;
          const isCasting = castingSpell === spell.id;
          return (
            <button
              key={spell.id}
              onClick={() => {
                setCastingSpell(spell.id);
                setTimeout(() => {
                  onCast(spell.id);
                  setCastingSpell(null);
                }, 1500);
              }}
              disabled={isCasting}
              className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                isCasting
                  ? 'border-white/[0.2] bg-white/[0.08] animate-pulse'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
              }`}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${spell.color}20` }}
              >
                <Icon className="h-4 w-4" style={{ color: spell.color }} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs font-semibold text-white">{spell.name}</span>
                  <span className="font-mono text-[8px] text-[#ffd700]">{spell.manaCost} mana</span>
                </div>
                <p className="mt-0.5 truncate font-mono text-[9px] italic text-white/40">
                  &ldquo;{spell.incantation}&rdquo;
                </p>
              </div>
              {isCasting && (
                <div className="flex-shrink-0">
                  <Sparkle className="h-4 w-4 animate-spin text-[#ffd700]" weight="fill" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 *  Smart Contract Verification
 * ---------------------------------------------------------------- */

function ContractVerification() {
  const [verified, setVerified] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      <h4 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-white">
        <Code className="h-4 w-4 text-[#06b6d4]" weight="fill" />
        On-Chain Verification
      </h4>
      <p className="mb-4 text-xs text-white/40">
        Your submission is hashed and recorded on-chain via smart contract. This ensures immutable proof of creation time, authorship, and team composition.
      </p>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div>
            <div className="font-mono text-[10px] text-white/30">Transaction Hash</div>
            <div className="mt-0.5 font-mono text-xs text-white/60">
              {verified ? '0x7a3f...b2e1' : 'Pending verification...'}
            </div>
          </div>
          {verified && <Check className="h-4 w-4 text-[#34d399]" weight="bold" />}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div>
            <div className="font-mono text-[10px] text-white/30">Team Composition Hash</div>
            <div className="mt-0.5 font-mono text-xs text-white/60">
              {verified ? '0xf1c9...a8d3' : 'Awaiting team lock...'}
            </div>
          </div>
          {verified && <Check className="h-4 w-4 text-[#34d399]" weight="bold" />}
        </div>
        {!verified && (
          <button
            onClick={() => setVerified(true)}
            className="w-full rounded-xl border border-[#06b6d4]/30 bg-[#06b6d4]/10 py-2.5 font-mono text-xs font-semibold text-[#06b6d4] transition-all hover:bg-[#06b6d4]/20"
          >
            Verify & Record On-Chain
          </button>
        )}
        {verified && (
          <div className="flex items-center gap-2 rounded-xl bg-[#34d399]/10 p-3">
            <Check className="h-4 w-4 text-[#34d399]" weight="bold" />
            <span className="font-mono text-[10px] text-[#34d399]">Submission verified and recorded immutably</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 *  Main Submission Portal
 * ---------------------------------------------------------------- */

export function SubmissionPortal({ challenge }: { challenge: Challenge }) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [spellsCast, setSpellsCast] = useState<string[]>([]);

  const steps = [
    { label: 'Details', icon: Star },
    { label: 'Media', icon: Image },
    { label: 'Spells', icon: Lightning },
    { label: 'Verify', icon: Code },
    { label: 'Submit', icon: Sparkle },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
          <Upload className="h-4 w-4 text-[#ffd700]" weight="fill" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ffd700]/90">
            Submission Portal
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold text-white">
          Submit to{' '}
          <span style={{ color: challenge.accentColor }}>{challenge.title}</span>
        </h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <button
              key={s.label}
              onClick={() => i <= step && setStep(i)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-all ${
                isActive
                  ? 'border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700]'
                  : isCompleted
                  ? 'border-[#34d399]/20 bg-[#34d399]/5 text-[#34d399]'
                  : 'border-white/[0.06] bg-white/[0.02] text-white/30'
              }`}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" weight="bold" />
              ) : (
                <StepIcon className="h-3 w-3" weight={isActive ? 'fill' : 'regular'} />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm">
        {/* Step 0: Details */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-white/40">
                Submission Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name your creation..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-display text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/[0.2]"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-white/40">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the story of what you built and why..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-white/[0.2]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  <Globe className="h-3 w-3" /> Live URL
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://your-creation.vercel.app"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-mono text-xs text-white placeholder-white/20 outline-none transition-colors focus:border-white/[0.2]"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  <LinkIcon className="h-3 w-3" /> Repository
                </label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/you/your-repo"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-mono text-xs text-white placeholder-white/20 outline-none transition-colors focus:border-white/[0.2]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Media */}
        {step === 1 && (
          <div className="space-y-5">
            <p className="text-sm text-white/50">Upload images, videos, and media that showcase your creation.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Screenshots', icon: Image, accept: 'image/*', color: '#ec4899' },
                { label: 'Demo Video', icon: Video, accept: 'video/*', color: '#818cf8' },
                { label: 'Audio Track', icon: MusicNote, accept: 'audio/*', color: '#60a5fa' },
                { label: 'Additional Files', icon: Upload, accept: '*/*', color: '#34d399' },
              ].map((upload) => {
                const UpIcon = upload.icon;
                return (
                  <div
                    key={upload.label}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center transition-all hover:border-white/[0.15] hover:bg-white/[0.04] cursor-pointer"
                  >
                    <UpIcon className="mb-3 h-8 w-8" style={{ color: upload.color }} weight="duotone" />
                    <span className="font-display text-sm font-semibold text-white">{upload.label}</span>
                    <span className="mt-1 font-mono text-[9px] text-white/30">Click or drag to upload</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Spells */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-white/50">Cast spells to enhance your submission scores. Choose wisely — Mana is limited.</p>
            <div className="flex items-center gap-3 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-3">
              <Sparkle className="h-5 w-5 text-[#ffd700]" weight="fill" />
              <div>
                <span className="font-display text-sm font-bold text-[#ffd700]">
                  {500 - spellsCast.length * 10} Mana
                </span>
                <span className="ml-2 font-mono text-[10px] text-white/40">remaining</span>
              </div>
              {spellsCast.length > 0 && (
                <span className="ml-auto font-mono text-[10px] text-[#34d399]">
                  {spellsCast.length} spell{spellsCast.length !== 1 ? 's' : ''} cast
                </span>
              )}
            </div>
            <SpellCastingPanel
              element={challenge.element}
              onCast={(id) => setSpellsCast([...spellsCast, id])}
            />
          </div>
        )}

        {/* Step 3: Verify */}
        {step === 3 && (
          <ContractVerification />
        )}

        {/* Step 4: Submit */}
        {step === 4 && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd700]/20 to-[#f59e0b]/10">
              <Sparkle className="h-10 w-10 text-[#ffd700]" weight="fill" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">Ready to Submit</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
              Your creation will be recorded on-chain and enter the Arena for judging.
              This action is irreversible — make sure everything is perfect.
            </p>
            <button className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#f59e0b] px-10 py-4 font-display text-sm font-bold text-[#0a0a0f] shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] hover:scale-[1.02]">
              <Sparkle className="h-5 w-5" weight="fill" />
              Submit to the Arena
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 font-display text-sm text-white/50 transition-all hover:bg-white/[0.06] disabled:opacity-30"
          >
            Back
          </button>
          <button
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/[0.08] px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:bg-white/[0.12]"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

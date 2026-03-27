'use client';

import { useState } from 'react';
import {
  Lightning, Sparkle, ArrowRight, Clock, CheckCircle,
  X, Palette, MusicNotes, PencilSimple, Code,
  Globe, BookOpen,
} from '@/lib/phosphor-icons';
import type { CommissionType, CommissionComplexity, LuminorCommission } from '@/lib/types/commerce';
import { COMMISSION_BASE_PRICES, COMMISSION_TYPE_MULTIPLIERS, calculateCommissionPrice } from '@/lib/commerce/pricing';

const TYPE_CONFIG: Record<CommissionType, { label: string; icon: React.ElementType; color: string }> = {
  song: { label: 'Song', icon: MusicNotes, color: '#c084fc' },
  art: { label: 'Visual Art', icon: Palette, color: '#f472b6' },
  story: { label: 'Story', icon: PencilSimple, color: '#60a5fa' },
  code: { label: 'Code', icon: Code, color: '#34d399' },
  world: { label: 'World', icon: Globe, color: '#f59e0b' },
  'prompt-book': { label: 'Prompt Book', icon: BookOpen, color: '#a78bfa' },
};

const COMPLEXITY_CONFIG: Record<CommissionComplexity, { label: string; description: string }> = {
  cantrip: { label: 'Cantrip', description: 'Quick creation, simple output' },
  invocation: { label: 'Invocation', description: 'Standard quality, moderate detail' },
  ritual: { label: 'Ritual', description: 'High quality, detailed and refined' },
  arcanum: { label: 'Arcanum', description: 'Masterwork quality, exceptional depth' },
};

const STATUS_DISPLAY: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  requested: { label: 'Requested', color: '#60a5fa', icon: Clock },
  accepted: { label: 'Accepted', color: '#34d399', icon: CheckCircle },
  'in-progress': { label: 'In Progress', color: '#f59e0b', icon: Lightning },
  delivered: { label: 'Delivered', color: '#a78bfa', icon: Sparkle },
  completed: { label: 'Completed', color: '#10b981', icon: CheckCircle },
  disputed: { label: 'Disputed', color: '#ef4444', icon: X },
  cancelled: { label: 'Cancelled', color: '#6b7280', icon: X },
};

interface CommissionPanelProps {
  luminorName?: string;
  luminorId?: string;
  luminorCreatorId?: string;
  onSubmit?: (data: {
    type: CommissionType;
    complexity: CommissionComplexity;
    brief: string;
  }) => Promise<void>;
}

export function CommissionPanel({
  luminorName = 'Luminor',
  onSubmit,
}: CommissionPanelProps) {
  const [type, setType] = useState<CommissionType>('song');
  const [complexity, setComplexity] = useState<CommissionComplexity>('invocation');
  const [brief, setBrief] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pricing = calculateCommissionPrice(type, complexity);

  async function handleSubmit() {
    if (!brief.trim() || !onSubmit || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ type, complexity, brief });
      setBrief('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <h3 className="font-cinzel text-lg text-white">
        Commission {luminorName}
      </h3>
      <p className="mt-1 text-sm text-white/40">
        Describe what you need. The Luminor will create it for you.
      </p>

      {/* Type selection */}
      <div className="mt-6">
        <label className="text-xs uppercase tracking-wider text-white/40">Creation Type</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(Object.entries(TYPE_CONFIG) as [CommissionType, typeof TYPE_CONFIG[CommissionType]][]).map(
            ([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                    type === key
                      ? 'border-white/30 bg-white/10 text-white'
                      : 'border-white/5 bg-white/5 text-white/40 hover:border-white/15'
                  }`}
                >
                  <Icon className="h-4 w-4" style={{ color: config.color }} />
                  {config.label}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Complexity selection */}
      <div className="mt-4">
        <label className="text-xs uppercase tracking-wider text-white/40">Complexity</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(Object.entries(COMPLEXITY_CONFIG) as [CommissionComplexity, typeof COMPLEXITY_CONFIG[CommissionComplexity]][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => setComplexity(key)}
                className={`rounded-lg border px-3 py-2 text-left transition-all ${
                  complexity === key
                    ? 'border-amber-500/40 bg-amber-900/20 text-white'
                    : 'border-white/5 bg-white/5 text-white/40 hover:border-white/15'
                }`}
              >
                <p className="text-sm font-medium">{config.label}</p>
                <p className="text-xs text-white/30">{config.description}</p>
              </button>
            )
          )}
        </div>
      </div>

      {/* Brief */}
      <div className="mt-4">
        <label className="text-xs uppercase tracking-wider text-white/40">Your Brief</label>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Describe what you want the Luminor to create..."
          rows={3}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
        />
      </div>

      {/* Price estimate */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
        <div>
          <p className="text-xs text-white/40">Commission Cost</p>
          <p className="font-cinzel text-xl text-amber-200">
            {pricing.price} <span className="text-sm text-amber-300/60">Mana</span>
          </p>
        </div>
        <div className="text-right text-xs text-white/30">
          <p>Creator receives: {pricing.creatorEarnings} Mana (80%)</p>
          <p>Platform tithe: {pricing.platformFee} Mana (20%)</p>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!brief.trim() || submitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-cinzel text-sm font-medium text-white transition-all hover:from-amber-500 hover:to-orange-500 disabled:opacity-40"
      >
        <Sparkle className="h-5 w-5" weight="fill" />
        {submitting ? 'Commissioning...' : 'Commission this Luminor'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Display a commission's status */
export function CommissionStatusCard({ commission }: { commission: LuminorCommission }) {
  const statusInfo = STATUS_DISPLAY[commission.status] || STATUS_DISPLAY.requested;
  const Icon = statusInfo.icon;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" style={{ color: statusInfo.color }} weight="fill" />
          <span className="text-sm font-medium" style={{ color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>
        <span className="font-cinzel text-sm text-amber-200">{commission.price} Mana</span>
      </div>
      <p className="mt-2 text-sm text-white/60">{commission.brief}</p>
      <p className="mt-1 text-xs text-white/30">
        {new Date(commission.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

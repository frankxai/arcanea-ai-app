'use client';

import { useState } from 'react';
import {
  Scroll, Lightning, Clock, ArrowRight, Sparkle,
  MusicNotes, Palette, PencilLine, Code, Globe, BookOpen,
  Plus,
} from '@/lib/phosphor-icons';
import type { ArcaneBounty, CommissionType } from '@/lib/types/commerce';
import { BOUNTY_MIN_REWARD, BOUNTY_MAX_REWARD } from '@/lib/commerce/pricing';

const TYPE_ICONS: Record<CommissionType, React.ElementType> = {
  song: MusicNotes,
  art: Palette,
  story: PencilLine,
  code: Code,
  world: Globe,
  'prompt-book': BookOpen,
};

const STATUS_COLORS: Record<string, string> = {
  open: '#34d399',
  claimed: '#f59e0b',
  submitted: '#a78bfa',
  completed: '#10b981',
  expired: '#6b7280',
  cancelled: '#ef4444',
};

interface QuestBoardProps {
  bounties: ArcaneBounty[];
  onClaim?: (bountyId: string) => Promise<void>;
  onPostQuest?: () => void;
}

export function QuestBoard({ bounties, onClaim, onPostQuest }: QuestBoardProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scroll className="h-7 w-7 text-amber-400" weight="duotone" />
          <div>
            <h3 className="font-cinzel text-xl text-white">Quest Board</h3>
            <p className="text-sm text-white/40">
              {bounties.filter((b) => b.status === 'open').length} open quests
            </p>
          </div>
        </div>
        {onPostQuest && (
          <button
            onClick={onPostQuest}
            className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-900/20 px-4 py-2 text-sm text-amber-200 transition-all hover:bg-amber-900/40"
          >
            <Plus className="h-4 w-4" />
            Post a Quest
          </button>
        )}
      </div>

      {/* Bounty list */}
      {bounties.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
          <Scroll className="mx-auto h-12 w-12 text-white/20" weight="duotone" />
          <p className="mt-4 font-cinzel text-lg text-white/40">The Quest Board is empty</p>
          <p className="mt-1 text-sm text-white/20">Be the first to post a quest.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {bounties.map((bounty) => (
            <BountyCard key={bounty.id} bounty={bounty} onClaim={onClaim} />
          ))}
        </div>
      )}
    </div>
  );
}

function BountyCard({
  bounty,
  onClaim,
}: {
  bounty: ArcaneBounty;
  onClaim?: (bountyId: string) => Promise<void>;
}) {
  const [claiming, setClaiming] = useState(false);
  const TypeIcon = TYPE_ICONS[bounty.type] || Sparkle;
  const statusColor = STATUS_COLORS[bounty.status] || '#6b7280';
  const isExpired = new Date(bounty.deadline) < new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(bounty.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  async function handleClaim() {
    if (!onClaim || claiming) return;
    setClaiming(true);
    try {
      await onClaim(bounty.id);
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="group rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm transition-all hover:border-amber-500/20">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
            <TypeIcon className="h-5 w-5 text-white/60" weight="duotone" />
          </div>
          <div>
            <h4 className="font-medium text-white">{bounty.title}</h4>
            <p className="mt-0.5 line-clamp-2 text-sm text-white/40">{bounty.description}</p>
          </div>
        </div>

        {/* Reward badge */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1">
            <Sparkle className="h-3.5 w-3.5 text-amber-400" weight="fill" />
            <span className="font-cinzel text-sm font-bold text-amber-200">
              {bounty.reward.toLocaleString()}
            </span>
          </div>
          <span className="text-xs capitalize" style={{ color: statusColor }}>
            {bounty.status}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {isExpired ? 'Expired' : `${daysLeft}d left`}
          </span>
          {bounty.element && (
            <span className="rounded bg-white/5 px-1.5 py-0.5 capitalize">
              {bounty.element}
            </span>
          )}
        </div>

        {bounty.status === 'open' && !isExpired && onClaim && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="flex items-center gap-1 rounded-lg bg-emerald-600/80 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-emerald-500 disabled:opacity-40"
          >
            {claiming ? 'Claiming...' : 'Claim Quest'}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

/** Modal/form for posting a new quest */
interface PostQuestFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    type: CommissionType;
    reward: number;
    deadlineDays: number;
  }) => Promise<void>;
}

export function PostQuestForm({ onSubmit }: PostQuestFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CommissionType>('song');
  const [reward, setReward] = useState(100);
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ title, description, type, reward, deadlineDays });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-cinzel text-lg text-white">Post a Quest</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quest title..."
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/20 focus:border-amber-500/40 focus:outline-none"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what you need created..."
        rows={3}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber-500/40 focus:outline-none"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40">Reward (Mana)</label>
          <input
            type="number"
            value={reward}
            onChange={(e) => setReward(Math.max(BOUNTY_MIN_REWARD, parseInt(e.target.value) || 0))}
            min={BOUNTY_MIN_REWARD}
            max={BOUNTY_MAX_REWARD}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-white/40">Deadline (days)</label>
          <input
            type="number"
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={30}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!title.trim() || !description.trim() || submitting}
        className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-cinzel text-sm font-medium text-white transition-all hover:from-amber-500 hover:to-orange-500 disabled:opacity-40"
      >
        {submitting ? 'Posting...' : `Post Quest (${reward} Mana locked)`}
      </button>
    </div>
  );
}

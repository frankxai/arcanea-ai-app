'use client';

import { useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';

interface FeedbackItem {
  id: string;
  image: string;
  rating: number | null;
  tags: string[];
  note: string;
  timestamp: string;
}

const RATING_LABELS = ['Skip', 'Weak', 'OK', 'Good', 'Excellent', 'Favorite'];

const TAGS = [
  'Face Quality', 'Hair Silhouette', 'Sacred Gear', 'Starlight Mark',
  'Expression', 'Atmosphere', 'Color Palette', 'Crop Issue',
  'Eye Direction', 'Too Busy', 'Too Simple', 'Wrong Mood',
  'Premium Feel', 'Would Buy', 'Needs Work', 'Crown Jewel',
];

export default function FeedbackPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  const handleSubmit = () => {
    const item: FeedbackItem = {
      id: `creator-${String(currentIndex + 1).padStart(3, '0')}`,
      image: `#${currentIndex + 1}`,
      rating,
      tags: selectedTags,
      note,
      timestamp: new Date().toISOString(),
    };
    setFeedback([...feedback, item]);
    setSelectedTags([]);
    setNote('');
    setRating(null);
    setCurrentIndex(currentIndex + 1);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const exportFeedback = () => {
    const data = JSON.stringify(feedback, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nft-feedback-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b] text-white">
        <section className="px-6 pb-8 pt-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2dd4bf]/60">
                  Art Director Review
                </p>
                <h1 className="text-2xl font-bold">
                  The Creators #{String(currentIndex + 1).padStart(3, '0')}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/30">{feedback.length} reviewed</p>
                <button
                  onClick={exportFeedback}
                  className="mt-1 text-xs text-[#2dd4bf] hover:text-[#2dd4bf]/80"
                >
                  Export JSON
                </button>
              </div>
            </div>

            {/* Image placeholder — in production, load from IPFS or local */}
            <div className="mb-6 aspect-square w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-white/10">#{currentIndex + 1}</p>
                <p className="mt-2 text-sm text-white/20">
                  Load image from output/collection-v1/images/
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-white/50">Rating</p>
              <div className="flex gap-2">
                {RATING_LABELS.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setRating(i)}
                    className={`flex-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                      rating === i
                        ? i >= 4
                          ? 'border-[#ffd700]/50 bg-[#ffd700]/10 text-[#ffd700]'
                          : i >= 2
                            ? 'border-[#2dd4bf]/50 bg-[#2dd4bf]/10 text-[#2dd4bf]'
                            : 'border-red-500/50 bg-red-500/10 text-red-400'
                        : 'border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-white/50">Tags (what stands out)</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/30'
                        : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-white/50">Note (optional)</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What makes this piece work or not work..."
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#2dd4bf]/30 focus:outline-none"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setRating(0); handleSubmit(); }}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-6 py-2.5 text-sm text-white/40 hover:text-white/60"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === null}
                className="flex-1 rounded-lg bg-[#2dd4bf] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#2dd4bf]/90 disabled:opacity-30"
              >
                Submit & Next
              </button>
            </div>

            {/* Summary stats */}
            {feedback.length > 0 && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <h3 className="mb-3 text-sm font-semibold text-white/50">Review Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#2dd4bf]">{feedback.length}</p>
                    <p className="text-xs text-white/30">Reviewed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#ffd700]">
                      {feedback.filter(f => f.rating && f.rating >= 4).length}
                    </p>
                    <p className="text-xs text-white/30">Excellent+</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white/50">
                      {feedback.length > 0
                        ? (feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length).toFixed(1)
                        : '—'}
                    </p>
                    <p className="text-xs text-white/30">Avg Rating</p>
                  </div>
                </div>

                {/* Top tags */}
                <div className="mt-4">
                  <p className="mb-2 text-xs text-white/30">Most tagged:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(
                      feedback.flatMap(f => f.tags).reduce((acc: Record<string, number>, tag) => {
                        acc[tag] = (acc[tag] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([tag, count]) => (
                        <span key={tag} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/40">
                          {tag} ({count})
                        </span>
                      ))}
                  </div>
                </div>
              </m.div>
            )}
          </div>
        </section>

        <div className="pb-12 text-center">
          <Link href="/forge/collection" className="text-sm text-white/30 hover:text-white/50 transition-colors">
            Back to Collection
          </Link>
        </div>
      </div>
    </LazyMotion>
  );
}

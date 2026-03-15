'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Book, PencilSimple, Cpu, Rocket, ChartBar, ArrowRight, CheckCircle,
  Lightning, Brain, Shield, Database, Upload, Download, Users, TrendUp,
  Sparkle, Play,
} from '@/lib/phosphor-icons';

// ─── Types & Mock Data ────────────────────────────────────────────────────

type Chamber = 'writing' | 'agents' | 'pipeline' | 'analytics';

const PROJECTS = [
  { id: '1', title: 'The First Dawn', chapters: 14, totalChapters: 20, wordCount: 47_320, completion: 70, lastEdited: '2h ago' },
  { id: '2', title: 'Chronicles of the Starweave', chapters: 8, totalChapters: 12, wordCount: 28_100, completion: 67, lastEdited: '1d ago' },
  { id: '3', title: 'Meditations on Void and Spirit', chapters: 5, totalChapters: 5, wordCount: 12_400, completion: 100, lastEdited: '3d ago' },
];

const AGENTS = [
  { name: 'Calliope', role: 'Story Architect', status: 'active' as const, task: 'Plotting Ch.15 arc structure', costToday: '$0.12' },
  { name: 'Orpheus', role: 'Voice & Tone', status: 'active' as const, task: 'Refining narrator voice for Part III', costToday: '$0.08' },
  { name: 'Mnemosyne', role: 'Memory & Canon', status: 'idle' as const, task: 'Waiting for new chapter content', costToday: '$0.02' },
  { name: 'Momus', role: 'Critical Review', status: 'paused' as const, task: 'Queued: review Ch.12-14', costToday: '$0.00' },
  { name: 'Thoth', role: 'Quality Gate', status: 'idle' as const, task: 'Ready for pre-publish scan', costToday: '$0.01' },
];

const PIPELINE_STAGES = ['Draft', 'Edit', 'Format', 'Upload', 'Live'];
const PIPELINE_BOOKS = [
  { title: 'The First Dawn', stage: 2 },
  { title: 'Chronicles of the Starweave', stage: 1 },
  { title: 'Meditations on Void and Spirit', stage: 4 },
];

const RECENT_ACTIONS = [
  { text: 'Wrote 1,240 words in Ch.14', time: '2h ago', icon: PencilSimple },
  { text: 'Calliope suggested plot twist for Ch.15', time: '3h ago', icon: Brain },
  { text: 'Canon check passed (98.7%)', time: '5h ago', icon: Shield },
  { text: 'Exported EPUB: Meditations on Void and Spirit', time: '1d ago', icon: Download },
  { text: 'Orpheus voice analysis complete', time: '1d ago', icon: CheckCircle },
];

const CHAMBERS: { key: Chamber; label: string; icon: typeof Book }[] = [
  { key: 'writing', label: 'Writing', icon: Book },
  { key: 'agents', label: 'Agent Team', icon: Cpu },
  { key: 'pipeline', label: 'Publishing', icon: Rocket },
  { key: 'analytics', label: 'Analytics', icon: ChartBar },
];

// ─── Shared Components ────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md ${className}`}>{children}</div>;
}

function Bar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-[#00bcd4] to-[#00bcd4]/60 transition-all duration-500" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

const STATUS_COLORS = { active: 'bg-emerald-400 shadow-emerald-400/50', idle: 'bg-amber-400 shadow-amber-400/50', paused: 'bg-white/20' };

// ─── Chamber 1: Writing ───────────────────────────────────────────────────

function WritingChamber() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {PROJECTS.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <h3 className="font-display text-base text-white truncate">{p.title}</h3>
                <p className="font-sans text-xs text-white/40 mt-0.5">
                  {p.chapters}/{p.totalChapters} chapters &middot; {p.wordCount.toLocaleString()} words &middot; edited {p.lastEdited}
                </p>
              </div>
              <span className={`text-xs font-sans font-medium px-2 py-1 rounded-lg flex-shrink-0 ${p.completion === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#00bcd4]/10 text-[#00bcd4]'}`}>
                {p.completion}%
              </span>
            </div>
            <Bar value={p.completion} />
            {p.completion < 100 && (
              <div className="flex gap-2 mt-4">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00bcd4]/20 text-[#00bcd4] text-xs font-sans font-medium hover:bg-[#00bcd4]/5 transition-colors">
                  <Play size={12} weight="fill" /> Continue Writing
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 text-xs font-sans font-medium hover:bg-white/[0.04] transition-colors">
                  <Lightning size={12} weight="duotone" /> Run Revision
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white text-sm font-sans font-medium hover:shadow-lg hover:shadow-[#00bcd4]/20 transition-all">
              <PencilSimple size={16} weight="bold" /> New Chapter
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.08] text-white/60 text-sm font-sans font-medium hover:bg-white/[0.04] transition-colors">
              <Brain size={16} weight="duotone" /> Ask Calliope
            </button>
          </div>
        </Card>
        <Card className="p-5 space-y-3">
          <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Recent Activity</h3>
          <div className="space-y-2.5">
            {RECENT_ACTIONS.map((a, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <a.icon size={14} weight="duotone" className="text-[#00bcd4] flex-shrink-0" />
                <span className="font-sans text-xs text-white/60 truncate">{a.text}</span>
                <span className="font-sans text-[10px] text-white/25 flex-shrink-0 ml-auto">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Chamber 2: Agent Team ────────────────────────────────────────────────

function AgentTeamChamber() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((a) => (
          <Card key={a.name} className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00bcd4]/10 to-[#0d47a1]/10 border border-white/[0.06] flex items-center justify-center">
                <Cpu size={20} weight="duotone" className="text-[#00bcd4]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm text-white">{a.name}</h3>
                  <span className={`inline-block w-2 h-2 rounded-full shadow-sm ${STATUS_COLORS[a.status]}`} />
                </div>
                <p className="font-sans text-[11px] text-white/40">{a.role}</p>
              </div>
            </div>
            <p className="font-sans text-xs text-white/50 leading-relaxed">{a.task}</p>
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <span className="font-sans text-[11px] text-white/30 capitalize">{a.status}</span>
              <span className="font-sans text-[11px] text-white/30">Cost: {a.costToday}</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Database size={16} weight="duotone" className="text-[#00bcd4]" />
            <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Memory Health</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: 'Chunks', value: '2,341' }, { label: 'Index Size', value: '14.2 MB' }, { label: 'Last Sync', value: '12m ago' }].map((m) => (
              <div key={m.label} className="text-center">
                <p className="font-sans text-sm font-semibold text-white">{m.value}</p>
                <p className="font-sans text-[10px] text-white/30">{m.label}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={16} weight="duotone" className="text-emerald-400" />
            <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Quality Score</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: 'Anti-slop Rate', value: '99.2%' }, { label: 'Canon Compliance', value: '98.7%' }].map((q) => (
              <div key={q.label} className="text-center">
                <p className="font-sans text-sm font-semibold text-emerald-400">{q.value}</p>
                <p className="font-sans text-[10px] text-white/30">{q.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Chamber 3: Publishing Pipeline ───────────────────────────────────────

function PublishingChamber() {
  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-5">
        <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Pipeline Status</h3>
        {PIPELINE_BOOKS.map((book) => (
          <div key={book.title} className="space-y-2">
            <p className="font-sans text-sm text-white/80">{book.title}</p>
            <div className="flex gap-1">
              {PIPELINE_STAGES.map((stage, i) => (
                <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-2 rounded-full transition-colors ${i <= book.stage ? (i === book.stage ? 'bg-[#00bcd4] shadow-sm shadow-[#00bcd4]/30' : 'bg-[#00bcd4]/40') : 'bg-white/[0.06]'}`} />
                  <span className={`font-sans text-[10px] ${i <= book.stage ? 'text-white/50' : 'text-white/20'}`}>{stage}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Quick Export</h3>
          <div className="flex flex-wrap gap-2">
            {[{ label: 'Export EPUB', icon: Download }, { label: 'Export PDF', icon: Download }, { label: 'Generate Social', icon: Sparkle }].map((btn) => (
              <button key={btn.label} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] text-white/60 text-xs font-sans font-medium hover:bg-white/[0.04] hover:text-white/80 transition-colors">
                <btn.icon size={14} weight="duotone" /> {btn.label}
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5 space-y-3">
          <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Platforms</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Amazon KDP', 'Apple Books', 'Substack', 'Ghost'].map((p) => (
              <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <Upload size={14} weight="duotone" className="text-white/30" />
                <span className="font-sans text-xs text-white/50">{p}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Chamber 4: Analytics ─────────────────────────────────────────────────

const WEEKLY_WORDS = [
  { day: 'Mon', count: 1200 }, { day: 'Tue', count: 800 }, { day: 'Wed', count: 1800 },
  { day: 'Thu', count: 600 }, { day: 'Fri', count: 2400 }, { day: 'Sat', count: 1100 }, { day: 'Sun', count: 1400 },
];
const MAX_WORDS = Math.max(...WEEKLY_WORDS.map((d) => d.count));

const REVIEWS = [
  { reader: 'Aelindra', rating: 5, text: 'The Void meditation chapter changed how I think about creative blocks.' },
  { reader: 'KairosWalker', rating: 4, text: 'Beautiful prose. The Starweave passages feel genuinely transcendent.' },
  { reader: 'NeroStudent', rating: 5, text: 'Finally a framework that treats darkness as potential, not evil.' },
];

function AnalyticsChamber() {
  const stats = [
    { label: 'Total Words', value: '87,820', icon: PencilSimple, cls: 'text-[#00bcd4] bg-[#00bcd4]/10' },
    { label: 'Published', value: '1 book', icon: Book, cls: 'text-emerald-400 bg-emerald-400/10' },
    { label: 'Revenue', value: '$142.30', icon: TrendUp, cls: 'text-[#ffd700] bg-[#ffd700]/10' },
    { label: 'Readers', value: '284', icon: Users, cls: 'text-amber-400 bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, cls }) => (
          <Card key={label} className="p-5 space-y-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls.split(' ')[1]}`}>
              <Icon size={22} weight="duotone" className={cls.split(' ')[0]} />
            </div>
            <div>
              <p className="font-sans text-lg font-semibold text-white">{value}</p>
              <p className="font-sans text-sm text-white/40">{label}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-5 space-y-4">
        <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Words This Week</h3>
        <div className="flex items-end gap-2 h-32">
          {WEEKLY_WORDS.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end h-24">
                <div className="w-full rounded-t-md bg-gradient-to-t from-[#00bcd4]/60 to-[#00bcd4] transition-all" style={{ height: `${(d.count / MAX_WORDS) * 100}%` }} />
              </div>
              <span className="font-sans text-[10px] text-white/30">{d.day}</span>
              <span className="font-sans text-[10px] text-white/40">{(d.count / 1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 space-y-3">
        <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">Recent Reviews</h3>
        <div className="space-y-3">
          {REVIEWS.map((r, i) => (
            <div key={i} className="flex gap-3 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00bcd4]/20 to-[#0d47a1]/20 flex items-center justify-center flex-shrink-0">
                <Users size={14} className="text-[#00bcd4]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs text-white/70 font-medium">{r.reader}</span>
                  <span className="font-sans text-[10px] text-[#ffd700]">{'*'.repeat(r.rating)}</span>
                </div>
                <p className="font-sans text-xs text-white/40 mt-0.5 leading-relaxed">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────

export default function AuthorStudioPage() {
  const [activeChamber, setActiveChamber] = useState<Chamber>('writing');
  const totalWords = PROJECTS.reduce((sum, p) => sum + p.wordCount, 0);
  const activeAgents = AGENTS.filter((a) => a.status === 'active').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-white/30">
          <Link href="/studio" className="font-sans text-sm hover:text-white/50 transition-colors">Studio</Link>
          <ArrowRight size={12} />
          <span className="font-sans text-sm text-white/50">Author</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl">
          <span className="bg-gradient-to-r from-[#00bcd4] via-[#00bcd4]/80 to-[#0d47a1] bg-clip-text text-transparent">Author Studio</span>
        </h1>
        <p className="font-body text-white/50 text-lg">
          {totalWords.toLocaleString()} words across {PROJECTS.length} projects &middot; {activeAgents} agent{activeAgents !== 1 ? 's' : ''} active
        </p>
      </header>

      <nav className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-x-auto">
        {CHAMBERS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveChamber(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-all whitespace-nowrap ${
              activeChamber === key
                ? 'bg-[#00bcd4]/10 text-[#00bcd4] border border-[#00bcd4]/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            <Icon size={18} weight={activeChamber === key ? 'fill' : 'duotone'} />
            {label}
          </button>
        ))}
      </nav>

      <div>
        {activeChamber === 'writing' && <WritingChamber />}
        {activeChamber === 'agents' && <AgentTeamChamber />}
        {activeChamber === 'pipeline' && <PublishingChamber />}
        {activeChamber === 'analytics' && <AnalyticsChamber />}
      </div>
    </div>
  );
}

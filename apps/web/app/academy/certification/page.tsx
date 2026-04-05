import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Agent Certification | Arcanea Academy',
  description: 'Earn certifications through the Ten Gates. For humans and AI agents. Prove mastery, unlock capabilities, join the marketplace.',
  openGraph: {
    title: 'Agent Certification — Arcanea Academy',
    description: 'The first certification system designed for both humans and AI agents. Ten Gates. Ten levels of mastery.',
  },
};

const GATES = [
  { n: 1, name: 'Foundation', domain: 'Basics', skills: ['File operations', 'Git workflow', 'Project structure', 'Environment setup'], color: '#00bcd4', humanSkill: 'Set up a creative workspace', agentSkill: 'Initialize a project from template' },
  { n: 2, name: 'Flow', domain: 'Creativity', skills: ['Prompt engineering', 'Style transfer', 'Creative writing', 'Ideation'], color: '#00bcd4', humanSkill: 'Write a compelling story opening', agentSkill: 'Generate 5 distinct creative variations' },
  { n: 3, name: 'Fire', domain: 'Power', skills: ['Multi-agent orchestration', 'Swarm patterns', 'Parallel execution', 'Error recovery'], color: '#ff6b35', humanSkill: 'Lead a multi-agent coding sprint', agentSkill: 'Coordinate 3+ agents to complete a feature' },
  { n: 4, name: 'Heart', domain: 'Empathy', skills: ['User intent parsing', 'Error messages', 'Accessibility', 'Inclusive design'], color: '#f472b6', humanSkill: 'Design for users with disabilities', agentSkill: 'Generate WCAG-compliant UI components' },
  { n: 5, name: 'Voice', domain: 'Expression', skills: ['Documentation', 'Commit messages', 'API design', 'Technical writing'], color: '#06b6d4', humanSkill: 'Write documentation that teaches', agentSkill: 'Generate comprehensive API docs from code' },
  { n: 6, name: 'Sight', domain: 'Vision', skills: ['Architecture', 'System design', 'Performance analysis', 'Code review'], color: '#a78bfa', humanSkill: 'Design a scalable system architecture', agentSkill: 'Identify and fix performance bottlenecks' },
  { n: 7, name: 'Crown', domain: 'Mastery', skills: ['Performance optimization', 'Security hardening', 'Advanced patterns', 'Mentoring'], color: '#ffd700', humanSkill: 'Optimize a page to 95+ Lighthouse', agentSkill: 'Reduce bundle size by 50%+ through analysis' },
  { n: 8, name: 'Starweave', domain: 'Perspective', skills: ['Multi-model routing', 'Evaluation design', 'A/B testing', 'Meta-cognition'], color: '#c084fc', humanSkill: 'Design an agent evaluation rubric', agentSkill: 'Self-evaluate and improve own output' },
  { n: 9, name: 'Unity', domain: 'Collaboration', skills: ['Team coordination', 'PR review', 'Conflict resolution', 'Knowledge sharing'], color: '#60a5fa', humanSkill: 'Run a productive code review session', agentSkill: 'Merge 5 agent outputs into coherent result' },
  { n: 10, name: 'Source', domain: 'Meta', skills: ['Self-improvement', 'Teaching others', 'Framework design', 'Ecosystem thinking'], color: '#ffffff', humanSkill: 'Create a skill that others adopt', agentSkill: 'Train a new agent to pass Gate 3' },
];

const RANKS = [
  { range: '0-2', rank: 'Apprentice', color: '#6b7280', badge: 'Seeker' },
  { range: '3-4', rank: 'Mage', color: '#60a5fa', badge: 'Builder' },
  { range: '5-6', rank: 'Master', color: '#a78bfa', badge: 'Architect' },
  { range: '7-8', rank: 'Archmage', color: '#f59e0b', badge: 'Visionary' },
  { range: '9-10', rank: 'Luminor', color: '#ffd700', badge: 'Luminor' },
];

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-24">
        {/* Hero */}
        <section className="text-center mb-16 pt-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#00bcd4] mb-4">
            Arcanea Academy
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-white/90 to-[#00bcd4]/80 bg-clip-text text-transparent">
              Agent Certification
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            The first certification system designed for both humans and AI agents.
            Ten Gates. Ten levels of mastery. Prove your capability, unlock the marketplace.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-xl font-display font-semibold text-white/80 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Challenge', desc: 'Complete practical challenges for each Gate. Agents submit code. Humans submit projects.' },
              { step: '2', title: 'Evaluate', desc: 'Automated rubrics score your output on 5 dimensions: correctness, completeness, quality, efficiency, safety.' },
              { step: '3', title: 'Certify', desc: 'Pass the Gate threshold (7.5/10) to earn your badge. Badges unlock marketplace listing and premium features.' },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.06] p-6 hover:border-[#00bcd4]/20 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00bcd4]/10 text-[#00bcd4] text-sm font-bold flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-white/80 mb-2">{item.title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Ten Gates */}
        <section className="mb-16">
          <h2 className="text-xl font-display font-semibold text-white/80 mb-6">The Ten Gates</h2>
          <div className="space-y-3">
            {GATES.map((gate) => (
              <div
                key={gate.n}
                className="group rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  {/* Gate number */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: `${gate.color}15`, color: gate.color }}
                  >
                    {gate.n}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white/80">{gate.name}</h3>
                      <span className="text-[10px] text-white/25 px-1.5 py-0.5 rounded bg-white/[0.04]">{gate.domain}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {gate.skills.map((skill) => (
                        <span key={skill} className="text-[10px] text-white/30 px-2 py-0.5 rounded-full border border-white/[0.06]">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Dual track */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="rounded-lg bg-white/[0.02] px-3 py-2">
                        <span className="text-[9px] uppercase tracking-wider text-white/20 block mb-0.5">Human Challenge</span>
                        <span className="text-[11px] text-white/50">{gate.humanSkill}</span>
                      </div>
                      <div className="rounded-lg bg-[#00bcd4]/[0.03] px-3 py-2">
                        <span className="text-[9px] uppercase tracking-wider text-[#00bcd4]/40 block mb-0.5">Agent Challenge</span>
                        <span className="text-[11px] text-[#00bcd4]/60">{gate.agentSkill}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ranks */}
        <section className="mb-16">
          <h2 className="text-xl font-display font-semibold text-white/80 mb-6">Ranks</h2>
          <div className="flex flex-wrap gap-3">
            {RANKS.map((rank) => (
              <div
                key={rank.rank}
                className="rounded-xl border border-white/[0.06] px-5 py-4 text-center min-w-[140px]"
                style={{ borderColor: `${rank.color}30` }}
              >
                <div className="text-2xl font-display font-bold mb-1" style={{ color: rank.color }}>
                  {rank.rank}
                </div>
                <div className="text-[11px] text-white/25">Gates {rank.range}</div>
                <div className="text-[10px] mt-2 px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: `${rank.color}15`, color: rank.color }}>
                  {rank.badge}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="rounded-2xl bg-gradient-to-br from-[#00bcd4]/10 via-[#0d47a1]/5 to-[#00897b]/10 border border-[#00bcd4]/15 p-8">
            <h2 className="text-xl font-display font-semibold text-white/80 mb-3">
              Ready to Begin?
            </h2>
            <p className="text-sm text-white/35 mb-6 max-w-md mx-auto">
              Start your journey through the Ten Gates. Whether you are a human creator or an AI agent, the path to mastery begins here.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/academy/gates"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00897b] text-white text-sm font-medium hover:shadow-[0_0_24px_rgba(0,188,212,0.3)] transition-all"
              >
                Explore the Gates
              </Link>
              <Link
                href="/chat"
                className="px-6 py-2.5 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium hover:border-white/[0.15] hover:text-white/70 transition-all"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

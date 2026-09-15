"use client";

import { motion } from "framer-motion";

const mockAgents = [
  {
    id: "session-128a",
    name: "Draconia",
    court: "Fire",
    role: "Performance Engineer",
    task: "Optimizing Next.js chunk boundaries",
    status: "Working",
    burnRate: "120 t/s",
    drift: "0.02",
    repo: "arcanea-ai-app",
    branch: "draconia-perf-chunk-128",
    color: "text-fire",
    bgColor: "bg-fire/10",
    borderColor: "border-fire/30",
  },
  {
    id: "session-129b",
    name: "Lyssandria",
    court: "Earth",
    role: "Architecture Lead",
    task: "Scaffolding Swarm Cockpit Dashboard",
    status: "Planning",
    burnRate: "45 t/s",
    drift: "0.00",
    repo: "arcanea-ai-app",
    branch: "lyss-agenthub-dashboard",
    color: "text-earth",
    bgColor: "bg-earth/10",
    borderColor: "border-earth/30",
  },
  {
    id: "session-130c",
    name: "Alera",
    court: "Voice",
    role: "Narrative Designer",
    task: "Generating release notes for v3.0",
    status: "Review",
    burnRate: "80 t/s",
    drift: "0.15",
    repo: "arcanea-lore",
    branch: "alera-v3-release-notes",
    color: "text-brand-secondary",
    bgColor: "bg-brand-secondary/10",
    borderColor: "border-brand-secondary/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function SwarmCockpit() {
  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <MetricCard title="Active Swarms" value="3" trend="+1" />
        <MetricCard title="Token Burn Rate" value="245 t/s" trend="~" />
        <MetricCard title="Global Drift" value="0.05" trend="-0.02" isGood />
        <MetricCard title="Tmux Sessions" value="12" trend="Stable" />
      </div>

      {/* Agents Grid */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <h2 className="text-lg font-display text-white tracking-wide">Active Agent Sessions</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-8 pr-2"
        >
          {mockAgents.map((agent) => (
            <motion.div key={agent.id} variants={itemVariants}>
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, isGood }: { title: string, value: string, trend: string, isGood?: boolean }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-display font-bold text-white">{value}</div>
        <div className={`text-sm font-medium ${isGood ? 'text-success' : 'text-brand-primary'}`}>{trend}</div>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: any }) {
  return (
    <div className={`glass-card p-6 flex flex-col h-full border ${agent.borderColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg ${agent.bgColor} ${agent.color}`}>
            {agent.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display font-semibold text-white tracking-wide">{agent.name}</h3>
            <div className={`text-xs uppercase tracking-wider font-medium ${agent.color}`}>{agent.court} Court • {agent.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cosmic-raised border border-white/5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agent.status === 'Working' ? 'bg-success' : 'bg-warning'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${agent.status === 'Working' ? 'bg-success' : 'bg-warning'}`}></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">{agent.status}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Current Task</div>
          <div className="text-sm text-text-primary line-clamp-2">{agent.task}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-cosmic-void/50 border border-white/5">
            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Git Branch</div>
            <div className="text-xs font-mono text-brand-secondary truncate" title={agent.branch}>{agent.branch}</div>
          </div>
          <div className="p-3 rounded-lg bg-cosmic-void/50 border border-white/5">
            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Repository</div>
            <div className="text-xs font-mono text-text-secondary truncate">{agent.repo}</div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2 text-text-muted">
          <span className="font-mono">Burn:</span>
          <span className="text-text-primary font-medium">{agent.burnRate}</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <span className="font-mono">Drift:</span>
          <span className={`${parseFloat(agent.drift) > 0.1 ? 'text-warning' : 'text-success'} font-medium`}>{agent.drift}</span>
        </div>
        <div className="text-text-muted font-mono">{agent.id}</div>
      </div>
    </div>
  );
}

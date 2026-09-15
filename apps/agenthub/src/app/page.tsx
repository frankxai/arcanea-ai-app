import { Metadata } from "next";
import { SwarmCockpit } from "@/components/swarm-cockpit";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Arcanea AgentHub",
  description: "The Nerve Center of the Arcanea civilization.",
};

import { AgentConstellation } from "@/components/constellation/AgentConstellation";

export default function AgentHubDashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center px-8 border-b border-white/5 backdrop-blur-md z-10 shrink-0">
          <h1 className="text-xl font-display font-medium tracking-wide text-brand-primary">
            Agent Constellation & Swarm Cockpit
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-active opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
              </span>
              <span className="text-xs font-mono text-brand-primary uppercase tracking-wider">
                Orchestrator Online
              </span>
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8 z-0 space-y-8">
          {/* 3D Agent Constellation */}
          <section className="h-[500px]">
            <AgentConstellation />
          </section>

          {/* Monitoring Dashboard */}
          <section>
            <SwarmCockpit />
          </section>
        </div>
      </main>
    </div>
  );
}

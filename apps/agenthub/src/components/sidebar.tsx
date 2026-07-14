"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { id: "cockpit", label: "Swarm Cockpit", icon: "⎈" },
  { id: "constellation", label: "Agent Constellation", icon: "✧" },
  { id: "forge", label: "Skill Forge", icon: "⚒" },
  { id: "gallery", label: "Template Gallery", icon: "❖" },
];

export function Sidebar() {
  const [activeId, setActiveId] = useState("cockpit");

  return (
    <aside className="w-64 shrink-0 glass-panel border-y-0 border-l-0 rounded-none flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-brand-primary font-display font-bold text-lg tracking-widest">
          <span className="text-xl">⬡</span>
          ARCANEA
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group text-sm font-medium ${
                isActive ? "text-white" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-brand-primary/10 border border-brand-primary/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className={`text-lg z-10 ${isActive ? "text-brand-primary" : "opacity-50 group-hover:opacity-100 transition-opacity"}`}>
                {item.icon}
              </span>
              <span className="z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="p-4 rounded-xl bg-cosmic-raised/30 border border-white/5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-text-muted">
            <span>Memory Node</span>
            <span className="text-success-light">Connected</span>
          </div>
          <div className="flex justify-between items-center text-xs text-text-muted">
            <span>Orchestrator</span>
            <span className="text-brand-primary">v3.0.1</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/lib/data/projects";
import { ProjectCard } from "@/components/site/nexus/project-card";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Agent", "Platform", "Experiment"];

export default function NexusPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredProjects = activeFilter === "All"
        ? PROJECTS
        : PROJECTS.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">

            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-6xl font-bold font-outfit tracking-tight mb-4">
                    THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-arcane-glow">NEXUS</span>
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Archive of deployed intelligences and experimental constructs.
                </p>
            </header>

            {/* Filter Bar */}
            <div className="flex justify-center mb-12">
                <div className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-full p-1 flex gap-1">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors z-10",
                                activeFilter === filter ? "text-white" : "text-gray-400 hover:text-white"
                            )}
                        >
                            {activeFilter === filter && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, idx) => (
                        <ProjectCard key={project.id} project={project} index={idx} />
                    ))}
                </AnimatePresence>
            </motion.div>

        </div>
    );
}

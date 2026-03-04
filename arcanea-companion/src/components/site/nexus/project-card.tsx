"use client";

import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";
import { Project } from "@/lib/data/projects";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative bg-surface/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:scale-[1.02]"
        >
            {/* Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-black relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-6xl select-none">
                    {project.title.substring(0, 2).toUpperCase()}
                </div>
                {/* Tech Badges */}
                <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1">
                    {project.tech.slice(0, 2).map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-gray-300 border border-white/10">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-arcane-glow uppercase tracking-wider">{project.category}</span>
                    <a href={project.link || "#"} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full">
                        <Icons.ArrowUpRight className="w-4 h-4 text-white" />
                    </a>
                </div>
                <h3 className="text-xl font-bold font-outfit text-white mb-2 group-hover:text-cyan transition-colors">{project.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                <div className="w-full h-px bg-white/5 group-hover:bg-gradient-to-r from-arcane/50 to-transparent transition-colors" />

                <div className="mt-4 flex items-center text-xs text-gray-500 font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    System.Active
                </div>
            </div>
        </motion.div>
    );
}

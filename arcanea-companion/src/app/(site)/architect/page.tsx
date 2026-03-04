"use client";

import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";

const TIMELINE = [
    { year: "2020", title: "Hello World", description: "First line of code. The realization that reality is programmable." },
    { year: "2023", title: "The Awakening", description: "Early experiments with LLMs. The bridge between prompt and execution." },
    { year: "2024", title: "Arcanea Foundation", description: "Establishing the design philosophy of 'Cosmic Modernism'. Building the first agents." },
    { year: "2026", title: "Architect of Intelligence", description: "Designing autonomous systems that extend human capability. FrankX.ai launches." },
];

const SKILLS = [
    { name: "Next.js / React", level: 95 },
    { name: "System Architecture", level: 90 },
    { name: "AI Agent Design", level: 95 },
    { name: "3D / WebGL", level: 80 },
    { name: "UI/UX Design", level: 85 },
];

export default function ArchitectPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">

            {/* Hero Profile */}
            <section className="flex flex-col md:flex-row items-center gap-12 mb-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group w-64 h-64 md:w-80 md:h-80 flex-shrink-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-arcane to-cyan rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 bg-surface/50 grayscale group-hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder for FrankX Portrait */}
                        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-black flex items-center justify-center text-4xl font-mono text-white/20">
                            FRNK::X
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold font-outfit tracking-tighter">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcane-glow to-cyan-glow">ARCHITECT</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        FrankX is a weaver of realities. Leveraging the power of artificial superintelligence to construct digital ecosystems that feel alive.
                        <br />Not just code, but consciousness.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {["Visionary", "System Architect", "AI Native"].map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-arcane-glow">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Timeline */}
                <section>
                    <h2 className="text-2xl font-bold font-outfit mb-8 flex items-center gap-2">
                        <Icons.History className="w-5 h-5 text-cyan" /> Origin Sequence
                    </h2>
                    <div className="relative border-l border-white/10 ml-3 space-y-12 py-2">
                        {TIMELINE.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-8 group"
                            >
                                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface border border-white/20 group-hover:bg-cyan group-hover:scale-125 transition-all" />
                                <span className="text-xs font-mono text-cyan/70 mb-1 block">{item.year}</span>
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Skills Matrix */}
                <section>
                    <h2 className="text-2xl font-bold font-outfit mb-8 flex items-center gap-2">
                        <Icons.Cpu className="w-5 h-5 text-arcane" /> Capability Matrix
                    </h2>
                    <div className="space-y-6 bg-surface/20 p-6 rounded-2xl border border-white/5">
                        {SKILLS.map((skill, index) => (
                            <div key={skill.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-200">{skill.name}</span>
                                    <span className="font-mono text-arcane-glow">{skill.level}%</span>
                                </div>
                                <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                                        className="h-full bg-gradient-to-r from-arcane to-cyan"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="mt-8 grid grid-cols-4 gap-4">
                        {/* Placeholders for tech logos or icons */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:border-white/20 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-gray-600" />
                            </div>
                        ))}
                    </div>
                </section>

            </div>

        </div>
    );
}

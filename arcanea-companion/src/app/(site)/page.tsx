"use client";

import Scene from "@/components/site/3d/scene";
import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";

export default function HomePage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {/* 3D Background */}
            <Scene />

            {/* Hero Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-arcane/30 bg-arcane/10 text-arcane-glow text-xs font-mono uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-arcane-glow animate-pulse" />
                        System Online /// 2026
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-2xl">
                        THE ARCHITECT<br />
                        OF INTELLIGENCE.
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                        FrankX builds autonomous systems that bridge human creativity and artificial superintelligence.
                        <br />From the Arcanea ecosystem to enterprise-grade AI agents.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <a
                            href="/companion"
                            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Enter The System <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </a>

                        <button className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                            <Icons.Play className="w-4 h-4 fill-current" /> View Blueprint
                        </button>
                    </div>
                </motion.div>

            </div>

            {/* Footer / Scroll hint */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce opacity-50">
                <Icons.ArrowDown className="w-6 h-6 text-white" />
            </div>

        </div>
    );
}

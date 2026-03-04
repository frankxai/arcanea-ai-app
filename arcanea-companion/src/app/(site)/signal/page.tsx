"use client";

import { motion } from "framer-motion";
import { ARTICLES } from "@/lib/data/articles";
import { Icons } from "@/components/ui/icons";

export default function SignalPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">

            <header className="mb-16 border-b border-white/5 pb-8">
                <h1 className="text-4xl font-bold font-outfit tracking-tight mb-2 flex items-center gap-3">
                    <Icons.Radio className="w-8 h-8 text-arcane" />
                    SIGNAL
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                    Transmissions from the edge of intelligence.
                </p>
            </header>

            <div className="space-y-12">
                {ARTICLES.map((article, i) => (
                    <motion.article
                        key={article.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group cursor-pointer"
                    >
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-2">
                            <span className="text-xs font-mono text-gray-500 min-w-[100px]">{article.date}</span>
                            <h2 className="text-2xl font-bold text-white group-hover:text-arcane-glow transition-colors">
                                {article.title}
                            </h2>
                        </div>

                        <div className="md:ml-[132px]">
                            <p className="text-gray-400 leading-relaxed mb-4 max-w-2xl">
                                {article.excerpt}
                            </p>
                            <div className="flex gap-2">
                                {article.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider text-cyan/70 border border-cyan/20 px-2 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

        </div>
    );
}

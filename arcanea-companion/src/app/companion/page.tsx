"use client";

import { useState } from "react";
import { TabSwitcher } from "@/components/companion/tab-switcher";
import { GalleryCard } from "@/components/imagine/gallery-card";
import { MOCK_GALLERY } from "@/lib/data/gallery";
import { Icons } from "@/components/ui/icons";
import ChatView from "@/components/chat/chat-view";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanionPage() {
    const [currentTab, setCurrentTab] = useState("imagine");
    const [prompt, setPrompt] = useState("");

    const renderImagine = () => (
        <div className="flex flex-col h-full">
            {/* Top Bar: Prompt & Filters */}
            <header className="sticky top-0 z-40 bg-void/80 backdrop-blur-xl border-b border-white/[0.05] p-4 pb-2">
                <div className="max-w-7xl mx-auto w-full space-y-4">
                    <h1 className="text-xl font-bold font-outfit tracking-tight flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcane-glow to-cyan-glow">ARCANEA</span>
                        <span className="text-white/50">///</span>
                        <span>IMAGINE</span>
                    </h1>
                    <a href="/protocol" className="text-xs text-arcane/70 hover:text-arcane-glow transition-colors ml-auto border border-arcane/20 px-3 py-1 rounded-full font-mono bg-arcane/5 hover:bg-arcane/10">
                        PROTOCOL ACCESS
                    </a>

                    {/* Prompt Input */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-arcane/20 to-cyan/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center bg-surface/50 border border-white/10 rounded-full px-4 py-3 shadow-xl focus-within:ring-2 focus-within:ring-arcane/50 focus-within:border-arcane transition-all">
                            <Icons.Sparkles className="w-5 h-5 text-arcane-glow mr-3" />
                            <input
                                type="text"
                                placeholder="Describe your vision..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 font-medium"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <button
                                className="ml-2 bg-white text-void font-bold px-4 py-1.5 rounded-full text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!prompt.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    {/* Filters / Tags */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {["All", "Guardian", "Godbeast", "Cosmic", "Lore", "Companion"].map((tag, i) => (
                            <button
                                key={tag}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${i === 0 ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Masonry Grid Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {MOCK_GALLERY.map((item, idx) => (
                            <GalleryCard key={item.id} item={item} index={idx} />
                        ))}
                        {/* Duplicate for demo density */}
                        {MOCK_GALLERY.map((item, idx) => (
                            <GalleryCard key={`${item.id}-dup`} item={{ ...item, id: `${item.id}-dup` }} index={idx + MOCK_GALLERY.length} />
                        ))}
                    </div>

                    <div className="h-20" /> {/* Bottom spacer for Fab/Mobile Nav */}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col relative">
            {/* Tab Content */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        {currentTab === "imagine" && renderImagine()}
                        {currentTab === "chat" && <ChatView />}
                        {currentTab === "studio" && <div className="h-full flex items-center justify-center text-gray-500">
                            <div className="text-center space-y-4">
                                <Icons.Studio className="w-12 h-12 mx-auto opacity-30" />
                                <p>Studio Module Coming Soon</p>
                            </div>
                        </div>}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Tab Switcher (Bottom Center) */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <TabSwitcher currentTab={currentTab} onTabChange={setCurrentTab} />
            </div>
        </div>
    );
}

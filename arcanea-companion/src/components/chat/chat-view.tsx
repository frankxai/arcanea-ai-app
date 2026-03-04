"use client";

import { useArcaneaChat } from "@/lib/hooks/use-arcanea-chat";
import { CHARACTERS } from "@/lib/data/characters";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function ChatView() {
    const { messages, input, setInput, sendMessage, isLoading, activeCharacter, switchCharacter } = useArcaneaChat();
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-void">

            {/* 1. Header: Active Character & Switcher Toggle */}
            <header className="sticky top-0 z-40 bg-void/80 backdrop-blur-xl border-b border-white/[0.05] p-3 flex items-center justify-between">
                <button
                    onClick={() => setIsSwitcherOpen(true)}
                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-white/5 transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br from-arcane/20 to-transparent border border-white/10 shadow-lg group-hover:scale-105 transition-transform" style={{ color: activeCharacter.color }}>
                        {activeCharacter.avatar}
                    </div>
                    <div className="text-left">
                        <h2 className="text-sm font-bold text-white leading-tight">{activeCharacter.name}</h2>
                        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{activeCharacter.title}</p>
                    </div>
                    <Icons.Zap className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors ml-1" />
                </button>

                <div className="flex gap-2">
                    {/* Quick Actions (e.g. Cleat/New Topic) */}
                    <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                        <Icons.More className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* 2. Message Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                {messages.map((m, i) => {
                    const isUser = m.role === "user";
                    return (
                        <motion.div
                            key={m.id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex w-full mb-4",
                                isUser ? "justify-end" : "justify-start"
                            )}
                        >
                            {!isUser && (
                                <div className="w-8 h-8 rounded-full flex-shrink-0 mr-3 bg-surface border border-white/5 flex items-center justify-center text-sm">
                                    {activeCharacter.avatar}
                                </div>
                            )}

                            <div className={cn(
                                "max-w-[85%] sm:max-w-[70%] p-4 text-sm leading-relaxed whitespace-pre-wrap",
                                isUser
                                    ? "bg-gradient-to-br from-arcane to-indigo-600 text-white rounded-[20px_20px_4px_20px] shadow-lg shadow-purple-900/20"
                                    : "bg-surface/60 border border-white/5 text-gray-100 rounded-[20px_20px_20px_4px]"
                            )}>
                                {m.content}
                            </div>
                        </motion.div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="ml-11 flex gap-1 items-center h-8">
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-arcane" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 rounded-full bg-arcane" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 rounded-full bg-arcane" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* 3. Input Area */}
            <div className="p-4 bg-void/80 backdrop-blur-xl border-t border-white/[0.05]">
                {/* Suggested Prompts */}
                {!isLoading && messages.length < 3 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                        {activeCharacter.quickActions.map((action) => (
                            <button
                                key={action}
                                onClick={() => sendMessage(action)}
                                className="whitespace-nowrap px-3 py-1.5 bg-surface/40 hover:bg-surface/80 border border-white/5 rounded-full text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                            >
                                <Icons.Sparkles className="w-3 h-3 text-arcane" />
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative flex items-center bg-surface border border-white/10 rounded-2xl px-4 py-3 shadow-2xl focus-within:ring-1 focus-within:border-arcane transition-all">
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Message ${activeCharacter.name}...`}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage(input);
                                setInput("");
                            }
                        }}
                    />
                    <div className="flex gap-2 ml-2 text-gray-400">
                        <button className="hover:text-white transition-colors"><Icons.Mic className="w-5 h-5" /></button>
                        <button
                            onClick={() => { sendMessage(input); setInput(""); }}
                            disabled={!input.trim() || isLoading}
                            className="bg-white text-black p-1.5 rounded-full disabled:opacity-50 hover:scale-105 transition-transform"
                        >
                            <Icons.Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Character Switcher Modal (Bottom Sheet Style) */}
            <AnimatePresence>
                {isSwitcherOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setIsSwitcherOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 left-0 right-0 bg-surface border-t border-white/10 p-6 rounded-t-[32px] z-50 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Icons.User className="w-5 h-5 text-arcane" /> Select Character
                            </h3>

                            <div className="grid gap-3">
                                {Object.values(CHARACTERS).map((char) => (
                                    <button
                                        key={char.id}
                                        onClick={() => { switchCharacter(char.id); setIsSwitcherOpen(false); }}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group hover:scale-[1.02]",
                                            activeCharacter.id === char.id
                                                ? "bg-white/5 border-arcane/50 shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                                                : "bg-surface/30 border-white/5 hover:bg-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-black/20" style={{ color: char.color }}>
                                            {char.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-white">{char.name}</span>
                                                {activeCharacter.id === char.id && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-1">{char.title}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

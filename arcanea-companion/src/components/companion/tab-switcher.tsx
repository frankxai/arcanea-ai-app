"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

interface Tab {
    id: string;
    label: string;
    icon: React.ElementType;
}

const TABS: Tab[] = [
    { id: "imagine", label: "Imagine", icon: Icons.Sparkles },
    { id: "chat", label: "Chat", icon: Icons.Chat },
    { id: "studio", label: "Studio", icon: Icons.Studio },
];

export function TabSwitcher({ currentTab, onTabChange }: { currentTab: string; onTabChange: (tab: string) => void }) {
    return (
        <div className="flex items-center justify-center p-1 bg-surface/50 backdrop-blur-xl border border-white/[0.05] rounded-full">
            {TABS.map((tab) => {
                const isActive = currentTab === tab.id;
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                            isActive ? "text-white" : "text-gray-400 hover:text-white"
                        )}
                    >
                        {isActive && (
                            <div className="absolute inset-0 bg-white/[0.1] rounded-full border border-white/[0.08] shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                        )}
                        <Icon className={cn("w-4 h-4", isActive && "text-arcane-glow")} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

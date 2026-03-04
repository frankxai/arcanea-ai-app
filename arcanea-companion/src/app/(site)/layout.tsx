"use client";

import "@/app/globals.css";
import { Outfit, Space_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

import { CustomCursor } from "@/components/ui/custom-cursor";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={cn(
            "min-h-screen bg-void text-white font-sans selection:bg-arcane selection:text-white",
            outfit.variable,
            spaceMono.variable,
            inter.variable
        )}>
            <CustomCursor />
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-void/50 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-arcane rounded-lg flex items-center justify-center font-bold text-xl">F</div>
                    <span className="font-outfit font-bold text-lg tracking-tight">FrankX.ai</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                    <a href="/architect" className="hover:text-white transition-colors">The Architect</a>
                    <a href="/nexus" className="hover:text-white transition-colors">Nexus</a>
                    <a href="/signal" className="hover:text-white transition-colors">Signal</a>
                </div>
                <a
                    href="/companion"
                    className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                >
                    Launch Arcanea
                </a>
            </nav>
            <main className="relative">
                {children}
            </main>
        </div>
    );
}

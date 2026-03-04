"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, cn } from "@/components/ui/button";

const NAV_ITEMS = [
    { name: "The Architect", href: "/architect" },
    { name: "Nexus", href: "/nexus" },
    { name: "Signal", href: "/signal" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-void/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-outfit font-bold text-xl tracking-tighter text-white hover:text-arcane transition-colors">
                    FRANKX<span className="text-arcane">.AI</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-white",
                                pathname === item.href ? "text-white" : "text-text-secondary"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/companion">
                        <Button variant="arcane" size="sm" className="hidden sm:inline-flex">
                            Launch Arcanea ✦
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

import {
  PhHouse,
  PhMagnifyingGlass,
  PhBookOpen,
} from "@/lib/phosphor-icons";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page does not exist. Find your way back to Arcanea.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      {/* Mascot — thinking variant, warm character on error page */}
      <div className="mb-4 relative">
        <Image
          src="/images/mascot/arcanea-thinking.png"
          alt="Arcanea thinking"
          width={200}
          height={200}
          className="object-contain drop-shadow-[0_0_30px_rgba(127,255,212,0.15)] animate-[mascot-float_4s_ease-in-out_infinite]"
          priority
        />
      </div>

      {/* 404 number — minimal, typographic */}
      <div className="text-center mb-10">
        <h1 className="text-[6rem] md:text-[8rem] font-display font-bold leading-none text-white/[0.04] select-none">
          404
        </h1>
      </div>

      {/* Book of Shadows quote — the hidden depth */}
      <div className="text-center mb-12 max-w-lg">
        <blockquote className="border-l-2 border-white/[0.12] pl-6 text-left">
          <p className="text-lg text-text-secondary italic leading-relaxed">
            "Not all who wander are lost, but some paths do end. This is one of them."
          </p>
          <footer className="mt-3 text-xs text-text-muted tracking-wide">
            — Book of Shadows, Fragment VII
          </footer>
        </blockquote>
      </div>

      {/* Navigation — clean, three options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
        <Link
          href="/"
          className="group flex flex-col items-center gap-2 p-5 rounded-xl border border-white/[0.06] hover:border-atlantean-teal-aqua/30 transition-all duration-300"
        >
          <PhHouse className="w-5 h-5 text-text-muted group-hover:text-atlantean-teal-aqua transition-colors" />
          <span className="text-sm text-text-secondary group-hover:text-white transition-colors">Home</span>
        </Link>

        <Link
          href="/discover"
          className="group flex flex-col items-center gap-2 p-5 rounded-xl border border-white/[0.06] hover:border-atlantean-teal-aqua/30 transition-all duration-300"
        >
          <PhMagnifyingGlass className="w-5 h-5 text-text-muted group-hover:text-atlantean-teal-aqua transition-colors" />
          <span className="text-sm text-text-secondary group-hover:text-white transition-colors">Discover</span>
        </Link>

        <Link
          href="/library"
          className="group flex flex-col items-center gap-2 p-5 rounded-xl border border-white/[0.06] hover:border-atlantean-teal-aqua/30 transition-all duration-300"
        >
          <PhBookOpen className="w-5 h-5 text-text-muted group-hover:text-atlantean-teal-aqua transition-colors" />
          <span className="text-sm text-text-secondary group-hover:text-white transition-colors">Library</span>
        </Link>
      </div>
    </div>
  );
}

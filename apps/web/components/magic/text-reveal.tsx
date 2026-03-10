"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <m.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="inline-block mr-2"
        >
          {word}
        </m.span>
      ))}
    </span>
  );
}

export function GradientText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-atlantean-teal via-cosmic-blue to-gold-bright bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

export function AuroraText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`relative ${className}`}
      style={{
        background: "linear-gradient(90deg, #00bcd4, #00bcd4, #ffd700, #00bcd4)",
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "aurora-shift 8s ease infinite",
      }}
    >
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aurora-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}} />
    </span>
  );
}

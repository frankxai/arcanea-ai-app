"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

const words = [
  "create?",
  "write?",
  "build?",
  "compose?",
  "design?",
  "imagine?",
];

export function HeroChangingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-flex justify-start min-w-[4.5em] overflow-hidden align-baseline">
      <AnimatePresence mode="wait">
        <m.span
          key={words[index]}
          initial={{ y: "110%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-110%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block bg-gradient-to-r from-[#00bcd4] via-[#4dd0e1] to-[#00897b] bg-clip-text text-transparent"
        >
          {words[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

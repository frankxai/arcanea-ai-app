"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Universe",
  "Story",
  "Characters",
  "Vision",
  "Legacy",
  "World",
];

export function HeroChangingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block min-w-[200px] text-left align-bottom overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block text-gradient-cosmic"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

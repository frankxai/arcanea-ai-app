"use client";

import React, { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useMouseStore } from "@/hooks/use-mouse-store";

export function GlobalGlowTracker() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const setMouse = useMouseStore((state) => state.setMouse);
  const setIsVisible = useMouseStore((state) => state.setIsVisible);
  const isVisibleStore = useMouseStore((state) => state.isVisible);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMouse(e.clientX, e.clientY);
      if (!isVisibleStore) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisibleStore, setMouse, setIsVisible]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisibleStore ? 1 : 0 }}
    >
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(0, 188, 212, 0.08) 0%, rgba(139, 92, 246, 0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </motion.div>
  );
}

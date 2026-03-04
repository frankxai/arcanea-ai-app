"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    // Smooth spring animation for the trailing circle
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);
        };

        const handleHoverStart = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === "A" || (e.target as HTMLElement).tagName === "BUTTON") {
                setIsHovering(true);
            }
        };

        const handleHoverEnd = () => {
            setIsHovering(false);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleHoverStart); // delegate

        // Better hover detection logic
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("a, button, [role='button']")) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-arcane/50 pointer-events-none z-[9999] mix-blend-screen hidden md:block" // Hidden on mobile
            style={{
                translateX: cursorX,
                translateY: cursorY,
                scale: isHovering ? 1.5 : 1,
                backgroundColor: isHovering ? "rgba(124, 58, 237, 0.1)" : "transparent",
            }}
        >
            <div className="absolute inset-0 bg-arcane-glow rounded-full blur-[2px] opacity-20" />
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
    );
}

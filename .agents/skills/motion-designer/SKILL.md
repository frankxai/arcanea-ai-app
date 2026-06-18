---
name: motion-designer
description: "Design and implement premium, high-end motion transitions (Framer Motion, CSS animations, React Three Fiber, GSAP) matching Arcanea's curatorial bar (TASTE.md). Use when adding page-load reveals, scroll choreographies, hover states, or spatial effects."
---

# Motion Designer Skill

This skill governs the execution of premium animations and motion states within the Arcanea ecosystem, ensuring compliance with the Motion Canon in `TASTE.md`.

## Easing Curves & Timing Standards

Timings and ease curves must never use library defaults. Always enforce the following parameters:

### Timings
- **Micro (150ms):** Button states, hover triggers, active switches.
- **Standard (300ms):** Slide-overs, tab panels, standard page reveals.
- **Dramatic (500ms):** Modal entries, dashboard showcases, hero components.
- **Cinematic (800ms+):** Main entry portals, ambient transition animations.

### Curves
- **Linear-style premium:** `[0.22, 1, 0.36, 1]` (Default transitions)
- **Apple expo-out:** `[0.16, 1, 0.3, 1]` (Hero entrance staggers)
- **Material standard:** `[0.4, 0, 0.2, 1]` (Accordions and dropdown controls)
- **Spring physics:** `stiffness: 260, damping: 20` (Physical drag or hover scale)

---

## Approved Design Patterns

### 1. Scroll-Linked choreography
Use `useScroll` and `useTransform` to bind visuals directly to the user's viewport progress:
```typescript
import { useScroll, useTransform, m } from "framer-motion";

const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});
const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
```

### 2. Staggered reveals
Always stagger lists to reveal incrementally rather than all at once:
```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};
```

### 3. Blur-To-Focus
Combine opacity with CSS filter blur to create organic reveals:
```typescript
const blurReveal = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 15 },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};
```

---

## Motion Anti-Patterns (Banned)

- **Do NOT** use `whileHover={{ scale: 1.05 }}` globally on all cards. It causes layout shifts. Use border, glow, or light-shift overlays instead.
- **Do NOT** animate `height: auto` without layout animation or spring stiffness.
- **Do NOT** load `domMax` for basic layouts. Use `LazyMotion` with `domAnimation` to preserve budget.

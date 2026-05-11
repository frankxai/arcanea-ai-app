/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { create } from "zustand";

interface MouseState {
  x: number;
  y: number;
  isVisible: boolean;
  setMouse: (x: number, y: number) => void;
  setIsVisible: (visible: boolean) => void;
}

export const useMouseStore = create<MouseState>((set) => ({
  x: 0,
  y: 0,
  isVisible: false,
  setMouse: (x, y) => set({ x, y }),
  setIsVisible: (visible) => set({ isVisible: visible }),
}));

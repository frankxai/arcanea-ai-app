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

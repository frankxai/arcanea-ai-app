"use client";

import { useEffect } from "react";

// Neutral is 128; values above shift sampling inward from the left/top edge, below from
// the right/bottom, so only a thin rim bends the backdrop like the edge of a lens.
const RIM_X =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' preserveAspectRatio='none'><linearGradient id='g'><stop offset='0' stop-color='rgb(255,128,128)'/><stop offset='.06' stop-color='rgb(176,128,128)'/><stop offset='.16' stop-color='rgb(128,128,128)'/><stop offset='.84' stop-color='rgb(128,128,128)'/><stop offset='.94' stop-color='rgb(80,128,128)'/><stop offset='1' stop-color='rgb(0,128,128)'/></linearGradient><rect width='100' height='100' fill='url(#g)'/></svg>",
  );

const RIM_Y =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' preserveAspectRatio='none'><linearGradient id='g' x2='0' y2='1'><stop offset='0' stop-color='rgb(128,255,128)'/><stop offset='.12' stop-color='rgb(128,176,128)'/><stop offset='.3' stop-color='rgb(128,128,128)'/><stop offset='.7' stop-color='rgb(128,128,128)'/><stop offset='.88' stop-color='rgb(128,80,128)'/><stop offset='1' stop-color='rgb(128,0,128)'/></linearGradient><rect width='100' height='100' fill='url(#g)'/></svg>",
  );

/**
 * Lens refraction for `.liquid-surface`. Chromium renders an SVG filter inside
 * backdrop-filter; WebKit does not (bug 313914) and @supports cannot tell, so the
 * switch is opt-in on a Chromium-only API. Touch devices stay frosted for frame rate.
 */
export function LiquidRefraction() {
  useEffect(() => {
    const chromium = "userAgentData" in navigator;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wantsLess = window.matchMedia(
      "(prefers-reduced-transparency: reduce), (prefers-contrast: more)",
    ).matches;
    if (chromium && finePointer && !wantsLess) {
      document.documentElement.dataset.liquid = "refract";
    }
  }, []);

  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
      <filter
        id="arc-liquid-lens"
        x="0"
        y="0"
        width="1"
        height="1"
        primitiveUnits="objectBoundingBox"
        colorInterpolationFilters="sRGB"
      >
        <feImage href={RIM_X} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="rimX" />
        <feImage href={RIM_Y} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="rimY" />
        <feDisplacementMap in="SourceGraphic" in2="rimX" scale="0.03" xChannelSelector="R" yChannelSelector="B" result="bentX" />
        <feDisplacementMap in="bentX" in2="rimY" scale="0.12" xChannelSelector="B" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

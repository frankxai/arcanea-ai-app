export type ReadingTheme = "dark" | "light" | "sepia" | "cosmic";
export type FontSize = 14 | 18 | 20 | 24 | 30;
export type FontFamily = "serif" | "sans";
export type LineHeight = "compact" | "normal" | "relaxed";

export interface ReaderPrefs {
  theme: ReadingTheme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
}

export const THEME_CYCLE: ReadingTheme[] = ["dark", "light", "sepia", "cosmic"];
export const FONT_SIZES: FontSize[] = [14, 18, 20, 24, 30];
export const LINE_HEIGHT_CYCLE: LineHeight[] = ["compact", "normal", "relaxed"];

// These labels match the existing Tailwind type scale at the default root size.
export const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  14: "text-sm",
  18: "text-lg",
  20: "text-xl",
  24: "text-2xl",
  30: "text-3xl",
};

export function defaultReaderPrefs(): ReaderPrefs {
  return {
    theme: "dark",
    fontSize: 18,
    fontFamily: "serif",
    lineHeight: "normal",
  };
}

/** Stored preferences are untrusted and may come from an older reader. */
export function parseReaderPrefs(raw: string | null): ReaderPrefs {
  const defaults = defaultReaderPrefs();
  if (!raw) return defaults;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      return defaults;
    const prefs = value as Record<string, unknown>;
    // Older labels 22/26 rendered at 20/24. Keep the reader's visual choice.
    const size =
      prefs.fontSize === 22 ? 20 : prefs.fontSize === 26 ? 24 : prefs.fontSize;
    return {
      theme: THEME_CYCLE.includes(prefs.theme as ReadingTheme)
        ? (prefs.theme as ReadingTheme)
        : defaults.theme,
      fontSize: FONT_SIZES.includes(size as FontSize)
        ? (size as FontSize)
        : defaults.fontSize,
      fontFamily:
        prefs.fontFamily === "serif" || prefs.fontFamily === "sans"
          ? prefs.fontFamily
          : defaults.fontFamily,
      lineHeight: LINE_HEIGHT_CYCLE.includes(prefs.lineHeight as LineHeight)
        ? (prefs.lineHeight as LineHeight)
        : defaults.lineHeight,
    };
  } catch {
    return defaults;
  }
}

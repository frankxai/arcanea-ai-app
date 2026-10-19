export interface WorldElement {
  name: string;
  color?: string;
}

const hex = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
const theme: Record<string, string> = {
  Fire: "var(--arc-fire)",
  Water: "var(--arc-brand-cosmic-blue)",
  Earth: "var(--arc-wind)",
  Wind: "var(--arc-text-primary)",
  Void: "var(--arc-void)",
  Spirit: "var(--arc-brand-arcanean-gold)",
};

// Existing worlds store names; generated drafts store {name, domain, color}.
// Normalize display fields only. Never rewrite the complete source document.
export function readWorldElements(value: unknown): WorldElement[] {
  if (!Array.isArray(value)) return [];
  const result: WorldElement[] = [];
  const names = new Set<string>();
  for (const item of value) {
    const rawName =
      typeof item === "string"
        ? item
        : item && typeof item === "object"
          ? item.name
          : null;
    if (typeof rawName !== "string") continue;
    const name = rawName.trim();
    if (!name || name.length > 160 || names.has(name)) continue;
    names.add(name);
    const color =
      item && typeof item === "object" && hex(item.color)
        ? item.color
        : undefined;
    result.push({ name, ...(color ? { color } : {}) });
    if (result.length === 12) break;
  }
  return result;
}

export function worldDisplayPalette(elements: WorldElement[], value: unknown) {
  const stored =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const colors =
    hex(stored.primary) && hex(stored.secondary) && hex(stored.accent)
      ? [stored.primary, stored.secondary, stored.accent]
      : elements
          .slice(0, 3)
          .map(
            (element) =>
              element.color ||
              (Object.hasOwn(theme, element.name)
                ? theme[element.name]
                : "var(--arc-brand-atlantean-teal)"),
          );
  if (!colors.length) colors.push("var(--arc-brand-atlantean-teal)");
  if (colors.length === 1) colors.push("var(--arc-brand-cosmic-blue)");
  if (colors.length === 2) colors.push("var(--arc-cosmic-void)");
  return {
    gradient: `linear-gradient(135deg, ${colors.join(", ")})`,
    primary: colors[0],
    secondary: colors[1],
  };
}

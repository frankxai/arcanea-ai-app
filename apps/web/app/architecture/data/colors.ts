// Arcanean Design System colors
export const COLORS = {
  core: '#00bcd4',       // Atlantean Teal
  guardian: '#ffd700',    // Gold Bright
  feature: '#7c3aed',    // Cosmic Purple
  infra: '#10b981',       // Emerald
  content: '#f97316',     // Amber
  external: '#6b7280',    // Neutral
  memory: '#78a6ff',      // Cosmic Blue
  agent: '#a855f7',       // Agent Purple
  element: '#7fffd4',     // Mintgreen (Atlantean)
};

export function nodeStyle(
  color: string,
  opts?: { dim?: boolean; bold?: boolean; large?: boolean; accent?: boolean },
) {
  return {
    background: opts?.accent ? color + '25' : color + '15',
    border: `${opts?.bold ? 2 : 1}px solid ${color}${opts?.dim ? '40' : '60'}`,
    color: opts?.dim ? '#a0a0a0' : '#e0e0e0',
    borderRadius: 10,
    padding: opts?.large ? 16 : opts?.dim ? 10 : 12,
    fontSize: opts?.large ? 15 : opts?.dim ? 10 : 11,
    fontWeight: opts?.bold ? 700 : 400,
    whiteSpace: 'pre-line' as const,
    fontFamily: "'Space Grotesk', sans-serif",
  };
}

export const edgeStyle = (color: string, opacity = '40') => ({
  stroke: color + opacity,
});

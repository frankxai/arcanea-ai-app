/**
 * PerspectiveSwitcher -- Character perspective indicator header for episodes.
 * Shows avatar, character name, and an element-colored accent bar.
 */

interface PerspectiveSwitcherProps {
  characterId: string;
  characterName: string;
  color: string;
  avatar: string;
}

export function PerspectiveSwitcher({
  characterName,
  color,
  avatar,
}: PerspectiveSwitcherProps) {
  return (
    <div className="flex items-center gap-3 py-3 my-4">
      {/* Colored bar accent */}
      <div
        className="w-1 h-8 rounded-full"
        style={{ backgroundColor: color }}
      />

      {/* Avatar */}
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
        style={{ backgroundColor: `${color}18` }}
      >
        {avatar}
      </span>

      {/* Character name */}
      <span
        className="font-display text-sm font-bold tracking-wide uppercase"
        style={{ color }}
      >
        {characterName}
      </span>

      {/* Fading line */}
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(to right, ${color}40, transparent)`,
        }}
      />
    </div>
  );
}

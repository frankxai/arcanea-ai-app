/**
 * Centralized external link constants — single source of truth for links
 * that are shared across many pages, so a dead/rotated URL only needs
 * fixing in one place.
 */

// discord.gg/arcanea is a dead invite (verified via Discord API: Unknown
// Invite). Routing Discord CTAs to GitHub Discussions until Frank creates
// a permanent invite link — replace DISCORD_URL below once that exists.
export const DISCORD_URL = "https://github.com/frankxai/arcanea/discussions";

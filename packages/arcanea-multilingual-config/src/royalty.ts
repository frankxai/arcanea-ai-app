/**
 * Arcanean royalty defaults for Open Library publishing.
 *
 * Default profile is 'generous' (50/20/30 author/translator/platform per
 * locale's revenue) — chosen to seed the translator economy without
 * starving authors. Per-book overrides allowed.
 */

import type { RoyaltySplitProfile } from '@starlight/multilingual';

/**
 * Default royalty split for new Arcanean books.
 *
 * - 'conservative' (60/10/30): privileges author; small translator share
 * - 'generous' (50/20/30): RECOMMENDED — meaningful translator income
 * - 'community-prioritized' (40/30/30): translator-led launches
 */
export const ARCANEAN_DEFAULT_ROYALTY_PROFILE: RoyaltySplitProfile = 'generous';

/**
 * Per-tier royalty profile suggestions:
 * - First-time community translator: conservative (low risk to author)
 * - Established translator with track record: generous
 * - Co-launch where translator drives marketing: community-prioritized
 *
 * Author Studio surfaces these as defaults but allows override per book.
 */
export const ARCANEAN_ROYALTY_TIER_DEFAULTS: Record<string, RoyaltySplitProfile> = {
  firstTimeTranslator: 'conservative',
  establishedTranslator: 'generous',
  coLaunchPartner: 'community-prioritized',
};

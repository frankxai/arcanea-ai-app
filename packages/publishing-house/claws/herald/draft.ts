/**
 * Herald Claw — Social Content Drafting
 *
 * Platform-optimized social content generation from publishing content.
 * Each platform receives tailored posts matching its voice, constraints,
 * and audience expectations.
 */

import type {
  ContentInput,
  SocialDraft,
  SocialPlatform,
  PlatformConstraints,
} from './types.js';
import { PLATFORM_CONSTRAINTS } from './types.js';

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/**
 * Truncate text to a max length, appending an ellipsis if needed.
 */
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trimEnd() + '\u2026';
}

/**
 * Build hashtags from tags, capped to the platform limit.
 */
function buildHashtags(tags: string[], max: number): string[] {
  return tags
    .slice(0, max)
    .map((t) => `#${t.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '')}`);
}

/**
 * Pick suggested images from the content input.
 */
function suggestedImages(content: ContentInput): string[] {
  if (content.coverImageUrl) return [content.coverImageUrl];
  return [];
}

// ---------------------------------------------------------------------------
// Platform Drafters
// ---------------------------------------------------------------------------

function draftXThread(content: ContentInput, constraints: PlatformConstraints): SocialDraft {
  const { maxChars, maxHashtags } = constraints;
  const hashtags = buildHashtags(content.tags, maxHashtags);
  const hashtagSuffix = hashtags.length > 0 ? `\n\n${hashtags.join(' ')}` : '';

  // Hook tweet
  const hook = truncate(
    `${content.title}\n\nA thread on what makes this essential reading.`,
    maxChars,
  );

  // Value tweets from summary sentences
  const summaryParts = content.summary
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  const valueTweets: string[] = [];
  let currentTweet = '';
  for (const sentence of summaryParts) {
    const candidate = currentTweet.length > 0 ? `${currentTweet} ${sentence}` : sentence;
    if (candidate.length > maxChars) {
      if (currentTweet.length > 0) valueTweets.push(truncate(currentTweet, maxChars));
      currentTweet = sentence;
    } else {
      currentTweet = candidate;
    }
  }
  if (currentTweet.length > 0) valueTweets.push(truncate(currentTweet, maxChars));

  // Excerpt tweet
  const excerptTweet = truncate(
    content.excerpt.length > 0 ? `"${content.excerpt}"` : content.summary,
    maxChars,
  );

  // CTA tweet
  const cta = truncate(
    `By ${content.author}${content.collection ? ` | ${content.collection}` : ''}${hashtagSuffix}`,
    maxChars,
  );

  // Assemble thread: hook + up to 5 value tweets + excerpt + CTA (3-7 range)
  const posts = [hook, ...valueTweets.slice(0, 5), excerptTweet, cta].slice(0, 7);
  if (posts.length < 3) {
    // Pad to minimum 3
    while (posts.length < 3) {
      posts.push(truncate(content.summary, maxChars));
    }
  }

  return {
    platform: 'x',
    posts,
    hashtags,
    suggestedImages: suggestedImages(content),
  };
}

function draftInstagramCaption(
  content: ContentInput,
  constraints: PlatformConstraints,
): SocialDraft {
  const { maxChars, maxHashtags } = constraints;
  const hashtags = buildHashtags(content.tags, maxHashtags);

  const caption = truncate(
    [
      `${content.title}`,
      '',
      content.summary,
      '',
      content.excerpt.length > 0 ? `"${content.excerpt}"` : '',
      '',
      `By ${content.author}${content.collection ? ` | ${content.collection}` : ''}`,
      '',
      hashtags.join(' '),
    ]
      .filter((line) => line !== undefined)
      .join('\n'),
    maxChars,
  );

  // Carousel text suggestions: break content into slide-sized pieces
  const carouselSlides: string[] = [
    content.title,
    ...content.summary.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0),
    content.excerpt.length > 0 ? `"${content.excerpt}"` : '',
    `By ${content.author}`,
  ].filter((s) => s.length > 0);

  return {
    platform: 'instagram',
    posts: [caption, ...carouselSlides],
    hashtags,
    suggestedImages: suggestedImages(content),
  };
}

function draftLinkedInArticle(
  content: ContentInput,
  constraints: PlatformConstraints,
): SocialDraft {
  const { maxChars, maxHashtags } = constraints;
  const hashtags = buildHashtags(content.tags, maxHashtags);

  const article = truncate(
    [
      content.title,
      '',
      content.summary,
      '',
      content.excerpt.length > 0
        ? `Key insight: "${content.excerpt}"`
        : '',
      '',
      content.worldGraphContext
        ? `Context: ${content.worldGraphContext}`
        : '',
      '',
      `${content.author}${content.collection ? ` | ${content.collection}` : ''}`,
    ]
      .filter((line) => line.length > 0)
      .join('\n'),
    maxChars,
  );

  return {
    platform: 'linkedin',
    posts: [article],
    hashtags,
    suggestedImages: suggestedImages(content),
  };
}

function draftThreadsPosts(
  content: ContentInput,
  constraints: PlatformConstraints,
): SocialDraft {
  const { maxChars, maxHashtags } = constraints;
  const hashtags = buildHashtags(content.tags, maxHashtags);

  const opener = truncate(
    `${content.title} -- let me tell you about this one`,
    maxChars,
  );

  const sentences = content.summary
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  const middle: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    const candidate = current.length > 0 ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxChars) {
      if (current.length > 0) middle.push(truncate(current, maxChars));
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) middle.push(truncate(current, maxChars));

  const closer = truncate(
    `By ${content.author}${content.collection ? ` from ${content.collection}` : ''} ${hashtags.join(' ')}`,
    maxChars,
  );

  const posts = [opener, ...middle.slice(0, 3), closer].slice(0, 5);
  while (posts.length < 3) {
    posts.splice(1, 0, truncate(content.excerpt || content.summary, maxChars));
  }

  return {
    platform: 'threads',
    posts,
    hashtags,
    suggestedImages: suggestedImages(content),
  };
}

function draftBlueskyPosts(
  content: ContentInput,
  constraints: PlatformConstraints,
): SocialDraft {
  const { maxChars, maxHashtags } = constraints;
  const hashtags = buildHashtags(content.tags, maxHashtags);

  const main = truncate(
    `${content.title}\n\n${content.summary}`,
    maxChars,
  );

  const posts = [main];

  if (content.excerpt.length > 0) {
    posts.push(truncate(`"${content.excerpt}" -- ${content.author}`, maxChars));
  }

  if (content.collection) {
    posts.push(truncate(`From ${content.collection} ${hashtags.join(' ')}`, maxChars));
  }

  return {
    platform: 'bluesky',
    posts,
    hashtags,
    suggestedImages: suggestedImages(content),
  };
}

// ---------------------------------------------------------------------------
// Platform Drafter Registry
// ---------------------------------------------------------------------------

const DRAFTERS: Record<
  SocialPlatform,
  (content: ContentInput, constraints: PlatformConstraints) => SocialDraft
> = {
  x: draftXThread,
  instagram: draftInstagramCaption,
  linkedin: draftLinkedInArticle,
  threads: draftThreadsPosts,
  bluesky: draftBlueskyPosts,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate platform-optimized social drafts for the given content.
 *
 * @param content - The source content to transform into social posts
 * @param platforms - Target platforms to generate drafts for
 * @returns Array of platform-specific social drafts
 */
export async function draftSocialPosts(
  content: ContentInput,
  platforms: SocialPlatform[],
): Promise<SocialDraft[]> {
  if (!content.title || !content.summary || !content.author) {
    throw new Error('ContentInput requires title, summary, and author fields');
  }

  if (platforms.length === 0) {
    throw new Error('At least one platform must be specified');
  }

  const uniquePlatforms = [...new Set(platforms)];

  const drafts: SocialDraft[] = uniquePlatforms.map((platform) => {
    const constraints = PLATFORM_CONSTRAINTS[platform];
    const drafter = DRAFTERS[platform];
    return drafter(content, constraints);
  });

  return drafts;
}

/**
 * Generate hook variants for A/B testing.
 *
 * Produces diverse opening lines optimized for engagement:
 * question hooks, bold claims, stat-driven, story-driven, and contrarian.
 *
 * @param content - Source content for hook generation
 * @param count - Number of variants to generate (default 5)
 * @returns Array of hook strings
 */
export function generateHookVariants(content: ContentInput, count: number = 5): string[] {
  if (!content.title || !content.summary) {
    throw new Error('ContentInput requires title and summary for hook generation');
  }

  const hooks: string[] = [];
  const title = content.title;
  const firstSentence = content.summary.split(/[.!?]/)[0]?.trim() ?? content.summary;

  // 1. Question hook
  hooks.push(`What if ${firstSentence.toLowerCase()}?`);

  // 2. Bold claim
  hooks.push(`${title} changes everything you thought you knew.`);

  // 3. Stat / authority hook
  hooks.push(
    content.collection
      ? `From the ${content.collection} collection: ${title}`
      : `${content.author} presents: ${title}`,
  );

  // 4. Story hook (excerpt-driven)
  if (content.excerpt && content.excerpt.length > 0) {
    hooks.push(`"${truncate(content.excerpt, 120)}" -- and it only gets deeper.`);
  } else {
    hooks.push(`The story behind ${title} is one you need to hear.`);
  }

  // 5. Contrarian hook
  hooks.push(`Most people get ${firstSentence.split(' ').slice(0, 4).join(' ')} wrong. Here's why.`);

  // 6+ Additional variants via recombination
  if (content.worldGraphContext) {
    hooks.push(`In the world of ${content.worldGraphContext}: ${title}`);
  }

  hooks.push(`${content.author} on why ${firstSentence.toLowerCase()}`);

  if (content.tags.length > 0) {
    hooks.push(`If you care about ${content.tags.slice(0, 2).join(' and ')}, read this.`);
  }

  return hooks.slice(0, Math.max(1, count));
}

export const PLATFORM_DIMENSIONS = {
  'instagram-post':    { width: 1080, height: 1080 },
  'instagram-story':   { width: 1080, height: 1920 },
  'instagram-carousel':{ width: 1080, height: 1080 },
  'linkedin-post':     { width: 1200, height: 627 },
  'linkedin-ad':       { width: 1200, height: 627 },
  'facebook-ad':       { width: 1200, height: 628 },
  'facebook-post':     { width: 1200, height: 630 },
  'email-header':      { width: 600,  height: 260 },
  'twitter-post':      { width: 1600, height: 900 },
} as const;

export type PlatformKey = keyof typeof PLATFORM_DIMENSIONS;

export const CONTENT_ANGLES = [
  'pain-point',
  'benefit',
  'social-proof',
  'urgency',
  'comparison',
  'stat',
] as const;

export type ContentAngle = typeof CONTENT_ANGLES[number];

/** How many content pieces to generate per platform */
export const MAX_PIECES_PER_PLATFORM: Record<string, number> = {
  instagram: 30,  // 20 posts + 10 stories
  linkedin:  20,
  facebook:  20,
  email:     15,
  twitter:   20,
};

export const DEFAULT_PLATFORMS = [
  'instagram',
  'linkedin',
  'facebook',
  'email',
  'twitter',
] as const;

/** Template IDs registered in the template registry */
export const TEMPLATE_IDS = {
  INSTAGRAM_POST_CLEAN:    'instagram-post-clean',
  INSTAGRAM_POST_BOLD:     'instagram-post-bold',
  INSTAGRAM_STORY_SPLIT:   'instagram-story-split',
  INSTAGRAM_STORY_MINIMAL: 'instagram-story-minimal',
  LINKEDIN_POST_STANDARD:  'linkedin-post-standard',
  LINKEDIN_POST_STAT:      'linkedin-post-stat',
  FACEBOOK_AD_STANDARD:    'facebook-ad-standard',
  EMAIL_HEADER_STANDARD:   'email-header-standard',
} as const;

export const QUEUE_NAME = 'content-generation';

export const ENV = {
  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY ?? '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',
  FAL_KEY:           process.env.FAL_KEY ?? '',
  REDIS_URL:         process.env.REDIS_URL ?? 'redis://localhost:6379',
} as const;

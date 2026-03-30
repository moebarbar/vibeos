import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';
import { ENV, PLATFORM_DIMENSIONS, TEMPLATE_IDS } from '../config/constants';
import type { BrandProfile, ContentPiece } from '../types';

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an elite social media copywriter and email marketer. You create high-converting content that stops the scroll. You know what performs on each platform.

RULES:
- Instagram: Hook in first line (under 8 words), use line breaks, soft CTA question at end, 5-8 relevant hashtags
- LinkedIn: Professional tone, start with a bold statement or contrarian take, use data/stats, end with engagement question
- Facebook Ads: Lead with the pain point, present the solution, include social proof, strong CTA
- Email: Subject line that creates curiosity, preview text that complements, body that follows PAS (Problem-Agitate-Solution)
- Twitter/X: Punchy, under 280 chars, hot take or stat, thread-worthy

CONTENT ANGLES TO USE:
1. pain-point: Lead with the customer's frustration
2. benefit: Lead with the transformation/outcome
3. social-proof: Lead with results, testimonials, numbers
4. urgency: Create FOMO or time-sensitivity
5. comparison: Before/after or us vs old way
6. stat: Lead with a surprising data point

For each platform, generate content using EACH angle to create variety.

Return a JSON array of objects with this exact structure:
[{
  "platform": "instagram|linkedin|facebook|email|twitter",
  "contentType": "post|story|ad|email-header",
  "angle": "pain-point|benefit|social-proof|urgency|comparison|stat",
  "headline": "The main headline/hook",
  "body": "Full post body text",
  "cta": "Call to action text",
  "suggestedImageStyle": "Description of what the accompanying image should look like"
}]

Generate AT LEAST:
- 10 Instagram posts (mix of all angles)
- 3 Instagram stories
- 5 LinkedIn posts
- 5 Facebook ads
- 5 Email headers
- 5 Twitter posts

Return ONLY the JSON array. No backticks, no explanation.`;

function buildUserPrompt(brandProfile: BrandProfile): string {
  return `Here is the brand profile. Generate all the content pieces now:\n\n${JSON.stringify(brandProfile, null, 2)}`;
}

// Map platform + contentType to a template ID
function assignTemplateId(platform: string, contentType: string): string {
  if (platform === 'instagram' && contentType === 'story') return TEMPLATE_IDS.INSTAGRAM_STORY_SPLIT;
  if (platform === 'instagram') return TEMPLATE_IDS.INSTAGRAM_POST_CLEAN;
  if (platform === 'linkedin')  return TEMPLATE_IDS.LINKEDIN_POST_STANDARD;
  if (platform === 'facebook')  return TEMPLATE_IDS.FACEBOOK_AD_STANDARD;
  if (platform === 'email')     return TEMPLATE_IDS.EMAIL_HEADER_STANDARD;
  return TEMPLATE_IDS.INSTAGRAM_POST_CLEAN;
}

// Map platform + contentType to dimensions
function assignDimensions(platform: string, contentType: string): { width: number; height: number } {
  if (platform === 'instagram' && contentType === 'story') return PLATFORM_DIMENSIONS['instagram-story'];
  if (platform === 'instagram') return PLATFORM_DIMENSIONS['instagram-post'];
  if (platform === 'linkedin')  return PLATFORM_DIMENSIONS['linkedin-post'];
  if (platform === 'facebook')  return PLATFORM_DIMENSIONS['facebook-ad'];
  if (platform === 'email')     return PLATFORM_DIMENSIONS['email-header'];
  if (platform === 'twitter')   return PLATFORM_DIMENSIONS['twitter-post'];
  return PLATFORM_DIMENSIONS['instagram-post'];
}

interface RawCopyItem {
  platform: string;
  contentType: string;
  angle: string;
  headline: string;
  body: string;
  cta: string;
  suggestedImageStyle?: string;
}

function mapToContentPieces(items: RawCopyItem[]): ContentPiece[] {
  return items.map(item => ({
    id:          randomUUID(),
    platform:    item.platform    as ContentPiece['platform'],
    contentType: item.contentType as ContentPiece['contentType'],
    angle:       item.angle       as ContentPiece['angle'],
    headline:    item.headline    ?? '',
    body:        item.body        ?? '',
    cta:         item.cta         ?? '',
    imagePrompt: item.suggestedImageStyle,
    templateId:  assignTemplateId(item.platform, item.contentType),
    dimensions:  assignDimensions(item.platform, item.contentType),
    status:      'pending',
  }));
}

function parseJsonArray(text: string): RawCopyItem[] {
  const cleaned = text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```$/im, '')
    .trim();

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error('Response is not a JSON array');
  return parsed as RawCopyItem[];
}

async function callClaude(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system:     SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: prompt }],
  });

  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');
}

// Split into social + email/ads if the response might be too large
async function generateInTwoPasses(brandProfile: BrandProfile): Promise<ContentPiece[]> {
  console.log('[copy-generator] Using two-pass generation (social + email/ads)');

  const socialPrompt = `${buildUserPrompt(brandProfile)}\n\nGenerate ONLY: 10 Instagram posts, 3 Instagram stories, 5 LinkedIn posts, 5 Twitter posts. JSON array only.`;
  const adsPrompt    = `${buildUserPrompt(brandProfile)}\n\nGenerate ONLY: 5 Facebook ads, 5 Email headers. JSON array only.`;

  const [socialText, adsText] = await Promise.all([
    callClaude(socialPrompt),
    callClaude(adsPrompt),
  ]);

  const socialItems = parseJsonArray(socialText);
  const adsItems    = parseJsonArray(adsText);

  return mapToContentPieces([...socialItems, ...adsItems]);
}

export async function generateCopy(brandProfile: BrandProfile): Promise<ContentPiece[]> {
  console.log(`[copy-generator] Generating copy for: ${brandProfile.name}`);

  const userPrompt = buildUserPrompt(brandProfile);

  try {
    const text  = await callClaude(userPrompt);
    const items = parseJsonArray(text);
    const pieces = mapToContentPieces(items);

    // Log breakdown per platform
    const byPlatform: Record<string, number> = {};
    for (const p of pieces) {
      byPlatform[p.platform] = (byPlatform[p.platform] ?? 0) + 1;
    }
    console.log(`[copy-generator] ✅ Generated ${pieces.length} pieces:`, byPlatform);

    return pieces;
  } catch (err) {
    console.warn(`[copy-generator] ⚠️  Single-pass failed: ${(err as Error).message} — trying two-pass`);
    const pieces = await generateInTwoPasses(brandProfile);

    const byPlatform: Record<string, number> = {};
    for (const p of pieces) {
      byPlatform[p.platform] = (byPlatform[p.platform] ?? 0) + 1;
    }
    console.log(`[copy-generator] ✅ Two-pass generated ${pieces.length} pieces:`, byPlatform);

    return pieces;
  }
}

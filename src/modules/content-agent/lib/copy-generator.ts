import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';
import { ENV, PLATFORM_DIMENSIONS, TEMPLATE_IDS } from '../config/constants';
import type { BrandProfile, ContentPiece } from '../types';

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an elite social media copywriter and email marketer. You create high-converting content that stops the scroll. You know what performs on each platform.

COPYWRITING FRAMEWORKS — use the right one per platform:

INSTAGRAM — Hook-Story-Offer framework:
- Hook: Pattern-interrupt first line, under 8 words, creates curiosity gap
- Story: 2-3 lines of relatable narrative or surprising insight
- Offer: Soft CTA as a question, never "click the link"
- Add 5-8 hashtags at the end, mix broad + niche

LINKEDIN — Contrarian-Take framework:
- Bold opening statement that challenges conventional wisdom
- Support with data, personal experience, or case study
- End with an engagement question
- No hashtags in the body, 3-5 hashtags after a line break at the end

FACEBOOK ADS — PAS framework (Problem-Agitate-Solution):
- Problem: Name the specific pain in the first line
- Agitate: Make the pain feel urgent (what happens if they don't act)
- Solution: Introduce the product as the answer
- CTA: Direct, action-oriented ("Start free trial", "Get the guide")

EMAIL — AIDA framework (Attention-Interest-Desire-Action):
- Subject line: Curiosity gap or specific benefit, under 50 chars
- First line: Hook that earns the second line
- Body: Build interest with specifics, create desire with outcomes
- CTA: Single, clear action

TWITTER/X — Hot-Take framework:
- Lead with a surprising stat or contrarian opinion
- Under 280 chars
- No hashtags (they reduce engagement on X)
- Thread-worthy: make people want to reply

AD PLATFORM CHARACTER LIMITS — respect these strictly:

Google Ads:
- Headline 1: max 30 characters
- Headline 2: max 30 characters
- Headline 3: max 30 characters
- Description: max 90 characters

Meta (Facebook/Instagram) Ads:
- Primary text: 125 characters visible
- Headline: max 40 characters
- Description: max 30 characters

LinkedIn Ads:
- Headline: max 70 characters
- Description: max 100 characters
- Introductory text: max 150 characters visible

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
  "suggestedImageStyle": "Description of what the accompanying image should look like",
  "hashtags": ["array", "of", "hashtags"],
  "subjectLine": "For email only — under 50 chars",
  "previewText": "For email only — under 90 chars",
  "adHeadline1": "For ad/facebook content — max 30 chars",
  "adHeadline2": "For ad/facebook content — max 30 chars",
  "adHeadline3": "For ad/facebook content — max 30 chars",
  "adPrimaryText": "For Meta ads — max 125 chars",
  "adDescription": "For Meta ads — max 30 chars"
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

function assignTemplateId(platform: string, contentType: string): string {
  if (platform === 'instagram' && contentType === 'story') return TEMPLATE_IDS.INSTAGRAM_STORY_SPLIT;
  if (platform === 'instagram') return TEMPLATE_IDS.INSTAGRAM_POST_CLEAN;
  if (platform === 'linkedin')  return TEMPLATE_IDS.LINKEDIN_POST_STANDARD;
  if (platform === 'facebook')  return TEMPLATE_IDS.FACEBOOK_AD_STANDARD;
  if (platform === 'email')     return TEMPLATE_IDS.EMAIL_HEADER_STANDARD;
  return TEMPLATE_IDS.INSTAGRAM_POST_CLEAN;
}

function assignDimensions(platform: string, contentType: string): { width: number; height: number } {
  if (platform === 'instagram' && contentType === 'story') return PLATFORM_DIMENSIONS['instagram-story'];
  if (platform === 'instagram') return PLATFORM_DIMENSIONS['instagram-post'];
  if (platform === 'linkedin')  return PLATFORM_DIMENSIONS['linkedin-post'];
  if (platform === 'facebook')  return PLATFORM_DIMENSIONS['facebook-ad'];
  if (platform === 'email')     return PLATFORM_DIMENSIONS['email-header'];
  if (platform === 'twitter')   return PLATFORM_DIMENSIONS['twitter-post'];
  return PLATFORM_DIMENSIONS['instagram-post'];
}

function buildUtmUrl(
  baseUrl: string,
  platform: string,
  contentType: string,
  angle: string,
  campaignName: string,
): { utmUrl: string; utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string } {
  const medium = ['email', 'email-header'].includes(contentType) ? 'email' : 
                 ['ad', 'facebook'].includes(contentType)        ? 'paid'  : 'social';
  const utmContent = `${angle}-${contentType}`;
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source',   platform);
  url.searchParams.set('utm_medium',   medium);
  url.searchParams.set('utm_campaign', campaignName);
  url.searchParams.set('utm_content',  utmContent);
  return {
    utmUrl:      url.toString(),
    utmSource:   platform,
    utmMedium:   medium,
    utmCampaign: campaignName,
    utmContent,
  };
}

interface RawCopyItem {
  platform: string;
  contentType: string;
  angle: string;
  headline: string;
  body: string;
  cta: string;
  suggestedImageStyle?: string;
  hashtags?: string[];
  subjectLine?: string;
  previewText?: string;
  adHeadline1?: string;
  adHeadline2?: string;
  adHeadline3?: string;
  adPrimaryText?: string;
  adDescription?: string;
}

function mapToContentPieces(items: RawCopyItem[], brandProfile: BrandProfile): ContentPiece[] {
  const baseUrl       = brandProfile.websiteUrl ?? 'https://example.com';
  const campaignName  = brandProfile.name.toLowerCase().replace(/\s+/g, '-');

  return items.map(item => {
    const utm = (() => {
      try { return buildUtmUrl(baseUrl, item.platform, item.contentType, item.angle, campaignName); }
      catch { return undefined; }
    })();

    return {
      id:           randomUUID(),
      platform:     item.platform    as ContentPiece['platform'],
      contentType:  item.contentType as ContentPiece['contentType'],
      angle:        item.angle       as ContentPiece['angle'],
      headline:     item.headline    ?? '',
      body:         item.body        ?? '',
      cta:          item.cta         ?? '',
      imagePrompt:  item.suggestedImageStyle,
      templateId:   assignTemplateId(item.platform, item.contentType),
      dimensions:   assignDimensions(item.platform, item.contentType),
      status:       'pending',
      hashtags:     item.hashtags,
      subjectLine:  item.subjectLine,
      previewText:  item.previewText,
      adHeadline1:  item.adHeadline1,
      adHeadline2:  item.adHeadline2,
      adHeadline3:  item.adHeadline3,
      adPrimaryText: item.adPrimaryText,
      adDescription: item.adDescription,
      ...utm,
    };
  });
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

async function generateInTwoPasses(brandProfile: BrandProfile): Promise<ContentPiece[]> {
  console.log('[copy-generator] Using two-pass generation (social + email/ads)');
  const socialPrompt = `${buildUserPrompt(brandProfile)}\n\nGenerate ONLY: 10 Instagram posts, 3 Instagram stories, 5 LinkedIn posts, 5 Twitter posts. JSON array only.`;
  const adsPrompt    = `${buildUserPrompt(brandProfile)}\n\nGenerate ONLY: 5 Facebook ads, 5 Email headers. JSON array only.`;
  const [socialText, adsText] = await Promise.all([callClaude(socialPrompt), callClaude(adsPrompt)]);
  return mapToContentPieces([...parseJsonArray(socialText), ...parseJsonArray(adsText)], brandProfile);
}

export async function generateCopy(brandProfile: BrandProfile): Promise<ContentPiece[]> {
  console.log(`[copy-generator] Generating copy for: ${brandProfile.name}`);
  try {
    const items  = parseJsonArray(await callClaude(buildUserPrompt(brandProfile)));
    const pieces = mapToContentPieces(items, brandProfile);
    const byPlatform: Record<string, number> = {};
    for (const p of pieces) byPlatform[p.platform] = (byPlatform[p.platform] ?? 0) + 1;
    console.log(`[copy-generator] Generated ${pieces.length} pieces:`, byPlatform);
    return pieces;
  } catch (err) {
    console.warn(`[copy-generator] Single-pass failed: ${(err as Error).message} — trying two-pass`);
    const pieces = await generateInTwoPasses(brandProfile);
    const byPlatform: Record<string, number> = {};
    for (const p of pieces) byPlatform[p.platform] = (byPlatform[p.platform] ?? 0) + 1;
    console.log(`[copy-generator] Two-pass generated ${pieces.length} pieces:`, byPlatform);
    return pieces;
  }
}

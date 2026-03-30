import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/constants';
import type { ScrapedData } from './scraper';
import type { BrandProfile } from '../types';

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a senior brand strategist and digital marketing expert. You analyze websites and extract comprehensive brand profiles that can be used to generate on-brand marketing content.

Analyze the provided website content and return a JSON object with this exact structure:
{
  "name": "Brand/Company name",
  "tagline": "Their main tagline or value proposition",
  "primaryColor": "#hex",
  "secondaryColor": "#hex",
  "accentColor": "#hex",
  "fontStyle": "modern|classic|playful|bold",
  "tone": "professional|casual|authoritative|friendly|edgy",
  "industry": "Their industry/niche",
  "targetAudience": "Description of ideal customer",
  "valuePropositions": ["VP1", "VP2", "VP3"],
  "keyFeatures": ["Feature 1", "Feature 2"],
  "socialProof": ["Testimonial or stat 1"],
  "ctaText": "Their primary call-to-action text",
  "logoUrl": null,
  "productScreenshots": []
}

If you can't determine certain colors from the content, infer them based on the industry and tone. Always provide all fields. Return ONLY valid JSON, no markdown backticks or explanation.`;

function buildUserPrompt(data: ScrapedData): string {
  const parts: string[] = [
    `URL: ${data.url}`,
    `Title: ${data.title}`,
    `Description: ${data.description}`,
  ];

  if (data.extractedColors.length) {
    parts.push(`Detected brand colors from CSS: ${data.extractedColors.join(', ')}`);
  }

  if (data.testimonials.length) {
    parts.push(`Social proof / testimonials found:\n${data.testimonials.slice(0, 5).map(t => `- ${t}`).join('\n')}`);
  }

  parts.push(`Website content (markdown):\n${data.markdown.slice(0, 6000)}`);

  return parts.join('\n\n');
}

function validateBrandProfile(obj: unknown): obj is BrandProfile {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  const required = [
    'name', 'tagline', 'primaryColor', 'secondaryColor', 'accentColor',
    'fontStyle', 'tone', 'industry', 'targetAudience',
    'valuePropositions', 'keyFeatures', 'socialProof', 'ctaText',
  ];
  return required.every(k => k in o);
}

function normalizeProfile(parsed: Record<string, unknown>): BrandProfile {
  if (!Array.isArray(parsed.productScreenshots)) parsed.productScreenshots = [];
  if (!Array.isArray(parsed.valuePropositions))  parsed.valuePropositions  = [];
  if (!Array.isArray(parsed.keyFeatures))        parsed.keyFeatures        = [];
  if (!Array.isArray(parsed.socialProof))        parsed.socialProof        = [];
  return parsed as unknown as BrandProfile;
}

function parseClaudeJson(text: string): BrandProfile {
  const cleaned = text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```$/im, '')
    .trim();

  const parsed = JSON.parse(cleaned) as Record<string, unknown>;
  if (!validateBrandProfile(parsed)) {
    throw new Error('Response missing required BrandProfile fields');
  }
  return normalizeProfile(parsed);
}

async function getClaudeResponse(messages: Anthropic.MessageParam[]): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages,
  });

  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');
}

export async function analyzeBrand(scrapedData: ScrapedData): Promise<BrandProfile> {
  console.log(`[brand-analyzer] Analyzing brand for: ${scrapedData.url}`);

  const userPrompt = buildUserPrompt(scrapedData);
  const firstMessages: Anthropic.MessageParam[] = [
    { role: 'user', content: userPrompt },
  ];

  let firstResponse = '';

  try {
    firstResponse = await getClaudeResponse(firstMessages);
    console.log(`[brand-analyzer] Claude responded with ${firstResponse.length} chars`);
    const profile = parseClaudeJson(firstResponse);
    console.log(`[brand-analyzer] ✅ Brand: "${profile.name}" | Tone: ${profile.tone} | Industry: ${profile.industry}`);
    return profile;
  } catch (firstErr) {
    console.warn(`[brand-analyzer] ⚠️  First attempt failed: ${(firstErr as Error).message} — retrying`);

    try {
      const retryMessages: Anthropic.MessageParam[] = [
        ...firstMessages,
        ...(firstResponse ? [{ role: 'assistant' as const, content: firstResponse }] : []),
        {
          role: 'user',
          content: 'Your previous response was not valid JSON. Return ONLY the raw JSON object — no backticks, no explanation, no surrounding text.',
        },
      ];

      const retryResponse = await getClaudeResponse(retryMessages);
      const profile = parseClaudeJson(retryResponse);
      console.log(`[brand-analyzer] ✅ Retry succeeded: "${profile.name}"`);
      return profile;
    } catch (retryErr) {
      console.error(`[brand-analyzer] ❌ Both attempts failed`);
      throw new Error(`Brand analysis failed: ${(retryErr as Error).message}`);
    }
  }
}

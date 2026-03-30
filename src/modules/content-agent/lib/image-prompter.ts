import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/constants';
import type { BrandProfile, ContentPiece } from '../types';

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

// Templates that don't need an AI photo (text-only designs)
const TEMPLATES_REQUIRING_IMAGES = new Set([
  'instagram-post-clean',
  'instagram-post-bold',
  'instagram-story-split',
  'linkedin-post-standard',
  'facebook-ad-standard',
]);

export interface ImagePrompt {
  contentPieceId: string;
  imageType: 'lifestyle' | 'product-mockup' | 'abstract' | 'workspace';
  fluxPrompt: string;
  negativePrompt: string;
}

const SYSTEM_PROMPT = `You are an expert at writing AI image generation prompts for Flux/Midjourney. You create prompts that produce photorealistic, professional marketing images.

RULES FOR GOOD IMAGE PROMPTS:
- Be specific about composition: camera angle, lighting, depth of field
- Include the setting/environment that matches the brand
- Specify the mood and color palette using the brand colors
- Never include text in the image — text will be overlaid separately
- Include style keywords: photorealistic, professional photography, 85mm lens, soft studio lighting, etc.
- For SaaS/tech brands: show people using devices, modern offices, clean workspaces
- For e-commerce: show products in lifestyle settings
- For services: show the transformation/outcome
- Match the content angle: pain-point = frustrated person, benefit = happy/successful person, social-proof = group/team setting

IMAGE TYPES:
1. 'lifestyle' — person or scene that embodies the brand's customer
2. 'product-mockup' — laptop/phone showing a dashboard or product (no text on screen)
3. 'abstract' — geometric shapes, gradients, data visualization aesthetics matching brand colors
4. 'workspace' — professional environment that matches target audience

For each ContentPiece, return:
[{
  "contentPieceId": "the content piece UUID",
  "imageType": "lifestyle|product-mockup|abstract|workspace",
  "fluxPrompt": "The full detailed Flux prompt",
  "negativePrompt": "text, watermarks, logos, blurry, low quality, distorted faces, oversaturated"
}]

Return ONLY a JSON array.`;

function buildBatchPrompt(brandProfile: BrandProfile, pieces: ContentPiece[]): string {
  const brandContext = `
Brand: ${brandProfile.name}
Industry: ${brandProfile.industry}
Target audience: ${brandProfile.targetAudience}
Tone: ${brandProfile.tone}
Primary color: ${brandProfile.primaryColor}
Secondary color: ${brandProfile.secondaryColor}
Accent color: ${brandProfile.accentColor}
Key value props: ${brandProfile.valuePropositions.join(', ')}`.trim();

  const pieceSummaries = pieces.map(p => ({
    contentPieceId: p.id,
    platform:       p.platform,
    angle:          p.angle,
    headline:       p.headline,
    suggestedStyle: p.imagePrompt ?? '',
  }));

  return `${brandContext}\n\nGenerate image prompts for these ${pieces.length} content pieces:\n${JSON.stringify(pieceSummaries, null, 2)}`;
}

async function generateBatch(brandProfile: BrandProfile, batch: ContentPiece[]): Promise<ImagePrompt[]> {
  const response = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system:     SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: buildBatchPrompt(brandProfile, batch) }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('')
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```$/im, '')
    .trim();

  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error('Expected JSON array from image prompter');
  return parsed as ImagePrompt[];
}

export async function generateImagePrompts(
  brandProfile: BrandProfile,
  contentPieces: ContentPiece[],
): Promise<ImagePrompt[]> {
  // Only generate prompts for templates that use AI photos
  const needsImage = contentPieces.filter(p => TEMPLATES_REQUIRING_IMAGES.has(p.templateId));
  console.log(`[image-prompter] ${needsImage.length}/${contentPieces.length} pieces need images`);

  if (needsImage.length === 0) return [];

  // Batch into groups of 10 to stay within context limits
  const BATCH_SIZE = 10;
  const batches: ContentPiece[][] = [];
  for (let i = 0; i < needsImage.length; i += BATCH_SIZE) {
    batches.push(needsImage.slice(i, i + BATCH_SIZE));
  }

  console.log(`[image-prompter] Processing ${batches.length} batches of up to ${BATCH_SIZE}`);

  const allPrompts: ImagePrompt[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`[image-prompter] Batch ${i + 1}/${batches.length} (${batch.length} pieces)`);
    try {
      const prompts = await generateBatch(brandProfile, batch);
      allPrompts.push(...prompts);
    } catch (err) {
      console.warn(`[image-prompter] Batch ${i + 1} failed: ${(err as Error).message}`);
    }
  }

  console.log(`[image-prompter] ✅ Generated ${allPrompts.length} image prompts`);
  return allPrompts;
}

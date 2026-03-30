import * as fal from '@fal-ai/client';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { ENV } from '../config/constants';
import type { ImagePrompt } from './image-prompter';

fal.config({ credentials: ENV.FAL_KEY });

const OUTPUT_DIR = '/tmp/content-agent/images';

export interface GeneratedImage {
  contentPieceId: string;
  localPath:      string;
  originalUrl:    string;
}

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Map content dimensions to fal.ai image_size strings
function toFalSize(contentPieceId: string): string {
  // Stories are portrait, everything else landscape-ish
  // We store size hints in the prompt object — default to square for posts
  if (contentPieceId.includes('story')) return 'portrait_9_16';
  return 'square_hd';
}

export async function generateSingleImage(
  prompt: string,
  size: string = 'square_hd',
): Promise<Buffer> {
  const result = await fal.subscribe('fal-ai/flux/dev', {
    input: {
      prompt,
      image_size:  size,
      num_images:  1,
      enable_safety_checker: false,
    },
  }) as { images: Array<{ url: string }> };

  const imageUrl = result.images?.[0]?.url;
  if (!imageUrl) throw new Error('fal.ai returned no image URL');

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Failed to download image: ${response.status}`);

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function processOne(prompt: ImagePrompt): Promise<GeneratedImage> {
  const size = toFalSize(prompt.contentPieceId);

  const buffer = await generateSingleImage(prompt.fluxPrompt, size);
  const localPath = path.join(OUTPUT_DIR, `${prompt.contentPieceId}.png`);

  // Use sharp to ensure proper PNG format and save
  await sharp(buffer).png().toFile(localPath);

  return {
    contentPieceId: prompt.contentPieceId,
    localPath,
    originalUrl:    '',
  };
}

export async function generateImages(
  imagePrompts: ImagePrompt[],
  onProgress?: (completed: number, total: number) => void,
): Promise<GeneratedImage[]> {
  ensureOutputDir();

  console.log(`[image-generator] Generating ${imagePrompts.length} images via fal.ai Flux`);

  const results: GeneratedImage[] = [];
  const BATCH_SIZE  = 3;
  const BATCH_DELAY = 1000; // ms between batches

  for (let i = 0; i < imagePrompts.length; i += BATCH_SIZE) {
    const batch = imagePrompts.slice(i, i + BATCH_SIZE);
    console.log(`[image-generator] Batch ${Math.floor(i / BATCH_SIZE) + 1} — ${batch.length} images`);

    const batchResults = await Promise.all(
      batch.map(async (prompt) => {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const result = await processOne(prompt);
            onProgress?.(results.length + 1, imagePrompts.length);
            return result;
          } catch (err) {
            if (attempt === 2) {
              console.warn(`[image-generator] ⚠️  Skipping ${prompt.contentPieceId}: ${(err as Error).message}`);
              return null;
            }
            console.warn(`[image-generator] Attempt ${attempt} failed for ${prompt.contentPieceId}, retrying...`);
          }
        }
        return null;
      }),
    );

    for (const r of batchResults) {
      if (r) results.push(r);
    }

    onProgress?.(results.length, imagePrompts.length);

    // Delay between batches to avoid rate limits
    if (i + BATCH_SIZE < imagePrompts.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }

  console.log(`[image-generator] ✅ Generated ${results.length}/${imagePrompts.length} images`);
  return results;
}

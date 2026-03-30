import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import type { GeneratedImage } from './image-generator';
import type { RenderedTemplate } from './template-renderer';

const OUTPUT_DIR = '/tmp/content-agent/composited';
const THUMB_DIR  = '/tmp/content-agent/thumbnails';

function ensureDirs() {
  for (const dir of [OUTPUT_DIR, THUMB_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

export interface CompositedResult {
  contentPieceId: string;
  finalPath:      string;
  thumbnailPath:  string;
  width:          number;
  height:         number;
}

export type CompositeMode =
  | 'template-only'   // no background image — just use the rendered template
  | 'background'      // AI image fills the full canvas, template overlaid on top at reduced opacity
  | 'overlay'         // template on left, AI image fills right half
  | 'side-by-side';   // template and image at equal width side by side

// ─── Mode: template-only ─────────────────────────────────────────────────────

async function compositeTemplateOnly(rendered: RenderedTemplate): Promise<{ finalPath: string; width: number; height: number }> {
  const outPath = path.join(OUTPUT_DIR, `${rendered.contentPieceId}.png`);
  // Just copy — no compositing needed
  fs.copyFileSync(rendered.localPath, outPath);
  return { finalPath: outPath, width: rendered.width, height: rendered.height };
}

// ─── Mode: background ────────────────────────────────────────────────────────

async function compositeBackground(
  rendered: RenderedTemplate,
  image: GeneratedImage,
): Promise<{ finalPath: string; width: number; height: number }> {
  const { width, height } = rendered;
  const outPath = path.join(OUTPUT_DIR, `${rendered.contentPieceId}.png`);

  // Resize AI image to fill canvas
  const bgBuffer = await sharp(image.localPath)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .toBuffer();

  // Load the rendered template as overlay — reduce its opacity by blending with the background
  const templateBuffer = await sharp(rendered.localPath)
    .resize(width, height)
    .toBuffer();

  await sharp(bgBuffer)
    .composite([{ input: templateBuffer, blend: 'over', opacity: 0.88 }])
    .png()
    .toFile(outPath);

  return { finalPath: outPath, width, height };
}

// ─── Mode: overlay ────────────────────────────────────────────────────────────

async function compositeOverlay(
  rendered: RenderedTemplate,
  image: GeneratedImage,
): Promise<{ finalPath: string; width: number; height: number }> {
  const { width, height } = rendered;
  const outPath = path.join(OUTPUT_DIR, `${rendered.contentPieceId}.png`);

  // Right half: AI image
  const rightW = Math.floor(width * 0.45);
  const rightBuffer = await sharp(image.localPath)
    .resize(rightW, height, { fit: 'cover', position: 'centre' })
    .toBuffer();

  // Left half: template (full width render, clip to left portion)
  const leftW = width - rightW;
  const templateBuffer = await sharp(rendered.localPath)
    .extract({ left: 0, top: 0, width: leftW, height })
    .toBuffer();

  // Create canvas: place left template then right image
  await sharp({
    create: { width, height, channels: 4, background: { r: 10, g: 10, b: 26, alpha: 1 } },
  })
    .composite([
      { input: templateBuffer, left: 0, top: 0 },
      { input: rightBuffer, left: leftW, top: 0 },
    ])
    .png()
    .toFile(outPath);

  return { finalPath: outPath, width, height };
}

// ─── Mode: side-by-side ──────────────────────────────────────────────────────

async function compositeSideBySide(
  rendered: RenderedTemplate,
  image: GeneratedImage,
): Promise<{ finalPath: string; width: number; height: number }> {
  const { height } = rendered;
  const halfW = Math.floor(rendered.width / 2);
  const totalW = halfW * 2;
  const outPath = path.join(OUTPUT_DIR, `${rendered.contentPieceId}.png`);

  const leftBuffer = await sharp(rendered.localPath)
    .resize(halfW, height, { fit: 'cover', position: 'west' })
    .toBuffer();

  const rightBuffer = await sharp(image.localPath)
    .resize(halfW, height, { fit: 'cover', position: 'centre' })
    .toBuffer();

  await sharp({
    create: { width: totalW, height, channels: 4, background: { r: 10, g: 10, b: 26, alpha: 1 } },
  })
    .composite([
      { input: leftBuffer,  left: 0,     top: 0 },
      { input: rightBuffer, left: halfW, top: 0 },
    ])
    .png()
    .toFile(outPath);

  return { finalPath: outPath, width: totalW, height };
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

async function makeThumbnail(sourcePath: string, id: string, width: number, height: number): Promise<string> {
  const thumbPath = path.join(THUMB_DIR, `${id}.jpg`);
  const thumbW = 400;
  const thumbH = Math.round((height / width) * thumbW);

  await sharp(sourcePath)
    .resize(thumbW, thumbH, { fit: 'fill' })
    .jpeg({ quality: 82 })
    .toFile(thumbPath);

  return thumbPath;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function composite(
  rendered: RenderedTemplate,
  image: GeneratedImage | null,
  mode: CompositeMode = 'template-only',
): Promise<CompositedResult> {
  ensureDirs();

  let result: { finalPath: string; width: number; height: number };

  if (!image || mode === 'template-only') {
    result = await compositeTemplateOnly(rendered);
  } else if (mode === 'background') {
    result = await compositeBackground(rendered, image);
  } else if (mode === 'overlay') {
    result = await compositeOverlay(rendered, image);
  } else {
    result = await compositeSideBySide(rendered, image);
  }

  const thumbnailPath = await makeThumbnail(result.finalPath, rendered.contentPieceId, result.width, result.height);

  return {
    contentPieceId: rendered.contentPieceId,
    finalPath:      result.finalPath,
    thumbnailPath,
    width:          result.width,
    height:         result.height,
  };
}

export async function compositeBatch(
  renderedMap: Map<string, RenderedTemplate>,
  imageMap: Map<string, GeneratedImage>,
  onProgress?: (completed: number, total: number) => void,
): Promise<CompositedResult[]> {
  ensureDirs();

  const ids = Array.from(renderedMap.keys());
  const results: CompositedResult[] = [];

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const rendered = renderedMap.get(id)!;
    const image = imageMap.get(id) ?? null;

    // Choose mode based on whether we have an image
    const mode: CompositeMode = image ? 'background' : 'template-only';

    try {
      const result = await composite(rendered, image, mode);
      results.push(result);
    } catch (err) {
      console.warn(`[compositor] Skipping ${id}: ${(err as Error).message}`);
    }

    onProgress?.(i + 1, ids.length);
  }

  console.log(`[compositor] Composited ${results.length}/${ids.length} pieces`);
  return results;
}

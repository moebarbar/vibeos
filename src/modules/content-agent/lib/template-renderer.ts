import puppeteer, { type Browser, type Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { getTemplate } from '../templates';
import type { TemplateData, ContentPiece } from '../types';

const OUTPUT_DIR = '/tmp/content-agent/renders';

let _browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (_browser && _browser.connected) return _browser;
  _browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  });
  return _browser;
}

export async function closeBrowser(): Promise<void> {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

export interface RenderedTemplate {
  contentPieceId: string;
  localPath: string;
  width: number;
  height: number;
}

export async function renderTemplate(
  piece: ContentPiece,
  data: TemplateData,
): Promise<RenderedTemplate> {
  const template = getTemplate(piece.templateId);
  if (!template) throw new Error(`Template not found: ${piece.templateId}`);

  const html = template.render(data);
  const { width, height } = template.dimensions;

  const browser = await getBrowser();
  const page: Page = await browser.newPage();

  try {
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 120));

    ensureOutputDir();
    const localPath = path.join(OUTPUT_DIR, `${piece.id}.png`);

    await page.screenshot({
      path: localPath as `${string}.png`,
      type: 'png',
      clip: { x: 0, y: 0, width, height },
    });

    return { contentPieceId: piece.id, localPath, width, height };
  } finally {
    await page.close();
  }
}

export async function renderBatch(
  pieces: ContentPiece[],
  data: TemplateData,
  onProgress?: (completed: number, total: number) => void,
): Promise<RenderedTemplate[]> {
  ensureOutputDir();

  const results: RenderedTemplate[] = [];
  const CONCURRENCY = 3;

  for (let i = 0; i < pieces.length; i += CONCURRENCY) {
    const batch = pieces.slice(i, i + CONCURRENCY);

    const batchResults = await Promise.all(
      batch.map(async (piece) => {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const result = await renderTemplate(piece, data);
            onProgress?.(results.length + 1, pieces.length);
            return result;
          } catch (err) {
            if (attempt === 2) {
              console.warn(`[template-renderer] Skipping ${piece.id}: ${(err as Error).message}`);
              return null;
            }
          }
        }
        return null;
      }),
    );

    for (const r of batchResults) {
      if (r) results.push(r);
    }

    onProgress?.(results.length, pieces.length);
  }

  console.log(`[template-renderer] Rendered ${results.length}/${pieces.length} templates`);
  return results;
}

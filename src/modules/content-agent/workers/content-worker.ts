import { Worker, Queue, type Job } from 'bullmq';
import IORedis from 'ioredis';
import { ENV, QUEUE_NAME } from '../config/constants';
import { scrapeUrl } from '../lib/scraper';
import { analyzeBrand } from '../lib/brand-analyzer';
import { generateCopy } from '../lib/copy-generator';
import { generateImagePrompts } from '../lib/image-prompter';
import { generateImages, type GeneratedImage } from '../lib/image-generator';
import { renderTemplate, closeBrowser, type RenderedTemplate } from '../lib/template-renderer';
import { compositeBatch } from '../lib/compositor';
import type { GenerationJob, ContentPiece } from '../types';

// In-memory job store — keyed by jobId
export const jobStore = new Map<string, GenerationJob>();

const connection = new IORedis(ENV.REDIS_URL, { maxRetriesPerRequest: null });

export const contentQueue = new Queue(QUEUE_NAME, { connection });

function updateJob(id: string, patch: Partial<GenerationJob>) {
  const existing = jobStore.get(id);
  if (existing) jobStore.set(id, { ...existing, ...patch });
}

// ─── Worker ───────────────────────────────────────────────────────────────────

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const { jobId, url } = job.data as { jobId: string; url: string };

    try {
      // ── Step 1: Scrape ────────────────────────────────────────────────────
      updateJob(jobId, { status: 'scraping', progress: 5 });
      await job.updateProgress(5);
      const scraped = await scrapeUrl(url);

      // ── Step 2: Analyze brand ─────────────────────────────────────────────
      updateJob(jobId, { status: 'analyzing', progress: 15 });
      await job.updateProgress(15);
      const brandProfile = await analyzeBrand(scraped);
      updateJob(jobId, { brandProfile });

      // ── Step 3: Generate copy ─────────────────────────────────────────────
      updateJob(jobId, { status: 'generating-copy', progress: 25 });
      await job.updateProgress(25);
      const contentPieces = await generateCopy(brandProfile);
      updateJob(jobId, { contentPieces, totalPieces: contentPieces.length });

      // ── Step 4: Generate image prompts ────────────────────────────────────
      updateJob(jobId, { progress: 35 });
      await job.updateProgress(35);
      const imagePrompts = await generateImagePrompts(brandProfile, contentPieces);

      // ── Step 5: Generate images via fal.ai ───────────────────────────────
      updateJob(jobId, { status: 'generating-images', progress: 40 });
      await job.updateProgress(40);
      const generatedImages = await generateImages(imagePrompts, (done, total) => {
        const pct = 40 + Math.round((done / total) * 20);
        updateJob(jobId, { progress: pct });
        job.updateProgress(pct).catch(() => {});
      });
      const imageMap = new Map<string, GeneratedImage>(
        generatedImages.map(img => [img.contentPieceId, img]),
      );

      // ── Step 6: Render each template via Puppeteer ────────────────────────
      updateJob(jobId, { status: 'rendering', progress: 62 });
      await job.updateProgress(62);

      const renderedMap = new Map<string, RenderedTemplate>();
      const RENDER_CONCURRENCY = 3;

      for (let i = 0; i < contentPieces.length; i += RENDER_CONCURRENCY) {
        const batch = contentPieces.slice(i, i + RENDER_CONCURRENCY);
        const results = await Promise.all(
          batch.map(async (piece) => {
            try {
              const r = await renderTemplate(piece, { brandProfile, content: piece });
              return r;
            } catch (err) {
              console.warn(`[worker] Render failed for ${piece.id}: ${(err as Error).message}`);
              return null;
            }
          }),
        );
        for (const r of results) {
          if (r) renderedMap.set(r.contentPieceId, r);
        }
        const pct = 62 + Math.round(((i + batch.length) / contentPieces.length) * 18);
        updateJob(jobId, { progress: pct });
        await job.updateProgress(pct);
      }

      // ── Step 7: Composite ─────────────────────────────────────────────────
      updateJob(jobId, { status: 'compositing', progress: 82 });
      await job.updateProgress(82);

      const composited = await compositeBatch(renderedMap, imageMap, (done, total) => {
        const pct = 82 + Math.round((done / total) * 15);
        updateJob(jobId, { progress: pct });
        job.updateProgress(pct).catch(() => {});
      });

      // ── Step 8: Finalize ──────────────────────────────────────────────────
      const compositedMap = new Map(composited.map(c => [c.contentPieceId, c]));
      const finalPieces: ContentPiece[] = contentPieces.map(piece => ({
        ...piece,
        status:    compositedMap.has(piece.id) ? ('complete' as const) : ('failed' as const),
        outputUrl: compositedMap.get(piece.id)?.finalPath,
      }));

      updateJob(jobId, {
        status:        'complete',
        progress:      100,
        contentPieces: finalPieces,
        completedAt:   new Date(),
      });
      await job.updateProgress(100);

      await closeBrowser();
      return { jobId, totalPieces: finalPieces.length };
    } catch (err) {
      const message = (err as Error).message ?? 'Unknown error';
      updateJob(jobId, { status: 'failed', error: message });
      await closeBrowser();
      throw err;
    }
  },
  { connection, concurrency: 2 },
);

worker.on('failed', (job, err) => {
  console.error(`[content-worker] Job ${job?.id} failed:`, err.message);
});

worker.on('completed', (job) => {
  console.log(`[content-worker] Job ${job.id} completed`);
});

export { worker };

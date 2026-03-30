import { Worker, Job } from 'bullmq';
import { scrapeUrl }              from '../lib/scraper';
import { analyzeBrand }           from '../lib/brand-analyzer';
import { generateCopy }           from '../lib/copy-generator';
import { generateImagePrompts }   from '../lib/image-prompter';
import { generateImages }         from '../lib/image-generator';
import { renderBatch }            from '../lib/template-renderer';
import { compositeBatch }         from '../lib/compositor';
import { generateLandingPage }    from '../lib/landing-page-generator';
import { generateEmailSequences } from '../lib/email-sequence-generator';
import { generateCalendar, exportToCSV } from '../lib/content-calendar';
import { ENV, QUEUE_NAME }        from '../config/constants';
import type { GenerationJob }     from '../types';

// In-memory job store (swap for Redis/DB in production)
export const jobStore = new Map<string, GenerationJob>();

function update(jobId: string, patch: Partial<GenerationJob>) {
  const existing = jobStore.get(jobId);
  if (existing) jobStore.set(jobId, { ...existing, ...patch });
}

export const worker = new Worker(
  QUEUE_NAME,
  async (job: Job<{ jobId: string; url: string }>) => {
    const { jobId, url } = job.data;
    console.log(`[worker] Starting job ${jobId} for ${url}`);

    try {
      // ── Step 1: Scrape (0-10%) ───────────────────────────────────────────
      update(jobId, { status: 'scraping', progress: 5 });
      const scrapedData = await scrapeUrl(url);
      update(jobId, { progress: 10 });

      // ── Step 2: Brand analysis (10-25%) ──────────────────────────────────
      update(jobId, { status: 'analyzing', progress: 15 });
      const brandProfile = await analyzeBrand(scrapedData);
      brandProfile.websiteUrl = url;
      update(jobId, { brandProfile, progress: 25 });

      // ── Step 3: Copy generation (25-40%) ─────────────────────────────────
      update(jobId, { status: 'generating-copy', progress: 30 });
      const contentPieces = await generateCopy(brandProfile);
      update(jobId, { contentPieces, totalPieces: contentPieces.length, progress: 40 });

      // ── Step 4: Image prompts (40-50%) ───────────────────────────────────
      update(jobId, { progress: 42 });
      const imagePrompts = await generateImagePrompts(brandProfile, contentPieces);
      update(jobId, { progress: 50 });

      // ── Step 5: Image generation (50-65%) ────────────────────────────────
      update(jobId, { status: 'generating-images', progress: 52 });
      const generatedImages = await generateImages(imagePrompts, (done, total) => {
        update(jobId, { progress: 52 + Math.round((done / total) * 13) });
      });
      update(jobId, { progress: 65 });

      // ── Step 6: Template rendering (65-75%) ──────────────────────────────
      update(jobId, { status: 'rendering', progress: 67 });
      const rendered = await renderBatch(contentPieces, brandProfile);
      update(jobId, { progress: 75 });

      // ── Step 7: Compositing (75-85%) ─────────────────────────────────────
      update(jobId, { status: 'compositing', progress: 77 });
      const composited = await compositeBatch(rendered, generatedImages);
      // Attach output URLs to content pieces
      const finalPieces = contentPieces.map(p => ({
        ...p,
        outputUrl: composited.find(c => c.id === p.id)?.outputPath ?? undefined,
        status: 'complete' as const,
      }));
      update(jobId, { contentPieces: finalPieces, progress: 85 });

      // ── Step 8: Landing page (85-88%) ────────────────────────────────────
      update(jobId, { progress: 86 });
      let landingPageHtml = '';
      try {
        landingPageHtml = await generateLandingPage(brandProfile, finalPieces);
      } catch (err) {
        console.warn('[worker] Landing page generation failed:', (err as Error).message);
      }
      update(jobId, { progress: 88 });

      // ── Step 9: Email sequences (88-92%) ─────────────────────────────────
      update(jobId, { progress: 89 });
      let emailSequences: Awaited<ReturnType<typeof generateEmailSequences>> = [];
      try {
        emailSequences = await generateEmailSequences(brandProfile);
      } catch (err) {
        console.warn('[worker] Email sequence generation failed:', (err as Error).message);
      }
      update(jobId, { progress: 92 });

      // ── Step 10: Content calendar (92-95%) ───────────────────────────────
      update(jobId, { progress: 93 });
      const calendar    = generateCalendar(finalPieces);
      const calendarCsv = exportToCSV(calendar);
      update(jobId, { progress: 95 });

      // ── Step 11: Finalize (95-100%) ───────────────────────────────────────
      update(jobId, {
        status:       'complete',
        progress:     100,
        completedAt:  new Date(),
        contentPieces: finalPieces,
        // Store extras in a type-safe way via cast
        ...(({
          landingPageHtml,
          emailSequences,
          calendar,
          calendarCsv,
        }) => ({ landingPageHtml, emailSequences, calendar, calendarCsv } as unknown as Partial<GenerationJob>))({
          landingPageHtml,
          emailSequences,
          calendar,
          calendarCsv,
        }),
      });

      console.log(`[worker] ✅ Job ${jobId} complete — ${finalPieces.length} pieces`);

    } catch (err) {
      const message = (err as Error).message;
      console.error(`[worker] ❌ Job ${jobId} failed:`, message);
      update(jobId, { status: 'failed', error: message });
      throw err;
    }
  },
  {
    connection: { host: ENV.REDIS_HOST, port: ENV.REDIS_PORT },
    concurrency: 2,
  },
);

worker.on('failed', (job, err) => {
  console.error(`[worker] Job ${job?.id} failed:`, err.message);
});

import { NextRequest, NextResponse } from 'next/server';
import { jobStore } from '../../../workers/content-worker';

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');
  if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 });

  const job = jobStore.get(jobId) as (typeof jobStore extends Map<string, infer V> ? V : never) & {
    landingPageHtml?: string;
    emailSequences?: unknown[];
    calendar?: unknown;
    calendarCsv?: string;
  } | undefined;

  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  if (job.status !== 'complete') return NextResponse.json({ error: 'Job not complete', status: job.status }, { status: 202 });

  const startedAt = job.createdAt ?? new Date();
  const completedAt = job.completedAt ?? new Date();
  const generationTimeSeconds = Math.round((completedAt.getTime() - startedAt.getTime()) / 1000);

  return NextResponse.json({
    jobId,
    brandProfile:  job.brandProfile,
    contentPieces: job.contentPieces,
    landingPage: {
      html:      job.landingPageHtml ?? '',
      editorUrl: `/page-builder?jobId=${jobId}`,
    },
    emailSequences: job.emailSequences ?? [],
    calendar: {
      calendarData:    job.calendar ?? null,
      csvDownloadUrl:  `/api/content/calendar-csv?jobId=${jobId}`,
      jsonDownloadUrl: `/api/content/calendar-json?jobId=${jobId}`,
    },
    stats: {
      totalPieces:          job.contentPieces?.length ?? 0,
      socialPosts:          job.contentPieces?.filter(p => p.platform !== 'email').length ?? 0,
      emailsGenerated:      (job.emailSequences as unknown[])?.length ?? 0,
      landingPageGenerated: !!(job.landingPageHtml),
      generationTimeSeconds,
    },
  });
}

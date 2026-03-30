import { NextRequest, NextResponse } from 'next/server';
import { jobStore } from '../../workers/content-worker';

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const job = jobStore.get(jobId);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({
    jobId:       job.id,
    status:      job.status,
    progress:    job.progress,
    totalPieces: job.totalPieces,
    completedAt: job.completedAt ?? null,
    error:       job.error ?? null,
  });
}

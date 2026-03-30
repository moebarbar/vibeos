import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { contentQueue, jobStore } from '../../workers/content-worker';
import type { GenerationJob } from '../../types';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url?: string };

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'URL must use http or https' }, { status: 400 });
    }

    const jobId = randomUUID();

    const job: GenerationJob = {
      id:            jobId,
      url,
      status:        'queued',
      contentPieces: [],
      progress:      0,
      totalPieces:   0,
      createdAt:     new Date(),
    };
    jobStore.set(jobId, job);

    await contentQueue.add('generate', { jobId, url }, {
      jobId,
      attempts: 1,
      removeOnComplete: { count: 50 },
      removeOnFail:     { count: 20 },
    });

    return NextResponse.json({ jobId, status: 'queued' }, { status: 202 });
  } catch (err) {
    console.error('[generate/route]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import { jobStore } from '../../workers/content-worker';

export async function GET(req: NextRequest) {
  const jobId  = req.nextUrl.searchParams.get('jobId');
  const page   = parseInt(req.nextUrl.searchParams.get('page')  ?? '1', 10);
  const limit  = parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10);
  const platform = req.nextUrl.searchParams.get('platform');

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const job = jobStore.get(jobId);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (job.status !== 'complete') {
    return NextResponse.json({ error: `Job is not complete (status: ${job.status})` }, { status: 409 });
  }

  let pieces = job.contentPieces.filter(p => p.status === 'complete');
  if (platform) pieces = pieces.filter(p => p.platform === platform);

  const total    = pieces.length;
  const safePage = Math.max(1, page);
  const safeLimit= Math.min(100, Math.max(1, limit));
  const offset   = (safePage - 1) * safeLimit;
  const paginated = pieces.slice(offset, offset + safeLimit);

  // Convert local file paths to base64 data URIs so the frontend can display them
  const withImages = paginated.map(piece => {
    let imageData: string | null = null;
    if (piece.outputUrl && fs.existsSync(piece.outputUrl)) {
      try {
        const buf = fs.readFileSync(piece.outputUrl);
        imageData = `data:image/png;base64,${buf.toString('base64')}`;
      } catch {
        // skip
      }
    }
    return {
      id:          piece.id,
      platform:    piece.platform,
      contentType: piece.contentType,
      angle:       piece.angle,
      headline:    piece.headline,
      body:        piece.body,
      cta:         piece.cta,
      templateId:  piece.templateId,
      dimensions:  piece.dimensions,
      imageData,
    };
  });

  return NextResponse.json({
    jobId,
    total,
    page:        safePage,
    limit:       safeLimit,
    hasMore:     offset + safeLimit < total,
    pieces:      withImages,
    brandProfile: job.brandProfile ?? null,
  });
}

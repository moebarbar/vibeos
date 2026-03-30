import { NextRequest, NextResponse } from 'next/server';
import { deployToCloudflare } from '../../lib/deployer';

export async function POST(req: NextRequest) {
  try {
    const { html, css, slug, customDomain } = await req.json() as {
      html: string; css: string; slug: string; customDomain?: string;
    };

    if (!html || !slug) return NextResponse.json({ error: 'html and slug required' }, { status: 400 });

    const projectName = `cmkt-${slug}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const url = await deployToCloudflare(html, css ?? '', projectName);

    return NextResponse.json({ url, status: 'deployed', projectName });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const url    = req.nextUrl;
  const action = url.searchParams.get('action') ?? (await req.json().then((b: { action?: string }) => b.action).catch(() => ''));
  const body   = await req.json().catch(() => ({})) as Record<string, unknown>;

  try {
    if (action === 'rewrite-copy' || url.pathname.includes('rewrite-copy')) {
      const { text, action: copyAction, brandProfile } = body as { text: string; action: string; brandProfile?: unknown };
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514', max_tokens: 500,
        messages: [{ role: 'user', content: `Rewrite this text (action: "${copyAction}"). Brand context: ${JSON.stringify(brandProfile)}. Give 3 short variants as JSON array of strings. Text: "${text}"` }],
      });
      const raw = (response.content[0] as Anthropic.TextBlock).text;
      const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/im,'').replace(/\s*```\s*$/im,'').trim()) as string[];
      return NextResponse.json({ variants: parsed });
    }

    if (action === 'generate-section' || url.pathname.includes('generate-section')) {
      const { prompt, brandProfile } = body as { prompt: string; brandProfile?: unknown };
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514', max_tokens: 2000,
        messages: [{ role: 'user', content: `Generate a single HTML section using Tailwind CSS for this request: "${prompt}". Brand: ${JSON.stringify(brandProfile)}. Return ONLY the HTML section, no doctype, no explanation.` }],
      });
      return NextResponse.json({ html: (response.content[0] as Anthropic.TextBlock).text });
    }

    if (action === 'cro-audit' || url.pathname.includes('cro-audit')) {
      const { html } = body as { html: string };
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514', max_tokens: 1000,
        messages: [{ role: 'user', content: `Audit this landing page HTML for CRO issues. Return JSON: { "score": 0-100, "issues": [{"description": "...", "fix": "..."}] }. HTML: ${html.slice(0, 3000)}` }],
      });
      const raw = (response.content[0] as Anthropic.TextBlock).text;
      return NextResponse.json(JSON.parse(raw.replace(/^```(?:json)?\s*/im,'').replace(/\s*```\s*$/im,'').trim()));
    }

    if (action === 'seo-check' || url.pathname.includes('seo-check')) {
      const { html } = body as { html: string };
      const hasTitle = html.includes('<title');
      const hasMeta  = html.includes('name="description"');
      const hasH1    = html.includes('<h1');
      const hasOg    = html.includes('og:title');
      const issues: { description: string }[] = [];
      if (!hasTitle)  issues.push({ description: 'Missing <title> tag' });
      if (!hasMeta)   issues.push({ description: 'Missing meta description' });
      if (!hasH1)     issues.push({ description: 'No H1 tag found' });
      if (!hasOg)     issues.push({ description: 'Missing Open Graph tags' });
      const score = Math.max(0, 100 - issues.length * 15);
      return NextResponse.json({ score, issues });
    }

    if (action === 'generate-image' || url.pathname.includes('generate-image')) {
      const { prompt } = body as { prompt: string };
      const { fal } = await import('@fal-ai/client');
      fal.config({ credentials: process.env.FAL_KEY ?? '' });
      const result = await fal.subscribe('fal-ai/flux/dev', {
        input: { prompt, image_size: 'square_hd', num_images: 1 },
      }) as unknown as { images: { url: string }[] };
      return NextResponse.json({ url: result.images[0].url });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

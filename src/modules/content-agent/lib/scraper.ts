import { FirecrawlClient } from '@mendable/firecrawl-js';
import * as cheerio from 'cheerio';
import { ENV } from '../config/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrapedData {
  url: string;
  markdown: string;
  title: string;
  description: string;
  ogImage?: string;
  images: string[];
  extractedColors: string[];
  testimonials: string[];
  metadata: Record<string, string>;
}

// ─── Color extraction ─────────────────────────────────────────────────────────

export function extractColorsFromHTML(html: string): string[] {
  const colors = new Set<string>();
  const skip = new Set(['#000', '#000000', '#fff', '#ffffff', '#cccccc', '#999999', '#333333', '#666666']);

  // Hex colors
  const hexMatches = Array.from(html.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g));
  for (const match of hexMatches) {
    const hex = match[0].toLowerCase();
    if (!skip.has(hex)) {
      colors.add(hex.length === 4 ? expandShortHex(hex) : hex);
    }
  }

  // rgb/rgba — skip grey values
  const rgbMatches = Array.from(html.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g));
  for (const match of rgbMatches) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    if (Math.abs(r - g) >= 15 || Math.abs(g - b) >= 15) {
      colors.add(rgbToHex(r, g, b));
    }
  }

  // CSS custom properties with color-related names
  const varMatches = Array.from(html.matchAll(/--[\w-]*(?:color|brand|primary|secondary|accent|bg|background)[\w-]*\s*:\s*(#[0-9a-fA-F]{3,6})/gi));
  for (const match of varMatches) {
    colors.add(match[1].toLowerCase());
  }

  return Array.from(colors).slice(0, 6);
}

function expandShortHex(hex: string): string {
  return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── Testimonial extraction ───────────────────────────────────────────────────

function extractTestimonials(html: string): string[] {
  const $ = cheerio.load(html);
  const found = new Set<string>();

  const selectors = [
    '[class*="testimonial"]',
    '[class*="review"]',
    '[class*="quote"]',
    'blockquote',
    '[class*="feedback"]',
    '[data-testid*="testimonial"]',
  ];

  for (const sel of selectors) {
    $(sel).each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (text.length > 30 && text.length < 500) found.add(text);
    });
  }

  // Star rating patterns followed by review text
  const bodyText = $('body').text();
  const starMatches = Array.from(bodyText.matchAll(/[★⭐]{3,5}\s*(.{30,300})/g));
  for (const match of starMatches) {
    found.add(match[1].trim());
  }

  return Array.from(found).slice(0, 10);
}

// ─── Open Graph / meta extraction ────────────────────────────────────────────

function extractOpenGraph(html: string): Record<string, string> {
  const $ = cheerio.load(html);
  const og: Record<string, string> = {};

  $('meta').each((_, el) => {
    const property = $(el).attr('property') || $(el).attr('name') || '';
    const content  = $(el).attr('content') || '';
    if ((property.startsWith('og:') || property.startsWith('twitter:')) && content) {
      og[property] = content;
    }
  });

  if (!og['og:title'])       og['og:title']       = $('title').first().text().trim();
  if (!og['og:description']) og['og:description'] = $('meta[name="description"]').attr('content') ?? '';

  return og;
}

// ─── Image extraction ─────────────────────────────────────────────────────────

function extractImages(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const images: string[] = [];
  const base = new URL(baseUrl);

  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) images.push(ogImage);

  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    if (!src) return;
    try {
      const absolute = src.startsWith('http') ? src : new URL(src, base).href;
      const w = parseInt($(el).attr('width') ?? '9999');
      const h = parseInt($(el).attr('height') ?? '9999');
      if (w < 50 || h < 50) return;
      if (!/\.(svg|gif|ico)$/i.test(absolute)) images.push(absolute);
    } catch { /* skip malformed URLs */ }
  });

  return Array.from(new Set(images)).slice(0, 20);
}

// ─── Firecrawl path ───────────────────────────────────────────────────────────

async function scrapeWithFirecrawl(url: string): Promise<ScrapedData> {
  console.log('[scraper] 🔥 Using Firecrawl...');
  const client = new FirecrawlClient({ apiKey: ENV.FIRECRAWL_API_KEY });

  const result = await Promise.race([
    client.scrape(url, { formats: ['markdown', 'html'] }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firecrawl timeout after 30s')), 30_000)
    ),
  ]);

  const html     = (result as unknown as { html?: string }).html ?? '';
  const markdown = (result as unknown as { markdown?: string }).markdown ?? '';
  const og       = extractOpenGraph(html);

  console.log(`[scraper] ✅ Firecrawl done — ${markdown.length} chars, ${extractImages(html, url).length} images`);

  return {
    url,
    markdown,
    title:           og['og:title']       ?? '',
    description:     og['og:description'] ?? '',
    ogImage:         og['og:image'],
    images:          extractImages(html, url),
    extractedColors: extractColorsFromHTML(html),
    testimonials:    extractTestimonials(html),
    metadata:        og,
  };
}

// ─── Fetch + cheerio fallback ─────────────────────────────────────────────────

async function scrapeWithFetch(url: string): Promise<ScrapedData> {
  console.log('[scraper] 🌐 Using fetch + cheerio fallback...');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  let html = '';
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContentAgent/1.0)',
        'Accept':     'text/html,application/xhtml+xml',
      },
    });
    html = await res.text();
  } finally {
    clearTimeout(timer);
  }

  const $ = cheerio.load(html);
  $('script, style, nav, footer, header').remove();

  let markdown = '';
  $('h1, h2, h3, h4, p, li').each((_, el) => {
    const tag  = el.type === 'tag' ? (el as cheerio.Element).name : '';
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (!text) return;
    if      (tag === 'h1') markdown += `# ${text}\n\n`;
    else if (tag === 'h2') markdown += `## ${text}\n\n`;
    else if (tag === 'h3') markdown += `### ${text}\n\n`;
    else if (tag === 'li') markdown += `- ${text}\n`;
    else                   markdown += `${text}\n\n`;
  });

  const og = extractOpenGraph(html);

  console.log(`[scraper] ✅ Fetch fallback done — ${markdown.length} chars`);

  return {
    url,
    markdown:        markdown.trim() || $('body').text().replace(/\s+/g, ' ').trim(),
    title:           og['og:title']       ?? '',
    description:     og['og:description'] ?? '',
    ogImage:         og['og:image'],
    images:          extractImages(html, url),
    extractedColors: extractColorsFromHTML(html),
    testimonials:    extractTestimonials(html),
    metadata:        og,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function scrapeUrl(url: string): Promise<ScrapedData> {
  console.log(`[scraper] Starting scrape: ${url}`);

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('URL must use http or https');
    }
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  if (ENV.FIRECRAWL_API_KEY) {
    try {
      return await scrapeWithFirecrawl(url);
    } catch (err) {
      console.warn(`[scraper] ⚠️  Firecrawl failed — falling back to fetch: ${(err as Error).message}`);
    }
  } else {
    console.warn('[scraper] ⚠️  No FIRECRAWL_API_KEY — using fetch fallback');
  }

  return scrapeWithFetch(url);
}

// ─── CLI test ─────────────────────────────────────────────────────────────────
// Usage: npx tsx src/modules/content-agent/lib/scraper.ts https://example.com

if (process.argv[1]?.endsWith('scraper.ts')) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: npx tsx src/modules/content-agent/lib/scraper.ts <url>');
    process.exit(1);
  }

  scrapeUrl(url)
    .then((data) => {
      console.log('\n──────────── SCRAPE RESULT ────────────');
      console.log('Title:       ', data.title);
      console.log('Description: ', data.description);
      console.log('OG Image:    ', data.ogImage ?? 'none');
      console.log('Images:      ', data.images.length);
      console.log('Colors:      ', data.extractedColors.join(', ') || 'none');
      console.log('Testimonials:', data.testimonials.length);
      console.log('Markdown:    ', data.markdown.length, 'chars');
      console.log('\n--- First 600 chars of markdown ---\n');
      console.log(data.markdown.slice(0, 600));
      if (data.testimonials.length) {
        console.log('\n--- Testimonials ---');
        data.testimonials.forEach((t, i) => console.log(`${i + 1}. ${t.slice(0, 120)}`));
      }
      console.log('\n--- OG Metadata ---');
      console.log(JSON.stringify(data.metadata, null, 2));
    })
    .catch((err) => {
      console.error('[scraper] Fatal:', err);
      process.exit(1);
    });
}

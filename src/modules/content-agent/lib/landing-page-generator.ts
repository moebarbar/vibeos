import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/constants';
import type { BrandProfile, ContentPiece } from '../types';

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an elite landing page designer and conversion rate optimization expert. You create landing pages that convert at 5-10x industry average. You write clean, semantic HTML with Tailwind CSS utility classes.

DESIGN PRINCIPLES:
- Modern, clean aesthetic — inspired by the best SaaS landing pages (Linear, Vercel, Stripe)
- Dark mode by default with subtle gradients and glows
- Generous whitespace, clear visual hierarchy
- Mobile-first responsive design using Tailwind breakpoints
- Smooth scroll behavior
- Intersection Observer animations (fade-in on scroll)
- System font stack for fast loading

PAGE STRUCTURE (in this exact order):
1. NAVIGATION BAR — Logo text + 3-4 nav links + CTA button (sticky)
2. HERO SECTION — Large headline (h1), subheadline (p), primary CTA button, secondary CTA link, hero SVG illustration or gradient graphic
3. SOCIAL PROOF BAR — 'Trusted by' stat counters (e.g., '10,000+ users', '99% uptime', '4.9★ rating')
4. FEATURES SECTION — 3-column grid with inline SVG icon, title, description per feature
5. HOW IT WORKS — 3-step numbered process with connecting lines
6. BENEFITS SECTION — Alternating left-right layout: content + visual blocks
7. TESTIMONIALS — 3 testimonial cards with quote, name, role, star rating
8. PRICING SECTION — 2-3 tier cards with highlighted "popular" tier
9. FAQ SECTION — Accordion with 5-6 questions, vanilla JS toggle
10. FINAL CTA — Full-width banner with headline + CTA button
11. FOOTER — Logo, nav links, social icons, copyright

TECHNICAL REQUIREMENTS:
- Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- All styles via Tailwind utility classes
- Inline SVGs for all icons (no external icon libraries)
- Vanilla JavaScript only for interactions (FAQ accordion, mobile menu, scroll animations)
- Single file — everything in one .html file
- Include <meta> tags: title, description, og:title, og:description, viewport
- Include JSON-LD schema markup for the business
- Semantic HTML: proper heading hierarchy, <nav>, <main>, <section>, <footer>
- All images use branded gradient placeholder divs
- Smooth scroll for anchor links
- Mobile hamburger menu (vanilla JS)

VISUAL ELEMENTS:
- Radial gradient glow backgrounds on hero (CSS only, no images)
- Subtle dot grid pattern overlay using CSS background-image
- Decorative SVG shapes (circles, rings) with low opacity
- Animated gradient border on primary CTA button (CSS animation)
- Card hover effects with slight scale + shadow transition
- Intersection Observer fade-in animations for sections

COLOR MAPPING:
- primaryColor variable → main accent (buttons, links, highlights, borders)
- secondaryColor variable → secondary elements
- Dark background: bg-slate-950 and bg-slate-900
- Text: white for headings, slate-300 for body, slate-500 for muted
- Inject brand colors as CSS custom properties: --brand-primary, --brand-secondary, --brand-accent

Return ONLY the complete HTML starting with <!DOCTYPE html>. No explanation. No markdown backticks.`;

function buildUserPrompt(brandProfile: BrandProfile, contentPieces: ContentPiece[]): string {
  const topValueProps  = brandProfile.valuePropositions.slice(0, 3);
  const topFeatures    = brandProfile.keyFeatures.slice(0, 3);
  const topTestimonial = brandProfile.socialProof[0] ?? '';

  return `Generate a complete, production-quality landing page for this brand:

BRAND PROFILE:
${JSON.stringify({ ...brandProfile, productScreenshots: [] }, null, 2)}

TOP 3 VALUE PROPOSITIONS:
${topValueProps.map((v, i) => `${i + 1}. ${v}`).join('\n')}

TOP 3 FEATURES:
${topFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

TESTIMONIAL:
"${topTestimonial}"

PRIMARY CTA:
${brandProfile.ctaText}

SAMPLE HEADLINES (use the best one or write a better variant):
${contentPieces
  .filter(p => p.platform === 'instagram' || p.platform === 'linkedin')
  .slice(0, 3)
  .map(p => `- ${p.headline}`)
  .join('\n')}

Generate the full landing page HTML now.`;
}

async function callClaude(systemPrompt: string, userPrompt: string, maxTokens = 8000): Promise<string> {
  const response = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  });
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');
}

function isValidHtml(html: string): boolean {
  const trimmed = html.trim().toLowerCase();
  return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html');
}

function isTruncated(html: string): boolean {
  return !html.trim().toLowerCase().includes('</html>');
}

export async function generateLandingPage(
  brandProfile: BrandProfile,
  contentPieces: ContentPiece[],
): Promise<string> {
  console.log(`[landing-page-generator] Generating landing page for: ${brandProfile.name}`);

  const userPrompt = buildUserPrompt(brandProfile, contentPieces);
  let html = await callClaude(SYSTEM_PROMPT, userPrompt, 8000);

  // Strip markdown backticks if present
  html = html
    .replace(/^```(?:html)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim();

  if (!isValidHtml(html)) {
    throw new Error('Generated HTML does not start with <!DOCTYPE html> or <html>');
  }

  // If truncated, request continuation
  if (isTruncated(html)) {
    console.log('[landing-page-generator] HTML was truncated — requesting continuation');
    const continuation = await callClaude(
      SYSTEM_PROMPT,
      `${userPrompt}\n\nThe HTML was truncated. Please continue from where you left off, starting with the last complete tag. Start with the unclosed section and complete the page through </html>.`,
      4000,
    );
    html = html + '\n' + continuation
      .replace(/^```(?:html)?\s*/im, '')
      .replace(/\s*```\s*$/im, '')
      .trim();
  }

  console.log(`[landing-page-generator] Generated ${html.length} chars of HTML`);
  return html;
}

export async function generateLandingPageVariants(
  brandProfile: BrandProfile,
  contentPieces: ContentPiece[],
  count = 2,
): Promise<string[]> {
  console.log(`[landing-page-generator] Generating ${count} variants`);

  const variantInstructions = [
    'Use a hero with a large centered headline, gradient mesh background, and floating decorative circles.',
    'Use a split-screen hero: left side has text + CTA, right side has a dark card mockup or SVG illustration.',
    'Use a minimal hero with extra-large typography, a single accent line, and maximum whitespace.',
  ];

  const variants = await Promise.all(
    Array.from({ length: count }, async (_, i) => {
      const instruction = variantInstructions[i % variantInstructions.length];
      const userPrompt = `${buildUserPrompt(brandProfile, contentPieces)}\n\nHERO VARIANT INSTRUCTION: ${instruction}`;
      let html = await callClaude(SYSTEM_PROMPT, userPrompt, 8000);
      html = html.replace(/^```(?:html)?\s*/im, '').replace(/\s*```\s*$/im, '').trim();
      return html;
    }),
  );

  return variants;
}

/**
 * End-to-end test script for the content agent pipeline.
 * Run with: npx tsx src/modules/content-agent/scripts/test-pipeline.ts https://example.com
 */
import { scrapeUrl } from '../lib/scraper';
import { analyzeBrand } from '../lib/brand-analyzer';
import { generateCopy } from '../lib/copy-generator';
import { generateImagePrompts } from '../lib/image-prompter';
import { generateImages } from '../lib/image-generator';
import { renderTemplate, closeBrowser } from '../lib/template-renderer';
import { composite } from '../lib/compositor';

const url = process.argv[2];
if (!url) {
  console.error('Usage: npx tsx test-pipeline.ts <url>');
  process.exit(1);
}

async function run() {
  console.log('\n[1/6] Scraping:', url);
  const scraped = await scrapeUrl(url);
  console.log('  title:', scraped.title);
  console.log('  colors:', scraped.extractedColors.slice(0, 3));

  console.log('\n[2/6] Analyzing brand…');
  const brand = await analyzeBrand(scraped);
  console.log('  name:', brand.name);
  console.log('  primaryColor:', brand.primaryColor);
  console.log('  tone:', brand.tone);

  console.log('\n[3/6] Generating copy…');
  const pieces = await generateCopy(brand);
  console.log(`  generated ${pieces.length} pieces`);
  console.log('  sample headline:', pieces[0]?.headline);

  console.log('\n[4/6] Generating image prompts…');
  const prompts = await generateImagePrompts(brand, pieces);
  console.log(`  prompts for ${prompts.length} pieces`);

  console.log('\n[5/6] Generating images (first 3 only for test)…');
  const images = await generateImages(prompts.slice(0, 3));
  const imageMap = new Map(images.map(img => [img.contentPieceId, img]));
  console.log(`  generated ${images.length} images`);

  console.log('\n[6/6] Rendering + compositing first piece…');
  const first = pieces[0];
  const rendered = await renderTemplate(first, { brandProfile: brand, content: first });
  console.log('  rendered to:', rendered.localPath);

  const image = imageMap.get(first.id) ?? null;
  const composited = await composite(rendered, image, image ? 'background' : 'template-only');
  console.log('  composited to:', composited.finalPath);
  console.log('  thumbnail:    ', composited.thumbnailPath);

  await closeBrowser();
  console.log('\nPipeline test complete!');
}

run().catch(err => {
  console.error('Pipeline test failed:', err);
  process.exit(1);
});

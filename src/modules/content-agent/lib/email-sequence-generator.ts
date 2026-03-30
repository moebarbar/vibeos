import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../config/constants';
import type { BrandProfile } from '../types';

const client = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });

export interface Email {
  sequenceType: 'welcome' | 'nurture' | 'abandoned';
  emailNumber:  number;
  sendDay:      number;
  subjectLine:  string;
  previewText:  string;
  bodyHtml:     string;
  bodyPlainText: string;
  ctaText:      string;
  ctaUrl:       string;
}

export type EmailSequence = Email;

const SYSTEM_PROMPT = `You are an email marketing expert who has written sequences generating millions in revenue. You write emails that people actually open, read, and click.

SEQUENCE TYPES TO GENERATE:

1. WELCOME SEQUENCE (5 emails, sent over 7 days):
   Email 1 (Day 0): Welcome + quick win + set expectations
   Email 2 (Day 1): The #1 problem you solve + social proof
   Email 3 (Day 3): How it works + case study or example
   Email 4 (Day 5): Overcome objection + FAQ
   Email 5 (Day 7): Direct CTA + urgency/bonus

2. NURTURE SEQUENCE (5 emails, sent over 14 days):
   Email 1: Educational content related to their pain point
   Email 2: Framework or methodology they can use today
   Email 3: Common mistakes to avoid
   Email 4: Results story (before/after)
   Email 5: Soft pitch + special offer

3. ABANDONED CART / TRIAL EXPIRY (3 emails):
   Email 1 (Day 0): Reminder + what they're missing
   Email 2 (Day 2): Social proof + overcome objections
   Email 3 (Day 5): Final urgency + special offer

EMAIL HTML RULES:
- Use tables for layout (email client compatibility)
- Inline CSS only (no <style> tags)
- Max width 600px, single-column
- System fonts only (Arial, Helvetica, Georgia)
- CTA button: table-based button (not just <a> with CSS)
- Include unsubscribe link placeholder at bottom
- Include view-in-browser link at top
- Responsive: use max-width with width:100% pattern

Return a JSON array of all 13 emails with this structure:
[{
  "sequenceType": "welcome|nurture|abandoned",
  "emailNumber": 1,
  "sendDay": 0,
  "subjectLine": "under 50 chars",
  "previewText": "under 90 chars",
  "bodyHtml": "complete standalone email HTML",
  "bodyPlainText": "plain text version",
  "ctaText": "Button text",
  "ctaUrl": "URL with UTM params"
}]

Return ONLY the JSON array. No backticks, no explanation.`;

function parseEmails(text: string): Email[] {
  const cleaned = text.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/im, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error('Response is not array');
  return parsed as Email[];
}

export async function generateEmailSequences(brandProfile: BrandProfile): Promise<EmailSequence[]> {
  console.log(`[email-sequence-generator] Generating sequences for: ${brandProfile.name}`);

  const userPrompt = `Generate all 13 emails (welcome + nurture + abandoned sequences) for this brand:\n\n${JSON.stringify(brandProfile, null, 2)}\n\nMake every subject line specific to their business. Use their actual product name, value props, and CTAs throughout.`;

  const response = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system:     SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: userPrompt }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');

  const emails = parseEmails(text);
  console.log(`[email-sequence-generator] Generated ${emails.length} emails`);
  return emails;
}

export async function generateSingleEmail(
  brandProfile: BrandProfile,
  type: 'welcome' | 'nurture' | 'abandoned',
  context: string,
): Promise<Email> {
  const response = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system:     SYSTEM_PROMPT,
    messages:   [{
      role: 'user',
      content: `Generate a SINGLE ${type} email for this brand. Context: ${context}\n\nBrand: ${JSON.stringify(brandProfile, null, 2)}\n\nReturn a JSON object (not array) for one email.`,
    }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');

  const cleaned = text.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/im, '').trim();
  return JSON.parse(cleaned) as Email;
}

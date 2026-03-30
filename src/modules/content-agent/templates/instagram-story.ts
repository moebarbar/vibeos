import type { TemplateConfig, TemplateData } from '../types';

const base = (content: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
</style></head><body>${content}</body></html>`.trim();

// ─── Variant 1: centered-ring ─────────────────────────────────────────────────

function centeredRing(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name } = d.brandProfile;
  const { headline, body, cta } = d.content;

  return base(`
<div style="width:1080px;height:1920px;background:linear-gradient(180deg,#080818 0%,#0d0d2b 50%,#080818 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:80px">
  <!-- Concentric rings -->
  <svg style="position:absolute;top:50%;left:50%;transform:translate(-50%,-55%)" width="900" height="900" viewBox="0 0 900 900">
    ${[420,340,260,180,100].map((r,i) => `
    <circle cx="450" cy="450" r="${r}" fill="none" stroke="${i % 2 === 0 ? primaryColor : accentColor}" stroke-width="${i === 0 ? 1 : 0.5}" opacity="${0.08 + i * 0.04}"/>
    `).join('')}
    <circle cx="450" cy="450" r="60" fill="${primaryColor}" opacity="0.25"/>
    <circle cx="450" cy="450" r="30" fill="${primaryColor}" opacity="0.7"/>
    <!-- Orbit dot -->
    <circle cx="${450 + 260}" cy="450" r="12" fill="${accentColor}" opacity="0.9"/>
    <circle cx="${450 - 180}" cy="${450 - 180}" r="8" fill="${secondaryColor}" opacity="0.7"/>
  </svg>
  <!-- Glow -->
  <div style="position:absolute;top:20%;left:50%;transform:translateX(-50%);width:600px;height:600px;background:radial-gradient(circle,${primaryColor}30 0%,transparent 70%);border-radius:50%"></div>
  <!-- Content -->
  <div style="position:relative;z-index:1;text-align:center;margin-top:520px">
    <div style="font-size:24px;color:${primaryColor};font-weight:700;letter-spacing:4px;text-transform:uppercase;margin-bottom:32px">${name}</div>
    <div style="font-size:72px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:32px">${headline}</div>
    <div style="font-size:32px;color:#94a3b8;line-height:1.6;margin-bottom:60px;max-width:800px">${body.slice(0, 150)}</div>
    <div style="background:${primaryColor};color:#fff;font-size:28px;font-weight:700;padding:24px 64px;border-radius:100px;display:inline-block">${cta}</div>
  </div>
  <!-- Swipe up indicator -->
  <div style="position:absolute;bottom:80px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0.6">
    <div style="font-size:22px;color:#ffffff;letter-spacing:2px;text-transform:uppercase">Swipe Up</div>
    <svg width="30" height="30" viewBox="0 0 30 30"><path d="M15 5 L15 25 M8 18 L15 25 L22 18" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
  </div>
</div>`);
}

// ─── Variant 2: full-bleed ────────────────────────────────────────────────────

function fullBleed(d: TemplateData): string {
  const { primaryColor, accentColor, name } = d.brandProfile;
  const { headline, body, cta } = d.content;

  const words = headline.split(' ');
  const third = Math.ceil(words.length / 3);

  return base(`
<div style="width:1080px;height:1920px;background:#0a0a1a;display:flex;flex-direction:column;justify-content:center;padding:100px;position:relative;overflow:hidden">
  <!-- Diagonal accent bar -->
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;opacity:0.08">
    <div style="position:absolute;top:-200px;right:-200px;width:600px;height:2000px;background:${primaryColor};transform:rotate(15deg)"></div>
  </div>
  <!-- Dot grid top-right -->
  <svg style="position:absolute;top:80px;right:80px;opacity:0.12" width="180" height="180">
    ${Array.from({length:5}, (_,y) => Array.from({length:5}, (_,x) =>
      `<circle cx="${x*36+18}" cy="${y*36+18}" r="4" fill="white"/>`).join('')).join('')}
  </svg>
  <!-- Brand tag -->
  <div style="font-size:22px;color:${primaryColor};font-weight:700;letter-spacing:4px;text-transform:uppercase;margin-bottom:60px;z-index:1">${name}</div>
  <!-- Giant headline spanning full width -->
  <div style="z-index:1">
    ${words.reduce((acc: string[], word, i) => {
      if (i % third === 0) acc.push('');
      acc[acc.length - 1] += (acc[acc.length - 1] ? ' ' : '') + word;
      return acc;
    }, []).map((line, i) => `
    <div style="font-size:${i === 1 ? 100 : 90}px;font-weight:900;color:${i === 1 ? accentColor : '#ffffff'};line-height:0.95;letter-spacing:-4px">${line}</div>`).join('')}
  </div>
  <!-- Divider -->
  <div style="width:100px;height:6px;background:${accentColor};border-radius:3px;margin:50px 0;z-index:1"></div>
  <!-- Body -->
  <div style="font-size:34px;color:#94a3b8;line-height:1.5;max-width:900px;margin-bottom:60px;z-index:1">${body.slice(0, 160)}</div>
  <!-- CTA -->
  <div style="z-index:1">
    <div style="background:${primaryColor};color:#fff;font-size:30px;font-weight:700;padding:26px 72px;border-radius:100px;display:inline-block">${cta}</div>
  </div>
  <!-- Swipe hint -->
  <div style="position:absolute;bottom:80px;right:100px;font-size:20px;color:${primaryColor};font-weight:600;letter-spacing:2px;text-transform:uppercase;opacity:0.7">Swipe Up ↑</div>
</div>`);
}

// ─── Variant 3: step-list ─────────────────────────────────────────────────────

function stepList(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name, valuePropositions } = d.brandProfile;
  const { headline, cta } = d.content;

  const steps = valuePropositions.slice(0, 4).length
    ? valuePropositions.slice(0, 4)
    : ['Step 1: Understand your goals', 'Step 2: Build your strategy', 'Step 3: Execute with precision', 'Step 4: Measure and optimize'];

  const stepColors = [primaryColor, accentColor, secondaryColor, primaryColor];

  return base(`
<div style="width:1080px;height:1920px;background:#0c0c20;display:flex;flex-direction:column;padding:100px;position:relative;overflow:hidden">
  <!-- Background glow -->
  <div style="position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,${primaryColor}20 0%,transparent 70%);border-radius:50%"></div>
  <!-- Brand + headline -->
  <div style="font-size:22px;color:${primaryColor};font-weight:700;letter-spacing:4px;text-transform:uppercase;margin-bottom:40px">${name}</div>
  <div style="font-size:64px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:80px">${headline}</div>
  <!-- Steps -->
  <div style="flex:1;display:flex;flex-direction:column;gap:40px">
    ${steps.map((step, i) => `
    <div style="display:flex;align-items:flex-start;gap:32px">
      <div style="width:72px;height:72px;border-radius:20px;background:${stepColors[i]}20;border:2px solid ${stepColors[i]};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-size:32px;font-weight:900;color:${stepColors[i]}">${i + 1}</span>
      </div>
      <div style="padding-top:12px">
        <div style="font-size:34px;font-weight:700;color:#ffffff;line-height:1.2">${step}</div>
      </div>
    </div>
    ${i < steps.length - 1 ? `<div style="width:2px;height:30px;background:${stepColors[i]}30;margin-left:35px"></div>` : ''}`).join('')}
  </div>
  <!-- CTA at bottom -->
  <div style="margin-top:60px">
    <div style="background:${primaryColor};color:#fff;font-size:30px;font-weight:700;padding:26px 72px;border-radius:100px;display:inline-block">${cta}</div>
  </div>
  <div style="position:absolute;bottom:80px;right:100px;font-size:20px;color:${primaryColor};opacity:0.6;letter-spacing:2px">Swipe Up ↑</div>
</div>`);
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const instagramStoryTemplates: TemplateConfig[] = [
  { id: 'instagram-story-ring',    name: 'Centered Ring', platform: 'instagram', contentType: 'story', dimensions: { width: 1080, height: 1920 }, requiresImage: false, render: centeredRing },
  { id: 'instagram-story-full',    name: 'Full Bleed',    platform: 'instagram', contentType: 'story', dimensions: { width: 1080, height: 1920 }, requiresImage: false, render: fullBleed },
  { id: 'instagram-story-steps',   name: 'Step List',     platform: 'instagram', contentType: 'story', dimensions: { width: 1080, height: 1920 }, requiresImage: false, render: stepList },
  { id: 'instagram-story-split',   name: 'Split (alias)', platform: 'instagram', contentType: 'story', dimensions: { width: 1080, height: 1920 }, requiresImage: true,  render: centeredRing },
  { id: 'instagram-story-minimal', name: 'Minimal (alias)',platform: 'instagram', contentType: 'story', dimensions: { width: 1080, height: 1920 }, requiresImage: false, render: fullBleed },
];

export function getInstagramStoryTemplate(variantId: string): TemplateConfig | undefined {
  return instagramStoryTemplates.find(t => t.id === variantId);
}

export function getRandomInstagramStoryTemplate(): TemplateConfig {
  const base = instagramStoryTemplates.filter(t => !t.name.includes('alias'));
  return base[Math.floor(Math.random() * base.length)];
}

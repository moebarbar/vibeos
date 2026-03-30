import type { TemplateConfig, TemplateData } from '../types';

const base = (content: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:627px;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
</style></head><body>${content}</body></html>`.trim();

// ─── Variant 1: professional-banner ──────────────────────────────────────────

function professionalBanner(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name, industry } = d.brandProfile;
  const { headline, body, cta } = d.content;

  return base(`
<div style="width:1200px;height:627px;background:#0a0a1a;display:grid;grid-template-columns:1fr 480px;position:relative;overflow:hidden">
  <!-- Left content -->
  <div style="padding:60px 50px;display:flex;flex-direction:column;justify-content:center">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px">
      <div style="height:3px;width:40px;background:${primaryColor};border-radius:2px"></div>
      <span style="font-size:14px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase">${industry}</span>
    </div>
    <div style="font-size:40px;font-weight:800;color:#ffffff;line-height:1.15;margin-bottom:20px">${headline}</div>
    <div style="font-size:18px;color:#94a3b8;line-height:1.6;margin-bottom:32px;max-width:580px">${body.slice(0, 140)}</div>
    <div style="display:flex;align-items:center;gap:20px">
      <div style="background:${primaryColor};color:#fff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:100px">${cta}</div>
      <div style="font-size:14px;color:${primaryColor};font-weight:600;letter-spacing:2px;text-transform:uppercase">${name}</div>
    </div>
  </div>
  <!-- Right abstract graphic -->
  <div style="background:#0d0d2b;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
    <svg width="480" height="627" viewBox="0 0 480 627">
      <defs>
        <radialGradient id="lg1"><stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.35"/><stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/></radialGradient>
        <radialGradient id="lg2"><stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/><stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/></radialGradient>
      </defs>
      <circle cx="240" cy="313" r="250" fill="url(#lg1)"/>
      <circle cx="320" cy="200" r="160" fill="url(#lg2)"/>
      ${[200,150,100,50].map(r => `<circle cx="240" cy="313" r="${r}" fill="none" stroke="${primaryColor}" stroke-width="0.5" opacity="0.2"/>`).join('')}
      ${Array.from({length:8}, (_,i) => {
        const a = (i / 8) * Math.PI * 2;
        return `<circle cx="${(240 + Math.cos(a) * 150).toFixed(0)}" cy="${(313 + Math.sin(a) * 150).toFixed(0)}" r="6" fill="${secondaryColor}" opacity="0.6"/>`;
      }).join('')}
      <circle cx="240" cy="313" r="35" fill="${primaryColor}" opacity="0.8"/>
      <circle cx="240" cy="313" r="14" fill="white" opacity="0.9"/>
    </svg>
  </div>
  <!-- Bottom accent line -->
  <div style="position:absolute;bottom:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,${primaryColor},${accentColor},transparent)"></div>
</div>`);
}

// ─── Variant 2: data-card ─────────────────────────────────────────────────────

function dataCard(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name, valuePropositions } = d.brandProfile;
  const { headline, cta } = d.content;

  const stats = [
    { value: '3x',   label: 'Faster Results' },
    { value: '89%',  label: 'Success Rate' },
    { value: '10K+', label: 'Happy Clients' },
  ];

  return base(`
<div style="width:1200px;height:627px;background:#080818;padding:60px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden">
  <!-- Grid lines -->
  <svg style="position:absolute;inset:0;opacity:0.04" width="1200" height="627">
    ${Array.from({length:14}, (_,i) => `<line x1="${i*90}" y1="0" x2="${i*90}" y2="627" stroke="white" stroke-width="1"/>`).join('')}
    ${Array.from({length:8}, (_,i) => `<line x1="0" y1="${i*90}" x2="1200" y2="${i*90}" stroke="white" stroke-width="1"/>`).join('')}
  </svg>
  <!-- Glow -->
  <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,${primaryColor}25 0%,transparent 70%);border-radius:50%"></div>
  <!-- Top: headline -->
  <div>
    <div style="font-size:15px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px">${name}</div>
    <div style="font-size:44px;font-weight:800;color:#ffffff;line-height:1.1;max-width:900px">${headline}</div>
  </div>
  <!-- Stat boxes -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
    ${stats.map((s, i) => `
    <div style="background:#ffffff06;border:1px solid ${[primaryColor, accentColor, secondaryColor][i]}30;border-radius:16px;padding:28px">
      <div style="font-size:48px;font-weight:900;color:${[primaryColor, accentColor, secondaryColor][i]};line-height:1">${valuePropositions[i] ? valuePropositions[i].split(' ')[0] : s.value}</div>
      <div style="font-size:16px;color:#94a3b8;margin-top:8px">${s.label}</div>
    </div>`).join('')}
  </div>
  <!-- CTA row -->
  <div style="display:flex;align-items:center;justify-content:space-between">
    <div style="background:${primaryColor};color:#fff;font-size:18px;font-weight:700;padding:16px 44px;border-radius:100px">${cta}</div>
    <div style="font-size:14px;color:#64748b;letter-spacing:2px;text-transform:uppercase">Trusted by 10,000+ businesses</div>
  </div>
</div>`);
}

// ─── Variant 3: quote-style ───────────────────────────────────────────────────

function quoteStyle(d: TemplateData): string {
  const { primaryColor, accentColor, name, socialProof } = d.brandProfile;
  const { headline, cta } = d.content;
  const quote = socialProof[0] || headline;

  return base(`
<div style="width:1200px;height:627px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;padding:80px;position:relative;overflow:hidden">
  <!-- Accent left bar -->
  <div style="position:absolute;left:0;top:0;width:12px;height:100%;background:linear-gradient(to bottom,${primaryColor},${accentColor})"></div>
  <!-- Large quote mark -->
  <div style="position:absolute;top:20px;right:60px;font-size:240px;color:${primaryColor};opacity:0.06;font-family:Georgia,serif;line-height:1">"</div>
  <!-- Content -->
  <div style="font-size:16px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:28px">${name}</div>
  <div style="font-size:42px;font-weight:700;color:#0a0a1a;line-height:1.2;max-width:900px;margin-bottom:36px">"${quote.slice(0, 160)}"</div>
  <div style="width:60px;height:4px;background:${accentColor};border-radius:2px;margin-bottom:36px"></div>
  <div style="display:flex;align-items:center;gap:20px">
    <div style="background:${primaryColor};color:#fff;font-size:18px;font-weight:700;padding:14px 40px;border-radius:100px">${cta}</div>
    <div style="font-size:15px;color:#64748b">Join thousands of satisfied customers</div>
  </div>
</div>`);
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const linkedinPostTemplates: TemplateConfig[] = [
  { id: 'linkedin-post-banner',   name: 'Professional Banner', platform: 'linkedin', contentType: 'post', dimensions: { width: 1200, height: 627 }, requiresImage: false, render: professionalBanner },
  { id: 'linkedin-post-data',     name: 'Data Card',           platform: 'linkedin', contentType: 'post', dimensions: { width: 1200, height: 627 }, requiresImage: false, render: dataCard },
  { id: 'linkedin-post-quote',    name: 'Quote Style',         platform: 'linkedin', contentType: 'post', dimensions: { width: 1200, height: 627 }, requiresImage: false, render: quoteStyle },
  { id: 'linkedin-post-standard', name: 'Standard (alias)',    platform: 'linkedin', contentType: 'post', dimensions: { width: 1200, height: 627 }, requiresImage: true,  render: professionalBanner },
  { id: 'linkedin-post-stat',     name: 'Stat (alias)',        platform: 'linkedin', contentType: 'post', dimensions: { width: 1200, height: 627 }, requiresImage: false, render: dataCard },
];

export function getLinkedinPostTemplate(variantId: string): TemplateConfig | undefined {
  return linkedinPostTemplates.find(t => t.id === variantId);
}

export function getRandomLinkedinPostTemplate(): TemplateConfig {
  const base = linkedinPostTemplates.filter(t => !t.name.includes('alias'));
  return base[Math.floor(Math.random() * base.length)];
}

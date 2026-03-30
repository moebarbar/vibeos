import type { TemplateConfig, TemplateData } from '../types';

const base = (content: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:600px;height:260px;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
</style></head><body>${content}</body></html>`.trim();

// ─── Variant 1: branded-cta ───────────────────────────────────────────────────

function brandedCta(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name } = d.brandProfile;
  const { headline, body, cta } = d.content;

  return base(`
<div style="width:600px;height:260px;background:#0a0a1a;display:flex;flex-direction:column;justify-content:center;padding:44px 48px;position:relative;overflow:hidden">
  <!-- Left accent bar -->
  <div style="position:absolute;left:0;top:0;width:5px;height:100%;background:linear-gradient(to bottom,${primaryColor},${accentColor})"></div>
  <!-- Background glow -->
  <div style="position:absolute;right:-60px;top:-60px;width:280px;height:280px;background:radial-gradient(circle,${accentColor}18 0%,transparent 70%);border-radius:50%"></div>
  <!-- Dot cluster top-right -->
  <svg style="position:absolute;top:20px;right:20px;opacity:0.1" width="80" height="80">
    ${Array.from({length:3}, (_,y) => Array.from({length:3}, (_,x) =>
      `<circle cx="${x*26+13}" cy="${y*26+13}" r="4" fill="${primaryColor}"/>`).join('')).join('')}
  </svg>
  <!-- Brand name -->
  <div style="font-size:12px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;position:relative">${name}</div>
  <!-- Headline -->
  <div style="font-size:28px;font-weight:800;color:#ffffff;line-height:1.15;margin-bottom:12px;position:relative;max-width:440px">${headline}</div>
  <!-- Subtext -->
  <div style="font-size:14px;color:#94a3b8;line-height:1.5;margin-bottom:22px;max-width:420px;position:relative">${body.slice(0, 100)}</div>
  <!-- CTA row -->
  <div style="display:flex;align-items:center;gap:16px;position:relative">
    <div style="background:${primaryColor};color:#fff;font-size:14px;font-weight:700;padding:11px 32px;border-radius:100px">${cta}</div>
    <div style="width:1px;height:20px;background:#334155"></div>
    <div style="font-size:13px;color:#475569">No credit card required</div>
  </div>
  <!-- Bottom gradient line -->
  <div style="position:absolute;bottom:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,${primaryColor},${accentColor},${secondaryColor},transparent)"></div>
</div>`);
}

// ─── Variant 2: gradient-banner ───────────────────────────────────────────────

function gradientBanner(d: TemplateData): string {
  const { primaryColor, accentColor, name } = d.brandProfile;
  const { headline, cta } = d.content;

  return base(`
<div style="width:600px;height:260px;background:linear-gradient(135deg,${primaryColor} 0%,${accentColor} 100%);display:flex;flex-direction:column;justify-content:center;padding:44px 48px;position:relative;overflow:hidden">
  <!-- Large semi-transparent circle right -->
  <div style="position:absolute;right:-80px;top:-80px;width:320px;height:320px;background:rgba(255,255,255,0.08);border-radius:50%"></div>
  <div style="position:absolute;right:60px;bottom:-100px;width:200px;height:200px;background:rgba(255,255,255,0.05);border-radius:50%"></div>
  <!-- Brand badge -->
  <div style="background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.25);color:#ffffff;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:5px 14px;border-radius:100px;display:inline-block;margin-bottom:18px;align-self:flex-start;position:relative">${name}</div>
  <!-- Headline -->
  <div style="font-size:30px;font-weight:900;color:#ffffff;line-height:1.15;margin-bottom:24px;max-width:420px;position:relative;text-shadow:0 2px 12px rgba(0,0,0,0.2)">${headline}</div>
  <!-- CTA -->
  <div style="position:relative">
    <div style="background:#ffffff;color:${primaryColor};font-size:14px;font-weight:700;padding:12px 32px;border-radius:100px;display:inline-block;box-shadow:0 4px 16px rgba(0,0,0,0.2)">${cta}</div>
  </div>
</div>`);
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const emailHeaderTemplates: TemplateConfig[] = [
  { id: 'email-header-branded',  name: 'Branded CTA',      platform: 'email', contentType: 'header', dimensions: { width: 600, height: 260 }, requiresImage: false, render: brandedCta },
  { id: 'email-header-gradient', name: 'Gradient Banner',  platform: 'email', contentType: 'header', dimensions: { width: 600, height: 260 }, requiresImage: false, render: gradientBanner },
  { id: 'email-header-standard', name: 'Standard (alias)', platform: 'email', contentType: 'header', dimensions: { width: 600, height: 260 }, requiresImage: false, render: brandedCta },
];

export function getEmailHeaderTemplate(variantId: string): TemplateConfig | undefined {
  return emailHeaderTemplates.find(t => t.id === variantId);
}

export function getRandomEmailHeaderTemplate(): TemplateConfig {
  const base = emailHeaderTemplates.filter(t => !t.name.includes('alias'));
  return base[Math.floor(Math.random() * base.length)];
}

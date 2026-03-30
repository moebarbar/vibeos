import type { TemplateConfig, TemplateData } from '../types';

const base = (content: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:628px;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
</style></head><body>${content}</body></html>`.trim();

// ─── Variant 1: benefit-focused ───────────────────────────────────────────────

function benefitFocused(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name, keyFeatures } = d.brandProfile;
  const { headline, body, cta } = d.content;

  const features = keyFeatures.slice(0, 3).length ? keyFeatures.slice(0, 3) : ['Fast results', 'Easy to use', 'Proven system'];

  return base(`
<div style="width:1200px;height:628px;background:#0a0a1a;display:grid;grid-template-columns:1.1fr 0.9fr;overflow:hidden;position:relative">
  <!-- Left: content -->
  <div style="padding:60px 50px;display:flex;flex-direction:column;justify-content:center">
    <div style="font-size:13px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px">${name}</div>
    <div style="font-size:42px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:28px">${headline}</div>
    <div style="font-size:18px;color:#94a3b8;line-height:1.5;margin-bottom:32px">${body.slice(0, 120)}</div>
    <!-- Feature list -->
    <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:36px">
      ${features.map((f, i) => `
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:24px;height:24px;border-radius:50%;background:${[primaryColor, accentColor, secondaryColor][i]};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </div>
        <span style="font-size:17px;color:#e2e8f0">${f}</span>
      </div>`).join('')}
    </div>
    <div style="background:${primaryColor};color:#fff;font-size:18px;font-weight:700;padding:16px 44px;border-radius:100px;display:inline-block;align-self:flex-start">${cta}</div>
  </div>
  <!-- Right: abstract -->
  <div style="background:#0d0d2b;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
    <svg width="520" height="628" viewBox="0 0 520 628">
      <defs>
        <radialGradient id="fb1"><stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.4"/><stop offset="100%" stop-color="transparent" stop-opacity="0"/></radialGradient>
      </defs>
      <circle cx="260" cy="314" r="260" fill="url(#fb1)"/>
      ${[220,160,100].map(r => `<circle cx="260" cy="314" r="${r}" fill="none" stroke="${primaryColor}" stroke-width="0.5" opacity="0.2"/>`).join('')}
      ${Array.from({length:6}, (_,i) => {
        const a = (i / 6) * Math.PI * 2;
        return `<circle cx="${(260 + Math.cos(a) * 160).toFixed(0)}" cy="${(314 + Math.sin(a) * 160).toFixed(0)}" r="10" fill="${accentColor}" opacity="0.5"/>`;
      }).join('')}
      <circle cx="260" cy="314" r="50" fill="${primaryColor}" opacity="0.2"/>
      <circle cx="260" cy="314" r="25" fill="${primaryColor}" opacity="0.8"/>
    </svg>
  </div>
  <!-- Bottom bar -->
  <div style="position:absolute;bottom:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,${primaryColor},${accentColor},transparent)"></div>
</div>`);
}

// ─── Variant 2: before-after ──────────────────────────────────────────────────

function beforeAfter(d: TemplateData): string {
  const { primaryColor, accentColor, name } = d.brandProfile;
  const { headline, cta } = d.content;

  return base(`
<div style="width:1200px;height:628px;background:#0a0a1a;display:flex;flex-direction:column;padding:60px;justify-content:space-between;position:relative;overflow:hidden">
  <!-- Header -->
  <div>
    <div style="font-size:13px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px">${name}</div>
    <div style="font-size:44px;font-weight:900;color:#ffffff;line-height:1.1">${headline}</div>
  </div>
  <!-- Before/After split -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <!-- Before -->
    <div style="background:#1a0a0a;border:1px solid #ef444430;border-radius:20px;padding:32px">
      <div style="font-size:13px;color:#ef4444;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px">❌ Before</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${['Manual, time-consuming work', 'Inconsistent results', 'High costs, low ROI', 'Flying blind without data'].map(item => `
        <div style="display:flex;align-items:center;gap:10px">
          <span style="color:#ef4444;font-size:16px">✗</span>
          <span style="font-size:17px;color:#94a3b8">${item}</span>
        </div>`).join('')}
      </div>
    </div>
    <!-- After -->
    <div style="background:#0a1a0a;border:1px solid ${primaryColor}40;border-radius:20px;padding:32px">
      <div style="font-size:13px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px">✅ After</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${['Automated, effortless workflow', 'Consistent, predictable results', 'Lower costs, higher ROI', 'Data-driven decisions always'].map(item => `
        <div style="display:flex;align-items:center;gap:10px">
          <span style="color:${primaryColor};font-size:16px">✓</span>
          <span style="font-size:17px;color:#e2e8f0">${item}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>
  <!-- CTA -->
  <div style="display:flex;align-items:center;gap:20px">
    <div style="background:${primaryColor};color:#fff;font-size:18px;font-weight:700;padding:16px 48px;border-radius:100px">${cta}</div>
    <div style="font-size:15px;color:#64748b">No credit card required</div>
  </div>
  <!-- Glow -->
  <div style="position:absolute;top:-80px;right:-80px;width:350px;height:350px;background:radial-gradient(circle,${accentColor}20 0%,transparent 70%);border-radius:50%"></div>
</div>`);
}

// ─── Variant 3: testimonial-card ─────────────────────────────────────────────

function testimonialCard(d: TemplateData): string {
  const { primaryColor, accentColor, name, socialProof } = d.brandProfile;
  const { cta } = d.content;
  const quote = socialProof[0] || 'This completely transformed how we work. Results were visible within the first week.';

  return base(`
<div style="width:1200px;height:628px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;padding:80px;position:relative;overflow:hidden">
  <!-- Left color bar -->
  <div style="position:absolute;left:0;top:0;width:10px;height:100%;background:linear-gradient(to bottom,${primaryColor},${accentColor})"></div>
  <!-- Background pattern -->
  <svg style="position:absolute;bottom:0;right:0;opacity:0.04" width="300" height="300">
    ${Array.from({length:6}, (_,y) => Array.from({length:6}, (_,x) =>
      `<circle cx="${x*50+25}" cy="${y*50+25}" r="5" fill="${primaryColor}"/>`).join('')).join('')}
  </svg>
  <!-- Stars -->
  <div style="font-size:36px;margin-bottom:24px">★★★★★</div>
  <!-- Quote -->
  <div style="font-size:40px;font-weight:700;color:#0a0a1a;line-height:1.25;margin-bottom:32px;max-width:950px">"${quote.slice(0, 180)}"</div>
  <!-- Attribution -->
  <div style="display:flex;align-items:center;gap:16px;margin-bottom:40px">
    <div style="width:48px;height:48px;border-radius:50%;background:${primaryColor};display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:700">A</div>
    <div>
      <div style="font-size:17px;font-weight:700;color:#0a0a1a">A satisfied customer</div>
      <div style="font-size:14px;color:#64748b">Verified user of ${name}</div>
    </div>
  </div>
  <div style="background:${primaryColor};color:#fff;font-size:18px;font-weight:700;padding:16px 44px;border-radius:100px;display:inline-block;align-self:flex-start">${cta}</div>
</div>`);
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const facebookAdTemplates: TemplateConfig[] = [
  { id: 'facebook-ad-benefit',      name: 'Benefit Focused',  platform: 'facebook', contentType: 'ad', dimensions: { width: 1200, height: 628 }, requiresImage: false, render: benefitFocused },
  { id: 'facebook-ad-before-after', name: 'Before/After',     platform: 'facebook', contentType: 'ad', dimensions: { width: 1200, height: 628 }, requiresImage: false, render: beforeAfter },
  { id: 'facebook-ad-testimonial',  name: 'Testimonial Card', platform: 'facebook', contentType: 'ad', dimensions: { width: 1200, height: 628 }, requiresImage: false, render: testimonialCard },
  { id: 'facebook-ad-standard',     name: 'Standard (alias)', platform: 'facebook', contentType: 'ad', dimensions: { width: 1200, height: 628 }, requiresImage: true,  render: benefitFocused },
];

export function getFacebookAdTemplate(variantId: string): TemplateConfig | undefined {
  return facebookAdTemplates.find(t => t.id === variantId);
}

export function getRandomFacebookAdTemplate(): TemplateConfig {
  const base = facebookAdTemplates.filter(t => !t.name.includes('alias'));
  return base[Math.floor(Math.random() * base.length)];
}

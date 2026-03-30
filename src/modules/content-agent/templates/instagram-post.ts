import type { TemplateConfig, TemplateData } from '../types';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const base = (w: number, h: number, bg: string, content: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;overflow:hidden;font-family:'Inter',system-ui,sans-serif;background:${bg}}
</style></head><body>${content}</body></html>`.trim();

// ─── Variant 1: stat-hero ─────────────────────────────────────────────────────

function statHero(d: TemplateData): string {
  const { primaryColor, accentColor, name } = d.brandProfile;
  const { headline, body, cta } = d.content;

  // Extract a stat-like number from headline if possible
  const statMatch = headline.match(/\d[\d,.%+xX]*/);
  const stat = statMatch ? statMatch[0] : '10x';
  const restHeadline = headline.replace(stat, '').trim();

  return base(1080, 1080, '#0a0a1a', `
<div style="width:1080px;height:1080px;background:linear-gradient(135deg,#0a0a1a 0%,#0d0d2b 100%);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px;position:relative;overflow:hidden">
  <!-- Grid lines -->
  <svg style="position:absolute;inset:0;opacity:0.06" width="1080" height="1080">
    ${Array.from({length: 12}, (_,i) => `<line x1="${i*90}" y1="0" x2="${i*90}" y2="1080" stroke="white" stroke-width="1"/>`).join('')}
    ${Array.from({length: 12}, (_,i) => `<line x1="0" y1="${i*90}" x2="1080" y2="${i*90}" stroke="white" stroke-width="1"/>`).join('')}
  </svg>
  <!-- Glow orb -->
  <div style="position:absolute;top:-150px;right:-150px;width:500px;height:500px;background:radial-gradient(circle,${primaryColor}40 0%,transparent 70%);border-radius:50%"></div>
  <!-- Trend line SVG -->
  <svg style="position:absolute;bottom:80px;right:60px;opacity:0.15" width="300" height="120" viewBox="0 0 300 120">
    <polyline points="0,100 50,80 100,60 150,40 200,20 250,10 300,5" fill="none" stroke="${accentColor}" stroke-width="3"/>
    <circle cx="300" cy="5" r="6" fill="${accentColor}"/>
  </svg>
  <!-- Stat number -->
  <div style="font-size:160px;font-weight:900;color:${accentColor};line-height:1;letter-spacing:-8px;text-align:center;z-index:1">${stat}</div>
  <!-- Rest of headline -->
  <div style="font-size:42px;font-weight:700;color:#ffffff;text-align:center;margin-top:20px;line-height:1.2;max-width:900px;z-index:1">${restHeadline || headline}</div>
  <!-- Body -->
  <div style="font-size:24px;color:#94a3b8;text-align:center;margin-top:30px;line-height:1.6;max-width:800px;z-index:1">${body.slice(0, 140)}</div>
  <!-- CTA pill -->
  <div style="margin-top:50px;background:${primaryColor};color:#fff;font-size:22px;font-weight:700;padding:18px 48px;border-radius:100px;z-index:1">${cta}</div>
  <!-- Brand tag -->
  <div style="position:absolute;bottom:40px;left:60px;font-size:18px;color:${primaryColor};font-weight:600;letter-spacing:2px;text-transform:uppercase;opacity:0.7">${name}</div>
</div>`);
}

// ─── Variant 2: agent-constellation ──────────────────────────────────────────

function agentConstellation(d: TemplateData): string {
  const { primaryColor, secondaryColor, accentColor, name } = d.brandProfile;
  const { headline, body, cta } = d.content;

  const nodes = [
    [540, 300, 40], [700, 200, 25], [380, 220, 20], [750, 400, 30],
    [320, 420, 18], [620, 180, 15], [460, 160, 22],
  ];

  return base(1080, 1080, '#080818', `
<div style="width:1080px;height:1080px;background:#080818;display:flex;flex-direction:column;justify-content:flex-end;padding:80px;position:relative;overflow:hidden">
  <svg style="position:absolute;inset:0" width="1080" height="1080">
    <!-- Orbital rings -->
    <circle cx="540" cy="300" r="180" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.2"/>
    <circle cx="540" cy="300" r="280" fill="none" stroke="${secondaryColor}" stroke-width="0.5" opacity="0.12"/>
    <!-- Connection lines -->
    <line x1="540" y1="300" x2="700" y2="200" stroke="${accentColor}" stroke-width="1" opacity="0.4"/>
    <line x1="540" y1="300" x2="380" y2="220" stroke="${accentColor}" stroke-width="1" opacity="0.4"/>
    <line x1="540" y1="300" x2="750" y2="400" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <line x1="540" y1="300" x2="320" y2="420" stroke="${accentColor}" stroke-width="1" opacity="0.3"/>
    <!-- Nodes -->
    ${nodes.map(([x, y, r]) => `
      <circle cx="${x}" cy="${y}" r="${r}" fill="${primaryColor}" opacity="0.15"/>
      <circle cx="${x}" cy="${y}" r="${(r as number) * 0.5}" fill="${primaryColor}" opacity="0.6"/>
    `).join('')}
    <!-- Center glow -->
    <circle cx="540" cy="300" r="50" fill="${primaryColor}" opacity="0.3"/>
    <circle cx="540" cy="300" r="25" fill="${primaryColor}" opacity="0.8"/>
  </svg>
  <!-- Text content at bottom -->
  <div style="position:relative;z-index:1">
    <div style="font-size:52px;font-weight:800;color:#ffffff;line-height:1.15;max-width:900px;margin-bottom:24px">${headline}</div>
    <div style="font-size:26px;color:#94a3b8;line-height:1.5;max-width:800px;margin-bottom:40px">${body.slice(0, 120)}</div>
    <div style="display:flex;align-items:center;gap:20px">
      <div style="background:${primaryColor};color:#fff;font-size:22px;font-weight:700;padding:16px 44px;border-radius:100px">${cta}</div>
      <div style="font-size:18px;color:${primaryColor};font-weight:600;letter-spacing:2px;text-transform:uppercase">${name}</div>
    </div>
  </div>
</div>`);
}

// ─── Variant 3: dashboard-mockup ─────────────────────────────────────────────

function dashboardMockup(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name } = d.brandProfile;
  const { headline, body, cta } = d.content;

  return base(1080, 1080, '#0c0c20', `
<div style="width:1080px;height:1080px;background:#0c0c20;display:flex;flex-direction:column;padding:70px;position:relative;overflow:hidden">
  <!-- Fake dashboard UI top half -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:40px">
    ${[['Revenue', '+42%', primaryColor], ['Users', '12.4K', accentColor], ['Conv.', '8.3%', secondaryColor]].map(([label, value, color]) => `
    <div style="background:#ffffff08;border:1px solid ${color}30;border-radius:16px;padding:24px">
      <div style="font-size:14px;color:#64748b;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">${label}</div>
      <div style="font-size:36px;font-weight:800;color:${color}">${value}</div>
    </div>`).join('')}
  </div>
  <!-- Mini bar chart -->
  <div style="background:#ffffff05;border:1px solid #ffffff10;border-radius:16px;padding:24px;margin-bottom:40px;display:flex;align-items:flex-end;gap:12px;height:120px">
    ${[40,65,55,80,70,95,88,100,75,90,85,100].map(h => `
    <div style="flex:1;background:linear-gradient(to top,${primaryColor},${accentColor});border-radius:4px 4px 0 0;height:${h}%;opacity:0.8"></div>`).join('')}
  </div>
  <!-- Headline -->
  <div style="font-size:50px;font-weight:800;color:#ffffff;line-height:1.15;margin-bottom:20px">${headline}</div>
  <div style="font-size:24px;color:#94a3b8;line-height:1.5;margin-bottom:36px;max-width:800px">${body.slice(0, 100)}</div>
  <div style="display:flex;align-items:center;gap:20px">
    <div style="background:${primaryColor};color:#fff;font-weight:700;font-size:22px;padding:16px 44px;border-radius:100px">${cta}</div>
    <div style="font-size:16px;color:${primaryColor};font-weight:600;letter-spacing:2px;text-transform:uppercase">${name}</div>
  </div>
</div>`);
}

// ─── Variant 4: minimal-bold ──────────────────────────────────────────────────

function minimalBold(d: TemplateData): string {
  const { primaryColor, accentColor, name } = d.brandProfile;
  const { headline, cta } = d.content;

  const words = headline.split(' ');
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half).join(' ');
  const line2 = words.slice(half).join(' ');

  return base(1080, 1080, '#ffffff', `
<div style="width:1080px;height:1080px;background:#ffffff;display:flex;flex-direction:column;justify-content:center;padding:100px;position:relative">
  <!-- Accent bar -->
  <div style="position:absolute;top:0;left:0;width:16px;height:100%;background:${primaryColor}"></div>
  <!-- Dot pattern -->
  <svg style="position:absolute;bottom:60px;right:60px;opacity:0.06" width="200" height="200">
    ${Array.from({length:5}, (_,y) => Array.from({length:5}, (_,x) =>
      `<circle cx="${x*40+20}" cy="${y*40+20}" r="4" fill="#000"/>`).join('')).join('')}
  </svg>
  <div style="font-size:18px;color:${primaryColor};font-weight:700;letter-spacing:4px;text-transform:uppercase;margin-bottom:30px">${name}</div>
  <div style="font-size:88px;font-weight:900;color:#0a0a1a;line-height:0.95;letter-spacing:-3px">${line1}</div>
  <div style="font-size:88px;font-weight:900;color:${primaryColor};line-height:0.95;letter-spacing:-3px;margin-bottom:50px">${line2}</div>
  <div style="width:80px;height:6px;background:${accentColor};border-radius:3px;margin-bottom:40px"></div>
  <div style="background:${primaryColor};color:#fff;font-size:24px;font-weight:700;padding:20px 52px;border-radius:100px;display:inline-block;align-self:flex-start">${cta}</div>
</div>`);
}

// ─── Variant 5: split-layout ──────────────────────────────────────────────────

function splitLayout(d: TemplateData): string {
  const { primaryColor, accentColor, secondaryColor, name } = d.brandProfile;
  const { headline, body, cta } = d.content;

  return base(1080, 1080, '#0a0a1a', `
<div style="width:1080px;height:1080px;background:#0a0a1a;display:grid;grid-template-columns:1fr 1fr">
  <!-- Left: text -->
  <div style="padding:80px 60px 80px 80px;display:flex;flex-direction:column;justify-content:center">
    <div style="font-size:15px;color:${primaryColor};font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:24px">${name}</div>
    <div style="font-size:52px;font-weight:800;color:#ffffff;line-height:1.15;margin-bottom:28px">${headline}</div>
    <div style="font-size:22px;color:#94a3b8;line-height:1.6;margin-bottom:44px">${body.slice(0, 120)}</div>
    <div style="background:${primaryColor};color:#fff;font-size:20px;font-weight:700;padding:16px 40px;border-radius:100px;display:inline-block;align-self:flex-start">${cta}</div>
  </div>
  <!-- Right: abstract SVG -->
  <div style="background:#0d0d2b;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
    <svg width="540" height="1080" viewBox="0 0 540 1080">
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="g2" cx="50%" cy="50%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="270" cy="540" r="280" fill="url(#g1)"/>
      <circle cx="350" cy="400" r="180" fill="url(#g2)"/>
      <circle cx="270" cy="540" r="160" fill="none" stroke="${primaryColor}" stroke-width="1" opacity="0.3"/>
      <circle cx="270" cy="540" r="220" fill="none" stroke="${secondaryColor}" stroke-width="0.5" opacity="0.2"/>
      <circle cx="270" cy="540" r="280" fill="none" stroke="${accentColor}" stroke-width="0.5" opacity="0.15"/>
      ${Array.from({length: 8}, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = 270 + Math.cos(angle) * 160;
        const y = 540 + Math.sin(angle) * 160;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="8" fill="${primaryColor}" opacity="0.6"/>`;
      }).join('')}
      <circle cx="270" cy="540" r="40" fill="${primaryColor}" opacity="0.8"/>
      <circle cx="270" cy="540" r="15" fill="white" opacity="0.9"/>
    </svg>
  </div>
</div>`);
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const instagramPostTemplates: TemplateConfig[] = [
  { id: 'instagram-post-stat-hero',          name: 'Stat Hero',           platform: 'instagram', contentType: 'post', dimensions: { width: 1080, height: 1080 }, requiresImage: false, render: statHero },
  { id: 'instagram-post-constellation',      name: 'Agent Constellation', platform: 'instagram', contentType: 'post', dimensions: { width: 1080, height: 1080 }, requiresImage: false, render: agentConstellation },
  { id: 'instagram-post-dashboard',          name: 'Dashboard Mockup',    platform: 'instagram', contentType: 'post', dimensions: { width: 1080, height: 1080 }, requiresImage: false, render: dashboardMockup },
  { id: 'instagram-post-minimal-bold',       name: 'Minimal Bold',        platform: 'instagram', contentType: 'post', dimensions: { width: 1080, height: 1080 }, requiresImage: false, render: minimalBold },
  { id: 'instagram-post-split',              name: 'Split Layout',        platform: 'instagram', contentType: 'post', dimensions: { width: 1080, height: 1080 }, requiresImage: false, render: splitLayout },
  // Aliases used by copy-generator templateId assignment
  { id: 'instagram-post-clean', name: 'Clean (alias)', platform: 'instagram', contentType: 'post', dimensions: { width: 1080, height: 1080 }, requiresImage: true, render: agentConstellation },
  { id: 'instagram-post-bold',  name: 'Bold (alias)',  platform: 'instagram', contentType: 'post', dimensions: { width: 1080, height: 1080 }, requiresImage: true, render: minimalBold },
];

export function getInstagramPostTemplate(variantId: string): TemplateConfig | undefined {
  return instagramPostTemplates.find(t => t.id === variantId);
}

export function getRandomInstagramPostTemplate(): TemplateConfig {
  const base = instagramPostTemplates.filter(t => !t.name.includes('alias'));
  return base[Math.floor(Math.random() * base.length)];
}

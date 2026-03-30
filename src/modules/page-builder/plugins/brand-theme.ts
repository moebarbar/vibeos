import type { Editor } from 'grapesjs';
import type { BrandProfile } from '../../content-agent/types';

const GOOGLE_FONTS = ['Inter','Plus Jakarta Sans','DM Sans','Outfit','Poppins'];
const RADIUS_PRESETS = { Sharp: '0px', Subtle: '8px', Rounded: '16px', Pill: '9999px' } as const;

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

function injectVars(editor: Editor, primary: string, secondary: string, accent: string, font: string, radius: string) {
  const doc = (editor.Canvas as unknown as { getDocument: () => Document | null }).getDocument();
  if (!doc) return;

  let style = doc.getElementById('__cmkt-theme__');
  if (!style) {
    style = doc.createElement('style');
    style.id = '__cmkt-theme__';
    doc.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --brand-primary:   ${primary};
      --brand-secondary: ${secondary};
      --brand-accent:    ${accent};
      --brand-primary-rgb: ${hexToRgb(primary.startsWith('#') ? primary : '#6366f1')};
      --brand-radius: ${radius};
      --brand-font: '${font}', system-ui, sans-serif;
    }
    body { font-family: var(--brand-font) !important; }
    [data-theme="light"] { background: #fff !important; color: #1e293b !important; }
    [data-theme="brand"] { background: var(--brand-primary) !important; color: #fff !important; }
    [data-theme="gradient"] { background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) !important; color: #fff !important; }
  `.trim();

  // Load Google Font in canvas
  let fontLink = doc.getElementById('__cmkt-font__') as HTMLLinkElement | null;
  if (!fontLink) {
    fontLink = doc.createElement('link') as HTMLLinkElement;
    fontLink.id = '__cmkt-font__';
    fontLink.rel = 'stylesheet';
    doc.head.appendChild(fontLink);
  }
  fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700&display=swap`;
}

export function brandThemePlugin(editor: Editor, opts: { brandProfile?: BrandProfile } = {}) {
  const bp = opts.brandProfile;
  let primary   = bp?.primaryColor   ?? '#6366f1';
  let secondary = bp?.secondaryColor ?? '#8b5cf6';
  let accent    = bp?.accentColor    ?? '#a78bfa';
  let font      = 'Inter';
  let radius    = RADIUS_PRESETS.Subtle;

  // Inject on load
  editor.on('load', () => injectVars(editor, primary, secondary, accent, font, radius));

  // Add "Brand" panel to right sidebar
  editor.Panels.addPanel({
    id: 'brand-panel',
    el: (() => {
      const panel = document.createElement('div');
      panel.id = 'cmkt-brand-panel';
      panel.style.cssText = 'padding:16px;min-width:220px;display:none';
      panel.innerHTML = `
        <div style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Brand Theme</div>

        <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px">Primary Color</label>
        <input type="color" id="cmkt-primary" value="${primary}" style="width:100%;height:32px;border-radius:6px;border:1px solid #1e2a3a;background:#0a0a1a;cursor:pointer;margin-bottom:10px">

        <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px">Secondary Color</label>
        <input type="color" id="cmkt-secondary" value="${secondary}" style="width:100%;height:32px;border-radius:6px;border:1px solid #1e2a3a;background:#0a0a1a;cursor:pointer;margin-bottom:10px">

        <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px">Accent Color</label>
        <input type="color" id="cmkt-accent" value="${accent}" style="width:100%;height:32px;border-radius:6px;border:1px solid #1e2a3a;background:#0a0a1a;cursor:pointer;margin-bottom:14px">

        <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px">Font</label>
        <select id="cmkt-font" style="width:100%;padding:7px 10px;border-radius:6px;border:1px solid #1e2a3a;background:#0a0a1a;color:#fff;font-size:13px;margin-bottom:10px">
          ${GOOGLE_FONTS.map(f => `<option value="${f}" ${f === font ? 'selected' : ''}>${f}</option>`).join('')}
        </select>

        <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px">Border Radius</label>
        <select id="cmkt-radius" style="width:100%;padding:7px 10px;border-radius:6px;border:1px solid #1e2a3a;background:#0a0a1a;color:#fff;font-size:13px;margin-bottom:10px">
          ${Object.entries(RADIUS_PRESETS).map(([k, v]) => `<option value="${v}" ${v === radius ? 'selected' : ''}>${k}</option>`).join('')}
        </select>

        <button id="cmkt-apply-theme" style="width:100%;padding:10px;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:13px;font-weight:600;cursor:pointer">Apply Theme</button>
      `;
      return panel;
    })(),
  });

  // Wire up apply button
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'cmkt-apply-theme') {
      primary   = (document.getElementById('cmkt-primary')   as HTMLInputElement)?.value ?? primary;
      secondary = (document.getElementById('cmkt-secondary') as HTMLInputElement)?.value ?? secondary;
      accent    = (document.getElementById('cmkt-accent')    as HTMLInputElement)?.value ?? accent;
      font      = (document.getElementById('cmkt-font')      as HTMLSelectElement)?.value ?? font;
      radius    = (document.getElementById('cmkt-radius')    as HTMLSelectElement)?.value ?? radius;
      injectVars(editor, primary, secondary, accent, font, radius);
    }
  });

  // Add theme trait to all components on creation
  editor.on('component:add', (component: { addTrait?: (t: object) => void }) => {
    if (typeof component.addTrait === 'function') {
      component.addTrait({
        type: 'select',
        name: 'data-theme',
        label: 'Color Theme',
        options: [
          { id: '',         name: 'Default (Dark)' },
          { id: 'light',    name: 'Light' },
          { id: 'brand',    name: 'Brand Color' },
          { id: 'gradient', name: 'Gradient' },
        ],
      });
    }
  });
}

export function brandFontsPlugin(editor: Editor, opts: { defaultFont?: string } = {}) {
  let currentFont = opts.defaultFont ?? 'Inter';

  editor.on('load', () => {
    const doc = (editor.Canvas as unknown as { getDocument: () => Document | null }).getDocument();
    if (!doc) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(currentFont)}:wght@300;400;500;600;700&display=swap`;
    doc.head.appendChild(link);
  });
}

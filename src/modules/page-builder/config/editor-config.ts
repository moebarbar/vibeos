import type { EditorConfig } from 'grapesjs';
import type { BrandProfile } from '../../content-agent/types';

export function buildEditorConfig(): Partial<EditorConfig> {
  return {
    height: '100%',
    storageManager: false,

    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      ],
      scripts: [
        'https://cdn.tailwindcss.com',
      ],
    },

    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Tablet',  width: '768px',  widthMedia: '992px' },
        { name: 'Mobile',  width: '375px',  widthMedia: '480px' },
      ],
    },

    selectorManager: {
      // Allow Tailwind slash syntax (e.g. "w-1/2", "text-slate-900/50")
      escapeName: (name: string) => `${name}`.trim().replace(/([^a-z0-9\w-:/]+)/gi, '-'),
    },

    styleManager: {
      sectors: [
        {
          name: 'Layout',
          properties: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'flex-wrap'],
        },
        {
          name: 'Spacing',
          properties: ['padding', 'margin', 'width', 'height', 'max-width', 'min-height'],
        },
        {
          name: 'Typography',
          properties: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'text-align'],
        },
        {
          name: 'Background',
          properties: ['background-color', 'background-image', 'background-size', 'background-position'],
        },
        {
          name: 'Borders & Effects',
          properties: ['border-radius', 'border', 'box-shadow', 'opacity', 'overflow'],
        },
      ],
    },
  };
}

export function buildBrandCssVars(brand: BrandProfile): string {
  return `
    :root {
      --brand-primary: ${brand.primaryColor};
      --brand-secondary: ${brand.secondaryColor};
      --brand-accent: ${brand.accentColor};
    }
    [style*="var(--brand-primary)"] { color: ${brand.primaryColor}; }
  `.trim();
}

export function injectBrandVarsIntoCanvas(editor: { Canvas: { getDocument: () => Document | null } }, brand: BrandProfile): void {
  const doc = editor.Canvas.getDocument();
  if (!doc) return;
  const existing = doc.getElementById('__brand-vars__');
  if (existing) existing.remove();
  const style = doc.createElement('style');
  style.id = '__brand-vars__';
  style.textContent = buildBrandCssVars(brand);
  doc.head.appendChild(style);
}

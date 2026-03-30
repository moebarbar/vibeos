import type { Editor } from 'grapesjs';
import type { BrandProfile } from '../../content-agent/types';

interface AIPanelOpts {
  brandProfile?: BrandProfile;
  claudeApiEndpoint?: string;
  falApiEndpoint?:    string;
}

async function apiPost(endpoint: string, body: object): Promise<unknown> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function chiefmktAIPanelsPlugin(editor: Editor, opts: AIPanelOpts = {}) {
  const claude = opts.claudeApiEndpoint ?? '/api/ai';
  const fal    = opts.falApiEndpoint    ?? '/api/ai';
  const brand  = opts.brandProfile;

  // ── PANEL 1: Floating Copy Toolbar ────────────────────────────────────────

  const toolbar = document.createElement('div');
  toolbar.id = 'cmkt-copy-toolbar';
  toolbar.style.cssText = `
    display:none;position:absolute;z-index:9999;background:#0f172a;border:1px solid #1e2a3a;
    border-radius:10px;padding:8px;gap:6px;flex-wrap:wrap;max-width:320px;box-shadow:0 8px 32px rgba(0,0,0,0.5)
  `;
  toolbar.innerHTML = `
    <div style="font-size:11px;color:#475569;padding:2px 6px;width:100%">AI Copy Assistant</div>
    ${['Rewrite','Shorten','Expand','More Persuasive','Add Urgency'].map(a =>
      `<button data-action="${a}" style="padding:5px 10px;border-radius:6px;border:1px solid #1e2a3a;background:#1e2a3a;color:#94a3b8;font-size:12px;cursor:pointer;white-space:nowrap">${a}</button>`
    ).join('')}
    <textarea id="cmkt-copy-instruction" placeholder="Or type your own instruction..." style="width:100%;margin-top:4px;padding:6px 8px;border-radius:6px;border:1px solid #1e2a3a;background:#0a0a1a;color:#fff;font-size:12px;resize:none;height:52px"></textarea>
    <button id="cmkt-copy-custom" style="padding:5px 12px;border-radius:6px;border:none;background:#6366f1;color:#fff;font-size:12px;cursor:pointer;font-weight:600">Apply →</button>
    <div id="cmkt-copy-results" style="display:none;width:100%;margin-top:6px;border-top:1px solid #1e2a3a;padding-top:8px"></div>
  `;
  document.body.appendChild(toolbar);

  let selectedComponent: { set: (k: string, v: string) => void; get: (k: string) => string } | null = null;

  editor.on('component:selected', (component: typeof selectedComponent) => {
    const tagName = (component as unknown as { get: (k: string) => string }).get('tagName') ?? '';
    const type    = (component as unknown as { get: (k: string) => string }).get('type')    ?? '';
    if (['h1','h2','h3','h4','p','span','a','button','li'].includes(tagName) || type === 'text') {
      selectedComponent = component;
      toolbar.style.display = 'flex';
    }
  });

  editor.on('component:deselected', () => {
    setTimeout(() => { toolbar.style.display = 'none'; }, 200);
  });

  async function rewriteText(action: string, customInstruction?: string) {
    if (!selectedComponent) return;
    const currentText = selectedComponent.get('content') ?? '';
    const resultsEl = document.getElementById('cmkt-copy-results')!;
    resultsEl.innerHTML = '<div style="color:#6366f1;font-size:12px">Generating...</div>';
    resultsEl.style.display = 'block';
    try {
      const data = await apiPost(`${claude}/rewrite-copy`, {
        text: currentText,
        action: customInstruction ?? action,
        brandProfile: brand,
      }) as { variants: string[] };
      resultsEl.innerHTML = (data.variants ?? []).map((v: string, i: number) =>
        `<div style="background:#1e2a3a;border-radius:6px;padding:8px;margin-bottom:6px;cursor:pointer;font-size:12px;color:#e2e8f0" onclick="this.closest('#cmkt-copy-results').dispatchEvent(new CustomEvent('pick',{detail:'${encodeURIComponent(v)}'}))">${i+1}. ${v}</div>`
      ).join('');
    } catch {
      resultsEl.innerHTML = '<div style="color:#ef4444;font-size:12px">Failed — check API key</div>';
    }
  }

  toolbar.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-action]') as HTMLElement;
    if (btn) rewriteText(btn.dataset.action ?? '');
  });
  document.getElementById('cmkt-copy-custom')?.addEventListener('click', () => {
    const instruction = (document.getElementById('cmkt-copy-instruction') as HTMLTextAreaElement).value;
    if (instruction) rewriteText('custom', instruction);
  });
  document.getElementById('cmkt-copy-results')?.addEventListener('pick', (e) => {
    if (selectedComponent) selectedComponent.set('content', decodeURIComponent((e as CustomEvent).detail));
    toolbar.style.display = 'none';
  });

  // ── PANEL 2: AI Section Generator ─────────────────────────────────────────

  const sectionGenEl = document.createElement('div');
  sectionGenEl.id = 'cmkt-section-gen';
  sectionGenEl.style.cssText = 'padding:12px;border-bottom:1px solid #1e2a3a';
  sectionGenEl.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">AI Section Generator</div>
    <textarea id="cmkt-section-prompt" placeholder="Describe a section... (e.g. 'Add a testimonials section with 3 cards')" style="width:100%;padding:8px;border-radius:8px;border:1px solid #1e2a3a;background:#0a0a1a;color:#fff;font-size:12px;resize:none;height:60px;margin-bottom:8px"></textarea>
    <button id="cmkt-section-gen-btn" style="width:100%;padding:9px;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:13px;font-weight:600;cursor:pointer">Generate Section →</button>
    <div id="cmkt-section-result" style="margin-top:8px;display:none"></div>
  `;

  document.addEventListener('click', async (e) => {
    if ((e.target as HTMLElement).id !== 'cmkt-section-gen-btn') return;
    const prompt = (document.getElementById('cmkt-section-prompt') as HTMLTextAreaElement).value;
    if (!prompt) return;
    const result = document.getElementById('cmkt-section-result')!;
    result.innerHTML = '<div style="color:#6366f1;font-size:12px;padding:6px">Generating...</div>';
    result.style.display = 'block';
    try {
      const data = await apiPost(`${claude}/generate-section`, { prompt, brandProfile: brand }) as { html: string };
      const preview = document.createElement('div');
      preview.style.cssText = 'background:#1e2a3a;border-radius:8px;padding:8px;font-size:11px;color:#94a3b8;cursor:grab';
      preview.textContent = 'Drag to page ↓';
      preview.draggable = true;
      preview.addEventListener('dragstart', () => {
        editor.Blocks.add('ai-generated-' + Date.now(), {
          label: 'AI Section',
          category: 'AI Generated',
          content: data.html,
        });
      });
      result.innerHTML = '';
      result.appendChild(preview);
    } catch {
      result.innerHTML = '<div style="color:#ef4444;font-size:11px;padding:6px">Failed to generate</div>';
    }
  });

  // ── PANEL 3: CRO Audit ────────────────────────────────────────────────────

  const croEl = document.createElement('div');
  croEl.id = 'cmkt-cro-panel';
  croEl.style.cssText = 'padding:12px;border-bottom:1px solid #1e2a3a;display:none';
  croEl.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">CRO Audit</div>
    <button id="cmkt-cro-run" style="width:100%;padding:9px;border-radius:8px;border:none;background:#0f172a;border:1px solid #1e2a3a;color:#94a3b8;font-size:13px;cursor:pointer;margin-bottom:8px">Run CRO Audit</button>
    <div id="cmkt-cro-results"></div>
  `;

  document.addEventListener('click', async (e) => {
    if ((e.target as HTMLElement).id !== 'cmkt-cro-run') return;
    const results = document.getElementById('cmkt-cro-results')!;
    results.innerHTML = '<div style="color:#6366f1;font-size:12px;padding:6px">Analyzing...</div>';
    try {
      const html = editor.getHtml();
      const data = await apiPost(`${claude}/cro-audit`, { html, brandProfile: brand }) as { score: number; issues: { description: string; fix: string }[] };
      const pct = data.score ?? 0;
      results.innerHTML = `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="color:#fff;font-size:13px;font-weight:700">CRO Score</span>
            <span style="color:#6366f1;font-weight:700">${pct}/100</span>
          </div>
          <div style="background:#1e2a3a;border-radius:4px;height:6px"><div style="background:#6366f1;border-radius:4px;height:6px;width:${pct}%"></div></div>
        </div>
        ${(data.issues ?? []).map((issue: { description: string; fix: string }) => `
        <div style="background:#1e2a3a;border-radius:8px;padding:8px;margin-bottom:6px">
          <div style="color:#f59e0b;font-size:11px;margin-bottom:4px">⚠ ${issue.description}</div>
          <button onclick="fetch('${claude}/apply-fix',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fix:'${encodeURIComponent(issue.fix)}',html:editor.getHtml()})}).then(r=>r.json()).then(d=>{editor.setComponents(d.html)})" style="font-size:11px;padding:3px 8px;border-radius:4px;border:none;background:#6366f1;color:#fff;cursor:pointer">Fix It</button>
        </div>`).join('')}
      `;
    } catch {
      results.innerHTML = '<div style="color:#ef4444;font-size:12px;padding:6px">Audit failed</div>';
    }
  });

  // ── PANEL 4: SEO Checker ──────────────────────────────────────────────────

  const seoEl = document.createElement('div');
  seoEl.id = 'cmkt-seo-panel';
  seoEl.style.cssText = 'padding:12px;border-bottom:1px solid #1e2a3a;display:none';
  seoEl.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">SEO Checker</div>
    <button id="cmkt-seo-run" style="width:100%;padding:9px;border-radius:8px;border:none;background:#0f172a;border:1px solid #1e2a3a;color:#94a3b8;font-size:13px;cursor:pointer;margin-bottom:8px">Run SEO Check</button>
    <div id="cmkt-seo-results"></div>
  `;

  document.addEventListener('click', async (e) => {
    if ((e.target as HTMLElement).id !== 'cmkt-seo-run') return;
    const results = document.getElementById('cmkt-seo-results')!;
    results.innerHTML = '<div style="color:#6366f1;font-size:12px;padding:6px">Checking...</div>';
    try {
      const html = editor.getHtml();
      const data = await apiPost(`${claude}/seo-check`, { html }) as { score: number; issues: { description: string }[] };
      const pct = data.score ?? 0;
      results.innerHTML = `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="color:#fff;font-size:13px;font-weight:700">SEO Score</span>
            <span style="color:#10b981;font-weight:700">${pct}/100</span>
          </div>
          <div style="background:#1e2a3a;border-radius:4px;height:6px"><div style="background:#10b981;border-radius:4px;height:6px;width:${pct}%"></div></div>
        </div>
        ${(data.issues ?? []).map((issue: { description: string }) => `
        <div style="background:#1e2a3a;border-radius:8px;padding:8px;margin-bottom:6px;font-size:11px;color:#94a3b8">⚠ ${issue.description}</div>`).join('')}
      `;
    } catch {
      results.innerHTML = '<div style="color:#ef4444;font-size:12px;padding:6px">SEO check failed</div>';
    }
  });

  // ── PANEL 5: AI Image Panel ───────────────────────────────────────────────

  const imgEl = document.createElement('div');
  imgEl.id = 'cmkt-img-panel';
  imgEl.style.cssText = 'padding:12px;display:none';
  imgEl.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">AI Image Generator</div>
    <textarea id="cmkt-img-prompt" placeholder="Describe an image... (e.g. 'professional team in modern office, dark theme')" style="width:100%;padding:8px;border-radius:8px;border:1px solid #1e2a3a;background:#0a0a1a;color:#fff;font-size:12px;resize:none;height:60px;margin-bottom:8px"></textarea>
    <button id="cmkt-img-gen-btn" style="width:100%;padding:9px;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:8px">Generate Image</button>
    <div id="cmkt-img-results" style="display:grid;grid-template-columns:1fr 1fr;gap:6px"></div>
  `;

  document.addEventListener('click', async (e) => {
    if ((e.target as HTMLElement).id !== 'cmkt-img-gen-btn') return;
    const prompt = (document.getElementById('cmkt-img-prompt') as HTMLTextAreaElement).value;
    if (!prompt) return;
    const results = document.getElementById('cmkt-img-results')!;
    results.innerHTML = '<div style="color:#6366f1;font-size:12px;grid-column:span 2;padding:6px">Generating image...</div>';
    try {
      const data = await apiPost(`${fal}/generate-image`, { prompt }) as { url: string };
      const img = document.createElement('img');
      img.src = data.url;
      img.style.cssText = 'width:100%;border-radius:8px;cursor:grab;border:1px solid #1e2a3a';
      img.title = 'Drag onto any image placeholder';
      img.draggable = true;
      img.addEventListener('dragstart', (ev) => {
        ev?.dataTransfer?.setData('text/html', `<img src="${data.url}" alt="${prompt}" style="width:100%;height:100%;object-fit:cover">`);
      });
      results.innerHTML = '';
      results.appendChild(img);
    } catch {
      results.innerHTML = '<div style="color:#ef4444;font-size:12px;grid-column:span 2;padding:6px">Image generation failed</div>';
    }
  });

  // ── Attach panels to right sidebar tab area ───────────────────────────────

  editor.on('load', () => {
    const rightPanel = document.querySelector('.gjs-pn-views-container') as HTMLElement | null;
    if (!rightPanel) return;
    const container = document.createElement('div');
    container.style.cssText = 'background:#0a0a1a;border-left:1px solid #1e2a3a;overflow-y:auto;max-height:100vh';

    // Tab bar
    const tabs = document.createElement('div');
    tabs.style.cssText = 'display:flex;border-bottom:1px solid #1e2a3a;background:#080812;flex-wrap:wrap';
    const tabData = [['Copy','cmkt-copy-toolbar'],['Generate','cmkt-section-gen'],['CRO','cmkt-cro-panel'],['SEO','cmkt-seo-panel'],['Images','cmkt-img-panel']];
    tabData.forEach(([label, panelId], i) => {
      const tab = document.createElement('button');
      tab.textContent = label;
      tab.style.cssText = `padding:8px 12px;border:none;background:none;color:${i===0?'#fff':'#475569'};font-size:12px;font-weight:600;cursor:pointer;border-bottom:${i===0?'2px solid #6366f1':'2px solid transparent'}`;
      tab.addEventListener('click', () => {
        // Activate tab
        tabs.querySelectorAll('button').forEach((b, j) => {
          (b as HTMLElement).style.color     = j === i ? '#fff'             : '#475569';
          (b as HTMLElement).style.borderBottom = j === i ? '2px solid #6366f1' : '2px solid transparent';
        });
        // Show/hide panels
        tabData.forEach(([, pid]) => {
          const el = document.getElementById(pid);
          if (el) el.style.display = pid === panelId ? 'block' : 'none';
        });
      });
      tabs.appendChild(tab);
    });

    container.appendChild(tabs);
    container.appendChild(sectionGenEl);
    container.appendChild(croEl);
    container.appendChild(seoEl);
    container.appendChild(imgEl);
    rightPanel.parentElement?.appendChild(container);

    // Show first panel by default
    sectionGenEl.style.display = 'block';
  });
}

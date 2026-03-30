'use client';

import { useEffect, useRef, useState } from 'react';
import type { Editor } from 'grapesjs';
import { buildEditorConfig, injectBrandVarsIntoCanvas } from '../config/editor-config';
import EditorToolbar from './EditorToolbar';
import type { BrandProfile } from '../../content-agent/types';

interface PageEditorProps {
  initialHTML?:  string;
  brandProfile?: BrandProfile;
  onSave:        (html: string, css: string) => void;
  onPublish:     (html: string, css: string) => Promise<string>;
}

export default function PageEditor({ initialHTML, brandProfile, onSave, onPublish }: PageEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef    = useRef<Editor | null>(null);
  const [ready, setReady] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    let editor: Editor;

    (async () => {
      const grapesjs = (await import('grapesjs')).default;
      // @ts-expect-error — no types for these plugins
      const presetWebpage  = (await import('grapesjs-preset-webpage')).default;
      // @ts-expect-error
      const blocksBasic    = (await import('grapesjs-blocks-basic')).default;
      // @ts-expect-error
      const pluginForms    = (await import('grapesjs-plugin-forms')).default;
      // @ts-expect-error
      const styleBg        = (await import('grapesjs-style-bg')).default;
      const { chiefmktBlocksPlugin } = await import('../plugins/chiefmkt-blocks');

      const config = buildEditorConfig();

      editor = grapesjs.init({
        container: containerRef.current!,
        ...config,
        plugins: [
          presetWebpage,
          blocksBasic,
          pluginForms,
          styleBg,
          chiefmktBlocksPlugin,
        ],
        pluginsOpts: {
          [presetWebpage as unknown as string]: {},
          [blocksBasic   as unknown as string]: { flexGrid: true },
        },
      });

      editorRef.current = editor;

      editor.on('load', () => {
        // Load initial HTML if provided
        if (initialHTML) {
          editor.setComponents(initialHTML);
        }

        // Inject brand CSS variables into canvas
        if (brandProfile) {
          injectBrandVarsIntoCanvas(editor.Canvas as unknown as { Canvas: { getDocument: () => Document | null } }, brandProfile);
        }

        setReady(true);
      });
    })();

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    const editor = editorRef.current;
    if (!editor) return;
    onSave(editor.getHtml(), editor.getCss());
  }

  async function handlePublish() {
    const editor = editorRef.current;
    if (!editor) return;
    setPublishing(true);
    try {
      const url = await onPublish(editor.getHtml(), editor.getCss());
      alert(`Published! URL: ${url}`);
    } catch (err) {
      alert(`Publish failed: ${(err as Error).message}`);
    } finally {
      setPublishing(false);
    }
  }

  function handlePreview() {
    const editor = editorRef.current;
    if (!editor) return;
    const html = editor.getHtml();
    const css  = editor.getCss();
    const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script src="https://cdn.tailwindcss.com"></script><style>${css}</style></head><body>${html}</body></html>`;
    const blob = new Blob([full], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#080812' }}>
      <EditorToolbar
        editor={editorRef.current}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
      />

      {!ready && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 15 }}>
          Loading editor…
        </div>
      )}

      <div
        ref={containerRef}
        style={{ flex: 1, display: ready ? 'block' : 'none' }}
      />

      {publishing && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, color: '#fff', fontSize: 18, fontWeight: 700,
        }}>
          Publishing…
        </div>
      )}
    </div>
  );
}

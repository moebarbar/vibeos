'use client';

import type { Editor } from 'grapesjs';

interface EditorToolbarProps {
  editor: Editor | null;
  onSave:    () => void;
  onPublish: () => void;
  onPreview: () => void;
}

const BTN = {
  base: {
    border: 'none', cursor: 'pointer', borderRadius: 8, padding: '7px 16px',
    fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
  },
  primary: { background: '#6366f1', color: '#fff' },
  ghost:   { background: '#1e2a3a', color: '#94a3b8' },
  success: { background: '#10b981', color: '#fff' },
} as const;

export default function EditorToolbar({ editor, onSave, onPublish, onPreview }: EditorToolbarProps) {
  const setDevice = (device: string) => editor?.Devices.select(device);

  return (
    <div style={{
      height: 48, background: '#0a0a1a', borderBottom: '1px solid #1e2a3a',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0,
    }}>
      {/* Left: brand */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#6366f1', marginRight: 8 }}>
        Page Builder
      </div>

      {/* Undo / Redo */}
      <button style={{ ...BTN.base, ...BTN.ghost }} onClick={() => editor?.UndoManager.undo()}>↩ Undo</button>
      <button style={{ ...BTN.base, ...BTN.ghost }} onClick={() => editor?.UndoManager.redo()}>↪ Redo</button>

      <div style={{ width: 1, height: 24, background: '#1e2a3a', margin: '0 4px' }} />

      {/* Device toggles */}
      {(['Desktop', 'Tablet', 'Mobile'] as const).map(d => (
        <button key={d} style={{ ...BTN.base, ...BTN.ghost, padding: '7px 12px' }} onClick={() => setDevice(d)}>
          {d === 'Desktop' ? '🖥' : d === 'Tablet' ? '📱' : '📲'}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Right: actions */}
      <button style={{ ...BTN.base, ...BTN.ghost }} onClick={onPreview}>Preview</button>
      <button style={{ ...BTN.base, ...BTN.ghost }} onClick={onSave}>Save</button>
      <button style={{ ...BTN.base, ...BTN.success }} onClick={onPublish}>🚀 Publish</button>
    </div>
  );
}

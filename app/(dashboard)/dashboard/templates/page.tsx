"use client";
import { useState } from "react";
import { TEMPLATES, TEMPLATE_CATEGORIES, type Template } from "@/lib/templates";

export default function TemplatesPage() {
  const [cat, setCat] = useState("landing");
  const [selected, setSelected] = useState<Template | null>(null);
  const [vars, setVars] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"browse" | "configure" | "preview">("browse");
  const [copied, setCopied] = useState(false);

  const templates = TEMPLATES[cat] ?? [];

  function pick(t: Template) {
    const dv: Record<string, string> = {};
    t.vars.forEach(v => { dv[v.key] = v.default; });
    setSelected(t);
    setVars(dv);
    setStage("configure");
  }

  function preview() {
    setStage("preview");
  }

  function getCode(t: Template, v: Record<string, string>): string {
    return t.codeTemplate(v);
  }

  const copyCode = () => {
    if (!selected) return;
    navigator.clipboard.writeText(getCode(selected, vars));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render the live component directly — NO iframe needed
  const LiveComponent = selected ? selected.component(vars) : null;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: 195, borderRight: "1px solid #0a0a0a", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0, overflowY: "auto" }}>
        <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.14em", paddingLeft: 4, marginBottom: 5 }}>CATEGORIES</div>
        {TEMPLATE_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => { setCat(c.id); setStage("browse"); setSelected(null); }} style={{ background: cat === c.id ? "#fff" : "transparent", border: "1px solid #111", borderRadius: 8, padding: "8px 10px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 13 }}>{c.icon}</span>
            <span style={{ flex: 1, fontSize: 11, fontWeight: cat === c.id ? 700 : 400, color: cat === c.id ? "#000" : "#555" }}>{c.label}</span>
            <span style={{ fontSize: 9, color: cat === c.id ? "#888" : "#2a2a2a" }}>{TEMPLATES[c.id]?.length ?? 0}</span>
          </button>
        ))}
        <div style={{ marginTop: "auto", padding: 10, background: "#0a0a0a", border: "1px solid #0f0f0f", borderRadius: 9 }}>
          {["1. Pick template", "2. Edit variables", "3. See live preview", "4. Copy code"].map(s => (
            <div key={s} style={{ fontSize: 10, color: "#333", marginBottom: 4, lineHeight: 1.4 }}>{s}</div>
          ))}
        </div>
      </div>

      {/* Header nav for stages */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {stage !== "browse" && (
          <div style={{ borderBottom: "1px solid #0a0a0a", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => { setStage("browse"); setSelected(null); }} style={{ background: "transparent", border: "1px solid #1a1a1a", borderRadius: 6, color: "#555", padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>← Library</button>
            {stage === "preview" && (
              <button onClick={() => setStage("configure")} style={{ background: "transparent", border: "1px solid #1a1a1a", borderRadius: 6, color: "#555", padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✏ Edit Vars</button>
            )}
            <span style={{ fontSize: 11, color: "#2a2a2a" }}>{selected?.name}</span>
          </div>
        )}

        {/* BROWSE */}
        {stage === "browse" && (
          <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: 2 }}>{TEMPLATE_CATEGORIES.find(c => c.id === cat)?.label}</div>
              <div style={{ fontSize: 11, color: "#2a2a2a" }}>Click a template → customize variables → instant live preview</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
              {templates.map(t => {
                const Thumb = t.thumbnail;
                return (
                  <div key={t.id} onClick={() => pick(t)} style={{ background: "#0d0d0d", border: "1px solid #141414", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "border-color 0.18s" }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = "#252525")}
                    onMouseOut={e => (e.currentTarget.style.borderColor = "#141414")}>
                    <div style={{ height: 140, overflow: "hidden", position: "relative", borderBottom: "1px solid #0a0a0a", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Thumb />
                      <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, padding: "2px 7px", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{t.vibe}</div>
                      <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 4 }}>
                        <span style={{ borderRadius: 8, padding: "2px 7px", fontSize: 9, fontWeight: 600, background: t.difficulty === "Simple" ? "#0d1f17" : t.difficulty === "Medium" ? "#1a1500" : "#1f0d0d", color: t.difficulty === "Simple" ? "#00ff88" : t.difficulty === "Medium" ? "#fbbf24" : "#f87171" }}>{t.difficulty}</span>
                      </div>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#e0e0e0", marginBottom: 4 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#3a3a3a", lineHeight: 1.6, marginBottom: 10 }}>{t.desc}</div>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {t.vars.slice(0, 3).map(v => (
                          <div key={v.key} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: "1px 6px", fontSize: 8, color: "#444", fontFamily: "monospace" }}>{v.key}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONFIGURE */}
        {stage === "configure" && selected && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <div style={{ width: 300, borderRight: "1px solid #0a0a0a", padding: 20, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", flexShrink: 0 }}>
              <div style={{ fontWeight: 800, fontSize: "0.92rem", marginBottom: 2 }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{selected.desc}</div>
              <div style={{ height: 1, background: "#0f0f0f" }} />
              <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.14em" }}>CUSTOMIZE VARIABLES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {selected.vars.map(v => (
                  <div key={v.key}>
                    <label style={{ fontSize: 10, color: "#444", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{v.label}</label>
                    <input value={vars[v.key] ?? ""} onChange={e => setVars(p => ({ ...p, [v.key]: e.target.value }))} placeholder={v.default} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 7, color: "#ccc", fontFamily: "inherit", fontSize: 12, padding: "8px 11px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "auto" }}>
                <button onClick={preview} style={{ width: "100%", background: "#00FFB2", border: "none", borderRadius: 8, color: "#000", padding: 13, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Preview Live →</button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
              <div style={{ textAlign: "center", maxWidth: 380 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>🚀</div>
                <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>Configure & preview</div>
                <div style={{ fontSize: 12, color: "#444", lineHeight: 1.8, marginBottom: 20 }}>Fill in your values on the left, then hit Preview Live to render the component instantly.</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                  {selected.vars.map(v => (
                    <div key={v.key} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 6, padding: "4px 9px", fontSize: 10 }}>
                      <span style={{ color: "#2a2a2a", fontFamily: "monospace" }}>{v.key}: </span>
                      <span style={{ color: "#888" }}>{vars[v.key] || v.default}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW — direct React rendering, no iframe */}
        {stage === "preview" && selected && LiveComponent && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Code panel */}
            <div style={{ width: 280, borderRight: "1px solid #0a0a0a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 10, color: "#00FFB2", fontFamily: "monospace" }}>✓ READY</div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
                <pre style={{ fontSize: 9.5, color: "#3a3a3a", lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  <code>{getCode(selected, vars)}</code>
                </pre>
              </div>
              <div style={{ padding: "10px 14px", borderTop: "1px solid #0a0a0a" }}>
                <button onClick={copyCode} style={{ width: "100%", background: "#00FFB2", border: "none", borderRadius: 7, color: "#000", padding: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", marginBottom: 5, fontFamily: "inherit" }}>
                  {copied ? "✓ Copied!" : "⎘ Copy Code for Cursor / Claude"}
                </button>
                <div style={{ fontSize: 9, color: "#2a2a2a", textAlign: "center", fontFamily: "monospace" }}>Paste into Cursor, Claude Code, or v0</div>
              </div>
            </div>

            {/* Live preview — direct React component */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid #0a0a0a", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ fontSize: 9, color: "#2a2a2a", fontFamily: "monospace", background: "#0a0a0a", border: "1px solid #0f0f0f", borderRadius: 4, padding: "2px 8px" }}>
                  ✓ Live Preview — {selected.name}
                </div>
              </div>
              {/* The component renders directly here in React — no iframe, no CSP issues */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <LiveComponent />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

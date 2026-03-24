"use client";
import { useState } from "react";
import { ELEMENTS, type Element, CATEGORIES, VIBES } from "@/lib/elements";

export default function ForgePage() {
  const [cat, setCat] = useState("buttons");
  const [vibe, setVibe] = useState("All");
  const [selected, setSelected] = useState<Element | null>(null);
  const [tab, setTab] = useState<"preview" | "prompt">("preview");
  const [showGen, setShowGen] = useState(false);
  const [genDesc, setGenDesc] = useState("");
  const [genVibe, setGenVibe] = useState("Dark & Minimal");
  const [genOut, setGenOut] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const elements = ELEMENTS[cat]?.filter(e => vibe === "All" || e.vibe === vibe) ?? [];

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePrompt = async () => {
    if (!genDesc.trim()) return;
    setGenLoading(true);
    setGenOut("");
    const res = await fetch("/api/agents/forge_gen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Component type: ${CATEGORIES.find(c => c.id === cat)?.label}\nStyle vibe: ${genVibe}\nDescription: ${genDesc}`,
      }),
    });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let out = "";
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        out += decoder.decode(value, { stream: true });
        setGenOut(out);
      }
    }
    setGenLoading(false);
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: "1px solid #0f0f0f", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0, overflowY: "auto" }}>
        <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.14em", paddingLeft: 4, marginBottom: 5 }}>CATEGORIES</div>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => { setCat(c.id); setSelected(null); }} style={{ background: cat === c.id ? "#fff" : "transparent", border: "1px solid #111", borderRadius: 8, padding: "7px 10px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 13 }}>{c.icon}</span>
            <span style={{ flex: 1, fontSize: 11, fontWeight: cat === c.id ? 700 : 400, color: cat === c.id ? "#000" : "#555" }}>{c.label}</span>
            <span style={{ fontSize: 9, color: cat === c.id ? "#888" : "#2a2a2a" }}>{ELEMENTS[c.id]?.length ?? 0}</span>
          </button>
        ))}
        <div style={{ marginTop: "auto", padding: 10, background: "#0a0a0a", border: "1px solid #0f0f0f", borderRadius: 9 }}>
          <div style={{ fontSize: 9, color: "#2a2a2a", marginBottom: 6 }}>TOTAL ELEMENTS</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{Object.values(ELEMENTS).reduce((a, v) => a + v.length, 0)}</div>
          <div style={{ fontSize: 10, color: "#444", marginTop: 3 }}>+ AI generation</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Grid */}
        <div style={{ flex: selected ? "0 0 50%" : 1, borderRight: selected ? "1px solid #0f0f0f" : "none", padding: 16, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: 2 }}>{CATEGORIES.find(c => c.id === cat)?.label}</div>
              <div style={{ fontSize: 11, color: "#2a2a2a" }}>{elements.length} elements</div>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {VIBES.map(v => (
                <button key={v} onClick={() => setVibe(v)} style={{ background: vibe === v ? "#0d1f17" : "transparent", border: `1px solid ${vibe === v ? "#00FFB2" : "#111"}`, borderRadius: 20, color: vibe === v ? "#00FFB2" : "#333", padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>{v}</button>
              ))}
            </div>
          </div>

          {/* Generator Toggle */}
          <button onClick={() => setShowGen(!showGen)} style={{ width: "100%", background: "#0a0a0a", border: "1px dashed #1a1a1a", borderRadius: 9, color: "#444", padding: 10, fontSize: 11, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
            {showGen ? "↑ Hide Generator" : "⚡ Generate New Element with AI"}
          </button>

          {showGen && (
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: 14, marginBottom: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <select value={genVibe} onChange={e => setGenVibe(e.target.value)} style={{ background: "#060606", border: "1px solid #1a1a1a", borderRadius: 7, color: "#666", fontSize: 11, padding: "6px 8px", outline: "none", fontFamily: "inherit" }}>
                  {VIBES.filter(v => v !== "All").map(v => <option key={v}>{v}</option>)}
                </select>
                <select value={cat} onChange={e => setCat(e.target.value)} style={{ background: "#060606", border: "1px solid #1a1a1a", borderRadius: 7, color: "#666", fontSize: 11, padding: "6px 8px", outline: "none", fontFamily: "inherit" }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <textarea rows={3} value={genDesc} onChange={e => setGenDesc(e.target.value)} placeholder="Describe the element you want (e.g. A dark card with glassmorphism, gradient border, hover lift)..." style={{ background: "#060606", border: "1px solid #1a1a1a", borderRadius: 7, color: "#aaa", fontSize: 12, padding: "8px 10px", resize: "none", outline: "none", lineHeight: 1.5, fontFamily: "system-ui" }} />
              <button onClick={generatePrompt} disabled={genLoading || !genDesc.trim()} style={{ background: "#00FFB2", border: "none", borderRadius: 7, color: "#000", padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-end", opacity: genLoading || !genDesc.trim() ? 0.4 : 1 }}>
                {genLoading ? "Generating..." : "Generate Prompt →"}
              </button>
              {genOut && (
                <div style={{ background: "#060606", border: "1px solid #1a3a2a", borderRadius: 8, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: "#444" }}>GENERATED PROMPT</span>
                    <button onClick={() => copy(genOut)} style={{ background: "transparent", border: "none", color: "#00FFB2", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>{copied ? "✓ Copied!" : "Copy"}</button>
                  </div>
                  <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{genOut}</div>
                </div>
              )}
            </div>
          )}

          {/* Element Grid */}
          <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
            {elements.map(el => {
              const Preview = el.preview;
              return (
                <div key={el.id} onClick={() => setSelected(selected?.id === el.id ? null : el)} style={{ background: "#0a0a0a", border: `1px solid ${selected?.id === el.id ? "#00FFB2" : "#111"}`, borderRadius: 12, cursor: "pointer", overflow: "hidden", transition: "border-color 0.15s" }}
                  onMouseOver={e => { if (selected?.id !== el.id) e.currentTarget.style.borderColor = "#252525"; }}
                  onMouseOut={e => { if (selected?.id !== el.id) e.currentTarget.style.borderColor = "#111"; }}>
                  <div style={{ height: 130, overflow: "hidden", position: "relative", borderBottom: "1px solid #0a0a0a", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Preview />
                    <div style={{ position: "absolute", top: 7, right: 7, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 5, padding: "2px 6px", fontSize: 8, color: "rgba(255,255,255,0.35)" }}>{el.vibe}</div>
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#ccc", marginBottom: 3 }}>{el.name}</div>
                    <div style={{ fontSize: 10, color: "#333", marginBottom: 6 }}>{el.difficulty} · {el.vibe}</div>
                    <div style={{ fontSize: 10, color: "#2a2a2a", textAlign: "right", fontFamily: "monospace" }}>{selected?.id === el.id ? "← viewing" : "view →"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: 3 }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: "#444" }}>{selected.vibe} · {selected.difficulty}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: 17 }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: 5, borderBottom: "1px solid #0f0f0f", paddingBottom: 10 }}>
              {(["preview", "prompt"] as const).map(m => (
                <button key={m} onClick={() => setTab(m)} style={{ background: tab === m ? "#1a1a1a" : "transparent", border: "none", color: tab === m ? "#fff" : "#444", fontSize: 11, padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>
                  {m === "preview" ? "👁 Preview" : "⎘ Prompt"}
                </button>
              ))}
            </div>

            {tab === "preview" ? (
              <div style={{ background: "#060606", border: "1px solid #111", borderRadius: 10, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}>
                <selected.preview />
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: "#333", letterSpacing: "0.1em" }}>PASTE INTO CURSOR / CLAUDE / V0</span>
                  <button onClick={() => copy(selected.prompt)} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 6, color: "#666", padding: "4px 10px", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>{copied ? "✓ Copied!" : "⎘ Copy"}</button>
                </div>
                <div style={{ background: "#060606", border: "1px solid #111", borderRadius: 9, padding: 14, fontSize: 11.5, color: "#666", lineHeight: 1.8, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{selected.prompt}</div>
              </div>
            )}

            <div style={{ marginTop: "auto", padding: "12px 14px", background: "#0a0a0a", border: "1px solid #111", borderRadius: 9 }}>
              <div style={{ fontSize: 11, color: "#444", marginBottom: 6 }}>GENERATE VARIATION</div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 10, lineHeight: 1.5 }}>Want a different style? Use the generator above to create a custom version.</div>
              <button onClick={() => { setShowGen(true); setGenDesc(`A variation of: ${selected.name}`); }} style={{ width: "100%", padding: 8, background: "#00FFB2", border: "none", borderRadius: 7, color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>⚡ Generate Variation</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

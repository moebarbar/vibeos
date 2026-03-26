"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ELEMENTS, CATEGORIES, VIBES, type Element } from "@/lib/elements";
import { TEMPLATES, TEMPLATE_CATEGORIES, type Template } from "@/lib/templates";

interface AiPick {
  id: string;
  category: string;
  name: string;
  type: "element" | "template";
  reason: string;
}

type ElWithCat = Element & { category: string };

const ALL_ELEMENTS: ElWithCat[] = Object.entries(ELEMENTS).flatMap(([category, els]) =>
  els.map(el => ({ ...el, category }))
);
const ALL_TEMPLATES = Object.values(TEMPLATES).flat();

const DIFF_BADGE: Record<string, { bg: string; color: string; border: string }> = {
  Simple:   { bg: "rgba(255,255,255,0.06)",  color: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.08)"  },
  Medium:   { bg: "rgba(251,191,36,0.1)",    color: "#fbbf24",               border: "rgba(251,191,36,0.2)"   },
  Advanced: { bg: "rgba(248,113,113,0.1)",   color: "#f87171",               border: "rgba(248,113,113,0.2)"  },
};

export default function ForgePage() {
  return <Suspense fallback={null}><ForgeInner /></Suspense>;
}

function ForgeInner() {
  const searchParams = useSearchParams();

  // Section — can be set via ?section=templates URL param
  const [section, setSection] = useState<"elements" | "templates">(
    searchParams.get("section") === "templates" ? "templates" : "elements"
  );

  // Filters
  const [elCat,   setElCat]   = useState("buttons");
  const [tmplCat, setTmplCat] = useState("landing");
  const [vibe,    setVibe]    = useState("All");
  const [search,  setSearch]  = useState("");

  // Selection
  const [selectedEl,   setSelectedEl]   = useState<ElWithCat | null>(null);
  const [selectedTmpl, setSelectedTmpl] = useState<Template | null>(null);
  const [tab, setTab] = useState<"preview" | "code" | "prompt">("preview");
  const [tmplVars, setTmplVars] = useState<Record<string, string>>({});

  // AI Picks
  const [aiPicks,     setAiPicks]     = useState<AiPick[]>([]);
  const [aiLoading,   setAiLoading]   = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [projectName, setProjectName] = useState<string | null>(null);

  // Build Kit
  const [buildKit,     setBuildKit]     = useState<string[]>([]);
  const [showBuildKit, setShowBuildKit] = useState(false);

  // Copy
  const [copied, setCopied] = useState(false);

  // Popup modal (replaces full-page overlay)
  const [fullPreview, setFullPreview] = useState(false);
  const [popupCopied, setPopupCopied] = useState<"code" | "prompt" | null>(null);

  // AI Generator
  const [showGen,   setShowGen]   = useState(false);
  const [genDesc,   setGenDesc]   = useState("");
  const [genVibe,   setGenVibe]   = useState("Dark & Minimal");
  const [genOut,    setGenOut]    = useState("");
  const [genLoading,setGenLoading]= useState(false);

  // ── Load project + build kit ──────────────────────────────────────────
  useEffect(() => {
    fetch("/api/projects/active")
      .then(r => r.json())
      .then(d => {
        if (d?.name) setProjectName(d.name);
        if (d?.contextBrief) fetchAiPicks(d.contextBrief);
      })
      .catch(() => {});
    try {
      const saved = localStorage.getItem("vos-kit");
      if (saved) setBuildKit(JSON.parse(saved));
    } catch {}
  }, []);

  const fetchAiPicks = async (context: string) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/agents/forge_recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectContext: context }),
      });
      if (res.ok) setAiPicks((await res.json()).picks ?? []);
    } catch {}
    setAiLoading(false);
  };

  // ── Build Kit ─────────────────────────────────────────────────────────
  const inKit = (id: string) => buildKit.includes(id);
  const toggleKit = (id: string) => {
    const next = inKit(id) ? buildKit.filter(x => x !== id) : [...buildKit, id];
    setBuildKit(next);
    localStorage.setItem("vos-kit", JSON.stringify(next));
  };

  // ── New tab preview ───────────────────────────────────────────────────
  const openInNewTab = (id: string) => { window.open(`/preview/${id}`, "_blank"); };

  // ── Copy ─────────────────────────────────────────────────────────────
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Generator ────────────────────────────────────────────────────────
  const generatePrompt = async () => {
    if (!genDesc.trim()) return;
    setGenLoading(true);
    setGenOut("");
    const catLabel = section === "elements"
      ? (CATEGORIES.find(c => c.id === elCat)?.label ?? elCat)
      : (TEMPLATE_CATEGORIES.find(c => c.id === tmplCat)?.label ?? tmplCat);
    const res = await fetch("/api/agents/forge_gen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Component type: ${catLabel}\nStyle vibe: ${genVibe}\nDescription: ${genDesc}` }),
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

  // ── Filtered lists ────────────────────────────────────────────────────
  const elements: ElWithCat[] = showBuildKit
    ? ALL_ELEMENTS.filter(el => buildKit.includes(el.id))
    : ALL_ELEMENTS.filter(el => {
        if (elCat !== "all" && el.category !== elCat) return false;
        if (vibe !== "All" && el.vibe !== vibe) return false;
        if (search && !el.name.toLowerCase().includes(search.toLowerCase()) &&
            !el.desc.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });

  const templates = (TEMPLATES[tmplCat] ?? []).filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Selection helpers ─────────────────────────────────────────────────
  const selectEl = (el: ElWithCat) => {
    setSelectedEl(prev => prev?.id === el.id ? null : el);
    setSelectedTmpl(null);
    setTab("preview");
  };

  const selectTmpl = (t: Template) => {
    setSelectedTmpl(prev => prev?.id === t.id ? null : t);
    setSelectedEl(null);
    setTab("preview");
    const init: Record<string, string> = {};
    t.vars.forEach(v => { init[v.key] = v.default; });
    setTmplVars(init);
  };

  const closeDetail = () => { setSelectedEl(null); setSelectedTmpl(null); };
  const detailOpen = selectedEl !== null || selectedTmpl !== null;

  return (
    <>
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>

      {/* ══ SIDEBAR ═══════════════════════════════════════════════════════ */}
      <div style={{
        width: 214, borderRight: "1px solid rgba(255,255,255,0.03)",
        display: "flex", flexDirection: "column", flexShrink: 0,
        background: "rgba(0,0,0,0.18)",
      }}>
        {/* Section toggle */}
        <div style={{ padding: "11px 10px 8px" }}>
          <div style={{ display: "flex", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 9, padding: 2, gap: 1 }}>
            {(["elements", "templates"] as const).map(s => (
              <button key={s} onClick={() => { setSection(s); closeDetail(); setShowBuildKit(false); }} style={{
                flex: 1, background: section === s ? "rgba(255,255,255,0.06)" : "transparent",
                border: "none", borderRadius: 7, color: section === s ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.48)",
                fontSize: 9.5, fontWeight: section === s ? 600 : 400, padding: "5px 0",
                cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "0.06em", textTransform: "uppercase" as const,
                transition: "all 0.15s",
              }}>
                {s === "elements" ? "⬡  Elements" : "▣  Templates"}
              </button>
            ))}
          </div>
        </div>

        {/* Category list */}
        <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.38)", letterSpacing: "0.14em", marginBottom: 6, paddingLeft: 6, fontWeight: 600 }}>
            {section === "elements" ? "CATEGORIES" : "TEMPLATES"}
          </div>

          {/* "All" row — elements only */}
          {section === "elements" && (
            <SidebarBtn
              icon="◈"
              label="All Elements"
              count={ALL_ELEMENTS.length}
              active={elCat === "all" && !showBuildKit}
              onClick={() => { setElCat("all"); setShowBuildKit(false); closeDetail(); }}
            />
          )}

          {(section === "elements" ? CATEGORIES : TEMPLATE_CATEGORIES).map(c => {
            const count = section === "elements"
              ? (ELEMENTS[c.id]?.length ?? 0)
              : (TEMPLATES[c.id]?.length ?? 0);
            const active = (section === "elements" ? elCat : tmplCat) === c.id && !showBuildKit;
            return (
              <SidebarBtn key={c.id}
                icon={c.icon}
                label={c.label}
                count={count}
                active={active}
                onClick={() => {
                  if (section === "elements") setElCat(c.id);
                  else setTmplCat(c.id);
                  setShowBuildKit(false);
                  closeDetail();
                }}
              />
            );
          })}
        </div>

        {/* Build Kit */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.03)", padding: 10 }}>
          {buildKit.length > 0 && !showBuildKit && (
            <button onClick={() => { copy(ALL_ELEMENTS.filter(e => buildKit.includes(e.id)).map(e => `// ${e.name}\n${e.code}`).join("\n\n// ─────────────────────────────────────────\n\n")); }} style={{
              width: "100%", background: "transparent", border: "none", borderRadius: 6,
              color: "rgba(0,255,178,0.4)", padding: "4px 8px", fontSize: 9, cursor: "pointer",
              fontFamily: "inherit", textAlign: "left" as const, marginBottom: 6, letterSpacing: "0.05em",
            }}>
              ⎘ Export Kit ({buildKit.length})
            </button>
          )}
          <button onClick={() => { setShowBuildKit(!showBuildKit); closeDetail(); }} style={{
            width: "100%", background: showBuildKit ? "rgba(0,255,178,0.05)" : "rgba(0,0,0,0.25)",
            border: `1px solid ${showBuildKit ? "rgba(0,255,178,0.12)" : "rgba(255,255,255,0.04)"}`,
            borderRadius: 8, padding: "8px 10px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 15 }}>🗂</span>
            <div style={{ flex: 1, textAlign: "left" as const }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: showBuildKit ? "#00FFB2" : "rgba(255,255,255,0.55)" }}>Build Kit</div>
              <div style={{ fontSize: 8.5, color: showBuildKit ? "rgba(0,255,178,0.45)" : "rgba(255,255,255,0.3)", marginTop: 1 }}>
                {buildKit.length === 0 ? "Save elements here" : `${buildKit.length} saved`}
              </div>
            </div>
            {buildKit.length > 0 && (
              <span style={{ width: 16, height: 16, background: "#00FFB2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#000" }}>
                {buildKit.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ══ MAIN AREA ══════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          height: 50, borderBottom: "1px solid rgba(255,255,255,0.03)",
          display: "flex", alignItems: "center", gap: 8, padding: "0 14px", flexShrink: 0,
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "0 0 260px" }}>
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "rgba(255,255,255,0.15)", pointerEvents: "none" }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${section}...`}
              style={{
                width: "100%", background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 8, padding: "5px 10px 5px 26px",
                fontSize: 11, color: "rgba(255,255,255,0.5)",
                outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const,
              }}
            />
          </div>

          {/* Vibe pills */}
          <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
            {VIBES.map(v => (
              <button key={v} onClick={() => setVibe(v)} style={{
                background: vibe === v ? "rgba(0,255,178,0.06)" : "transparent",
                border: `1px solid ${vibe === v ? "rgba(0,255,178,0.18)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20, color: vibe === v ? "#00FFB2" : "rgba(255,255,255,0.48)",
                padding: "3px 9px", fontSize: 9, cursor: "pointer",
                fontFamily: "inherit", whiteSpace: "nowrap" as const, transition: "all 0.15s",
              }}>{v}</button>
            ))}
          </div>

          {/* Generator toggle */}
          <button onClick={() => setShowGen(p => !p)} style={{
            background: showGen ? "rgba(255,255,255,0.06)" : "transparent",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 7,
            color: showGen ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)",
            padding: "5px 10px", fontSize: 9.5, cursor: "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap" as const,
            letterSpacing: "0.04em",
          }}>
            {showGen ? "↑ Hide" : "⚡ AI Generate"}
          </button>
        </div>

        {/* AI Generator panel */}
        {showGen && (
          <div style={{
            borderBottom: "1px solid rgba(255,255,255,0.03)", padding: "10px 14px",
            background: "rgba(0,0,0,0.15)", flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
              <select value={genVibe} onChange={e => setGenVibe(e.target.value)} style={{
                background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 6, color: "rgba(255,255,255,0.35)", fontSize: 10,
                padding: "5px 7px", outline: "none", fontFamily: "inherit", flexShrink: 0,
              }}>
                {VIBES.filter(v => v !== "All").map(v => <option key={v}>{v}</option>)}
              </select>
              <textarea
                rows={1} value={genDesc} onChange={e => setGenDesc(e.target.value)}
                placeholder="Describe the component you want (e.g. dark card with gradient border and hover glow)..."
                style={{
                  flex: 1, background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
                  color: "rgba(255,255,255,0.55)", fontSize: 11, padding: "6px 8px",
                  resize: "none", outline: "none", fontFamily: "system-ui",
                }}
              />
              <button onClick={generatePrompt} disabled={genLoading || !genDesc.trim()} style={{
                background: "#00FFB2", border: "none", borderRadius: 6, color: "#000",
                padding: "6px 12px", fontSize: 10, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", flexShrink: 0,
                opacity: genLoading || !genDesc.trim() ? 0.4 : 1,
              }}>
                {genLoading ? "..." : "Generate →"}
              </button>
            </div>
            {genOut && (
              <div style={{ marginTop: 9, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,255,178,0.08)", borderRadius: 7, padding: "9px 11px", display: "flex", gap: 10 }}>
                <div style={{ flex: 1, fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{genOut}</div>
                <button onClick={() => copy(genOut)} style={{ background: "none", border: "none", color: "#00FFB2", fontSize: 10, cursor: "pointer", fontFamily: "monospace", flexShrink: 0, alignSelf: "flex-start" }}>
                  {copied ? "✓" : "⎘ Copy"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI Picks strip */}
        {section === "elements" && (projectName || aiLoading) && (
          <div style={{
            borderBottom: "1px solid rgba(255,255,255,0.03)", flexShrink: 0,
            background: "linear-gradient(90deg,rgba(0,255,178,0.025) 0%,transparent 60%)",
          }}>
            {/* Strip header */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px 0" }}>
              {aiLoading ? (
                <span className="vibe-dot-pulse" style={{ width: 6, height: 6 }} />
              ) : (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFB2", display: "inline-block", boxShadow: "0 0 10px #00FFB244" }} />
              )}
              <span style={{ fontSize: 9.5, color: "#00FFB2", letterSpacing: "0.07em", fontWeight: 600 }}>
                {aiLoading ? "AI analyzing your project…" : `AI Picks for ${projectName}`}
              </span>
              {!aiLoading && aiPicks.length > 0 && (
                <>
                  <span style={{ fontSize: 9, color: "rgba(0,255,178,0.3)", marginLeft: 2 }}>{aiPicks.length} recommendations</span>
                  <button onClick={() => setAiCollapsed(p => !p)} style={{
                    marginLeft: "auto", background: "none", border: "none",
                    color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 11,
                  }}>
                    {aiCollapsed ? "↓" : "↑"}
                  </button>
                </>
              )}
            </div>

            {/* Cards row */}
            {!aiCollapsed && (
              <div style={{ display: "flex", gap: 8, padding: "8px 14px 11px", overflowX: "auto" }}>
                {aiLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                      width: 136, height: 106, flexShrink: 0,
                      background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)",
                      borderRadius: 9, opacity: 0.4,
                    }} />
                  ))
                ) : aiPicks.map(pick => {
                  const elInfo  = ALL_ELEMENTS.find(e => e.id === pick.id);
                  const tmplInfo= ALL_TEMPLATES.find(t => t.id === pick.id);
                  const PreviewComp = elInfo ? elInfo.preview : tmplInfo?.thumbnail;
                  const name = elInfo?.name ?? tmplInfo?.name ?? pick.name;
                  if (!PreviewComp) return null;
                  const saved = inKit(pick.id);
                  return (
                    <div
                      key={pick.id}
                      title={pick.reason}
                      onClick={() => {
                        if (elInfo) { setElCat(elInfo.category); selectEl(elInfo); }
                        else if (tmplInfo) { setSection("templates"); setTmplCat(pick.category); selectTmpl(tmplInfo); }
                      }}
                      style={{
                        width: 136, flexShrink: 0, cursor: "pointer", overflow: "hidden",
                        background: "rgba(0,0,0,0.3)",
                        border: `1px solid ${saved ? "rgba(0,255,178,0.2)" : "rgba(255,255,255,0.05)"}`,
                        borderRadius: 9, transition: "border-color 0.15s",
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = saved ? "rgba(0,255,178,0.35)" : "rgba(255,255,255,0.1)"; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = saved ? "rgba(0,255,178,0.2)" : "rgba(255,255,255,0.05)"; }}
                    >
                      <div style={{
                        height: 70, background: "rgba(0,0,0,0.4)", display: "flex",
                        alignItems: "center", justifyContent: "center", overflow: "hidden",
                      }}>
                        <div style={{ transform: "scale(0.65)", transformOrigin: "center" }}>
                          <PreviewComp />
                        </div>
                      </div>
                      <div style={{ padding: "5px 8px 7px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                        <div style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{name}</div>
                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.18)", lineHeight: 1.4 }}>
                          {pick.reason.length > 46 ? pick.reason.slice(0, 46) + "…" : pick.reason}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── GRID + DETAIL ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            {/* Section meta */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>
                  {showBuildKit
                    ? "🗂 Build Kit"
                    : section === "elements"
                      ? CATEGORIES.find(c => c.id === elCat)?.label ?? "All Elements"
                      : TEMPLATE_CATEGORIES.find(c => c.id === tmplCat)?.label}
                </span>
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.12)", marginLeft: 8 }}>
                  {section === "elements" ? elements.length : templates.length}{" "}
                  {section === "elements" ? "elements" : "templates"}
                </span>
              </div>
            </div>

            {/* ── ELEMENT GRID ── */}
            {section === "elements" && (
              elements.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.1)", fontSize: 12, paddingTop: 70 }}>
                  {showBuildKit ? "Your Build Kit is empty. Click + Add to Kit on any element." : "No elements match your filters."}
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: detailOpen ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 10,
                }}>
                  {elements.map(el => {
                    const active = selectedEl?.id === el.id;
                    const saved  = inKit(el.id);
                    const diff   = DIFF_BADGE[el.difficulty] ?? DIFF_BADGE.Simple;
                    const Preview = el.preview;
                    return (
                      <div
                        key={el.id}
                        onClick={() => selectEl(el)}
                        style={{
                          background: active ? "rgba(0,255,178,0.02)" : "rgba(0,0,0,0.22)",
                          border: `1px solid ${active ? "rgba(0,255,178,0.25)" : saved ? "rgba(0,255,178,0.08)" : "rgba(255,255,255,0.04)"}`,
                          borderRadius: 11, cursor: "pointer", overflow: "hidden",
                          transition: "all 0.15s",
                        }}
                        onMouseOver={e => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                        onMouseOut={e => { if (!active) e.currentTarget.style.borderColor = saved ? "rgba(0,255,178,0.08)" : "rgba(255,255,255,0.04)"; }}
                      >
                        {/* Preview */}
                        <div style={{
                          height: 160,
                          position: "relative",
                          overflow: "hidden",
                          background: el.category === "backgrounds" ? "transparent" : "rgba(0,0,0,0.4)",
                          display: el.category === "backgrounds" ? "block" : "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          {el.category === "backgrounds" ? (
                            <div style={{ position: "absolute", inset: 0 }}>
                              <Preview />
                            </div>
                          ) : (
                            <Preview />
                          )}
                          {/* Vibe badge */}
                          <span style={{
                            position: "absolute", top: 8, right: 8,
                            background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 4, padding: "2px 6px", fontSize: 8,
                            color: "rgba(255,255,255,0.55)",
                            backdropFilter: "blur(8px)",
                          }}>{el.vibe}</span>
                          {/* Kit badge */}
                          {saved && (
                            <span style={{
                              position: "absolute", top: 8, left: 8,
                              background: "rgba(0,255,178,0.14)", border: "1px solid rgba(0,255,178,0.3)",
                              borderRadius: 20, width: 20, height: 20,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 9, color: "#00FFB2",
                            }}>✓</span>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 12, fontWeight: 600, marginBottom: 5,
                              color: active ? "#fff" : "rgba(255,255,255,0.82)",
                              whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
                            }}>{el.name}</div>
                            <span style={{
                              fontSize: 9, borderRadius: 4, padding: "2px 7px",
                              background: diff.bg, color: diff.color,
                              border: `1px solid ${diff.border}`,
                              fontWeight: 600, letterSpacing: "0.03em",
                            }}>{el.difficulty}</span>
                          </div>
                          <span style={{ fontSize: 10, color: active ? "#00FFB2" : "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>
                            {active ? "←" : "→"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* ── TEMPLATE GRID ── */}
            {section === "templates" && (
              templates.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.1)", fontSize: 12, paddingTop: 70 }}>
                  More templates coming soon.
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: detailOpen ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 12,
                }}>
                  {templates.map(t => {
                    const active = selectedTmpl?.id === t.id;
                    const Thumb = t.thumbnail;
                    return (
                      <div key={t.id} onClick={() => selectTmpl(t)} style={{
                        background: active ? "rgba(0,255,178,0.02)" : "rgba(0,0,0,0.22)",
                        border: `1px solid ${active ? "rgba(0,255,178,0.25)" : "rgba(255,255,255,0.04)"}`,
                        borderRadius: 11, cursor: "pointer", overflow: "hidden",
                        transition: "all 0.15s",
                      }}
                        onMouseOver={e => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                        onMouseOut={e => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; }}
                      >
                        <div style={{ height: 160, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                          <div style={{ width: "100%", height: "100%" }}>
                            <Thumb />
                          </div>
                        </div>
                        <div style={{ padding: "10px 12px" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.82)", marginBottom: 6 }}>{t.name}</div>
                          <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" as const }}>
                            <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "1px 6px" }}>{t.vibe}</span>
                            <span style={{
                              fontSize: 8.5, borderRadius: 4, padding: "1px 6px",
                              background: (DIFF_BADGE[t.difficulty] ?? DIFF_BADGE.Simple).bg,
                              color: (DIFF_BADGE[t.difficulty] ?? DIFF_BADGE.Simple).color,
                              border: `1px solid ${(DIFF_BADGE[t.difficulty] ?? DIFF_BADGE.Simple).border}`,
                              fontWeight: 600,
                            }}>{t.difficulty}</span>
                            <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.35)" }}>{t.vars.length} vars</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* ══ DETAIL PANEL ══════════════════════════════════════════════ */}
          {detailOpen && (
            <div style={{
              width: 400, borderLeft: "1px solid rgba(255,255,255,0.03)",
              display: "flex", flexDirection: "column", overflow: "hidden",
              background: "rgba(0,0,0,0.12)",
              animation: "vibe-slide-up 0.18s ease both",
            }}>

              {/* ── ELEMENT detail ── */}
              {selectedEl && (
                <>
                  {/* Header */}
                  <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.03)", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>{selectedEl.name}</div>
                        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)" }}>{selectedEl.vibe} · {selectedEl.difficulty}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        <button onClick={() => toggleKit(selectedEl.id)} style={{
                          background: inKit(selectedEl.id) ? "rgba(0,255,178,0.08)" : "rgba(0,0,0,0.3)",
                          border: `1px solid ${inKit(selectedEl.id) ? "rgba(0,255,178,0.2)" : "rgba(255,255,255,0.06)"}`,
                          borderRadius: 6, color: inKit(selectedEl.id) ? "#00FFB2" : "rgba(255,255,255,0.3)",
                          padding: "4px 9px", fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                          transition: "all 0.15s",
                        }}>
                          {inKit(selectedEl.id) ? "✓ In Kit" : "+ Kit"}
                        </button>
                        <button onClick={() => setFullPreview(true)} title="Fullscreen overlay" style={{
                          background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, color: "rgba(255,255,255,0.35)", padding: "4px 8px",
                          fontSize: 11, cursor: "pointer", lineHeight: 1, transition: "all 0.15s",
                        }}>⛶</button>
                        <button onClick={() => openInNewTab(selectedEl.id)} title="Open in new tab" style={{
                          background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, color: "rgba(255,255,255,0.35)", padding: "4px 8px",
                          fontSize: 11, cursor: "pointer", lineHeight: 1, transition: "all 0.15s",
                        }}>↗</button>
                        <button onClick={closeDetail} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 10.5, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>{selectedEl.desc}</p>
                  </div>

                  {/* Tabs */}
                  <div style={{ display: "flex", gap: 3, padding: "8px 14px 0", flexShrink: 0 }}>
                    {([
                      { id: "preview", label: "👁  Preview" },
                      { id: "code",    label: "{ }  Code"   },
                      { id: "prompt",  label: "⎘  Prompt"  },
                    ] as const).map(m => (
                      <button key={m.id} onClick={() => setTab(m.id)} style={{
                        background: tab === m.id
                          ? m.id === "code" ? "rgba(0,255,178,0.06)" : "rgba(255,255,255,0.05)"
                          : "transparent",
                        border: tab === m.id && m.id === "code"
                          ? "1px solid rgba(0,255,178,0.12)" : "none",
                        color: tab === m.id
                          ? m.id === "code" ? "#00FFB2" : "rgba(255,255,255,0.6)"
                          : "rgba(255,255,255,0.2)",
                        fontSize: 10, padding: "5px 10px", borderRadius: 6,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      }}>{m.label}</button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
                    {tab === "preview" && (
                      <div>
                        <div style={{
                          background: "#080808", border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 12, overflow: "hidden", minHeight: 280,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                        }}>
                          <selectedEl.preview />
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                          <button onClick={() => setFullPreview(true)} style={{
                            flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 7, color: "rgba(255,255,255,0.4)", padding: "7px", fontSize: 10,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          }}>⛶ Fullscreen</button>
                          <button onClick={() => openInNewTab(selectedEl.id)} style={{
                            flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 7, color: "rgba(255,255,255,0.4)", padding: "7px", fontSize: 10,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          }}>↗ Open in New Tab</button>
                        </div>
                      </div>
                    )}

                    {tab === "code" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFB2", display: "inline-block", boxShadow: "0 0 8px #00FFB244" }} />
                            <span style={{ fontSize: 8.5, color: "#00FFB2", letterSpacing: "0.1em", fontFamily: "monospace", fontWeight: 600 }}>READY-TO-USE COMPONENT</span>
                          </div>
                          <button onClick={() => copy(selectedEl.code)} style={{
                            background: copied ? "rgba(0,255,178,0.08)" : "rgba(0,0,0,0.4)",
                            border: copied ? "1px solid rgba(0,255,178,0.22)" : "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 6, color: copied ? "#00FFB2" : "rgba(255,255,255,0.3)",
                            padding: "4px 10px", fontSize: 9, cursor: "pointer", fontFamily: "monospace",
                            transition: "all 0.2s",
                          }}>
                            {copied ? "✓ Copied!" : "⎘ Copy"}
                          </button>
                        </div>
                        <div style={{
                          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.04)",
                          borderRadius: 9, padding: "12px 14px",
                          fontSize: 10.5, color: "#6dbfa4", lineHeight: 1.9,
                          fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                          whiteSpace: "pre-wrap" as const, overflowX: "auto",
                          maxHeight: 420, overflowY: "auto",
                        }}>
                          {selectedEl.code}
                        </div>
                        <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                          <button onClick={() => copy(`// ${selectedEl.name} — VIbeOS Element Forge\n\n${selectedEl.code}`)} style={{
                            flex: 1, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.04)",
                            borderRadius: 6, color: "rgba(255,255,255,0.2)", padding: "6px", fontSize: 9,
                            cursor: "pointer", fontFamily: "inherit",
                          }}>⎘ Copy with comment</button>
                        </div>
                      </div>
                    )}

                    {tab === "prompt" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.15)", letterSpacing: "0.12em", fontWeight: 600 }}>PASTE INTO CURSOR / CLAUDE / V0</span>
                          <button onClick={() => copy(selectedEl.prompt)} style={{
                            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 5, color: "rgba(255,255,255,0.3)", padding: "3px 8px",
                            fontSize: 9, cursor: "pointer", fontFamily: "monospace",
                          }}>{copied ? "✓" : "⎘ Copy"}</button>
                        </div>
                        <div style={{
                          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.04)",
                          borderRadius: 9, padding: "12px 14px",
                          fontSize: 10.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.85,
                          fontFamily: "monospace", whiteSpace: "pre-wrap" as const,
                        }}>
                          {selectedEl.prompt}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.03)", flexShrink: 0 }}>
                    <button onClick={() => { setShowGen(true); setGenDesc(`A variation of: ${selectedEl.name}`); closeDetail(); }} style={{
                      width: "100%", background: "rgba(0,0,0,0.25)",
                      border: "1px solid rgba(255,255,255,0.04)", borderRadius: 7,
                      color: "rgba(255,255,255,0.25)", padding: "7px", fontSize: 10,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      ⚡ Generate Variation with AI
                    </button>
                  </div>
                </>
              )}

              {/* ── TEMPLATE detail ── */}
              {selectedTmpl && (
                <>
                  {/* Header */}
                  <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.03)", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 3 }}>{selectedTmpl.name}</div>
                        <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)" }}>{selectedTmpl.vibe} · {selectedTmpl.difficulty} · {selectedTmpl.vars.length} variables</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button onClick={() => setFullPreview(true)} title="Fullscreen overlay" style={{
                          background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, color: "rgba(255,255,255,0.35)", padding: "4px 8px",
                          fontSize: 11, cursor: "pointer", lineHeight: 1,
                        }}>⛶</button>
                        <button onClick={() => openInNewTab(selectedTmpl.id)} title="Open in new tab" style={{
                          background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, color: "rgba(255,255,255,0.35)", padding: "4px 8px",
                          fontSize: 11, cursor: "pointer", lineHeight: 1,
                        }}>↗</button>
                        <button onClick={closeDetail} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 10.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>{selectedTmpl.desc}</p>
                  </div>

                  {/* Tabs — same as elements */}
                  <div style={{ display: "flex", gap: 3, padding: "8px 14px 0", flexShrink: 0 }}>
                    {([
                      { id: "preview", label: "👁  Preview" },
                      { id: "code",    label: "{ }  Code"  },
                      { id: "prompt",  label: "✎  Vars"   },
                    ] as const).map(m => (
                      <button key={m.id} onClick={() => setTab(m.id)} style={{
                        background: tab === m.id
                          ? m.id === "code" ? "rgba(0,255,178,0.06)" : "rgba(255,255,255,0.05)"
                          : "transparent",
                        border: tab === m.id && m.id === "code"
                          ? "1px solid rgba(0,255,178,0.12)" : "none",
                        color: tab === m.id
                          ? m.id === "code" ? "#00FFB2" : "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.3)",
                        fontSize: 10, padding: "5px 10px", borderRadius: 6,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      }}>{m.label}</button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
                    {/* Preview — full live component */}
                    {tab === "preview" && (
                      <div>
                        <div style={{
                          border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
                          overflow: "auto", maxHeight: 480, background: "#080808",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                        }}>
                          {(() => { const C = selectedTmpl.component(tmplVars); return <C />; })()}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                          <button onClick={() => setFullPreview(true)} style={{
                            flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 7, color: "rgba(255,255,255,0.4)", padding: "7px", fontSize: 10,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          }}>⛶ Fullscreen</button>
                          <button onClick={() => openInNewTab(selectedTmpl.id)} style={{
                            flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 7, color: "rgba(255,255,255,0.4)", padding: "7px", fontSize: 10,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                          }}>↗ Open in New Tab</button>
                        </div>
                      </div>
                    )}

                    {/* Code */}
                    {tab === "code" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFB2", display: "inline-block", boxShadow: "0 0 8px #00FFB244" }} />
                            <span style={{ fontSize: 8.5, color: "#00FFB2", letterSpacing: "0.1em", fontFamily: "monospace", fontWeight: 600 }}>READY-TO-USE CODE</span>
                          </div>
                          <button onClick={() => copy(selectedTmpl.codeTemplate(tmplVars))} style={{
                            background: copied ? "rgba(0,255,178,0.08)" : "rgba(0,0,0,0.4)",
                            border: copied ? "1px solid rgba(0,255,178,0.22)" : "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 6, color: copied ? "#00FFB2" : "rgba(255,255,255,0.4)",
                            padding: "4px 10px", fontSize: 9, cursor: "pointer", fontFamily: "monospace",
                            transition: "all 0.2s",
                          }}>{copied ? "✓ Copied!" : "⎘ Copy"}</button>
                        </div>
                        <div style={{
                          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.04)",
                          borderRadius: 9, padding: "12px 14px",
                          fontSize: 10.5, color: "#6dbfa4", lineHeight: 1.9,
                          fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                          whiteSpace: "pre-wrap" as const, overflowX: "auto",
                        }}>
                          {selectedTmpl.codeTemplate(tmplVars)}
                        </div>
                      </div>
                    )}

                    {/* Vars customizer */}
                    {tab === "prompt" && (
                      <div>
                        <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 12 }}>CUSTOMIZE VARIABLES</div>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                          {selectedTmpl.vars.map(v => (
                            <div key={v.key}>
                              <label style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 4, fontFamily: "inherit" }}>{v.label}</label>
                              <input
                                value={tmplVars[v.key] ?? v.default}
                                onChange={e => setTmplVars(prev => ({ ...prev, [v.key]: e.target.value }))}
                                style={{
                                  width: "100%", background: "rgba(0,0,0,0.35)",
                                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
                                  color: "rgba(255,255,255,0.65)", fontSize: 12, padding: "7px 10px",
                                  outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const,
                                  transition: "border-color 0.15s",
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,255,178,0.3)")}
                                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                              />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setTab("preview")} style={{
                          width: "100%", marginTop: 16, background: "#00FFB2",
                          border: "none", borderRadius: 7, color: "#000",
                          padding: "8px", fontSize: 11, fontWeight: 700,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>
                          👁 Preview with these variables →
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ── POPUP MODAL ────────────────────────────────────────────────────── */}
    {fullPreview && (selectedEl || selectedTmpl) && (() => {
      // Navigation helpers
      const currentIndex = selectedEl
        ? elements.findIndex(e => e.id === selectedEl.id)
        : templates.findIndex(t => t.id === selectedTmpl!.id);
      const total = selectedEl ? elements.length : templates.length;
      const hasPrev = currentIndex > 0;
      const hasNext = currentIndex < total - 1;
      const goNext = () => {
        if (!hasNext) return;
        if (selectedEl) setSelectedEl(elements[currentIndex + 1]);
        else { const next = templates[currentIndex + 1]; selectTmpl(next); }
      };
      const goPrev = () => {
        if (!hasPrev) return;
        if (selectedEl) setSelectedEl(elements[currentIndex - 1]);
        else { const prev = templates[currentIndex - 1]; selectTmpl(prev); }
      };

      const itemName = selectedEl?.name ?? selectedTmpl?.name ?? "";
      const itemVibe = selectedEl?.vibe ?? selectedTmpl?.vibe ?? "";
      const itemDifficulty = selectedEl?.difficulty ?? selectedTmpl?.difficulty ?? "";
      const diff = DIFF_BADGE[itemDifficulty] ?? DIFF_BADGE.Simple;
      const itemId = selectedEl?.id ?? selectedTmpl?.id ?? "";
      const itemDesc = selectedEl?.desc ?? selectedTmpl?.desc ?? "";

      // Preview rendering
      const renderPreview = () => {
        if (selectedEl) {
          const POPUP_ZOOM: Record<string, number> = { buttons: 1.8, cards: 2.5, forms: 3, nav: 3, hero: 2, dashboards: 1.8 };
          const isBackground = selectedEl.category === "backgrounds";
          if (isBackground) {
            return (
              <div style={{ position: "absolute", inset: 0 }}>
                <selectedEl.preview />
              </div>
            );
          }
          const zoom = POPUP_ZOOM[selectedEl.category] ?? 2;
          const isCentered = selectedEl.category === "buttons" || selectedEl.category === "cards";
          return (
            <div style={{
              width: "100%", height: "100%", overflow: "auto", background: "#060608",
              ...(isCentered ? { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 380 } : {}),
            }}>
              <div style={{ zoom, width: "100%" }}>
                <selectedEl.preview />
              </div>
            </div>
          );
        }
        if (selectedTmpl) {
          const C = selectedTmpl.component(tmplVars);
          return (
            <div style={{ width: "100%", height: "100%", overflow: "auto", background: "#060608" }}>
              <C />
            </div>
          );
        }
        return null;
      };

      return (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setFullPreview(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.82)", backdropFilter: "blur(20px)",
            }}
          />
          {/* Modal box */}
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "min(900px, 92vw)", maxHeight: "88vh",
            background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 20, overflow: "hidden",
            display: "flex", flexDirection: "column",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8)",
            animation: "vibe-slide-up 0.2s ease both",
            zIndex: 10000,
          }}>
            {/* Header */}
            <div style={{
              height: 52, display: "flex", alignItems: "center",
              padding: "0 20px", gap: 10,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.3)", flexShrink: 0,
            }}>
              {/* Left: icon + name + badges */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 22, height: 22, flexShrink: 0,
                  background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
                  borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                }}>⚡</div>
                <span style={{
                  fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.88)",
                  whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
                }}>{itemName}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{itemVibe}</span>
                <span style={{
                  fontSize: 9, borderRadius: 4, padding: "2px 6px", flexShrink: 0,
                  background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`,
                  fontWeight: 600,
                }}>{itemDifficulty}</span>
              </div>
              {/* Center: nav */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={goPrev} disabled={!hasPrev}
                  style={{
                    background: "none", border: "none", cursor: hasPrev ? "pointer" : "default",
                    color: hasPrev ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)",
                    fontSize: 14, padding: "2px 6px", lineHeight: 1,
                  }}
                >←</button>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", whiteSpace: "nowrap" as const }}>
                  {currentIndex + 1} / {total}
                </span>
                <button
                  onClick={goNext} disabled={!hasNext}
                  style={{
                    background: "none", border: "none", cursor: hasNext ? "pointer" : "default",
                    color: hasNext ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)",
                    fontSize: 14, padding: "2px 6px", lineHeight: 1,
                  }}
                >→</button>
              </div>
              {/* Right: actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                {selectedEl && (
                  <button onClick={() => toggleKit(selectedEl.id)} style={{
                    background: inKit(selectedEl.id) ? "rgba(0,255,178,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${inKit(selectedEl.id) ? "rgba(0,255,178,0.2)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 8, color: inKit(selectedEl.id) ? "#00FFB2" : "rgba(255,255,255,0.5)",
                    padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {inKit(selectedEl.id) ? "✓ In Kit" : "+ Kit"}
                  </button>
                )}
                <button onClick={() => openInNewTab(itemId)} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 8, color: "rgba(255,255,255,0.5)",
                  padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                }}>↗ Open</button>
                <button onClick={() => setFullPreview(false)} style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer",
                  lineHeight: 1, padding: "2px 4px",
                }}>✕</button>
              </div>
            </div>

            {/* Preview area */}
            <div style={{
              flex: 1, overflow: "hidden", position: "relative", minHeight: 380,
            }}>
              {renderPreview()}
            </div>

            {/* Footer */}
            <div style={{
              height: 64, display: "flex", alignItems: "center",
              padding: "0 20px", gap: 12,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(0,0,0,0.2)", flexShrink: 0,
            }}>
              <div style={{
                flex: 1, fontSize: 11, color: "rgba(255,255,255,0.3)",
                maxWidth: 440, lineHeight: 1.55,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
              }}>{itemDesc}</div>
              {selectedEl && (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEl.code);
                      setPopupCopied("code");
                      setTimeout(() => setPopupCopied(null), 2000);
                    }}
                    style={{
                      background: popupCopied === "code" ? "rgba(0,255,178,0.08)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${popupCopied === "code" ? "rgba(0,255,178,0.2)" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 8, fontSize: 11, padding: "7px 14px",
                      color: popupCopied === "code" ? "#00FFB2" : "rgba(255,255,255,0.5)",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                  >
                    {popupCopied === "code" ? "✓ Copied!" : "⎘ Copy Code"}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEl.prompt);
                      setPopupCopied("prompt");
                      setTimeout(() => setPopupCopied(null), 2000);
                    }}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 8, fontSize: 11, padding: "7px 14px",
                      color: "rgba(255,255,255,0.5)",
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {popupCopied === "prompt" ? "✓ Copied!" : "✦ Copy Prompt"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      );
    })()}
    </>
  );
}

// ── Sidebar button component ──────────────────────────────────────────────
function SidebarBtn({ icon, label, count, active, onClick }: {
  icon: string; label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      width: "100%", background: active ? "rgba(255,255,255,0.05)" : "transparent",
      border: "none", borderRadius: 7, padding: "7px 10px", cursor: "pointer",
      textAlign: "left" as const, fontFamily: "inherit",
      display: "flex", alignItems: "center", gap: 7, marginBottom: 2,
      transition: "background 0.15s",
    }}
      onMouseOver={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
      onMouseOut={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ fontSize: 12, width: 16, textAlign: "center" as const }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 11, color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.52)", fontWeight: active ? 600 : 400 }}>{label}</span>
      {count > 0 && (
        <span style={{
          fontSize: 9, color: active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)",
          background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)",
          borderRadius: 10, padding: "1px 6px", fontFamily: "monospace",
        }}>{count}</span>
      )}
    </button>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";

interface KanbanCard {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  column: string;
  position: number;
  aiPrompt: string | null;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  contextBrief: string | null;
  description: string;
}

const COLUMNS: { id: string; label: string; color: string; glow: string }[] = [
  { id: "plan",        label: "Plan",        color: "#38BDF8", glow: "rgba(56,189,248,0.15)" },
  { id: "in_progress", label: "In Progress", color: "#A78BFA", glow: "rgba(167,139,250,0.15)" },
  { id: "done",        label: "Done",        color: "#00FFB2", glow: "rgba(0,255,178,0.15)"   },
];

export default function KanbanPage() {
  const [project, setProject]         = useState<Project | null>(null);
  const [cards, setCards]             = useState<KanbanCard[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [detailDraft, setDetailDraft] = useState<Partial<KanbanCard>>({});
  const [saveTimeout, setSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Add card
  const [addingCol, setAddingCol]   = useState<string | null>(null);
  const [newTitle, setNewTitle]     = useState("");

  // AI board generation
  const [showGenModal, setShowGenModal] = useState(false);
  const [genDesc, setGenDesc]           = useState("");
  const [generating, setGenerating]     = useState(false);

  // AI prompt generation (for selected card)
  const [promptLoading, setPromptLoading] = useState(false);
  const [copied, setCopied]               = useState(false);

  // Drag state
  const dragCard    = useRef<KanbanCard | null>(null);
  const dragOverCol = useRef<string | null>(null);
  const [dragOverColState, setDragOverColState] = useState<string | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/projects/active")
      .then(r => r.json())
      .then(async (p: Project) => {
        if (!p?.id) { setLoading(false); return; }
        setProject(p);
        const res = await fetch(`/api/kanban?projectId=${p.id}`);
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────
  const cardsIn = (col: string) =>
    cards.filter(c => c.column === col).sort((a, b) => a.position - b.position);

  const openCard = (card: KanbanCard) => {
    setSelectedCard(card);
    setDetailDraft(card);
  };

  const closeDetail = () => { setSelectedCard(null); setDetailDraft({}); };

  // Auto-save with debounce
  const patchCard = (id: string, data: Partial<KanbanCard>) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    setSaveTimeout(setTimeout(async () => {
      const res = await fetch(`/api/kanban/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setCards(prev => prev.map(c => c.id === id ? updated : c));
        if (selectedCard?.id === id) setSelectedCard(updated);
      }
    }, 600));
  };

  const handleDraftChange = (field: keyof KanbanCard, value: string) => {
    const next = { ...detailDraft, [field]: value };
    setDetailDraft(next);
    if (selectedCard) patchCard(selectedCard.id, { [field]: value });
  };

  // ── Add card ──────────────────────────────────────────────────────────
  const addCard = async (col: string) => {
    if (!newTitle.trim() || !project) return;
    const res = await fetch("/api/kanban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, title: newTitle.trim(), column: col }),
    });
    if (res.ok) {
      const card = await res.json();
      setCards(prev => [...prev, card]);
    }
    setNewTitle("");
    setAddingCol(null);
  };

  // ── Delete card ────────────────────────────────────────────────────────
  const deleteCard = async (id: string) => {
    await fetch(`/api/kanban/${id}`, { method: "DELETE" });
    setCards(prev => prev.filter(c => c.id !== id));
    closeDetail();
  };

  // ── AI: Generate full board ────────────────────────────────────────────
  const generateBoard = async () => {
    if (!genDesc.trim() || !project) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/agents/kanban_breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          projectName: project.name,
          projectDescription: genDesc,
        }),
      });
      if (res.ok) {
        const { cards: newCards } = await res.json();
        setCards(prev => [...prev, ...newCards]);
      }
    } finally {
      setGenerating(false);
      setShowGenModal(false);
      setGenDesc("");
    }
  };

  // ── AI: Generate prompt for card ──────────────────────────────────────
  const generatePrompt = async () => {
    if (!selectedCard) return;
    setPromptLoading(true);
    let out = "";
    try {
      const res = await fetch("/api/agents/kanban_prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: detailDraft.title ?? selectedCard.title,
          description: detailDraft.description ?? selectedCard.description,
          projectContext: project?.contextBrief ?? project?.description,
        }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          out += decoder.decode(value, { stream: true });
          setDetailDraft(prev => ({ ...prev, aiPrompt: out }));
        }
      }
      // Persist the generated prompt
      if (selectedCard) patchCard(selectedCard.id, { aiPrompt: out });
    } finally {
      setPromptLoading(false);
    }
  };

  // ── Copy prompt ────────────────────────────────────────────────────────
  const copyPrompt = () => {
    if (!detailDraft.aiPrompt) return;
    navigator.clipboard.writeText(detailDraft.aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Drag & drop ────────────────────────────────────────────────────────
  const onDragStart = (card: KanbanCard) => { dragCard.current = card; };

  const onDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    dragOverCol.current = col;
    setDragOverColState(col);
  };

  const onDragLeave = () => { setDragOverColState(null); };

  const onDrop = async (col: string) => {
    const card = dragCard.current;
    dragCard.current = null;
    dragOverCol.current = null;
    setDragOverColState(null);
    if (!card || card.column === col) return;

    // Optimistic update
    const colCards = cardsIn(col);
    const newPosition = colCards.length;
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, column: col, position: newPosition } : c));

    await fetch("/api/kanban/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards: [{ id: card.id, column: col, position: newPosition }] }),
    });
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
        Loading board...
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ fontSize: 28 }}>⊟</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>No active project</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Select or create a project to use the Build Board</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%", flexDirection: "column", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{
        padding: "18px 24px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>⊟</span>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em" }}>Build Board</h1>
            <span style={{
              fontSize: 9, color: "#00FFB2", background: "rgba(0,255,178,0.08)",
              border: "1px solid rgba(0,255,178,0.18)", borderRadius: 5,
              padding: "2px 8px", fontWeight: 600, letterSpacing: "0.06em",
            }}>{project.name}</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
            {cards.length} card{cards.length !== 1 ? "s" : ""} · Drag to move between columns
          </p>
        </div>
        <button
          onClick={() => { setShowGenModal(true); if (project.contextBrief) setGenDesc(project.contextBrief); else if (project.description) setGenDesc(project.description); }}
          style={{
            background: "linear-gradient(135deg, rgba(0,255,178,0.12), rgba(56,189,248,0.12))",
            border: "1px solid rgba(0,255,178,0.25)",
            borderRadius: 9, color: "#00FFB2", padding: "8px 16px",
            fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            letterSpacing: "0.04em", transition: "all 0.2s",
            boxShadow: "0 0 20px rgba(0,255,178,0.08)",
          }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(0,255,178,0.2)"; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(0,255,178,0.08)"; }}
        >
          ⚡ Generate Board with AI
        </button>
      </div>

      {/* ── BOARD ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Columns */}
        <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden" }}>
          {COLUMNS.map((col, colIdx) => {
            const colCards = cardsIn(col.id);
            const isDragOver = dragOverColState === col.id;
            return (
              <div
                key={col.id}
                onDragOver={e => onDragOver(e, col.id)}
                onDragLeave={onDragLeave}
                onDrop={() => onDrop(col.id)}
                style={{
                  flex: 1,
                  display: "flex", flexDirection: "column",
                  borderRight: colIdx < COLUMNS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  background: isDragOver ? col.glow : "transparent",
                  transition: "background 0.15s",
                  overflow: "hidden",
                }}
              >
                {/* Column header */}
                <div style={{
                  padding: "14px 16px 10px",
                  display: "flex", alignItems: "center", gap: 8,
                  borderBottom: "1px solid rgba(255,255,255,0.03)", flexShrink: 0,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: col.color, boxShadow: `0 0 8px ${col.color}88`, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: col.color, letterSpacing: "0.1em", flex: 1 }}>
                    {col.label.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: 9, color: "rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.05)", borderRadius: 10,
                    padding: "2px 7px", fontFamily: "monospace",
                  }}>{colCards.length}</span>
                </div>

                {/* Cards */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
                  {colCards.map(card => (
                    <KanbanCardItem
                      key={card.id}
                      card={card}
                      isSelected={selectedCard?.id === card.id}
                      colColor={col.color}
                      onDragStart={() => onDragStart(card)}
                      onClick={() => openCard(card)}
                    />
                  ))}

                  {/* Add card inline form */}
                  {addingCol === col.id ? (
                    <div style={{ marginTop: 6 }}>
                      <textarea
                        autoFocus
                        placeholder="Card title..."
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addCard(col.id); }
                          if (e.key === "Escape") { setAddingCol(null); setNewTitle(""); }
                        }}
                        rows={2}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${col.color}44`, borderRadius: 8,
                          color: "rgba(255,255,255,0.8)", fontSize: 12, padding: "8px 10px",
                          resize: "none" as const, outline: "none", fontFamily: "inherit",
                          boxSizing: "border-box" as const,
                        }}
                      />
                      <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                        <button onClick={() => addCard(col.id)} style={{
                          flex: 1, background: col.color, border: "none", borderRadius: 6,
                          color: "#000", fontSize: 11, fontWeight: 700, padding: "6px",
                          cursor: "pointer", fontFamily: "inherit",
                        }}>Add Card</button>
                        <button onClick={() => { setAddingCol(null); setNewTitle(""); }} style={{
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 6, color: "rgba(255,255,255,0.3)", padding: "6px 10px",
                          fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                        }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingCol(col.id)}
                      style={{
                        width: "100%", marginTop: 6, background: "transparent",
                        border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 8,
                        color: "rgba(255,255,255,0.2)", padding: "8px",
                        fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                      onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${col.color}44`; (e.currentTarget as HTMLButtonElement).style.color = col.color; }}
                      onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.2)"; }}
                    >
                      + Add Card
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DETAIL PANEL ──────────────────────────────────────────────── */}
        {selectedCard && (
          <div style={{
            width: 420, borderLeft: "1px solid rgba(255,255,255,0.05)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            background: "rgba(0,0,0,0.2)",
            animation: "vibe-slide-up 0.18s ease both",
          }}>
            {/* Detail header */}
            <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, marginRight: 10 }}>
                  <input
                    value={detailDraft.title ?? ""}
                    onChange={e => handleDraftChange("title", e.target.value)}
                    style={{
                      width: "100%", background: "transparent", border: "none",
                      color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 700,
                      outline: "none", fontFamily: "inherit", padding: 0,
                      borderBottom: "1px solid transparent", transition: "border-color 0.15s",
                      boxSizing: "border-box" as const,
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "transparent")}
                    placeholder="Card title"
                  />
                </div>
                <button onClick={closeDetail} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>✕</button>
              </div>

              {/* Column selector */}
              <div style={{ display: "flex", gap: 4 }}>
                {COLUMNS.map(col => (
                  <button
                    key={col.id}
                    onClick={() => handleDraftChange("column", col.id)}
                    style={{
                      background: detailDraft.column === col.id ? `${col.color}18` : "transparent",
                      border: `1px solid ${detailDraft.column === col.id ? col.color + "44" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 6, color: detailDraft.column === col.id ? col.color : "rgba(255,255,255,0.3)",
                      padding: "3px 9px", fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                      fontWeight: detailDraft.column === col.id ? 700 : 400, letterSpacing: "0.06em",
                      transition: "all 0.15s",
                    }}
                  >{col.label}</button>
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>DESCRIPTION</div>
                <textarea
                  value={detailDraft.description ?? ""}
                  onChange={e => handleDraftChange("description", e.target.value)}
                  placeholder="What does this task cover?"
                  rows={3}
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8,
                    color: "rgba(255,255,255,0.65)", fontSize: 12, padding: "8px 10px",
                    resize: "none" as const, outline: "none", fontFamily: "inherit",
                    lineHeight: 1.6, boxSizing: "border-box" as const, transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                />
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>TAGS</div>
                <input
                  value={detailDraft.tags ?? ""}
                  onChange={e => handleDraftChange("tags", e.target.value)}
                  placeholder="auth, backend, api (comma separated)"
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 7,
                    color: "rgba(255,255,255,0.55)", fontSize: 11, padding: "6px 10px",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const,
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
                />
              </div>

              {/* AI Prompt section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#A78BFA", display: "inline-block", boxShadow: "0 0 8px #A78BFA88" }} />
                    <span style={{ fontSize: 9, color: "#A78BFA", letterSpacing: "0.1em", fontWeight: 600 }}>IMPLEMENTATION PROMPT</span>
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      onClick={copyPrompt}
                      disabled={!detailDraft.aiPrompt}
                      style={{
                        background: copied ? "rgba(0,255,178,0.08)" : "rgba(0,0,0,0.3)",
                        border: copied ? "1px solid rgba(0,255,178,0.22)" : "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 5, color: copied ? "#00FFB2" : "rgba(255,255,255,0.3)",
                        padding: "3px 8px", fontSize: 9, cursor: "pointer", fontFamily: "monospace",
                        transition: "all 0.2s", opacity: detailDraft.aiPrompt ? 1 : 0.4,
                      }}
                    >{copied ? "✓ Copied" : "⎘ Copy"}</button>
                  </div>
                </div>

                <textarea
                  value={detailDraft.aiPrompt ?? ""}
                  onChange={e => handleDraftChange("aiPrompt", e.target.value)}
                  placeholder="AI implementation prompt will appear here. Click 'Generate' to create one, or write your own."
                  rows={10}
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(167,139,250,0.1)", borderRadius: 9,
                    color: promptLoading ? "#A78BFA" : "rgba(255,255,255,0.55)", fontSize: 11.5,
                    padding: "10px 12px", resize: "vertical" as const, outline: "none",
                    fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                    lineHeight: 1.75, boxSizing: "border-box" as const, transition: "border-color 0.15s",
                    minHeight: 200,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.1)")}
                />

                <button
                  onClick={generatePrompt}
                  disabled={promptLoading}
                  style={{
                    width: "100%", marginTop: 8,
                    background: promptLoading ? "rgba(167,139,250,0.06)" : "rgba(167,139,250,0.1)",
                    border: "1px solid rgba(167,139,250,0.2)", borderRadius: 7,
                    color: "#A78BFA", padding: "8px", fontSize: 11, fontWeight: 600,
                    cursor: promptLoading ? "wait" : "pointer", fontFamily: "inherit",
                    transition: "all 0.2s", letterSpacing: "0.03em",
                  }}
                >
                  {promptLoading ? "✦ Generating..." : "✦ Generate Prompt with AI"}
                </button>
              </div>
            </div>

            {/* Detail footer — delete */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.03)", flexShrink: 0 }}>
              <button
                onClick={() => deleteCard(selectedCard.id)}
                style={{
                  width: "100%", background: "rgba(248,113,113,0.04)",
                  border: "1px solid rgba(248,113,113,0.1)", borderRadius: 7,
                  color: "rgba(248,113,113,0.5)", padding: "7px", fontSize: 10,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.04)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(248,113,113,0.5)"; }}
              >
                ✕ Delete Card
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── AI GENERATE MODAL ──────────────────────────────────────────────── */}
      {showGenModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)", display: "flex",
          alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
          animation: "vibe-slide-up 0.18s ease both",
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowGenModal(false); }}
        >
          <div style={{
            width: 520, background: "#0a0a0c",
            border: "1px solid rgba(0,255,178,0.15)", borderRadius: 16,
            padding: 28, boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,255,178,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 9, color: "#00FFB2", letterSpacing: "0.14em", fontWeight: 600, marginBottom: 6 }}>AI BOARD GENERATOR</div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}>
                  Break Down Your Project
                </h2>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                  Describe what you&apos;re building. Claude will create 8–15 Kanban cards with detailed implementation prompts.
                </p>
              </div>
              <button onClick={() => setShowGenModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>

            {cards.length > 0 && (
              <div style={{
                background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)",
                borderRadius: 8, padding: "8px 12px", marginBottom: 16,
                fontSize: 11, color: "rgba(251,191,36,0.7)",
              }}>
                ⚠ Your board already has {cards.length} card{cards.length !== 1 ? "s" : ""}. New cards will be added to the existing board.
              </div>
            )}

            <textarea
              autoFocus
              value={genDesc}
              onChange={e => setGenDesc(e.target.value)}
              placeholder={`Describe your project in detail...\n\nExample: "I'm building a SaaS project management tool with AI features. Users can create projects, invite team members, and use AI to auto-generate tasks. Stack: Next.js, Supabase, Prisma, Stripe for billing."`}
              rows={7}
              style={{
                width: "100%", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
                color: "rgba(255,255,255,0.7)", fontSize: 12.5, padding: "12px 14px",
                resize: "none" as const, outline: "none", fontFamily: "inherit",
                lineHeight: 1.65, boxSizing: "border-box" as const, transition: "border-color 0.15s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,255,178,0.3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                onClick={generateBoard}
                disabled={!genDesc.trim() || generating}
                style={{
                  flex: 1,
                  background: generating
                    ? "rgba(0,255,178,0.06)"
                    : "linear-gradient(135deg, rgba(0,255,178,0.15), rgba(56,189,248,0.15))",
                  border: "1px solid rgba(0,255,178,0.3)", borderRadius: 9,
                  color: "#00FFB2", padding: "11px", fontSize: 12, fontWeight: 700,
                  cursor: generating || !genDesc.trim() ? "wait" : "pointer",
                  fontFamily: "inherit", letterSpacing: "0.04em", transition: "all 0.2s",
                  opacity: !genDesc.trim() ? 0.5 : 1,
                }}
              >
                {generating ? "⚡ Breaking down project..." : "⚡ Generate Board"}
              </button>
              <button onClick={() => setShowGenModal(false)} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 9, color: "rgba(255,255,255,0.35)", padding: "11px 16px",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Card Item Component ────────────────────────────────────────────────────
function KanbanCardItem({
  card, isSelected, colColor, onDragStart, onClick,
}: {
  card: KanbanCard;
  isSelected: boolean;
  colColor: string;
  onDragStart: () => void;
  onClick: () => void;
}) {
  const tags = card.tags ? card.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        background: isSelected ? `${colColor}08` : "rgba(255,255,255,0.02)",
        border: `1px solid ${isSelected ? colColor + "30" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 9, padding: "10px 11px", marginBottom: 6,
        cursor: "pointer", transition: "all 0.15s",
        position: "relative" as const,
      }}
      onMouseOver={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
      onMouseOut={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"; }}
    >
      {/* Drag handle */}
      <div style={{
        position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)",
        color: "rgba(255,255,255,0.1)", fontSize: 10, lineHeight: 1, cursor: "grab",
      }}>⣿</div>

      <div style={{ paddingLeft: 10 }}>
        {/* Title */}
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
          lineHeight: 1.4, marginBottom: card.description || tags.length > 0 || card.aiPrompt ? 5 : 0,
        }}>
          {card.title}
        </div>

        {/* Description */}
        {card.description && (
          <div style={{
            fontSize: 10.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.5,
            marginBottom: tags.length > 0 || card.aiPrompt ? 6 : 0,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          }}>
            {card.description}
          </div>
        )}

        {/* Footer: tags + prompt indicator */}
        {(tags.length > 0 || card.aiPrompt) && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" as const }}>
            {tags.map(tag => (
              <span key={tag} style={{
                fontSize: 8.5, color: "rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 4, padding: "1px 6px",
              }}>{tag}</span>
            ))}
            {card.aiPrompt && (
              <span style={{ marginLeft: "auto", fontSize: 9, color: "#A78BFA", letterSpacing: "0.05em" }}>◈ prompt</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

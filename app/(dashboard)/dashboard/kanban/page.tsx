"use client";
import { useState, useEffect, useRef, useMemo } from "react";

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

const COLUMNS = [
  { id: "plan",        label: "Plan",        color: "#38BDF8", glow: "rgba(56,189,248,0.1)",  dim: "rgba(56,189,248,0.06)"  },
  { id: "in_progress", label: "In Progress", color: "#A78BFA", glow: "rgba(167,139,250,0.1)", dim: "rgba(167,139,250,0.06)" },
  { id: "done",        label: "Done",        color: "#00FFB2", glow: "rgba(0,255,178,0.1)",   dim: "rgba(0,255,178,0.06)"   },
] as const;

const PRIORITY = {
  high:   { label: "High",   color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
  medium: { label: "Medium", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)"  },
  low:    { label: "Low",    color: "rgba(255,255,255,0.25)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
} as const;

type PriorityKey = keyof typeof PRIORITY;

function getPriority(tags: string | null): PriorityKey | null {
  if (!tags) return null;
  for (const p of ["high", "medium", "low"] as PriorityKey[]) {
    if (tags.includes(`priority:${p}`)) return p;
  }
  return null;
}

function getDisplayTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags.split(",").map(t => t.trim()).filter(t => t && !t.startsWith("priority:"));
}

function setTagPriority(tags: string | null, p: PriorityKey | null): string {
  const base = (tags ?? "").split(",").map(t => t.trim()).filter(t => t && !t.startsWith("priority:"));
  if (p) base.push(`priority:${p}`);
  return base.join(",");
}

export default function KanbanPage() {
  const [project, setProject]           = useState<Project | null>(null);
  const [cards, setCards]               = useState<KanbanCard[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [detailDraft, setDetailDraft]   = useState<Partial<KanbanCard>>({});
  const [saveStatus, setSaveStatus]     = useState<"idle" | "saving" | "saved">("idle");
  const saveTimerRef                    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveStatusTimer                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add card
  const [addingCol, setAddingCol] = useState<string | null>(null);
  const [newTitle, setNewTitle]   = useState("");

  // Search
  const [search, setSearch] = useState("");

  // AI board generation
  const [showGenModal, setShowGenModal] = useState(false);
  const [genDesc, setGenDesc]           = useState("");
  const [generating, setGenerating]     = useState(false);
  const [genStep, setGenStep]           = useState("");

  // AI prompt generation
  const [promptLoading, setPromptLoading] = useState(false);
  const [copied, setCopied]               = useState(false);

  // Drag
  const dragCard    = useRef<KanbanCard | null>(null);
  const dragCounter = useRef<Record<string, number>>({});
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // ── Load ─────────────────────────────────────────────────────────────
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

  // ── Filtered cards ────────────────────────────────────────────────────
  const cardsIn = useMemo(() => (col: string) => {
    return cards
      .filter(c => {
        if (c.column !== col) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q) ||
          (c.tags ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.position - b.position);
  }, [cards, search]);

  // ── Stats ─────────────────────────────────────────────────────────────
  const totalCards = cards.length;
  const doneCards  = cards.filter(c => c.column === "done").length;
  const donePct    = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;

  // ── Auto-save (debounced) ─────────────────────────────────────────────
  const patchCard = (id: string, data: Partial<KanbanCard>, instant = false) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
    setSaveStatus("saving");

    const doSave = async () => {
      const res = await fetch(`/api/kanban/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated: KanbanCard = await res.json();
        setCards(prev => prev.map(c => c.id === id ? updated : c));
        setSelectedCard(prev => prev?.id === id ? updated : prev);
        setSaveStatus("saved");
        saveStatusTimer.current = setTimeout(() => setSaveStatus("idle"), 2000);
      }
    };

    if (instant) {
      doSave();
    } else {
      saveTimerRef.current = setTimeout(doSave, 600);
    }
  };

  const handleDraftChange = (field: keyof KanbanCard, value: string) => {
    setDetailDraft(prev => ({ ...prev, [field]: value }));
    if (selectedCard) patchCard(selectedCard.id, { [field]: value });
  };

  const handleColumnChange = (col: string) => {
    if (!selectedCard) return;
    setDetailDraft(prev => ({ ...prev, column: col }));
    // Instant optimistic update + immediate save
    const colCards = cards.filter(c => c.column === col);
    const newPos = colCards.length;
    setCards(prev => prev.map(c => c.id === selectedCard.id ? { ...c, column: col, position: newPos } : c));
    setSelectedCard(prev => prev ? { ...prev, column: col, position: newPos } : prev);
    patchCard(selectedCard.id, { column: col, position: newPos }, true);
  };

  const handlePriorityChange = (p: PriorityKey | null) => {
    if (!selectedCard) return;
    const newTags = setTagPriority(detailDraft.tags ?? selectedCard.tags, p);
    handleDraftChange("tags", newTags);
  };

  // ── Open / close detail ───────────────────────────────────────────────
  const openCard = (card: KanbanCard) => {
    setSelectedCard(card);
    setDetailDraft({ ...card });
    setSaveStatus("idle");
  };
  const closeDetail = () => {
    setSelectedCard(null);
    setDetailDraft({});
    setSaveStatus("idle");
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
      const card: KanbanCard = await res.json();
      setCards(prev => [...prev, card]);
      openCard(card);
    }
    setNewTitle("");
    setAddingCol(null);
  };

  // ── Delete card ───────────────────────────────────────────────────────
  const deleteCard = async (id: string) => {
    await fetch(`/api/kanban/${id}`, { method: "DELETE" });
    setCards(prev => prev.filter(c => c.id !== id));
    closeDetail();
  };

  // ── Clear done ────────────────────────────────────────────────────────
  const clearDone = async () => {
    const doneIds = cards.filter(c => c.column === "done").map(c => c.id);
    await Promise.all(doneIds.map(id => fetch(`/api/kanban/${id}`, { method: "DELETE" })));
    setCards(prev => prev.filter(c => c.column !== "done"));
    if (selectedCard && selectedCard.column === "done") closeDetail();
  };

  // ── AI: Generate full board ───────────────────────────────────────────
  const generateBoard = async () => {
    if (!genDesc.trim() || !project) return;
    setGenerating(true);
    setGenStep("Analyzing project description...");
    try {
      setGenStep("Claude is breaking down your project into tasks...");
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
        setGenStep("Creating cards...");
        const { cards: newCards } = await res.json();
        setCards(prev => [...prev, ...newCards]);
      }
    } finally {
      setGenerating(false);
      setGenStep("");
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
      // Direct save (not debounced — stream is done)
      if (selectedCard && out) patchCard(selectedCard.id, { aiPrompt: out }, true);
    } finally {
      setPromptLoading(false);
    }
  };

  const copyPrompt = () => {
    const text = detailDraft.aiPrompt;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Drag & drop (fixed flicker via counter) ───────────────────────────
  const onDragStart = (card: KanbanCard) => {
    dragCard.current = card;
  };

  const onDragEnter = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    dragCounter.current[col] = (dragCounter.current[col] ?? 0) + 1;
    setDragOverCol(col);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const onDragLeave = (col: string) => {
    dragCounter.current[col] = Math.max((dragCounter.current[col] ?? 1) - 1, 0);
    if (dragCounter.current[col] === 0) setDragOverCol(null);
  };

  const onDrop = async (col: string) => {
    dragCounter.current = {};
    setDragOverCol(null);
    const card = dragCard.current;
    dragCard.current = null;
    if (!card || card.column === col) return;

    const colCards = cards.filter(c => c.column === col);
    const newPos = colCards.length;
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, column: col, position: newPos } : c));
    if (selectedCard?.id === card.id) setSelectedCard(prev => prev ? { ...prev, column: col } : prev);

    await fetch("/api/kanban/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards: [{ id: card.id, column: col, position: newPos }] }),
    });
  };

  // ── Skeleton loader ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 72, borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.1)" }} />
        <div style={{ flex: 1, display: "flex" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, padding: "14px 10px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
              <div style={{ height: 8, width: 60, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 16 }} />
              {[0, 1, 2].map(j => (
                <div key={j} style={{ height: 72, background: "rgba(255,255,255,0.02)", borderRadius: 9, marginBottom: 6, border: "1px solid rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontSize: 36, opacity: 0.3 }}>⊟</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>No active project</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Select or create a project from the sidebar to use Build Board</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%", flexDirection: "column" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: "14px 20px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        flexShrink: 0, background: "rgba(0,0,0,0.12)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em" }}>Build Board</h1>
            <span style={{
              fontSize: 9, color: "#00FFB2", background: "rgba(0,255,178,0.08)",
              border: "1px solid rgba(0,255,178,0.18)", borderRadius: 5,
              padding: "2px 8px", fontWeight: 600, letterSpacing: "0.06em", flexShrink: 0,
            }}>{project.name}</span>
            {/* Save status */}
            <span style={{
              fontSize: 9.5, transition: "opacity 0.3s",
              opacity: saveStatus === "idle" ? 0 : 1,
              color: saveStatus === "saved" ? "#00FFB2" : "rgba(255,255,255,0.3)",
              letterSpacing: "0.05em",
            }}>
              {saveStatus === "saving" ? "Saving…" : "✓ Saved"}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search cards..."
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 7, color: "rgba(255,255,255,0.6)", fontSize: 11,
                  padding: "5px 10px 5px 24px", outline: "none", fontFamily: "inherit",
                  width: 150, transition: "border-color 0.15s, width 0.2s",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.width = "200px"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.width = "150px"; }}
              />
            </div>

            {doneCards > 0 && (
              <button
                onClick={clearDone}
                style={{
                  background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.12)",
                  borderRadius: 7, color: "rgba(248,113,113,0.5)", padding: "5px 11px",
                  fontSize: 10, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(248,113,113,0.5)"; }}
              >
                ✕ Clear Done ({doneCards})
              </button>
            )}

            <button
              onClick={() => {
                setShowGenModal(true);
                if (!genDesc) setGenDesc(project.contextBrief ?? project.description ?? "");
              }}
              style={{
                background: "linear-gradient(135deg, rgba(0,255,178,0.1), rgba(56,189,248,0.1))",
                border: "1px solid rgba(0,255,178,0.22)",
                borderRadius: 8, color: "#00FFB2", padding: "6px 14px",
                fontSize: 10.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "0.04em", transition: "all 0.2s",
                boxShadow: "0 0 16px rgba(0,255,178,0.06)",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(0,255,178,0.18)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0,255,178,0.06)"; }}
            >
              ⚡ Generate with AI
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {totalCards > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                width: `${donePct}%`, height: "100%",
                background: "linear-gradient(90deg, #00FFB2, #38BDF8)",
                borderRadius: 2, transition: "width 0.5s ease",
                boxShadow: donePct > 0 ? "0 0 8px rgba(0,255,178,0.4)" : "none",
              }} />
            </div>
            <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
              {doneCards}/{totalCards} · {donePct}% done
            </span>
          </div>
        )}
      </div>

      {/* ── BOARD ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {COLUMNS.map((col, colIdx) => {
            const colCards = cardsIn(col.id);
            const isDragOver = dragOverCol === col.id;

            return (
              <div
                key={col.id}
                onDragEnter={e => onDragEnter(e, col.id)}
                onDragOver={onDragOver}
                onDragLeave={() => onDragLeave(col.id)}
                onDrop={() => onDrop(col.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  borderRight: colIdx < COLUMNS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  background: isDragOver ? col.glow : "transparent",
                  transition: "background 0.15s",
                  overflow: "hidden",
                }}
              >
                {/* Column header */}
                <div style={{
                  padding: "12px 14px 10px",
                  display: "flex", alignItems: "center", gap: 8,
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: col.color, flexShrink: 0,
                    boxShadow: `0 0 10px ${col.color}88`,
                  }} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: col.color, letterSpacing: "0.12em", flex: 1 }}>
                    {col.label.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: 9, color: "rgba(255,255,255,0.3)",
                    background: isDragOver ? col.dim : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isDragOver ? col.color + "33" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 10, padding: "1px 7px", fontFamily: "monospace",
                    transition: "all 0.15s",
                  }}>{colCards.length}</span>
                </div>

                {/* Cards scroll area */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
                  {colCards.length === 0 && !search && (
                    <div style={{
                      textAlign: "center", padding: "28px 12px",
                      border: `1px dashed ${isDragOver ? col.color + "44" : "rgba(255,255,255,0.05)"}`,
                      borderRadius: 10, transition: "all 0.15s",
                      background: isDragOver ? col.glow : "transparent",
                    }}>
                      <div style={{ fontSize: 18, opacity: 0.2, marginBottom: 6 }}>
                        {col.id === "plan" ? "🗒" : col.id === "in_progress" ? "⚡" : "✓"}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)" }}>
                        {isDragOver ? "Drop here" : col.id === "plan" ? "Add tasks to plan" : col.id === "in_progress" ? "Drag tasks here" : "Drag when done"}
                      </div>
                    </div>
                  )}

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

                  {/* Add card form */}
                  {addingCol === col.id ? (
                    <div style={{ marginTop: 6 }}>
                      <textarea
                        autoFocus
                        placeholder="Card title... (Enter to save, Esc to cancel)"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addCard(col.id); }
                          if (e.key === "Escape") { setAddingCol(null); setNewTitle(""); }
                        }}
                        rows={2}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${col.color}55`, borderRadius: 8,
                          color: "rgba(255,255,255,0.85)", fontSize: 12, padding: "8px 10px",
                          resize: "none" as const, outline: "none", fontFamily: "inherit",
                          boxSizing: "border-box" as const, lineHeight: 1.5,
                          boxShadow: `0 0 0 1px ${col.color}22`,
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
                        width: "100%", marginTop: colCards.length > 0 ? 6 : 8, background: "transparent",
                        border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 8,
                        color: "rgba(255,255,255,0.2)", padding: "7px",
                        fontSize: 10.5, cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                      onMouseOver={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = `${col.color}55`; b.style.color = col.color; }}
                      onMouseOut={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,255,255,0.07)"; b.style.color = "rgba(255,255,255,0.2)"; }}
                    >
                      + Add Card
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DETAIL PANEL ────────────────────────────────────────────── */}
        {selectedCard && (
          <div style={{
            width: 400, borderLeft: "1px solid rgba(255,255,255,0.04)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            background: "rgba(0,0,0,0.18)",
            animation: "vibe-slide-up 0.18s ease both",
          }}>
            {/* Header */}
            <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <input
                    value={detailDraft.title ?? ""}
                    onChange={e => handleDraftChange("title", e.target.value)}
                    style={{
                      width: "100%", background: "transparent", border: "none",
                      borderBottom: "1px solid transparent",
                      color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 700,
                      outline: "none", fontFamily: "inherit", padding: "0 0 2px",
                      boxSizing: "border-box" as const, transition: "border-color 0.15s",
                    }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = "transparent")}
                    placeholder="Card title"
                  />
                </div>
                <button onClick={closeDetail} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 16, lineHeight: 1, flexShrink: 0, padding: 2 }}>✕</button>
              </div>

              {/* Column selector */}
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {COLUMNS.map(col => (
                  <button key={col.id} onClick={() => handleColumnChange(col.id)} style={{
                    background: detailDraft.column === col.id ? col.dim : "transparent",
                    border: `1px solid ${detailDraft.column === col.id ? col.color + "55" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 6, color: detailDraft.column === col.id ? col.color : "rgba(255,255,255,0.3)",
                    padding: "3px 9px", fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: detailDraft.column === col.id ? 700 : 400,
                    letterSpacing: "0.05em", transition: "all 0.15s",
                  }}>{col.label}</button>
                ))}
              </div>

              {/* Priority */}
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginRight: 2 }}>PRIORITY</span>
                {(["high", "medium", "low"] as PriorityKey[]).map(p => {
                  const pr = PRIORITY[p];
                  const active = getPriority(detailDraft.tags ?? null) === p;
                  return (
                    <button key={p} onClick={() => handlePriorityChange(active ? null : p)} style={{
                      background: active ? pr.bg : "transparent",
                      border: `1px solid ${active ? pr.border : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 5, color: active ? pr.color : "rgba(255,255,255,0.25)",
                      padding: "2px 8px", fontSize: 8.5, cursor: "pointer", fontFamily: "inherit",
                      fontWeight: active ? 700 : 400, letterSpacing: "0.05em", transition: "all 0.15s",
                    }}>{pr.label}</button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", fontWeight: 600, display: "block", marginBottom: 6 }}>DESCRIPTION</label>
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
                <label style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", fontWeight: 600, display: "block", marginBottom: 6 }}>TAGS</label>
                <input
                  value={getDisplayTags(detailDraft.tags ?? null).join(", ")}
                  onChange={e => {
                    const priority = getPriority(detailDraft.tags ?? null);
                    const newBase = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                    if (priority) newBase.push(`priority:${priority}`);
                    handleDraftChange("tags", newBase.join(","));
                  }}
                  placeholder="auth, backend, ui (comma separated)"
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

              {/* AI Prompt */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#A78BFA", display: "inline-block", boxShadow: "0 0 8px #A78BFA88", flexShrink: 0 }} />
                    <span style={{ fontSize: 9, color: "#A78BFA", letterSpacing: "0.12em", fontWeight: 600 }}>IMPLEMENTATION PROMPT</span>
                  </div>
                  <button
                    onClick={copyPrompt}
                    disabled={!detailDraft.aiPrompt}
                    style={{
                      background: copied ? "rgba(0,255,178,0.08)" : "rgba(0,0,0,0.3)",
                      border: copied ? "1px solid rgba(0,255,178,0.22)" : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 5, color: copied ? "#00FFB2" : "rgba(255,255,255,0.35)",
                      padding: "3px 8px", fontSize: 9, cursor: "pointer", fontFamily: "monospace",
                      transition: "all 0.2s", opacity: detailDraft.aiPrompt ? 1 : 0.4,
                    }}
                  >{copied ? "✓ Copied!" : "⎘ Copy"}</button>
                </div>

                <textarea
                  value={detailDraft.aiPrompt ?? ""}
                  onChange={e => handleDraftChange("aiPrompt", e.target.value)}
                  placeholder={"No prompt yet.\n\nClick 'Generate Prompt' to create a detailed implementation guide, or write your own."}
                  rows={12}
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${promptLoading ? "rgba(167,139,250,0.3)" : "rgba(167,139,250,0.1)"}`,
                    borderRadius: 9, color: promptLoading ? "#A78BFA88" : "rgba(255,255,255,0.55)",
                    fontSize: 11, padding: "10px 12px",
                    resize: "vertical" as const, outline: "none",
                    fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                    lineHeight: 1.7, boxSizing: "border-box" as const, transition: "all 0.15s",
                    minHeight: 180,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)")}
                  onBlur={e => (e.currentTarget.style.borderColor = promptLoading ? "rgba(167,139,250,0.3)" : "rgba(167,139,250,0.1)")}
                />

                <button
                  onClick={generatePrompt}
                  disabled={promptLoading}
                  style={{
                    width: "100%", marginTop: 8,
                    background: promptLoading
                      ? "rgba(167,139,250,0.06)"
                      : "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(167,139,250,0.06))",
                    border: "1px solid rgba(167,139,250,0.22)", borderRadius: 8,
                    color: "#A78BFA", padding: "9px", fontSize: 11, fontWeight: 700,
                    cursor: promptLoading ? "wait" : "pointer", fontFamily: "inherit",
                    transition: "all 0.2s", letterSpacing: "0.04em",
                    boxShadow: promptLoading ? "none" : "0 0 20px rgba(167,139,250,0.08)",
                  }}
                  onMouseOver={e => { if (!promptLoading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(167,139,250,0.2)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = promptLoading ? "none" : "0 0 20px rgba(167,139,250,0.08)"; }}
                >
                  {promptLoading ? "✦ Generating…" : "✦ Generate Prompt with AI"}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.03)", flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.12)", marginBottom: 8, letterSpacing: "0.06em" }}>
                Created {new Date(selectedCard.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <button
                onClick={() => deleteCard(selectedCard.id)}
                style={{
                  width: "100%", background: "rgba(248,113,113,0.04)",
                  border: "1px solid rgba(248,113,113,0.1)", borderRadius: 7,
                  color: "rgba(248,113,113,0.45)", padding: "7px", fontSize: 10,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}
                onMouseOver={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(248,113,113,0.08)"; b.style.color = "#f87171"; b.style.borderColor = "rgba(248,113,113,0.2)"; }}
                onMouseOut={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(248,113,113,0.04)"; b.style.color = "rgba(248,113,113,0.45)"; b.style.borderColor = "rgba(248,113,113,0.1)"; }}
              >
                ✕ Delete Card
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── AI GENERATE MODAL ────────────────────────────────────────────── */}
      {showGenModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget && !generating) setShowGenModal(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(10px)",
            animation: "vibe-slide-up 0.18s ease both",
          }}
        >
          <div style={{
            width: 540, background: "#08080b",
            border: "1px solid rgba(0,255,178,0.14)", borderRadius: 18,
            padding: 30, boxShadow: "0 60px 100px rgba(0,0,0,0.8), 0 0 60px rgba(0,255,178,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 9, color: "#00FFB2", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>AI BOARD GENERATOR</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.03em" }}>
                  Break Down Your Project
                </h2>
                <p style={{ margin: "7px 0 0", fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.65 }}>
                  Describe what you&apos;re building. Claude will create 8–15 Kanban cards with detailed Cursor/Claude implementation prompts.
                </p>
              </div>
              {!generating && (
                <button onClick={() => setShowGenModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
              )}
            </div>

            {cards.length > 0 && !generating && (
              <div style={{
                background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.14)",
                borderRadius: 9, padding: "8px 12px", marginBottom: 16,
                fontSize: 11, color: "rgba(251,191,36,0.65)", lineHeight: 1.5,
              }}>
                ⚠ You already have {cards.length} card{cards.length !== 1 ? "s" : ""} on this board. New cards will be added without removing existing ones.
              </div>
            )}

            {generating ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{
                  width: 48, height: 48, margin: "0 auto 20px",
                  border: "2px solid rgba(0,255,178,0.1)",
                  borderTop: "2px solid #00FFB2",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{genStep}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>This takes 10–20 seconds…</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <textarea
                  autoFocus
                  value={genDesc}
                  onChange={e => setGenDesc(e.target.value)}
                  placeholder={"Describe your project in detail...\n\nExample: \"I'm building a SaaS tool for vibe coders. Users can manage projects, use 6 AI agents (brain, prompt architect, debug translator, etc.), browse UI components in Element Forge, and track builds in a Ledger. Stack: Next.js 14, Supabase auth, Prisma + PostgreSQL on Railway, Stripe billing, Anthropic Claude API.\""}
                  rows={8}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 11,
                    color: "rgba(255,255,255,0.72)", fontSize: 12.5, padding: "13px 15px",
                    resize: "none" as const, outline: "none", fontFamily: "inherit",
                    lineHeight: 1.65, boxSizing: "border-box" as const, transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(0,255,178,0.28)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />

                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button
                    onClick={generateBoard}
                    disabled={!genDesc.trim()}
                    style={{
                      flex: 1,
                      background: genDesc.trim()
                        ? "linear-gradient(135deg, rgba(0,255,178,0.14), rgba(56,189,248,0.14))"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${genDesc.trim() ? "rgba(0,255,178,0.28)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 10, color: genDesc.trim() ? "#00FFB2" : "rgba(255,255,255,0.2)",
                      padding: "12px", fontSize: 12, fontWeight: 700,
                      cursor: genDesc.trim() ? "pointer" : "not-allowed",
                      fontFamily: "inherit", letterSpacing: "0.04em",
                      transition: "all 0.2s",
                    }}
                  >
                    ⚡ Generate Board
                  </button>
                  <button onClick={() => setShowGenModal(false)} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, color: "rgba(255,255,255,0.3)", padding: "12px 18px",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Card component ────────────────────────────────────────────────────────
function KanbanCardItem({
  card, isSelected, colColor, onDragStart, onClick,
}: {
  card: KanbanCard;
  isSelected: boolean;
  colColor: string;
  onDragStart: () => void;
  onClick: () => void;
}) {
  const priority = getPriority(card.tags);
  const tags = getDisplayTags(card.tags);
  const pr = priority ? PRIORITY[priority] : null;
  const isDone = card.column === "done";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        background: isSelected ? `${colColor}07` : "rgba(255,255,255,0.018)",
        border: `1px solid ${isSelected ? colColor + "30" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 9, padding: "9px 10px 9px 20px", marginBottom: 5,
        cursor: "pointer", transition: "all 0.15s", position: "relative" as const,
        opacity: isDone ? 0.7 : 1,
      }}
      onMouseOver={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = `${colColor}33`; (e.currentTarget as HTMLElement).style.background = `${colColor}05`; } }}
      onMouseOut={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.018)"; } }}
    >
      {/* Priority accent bar */}
      {pr && (
        <div style={{
          position: "absolute", left: 0, top: 4, bottom: 4, width: 3,
          background: pr.color, borderRadius: "0 0 0 9px",
          boxShadow: `0 0 8px ${pr.color}66`,
        }} />
      )}

      {/* Drag handle */}
      <div style={{
        position: "absolute", left: 5, top: "50%", transform: "translateY(-50%)",
        color: "rgba(255,255,255,0.1)", fontSize: 9, cursor: "grab", userSelect: "none",
      }}>⣿</div>

      {/* Title */}
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: isSelected ? "rgba(255,255,255,0.9)" : isDone ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.75)",
        lineHeight: 1.4, marginBottom: card.description ? 4 : 0,
        textDecoration: isDone ? "line-through" : "none",
      }}>
        {card.title}
      </div>

      {/* Description */}
      {card.description && (
        <div style={{
          fontSize: 10.5, color: "rgba(255,255,255,0.28)", lineHeight: 1.45,
          marginBottom: (tags.length > 0 || card.aiPrompt || priority) ? 6 : 0,
          overflow: "hidden",
          display: "-webkit-box",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
        }}>
          {card.description}
        </div>
      )}

      {/* Footer */}
      {(tags.length > 0 || card.aiPrompt || priority) && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" as const }}>
          {priority && pr && (
            <span style={{
              fontSize: 8, color: pr.color, background: pr.bg,
              border: `1px solid ${pr.border}`, borderRadius: 4,
              padding: "1px 5px", fontWeight: 700, letterSpacing: "0.04em",
            }}>{pr.label.toUpperCase()}</span>
          )}
          {tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: 8.5, color: "rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 4, padding: "1px 5px",
            }}>{tag}</span>
          ))}
          {card.aiPrompt && (
            <span style={{ marginLeft: "auto", fontSize: 8.5, color: "#A78BFA88" }}>◈</span>
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  date: Date;
};

type Milestone = {
  id: string;
  name: string;
  description: string | null;
  milestoneOrder: number;
  status: string;
  estimatedHours: number | null;
  specsCount?: number;
  specsCompleted?: number;
  specs: Spec[];
};

type Spec = {
  id: string;
  specName: string;
  specContent: string;
  status: string;
  generatedPrompt: string | null;
  acceptanceCriteria: string[];
};

type Project = {
  id: string;
  name: string;
  description: string;
  vision: string | null;
  industry: string | null;
  stack: string | null;
  status: string;
};

function formatMsg(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## "))
      return <h2 key={i} style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 700, marginTop: "1rem", marginBottom: "0.3rem" }}>{line.slice(3)}</h2>;
    if (line.startsWith("### "))
      return <h3 key={i} style={{ color: "#666", fontSize: "0.72rem", fontWeight: 700, marginTop: "0.8rem", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{line.slice(4)}</h3>;
    if (line.startsWith("- ") || line.startsWith("• "))
      return <p key={i} style={{ margin: "0.1rem 0 0.1rem 0.8rem", fontSize: "0.85rem", color: "#bbb", lineHeight: 1.7 }}>• {line.slice(2)}</p>;
    if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
    const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return (
      <p key={i} style={{ margin: "0.1rem 0", fontSize: "0.875rem", color: "#ccc", lineHeight: 1.75 }}>
        {parts.map((p, j) =>
          p.startsWith("**") ? <strong key={j} style={{ color: "#fff" }}>{p.slice(2, -2)}</strong> : p
        )}
      </p>
    );
  });
}

const STATUS_COLOR: Record<string, string> = {
  pending: "rgba(255,255,255,0.15)",
  in_progress: "#38BDF8",
  done: "#00FFB2",
  blocked: "#F43F5E",
};

export default function AgentPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingMilestones, setGeneratingMilestones] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<Spec | null>(null);
  const [specPromptLoading, setSpecPromptLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinText, setCheckinText] = useState("");
  const [showOnboard, setShowOnboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/projects/active")
      .then(r => r.json())
      .then(async (p: Project) => {
        if (!p?.id) return;
        setProject(p);
        const res = await fetch(`/api/agent/milestones?projectId=${p.id}`);
        if (res.ok) {
          const data = await res.json();
          setMilestones(data.milestones ?? []);
        }
        const convRes = await fetch(`/api/agent/history?projectId=${p.id}`);
        if (convRes.ok) {
          const data = await convRes.json();
          setMessages(
            (data.messages ?? []).map((m: { id: string; role: "user" | "assistant"; content: string; createdAt: string }) => ({
              ...m,
              date: new Date(m.createdAt),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !project || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, date: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", date: new Date() }]);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, projectId: project.id }),
      });
      if (!res.ok || !res.body) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Something went wrong. Try again." } : m));
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: full } : m));
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Connection error." } : m));
    }
    setLoading(false);
  }, [input, project, loading]);

  const generateMilestones = async () => {
    if (!project) return;
    setGeneratingMilestones(true);
    const res = await fetch("/api/agent/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setMilestones(data.milestones ?? []);
    }
    setGeneratingMilestones(false);
  };

  const generateSpecPrompt = async (spec: Spec) => {
    if (!project) return;
    setSpecPromptLoading(true);
    const res = await fetch("/api/agent/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId: spec.id, projectId: project.id }),
    });
    if (!res.ok || !res.body) { setSpecPromptLoading(false); return; }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      setSelectedSpec(prev => prev ? { ...prev, generatedPrompt: full } : prev);
    }
    setSpecPromptLoading(false);
  };

  const updateMilestoneStatus = async (milestoneId: string, status: string) => {
    await fetch("/api/agent/milestones", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestoneId, status }),
    });
    setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, status } : m));
  };

  const sendCheckin = async () => {
    if (!checkinText.trim() || !project) return;
    setShowCheckin(false);
    const msg: Message = { id: Date.now().toString(), role: "user", content: `📋 Weekly check-in:\n${checkinText}`, date: new Date() };
    setMessages(prev => [...prev, msg]);
    setCheckinText("");
    const aId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aId, role: "assistant", content: "", date: new Date() }]);
    setLoading(true);
    const res = await fetch("/api/agent/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, update: checkinText }),
    });
    if (!res.ok || !res.body) { setLoading(false); return; }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: full } : m));
    }
    setLoading(false);
  };

  const completedMilestones = milestones.filter(m => m.status === "done").length;
  const progressPct = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", background: "#060608", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading your AI Cofounder...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060608", display: "flex", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── LEFT: MILESTONE PANEL ───────────────────────────────────────── */}
      <div style={{
        width: 280, minHeight: "100vh", borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        {/* Project header */}
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>⚡</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{project.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{project.industry ?? "AI Cofounder"}</div>
            </div>
          </div>
          {/* Progress bar */}
          {milestones.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Build progress</span>
                <span style={{ fontSize: 10, color: "#00FFB2", fontWeight: 600 }}>{progressPct}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg,#00FFB2,#38BDF8)", borderRadius: 2, transition: "width 0.5s ease" }} />
              </div>
            </div>
          )}
        </div>

        {/* Milestones list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
          {milestones.length === 0 ? (
            <div style={{ padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>No build plan yet</div>
              <button
                onClick={generateMilestones}
                disabled={generatingMilestones}
                style={{
                  background: "rgba(0,255,178,0.08)", border: "1px solid rgba(0,255,178,0.2)",
                  borderRadius: 8, color: "#00FFB2", padding: "8px 14px",
                  fontSize: 11, cursor: "pointer", fontFamily: "inherit", width: "100%",
                  opacity: generatingMilestones ? 0.5 : 1,
                }}
              >
                {generatingMilestones ? "Generating..." : "✦ Generate Build Plan"}
              </button>
            </div>
          ) : (
            <>
              {milestones.map((m, idx) => (
                <div key={m.id} style={{ padding: "8px 16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[m.status] ?? "#444", marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: m.status === "done" ? "rgba(255,255,255,0.35)" : "#fff", textDecoration: m.status === "done" ? "line-through" : "none", marginBottom: 2 }}>
                        {idx + 1}. {m.name}
                      </div>
                      {m.specs.length > 0 && (
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                          {m.specs.filter(s => s.status === "done").length}/{m.specs.length} specs
                        </div>
                      )}
                      {/* Specs */}
                      {m.specs.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSpec(s)}
                          style={{
                            display: "block", width: "100%", textAlign: "left",
                            background: selectedSpec?.id === s.id ? "rgba(56,189,248,0.08)" : "transparent",
                            border: "none", borderRadius: 5, padding: "4px 6px", marginTop: 2,
                            cursor: "pointer", fontFamily: "inherit",
                          }}
                        >
                          <span style={{ fontSize: 10, color: s.status === "done" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)", textDecoration: s.status === "done" ? "line-through" : "none" }}>
                            {s.status === "done" ? "✓ " : "○ "}{s.specName}
                          </span>
                        </button>
                      ))}
                      {/* Status controls */}
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        {["pending", "in_progress", "done"].map(st => (
                          <button
                            key={st}
                            onClick={() => updateMilestoneStatus(m.id, st)}
                            style={{
                              background: m.status === st ? "rgba(255,255,255,0.08)" : "transparent",
                              border: `1px solid ${m.status === st ? "rgba(255,255,255,0.15)" : "transparent"}`,
                              borderRadius: 4, color: "rgba(255,255,255,0.3)", padding: "2px 5px",
                              fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            {st === "pending" ? "◯" : st === "in_progress" ? "◐" : "●"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ padding: "8px 16px" }}>
                <button
                  onClick={generateMilestones}
                  disabled={generatingMilestones}
                  style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 7, color: "rgba(255,255,255,0.25)", padding: "6px 10px",
                    fontSize: 10, cursor: "pointer", fontFamily: "inherit", width: "100%",
                    opacity: generatingMilestones ? 0.4 : 1,
                  }}
                >
                  {generatingMilestones ? "Regenerating..." : "↺ Regenerate Plan"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Weekly check-in button */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => setShowCheckin(true)}
            style={{
              background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)",
              borderRadius: 8, color: "#A78BFA", padding: "8px 12px",
              fontSize: 11, cursor: "pointer", fontFamily: "inherit", width: "100%",
            }}
          >
            ✦ Weekly Check-in
          </button>
        </div>
      </div>

      {/* ── CENTER: CHAT ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>AI Cofounder</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: 10 }}>{project.name}</span>
          </div>
          <button
            onClick={() => setShowOnboard(true)}
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 7, color: "rgba(255,255,255,0.4)", padding: "5px 12px",
              fontSize: 10, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ⚙ Update Project Context
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 0" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                Your AI Cofounder is ready
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", maxWidth: 380, margin: "0 auto", lineHeight: 1.8 }}>
                Ask anything about your project. Get implementation prompts, debug errors, decide what to build next — your cofounder knows the full context.
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
                {["What should I build next?", "Generate a prompt for my current milestone", "What are the biggest risks in my project?"].map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 20, color: "rgba(255,255,255,0.5)", padding: "7px 14px",
                      fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} style={{ marginBottom: 20, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>⚡</div>
              )}
              <div style={{
                maxWidth: "72%", padding: "12px 16px",
                background: m.role === "user" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${m.role === "user" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              }}>
                {m.role === "user"
                  ? <p style={{ margin: 0, fontSize: "0.875rem", color: "#fff", lineHeight: 1.6 }}>{m.content}</p>
                  : m.content
                    ? <div>{formatMsg(m.content)}</div>
                    : <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,255,178,0.5)", animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                }
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask your cofounder anything..."
              rows={1}
              style={{
                flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, color: "#fff", padding: "12px 16px",
                fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none",
                lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
              }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 42, height: 42, background: loading || !input.trim() ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg,#00FFB2,#38BDF8)",
                border: "none", borderRadius: 10, cursor: loading || !input.trim() ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
              }}
            >
              {loading ? "⟳" : "↑"}
            </button>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 6, textAlign: "center" }}>
            Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>

      {/* ── RIGHT: SPEC PANEL ────────────────────────────────────────────── */}
      {selectedSpec && (
        <div style={{
          width: 360, minHeight: "100vh", borderLeft: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Spec Detail</span>
            <button onClick={() => setSelectedSpec(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{selectedSpec.specName}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 16 }}>{selectedSpec.specContent}</div>

            {Array.isArray(selectedSpec.acceptanceCriteria) && selectedSpec.acceptanceCriteria.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Acceptance Criteria</div>
                {(selectedSpec.acceptanceCriteria as string[]).map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                    <span style={{ color: "#00FFB2", fontSize: 10, marginTop: 2 }}>✓</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{c}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Implementation Prompt</div>
              {selectedSpec.generatedPrompt ? (
                <div style={{ position: "relative" }}>
                  <textarea
                    value={selectedSpec.generatedPrompt}
                    readOnly
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 8, color: "rgba(255,255,255,0.6)", padding: 12, fontSize: 11,
                      fontFamily: "inherit", lineHeight: 1.7, resize: "none", outline: "none", boxSizing: "border-box",
                      minHeight: 160,
                    }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedSpec.generatedPrompt ?? "");
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: copiedPrompt ? "rgba(0,255,178,0.1)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${copiedPrompt ? "rgba(0,255,178,0.3)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 6, color: copiedPrompt ? "#00FFB2" : "rgba(255,255,255,0.4)",
                      padding: "4px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {copiedPrompt ? "✓ Copied" : "⎘ Copy"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => generateSpecPrompt(selectedSpec)}
                  disabled={specPromptLoading}
                  style={{
                    width: "100%", background: "rgba(0,255,178,0.06)", border: "1px solid rgba(0,255,178,0.15)",
                    borderRadius: 8, color: "#00FFB2", padding: "10px 14px",
                    fontSize: 11, cursor: specPromptLoading ? "default" : "pointer", fontFamily: "inherit",
                    opacity: specPromptLoading ? 0.5 : 1,
                  }}
                >
                  {specPromptLoading ? "Generating..." : "✦ Generate Implementation Prompt"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CHECK-IN MODAL ────────────────────────────────────────────────── */}
      {showCheckin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: 28, width: "min(480px, 92vw)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Weekly Check-in</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 18, lineHeight: 1.7 }}>
              Tell your AI Cofounder what you built this week. They'll analyze your progress and tell you exactly what to build next.
            </div>
            <textarea
              autoFocus
              value={checkinText}
              onChange={e => setCheckinText(e.target.value)}
              placeholder="I built the auth system, set up the database, and connected Stripe. Stuck on the webhook verification..."
              rows={5}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 10, color: "#fff", padding: 14, fontSize: 12,
                fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.7, marginBottom: 14,
              }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCheckin(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(255,255,255,0.35)", padding: "8px 16px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button
                onClick={sendCheckin}
                disabled={!checkinText.trim()}
                style={{
                  background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)",
                  borderRadius: 8, color: "#A78BFA", padding: "8px 18px",
                  fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  opacity: !checkinText.trim() ? 0.4 : 1,
                }}
              >
                Send Check-in ↑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ONBOARD MODAL ─────────────────────────────────────────────────── */}
      {showOnboard && project && (
        <OnboardModal project={project} onClose={() => setShowOnboard(false)} onSaved={(p) => { setProject(p); setShowOnboard(false); }} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

function OnboardModal({ project, onClose, onSaved }: { project: Project; onClose: () => void; onSaved: (p: Project) => void }) {
  const [vision, setVision] = useState(project.vision ?? "");
  const [industry, setIndustry] = useState(project.industry ?? "");
  const [stack, setStack] = useState(project.stack ?? "");
  const [targetUsers, setTargetUsers] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [builtFeatures, setBuiltFeatures] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/agent/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, vision, industry, stack, targetUsers, businessModel, builtFeatures }),
    });
    if (res.ok) {
      const data = await res.json();
      onSaved(data.project);
    }
    setSaving(false);
  };

  const fields = [
    { label: "Vision", placeholder: "What does this product do and why does it matter?", value: vision, set: setVision, rows: 2 },
    { label: "Industry", placeholder: "SaaS, Fintech, Health, E-commerce...", value: industry, set: setIndustry, rows: 1 },
    { label: "Tech Stack", placeholder: "Next.js, Supabase, Prisma, Railway...", value: stack, set: setStack, rows: 1 },
    { label: "Target Users", placeholder: "Who is this for? Be specific.", value: targetUsers, set: setTargetUsers, rows: 1 },
    { label: "Business Model", placeholder: "Subscription, one-time, freemium...", value: businessModel, set: setBusinessModel, rows: 1 },
    { label: "Already Built", placeholder: "Auth, dashboard, API connections...", value: builtFeatures, set: setBuiltFeatures, rows: 2 },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: 28, width: "min(560px, 94vw)", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Update Project Context</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 24, lineHeight: 1.7 }}>
          The more context your AI Cofounder has, the sharper their advice. Fill in what you know.
        </div>
        {fields.map(f => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{f.label}</label>
            <textarea
              value={f.value}
              onChange={e => f.set(e.target.value)}
              placeholder={f.placeholder}
              rows={f.rows}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 9, color: "#fff", padding: "10px 12px", fontSize: 12,
                fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.6,
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(255,255,255,0.35)", padding: "8px 16px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button
            onClick={save}
            disabled={saving}
            style={{
              background: "linear-gradient(135deg,rgba(0,255,178,0.15),rgba(56,189,248,0.15))",
              border: "1px solid rgba(0,255,178,0.2)", borderRadius: 8, color: "#00FFB2",
              padding: "8px 20px", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Context"}
          </button>
        </div>
      </div>
    </div>
  );
}

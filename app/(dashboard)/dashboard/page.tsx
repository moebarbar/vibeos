"use client";
import { useState, useRef, useEffect } from "react";
import { AGENT_META, type AgentId } from "@/lib/agents";

const AGENTS = Object.values(AGENT_META);

function formatOutput(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## "))
      return <h2 key={i} style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700, marginTop: "1.1rem", marginBottom: "0.35rem" }}>{line.slice(3)}</h2>;
    if (line.startsWith("### "))
      return <h3 key={i} style={{ color: "#888", fontSize: "0.78rem", fontWeight: 700, marginTop: "0.9rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{line.slice(4)}</h3>;
    if (line.trim() === "") return <br key={i} />;
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} style={{ margin: "0.12rem 0", fontSize: "0.875rem", color: "#bbb", lineHeight: 1.75 }}>
        {parts.map((p, j) =>
          p.startsWith("**") ? <strong key={j} style={{ color: "#fff" }}>{p.slice(2, -2)}</strong> : p
        )}
      </p>
    );
  });
}

export default function AgentsPage() {
  const [activeAgent, setActiveAgent] = useState<(typeof AGENT_META)[AgentId] | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [projectBrainActive, setProjectBrainActive] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/projects/active")
      .then(r => r.json())
      .then(d => setProjectBrainActive(!!d?.contextBrief))
      .catch(() => {});
  }, []);

  const runAgent = async () => {
    if (!input.trim() || !activeAgent) return;
    setLoading(true);
    setOutput("");
    setCopied(false);
    try {
      const res = await fetch(`/api/agents/${activeAgent.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) {
        const err = await res.json();
        setOutput(res.status === 429
          ? "## Usage Limit Reached\n\nYou've reached your monthly agent call limit. Upgrade to Pro for 500 calls/month."
          : `Error: ${err.error ?? "Something went wrong"}`);
        setLoading(false);
        return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) { setLoading(false); return; }
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setOutput(full);
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
      if (activeAgent.id === "brain") setProjectBrainActive(true);
    } catch {
      setOutput("Connection error. Please try again.");
    }
    setLoading(false);
  };

  const selectAgent = (agent: (typeof AGENT_META)[AgentId]) => {
    setActiveAgent(agent);
    setInput("");
    setOutput("");
    setCopied(false);
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>

      {/* ── AGENT SELECTOR ─────────────────────────────────── */}
      <div style={{
        width: 208, borderRight: "1px solid rgba(255,255,255,0.04)",
        padding: "14px 10px", display: "flex", flexDirection: "column",
        gap: 3, flexShrink: 0, overflowY: "auto",
        background: "rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.14em", paddingLeft: 4, marginBottom: 6, fontWeight: 600 }}>AGENTS</div>
        {AGENTS.map(agent => {
          const active = activeAgent?.id === agent.id;
          return (
            <button key={agent.id} onClick={() => selectAgent(agent)}
              className="vibe-agent-btn"
              style={{ "--agent-color": active ? agent.color : "transparent" } as React.CSSProperties}
              onMouseOver={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.025)"; }}
              onMouseOut={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
              <span style={{
                fontSize: 16, flexShrink: 0, width: 26, height: 26,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, background: active ? `${agent.color}14` : "transparent",
                transition: "background 0.2s",
              }}>{agent.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: active ? agent.color : "rgba(255,255,255,0.55)", lineHeight: 1.2 }}>{agent.name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", lineHeight: 1.4, marginTop: 2 }}>{agent.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── MAIN AREA ──────────────────────────────────────── */}
      {!activeAgent ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 48 }}>
          {/* Hero text */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 14 }}>
              Your AI Chief of Staff<br />
              <span className="vibe-gradient-text">for vibe coding.</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", maxWidth: 400, lineHeight: 1.75, fontSize: 13, margin: "0 auto" }}>
              Pick an agent from the sidebar. Start with{" "}
              <strong style={{ color: "rgba(255,255,255,0.6)" }}>Project Brain</strong>{" "}
              — set it up once and every other agent will know your project.
            </p>
          </div>

          {/* Agent chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 520 }}>
            {AGENTS.map(a => (
              <div key={a.id} onClick={() => selectAgent(a)}
                style={{
                  padding: "6px 14px", borderRadius: 20,
                  background: `${a.color}08`,
                  border: `1px solid ${a.color}22`,
                  fontSize: 11, color: a.color, cursor: "pointer",
                  transition: "all 0.18s ease", fontWeight: 500,
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = `${a.color}14`; (e.currentTarget as HTMLElement).style.borderColor = `${a.color}44`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${a.color}14`; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = `${a.color}08`; (e.currentTarget as HTMLElement).style.borderColor = `${a.color}22`; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {a.icon} {a.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Input Panel */}
          <div style={{
            width: "44%", borderRight: "1px solid rgba(255,255,255,0.04)",
            padding: "22px 20px", display: "flex", flexDirection: "column", gap: 14,
          }}>
            {/* Agent header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: `${activeAgent.color}10`,
                border: `1px solid ${activeAgent.color}24`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
                boxShadow: `0 0 20px ${activeAgent.color}14`,
              }}>{activeAgent.icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: activeAgent.color, letterSpacing: "-0.01em" }}>{activeAgent.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 1 }}>{activeAgent.tagline}</div>
              </div>
            </div>

            {/* Brain status */}
            {projectBrainActive && activeAgent.id !== "brain" && (
              <div style={{
                background: "rgba(0,255,178,0.04)",
                border: "1px solid rgba(0,255,178,0.14)",
                borderRadius: 9, padding: "8px 12px",
                fontSize: 11, color: "#00FFB2",
                display: "flex", alignItems: "center", gap: 7,
                animation: "vibe-slide-up 0.3s ease both",
              }}>
                <span className="vibe-dot-pulse" />
                Project context loaded — this agent knows your project
              </div>
            )}

            <label style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>{activeAgent.inputLabel}</label>

            <textarea
              rows={9}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={activeAgent.placeholder}
              onKeyDown={e => { if (e.metaKey && e.key === "Enter") runAgent(); }}
              className="vibe-input"
              style={{
                flex: 1, minHeight: 180,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 13, padding: "12px 14px",
                resize: "none", lineHeight: 1.65,
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>⌘ + Enter to run</span>
              <button onClick={runAgent} disabled={loading || !input.trim()}
                className="vibe-btn-primary"
                style={{
                  padding: "9px 22px", fontSize: 12, borderRadius: 9,
                  opacity: loading || !input.trim() ? 0.35 : 1,
                  background: activeAgent.color,
                  pointerEvents: loading || !input.trim() ? "none" : "auto",
                }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 11, height: 11, border: "2px solid rgba(0,0,0,0.25)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block", animation: "vibe-spin-slow 0.65s linear infinite" }} />
                    Running...
                  </span>
                ) : `Run ${activeAgent.name} →`}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div style={{ flex: 1, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.14em", fontWeight: 600 }}>OUTPUT</span>
              {output && (
                <button
                  onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{
                    background: copied ? "rgba(0,255,178,0.08)" : "rgba(255,255,255,0.04)",
                    border: copied ? "1px solid rgba(0,255,178,0.2)" : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 7,
                    color: copied ? "#00FFB2" : "rgba(255,255,255,0.4)",
                    padding: "5px 12px", fontSize: 10, cursor: "pointer",
                    fontFamily: "monospace", transition: "all 0.2s ease",
                  }}>
                  {copied ? "✓ Copied!" : "⎘ Copy"}
                </button>
              )}
            </div>

            {/* Loading bar */}
            {loading && <div className="vibe-loading-bar" />}

            <div ref={outputRef} style={{
              flex: 1, overflowY: "auto",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12, padding: "16px 18px",
            }}>
              {loading && !output && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: activeAgent.color, display: "inline-block", animation: "vibe-pulse-dot 1.2s infinite", boxShadow: `0 0 10px ${activeAgent.color}` }} />
                  {activeAgent.name} is thinking...
                </div>
              )}
              {!loading && !output && (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.1)", fontSize: 13, textAlign: "center", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontSize: 32, opacity: 0.3 }}>{activeAgent.icon}</span>
                  <span>Output will appear here</span>
                </div>
              )}
              {output && <div className="agent-output">{formatOutput(output)}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
      <p key={i} style={{ margin: "0.12rem 0", fontSize: "0.875rem", color: "#bbb", lineHeight: 1.7 }}>
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
    // Check if project brain is active by pinging projects API
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
        if (res.status === 429) {
          setOutput("## Usage Limit Reached\n\nYou've reached your monthly agent call limit. Upgrade to Pro for 500 calls/month.");
        } else {
          setOutput(`Error: ${err.error ?? "Something went wrong"}`);
        }
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
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setOutput(full);
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }

      if (activeAgent.id === "brain") setProjectBrainActive(true);
    } catch (e) {
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
      {/* Agent Selector Sidebar */}
      <div style={{ width: 200, borderRight: "1px solid #0f0f0f", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0, overflowY: "auto" }}>
        <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.14em", paddingLeft: 4, marginBottom: 4 }}>AGENTS</div>
        {AGENTS.map(agent => (
          <button key={agent.id} onClick={() => selectAgent(agent)}
            style={{ background: activeAgent?.id === agent.id ? "#111" : "transparent", border: `1px solid ${activeAgent?.id === agent.id ? agent.color + "44" : "#111"}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 14 }}>{agent.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: activeAgent?.id === agent.id ? agent.color : "#777" }}>{agent.name}</div>
              <div style={{ fontSize: 9, color: "#333", lineHeight: 1.3, marginTop: 1 }}>{agent.tagline}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Area */}
      {!activeAgent ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 40 }}>
          <div style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, textAlign: "center", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Your AI Chief of Staff<br />
            <span style={{ background: "linear-gradient(90deg,#00FFB2,#38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>for vibe coding.</span>
          </div>
          <p style={{ color: "#444", textAlign: "center", maxWidth: 420, lineHeight: 1.7, fontSize: 13 }}>
            Pick an agent from the sidebar. Start with <strong style={{ color: "#888" }}>Project Brain</strong> — set it up once and every other agent will know your project.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 500 }}>
            {AGENTS.map(a => (
              <div key={a.id} onClick={() => selectAgent(a)} style={{ padding: "5px 12px", borderRadius: 20, background: "#0d0d0d", border: `1px solid ${a.color}33`, fontSize: 11, color: a.color, cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.borderColor = a.color + "88")}
                onMouseOut={e => (e.currentTarget.style.borderColor = a.color + "33")}>
                {a.icon} {a.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Input Panel */}
          <div style={{ width: "45%", borderRight: "1px solid #0f0f0f", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 22, filter: `drop-shadow(0 0 8px ${activeAgent.color}55)` }}>{activeAgent.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: activeAgent.color }}>{activeAgent.name}</div>
                <div style={{ fontSize: 11, color: "#444" }}>{activeAgent.tagline}</div>
              </div>
            </div>

            {projectBrainActive && activeAgent.id !== "brain" && (
              <div style={{ background: "#0d1f17", border: "1px solid #1a3a2a", borderRadius: 7, padding: "7px 10px", fontSize: 11, color: "#00FFB2", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🧠</span> Project context loaded — this agent knows your project
              </div>
            )}

            <label style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em", textTransform: "uppercase" }}>{activeAgent.inputLabel}</label>

            <textarea
              rows={9}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={activeAgent.placeholder}
              onKeyDown={e => { if (e.metaKey && e.key === "Enter") runAgent(); }}
              style={{ flex: 1, minHeight: 180, background: "#0a0a0a", border: "1px solid #151515", borderRadius: 8, color: "#ccc", fontFamily: "system-ui, sans-serif", fontSize: 13, padding: "10px 12px", resize: "none", outline: "none", lineHeight: 1.6, transition: "border-color 0.2s" }}
              onFocus={e => (e.target.style.borderColor = "#2a2a2a")}
              onBlur={e => (e.target.style.borderColor = "#151515")}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#2a2a2a", fontFamily: "monospace" }}>⌘ + Enter to run</span>
              <button onClick={runAgent} disabled={loading || !input.trim()}
                style={{ background: activeAgent.color, color: "#000", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 12, cursor: "pointer", opacity: loading || !input.trim() ? 0.4 : 1, letterSpacing: "0.03em", fontFamily: "inherit", transition: "opacity 0.2s" }}>
                {loading ? "⟳ Running..." : `Run ${activeAgent.name} →`}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "#333", letterSpacing: "0.12em" }}>OUTPUT</span>
              {output && (
                <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 6, color: "#666", padding: "4px 10px", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>
                  {copied ? "✓ Copied!" : "⎘ Copy"}
                </button>
              )}
            </div>

            <div ref={outputRef} style={{ flex: 1, overflowY: "auto", background: "#0a0a0a", border: "1px solid #111", borderRadius: 10, padding: "14px 16px" }}>
              {loading && !output && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#444", fontSize: 12 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: activeAgent.color, display: "inline-block", animation: "pulse 1s infinite" }} />
                  {activeAgent.name} is thinking...
                </div>
              )}
              {!loading && !output && (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#1e1e1e", fontSize: 13, textAlign: "center", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 28 }}>{activeAgent.icon}</span>
                  <span>Output will appear here</span>
                </div>
              )}
              {output && <div className="agent-output">{formatOutput(output)}</div>}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { formatRelativeTime } from "@/lib/utils";

interface LedgerEntry {
  id: string;
  type: string;
  summary: string;
  details: string;
  impact: string | null;
  refSnippet: string | null;
  createdAt: string;
  project: { name: string };
}

const TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  feature:     { bg: "#0d1f17", color: "#00FFB2", label: "Feature Built" },
  decision:    { bg: "#0d1327", color: "#38BDF8", label: "Architecture Decision" },
  bugfix:      { bg: "#1f0d0d", color: "#f87171", label: "Bug Fix" },
  integration: { bg: "#1a0d2e", color: "#A78BFA", label: "Integration Added" },
};

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ledger").then(r => r.json()).then(d => { setEntries(d); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? entries : entries.filter(e => e.type === filter);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: 28, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Build Ledger</h1>
          <p style={{ fontSize: 13, color: "#555", margin: "4px 0 0" }}>Log of what you've built and every decision made</p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {[["all", "All"], ["feature", "Features"], ["decision", "Decisions"], ["bugfix", "Bug Fixes"], ["integration", "Integrations"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ background: filter === val ? "#fff" : "transparent", border: "1px solid #1a1a1a", borderRadius: 20, color: filter === val ? "#000" : "#555", padding: "5px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: filter === val ? 600 : 400 }}>{label}</button>
        ))}
      </div>

      {/* Empty state */}
      {!loading && entries.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>🗺️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>No ledger entries yet</div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Use the Build Ledger agent to log what you build and decide</div>
          <a href="/dashboard" style={{ background: "#A78BFA", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>Open Build Ledger Agent →</a>
        </div>
      )}

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {filtered.length > 0 && (
          <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom,#1a1a1a,transparent)", pointerEvents: "none" }} />
        )}
        {filtered.map(entry => {
          const style = TYPE_STYLES[entry.type] ?? TYPE_STYLES.feature;
          const isExpanded = expanded === entry.id;
          return (
            <div key={entry.id} style={{ display: "flex", gap: 20, marginBottom: 20 }}>
              {/* Timeline dot */}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: style.bg, border: `1px solid ${style.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: style.color }} />
              </div>

              {/* Card */}
              <div style={{ flex: 1, background: "#0d0d0d", border: "1px solid #151515", borderRadius: 12, padding: 18, marginBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: style.bg, color: style.color, borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{style.label}</span>
                    <span style={{ fontSize: 11, color: "#333" }}>{entry.project.name}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#333" }}>{formatRelativeTime(entry.createdAt)}</span>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>{entry.summary}</h3>

                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>
                  {isExpanded ? entry.details : entry.details.slice(0, 120) + (entry.details.length > 120 ? "..." : "")}
                </p>

                {entry.details.length > 120 && (
                  <button onClick={() => setExpanded(isExpanded ? null : entry.id)} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", marginTop: 6, padding: 0 }}>
                    {isExpanded ? "Show less ↑" : "Show more ↓"}
                  </button>
                )}

                {isExpanded && entry.impact && (
                  <p style={{ fontSize: 12, color: "#444", marginTop: 8, fontStyle: "italic" }}>💡 {entry.impact}</p>
                )}

                {isExpanded && entry.refSnippet && (
                  <div style={{ marginTop: 12, background: "#070707", border: "1px solid #1a1a1a", borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em" }}>FUTURE REFERENCE SNIPPET</span>
                      <button onClick={() => copySnippet(entry.id, entry.refSnippet!)} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 5, color: "#666", padding: "3px 8px", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>
                        {copied === entry.id ? "✓ Copied!" : "⎘ Copy"}
                      </button>
                    </div>
                    <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, margin: 0, fontFamily: "monospace" }}>{entry.refSnippet}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  label: string;
  category?: string;
  icon?: string;
}

const DEFAULT_RESULTS: SearchResult[] = [
  { id: "1", label: "Create new project", category: "Actions", icon: "+" },
  { id: "2", label: "Open dashboard", category: "Navigate", icon: "⬡" },
  { id: "3", label: "View analytics", category: "Navigate", icon: "◉" },
  { id: "4", label: "Invite teammate", category: "Actions", icon: "◎" },
  { id: "5", label: "Element Forge", category: "Tools", icon: "◈" },
];

interface ActionSearchBarProps {
  placeholder?: string;
  results?: SearchResult[];
}

export function ActionSearchBar({
  placeholder = "Search actions...",
  results = DEFAULT_RESULTS,
}: ActionSearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = query
    ? results.filter(r => r.label.toLowerCase().includes(query.toLowerCase()))
    : results;

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    setTimeout(() => setSelected(null), 600);
    setQuery("");
    setFocused(false);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      <div
        className="relative flex items-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: focused ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(0,255,178,0.12)" : "none",
        }}
      >
        <span style={{ paddingLeft: 14, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>⌕</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "10px 14px",
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
            fontFamily: "inherit",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{ paddingRight: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
          >
            ✕
          </button>
        )}
        <div style={{ paddingRight: 12, color: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "monospace" }}>⌘K</div>
      </div>

      <AnimatePresence>
        {focused && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              overflow: "hidden",
              zIndex: 50,
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            {filtered.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onMouseDown={() => handleSelect(r.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "9px 14px",
                  background: selected === r.id ? "rgba(0,255,178,0.08)" : "transparent",
                  border: "none",
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", borderRadius: 6, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                  {r.icon}
                </span>
                <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{r.label}</span>
                {r.category && (
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{r.category}</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

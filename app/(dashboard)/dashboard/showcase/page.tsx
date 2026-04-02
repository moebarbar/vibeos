"use client";
import { useState, useEffect } from "react";

type ShowcaseItem = {
  id: string;
  projectId: string;
  headline: string;
  demoUrl: string | null;
  views: number;
  likes: number;
  industryTag: string | null;
  project: { name: string; description: string; industry: string | null };
};

const INDUSTRIES = ["All", "SaaS", "Fintech", "Health", "E-commerce", "Dev Tools", "AI", "Education", "Other"];

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [industry, setIndustry] = useState("All");
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (industry !== "All") params.set("industry", industry);
    fetch(`/api/showcase?${params}`)
      .then(r => r.json())
      .then(d => { setItems(d.items ?? []); setTotal(d.total ?? 0); })
      .finally(() => setLoading(false));
  }, [industry]);

  const like = async (item: ShowcaseItem) => {
    if (likedIds.has(item.id)) return;
    setLikedIds(prev => new Set(Array.from(prev).concat(item.id)));
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, likes: i.likes + 1 } : i));
    await fetch("/api/showcase", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showcaseId: item.id }),
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060608", padding: "28px 32px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 6 }}>Community Showcase</h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>
          {total} projects built with Vibe OS
        </p>
      </div>

      {/* Industry filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {INDUSTRIES.map(tag => (
          <button
            key={tag}
            onClick={() => setIndustry(tag)}
            style={{
              background: industry === tag ? "rgba(0,255,178,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${industry === tag ? "rgba(0,255,178,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 20, color: industry === tag ? "#00FFB2" : "rgba(255,255,255,0.4)",
              padding: "5px 14px", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", paddingTop: 60, color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          Loading projects...
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>◈</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>No projects here yet</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>Be the first to showcase your project</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 10,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{item.project.name}</div>
                  {item.industryTag && (
                    <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(0,255,178,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.industryTag}</span>
                  )}
                </div>
              </div>

              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {item.headline}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => like(item)}
                    style={{
                      background: "none", border: "none", cursor: likedIds.has(item.id) ? "default" : "pointer",
                      color: likedIds.has(item.id) ? "#00FFB2" : "rgba(255,255,255,0.3)",
                      fontSize: 11, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, padding: 0,
                    }}
                  >
                    {likedIds.has(item.id) ? "♥" : "♡"} {item.likes}
                  </button>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 3 }}>
                    ◎ {item.views}
                  </span>
                </div>
                {item.demoUrl && (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 7, color: "rgba(255,255,255,0.5)", padding: "4px 12px",
                      fontSize: 10, cursor: "pointer", fontFamily: "inherit", textDecoration: "none",
                    }}
                  >
                    View Demo ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

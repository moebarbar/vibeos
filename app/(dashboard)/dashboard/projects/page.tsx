"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string;
  stack: string | null;
  contextBrief: string | null;
  isActive: boolean;
  updatedAt: string;
  _count: { ledgerEntries: number };
}

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get("new") === "1");
  const [form, setForm] = useState({ name: "", description: "", stack: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => { setProjects(d); setLoading(false); });
  }, []);

  async function createProject() {
    if (!form.name.trim()) { setError("Project name is required"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to create"); setSaving(false); return; }
    setShowModal(false);
    setSaving(false);
    setForm({ name: "", description: "", stack: "" });
    router.push("/dashboard");
    router.refresh();
  }

  async function activateProject(id: string) {
    await fetch(`/api/projects/${id}/activate`, { method: "POST" });
    router.refresh();
    setProjects(p => p.map(proj => ({ ...proj, isActive: proj.id === id })));
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects(p => p.filter(proj => proj.id !== id));
  }

  return (
    <div style={{ padding: 28, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Projects</h1>
          <p style={{ fontSize: 13, color: "#555", margin: "4px 0 0" }}>{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + New Project
        </button>
      </div>

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📁</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>No projects yet</div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>Create your first project to get started with Vibe OS</div>
          <button onClick={() => setShowModal(true)} style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 9, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Create First Project →
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: "#0d0d0d", border: `1px solid ${p.isActive ? "#00FFB244" : "#151515"}`, borderRadius: 14, padding: 20, position: "relative" }}>
            {p.isActive && (
              <div style={{ position: "absolute", top: 12, right: 12, background: "#0d1f17", border: "1px solid #1a3a2a", borderRadius: 20, padding: "2px 8px", fontSize: 10, color: "#00FFB2" }}>● Active</div>
            )}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 6px", paddingRight: p.isActive ? 60 : 0 }}>{p.name}</h3>
            <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>

            {p.stack && (
              <div style={{ display: "inline-flex", background: "#111", border: "1px solid #1a1a1a", borderRadius: 5, padding: "2px 8px", fontSize: 11, color: "#666", marginBottom: 10 }}>
                {p.stack}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#444", marginBottom: 14 }}>
              {p.contextBrief && <span style={{ color: "#00FFB2" }}>🧠 Brain active</span>}
              <span>📋 {p._count.ledgerEntries} entries</span>
              <span>Updated {formatRelativeTime(p.updatedAt)}</span>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {!p.isActive && (
                <button onClick={() => activateProject(p.id)} style={{ flex: 1, background: "#111", border: "1px solid #1e1e1e", borderRadius: 7, color: "#888", padding: "7px", fontSize: 11, cursor: "pointer" }}>
                  Set Active
                </button>
              )}
              {p.isActive && (
                <button onClick={() => router.push("/dashboard")} style={{ flex: 1, background: "#0d1f17", border: "1px solid #1a3a2a", borderRadius: 7, color: "#00FFB2", padding: "7px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                  Open Agents →
                </button>
              )}
              <button onClick={() => deleteProject(p.id)} style={{ background: "#1a0a0a", border: "1px solid #2a1a1a", borderRadius: 7, color: "#f87171", padding: "7px 10px", fontSize: 11, cursor: "pointer" }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 18, padding: 36, width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>New Project</h2>
            <p style={{ fontSize: 13, color: "#555", margin: "0 0 24px" }}>Start with the basics — you can fill in more details with Project Brain later.</p>

            <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Project Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. CostLens AI" style={{ width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14, fontFamily: "system-ui" }} />

            <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>What are you building?</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. An AI spend management SaaS that helps founders track their AI API costs across OpenAI, Anthropic, and AWS." rows={3} style={{ width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#ccc", padding: "10px 12px", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "none", marginBottom: 14, fontFamily: "system-ui", lineHeight: 1.6 }} />

            <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Tech Stack (optional)</label>
            <input value={form.stack} onChange={e => setForm(f => ({ ...f, stack: e.target.value }))} placeholder="e.g. Next.js, Prisma, Railway, Clerk" style={{ width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#ccc", padding: "10px 12px", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 6, fontFamily: "system-ui" }} />

            {error && <p style={{ fontSize: 12, color: "#f87171", margin: "0 0 14px" }}>{error}</p>}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => { setShowModal(false); setForm({ name: "", description: "", stack: "" }); setError(""); }} style={{ flex: 1, background: "transparent", border: "1px solid #222", borderRadius: 8, color: "#555", padding: 11, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={createProject} disabled={saving || !form.name.trim()} style={{ flex: 2, background: "#00FFB2", border: "none", borderRadius: 8, color: "#000", padding: 11, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: saving || !form.name.trim() ? 0.5 : 1 }}>
                {saving ? "Creating..." : "Create Project →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 28, color: "#555" }}>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  name: string;
  isActive: boolean;
  contextBrief: string | null;
}

interface Props {
  user: { id: string; name: string | null; email: string; plan: string };
  projects: Project[];
  activeProject: Project | null;
  usageCount: number;
}

const NAV = [
  { href: "/dashboard", icon: "🤖", label: "Agents" },
  { href: "/dashboard/forge", icon: "⬡", label: "Element Forge" },
  { href: "/dashboard/templates", icon: "📐", label: "Templates" },
  { href: "/dashboard/ledger", icon: "📋", label: "Build Ledger" },
  { href: "/dashboard/projects", icon: "📁", label: "Projects" },
];

export default function Sidebar({ user, projects, activeProject, usageCount }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [projectOpen, setProjectOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const usageLimit = user.plan === "FREE" ? 20 : user.plan === "PRO" ? 500 : null;
  const usagePct = usageLimit ? Math.min((usageCount / usageLimit) * 100, 100) : 0;

  async function switchProject(projectId: string) {
    await fetch(`/api/projects/${projectId}/activate`, { method: "POST" });
    setProjectOpen(false);
    router.refresh();
  }

  async function newProject() {
    router.push("/dashboard/projects?new=1");
    setProjectOpen(false);
  }

  return (
    <aside style={{ width: 210, background: "#0d0d0d", borderRight: "1px solid #111", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", position: "relative" }}>
      {/* Logo */}
      <div style={{ padding: "16px 14px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>⚡</div>
        <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>Vibe OS</span>
      </div>

      {/* Project Selector */}
      <div style={{ padding: "10px 10px 0" }}>
        <div style={{ fontSize: 9, color: "#333", letterSpacing: "0.12em", marginBottom: 5, paddingLeft: 4 }}>ACTIVE PROJECT</div>
        <div onClick={() => setProjectOpen(!projectOpen)} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {activeProject?.name ?? "No project selected"}
            </div>
            {activeProject?.contextBrief && (
              <div style={{ fontSize: 9, color: "#00FFB2", marginTop: 2 }}>● Brain active</div>
            )}
          </div>
          <span style={{ color: "#444", fontSize: 10, marginLeft: 6, flexShrink: 0 }}>{projectOpen ? "▲" : "▼"}</span>
        </div>

        {/* Project Dropdown */}
        {projectOpen && (
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, marginTop: 4, overflow: "hidden", zIndex: 50 }}>
            {projects.map(p => (
              <div key={p.id} onClick={() => switchProject(p.id)} style={{ padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #151515" }}
                onMouseOver={e => (e.currentTarget.style.background = "#1a1a1a")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontSize: 12, color: p.isActive ? "#00FFB2" : "#888" }}>{p.name}</span>
                {p.isActive && <span style={{ fontSize: 9, color: "#00FFB2" }}>●</span>}
              </div>
            ))}
            <div onClick={newProject} style={{ padding: "8px 12px", cursor: "pointer", fontSize: 12, color: "#555" }}
              onMouseOver={e => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
              + New Project
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <div style={{ fontSize: 9, color: "#333", letterSpacing: "0.12em", marginBottom: 6, paddingLeft: 4 }}>MENU</div>
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, marginBottom: 2, background: active ? "#1a1a1a" : "transparent", border: active ? "1px solid #222" : "1px solid transparent", textDecoration: "none", transition: "all 0.15s" }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background = "#111"; }}
              onMouseOut={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: active ? "#fff" : "#666", fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Usage + Plan + User */}
      <div style={{ padding: "10px", borderTop: "1px solid #111" }}>
        {/* Usage bar */}
        {usageLimit && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: "#444", letterSpacing: "0.08em" }}>USAGE</span>
              <span style={{ fontSize: 9, color: "#555" }}>{usageCount}/{usageLimit}</span>
            </div>
            <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2 }}>
              <div style={{ width: `${usagePct}%`, height: "100%", background: usagePct > 80 ? "#f87171" : "#00FFB2", borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        {/* Plan badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ background: user.plan === "FREE" ? "#1a1a1a" : user.plan === "PRO" ? "#0d1f17" : "#1a0d2e", color: user.plan === "FREE" ? "#666" : user.plan === "PRO" ? "#00FFB2" : "#A78BFA", border: `1px solid ${user.plan === "FREE" ? "#222" : user.plan === "PRO" ? "#1a3a2a" : "#2a1a4a"}`, borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{user.plan}</span>
          {user.plan === "FREE" && (
            <Link href="/dashboard/settings?tab=billing" style={{ fontSize: 10, color: "#00FFB2", textDecoration: "none" }}>Upgrade →</Link>
          )}
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #00FFB244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#00FFB2", flexShrink: 0 }}>
            {(user.name ?? user.email)[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name ?? user.email.split("@")[0]}</div>
          </div>
          <button onClick={signOut} title="Sign out" style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 14, padding: "2px 4px", flexShrink: 0 }}>↩</button>
        </div>
      </div>
    </aside>
  );
}

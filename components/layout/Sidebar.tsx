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
  { href: "/dashboard", icon: "⬡", label: "Agents", exact: true },
  { href: "/dashboard/forge", icon: "◈", label: "Element Forge", exact: false },
  { href: "/dashboard/templates", icon: "⊞", label: "Templates", exact: false },
  { href: "/dashboard/ledger", icon: "◉", label: "Build Ledger", exact: false },
  { href: "/dashboard/projects", icon: "◫", label: "Projects", exact: false },
];

const PLAN_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  FREE: { bg: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "rgba(255,255,255,0.08)" },
  PRO: { bg: "rgba(0,255,178,0.06)", color: "#00FFB2", border: "rgba(0,255,178,0.2)" },
  FOUNDER: { bg: "rgba(167,139,250,0.06)", color: "#A78BFA", border: "rgba(167,139,250,0.2)" },
};

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
  const planStyle = PLAN_STYLES[user.plan] ?? PLAN_STYLES.FREE;

  async function switchProject(projectId: string) {
    await fetch(`/api/projects/${projectId}/activate`, { method: "POST" });
    setProjectOpen(false);
    router.refresh();
  }

  return (
    <aside style={{
      width: 216,
      background: "rgba(5, 5, 7, 0.97)",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column",
      flexShrink: 0, overflowY: "auto",
      position: "relative",
    }}>

      {/* ── LOGO ───────────────────────────────────────────── */}
      <div style={{
        padding: "16px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 9,
      }}>
        <div style={{
          width: 30, height: 30,
          background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
          boxShadow: "0 0 18px rgba(0,255,178,0.3)",
        }}>⚡</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.93rem", letterSpacing: "-0.03em", lineHeight: 1 }}>Vibe OS</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em", marginTop: 2 }}>AI Chief of Staff</div>
        </div>
      </div>

      {/* ── PROJECT SELECTOR ───────────────────────────────── */}
      <div style={{ padding: "12px 10px 4px" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.14em", marginBottom: 6, paddingLeft: 4, fontWeight: 600 }}>ACTIVE PROJECT</div>
        <div
          onClick={() => setProjectOpen(!projectOpen)}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 9, padding: "9px 10px",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            transition: "all 0.15s ease",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {activeProject?.name ?? "No project"}
            </div>
            {activeProject?.contextBrief && (
              <div style={{ fontSize: 9, color: "#00FFB2", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <span className="vibe-dot-pulse" style={{ width: 4, height: 4 }} />
                Brain active
              </div>
            )}
          </div>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, marginLeft: 6, flexShrink: 0, transition: "transform 0.2s", transform: projectOpen ? "rotate(180deg)" : "none" }}>▼</span>
        </div>

        {/* Dropdown */}
        {projectOpen && (
          <div style={{
            background: "rgba(8,8,10,0.95)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, marginTop: 4,
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            animation: "vibe-slide-up 0.2s ease both",
          }}>
            {projects.map(p => (
              <div key={p.id} onClick={() => switchProject(p.id)}
                style={{
                  padding: "9px 12px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.15s",
                }}
                onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontSize: 12, color: p.isActive ? "#00FFB2" : "rgba(255,255,255,0.5)", fontWeight: p.isActive ? 600 : 400 }}>{p.name}</span>
                {p.isActive && <span className="vibe-dot-pulse" style={{ width: 5, height: 5 }} />}
              </div>
            ))}
            <div onClick={() => { router.push("/dashboard/projects?new=1"); setProjectOpen(false); }}
              style={{ padding: "9px 12px", cursor: "pointer", fontSize: 12, color: "rgba(255,255,255,0.3)", transition: "all 0.15s" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
              + New Project
            </div>
          </div>
        )}
      </div>

      {/* ── NAVIGATION ─────────────────────────────────────── */}
      <nav style={{ padding: "14px 10px", flex: 1 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.14em", marginBottom: 8, paddingLeft: 4, fontWeight: 600 }}>MENU</div>
        {NAV.map(item => {
          const active = item.exact
            ? pathname === item.href
            : (pathname === item.href || pathname.startsWith(item.href + "/"));
          return (
            <Link key={item.href} href={item.href}
              className={`vibe-nav-link${active ? " active" : ""}`}>
              <span style={{ fontSize: 15, color: active ? "#00FFB2" : "rgba(255,255,255,0.35)", flexShrink: 0, width: 18, textAlign: "center" }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.45)", fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── BOTTOM SECTION ─────────────────────────────────── */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Usage bar */}
        {usageLimit && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em", fontWeight: 600 }}>USAGE</span>
              <span style={{ fontSize: 9, color: usagePct > 80 ? "#f87171" : "rgba(255,255,255,0.3)" }}>{usageCount}/{usageLimit}</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                width: `${usagePct}%`, height: "100%",
                background: usagePct > 80
                  ? "linear-gradient(90deg, #f87171, #ef4444)"
                  : "linear-gradient(90deg, #00FFB2, #38BDF8)",
                borderRadius: 2,
                transition: "width 0.5s ease",
                boxShadow: usagePct > 80 ? "0 0 8px rgba(248,113,113,0.5)" : "0 0 8px rgba(0,255,178,0.4)",
              }} />
            </div>
          </div>
        )}

        {/* Plan badge + upgrade */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{
            background: planStyle.bg, color: planStyle.color,
            border: `1px solid ${planStyle.border}`,
            borderRadius: 6, padding: "3px 9px",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
          }}>{user.plan}</span>
          {user.plan === "FREE" && (
            <Link href="/dashboard/settings?tab=billing"
              style={{ fontSize: 10, color: "#00FFB2", textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" }}
              onMouseOver={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}>
              Upgrade →
            </Link>
          )}
        </div>

        {/* User row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(0,255,178,0.08)",
            border: "1.5px solid rgba(0,255,178,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#00FFB2", flexShrink: 0,
            boxShadow: "0 0 12px rgba(0,255,178,0.12)",
          }}>
            {(user.name ?? user.email)[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name ?? user.email.split("@")[0]}
            </div>
          </div>
          <button
            onClick={signOut} title="Sign out"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer", fontSize: 13, padding: "5px 7px",
              flexShrink: 0, borderRadius: 7,
              transition: "all 0.15s ease",
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.08)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)"; }}>
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}

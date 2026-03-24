"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "billing", icon: "💳", label: "Billing" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "danger", icon: "⚠️", label: "Danger Zone" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("profile");
  const [notifs, setNotifs] = useState({ email: true, weekly: false, updates: true, security: true });
  const [billingLoading, setBillingLoading] = useState(false);

  async function openBillingPortal() {
    setBillingLoading(true);
    const res = await fetch("/api/billing/create-portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setBillingLoading(false);
  }

  async function upgradePlan(plan: "PRO" | "FOUNDER") {
    setBillingLoading(true);
    const res = await fetch("/api/billing/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setBillingLoading(false);
  }

  const Toggle = ({ k }: { k: keyof typeof notifs }) => (
    <div onClick={() => setNotifs(n => ({ ...n, [k]: !n[k] }))} style={{ width: 40, height: 22, borderRadius: 11, background: notifs[k] ? "#00FFB2" : "#1e1e1e", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: notifs[k] ? 20 : 2, transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Settings Sidebar */}
      <div style={{ width: 200, borderRight: "1px solid #0f0f0f", padding: "14px 10px", flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.14em", paddingLeft: 4, marginBottom: 8 }}>SETTINGS</div>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", background: tab === t.id ? "#1a1a1a" : "transparent", border: `1px solid ${tab === t.id ? "#222" : "transparent"}`, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 2, textAlign: "left", fontFamily: "inherit" }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span>
            <span style={{ fontSize: 13, color: tab === t.id ? "#fff" : "#555" }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto", maxWidth: 600 }}>

        {tab === "profile" && (
          <>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>Profile</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, background: "#0d0d0d", border: "1px solid #151515", borderRadius: 12, padding: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1a1a1a", border: "2px solid #00FFB244", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#00FFB2", flexShrink: 0 }}>M</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Your Account</div>
                <div style={{ fontSize: 12, color: "#555" }}>Managed by Clerk authentication</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>Profile details like name, email, and avatar are managed through your Clerk account. Click below to update them.</p>
            <a href="https://accounts.clerk.com/user" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 16, background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, color: "#888", padding: "10px 18px", fontSize: 13, textDecoration: "none" }}>Manage Account →</a>
          </>
        )}

        {tab === "billing" && (
          <>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>Billing</h1>

            {/* Current plan */}
            <div style={{ background: "#0d0d0d", border: "1px solid #151515", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Current Plan</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>Manage your subscription</div>
                </div>
                <button onClick={openBillingPortal} disabled={billingLoading} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 7, color: "#888", padding: "7px 14px", fontSize: 12, cursor: "pointer" }}>
                  {billingLoading ? "Loading..." : "Manage Billing →"}
                </button>
              </div>
            </div>

            {/* Upgrade options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#111", border: "1px solid #00FFB244", borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#00FFB2", marginBottom: 4 }}>Pro</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>$29<span style={{ fontSize: 13, color: "#555", fontWeight: 400 }}>/mo</span></div>
                {["Unlimited projects", "All 6 agents", "Full Element Forge", "AI generator"].map(f => <div key={f} style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>✓ {f}</div>)}
                <button onClick={() => upgradePlan("PRO")} style={{ width: "100%", marginTop: 14, background: "#00FFB2", color: "#000", border: "none", borderRadius: 7, padding: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Upgrade to Pro</button>
              </div>
              <div style={{ background: "#111", border: "1px solid #A78BFA44", borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#A78BFA", marginBottom: 4 }}>Founder</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>$79<span style={{ fontSize: 13, color: "#555", fontWeight: 400 }}>/mo</span></div>
                {["Everything in Pro", "Team sharing", "Weekly AI audit", "Early access"].map(f => <div key={f} style={{ fontSize: 12, color: "#666", marginBottom: 5 }}>✓ {f}</div>)}
                <button onClick={() => upgradePlan("FOUNDER")} style={{ width: "100%", marginTop: 14, background: "#A78BFA", color: "#000", border: "none", borderRadius: 7, padding: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Go Founder</button>
              </div>
            </div>
          </>
        )}

        {tab === "notifications" && (
          <>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>Notifications</h1>
            {[
              ["email", "Email notifications", "Receive product updates via email"],
              ["weekly", "Weekly digest", "Summary of your activity every Monday"],
              ["updates", "Product updates", "New features and improvements"],
              ["security", "Security alerts", "Login attempts and security events"],
            ].map(([k, title, desc]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #111" }}>
                <div>
                  <div style={{ fontSize: 14, color: "#fff", marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{desc}</div>
                </div>
                <Toggle k={k as keyof typeof notifs} />
              </div>
            ))}
          </>
        )}

        {tab === "danger" && (
          <>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 24px" }}>Danger Zone</h1>
            <div style={{ border: "1px solid #3a1a1a", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#f87171", marginBottom: 6 }}>Delete Account</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 16, lineHeight: 1.6 }}>Permanently delete your account and all associated data including projects, ledger entries, and agent history. This action cannot be undone.</div>
              <button style={{ background: "transparent", border: "1px solid #f87171", borderRadius: 8, color: "#f87171", padding: "8px 18px", fontSize: 13, cursor: "pointer" }} onClick={() => alert("Please contact support@vibeos.app to delete your account.")}>Delete My Account</button>
            </div>
            <div style={{ background: "#0d0d0d", border: "1px solid #151515", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 6 }}>Export Data</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>Download all your data including projects, ledger entries, and settings as a JSON file.</div>
              <button style={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#888", padding: "8px 18px", fontSize: 13, cursor: "pointer" }}>Export All Data</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

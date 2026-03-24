import React, { useState, useEffect } from "react";

export interface TemplateVar { key: string; label: string; default: string; }

export interface Template {
  id: string;
  name: string;
  vibe: string;
  difficulty: "Simple" | "Medium" | "Advanced";
  desc: string;
  vars: TemplateVar[];
  thumbnail: React.FC;
  component: (vars: Record<string, string>) => React.FC;
  codeTemplate: (vars: Record<string, string>) => string;
}

export const TEMPLATE_CATEGORIES = [
  { id: "landing",   label: "SaaS Landing Pages",  icon: "🌐" },
  { id: "auth",      label: "Auth & Onboarding",    icon: "🔐" },
  { id: "dashboard", label: "Dashboards",           icon: "📊" },
  { id: "pricing",   label: "Pricing & Checkout",   icon: "💳" },
  { id: "settings",  label: "Settings & Profile",   icon: "⚙️" },
  { id: "email",     label: "Email Templates",      icon: "📧" },
];

export const TEMPLATES: Record<string, Template[]> = {
  landing: [
    {
      id: "l1",
      name: "Dark Minimal SaaS Hero",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "Full-viewport dark hero with dot grid, gradient glow, animated badge, headline, and social proof.",
      vars: [
        { key: "productName", label: "Product Name",  default: "Vibe OS" },
        { key: "headline",    label: "Main Headline", default: "Ship your SaaS 10x faster" },
        { key: "subtitle",    label: "Subtitle",      default: "The AI chief of staff for non-technical founders doing vibe coding" },
        { key: "primaryCTA",  label: "Primary CTA",   default: "Start Free →" },
        { key: "accentColor", label: "Accent Color",  default: "#00FFB2" },
      ],
      thumbnail: () => React.createElement("div", {
        style: { width: "100%", height: "100%", background: "#070707", backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize: "16px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, padding: 14, position: "relative", overflow: "hidden" }
      },
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at top,rgba(0,255,178,0.07) 0%,transparent 60%)" } }),
        React.createElement("div", { style: { background: "rgba(0,255,178,0.1)", border: "1px solid rgba(0,255,178,0.25)", borderRadius: 10, padding: "2px 8px", fontSize: 7, color: "#00FFB2", marginBottom: 3, position: "relative" } }, "● Now in public beta"),
        React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.0, position: "relative" } }, "Ship your SaaS", React.createElement("br"), React.createElement("span", { style: { color: "#00FFB2" } }, "10x faster")),
        React.createElement("div", { style: { fontSize: 7, color: "rgba(255,255,255,0.3)", textAlign: "center", maxWidth: 120, lineHeight: 1.4, position: "relative", marginTop: 4 } }, "The AI chief of staff for non-technical founders"),
        React.createElement("div", { style: { display: "flex", gap: 5, marginTop: 6, position: "relative" } },
          React.createElement("div", { style: { background: "#00FFB2", borderRadius: 4, padding: "3px 8px", fontSize: 7, color: "#000", fontWeight: 700 } }, "Start Free →"),
          React.createElement("div", { style: { border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, padding: "3px 8px", fontSize: 7, color: "#777" } }, "Demo")
        )
      ),
      component: (v) => function HeroSection() {
        const [visible, setVisible] = useState(false);
        useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
        return React.createElement("div", {
          style: { background: "#070707", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden", backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize: "36px 36px" }
        },
          React.createElement("div", { style: { position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% -10%,${v.accentColor}12 0%,transparent 60%)`, pointerEvents: "none" } }),
          React.createElement("div", {
            style: { maxWidth: 700, width: "100%", textAlign: "center", position: "relative", zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease,transform 0.7s ease" }
          },
            React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 7, background: `${v.accentColor}14`, border: `1px solid ${v.accentColor}33`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: v.accentColor, marginBottom: 28, letterSpacing: "0.06em" } },
              React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: v.accentColor, display: "inline-block" } }),
              "Now in public beta"
            ),
            React.createElement("h1", { style: { fontSize: "clamp(38px,6vw,70px)", fontWeight: 800, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 22px", fontFamily: "system-ui,sans-serif" } },
              v.headline.split(" ").slice(0, Math.ceil(v.headline.split(" ").length / 2)).join(" "),
              React.createElement("br"),
              React.createElement("span", { style: { color: v.accentColor } }, v.headline.split(" ").slice(Math.ceil(v.headline.split(" ").length / 2)).join(" "))
            ),
            React.createElement("p", { style: { fontSize: 18, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 530, margin: "0 auto 38px", fontFamily: "system-ui" } }, v.subtitle),
            React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 } },
              React.createElement("button", { style: { background: v.accentColor, color: "#000", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" } }, v.primaryCTA),
              React.createElement("button", { style: { background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "14px 28px", fontSize: 15, cursor: "pointer" } }, "Watch Demo")
            ),
            React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 36, padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.06)" } },
              ...[["1,200+", "Founders"], ["$2.4M", "SaaS Shipped"], ["4.9★", "Rating"]].map(([val, label]) =>
                React.createElement("div", { key: label, style: { textAlign: "center" } },
                  React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "system-ui" } }, val),
                  React.createElement("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.28)", fontFamily: "system-ui" } }, label)
                )
              )
            )
          )
        );
      },
      codeTemplate: (v) => `import { useState, useEffect } from "react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div style={{
      background: "#070707",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
      backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)",
      backgroundSize: "36px 36px",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% -10%,${v.accentColor}12 0%,transparent 60%)", pointerEvents: "none" }}/>
      <div style={{
        maxWidth: "700px",
        width: "100%",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "${v.accentColor}14", border: "1px solid ${v.accentColor}33", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", color: "${v.accentColor}", marginBottom: "28px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "${v.accentColor}", display: "inline-block" }}/>
          Now in public beta
        </div>
        <h1 style={{ fontSize: "clamp(38px,6vw,70px)", fontWeight: 800, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 22px" }}>
          ${v.headline.split(" ").slice(0, Math.ceil(v.headline.split(" ").length / 2)).join(" ")}<br/>
          <span style={{ color: "${v.accentColor}" }}>${v.headline.split(" ").slice(Math.ceil(v.headline.split(" ").length / 2)).join(" ")}</span>
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: "530px", margin: "0 auto 38px" }}>
          ${v.subtitle}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "52px" }}>
          <button style={{ background: "${v.accentColor}", color: "#000", border: "none", borderRadius: "10px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
            ${v.primaryCTA}
          </button>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "10px", padding: "14px 28px", fontSize: "15px", cursor: "pointer" }}>
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  ],

  auth: [
    {
      id: "a1",
      name: "Full Auth Flow",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "Login, signup, and forgot password — fully interactive with screen switching.",
      vars: [
        { key: "productName", label: "Product Name",  default: "Vibe OS" },
        { key: "accentColor", label: "Accent Color",  default: "#00FFB2" },
        { key: "logoEmoji",   label: "Logo Emoji",    default: "⚡" },
      ],
      thumbnail: () => React.createElement("div", { style: { width: "100%", height: "100%", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 } },
        React.createElement("div", { style: { background: "#111", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", width: "100%", maxWidth: 148 } },
          React.createElement("div", { style: { textAlign: "center", marginBottom: 8 } },
            React.createElement("div", { style: { width: 20, height: 20, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 5, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, marginBottom: 3 } }, "⚡"),
            React.createElement("div", { style: { fontSize: 8, fontWeight: 700, color: "#fff" } }, "Vibe OS")
          ),
          React.createElement("div", { style: { background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 4, padding: "3px 6px", fontSize: 7, color: "#555", marginBottom: 4 } }, "you@example.com"),
          React.createElement("div", { style: { background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 4, padding: "3px 6px", fontSize: 7, color: "#555", marginBottom: 6 } }, "••••••••"),
          React.createElement("div", { style: { background: "#00FFB2", borderRadius: 4, padding: "4px", textAlign: "center", fontSize: 7, fontWeight: 700, color: "#000" } }, "Sign In")
        )
      ),
      component: (v) => function AuthFlow() {
        const [screen, setScreen] = useState<"login" | "signup" | "forgot">("login");
        const Inp = ({ ph, type }: { ph: string; type?: string }) =>
          React.createElement("input", { type: type ?? "text", placeholder: ph, style: { width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, color: "#fff", padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" as const, marginBottom: 12, fontFamily: "system-ui", display: "block" } });
        return React.createElement("div", { style: { background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", padding: 20 } },
          React.createElement("div", { style: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 20, padding: 40, width: "100%", maxWidth: 400 } },
            React.createElement("div", { style: { textAlign: "center", marginBottom: 28 } },
              React.createElement("div", { style: { width: 42, height: 42, background: `linear-gradient(135deg,${v.accentColor},#38bdf8)`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 12px" } }, v.logoEmoji),
              React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "#fff" } }, v.productName)
            ),
            screen === "login" && React.createElement(React.Fragment, null,
              React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 4px" } }, "Welcome back"),
              React.createElement("p", { style: { fontSize: 13, color: "#555", margin: "0 0 24px" } }, "Sign in to your account"),
              React.createElement(Inp, { ph: "Email address" }),
              React.createElement(Inp, { ph: "Password", type: "password" }),
              React.createElement("div", { style: { textAlign: "right", marginBottom: 20 } },
                React.createElement("button", { onClick: () => setScreen("forgot"), style: { background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer" } }, "Forgot password?")
              ),
              React.createElement("button", { style: { width: "100%", background: v.accentColor, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10, display: "block" } }, "Sign In"),
              React.createElement("button", { style: { width: "100%", background: "transparent", color: "#555", border: "1px solid #1e1e1e", borderRadius: 8, padding: 12, fontSize: 13, cursor: "pointer", marginBottom: 20, display: "block" } }, "Continue with Google"),
              React.createElement("p", { style: { textAlign: "center", fontSize: 13, color: "#555", margin: 0 } },
                "No account? ",
                React.createElement("button", { onClick: () => setScreen("signup"), style: { background: "none", border: "none", color: v.accentColor, cursor: "pointer", fontSize: 13 } }, "Sign up free")
              )
            ),
            screen === "signup" && React.createElement(React.Fragment, null,
              React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 22px" } }, "Create account"),
              React.createElement(Inp, { ph: "Full name" }),
              React.createElement(Inp, { ph: "Email address" }),
              React.createElement(Inp, { ph: "Password", type: "password" }),
              React.createElement("button", { style: { width: "100%", background: v.accentColor, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 16, display: "block" } }, "Create Account"),
              React.createElement("p", { style: { textAlign: "center", fontSize: 13, color: "#555", margin: 0 } },
                "Have an account? ",
                React.createElement("button", { onClick: () => setScreen("login"), style: { background: "none", border: "none", color: v.accentColor, cursor: "pointer", fontSize: 13 } }, "Sign in")
              )
            ),
            screen === "forgot" && React.createElement(React.Fragment, null,
              React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 22px" } }, "Reset password"),
              React.createElement(Inp, { ph: "Email address" }),
              React.createElement("button", { style: { width: "100%", background: v.accentColor, color: "#000", border: "none", borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 16, display: "block" } }, "Send Reset Link"),
              React.createElement("p", { style: { textAlign: "center", fontSize: 13, color: "#555", margin: 0 } },
                React.createElement("button", { onClick: () => setScreen("login"), style: { background: "none", border: "none", color: v.accentColor, cursor: "pointer", fontSize: 13 } }, "← Back to login")
              )
            )
          )
        );
      },
      codeTemplate: (v) => `import { useState } from "react";

export default function AuthFlow() {
  const [screen, setScreen] = useState("login");

  const Inp = ({ ph, type }) => (
    <input type={type || "text"} placeholder={ph}
      style={{ width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "8px", color: "#fff", padding: "11px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }}
    />
  );

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg,${v.accentColor},#38bdf8)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", margin: "0 auto 12px" }}>
            ${v.logoEmoji}
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>${v.productName}</div>
        </div>
        {/* Login, Signup, Forgot screens - switch with useState */}
      </div>
    </div>
  );
}`,
    },
  ],

  dashboard: [
    {
      id: "d1",
      name: "SaaS Metrics Dashboard",
      vibe: "Dark & Minimal",
      difficulty: "Advanced",
      desc: "Full SaaS dashboard with sidebar, KPI cards, SVG revenue chart, activity feed.",
      vars: [
        { key: "productName", label: "Product Name", default: "Vibe OS" },
        { key: "currency",    label: "Currency",     default: "$" },
        { key: "accentColor", label: "Accent Color", default: "#00FFB2" },
      ],
      thumbnail: () => React.createElement("div", { style: { width: "100%", height: "100%", background: "#080808", padding: 7, display: "flex", flexDirection: "column", gap: 4 } },
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 } },
          ...[["MRR", "$8K"], ["Users", "1.2K"], ["Churn", "2.4%"], ["NPS", "68"]].map(([l, v]) =>
            React.createElement("div", { key: l, style: { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 5, padding: 4 } },
              React.createElement("div", { style: { fontSize: 6, color: "#444", marginBottom: 2 } }, l),
              React.createElement("div", { style: { fontSize: 9, fontWeight: 700, color: "#fff" } }, v)
            )
          )
        ),
        React.createElement("div", { style: { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 5, padding: 6, flex: 1 } },
          React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 2, height: 28 } },
            ...[30, 45, 35, 60, 50, 75, 55, 85, 70, 90, 80, 100].map((h, i) =>
              React.createElement("div", { key: i, style: { flex: 1, background: "linear-gradient(to top,#00ff88,#00ff8822)", borderRadius: "1px 1px 0 0", height: `${h}%` } })
            )
          )
        )
      ),
      component: (v) => function Dashboard() {
        const [range, setRange] = useState("30d");
        const data = [40, 55, 38, 70, 62, 80, 55, 88, 72, 95, 83, 100];
        const max = Math.max(...data);
        const W = 560, H = 100;
        const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"}${i * (W / (data.length - 1))},${H - 10 - (d / max) * (H - 20)}`).join(" ");
        return React.createElement("div", { style: { background: "#080808", minHeight: "100vh", display: "flex", fontFamily: "system-ui,sans-serif" } },
          React.createElement("div", { style: { width: 200, background: "#0d0d0d", borderRight: "1px solid #111", padding: "20px 12px", flexShrink: 0 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 28, paddingLeft: 4 } },
              React.createElement("div", { style: { width: 26, height: 26, background: `linear-gradient(135deg,${v.accentColor},#38bdf8)`, borderRadius: 6, flexShrink: 0 } }),
              React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "#fff" } }, v.productName)
            ),
            ...[["📊", "Dashboard"], ["📈", "Analytics"], ["👥", "Customers"], ["💳", "Billing"]].map(([icon, label], i) =>
              React.createElement("div", { key: label, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, marginBottom: 2, background: i === 0 ? "#1a1a1a" : "transparent", cursor: "pointer" } },
                React.createElement("span", { style: { fontSize: 14 } }, icon),
                React.createElement("span", { style: { fontSize: 13, color: i === 0 ? "#fff" : "#555" } }, label)
              )
            )
          ),
          React.createElement("div", { style: { flex: 1, padding: 24, overflowY: "auto" } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 } },
              React.createElement("div", null,
                React.createElement("h1", { style: { fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 } }, "Dashboard"),
                React.createElement("p", { style: { fontSize: 12, color: "#555", margin: "4px 0 0" } }, "Good morning, Moe 👋")
              ),
              React.createElement("button", { style: { background: v.accentColor, color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "+ New Report")
            ),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 } },
              ...[["MRR", `${v.currency}8,420`, "↑12%", true], ["Users", "1,284", "↑8%", true], ["Churn", "2.4%", "↑0.2%", false], ["NPS", "68", "↑4pts", true]].map(([label, value, trend, pos]) =>
                React.createElement("div", { key: String(label), style: { background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: "16px 18px" } },
                  React.createElement("div", { style: { fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 } }, label),
                  React.createElement("div", { style: { fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 } }, value),
                  React.createElement("div", { style: { fontSize: 12, color: pos ? v.accentColor : "#f87171" } }, String(trend))
                )
              )
            ),
            React.createElement("div", { style: { background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20 } },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
                React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#fff" } }, "Revenue Over Time"),
                React.createElement("div", { style: { display: "flex", gap: 4 } },
                  ...(["7d", "30d", "90d"] as const).map(r =>
                    React.createElement("button", { key: r, onClick: () => setRange(r), style: { background: range === r ? "#1e1e1e" : "transparent", border: `1px solid ${range === r ? "#333" : "transparent"}`, borderRadius: 6, color: range === r ? "#fff" : "#555", padding: "4px 10px", fontSize: 11, cursor: "pointer" } }, r)
                  )
                )
              ),
              React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: 100 } },
                React.createElement("defs", null,
                  React.createElement("linearGradient", { id: "rg", x1: "0", y1: "0", x2: "0", y2: "1" },
                    React.createElement("stop", { offset: "0%", stopColor: v.accentColor, stopOpacity: 0.3 }),
                    React.createElement("stop", { offset: "100%", stopColor: v.accentColor, stopOpacity: 0 })
                  )
                ),
                React.createElement("path", { d: `${pathD}L${W},${H} L0,${H} Z`, fill: "url(#rg)" }),
                React.createElement("path", { d: pathD, stroke: v.accentColor, strokeWidth: 2, fill: "none" })
              )
            )
          )
        );
      },
      codeTemplate: (v) => `import { useState } from "react";

export default function Dashboard() {
  const [range, setRange] = useState("30d");

  return (
    <div style={{ background: "#080808", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", background: "#0d0d0d", borderRight: "1px solid #111", padding: "20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <div style={{ width: "26px", height: "26px", background: "linear-gradient(135deg,${v.accentColor},#38bdf8)", borderRadius: "6px" }}/>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>${v.productName}</span>
        </div>
        {/* Nav items */}
      </div>
      {/* Main content with KPI cards, chart, activity feed */}
    </div>
  );
}`,
    },
  ],

  pricing: [],
  settings: [],
  email: [],
};

"use client";
import { useState } from "react";
import Link from "next/link";

const FEATURES = [
  { icon: "🧠", name: "Project Brain", color: "#00FFB2", desc: "Set up your project once. Every future session gets perfect context — no re-explaining ever again." },
  { icon: "✍️", name: "Prompt Architect", color: "#FF6B35", desc: "Describe what you want vaguely. Get a sharp, structured, production-ready prompt for Claude or Cursor." },
  { icon: "🗺️", name: "Build Ledger", color: "#A78BFA", desc: "Every decision you make is logged with reasoning. Ask why you chose anything, anytime." },
  { icon: "🔴", name: "Debug Translator", color: "#F43F5E", desc: "Paste any error. Get a plain-English explanation and the exact prompt to fix it — no code knowledge needed." },
  { icon: "🚀", name: "What's Next Engine", color: "#38BDF8", desc: "Tell it where you are. It tells you the next 3 most impactful things to build, prioritized like a YC partner." },
  { icon: "💡", name: "Platform Advisor", color: "#FBBF24", desc: "Audits your SaaS for gaps, missing features, and positioning opportunities you haven't thought of." },
  { icon: "⬡", name: "Element Forge", color: "#00FFB2", desc: "200+ stunning UI elements — each with a live preview and the exact AI prompt that generates it." },
];

const PRICING = [
  {
    name: "Free", monthlyPrice: 0, annualPrice: 0, period: "forever",
    features: ["1 project", "Project Brain", "10 element prompts/mo", "Community support"],
    cta: "Start Free", popular: false, color: "#333",
  },
  {
    name: "Pro", monthlyPrice: 29, annualPrice: 290, period: "month",
    features: ["Unlimited projects", "All 6 AI agents", "Full Element Forge", "AI prompt generator", "Priority support"],
    cta: "Get Pro", popular: true, color: "#00FFB2",
  },
  {
    name: "Founder", monthlyPrice: 79, annualPrice: 790, period: "month",
    features: ["Everything in Pro", "Team sharing", "Weekly AI audit", "Custom agents", "Early access"],
    cta: "Go Founder", popular: false, color: "#A78BFA",
  },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ background: "#070707", color: "#fff", fontFamily: "system-ui, sans-serif", minHeight: "100vh" }}>
      {/* ── NAVBAR ────────────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #111", background: "rgba(7,7,7,0.92)", backdropFilter: "blur(12px)", padding: "0 40px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>Vibe OS</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Features", "Pricing", "Element Forge"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{ color: "#555", fontSize: 13, textDecoration: "none", cursor: "pointer" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/sign-in" style={{ color: "#555", fontSize: 13, textDecoration: "none" }}>Sign in</Link>
          <Link href="/sign-up" style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Start Free →</Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px", position: "relative", backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(0,255,178,0.05) 0%,transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(0,255,178,0.08)", border: "1px solid rgba(0,255,178,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 11, color: "#00FFB2", marginBottom: 28, letterSpacing: "0.06em" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFB2", display: "inline-block" }} />
          The AI chief of staff for vibe coders
        </div>
        <h1 style={{ fontSize: "clamp(40px,6.5vw,76px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 20px", maxWidth: 800 }}>
          Stop re-explaining<br />your project.<br />
          <span style={{ color: "#00FFB2" }}>Start shipping.</span>
        </h1>
        <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
          7 AI agents that remember your project, sharpen your prompts, debug your errors, and tell you exactly what to build next.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          <Link href="/sign-up" style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 10, padding: "15px 36px", fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Start Free — No Credit Card →</Link>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "15px 28px", fontSize: 15, cursor: "pointer" }}>Watch 2-min Demo</button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["🧠 Never re-explain", "✍️ Perfect prompts", "🚀 Know what's next", "⬡ UI element library"].map(t => (
            <div key={t} style={{ fontSize: 13, color: "#333" }}>{t}</div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #0f0f0f", borderBottom: "1px solid #0f0f0f", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap", background: "#050505" }}>
        {["1,200+ founders", "$2.4M in SaaS shipped", "4.9★ average rating", "Built with Claude"].map(s => (
          <div key={s} style={{ fontSize: 12, color: "#333", letterSpacing: "0.04em" }}>{s}</div>
        ))}
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Everything you need</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>7 agents. One workspace.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.name} style={{ background: "#0d0d0d", border: "1px solid #151515", borderRadius: 14, padding: 24, transition: "border-color 0.2s", cursor: "default" }}
              onMouseOver={e => (e.currentTarget.style.borderColor = "#222")}
              onMouseOut={e => (e.currentTarget.style.borderColor = "#151515")}>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: f.color, marginBottom: 8 }}>{f.name}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section style={{ padding: "60px 40px", borderTop: "1px solid #0f0f0f", background: "#050505" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 40px" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
            {[["01", "Set up Project Brain", "Describe your SaaS once. Vibe OS remembers it forever."], ["02", "Get your context brief", "One click generates the perfect brief to paste into any AI session."], ["03", "Build with sharp prompts", "Prompt Architect turns vague ideas into precise, production-ready prompts."], ["04", "Ship faster than ever", "Debug Translator, What's Next Engine, and Element Forge keep you moving."]].map(([n, t, d]) => (
              <div key={n} style={{ textAlign: "left", padding: 20, background: "#0a0a0a", border: "1px solid #111", borderRadius: 12 }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#333", marginBottom: 10 }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 8, color: "#fff" }}>{t}</div>
                <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "80px 40px", maxWidth: 920, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px" }}>Simple, founder-friendly pricing</h2>
          <p style={{ color: "#444", fontSize: 16, marginBottom: 24 }}>No hidden fees. Cancel anytime.</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 5 }}>
            <button onClick={() => setAnnual(false)} style={{ background: !annual ? "#1e1e1e" : "transparent", border: "none", borderRadius: 7, color: !annual ? "#fff" : "#555", padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: !annual ? 600 : 400 }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ background: annual ? "#1e1e1e" : "transparent", border: "none", borderRadius: 7, color: annual ? "#fff" : "#555", padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: annual ? 600 : 400 }}>
              Annual <span style={{ background: "#00FFB2", color: "#000", borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>-20%</span>
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {PRICING.map(p => (
            <div key={p.name} style={{ background: "#111", border: `1px solid ${p.popular ? p.color : "#1e1e1e"}`, borderRadius: 16, padding: 28, position: "relative", textAlign: "left" }}>
              {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#00FFB2", color: "#000", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "12px 0 20px" }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: p.popular ? p.color : "#fff" }}>
                  ${p.monthlyPrice === 0 ? "0" : annual ? p.annualPrice : p.monthlyPrice}
                </span>
                <span style={{ fontSize: 13, color: "#555" }}>/{p.monthlyPrice === 0 ? "forever" : annual ? "year" : "month"}</span>
              </div>
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ color: p.popular ? "#00FFB2" : "#555", fontSize: 13, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: "#888" }}>{f}</span>
                </div>
              ))}
              <Link href="/sign-up" style={{ display: "block", width: "100%", marginTop: 20, background: p.popular ? "#00FFB2" : "transparent", color: p.popular ? "#000" : "#666", border: `1px solid ${p.popular ? "#00FFB2" : "#333"}`, borderRadius: 8, padding: 11, fontSize: 13, fontWeight: p.popular ? 700 : 400, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px", textAlign: "center", borderTop: "1px solid #0f0f0f", background: "#050505" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
          Ready to vibe code<br /><span style={{ color: "#00FFB2" }}>the right way?</span>
        </h2>
        <p style={{ color: "#444", fontSize: 16, marginBottom: 32 }}>Join 1,200+ founders shipping faster with Vibe OS.</p>
        <Link href="/sign-up" style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 10, padding: "16px 40px", fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Start Free — No Credit Card →</Link>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #0f0f0f", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>Vibe OS</span>
        </div>
        <div style={{ fontSize: 12, color: "#333" }}>© 2026 Vibe OS · Built for vibe coders</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: "#333", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

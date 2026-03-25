"use client";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";

/* ── Static data ─────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: "🧠", name: "Project Brain", color: "#00FFB2", desc: "Set up your project once. Every future session gets perfect context — no re-explaining ever again." },
  { icon: "✍️", name: "Prompt Architect", color: "#FF6B35", desc: "Describe what you want vaguely. Get a sharp, structured, production-ready prompt for Claude or Cursor." },
  { icon: "🗺️", name: "Build Ledger", color: "#A78BFA", desc: "Every decision you make is logged with reasoning. Ask why you chose anything, anytime." },
  { icon: "🔴", name: "Debug Translator", color: "#F43F5E", desc: "Paste any error. Get a plain-English explanation and the exact prompt to fix it." },
  { icon: "🚀", name: "What's Next Engine", color: "#38BDF8", desc: "Tell it where you are. It tells you the next 3 most impactful things to build, like a YC partner." },
  { icon: "💡", name: "Platform Advisor", color: "#FBBF24", desc: "Audits your SaaS for gaps, missing features, and positioning opportunities you haven't thought of." },
  { icon: "⬡", name: "Element Forge", color: "#00FFB2", desc: "200+ stunning UI elements — each with a live preview and the exact AI prompt that generates it." },
];

const PRICING = [
  {
    name: "Free", monthlyPrice: 0, annualPrice: 0,
    features: ["1 project", "Project Brain", "10 element prompts/mo", "Community support"],
    cta: "Start Free", popular: false, color: "#555",
  },
  {
    name: "Pro", monthlyPrice: 29, annualPrice: 290,
    features: ["Unlimited projects", "All 6 AI agents", "Full Element Forge", "AI prompt generator", "Priority support"],
    cta: "Get Pro", popular: true, color: "#00FFB2",
  },
  {
    name: "Founder", monthlyPrice: 79, annualPrice: 790,
    features: ["Everything in Pro", "Team sharing", "Weekly AI audit", "Custom agents", "Early access"],
    cta: "Go Founder", popular: false, color: "#A78BFA",
  },
];

const TESTIMONIALS = [
  {
    quote: "I used to spend 10 minutes re-explaining my project to Claude every single session. Vibe OS killed that completely.",
    name: "Alex Chen", role: "Founder, BuildFlow SaaS", avatar: "AC", color: "#00FFB2",
  },
  {
    quote: "The Prompt Architect alone is worth the subscription. My Claude outputs went from okay to genuinely production-ready.",
    name: "Sarah K.", role: "Solo Dev, RevenueKit", avatar: "SK", color: "#38BDF8",
  },
  {
    quote: "What's Next Engine saved me weeks of planning. It thinks like a product manager and a YC mentor at the same time.",
    name: "Marcus R.", role: "Founder, LaunchTrack", avatar: "MR", color: "#A78BFA",
  },
  {
    quote: "Element Forge is insane. I go from 'I need a pricing card' to a drop-in component in about 90 seconds.",
    name: "Priya M.", role: "Design Engineer, FormPilot", avatar: "PM", color: "#FBBF24",
  },
];

const TICKER_ITEMS = [
  "🧠 Project Brain", "✍️ Prompt Architect", "⬡ Element Forge", "🚀 What's Next Engine",
  "🗺️ Build Ledger", "🔴 Debug Translator", "💡 Platform Advisor", "🧠 Project Brain",
  "✍️ Prompt Architect", "⬡ Element Forge", "🚀 What's Next Engine", "🗺️ Build Ledger",
  "🔴 Debug Translator", "💡 Platform Advisor",
];

/* Fixed particle positions — no Math.random() to avoid hydration mismatch */
const PARTICLES = [
  { left: "8%",  top: "14%", size: 2,   delay: "0s",   dur: "13s", anim: "vibe-particle-1" },
  { left: "91%", top: "9%",  size: 1.5, delay: "2.1s", dur: "17s", anim: "vibe-particle-2" },
  { left: "23%", top: "72%", size: 1,   delay: "1s",   dur: "15s", anim: "vibe-particle-3" },
  { left: "76%", top: "55%", size: 2.5, delay: "3.4s", dur: "11s", anim: "vibe-particle-1" },
  { left: "50%", top: "88%", size: 1.5, delay: "0.5s", dur: "19s", anim: "vibe-particle-2" },
  { left: "38%", top: "22%", size: 1,   delay: "4s",   dur: "14s", anim: "vibe-particle-3" },
  { left: "65%", top: "78%", size: 2,   delay: "1.8s", dur: "16s", anim: "vibe-particle-1" },
  { left: "12%", top: "90%", size: 1.5, delay: "2.7s", dur: "12s", anim: "vibe-particle-2" },
  { left: "84%", top: "32%", size: 1,   delay: "0.3s", dur: "20s", anim: "vibe-particle-3" },
  { left: "55%", top: "46%", size: 2,   delay: "3s",   dur: "15s", anim: "vibe-particle-1" },
  { left: "29%", top: "60%", size: 1.5, delay: "1.5s", dur: "18s", anim: "vibe-particle-2" },
  { left: "72%", top: "18%", size: 1,   delay: "4.5s", dur: "13s", anim: "vibe-particle-3" },
];

/* ── App Mockup Component ──────────────────────────────────────────────── */

function AppMockup() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const lines = [
    "## Project Brief — VIbeOS SaaS",
    "",
    "**Stack**: Next.js 14 · Supabase · Stripe · Prisma",
    "",
    "**Core Modules**: Auth flow, Agent API, Billing,",
    "Element Forge, Build Ledger.",
    "",
    "**Current Sprint**: Shipping payment integration",
    "and onboarding improvements.",
    "",
    "**AI Context**: Always prioritize DX and",
    "conversion. No over-engineering.",
  ];

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < lines.length) {
        setTypedLines(prev => [...prev, lines[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 180);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      background: "#07070A",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 60px 140px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), 0 0 80px rgba(0,255,178,0.04)",
      position: "relative",
      maxWidth: 620,
      width: "100%",
    }}>
      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, rgba(0,255,178,0.4), transparent)",
        zIndex: 10, pointerEvents: "none",
        animation: "vibe-scan 4s ease-in-out infinite",
      }} />

      {/* Browser chrome */}
      <div style={{
        background: "#050507",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "12px 18px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{ display: "flex", gap: 7 }}>
          {["#ff5f56","#ffbd2e","#27c93f"].map(c => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 7, padding: "5px 12px",
          fontSize: 11, color: "rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ opacity: 0.4 }}>🔒</span>
          vibeos.app/dashboard
        </div>
        <div style={{ width: 18, height: 18, borderRadius: 5, background: "linear-gradient(135deg, #00FFB2, #38BDF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>⚡</div>
      </div>

      {/* App layout */}
      <div style={{ display: "flex", height: 340 }}>

        {/* Mini sidebar */}
        <div style={{
          width: 150, background: "#050507",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          padding: "12px 8px",
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 6px", marginBottom: 10 }}>
            <div style={{ width: 20, height: 20, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>⚡</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Vibe OS</span>
          </div>
          {/* Nav items */}
          {[
            { icon: "⬡", label: "Agents", active: true },
            { icon: "◈", label: "Element Forge", active: false },
            { icon: "⊞", label: "Templates", active: false },
            { icon: "◉", label: "Build Ledger", active: false },
            { icon: "◫", label: "Projects", active: false },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 8px", borderRadius: 7,
              background: item.active ? "rgba(0,255,178,0.06)" : "transparent",
              borderLeft: item.active ? "2px solid #00FFB2" : "2px solid transparent",
            }}>
              <span style={{ fontSize: 11, color: item.active ? "#00FFB2" : "rgba(255,255,255,0.25)" }}>{item.icon}</span>
              <span style={{ fontSize: 10, color: item.active ? "#fff" : "rgba(255,255,255,0.3)", fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
          {/* Usage bar at bottom */}
          <div style={{ marginTop: "auto", padding: "0 4px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>Usage 3/20</div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <div style={{ width: "15%", height: "100%", background: "linear-gradient(90deg,#00FFB2,#38BDF8)", borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* Agent panel */}
        <div style={{ width: 120, borderRight: "1px solid rgba(255,255,255,0.04)", padding: "10px 6px", display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em", paddingLeft: 4, marginBottom: 4 }}>AGENTS</div>
          {[
            { icon: "🧠", name: "Project Brain", color: "#00FFB2", active: true },
            { icon: "✍️", name: "Prompt Arch.", color: "#FF6B35", active: false },
            { icon: "🚀", name: "What's Next", color: "#38BDF8", active: false },
            { icon: "🔴", name: "Debug Trans.", color: "#F43F5E", active: false },
            { icon: "💡", name: "Advisor", color: "#FBBF24", active: false },
          ].map(a => (
            <div key={a.name} style={{
              background: a.active ? "rgba(0,0,0,0.5)" : "transparent",
              border: `1px solid ${a.active ? a.color + "35" : "transparent"}`,
              borderRadius: 7, padding: "6px 7px",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 11 }}>{a.icon}</span>
              <span style={{ fontSize: 9, color: a.active ? a.color : "rgba(255,255,255,0.3)", fontWeight: a.active ? 600 : 400 }}>{a.name}</span>
            </div>
          ))}
        </div>

        {/* Output panel */}
        <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Input area */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,255,178,0.15)",
            borderRadius: 8, padding: "8px 10px", fontSize: 10, color: "rgba(255,255,255,0.3)",
            lineHeight: 1.6,
          }}>
            Describe your SaaS project — stack, current sprint, goals, constraints...
            <span style={{ animation: "vibe-cursor 1s step-end infinite", marginLeft: 1, color: "#00FFB2" }}>|</span>
          </div>

          {/* Output */}
          <div style={{
            flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 8, padding: "10px 12px", overflow: "hidden",
            fontFamily: "monospace",
          }}>
            {typedLines.map((line, i) => (
              <div key={i} style={{
                fontSize: 10, lineHeight: 1.7,
                color: line.startsWith("##") ? "#fff" : line.startsWith("**") ? "#bbb" : "rgba(255,255,255,0.5)",
                fontWeight: line.startsWith("##") ? 700 : 400,
                animation: "vibe-slide-up-sm 0.2s ease both",
              }}>
                {line === "" ? "\u00A0" : line}
              </div>
            ))}
            {typedLines.length < 12 && (
              <span style={{ fontSize: 10, color: "#00FFB2", animation: "vibe-cursor 1s step-end infinite" }}>█</span>
            )}
          </div>

          {/* Run button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{
              background: "#00FFB2", color: "#000", fontSize: 9, fontWeight: 700,
              padding: "5px 12px", borderRadius: 6,
              boxShadow: "0 0 14px rgba(0,255,178,0.4)",
            }}>Run Brain →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SVG Hexagon Decoration ────────────────────────────────────────────── */
function HexBadge({ size = 80, color = "#00FFB2", opacity = 0.12, rotate = 0, style = {} }: {
  size?: number; color?: string; opacity?: number; rotate?: number; style?: CSSProperties;
}) {
  const h = size * 1.1547;
  const pts = [
    [size/2, 0], [size, h*0.25], [size, h*0.75],
    [size/2, h], [0, h*0.75], [0, h*0.25],
  ].map(p => p.join(",")).join(" ");
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      <polygon points={pts} fill="none" stroke={color} strokeWidth="1" opacity={opacity} />
      <polygon points={pts} fill={color} opacity={opacity * 0.15} />
    </svg>
  );
}

/* ── Circuit node SVG ──────────────────────────────────────────────────── */
let _cdgCounter = 0;
function CircuitDots({ color = "#00FFB2" }: { color?: string }) {
  const gradId = `cdg-${++_cdgCounter}`;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ opacity: 0.07 }}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {[[20,20],[80,20],[140,20],[200,20],[20,80],[80,80],[140,80],[200,80],
        [20,140],[80,140],[140,140],[200,140],[20,200],[80,200],[140,200],[200,200]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill={`url(#${gradId})`} />
      ))}
      <line x1="20" y1="20" x2="200" y2="20" stroke={color} strokeWidth="0.5" />
      <line x1="20" y1="80" x2="200" y2="80" stroke={color} strokeWidth="0.5" />
      <line x1="20" y1="20" x2="20" y2="200" stroke={color} strokeWidth="0.5" />
      <line x1="80" y1="20" x2="80" y2="200" stroke={color} strokeWidth="0.5" />
      <line x1="140" y1="20" x2="140" y2="80" stroke={color} strokeWidth="0.5" />
      <line x1="140" y1="140" x2="140" y2="200" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vibe-visible"); }),
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".vibe-reveal, .vibe-reveal-left, .vibe-reveal-right")
      .forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#030305", color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ═══════════════════════════════════════
          GLOBAL BACKGROUND
          ═══════════════════════════════════════ */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: "-30%", left: "-15%", width: "75vw", height: "75vw", background: "radial-gradient(ellipse, rgba(0,255,178,0.075) 0%, transparent 65%)", animation: "vibe-orb-drift 22s ease-in-out infinite", filter: "blur(70px)" }} />
        <div style={{ position: "absolute", top: "10%", right: "-25%", width: "65vw", height: "65vw", background: "radial-gradient(ellipse, rgba(56,189,248,0.055) 0%, transparent 65%)", animation: "vibe-orb-drift-2 28s ease-in-out infinite", filter: "blur(70px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "20%", width: "50vw", height: "50vw", background: "radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 65%)", animation: "vibe-orb-drift 35s ease-in-out infinite reverse", filter: "blur(80px)" }} />

        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)", backgroundSize: "38px 38px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)" }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: "absolute", left: p.left, top: p.top,
            width: p.size, height: p.size, borderRadius: "50%",
            background: i % 3 === 0 ? "#00FFB2" : i % 3 === 1 ? "#38BDF8" : "#A78BFA",
            boxShadow: `0 0 ${p.size * 3}px currentColor`,
            animation: `${p.anim} ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }} />
        ))}

        {/* Subtle horizontal beam (sweeps every ~8s) */}
        <div style={{
          position: "absolute", top: "35%", left: 0,
          width: "30%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,255,178,0.4), transparent)",
          animation: "vibe-beam 8s ease-in-out infinite",
          animationDelay: "2s",
        }} />
        <div style={{
          position: "absolute", top: "60%", left: 0,
          width: "20%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent)",
          animation: "vibe-beam 10s ease-in-out infinite",
          animationDelay: "6s",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ═══════════════════════════════════════
            NAVBAR
            ═══════════════════════════════════════ */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          padding: "0 48px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(3,3,5,0.92)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          transition: "all 0.35s ease",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 34, height: 34 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,255,178,0.15)", animation: "vibe-ring-pulse 2s ease-out infinite" }} />
              <div style={{
                position: "relative", width: 34, height: 34,
                background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
                borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, boxShadow: "0 0 22px rgba(0,255,178,0.35)",
              }}>⚡</div>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.03em" }}>Vibe OS</span>
          </div>

          <div style={{ display: "flex", gap: 36 }}>
            {["Features", "Pricing"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none", transition: "color 0.2s", fontWeight: 500 }}
                onMouseOver={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}>
                {l}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/sign-in"
              style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
              onMouseOver={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}>
              Sign in
            </Link>
            <Link href="/sign-up" className="vibe-btn-primary" style={{ padding: "9px 20px", fontSize: 13, borderRadius: 9 }}>
              Start Free →
            </Link>
          </div>
        </nav>

        {/* ═══════════════════════════════════════
            HERO
            ═══════════════════════════════════════ */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "60px 24px 0",
          position: "relative",
        }}>
          {/* Floating hex decorations */}
          <div style={{ position: "absolute", top: "12%", left: "6%", animation: "vibe-float-gentle 8s ease-in-out infinite" }}>
            <HexBadge size={70} color="#00FFB2" opacity={0.18} rotate={15} />
          </div>
          <div style={{ position: "absolute", top: "18%", right: "7%", animation: "vibe-float-gentle 11s ease-in-out infinite", animationDelay: "2s" }}>
            <HexBadge size={50} color="#38BDF8" opacity={0.14} rotate={-10} />
          </div>
          <div style={{ position: "absolute", top: "55%", left: "3%", animation: "vibe-float-gentle 9s ease-in-out infinite", animationDelay: "4s" }}>
            <HexBadge size={36} color="#A78BFA" opacity={0.2} rotate={30} />
          </div>
          <div style={{ position: "absolute", top: "40%", right: "4%", animation: "vibe-float-gentle 12s ease-in-out infinite", animationDelay: "1s" }}>
            <HexBadge size={55} color="#FBBF24" opacity={0.12} rotate={-25} />
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,255,178,0.05)", border: "1px solid rgba(0,255,178,0.18)",
            borderRadius: 24, padding: "6px 16px",
            fontSize: 11, color: "#00FFB2",
            marginBottom: 32, letterSpacing: "0.08em", fontWeight: 600,
            animation: "vibe-slide-up 0.55s ease both",
            boxShadow: "0 0 28px rgba(0,255,178,0.07)",
          }}>
            <span className="vibe-dot-pulse" />
            The AI chief of staff for vibe coders
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(44px, 7.5vw, 90px)",
            fontWeight: 800, lineHeight: 0.96,
            letterSpacing: "-0.046em",
            margin: "0 0 26px", maxWidth: 900,
            animation: "vibe-slide-up 0.55s ease 0.1s both",
          }}>
            Stop re-explaining<br />your project.{" "}
            <span className="vibe-gradient-text">Start shipping.</span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2vw, 19px)",
            color: "rgba(255,255,255,0.36)",
            lineHeight: 1.78, maxWidth: 520,
            margin: "0 auto 44px",
            animation: "vibe-slide-up 0.55s ease 0.18s both",
          }}>
            7 AI agents that remember your project, sharpen your prompts,
            debug your errors, and tell you exactly what to build next.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 64,
            animation: "vibe-slide-up 0.55s ease 0.26s both",
          }}>
            <Link href="/sign-up" className="vibe-btn-primary" style={{ padding: "16px 38px", fontSize: 15, borderRadius: 12 }}>
              Start Free — No Credit Card →
            </Link>
            <button className="vibe-btn-ghost" style={{ padding: "16px 28px", fontSize: 15, borderRadius: 12 }}>
              Watch 2-min Demo
            </button>
          </div>

          {/* App mockup */}
          <div style={{
            width: "100%", maxWidth: 720,
            animation: "vibe-slide-up 0.7s ease 0.4s both",
            position: "relative",
          }}>
            {/* Glow beneath mockup */}
            <div style={{
              position: "absolute", bottom: -60, left: "10%", right: "10%", height: 100,
              background: "radial-gradient(ellipse, rgba(0,255,178,0.14) 0%, transparent 70%)",
              filter: "blur(30px)", pointerEvents: "none",
            }} />
            <AppMockup />
          </div>

          {/* 3D Grid floor */}
          <div className="vibe-grid-3d" style={{ left: 0, right: 0 }}>
            <div className="vibe-grid-3d-inner" />
          </div>
        </section>

        {/* ═══════════════════════════════════════
            TICKER
            ═══════════════════════════════════════ */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "16px 0", overflow: "hidden",
          background: "rgba(255,255,255,0.01)",
        }}>
          <div className="vibe-marquee-track">
            {TICKER_ITEMS.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 12, color: "rgba(255,255,255,0.22)",
                fontWeight: 500, whiteSpace: "nowrap", padding: "0 8px",
              }}>
                {item}
                <span style={{ color: "rgba(0,255,178,0.2)", margin: "0 8px" }}>·</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            STATS
            ═══════════════════════════════════════ */}
        <div style={{ padding: "60px 48px", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
            {[
              { val: "1,200+", label: "Founders", color: "#00FFB2" },
              { val: "$2.4M", label: "SaaS Shipped", color: "#38BDF8" },
              { val: "4.9★", label: "Avg Rating", color: "#A78BFA" },
              { val: "7", label: "AI Agents", color: "#FBBF24" },
            ].map((s, i) => (
              <div key={i} className={`vibe-reveal vibe-reveal-delay-${i + 1}`}
                style={{
                  textAlign: "center", padding: "32px 20px",
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: i === 0 ? "14px 0 0 14px" : i === 3 ? "0 14px 14px 0" : "0",
                  position: "relative", overflow: "hidden",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLElement).style.background = `${s.color}08`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${s.color}20`;
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                }}>
                <div style={{
                  fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800,
                  letterSpacing: "-0.04em", lineHeight: 1, color: s.color,
                  textShadow: `0 0 30px ${s.color}44`,
                }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 7, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            FEATURES
            ═══════════════════════════════════════ */}
        <section id="features" style={{ padding: "80px 48px", maxWidth: 1160, margin: "0 auto" }}>
          <div className="vibe-reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 10, color: "rgba(0,255,178,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>EVERYTHING YOU NEED</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 14px" }}>
              7 agents. <span className="vibe-gradient-text-gb">One workspace.</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
              Each agent is specialized. Together they cover everything a solo founder needs.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(296px, 1fr))", gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.name}
                className={`vibe-feature-card vibe-reveal vibe-reveal-delay-${Math.min(i + 1, 5)}`}
                onMouseOver={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${f.color}26`;
                  el.style.boxShadow = `0 24px 60px rgba(0,0,0,0.45), 0 0 50px ${f.color}0c`;
                  el.style.background = `radial-gradient(ellipse at 40% 0%, ${f.color}10 0%, rgba(8,8,10,0.85) 65%)`;
                }}
                onMouseOut={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.04)";
                  el.style.boxShadow = "none";
                  el.style.background = "rgba(8,8,10,0.85)";
                }}>
                <div className="vibe-shine" />

                {/* Icon container with pulsing ring */}
                <div style={{ position: "relative", width: 50, height: 50, marginBottom: 18 }}>
                  <div style={{
                    position: "absolute", inset: -4,
                    borderRadius: 16, border: `1px solid ${f.color}20`,
                    animation: "vibe-border-breathe 3s ease-in-out infinite",
                  }} />
                  <div style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: `linear-gradient(135deg, ${f.color}14, ${f.color}06)`,
                    border: `1px solid ${f.color}1e`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                    boxShadow: `0 0 24px ${f.color}14`,
                  }}>{f.icon}</div>
                </div>

                <div style={{ fontWeight: 700, fontSize: "0.93rem", color: f.color, marginBottom: 9 }}>{f.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", lineHeight: 1.78 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            HOW IT WORKS (with connecting line)
            ═══════════════════════════════════════ */}
        <section style={{
          padding: "88px 48px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(255,255,255,0.008)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Corner circuit decoration */}
          <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.6 }}>
            <CircuitDots color="#00FFB2" />
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.4 }}>
            <CircuitDots color="#38BDF8" />
          </div>

          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            <div className="vibe-reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontSize: 10, color: "rgba(0,255,178,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>WORKFLOW</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 46px)", fontWeight: 800, letterSpacing: "-0.035em", margin: 0 }}>How it works</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
              {/* Connecting line */}
              <div style={{
                position: "absolute", top: 28, left: "12.5%", right: "12.5%", height: 1,
                background: "linear-gradient(90deg, #00FFB2, #38BDF8, #A78BFA, #FBBF24)",
                opacity: 0.25,
              }} />

              {([
                ["01", "Set up Project Brain", "Describe your SaaS once. Remembered forever.", "#00FFB2"],
                ["02", "Get context brief", "One click generates the perfect brief for any AI.", "#38BDF8"],
                ["03", "Sharp prompts", "Prompt Architect turns vague ideas into precise prompts.", "#A78BFA"],
                ["04", "Ship faster", "Debug Translator and What's Next keep you moving.", "#FBBF24"],
              ] as const).map(([n, t, d, c], i) => (
                <div key={n} className={`vibe-reveal vibe-reveal-delay-${i + 1}`}
                  style={{ padding: "0 20px", textAlign: "center" }}>
                  {/* Step circle */}
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: `${c}10`, border: `1px solid ${c}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: 11, fontWeight: 800, color: c,
                    fontFamily: "monospace", letterSpacing: "0.05em",
                    boxShadow: `0 0 20px ${c}18`,
                    position: "relative", zIndex: 1,
                  }}>{n}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{t}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.7 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            TESTIMONIALS
            ═══════════════════════════════════════ */}
        <section style={{ padding: "88px 48px", maxWidth: 1100, margin: "0 auto" }}>
          <div className="vibe-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 10, color: "rgba(0,255,178,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>LOVED BY FOUNDERS</div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.035em", margin: 0 }}>
              What founders are saying
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`vibe-testimonial vibe-reveal vibe-reveal-delay-${i + 1}`}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: "#FBBF24", fontSize: 12 }}>★</span>
                  ))}
                </div>
                {/* Quote */}
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: `${t.color}14`, border: `1.5px solid ${t.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: t.color, flexShrink: 0,
                    boxShadow: `0 0 14px ${t.color}18`,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            PRICING
            ═══════════════════════════════════════ */}
        <section id="pricing" style={{
          padding: "88px 48px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(255,255,255,0.008)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Hex decoration */}
          <div style={{ position: "absolute", top: 40, right: 60, animation: "vibe-hex-spin 30s linear infinite", opacity: 0.6 }}>
            <HexBadge size={120} color="#00FFB2" opacity={0.07} />
          </div>
          <div style={{ position: "absolute", bottom: 40, left: 80, animation: "vibe-hex-spin-rev 20s linear infinite", opacity: 0.6 }}>
            <HexBadge size={80} color="#A78BFA" opacity={0.09} />
          </div>

          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div className="vibe-reveal" style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontSize: 10, color: "rgba(0,255,178,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>PRICING</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 12px" }}>Simple, founder-friendly pricing</h2>
              <p style={{ color: "rgba(255,255,255,0.26)", fontSize: 15, marginBottom: 28 }}>No hidden fees. Cancel anytime.</p>

              {/* Toggle */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 4 }}>
                {([["Monthly", false], ["Annual", true]] as const).map(([label, val]) => (
                  <button key={label} onClick={() => setAnnual(val)} style={{
                    background: annual === val ? "rgba(255,255,255,0.08)" : "transparent",
                    border: "none", borderRadius: 9,
                    color: annual === val ? "#fff" : "rgba(255,255,255,0.3)",
                    padding: "8px 20px", fontSize: 13, cursor: "pointer",
                    fontWeight: annual === val ? 600 : 400, transition: "all 0.2s ease",
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {label}
                    {label === "Annual" && <span style={{ background: "#00FFB2", color: "#000", borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 6 }}>-20%</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {PRICING.map((p, i) => (
                <div key={p.name}
                  className={`vibe-reveal vibe-reveal-delay-${i + 1}`}
                  style={{
                    background: p.popular ? "rgba(0,255,178,0.03)" : "rgba(255,255,255,0.015)",
                    border: p.popular ? "1px solid rgba(0,255,178,0.28)" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 18, padding: "30px 26px",
                    position: "relative",
                    boxShadow: p.popular ? "0 0 80px rgba(0,255,178,0.07), inset 0 1px 0 rgba(0,255,178,0.1)" : "none",
                    transition: "transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s ease",
                    animation: p.popular ? "vibe-border-breathe 3s ease-in-out infinite" : "none",
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = p.popular ? "0 30px 80px rgba(0,255,178,0.16)" : "0 30px 60px rgba(0,0,0,0.5)";
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = p.popular ? "0 0 80px rgba(0,255,178,0.07), inset 0 1px 0 rgba(0,255,178,0.1)" : "none";
                  }}>
                  {p.popular && (
                    <div style={{
                      position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(90deg, #00FFB2, #38BDF8)",
                      color: "#000", fontSize: 10, fontWeight: 800,
                      padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.1em",
                    }}>MOST POPULAR</div>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.popular ? "#00FFB2" : "rgba(255,255,255,0.5)", marginBottom: 5 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "14px 0 24px" }}>
                    <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.05em", color: "#fff" }}>
                      ${p.monthlyPrice === 0 ? "0" : annual ? p.annualPrice : p.monthlyPrice}
                    </span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.22)" }}>/{p.monthlyPrice === 0 ? "forever" : annual ? "year" : "month"}</span>
                  </div>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 9, marginBottom: 11 }}>
                      <span style={{ color: p.popular ? "#00FFB2" : "rgba(255,255,255,0.22)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.47)" }}>{f}</span>
                    </div>
                  ))}
                  <Link href="/sign-up" style={{
                    display: "block", width: "100%", marginTop: 24,
                    background: p.popular ? "#00FFB2" : "rgba(255,255,255,0.04)",
                    color: p.popular ? "#000" : "rgba(255,255,255,0.38)",
                    border: `1px solid ${p.popular ? "#00FFB2" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 10, padding: "12px 0", fontSize: 13,
                    fontWeight: p.popular ? 700 : 500,
                    cursor: "pointer", textAlign: "center", textDecoration: "none",
                    transition: "all 0.18s ease", boxSizing: "border-box",
                    boxShadow: p.popular ? "0 4px 20px rgba(0,255,178,0.3)" : "none",
                  }}
                    onMouseOver={e => { if (!p.popular) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}}
                    onMouseOut={e => { if (!p.popular) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}}>
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FINAL CTA
            ═══════════════════════════════════════ */}
        <section style={{
          padding: "110px 48px", textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Glow orb */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "70vw", height: "70vw", background: "radial-gradient(ellipse, rgba(0,255,178,0.05) 0%, transparent 55%)", pointerEvents: "none", filter: "blur(60px)" }} />
          {/* Side hexagons */}
          <div style={{ position: "absolute", left: 80, top: "50%", transform: "translateY(-50%)", animation: "vibe-float-gentle 9s ease-in-out infinite" }}>
            <HexBadge size={100} color="#00FFB2" opacity={0.1} rotate={20} />
          </div>
          <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", animation: "vibe-float-gentle 11s ease-in-out infinite", animationDelay: "3s" }}>
            <HexBadge size={80} color="#38BDF8" opacity={0.09} rotate={-15} />
          </div>

          <div className="vibe-reveal" style={{ position: "relative" }}>
            <h2 style={{ fontSize: "clamp(30px, 5vw, 62px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 16px", lineHeight: 1.0 }}>
              Ready to vibe code<br />
              <span className="vibe-gradient-text">the right way?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.26)", fontSize: 15, marginBottom: 38 }}>Join 1,200+ founders shipping faster with Vibe OS.</p>
            <Link href="/sign-up" className="vibe-btn-primary" style={{ padding: "18px 48px", fontSize: 16, borderRadius: 14 }}>
              Start Free — No Credit Card →
            </Link>
            <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.18)" }}>No credit card required · Cancel anytime</div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════ */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, background: "linear-gradient(135deg, #00FFB2, #38BDF8)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, boxShadow: "0 0 14px rgba(0,255,178,0.3)" }}>⚡</div>
            <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>Vibe OS</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.14)" }}>© 2026 Vibe OS · Built for vibe coders</div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <a key={l} href="#"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseOver={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}>
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

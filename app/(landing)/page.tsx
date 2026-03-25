"use client";
import { useState, useEffect } from "react";
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

const STATS = [
  { value: "1,200+", label: "Founders" },
  { value: "$2.4M", label: "SaaS Shipped" },
  { value: "4.9★", label: "Avg Rating" },
  { value: "7", label: "AI Agents" },
];

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
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vibe-visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".vibe-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#030305", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── AMBIENT BACKGROUND ─────────────────────────────── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {/* Green orb */}
        <div style={{
          position: "absolute", top: "-30%", left: "-15%",
          width: "80vw", height: "80vw",
          background: "radial-gradient(ellipse, rgba(0,255,178,0.07) 0%, transparent 65%)",
          animation: "vibe-orb-drift 22s ease-in-out infinite",
          filter: "blur(60px)",
        }} />
        {/* Blue orb */}
        <div style={{
          position: "absolute", top: "5%", right: "-25%",
          width: "70vw", height: "70vw",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.055) 0%, transparent 65%)",
          animation: "vibe-orb-drift-2 28s ease-in-out infinite",
          filter: "blur(60px)",
        }} />
        {/* Purple orb bottom */}
        <div style={{
          position: "absolute", bottom: "-10%", left: "25%",
          width: "55vw", height: "55vw",
          background: "radial-gradient(ellipse, rgba(167,139,250,0.045) 0%, transparent 65%)",
          animation: "vibe-orb-drift 34s ease-in-out infinite reverse",
          filter: "blur(70px)",
        }} />
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage: "radial-gradient(ellipse 75% 75% at 50% 30%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 30%, black 30%, transparent 100%)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── NAVBAR ─────────────────────────────────────────── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          padding: "0 48px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(3,3,5,0.9)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          transition: "all 0.35s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
              borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 800,
              boxShadow: "0 0 24px rgba(0,255,178,0.35)",
            }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.03em" }}>Vibe OS</span>
          </div>
          <div style={{ display: "flex", gap: 36 }}>
            {["Features", "Pricing", "Element Forge"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
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

        {/* ── HERO ───────────────────────────────────────────── */}
        <section style={{
          minHeight: "92vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "60px 24px 80px",
        }}>
          {/* Announcement badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,255,178,0.05)",
            border: "1px solid rgba(0,255,178,0.18)",
            borderRadius: 24, padding: "6px 16px",
            fontSize: 11, color: "#00FFB2",
            marginBottom: 36, letterSpacing: "0.07em", fontWeight: 600,
            animation: "vibe-slide-up 0.55s ease both",
            boxShadow: "0 0 28px rgba(0,255,178,0.07)",
          }}>
            <span className="vibe-dot-pulse" />
            The AI chief of staff for vibe coders
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(44px, 7.5vw, 88px)",
            fontWeight: 800, lineHeight: 0.97,
            letterSpacing: "-0.045em",
            margin: "0 0 26px", maxWidth: 880,
            animation: "vibe-slide-up 0.55s ease 0.1s both",
          }}>
            Stop re-explaining<br />your project.{" "}
            <span className="vibe-gradient-text">Start shipping.</span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2vw, 19px)",
            color: "rgba(255,255,255,0.36)",
            lineHeight: 1.78, maxWidth: 510,
            margin: "0 auto 46px",
            animation: "vibe-slide-up 0.55s ease 0.18s both",
          }}>
            7 AI agents that remember your project, sharpen your prompts,
            debug your errors, and tell you exactly what to build next.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap",
            justifyContent: "center", marginBottom: 56,
            animation: "vibe-slide-up 0.55s ease 0.26s both",
          }}>
            <Link href="/sign-up" className="vibe-btn-primary" style={{ padding: "16px 38px", fontSize: 15, borderRadius: 12 }}>
              Start Free — No Credit Card →
            </Link>
            <button className="vibe-btn-ghost" style={{ padding: "16px 28px", fontSize: 15, borderRadius: 12 }}>
              Watch 2-min Demo
            </button>
          </div>

          {/* Feature pills */}
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
            animation: "vibe-fade-in 1s ease 0.5s both",
          }}>
            {["🧠 Never re-explain", "✍️ Perfect prompts", "🚀 Know what's next", "⬡ UI library"].map(t => (
              <div key={t} style={{
                fontSize: 12, color: "rgba(255,255,255,0.22)",
                padding: "5px 14px", borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.06)",
                letterSpacing: "0.01em",
              }}>{t}</div>
            ))}
          </div>
        </section>

        {/* ── STATS STRIP ────────────────────────────────────── */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "32px 48px",
          background: "rgba(255,255,255,0.012)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 72, flexWrap: "wrap", maxWidth: 900, margin: "0 auto",
          }}>
            {STATS.map((s, i) => (
              <div key={i} className="vibe-reveal" style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800,
                  letterSpacing: "-0.035em", lineHeight: 1,
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.55) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ───────────────────────────────────────── */}
        <section id="features" style={{ padding: "100px 48px", maxWidth: 1160, margin: "0 auto" }}>
          <div className="vibe-reveal" style={{ textAlign: "center", marginBottom: 68 }}>
            <div style={{ fontSize: 10, color: "rgba(0,255,178,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>EVERYTHING YOU NEED</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 14px" }}>7 agents. One workspace.</h2>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
              Each agent is specialized. Together, they cover everything a solo founder needs to move fast.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(294px, 1fr))", gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.name}
                className={`vibe-feature-card vibe-reveal vibe-reveal-delay-${Math.min(i + 1, 5)}`}
                style={{ "--card-glow": `${f.color}14` } as React.CSSProperties}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = `${f.color}28`;
                  e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.45), 0 0 50px ${f.color}0e`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: `${f.color}0d`, border: `1px solid ${f.color}1e`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 21, marginBottom: 18,
                  boxShadow: `0 0 20px ${f.color}12`,
                }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.93rem", color: f.color, marginBottom: 9, letterSpacing: "-0.01em" }}>{f.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.33)", lineHeight: 1.78 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────── */}
        <section style={{
          padding: "88px 48px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(255,255,255,0.01)",
        }}>
          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            <div className="vibe-reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ fontSize: 10, color: "rgba(0,255,178,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>SIMPLE WORKFLOW</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.035em", margin: 0 }}>How it works</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 1 }}>
              {([
                ["01", "Set up Project Brain", "Describe your SaaS once. Vibe OS remembers it forever."],
                ["02", "Get your context brief", "One click generates the perfect brief for any AI session."],
                ["03", "Build with sharp prompts", "Prompt Architect turns vague ideas into precise prompts."],
                ["04", "Ship faster than ever", "Debug Translator and What's Next keep you moving."],
              ] as const).map(([n, t, d], i) => (
                <div
                  key={n}
                  className={`vibe-reveal vibe-reveal-delay-${i + 1}`}
                  style={{
                    padding: "30px 26px",
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: i === 0 ? "14px 0 0 14px" : i === 3 ? "0 14px 14px 0" : "0",
                    transition: "background 0.2s ease",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,0.015)")}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#00FFB2", marginBottom: 16, fontWeight: 700, letterSpacing: "0.05em", opacity: 0.65 }}>{n}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 9, color: "#fff", lineHeight: 1.35 }}>{t}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.27)", lineHeight: 1.7 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ────────────────────────────────────────── */}
        <section id="pricing" style={{ padding: "100px 48px", maxWidth: 980, margin: "0 auto" }}>
          <div className="vibe-reveal" style={{ textAlign: "center", marginBottom: 58 }}>
            <div style={{ fontSize: 10, color: "rgba(0,255,178,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>PRICING</div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.035em", margin: "0 0 12px" }}>Simple, founder-friendly pricing</h2>
            <p style={{ color: "rgba(255,255,255,0.26)", fontSize: 15, marginBottom: 30 }}>No hidden fees. Cancel anytime.</p>
            {/* Toggle */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: 4,
            }}>
              {([["Monthly", false], ["Annual", true]] as const).map(([label, val]) => (
                <button key={label} onClick={() => setAnnual(val)} style={{
                  background: annual === val ? "rgba(255,255,255,0.08)" : "transparent",
                  border: "none", borderRadius: 9,
                  color: annual === val ? "#fff" : "rgba(255,255,255,0.3)",
                  padding: "8px 20px", fontSize: 13, cursor: "pointer",
                  fontWeight: annual === val ? 600 : 400,
                  transition: "all 0.2s ease",
                  fontFamily: "system-ui, sans-serif",
                }}>
                  {label}
                  {label === "Annual" && (
                    <span style={{
                      background: "#00FFB2", color: "#000",
                      borderRadius: 4, padding: "1px 6px",
                      fontSize: 10, fontWeight: 700, marginLeft: 6,
                    }}>-20%</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {PRICING.map((p, i) => (
              <div
                key={p.name}
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
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = p.popular ? "0 28px 80px rgba(0,255,178,0.14)" : "0 28px 60px rgba(0,0,0,0.5)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = p.popular ? "0 0 80px rgba(0,255,178,0.07), inset 0 1px 0 rgba(0,255,178,0.1)" : "none";
                }}>
                {p.popular && (
                  <div style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(90deg, #00FFB2, #38BDF8)",
                    color: "#000", fontSize: 10, fontWeight: 800,
                    padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap",
                    letterSpacing: "0.1em",
                  }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 600, color: p.popular ? "#00FFB2" : "rgba(255,255,255,0.5)", marginBottom: 5 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "14px 0 24px" }}>
                  <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.045em", color: "#fff" }}>
                    ${p.monthlyPrice === 0 ? "0" : annual ? p.annualPrice : p.monthlyPrice}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.22)" }}>
                    /{p.monthlyPrice === 0 ? "forever" : annual ? "year" : "month"}
                  </span>
                </div>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 9, marginBottom: 11, alignItems: "flex-start" }}>
                    <span style={{ color: p.popular ? "#00FFB2" : "rgba(255,255,255,0.2)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.48)" }}>{f}</span>
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
                  transition: "all 0.18s ease",
                  boxSizing: "border-box",
                  boxShadow: p.popular ? "0 4px 20px rgba(0,255,178,0.28)" : "none",
                }}
                  onMouseOver={e => {
                    if (!p.popular) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    }
                  }}
                  onMouseOut={e => {
                    if (!p.popular) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.38)";
                    }
                  }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────────────────── */}
        <section style={{
          padding: "110px 48px", textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw", height: "70vw",
            background: "radial-gradient(ellipse, rgba(0,255,178,0.045) 0%, transparent 55%)",
            pointerEvents: "none", filter: "blur(60px)",
          }} />
          <div className="vibe-reveal" style={{ position: "relative" }}>
            <h2 style={{ fontSize: "clamp(30px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 16px", lineHeight: 1.0 }}>
              Ready to vibe code<br />
              <span className="vibe-gradient-text">the right way?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.26)", fontSize: 15, marginBottom: 38 }}>Join 1,200+ founders shipping faster with Vibe OS.</p>
            <Link href="/sign-up" className="vibe-btn-primary" style={{ padding: "18px 48px", fontSize: 16, borderRadius: 14 }}>
              Start Free — No Credit Card →
            </Link>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "28px 48px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
          background: "rgba(0,0,0,0.25)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #00FFB2, #38BDF8)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>⚡</div>
            <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>Vibe OS</span>
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

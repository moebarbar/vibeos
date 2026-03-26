import React from "react";
import { NEW_ELEMENTS } from "./elements-new";

export interface Element {
  id: string;
  name: string;
  vibe: string;
  difficulty: "Simple" | "Medium" | "Advanced";
  desc: string;
  prompt: string;
  code: string;
  preview: React.FC;
}

export const VIBES = ["All", "Dark & Minimal", "Glassmorphism", "Brutalist", "Soft & Pastel", "Neon & Cyber"];

export const CATEGORIES = [
  { id: "buttons",     label: "Buttons & CTAs",   icon: "⬡" },
  { id: "cards",       label: "Cards & Pricing",   icon: "▣" },
  { id: "hero",        label: "Hero Sections",     icon: "◈" },
  { id: "nav",         label: "Navigation",        icon: "≡" },
  { id: "forms",       label: "Forms & Inputs",    icon: "▤" },
  { id: "dashboards",  label: "Dashboards",        icon: "◫" },
  { id: "backgrounds", label: "Backgrounds",       icon: "◱" },
];

export const ELEMENTS: Record<string, Element[]> = {
  buttons: [
    // New Creative Buttons
    ...NEW_ELEMENTS.buttons,
    {
      id: "btn-neon",
      name: "Neon Glow CTA",
      vibe: "Neon & Cyber",
      difficulty: "Simple",
      desc: "Pulsing neon green button with glow animation on hover.",
      prompt: `Create a React button component with a neon green glow effect. Style: dark background #0a0a0a, bright green text #00ff88, box-shadow glow that pulses on hover using CSS keyframe animation (0 0 12px #00ff8855 at rest, 0 0 28px #00ff88aa on hover), border 1px solid #00ff88, border-radius 6px, font-family monospace, padding 12px 28px, letter-spacing 0.08em. On hover: increase glow and scale(1.02). On active: scale(0.98). Export as default function GlowButton. Use only inline styles and React.`,
      code: `import { useState } from "react";

export default function GlowButton({ children = "LAUNCH APP →" }: { children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: "#0a0a0a",
        color: "#00ff88",
        border: "1px solid #00ff88",
        borderRadius: 6,
        padding: "12px 28px",
        fontFamily: "monospace",
        fontSize: 14,
        letterSpacing: "0.08em",
        cursor: "pointer",
        boxShadow: hovered ? "0 0 28px #00ff88aa, 0 0 8px #00ff8844" : "0 0 12px #00ff8855",
        transform: pressed ? "scale(0.98)" : hovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 20 } },
        React.createElement("button", { style: { background: "#0a0a0a", color: "#00ff88", border: "1px solid #00ff88", borderRadius: 6, padding: "10px 22px", fontFamily: "monospace", fontSize: 13, cursor: "pointer", boxShadow: "0 0 12px #00ff8844", letterSpacing: "0.08em" } }, "LAUNCH APP →")
      ),
    },
    {
      id: "btn-pastel",
      name: "Soft Gradient Pill",
      vibe: "Soft & Pastel",
      difficulty: "Simple",
      desc: "Smooth gradient pill button with hover lift effect.",
      prompt: `Create a React pill button with pastel gradient. Background linear-gradient(135deg, #f9a8d4, #a78bfa), white text, no border, border-radius 50px, padding 14px 32px, font-weight 600, font-size 15px. Hover: scale(1.03) with box-shadow 0 8px 25px rgba(167,139,250,0.4). Active: scale(0.97). Smooth 0.2s transitions. Export as default function SoftButton.`,
      code: `import { useState } from "react";

export default function SoftButton({ children = "Get Started Free" }: { children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: "linear-gradient(135deg, #f9a8d4, #a78bfa)",
        color: "white",
        border: "none",
        borderRadius: 50,
        padding: "14px 32px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        boxShadow: hovered ? "0 8px 25px rgba(167,139,250,0.4)" : "0 4px 15px rgba(249,168,212,0.3)",
        transform: pressed ? "scale(0.97)" : hovered ? "scale(1.03)" : "scale(1)",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 20 } },
        React.createElement("button", { style: { background: "linear-gradient(135deg,#f9a8d4,#a78bfa)", color: "white", border: "none", borderRadius: 50, padding: "11px 26px", fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 15px rgba(249,168,212,0.35)" } }, "Get Started Free")
      ),
    },
    {
      id: "btn-brutal",
      name: "Brutalist Block",
      vibe: "Brutalist",
      difficulty: "Simple",
      desc: "Raw black button with solid shadow and press effect.",
      prompt: `Create a brutalist React button. Black background #111, white text, NO border-radius (border-radius: 0), thick 2px solid white border, bold uppercase text, padding 12px 24px, font-size 13px, letter-spacing 0.1em. Box-shadow: 4px 4px 0 #fff. On hover: invert colors (white bg, black text). On active: translate(2px 2px) and box-shadow none to simulate pressing. Export as default function BrutalistButton.`,
      code: `import { useState } from "react";

export default function BrutalistButton({ children = "SUBMIT FORM" }: { children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: hovered ? "#fff" : "#111",
        color: hovered ? "#111" : "#fff",
        border: "2px solid #fff",
        borderRadius: 0,
        padding: "12px 24px",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: pressed ? "none" : "4px 4px 0 #fff",
        transform: pressed ? "translate(2px, 2px)" : "none",
        transition: "background 0.15s, color 0.15s",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 20 } },
        React.createElement("button", { style: { background: "#111", color: "#fff", border: "2px solid #fff", borderRadius: 0, padding: "11px 22px", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", boxShadow: "4px 4px 0 #555" } }, "SUBMIT FORM")
      ),
    },
    {
      id: "btn-glass",
      name: "Glassmorphism Button",
      vibe: "Glassmorphism",
      difficulty: "Simple",
      desc: "Frosted glass button over gradient background.",
      prompt: `Create a React glassmorphism button. Requires a colorful gradient parent. Button style: backdrop-filter blur(12px), background rgba(255,255,255,0.1), border 1px solid rgba(255,255,255,0.25), border-radius 12px, white text, padding 12px 28px, font-size 14px. On hover: background rgba(255,255,255,0.2), border rgba(255,255,255,0.4). Wrap in a demo div with gradient background to show the effect. Export as default function GlassButton.`,
      code: `import { useState } from "react";

export default function GlassButton({ children = "Learn More" }: { children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    // Wrap in a gradient background to see the glass effect
    <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "40px 48px", borderRadius: 16 }}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
          border: hovered ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.25)",
          borderRadius: 12,
          color: "white",
          padding: "12px 28px",
          fontSize: 14,
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontFamily: "inherit",
        }}
      >
        {children}
      </button>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "linear-gradient(135deg,#667eea,#764ba2)", padding: "28px 24px", borderRadius: 10 } },
        React.createElement("button", { style: { backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 10, color: "white", padding: "10px 22px", fontSize: 13, cursor: "pointer" } }, "Learn More")
      ),
    },
    {
      id: "btn-fey",
      name: "Fey Button",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "A refined, theme-aware button with radial gradient highlight and soft shadows — inspired by Fey's design language.",
      prompt: `Create a theme-aware React button component called FeyButton. Uses next-themes useTheme hook to adapt. Dark mode: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12), rgba(255,255,255,0.04), transparent) over #1a1a1a background, white/88% text, border rgba(255,255,255,0.1), shadow "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)". Light mode: same structure but inverted. Includes a small SVG lock icon that adapts color. Hover: scale(1.02), active: scale(0.98). Border-radius 10px, padding "10px 20px", font-weight 600, font-size 14px. Smooth transitions. Export as FeyButton.`,
      code: `"use client";
import { useTheme } from "next-themes";

export function FeyButton({ children = "Get Started", onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 20px", borderRadius: 10,
        fontSize: 14, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", transition: "all 0.2s",
        background: isDark
          ? "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 60%, transparent 100%), #1a1a1a"
          : "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 60%, transparent 100%), #f5f5f5",
        color: isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.82)",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
        boxShadow: isDark
          ? "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 1px 2px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <svg viewBox="0 0 16 16" style={{ width: 14, height: 14 }} fill="none"
        stroke={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"}
        strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="5" width="12" height="8" rx="1.5" />
        <path d="M5 5V3.5a3 3 0 016 0V5" />
      </svg>
      {children}
    </button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("button", {
          style: {
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 60%, transparent 100%), #1a1a1a",
            color: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          }
        },
          React.createElement("svg", { viewBox: "0 0 16 16", style: { width: 13, height: 13 }, fill: "none", stroke: "rgba(255,255,255,0.6)", strokeWidth: "1.5", strokeLinecap: "round" },
            React.createElement("rect", { x: "2", y: "5", width: "12", height: "8", rx: "1.5" }),
            React.createElement("path", { d: "M5 5V3.5a3 3 0 016 0V5" })
          ),
          "Get Started"
        )
      ),
    },
    {
      id: "btn-handwritten",
      name: "Handwritten Title",
      vibe: "Soft & Pastel",
      difficulty: "Medium",
      desc: "An animated SVG oval draws itself around your title text — pure motion poetry powered by framer-motion.",
      prompt: `Create a React component called HandWrittenTitle using framer-motion. Center a title string inside a div. Behind it, render a motion.svg with an oval/ellipse path using motion.path. Animate pathLength from 0 to 1 with duration 1.2s, easeInOut, delay 0.5s. Animate path opacity 0→1 simultaneously. The SVG viewBox="0 0 300 80", path draws an irregular oval: "M 20 40 C 40 10, 260 10, 280 40 C 300 70, 260 70, 150 72 C 40 74, 0 70, 20 40". Stroke: #00FFB2 (or any accent), strokeWidth 2, strokeLinecap round, fill none. Title text animates in with opacity/y translate. Position SVG absolute inset-0. Export HandWrittenTitle.`,
      code: `"use client";
import { motion } from "framer-motion";

export function HandWrittenTitle({ title = "Hello World" }: { title?: string }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <motion.svg
        viewBox="0 0 300 80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        fill="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
      >
        <motion.path
          d="M 20 40 C 40 10, 260 10, 280 40 C 300 70, 260 70, 150 72 C 40 74, 0 70, 20 40"
          stroke="#00FFB2" strokeWidth="2" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.svg>
      <motion.h1
        style={{ position: "relative", zIndex: 10, fontSize: 40, fontWeight: 800, padding: "16px 32px", margin: 0, letterSpacing: "-0.03em" }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h1>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0c" } },
        React.createElement("div", { style: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" } },
          React.createElement("svg", { viewBox: "0 0 220 60", style: { position: "absolute", inset: 0, width: "100%", height: "100%" }, fill: "none" },
            React.createElement("path", { d: "M 15 30 C 30 8, 190 8, 205 30 C 220 52, 190 52, 110 54 C 30 56, 0 52, 15 30", stroke: "#00FFB2", strokeWidth: "1.5", strokeLinecap: "round", fill: "none" })
          ),
          React.createElement("span", { style: { position: "relative", zIndex: 1, fontSize: 18, fontWeight: 800, color: "#fff", padding: "12px 24px", letterSpacing: "-0.02em" } }, "Hello World")
        )
      ),
    },
  ],

  cards: [
    // New Creative Cards
    ...NEW_ELEMENTS.cards,
    {
      id: "card-pricing-dark",
      name: "Dark Pricing Card",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "SaaS pricing card with popular badge, features, and CTA.",
      prompt: `Create a React pricing card component. Dark theme: background #111, border 1px solid #222, border-radius 16px, padding 32px, max-width 260px. Include: plan name (small caps, muted color #555), large price (white, 36px, bold, with /month), horizontal divider, feature list with green ✓ checkmarks (each feature in a flex row), primary CTA button (full-width, bg #00FFB2, black text). Popular variant: border-color #00FFB2 with "MOST POPULAR" pill badge (absolute positioned, top -11px, centered, bg #00FFB2). Props: planName, price, features (array), isPopular, onSelect. Export as default function PricingCard.`,
      code: `interface PricingCardProps {
  planName?: string;
  price?: string;
  features?: string[];
  isPopular?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({
  planName = "Pro Plan",
  price = "$29",
  features = ["Unlimited projects", "All 6 AI agents", "Priority support", "Custom integrations"],
  isPopular = false,
  onSelect,
}: PricingCardProps) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {isPopular && (
        <div style={{
          position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
          background: "#00FFB2", color: "#000", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.1em", padding: "3px 10px", borderRadius: 20,
          whiteSpace: "nowrap",
        }}>
          MOST POPULAR
        </div>
      )}
      <div style={{
        background: "#111",
        border: \`1px solid \${isPopular ? "#00FFB2" : "#222"}\`,
        borderRadius: 16, padding: 32, maxWidth: 260, width: "100%",
        boxShadow: isPopular ? "0 0 40px rgba(0,255,178,0.08)" : "none",
      }}>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", textTransform: "uppercase" as const, marginBottom: 10 }}>
          {planName}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 20 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{price}</span>
          <span style={{ fontSize: 12, color: "#444", marginBottom: 4 }}>/month</span>
        </div>
        <div style={{ borderTop: "1px solid #1a1a1a", marginBottom: 20 }} />
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
          {features.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#00FFB2", fontSize: 12 }}>✓</span>
              <span style={{ fontSize: 13, color: "#aaa" }}>{f}</span>
            </div>
          ))}
        </div>
        <button onClick={onSelect} style={{
          width: "100%", background: "#00FFB2", border: "none", borderRadius: 8,
          padding: "11px", fontWeight: 700, fontSize: 13, color: "#000", cursor: "pointer",
        }}>
          Get Started →
        </button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "#111", border: "1px solid #333", borderRadius: 14, padding: 20, width: 180 } },
        React.createElement("div", { style: { fontSize: 10, letterSpacing: "0.1em", color: "#555", textTransform: "uppercase", marginBottom: 6 } }, "Pro Plan"),
        React.createElement("div", { style: { fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 } }, "$29", React.createElement("span", { style: { fontSize: 12, color: "#555", fontWeight: 400 } }, "/mo")),
        ...["Unlimited projects", "All 6 AI agents", "Priority support"].map(f =>
          React.createElement("div", { key: f, style: { fontSize: 11, color: "#aaa", marginBottom: 5 } }, "✓  ", f)
        ),
        React.createElement("button", { style: { width: "100%", background: "#00FFB2", color: "#000", border: "none", borderRadius: 7, padding: "8px", fontWeight: 700, fontSize: 12, cursor: "pointer", marginTop: 12 } }, "Get Started")
      ),
    },
    {
      id: "card-glass-feature",
      name: "Glass Feature Card",
      vibe: "Glassmorphism",
      difficulty: "Medium",
      desc: "Frosted glass card over gradient with icon, title, and description.",
      prompt: `Create a React feature card with glassmorphism effect over a dark gradient. Card: backdrop-filter blur(16px), background rgba(255,255,255,0.07), border 1px solid rgba(255,255,255,0.12), border-radius 20px, padding 28px. Content: 44px icon container (background rgba(255,255,255,0.1), border-radius 12px, emoji icon), title (white, 17px, weight 600), description (rgba(255,255,255,0.6), 13px, line-height 1.6). Wrap in gradient container (background linear-gradient(135deg, #0f0c29, #302b63, #24243e)) to show glass effect. Props: icon, title, description. Export as default function FeatureCard.`,
      code: `interface FeatureCardProps {
  icon?: string;
  title?: string;
  description?: string;
}

export default function FeatureCard({
  icon = "🧠",
  title = "Project Brain",
  description = "Remembers everything about your project. Context loaded for every agent, every time.",
}: FeatureCardProps) {
  return (
    // Gradient background wrapper — required for glass effect
    <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", padding: 40, borderRadius: 24 }}>
      <div style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 20, padding: 28, maxWidth: 280,
      }}>
        <div style={{
          width: 44, height: 44, background: "rgba(255,255,255,0.1)",
          borderRadius: 12, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 22, marginBottom: 16,
        }}>
          {icon}
        </div>
        <div style={{ color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6 }}>{description}</div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "linear-gradient(135deg,#0f0c29,#302b63)", padding: "24px 20px", borderRadius: 14 } },
        React.createElement("div", { style: { backdropFilter: "blur(14px)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 18, width: 180 } },
          React.createElement("div", { style: { width: 38, height: 38, background: "rgba(255,255,255,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 } }, "🧠"),
          React.createElement("div", { style: { color: "white", fontWeight: 600, fontSize: 14, marginBottom: 6 } }, "Project Brain"),
          React.createElement("div", { style: { color: "rgba(255,255,255,0.55)", fontSize: 11, lineHeight: 1.6 } }, "Remembers everything about your project forever.")
        )
      ),
    },
    {
      id: "card-stat",
      name: "Dark Stat Card",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "Dashboard KPI card with metric, trend badge, and accent bar.",
      prompt: `Create a React dashboard stat card. Background #0f0f0f, border 1px solid #1a1a1a, border-radius 12px, padding 20px 24px, min-width 160px. Content: label (12px uppercase #555 letter-spacing 0.1em), large metric value (32px white weight 700), trend badge (small pill: green bg #0d1f17 + #00ff88 text for positive, red for negative, showing ↑/↓ and percentage). Optional: tiny sparkline SVG at bottom (8-point line in accent color). Props: label, value, trend, trendValue, positive. Export as default function StatCard.`,
      code: `interface StatCardProps {
  label?: string;
  value?: string;
  trendValue?: string;
  positive?: boolean;
  sparkline?: number[];
}

export default function StatCard({
  label = "Monthly Revenue",
  value = "$4,280",
  trendValue = "18%",
  positive = true,
  sparkline = [30, 45, 35, 60, 50, 75, 55, 85],
}: StatCardProps) {
  const max = Math.max(...sparkline);
  const pts = sparkline
    .map((v, i) => \`\${(i / (sparkline.length - 1)) * 120},\${32 - (v / max) * 28}\`)
    .join(" ");

  return (
    <div style={{
      background: "#0f0f0f", border: "1px solid #1a1a1a",
      borderRadius: 12, padding: "20px 24px", minWidth: 180,
      display: "inline-flex", flexDirection: "column" as const, gap: 8,
    }}>
      <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{value}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          background: positive ? "#0d1f17" : "#1f0d0d",
          border: \`1px solid \${positive ? "#1a3a2a" : "#3a1a1a"}\`,
          borderRadius: 20, padding: "3px 8px",
          fontSize: 11, color: positive ? "#00ff88" : "#f87171",
        }}>
          {positive ? "↑" : "↓"} {trendValue}
        </span>
      </div>
      <svg viewBox="0 0 120 32" style={{ width: "100%", height: 28, marginTop: 4 }}>
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={positive ? "#00ff88" : "#f87171"} stopOpacity={0.3} />
            <stop offset="100%" stopColor={positive ? "#00ff88" : "#f87171"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon points={\`0,32 \${pts} 120,32\`} fill="url(#sg)" />
        <polyline points={pts} fill="none" stroke={positive ? "#00ff88" : "#f87171"} strokeWidth={1.5} />
      </svg>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 11, padding: "16px 20px", width: 160 } },
        React.createElement("div", { style: { fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 } }, "Monthly Revenue"),
        React.createElement("div", { style: { fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 7 } }, "$4,280"),
        React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 3, background: "#0d1f17", border: "1px solid #1a3a2a", borderRadius: 20, padding: "2px 7px", fontSize: 11, color: "#00ff88" } }, "↑ 18%")
      ),
    },
    {
      id: "card-pastel",
      name: "Pastel Feature Card",
      vibe: "Soft & Pastel",
      difficulty: "Simple",
      desc: "Soft white card with colorful icon, hover lift, and subtle shadow.",
      prompt: `Create a soft pastel React feature card. Background white, border 1px solid #f0e6ff, border-radius 20px, padding 28px, box-shadow 0 4px 20px rgba(167,139,250,0.1). Content: 48px icon container (background #f3e8ff, border-radius 14px, emoji icon 24px), title (#1a1a2e 17px weight 600), description (#6b7280 13px line-height 1.6). On hover: translateY(-4px) and box-shadow 0 12px 30px rgba(167,139,250,0.2), transition 0.2s ease. Props: icon, title, description. Export as default function PastelCard.`,
      code: `import { useState } from "react";

interface PastelCardProps {
  icon?: string;
  title?: string;
  description?: string;
}

export default function PastelCard({
  icon = "✨",
  title = "AI Powered",
  description = "Every feature is backed by Claude for insane quality results, every single time.",
}: PastelCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        border: "1px solid #f0e6ff",
        borderRadius: 20,
        padding: 28,
        maxWidth: 280,
        boxShadow: hovered ? "0 12px 30px rgba(167,139,250,0.2)" : "0 4px 20px rgba(167,139,250,0.1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
    >
      <div style={{
        width: 48, height: 48, background: "#f3e8ff",
        borderRadius: 14, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 24, marginBottom: 16,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{description}</div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "white", border: "1px solid #f0e6ff", borderRadius: 16, padding: 20, width: 180, boxShadow: "0 4px 16px rgba(167,139,250,0.1)" } },
        React.createElement("div", { style: { width: 40, height: 40, background: "#f3e8ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 } }, "✨"),
        React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 } }, "AI Powered"),
        React.createElement("div", { style: { fontSize: 11, color: "#6b7280", lineHeight: 1.6 } }, "Every feature backed by Claude for insane results.")
      ),
    },
    {
      id: "card-x-tweet",
      name: "X / Tweet Card",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "A glassmorphic Twitter/X-style card with gradient border, verified badge, and stat row — perfect for social proof sections.",
      prompt: `Create a React component called XCard. Dark glassmorphic card: outer wrapper with linear-gradient border (rgba(255,255,255,0.15) to rgba(255,255,255,0.03)) via padding:1px + inner div with background linear-gradient(135deg, #16181c, #0a0a0b), border-radius 16px, padding 20px. Header: circular avatar with gradient, author name + verified checkmark SVG (fill #1d9bf0), handle in muted white. Content: array of text lines, white/90%. Stats row: replies, retweets, likes with emoji icons and hover color transition. X logo SVG top-right. Props: author, handle, content (string[]), verified, likes, retweets, replies. Export XCard.`,
      code: `interface XCardProps {
  author?: string; handle?: string; content?: string[];
  verified?: boolean; likes?: number; retweets?: number; replies?: number;
}

export function XCard({ author = "Mohammed Barbar", handle = "@mohammedbarbar", content = ["Just shipped something insane 🚀", "The future is being built right now."], verified = true, likes = 2400, retweets = 847, replies = 128 }: XCardProps) {
  return (
    <div style={{ position: "relative", maxWidth: 360, borderRadius: 18, padding: "1px", background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))" }}>
      <div style={{ borderRadius: 17, padding: 20, background: "linear-gradient(135deg, #16181c, #0a0a0b)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#00FFB2,#38BDF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#000" }}>{author[0]}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{author}</span>
                {verified && <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: "#1d9bf0" }}><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1-2.52-1.27-3.91-.81-.66-1.31-1.91-2.19-3.34-2.19-1.43 0-2.68.88-3.34 2.19-1.39-.46-2.9-.2-3.91.81-1 1.01-1.27 2.52-.81 3.91-1.31.67-2.19 1.91-2.19 3.34 0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1 2.52 1.27 3.91.81.66 1.31 1.91 2.19 3.34 2.19 1.43 0 2.67-.88 3.34-2.19 1.39.46 2.9.2 3.91-.81 1-1.01 1.27-2.52.81-3.91 1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" /></svg>}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{handle}</div>
            </div>
          </div>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "rgba(255,255,255,0.5)" }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </div>
        <div style={{ marginBottom: 14 }}>
          {content.map((line, i) => <p key={i} style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.6, margin: "0 0 4px" }}>{line}</p>)}
        </div>
        <div style={{ display: "flex", gap: 20, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[["💬", replies], ["🔁", retweets], ["♥", likes]].map(([icon, val]) => (
            <button key={String(icon)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              <span>{icon}</span><span>{Number(val).toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: "1px", borderRadius: 16, background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))", maxWidth: 220 } },
        React.createElement("div", { style: { borderRadius: 15, padding: 14, background: "linear-gradient(135deg, #16181c, #0a0a0b)" } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 } },
            React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#00FFB2,#38BDF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000" } }, "M"),
            React.createElement("div", null,
              React.createElement("div", { style: { color: "#fff", fontSize: 11, fontWeight: 600 } }, "Mohammed"),
              React.createElement("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: 10 } }, "@mohammedbarbar")
            )
          ),
          React.createElement("p", { style: { color: "rgba(255,255,255,0.85)", fontSize: 11, lineHeight: 1.5, margin: "0 0 8px" } }, "Just shipped something insane 🚀"),
          React.createElement("div", { style: { display: "flex", gap: 12, fontSize: 10, color: "rgba(255,255,255,0.35)" } },
            React.createElement("span", null, "💬 128"),
            React.createElement("span", null, "🔁 847"),
            React.createElement("span", null, "♥ 2.4k")
          )
        )
      ),
    },
    {
      id: "card-modal-pricing",
      name: "Modal Pricing",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "A dialog-based plan selector with three tiers, feature lists, and a gradient CTA — no external deps, pure React state.",
      prompt: `Create a React component called ModalPricing. A trigger button opens a full-screen overlay (fixed, rgba(0,0,0,0.8) backdrop, blur 12px). Modal content: #0c0c0e background, border rgba(255,255,255,0.08), border-radius 20px, max-width 560px. Header: monospace label "PRICING", large title "Choose your plan". Three plan cards in a 3-col grid (Free $0, Pro $19, Founder $49) — each selectable with highlight border on selection. Below: feature list for selected plan. Full-width gradient CTA button. Close on overlay click. No external libraries, pure useState. Export ModalPricing.`,
      code: `"use client";
import { useState } from "react";

const PLANS = [
  { id: "free", name: "Free", price: "$0", desc: "Side projects", features: ["5 projects", "Basic elements", "Community support"], color: "rgba(255,255,255,0.1)" },
  { id: "pro", name: "Pro", price: "$19", desc: "Serious builders", features: ["Unlimited projects", "All elements", "AI features", "Priority support"], color: "#00FFB2", highlight: true },
  { id: "founder", name: "Founder", price: "$49", desc: "Scale without limits", features: ["Everything in Pro", "Team access", "Custom elements", "White-label"], color: "#38BDF8" },
];

export function ModalPricing() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("pro");

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: "linear-gradient(135deg,#00FFB2,#38BDF8)", color: "#000", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>View Pricing</button>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 560, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "#00FFB2", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 8, fontFamily: "monospace" }}>PRICING</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Choose your plan</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {PLANS.map(plan => (
                <button key={plan.id} onClick={() => setSelected(plan.id)} style={{ background: selected === plan.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: selected === plan.id ? \`1px solid \${plan.color}\` : "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 12px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}>
                  <div style={{ fontSize: 11, color: (plan as any).highlight ? "#00FFB2" : "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: 6 }}>{plan.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{plan.price}<span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>/mo</span></div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{plan.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              {PLANS.find(p => p.id === selected)?.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: "rgba(255,255,255,0.65)" }}><span style={{ color: "#00FFB2" }}>✓</span> {f}</div>
              ))}
            </div>
            <button style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#000", cursor: "pointer", fontFamily: "inherit" }}>
              Get Started with {PLANS.find(p => p.id === selected)?.name}
            </button>
          </div>
        </div>
      )}
    </>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, width: 200 } },
          React.createElement("div", { style: { display: "flex", gap: 6 } },
            ...["Free", "Pro", "Founder"].map((name, i) =>
              React.createElement("div", {
                key: name,
                style: { flex: 1, background: i === 1 ? "rgba(0,255,178,0.08)" : "rgba(255,255,255,0.03)", border: i === 1 ? "1px solid #00FFB2" : "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }
              },
                React.createElement("div", { style: { fontSize: 9, color: i === 1 ? "#00FFB2" : "rgba(255,255,255,0.45)", fontWeight: 600, marginBottom: 2 } }, name),
                React.createElement("div", { style: { fontSize: 13, fontWeight: 800, color: "#fff" } }, ["$0", "$19", "$49"][i])
              )
            )
          ),
          React.createElement("button", {
            style: { width: "100%", padding: "8px", background: "linear-gradient(135deg,#00FFB2,#38BDF8)", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#000", cursor: "pointer" }
          }, "Get Started")
        )
      ),
    },
  ],

  hero: [
    // New Creative Heroes
    ...NEW_ELEMENTS.hero,
    {
      id: "hero-dark",
      name: "Dark SaaS Hero",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "Full-viewport dark hero with dot grid, gradient glow, badge, and social proof.",
      prompt: `Create a full-viewport React hero section for a SaaS product. Background #070707 with radial-gradient dot pattern (radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), background-size 36px 36px). Radial glow overlay (rgba(0,255,178,0.05) at top center). Content max-width 700px centered. Elements top to bottom: small badge pill (bg rgba(0,255,178,0.1), border rgba(0,255,178,0.25), accent dot + "Now in public beta"), headline clamp(38px,6vw,70px) weight 800 white tight letter-spacing -0.035em (split across two lines with second line in accent color #00FFB2), subtitle 18px rgba(255,255,255,0.42) line-height 1.75, two CTAs (primary: accent color bg + black text, secondary: transparent + muted border), stats row (3 metrics, separated by thin border-top). Fade-in + translateY animation on load using useState + useEffect. Export as default function HeroSection.`,
      code: `import { useState, useEffect } from "react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  return (
    <div style={{
      background: "#070707",
      backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
      backgroundSize: "36px 36px",
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,255,178,0.05) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 700, textAlign: "center", padding: "0 24px",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(0,255,178,0.08)", border: "1px solid rgba(0,255,178,0.2)",
          borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#00FFB2",
          marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFB2", display: "inline-block" }} />
          Now in public beta
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(38px, 6vw, 70px)", fontWeight: 800, color: "#fff",
          letterSpacing: "-0.035em", lineHeight: 1.05, margin: "0 0 20px",
        }}>
          Ship your SaaS<br />
          <span style={{ color: "#00FFB2" }}>10x faster.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 18, color: "rgba(255,255,255,0.42)",
          lineHeight: 1.75, margin: "0 auto 36px", maxWidth: 520,
        }}>
          The AI chief of staff for founders who vibe code. Stop getting stuck — start shipping.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 56 }}>
          <a href="#" style={{
            background: "#00FFB2", color: "#000", border: "none",
            borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 14,
            cursor: "pointer", textDecoration: "none", display: "inline-block",
          }}>
            Start Free →
          </a>
          <a href="#" style={{
            background: "transparent", color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
            padding: "13px 28px", fontWeight: 500, fontSize: 14,
            cursor: "pointer", textDecoration: "none", display: "inline-block",
          }}>
            Watch Demo
          </a>
        </div>

        {/* Stats */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32,
          display: "flex", justifyContent: "center", gap: 48,
        }}>
          {[["500+", "Founders"], ["10x", "Faster shipping"], ["$0", "to start"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{val}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "#070707", backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize: "16px 16px", padding: "20px 16px", minHeight: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at top,rgba(0,255,178,0.06) 0%,transparent 60%)" } }),
        React.createElement("div", { style: { background: "rgba(0,255,178,0.1)", border: "1px solid rgba(0,255,178,0.25)", borderRadius: 10, padding: "2px 8px", fontSize: 7, color: "#00FFB2", marginBottom: 8, position: "relative" } }, "● Now in public beta"),
        React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.05, position: "relative" } }, "Ship your SaaS", React.createElement("br"), React.createElement("span", { style: { color: "#00FFB2" } }, "10x faster")),
        React.createElement("div", { style: { fontSize: 8, color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "6px 0 12px", lineHeight: 1.5 } }, "The AI chief of staff for founders"),
        React.createElement("div", { style: { display: "flex", gap: 6 } },
          React.createElement("div", { style: { background: "#00FFB2", borderRadius: 5, padding: "4px 10px", fontSize: 8, color: "#000", fontWeight: 700 } }, "Start Free →"),
          React.createElement("div", { style: { border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, padding: "4px 10px", fontSize: 8, color: "#777" } }, "Demo")
        )
      ),
    },
    {
      id: "hero-gradient",
      name: "Gradient Startup Hero",
      vibe: "Soft & Pastel",
      difficulty: "Medium",
      desc: "Centered hero with radial gradient background, badge, and gradient CTA.",
      prompt: `Create a centered React hero section with pastel gradient. Background radial-gradient(ellipse at center, #f3e8ff 0%, #fce7f3 40%, #fff 100%), min-height 80vh flex column centered. Content: pill badge (white bg, #e9d5ff border, purple text "✨ Loved by 1,200+ founders"), headline clamp(36px,5vw,60px) weight 800 dark #1a1a2e tight letter-spacing, subtitle 18px #6b7280, gradient pill CTA button (gradient linear-gradient(135deg, #7c3aed, #db2777), white text, border-radius 50px, padding 14px 32px, box-shadow), ghost secondary CTA. Below buttons: social proof row "Trusted by teams at [company names]". All inline styles. Export as default function GradientHero.`,
      code: `export default function GradientHero() {
  return (
    <div style={{
      background: "radial-gradient(ellipse at center, #f3e8ff 0%, #fce7f3 40%, #fff 100%)",
      minHeight: "80vh",
      display: "flex", flexDirection: "column" as const,
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "0 24px",
    }}>
      {/* Badge */}
      <div style={{
        background: "white", border: "1px solid #e9d5ff",
        borderRadius: 20, padding: "5px 14px", fontSize: 13,
        color: "#7c3aed", marginBottom: 24, display: "inline-block",
      }}>
        ✨ Loved by 1,200+ founders
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: "#1a1a2e",
        letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 20px",
        maxWidth: 640,
      }}>
        Build beautiful products,<br />faster than ever.
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 18, color: "#6b7280",
        lineHeight: 1.7, margin: "0 auto 36px", maxWidth: 480,
      }}>
        The design toolkit that turns ideas into stunning interfaces in minutes, not days.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 48 }}>
        <button style={{
          background: "linear-gradient(135deg, #7c3aed, #db2777)",
          color: "white", border: "none", borderRadius: 50,
          padding: "14px 32px", fontWeight: 600, fontSize: 15,
          cursor: "pointer", boxShadow: "0 8px 25px rgba(124,58,237,0.3)",
        }}>
          Get Started Free →
        </button>
        <button style={{
          background: "transparent", color: "#7c3aed",
          border: "1px solid #e9d5ff", borderRadius: 50,
          padding: "14px 32px", fontWeight: 500, fontSize: 15, cursor: "pointer",
        }}>
          See Examples
        </button>
      </div>

      {/* Social proof */}
      <div style={{ fontSize: 12, color: "#9ca3af" }}>
        Trusted by teams at{" "}
        {["Linear", "Vercel", "Loom", "Notion"].map((c, i, arr) => (
          <span key={c}>
            <strong style={{ color: "#6b7280" }}>{c}</strong>
            {i < arr.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "radial-gradient(ellipse at center,#f3e8ff 0%,#fce7f3 50%,#fff 100%)", padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 } },
        React.createElement("div", { style: { background: "white", border: "1px solid #e9d5ff", borderRadius: 20, padding: "3px 10px", fontSize: 8, color: "#7c3aed" } }, "✨ Loved by founders"),
        React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: "#1a1a2e", textAlign: "center", lineHeight: 1.1 } }, "Build beautiful", React.createElement("br"), "products, faster"),
        React.createElement("button", { style: { background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "white", border: "none", borderRadius: 50, padding: "7px 18px", fontWeight: 600, fontSize: 10, cursor: "pointer", marginTop: 4 } }, "Get Started Free →")
      ),
    },
  ],

  nav: [
    {
      id: "nav-dark",
      name: "Dark SaaS Navbar",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "Sticky dark navbar with blur backdrop, center links, and CTA button.",
      prompt: `Create a React navbar component for a dark SaaS product. Sticky top, background rgba(7,7,7,0.92) with backdrop-filter blur(12px), border-bottom 1px solid #111, height 60px, padding 0 40px. Three sections: Left: logo (gradient square div 28x28 with emoji ⚡ + product name text 14px weight 700 white). Center: nav links (4 links, 13px #555, hover #fff, no underline, gap 28px). Right: "Sign in" text link #555 + CTA button (bg #00FFB2, black text, 13px, weight 700, border-radius 8px, padding 7px 16px). Use sticky top-0 z-50. Props: productName, links, ctaText, ctaHref. Export as default function Navbar.`,
      code: `interface NavbarProps {
  productName?: string;
  links?: { label: string; href: string }[];
  ctaText?: string;
  ctaHref?: string;
}

export default function Navbar({
  productName = "Vibe OS",
  links = [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Docs", href: "#" },
    { label: "Blog", href: "#" },
  ],
  ctaText = "Get Started",
  ctaHref = "#",
}: NavbarProps) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(7,7,7,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid #111",
      height: 60, padding: "0 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28,
          background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
          borderRadius: 7, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14,
        }}>
          ⚡
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{productName}</span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 28 }}>
        {links.map(l => (
          <a key={l.label} href={l.href} style={{
            fontSize: 13, color: "#555", textDecoration: "none",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#555")}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <a href="#" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>Sign in</a>
        <a href={ctaHref} style={{
          background: "#00FFB2", color: "#000",
          borderRadius: 8, padding: "7px 16px",
          fontSize: 13, fontWeight: 700, textDecoration: "none",
        }}>
          {ctaText}
        </a>
      </div>
    </nav>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "rgba(7,7,7,0.95)", borderBottom: "1px solid #111", padding: "0 16px", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7 } },
          React.createElement("div", { style: { width: 22, height: 22, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 5 } }),
          React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "#fff" } }, "Vibe OS")
        ),
        React.createElement("div", { style: { display: "flex", gap: 18 } },
          ...["Features", "Pricing", "Docs"].map(l => React.createElement("span", { key: l, style: { fontSize: 10, color: "#444" } }, l))
        ),
        React.createElement("div", { style: { background: "#00FFB2", borderRadius: 5, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#000" } }, "Get Started")
      ),
    },
    {
      id: "nav-light",
      name: "Light Pill Nav",
      vibe: "Soft & Pastel",
      difficulty: "Simple",
      desc: "Clean white navbar with pill-shaped active nav items and avatar.",
      prompt: `Create a minimal React navbar for a light-themed product. White background, border-bottom 1px solid #f0f0f0, height 64px, max-width 1200px centered. Left: wordmark logo (dark #1a1a2e, 20px, weight 700). Center: 4-5 pill-style navigation items using useState for active item — active item: background #f3e8ff, color #7c3aed, font-weight 500. Inactive: no background, color #6b7280. Each pill: border-radius 20px, padding 6px 14px, font-size 13px, cursor pointer. Right: notification bell icon (relative positioned with dot badge) + user avatar circle (36px, initials, bg #f3e8ff, color #7c3aed). Export as default function MinimalNav.`,
      code: `import { useState } from "react";

const NAV_ITEMS = ["Elements", "Prompts", "Templates", "Settings"];

export default function MinimalNav({ logoText = "forge.", initials = "MO" }: { logoText?: string; initials?: string }) {
  const [active, setActive] = useState("Elements");

  return (
    <nav style={{
      background: "white", borderBottom: "1px solid #f0f0f0",
      height: 64, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 24px",
      maxWidth: 1200, margin: "0 auto",
    }}>
      {/* Logo */}
      <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e" }}>{logoText}</div>

      {/* Pill nav */}
      <div style={{ display: "flex", gap: 4 }}>
        {NAV_ITEMS.map(item => (
          <button key={item} onClick={() => setActive(item)} style={{
            background: active === item ? "#f3e8ff" : "transparent",
            color: active === item ? "#7c3aed" : "#6b7280",
            fontWeight: active === item ? 500 : 400,
            border: "none", borderRadius: 20,
            padding: "6px 14px", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {item}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <span style={{ fontSize: 18, color: "#9ca3af" }}>🔔</span>
          <span style={{
            position: "absolute", top: 0, right: 0,
            width: 7, height: 7, background: "#7c3aed",
            borderRadius: "50%", border: "1.5px solid white",
          }} />
        </div>
        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#f3e8ff", color: "#7c3aed",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>
          {initials}
        </div>
      </div>
    </nav>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "white", borderBottom: "1px solid #f0f0f0", padding: "0 16px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between" } },
        React.createElement("div", { style: { fontWeight: 700, fontSize: 15, color: "#1a1a2e" } }, "forge."),
        React.createElement("div", { style: { display: "flex", gap: 3 } },
          React.createElement("span", { style: { background: "#f3e8ff", color: "#7c3aed", fontSize: 10, padding: "4px 10px", borderRadius: 20, fontWeight: 500 } }, "Elements"),
          ...["Prompts", "Templates"].map(l => React.createElement("span", { key: l, style: { color: "#6b7280", fontSize: 10, padding: "4px 10px", borderRadius: 20 } }, l))
        ),
        React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#7c3aed" } }, "MO")
      ),
    },
  ],

  forms: [
    // New Creative Forms
    ...NEW_ELEMENTS.forms,
    {
      id: "form-auth-dark",
      name: "Dark Auth Form",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "Complete dark login form with show/hide password and Google OAuth.",
      prompt: `Create a React dark login form component. Card: background #111, border 1px solid #1e1e1e, border-radius 20px, padding 40px, max-width 400px centered on dark #0a0a0a background. Content: logo icon (gradient 42x42 border-radius 11px) + product name centered. Heading "Welcome back" + subtitle. Email input (full-width, bg #0d0d0d, border #1e1e1e, br 8px, white text, padding 11px 14px). Password input with eye show/hide toggle button (absolute right 12px). "Forgot password?" right-aligned link. Primary submit button (full-width, bg #00FFB2, black bold text). Divider "or". Google OAuth button (full-width, transparent, border #1e1e1e, gray text). "No account? Sign up" footer. Use useState for showPassword and screen state (login/signup/forgot). Export as default function AuthForm.`,
      code: `import { useState } from "react";

const inputStyle = {
  width: "100%", background: "#0d0d0d",
  border: "1px solid #1e1e1e", borderRadius: 8,
  color: "#fff", padding: "11px 14px",
  fontSize: 14, outline: "none",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
};

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [screen, setScreen] = useState<"login" | "signup">("login");

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{
        background: "#111", border: "1px solid #1e1e1e",
        borderRadius: 20, padding: 40, width: "100%", maxWidth: 400,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 42, height: 42, background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
            borderRadius: 11, display: "inline-flex", alignItems: "center",
            justifyContent: "center", fontSize: 20, marginBottom: 10,
          }}>
            ⚡
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Vibe OS</div>
        </div>

        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px", textAlign: "center" }}>
          {screen === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ color: "#444", fontSize: 13, textAlign: "center", margin: "0 0 28px" }}>
          {screen === "login" ? "Sign in to your account" : "Start for free, no card needed"}
        </p>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
          <input type="email" placeholder="you@example.com" style={inputStyle} />

          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} placeholder="Password" style={{ ...inputStyle, paddingRight: 44 }} />
            <button onClick={() => setShowPassword(p => !p)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 14,
            }}>
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {screen === "login" && (
            <div style={{ textAlign: "right" }}>
              <a href="#" style={{ fontSize: 12, color: "#444", textDecoration: "none" }}>Forgot password?</a>
            </div>
          )}

          <button style={{
            width: "100%", background: "#00FFB2", border: "none",
            borderRadius: 8, padding: 12, fontWeight: 700,
            fontSize: 14, color: "#000", cursor: "pointer",
          }}>
            {screen === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
            <span style={{ fontSize: 11, color: "#333" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
          </div>

          <button style={{
            width: "100%", background: "transparent",
            border: "1px solid #1e1e1e", borderRadius: 8,
            padding: 11, fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "inherit",
          }}>
            🔵 Continue with Google
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#444", marginTop: 20 }}>
          {screen === "login" ? "No account? " : "Already have an account? "}
          <button onClick={() => setScreen(s => s === "login" ? "signup" : "login")} style={{
            background: "none", border: "none", color: "#00FFB2",
            cursor: "pointer", fontSize: 12, fontFamily: "inherit",
          }}>
            {screen === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "#0a0a0a", padding: 16, display: "flex", justifyContent: "center" } },
        React.createElement("div", { style: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 14, padding: 18, width: 190 } },
          React.createElement("div", { style: { textAlign: "center", marginBottom: 14 } },
            React.createElement("div", { style: { width: 32, height: 32, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, marginBottom: 6 } }, "⚡"),
            React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#fff" } }, "Vibe OS")
          ),
          React.createElement("div", { style: { background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 6, padding: "6px 9px", fontSize: 10, color: "#555", marginBottom: 8 } }, "you@example.com"),
          React.createElement("div", { style: { background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 6, padding: "6px 9px", fontSize: 10, color: "#555", marginBottom: 10 } }, "••••••••"),
          React.createElement("div", { style: { background: "#00FFB2", borderRadius: 6, padding: "6px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#000" } }, "Sign In")
        )
      ),
    },
    {
      id: "form-float",
      name: "Floating Label Input",
      vibe: "Soft & Pastel",
      difficulty: "Medium",
      desc: "Input with animated floating label — label rises to top on focus.",
      prompt: `Create a React floating label input component using useState. When input is focused or has value, the label floats above the input (top position, smaller font, colored). When empty and unfocused, label sits centered in the input like a placeholder. Style: white bg, border 1.5px solid #e5e7eb, border-radius 12px, focus border 1.5px solid #a78bfa. Label starts at vertical center (font-size 14px, color #9ca3af), on focus/value: float to top (font-size 11px, color #a78bfa, background white padding 0 4px to cover border). Include error variant (red border + error message below). Include success variant (green border). Export as default function FloatingInput with props: label, type, error, success.`,
      code: `import { useState } from "react";

interface FloatingInputProps {
  label?: string;
  type?: string;
  error?: string;
  success?: boolean;
}

export function FloatingInput({ label = "Email address", type = "text", error, success }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const floated = focused || value.length > 0;

  const borderColor = error ? "#f87171" : success ? "#4ade80" : focused ? "#a78bfa" : "#e5e7eb";
  const labelColor = error ? "#f87171" : success ? "#4ade80" : "#a78bfa";

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", background: "white",
            border: \`1.5px solid \${borderColor}\`,
            borderRadius: 12, padding: "18px 13px 7px",
            fontSize: 14, outline: "none", color: "#1a1a2e",
            boxSizing: "border-box" as const, fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
        />
        <label style={{
          position: "absolute",
          left: 13,
          top: floated ? 7 : "50%",
          transform: floated ? "none" : "translateY(-50%)",
          fontSize: floated ? 11 : 14,
          color: floated ? labelColor : "#9ca3af",
          background: floated ? "white" : "transparent",
          padding: floated ? "0 3px" : "0",
          pointerEvents: "none",
          transition: "all 0.18s ease",
        }}>
          {label}
        </label>
      </div>
      {error && <p style={{ fontSize: 11, color: "#f87171", margin: "5px 0 0 3px" }}>⚠ {error}</p>}
      {success && !error && <p style={{ fontSize: 11, color: "#4ade80", margin: "5px 0 0 3px" }}>✓ Looks good!</p>}
    </div>
  );
}

// Demo export showing multiple states
export default function FloatingInputDemo() {
  return (
    <div style={{ background: "white", padding: 24, borderRadius: 16, maxWidth: 340 }}>
      <FloatingInput label="Email address" />
      <div style={{ marginTop: 12 }} />
      <FloatingInput label="Username" error="Username already taken" />
      <div style={{ marginTop: 12 }} />
      <FloatingInput label="Website" success />
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "white", padding: 16, borderRadius: 10, border: "1px solid #f0e6ff" } },
        React.createElement("div", { style: { position: "relative", marginBottom: 12 } },
          React.createElement("input", { type: "text", placeholder: " ", style: { width: "100%", border: "1.5px solid #a78bfa", borderRadius: 10, padding: "17px 13px 7px", fontSize: 14, outline: "none", color: "#1a1a2e", background: "white", boxSizing: "border-box" as const } }),
          React.createElement("label", { style: { position: "absolute", left: 13, top: "45%", transform: "translateY(-90%)", fontSize: 11, color: "#a78bfa", background: "white", padding: "0 3px", pointerEvents: "none" as const } }, "Email address")
        ),
        React.createElement("div", { style: { position: "relative" } },
          React.createElement("input", { type: "text", placeholder: " ", style: { width: "100%", border: "1.5px solid #f87171", borderRadius: 10, padding: "17px 13px 7px", fontSize: 14, outline: "none", color: "#1a1a2e", background: "white", boxSizing: "border-box" as const } }),
          React.createElement("label", { style: { position: "absolute", left: 13, top: "45%", transform: "translateY(-90%)", fontSize: 11, color: "#f87171", background: "white", padding: "0 3px", pointerEvents: "none" as const } }, "Username"),
          React.createElement("div", { style: { fontSize: 11, color: "#f87171", marginTop: 5, paddingLeft: 3 } }, "⚠ Username already taken")
        )
      ),
    },
    {
      id: "form-split-signup",
      name: "Split Screen Signup",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "Two-panel signup: dark brand panel left, light form right. Email/password validation, glass blur strips, and orange accent.",
      prompt: `Create a split-screen React signup form. Two equal halves side by side. LEFT HALF: black background, white text brand tagline (font-size 22px, weight 500, line-height 1.4, max-width 280px), 6 vertical glass blur strip overlays (each 64px wide, backdrop-filter blur(20px), gradient fill black 60%, opacity 0.3, absolute positioned), gradient overlay from black to transparent top-down, large orange circle blob (200px, border-radius 50%, bottom-left absolute, overflow hidden). RIGHT HALF: #f9f9f9 background, flex column, padding 48px 40px. Content: orange sun/burst icon (36px), "Get Started" heading (28px weight 500 tight tracking), subtitle text, email input (white bg, border #d1d5db, border-radius 8px, focus border accent + ring), password input same, red inline error messages, submit button full-width (orange bg, white text, hover opacity). "Already have account? Login" link below. Props: brandName, tagline, accentColor (default #f97316). Export as default function SplitSignup.`,
      code: `import { useState } from "react";
import { Sun } from "lucide-react";

interface SplitSignupProps {
  brandName?: string;
  tagline?: string;
  accentColor?: string;
  onSubmit?: (email: string, password: string) => void;
}

export default function SplitSignup({
  brandName = "YourBrand",
  tagline = "Design and dev partner for startups and founders.",
  accentColor = "#f97316",
  onSubmit,
}: SplitSignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else setEmailError("");
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    } else setPasswordError("");
    if (valid) onSubmit?.(email, password);
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%", padding: "9px 12px", fontSize: 13,
    background: "white", color: "#111",
    border: \`1px solid \${hasError ? "#ef4444" : "#d1d5db"}\`,
    borderRadius: 8, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = accentColor;
    e.currentTarget.style.boxShadow = \`0 0 0 3px \${accentColor}22\`;
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError ? "#ef4444" : "#d1d5db";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f0f0f0", padding: 24 }}>
      <div style={{ display: "flex", width: "100%", maxWidth: 900, borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>

        {/* ── Left dark panel ── */}
        <div style={{ flex: 1, background: "#000", padding: "48px 40px", position: "relative", overflow: "hidden", minHeight: 480 }}>
          {/* Glass blur strips */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", top: 0, left: i * 64, width: 64, height: "100%",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 69%, rgba(255,255,255,0.05) 100%)",
              opacity: 0.3,
            }} />
          ))}
          {/* Top gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)" }} />
          {/* Orange blob */}
          <div style={{ position: "absolute", bottom: -40, left: -20, width: 220, height: 220, background: accentColor, borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -10, left: 30, width: 110, height: 75, background: "white", borderRadius: "50%", opacity: 0.1 }} />
          {/* Tagline */}
          <p style={{ position: "relative", zIndex: 1, fontSize: 22, fontWeight: 500, color: "#fff", lineHeight: 1.4, letterSpacing: "-0.02em", maxWidth: 280, margin: 0 }}>
            {tagline}
          </p>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex: 1, background: "#f9f9f9", padding: "48px 40px", display: "flex", flexDirection: "column" as const }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ color: accentColor, marginBottom: 14 }}>
              <Sun size={36} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.025em", margin: "0 0 6px", color: "#111" }}>
              Get Started
            </h2>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
              Welcome to {brandName} — Let's get started
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#444", marginBottom: 5, fontFamily: "inherit" }}>
                Your email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle(!!emailError)}
                onFocus={focusInput}
                onBlur={e => blurInput(e, !!emailError)}
              />
              {emailError && <p style={{ fontSize: 11, color: "#ef4444", margin: "4px 0 0" }}>{emailError}</p>}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "#444", marginBottom: 5, fontFamily: "inherit" }}>
                Create new password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle(!!passwordError)}
                onFocus={focusInput}
                onBlur={e => blurInput(e, !!passwordError)}
              />
              {passwordError && <p style={{ fontSize: 11, color: "#ef4444", margin: "4px 0 0" }}>{passwordError}</p>}
            </div>

            <button type="submit" style={{
              width: "100%", background: accentColor, color: "#fff",
              border: "none", borderRadius: 8, padding: "10px 16px",
              fontSize: 14, fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit", transition: "opacity 0.15s",
            }}
              onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}
            >
              Create a new account
            </button>

            <p style={{ textAlign: "center", fontSize: 13, color: "#999", margin: 0 }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#333", fontWeight: 500, textDecoration: "underline" }}>
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { display: "flex", width: "100%", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" } },
        // Left dark panel
        React.createElement("div", { style: { flex: 1, background: "#000", padding: "14px 12px", position: "relative", overflow: "hidden", minHeight: 130 } },
          React.createElement("div", { style: { position: "absolute", bottom: -14, left: -6, width: 64, height: 64, background: "#f97316", borderRadius: "50%" } }),
          React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)" } }),
          React.createElement("p", { style: { position: "relative", zIndex: 1, fontSize: 8.5, color: "#fff", fontWeight: 500, lineHeight: 1.45, margin: 0, maxWidth: 90 } }, "Design partner for startups and founders.")
        ),
        // Right form panel
        React.createElement("div", { style: { flex: 1, background: "#f9f9f9", padding: "14px 12px", display: "flex", flexDirection: "column" } },
          React.createElement("div", { style: { width: 16, height: 16, borderRadius: "50%", background: "#f97316", marginBottom: 7 } }),
          React.createElement("div", { style: { fontSize: 10.5, fontWeight: 600, color: "#111", marginBottom: 10, letterSpacing: "-0.01em" } }, "Get Started"),
          React.createElement("div", { style: { background: "white", border: "1px solid #e5e7eb", borderRadius: 5, padding: "3px 7px", fontSize: 7.5, color: "#bbb", marginBottom: 5 } }, "you@example.com"),
          React.createElement("div", { style: { background: "white", border: "1px solid #e5e7eb", borderRadius: 5, padding: "3px 7px", fontSize: 7.5, color: "#bbb", marginBottom: 7 } }, "••••••••"),
          React.createElement("div", { style: { background: "#f97316", borderRadius: 5, padding: "3px 7px", textAlign: "center" as const, fontSize: 7.5, color: "#fff", fontWeight: 600 } }, "Create Account")
        )
      ),
    },
    {
      id: "form-action-search",
      name: "Action Search Bar",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "An animated command palette search bar with real-time filtering, framer-motion dropdown, and keyboard shortcut badge.",
      prompt: `Create a React component called ActionSearchBar using framer-motion. An input bar with search icon prefix and ⌘K badge suffix. On focus: box-shadow ring (rgba(0,255,178,0.12)), border brightens. Dropdown (AnimatePresence, motion.div) appears below with filtered results. Each result: icon box, label, category tag. Results animate in with stagger (0.03s delay per item). onMouseEnter/Leave for hover states. "✕" clear button appears when query is set. Props: placeholder, results (array of {id, label, category, icon}). Export ActionSearchBar.`,
      code: `"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_RESULTS = [
  { id: "1", label: "Create new project", category: "Actions", icon: "+" },
  { id: "2", label: "Open dashboard", category: "Navigate", icon: "⬡" },
  { id: "3", label: "View analytics", category: "Navigate", icon: "◉" },
  { id: "4", label: "Invite teammate", category: "Actions", icon: "◎" },
  { id: "5", label: "Element Forge", category: "Tools", icon: "◈" },
];

export function ActionSearchBar({ placeholder = "Search actions...", results = DEFAULT_RESULTS }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = query ? results.filter(r => r.label.toLowerCase().includes(query.toLowerCase())) : results;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: focused ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 12, transition: "all 0.2s", boxShadow: focused ? "0 0 0 3px rgba(0,255,178,0.12)" : "none" }}>
        <span style={{ paddingLeft: 14, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>⌕</span>
        <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} placeholder={placeholder} style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: "inherit" }} />
        {query && <button onClick={() => setQuery("")} style={{ paddingRight: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>✕</button>}
        <div style={{ paddingRight: 12, color: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "monospace" }}>⌘K</div>
      </div>
      <AnimatePresence>
        {focused && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.15 }} style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#111113", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden", zIndex: 50, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
            {filtered.map((r, i) => (
              <motion.button key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 14px", background: "transparent", border: "none", borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                <span style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", borderRadius: 6, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{r.icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{r.label}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{r.category}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: "20px 24px", display: "flex", flexDirection: "column" as const, gap: 6 } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 12px", boxShadow: "0 0 0 3px rgba(0,255,178,0.1)" } },
          React.createElement("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: 12, marginRight: 6 } }, "⌕"),
          React.createElement("span", { style: { flex: 1, fontSize: 11, color: "rgba(255,255,255,0.35)" } }, "Search actions..."),
          React.createElement("span", { style: { fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" } }, "⌘K")
        ),
        React.createElement("div", { style: { background: "#111113", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden" } },
          ...["Create new project", "Open dashboard", "Element Forge"].map((label, i) =>
            React.createElement("div", { key: label, style: { display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none", fontSize: 10, color: "rgba(255,255,255,0.7)" } },
              React.createElement("span", { style: { width: 16, height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 } }, ["+", "⬡", "◈"][i]),
              label
            )
          )
        )
      ),
    },
  ],

  dashboards: [
    {
      id: "dash-saas",
      name: "SaaS Metrics Dashboard",
      vibe: "Dark & Minimal",
      difficulty: "Advanced",
      desc: "Full dark SaaS dashboard with sidebar, KPI cards, SVG revenue chart, and activity feed.",
      prompt: `Create a complete React SaaS metrics dashboard. Dark theme #080808. Use useState for range selection. LAYOUT: left sidebar (200px, #0d0d0d, border-right #111) + main content area. SIDEBAR: logo, nav items with emoji icons (Dashboard, Analytics, Customers, Billing, Settings), active item highlighted. MAIN: header row (greeting + date + "New Report" button in accent color #00FFB2), 4 KPI cards in grid (MRR $8,420 ↑12%, Active Users 1,284 ↑8%, Churn Rate 2.4% ↑0.2%, NPS 68 ↑4pts — green for positive, red for negative), full-width SVG line chart (responsive, smooth path, gradient fill below line, time range tabs 7d/30d/90d), 2-column bottom section (recent activity timeline + top customers table with plan badges). All inline styles, no external deps. Export as default function Dashboard.`,
      code: `import { useState } from "react";

const NAV = [
  { icon: "📊", label: "Dashboard" },
  { icon: "📈", label: "Analytics" },
  { icon: "👥", label: "Customers" },
  { icon: "💳", label: "Billing" },
  { icon: "⚙️", label: "Settings" },
];

const KPI = [
  { label: "MRR", value: "$8,420", trend: "+12%", positive: true },
  { label: "Active Users", value: "1,284", trend: "+8%", positive: true },
  { label: "Churn Rate", value: "2.4%", trend: "+0.2%", positive: false },
  { label: "NPS", value: "68", trend: "+4 pts", positive: true },
];

const CHART_DATA = [30, 42, 38, 58, 52, 70, 60, 82, 74, 88, 80, 100];

const ACTIVITY = [
  { icon: "🆕", text: "Sarah K. upgraded to Pro", time: "2m ago" },
  { icon: "💰", text: "New payment $290 received", time: "14m ago" },
  { icon: "👋", text: "Alex M. signed up", time: "1h ago" },
  { icon: "❌", text: "Plan cancelled by J. Torres", time: "3h ago" },
];

const CUSTOMERS = [
  { name: "Acme Corp", plan: "FOUNDER", mrr: "$490" },
  { name: "StartupXYZ", plan: "PRO", mrr: "$29" },
  { name: "DevTools Inc", plan: "PRO", mrr: "$29" },
];

const PLAN_COLORS: Record<string, string> = { FOUNDER: "#00FFB2", PRO: "#38BDF8", FREE: "#555" };

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [range, setRange] = useState("30d");
  const max = Math.max(...CHART_DATA);
  const pts = CHART_DATA
    .map((v, i) => \`\${(i / (CHART_DATA.length - 1)) * 100}%,\${100 - (v / max) * 80}%\`)
    .join(" ");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080808", fontFamily: "system-ui, sans-serif", color: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: "#0d0d0d", borderRight: "1px solid #111", padding: "20px 12px", display: "flex", flexDirection: "column" as const, gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Vibe OS</span>
        </div>
        {NAV.map(n => (
          <button key={n.label} onClick={() => setActiveNav(n.label)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
            background: activeNav === n.label ? "#1a1a1a" : "transparent",
            border: "none", borderRadius: 7, color: activeNav === n.label ? "#fff" : "#444",
            fontSize: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left" as const,
            transition: "all 0.15s",
          }}>
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Good morning 👋</div>
            <div style={{ fontSize: 12, color: "#444", marginTop: 2 }}>{new Date().toDateString()}</div>
          </div>
          <button style={{ background: "#00FFB2", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 12, color: "#000", cursor: "pointer" }}>
            + New Report
          </button>
        </div>

        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {KPI.map(k => (
            <div key={k.label} style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>{k.label}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontSize: 22, fontWeight: 700 }}>{k.value}</span>
                <span style={{
                  fontSize: 10, color: k.positive ? "#00ff88" : "#f87171",
                  background: k.positive ? "#0d1f17" : "#1f0d0d",
                  borderRadius: 20, padding: "2px 7px",
                }}>
                  {k.positive ? "↑" : "↓"} {k.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Revenue</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["7d", "30d", "90d"].map(r => (
                <button key={r} onClick={() => setRange(r)} style={{
                  background: range === r ? "#1a1a1a" : "transparent",
                  border: \`1px solid \${range === r ? "#333" : "transparent"}\`,
                  borderRadius: 6, color: range === r ? "#fff" : "#444",
                  fontSize: 10, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit",
                }}>{r}</button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: 120 }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFB2" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#00FFB2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <polygon points={\`0,100 \${pts} 100,100\`} fill="url(#cg)" />
            <polyline points={pts} fill="none" stroke="#00FFB2" strokeWidth={0.8} />
          </svg>
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Activity */}
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Recent Activity</div>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < ACTIVITY.length - 1 ? 12 : 0 }}>
                <span style={{ fontSize: 14 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#ccc" }}>{a.text}</div>
                  <div style={{ fontSize: 10, color: "#333", marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Customers */}
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Top Customers</div>
            {CUSTOMERS.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < CUSTOMERS.length - 1 ? 10 : 0 }}>
                <span style={{ fontSize: 12, color: "#ccc" }}>{c.name}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: PLAN_COLORS[c.plan] ?? "#555", background: \`\${PLAN_COLORS[c.plan] ?? "#555"}11\`, borderRadius: 20, padding: "2px 7px" }}>{c.plan}</span>
                  <span style={{ fontSize: 12, color: "#fff", fontFamily: "monospace" }}>{c.mrr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "#080808", padding: 8, borderRadius: 10, width: "100%" } },
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginBottom: 8 } },
          ...[["MRR", "$8.4K", "#00ff88"], ["Users", "1.2K", "#00ff88"], ["Churn", "2.4%", "#f87171"], ["NPS", "68", "#00ff88"]].map(([l, v, c]) =>
            React.createElement("div", { key: l, style: { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 6, padding: 6 } },
              React.createElement("div", { style: { fontSize: 7, color: "#444", textTransform: "uppercase", marginBottom: 3 } }, l),
              React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 } }, v),
              React.createElement("div", { style: { fontSize: 7, color: c } }, "↑")
            )
          )
        ),
        React.createElement("div", { style: { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 6, padding: 7 } },
          React.createElement("div", { style: { fontSize: 7, color: "#444", marginBottom: 6 } }, "Revenue"),
          React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 2, height: 32 } },
            ...[30, 45, 35, 60, 50, 75, 55, 85, 70, 90, 80, 100].map((h, i) =>
              React.createElement("div", { key: i, style: { flex: 1, background: "linear-gradient(to top,#00ff88,#00ff8822)", borderRadius: "1px 1px 0 0", height: `${h}%` } })
            )
          )
        )
      ),
    },
    {
      id: "dash-analytics",
      name: "Light Analytics Panel",
      vibe: "Soft & Pastel",
      difficulty: "Medium",
      desc: "Pastel analytics dashboard with metric cards, SVG engagement chart, and funnel.",
      prompt: `Create a React analytics dashboard with soft pastel theme. Background #fafafa. Use useState for date range. HEADER: title + date range toggle (7d/30d/90d as pill buttons, active = white bg). 4 METRIC CARDS in grid: each has colored background (purple #faf5ff, pink #fdf2f8, teal #f0fdf4, amber #fffbeb), colored label, large metric, % change with direction. SVG CHART: full-width area chart with smooth polyline in primary color #7c3aed, gradient fill, week labels. BOTTOM GRID: left = conversion funnel (Visited→Signed Up→Activated→Paid as horizontal bars, each shorter), right = traffic sources (4 items with colored dot, source name, %, horizontal mini bar). All inline styles. Export as default function AnalyticsDashboard.`,
      code: `import { useState } from "react";

const METRICS = [
  { label: "Page Views", value: "48,291", change: "+14%", positive: true, bg: "#faf5ff", color: "#7c3aed" },
  { label: "Visitors", value: "12,450", change: "+9%", positive: true, bg: "#fdf2f8", color: "#ec4899" },
  { label: "Bounce Rate", value: "38.2%", change: "-3%", positive: true, bg: "#f0fdf4", color: "#16a34a" },
  { label: "Avg. Session", value: "3m 42s", change: "+21s", positive: true, bg: "#fffbeb", color: "#d97706" },
];

const CHART_PTS = [60, 45, 72, 58, 80, 65, 90, 75, 88, 95, 82, 100];
const FUNNEL = [
  { label: "Visited", count: 12450, pct: 100 },
  { label: "Signed Up", count: 2890, pct: 23 },
  { label: "Activated", count: 1240, pct: 10 },
  { label: "Paid", count: 380, pct: 3 },
];
const SOURCES = [
  { label: "Organic Search", pct: 42, color: "#7c3aed" },
  { label: "Direct", pct: 28, color: "#ec4899" },
  { label: "Social Media", pct: 18, color: "#16a34a" },
  { label: "Referral", pct: 12, color: "#d97706" },
];

export default function AnalyticsDashboard() {
  const [range, setRange] = useState("30d");
  const max = Math.max(...CHART_PTS);
  const pts = CHART_PTS.map((v, i) => \`\${(i / (CHART_PTS.length - 1)) * 100}%,\${100 - (v / max) * 80}%\`).join(" ");

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", padding: 28, fontFamily: "system-ui, sans-serif", color: "#1a1a2e" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Analytics</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Track your growth in real time</div>
        </div>
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 20, padding: 3, gap: 2 }}>
          {["7d", "30d", "90d"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              background: range === r ? "white" : "transparent",
              border: "none", borderRadius: 16, padding: "5px 14px",
              fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              color: range === r ? "#1a1a2e" : "#9ca3af",
              boxShadow: range === r ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background: m.bg, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: m.color, fontWeight: 600, marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: m.positive ? "#16a34a" : "#dc2626" }}>
              {m.positive ? "↑" : "↓"} {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "white", border: "1px solid #f0e6ff", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Traffic Overview</div>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: "100%", height: 140 }}>
          <defs>
            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points={\`0,100 \${pts} 100,100\`} fill="url(#ag)" />
          <polyline points={pts} fill="none" stroke="#7c3aed" strokeWidth={0.8} />
        </svg>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Funnel */}
        <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Conversion Funnel</div>
          {FUNNEL.map((f, i) => (
            <div key={f.label} style={{ marginBottom: i < FUNNEL.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#374151" }}>{f.label}</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{f.count.toLocaleString()}</span>
              </div>
              <div style={{ background: "#f3f4f6", borderRadius: 4, height: 6 }}>
                <div style={{ width: \`\${f.pct}%\`, height: "100%", background: "#7c3aed", borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sources */}
        <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Traffic Sources</div>
          {SOURCES.map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < SOURCES.length - 1 ? 12 : 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: "#374151" }}>{s.label}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", width: 28, textAlign: "right" as const }}>{s.pct}%</span>
              <div style={{ width: 60, background: "#f3f4f6", borderRadius: 4, height: 5 }}>
                <div style={{ width: \`\${s.pct}%\`, height: "100%", background: s.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { background: "#fafafa", padding: 8, borderRadius: 10, width: "100%" } },
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 5, marginBottom: 7 } },
          ...[["Views", "48K", "#f3e8ff", "#7c3aed"], ["Visitors", "12K", "#fce7f3", "#ec4899"]].map(([l, v, bg, tc]) =>
            React.createElement("div", { key: l, style: { background: bg, borderRadius: 7, padding: 7 } },
              React.createElement("div", { style: { fontSize: 7, color: tc, fontWeight: 600, marginBottom: 2 } }, l),
              React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#1a1a2e" } }, v)
            )
          )
        ),
        React.createElement("div", { style: { background: "white", border: "1px solid #f0e6ff", borderRadius: 7, padding: 7 } },
          React.createElement("svg", { viewBox: "0 0 120 36", style: { width: "100%", height: 30 } },
            React.createElement("polyline", { points: "0,30 15,22 30,25 45,14 60,17 75,7 90,11 105,4 120,7", fill: "none", stroke: "#7c3aed", strokeWidth: "1.8" })
          )
        )
      ),
    },
  ],

  backgrounds: [
    {
      id: "bg-neural-grid",
      name: "Neural Grid",
      vibe: "Neon & Cyber",
      difficulty: "Medium",
      desc: "An animated cyan grid where random intersection nodes fire like neurons. Mouse movement casts a spotlight, revealing the grid beneath the vignette.",
      prompt: `Create a full-section background component called NeuralGrid. Dark background #020204. Grid lines using backgroundImage with two linear-gradients at rgba(0,255,178,0.055), 56px spacing. Animated glowing nodes: use useEffect with setInterval(300ms) to add random glowing dots at grid intersections (snap to 56px grid). Each node fades out over 1.5s using opacity calculated from (Date.now() - born) / 1500. Mouse tracking via useRef + onMouseMove: draws a radial-gradient spotlight at cursor position. Radial vignette (transparent center, #020204 at 80%) masks edges. Centered content: badge "GRID · LIVE", 58px headline with "Grid" in #00FFB2 with textShadow glow, subtitle, and two CTAs (solid green + ghost). Inline styles only.`,
      code: `import { useState, useEffect, useRef } from "react";

export default function NeuralGrid() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [nodes, setNodes] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setNodes(prev => {
        const alive = prev.filter(n => now - n.born < 1500);
        if (alive.length < 7) {
          alive.push({
            id: Math.random(),
            x: (Math.floor(Math.random() * 11) + 1) * (100 / 12),
            y: (Math.floor(Math.random() * 8) + 1) * (100 / 9),
            born: now,
          });
        }
        return alive;
      });
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setMouse({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 });
      }}
      style={{ position: "relative", width: "100%", minHeight: 580, background: "#020204", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,178,0.055) 1px, transparent 1px), linear-gradient(to right, rgba(0,255,178,0.055) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />

      {nodes.map(n => {
        const age = Math.min((Date.now() - n.born) / 1500, 1);
        return (
          <div key={n.id} style={{ position: "absolute", left: n.x + "%", top: n.y + "%", transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%", background: "#00FFB2", opacity: Math.max(0, 1 - age), boxShadow: "0 0 " + (12 + age * 24) + "px " + (4 + age * 12) + "px rgba(0,255,178," + (0.8 - age * 0.8) + ")", pointerEvents: "none" }} />
        );
      })}

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle 500px at " + mouse.x + "% " + mouse.y + "%, rgba(0,255,178,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 20%, #020204 80%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 32px" }}>
        <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.35em", color: "#00FFB2", background: "rgba(0,255,178,0.07)", border: "1px solid rgba(0,255,178,0.2)", borderRadius: 4, padding: "4px 14px", marginBottom: 24 }}>GRID · LIVE</span>
        <h1 style={{ margin: "0 0 16px", fontSize: 58, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>Neural <span style={{ color: "#00FFB2", textShadow: "0 0 60px rgba(0,255,178,0.5)" }}>Grid</span></h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.7 }}>Watch the grid fire as you move. Every node a pulse. Every cursor a signal.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em" }}>Get Started</button>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 24px", fontSize: 13, cursor: "pointer" }}>Explore</button>
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { width: "100%", height: "100%", minHeight: 160, background: "#020204", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,178,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(0,255,178,0.1) 1px, transparent 1px)", backgroundSize: "22px 22px" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,255,178,0.06) 0%, #020204 70%)" } }),
        React.createElement("div", { style: { position: "absolute", left: "30%", top: "40%", width: 5, height: 5, borderRadius: "50%", background: "#00FFB2", boxShadow: "0 0 14px 6px rgba(0,255,178,0.5)" } }),
        React.createElement("div", { style: { position: "absolute", left: "65%", top: "60%", width: 4, height: 4, borderRadius: "50%", background: "#00FFB2", boxShadow: "0 0 10px 4px rgba(0,255,178,0.35)" } }),
        React.createElement("div", { style: { position: "absolute", left: "50%", top: "25%", width: 3, height: 3, borderRadius: "50%", background: "#00FFB2", boxShadow: "0 0 8px 3px rgba(0,255,178,0.4)" } })
      ),
    },

    {
      id: "bg-cosmic-dust",
      name: "Cosmic Dust",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "Three CSS-animated star layers drift at different speeds and scales, creating a deep-space parallax illusion. Zero JavaScript — pure CSS keyframes.",
      prompt: `Create a full-section background called CosmicDust. Black background #000008. Three absolutely positioned layers using CSS backgroundImage radial-gradient dots: Layer 1 (1.5px dots, 80px spacing, opacity 0.55, 12s drift animation), Layer 2 (1px dots, 48px spacing, blue-tinted, offset 24px, 8s reverse drift), Layer 3 (0.6px dots, 28px spacing, faint, 5s drift). Use @keyframes inside a <style> tag for three translate animations. Radial vignette masks edges. Center glow in blue #38BDF8. Centered content: monospace badge, 58px headline with "Stars" in #38BDF8 with glow, subtitle, and ghost CTA button. Inline styles only.`,
      code: `export default function CosmicDust() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 580, background: "#000008", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{\`
        @keyframes cdrift1 { 0% { transform: translate(0,0); } 100% { transform: translate(-40px,-30px); } }
        @keyframes cdrift2 { 0% { transform: translate(0,0); } 100% { transform: translate(30px,-50px); } }
        @keyframes cdrift3 { 0% { transform: translate(0,0); } 100% { transform: translate(-20px,40px); } }
      \`}</style>

      <div style={{ position: "absolute", inset: "-60px", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.55) 1.5px, transparent 1.5px)", backgroundSize: "80px 80px", animation: "cdrift1 12s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: "-40px", backgroundImage: "radial-gradient(circle, rgba(160,220,255,0.35) 1px, transparent 1px)", backgroundSize: "48px 48px", backgroundPosition: "24px 24px", animation: "cdrift2 8s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", inset: "-30px", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 0.6px, transparent 0.6px)", backgroundSize: "28px 28px", backgroundPosition: "14px 7px", animation: "cdrift3 5s ease-in-out infinite alternate" }} />

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at center, transparent 0%, #000008 72%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 40% 30% at center, rgba(56,189,248,0.05) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 32px" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.4em", color: "#38BDF8", marginBottom: 24, fontFamily: "monospace", opacity: 0.8 }}>COSMIC · DUST</div>
        <h1 style={{ margin: "0 0 16px", fontSize: 58, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>Among the <span style={{ color: "#38BDF8", textShadow: "0 0 60px rgba(56,189,248,0.55)" }}>Stars</span></h1>
        <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 16, maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.7 }}>Three layers of stars drifting at different depths. A parallax universe — no libraries needed.</p>
        <button style={{ background: "rgba(56,189,248,0.1)", color: "#38BDF8", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>Explore cosmos</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { width: "100%", height: "100%", minHeight: 160, background: "#000008", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", inset: "-10px", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)", backgroundSize: "24px 24px" } }),
        React.createElement("div", { style: { position: "absolute", inset: "-10px", backgroundImage: "radial-gradient(circle, rgba(160,220,255,0.3) 0.7px, transparent 0.7px)", backgroundSize: "13px 13px", backgroundPosition: "6px 6px" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 20%, #000008 72%)" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 35% 25% at center, rgba(56,189,248,0.06) 0%, transparent 70%)" } })
      ),
    },

    {
      id: "bg-aurora-drift",
      name: "Aurora Drift",
      vibe: "Glassmorphism",
      difficulty: "Medium",
      desc: "Two layers of diagonal multi-color stripes animate in opposite directions behind a glassmorphic card. Cyan, violet, blue, and pink aurora light — pure CSS, no JS.",
      prompt: `Create a full-section background called AuroraDrift. Dark background #06030f. Two absolutely-positioned divs with diagonal repeating-linear-gradient stripe patterns (135deg and -45deg), each with different rainbow stripe colors (rgba(0,255,178,0.04), rgba(167,139,250,0.05), rgba(56,189,248,0.04), rgba(249,168,212,0.04)) and different gap spacings. Animate each layer with background-position shift (@keyframes, 8s and 12s, opposite directions). Linear gradient fade top and bottom. Center: glassmorphic card (backdrop-filter blur(20px), rgba white border, inner top highlight), headline with gradient text clip on key word, subtitle, CTA. Inline styles only.`,
      code: `export default function AuroraDrift() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 580, background: "#06030f", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{\`
        @keyframes adrift { 0% { background-position: 0 0; } 100% { background-position: 400px 0; } }
        @keyframes adrift2 { 0% { background-position: 0 0; } 100% { background-position: -320px 0; } }
      \`}</style>

      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 60px, rgba(0,255,178,0.04) 60px, rgba(0,255,178,0.04) 62px, transparent 62px, transparent 100px, rgba(167,139,250,0.05) 100px, rgba(167,139,250,0.05) 102px, transparent 102px, transparent 140px, rgba(56,189,248,0.04) 140px, rgba(56,189,248,0.04) 142px, transparent 142px, transparent 180px, rgba(249,168,212,0.04) 180px, rgba(249,168,212,0.04) 182px, transparent 182px, transparent 220px)", backgroundSize: "400px 400px", animation: "adrift 8s linear infinite" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(167,139,250,0.03) 80px, rgba(167,139,250,0.03) 82px, transparent 82px, transparent 120px, rgba(0,255,178,0.03) 120px, rgba(0,255,178,0.03) 122px, transparent 122px, transparent 160px)", backgroundSize: "320px 320px", animation: "adrift2 12s linear infinite" }} />

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(167,139,250,0.05) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #06030f 0%, transparent 15%, transparent 85%, #06030f 100%)" }} />

      <div style={{ position: "relative", zIndex: 2, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "48px 56px", textAlign: "center", maxWidth: 520, boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "#A78BFA", marginBottom: 22, fontFamily: "monospace", fontWeight: 600 }}>AURORA · DRIFT</div>
        <h1 style={{ margin: "0 0 14px", fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>Beyond the <span style={{ background: "linear-gradient(135deg, #00FFB2, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Veil</span></h1>
        <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 15, margin: "0 0 28px", lineHeight: 1.7 }}>Diagonal aurora light stripes animate behind a glass card. Luxury, in motion.</p>
        <button style={{ background: "linear-gradient(135deg, rgba(0,255,178,0.15), rgba(167,139,250,0.15))", color: "#fff", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 9, padding: "12px 32px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>Experience it</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { width: "100%", height: "100%", minHeight: 160, background: "#06030f", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 18px, rgba(0,255,178,0.09) 18px, rgba(0,255,178,0.09) 19px, transparent 19px, transparent 28px, rgba(167,139,250,0.1) 28px, rgba(167,139,250,0.1) 29px, transparent 29px, transparent 38px, rgba(56,189,248,0.08) 38px, rgba(56,189,248,0.08) 39px)", backgroundSize: "100px 100px" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, #06030f 0%, transparent 25%, transparent 75%, #06030f 100%)" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(167,139,250,0.06) 0%, transparent 60%)" } })
      ),
    },

    {
      id: "bg-horizon-scanner",
      name: "Horizon Scanner",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "Horizontal scan lines with a neon beam that sweeps top-to-bottom on a 3.5s loop. The lines fade to the right with a gradient mask. Left-aligned content with a raw, radar-room aesthetic.",
      prompt: `Create a full-section background called HorizonScanner. Dark background #030305. Horizontal lines via backgroundImage linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px), 36px spacing. Animated scan beam: absolutely-positioned 2px-high div with linear-gradient (bright left, fading right) and green glow box-shadow. Keyframe 'scan' animates top from -4px to calc(100% + 4px) over 3.5s ease-in-out infinite. Fade-right mask: linear-gradient(to right, transparent 30%, #030305 75%). Subtle left-edge green glow. Left-aligned content (padding-left 72px): badge, 56px headline, subtitle, green solid CTA. Inline styles only.`,
      code: `export default function HorizonScanner() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 580, background: "#030305", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "flex-start", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{\`
        @keyframes hscan { 0% { top: -4px; opacity: 0; } 5% { opacity: 1; } 92% { opacity: 1; } 100% { top: calc(100% + 4px); opacity: 0; } }
      \`}</style>

      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "100% 36px" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 30%, #030305 75%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(to right, rgba(0,255,178,0.95) 0%, rgba(0,255,178,0.5) 25%, rgba(0,255,178,0.15) 55%, transparent 75%)", boxShadow: "0 0 18px 5px rgba(0,255,178,0.28)", animation: "hscan 3.5s ease-in-out infinite" }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: "linear-gradient(to right, rgba(0,255,178,0.035), transparent)" }} />

      <div style={{ position: "relative", zIndex: 2, padding: "0 0 0 72px", maxWidth: 500 }}>
        <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 9, letterSpacing: "0.35em", color: "#00FFB2", background: "rgba(0,255,178,0.07)", border: "1px solid rgba(0,255,178,0.2)", borderRadius: 4, padding: "4px 12px", marginBottom: 22 }}>SCANNING · HORIZON</span>
        <h1 style={{ margin: "0 0 16px", fontSize: 56, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.0 }}>Horizon<br /><span style={{ color: "#00FFB2" }}>Scanner</span></h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, margin: "0 0 32px", lineHeight: 1.7, maxWidth: 380 }}>Horizontal scan lines with a neon beam that sweeps forever. The grid fades right into nothing.</p>
        <button style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: "0.04em" }}>Start Scanning</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { width: "100%", height: "100%", minHeight: 160, background: "#030305", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.065) 1px, transparent 1px)", backgroundSize: "100% 14px" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 35%, #030305 75%)" } }),
        React.createElement("div", { style: { position: "absolute", left: 0, right: 0, top: "38%", height: 1, background: "linear-gradient(to right, rgba(0,255,178,0.95), rgba(0,255,178,0.4) 30%, transparent 65%)", boxShadow: "0 0 8px 3px rgba(0,255,178,0.35)" } }),
        React.createElement("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, rgba(0,255,178,0.03), transparent)" } })
      ),
    },

    {
      id: "bg-digital-rain",
      name: "Digital Rain",
      vibe: "Neon & Cyber",
      difficulty: "Advanced",
      desc: "Vertical grid lines with six independently animated neon streaks falling at staggered speeds and delays — a cinematic matrix-rain effect that fades into the void below.",
      prompt: `Create a full-section background called DigitalRain. Very dark green-tinted background #020403. Vertical lines via backgroundImage linear-gradient(to right, rgba(0,255,100,0.05) 1px, transparent 1px), 44px spacing. Six animated 'rain drop' divs (1px wide, 55–100px tall) positioned at different left percentages. Each is a linear-gradient from transparent to bright rgba(0,255,100,0.9) to transparent, with green glow box-shadow. Three @keyframes (fall-1, fall-2, fall-3) animate top from -80px to 110%. Each drop uses a different keyframe + animation-delay for stagger. Fade-to-bottom mask: linear-gradient(to bottom, transparent 55%, #020403 100%). Top green glow. Content: centered, badge in monospace, 58px headline with "Rain" in bright green with glow, subtitle, ghost CTA. Inline styles only.`,
      code: `export default function DigitalRain() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 580, background: "#020403", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{\`
        @keyframes dfall1 { 0% { top: -80px; opacity: 0; } 8% { opacity: 1; } 90% { opacity: 0.7; } 100% { top: 110%; opacity: 0; } }
        @keyframes dfall2 { 0% { top: -60px; opacity: 0; } 10% { opacity: 0.85; } 88% { opacity: 0.5; } 100% { top: 110%; opacity: 0; } }
        @keyframes dfall3 { 0% { top: -40px; opacity: 0; } 6% { opacity: 1; } 92% { opacity: 0.8; } 100% { top: 110%; opacity: 0; } }
      \`}</style>

      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgba(0,255,100,0.05) 1px, transparent 1px)", backgroundSize: "44px 100%" }} />

      <div style={{ position: "absolute", left: "11%", width: 1, height: 90, background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.95), rgba(0,255,100,0.4), transparent)", boxShadow: "0 0 7px 2px rgba(0,255,100,0.45)", animation: "dfall1 2.2s ease-in infinite" }} />
      <div style={{ position: "absolute", left: "25%", width: 1, height: 65, background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.7), transparent)", boxShadow: "0 0 4px 1px rgba(0,255,100,0.3)", animation: "dfall2 1.7s ease-in infinite 0.4s" }} />
      <div style={{ position: "absolute", left: "43%", width: 1, height: 105, background: "linear-gradient(to bottom, transparent, rgba(0,255,100,1), rgba(0,255,100,0.5), transparent)", boxShadow: "0 0 9px 2px rgba(0,255,100,0.55)", animation: "dfall3 1.9s ease-in infinite 0.2s" }} />
      <div style={{ position: "absolute", left: "61%", width: 1, height: 75, background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.85), transparent)", boxShadow: "0 0 5px 1px rgba(0,255,100,0.35)", animation: "dfall1 2.5s ease-in infinite 0.8s" }} />
      <div style={{ position: "absolute", left: "79%", width: 1, height: 88, background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.9), rgba(0,255,100,0.4), transparent)", boxShadow: "0 0 7px 2px rgba(0,255,100,0.45)", animation: "dfall2 2.1s ease-in infinite 1.1s" }} />
      <div style={{ position: "absolute", left: "88%", width: 1, height: 55, background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.6), transparent)", boxShadow: "0 0 4px 1px rgba(0,255,100,0.28)", animation: "dfall3 1.6s ease-in infinite 0.6s" }} />

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #020403 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 180, background: "linear-gradient(to bottom, rgba(0,255,100,0.03), transparent)" }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 32px", marginTop: -50 }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#00ff64", letterSpacing: "0.35em", marginBottom: 22, opacity: 0.8 }}>RAIN · VERTICAL</div>
        <h1 style={{ margin: "0 0 16px", fontSize: 58, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>Digital <span style={{ color: "#00ff64", textShadow: "0 0 50px rgba(0,255,100,0.6)" }}>Rain</span></h1>
        <p style={{ color: "rgba(255,255,255,0.27)", fontSize: 16, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.7 }}>Six neon drops fall along vertical grid lines at staggered speeds. The grid fades into the void below.</p>
        <button style={{ background: "rgba(0,255,100,0.1)", color: "#00ff64", border: "1px solid rgba(0,255,100,0.3)", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>Enter the matrix</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { width: "100%", height: "100%", minHeight: 160, background: "#020403", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgba(0,255,100,0.07) 1px, transparent 1px)", backgroundSize: "18px 100%" } }),
        React.createElement("div", { style: { position: "absolute", left: "14%", width: 1, height: 55, top: "5%", background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.9), transparent)", boxShadow: "0 0 6px 2px rgba(0,255,100,0.4)" } }),
        React.createElement("div", { style: { position: "absolute", left: "36%", width: 1, height: 70, top: "0%", background: "linear-gradient(to bottom, transparent, rgba(0,255,100,1), transparent)", boxShadow: "0 0 8px 2px rgba(0,255,100,0.5)" } }),
        React.createElement("div", { style: { position: "absolute", left: "55%", width: 1, height: 45, top: "15%", background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.8), transparent)", boxShadow: "0 0 5px 1px rgba(0,255,100,0.35)" } }),
        React.createElement("div", { style: { position: "absolute", left: "72%", width: 1, height: 60, top: "5%", background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.7), transparent)" } }),
        React.createElement("div", { style: { position: "absolute", left: "88%", width: 1, height: 35, top: "20%", background: "linear-gradient(to bottom, transparent, rgba(0,255,100,0.6), transparent)" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #020403 100%)" } })
      ),
    },

    {
      id: "bg-void-floor",
      name: "Void Floor",
      vibe: "Brutalist",
      difficulty: "Medium",
      desc: "A 3D perspective checkerboard floor vanishes toward the horizon using CSS perspective + rotateX. A content card floats above it with a gentle CSS float animation — raw, dramatic, bold.",
      prompt: `Create a full-section background called VoidFloor. Background #050507. A 3D checkerboard floor: absolutely-positioned div (bottom: -80, left/right: -200, height: 65%) with CSS checkerboard backgroundImage (linear-gradient 45deg pattern, rgba(255,255,255,0.04) squares), backgroundSize 48px, transform: perspective(600px) rotateX(55deg), transformOrigin: bottom center. A vanishing-point glow line rising from bottom center (2px wide div, violet gradient). Linear gradient fades top (dark over floor) and bottom. Content card floats with @keyframes float (translateY -8px cycle, 4s). Card has centered text: monospace badge, 58px headline with "Floor" in #A78BFA with glow, subtitle, violet ghost CTA. Inline styles only.`,
      code: `export default function VoidFloor() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 580, background: "#050507", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{\`
        @keyframes vfloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      \`}</style>

      <div style={{ position: "absolute", bottom: -80, left: -200, right: -200, height: "65%", backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.045) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.045) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.045) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.045) 75%)", backgroundSize: "48px 48px", backgroundPosition: "0 0, 0 24px, 24px -24px, -24px 0px", transform: "perspective(600px) rotateX(55deg)", transformOrigin: "bottom center" }} />

      <div style={{ position: "absolute", bottom: "18%", left: "50%", transform: "translateX(-50%)", width: 2, height: "45%", background: "linear-gradient(to top, rgba(167,139,250,0.7), rgba(167,139,250,0.1), transparent)", boxShadow: "0 0 30px 12px rgba(167,139,250,0.1)" }} />

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "48%", background: "linear-gradient(to bottom, #050507, transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(to top, #050507, transparent)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 35%, rgba(167,139,250,0.04) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 32px", animation: "vfloat 4s ease-in-out infinite" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.35em", color: "#A78BFA", marginBottom: 22, opacity: 0.8 }}>DEPTH · BOARD</div>
        <h1 style={{ margin: "0 0 16px", fontSize: 58, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>Void <span style={{ color: "#A78BFA", textShadow: "0 0 60px rgba(167,139,250,0.65)" }}>Floor</span></h1>
        <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 16, maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.7 }}>A 3D perspective checkerboard vanishes into the horizon. The card floats endlessly above.</p>
        <button style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>Step inside</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { width: "100%", height: "100%", minHeight: 160, background: "#050507", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", bottom: -30, left: -60, right: -60, height: "60%", backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.07) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.07) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.07) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.07) 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px", transform: "perspective(200px) rotateX(52deg)", transformOrigin: "bottom center" } }),
        React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to bottom, #050507, transparent)" } }),
        React.createElement("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to top, #050507, transparent)" } }),
        React.createElement("div", { style: { position: "absolute", bottom: "20%", left: "50%", transform: "translateX(-50%)", width: 1, height: "40%", background: "linear-gradient(to top, rgba(167,139,250,0.7), rgba(167,139,250,0.1), transparent)", boxShadow: "0 0 20px 8px rgba(167,139,250,0.08)" } }),
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(167,139,250,0.05) 0%, transparent 70%)" } })
      ),
    },

    {
      id: "bg-clean-grid",
      name: "Grid Background",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "A crisp CSS grid on a near-black canvas, masked by a radial fade that dissolves the lines into darkness at the edges. Pure CSS — one div, zero JavaScript.",
      prompt: `Create a section background component called GridBackground. Background #0c0c0e. Two CSS linear-gradients as backgroundImage: to-right and to-bottom, both rgba(255,255,255,0.07) 1px lines, transparent, 40px spacing. Apply maskImage (and WebkitMaskImage) with radial-gradient(ellipse 80% 80% at center, black 30%, transparent 100%) so lines fade into the edges. Centered content: small monospace label at top, large bold headline "Grid Background", monospace subtitle "With (fade-edges) Mask" in gray, and a minimal ghost CTA button. Use position relative, min-height 520. Inline styles only.`,
      code: `export default function GridBackground() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 520, background: "#0c0c0e", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 80% 80% at center, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at center, black 30%, transparent 100%)",
      }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 32px" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)", marginBottom: 22 }}>GRID · BACKGROUND</div>
        <h1 style={{ margin: "0 0 14px", fontSize: 58, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>Grid Background</h1>
        <p style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.28)", fontSize: 15, margin: "0 auto 32px", lineHeight: 1.7, maxWidth: 380 }}>With (fade-edges) Mask</p>
        <button style={{ background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, padding: "12px 28px", fontSize: 13, cursor: "pointer", letterSpacing: "0.04em" }}>Discover more →</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { width: "100%", height: "100%", minHeight: 160, background: "#0c0c0e", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: {
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 80% at center, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at center, black 30%, transparent 100%)",
        } })
      ),
    },
  ],
};

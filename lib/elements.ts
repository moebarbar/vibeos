import React from "react";

export interface Element {
  id: string;
  name: string;
  vibe: string;
  difficulty: "Simple" | "Medium" | "Advanced";
  desc: string;
  prompt: string;
  preview: React.FC;
}

export const VIBES = ["All", "Dark & Minimal", "Glassmorphism", "Brutalist", "Soft & Pastel", "Neon & Cyber"];

export const CATEGORIES = [
  { id: "buttons",    label: "Buttons & CTAs",   icon: "⬡" },
  { id: "cards",      label: "Cards & Pricing",   icon: "▣" },
  { id: "hero",       label: "Hero Sections",     icon: "◈" },
  { id: "nav",        label: "Navigation",        icon: "≡" },
  { id: "forms",      label: "Forms & Inputs",    icon: "▤" },
  { id: "dashboards", label: "Dashboards",        icon: "◫" },
];

export const ELEMENTS: Record<string, Element[]> = {
  buttons: [
    {
      id: "btn-neon",
      name: "Neon Glow CTA",
      vibe: "Neon & Cyber",
      difficulty: "Simple",
      desc: "Pulsing neon green button with glow animation on hover.",
      prompt: `Create a React button component with a neon green glow effect. Style: dark background #0a0a0a, bright green text #00ff88, box-shadow glow that pulses on hover using CSS keyframe animation (0 0 12px #00ff8855 at rest, 0 0 28px #00ff88aa on hover), border 1px solid #00ff88, border-radius 6px, font-family monospace, padding 12px 28px, letter-spacing 0.08em. On hover: increase glow and scale(1.02). On active: scale(0.98). Export as default function GlowButton. Use only inline styles and React.`,
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
      preview: () => React.createElement("div", { style: { background: "linear-gradient(135deg,#667eea,#764ba2)", padding: "28px 24px", borderRadius: 10 } },
        React.createElement("button", { style: { backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 10, color: "white", padding: "10px 22px", fontSize: 13, cursor: "pointer" } }, "Learn More")
      ),
    },
  ],

  cards: [
    {
      id: "card-pricing-dark",
      name: "Dark Pricing Card",
      vibe: "Dark & Minimal",
      difficulty: "Simple",
      desc: "SaaS pricing card with popular badge, features, and CTA.",
      prompt: `Create a React pricing card component. Dark theme: background #111, border 1px solid #222, border-radius 16px, padding 32px, max-width 260px. Include: plan name (small caps, muted color #555), large price (white, 36px, bold, with /month), horizontal divider, feature list with green ✓ checkmarks (each feature in a flex row), primary CTA button (full-width, bg #00FFB2, black text). Popular variant: border-color #00FFB2 with "MOST POPULAR" pill badge (absolute positioned, top -11px, centered, bg #00FFB2). Props: planName, price, features (array), isPopular, onSelect. Export as default function PricingCard.`,
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
      preview: () => React.createElement("div", { style: { background: "white", border: "1px solid #f0e6ff", borderRadius: 16, padding: 20, width: 180, boxShadow: "0 4px 16px rgba(167,139,250,0.1)" } },
        React.createElement("div", { style: { width: 40, height: 40, background: "#f3e8ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 } }, "✨"),
        React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 } }, "AI Powered"),
        React.createElement("div", { style: { fontSize: 11, color: "#6b7280", lineHeight: 1.6 } }, "Every feature backed by Claude for insane results.")
      ),
    },
  ],

  hero: [
    {
      id: "hero-dark",
      name: "Dark SaaS Hero",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "Full-viewport dark hero with dot grid, gradient glow, badge, and social proof.",
      prompt: `Create a full-viewport React hero section for a SaaS product. Background #070707 with radial-gradient dot pattern (radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), background-size 36px 36px). Radial glow overlay (rgba(0,255,178,0.05) at top center). Content max-width 700px centered. Elements top to bottom: small badge pill (bg rgba(0,255,178,0.1), border rgba(0,255,178,0.25), accent dot + "Now in public beta"), headline clamp(38px,6vw,70px) weight 800 white tight letter-spacing -0.035em (split across two lines with second line in accent color #00FFB2), subtitle 18px rgba(255,255,255,0.42) line-height 1.75, two CTAs (primary: accent color bg + black text, secondary: transparent + muted border), stats row (3 metrics, separated by thin border-top). Fade-in + translateY animation on load using useState + useEffect. Export as default function HeroSection.`,
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
    {
      id: "form-auth-dark",
      name: "Dark Auth Form",
      vibe: "Dark & Minimal",
      difficulty: "Medium",
      desc: "Complete dark login form with show/hide password and Google OAuth.",
      prompt: `Create a React dark login form component. Card: background #111, border 1px solid #1e1e1e, border-radius 20px, padding 40px, max-width 400px centered on dark #0a0a0a background. Content: logo icon (gradient 42x42 border-radius 11px) + product name centered. Heading "Welcome back" + subtitle. Email input (full-width, bg #0d0d0d, border #1e1e1e, br 8px, white text, padding 11px 14px). Password input with eye show/hide toggle button (absolute right 12px). "Forgot password?" right-aligned link. Primary submit button (full-width, bg #00FFB2, black bold text). Divider "or". Google OAuth button (full-width, transparent, border #1e1e1e, gray text). "No account? Sign up" footer. Use useState for showPassword and screen state (login/signup/forgot). Export as default function AuthForm.`,
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
  ],

  dashboards: [
    {
      id: "dash-saas",
      name: "SaaS Metrics Dashboard",
      vibe: "Dark & Minimal",
      difficulty: "Advanced",
      desc: "Full dark SaaS dashboard with sidebar, KPI cards, SVG revenue chart, and activity feed.",
      prompt: `Create a complete React SaaS metrics dashboard. Dark theme #080808. Use useState for range selection. LAYOUT: left sidebar (200px, #0d0d0d, border-right #111) + main content area. SIDEBAR: logo, nav items with emoji icons (Dashboard, Analytics, Customers, Billing, Settings), active item highlighted. MAIN: header row (greeting + date + "New Report" button in accent color #00FFB2), 4 KPI cards in grid (MRR $8,420 ↑12%, Active Users 1,284 ↑8%, Churn Rate 2.4% ↑0.2%, NPS 68 ↑4pts — green for positive, red for negative), full-width SVG line chart (responsive, smooth path, gradient fill below line, time range tabs 7d/30d/90d), 2-column bottom section (recent activity timeline + top customers table with plan badges). All inline styles, no external deps. Export as default function Dashboard.`,
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
};

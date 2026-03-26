// Premium Modern Components for Element Forge
// 3D effects, animated backgrounds, glassmorphism, modern aesthetics

import React from "react";

export const PREMIUM_ELEMENTS = {
  buttons: [
    {
      id: "btn-3d-float",
      name: "3D Floating Button",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "A pill button with realistic 3D floating effect, subtle shadow depth, and press animation.",
      prompt: `Create a React 3D floating button component. Pill shape (border-radius: 9999px), dark background #111, white text. Use CSS transform perspective(1000px) rotateX() with mouse tracking for 3D tilt effect. On hover: lift up with enhanced shadow (0 20px 40px rgba(0,0,0,0.4)). On press: scale down and reduce shadow. Track mouse position relative to button center for dynamic lighting effect. Smooth transitions.`,
      code: `import { useRef, useState } from "react";

export function Floating3DButton({ children = "Get Started", onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(y * -15);
    setRotateY(x * 15);
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {}}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        padding: "16px 40px",
        fontSize: 16,
        fontWeight: 600,
        color: "#fff",
        background: "linear-gradient(145deg, #1a1a1a, #0a0a0a)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 9999,
        cursor: "pointer",
        transform: \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale(\${isPressed ? 0.95 : 1})\`,
        boxShadow: isPressed 
          ? "0 5px 15px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.05)"
          : "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 40, display: "flex", justifyContent: "center", background: "#0a0a0a" } },
        React.createElement("button", { style: { padding: "14px 36px", fontSize: 14, fontWeight: 600, color: "#fff", background: "linear-gradient(145deg,#1a1a1a,#0a0a0a)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9999, boxShadow: "0 15px 35px rgba(0,0,0,0.4)" } }, "Get Started")
      ),
    },
    {
      id: "btn-animated-arrow",
      name: "Animated Arrow Button",
      vibe: "Soft & Pastel",
      difficulty: "Medium" as const,
      desc: "Split button with animated arrow that slides and morphs on hover.",
      prompt: `Create a React split button with animated arrow. Container: white background, rounded-xl, flex layout. Left: text "Get Started". Right: gray square with arrow icon. On hover: arrow slides right and transforms, right section expands slightly. Use framer-motion for smooth arrow animation.`,
      code: `import { motion } from "framer-motion";
import { useState } from "react";

export function AnimatedArrowButton({ text = "Get Started", onClick }: { text?: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        padding: "4px",
        background: "#fff",
        border: "none",
        borderRadius: 12,
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        fontFamily: "inherit",
      }}
    >
      <span style={{ padding: "12px 20px", fontSize: 15, fontWeight: 500, color: "#111" }}>{text}</span>
      <motion.div
        animate={{ width: hovered ? 44 : 40, backgroundColor: hovered ? "#333" : "#e5e5e5" }}
        style={{
          height: 40,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          animate={{ x: hovered ? 2 : 0 }}
          style={{ color: hovered ? "#fff" : "#333" }}
        >
          <path
            fill="currentColor"
            d="M6.5 3.5L11 8l-4.5 4.5L5 11l3-3-3-3z"
          />
        </motion.svg>
      </motion.div>
    </button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 40, display: "flex", justifyContent: "center", background: "#111" } },
        React.createElement("button", { style: { display: "flex", alignItems: "center", padding: "4px", background: "#fff", border: "none", borderRadius: 10 } },
          React.createElement("span", { style: { padding: "10px 18px", fontSize: 14, fontWeight: 500, color: "#111" } }, "Get Started"),
          React.createElement("div", { style: { width: 36, height: 36, background: "#e5e5e5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" } }, "→")
        )
      ),
    },
  ],

  backgrounds: [
    {
      id: "bg-animated-paths",
      name: "Animated Background Paths",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Curved animated lines flowing across the background creating depth and motion.",
      prompt: `Create a full-section background with animated curved paths. Dark background #0a0a0a. Multiple SVG paths with gradient strokes (rgba(255,255,255,0.1) to transparent) that follow bezier curves. Animate paths with CSS stroke-dasharray/stroke-dashoffset for drawing effect. Paths should flow from left to right at different speeds. Add subtle parallax on mouse movement.`,
      code: `import { useEffect, useState } from "react";

export function AnimatedPathsBackground() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      setOffset(prev => (prev + 0.5) % 100);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const paths = [
    "M -100 200 Q 200 100 400 200 T 900 200 T 1400 200",
    "M -100 300 Q 200 200 400 300 T 900 300 T 1400 300",
    "M -100 400 Q 200 300 400 400 T 900 400 T 1400 400",
    "M -100 500 Q 200 400 400 500 T 900 500 T 1400 500",
    "M -100 600 Q 200 500 400 600 T 900 600 T 1400 600",
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a0a0a", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={1.5}
            style={{
              transform: \`translateX(-\${offset + i * 20}px)\`,
              transition: "none",
            }}
          />
        ))}
      </svg>
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.03em" }}>Background Paths</h1>
        <button style={{ padding: "14px 32px", background: "#111", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9999, fontSize: 14, cursor: "pointer" }}>Discover Excellence →</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 180, background: "#0a0a0a", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("svg", { style: { position: "absolute", inset: 0, width: "100%", height: "100%" } },
          React.createElement("path", { d: "M -100 60 Q 100 30 300 60 T 700 60", fill: "none", stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }),
          React.createElement("path", { d: "M -100 90 Q 100 60 300 90 T 700 90", fill: "none", stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }),
          React.createElement("path", { d: "M -100 120 Q 100 90 300 120 T 700 120", fill: "none", stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 })
        ),
        React.createElement("div", { style: { position: "relative", zIndex: 2, textAlign: "center", color: "#fff" } },
          React.createElement("div", { style: { fontSize: 22, fontWeight: 800, marginBottom: 8 } }, "Background Paths"),
          React.createElement("button", { style: { padding: "8px 20px", background: "#111", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9999, fontSize: 11 } }, "Discover →")
        )
      ),
    },
  ],

  hero: [
    {
      id: "hero-v0-style",
      name: "v0 Search Hero",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Modern dark hero with large search input, floating pills/chips, and glassmorphic effects.",
      prompt: `Create a React hero section like v0/ChatGPT interface. Dark background #0a0a0a. Large centered headline "What can I help you ship?". Below: wide glassmorphic input container with subtle border, attachment icon left, placeholder text, send button right. Below input: row of pill-shaped suggestion buttons with icons. Use backdrop-filter blur, rgba borders, subtle shadows.`,
      code: `import { useState } from "react";
import { motion } from "framer-motion";

const SUGGESTIONS = [
  { icon: "📷", label: "Clone a Screenshot" },
  { icon: "🎨", label: "Import from Figma" },
  { icon: "📁", label: "Upload a Project" },
  { icon: "🖥️", label: "Landing Page" },
  { icon: "👤", label: "Sign Up Form" },
];

export function V0SearchHero() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 600, color: "#fff", margin: "0 0 40px", textAlign: "center" }}
      >
        What can I help you ship?
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          width: "100%",
          maxWidth: 720,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }}>📎</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 16,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 10, color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>+ Project</button>
          <button style={{ width: 32, height: 32, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 24 }}
      >
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 9999,
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "inherit",
            }}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 200, background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 20px" } },
        React.createElement("div", { style: { fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 20 } }, "What can I help you ship?"),
        React.createElement("div", { style: { width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px" } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
            React.createElement("span", { style: { color: "rgba(255,255,255,0.4)", fontSize: 14 } }, "📎"),
            React.createElement("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: 13 } }, "Ask a question..."),
            React.createElement("button", { style: { marginLeft: "auto", padding: "4px 10px", background: "rgba(255,255,255,0.08)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: 10 } }, "+ Project")
          )
        ),
        React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
          ["📷 Screenshot", "🎨 Figma", "📁 Upload"].map((s, i) =>
            React.createElement("button", { key: i, style: { padding: "6px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9999, color: "rgba(255,255,255,0.6)", fontSize: 10 } }, s)
          )
        )
      ),
    },
  ],

  cards: [
    {
      id: "card-glass-tweet",
      name: "Glassmorphic Tweet Card",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Dark glassmorphic card with avatar, verified badge, and thread conversation.",
      prompt: `Create a React glassmorphic tweet/thread card. Dark background with subtle gradient border. Rounded corners (24px), padding 24px. Header: circular avatar with gradient ring, name with verified checkmark badge, handle, X logo top-right. Content: tweet text. Footer: date, reply preview with nested indentation. Use backdrop-filter blur, rgba borders.`,
      code: `export function GlassTweetCard() {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 420,
        background: "linear-gradient(145deg, rgba(30,30,35,0.9), rgba(20,20,25,0.95))",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: "2px",
      }}
    >
      <div style={{ background: "linear-gradient(145deg, rgba(25,25,30,0.98), rgba(15,15,20,0.98))", borderRadius: 22, padding: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎨</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Dorian</span>
              <span style={{ color: "#3b82f6", fontSize: 14 }}>✓</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>@dorian_baffier</div>
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }}>𝕏</span>
        </div>

        {/* Content */}
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.6, margin: "0 0 16px" }}>
          All components from KokonutUI can now be open in @v0 🎉<br/><br/>
          1. Click on Open in V0<br/>
          2. Customize with prompts<br/>
          3. Deploy to your app
        </p>

        {/* Date */}
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 16 }}>Jan 18, 2025</div>

        {/* Reply */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <img src="/avatar.png" alt="" style={{ width: 36, height: 36, borderRadius: "50%" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>shadcn</span>
                <span style={{ color: "#3b82f6", fontSize: 12 }}>✓</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>@shadcn · Jan 18</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}>Awesome.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 30, display: "flex", justifyContent: "center", background: "#0a0a0a" } },
        React.createElement("div", { style: { maxWidth: 300, background: "linear-gradient(145deg,rgba(30,30,35,0.9),rgba(20,20,25,0.95))", borderRadius: 18, padding: 16 } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } },
            React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#667eea,#764ba2)" } }),
            React.createElement("div", null,
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } },
                React.createElement("span", { style: { color: "#fff", fontWeight: 600, fontSize: 12 } }, "Dorian"),
                React.createElement("span", { style: { color: "#3b82f6", fontSize: 10 } }, "✓")
              ),
              React.createElement("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 10 } }, "@dorian_baffier")
            ),
            React.createElement("span", { style: { marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 14 } }, "𝕏")
          ),
          React.createElement("p", { style: { color: "rgba(255,255,255,0.8)", fontSize: 11, lineHeight: 1.5, marginBottom: 12 } }, "All components can now be open in @v0 🎉"),
          React.createElement("div", { style: { borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 } },
            React.createElement("div", { style: { display: "flex", gap: 8 } },
              React.createElement("div", { style: { width: 24, height: 24, borderRadius: "50%", background: "#333" } }),
              React.createElement("div", null,
                React.createElement("span", { style: { color: "#fff", fontWeight: 600, fontSize: 10 } }, "shadcn "),
                React.createElement("span", { style: { color: "rgba(255,255,255,0.4)", fontSize: 9 } }, "Jan 18"),
                React.createElement("p", { style: { color: "rgba(255,255,255,0.7)", fontSize: 10, margin: "2px 0 0" } }, "Awesome.")
              )
            )
          )
        )
      ),
    },
    {
      id: "card-subscribe-glass",
      name: "Glass Subscribe Card",
      vibe: "Soft & Pastel",
      difficulty: "Medium" as const,
      desc: "Clean card with badge, icon, gradient CTA button, and theme toggle.",
      prompt: `Create a React subscribe card. White/light background, rounded-2xl, padding 32px. Top: "New" badge (small pill, blue bg), icon (emoji in colored circle), title "Sigma Nuts", subtitle. Main heading large and bold. Description text. Full-width gradient CTA button at bottom. Use clean spacing, modern typography.`,
      code: `export function SubscribeCard() {
  return (
    <div
      style={{
        maxWidth: 360,
        background: "#fff",
        borderRadius: 24,
        padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
      }}
    >
      {/* Badge */}
      <span
        style={{
          display: "inline-block",
          padding: "4px 12px",
          background: "#e0e7ff",
          color: "#4f46e5",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 9999,
          marginBottom: 16,
        }}
      >
        New
      </span>

      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          😊
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>Sigma Nuts</span>
      </div>

      {/* Heading */}
      <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: "0 0 16px", lineHeight: 1.2 }}>
        This is supposed to be a cool title
      </h2>

      {/* Description */}
      <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6, margin: "0 0 24px" }}>
        Your description goes here but idk what to write so im gonna continue with this to just take up some of the space on here
      </p>

      {/* CTA */}
      <button
        style={{
          width: "100%",
          padding: "16px 24px",
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        Subscribe
      </button>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 30, display: "flex", justifyContent: "center", background: "#111" } },
        React.createElement("div", { style: { maxWidth: 260, background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 15px 40px rgba(0,0,0,0.1)" } },
          React.createElement("span", { style: { display: "inline-block", padding: "3px 10px", background: "#e0e7ff", color: "#4f46e5", fontSize: 10, fontWeight: 600, borderRadius: 9999, marginBottom: 12 } }, "New"),
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 } },
            React.createElement("div", { style: { width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#4f46e5)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 } }, "😊"),
            React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "#111" } }, "Sigma Nuts")
          ),
          React.createElement("h2", { style: { fontSize: 18, fontWeight: 800, color: "#111", margin: "0 0 10px" } }, "This is a cool title"),
          React.createElement("p", { style: { fontSize: 11, color: "#6b7280", margin: "0 0 16px" } }, "Your description goes here with some placeholder text..."),
          React.createElement("button", { style: { width: "100%", padding: "12px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 10 } }, "Subscribe")
        )
      ),
    },
  ],
};

// New Creative Components for Element Forge
// Import these and spread them into the ELEMENTS object

import React from "react";

export const NEW_ELEMENTS = {
  buttons: [
    {
      id: "btn-prism",
      name: "Prism Shimmer Button",
      vibe: "Neon & Cyber",
      difficulty: "Medium" as const,
      desc: "A dark button with an animated rainbow shimmer that continuously sweeps across the surface like light hitting a prism.",
      prompt: `Create a React button component called PrismShimmerButton using framer-motion. Dark background #0a0a0a, border that changes on hover, border-radius 12px, padding 14px 32px. Use motion.div for the shimmer with animate prop for infinite left-to-right sweep animation. Button text is white. On hover: border-color brightens, subtle box-shadow appears with scale effect.`,
      code: `import { motion } from "framer-motion";
import { useState } from "react";

export function PrismShimmerButton({ children = "Get Started", onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: "relative",
        background: "#0a0a0a",
        border: hovered ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "14px 32px",
        fontSize: 14,
        fontWeight: 600,
        color: "#fff",
        cursor: "pointer",
        overflow: "hidden",
        fontFamily: "inherit",
        boxShadow: hovered ? "0 0 30px rgba(255,255,255,0.08)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <span style={{ position: "relative", zIndex: 2 }}>{children}</span>
      <motion.div
        style={{
          position: "absolute",
          top: "-50%",
          width: 60,
          height: "200%",
          background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
        animate={{ left: ["-100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 24, display: "flex", justifyContent: "center", background: "#0a0a0a" } },
        React.createElement("button", { style: { position: "relative", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 28px", fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden" } },
          "Prism Button",
          React.createElement("div", { style: { position: "absolute", top: "-50%", left: "30%", width: 40, height: "200%", background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)" } })
        )
      ),
    },
    {
      id: "btn-neural-pulse",
      name: "Neural Pulse Button",
      vibe: "Neon & Cyber",
      difficulty: "Medium" as const,
      desc: "Button with expanding concentric pulse rings emanating outward like neural signals or sonar waves.",
      prompt: `Create a React button called NeuralPulseButton using framer-motion. Background: #00FFB2 (neon green), color: #000. Three motion.div elements as pulse rings behind the button. Animate scale from 1 to 1.6 and opacity from 0.6 to 0 over 2s. Each ring has staggered delay. Button has glow box-shadow.`,
      code: `import { motion } from "framer-motion";

export function NeuralPulseButton({ children = "Connect", onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: "relative",
        background: "#00FFB2",
        border: "none",
        borderRadius: 50,
        padding: "14px 32px",
        fontSize: 14,
        fontWeight: 700,
        color: "#000",
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: "0 0 20px rgba(0,255,178,0.4)",
      }}
    >
      <span style={{ position: "relative", zIndex: 2 }}>{children}</span>
      {[0, 0.6, 1.2].map((delay, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            inset: -4,
            border: "2px solid rgba(0,255,178,0.5)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 28, display: "flex", justifyContent: "center", background: "#0a0a0a" } },
        React.createElement("button", { style: { position: "relative", background: "#00FFB2", border: "none", borderRadius: 50, padding: "12px 28px", fontSize: 13, fontWeight: 700, color: "#000", boxShadow: "0 0 15px rgba(0,255,178,0.3)" } },
          "Connect",
          React.createElement("div", { style: { position: "absolute", inset: -3, border: "2px solid rgba(0,255,178,0.4)", borderRadius: "50%" } })
        )
      ),
    },
  ],
  
  cards: [
    {
      id: "card-spotlight-3d",
      name: "3D Tilt Spotlight Card",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Interactive card with 3D perspective tilt that follows mouse movement plus a radial spotlight gradient that illuminates the hovered area.",
      prompt: `Create a React component called Spotlight3DCard using framer-motion. Dark card background #0f0f0f, border 1px solid rgba(255,255,255,0.08), border-radius 20px, padding 32px. Track mouse position and calculate rotateX and rotateY for 3D tilt effect with perspective(1000px). Calculate radial gradient position for spotlight effect. Use spring animations.`,
      code: `import { useRef, useState } from "react";
import { motion } from "framer-motion";

export function Spotlight3DCard({ icon = "✨", title = "Spotlight Effect", description = "Move your mouse around this card to see the 3D tilt and spotlight." }: { icon?: string; title?: string; description?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -12);
    setRotateY((x - 0.5) * 12);
    setSpotlight({ x: x * 100, y: y * 100 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {}}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); setSpotlight({ x: 50, y: 50 }); }}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "relative",
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 32,
        maxWidth: 320,
        transformStyle: "preserve-3d",
        perspective: 1000,
        cursor: "pointer",
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(600px circle at " + spotlight.x + "% " + spotlight.y + "%, rgba(255,255,255,0.1), transparent 40%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, transform: "translateZ(30px)" }}>
        <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #00FFB2, #38BDF8)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>{icon}</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>{title}</h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 20px" }}>{description}</p>
        <a href="#" style={{ fontSize: 13, color: "#00FFB2", textDecoration: "none", fontWeight: 600 }}>Learn more →</a>
      </div>
    </motion.div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 20, display: "flex", justifyContent: "center", background: "#080808" } },
        React.createElement("div", { style: { background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 22, width: 200 } },
          React.createElement("div", { style: { width: 38, height: 38, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 14 } }, "✨"),
          React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 } }, "Spotlight Effect"),
          React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 } }, "3D tilt + spotlight"),
          React.createElement("div", { style: { fontSize: 9, color: "#00FFB2", marginTop: 10 } }, "Learn more →")
        )
      ),
    },
    {
      id: "card-glass-stack",
      name: "Glass Stack Cards",
      vibe: "Glassmorphism",
      difficulty: "Advanced" as const,
      desc: "A stack of glassmorphism cards that fan out elegantly when hovered, revealing each layer beneath with smooth staggered animation.",
      prompt: `Create a React component called GlassStackCards using framer-motion. A stack of 3 cards that sit on top of each other with slight rotation and offset. On hover, they fan out using variants. Each card: backdrop-filter blur(16px), background rgba(255,255,255,0.08), border 1px solid rgba(255,255,255,0.15), border-radius 20px, padding 28px, width 260px. Gradient background required.`,
      code: `import { motion } from "framer-motion";

const CARDS = [
  { num: "01", title: "Discover", desc: "Explore possibilities" },
  { num: "02", title: "Design", desc: "Craft experiences" },
  { num: "03", title: "Deploy", desc: "Ship to production" },
];

export function GlassStackCards() {
  return (
    <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
      <motion.div style={{ position: "relative", width: 260, height: 160 }} initial="rest" whileHover="hover">
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            variants={{
              rest: { x: i === 0 ? -8 : i === 2 ? 8 : 0, y: i * 4, rotate: i === 0 ? -3 : i === 2 ? 3 : 0, scale: 1 - i * 0.02, zIndex: 3 - i },
              hover: { x: i === 0 ? -70 : i === 2 ? 70 : 0, y: i === 0 ? -40 : i === 2 ? 40 : 0, rotate: i === 0 ? -8 : i === 2 ? 8 : 0, scale: 1, zIndex: 3 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.05 }}
            style={{ position: "absolute", top: 0, left: 0, width: 260, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: 24 }}
          >
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: 12 }}>{card.num}</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>{card.title}</h4>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 24, display: "flex", justifyContent: "center", background: "linear-gradient(135deg,#1a1a2e,#0f3460)" } },
        React.createElement("div", { style: { position: "relative", width: 160, height: 90 } },
          React.createElement("div", { style: { position: "absolute", top: 0, left: -4, width: 140, backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: 14, transform: "rotate(-4deg)" } },
            React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: 6 } }, "01"),
            React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#fff" } }, "Discover")
          ),
          React.createElement("div", { style: { position: "absolute", top: 4, left: 8, width: 140, backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, transform: "rotate(2deg)" } },
            React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: 6 } }, "02"),
            React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#fff" } }, "Design")
          )
        )
      ),
    },
  ],
  
  hero: [
    {
      id: "hero-text-scramble",
      name: "Text Scramble Hero",
      vibe: "Neon & Cyber",
      difficulty: "Advanced" as const,
      desc: "A hero section with a hacker-style text scramble effect — characters randomly cycle before revealing the final text, like a decryption animation.",
      prompt: `Create a React component called TextScrambleHero. Full viewport dark background with subtle grid. Main headline uses a custom hook that cycles through random characters before settling on correct characters. Headline: BUILD THE FUTURE in large monospace font with resolved characters in #00FFB2. Subtitle fades in after scramble completes.`,
      code: `import { useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

function useTextScramble(finalText: string, delay: number = 0) {
  const [display, setDisplay] = useState(finalText.split("").map(() => " ").join(""));
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0;
      const totalIterations = finalText.length * 6;
      const interval = setInterval(() => {
        setDisplay(finalText.split("").map((char, idx) => {
          if (char === " ") return " ";
          if (idx < iteration / 6) return finalText[idx];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(""));
        iteration++;
        if (iteration >= totalIterations) {
          clearInterval(interval);
          setDisplay(finalText);
          setIsComplete(true);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [finalText, delay]);

  return { display, isComplete };
}

export function TextScrambleHero() {
  const line1 = useTextScramble("BUILD THE", 0);
  const line2 = useTextScramble("FUTURE", 400);
  const showContent = line1.isComplete && line2.isComplete;

  return (
    <div style={{ minHeight: "100vh", background: "#020204", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,178,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,178,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>
        <h1 style={{ fontSize: "clamp(48px, 10vw, 80px)", fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.1em", margin: "0 0 20px", lineHeight: 1.1 }}>
          <div style={{ color: line1.isComplete ? "#00FFB2" : "#333" }}>{line1.display}</div>
          <div style={{ color: line2.isComplete ? "#00FFB2" : "#333" }}>{line2.display}</div>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6, opacity: showContent ? 1 : 0, transform: showContent ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease" }}>
          Decrypting the next generation of digital experiences.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", opacity: showContent ? 1 : 0, transform: showContent ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease 0.2s" }}>
          <button style={{ background: "#00FFB2", color: "#000", border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Initialize →</button>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "14px 32px", fontSize: 14, cursor: "pointer" }}>Documentation</button>
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 160, background: "#020204", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,178,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,178,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" } }),
        React.createElement("div", { style: { position: "relative", zIndex: 2, textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 22, fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.08em", color: "#00FFB2", marginBottom: 8 } }, "BUILD THE"),
          React.createElement("div", { style: { fontSize: 22, fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.08em", color: "#00FFB2", marginBottom: 10 } }, "FUTURE"),
          React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.35)" } }, "Decrypting experiences...")
        )
      ),
    },
    {
      id: "hero-aurora-text",
      name: "Aurora Text Hero",
      vibe: "Soft & Pastel",
      difficulty: "Medium" as const,
      desc: "Hero with text that has an animated gradient background clipped to the text, creating a flowing aurora effect within the letters.",
      prompt: `Create a React component called AuroraTextHero. Full viewport with soft gradient background. Main headline uses background-clip: text with an animated gradient that shifts through pastel colors using CSS animation. Text is large, bold, with the gradient clipped to text shape.`,
      code: `export function AuroraTextHero() {
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 30% 20%, #fdf4ff 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #f0fdf4 0%, transparent 50%), #fafafa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
      <h1 style={{ fontSize: "clamp(50px, 9vw, 90px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "0 0 24px", lineHeight: 1.05, background: "linear-gradient(90deg, #f9a8d4, #a78bfa, #38BDF8, #00FFB2, #f9a8d4)", backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "auroraShift 4s ease infinite" }}>
        Dream in<br/>Color
      </h1>
      <style>{"@keyframes auroraShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }"}</style>
      <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 460, margin: "0 0 36px", lineHeight: 1.7 }}>
        Create experiences that flow like the northern lights.
      </p>
      <div style={{ display: "flex", gap: 14 }}>
        <button style={{ background: "linear-gradient(135deg, #a78bfa, #38BDF8)", color: "#fff", border: "none", borderRadius: 50, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 25px rgba(167,139,250,0.35)" }}>Start Creating →</button>
        <button style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 50, padding: "14px 32px", fontSize: 15, cursor: "pointer" }}>View Gallery</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 160, background: "linear-gradient(135deg,#fdf4ff,#f0fdf4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" } },
        React.createElement("div", { style: { fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", background: "linear-gradient(90deg,#f9a8d4,#a78bfa,#38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 } }, "Dream in"),
        React.createElement("div", { style: { fontSize: 9, color: "#6b7280" } }, "Create flowing experiences")
      ),
    },
  ],
  
  forms: [
    {
      id: "form-otp-slot",
      name: "Animated OTP Input",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Slot-machine style OTP input where digits animate in with a rolling effect, perfect for verification codes.",
      prompt: `Create a React component called AnimatedOTPInput using framer-motion. 6 boxes in a row, each 56x64px, background #0f0f0f, border 2px solid #222, border-radius 12px. When user types, digits animate in with a roll up effect using AnimatePresence. Auto-focus next box on input. Backspace moves to previous. Active box has border-color #00FFB2 with glow.`,
      code: `import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedOTPInput({ length = 6, onComplete }: { length?: number; onComplete?: (code: string) => void }) {
  const [code, setCode] = useState<string[]>(new Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputsRef.current[0]?.focus(); }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < length - 1) {
      setFocusedIndex(index + 1);
      inputsRef.current[index + 1]?.focus();
    }
    if (newCode.every(c => c) && onComplete) onComplete(newCode.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      setFocusedIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <label style={{ display: "block", fontSize: 14, color: "#666", marginBottom: 20 }}>Enter verification code</label>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {code.map((digit, i) => (
          <div key={i} style={{ width: 56, height: 64, background: "#0f0f0f", border: focusedIndex === i ? "2px solid #00FFB2" : "2px solid #222", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: focusedIndex === i ? "0 0 15px rgba(0,255,178,0.2)" : "none", transition: "border-color 0.2s, box-shadow 0.2s", overflow: "hidden", position: "relative" }}>
            <input ref={el => { inputsRef.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} onFocus={() => setFocusedIndex(i)} style={{ width: "100%", height: "100%", background: "transparent", border: "none", color: "#fff", fontSize: 24, fontWeight: 700, textAlign: "center", outline: "none", fontFamily: "monospace", position: "relative", zIndex: 2, opacity: digit ? 0 : 1 }} />
            <AnimatePresence mode="wait">
              {digit && (
                <motion.div key={digit} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }} style={{ position: "absolute", fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "monospace", pointerEvents: "none" }}>{digit}</motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 20, background: "#0a0a0a", textAlign: "center" } },
        React.createElement("div", { style: { fontSize: 10, color: "#555", marginBottom: 12 } }, "Enter verification code"),
        React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center" } },
          ...["3", "8", "", "", "", ""].map((d, i) =>
            React.createElement("div", { key: i, style: { width: 32, height: 38, background: "#0f0f0f", border: d ? "2px solid #00FFB2" : "2px solid #222", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: d ? "0 0 8px rgba(0,255,178,0.15)" : "none" } },
              d && React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "monospace" } }, d)
            )
          )
        )
      ),
    },
    {
      id: "form-morph-expand",
      name: "Morphing Expand Input",
      vibe: "Soft & Pastel",
      difficulty: "Advanced" as const,
      desc: "An input field that smoothly morphs and expands into a textarea when focused, creating a seamless transition between short and long form input.",
      prompt: `Create a React component called MorphingInput using framer-motion. Initial state: single-line input, height 56px. On focus: animate height to 140px, border-color changes to accent. Use framer-motion layout animations. Include a floating label that animates up on focus. Optional: character counter that appears when expanded.`,
      code: `import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MorphingInput({ placeholder = "What's on your mind?", label = "Message", maxLength = 280 }: { placeholder?: string; label?: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const showLabel = isFocused || value.length > 0;

  return (
    <div style={{ maxWidth: 400 }}>
      <motion.div animate={{ height: isExpanded ? 140 : 56, borderColor: isFocused ? "#a78bfa" : "#e5e7eb" }} transition={{ type: "spring", stiffness: 300, damping: 25 }} style={{ background: "white", border: "2px solid", borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: isFocused ? "0 4px 20px rgba(167,139,250,0.15)" : "none" }}>
        <motion.label animate={{ y: showLabel ? 10 : 18, scale: showLabel ? 0.85 : 1, color: isFocused ? "#a78bfa" : "#9ca3af" }} transition={{ duration: 0.2 }} style={{ position: "absolute", left: 18, fontSize: 14, fontWeight: 500, pointerEvents: "none", transformOrigin: "left center" }}>{label}</motion.label>
        {isExpanded ? (
          <textarea value={value} onChange={e => setValue(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => { if (!value) setIsExpanded(false); setIsFocused(false); }} style={{ width: "100%", height: "100%", padding: "32px 18px 18px", background: "transparent", border: "none", outline: "none", fontSize: 15, color: "#1a1a2e", fontFamily: "inherit", resize: "none" }} maxLength={maxLength} />
        ) : (
          <input type="text" value={value} onChange={e => setValue(e.target.value)} onFocus={() => { setIsExpanded(true); setIsFocused(true); }} style={{ width: "100%", height: "100%", padding: "22px 18px 0", background: "transparent", border: "none", outline: "none", fontSize: 15, color: "#1a1a2e", fontFamily: "inherit" }} />
        )}
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 4px" }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Press Enter to send</span>
            <span style={{ fontSize: 12, color: value.length > maxLength * 0.9 ? "#f87171" : "#9ca3af" }}>{value.length}/{maxLength}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { padding: 20, background: "#fafafa" } },
        React.createElement("div", { style: { background: "white", border: "2px solid #a78bfa", borderRadius: 12, padding: "14px 14px 12px", width: 200, boxShadow: "0 4px 15px rgba(167,139,250,0.1)" } },
          React.createElement("div", { style: { fontSize: 9, color: "#a78bfa", marginBottom: 3 } }, "Message"),
          React.createElement("div", { style: { fontSize: 11, color: "#1a1a2e", minHeight: 30 } }, "Start typing your thoughts...")
        )
      ),
    },
  ],
};

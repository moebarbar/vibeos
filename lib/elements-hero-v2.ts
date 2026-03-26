// Premium Hero Sections v2 - Actually Beautiful
// Clean, professional, polished designs

import React from "react";

export const HERO_V2 = {
  hero: [
    {
      id: "hero-iphone-carousel",
      name: "iPhone 3D Carousel",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Stunning 3D iPhone mockup carousel with perspective transforms, smooth blur transitions, and gradient accent text.",
      prompt: `Create a React hero section with 3D iPhone carousel. Dark background #000. Title "Edit Your Photos" with "Photos" in gradient blue-purple. Subtitle in muted gray. Center: 3 phone mockups using perspective: 1200px. Center phone full size, side phones 80% scale, blurred, and rotated. Auto-rotate every 4s. Navigation arrows on sides with subtle glass effect. Images from Unsplash portrait photos. Clean, Apple-style aesthetic.`,
      code: `import { useState, useEffect, useCallback } from "react";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80", alt: "Portrait 1" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80", alt: "Portrait 2" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80", alt: "Portrait 3" },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80", alt: "Portrait 4" },
  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80", alt: "Portrait 5" },
];

export function iPhoneCarouselHero() {
  const [current, setCurrent] = useState(2);

  const next = useCallback(() => setCurrent((c) => (c + 1) % IMAGES.length), []);
  const prev = () => setCurrent((c) => (c - 1 + IMAGES.length) % IMAGES.length);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  const getStyle = (idx: number) => {
    const diff = idx - current;
    const total = IMAGES.length;
    let offset = ((diff % total) + total) % total;
    if (offset > 2) offset -= total;

    const isCenter = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;

    return {
      position: "absolute" as const,
      left: "50%",
      top: "50%",
      width: 260,
      height: 520,
      marginLeft: -130,
      marginTop: -260,
      transform: \`
        translateX(\${offset * 70}%)
        scale(\${isCenter ? 1 : 0.82})
        rotateY(\${offset * -12}deg)
      \`,
      zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
      opacity: isCenter ? 1 : isAdjacent ? 0.6 : 0,
      filter: isCenter ? "blur(0px)" : "blur(6px)",
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", position: "relative", overflow: "hidden" }}>
      {/* Subtle glow */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 60%)", top: "30%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ textAlign: "center", marginBottom: 60, position: "relative", zIndex: 10 }}>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
          Edit Your <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Photos</span> on the Go
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
          Use all our AI-powered photo editing tools on your phone, available for all iOS and Android.
        </p>
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", width: "100%", maxWidth: 800, height: 540, perspective: 1200 }}>
        {IMAGES.map((img, i) => (
          <div key={i} style={getStyle(i)}>
            <div style={{ width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: "#111", border: "8px solid #1a1a1a", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)" }}>
              <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        ))}

        {/* Nav buttons */}
        <button onClick={prev} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 18, cursor: "pointer", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>‹</button>
        <button onClick={next} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 18, cursor: "pointer", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>›</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 180, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" } },
        React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } },
          React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "#fff" } }, "Edit Your ", React.createElement("span", { style: { background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "Photos"))
        ),
        React.createElement("div", { style: { position: "relative", width: "100%", height: 80, perspective: 800 } },
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 50, height: 100, marginLeft: -25, marginTop: -50, transform: "translateX(-60%) scale(0.85)", opacity: 0.5, filter: "blur(2px)", zIndex: 1 } },
            React.createElement("div", { style: { width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", border: "2px solid #333" } },
              React.createElement("img", { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", style: { width: "100%", height: "100%", objectFit: "cover" } })
            )
          ),
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 50, height: 100, marginLeft: -25, marginTop: -50, transform: "translateX(0) scale(1)", zIndex: 10 } },
            React.createElement("div", { style: { width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", border: "2px solid #444", boxShadow: "0 8px 20px rgba(0,0,0,0.5)" } },
              React.createElement("img", { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", style: { width: "100%", height: "100%", objectFit: "cover" } })
            )
          ),
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 50, height: 100, marginLeft: -25, marginTop: -50, transform: "translateX(60%) scale(0.85)", opacity: 0.5, filter: "blur(2px)", zIndex: 1 } },
            React.createElement("div", { style: { width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", border: "2px solid #333" } },
              React.createElement("img", { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", style: { width: "100%", height: "100%", objectFit: "cover" } })
            )
          )
        )
      ),
    },

    {
      id: "hero-gradient-text-orb",
      name: "Gradient Orb Hero",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Clean hero with massive animated gradient orb and kinetic typography. Minimal, focused, premium feel.",
      prompt: `Create a React hero with large animated gradient orb. Dark background. Massive centered orb (400px) with animated conic gradient that slowly rotates. Headline "Build for the future" in large white text with subtle gradient. Subtitle below. CTA button with hover lift effect. Very clean, minimal, lots of whitespace. No clutter.`,
      code: `import { useEffect, useState } from "react";

export function GradientOrbHero() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      setRotation((r) => (r + 0.2) % 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", overflow: "hidden" }}>
      {/* Animated Orb */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", opacity: 0.6, filter: "blur(60px)", background: \`conic-gradient(from \${rotation}deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)\`, animation: "pulse 4s ease-in-out infinite" }} />
      
      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 720 }}>
        <h1 style={{ fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 24px", lineHeight: 1.1 }}>
          Build for the
          <br />
          <span style={{ background: "linear-gradient(135deg, #60a5fa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>future</span>
        </h1>
        <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)", margin: "0 0 40px", lineHeight: 1.6 }}>
          The platform for creating next-generation digital experiences.
        </p>
        <button style={{ padding: "16px 36px", background: "#fff", color: "#000", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(255,255,255,0.1)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,255,255,0.15)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,255,255,0.1)"; }}>
          Get started
        </button>
      </div>

      {/* Stats row */}
      <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 60, textAlign: "center" }}>
        {[
          { n: "10M+", l: "Users" },
          { n: "99.9%", l: "Uptime" },
          { n: "150+", l: "Countries" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 180, background: "#050505", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" } },
        React.createElement("div", { style: { position: "absolute", width: 150, height: 150, borderRadius: "50%", opacity: 0.5, filter: "blur(25px)", background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)" } }),
        React.createElement("div", { style: { position: "relative", zIndex: 10, textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 } }, "Build for the ", React.createElement("span", { style: { background: "linear-gradient(135deg,#60a5fa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "future")),
          React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.5)" } }, "The platform for next-gen experiences")
        )
      ),
    },

    {
      id: "hero-split-image",
      name: "Split Image Hero",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Two-column layout with large product image on right, clean typography on left. Professional SaaS aesthetic.",
      prompt: `Create a React hero with split layout. Left: headline "Ship faster with AI", subtitle, two CTAs (primary white, secondary outline). Right: large product screenshot/dashboard floating with subtle shadow and gradient border. Dark background #0a0a0a. Clean typography, good whitespace.`,
      code: `import { useState } from "react";

export function SplitImageHero() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", padding: "80px 60px" }}>
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center" }}>
        
        {/* Left Content */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Now with AI features</span>
          </div>
          
          <h1 style={{ fontSize: "clamp(40px, 4.5vw, 56px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 20px", lineHeight: 1.1 }}>
            Ship faster
            <br />
            with <span style={{ color: "#a78bfa" }}>AI</span>
          </h1>
          
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", margin: "0 0 32px", lineHeight: 1.6, maxWidth: 420 }}>
            Transform your workflow with intelligent automation. Build, deploy, and scale in minutes.
          </p>
          
          <div style={{ display: "flex", gap: 12 }}>
            <button 
              onMouseEnter={() => setHovered("primary")}
              onMouseLeave={() => setHovered(null)}
              style={{ padding: "14px 28px", background: "#fff", color: "#000", border: "none", borderRadius: 10, fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", transform: hovered === "primary" ? "translateY(-2px)" : "translateY(0)" }}
            >
              Start building →
            </button>
            <button 
              onMouseEnter={() => setHovered("secondary")}
              onMouseLeave={() => setHovered(null)}
              style={{ padding: "14px 28px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: "15px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", backgroundColor: hovered === "secondary" ? "rgba(255,255,255,0.05)" : "transparent" }}
            >
              View demo
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div style={{ position: "relative" }}>
          {/* Glow */}
          <div style={{ position: "absolute", inset: -20, background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15), transparent 60%)", filter: "blur(40px)" }} />
          
          {/* Image container */}
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8)" }}>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80" 
              alt="Dashboard" 
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            {/* Overlay gradient */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(139,92,246,0.1), transparent 50%)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 180, background: "#0a0a0a", display: "flex", alignItems: "center", padding: "20px" } },
        React.createElement("div", { style: { width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "center" } },
          React.createElement("div", null,
            React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 } }, "Ship faster with ", React.createElement("span", { style: { color: "#a78bfa" } }, "AI")),
            React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 12 } }, "Transform your workflow"),
            React.createElement("div", { style: { display: "flex", gap: 8 } },
              React.createElement("button", { style: { padding: "6px 12px", background: "#fff", color: "#000", border: "none", borderRadius: 6, fontSize: 10, fontWeight: 600 } }, "Start →"),
              React.createElement("button", { style: { padding: "6px 12px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, fontSize: 10 } }, "Demo")
            )
          ),
          React.createElement("div", { style: { position: "relative" } },
            React.createElement("div", { style: { borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" } },
              React.createElement("img", { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", style: { width: "100%", height: "auto", display: "block" } })
            )
          )
        )
      ),
    },

    {
      id: "hero-minimal-wordmark",
      name: "Minimal Wordmark Hero",
      vibe: "Soft & Pastel",
      difficulty: "Simple" as const,
      desc: "Ultra-minimal hero with centered wordmark, subtle tagline, and floating gradient mesh background.",
      prompt: `Create a minimal hero. Light background #fafafa. Centered large wordmark logo (just text "Lumina" in elegant font). Subtle tagline below. Floating gradient blobs in background that slowly move. Very clean, Apple-style minimalism. No clutter.`,
      code: `import { useEffect, useState } from "react";

export function MinimalWordmarkHero() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf: number;
    let t = 0;
    const animate = () => {
      t += 0.005;
      setOffset({
        x: Math.sin(t) * 20,
        y: Math.cos(t * 0.7) * 15,
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", overflow: "hidden" }}>
      {/* Floating blobs */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(59,130,246,0.08)", filter: "blur(80px)", transform: \`translate(\${offset.x}px, \${offset.y}px)\`, transition: "transform 0.5s ease-out" }} />
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(139,92,246,0.06)", filter: "blur(60px)", transform: \`translate(\${-offset.x * 0.8}px, \${-offset.y * 0.8}px)\`, transition: "transform 0.5s ease-out" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <div style={{ fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 600, color: "#111", letterSpacing: "-0.04em", marginBottom: 16 }}>
          Lumina
        </div>
        <p style={{ fontSize: "20px", color: "#666", margin: "0 0 40px", fontWeight: 400 }}>
          Light, refined, effortless.
        </p>
        <button style={{ padding: "14px 32px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: "15px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
          Explore
        </button>
      </div>

      {/* Bottom hint */}
      <div style={{ position: "absolute", bottom: 40, fontSize: "14px", color: "#999" }}>
        Scroll to discover ↓
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 180, background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" } },
        React.createElement("div", { style: { position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "rgba(59,130,246,0.1)", filter: "blur(30px)" } }),
        React.createElement("div", { style: { position: "relative", zIndex: 10, textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 28, fontWeight: 600, color: "#111", letterSpacing: "-0.03em" } }, "Lumina"),
          React.createElement("div", { style: { fontSize: 10, color: "#666", marginTop: 6 } }, "Light, refined, effortless.")
        )
      ),
    },

    {
      id: "hero-aurora-waves",
      name: "Aurora Waves Hero",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Hero with animated aurora wave background, centered content, and smooth gradient transitions.",
      prompt: `Create a React hero with animated aurora waves. Dark background. Multiple layered wave SVGs at bottom with gradient fills (purple, blue, pink). Waves slowly animate/undulate. Centered headline and CTA. Very smooth, ethereal feel.`,
      code: `import { useEffect, useState } from "react";

export function AuroraWavesHero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      setPhase((p) => (p + 0.01) % (Math.PI * 2));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const wavePath = (offset: number, amplitude: number) => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 1440;
      const y = 400 + Math.sin((i / 100) * Math.PI * 2 + phase + offset) * amplitude;
      points.push(\`\${i === 0 ? "M" : "L"} \${x},\${y}\`);
    }
    return points.join(" ");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #020617 0%, #0f172a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", position: "relative", overflow: "hidden" }}>
      
      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 680 }}>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 20px", lineHeight: 1.1 }}>
          Experience the
          <br />
          <span style={{ background: "linear-gradient(135deg, #c084fc, #6366f1, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>extraordinary</span>
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", margin: "0 0 36px" }}>
          Create stunning visuals with the power of generative AI.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button style={{ padding: "14px 28px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#4f46e5"} onMouseLeave={(e) => e.currentTarget.style.background = "#6366f1"}>
            Start creating
          </button>
          <button style={{ padding: "14px 28px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: "15px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
            Learn more
          </button>
        </div>
      </div>

      {/* Aurora Waves */}
      <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "50%", opacity: 0.8 }}>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#be185d" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#be185d" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={wavePath(0, 30) + " L 1440,500 L 0,500 Z"} fill="url(#grad1)" />
        <path d={wavePath(1, 25) + " L 1440,500 L 0,500 Z"} fill="url(#grad2)" />
        <path d={wavePath(2, 20) + " L 1440,500 L 0,500 Z"} fill="url(#grad3)" />
      </svg>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 180, background: "linear-gradient(180deg,#020617,#0f172a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: { position: "relative", zIndex: 10, textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "#fff" } }, "Experience the ", React.createElement("span", { style: { background: "linear-gradient(135deg,#c084fc,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "extraordinary")),
          React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 8 } }, "Create stunning visuals with AI")
        ),
        React.createElement("svg", { viewBox: "0 0 200 60", style: { position: "absolute", bottom: 0, left: 0, width: "100%", height: "40%", opacity: 0.6 } },
          React.createElement("path", { d: "M0,40 Q50,20 100,40 T200,40 L200,60 L0,60 Z", fill: "rgba(124,58,237,0.3)" }),
          React.createElement("path", { d: "M0,45 Q50,30 100,45 T200,45 L200,60 L0,60 Z", fill: "rgba(59,130,246,0.2)" })
        )
      ),
    },
  ],
};

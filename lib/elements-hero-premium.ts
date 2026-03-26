// Premium Hero Sections - Production Quality
// 3D effects, smooth animations, gradient text, glassmorphism

import React from "react";

export const HERO_PREMIUM = {
  hero: [
    {
      id: "hero-3d-carousel",
      name: "3D Carousel Hero",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Stunning 3D perspective carousel with rotating phone mockups, gradient text, and radial glow background.",
      prompt: `Create a React hero section with 3D carousel. Dark background #0a0a0a with radial gradient purple/blue glow in corners. Large headline with gradient text (blue to purple). Subtitle in muted gray. Center: 3D perspective carousel showing phone mockup images. Active image is centered, full opacity, no blur. Side images are offset with translateX, scaled down (0.85), blurred (4px), and rotated in 3D (rotateY). Use CSS perspective: 1000px on container. Images auto-rotate every 4s. Navigation buttons on sides with glassmorphism (backdrop-blur, rgba bg). Use inline styles for all styling.`,
      code: `import { useState, useEffect, useCallback } from "react";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=600&auto=format&fit=crop", alt: "Portrait 1" },
  { src: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&auto=format&fit=crop", alt: "Portrait 2" },
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop", alt: "Portrait 3" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop", alt: "Portrait 4" },
  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop", alt: "Portrait 5" },
];

export function Carousel3DHero() {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(IMAGES.length / 2));

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a0a0a", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      {/* Background Glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: 0, left: "-10%", top: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle farthest-side, rgba(139, 92, 246, 0.15), transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, right: "-10%", top: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle farthest-side, rgba(59, 130, 246, 0.15), transparent)" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: 60 }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
          Edit Your <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Photos</span> on the Go
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.5)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Use all our AI-powered photo editing tools on your phone, available for all iOS and Android.
        </p>
      </div>

      {/* 3D Carousel */}
      <div style={{ position: "relative", width: "100%", maxWidth: 900, height: 500, perspective: 1000 }}>
        {IMAGES.map((img, index) => {
          const offset = index - currentIndex;
          const total = IMAGES.length;
          let pos = (offset + total) % total;
          if (pos > Math.floor(total / 2)) pos -= total;

          const isCenter = pos === 0;
          const isAdjacent = Math.abs(pos) === 1;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 280,
                height: 500,
                marginLeft: -140,
                marginTop: -250,
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: \`
                  translateX(\${pos * 55}%) 
                  scale(\${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
                  rotateY(\${pos * -15}deg)
                \`,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.5 : 0,
                filter: isCenter ? "blur(0px)" : "blur(4px)",
                visibility: Math.abs(pos) > 1 ? "hidden" : "visible",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 32, border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
              />
            </div>
          );
        })}

        {/* Navigation */}
        <button onClick={handlePrev} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 20, cursor: "pointer", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <button onClick={handleNext} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 20, cursor: "pointer", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 200, background: "#0a0a0a", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" } },
        React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } },
          React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#fff" } }, "Edit Your ", React.createElement("span", { style: { background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "Photos")),
          React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 4 } }, "AI-powered photo editing tools")
        ),
        React.createElement("div", { style: { position: "relative", width: "100%", height: 100, perspective: 800 } },
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 60, height: 100, marginLeft: -30, marginTop: -50, transform: "translateX(0) scale(1)", zIndex: 10 } },
            React.createElement("img", { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" } })
          ),
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 60, height: 100, marginLeft: -30, marginTop: -50, transform: "translateX(-80%) scale(0.8) rotateY(15deg)", opacity: 0.4, filter: "blur(2px)" } },
            React.createElement("img", { src: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=200", style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 } })
          ),
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 60, height: 100, marginLeft: -30, marginTop: -50, transform: "translateX(80%) scale(0.8) rotateY(-15deg)", opacity: 0.4, filter: "blur(2px)" } },
            React.createElement("img", { src: "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=200", style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 } })
          )
        )
      ),
    },

    {
      id: "hero-floating-3d",
      name: "Floating 3D Elements Hero",
      vibe: "Neon & Cyber",
      difficulty: "Advanced" as const,
      desc: "Hero with floating 3D geometric shapes that respond to mouse movement, gradient text, and glowing accents.",
      prompt: `Create a React hero with floating 3D geometric shapes. Dark background. Multiple floating shapes (cube, sphere, pyramid) using CSS 3D transforms with rotateX/Y animations. Track mouse position and subtly rotate all shapes toward cursor. Gradient headline text (cyan to purple). Glowing orbs in background. Glassmorphic CTA button.`,
      code: `import { useState, useEffect } from "react";

export function Floating3DHero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050505", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Glowing Orbs */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)", top: "10%", left: "10%", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)", bottom: "20%", right: "15%", filter: "blur(50px)" }} />

      {/* Floating Shapes */}
      <div style={{ position: "absolute", inset: 0, perspective: 1000 }}>
        {/* Cube */}
        <div style={{ position: "absolute", left: "15%", top: "30%", transform: \`rotateX(\${45 + mouse.y}deg) rotateY(\${45 + mouse.x}deg)\`, transition: "transform 0.3s ease-out" }}>
          <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, rgba(6,182,212,0.8), rgba(59,130,246,0.8))", transform: "rotateX(0deg)", position: "relative", boxShadow: "0 0 40px rgba(6,182,212,0.4)" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(6,182,212,0.3)", transform: "translateZ(40px)" }} />
          </div>
        </div>

        {/* Sphere */}
        <div style={{ position: "absolute", right: "20%", top: "25%", width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, rgba(236,72,153,1), rgba(168,85,247,1))", transform: \`translate(\${mouse.x * 0.5}px, \${mouse.y * 0.5}px)\`, transition: "transform 0.3s ease-out", boxShadow: "0 0 50px rgba(236,72,153,0.4)" }} />

        {/* Pyramid */}
        <div style={{ position: "absolute", right: "25%", bottom: "30%", width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "86px solid rgba(250,204,21,0.8)", transform: \`rotateX(\${-mouse.y}deg) rotateY(\${mouse.x}deg)\`, transition: "transform 0.3s ease-out", filter: "drop-shadow(0 0 20px rgba(250,204,21,0.4))" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800, padding: "0 20px" }}>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 24px", lineHeight: 1.1 }}>
          Build in <span style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3D Space</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.5)", margin: "0 0 40px", lineHeight: 1.6 }}>
          Create immersive experiences with floating elements that respond to your every move.
        </p>
        <button style={{ padding: "16px 40px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9999, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 40px rgba(6,182,212,0.2)" }}>
          Explore 3D →
        </button>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 160, background: "#050505", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("div", { style: { position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.3),transparent)", top: "10%", left: "10%", filter: "blur(20px)" } }),
        React.createElement("div", { style: { position: "absolute", width: 40, height: 40, background: "linear-gradient(135deg,rgba(6,182,212,0.8),rgba(59,130,246,0.8))", left: "15%", top: "30%", transform: "rotate(45deg)" } }),
        React.createElement("div", { style: { position: "absolute", width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%,rgba(236,72,153,1),rgba(168,85,247,1))", right: "20%", top: "25%" } }),
        React.createElement("div", { style: { position: "relative", zIndex: 10, textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: "#fff" } }, "Build in ", React.createElement("span", { style: { background: "linear-gradient(135deg,#06b6d4,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "3D Space")),
          React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 6 } }, "Create immersive experiences")
        )
      ),
    },

    {
      id: "hero-text-reveal-3d",
      name: "3D Text Reveal Hero",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Dramatic text reveal with 3D perspective shifts, character-by-character animation, and floating depth layers.",
      prompt: `Create a React hero with 3D text reveal. Dark background. Headline text where each character animates in with staggered delay. Characters start rotated (rotateX: -90deg, translateZ: -100px) and animate to normal. Subtle gradient on characters. Floating decorative elements in background (thin lines, dots) that parallax on mouse move. Minimal, editorial aesthetic.`,
      code: `import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function TextReveal3DHero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const title = "Beyond Reality";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 30, y: (e.clientY / window.innerHeight - 0.5) * 30 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0c0c0c", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Decorative Lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, transform: \`translate(\${mouse.x * 0.2}px, \${mouse.y * 0.2}px)\`, transition: "transform 0.5s ease-out" }}>
        <line x1="10%" y1="20%" x2="30%" y2="80%" stroke="white" strokeWidth="1" />
        <line x1="70%" y1="10%" x2="90%" y2="60%" stroke="white" strokeWidth="1" />
        <line x1="20%" y1="90%" x2="60%" y2="40%" stroke="white" strokeWidth="1" />
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", perspective: 1000 }}>
        <div style={{ overflow: "hidden", marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(48px, 10vw, 120px)", fontWeight: 900, letterSpacing: "-0.04em", display: "flex", justifyContent: "center" }}>
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ rotateX: -90, translateZ: -100, opacity: 0 }}
                animate={{ rotateX: 0, translateZ: 0, opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                style={{
                  display: "inline-block",
                  color: char === " " ? "transparent" : "#fff",
                  transformStyle: "preserve-3d",
                  background: i > 6 ? "linear-gradient(135deg, #fff, #888)" : "none",
                  WebkitBackgroundClip: i > 6 ? "text" : "initial",
                  WebkitTextFillColor: i > 6 ? "transparent" : "#fff",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto 40px", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Experience the next dimension of digital design
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{ padding: "16px 48px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}
        >
          Enter
        </motion.button>
      </div>

      {/* Floating Depth Elements */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              left: \`\${15 + i * 15}%\`,
              top: \`\${20 + (i % 3) * 25}%\`,
              transform: \`translate(\${mouse.x * (0.5 + i * 0.1)}px, \${mouse.y * (0.5 + i * 0.1)}px)\`,
              transition: "transform 0.5s ease-out",
            }}
          />
        ))}
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 160, background: "#0c0c0c", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("div", { style: { textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" } }, "Beyond Reality"),
          React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 8, letterSpacing: "0.1em" } }, "EXPERIENCE THE NEXT DIMENSION")
        )
      ),
    },

    {
      id: "hero-particle-constellation",
      name: "Particle Constellation Hero",
      vibe: "Dark & Minimal",
      difficulty: "Advanced" as const,
      desc: "Interactive particle network that forms constellations, with 3D depth and mouse-reactive connections.",
      prompt: `Create a React hero with interactive particle constellation. Canvas-based particle system. 60 particles floating with random velocities. Particles connect with lines when within 150px of each other (max 3 connections per particle). Mouse creates a "repulsion field" - particles move away from cursor. Particles have varying z-depth (0-200px) creating parallax. Gradient headline centered.`,
      code: `import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
}

export function ParticleConstellationHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      z: Math.random() * 200,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((p) => {
        // Mouse repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx -= (dx / dist) * 0.02;
          p.vy -= (dy / dist) * 0.02;
        }

        // Update position
        p.x += p.vx * (1 + p.z / 200);
        p.y += p.vy * (1 + p.z / 200);

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        const alpha = 0.3 + (p.z / 200) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + (p.z / 200) * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(255, 255, 255, \${alpha})\`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        let connections = 0;
        particles.slice(i + 1).forEach((p2) => {
          if (connections >= 3) return;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            connections++;
            const alpha = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = \`rgba(255, 255, 255, \${alpha})\`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050505", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
      
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
          <span style={{ color: "#fff" }}>Connect the</span>
          <br />
          <span style={{ background: "linear-gradient(135deg, #60a5fa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Constellation</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(255,255,255,0.4)", maxWidth: 450, margin: "0 auto" }}>
          Move your cursor to disrupt the network. Watch as particles find new connections.
        </p>
      </div>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 160, background: "#050505", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } },
        React.createElement("div", { style: { position: "absolute", inset: 0 } },
          React.createElement("svg", { width: "100%", height: "100%" },
            React.createElement("circle", { cx: "20%", cy: "30%", r: 2, fill: "rgba(255,255,255,0.5)" }),
            React.createElement("circle", { cx: "45%", cy: "50%", r: 2, fill: "rgba(255,255,255,0.5)" }),
            React.createElement("circle", { cx: "70%", cy: "25%", r: 2, fill: "rgba(255,255,255,0.5)" }),
            React.createElement("circle", { cx: "60%", cy: "60%", r: 2, fill: "rgba(255,255,255,0.5)" }),
            React.createElement("line", { x1: "20%", y1: "30%", x2: "45%", y2: "50%", stroke: "rgba(255,255,255,0.1)" }),
            React.createElement("line", { x1: "45%", y1: "50%", x2: "70%", y2: "25%", stroke: "rgba(255,255,255,0.1)" })
          )
        ),
        React.createElement("div", { style: { position: "relative", zIndex: 10, textAlign: "center" } },
          React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: "#fff" } }, "Connect the"),
          React.createElement("div", { style: { fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg,#60a5fa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "Constellation")
        )
      ),
    },

    {
      id: "hero-stacked-parallax",
      name: "Stacked Cards Parallax Hero",
      vibe: "Soft & Pastel",
      difficulty: "Advanced" as const,
      desc: "Hero with overlapping cards that parallax on scroll and mouse movement with 3D depth.",
      prompt: `Create a React hero with stacked parallax cards. Dark gradient background (from #1a1a2e to #16213e). Three overlapping cards in center, each rotated slightly differently. Cards have glassmorphism effect. Mouse movement creates parallax - each card moves at different speed. Cards contain: icon, title, description. Gradient headline at top.`,
      code: `import { useState, useEffect } from "react";

const CARDS = [
  { icon: "🎨", title: "Design", desc: "Create beautiful interfaces", color: "#f472b6", rotate: -8, x: -60, y: -20 },
  { icon: "⚡", title: "Build", desc: "Ship faster than ever", color: "#60a5fa", rotate: 0, x: 0, y: 0 },
  { icon: "🚀", title: "Launch", desc: "Deploy to the world", color: "#a78bfa", rotate: 8, x: 60, y: 20 },
];

export function StackedParallaxHero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 40, y: (e.clientY / window.innerHeight - 0.5) * 40 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      {/* Background Glow */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 60%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", filter: "blur(80px)" }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 80, position: "relative", zIndex: 10 }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 16px" }}>
          Your Workflow,
          <br />
          <span style={{ background: "linear-gradient(135deg, #f472b6, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Supercharged</span>
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: 450 }}>
          Everything you need to design, build, and launch in one place.
        </p>
      </div>

      {/* Stacked Cards */}
      <div style={{ position: "relative", width: 300, height: 200, perspective: 1000 }}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 260,
              padding: 28,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.1)",
              transform: \`
                translate(-50%, -50%)
                translate(\${card.x + mouse.x * (0.5 + i * 0.2)}px, \${card.y + mouse.y * (0.5 + i * 0.2)}px)
                rotateZ(\${card.rotate}deg)
                rotateY(\${mouse.x * 0.3}deg)
                rotateX(\${-mouse.y * 0.3}deg)
              \`,
              transition: "transform 0.3s ease-out",
              zIndex: CARDS.length - i,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{card.title}</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button style={{ marginTop: 80, padding: "16px 40px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 9999, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit" }}>
        Get Started Free →
      </button>
    </div>
  );
}`,
      preview: () => React.createElement("div", { style: { minHeight: 160, background: "linear-gradient(135deg,#1a1a2e,#16213e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" } },
        React.createElement("div", { style: { textAlign: "center", marginBottom: 30 } },
          React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#fff" } }, "Your Workflow,"),
          React.createElement("div", { style: { fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg,#f472b6,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } }, "Supercharged")
        ),
        React.createElement("div", { style: { position: "relative", width: 200, height: 80 } },
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 100, padding: 12, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, transform: "translate(-50%,-50%) translateX(-30px) rotate(-6deg)" } },
            React.createElement("div", { style: { fontSize: 16, marginBottom: 4 } }, "🎨"),
            React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#fff" } }, "Design")
          ),
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 100, padding: 12, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, transform: "translate(-50%,-50%)", zIndex: 2 } },
            React.createElement("div", { style: { fontSize: 16, marginBottom: 4 } }, "⚡"),
            React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#fff" } }, "Build")
          ),
          React.createElement("div", { style: { position: "absolute", left: "50%", top: "50%", width: 100, padding: 12, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, transform: "translate(-50%,-50%) translateX(30px) rotate(6deg)" } },
            React.createElement("div", { style: { fontSize: 16, marginBottom: 4 } }, "🚀"),
            React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#fff" } }, "Launch")
          )
        )
      ),
    },
  ],
};

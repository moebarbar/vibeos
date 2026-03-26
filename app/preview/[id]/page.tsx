"use client";
import { ELEMENTS } from "@/lib/elements";
import { TEMPLATES } from "@/lib/templates";
import { useState } from "react";

export default function PreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const allEls = Object.values(ELEMENTS).flat();
  const el = allEls.find(e => e.id === id);

  if (el) {
    const Preview = el.preview;
    const category = Object.entries(ELEMENTS).find(([, els]) => els.some(e => e.id === id))?.[0];
    const isBackground = category === "backgrounds";

    if (isBackground) {
      return (
        <div style={{
          width: "100vw", height: "100vh", overflow: "hidden", position: "relative",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>
          {/* Full-fill background */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Preview />
          </div>
          {/* Floating top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
            height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 28px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 26, height: 26,
                background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
                borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
              }}>⚡</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>{el.name}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{el.vibe} · {el.difficulty}</span>
            </div>
            <button onClick={() => window.close()} style={{
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 7, color: "rgba(255,255,255,0.55)", padding: "5px 14px",
              fontSize: 11, cursor: "pointer", fontFamily: "inherit", backdropFilter: "blur(12px)",
            }}>✕ Close</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{
        minHeight: "100vh", background: "#060608",
        display: "flex", flexDirection: "column",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        {/* Top bar */}
        <div style={{
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 26, height: 26, background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
              borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
            }}>⚡</div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>VIBE OS · ELEMENT FORGE</span>
          </div>
          <button onClick={() => window.close()} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 7, color: "rgba(255,255,255,0.35)", padding: "5px 14px",
            fontSize: 11, cursor: "pointer", fontFamily: "inherit",
          }}>✕ Close</button>
        </div>

        {/* Preview area */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 40px",
        }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 9, color: "#00FFB2", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 10 }}>COMPONENT PREVIEW</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.03em", marginBottom: 8 }}>{el.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{el.vibe} · {el.difficulty}</div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "60px 80px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
            minWidth: 400,
          }}>
            <Preview />
          </div>
          <div style={{ marginTop: 36, textAlign: "center", maxWidth: 480, fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.75 }}>
            {el.desc}
          </div>
        </div>
      </div>
    );
  }

  const allTmpls = Object.values(TEMPLATES).flat();
  const tmpl = allTmpls.find(t => t.id === id);

  if (tmpl) {
    const vars: Record<string, string> = {};
    tmpl.vars.forEach(v => { vars[v.key] = v.default; });
    const C = tmpl.component(vars);
    return (
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {/* Slim top bar */}
        <div style={{
          height: 44, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)",
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 22, height: 22,
              background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
            }}>⚡</div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{tmpl.name}</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>· {tmpl.vibe} · {tmpl.difficulty}</span>
          </div>
          <button onClick={() => window.close()} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 6, color: "rgba(255,255,255,0.35)", padding: "4px 12px",
            fontSize: 10, cursor: "pointer", fontFamily: "inherit",
          }}>✕ Close</button>
        </div>
        <div style={{ paddingTop: 44 }}>
          <C />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#060608",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Component not found</div>
      </div>
    </div>
  );
}

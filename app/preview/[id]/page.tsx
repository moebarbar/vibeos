"use client";
import { ELEMENTS } from "@/lib/elements";
import { TEMPLATES } from "@/lib/templates";

// How much to zoom each category so the component looks realistic at full scale.
// Preview functions are built for 160px thumbnails — zoom brings them to actual size.
const CATEGORY_ZOOM: Record<string, number> = {
  buttons:     1.5,
  cards:       2.5,
  forms:       3,
  nav:         3,
  hero:        2,
  dashboards:  2,
};

const TopBar = ({ name, meta }: { name: string; meta: string }) => (
  <div style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
    height: 44, display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 20px",
    background: "rgba(6,6,8,0.9)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 22, height: 22,
        background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
        borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
      }}>⚡</div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{name}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{meta}</span>
    </div>
    <button onClick={() => window.close()} style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 6, color: "rgba(255,255,255,0.4)", padding: "4px 14px",
      fontSize: 10, cursor: "pointer", fontFamily: "inherit",
    }}>✕ Close</button>
  </div>
);

export default function PreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // ── ELEMENT ──────────────────────────────────────────────────────────────
  const allEls = Object.values(ELEMENTS).flat();
  const el = allEls.find(e => e.id === id);

  if (el) {
    const Preview = el.preview;
    const category = Object.entries(ELEMENTS).find(([, els]) => els.some(e => e.id === id))?.[0] ?? "";

    // Backgrounds: fill the entire viewport, floating top bar on top
    if (category === "backgrounds") {
      return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Preview />
          </div>
          <TopBar name={el.name} meta={`${el.vibe} · ${el.difficulty}`} />
        </div>
      );
    }

    const zoom = CATEGORY_ZOOM[category] ?? 2;
    // For buttons, center them. For everything else, top-align so full-width layouts look natural.
    const isCentered = category === "buttons" || category === "cards";

    return (
      <div style={{
        minHeight: "100vh",
        background: "#060608",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <TopBar name={el.name} meta={`${el.vibe} · ${el.difficulty}`} />
        <div style={{
          paddingTop: 44,
          ...(isCentered ? {
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: "calc(100vh - 44px)",
          } : {}),
        }}>
          {/* CSS zoom scales the preview to realistic size without changing the component */}
          <div style={{ zoom, width: "100%" }}>
            <Preview />
          </div>
        </div>
      </div>
    );
  }

  // ── TEMPLATE ─────────────────────────────────────────────────────────────
  const allTmpls = Object.values(TEMPLATES).flat();
  const tmpl = allTmpls.find(t => t.id === id);

  if (tmpl) {
    const vars: Record<string, string> = {};
    tmpl.vars.forEach(v => { vars[v.key] = v.default; });
    const C = tmpl.component(vars);
    return (
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <TopBar name={tmpl.name} meta={`${tmpl.vibe} · ${tmpl.difficulty}`} />
        <div style={{ paddingTop: 44 }}>
          <C />
        </div>
      </div>
    );
  }

  // ── NOT FOUND ─────────────────────────────────────────────────────────────
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

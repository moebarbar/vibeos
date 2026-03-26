"use client";

import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    desc: "Perfect for side projects",
    features: ["5 projects", "Basic elements", "Community support"],
    color: "rgba(255,255,255,0.1)",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    desc: "For serious builders",
    features: ["Unlimited projects", "All elements", "AI features", "Priority support"],
    color: "#00FFB2",
    highlight: true,
  },
  {
    id: "founder",
    name: "Founder",
    price: "$49",
    desc: "Scale without limits",
    features: ["Everything in Pro", "Team access", "Custom elements", "White-label"],
    color: "#38BDF8",
  },
];

export function ModalPricing() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("pro");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
          color: "#000",
          border: "none",
          borderRadius: 10,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        View Pricing
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(12px)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0c0c0e",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "32px",
              width: "100%",
              maxWidth: 560,
              boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: "#00FFB2", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 8, fontFamily: "monospace" }}>PRICING</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Choose your plan</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {PLANS.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  style={{
                    background: selected === plan.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                    border: selected === plan.id ? `1px solid ${plan.color}` : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "16px 12px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 11, color: plan.highlight ? "#00FFB2" : "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.06em" }}>{plan.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{plan.price}<span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>/mo</span></div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{plan.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              {PLANS.find(p => p.id === selected)?.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                  <span style={{ color: "#00FFB2", fontSize: 12 }}>✓</span> {f}
                </div>
              ))}
            </div>

            <button
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #00FFB2, #38BDF8)",
                border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 700, color: "#000",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Get Started with {PLANS.find(p => p.id === selected)?.name}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

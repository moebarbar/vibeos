"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    setDone(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030305", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-20%", width: "60vw", height: "60vw", background: "radial-gradient(ellipse, rgba(0,255,178,0.07) 0%, transparent 65%)", filter: "blur(60px)", animation: "vibe-orb-drift-2 22s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-20%", width: "55vw", height: "55vw", background: "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 65%)", filter: "blur(60px)", animation: "vibe-orb-drift 28s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "36px 36px", maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1, animation: "vibe-scale-in 0.45s cubic-bezier(0.16,1,0.3,1) both" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36, justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #00FFB2, #38BDF8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 0 28px rgba(0,255,178,0.4)" }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#fff", letterSpacing: "-0.03em" }}>Vibe OS</span>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(8, 8, 10, 0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 22,
          padding: "36px 32px",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "12px 0", animation: "vibe-scale-in 0.4s ease both" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(0,255,178,0.08)", border: "1px solid rgba(0,255,178,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, margin: "0 auto 20px",
                boxShadow: "0 0 30px rgba(0,255,178,0.12)",
              }}>📬</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.03em" }}>Check your email</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75 }}>
                We sent a confirmation link to{" "}
                <strong style={{ color: "rgba(255,255,255,0.65)" }}>{email}</strong>.{" "}
                Click it to activate your account.
              </p>
              <Link href="/sign-in" style={{
                display: "inline-block", marginTop: 24, fontSize: 13,
                color: "#00FFB2", textDecoration: "none", fontWeight: 600,
                transition: "opacity 0.2s",
              }}
                onMouseOver={e => (e.currentTarget.style.opacity = "0.75")}
                onMouseOut={e => (e.currentTarget.style.opacity = "1")}>
                Back to sign in →
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.03em" }}>Create your account</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: "0 0 30px" }}>Start building with Vibe OS today</p>

              <form onSubmit={handleSubmit}>
                <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="vibe-input"
                  style={{ padding: "11px 14px", fontSize: 14, marginBottom: 18, fontFamily: "system-ui" }}
                />

                <label style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters" required minLength={6}
                  className="vibe-input"
                  style={{ padding: "11px 14px", fontSize: 14, marginBottom: 6, fontFamily: "system-ui" }}
                />

                {error && (
                  <div style={{
                    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#f87171",
                    margin: "10px 0 4px", animation: "vibe-slide-up 0.3s ease both",
                  }}>{error}</div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="vibe-btn-primary"
                  style={{ width: "100%", marginTop: 20, padding: "13px", fontSize: 14, borderRadius: 10, opacity: loading ? 0.6 : 1 }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block", animation: "vibe-spin-slow 0.7s linear infinite" }} />
                      Creating account...
                    </span>
                  ) : "Create Account →"}
                </button>
              </form>

              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", textAlign: "center", margin: "22px 0 0" }}>
                Already have an account?{" "}
                <Link href="/sign-in" style={{ color: "#00FFB2", textDecoration: "none", fontWeight: 600 }}
                  onMouseOver={e => (e.currentTarget.style.opacity = "0.75")}
                  onMouseOut={e => (e.currentTarget.style.opacity = "1")}>
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

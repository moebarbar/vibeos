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

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setDone(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#070707", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#00FFB2,#38BDF8)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.02em" }}>Vibe OS</span>
        </div>

        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 18, padding: 32 }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>Check your email</h2>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                We sent a confirmation link to <strong style={{ color: "#888" }}>{email}</strong>. Click it to activate your account.
              </p>
              <Link href="/sign-in" style={{ display: "inline-block", marginTop: 20, fontSize: 13, color: "#00FFB2", textDecoration: "none" }}>
                Back to sign in →
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Create your account</h1>
              <p style={{ fontSize: 13, color: "#555", margin: "0 0 28px" }}>Start building with Vibe OS today</p>

              <form onSubmit={handleSubmit}>
                <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: "100%", background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14, fontFamily: "system-ui" }}
                />

                <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  style={{ width: "100%", background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 6, fontFamily: "system-ui" }}
                />

                {error && <p style={{ fontSize: 12, color: "#f87171", margin: "8px 0 12px" }}>{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", marginTop: 16, background: "#00FFB2", color: "#000", border: "none", borderRadius: 9, padding: "12px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, fontFamily: "system-ui" }}
                >
                  {loading ? "Creating account..." : "Create Account →"}
                </button>
              </form>

              <p style={{ fontSize: 13, color: "#444", textAlign: "center", margin: "20px 0 0" }}>
                Already have an account?{" "}
                <Link href="/sign-in" style={{ color: "#00FFB2", textDecoration: "none" }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

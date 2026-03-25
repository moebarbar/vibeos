"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: "#555", margin: "0 0 28px" }}>Sign in to your Vibe OS account</p>

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
              placeholder="••••••••"
              required
              style={{ width: "100%", background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 6, fontFamily: "system-ui" }}
            />

            {error && <p style={{ fontSize: 12, color: "#f87171", margin: "8px 0 12px" }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", marginTop: 16, background: "#00FFB2", color: "#000", border: "none", borderRadius: 9, padding: "12px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, fontFamily: "system-ui" }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={{ fontSize: 13, color: "#444", textAlign: "center", margin: "20px 0 0" }}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" style={{ color: "#00FFB2", textDecoration: "none" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { theme } = useTheme();
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError("Google sign in failed. Please try again.");
    }
    setLoading(false);
  };

  const handleEmail = async () => {
    if (!email || !password) return;
    try {
      setLoading(true);
      setError("");
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") setError("No account found. Please register.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else if (err.code === "auth/email-already-in-use") setError("Email already registered.");
      else if (err.code === "auth/weak-password") setError("Password must be at least 6 characters.");
      else if (err.code === "auth/invalid-credential") setError("Invalid email or password.");
      else setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: theme.inputBg,
    border: `1px solid ${theme.border}`,
    borderRadius: "10px", color: theme.text,
    fontSize: "14px", outline: "none",
    boxSizing: "border-box", marginTop: "6px",
  };

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", position: "relative", overflow: "hidden",
    }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, #0EA5E920, transparent)", top: "-200px", right: "-200px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #6366F120, transparent)", bottom: "-100px", left: "-100px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "400px", animation: "fadeUp 0.4s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "linear-gradient(135deg, #ffffff, #9698ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", margin: "0 auto 14px" }}>💊</div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: theme.text }}>
            Medi<span style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Care</span>
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: theme.text2 }}>Smart Hospital AI System</p>
        </div>

        {/* Card */}
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "800", color: theme.text }}>
              {isRegister ? "Create Account" : "Welcome back 👋"}
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: theme.text2 }}>
              {isRegister ? "Register to access Medicare" : "Sign in to access the hospital system"}
            </p>
          </div>

          {/* Google Button */}
          <button onClick={handleGoogle} disabled={loading}
            style={{
              width: "100%", padding: "12px",
              background: "#fff", border: "1px solid #E2E8F0",
              borderRadius: "12px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              fontSize: "14px", fontWeight: "700", color: "#1E293B",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s",
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, height: "1px", background: theme.border }} />
            <span style={{ fontSize: "12px", color: theme.text3 }}>or</span>
            <div style={{ flex: 1, height: "1px", background: theme.border }} />
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: "11px", color: theme.text2, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@medicare.in" type="email" style={inputStyle} />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: "11px", color: theme.text2, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmail()}
              placeholder="••••••••" type="password" style={inputStyle} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: "10px 12px", background: "#EF444418", border: "1px solid #EF444440", borderRadius: "10px", color: "#EF4444", fontSize: "12px" }}>
              ❌ {error}
            </div>
          )}

          {/* Submit */}
          <button onClick={handleEmail} disabled={loading || !email || !password}
            style={{
              width: "100%", padding: "12px",
              background: email && password ? "linear-gradient(135deg,#0EA5E9,#6366F1)" : theme.border,
              border: "none", borderRadius: "12px", color: "#fff",
              fontSize: "14px", fontWeight: "700",
              cursor: email && password ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
            {loading ? (
              <>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #ffffff40", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                Please wait...
              </>
            ) : isRegister ? "Create Account →" : "Sign In →"}
          </button>

          {/* Toggle */}
          <button onClick={() => { setIsRegister(!isRegister); setError(""); }}
            style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
            {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: theme.text3, marginTop: "16px" }}>
          Medicare Hospital System · Secure & Private
        </p>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}
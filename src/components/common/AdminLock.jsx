import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminLock({ onUnlock }) {
  const { theme } = useTheme();
  const { unlockAdmin } = useAuth();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleUnlock = async () => {
    if (!passkey.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const success = unlockAdmin(passkey);
    if (success) {
      onUnlock();
    } else {
      setError("Incorrect passkey. Please try again.");
      setPasskey("");
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: "20px", padding: "32px", width: "380px",
        animation: "fadeUp 0.3s ease",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${theme.accent}18`, border: `1px solid ${theme.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", margin: "0 auto 12px" }}>🔐</div>
          <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: theme.text }}>Admin Access Required</h3>
          <p style={{ margin: 0, fontSize: "13px", color: theme.text2 }}>Enter the admin passkey to continue</p>
        </div>

        {/* Input */}
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            value={passkey}
            onChange={e => { setPasskey(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleUnlock()}
            type={showKey ? "text" : "password"}
            placeholder="Enter passkey..."
            style={{
              width: "100%", padding: "12px 44px 12px 14px",
              background: theme.inputBg, border: `1px solid ${error ? "#EF4444" : theme.border}`,
              borderRadius: "12px", color: theme.text, fontSize: "14px",
              outline: "none", boxSizing: "border-box",
              letterSpacing: showKey ? "normal" : "4px",
            }}
          />
          <button onClick={() => setShowKey(!showKey)}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: theme.text3 }}>
            {showKey ? "🙈" : "👁"}
          </button>
        </div>

        {error && (
          <div style={{ padding: "8px 12px", background: "#EF444418", border: "1px solid #EF444440", borderRadius: "8px", color: "#EF4444", fontSize: "12px", marginBottom: "12px" }}>
            ❌ {error}
          </div>
        )}

        <button onClick={handleUnlock} disabled={loading || !passkey}
          style={{
            width: "100%", padding: "12px",
            background: passkey ? "linear-gradient(135deg, #0EA5E9, #6366F1)" : theme.border,
            border: "none", borderRadius: "12px", color: "#fff",
            fontSize: "14px", fontWeight: "700",
            cursor: passkey ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
          {loading ? (
            <>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #ffffff40", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
              Verifying...
            </>
          ) : "🔓 Unlock Admin"}
        </button>

        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
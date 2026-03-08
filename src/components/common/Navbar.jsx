import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { usePatients } from "../../context/PatientContext";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/", label: "Check-In", icon: "🏥" },
  { path: "/admin", label: "Admin", icon: "📊" },
  { path: "/billing", label: "Billing", icon: "🧾" },
  { path: "/appointments", label: "Appointments", icon: "📅" },
  { path: "/analytics", label: "Analytics", icon: "📈" },
  { path: "/map", label: "Map", icon: "🗺️" },
];

const PulseDot = ({ color = "#10B981" }) => (
  <div style={{ position: "relative", width: "10px", height: "10px", flexShrink: 0 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "pulse-ring 1.5s ease-out infinite" }} />
    <div style={{ position: "absolute", inset: "2px", borderRadius: "50%", background: color, animation: "pulse-dot 1.5s ease-in-out infinite" }} />
  </div>
);

export default function Navbar() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { queue } = usePatients();
  const { user, logout } = useAuth();
  const location = useLocation();

  const emergencyCount = queue.filter(p => p.triage?.level === "EMERGENCY").length;
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const avatarLetter = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase();

  return (
    <div style={{
      background: theme.navBg,
      borderBottom: `1px solid ${theme.border}`,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 20px 12px 0",
        marginRight: "8px",
        borderRight: `1px solid ${theme.border}`,
      }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #ffffff, #ffffff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>💊</div>
        <div>
          <div style={{ fontWeight: "800", fontSize: "16px", color: theme.text, letterSpacing: "-0.3px" }}>
            Medi<span style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Care</span>
          </div>
          <div style={{ fontSize: "10px", color: theme.text3, letterSpacing: "0.3px" }}>Smart Hospital AI</div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", flex: 1, gap: "2px" }}>
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          const isAdmin = item.path === "/admin";
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "18px 14px",
                borderBottom: `2px solid ${isActive ? theme.accent : "transparent"}`,
                color: isActive ? theme.accent : theme.text2,
                fontSize: "12px", fontWeight: isActive ? "700" : "500",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                {item.icon} {item.label}
                {isAdmin && emergencyCount > 0 && (
                  <div style={{ background: "#EF4444", color: "#fff", fontSize: "10px", fontWeight: "800", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: "emergencyFlash 1s ease-in-out infinite" }}>
                    {emergencyCount}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px" }}>
          <PulseDot color="#10B981" />
          <span style={{ fontSize: "11px", color: "#10B981", fontWeight: "700" }}>System Live</span>
        </div>

        <div style={{ padding: "6px 12px", background: `${theme.accent}18`, border: `1px solid ${theme.accent}30`, borderRadius: "20px", fontSize: "11px", color: theme.accent, fontWeight: "700" }}>
          👥 {queue.length} in queue
        </div>

        {/* User Avatar */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg,#0EA5E9,#6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#fff" }}>
              {avatarLetter}
            </div>
            <span style={{ fontSize: "12px", color: theme.text, fontWeight: "600" }}>{displayName}</span>
          </div>
        )}

        <button onClick={toggleTheme} style={{ padding: "7px 14px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px", color: theme.text, fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
          {isDark ? "☀️" : "🌙"}
        </button>

        <button onClick={logout} style={{ padding: "7px 14px", background: "#EF444418", border: "1px solid #EF444440", borderRadius: "20px", color: "#EF4444", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
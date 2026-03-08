import { useTheme } from "../../context/ThemeContext";
import { usePatients } from "../../context/PatientContext";

export default function WardCapacity() {
  const { theme } = useTheme();
  const { wardCapacity = [] } = usePatients();

  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: theme.text }}>Ward Bed Capacity</h3>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: theme.text2 }}>Updates automatically on check-in</p>
        </div>
        <div style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "#10B98118", color: "#10B981", border: "1px solid #10B98140", fontWeight: "700" }}>
          🔴 Live
        </div>
      </div>
      <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {wardCapacity.map(w => {
          const pct = (w.occupied / w.total) * 100;
          const barColor = pct > 85 ? "#EF4444" : pct > 60 ? "#F59E0B" : w.color;
          return (
            <div key={w.id} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: theme.text }}>{w.icon} {w.name}</span>
                <span style={{ fontSize: "11px", color: pct > 85 ? "#EF4444" : theme.text2, fontWeight: pct > 85 ? "700" : "400" }}>
                  {w.occupied}/{w.total}
                </span>
              </div>
              <div style={{ height: "5px", background: theme.border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: "4px", transition: "width 0.5s ease" }} />
              </div>
              {pct > 85 && (
                <div style={{ fontSize: "10px", color: "#EF4444", marginTop: "4px", fontWeight: "600" }}>⚠️ Almost full</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
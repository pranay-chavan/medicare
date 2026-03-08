import { useTheme } from "../../context/ThemeContext";
import { usePatients } from "../../context/PatientContext";

export default function DoctorList() {
  const { theme } = useTheme();
  const { doctors } = usePatients();

  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: theme.text }}>Doctor Availability</h3>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: theme.text2 }}>Updates on patient check-in</p>
        </div>
        <div style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "#10B98118", color: "#10B981", border: "1px solid #10B98140", fontWeight: "700" }}>
          🔴 Live
        </div>
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {doctors.map(doc => (
          <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: doc.available ? "linear-gradient(135deg,#0EA5E9,#6366F1)" : theme.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", color: doc.available ? "#fff" : theme.text3, flexShrink: 0 }}>
              {doc.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>{doc.name}</div>
              <div style={{ fontSize: "11px", color: theme.text2 }}>{doc.department} · {doc.patients} patients today</div>
            </div>
            <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "700", background: doc.available ? "#10B98118" : "#EF444418", color: doc.available ? "#10B981" : "#EF4444", border: `1px solid ${doc.available ? "#10B98140" : "#EF444440"}` }}>
              {doc.available ? "Available" : "Busy"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
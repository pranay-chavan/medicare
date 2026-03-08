import { useTheme } from "../../context/ThemeContext";
import { usePatients } from "../../context/PatientContext";
import { getTriageLevel } from "../../utils/triage";

export default function PatientCard({ patient, onClose, onBookAppointment }) {
  const { theme } = useTheme();
  const { dischargePatient } = usePatients();
  const triage = patient.triage || getTriageLevel(patient.symptoms);

  const handleDischarge = () => {
    dischargePatient(patient.id);
    onClose();
  };

  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "20px", animation: "fadeUp 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
            {patient.gender === "Female" ? "👩" : "👨"}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: theme.text }}>{patient.name}</h3>
            <div style={{ fontSize: "12px", color: theme.text2 }}>Age {patient.age} · {patient.id} · {patient.phone}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: theme.text3, cursor: "pointer", fontSize: "22px" }}>×</button>
      </div>

      {/* Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {[
          ["Symptoms", patient.symptoms],
          ["Triage", triage.level],
          ["Department", patient.triage?.department || "General"],
          ["Check-in", patient.time],
        ].map(([k, v]) => (
          <div key={k} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10px", color: theme.text3, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{k}</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: k === "Triage" ? triage.color : theme.text }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Assigned Doctor */}
      <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "11px", color: theme.text2 }}>Assigned Doctor</div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: theme.text, marginTop: "2px" }}>{patient.doctor || "Pending"}</div>
        </div>
        <div style={{ fontSize: "28px" }}>👨‍⚕️</div>
      </div>

      {/* Visit Count */}
      <div style={{ background: `${theme.accent}12`, border: `1px solid ${theme.accent}30`, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "11px", color: theme.text2 }}>Previous Visits</div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: theme.accent }}>{patient.visits}</div>
        </div>
        <div style={{ fontSize: "32px" }}>📋</div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button onClick={onBookAppointment}
          style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          📅 Book Appointment
        </button>
        <button onClick={handleDischarge}
          style={{ width: "100%", padding: "12px", background: "#EF444418", border: "1px solid #EF444440", borderRadius: "10px", color: "#EF4444", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          🏥 Discharge Patient
        </button>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
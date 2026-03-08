import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePatients } from "../context/PatientContext";
import PatientQueue from "../components/admin/PatientQueue";
import PatientCard from "../components/admin/PatientCard";
import DoctorList from "../components/admin/DoctorList";
import WardCapacity from "../components/admin/WardCapacity";
import AppointmentModal from "../components/appointments/AppointmentModal";

const PulseDot = ({ color }) => (
  <div style={{ position: "relative", width: "10px", height: "10px", flexShrink: 0 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "pulse-ring 1.5s ease-out infinite" }} />
    <div style={{ position: "absolute", inset: "2px", borderRadius: "50%", background: color, animation: "pulse-dot 1.5s ease-in-out infinite" }} />
  </div>
);

export default function AdminPage() {
  const { theme } = useTheme();
  const { queue, doctors, wardCapacity } = usePatients();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const prevQueueLength = useState(queue.length)[0];

  const emergencyCount = queue.filter(p => p.triage?.level === "EMERGENCY").length;
  const availableDoctors = doctors.filter(d => d.available).length;
  const availableBeds = (wardCapacity || []).reduce((sum, w) => sum + (w.total - w.occupied), 0);

  // Detect new emergency patients
  useEffect(() => {
    const latest = queue[0];
    if (latest?.triage?.level === "EMERGENCY" && queue.length > prevQueueLength) {
      setEmergencyAlert(latest);
      const t = setTimeout(() => setEmergencyAlert(null), 5000);
      return () => clearTimeout(t);
    }
  }, [queue]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Emergency Alert */}
      {emergencyAlert && (
        <div style={{
          background: "#2D0A0A", border: "1px solid #EF4444",
          borderRadius: "14px", padding: "14px 18px",
          display: "flex", alignItems: "center", gap: "12px",
          animation: "slideDown 0.3s ease, emergencyFlash 1s ease-in-out infinite",
        }}>
          <div style={{ fontSize: "24px" }}>🚨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "#EF4444" }}>EMERGENCY PATIENT CHECKED IN</div>
            <div style={{ fontSize: "12px", color: "#FDA4A4", marginTop: "2px" }}>{emergencyAlert.name} · {emergencyAlert.symptoms}</div>
          </div>
          <button onClick={() => setEmergencyAlert(null)}
            style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "20px" }}>×</button>
        </div>
      )}

      {/* Hero Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {[
          { label: "In Queue", value: queue.length, icon: "👥", color: theme.accent },
          { label: "Emergencies", value: emergencyCount, icon: "🚨", color: "#EF4444" },
          { label: "Doctors Available", value: availableDoctors, icon: "👨‍⚕️", color: "#10B981" },
          { label: "Beds Available", value: availableBeds, icon: "🛏", color: "#8B5CF6" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: theme.surface, border: `1px solid ${stat.value > 0 && stat.label === "Emergencies" ? "#EF444440" : theme.border}`,
            borderRadius: "14px", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: "12px",
            transition: "all 0.3s",
          }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: stat.label === "Emergencies" && stat.value > 0 ? "#EF4444" : stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: theme.text2 }}>{stat.label}</div>
            </div>
            {stat.label === "In Queue" && queue.length > 0 && (
              <div style={{ marginLeft: "auto" }}>
                <PulseDot color="#10B981" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <PatientQueue patients={queue} onSelect={setSelected} selected={selected} />
          <DoctorList />
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {selected ? (
            <PatientCard
              patient={selected}
              onClose={() => setSelected(null)}
              onBookAppointment={() => setShowModal(true)}
            />
          ) : (
            <div style={{
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: "16px", padding: "40px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: theme.text3,
            }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>👆</div>
              <div style={{ fontSize: "14px" }}>Click a patient to view details</div>
            </div>
          )}
          <WardCapacity />
        </div>
      </div>

      {showModal && (
        <AppointmentModal patient={selected} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { usePatients } from "../../context/PatientContext";

export default function AppointmentModal({ onClose, patient }) {
  const { theme } = useTheme();
  const { addAppointment, doctors } = usePatients();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(patient?.doctor || "");
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"];
  const bookedSlots = ["09:00", "10:00", "14:30"];

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    addAppointment({
      patient: patient?.name || "Walk-in Patient",
      doctor: selectedDoctor || "TBD",
      date: selectedDate,
      time: selectedTime,
    });
    setConfirmed(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "20px",
        padding: "28px",
        width: "520px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        animation: "fadeUp 0.3s ease"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: theme.text }}>📅 Book Appointment</h3>
            {patient && <div style={{ fontSize: "12px", color: theme.text2, marginTop: "2px" }}>for {patient.name}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.text3, cursor: "pointer", fontSize: "22px" }}>×</button>
        </div>

        {!confirmed ? (
          <>
            {/* Doctor Selection */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: theme.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Doctor</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "160px", overflowY: "auto" }}>
                {doctors.map(doc => (
                  <div key={doc.id} onClick={() => setSelectedDoctor(doc.name)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                      background: selectedDoctor === doc.name ? `${theme.accent}18` : theme.surface2,
                      border: `1px solid ${selectedDoctor === doc.name ? theme.accent : theme.border}`,
                      transition: "all 0.2s",
                    }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: doc.available ? "linear-gradient(135deg,#0EA5E9,#6366F1)" : theme.border,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "800",
                      color: doc.available ? "#fff" : theme.text3, flexShrink: 0
                    }}>
                      {doc.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>{doc.name}</div>
                      <div style={{ fontSize: "11px", color: theme.text2 }}>{doc.department}</div>
                    </div>
                    <span style={{
                      fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: "700",
                      background: doc.available ? "#10B98118" : "#EF444418",
                      color: doc.available ? "#10B981" : "#EF4444"
                    }}>
                      {doc.available ? "Available" : "Busy"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: theme.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Date</div>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                {days.map((d, i) => (
                  <button key={i} onClick={() => setSelectedDate(d)}
                    style={{
                      flexShrink: 0, padding: "8px 12px",
                      background: selectedDate?.toDateString() === d.toDateString() ? theme.accent : theme.surface2,
                      border: `1px solid ${selectedDate?.toDateString() === d.toDateString() ? theme.accent : theme.border}`,
                      borderRadius: "10px", cursor: "pointer",
                      color: selectedDate?.toDateString() === d.toDateString() ? "#fff" : theme.text,
                      textAlign: "center"
                    }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>
                      {d.toLocaleDateString("en", { weekday: "short" })}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "800" }}>{d.getDate()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: theme.text2, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Time</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {times.map(time => {
                    const booked = bookedSlots.includes(time);
                    return (
                      <button key={time} onClick={() => !booked && setSelectedTime(time)} disabled={booked}
                        style={{
                          padding: "8px 4px",
                          background: selectedTime === time ? theme.accent : booked ? theme.border : theme.surface2,
                          border: `1px solid ${selectedTime === time ? theme.accent : theme.border}`,
                          borderRadius: "8px", cursor: booked ? "not-allowed" : "pointer",
                          fontSize: "12px", fontWeight: "600",
                          color: selectedTime === time ? "#fff" : booked ? theme.text3 : theme.text,
                          opacity: booked ? 0.5 : 1
                        }}>
                        {booked ? "✗" : time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button onClick={handleConfirm}
              style={{
                width: "100%", padding: "12px",
                background: selectedDate && selectedTime ? "linear-gradient(135deg,#0EA5E9,#6366F1)" : theme.border,
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "14px", fontWeight: "700",
                cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
                opacity: selectedDate && selectedTime ? 1 : 0.5,
                transition: "all 0.2s",
              }}>
              {selectedDate && selectedTime ? "Confirm Appointment →" : "Select date and time to confirm"}
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "50px", marginBottom: "12px" }}>✅</div>
            <h3 style={{ color: theme.text, margin: "0 0 8px" }}>Appointment Confirmed!</h3>
            <p style={{ color: theme.text2, fontSize: "14px" }}>{selectedDate?.toDateString()} at {selectedTime}</p>
            <p style={{ color: theme.text2, fontSize: "13px" }}>Doctor: {selectedDoctor || "TBD"}</p>
            <div style={{ background: "#10B98112", border: "1px solid #10B98140", borderRadius: "10px", padding: "10px 14px", margin: "16px 0", fontSize: "13px", color: "#10B981" }}>
              📩 Appointment saved to calendar!
            </div>
            <button onClick={onClose}
              style={{ padding: "10px 24px", background: theme.accent, border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              Done
            </button>
          </div>
        )}

        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    </div>
  );
}
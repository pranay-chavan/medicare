import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePatients } from "../context/PatientContext";
import AppointmentModal from "../components/appointments/AppointmentModal";

export default function AppointmentsPage() {
  const { theme } = useTheme();
  const { appointments, cancelAppointment } = usePatients();
  const [showModal, setShowModal] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const getAppointmentsForDay = (day) => {
    return appointments.filter(a => {
      const d = new Date(a.date);
      return d.getDate() === day &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
    });
  };

  const upcoming = [...appointments]
    .filter(a => new Date(a.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
      {/* Calendar */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: theme.text }}>📅 Appointment Calendar</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: theme.text2 }}>
              {today.toLocaleDateString("en", { month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: "9px 18px", background: "linear-gradient(135deg,#0EA5E9,#6366F1)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            + New Appointment
          </button>
        </div>

        {/* Day Headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "8px" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: "700", color: theme.text3, padding: "6px 0" }}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
          {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate();
            const dayAppts = getAppointmentsForDay(day);
            const hasAppt = dayAppts.length > 0;
            return (
              <div key={day} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isToday ? theme.accent : hasAppt ? `${theme.accent}15` : theme.surface2, border: `1px solid ${isToday ? theme.accent : hasAppt ? `${theme.accent}40` : theme.border}`, borderRadius: "8px", padding: "4px", position: "relative" }}>
                <span style={{ fontSize: "13px", fontWeight: isToday ? "800" : "600", color: isToday ? "#fff" : theme.text }}>{day}</span>
                {hasAppt && (
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                    {dayAppts.slice(0, 3).map((_, idx) => (
                      <div key={idx} style={{ width: "4px", height: "4px", borderRadius: "50%", background: isToday ? "#fff" : theme.accent }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: theme.text }}>Upcoming Appointments</h3>
            <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: `${theme.accent}18`, color: theme.accent, border: `1px solid ${theme.accent}30`, fontWeight: "700" }}>
              {upcoming.length} total
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: theme.text3 }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📅</div>
              <div style={{ fontSize: "13px" }}>No upcoming appointments</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "420px", overflowY: "auto" }}>
              {upcoming.map(appt => {
                const d = new Date(appt.date);
                const isConfirmingCancel = confirmCancel === appt.id;
                return (
                  <div key={appt.id} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "12px 14px", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${theme.accent}18`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: theme.accent, lineHeight: 1 }}>{d.getDate()}</div>
                        <div style={{ fontSize: "9px", color: theme.text3 }}>{d.toLocaleDateString("en", { month: "short" })}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>{appt.patient}</div>
                        <div style={{ fontSize: "11px", color: theme.text2 }}>{appt.doctor}</div>
                        <div style={{ fontSize: "11px", color: theme.accent, marginTop: "2px" }}>🕐 {appt.time}</div>
                      </div>
                    </div>

                    {/* Cancel */}
                    {!isConfirmingCancel ? (
                      <button onClick={() => setConfirmCancel(appt.id)}
                        style={{ marginTop: "10px", width: "100%", padding: "6px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text3, fontSize: "12px", cursor: "pointer" }}>
                        Cancel Appointment
                      </button>
                    ) : (
                      <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
                        <button onClick={() => { cancelAppointment(appt.id); setConfirmCancel(null); }}
                          style={{ flex: 1, padding: "6px", background: "#EF444418", border: "1px solid #EF444440", borderRadius: "8px", color: "#EF4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                          Yes, Cancel
                        </button>
                        <button onClick={() => setConfirmCancel(null)}
                          style={{ flex: 1, padding: "6px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text2, fontSize: "12px", cursor: "pointer" }}>
                          Keep It
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sync badge */}
        <div style={{ background: `${theme.accent}12`, border: `1px solid ${theme.accent}30`, borderRadius: "14px", padding: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ fontSize: "28px" }}>🗓️</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>Live Calendar Sync</div>
            <div style={{ fontSize: "12px", color: theme.text2 }}>Appointments update in real time</div>
          </div>
        </div>
      </div>

      {showModal && <AppointmentModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
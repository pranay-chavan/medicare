import { createContext, useContext, useState } from "react";
import patients from "../data/patients";
import { getTriageLevel } from "../utils/triage";
import wards from "../data/wards";
import doctorsData from "../data/doctors";

const PatientContext = createContext();

const getWardForPatient = (department, gender) => {
  switch (department) {
    case "Emergency":
    case "ICU": return "ICU";
    case "Cardiology": return "Cardiology";
    case "Maternity": return "Maternity";
    case "Surgery": return "Surgery";
    case "Radiology": return "X-Ray / Imaging";
    default: return gender === "Female" ? "General Women" : "General Men";
  }
};

export function PatientProvider({ children }) {
  const [queue, setQueue] = useState(
    patients.map(p => ({ ...p, triage: getTriageLevel(p.symptoms) }))
  );
  const [wardCapacity, setWardCapacity] = useState(wards);
  const [doctors, setDoctors] = useState(doctorsData);
  const [appointments, setAppointments] = useState([
    { id: "A001", patient: "Rahul Sharma", doctor: "Dr. Arjun Mehta", date: new Date(new Date().getFullYear(), new Date().getMonth(), 8), time: "10:00", status: "confirmed" },
    { id: "A002", patient: "Priya Nair", doctor: "Dr. Sunita Rao", date: new Date(new Date().getFullYear(), new Date().getMonth(), 12), time: "14:30", status: "confirmed" },
    { id: "A003", patient: "Vikram Singh", doctor: "Dr. Priya Sharma", date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), time: "09:00", status: "confirmed" },
  ]);

  const addPatient = (patient) => {
    if (patient.doctor) {
      setDoctors(prev => prev.map(d =>
        d.name === patient.doctor ? { ...d, available: false, patients: d.patients + 1 } : d
      ));
    }
    const wardName = getWardForPatient(patient.triage?.department, patient.gender);
    setWardCapacity(prev => prev.map(w =>
      w.name === wardName && w.occupied < w.total ? { ...w, occupied: w.occupied + 1 } : w
    ));
    setQueue(prev => {
      const updated = [...prev, patient];
      return updated.sort((a, b) => (a.triage?.priority ?? 99) - (b.triage?.priority ?? 99));
    });
  };

  const dischargePatient = (id) => {
    const patient = queue.find(p => p.id === id);
    if (!patient) return;
    if (patient.doctor) {
      setDoctors(prev => prev.map(d =>
        d.name === patient.doctor ? { ...d, available: true, patients: Math.max(0, d.patients - 1) } : d
      ));
    }
    const wardName = getWardForPatient(patient.triage?.department, patient.gender);
    setWardCapacity(prev => prev.map(w =>
      w.name === wardName && w.occupied > 0 ? { ...w, occupied: w.occupied - 1 } : w
    ));
    setQueue(prev => prev.filter(p => p.id !== id));
  };

  const updatePatient = (id, updates) => {
    setQueue(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addAppointment = (appointment) => {
    const id = `A${String(appointments.length + 1).padStart(3, "0")}`;
    setAppointments(prev => [...prev, { ...appointment, id, status: "confirmed" }]);
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <PatientContext.Provider value={{
      queue, wardCapacity, doctors, appointments,
      addPatient, dischargePatient, updatePatient,
      addAppointment, cancelAppointment,
    }}>
      {children}
    </PatientContext.Provider>
  );
}

export const usePatients = () => useContext(PatientContext);
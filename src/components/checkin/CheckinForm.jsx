import { useState } from "react";
import { aiTriage } from "../../utils/aiTriage";
import { getAvailableDoctor } from "../../data/doctors";
import { useTheme } from "../../context/ThemeContext";
import { usePatients } from "../../context/PatientContext";

const SYMPTOM_TAGS = [
  "Chest pain", "High fever", "Headache",
  "Cough", "Dizziness", "Vomiting",
  "Shortness of breath", "Pregnancy",
];

const LANGUAGES = [
  "English", "Hindi", "Tamil",
  "Bengali", "Marathi", "Swahili",
];

const generateQueueId = () => `P-${Math.floor(Math.random() * 900) + 100}`;

const LOADING_STEPS = [
  "Collecting patient information...",
  "Analyzing symptoms with AI...",
  "Determining urgency level...",
  "Finding available doctor...",
  "Updating queue...",
];

export default function CheckinForm() {
  const { theme } = useTheme();
  const { addPatient } = usePatients();

  const [form, setForm] = useState({
    name: "", age: "", gender: "", language: "English", symptoms: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.age || form.age < 1 || form.age > 120) e.age = "Enter a valid age";
    if (!form.gender) e.gender = "Please select a gender";
    if (!form.symptoms.trim()) e.symptoms = "Please describe your symptoms";
    return e;
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const handleTagClick = (tag) => {
    setForm(prev => ({
      ...prev,
      symptoms: prev.symptoms ? `${prev.symptoms}, ${tag.toLowerCase()}` : tag.toLowerCase(),
    }));
    setErrors(prev => ({ ...prev, symptoms: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 600));
    }

    const triage = await aiTriage(form.name, form.age, form.symptoms);
    const doctor = getAvailableDoctor(triage.department);
    const queueId = generateQueueId();

    addPatient({
      id: queueId,
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender,
      symptoms: form.symptoms,
      visits: 1,
      doctor: doctor?.name || null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "waiting",
      phone: "—",
      triage,
    });

    setResult({ triage, doctor, queueId });
    setLoading(false);
  };

  const handleReset = () => {
    setForm({ name: "", age: "", gender: "", language: "English", symptoms: "" });
    setResult(null);
    setErrors({});
    setLoadingStep(0);
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "9px 12px",
    background: theme.inputBg,
    border: `1px solid ${hasError ? theme.danger : theme.border}`,
    borderRadius: "10px",
    color: theme.text,
    fontSize: "13px",
    outline: "none",
    marginTop: "5px",
    boxSizing: "border-box",
  });

  const labelStyle = {
    fontSize: "11px",
    color: theme.text2,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: "20px", width: "100%", maxWidth: result ? "900px" : "560px", transition: "all 0.3s ease" }}>

      {/* Form */}
      {!result && (
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #ffffff, #00a6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>💊</div>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: theme.text }}>Patient Check-In</h2>
              <p style={{ margin: 0, fontSize: "12px", color: theme.text2 }}>AI powered triage system</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input value={form.name} onChange={e => handleChange("name", e.target.value)}
              placeholder="e.g. Arjun Sharma" style={inputStyle(errors.name)} />
            {errors.name && <p style={{ color: theme.danger, fontSize: "11px", margin: "3px 0 0" }}>{errors.name}</p>}
          </div>

          {/* Age + Gender + Language in one row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <div>
              <label style={labelStyle}>Age</label>
              <input value={form.age} onChange={e => handleChange("age", e.target.value)}
                type="number" placeholder="34" style={inputStyle(errors.age)} />
              {errors.age && <p style={{ color: theme.danger, fontSize: "11px", margin: "3px 0 0" }}>{errors.age}</p>}
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select value={form.gender} onChange={e => handleChange("gender", e.target.value)} style={inputStyle(errors.gender)}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <p style={{ color: theme.danger, fontSize: "11px", margin: "3px 0 0" }}>{errors.gender}</p>}
            </div>
            <div>
              <label style={labelStyle}>Language</label>
              <select value={form.language} onChange={e => handleChange("language", e.target.value)} style={inputStyle(false)}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label style={labelStyle}>Symptoms</label>
            <textarea value={form.symptoms} onChange={e => handleChange("symptoms", e.target.value)}
              placeholder="Describe how you are feeling..." rows={3}
              style={{ ...inputStyle(errors.symptoms), resize: "none", lineHeight: "1.5" }} />
            {errors.symptoms && <p style={{ color: theme.danger, fontSize: "11px", margin: "3px 0 0" }}>{errors.symptoms}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
              {SYMPTOM_TAGS.map(tag => (
                <button key={tag} onClick={() => handleTagClick(tag)}
                  style={{ padding: "4px 10px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "20px", color: theme.text2, fontSize: "11px", cursor: "pointer" }}>
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Steps */}
          {loading && (
            <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {LOADING_STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", opacity: i <= loadingStep ? 1 : 0.3, transition: "opacity 0.3s" }}>
                  {i < loadingStep ? (
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", flexShrink: 0 }}>✓</div>
                  ) : i === loadingStep ? (
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${theme.accent}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${theme.border}`, flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: "12px", color: i <= loadingStep ? theme.text : theme.text3 }}>{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: "12px", background: loading ? theme.border : "linear-gradient(135deg,#0EA5E9,#6366F1)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "🤖 AI is analyzing..." : "Check In →"}
          </button>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <>
          {/* Left — Form summary */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg,#0EA5E9,#6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⚕️</div>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: theme.text }}>Check-In Complete</h2>
                <p style={{ margin: 0, fontSize: "12px", color: theme.text2 }}>Patient has been registered</p>
              </div>
            </div>

            {/* Triage Badge */}
            <div style={{ background: result.triage.bgColor, border: `1px solid ${result.triage.borderColor}`, borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "6px" }}>{result.triage.icon}</div>
              <span style={{ display: "inline-block", padding: "3px 14px", borderRadius: "20px", background: `${result.triage.color}20`, border: `1px solid ${result.triage.color}`, color: result.triage.color, fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>
                {result.triage.level}
              </span>
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: theme.text2 }}>
                Wait: <strong style={{ color: result.triage.color }}>{result.triage.wait_time}</strong>
              </p>
            </div>

            {/* AI Reason */}
            {result.triage.reason && (
              <div style={{ background: `${theme.accent}12`, border: `1px solid ${theme.accent}30`, borderRadius: "10px", padding: "12px 14px", display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>🤖</span>
                <div>
                  <div style={{ fontSize: "10px", color: theme.accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>
                    AI Assessment {result.triage.isFallback ? "(Fallback)" : ""}
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: theme.text2, lineHeight: "1.5" }}>{result.triage.reason}</p>
                </div>
              </div>
            )}

            {/* Reset */}
            <button onClick={handleReset}
              style={{ padding: "11px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", color: theme.text2, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              ← New Patient
            </button>
          </div>

          {/* Right — Patient details */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px", animation: "fadeUp 0.4s ease" }}>
            {/* Patient Info */}
            <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                ["Patient", form.name],
                ["Queue ID", result.queueId],
                ["Age", `${form.age} yrs · ${form.gender}`],
                ["Language", form.language],
                ["Department", result.triage.department || "General"],
                ["Check-in", new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: "10px", color: theme.text3, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{k}</div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Doctor */}
            {result.doctor && (
              <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#0EA5E9,#6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>
                  {result.doctor.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: theme.text3, textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned Doctor</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: theme.text }}>{result.doctor.name}</div>
                  <div style={{ fontSize: "12px", color: theme.accent }}>{result.doctor.department}</div>
                </div>
              </div>
            )}

            {/* Notice */}
            <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "12px 14px", fontSize: "12px", color: theme.text2, lineHeight: "1.6" }}>
              💬 Please take a seat in the waiting area. A nurse will call your name shortly.
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ background: `${result.triage.color}12`, border: `1px solid ${result.triage.color}30`, borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: result.triage.color }}>{result.triage.priority}</div>
                <div style={{ fontSize: "11px", color: theme.text2, marginTop: "2px" }}>Priority Level</div>
              </div>
              <div style={{ background: `${theme.accent}12`, border: `1px solid ${theme.accent}30`, borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: theme.accent }}>{result.triage.wait_time}</div>
                <div style={{ fontSize: "11px", color: theme.text2, marginTop: "2px" }}>Est. Wait Time</div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        select option { background: ${theme.surface}; color: ${theme.text}; }
      `}</style>
    </div>
  );
}
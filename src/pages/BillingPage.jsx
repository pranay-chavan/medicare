import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePatients } from "../context/PatientContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BillingPage() {
  const { theme } = useTheme();
  const { queue, wardCapacity } = usePatients();
  const [patient, setPatient] = useState({ name: "", id: "", ward: "" });
  const [items, setItems] = useState([
    { desc: "Consultation Fee", qty: 1, rate: 500 },
    { desc: "Blood Test", qty: 2, rate: 300 },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [printed, setPrinted] = useState(false);

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

  const handleSelectPatient = (queueId) => {
    if (!queueId) {
      setPatient({ name: "", id: "", ward: "" });
      return;
    }
    const p = queue.find(q => q.id === queueId);
    if (!p) return;
    setPatient({
      name: p.name,
      id: p.id,
      ward: getWardForPatient(p.triage?.department, p.gender),
    });
  };

  const addItem = () => setItems(prev => [...prev, { desc: "", qty: 1, rate: 0 }]);
  const updateItem = (i, key, val) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [key]: key === "desc" ? val : Number(val) } : item));
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById("bill-preview");
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#0D1220",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bill_${patient.id}_${patient.name.replace(/\s+/g, "_")}.pdf`);
      setPrinted(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
    setDownloading(false);
  };

  const input = {
    padding: "10px 12px", background: theme.inputBg,
    border: `1px solid ${theme.border}`, borderRadius: "10px",
    color: theme.text, fontSize: "14px", outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "11px", color: theme.text2,
    fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" }}>
      {/* Bill Builder */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "800", color: theme.text }}>🧾 Generate Bill</h2>

        {/* Patient Selector from Queue */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Select Patient from Queue</label>
          <select onChange={e => handleSelectPatient(e.target.value)}
            style={{ ...input, marginTop: "6px" }}>
            <option value="">— Select a patient —</option>
            {queue.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.id} · {p.triage?.level}
              </option>
            ))}
          </select>
        </div>

        {/* Patient Info — auto filled or manual */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {[["Patient Name", "name"], ["Patient ID", "id"], ["Ward", "ward"]].map(([label, key]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                value={patient[key]}
                onChange={e => setPatient(p => ({ ...p, [key]: e.target.value }))}
                placeholder={`Enter ${label.toLowerCase()}`}
                style={{ ...input, marginTop: "6px" }}
              />
            </div>
          ))}
        </div>

        {/* Items Table */}
        <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 40px", padding: "10px 14px", borderBottom: `1px solid ${theme.border}`, background: theme.border }}>
            {["Description", "Qty", "Rate (₹)", ""].map(h => (
              <div key={h} style={{ fontSize: "11px", fontWeight: "700", color: theme.text2, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {items.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 40px", padding: "8px 14px", borderBottom: i < items.length - 1 ? `1px solid ${theme.border}` : "none", alignItems: "center" }}>
              <input value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)}
                placeholder="Service description"
                style={{ padding: "6px 0", background: "none", border: "none", color: theme.text, fontSize: "13px", outline: "none" }} />
              <input value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)}
                type="number" min="1"
                style={{ padding: "6px 8px", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "13px", outline: "none", width: "60px" }} />
              <input value={item.rate} onChange={e => updateItem(i, "rate", e.target.value)}
                type="number"
                style={{ padding: "6px 8px", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "13px", outline: "none", width: "80px" }} />
              <button onClick={() => removeItem(i)}
                style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "18px" }}>×</button>
            </div>
          ))}
        </div>

        <button onClick={addItem}
          style={{ padding: "8px 16px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text2, fontSize: "13px", cursor: "pointer", marginBottom: "16px" }}>
          + Add Item
        </button>

        {/* Totals */}
        <div style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px" }}>
          {[["Subtotal", `₹${subtotal.toLocaleString()}`], ["GST (5%)", `₹${tax.toLocaleString()}`]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "14px", color: theme.text2 }}>
              <span>{k}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontSize: "17px", fontWeight: "800", color: theme.text, borderTop: `1px solid ${theme.border}`, marginTop: "8px" }}>
            <span>Total</span>
            <span style={{ color: theme.accent }}>₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
          <button onClick={handleDownloadPDF} disabled={downloading}
            style={{ width: "100%", padding: "13px", background: downloading ? theme.border : "linear-gradient(135deg,#0EA5E9,#6366F1)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: downloading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {downloading ? "⏳ Generating PDF..." : "📄 Download as PDF"}
          </button>
          {printed && (
            <div style={{ padding: "10px 14px", background: "#10B98118", border: "1px solid #10B98140", borderRadius: "10px", color: "#10B981", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>
              ✅ Bill downloaded successfully!
            </div>
          )}
        </div>
      </div>

      {/* Bill Preview */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: theme.text }}>Bill Preview</h3>
          <span style={{ fontSize: "11px", color: theme.text3 }}>This is what gets downloaded</span>
        </div>

        <div id="bill-preview" style={{ background: "#0D1220", border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px" }}>
          {/* Hospital Header */}
          <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1px dashed ${theme.border}` }}>
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>⚕️</div>
            <div style={{ fontWeight: "800", fontSize: "18px", color: "#fff" }}>Medicare Hospital</div>
            <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>Rural Health Centre · Est. 2020</div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>📞 +91 98765 43210 · 📍 Village Road, District HQ</div>
          </div>

          {/* Bill Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[
              ["Patient", patient.name || "—"],
              ["Bill No", `INV-${patient.id || "000"}-${Date.now().toString().slice(-4)}`],
              ["Patient ID", patient.id || "—"],
              ["Ward", patient.ward || "—"],
              ["Date", new Date().toLocaleDateString()],
              ["Time", new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{k}</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff", marginTop: "2px" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden", marginBottom: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 60px 70px", padding: "8px 12px", background: "#1E2D45" }}>
              {["Description", "Qty", "Rate", "Amount"].map(h => (
                <div key={h} style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 40px 60px 70px", padding: "8px 12px", borderTop: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: "12px", color: "#fff" }}>{item.desc || "—"}</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>{item.qty}</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>₹{item.rate}</div>
                <div style={{ fontSize: "12px", color: "#fff", fontWeight: "600" }}>₹{(item.qty * item.rate).toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: `1px dashed ${theme.border}`, paddingTop: "12px" }}>
            {[["Subtotal", `₹${subtotal.toLocaleString()}`], ["GST (5%)", `₹${tax.toLocaleString()}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94A3B8", padding: "3px 0" }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "800", padding: "8px 0 0", borderTop: `1px solid ${theme.border}`, marginTop: "8px" }}>
              <span style={{ color: "#fff" }}>TOTAL</span>
              <span style={{ color: "#0EA5E9" }}>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "16px", borderTop: `1px dashed ${theme.border}` }}>
            <div style={{ fontSize: "12px", color: "#64748B" }}>Thank you for trusting Medicare Healthcare</div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>This is a computer generated bill</div>
          </div>
        </div>
      </div>
    </div>
  );
}
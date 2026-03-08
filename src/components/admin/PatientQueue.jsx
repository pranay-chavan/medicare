import { useTheme } from "../../context/ThemeContext";
import { getTriageLevel } from "../../utils/triage";

export default function PatientQueue({ patients, onSelect, selected }) {
  const { theme } = useTheme();
  const sorted = [...patients].sort((a, b) =>
    getTriageLevel(a.symptoms).priority - getTriageLevel(b.symptoms).priority
  );

  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}` }}>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: theme.text }}>Live Patient Queue</h3>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: theme.text2 }}>Click a patient to view details</p>
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "380px", overflowY: "auto" }}>
        {sorted.map(p => {
          const triage = getTriageLevel(p.symptoms);
          const isSelected = selected?.id === p.id;
          return (
            <div key={p.id} onClick={() => onSelect(p)}
              style={{
                background: isSelected ? `${theme.accent}12` : theme.surface2,
                border: `1px solid ${isSelected ? theme.accent : theme.border}`,
                borderRadius: "12px", padding: "12px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s",
              }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${triage.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                {triage.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: theme.text }}>
                  {p.name} <span style={{ color: theme.text3, fontWeight: "400" }}>· {p.age}y</span>
                </div>
                <div style={{ fontSize: "11px", color: theme.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.symptoms}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: `${triage.color}18`, color: triage.color, fontWeight: "700", border: `1px solid ${triage.color}30` }}>
                  {triage.level}
                </span>
                <div style={{ fontSize: "10px", color: theme.text3, marginTop: "4px" }}>{p.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
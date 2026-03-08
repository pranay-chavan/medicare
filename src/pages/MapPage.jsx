import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePatients } from "../context/PatientContext";

export default function MapPage() {
  const { theme } = useTheme();
  const { wardCapacity } = usePatients();
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => setDragging(false);
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.min(3, Math.max(0.5, prev - e.deltaY * 0.001)));
  };

  const resetView = () => { setZoom(1); setPos({ x: 0, y: 0 }); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: theme.text }}>🗺️ Hospital Floor Plan</h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: theme.text2 }}>Scroll to zoom · Click and drag to pan</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.2))}
            style={{ width: "36px", height: "36px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "18px", cursor: "pointer" }}>+</button>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
            style={{ width: "36px", height: "36px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text, fontSize: "18px", cursor: "pointer" }}>−</button>
          <button onClick={resetView}
            style={{ padding: "8px 16px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text2, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Reset</button>
          <span style={{ fontSize: "12px", color: theme.text3, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "6px 12px" }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px" }}>
        {/* Map Container */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "16px",
            overflow: "hidden",
            cursor: dragging ? "grabbing" : "grab",
            height: "600px",
            position: "relative",
            userSelect: "none",
          }}>
          <div style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 0.1s ease",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <img
              src="https://i.pinimg.com/1200x/8d/a4/65/8da4653f01a76f4a68d0f8895e03fc97.jpg"
              alt="Hospital Floor Plan"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Zoom hint */}
          <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", color: "#fff" }}>
            🖱 Scroll to zoom · Drag to pan
          </div>
        </div>

        {/* Ward Status Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: theme.text }}>Live Ward Status</h3>
              <div style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "20px", background: "#10B98118", color: "#10B981", border: "1px solid #10B98140", fontWeight: "700" }}>🔴 Live</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(wardCapacity || []).map(w => {
                const pct = (w.occupied / w.total) * 100;
                const color = pct > 85 ? "#EF4444" : pct > 60 ? "#F59E0B" : "#10B981";
                return (
                  <div key={w.id} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "10px", padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: theme.text }}>{w.icon} {w.name}</span>
                      <span style={{ fontSize: "11px", color, fontWeight: "700" }}>{w.occupied}/{w.total}</span>
                    </div>
                    <div style={{ height: "4px", background: theme.border, borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "4px", transition: "width 0.5s ease" }} />
                    </div>
                    {pct > 85 && <div style={{ fontSize: "10px", color: "#EF4444", marginTop: "4px", fontWeight: "600" }}>⚠️ Almost full</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "800", color: theme.text }}>Capacity Legend</h3>
            {[
              ["🟢", "Available", "Under 60%"],
              ["🟡", "Filling Up", "60% - 85%"],
              ["🔴", "Almost Full", "Above 85%"],
            ].map(([icon, label, sub]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: theme.text }}>{label}</div>
                  <div style={{ fontSize: "11px", color: theme.text3 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
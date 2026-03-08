import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { months, admissions, recoveries, emergencyCases, departments, reviews } from "../data/analytics";

const AnimatedNumber = ({ value, duration = 1500 }) => {
  const [display, setDisplay] = useState(0);
  const numeric = parseFloat(value);
  const isText = isNaN(numeric) || String(value).includes("min") || String(value).includes("/");

  useEffect(() => {
    if (isText) return;
    let start = 0;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setDisplay(numeric); clearInterval(timer); }
      else setDisplay(String(value).includes(".") ? parseFloat(start.toFixed(1)) : Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  if (isText) return <span>{value}</span>;
  return <span>{display}{String(value).includes("%") ? "%" : ""}</span>;
};

const StatCard = ({ icon, label, value, color, theme, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, []);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}15` : theme.surface,
        border: `1px solid ${hovered ? color : theme.border}`,
        borderRadius: "16px", padding: "20px",
        display: "flex", alignItems: "center", gap: "16px",
        cursor: "pointer", transition: "all 0.3s ease",
        transform: visible ? hovered ? "translateY(-4px)" : "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        boxShadow: hovered ? `0 8px 24px ${color}25` : "none",
      }}>
      <div style={{
        width: "52px", height: "52px", borderRadius: "14px",
        background: hovered ? `${color}30` : `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px", transition: "all 0.3s ease",
        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: "26px", fontWeight: "800", color, lineHeight: 1 }}>
          <AnimatedNumber value={value} />
        </div>
        <div style={{ fontSize: "13px", color: theme.text2, marginTop: "4px" }}>{label}</div>
      </div>
    </div>
  );
};

const BarChart = ({ data, comparison, labels, colors, theme, maxVal }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px" }}>
      {labels.map((label, i) => (
        <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "100%", display: "flex", gap: "3px", alignItems: "flex-end", height: "130px" }}>
            {[data[i], comparison?.[i]].filter(Boolean).map((val, j) => (
              <div key={j}
                onMouseEnter={() => setHoveredBar(`${i}-${j}`)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{
                  flex: 1, borderRadius: "4px 4px 0 0",
                  background: hoveredBar === `${i}-${j}` ? colors[j] : `${colors[j]}80`,
                  height: animated ? `${(val / maxVal) * 100}%` : "0%",
                  transition: `height 1s ease ${i * 0.1}s, background 0.2s ease`,
                  cursor: "pointer", position: "relative",
                }}>
                {hoveredBar === `${i}-${j}` && (
                  <div style={{
                    position: "absolute", top: "-28px", left: "50%", transform: "translateX(-50%)",
                    background: theme.surface, border: `1px solid ${theme.border}`,
                    borderRadius: "6px", padding: "3px 8px", fontSize: "11px",
                    fontWeight: "700", color: colors[j], whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 10,
                  }}>{val}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: theme.text3 }}>{label}</div>
        </div>
      ))}
    </div>
  );
};

const DeptBar = ({ dept, theme, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), delay); return () => clearTimeout(t); }, []);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        marginBottom: "10px", cursor: "pointer",
        padding: "10px 12px", borderRadius: "10px",
        background: hovered ? `${dept.color}10` : "transparent",
        border: `1px solid ${hovered ? dept.color + "40" : "transparent"}`,
        transition: "all 0.2s ease",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: dept.color }} />
          <span style={{ fontSize: "13px", color: theme.text, fontWeight: "600" }}>{dept.name}</span>
        </div>
        <span style={{ fontSize: "13px", color: dept.color, fontWeight: "800" }}>{dept.performance}%</span>
      </div>
      <div style={{ height: "6px", background: theme.border, borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: animated ? `${dept.performance}%` : "0%",
          background: `linear-gradient(90deg, ${dept.color}80, ${dept.color})`,
          borderRadius: "4px",
          transition: `width 1.2s ease ${delay}ms`,
          boxShadow: hovered ? `0 0 8px ${dept.color}60` : "none",
        }} />
      </div>
    </div>
  );
};

const DeptStatRow = ({ dept, theme }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px", borderRadius: "12px",
        background: hovered ? `${dept.color}12` : theme.surface2,
        border: `1px solid ${hovered ? dept.color + "40" : theme.border}`,
        transition: "all 0.2s ease", cursor: "pointer", marginBottom: "8px",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: dept.color }} />
        <span style={{ fontSize: "13px", fontWeight: "600", color: theme.text }}>{dept.name}</span>
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", color: theme.text3 }}>Performance</div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: dept.color }}>{dept.performance}%</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", color: theme.text3 }}>Status</div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: dept.performance > 93 ? "#10B981" : "#F59E0B" }}>
            {dept.performance > 93 ? "Excellent" : "Good"}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({ review, theme, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, []);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? theme.surface2 : theme.surface,
        border: `1px solid ${hovered ? theme.accent + "40" : theme.border}`,
        borderRadius: "14px", padding: "16px", cursor: "pointer",
        transition: "all 0.3s ease",
        transform: visible ? hovered ? "translateX(4px)" : "translateX(0)" : "translateX(-20px)",
        opacity: visible ? 1 : 0,
        boxShadow: hovered ? `0 4px 16px ${theme.accent}15` : "none",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "#fff" }}>
            {review.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>{review.name}</div>
            <div style={{ fontSize: "10px", color: theme.text3 }}>{review.date}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ fontSize: "13px", color: i < review.rating ? "#F59E0B" : theme.border }}>★</span>
          ))}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: "13px", color: theme.text2, lineHeight: "1.6", fontStyle: "italic" }}>
        "{review.text}"
      </p>
    </div>
  );
};

const SummaryCard = ({ item, theme }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${item.color}12` : theme.surface2,
        border: `1px solid ${hovered ? item.color + "40" : theme.border}`,
        borderRadius: "12px", padding: "16px",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "pointer",
      }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
      <div style={{ fontSize: "11px", color: theme.text3, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
      <div style={{ fontSize: "15px", fontWeight: "800", color: item.color, marginTop: "4px" }}>{item.value}</div>
      <div style={{ fontSize: "12px", color: theme.text2, marginTop: "2px" }}>{item.sub}</div>
    </div>
  );
};

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const maxAdm = Math.max(...admissions);
  const [activeTab, setActiveTab] = useState("overview");

  const STAT_CARDS = [
    { icon: "✅", label: "Recovery Rate", value: "95.2%", color: "#10B981", delay: 0 },
    { icon: "🏥", label: "Total Admissions", value: "401", color: theme.accent, delay: 100 },
    { icon: "⏱", label: "Avg Wait Time", value: "23 min", color: "#F59E0B", delay: 200 },
    { icon: "⭐", label: "Patient Rating", value: "4.7/5", color: "#8B5CF6", delay: 300 },
  ];

  const SUMMARY_CARDS = [
    { label: "Highest Admissions", value: "January 2025", sub: "401 patients", color: theme.accent, icon: "📈" },
    { label: "Best Recovery Month", value: "January 2025", sub: "382 recoveries", color: "#10B981", icon: "💚" },
    { label: "Peak Emergency", value: "January 2025", sub: "61 cases", color: "#EF4444", icon: "🚨" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {STAT_CARDS.map((s, i) => <StatCard key={i} {...s} theme={theme} />)}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "8px", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "6px", width: "fit-content" }}>
        {["overview", "departments", "reviews"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: activeTab === tab ? theme.accent : "transparent",
              color: activeTab === tab ? "#fff" : theme.text2,
              fontSize: "13px", fontWeight: "700", transition: "all 0.2s ease",
              textTransform: "capitalize",
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", animation: "fadeUp 0.4s ease" }}>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "800", color: theme.text }}>Monthly Admissions vs Recoveries</h3>
            <p style={{ margin: "0 0 20px", fontSize: "12px", color: theme.text2 }}>Hover over bars for details</p>
            <BarChart data={admissions} comparison={recoveries} labels={months} colors={[theme.accent, "#10B981"]} theme={theme} maxVal={maxAdm} />
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              {[["Admissions", theme.accent], ["Recoveries", "#10B981"]].map(([label, color]) => (
                <div key={label} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: color }} />
                  <span style={{ fontSize: "11px", color: theme.text2 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "800", color: theme.text }}>Emergency Cases Trend</h3>
            <p style={{ margin: "0 0 20px", fontSize: "12px", color: theme.text2 }}>Hover over bars for details</p>
            <BarChart data={emergencyCases} labels={months} colors={["#EF4444"]} theme={theme} maxVal={70} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {SUMMARY_CARDS.map((item, i) => <SummaryCard key={i} item={item} theme={theme} />)}
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === "departments" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", animation: "fadeUp 0.4s ease" }}>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "800", color: theme.text }}>Department Performance</h3>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: theme.text2 }}>Hover over each bar</p>
            {departments.map((dept, i) => <DeptBar key={dept.name} dept={dept} theme={theme} delay={i * 150} />)}
          </div>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "800", color: theme.text }}>Department Stats</h3>
            {departments.map((dept, i) => <DeptStatRow key={i} dept={dept} theme={theme} />)}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", animation: "fadeUp 0.4s ease" }}>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "800", color: theme.text }}>Patient Reviews</h3>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: theme.text2 }}>Hover over cards</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviews.map((r, i) => <ReviewCard key={i} review={r} theme={theme} delay={i * 150} />)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "64px", fontWeight: "800", color: "#F59E0B", lineHeight: 1 }}>4.7</div>
              <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "8px 0" }}>
                {Array.from({ length: 5 }, (_, i) => <span key={i} style={{ fontSize: "24px", color: "#F59E0B" }}>★</span>)}
              </div>
              <div style={{ fontSize: "14px", color: theme.text2 }}>Average Rating</div>
              <div style={{ fontSize: "12px", color: theme.text3, marginTop: "4px" }}>Based on {reviews.length} reviews</div>
            </div>
            <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "800", color: theme.text }}>Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                const pct = (count / reviews.length) * 100;
                return (
                  <div key={rating} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: theme.text2, width: "20px" }}>{rating}★</span>
                    <div style={{ flex: 1, height: "6px", background: theme.border, borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#F59E0B", borderRadius: "4px", transition: "width 1s ease" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: theme.text3, width: "20px" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
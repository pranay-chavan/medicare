const EMERGENCY_KEYWORDS = [
  "chest pain", "chest", "breath", "breathing", "unconscious",
  "stroke", "heart attack", "heart", "seizure", "not breathing",
  "severe bleeding", "bleed", "collapsed", "fainted"
];

const URGENT_KEYWORDS = [
  "fever", "high fever", "pain", "severe pain", "dizzy", "dizziness",
  "fracture", "broken", "vomiting", "diarrhea", "infection",
  "swelling", "allergic", "allergy", "burning"
];

export const getTriageLevel = (symptoms) => {
  const s = symptoms.toLowerCase();

  const isEmergency = EMERGENCY_KEYWORDS.some(k => s.includes(k));
  if (isEmergency) return {
    level: "EMERGENCY",
    color: "#EF4444",
    bgColor: "#2D0A0A",
    borderColor: "#EF444440",
    icon: "🚨",
    wait: "Immediate",
    priority: 1
  };

  const isUrgent = URGENT_KEYWORDS.some(k => s.includes(k));
  if (isUrgent) return {
    level: "URGENT",
    color: "#F59E0B",
    bgColor: "#2D1800",
    borderColor: "#F59E0B40",
    icon: "⚠️",
    wait: "15–30 min",
    priority: 2
  };

  return {
    level: "NORMAL",
    color: "#10B981",
    bgColor: "#0A2D15",
    borderColor: "#10B98140",
    icon: "✅",
    wait: "45–60 min",
    priority: 3
  };
};
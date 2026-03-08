const GROQ_TOKEN = import.meta.env.VITE_GROQ_TOKEN;
const MODEL = "llama3-8b-8192";

const buildPrompt = (name, age, symptoms) => {
  return `You are a medical triage AI. Analyze the patient symptoms and return ONLY a valid JSON object with no extra text.

Patient:
Name: ${name}
Age: ${age}
Symptoms: ${symptoms}

Return this exact JSON format:
{"triage":"EMERGENCY","reason":"brief reason","department":"ICU","wait_time":"Immediate"}

Triage must be one of: EMERGENCY, URGENT, NORMAL
Department must be one of: Emergency, Cardiology, General, ICU, Radiology, Maternity, Surgery
Wait time must be one of: Immediate, 15-30 min, 45-60 min

Assignment rules:
EMERGENCY triage: chest pain, breathing issues, heart attack, stroke, seizure, unconscious
URGENT triage: high fever, fractures, severe pain, bleeding, dizziness
NORMAL triage: mild cough, cold, minor headache, routine checkup
Pregnancy symptoms: Maternity department
Surgery symptoms: Surgery department
EMERGENCY goes to ICU or Emergency department
URGENT goes to Cardiology or General department
NORMAL goes to General department`;
};

const parseAIResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.triage || !parsed.reason || !parsed.department || !parsed.wait_time) {
      throw new Error("Missing fields");
    }

    const level = parsed.triage.toUpperCase();
    if (!["EMERGENCY", "URGENT", "NORMAL"].includes(level)) {
      throw new Error("Invalid triage level");
    }

    return {
      level,
      reason: parsed.reason,
      department: parsed.department,
      wait_time: parsed.wait_time,
      color: level === "EMERGENCY" ? "#EF4444" : level === "URGENT" ? "#F59E0B" : "#10B981",
      bgColor: level === "EMERGENCY" ? "#2D0A0A" : level === "URGENT" ? "#2D1800" : "#0A2D15",
      borderColor: level === "EMERGENCY" ? "#EF444440" : level === "URGENT" ? "#F59E0B40" : "#10B98140",
      icon: level === "EMERGENCY" ? "🚨" : level === "URGENT" ? "⚠️" : "✅",
      priority: level === "EMERGENCY" ? 1 : level === "URGENT" ? 2 : 3,
    };
  } catch (err) {
    console.warn("Parse failed:", err);
    return null;
  }
};

const fallbackTriage = (symptoms) => {
  const s = symptoms.toLowerCase();
  const emergencyWords = ["chest", "breath", "unconscious", "stroke", "heart", "seizure", "bleed", "fainted"];
  const urgentWords = ["fever", "pain", "dizzy", "fracture", "vomit", "infection", "swelling", "allergy"];
  const maternityWords = ["pregnancy", "pregnant", "labour", "maternity", "contractions"];
  const surgeryWords = ["surgery", "surgical", "operation"];

  const level = emergencyWords.some(w => s.includes(w)) ? "EMERGENCY"
    : urgentWords.some(w => s.includes(w)) ? "URGENT"
    : "NORMAL";

  const department = maternityWords.some(w => s.includes(w)) ? "Maternity"
    : surgeryWords.some(w => s.includes(w)) ? "Surgery"
    : level === "EMERGENCY" ? "ICU"
    : level === "URGENT" ? "Cardiology"
    : "General";

  return {
    level,
    reason: "Assessed based on reported symptoms.",
    department,
    wait_time: level === "EMERGENCY" ? "Immediate" : level === "URGENT" ? "15-30 min" : "45-60 min",
    color: level === "EMERGENCY" ? "#EF4444" : level === "URGENT" ? "#F59E0B" : "#10B981",
    bgColor: level === "EMERGENCY" ? "#2D0A0A" : level === "URGENT" ? "#2D1800" : "#0A2D15",
    borderColor: level === "EMERGENCY" ? "#EF444440" : level === "URGENT" ? "#F59E0B40" : "#10B98140",
    icon: level === "EMERGENCY" ? "🚨" : level === "URGENT" ? "⚠️" : "✅",
    priority: level === "EMERGENCY" ? 1 : level === "URGENT" ? 2 : 3,
    isFallback: true,
  };
};

export const aiTriage = async (name, age, symptoms) => {
  if (!GROQ_TOKEN) {
    console.warn("⚠️ No Groq token found, using fallback");
    return fallbackTriage(symptoms);
  }

  try {
    console.log("🤖 Sending to Groq AI...");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: buildPrompt(name, age, symptoms) }],
          temperature: 0.1,
          max_tokens: 150,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "";
    console.log("🤖 AI raw response:", generatedText);

    const parsed = parseAIResponse(generatedText);
    if (!parsed) throw new Error("Could not parse response");

    console.log("✅ AI triage result:", parsed);
    return parsed;

  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("⚠️ Groq timed out, using fallback");
    } else {
      console.warn("⚠️ AI failed, using fallback:", err.message);
    }
    return fallbackTriage(symptoms);
  }
};
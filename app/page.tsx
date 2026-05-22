"use client";
import { useState } from "react";
import {
  Plus, MessageSquare, ChevronLeft, ChevronRight,
  Paperclip, Send, FileText, BookOpen, Microscope,
  Shield, Activity, User, Clock, ChevronDown,
  Stethoscope, Lock, Cpu, AlertCircle, Check
} from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');`;

const SESSIONS = [
  { id: 1, title: "Respiratory alkalosis DDx", time: "2h ago", active: true },
  { id: 2, title: "Cardiology — STEMI workup", time: "Yesterday" },
  { id: 3, title: "Renal pathology: FSGS vs MCD", time: "2d ago" },
  { id: 4, title: "Pharmacokinetics — CYP450", time: "3d ago" },
  { id: 5, title: "Pediatric fever protocol", time: "1w ago" },
];

const MESSAGES = [
  {
    role: "user",
    avatar: "MS",
    name: "Med Student",
    time: "10:41 AM",
    text: "Can you walk me through the pathophysiology of respiratory alkalosis and help me build a differential? I'm seeing a 24-year-old anxious patient with tingling in her extremities and a pH of 7.52.",
  },
  {
    role: "assistant",
    avatar: "NX",
    name: "Nexus AI",
    time: "10:41 AM",
    text: "Great clinical scenario. Let me break this down systematically.\n\nRespiratory alkalosis occurs when **alveolar hyperventilation** reduces PaCO₂ below 35 mmHg, raising pH > 7.45. Your patient's pH of 7.52 with anxious presentation and paresthesias (tingling) is a classic picture.\n\nI've generated a full differential and study plan in the Clinical Canvas →",
    tags: ["DDx Generated", "Study Plan Ready"],
  },
];

const NOTES_CONTENT = `## Respiratory Alkalosis — Clinical Framework

**Definition**: Primary reduction in PaCO₂ (<35 mmHg) due to alveolar hyperventilation, causing pH > 7.45.

---

### Pathophysiology

When ventilation exceeds metabolic CO₂ production, carbonic acid levels fall:

\`CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻\`

The leftward shift reduces free H⁺, raising pH. Hypocapnia also causes **cerebral vasoconstriction** and shifts the O₂-Hb dissociation curve left (increased O₂ affinity → tissue hypoxia).

---

### Differential Diagnosis

#### Central Stimulation
- **Anxiety / Panic disorder** ← *most likely in your patient*
- CNS lesions (stroke, tumor, trauma)
- Fever, pain, sepsis
- Drugs: salicylates (early), progesterone, theophylline

#### Hypoxemia-Driven
- Pneumonia, pulmonary edema
- High altitude
- Severe anemia (Hb <7)

#### Pulmonary Receptor Stimulation
- Pulmonary embolism ← *always rule out*
- Interstitial lung disease
- Pneumothorax

#### Iatrogenic
- Mechanical over-ventilation
- Liver failure (cirrhosis)

---

### Your Patient's Key Features

| Finding | Significance |
|---|---|
| Age 24, female | Panic disorder prevalence peak |
| pH 7.52 | Acute (uncompensated) |
| Paresthesias | Ca²⁺ binding to albumin ↑ → ionized hypocalcemia |
| Anxiety | Central hyperventilation driver |

---

### Compensation

**Acute** (minutes–hours): HCO₃⁻ ↓ 2 mEq/L per 10 mmHg ↓ PaCO₂  
**Chronic** (2–5 days): HCO₃⁻ ↓ 5 mEq/L per 10 mmHg ↓ PaCO₂  
Expected HCO₃⁻ = 24 − (compensation) → compare to measured value.`;

const STUDY_CONTENT = `## Personalised Study Plan — Acid-Base Mastery

**Estimated completion**: 3 sessions × 45 min

---

### Session 1 — Foundations (Tonight)

- [ ] Review Henderson-Hasselbalch equation
- [ ] Map all 4 primary acid-base disorders on pH axis
- [ ] Memorise Winter's formula and Respiratory compensation rules
- [ ] **Anki deck**: 25 cards on ABG interpretation

**Key resource**: UpToDate "Simple and mixed acid-base disorders"

---

### Session 2 — Differential Mastery (Day 3)

- [ ] Work through 10 UWorld questions (filter: acid-base)
- [ ] Build your own "Causes of Respiratory Alkalosis" mind map
- [ ] Practice: Given any ABG, identify primary + compensation
- [ ] Review: ionised hypocalcemia mechanism in alkalosis

**Weak point to target**: Chronic vs acute compensation — this trips up 78% of students.

---

### Session 3 — Clinical Application (Day 5)

- [ ] 3 complete case vignettes (NBMEs or Amboss)
- [ ] Review PE as a cause — Wells score, d-dimer decision tree
- [ ] Quiz yourself on drug-induced alkalosis mechanisms
- [ ] Consolidation: Write a one-page summary in your own words

---

### Progress Tracker

\`Acid-Base Core\` ████████░░ 78%  
\`Respiratory Disorders\` ██████░░░░ 60%  
\`Clinical Application\` ████░░░░░░ 42%`;

const PATHOLOGY_CONTENT = `## Pathology Diagrams — Respiratory Alkalosis

*Visual aids generated for this consult*

---

### Diagram 1 — ABG Interpretation Algorithm

\`\`\`
Step 1: pH
  ├─ < 7.35 → ACIDOSIS
  │     ├─ PaCO₂ > 45 → Respiratory Acidosis
  │     └─ HCO₃⁻ < 22 → Metabolic Acidosis
  └─ > 7.45 → ALKALOSIS  ← YOU ARE HERE
        ├─ PaCO₂ < 35 → Respiratory Alkalosis ✓
        └─ HCO₃⁻ > 26 → Metabolic Alkalosis

Step 2: Compensation (check for mixed disorder)
  └─ Expected HCO₃⁻ = 24 − (1.5 × ΔPCO₂)
\`\`\`

---

### Diagram 2 — Ionised Hypocalcaemia Mechanism

\`\`\`
↑ pH (alkalosis)
    │
    ▼
Albumin binds more Ca²⁺
(more negative charge at high pH)
    │
    ▼
↓ Ionised Ca²⁺ (free calcium)
    │
    ├─ Neuromuscular excitability ↑
    │       └─ Paresthesias, carpopedal spasm
    │
    └─ Chvostek's / Trousseau's signs
\`\`\`

---

### Diagram 3 — Cerebral Vasoconstriction

\`\`\`
↓ PaCO₂
    │
    ▼
Cerebral arterial vasoconstriction
    │
    ▼
↓ Cerebral blood flow (up to 4% per mmHg ↓ PCO₂)
    │
    ├─ Lightheadedness / dizziness
    ├─ Visual changes
    └─ Syncope (severe)
\`\`\`

---

*Diagrams can be exported as SVG or PDF for revision notes.*`;

const TAB_CONTENT = {
  notes: NOTES_CONTENT,
  study: STUDY_CONTENT,
  pathology: PATHOLOGY_CONTENT,
};

function MarkdownLine({ line }) {
  if (line.startsWith("### ")) {
    return <h3 style={{ fontFamily: "'Geist', sans-serif", fontSize: "13px", fontWeight: 600, color: "#0f0f0e", margin: "20px 0 8px", letterSpacing: "0.02em", textTransform: "uppercase" }}>{line.slice(4)}</h3>;
  }
  if (line.startsWith("## ")) {
    return <h2 style={{ fontFamily: "'Geist', sans-serif", fontSize: "16px", fontWeight: 600, color: "#0f0f0e", margin: "0 0 16px" }}>{line.slice(3)}</h2>;
  }
  if (line.startsWith("**") && line.endsWith("**")) {
    return <p style={{ fontWeight: 600, color: "#0f0f0e", fontSize: "13px", margin: "12px 0 4px" }}>{line.slice(2, -2)}</p>;
  }
  if (line.startsWith("---")) {
    return <hr style={{ border: "none", borderTop: "0.5px solid #e4e4e0", margin: "20px 0" }} />;
  }
  if (line.startsWith("- [ ] ")) {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", margin: "6px 0" }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid #d0d0cc", marginTop: 1, flexShrink: 0 }} />
        <span style={{ fontSize: "13px", color: "#3a3a38", lineHeight: "1.6", fontFamily: "'Geist', sans-serif" }}>{line.slice(6)}</span>
      </div>
    );
  }
  if (line.startsWith("- **")) {
    const parts = line.slice(2);
    return <div style={{ fontSize: "13px", color: "#3a3a38", margin: "5px 0", paddingLeft: 16, lineHeight: "1.6", fontFamily: "'Geist', sans-serif" }}>• {parts.replace(/\*\*(.*?)\*\*/g, "$1")}</div>;
  }
  if (line.startsWith("- ")) {
    return <div style={{ fontSize: "13px", color: "#3a3a38", margin: "4px 0", paddingLeft: 16, lineHeight: "1.6", fontFamily: "'Geist', sans-serif" }}>• {line.slice(2)}</div>;
  }
  if (line.startsWith("| ")) {
    return null;
  }
  if (line.startsWith("`") && line.endsWith("`") && !line.startsWith("```")) {
    return <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", background: "#f0efec", padding: "2px 6px", borderRadius: 4, color: "#2d5be3" }}>{line.slice(1, -1)}</code>;
  }
  if (line.startsWith("```") || line === "```") return null;
  if (line.trim() === "") return <div style={{ height: "6px" }} />;

  const renderInline = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|←.*)/);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} style={{ color: "#0f0f0e", fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
      if (p.startsWith("`") && p.endsWith("`")) return <code key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: "11.5px", background: "#f0efec", padding: "1px 5px", borderRadius: 3, color: "#2d5be3" }}>{p.slice(1, -1)}</code>;
      if (p.startsWith("←")) return <span key={i} style={{ color: "#1d6fe8", fontStyle: "italic", fontSize: "12px" }}>{p}</span>;
      return p;
    });
  };

  return <p style={{ fontSize: "13px", color: "#3a3a38", margin: "4px 0", lineHeight: "1.75", fontFamily: "'Geist', sans-serif" }}>{renderInline(line)}</p>;
}

function CanvasContent({ tab }) {
  const content = TAB_CONTENT[tab];
  const lines = content.split("\n");

  const isTable = (i) => lines[i]?.startsWith("| ");
  const isCode = (i) => lines[i]?.startsWith("```");

  const rendered = [];
  let i = 0;
  while (i < lines.length) {
    if (isTable(i)) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split("|").filter(Boolean).map((s) => s.trim());
      const rows = tableLines.slice(2).map((l) => l.split("|").filter(Boolean).map((s) => s.trim()));
      rendered.push(
        <table key={i} style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", margin: "12px 0 16px", fontFamily: "'Geist', sans-serif" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e4e4e0" }}>
              {headers.map((h, j) => <th key={j} style={{ textAlign: "left", padding: "6px 10px", color: "#8a8a86", fontWeight: 500, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, j) => (
              <tr key={j} style={{ borderBottom: "0.5px solid #f0efec" }}>
                {row.map((cell, k) => <td key={k} style={{ padding: "7px 10px", color: "#3a3a38" }}>{cell.replace(/\*\*(.*?)\*\*/g, "$1")}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (isCode(i)) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      rendered.push(
        <pre key={i} style={{ background: "#f5f4f1", border: "0.5px solid #e4e4e0", borderRadius: 8, padding: "14px 16px", fontSize: "12px", fontFamily: "'DM Mono', monospace", color: "#2c2c2a", overflowX: "auto", margin: "12px 0", lineHeight: "1.7" }}>
          {codeLines.join("\n")}
        </pre>
      );
    } else {
      rendered.push(<MarkdownLine key={rendered.length} line={lines[i]} />);
      i++;
    }
  }
  return <>{rendered}</>;
}

export default function NexusHealth() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [clinicalTwin, setClinicalTwin] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [inputValue, setInputValue] = useState("");
  const [activeSession, setActiveSession] = useState(1);

  const tabs = [
    { id: "notes", label: "Detailed Notes", icon: FileText },
    { id: "study", label: "Study Plan", icon: BookOpen },
    { id: "pathology", label: "Pathology Diagrams", icon: Microscope },
  ];

  return (
    <>
      <style>{FONT_IMPORT}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f4f1; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0d0cc; border-radius: 2px; }
        .sidebar-item:hover { background: #f5f4f1; }
        .sidebar-item.active { background: #eeeee9; }
        .chat-send:hover { background: #1558d0; }
        .tab-btn:hover { color: #0f0f0e; }
        .tab-btn.active { color: #0f0f0e; border-bottom: 1.5px solid #1d6fe8; }
        .new-consult:hover { background: #0f0f0e; }
        .toggle-track { transition: background 0.25s; }
        .session-dot { width: 6px; height: 6px; border-radius: 50%; background: #1d6fe8; flex-shrink: 0; margin-top: 5px; }
      `}</style>

      <div style={{
        display: "flex",
        height: "100vh",
        background: "#f5f4f1",
        fontFamily: "'Geist', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: sidebarCollapsed ? 60 : 240,
          minWidth: sidebarCollapsed ? 60 : 240,
          background: "#ffffff",
          borderRight: "0.5px solid #e4e4e0",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s ease, min-width 0.25s ease",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}>

          {/* Logo + Collapse */}
          <div style={{ padding: "18px 16px 14px", borderBottom: "0.5px solid #e4e4e0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            {!sidebarCollapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#0f0f0e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity size={14} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f0f0e", letterSpacing: "-0.02em" }}>Nexus Health</div>
                  <div style={{ fontSize: "10px", color: "#aaa9a4", letterSpacing: "0.04em", textTransform: "uppercase" }}>Clinical AI</div>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#0f0f0e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                <Activity size={14} color="#ffffff" />
              </div>
            )}
            {!sidebarCollapsed && (
              <button onClick={() => setSidebarCollapsed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa9a4", padding: 4, borderRadius: 4, display: "flex" }}>
                <ChevronLeft size={15} />
              </button>
            )}
          </div>

          {/* New Consult */}
          <div style={{ padding: "12px 10px 8px", flexShrink: 0 }}>
            <button
              className="new-consult"
              onClick={() => setSidebarCollapsed(false)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                gap: 8,
                background: "#0f0f0e",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: sidebarCollapsed ? "9px" : "9px 12px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                fontFamily: "'Geist', sans-serif",
                transition: "background 0.15s",
              }}
            >
              <Plus size={15} />
              {!sidebarCollapsed && "New Consult"}
            </button>
          </div>

          {/* Session List */}
          {!sidebarCollapsed && (
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 10px" }}>
              <div style={{ fontSize: "10px", color: "#aaa9a4", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 6px 6px" }}>Recent</div>
              {SESSIONS.map((s) => (
                <button
                  key={s.id}
                  className={`sidebar-item ${activeSession === s.id ? "active" : ""}`}
                  onClick={() => setActiveSession(s.id)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 8px",
                    borderRadius: 7, textAlign: "left", transition: "background 0.12s",
                  }}
                >
                  {activeSession === s.id
                    ? <div className="session-dot" />
                    : <MessageSquare size={13} color="#c0bfba" style={{ flexShrink: 0, marginTop: 2 }} />
                  }
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "12.5px", color: activeSession === s.id ? "#0f0f0e" : "#6b6b67", fontWeight: activeSession === s.id ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 155 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#c0bfba", marginTop: 1 }}>{s.time}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {sidebarCollapsed && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0" }}>
              {SESSIONS.slice(0, 4).map((s) => (
                <button key={s.id} onClick={() => { setActiveSession(s.id); setSidebarCollapsed(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: activeSession === s.id ? "#0f0f0e" : "#c0bfba" }}>
                  <MessageSquare size={14} />
                </button>
              ))}
            </div>
          )}

          {/* Expand button when collapsed */}
          {sidebarCollapsed && (
            <div style={{ padding: "8px", borderTop: "0.5px solid #e4e4e0", flexShrink: 0 }}>
              <button onClick={() => setSidebarCollapsed(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa9a4", width: "100%", display: "flex", justifyContent: "center", padding: 6, borderRadius: 6 }}>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Clinical Twin Toggle */}
          {!sidebarCollapsed && (
            <div style={{ padding: "12px 14px", borderTop: "0.5px solid #e4e4e0", flexShrink: 0 }}>
              <div style={{ background: clinicalTwin ? "#eef3ff" : "#f5f4f1", borderRadius: 10, padding: "10px 12px", border: clinicalTwin ? "0.5px solid #c7d9fb" : "0.5px solid #e4e4e0", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Lock size={11} color={clinicalTwin ? "#1d6fe8" : "#aaa9a4"} />
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: clinicalTwin ? "#1558d0" : "#6b6b67", letterSpacing: "-0.01em" }}>Clinical Twin Mode</span>
                  </div>
                  <div
                    onClick={() => setClinicalTwin(!clinicalTwin)}
                    style={{
                      width: 32, height: 18, borderRadius: 9, cursor: "pointer",
                      background: clinicalTwin ? "#1d6fe8" : "#d0d0cc",
                      position: "relative", transition: "background 0.2s", flexShrink: 0,
                    }}
                    className="toggle-track"
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%", background: "#fff",
                      position: "absolute", top: 2, left: clinicalTwin ? 16 : 2,
                      transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }} />
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: clinicalTwin ? "#7aa4f0" : "#c0bfba", letterSpacing: "0.01em" }}>
                  {clinicalTwin ? "🔒 End-to-end encrypted session" : "Encrypted · HIPAA compliant"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MAIN CHAT COLUMN */}
        <div style={{
          flex: "0 0 40%",
          display: "flex",
          flexDirection: "column",
          background: "#fafaf8",
          borderRight: "0.5px solid #e4e4e0",
          minWidth: 0,
        }}>
          {/* Chat Header */}
          <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #e4e4e0", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f0f0e", letterSpacing: "-0.02em" }}>Respiratory Alkalosis DDx</div>
              <div style={{ fontSize: "11px", color: "#aaa9a4", marginTop: 1 }}>Internal Medicine · Case #2847</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: "11px", color: "#6b6b67" }}>Live session</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 12px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ fontSize: "11px", color: "#c0bfba", background: "#f0efec", padding: "4px 10px", borderRadius: 20, fontFamily: "'DM Mono', monospace" }}>Today, 10:40 AM</div>
            </div>

            {MESSAGES.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 6 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: msg.role === "user" ? "#f0efec" : "#0f0f0e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 600,
                    color: msg.role === "user" ? "#6b6b67" : "#ffffff",
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    {msg.avatar}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f0f0e" }}>{msg.name}</span>
                      <span style={{ fontSize: "11px", color: "#c0bfba", fontFamily: "'DM Mono', monospace" }}>{msg.time}</span>
                    </div>
                    <div style={{
                      background: msg.role === "user" ? "#ffffff" : "#f7f6f3",
                      border: "0.5px solid #e4e4e0",
                      borderRadius: msg.role === "user" ? "2px 12px 12px 12px" : "12px 2px 12px 12px",
                      padding: "12px 14px",
                      fontSize: "13.5px",
                      color: "#2c2c2a",
                      lineHeight: "1.7",
                    }}>
                      {msg.text.split("\n").map((line, i) => {
                        if (line.includes("**")) {
                          const parts = line.split(/(\*\*.*?\*\*)/);
                          return <p key={i} style={{ margin: i > 0 ? "8px 0 0" : 0 }}>{parts.map((p, j) => p.startsWith("**") ? <strong key={j} style={{ fontWeight: 600, color: "#0f0f0e" }}>{p.slice(2, -2)}</strong> : p)}</p>;
                        }
                        return <p key={i} style={{ margin: i > 0 ? "8px 0 0" : 0 }}>{line}</p>;
                      })}
                    </div>
                    {msg.tags && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {msg.tags.map((tag, ti) => (
                          <span key={ti} style={{ fontSize: "11px", fontWeight: 500, background: "#eef3ff", color: "#1d6fe8", padding: "3px 8px", borderRadius: 20, border: "0.5px solid #c7d9fb" }}>
                            <Check size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 11, opacity: 0.6 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#f0efec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "#6b6b67", flexShrink: 0 }}>MS</div>
              <div style={{ fontSize: "12px", color: "#aaa9a4", fontStyle: "italic" }}>Medical student is composing a follow-up…</div>
            </div>
          </div>

          {/* Input Area */}
          <div style={{ padding: "12px 16px 16px", background: "#ffffff", borderTop: "0.5px solid #e4e4e0", flexShrink: 0 }}>
            <div style={{ background: "#fafaf8", border: "0.5px solid #d0d0cc", borderRadius: 12, overflow: "hidden", transition: "border-color 0.15s" }}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a clinical question, upload labs, or describe your patient…"
                style={{
                  width: "100%", background: "none", border: "none", outline: "none",
                  resize: "none", padding: "12px 14px 8px",
                  fontSize: "13.5px", color: "#2c2c2a", lineHeight: "1.6",
                  fontFamily: "'Geist', sans-serif", minHeight: 72,
                  "::placeholder": { color: "#c0bfba" },
                }}
                rows={3}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 7, cursor: "pointer", padding: "5px 10px", display: "flex", alignItems: "center", gap: 5, color: "#6b6b67", fontSize: "12px", fontFamily: "'Geist', sans-serif" }}>
                    <Paperclip size={12} />
                    Upload Labs
                  </button>
                  <button style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 7, cursor: "pointer", padding: "5px 10px", display: "flex", alignItems: "center", gap: 5, color: "#6b6b67", fontSize: "12px", fontFamily: "'Geist', sans-serif" }}>
                    <Stethoscope size={12} />
                    Vitals
                  </button>
                </div>
                <button
                  className="chat-send"
                  style={{
                    background: inputValue ? "#0f0f0e" : "#e4e4e0",
                    border: "none", borderRadius: 8, cursor: "pointer",
                    width: 32, height: 32, display: "flex", alignItems: "center",
                    justifyContent: "center", transition: "background 0.15s",
                  }}
                >
                  <Send size={13} color={inputValue ? "#ffffff" : "#aaa9a4"} />
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
              <span style={{ fontSize: "10.5px", color: "#c0bfba", fontFamily: "'DM Mono', monospace" }}>
                Nexus AI · For educational use only · Not a substitute for clinical judgment
              </span>
            </div>
          </div>
        </div>

        {/* CLINICAL CANVAS */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          minWidth: 0,
        }}>
          {/* Canvas Header */}
          <div style={{ padding: "14px 20px 0", borderBottom: "0.5px solid #e4e4e0", background: "#ffffff", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f0f0e", letterSpacing: "-0.01em" }}>Clinical Canvas</div>
                <div style={{ fontSize: "11px", color: "#aaa9a4", marginTop: 1 }}>Auto-generated from consult</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: "11px", color: "#1d6fe8", background: "#eef3ff", padding: "3px 8px", borderRadius: 20, border: "0.5px solid #c7d9fb", display: "flex", alignItems: "center", gap: 4 }}>
                  <Cpu size={10} />
                  AI Generated
                </div>
                <div style={{ fontSize: "11px", color: "#aaa9a4", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={10} />
                  Just now
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0 }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`tab-btn ${activeTab === id ? "active" : ""}`}
                  onClick={() => setActiveTab(id)}
                  style={{
                    background: "none", border: "none", borderBottom: activeTab === id ? "1.5px solid #1d6fe8" : "1.5px solid transparent",
                    cursor: "pointer", padding: "6px 14px 10px", display: "flex", alignItems: "center",
                    gap: 6, fontSize: "12.5px", fontWeight: activeTab === id ? 600 : 400,
                    color: activeTab === id ? "#0f0f0e" : "#8a8a86", fontFamily: "'Geist', sans-serif",
                    transition: "color 0.12s", marginBottom: -0.5,
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px" }}>
            {/* Info banner */}
            <div style={{ background: "#f5f9ff", border: "0.5px solid #c7d9fb", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertCircle size={13} color="#1d6fe8" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#3a6bbf", lineHeight: "1.5" }}>
                This canvas updates in real-time as the consult progresses. Content is AI-assisted and intended for educational review only.
              </span>
            </div>

            <CanvasContent tab={activeTab} />
          </div>

          {/* Canvas Footer */}
          <div style={{ padding: "10px 20px", borderTop: "0.5px solid #e4e4e0", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 6, cursor: "pointer", padding: "5px 12px", fontSize: "12px", color: "#6b6b67", fontFamily: "'Geist', sans-serif" }}>
                Export PDF
              </button>
              <button style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 6, cursor: "pointer", padding: "5px 12px", fontSize: "12px", color: "#6b6b67", fontFamily: "'Geist', sans-serif" }}>
                Add to Notes
              </button>
            </div>
            <div style={{ fontSize: "11px", color: "#c0bfba", fontFamily: "'DM Mono', monospace" }}>
              3 sections · 847 words
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
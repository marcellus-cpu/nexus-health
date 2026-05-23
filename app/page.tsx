"use client";
import { useState } from "react";
import {
  Plus, MessageSquare, ChevronLeft, ChevronRight,
  Send, FileText, BookOpen, Microscope,
  Activity, Clock, Stethoscope, Lock,
  Cpu, AlertCircle, Check, Paperclip
} from "lucide-react";

const SESSIONS = [
  { id: 1, title: "Respiratory alkalosis DDx", time: "2h ago" },
  { id: 2, title: "Cardiology — STEMI workup", time: "Yesterday" },
  { id: 3, title: "Renal pathology: FSGS vs MCD", time: "2d ago" },
  { id: 4, title: "Pharmacokinetics — CYP450", time: "3d ago" },
  { id: 5, title: "Pediatric fever protocol", time: "1w ago" },
];

type Msg = {
  role: "user" | "assistant";
  content: string;
  name: string;
  avatar: string;
  time: string;
  tags: string[];
};

const INITIAL: Msg[] = [
  {
    role: "user",
    avatar: "MS",
    name: "Med Student",
    time: "10:41 AM",
    tags: [],
    content: "Can you walk me through the pathophysiology of respiratory alkalosis?",
  },
  {
    role: "assistant",
    avatar: "NX",
    name: "Nexus AI",
    time: "10:41 AM",
    tags: ["DDx Generated"],
    content: "Respiratory alkalosis occurs when alveolar hyperventilation reduces PaCO2 below 35 mmHg. I have generated notes in the Clinical Canvas.",
  },
];

const INITIAL_CANVAS = `## Respiratory Alkalosis

**Definition**: Primary reduction in PaCO2 below 35 mmHg causing pH above 7.45.

---

### Pathophysiology

When ventilation exceeds CO2 production, carbonic acid levels fall.
This reduces free H+ and raises pH.
Hypocapnia causes cerebral vasoconstriction.

---

### Differential Diagnosis

#### Central Stimulation
- Anxiety and Panic disorder
- CNS lesions: stroke, tumor, trauma
- Fever, pain, sepsis

#### Hypoxemia-Driven
- Pneumonia, pulmonary edema
- High altitude
- Severe anemia

#### Pulmonary
- Pulmonary embolism — always rule out
- Interstitial lung disease
- Pneumothorax`;

function Canvas({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} style={{ fontSize: 16, fontWeight: 700, color: "#0f0f0e", marginBottom: 16 }}>
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} style={{ fontSize: 13, fontWeight: 600, color: "#0f0f0e", margin: "20px 0 8px", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("#### ")) {
          return (
            <h4 key={i} style={{ fontSize: 12, fontWeight: 600, color: "#4a4a48", margin: "12px 0 6px" }}>
              {line.slice(5)}
            </h4>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} style={{ fontWeight: 600, color: "#0f0f0e", fontSize: 13, margin: "12px 0 4px" }}>
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith("---")) {
          return <hr key={i} style={{ border: "none", borderTop: "0.5px solid #e4e4e0", margin: "16px 0" }} />;
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} style={{ fontSize: 13, color: "#3a3a38", margin: "4px 0", paddingLeft: 16, lineHeight: 1.6 }}>
              • {line.slice(2)}
            </div>
          );
        }
        if (line.trim() === "") {
          return <div key={i} style={{ height: 6 }} />;
        }
        return (
          <p key={i} style={{ fontSize: 13, color: "#3a3a38", margin: "4px 0", lineHeight: 1.75 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function NexusHealth() {
  const [collapsed, setCollapsed] = useState(false);
  const [twin, setTwin] = useState(false);
  const [tab, setTab] = useState("notes");
  const [input, setInput] = useState("");
  const [session, setSession] = useState(1);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [canvas, setCanvas] = useState(INITIAL_CANVAS);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = {
      role: "user",
      avatar: "MS",
      name: "Med Student",
      time: now(),
      tags: [],
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, conversationHistory: history }),
      });
      const data = await res.json();
      const reply = data.response || "Sorry, I could not get a response.";
      const aiMsg: Msg = {
        role: "assistant",
        avatar: "NX",
        name: "Nexus AI",
        time: now(),
        tags: ["AI Response"],
        content: reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setCanvas(reply);
      setTab("notes");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          avatar: "NX",
          name: "Nexus AI",
          time: now(),
          tags: [],
          content: "Connection error. Please try again.",
        },
      ]);
    }
    setLoading(false);
  };

  const tabs = [
    { id: "notes", label: "Detailed Notes", icon: FileText },
    { id: "study", label: "Study Plan", icon: BookOpen },
    { id: "pathology", label: "Pathology Diagrams", icon: Microscope },
  ];

  const sidebarWidth = collapsed ? 56 : 240;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d0d0cc; border-radius: 2px; }
        .sb:hover { background: #f0efec !important; }
        .sb.on { background: #eeeee9 !important; }
        .nb:hover { background: #333 !important; }
        .tb {
          background: none;
          border: none;
          border-bottom: 1.5px solid transparent;
          cursor: pointer;
          padding: 6px 14px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 400;
          color: #8a8a86;
          font-family: inherit;
        }
        .tb:hover { color: #0f0f0e; }
        .tb.on { color: #0f0f0e; font-weight: 600; border-bottom: 1.5px solid #1d6fe8; }
        .ab:hover { background: #f0efec !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "#f5f4f1", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div style={{ width: sidebarWidth, minWidth: sidebarWidth, background: "#fff", borderRight: "0.5px solid #e4e4e0", display: "flex", flexDirection: "column", transition: "width 0.2s, min-width 0.2s", overflow: "hidden" }}>
          <div style={{ padding: "16px 14px 12px", borderBottom: "0.5px solid #e4e4e0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#0f0f0e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Activity size={14} color="#fff" />
              </div>
              {!collapsed && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f0f0e" }}>Nexus Health</div>
                  <div style={{ fontSize: 10, color: "#aaa9a4", textTransform: "uppercase", letterSpacing: "0.04em" }}>Clinical AI</div>
                </div>
              )}
            </div>
            {!collapsed && (
              <button onClick={() => setCollapsed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa9a4", padding: 4, display: "flex", borderRadius: 4 }}>
                <ChevronLeft size={15} />
              </button>
            )}
          </div>

          <div style={{ padding: "10px 8px 6px", flexShrink: 0 }}>
            <button
              className="nb"
              onClick={() => setCollapsed(false)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 8, background: "#0f0f0e", color: "#fff", border: "none", borderRadius: 8, padding: collapsed ? "8px" : "8px 12px", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", transition: "background 0.15s" }}
            >
              <Plus size={15} />
              {!collapsed && "New Consult"}
            </button>
          </div>

          {!collapsed && (
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
              <div style={{ fontSize: 10, color: "#aaa9a4", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 6px 4px" }}>
                Recent
              </div>
              {SESSIONS.map((s) => (
                <button
                  key={s.id}
                  className={`sb ${session === s.id ? "on" : ""}`}
                  onClick={() => setSession(s.id)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 8px", borderRadius: 7, textAlign: "left", transition: "background 0.1s" }}
                >
                  <MessageSquare size={13} color={session === s.id ? "#1d6fe8" : "#c0bfba"} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: session === s.id ? "#0f0f0e" : "#6b6b67", fontWeight: session === s.id ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#c0bfba", marginTop: 1 }}>{s.time}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {collapsed && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 0" }}>
              {SESSIONS.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  className="sb"
                  onClick={() => { setSession(s.id); setCollapsed(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <MessageSquare size={14} color={session === s.id ? "#0f0f0e" : "#c0bfba"} />
                </button>
              ))}
              <button
                onClick={() => setCollapsed(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa9a4", marginTop: "auto", padding: 6, display: "flex" }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {!collapsed && (
            <div style={{ padding: "10px 12px", borderTop: "0.5px solid #e4e4e0", flexShrink: 0 }}>
              <div style={{ background: twin ? "#eef3ff" : "#f5f4f1", borderRadius: 10, padding: "10px 12px", border: twin ? "0.5px solid #c7d9fb" : "0.5px solid #e4e4e0", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Lock size={11} color={twin ? "#1d6fe8" : "#aaa9a4"} />
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: twin ? "#1558d0" : "#6b6b67" }}>
                      Clinical Twin Mode
                    </span>
                  </div>
                  <div
                    onClick={() => setTwin(!twin)}
                    style={{ width: 32, height: 18, borderRadius: 9, cursor: "pointer", background: twin ? "#1d6fe8" : "#d0d0cc", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
                  >
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: twin ? 16 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
                <div style={{ fontSize: 10, color: twin ? "#7aa4f0" : "#c0bfba" }}>
                  {twin ? "End-to-end encrypted" : "Encrypted · HIPAA compliant"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHAT */}
        <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", background: "#fafaf8", borderRight: "0.5px solid #e4e4e0", minWidth: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #e4e4e0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f0f0e" }}>Nexus Health Consultation</div>
              <div style={{ fontSize: 11, color: "#aaa9a4", marginTop: 1 }}>Ask any medical question</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 11, color: "#6b6b67" }}>Live</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 12px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#c0bfba", background: "#f0efec", padding: "3px 10px", borderRadius: 20 }}>Today</div>
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: msg.role === "user" ? "#f0efec" : "#0f0f0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: msg.role === "user" ? "#6b6b67" : "#fff" }}>
                    {msg.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f0f0e" }}>{msg.name}</span>
                      <span style={{ fontSize: 11, color: "#c0bfba" }}>{msg.time}</span>
                    </div>
                    <div style={{ background: msg.role === "user" ? "#fff" : "#f0efec", border: "0.5px solid #e4e4e0", borderRadius: msg.role === "user" ? "2px 12px 12px 12px" : "12px 2px 12px 12px", padding: "10px 14px", fontSize: 13.5, color: "#2c2c2a", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </div>
                    {msg.tags.length > 0 && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {msg.tags.map((tag, ti) => (
                          <span key={ti} style={{ fontSize: 11, fontWeight: 500, background: "#eef3ff", color: "#1d6fe8", padding: "3px 8px", borderRadius: 20, border: "0.5px solid #c7d9fb", display: "flex", alignItems: "center", gap: 3 }}>
                            <Check size={9} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.6 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0f0f0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                  NX
                </div>
                <div style={{ fontSize: 12, color: "#aaa9a4", fontStyle: "italic" }}>
                  Nexus AI is thinking...
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: "12px 16px 16px", background: "#fff", borderTop: "0.5px solid #e4e4e0", flexShrink: 0 }}>
            <div style={{ background: "#fafaf8", border: "0.5px solid #d0d0cc", borderRadius: 12, overflow: "hidden" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask a clinical question... (Enter to send)"
                rows={3}
                style={{ width: "100%", background: "none", border: "none", outline: "none", resize: "none", padding: "12px 14px 8px", fontSize: 13.5, color: "#2c2c2a", lineHeight: 1.6, fontFamily: "inherit", minHeight: 72 }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px 10px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="ab" style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 7, cursor: "pointer", padding: "5px 10px", display: "flex", alignItems: "center", gap: 5, color: "#6b6b67", fontSize: 12, fontFamily: "inherit", transition: "background 0.1s" }}>
                    <Paperclip size={12} />
                    Upload Labs
                  </button>
                  <button className="ab" style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 7, cursor: "pointer", padding: "5px 10px", display: "flex", alignItems: "center", gap: 5, color: "#6b6b67", fontSize: 12, fontFamily: "inherit", transition: "background 0.1s" }}>
                    <Stethoscope size={12} />
                    Vitals
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  style={{ background: input && !loading ? "#0f0f0e" : "#e4e4e0", border: "none", borderRadius: 8, cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                >
                  <Send size={13} color={input && !loading ? "#fff" : "#aaa9a4"} />
                </button>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span style={{ fontSize: 10.5, color: "#c0bfba" }}>
                Nexus AI · Educational use only · Not a substitute for clinical judgment
              </span>
            </div>
          </div>
        </div>

        {/* CANVAS */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", minWidth: 0 }}>
          <div style={{ padding: "14px 20px 0", borderBottom: "0.5px solid #e4e4e0", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f0f0e" }}>Clinical Canvas</div>
                <div style={{ fontSize: 11, color: "#aaa9a4", marginTop: 1 }}>Auto-generated from consult</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 11, color: "#1d6fe8", background: "#eef3ff", padding: "3px 8px", borderRadius: 20, border: "0.5px solid #c7d9fb", display: "flex", alignItems: "center", gap: 4 }}>
                  <Cpu size={10} />
                  AI Generated
                </div>
                <div style={{ fontSize: 11, color: "#aaa9a4", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={10} />
                  Just now
                </div>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`tb ${tab === id ? "on" : ""}`}
                  onClick={() => setTab(id)}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px" }}>
            <div style={{ background: "#f5f9ff", border: "0.5px solid #c7d9fb", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertCircle size={13} color="#1d6fe8" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#3a6bbf", lineHeight: 1.5 }}>
                Content is AI-assisted and intended for educational review only.
              </span>
            </div>
            <Canvas content={canvas} />
          </div>

          <div style={{ padding: "10px 20px", borderTop: "0.5px solid #e4e4e0", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="ab" style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 6, cursor: "pointer", padding: "5px 12px", fontSize: 12, color: "#6b6b67", fontFamily: "inherit", transition: "background 0.1s" }}>
                Export PDF
              </button>
              <button className="ab" style={{ background: "none", border: "0.5px solid #e4e4e0", borderRadius: 6, cursor: "pointer", padding: "5px 12px", fontSize: 12, color: "#6b6b67", fontFamily: "inherit", transition: "background 0.1s" }}>
                Add to Notes
              </button>
            </div>
            <div style={{ fontSize: 11, color: "#c0bfba" }}>
              {loading ? "Generating..." : "Ready"}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
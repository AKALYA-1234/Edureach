import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Mic, Play, Square, RotateCcw, Send, Pause,
  Volume2, AlertCircle, CheckCircle2, ChevronDown,
  Loader2, MessageSquare, Trophy, Lightbulb, Zap, Globe, Trash2,
} from "lucide-react";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:8000";

const SUPPORTED_LANGUAGES = [
  { code: "en-IN", name: "English",   native: "English",    flag: "" },
  { code: "hi-IN", name: "Hindi",     native: "हिंदी",       flag: "" },
  { code: "ta-IN", name: "Tamil",     native: "தமிழ்",       flag: "" },
  { code: "te-IN", name: "Telugu",    native: "తెలుగు",      flag: "" },
  { code: "kn-IN", name: "Kannada",   native: "ಕನ್ನಡ",       flag: "" },
  { code: "ml-IN", name: "Malayalam", native: "മലയാളം",     flag: "" },
  { code: "bn-IN", name: "Bengali",   native: "বাংলা",       flag: "" },
  { code: "mr-IN", name: "Marathi",   native: "मराठी",       flag: "" },
  { code: "gu-IN", name: "Gujarati",  native: "ગુજરાતી",    flag: "" },
  { code: "pa-IN", name: "Punjabi",   native: "ਪੰਜਾਬੀ",     flag: "" },
  { code: "or-IN", name: "Odia",      native: "ଓଡ଼ିଆ",      flag: "" },
];

const RS = { IDLE: "idle", RECORDING: "recording", PAUSED: "paused", RECORDED: "recorded", ANALYZING: "analyzing", DONE: "done" };

const TIPS = [
  "Find a quiet spot to reduce background noise",
  "Hold your device 15–20 cm from your mouth",
  "Speak naturally — do not rush",
  "Recite a poem, story, or have a conversation",
  "Record in the language you want feedback for",
];

function WaveAnimation({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "3px", height: "40px" }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "3px",
            borderRadius: "99px",
            background: active ? "#EF4444" : "#D1D5DB",
            height: active ? `${10 + Math.abs(Math.sin(i * 0.7) * 20)}px` : "4px",
            animation: active ? `wavePulse ${0.5 + (i % 4) * 0.12}s ease-in-out infinite alternate` : "none",
            animationDelay: `${i * 55}ms`,
            transition: "height 0.3s ease",
          }}
        />
      ))}
      <style>{`@keyframes wavePulse{from{transform:scaleY(0.55)}to{transform:scaleY(1.4)}}`}</style>
    </div>
  );
}

function parseScoreTable(text) {
  if (!text) return [];
  return text.split("\n")
    .map(line => {
      const m = line.match(/\|\s*([^|\-][^|]*?)\s*\|\s*(\d+(?:\.\d+)?)\s*\|/);
      return m ? { category: m[1].trim(), score: parseFloat(m[2]) } : null;
    })
    .filter(Boolean)
    .filter(row => row.category.toLowerCase() !== "category" && !/^-+$/.test(row.category));
}

function feedbackWithoutTable(text) {
  if (!text) return "";
  return text.split("\n")
    .filter(line => !line.trim().startsWith("|"))
    .join("\n")
    .trim();
}

const getScoreColor = (s) => s >= 7.5 ? "#059669" : s >= 5 ? "#D97706" : "#DC2626";

function FeedbackContent({ text }) {
  if (!text) return null;
  const cleaned = feedbackWithoutTable(text);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
      {cleaned.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: "8px" }} />;
        const bold = /^\*\*(.+)\*\*$/.test(line.trim()) || /^#+\s/.test(line.trim()) || /^\d+\.\s+\*\*/.test(line.trim());
        const clean = line.replace(/^\*\*(.+)\*\*$/, "$1").replace(/^#+\s/, "").replace(/\*\*/g, "").trim();
        return <p key={i} style={bold ? { fontWeight: 700, color: "#111827", marginTop: "12px" } : {}}>{clean}</p>;
      })}
    </div>
  );
}

export default function SpeechTherapy() {
  const [language,     setLanguage]     = useState(null);
  const [langOpen,     setLangOpen]     = useState(false);
  const [recState,     setRecState]     = useState(RS.IDLE);
  const [timer,        setTimer]        = useState(0);
  const [audioBlob,    setAudioBlob]    = useState(null);
  const [audioURL,     setAudioURL]     = useState(null);
  const [transcript,   setTranscript]   = useState("");
  const [feedback,     setFeedback]     = useState("");
  const [overallScore, setOverallScore] = useState(null);
  const [hasStutter,   setHasStutter]   = useState(false);
  const [error,        setError]        = useState("");
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isPaused,     setIsPaused]     = useState(false);

  const mrRef     = useRef(null);
  const chunksRef = useRef([]);
  const timerRef  = useRef(null);
  const audioRef  = useRef(null);

  useEffect(() => {
    if (recState === RS.RECORDING) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recState]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = useCallback(async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mrRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        setRecState(RS.RECORDED);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start(250);
      setTimer(0);
      setRecState(RS.RECORDING);
    } catch {
      setError("Microphone access denied. Please allow microphone permission and try again.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop();
    setIsPaused(false);
  }, []);

  const pauseRecording = useCallback(() => {
    const mr = mrRef.current;
    if (!mr) return;
    if (mr.state === "recording") {
      mr.pause();
      setIsPaused(true);
      setRecState(RS.PAUSED);
    } else if (mr.state === "paused") {
      mr.resume();
      setIsPaused(false);
      setRecState(RS.RECORDING);
    }
  }, []);

  const reRecord = useCallback(() => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioBlob(null); setAudioURL(null); setTranscript(""); setFeedback("");
    setOverallScore(null); setHasStutter(false); setError(""); setIsPlaying(false); setTimer(0); setIsPaused(false);
    setRecState(RS.IDLE);
  }, [audioURL]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.currentTime = 0; audioRef.current.play(); }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const analyzeAudio = useCallback(async () => {
    if (!audioBlob) return;
    setRecState(RS.ANALYZING);
    setError("");
    try {
      const fd = new FormData();
      const ext = audioBlob.type.includes("ogg") ? "ogg" : audioBlob.type.includes("mp4") ? "m4a" : "webm";
      fd.append("file", audioBlob, `recording.${ext}`);
      fd.append("language_code", language);
      const { data } = await axios.post(`${AI_URL}/speech-therapy/analyze`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      setTranscript(data.transcript || "");
      setFeedback(data.feedback || "");
      setOverallScore(data.overall_score ?? null);
      setHasStutter(data.has_stutter ?? false);
      setRecState(RS.DONE);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Analysis failed. Please try again.");
      setRecState(RS.RECORDED);
    }
  }, [audioBlob, language]);

  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);
  const scoreColor = overallScore != null
    ? overallScore >= 7.5 ? "#059669" : overallScore >= 5 ? "#D97706" : "#DC2626"
    : "#0F172A";

  /*  Styles  */
  const card = {
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 8px 48px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
    border: "1px solid #F1F5F9",
    overflow: "hidden",
  };
  const btn = (bg, text, extra = {}) => ({
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: bg, color: text, border: "none", borderRadius: "16px",
    padding: "13px 24px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
    ...extra,
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#F8FAFC 0%,#fff 100%)", padding: "40px 24px 60px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#EFF6FF", color: "#2563EB", fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "999px", marginBottom: "16px" }}>
            <Mic size={13} /> AI Speech Coach
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
            Speech Therapy
          </h1>
          <p style={{ marginTop: "8px", fontSize: "14px", color: "#64748B", maxWidth: "320px", margin: "8px auto 0" }}>
            Record your voice and receive instant AI feedback on clarity, fluency, and pronunciation.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "16px", padding: "14px 16px", color: "#B91C1C", marginBottom: "20px" }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
            <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Card */}
        <div style={card}>

          {/* Language bar */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Language</span>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen((o) => !o)}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 12px", border: "1px solid #E2E8F0", borderRadius: "12px", background: "#F8FAFC", fontSize: "13px", fontWeight: 600, color: "#334155", cursor: "pointer" }}
              >
                <Globe size={13} color="#2563EB" />
                {language === null ? "Select Language" : selectedLang?.name}
                <ChevronDown size={12} color="#94A3B8" style={{ transform: langOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {langOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", boxShadow: "0 16px 48px rgba(0,0,0,0.12)", zIndex: 50, width: "220px", padding: "8px", maxHeight: "260px", overflowY: "auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                        style={{ padding: "9px 10px", borderRadius: "10px", border: "none", background: language === lang.code ? "#EFF6FF" : "transparent", color: language === lang.code ? "#2563EB" : "#334155", fontWeight: language === lang.code ? 700 : 500, fontSize: "12px", cursor: "pointer", textAlign: "left" }}
                      >
                        <div style={{ fontWeight: 600 }}>{lang.native}</div>
                        <div style={{ fontSize: "10px", color: "#94A3B8" }}>{lang.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main body */}
          <div style={{ padding: "32px 24px" }}>

            {/*  IDLE  */}
            {recState === RS.IDLE && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: "-12px", borderRadius: "50%", background: "#DBEAFE", opacity: 0.5, animation: "idlePing 2s ease-in-out infinite" }} />
                  <button
                    onClick={language ? startRecording : undefined}
                    disabled={!language}
                    style={{ position: "relative", width: "128px", height: "128px", borderRadius: "50%", background: language ? "linear-gradient(135deg,#3B82F6,#4F46E5)" : "linear-gradient(135deg,#CBD5E1,#94A3B8)", border: "none", boxShadow: language ? "0 20px 60px rgba(79,70,229,0.35)" : "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: language ? "pointer" : "not-allowed", transition: "transform 0.15s, background 0.3s" }}
                    onMouseEnter={e => { if (language) e.currentTarget.style.transform = "scale(1.06)"; }}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    onMouseDown={e => { if (language) e.currentTarget.style.transform = "scale(0.96)"; }}
                    onMouseUp={e => { if (language) e.currentTarget.style.transform = "scale(1.06)"; }}
                  >
                    <Mic size={48} color="white" />
                  </button>
                  <style>{`@keyframes idlePing{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.15);opacity:0.2}}`}</style>
                </div>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Tap to Record</p>
                  {language
                    ? <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>Speak clearly in {selectedLang?.name}</p>
                    : <p style={{ fontSize: "13px", color: "#DC2626", marginTop: "4px", fontWeight: 600 }}>Please select a language above before recording</p>
                  }
                </div>
                <div style={{ width: "100%", background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "16px", padding: "18px 20px", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <Lightbulb size={15} color="#2563EB" />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1D4ED8" }}>Tips before you record</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {TIPS.map((tip, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#3B82F6" }}>
                        <span style={{ marginTop: "5px", width: "6px", height: "6px", borderRadius: "50%", background: "#93C5FD", flexShrink: 0 }} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/*  RECORDING / PAUSED  */}
            {(recState === RS.RECORDING || recState === RS.PAUSED) && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center" }}>
                <div style={{ position: "relative" }}>
                  {!isPaused && (
                    <div style={{ position: "absolute", inset: "-12px", borderRadius: "50%", background: "#FCA5A5", opacity: 0.3, animation: "recPing 1s ease-in-out infinite" }} />
                  )}
                  <div style={{ position: "relative", width: "128px", height: "128px", borderRadius: "50%", background: isPaused ? "linear-gradient(135deg,#F59E0B,#D97706)" : "linear-gradient(135deg,#EF4444,#DC2626)", boxShadow: isPaused ? "0 20px 60px rgba(245,158,11,0.3)" : "0 20px 60px rgba(239,68,68,0.35)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s, box-shadow 0.3s" }}>
                    {isPaused ? <Pause size={48} color="white" /> : <Mic size={48} color="white" />}
                  </div>
                  {!isPaused && (
                    <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "20px", height: "20px", borderRadius: "50%", background: "#EF4444", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "white", animation: "dotBlink 1s ease-in-out infinite" }} />
                    </span>
                  )}
                  <style>{`@keyframes recPing{0%,100%{transform:scale(1);opacity:0.3}50%{transform:scale(1.2);opacity:0.1}}@keyframes dotBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
                </div>
                <WaveAnimation active={!isPaused} />
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: "36px", fontWeight: 800, color: isPaused ? "#D97706" : "#EF4444", margin: 0, letterSpacing: "2px", transition: "color 0.3s" }}>{fmt(timer)}</p>
                  <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>{isPaused ? "Recording paused — tap Resume to continue" : "Recording in progress"}</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={pauseRecording}
                    style={{ ...btn(isPaused ? "#F59E0B" : "#F8FAFC", isPaused ? "#fff" : "#475569"), border: isPaused ? "none" : "1px solid #E2E8F0", borderRadius: "999px", padding: "13px 28px", boxShadow: isPaused ? "0 8px 24px rgba(245,158,11,0.25)" : "none" }}
                  >
                    {isPaused ? <><Mic size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
                  </button>
                  <button
                    onClick={stopRecording}
                    style={{ ...btn("#DC2626", "#fff"), borderRadius: "999px", padding: "13px 28px", boxShadow: "0 8px 24px rgba(220,38,38,0.3)" }}
                  >
                    <Square size={14} fill="white" />
                    Stop
                  </button>
                </div>
              </div>
            )}

            {/*  RECORDED  */}
            {recState === RS.RECORDED && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
                <div style={{ width: "128px", height: "128px", borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 20px 60px rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Volume2 size={48} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Recording Ready</p>
                  <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>Duration: {fmt(timer)}</p>
                </div>
                <button
                  onClick={togglePlayback}
                  style={{ ...btn("transparent", "#059669"), border: "2px solid #A7F3D0", background: "#ECFDF5", width: "100%" }}
                >
                  {isPlaying ? <Square size={14} fill="#059669" /> : <Play size={14} />}
                  {isPlaying ? "Stop Playback" : "Listen to Recording"}
                </button>
                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <button
                    onClick={reRecord}
                    style={{ ...btn("#F8FAFC", "#475569"), border: "1px solid #E2E8F0", flex: 1 }}
                  >
                    <Trash2 size={14} />
                    Re-record
                  </button>
                  <button
                    onClick={analyzeAudio}
                    style={{ ...btn("#2563EB", "#fff"), flex: 2, boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}
                  >
                    <Send size={14} />
                    Analyze Speech
                  </button>
                </div>
              </div>
            )}

            {/*  ANALYZING  */}
            {recState === RS.ANALYZING && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center", padding: "16px 0" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: "-12px", borderRadius: "50%", background: "#C7D2FE", opacity: 0.3, animation: "idlePing 1.5s ease-in-out infinite" }} />
                  <div style={{ position: "relative", width: "128px", height: "128px", borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#4F46E5)", boxShadow: "0 20px 60px rgba(79,70,229,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={48} color="white" style={{ animation: "spin 1s linear infinite" }} />
                  </div>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Analysing your speech</p>
                  <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>This may take up to 30 seconds</p>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3B82F6", animation: "bounce 1s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
                  ))}
                  <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
                </div>
              </div>
            )}

            {/*  DONE  */}
            {recState === RS.DONE && (() => {
              const categoryScores = parseScoreTable(feedback);
              return (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Score + Fluency + Breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: categoryScores.length > 0 ? "auto auto 1fr" : "1fr 1fr", gap: "16px", alignItems: "stretch" }}>
                  {overallScore != null && (
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "16px", padding: "20px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "110px" }}>
                      <Trophy size={22} color="#F59E0B" />
                      <p style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Score</p>
                      <p style={{ fontSize: "44px", fontWeight: 900, color: scoreColor, margin: 0, lineHeight: 1 }}>{overallScore.toFixed(1)}</p>
                      <p style={{ fontSize: "10px", color: "#94A3B8", margin: 0 }}>out of 10</p>
                    </div>
                  )}
                  <div style={{ background: hasStutter ? "#FFF7ED" : "#ECFDF5", border: `1px solid ${hasStutter ? "#FED7AA" : "#A7F3D0"}`, borderRadius: "16px", padding: "20px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "120px" }}>
                    {hasStutter ? <Zap size={22} color="#F97316" /> : <CheckCircle2 size={22} color="#10B981" />}
                    <p style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Fluency</p>
                    <p style={{ fontSize: "14px", fontWeight: 800, color: hasStutter ? "#EA580C" : "#059669", margin: 0 }}>
                      {hasStutter ? "Fillers Detected" : "Fluent!"}
                    </p>
                  </div>

                  {/* Score Breakdown panel */}
                  {categoryScores.length > 0 && (
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "18px 22px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px 0" }}>Score Breakdown</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {categoryScores.map(({ category, score }) => (
                          <div key={category} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "12px", color: "#475569", width: "190px", flexShrink: 0 }}>{category}</span>
                            <div style={{ flex: 1, background: "#E2E8F0", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                              <div style={{ width: `${score * 10}%`, background: getScoreColor(score), borderRadius: "999px", height: "100%", transition: "width 1s ease" }} />
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: getScoreColor(score), width: "28px", textAlign: "right", flexShrink: 0 }}>{score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Transcript */}
                <div style={{ background: "#F8FAFC", border: "1px solid #F1F5F9", borderRadius: "16px", padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MessageSquare size={15} color="#2563EB" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>What AI Heard</span>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 700, background: "#DBEAFE", color: "#2563EB", padding: "3px 10px", borderRadius: "999px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {selectedLang?.name}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.7", whiteSpace: "pre-wrap", margin: 0 }}>{transcript}</p>
                  <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={11} color="#10B981" />
                    Powered by Sarvam AI  Please verify the transcription
                  </p>
                </div>

                {/* AI Feedback */}
                <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: "16px", padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Lightbulb size={15} color="#F59E0B" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>AI Speech Coach</span>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 600, background: "#F1F5F9", color: "#64748B", padding: "3px 9px", borderRadius: "999px" }}>GPT-OSS 120B</span>
                  </div>
                  <FeedbackContent text={feedback} />
                </div>

                {/* Record Again */}
                <button
                  onClick={reRecord}
                  style={{ ...btn("#2563EB", "#fff"), width: "100%", boxShadow: "0 8px 24px rgba(37,99,235,0.2)" }}
                >
                  <RotateCcw size={14} />
                  Record Again
                </button>
              </div>
              );
            })()}

          </div>
        </div>

        {audioURL && (
          <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} style={{ display: "none" }} />
        )}
      </div>
    </div>
  );
}

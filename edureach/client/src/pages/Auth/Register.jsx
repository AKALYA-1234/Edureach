import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Users, Mail, Lock, Eye, EyeOff, User, MapPin } from "lucide-react";
import useAuthStore from "../../store/authStore";
import api from "../../services/api";

const languages = [
  { value: "en", label: "English (EN)" },
  { value: "ta", label: "தமிழ் (TA)" },
  { value: "hi", label: "हिंदी (HI)" },
  { value: "te", label: "తెలుగు (TE)" },
  { value: "kn", label: "ಕನ್ನಡ (KN)" },
  { value: "ml", label: "മലയാളം (ML)" },
];

const states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

export default function Register() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", language: "en", state: "", district: "", grade: "", isRural: false });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, role });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px 12px 44px",
    border: "1.5px solid #E2E8F0", borderRadius: "10px",
    fontSize: "14px", color: "#0F172A", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box", background: "#F8FAFC",
  };

  const selectStyle = {
    width: "100%", padding: "12px 16px",
    border: "1.5px solid #E2E8F0", borderRadius: "10px",
    fontSize: "14px", color: "#0F172A", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box", background: "#F8FAFC", cursor: "pointer",
  };

  const labelStyle = { display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px", paddingTop: "88px", paddingBottom: "48px" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", background: "#2563EB", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <GraduationCap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", marginBottom: "6px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create your account</h1>
          <p style={{ fontSize: "14px", color: "#64748B" }}>Start your learning journey today</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", padding: "40px" }}>

          {error && (
            <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", color: "#BE123C", fontSize: "13px", padding: "12px 16px", borderRadius: "10px", marginBottom: "24px" }}>
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>I am a</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { value: "student", icon: GraduationCap, label: "Student", sub: "I want to learn" },
                { value: "mentor", icon: Users, label: "Mentor", sub: "I want to teach" },
              ].map(r => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "18px 12px", borderRadius: "12px", border: `2px solid ${role === r.value ? "#2563EB" : "#E2E8F0"}`, background: role === r.value ? "#EFF6FF" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
                  <r.icon size={22} color={role === r.value ? "#2563EB" : "#94A3B8"} />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: role === r.value ? "#2563EB" : "#374151" }}>{r.label}</span>
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>{r.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Full name</label>
              <div style={{ position: "relative" }}>
                <User size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "13px" }} />
                <input type="text" placeholder="Raj Kumar" value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} required />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "13px" }} />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} required />
              </div>
            </div>

            {/* Password row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "13px" }} />
                  <input type={showPassword ? "text" : "password"} placeholder="Min 6 chars" value={form.password} onChange={e => set("password", e.target.value)} style={{ ...inputStyle, paddingRight: "44px" }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "13px", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Confirm password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "13px" }} />
                  <input type={showConfirm ? "text" : "password"} placeholder="Re-enter" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} style={{ ...inputStyle, paddingRight: "44px" }} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "12px", top: "13px", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Language */}
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Preferred language</label>
              <select value={form.language} onChange={e => set("language", e.target.value)} style={selectStyle}>
                {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            {/* State + District */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
              <div>
                <label style={labelStyle}>State</label>
                <select value={form.state} onChange={e => set("state", e.target.value)} style={selectStyle} required>
                  <option value="">Select state</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>District</label>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "13px" }} />
                  <input type="text" placeholder="Your district" value={form.district} onChange={e => set("district", e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Grade */}
            {role === "student" && (
              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Grade</label>
                <select value={form.grade} onChange={e => set("grade", e.target.value)} style={selectStyle}>
                  <option value="">Select grade</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i+1} value={`${i+1}`}>Class {i+1}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Rural */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
              <input id="rural" type="checkbox" checked={form.isRural} onChange={e => set("isRural", e.target.checked)}
                style={{ width: "16px", height: "16px", marginTop: "2px", cursor: "pointer", accentColor: "#059669" }} />
              <label htmlFor="rural" style={{ cursor: "pointer" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", display: "block" }}>I am from a rural area</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Helps us personalise scholarships and content for you</span>
              </label>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "#6EE7B7" : "#059669", color: "#fff", fontWeight: 700, fontSize: "15px", padding: "13px", borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit" }}>
              {loading ? (
                <><div style={{ width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Creating account...</>
              ) : "Create account →"}
            </button>

          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748B", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </p>

      </div>
    </div>
  );
}
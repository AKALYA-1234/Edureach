import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import useAuthStore from "../../store/authStore";
import api from "../../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px 12px 44px",
    border: "1.5px solid #E2E8F0", borderRadius: "10px",
    fontSize: "14px", color: "#0F172A", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
    background: "#F8FAFC",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", paddingTop: "88px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "56px", height: "56px", background: "#2563EB", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <GraduationCap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", marginBottom: "6px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome back</h1>
          <p style={{ fontSize: "14px", color: "#64748B" }}>Sign in to continue your learning journey</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", padding: "40px" }}>

          {error && (
            <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", color: "#BE123C", fontSize: "13px", padding: "12px 16px", borderRadius: "10px", marginBottom: "24px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Email address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "13px" }} />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} required />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "13px", color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "13px" }} />
                <input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ ...inputStyle, paddingRight: "44px" }} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "13px", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "#93C5FD" : "#2563EB", color: "#fff", fontWeight: 700, fontSize: "15px", padding: "13px", borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit" }}>
              {loading ? (
                <><div style={{ width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing in...</>
              ) : "Sign in →"}
            </button>

          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748B", marginTop: "24px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>Create account</Link>
        </p>

      </div>
    </div>
  );
}
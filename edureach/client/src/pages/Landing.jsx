import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Users, Mic, Heart, Calendar, ArrowRight, CheckCircle, Globe } from "lucide-react";

const wrap = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 32px",
};

const features = [
  { icon: BookOpen, title: "Learning Hub", desc: "AI-powered courses in your language for every grade from Class 1–12.", bg: "#EFF6FF", color: "#2563EB" },
  { icon: GraduationCap, title: "Scholarships", desc: "Auto-matched scholarships based on your state, grade, and income.", bg: "#ECFDF5", color: "#059669" },
  { icon: Users, title: "Mentoring", desc: "Connect with mentors who understand your journey.", bg: "#F5F3FF", color: "#7C3AED" },
  { icon: Mic, title: "Speech Therapy", desc: "AI-assisted therapy sessions to improve communication.", bg: "#FFFBEB", color: "#D97706" },
  { icon: Heart, title: "Mental Health", desc: "Daily mood tracking and wellness support tools.", bg: "#FFF1F2", color: "#E11D48" },
  { icon: Calendar, title: "Study Plan", desc: "AI-generated study plans tailored to your exams and goals.", bg: "#F0FDFA", color: "#0D9488" },
];

const stats = [
  { value: "10,000+", label: "Students" },
  { value: "500+", label: "Scholarships" },
  { value: "200+", label: "Mentors" },
  { value: "6", label: "Languages" },
];

const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up in seconds. Choose your language and share your goals." },
  { num: "02", title: "Get Personalized Content", desc: "AI creates a tailored learning path just for you." },
  { num: "03", title: "Learn & Grow", desc: "Access courses, scholarships, and mentors — all in one place." },
];

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff" }}>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 60%, #ECFDF5 100%)", paddingTop: "120px", paddingBottom: "100px" }}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

            {/* Left */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#DBEAFE", color: "#1D4ED8", fontSize: "13px", fontWeight: 600, padding: "6px 16px", borderRadius: "999px", marginBottom: "24px" }}>
                <Globe size={14} /> Available in 6 Indian languages
              </div>
              <h1 style={{ fontSize: "52px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginBottom: "20px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Education for Every<br />
                <span style={{ color: "#2563EB" }}>Indian Student</span>
              </h1>
              <p style={{ fontSize: "18px", color: "#64748B", lineHeight: 1.7, marginBottom: "36px", maxWidth: "480px" }}>
                Free learning, scholarships, mentoring, and wellness tools — in your own language. Built for rural India.
              </p>
              <div style={{ display: "flex", gap: "16px", marginBottom: "36px" }}>
                <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#2563EB", color: "#fff", fontWeight: 700, padding: "14px 32px", borderRadius: "10px", textDecoration: "none", fontSize: "15px" }}>
                  Get Started Free <ArrowRight size={16} />
                </Link>
                <a href="#features" style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1.5px solid #CBD5E1", color: "#334155", fontWeight: 600, padding: "14px 32px", borderRadius: "10px", textDecoration: "none", fontSize: "15px", background: "#fff" }}>
                  Learn More
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex" }}>
                  {["A","B","C","D"].map((l,i) => (
                    <div key={i} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2563EB", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 700, marginLeft: i > 0 ? "-8px" : 0 }}>{l}</div>
                  ))}
                </div>
                <span style={{ fontSize: "14px", color: "#64748B" }}><strong style={{ color: "#0F172A" }}>10,000+</strong> students already learning</span>
              </div>
            </div>

            {/* Right - Dashboard Card */}
            <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid #F1F5F9", padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "4px" }}>Today's Progress</p>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>3 of 5 lessons completed</p>
                </div>
                <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: "12px", fontWeight: 700, padding: "6px 12px", borderRadius: "999px" }}>₹2.5L Available</span>
              </div>
              <div style={{ background: "#F1F5F9", borderRadius: "999px", height: "8px", marginBottom: "24px" }}>
                <div style={{ background: "#10B981", height: "8px", borderRadius: "999px", width: "60%" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {["Mathematics — Algebra Basics", "Science — Newton's Laws"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#F8FAFC", borderRadius: "10px", padding: "12px 16px" }}>
                    <CheckCircle size={18} color="#10B981" />
                    <span style={{ fontSize: "14px", color: "#334155", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={18} color="#7C3AED" />
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#94A3B8" }}>Mentor Matched</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>Dr. Priya S.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: "#fff", paddingTop: "96px", paddingBottom: "96px" }}>
        <div style={wrap}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ color: "#2563EB", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>Features</p>
            <h2 style={{ fontSize: "40px", fontWeight: 800, color: "#0F172A", marginBottom: "16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to <span style={{ color: "#2563EB" }}>succeed</span>
            </h2>
            <p style={{ color: "#64748B", fontSize: "17px", maxWidth: "520px", margin: "0 auto" }}>Six powerful tools — completely free and available in your language.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1.5px solid #F1F5F9", borderRadius: "16px", padding: "32px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#DBEAFE"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#F1F5F9"; }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#2563EB", paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", textAlign: "center" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: "48px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>{s.value}</p>
                <p style={{ fontSize: "13px", color: "#BFDBFE", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#F8FAFC", paddingTop: "96px", paddingBottom: "96px" }}>
        <div style={wrap}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ color: "#059669", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>How It Works</p>
            <h2 style={{ fontSize: "40px", fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Start in <span style={{ color: "#059669" }}>3 simple steps</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "40px 32px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: "64px", fontWeight: 800, color: "#DBEAFE", marginBottom: "16px", lineHeight: 1 }}>{s.num}</p>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#fff", paddingTop: "96px", paddingBottom: "96px" }}>
        <div style={wrap}>
          <div style={{ background: "linear-gradient(135deg, #1D4ED8, #2563EB)", borderRadius: "24px", padding: "80px 64px", textAlign: "center" }}>
            <h2 style={{ fontSize: "40px", fontWeight: 800, color: "#fff", marginBottom: "16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Start Learning Today — It's Free
            </h2>
            <p style={{ color: "#BFDBFE", fontSize: "18px", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>
              Join thousands of students across India transforming their futures with EduReach.
            </p>
            <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#fff", color: "#2563EB", fontWeight: 800, padding: "16px 40px", borderRadius: "12px", textDecoration: "none", fontSize: "17px" }}>
              Get Started Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
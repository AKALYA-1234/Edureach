require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Course = require("./models/Course");
const Scholarship = require("./models/Scholarship");
const User = require("./models/User");
const Mentor = require("./models/Mentor");

const MONGO_URI = process.env.MONGO_URI;

// ==========================
// COURSES — Real NCERT / Diksha content
// ==========================
const courses = [
  {
    title: "Class 1-2 Maths — Numbers & Counting",
    description:
      "Learn counting, number recognition, addition and subtraction basics designed for young learners following the NCERT curriculum.",
    subject: "Mathematics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/qdSbVMCPw5E",
    thumbnailUrl: "https://img.youtube.com/vi/qdSbVMCPw5E/hqdefault.jpg",
    tags: ["ncert", "maths", "primary", "numbers"],
    gradeLevel: "Class 1-2",
    isFree: true,
  },
  {
    title: "வகுப்பு 3-5 கணிதம் — பின்னங்கள் மற்றும் தசமங்கள்",
    description:
      "தமிழ் வழியில் பின்னங்கள், தசமங்கள் மற்றும் அளவீடு பற்றிய NCERT பாடத்திட்டம்.",
    subject: "Mathematics",
    language: ["ta"],
    videoUrl: "https://www.youtube.com/embed/5iUh_CSjaSw",
    thumbnailUrl: "https://img.youtube.com/vi/5iUh_CSjaSw/hqdefault.jpg",
    tags: ["diksha", "maths", "tamil", "fractions"],
    gradeLevel: "Class 3-5",
    isFree: true,
  },
  {
    title: "कक्षा 6-8 विज्ञान — बल और गति",
    description:
      "हिन्दी में NCERT विज्ञान — बल, गति, घर्षण और गुरुत्वाकर्षण की बुनियादी अवधारणाएँ।",
    subject: "Science",
    language: ["hi"],
    videoUrl: "https://www.youtube.com/embed/oKqCf_F2yVg",
    thumbnailUrl: "https://img.youtube.com/vi/oKqCf_F2yVg/hqdefault.jpg",
    tags: ["ncert", "science", "hindi", "force", "motion"],
    gradeLevel: "Class 6-8",
    isFree: true,
  },
  {
    title: "Class 9-10 Maths — Algebra & Polynomials",
    description:
      "Master algebraic expressions, polynomials, linear equations and coordinate geometry as per NCERT Class 9-10 syllabus.",
    subject: "Mathematics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/1xSQlwWGT8M",
    thumbnailUrl: "https://img.youtube.com/vi/1xSQlwWGT8M/hqdefault.jpg",
    tags: ["ncert", "maths", "algebra", "polynomials"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
  {
    title: "Class 9-10 Science — Chemical Reactions & Equations",
    description:
      "NCERT Science covering chemical reactions, balancing equations, types of reactions, acids, bases and salts.",
    subject: "Science",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/TnM7vbYqlBs",
    thumbnailUrl: "https://img.youtube.com/vi/TnM7vbYqlBs/hqdefault.jpg",
    tags: ["ncert", "science", "chemistry", "reactions"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
  {
    title: "Class 11-12 Physics — Laws of Motion",
    description:
      "Newton's laws of motion, friction, circular motion and applications. Comprehensive NCERT Class 11 Physics.",
    subject: "Physics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/1C17YbHSYDo",
    thumbnailUrl: "https://img.youtube.com/vi/1C17YbHSYDo/hqdefault.jpg",
    tags: ["ncert", "physics", "newton", "motion"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "Class 11-12 Chemistry — Atomic Structure",
    description:
      "Bohr model, quantum numbers, electronic configuration, and periodic properties. NCERT Class 11 Chemistry.",
    subject: "Chemistry",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/htAPYgeVCYQ",
    thumbnailUrl: "https://img.youtube.com/vi/htAPYgeVCYQ/hqdefault.jpg",
    tags: ["ncert", "chemistry", "atoms", "quantum"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "Class 11-12 Maths — Calculus — Limits & Derivatives",
    description:
      "Introduction to limits, derivatives, differentiation rules and applications. NCERT Class 11 Mathematics.",
    subject: "Mathematics",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/WUvTyaaNkzM",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/hqdefault.jpg",
    tags: ["ncert", "maths", "calculus", "limits", "derivatives"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "வகுப்பு 6-8 சமூக அறிவியல் — இந்திய வரலாறு",
    description:
      "தமிழ் வழியில் பண்டைய இந்திய நாகரிகங்கள், முகலாயர்கள் மற்றும் சுதந்திரப் போராட்டம்.",
    subject: "Social Science",
    language: ["ta"],
    videoUrl: "https://www.youtube.com/embed/rNHqL-4qMRs",
    thumbnailUrl: "https://img.youtube.com/vi/rNHqL-4qMRs/hqdefault.jpg",
    tags: ["diksha", "social-science", "tamil", "history"],
    gradeLevel: "Class 6-8",
    isFree: true,
  },
  {
    title: "Class 9-10 English Literature — Prose & Poetry",
    description:
      "NCERT English — Beehive & Moments textbook chapters, poetry analysis, comprehension and writing skills.",
    subject: "English",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/AH2BjXlMNkk",
    thumbnailUrl: "https://img.youtube.com/vi/AH2BjXlMNkk/hqdefault.jpg",
    tags: ["ncert", "english", "literature", "prose", "poetry"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
  {
    title: "Class 11-12 Biology — Cell Structure & Function",
    description:
      "Cell theory, organelles, cell division (mitosis & meiosis), biomolecules. NCERT Class 11 Biology.",
    subject: "Biology",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/URUJD5NEXC8",
    thumbnailUrl: "https://img.youtube.com/vi/URUJD5NEXC8/hqdefault.jpg",
    tags: ["ncert", "biology", "cell", "mitosis"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "Class 11-12 Computer Science — Python Programming",
    description:
      "Introduction to Python — variables, data types, loops, functions, file handling as per CBSE CS syllabus.",
    subject: "Computer Science",
    language: ["en"],
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    thumbnailUrl: "https://img.youtube.com/vi/kqtD5dpn9C8/hqdefault.jpg",
    tags: ["cbse", "cs", "python", "programming"],
    gradeLevel: "Class 11-12",
    isFree: true,
  },
  {
    title: "తరగతి 6-8 గణితం — జ్యామితి ప్రాథమికాలు",
    description:
      "తెలుగులో NCERT గణితం — రేఖలు, కోణాలు, త్రిభుజాలు మరియు చతుర్భుజాల ప్రాథమికాలు.",
    subject: "Mathematics",
    language: ["te"],
    videoUrl: "https://www.youtube.com/embed/dBjHd_nqn7c",
    thumbnailUrl: "https://img.youtube.com/vi/dBjHd_nqn7c/hqdefault.jpg",
    tags: ["diksha", "maths", "telugu", "geometry"],
    gradeLevel: "Class 6-8",
    isFree: true,
  },
  {
    title: "ತರಗತಿ 3-5 ಇಂಗ್ಲಿಷ್ — Reading & Vocabulary",
    description:
      "ಕನ್ನಡ ಮಾಧ್ಯಮ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಇಂಗ್ಲಿಷ್ ಓದುವಿಕೆ, ಪದಜಾಲ ಮತ್ತು ವ್ಯಾಕರಣ.",
    subject: "English",
    language: ["kn"],
    videoUrl: "https://www.youtube.com/embed/kT6WLqiHbJc",
    thumbnailUrl: "https://img.youtube.com/vi/kT6WLqiHbJc/hqdefault.jpg",
    tags: ["diksha", "english", "kannada", "reading"],
    gradeLevel: "Class 3-5",
    isFree: true,
  },
  {
    title: "कक्षा 9-10 इतिहास — भारत का स्वतंत्रता संग्राम",
    description:
      "हिन्दी में NCERT इतिहास — 1857 का विद्रोह से लेकर 1947 तक भारतीय स्वतंत्रता आंदोलन।",
    subject: "History",
    language: ["hi"],
    videoUrl: "https://www.youtube.com/embed/jb0MtNqg7-0",
    thumbnailUrl: "https://img.youtube.com/vi/jb0MtNqg7-0/hqdefault.jpg",
    tags: ["ncert", "history", "hindi", "independence"],
    gradeLevel: "Class 9-10",
    isFree: true,
  },
];

// ==========================
// SCHOLARSHIPS — Real Indian scholarships
// ==========================
const scholarships = [
  {
    title: "NSP Pre-Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice & Empowerment",
    amount: "₹3,500 per year",
    deadline: new Date("2026-11-30"),
    description:
      "Pre-matric scholarship for SC students studying in Class 9-10. Covers maintenance allowance and book grant for families with annual income below ₹2.5 lakh.",
    eligibility: {
      state: "All",
      caste: "SC",
      income: "Below 2.5 Lakh",
      gender: "All",
      grade: "Class 9-10",
      course: "",
    },
    applicationUrl: "https://scholarships.gov.in/",
  },
  {
    title: "NSP Post-Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice & Empowerment",
    amount: "₹7,000 – ₹13,000 per year",
    deadline: new Date("2026-11-30"),
    description:
      "Post-matric scholarship for SC students in Class 11 and above. Covers tuition fees, maintenance allowance and study tour charges.",
    eligibility: {
      state: "All",
      caste: "SC",
      income: "Below 2.5 Lakh",
      gender: "All",
      grade: "Class 11-12",
      course: "",
    },
    applicationUrl: "https://scholarships.gov.in/",
  },
  {
    title: "Prime Minister's Scholarship Scheme (PMSS)",
    provider: "Ministry of Defence, Govt. of India",
    amount: "₹30,000 per year (Boys) / ₹36,000 per year (Girls)",
    deadline: new Date("2026-10-15"),
    description:
      "For wards and widows of ex-servicemen / ex-Coast Guard personnel pursuing professional degree courses. Available for 1st year to last year of the course.",
    eligibility: {
      state: "All",
      caste: "All",
      income: "All",
      gender: "All",
      grade: "Class 11-12",
      course: "Professional Degree",
    },
    applicationUrl: "https://scholarships.gov.in/",
  },
  {
    title: "Begum Hazrat Mahal National Scholarship",
    provider: "Maulana Azad Education Foundation",
    amount: "₹5,000 – ₹6,000 per year",
    deadline: new Date("2026-09-30"),
    description:
      "For meritorious girls belonging to minority communities studying in Class 9-12. Minimum 50% marks required in previous class.",
    eligibility: {
      state: "All",
      caste: "Minority",
      income: "Below 2 Lakh",
      gender: "Female",
      grade: "Class 9-10",
      course: "",
    },
    applicationUrl: "https://scholarships.gov.in/",
  },
  {
    title: "Central Sector Scheme of Scholarship",
    provider: "Ministry of Education, Govt. of India",
    amount: "₹10,000 – ₹20,000 per year",
    deadline: new Date("2026-12-31"),
    description:
      "For students who scored above 80th percentile in Class 12 board exams and are from families with income below ₹8 lakh. Supports UG and PG studies.",
    eligibility: {
      state: "All",
      caste: "All",
      income: "Below 8 Lakh",
      gender: "All",
      grade: "Class 11-12",
      course: "UG/PG",
    },
    applicationUrl: "https://scholarships.gov.in/",
  },
  {
    title: "INSPIRE Scholarship (SHE) — DST",
    provider: "Department of Science & Technology",
    amount: "₹80,000 per year",
    deadline: new Date("2026-10-31"),
    description:
      "Innovation in Science Pursuit for Inspired Research (INSPIRE). For top 1% students in Class 12 board pursuing BSc / BS / Integrated MSc in natural and basic sciences.",
    eligibility: {
      state: "All",
      caste: "All",
      income: "All",
      gender: "All",
      grade: "Class 11-12",
      course: "BSc / Integrated MSc",
    },
    applicationUrl: "https://online-inspire.gov.in/",
  },
  {
    title: "Pragati Scholarship for Girls — AICTE",
    provider: "AICTE (All India Council for Technical Education)",
    amount: "₹50,000 per year",
    deadline: new Date("2026-12-15"),
    description:
      "For girl students admitted to AICTE-approved technical diploma/degree programmes. One girl per family; family income must be below ₹8 lakh.",
    eligibility: {
      state: "All",
      caste: "All",
      income: "Below 8 Lakh",
      gender: "Female",
      grade: "Class 11-12",
      course: "Technical Diploma/Degree",
    },
    applicationUrl: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
  },
  {
    title: "Tamil Nadu Chief Minister's Scholarship",
    provider: "Government of Tamil Nadu",
    amount: "₹12,000 per year",
    deadline: new Date("2026-08-31"),
    description:
      "Merit-cum-means scholarship for students from Tamil Nadu studying in government or aided schools. Family income must be below ₹2 lakh per annum.",
    eligibility: {
      state: "Tamil Nadu",
      caste: "All",
      income: "Below 2 Lakh",
      gender: "All",
      grade: "Class 9-10",
      course: "",
    },
    applicationUrl: "https://www.scholarships.tn.gov.in/",
  },
  {
    title: "Karnataka Vidyasiri Scholarship for Minorities",
    provider: "Karnataka Minorities Development Corporation",
    amount: "₹5,000 – ₹15,000 per year",
    deadline: new Date("2026-09-15"),
    description:
      "For minority community students (Muslim, Christian, Jain, Sikh, Buddhist, Parsi) studying in Karnataka from Class 1 to PG. Income limit ₹2.5 lakh.",
    eligibility: {
      state: "Karnataka",
      caste: "Minority",
      income: "Below 2.5 Lakh",
      gender: "All",
      grade: "All",
      course: "",
    },
    applicationUrl: "https://karepass.cgg.gov.in/",
  },
  {
    title: "Uttar Pradesh Post-Matric Scholarship for OBC",
    provider: "Government of Uttar Pradesh",
    amount: "₹1,500 – ₹7,000 per year",
    deadline: new Date("2026-12-31"),
    description:
      "For OBC students of Uttar Pradesh studying in Class 11 and above. Family income must be below ₹2 lakh per annum. Covers tuition and maintenance.",
    eligibility: {
      state: "Uttar Pradesh",
      caste: "OBC",
      income: "Below 2 Lakh",
      gender: "All",
      grade: "Class 11-12",
      course: "",
    },
    applicationUrl: "https://scholarship.up.gov.in/",
  },
];

// ==========================
// SEED FUNCTION
// ==========================
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Find or create an admin user for course createdBy
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      admin = await User.create({
        name: "EduReach Admin",
        email: "admin@edureach.in",
        password: "admin123456",
        role: "admin",
        language: "en",
        state: "All",
      });
      console.log("Created admin user: admin@edureach.in / admin123456");
    }

    // Clear existing seed data
    await Course.deleteMany({});
    await Scholarship.deleteMany({});
    console.log("Cleared existing courses and scholarships.");

    // Insert courses with admin as creator
    const courseDocs = courses.map((c) => ({ ...c, createdBy: admin._id }));
    const insertedCourses = await Course.insertMany(courseDocs);
    console.log(`Seeded ${insertedCourses.length} courses.`);

    // Insert scholarships
    const insertedScholarships = await Scholarship.insertMany(scholarships);
    console.log(`Seeded ${insertedScholarships.length} scholarships.`);

    // ── Mentor seed data ──────────────────────────────────────
    const mentorData = [
      {
        name: "Arjun Sharma", email: "arjun.mentor@edureach.in", password: "mentor123",
        language: "hi", state: "Uttar Pradesh",
        subjects: ["Mathematics", "Physics"], languages: ["hi", "en"],
        bio: "IIT Bombay graduate with 5 years teaching experience in Maths and Physics. Helped 80+ students crack JEE.",
        rating: 4.8, totalSessions: 92,
      },
      {
        name: "Priya Nair", email: "priya.mentor@edureach.in", password: "mentor123",
        language: "ml", state: "Kerala",
        subjects: ["Science", "Biology", "Chemistry"], languages: ["ml", "en"],
        bio: "MBBS doctor and passionate educator. Specialises in NEET preparation and life sciences for Classes 10–12.",
        rating: 4.9, totalSessions: 115,
      },
      {
        name: "Suresh Babu", email: "suresh.mentor@edureach.in", password: "mentor123",
        language: "ta", state: "Tamil Nadu",
        subjects: ["Mathematics", "Computer Science"], languages: ["ta", "en"],
        bio: "Software engineer at a Bangalore startup. Teaches Python, algorithms and Class 11-12 Maths on weekends.",
        rating: 4.7, totalSessions: 64,
      },
      {
        name: "Meena Reddy", email: "meena.mentor@edureach.in", password: "mentor123",
        language: "te", state: "Andhra Pradesh",
        subjects: ["English", "History", "Geography"], languages: ["te", "en", "hi"],
        bio: "MA English Literature from Hyderabad University. Helps rural students build English fluency and board exam confidence.",
        rating: 4.6, totalSessions: 78,
      },
      {
        name: "Ravi Kumar", email: "ravi.mentor@edureach.in", password: "mentor123",
        language: "kn", state: "Karnataka",
        subjects: ["Mathematics", "Science"], languages: ["kn", "en"],
        bio: "Class 10 topper turned mentor. Focuses on concept clarity for Classes 6–10 using simple, visual explanations.",
        rating: 4.5, totalSessions: 43,
      },
      {
        name: "Fatima Sheikh", email: "fatima.mentor@edureach.in", password: "mentor123",
        language: "hi", state: "Maharashtra",
        subjects: ["Chemistry", "Biology"], languages: ["hi", "en", "ml"],
        bio: "PhD scholar in Biochemistry. Passionate about making science accessible to first-generation learners.",
        rating: 4.9, totalSessions: 57,
      },
    ];

    for (const m of mentorData) {
      let mentorUser = await User.findOne({ email: m.email });
      if (!mentorUser) {
        mentorUser = await User.create({
          name: m.name, email: m.email, password: m.password,
          role: "mentor", language: m.language, state: m.state,
        });
      }
      const existingProfile = await Mentor.findOne({ user: mentorUser._id });
      if (!existingProfile) {
        await Mentor.create({
          user: mentorUser._id,
          subjects: m.subjects,
          languages: m.languages,
          bio: m.bio,
          rating: m.rating,
          totalSessions: m.totalSessions,
        });
      }
    }
    console.log(`Seeded ${mentorData.length} mentor profiles.`);
    // ─────────────────────────────────────────────────────────

    console.log("\n✅ Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();

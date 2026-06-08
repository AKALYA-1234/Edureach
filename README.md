# 🎓 EduReach – AI-Powered Educational & Mentorship Platform

## 📌 Overview

EduReach is a full-stack educational platform designed to provide a comprehensive learning, mentorship, and support ecosystem for students, particularly those in rural communities. The platform combines modern web technologies, real-time communication, and Artificial Intelligence to deliver personalized learning experiences, speech improvement assistance, study planning, mentorship guidance, and mental wellness tracking.

---

## 🚀 Key Features

### 🤖 AI-Powered Speech Therapy & Elocution Coach

* Multilingual Speech-to-Text transcription using Sarvam AI.
* Supports Indian languages including Tamil, Hindi, Telugu, Bengali, and more.
* Detects stuttering patterns and filler words.
* AI-generated feedback on:

  * Pronunciation
  * Fluency
  * Pace
  * Vocabulary
  * Expression
* Provides personalized exercises in the student's native language.

### 💬 Real-Time Mentorship System

* Mentor matching based on student requirements.
* Real-time chat using Socket.io.
* Seamless communication between students and mentors.

### 📚 Learning Management System

* Course creation and management.
* Student enrollment tracking.
* Attendance monitoring.
* Learning progress analytics.

### 📝 Quiz & Assessment Module

* Interactive quizzes.
* Performance tracking.
* Result analysis dashboard.

### 📅 AI Study Planner

* Automatically generates personalized study schedules.
* Goal-oriented preparation plans.
* Adaptive recommendations.

### 🧠 Mental Health Monitoring

* Daily mood logging.
* Emotional well-being tracking.
* Supports mentor intervention when needed.

### 🎓 Scholarship Portal

* Browse available scholarships.
* Save scholarships for later.
* Track application status.

### 🤖 AI Doubt Solver

* Child-friendly AI chatbot.
* Instant academic assistance.
* Subject-specific question answering.

---

# 🏗️ System Architecture

The project follows a Monorepo architecture consisting of three independent services:

```text
EduReach
│
├── Client (React + Vite)
│
├── Server (Node.js + Express)
│
└── AI Service (Python + FastAPI)
```

---

# 💻 Frontend (React + Vite)

The frontend is built using React 19 and Vite for high performance and fast development.

## Tech Stack

* React 19
* Vite
* Tailwind CSS
* Framer Motion
* Zustand
* React Router DOM v7
* React Hook Form
* Zod
* Recharts
* Socket.io Client

## Major Pages

### Authentication

* Login
* Registration
* Protected Routes

### Student Dashboard

* Progress Tracking
* Attendance Monitoring
* Quick Access Tools

### Learning Portal

* Course Listing
* Course Details
* Learning Progress

### Quiz System

* Quiz Taking Interface
* Quiz Result Analysis

### Speech Therapy

* Audio Recording
* Audio Upload
* AI Feedback Reports

### AI Doubt Solver

* Interactive Educational Chatbot

### Mentorship Module

* Mentor Discovery
* Real-Time Chat

### Study Planner

* AI-Generated Study Plans

### Scholarship Portal

* Browse Scholarships
* Save Opportunities

### Admin & Mentor Dashboards

* User Management
* Analytics Dashboard
* Mentor Monitoring

---

# ⚙️ Backend (Node.js + Express)

The backend serves as the central API layer and database management service.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Socket.io
* Cloudinary
* Multer
* Nodemailer

## Database Collections

### User Management

* User
* Mentor
* MentorMatch

### Learning Management

* Course
* Enrollment
* Attendance
* Streak

### Communication

* Conversation
* Message
* ChatReadState

### AI Services

* SpeechSession
* StudyPlan

### Student Well-Being

* MoodLog

### Financial Support

* Scholarship

---

## API Routes

### Authentication

```bash
/api/auth
```

### Courses

```bash
/ api/courses
```

### Chat System

```bash
/ api/chat
/ api/conversations
```

### AI Study Planner

```bash
/ api/study-plan/generate
```

---

# 🤖 AI Microservice (Python + FastAPI)

The AI Service handles specialized Artificial Intelligence operations independently.

## Tech Stack

* Python
* FastAPI
* Sarvam AI
* Groq
* LLaMA Models

---

## AI Capabilities

### Multilingual Speech Analysis

* Accepts audio recordings.
* Converts speech to text using Sarvam AI.
* Supports multiple Indian languages.
* Detects:

  * Stuttering
  * Filler Words
  * Speech Patterns

### Elocution Coaching

* Evaluates:

  * Pronunciation
  * Pace
  * Expression
  * Vocabulary

* Generates:

  * Personalized feedback
  * Speaking exercises
  * Breathing exercises
  * Improvement plans

### AI Doubt Solver

* Child-friendly educational chatbot.
* Subject-specific learning assistance.
* Instant responses powered by LLaMA models.

---

# 📂 Project Structure

```text
EduReach/
│
├── client/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── store/
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── config/
│
├── ai-service/
│   ├── app/
│   ├── services/
│   ├── prompts/
│   └── utils/
│
└── README.md
```

---

# 🔒 Authentication & Security

* JWT Authentication
* Password Hashing using bcryptjs
* Protected API Routes
* Role-Based Access Control

  * Student
  * Mentor
  * Admin

---

# 🌟 Future Enhancements

* Video-based speech coaching
* AI-powered career guidance
* Parent dashboard
* Gamified learning challenges
* Mobile application
* Regional language learning modules

---


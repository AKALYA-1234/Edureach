require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const scholarshipRoutes = require("./routes/scholarship.routes");
const mentorRoutes = require("./routes/mentor.routes");
const { generateStudyPlan } = require("./controllers/studyplan.controller");
const Message = require("./models/Message");

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Track online users: userId (string) -> Set<socketId>
const userSockets = new Map();
app.set('io', io);
app.set('userSockets', userSockets);

app.use(cors());
app.use(express.json());

// ── Socket.io real-time chat ──────────────────────────────
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Each client registers their userId immediately after connecting
  socket.on("register-user", (userId) => {
    if (!userId) return;
    const uid = userId.toString();
    if (!userSockets.has(uid)) userSockets.set(uid, new Set());
    userSockets.get(uid).add(socket.id);
    socket.userId = uid;
    console.log(`Registered user ${uid} on socket ${socket.id}`);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const msg = await Message.create({
        roomId: data.roomId,
        sender: data.sender,
        senderRole: data.senderRole,
        senderName: data.senderName,
        text: data.text,
      });
      io.to(data.roomId).emit("receiveMessage", msg);
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      const sockets = userSockets.get(socket.userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) userSockets.delete(socket.userId);
      }
    }
    console.log("User disconnected:", socket.id);
  });
});
// ──────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ status: "EduReach server running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/chat", require("./routes/chat.routes"));

// ── Study Plan AI (Groq) ────────────────────────────────
app.post("/api/study-plan/generate", generateStudyPlan);
// ────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`EduReach server running on port ${PORT}`);
});


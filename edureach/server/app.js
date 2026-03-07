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
const Message = require("./models/Message");

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// ── Socket.io real-time chat ──────────────────────────────
io.on("connection", (socket) => {
  socket.on("join-room", (matchId) => {
    socket.join(matchId);
  });

  socket.on("send-message", async ({ matchId, senderId, content }) => {
    try {
      const message = await Message.create({ matchId, sender: senderId, content });
      const populated = await message.populate("sender", "name profilePic");
      io.to(matchId).emit("new-message", populated);
    } catch (err) {
      console.error("Socket message error:", err.message);
    }
  });

  socket.on("typing", ({ matchId, userName }) => {
    socket.to(matchId).emit("typing", userName);
  });

  socket.on("stop-typing", (matchId) => {
    socket.to(matchId).emit("stop-typing");
  });
});
// ─────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ status: "EduReach server running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/mentors", mentorRoutes);

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


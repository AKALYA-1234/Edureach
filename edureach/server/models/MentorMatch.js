const mongoose = require("mongoose");

const mentorMatchSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "active", "closed"],
      default: "pending",
    },
    matchScore: { type: Number },
    rating: { type: Number },
    feedback: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorMatch", mentorMatchSchema);

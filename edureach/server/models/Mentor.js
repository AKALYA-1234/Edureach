const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    subjects: [{ type: String }],
    availability: { type: String, default: "" },
    bio: { type: String, default: "" },
    languages: [{ type: String }],
    rating: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);

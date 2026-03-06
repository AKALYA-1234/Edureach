const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "mentor", "admin"],
      default: "student",
    },
    language: {
      type: String,
      enum: ["en", "ta", "hi", "te", "kn", "ml"],
      default: "en",
    },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    school: { type: String, default: "" },
    grade: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    gender: { type: String, default: "" },
    caste: { type: String, default: "" },
    income: { type: String, default: "" },
    isRural: { type: Boolean, default: false },
    appliedScholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scholarship" }],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

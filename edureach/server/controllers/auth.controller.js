const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, language, state, district, school, grade, isRural } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      language: language || "en",
      state: state || "",
      district: district || "",
      school: school || "",
      grade: grade || "",
      isRural: isRural || false,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        state: user.state,
        district: user.district,
        school: user.school,
        grade: user.grade,
        profilePic: user.profilePic,
        isRural: user.isRural,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        state: user.state,
        district: user.district,
        school: user.school,
        grade: user.grade,
        profilePic: user.profilePic,
        isRural: user.isRural,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Login failed.",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        state: user.state,
        district: user.district,
        school: user.school,
        grade: user.grade,
        profilePic: user.profilePic,
        isRural: user.isRural,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get profile.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email.",
      });
    }

    const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpire");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "EduReach – Password Reset",
        text: `You requested a password reset. Click: ${resetUrl}. This link expires in 10 minutes.`,
        html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 10 minutes.</p>`,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        success: false,
        message: "Email could not be sent.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset email sent.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Forgot password failed.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide reset token and new password.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password +resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const jwtToken = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token: jwtToken,
      message: "Password reset successful.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Reset password failed.",
    });
  }
};

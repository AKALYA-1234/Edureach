const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token." });
  }

  try {
    const secret = process.env.JWT_SECRET || "edureach_fallback_secret_key_2024";
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

module.exports = { verifyToken };

const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || "edureach_fallback_secret_key_2024";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId, role }, secret, { expiresIn });
};

module.exports = generateToken;

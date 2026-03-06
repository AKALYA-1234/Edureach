const express = require("express");
const router = express.Router();
const {
  getScholarships,
  getScholarshipById,
  createScholarship,
  checkEligibility,
  applyScholarship,
  getAppliedScholarships,
} = require("../controllers/scholarship.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

// Public
router.get("/", getScholarships);

// Protected — must be above /:id
router.get("/applied", verifyToken, getAppliedScholarships);

// Public
router.get("/:id", getScholarshipById);

// Admin only
router.post("/", verifyToken, requireRole("admin"), createScholarship);

// Protected
router.post("/:id/apply", verifyToken, applyScholarship);
router.get("/:id/eligibility", verifyToken, checkEligibility);

module.exports = router;

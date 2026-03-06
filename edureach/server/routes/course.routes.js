const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updateProgress,
  getEnrolledCourses,
} = require("../controllers/course.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

// Public
router.get("/", getCourses);

// Protected — must be above /:id so it doesn't get treated as an id
router.get("/enrolled", verifyToken, getEnrolledCourses);

// Public
router.get("/:id", getCourseById);

// Protected — teacher/admin
router.post("/", verifyToken, requireRole("teacher", "admin"), createCourse);
router.put("/:id", verifyToken, requireRole("teacher", "admin"), updateCourse);

// Protected — admin only
router.delete("/:id", verifyToken, requireRole("admin"), deleteCourse);

// Protected — student
router.post("/:id/enroll", verifyToken, enrollCourse);
router.put("/:id/progress", verifyToken, updateProgress);

module.exports = router;

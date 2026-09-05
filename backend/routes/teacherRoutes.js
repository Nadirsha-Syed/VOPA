const express = require("express");
const router = express.Router();
const {
  getTeacherDashboard,
  getStudentPerformance,
} = require("../controllers/teacherController");
const { protect, requireRole } = require("../middleware/authMiddleware");

// Teacher Dashboard Overview Metrics
router.get("/dashboard", protect, requireRole("teacher", "admin"), getTeacherDashboard);

// Detailed Student Performance & History
router.get("/students/:id", protect, requireRole("teacher", "admin"), getStudentPerformance);

module.exports = router;

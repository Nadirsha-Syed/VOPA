const express = require("express");
const router = express.Router();
const {
  getTeacherDashboard,
  getTeacherAnalytics,
  getTeacherStudents,
  getTeacherReadingAttempts,
  getStudentPerformance,
} = require("../controllers/teacherController");
const { protect, requireRole } = require("../middleware/authMiddleware");

// Teacher Dashboard Overview Metrics
router.get("/dashboard", protect, requireRole("teacher", "admin"), getTeacherDashboard);

// Teacher Class Analytics
router.get("/analytics", protect, requireRole("teacher", "admin"), getTeacherAnalytics);

// Teacher Student Roster
router.get("/students", protect, requireRole("teacher", "admin"), getTeacherStudents);

// Teacher Reading Attempts Feed
router.get("/reading-attempts", protect, requireRole("teacher", "admin"), getTeacherReadingAttempts);

// Detailed Student Performance & History
router.get("/students/:id", protect, requireRole("teacher", "admin"), getStudentPerformance);

module.exports = router;

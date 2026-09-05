const express = require("express");
const router = express.Router();
const { getTeacherDashboard } = require("../controllers/teacherController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, requireRole("teacher"), getTeacherDashboard);

module.exports = router;

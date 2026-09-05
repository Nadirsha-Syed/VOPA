const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { submitReading, getReadingById, getStudentReadings, recordReadingAttempt } = require("../controllers/readingController");

// POST /api/readings/record - Record attempt from browser speech recognition (Student / Teacher / Admin)
router.post("/record", protect, recordReadingAttempt);

// POST /api/readings/submit - Submit voice recording (Student only)
router.post(
  "/submit",
  protect,
  requireRole("student"),
  upload.single("audio"),
  submitReading
);

// GET /api/readings/:id - Fetch attempt result by ID
router.get("/:id", protect, getReadingById);

// GET /api/readings/student/:id - Fetch attempt history for student
router.get("/student/:id", protect, getStudentReadings);

module.exports = router;

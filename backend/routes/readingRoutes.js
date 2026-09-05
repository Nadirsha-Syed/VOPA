const express = require("express");
const router = express.Router();
const { submitReading } = require("../controllers/readingController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.post("/submit", protect, requireRole("student"), submitReading);

module.exports = router;

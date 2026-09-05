const express = require("express");
const router = express.Router();
const { getStudentProgress } = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");

// Student Progress History (Past attempt scores, progression, active improvement plans)
router.get("/:id/progress", protect, getStudentProgress);

module.exports = router;

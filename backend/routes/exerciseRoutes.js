const express = require("express");
const router = express.Router();
const { getExercises, getExerciseById } = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getExercises);
router.get("/:id", protect, getExerciseById);

module.exports = router;

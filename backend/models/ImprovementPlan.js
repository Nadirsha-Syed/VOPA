const mongoose = require("mongoose");

/**
 * ImprovementPlan Model
 *
 * Generated after each ReadingAttempt.
 * Initially rule-based (score thresholds).
 * Later, the AI/improvement service will personalise this.
 */
const improvementPlanSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    readingAttemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReadingAttempt",
      required: [true, "Reading attempt ID is required"],
    },

    // ── Analysis results ──────────────────────────────────────────────────────
    weakAreas: {
      type: [String],
      default: [],
      // e.g. ["difficult words", "th sound", "reading speed"]
    },

    // ── Recommendations ───────────────────────────────────────────────────────
    recommendations: {
      type: [String],
      default: [],
      // e.g. ["Practice the word 'football' 3 times", "Try an easier exercise"]
    },

    // ── Suggested next exercise difficulty ────────────────────────────────────
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["active", "completed", "dismissed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

improvementPlanSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model("ImprovementPlan", improvementPlanSchema);

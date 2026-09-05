const mongoose = require("mongoose");

/**
 * ReadingAttempt Model
 *
 * Created each time a student submits a reading exercise.
 * The AI analysis fields are populated by speechService / scoringService.
 * Audio is never stored in MongoDB — only a reference path/URL.
 */
const readingAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: [true, "Exercise ID is required"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
    },

    // ── Audio ─────────────────────────────────────────────────────────────────
    // Path or cloud URL to the audio file — NOT the raw binary
    audioReference: {
      type: String,
      default: null,
    },

    // ── Text comparison ───────────────────────────────────────────────────────
    expectedText: {
      type: String,
      required: [true, "Expected text is required"],
    },
    recognizedText: {
      type: String,
      default: "", // Filled in by the speech-to-text service
    },

    // ── Scoring ───────────────────────────────────────────────────────────────
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null, // null until AI processing is complete
    },

    // ── Error analysis ────────────────────────────────────────────────────────
    mistakes: {
      type: [String],
      default: [], // Array of words the student missed or mispronounced
    },
    feedback: {
      type: String,
      default: "",
    },

    // ── Pronunciation (advanced — populated later by AI) ──────────────────────
    pronunciationAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      /**
       * Placeholder for phoneme-level analysis.
       * Example structure (added by AI module later):
       * {
       *   phonemes: [...],
       *   fluencyScore: 78,
       *   paceWPM: 95
       * }
       */
    },

    // ── Processing status ─────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common access patterns
readingAttemptSchema.index({ studentId: 1, createdAt: -1 });
readingAttemptSchema.index({ exerciseId: 1 });

module.exports = mongoose.model("ReadingAttempt", readingAttemptSchema);

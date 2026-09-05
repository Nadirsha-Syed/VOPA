const mongoose = require("mongoose");

/**
 * Exercise Model
 *
 * Stores reading exercises shown to students.
 * Managed entirely by the admin.
 */
const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exercise title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    text: {
      type: String,
      required: [true, "Exercise text is required"],
      trim: true,
      // The sentence(s) the student will read aloud
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
      default: "English",
      // Matches Language.name — kept as a string for simplicity at MVP stage
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty must be easy, medium, or hard",
      },
      default: "easy",
    },
    category: {
      type: String,
      trim: true,
      default: "general",
      // e.g. "animals", "phonics", "daily-life"
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be active or inactive",
      },
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Admin who created the exercise
    },
  },
  {
    timestamps: true,
  }
);

// Index for common query patterns
exerciseSchema.index({ language: 1, difficulty: 1, status: 1 });

module.exports = mongoose.model("Exercise", exerciseSchema);

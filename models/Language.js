const mongoose = require("mongoose");

/**
 * Language Model
 *
 * Stores the languages the platform supports.
 * Admin can enable/disable languages and attach speech-service config.
 * This prevents language settings from being hard-coded across the app.
 */
const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Language name is required"],
      trim: true,
      unique: true,
      // e.g. "English", "Hindi", "Tamil"
    },
    code: {
      type: String,
      required: [true, "Language code is required"],
      trim: true,
      unique: true,
      uppercase: true,
      // BCP-47 codes e.g. "EN", "HI", "TA"
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    /**
     * speechConfiguration — stores provider-specific settings.
     * Using a flexible Mixed type so it can be replaced when
     * the AI provider changes without a schema migration.
     *
     * Example:
     * {
     *   provider: "google",
     *   languageCode: "en-IN",
     *   model: "latest_long"
     * }
     */
    speechConfiguration: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Language", languageSchema);

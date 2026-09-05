const mongoose = require("mongoose");
const ReadingAttempt = require("../models/ReadingAttempt");
const ImprovementPlan = require("../models/ImprovementPlan");
const Exercise = require("../models/Exercise");
const { transcribeAudio } = require("../services/speechService");
const { calculateScore, identifyWeakAreas } = require("../services/scoringService");
const { generatePlanDetails } = require("../services/improvementService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * @desc    Submit audio recording for a reading exercise & get instant AI evaluation
 * @route   POST /api/readings/submit
 * @access  Private (Student only)
 */
const submitReading = async (req, res, next) => {
  try {
    const { exerciseId, language, expectedText: bodyExpectedText } = req.body;
    const studentId = req.user._id;

    if (!req.file) {
      return sendError(res, 400, "Please upload an audio recording file.");
    }

    if (!exerciseId) {
      return sendError(res, 400, "Exercise ID is required.");
    }

    // Fetch exercise to obtain exact expected text & language if not explicitly passed
    let expectedText = bodyExpectedText;
    let exerciseLanguage = language;

    const exercise = await Exercise.findById(exerciseId);
    if (exercise) {
      expectedText = expectedText || exercise.text;
      exerciseLanguage = exerciseLanguage || exercise.language;
    }

    if (!expectedText) {
      return sendError(res, 400, "Expected text could not be resolved for this exercise.");
    }

    const audioPath = req.file.path.replace(/\\/g, "/"); // Normalize Windows slash

    // Step 1: Transcribe audio using Groq Whisper AI Service
    const recognizedText = await transcribeAudio(audioPath, exerciseLanguage || "English");

    // Step 2: Calculate reading score & detect mispronounced/missing words
    const { score, correctWords, mistakes } = calculateScore(expectedText, recognizedText);

    // Step 3: Identify weak areas based on mistakes & score
    const weakAreas = identifyWeakAreas(mistakes, score);

    // Step 4: Generate human-friendly reading feedback
    let feedback = "";
    if (score >= 90) {
      feedback = "Excellent reading! Great accuracy and pronunciation.";
    } else if (score >= 75) {
      feedback = "Good effort! Pay attention to the highlighted tricky words.";
    } else if (score >= 60) {
      feedback = "Fair attempt. Practice reading difficult words again.";
    } else {
      feedback = "Needs practice. Listen to the sample audio and try reading again.";
    }

    // Step 5: Save ReadingAttempt to MongoDB
    const readingAttempt = await ReadingAttempt.create({
      studentId,
      exerciseId,
      language: exerciseLanguage || "English",
      audioReference: audioPath,
      expectedText,
      recognizedText,
      score,
      mistakes,
      feedback,
      status: "completed",
    });

    // Step 6: Generate & Save ImprovementPlan to MongoDB
    const planDetails = generatePlanDetails(score, mistakes, weakAreas);

    const improvementPlan = await ImprovementPlan.create({
      studentId,
      readingAttemptId: readingAttempt._id,
      weakAreas: planDetails.weakAreas,
      recommendations: planDetails.recommendations,
      difficulty: planDetails.difficulty,
      status: "active",
    });

    // Step 7: Return unified response to frontend
    return sendSuccess(
      res,
      201,
      {
        attempt: {
          id: readingAttempt._id,
          score: readingAttempt.score,
          expectedText: readingAttempt.expectedText,
          recognizedText: readingAttempt.recognizedText,
          correctWords,
          mistakes: readingAttempt.mistakes,
          feedback: readingAttempt.feedback,
          audioReference: readingAttempt.audioReference,
          createdAt: readingAttempt.createdAt,
        },
        improvementPlan: {
          id: improvementPlan._id,
          weakAreas: improvementPlan.weakAreas,
          recommendations: improvementPlan.recommendations,
          suggestedNextDifficulty: improvementPlan.difficulty,
        },
      },
      "Reading evaluated and improvement plan generated successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed reading attempt result by ID
 * @route   GET /api/readings/:id
 * @access  Private (Student / Teacher / Admin)
 */
const getReadingById = async (req, res, next) => {
  try {
    const attempt = await ReadingAttempt.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("exerciseId", "title text language difficulty");

    if (!attempt) {
      return sendError(res, 404, "Reading attempt not found.");
    }

    // Authorization check: Student can only access their own attempts
    if (req.user.role === "student" && attempt.studentId._id.toString() !== req.user._id.toString()) {
      return sendError(res, 403, "Access denied.");
    }

    // Fetch associated improvement plan
    const improvementPlan = await ImprovementPlan.findOne({ readingAttemptId: attempt._id });

    return sendSuccess(res, 200, { attempt, improvementPlan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reading attempt history for a student
 * @route   GET /api/students/:id/readings
 * @access  Private (Student self / Teacher / Admin)
 */
const getStudentReadings = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    if (req.user.role === "student" && studentId !== req.user._id.toString()) {
      return sendError(res, 403, "Access denied.");
    }

    const attempts = await ReadingAttempt.find({ studentId })
      .sort({ createdAt: -1 })
      .populate("exerciseId", "title difficulty language");

    return sendSuccess(res, 200, { attempts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record a completed reading attempt directly (e.g. from browser speech recognition)
 * @route   POST /api/readings/record
 * @access  Private (Student, Teacher, Admin)
 */
const recordReadingAttempt = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const {
      exerciseId,
      exerciseTitle,
      expectedText: bodyExpectedText,
      recognizedText = "",
      language = "English",
      score = 0,
      mistakes = [],
      wordsCorrect = 0,
      totalWords = 0,
    } = req.body;

    let exercise = null;
    if (exerciseId && mongoose.Types.ObjectId.isValid(exerciseId)) {
      exercise = await Exercise.findById(exerciseId);
    }

    if (!exercise && exerciseTitle) {
      exercise = await Exercise.findOne({
        $or: [
          { title: new RegExp(`^${exerciseTitle}$`, "i") },
          { text: new RegExp(`^${bodyExpectedText || exerciseTitle}$`, "i") },
        ],
      });
    }

    if (!exercise) {
      exercise = await Exercise.findOne({
        language: new RegExp(`^${language}$`, "i"),
      });
    }

    if (!exercise) {
      exercise = await Exercise.create({
        title: exerciseTitle || `${language} Reading Practice`,
        text: bodyExpectedText || "Sample reading exercise",
        language: language,
        difficulty: "easy",
        category: "general",
        status: "active",
        createdBy: studentId,
      });
    }

    const expectedText = bodyExpectedText || exercise.text || exercise.title;

    // Generate reading feedback
    let feedback = "";
    if (score >= 90) {
      feedback = "Outstanding! Excellent accuracy and pronunciation.";
    } else if (score >= 75) {
      feedback = "Great job! Keep practicing to increase fluency.";
    } else if (score >= 60) {
      feedback = "Fair attempt. Try practicing difficult words again.";
    } else {
      feedback = "Good effort. Practice reading aloud once more.";
    }

    // Create ReadingAttempt in MongoDB
    const readingAttempt = await ReadingAttempt.create({
      studentId,
      exerciseId: exercise._id,
      language: language || exercise.language || "English",
      expectedText,
      recognizedText,
      score: Math.min(100, Math.max(0, Math.round(score))),
      mistakes: Array.isArray(mistakes) ? mistakes : [],
      feedback,
      status: "completed",
    });

    // Create or update ImprovementPlan in MongoDB
    try {
      const weakAreas = score < 75 ? ["Pronunciation", "Fluency"] : ["Comprehension"];
      await ImprovementPlan.create({
        studentId,
        readingAttemptId: readingAttempt._id,
        weakAreas,
        recommendations: [
          score >= 80 ? "Advance to higher difficulty reading" : "Review tricky words from this passage",
        ],
        difficulty: score >= 80 ? "medium" : "easy",
        status: "active",
      });
    } catch (e) {
      // Non-blocking
    }

    return sendSuccess(
      res,
      201,
      {
        attempt: {
          id: readingAttempt._id,
          exerciseId: exercise._id,
          exerciseTitle: exercise.title,
          language: readingAttempt.language,
          score: readingAttempt.score,
          mistakes: readingAttempt.mistakes,
          feedback: readingAttempt.feedback,
          createdAt: readingAttempt.createdAt,
        },
      },
      "Reading attempt recorded successfully in database"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { submitReading, getReadingById, getStudentReadings, recordReadingAttempt };

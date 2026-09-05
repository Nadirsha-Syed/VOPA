const mongoose = require("mongoose");
const Exercise = require("../models/Exercise");
const User = require("../models/User");
const { getStudentProgressHistory } = require("../services/analyticsService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * Maps student currentLevel to Exercise difficulty
 */
const levelToDifficulty = {
  beginner: "easy",
  intermediate: "medium",
  advanced: "hard",
};

/**
 * @desc    Retrieve exercises filtered by language and difficulty level
 * @route   GET /api/exercises?language=Hindi&difficulty=easy
 * @access  Private (Student, Teacher, Admin)
 */
const getExercises = async (req, res, next) => {
  try {
    const { language, difficulty, category, page = 1, limit = 20 } = req.query;

    const filter = { status: "active" };

    // Filter by language: prioritize query param, fallback to student's preferredLanguage
    const targetLanguage = language || (req.user && req.user.role === "student" ? req.user.preferredLanguage : null);
    if (targetLanguage) {
      filter.language = new RegExp(`^${targetLanguage.trim()}$`, "i");
    }

    // Filter by difficulty: prioritize query param
    // If not provided in query and user requested auto-leveling or has currentLevel
    if (difficulty) {
      filter.difficulty = new RegExp(`^${difficulty.trim()}$`, "i");
    } else if (req.query.matchLevel === "true" && req.user?.currentLevel) {
      const mappedDifficulty = levelToDifficulty[req.user.currentLevel] || "easy";
      filter.difficulty = mappedDifficulty;
    }

    if (category) {
      filter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, exercises] = await Promise.all([
      Exercise.countDocuments(filter),
      Exercise.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
    ]);

    return sendSuccess(
      res,
      200,
      {
        exercises,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      },
      "Exercises retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single exercise by ID
 * @route   GET /api/exercises/:id
 * @access  Private
 */
const getExerciseById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendError(res, 400, "Invalid exercise ID format");
    }

    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return sendError(res, 404, "Exercise not found");
    }

    return sendSuccess(res, 200, { exercise }, "Exercise retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student progress history, past attempts, score progression & active improvement plans
 * @route   GET /api/students/:id/progress
 * @access  Private (Student self, assigned Teacher, Admin)
 */
const getStudentProgress = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return sendError(res, 400, "Invalid student ID format");
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return sendError(res, 404, "Student not found");
    }

    // Role-based authorization:
    // 1. Student can only view their OWN progress
    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
      return sendError(res, 403, "Access denied. Students can only view their own progress.");
    }

    // 2. Teacher can only view assigned students
    if (req.user.role === "teacher") {
      const isAssigned =
        (student.assignedTeacher &&
          student.assignedTeacher.toString() === req.user._id.toString()) ||
        (req.user.assignedStudents &&
          req.user.assignedStudents.some((id) => id.toString() === studentId.toString()));

      if (!isAssigned) {
        return sendError(
          res,
          403,
          "Access denied. You are not authorized to view this student's progress."
        );
      }
    }

    // 3. Admin can view any student's progress
    const progressData = await getStudentProgressHistory(studentId);
    if (!progressData) {
      return sendError(res, 404, "Student progress history not found");
    }

    return sendSuccess(
      res,
      200,
      progressData,
      "Student progress history retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  getStudentProgress,
};

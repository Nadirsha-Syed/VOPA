const Exercise = require("../models/Exercise");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getExercises = async (req, res, next) => {
  try {
    const { language, difficulty } = req.query;
    const filter = { status: "active" };
    if (language) filter.language = language;
    if (difficulty) filter.difficulty = difficulty;

    const exercises = await Exercise.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, { exercises });
  } catch (error) {
    next(error);
  }
};

const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return sendError(res, 404, "Exercise not found");
    return sendSuccess(res, 200, { exercise });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExercises, getExerciseById };

const { sendSuccess } = require("../utils/apiResponse");

const submitReading = async (req, res, next) => {
  try {
    // Placeholder endpoint for reading submission
    return sendSuccess(res, 200, { message: "Reading submission endpoint placeholder" });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitReading };

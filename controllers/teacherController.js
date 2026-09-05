const { sendSuccess } = require("../utils/apiResponse");

const getTeacherDashboard = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, { message: "Teacher dashboard endpoint placeholder" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeacherDashboard };

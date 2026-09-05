const { sendSuccess } = require("../utils/apiResponse");

const getAdminDashboard = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, { message: "Admin dashboard endpoint placeholder" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard };

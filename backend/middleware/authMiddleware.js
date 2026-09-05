const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");

/**
 * protect
 *
 * Verifies the JWT in the Authorization header.
 * On success, attaches the authenticated user document to req.user.
 *
 * Usage:
 *   router.get("/me", protect, controller);
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return sendError(res, 401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data (so deactivated users are blocked immediately)
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return sendError(res, 401, "User belonging to this token no longer exists.");
    }

    if (user.status === "inactive") {
      return sendError(res, 401, "Your account has been deactivated. Contact an admin.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired. Please log in again.");
    }
    return sendError(res, 401, "Invalid token. Please log in again.");
  }
};

/**
 * requireRole
 *
 * Role-based access control middleware factory.
 * Must be used AFTER protect (requires req.user to be set).
 *
 * Usage:
 *   router.get("/dashboard", protect, requireRole("teacher"), controller);
 *   router.delete("/user/:id", protect, requireRole("admin"), controller);
 *
 * Accepts multiple roles:
 *   requireRole("admin", "teacher")
 *
 * @param  {...string} roles  Allowed roles
 * @returns {Function}        Express middleware
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Not authenticated.");
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. This route requires role: ${roles.join(" or ")}.`
      );
    }

    next();
  };
};

module.exports = { protect, requireRole };

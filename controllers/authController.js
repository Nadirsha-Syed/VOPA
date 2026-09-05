const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public (Only student registration allowed publicly)
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "Please provide name, email, and password.");
    }

    // Security check: prevent registering as admin/teacher directly via public endpoint
    let assignedRole = "student";
    if (role && role !== "student") {
      // If someone tries to register as teacher or admin, restrict unless explicitly permitted
      // Administrative user creation is handled via Admin endpoints.
      return sendError(
        res,
        403,
        "Self-registration is restricted to students. Teachers and admins must be created by an Admin."
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, "User with this email already exists.");
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password, // Mongoose pre-save hook will hash this
      role: assignedRole,
      preferredLanguage: preferredLanguage || "English",
    });

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(
      res,
      201,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
        },
      },
      "User registered successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password.");
    }

    // Select passwordHash explicitly since it is excluded in model default select
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return sendError(res, 401, "Invalid email or password.");
    }

    if (user.status === "inactive") {
      return sendError(res, 401, "Account deactivated. Please contact support.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password.");
    }

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(
      res,
      200,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
        },
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user details
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, { user: req.user }, "Current user fetched successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  validate,
  registerRules,
  loginRules,
  updatePasswordRules,
} = require("../middleware/authValidator");

// Public routes
router.post("/register", validate(registerRules), register);
router.post("/login", validate(loginRules), login);
router.post("/logout", logout);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update-password", protect, validate(updatePasswordRules), updatePassword);

module.exports = router;

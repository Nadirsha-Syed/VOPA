const express = require("express");
const router = express.Router();
const { getAdminDashboard } = require("../controllers/adminController");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, requireRole("admin"), getAdminDashboard);

module.exports = router;

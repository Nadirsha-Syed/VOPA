const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const readingRoutes = require("./routes/readingRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static Uploads Directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VOPA backend is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

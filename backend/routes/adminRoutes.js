const express = require("express");
const router = express.Router();
const {
  // Dashboard
  getAdminDashboard,
  // User Management
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTeachers,
  getStudents,
  assignStudentToTeacher,
  // Exercise Management
  getAdminExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  // Language Management
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} = require("../controllers/adminController");
const { protect, requireRole } = require("../middleware/authMiddleware");

// All Admin routes require valid JWT and "admin" role
router.use(protect, requireRole("admin"));

// ── 1. Platform Analytics ─────────────────────────────────────────────────────
router.get("/dashboard", getAdminDashboard);

// ── 2. User Management ────────────────────────────────────────────────────────
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/teachers", getTeachers);
router.get("/students", getStudents);
router.put("/assign-student", assignStudentToTeacher);

// ── 3. Exercise Management (CRUD) ─────────────────────────────────────────────
router.get("/exercises", getAdminExercises);
router.post("/exercises", createExercise);
router.put("/exercises/:id", updateExercise);
router.delete("/exercises/:id", deleteExercise);

// ── 4. Language Management ────────────────────────────────────────────────────
router.get("/languages", getAllLanguages);
router.post("/languages", createLanguage);
router.put("/languages/:id", updateLanguage);
router.delete("/languages/:id", deleteLanguage);

module.exports = router;

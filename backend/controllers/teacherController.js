const mongoose = require("mongoose");
const User = require("../models/User");
const { getTeacherDashboardData, getStudentPerformanceData } = require("../services/analyticsService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * @desc    Get teacher dashboard overview metrics
 * @route   GET /api/teacher/dashboard
 * @access  Private (Teacher, Admin)
 */
const getTeacherDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    let targetTeacherId = teacherId;

    // Admins can inspect a specific teacher's dashboard via ?teacherId=
    if (req.user.role === "admin" && req.query.teacherId) {
      targetTeacherId = req.query.teacherId;
      if (!mongoose.Types.ObjectId.isValid(targetTeacherId)) {
        return sendError(res, 400, "Invalid teacher ID provided in query");
      }
    }

    let assignedStudentIds = [];

    if (req.user.role === "admin" && !req.query.teacherId) {
      // Admin overall view across all students
      const allStudents = await User.find({ role: "student", status: "active" }).select("_id");
      assignedStudentIds = allStudents.map((s) => s._id);
    } else {
      // Find students assigned to this teacher
      const teacherDoc = await User.findById(targetTeacherId).select("assignedStudents");
      const teacherStudentList = teacherDoc?.assignedStudents || [];

      const students = await User.find({
        role: "student",
        $or: [
          { assignedTeacher: targetTeacherId },
          { _id: { $in: teacherStudentList } },
        ],
      }).select("_id");

      assignedStudentIds = students.map((s) => s._id);
    }

    // If teacher has no assigned students, return empty dashboard
    if (assignedStudentIds.length === 0) {
      return sendSuccess(
        res,
        200,
        {
          totalStudents: 0,
          totalAttempts: 0,
          classAverageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          recentAttempts: [],
          studentsNeedingAttention: [],
          scoreDistribution: {
            below60: 0,
            between60And74: 0,
            between75And89: 0,
            above90: 0,
          },
          languageBreakdown: [],
        },
        "No assigned students found for this teacher"
      );
    }

    const dashboardData = await getTeacherDashboardData(targetTeacherId, assignedStudentIds);
    return sendSuccess(res, 200, dashboardData, "Teacher dashboard data retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed performance for an individual student
 * @route   GET /api/teacher/students/:id
 * @access  Private (Teacher, Admin)
 */
const getStudentPerformance = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return sendError(res, 400, "Invalid student ID format");
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return sendError(res, 404, "Student not found");
    }

    // Role-based access control check for teachers:
    // Ensure the student is assigned to this teacher
    if (req.user.role === "teacher") {
      const isAssigned =
        (student.assignedTeacher &&
          student.assignedTeacher.toString() === req.user._id.toString()) ||
        (req.user.assignedStudents &&
          req.user.assignedStudents.some((id) => id.toString() === studentId.toString()));

      if (!isAssigned) {
        return sendError(
          res,
          403,
          "Access denied. You are not authorized to view this student's performance."
        );
      }
    }

    const performanceData = await getStudentPerformanceData(studentId);
    if (!performanceData) {
      return sendError(res, 404, "Student performance data not found");
    }

    return sendSuccess(
      res,
      200,
      performanceData,
      "Student performance details retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeacherDashboard,
  getStudentPerformance,
};

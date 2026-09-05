const mongoose = require("mongoose");
const User = require("../models/User");
const ReadingAttempt = require("../models/ReadingAttempt");
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
      // Find students assigned to this teacher, or unassigned students in the school
      const teacherDoc = await User.findById(targetTeacherId).select("assignedStudents");
      const teacherStudentList = teacherDoc?.assignedStudents || [];

      // Check other active teachers to avoid claiming other teachers' explicitly assigned students
      const otherTeachers = await User.find({ role: "teacher", _id: { $ne: targetTeacherId } }).select("_id");
      const otherTeacherIds = otherTeachers.map((t) => t._id);

      const students = await User.find({
        role: "student",
        $or: [
          { assignedTeacher: targetTeacherId },
          { assignedTeacher: { $nin: otherTeacherIds } },
          { assignedTeacher: null },
          { assignedTeacher: { $exists: false } },
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
 * @desc    Get student list for teacher's class
 * @route   GET /api/teacher/students
 * @access  Private (Teacher, Admin)
 */
const getTeacherStudents = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    let targetTeacherId = teacherId;

    if (req.user.role === "admin" && req.query.teacherId) {
      targetTeacherId = req.query.teacherId;
    }

    const teacherDoc = await User.findById(targetTeacherId).select("assignedStudents");
    const teacherStudentList = teacherDoc?.assignedStudents || [];

    const otherTeachers = await User.find({ role: "teacher", _id: { $ne: targetTeacherId } }).select("_id");
    const otherTeacherIds = otherTeachers.map((t) => t._id);

    const query = { role: "student" };
    if (req.user.role !== "admin" || req.query.teacherId) {
      query.$or = [
        { assignedTeacher: targetTeacherId },
        { assignedTeacher: { $nin: otherTeacherIds } },
        { assignedTeacher: null },
        { assignedTeacher: { $exists: false } },
        { _id: { $in: teacherStudentList } },
      ];
    }

    const students = await User.find(query).select("-passwordHash").lean();
    const studentIds = students.map((s) => s._id);

    const attempts = await ReadingAttempt.find({ studentId: { $in: studentIds } }).lean();

    const studentsWithStats = students.map((student) => {
      const studentAttempts = attempts.filter((a) => a.studentId.toString() === student._id.toString());
      const totalAttempts = studentAttempts.length;
      const avgScore =
        totalAttempts > 0
          ? Math.round(studentAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts)
          : 0;
      const lastAttemptDoc = studentAttempts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      const lastAttempt = lastAttemptDoc ? new Date(lastAttemptDoc.createdAt).toLocaleDateString() : "Never";
      const status = totalAttempts > 0 && avgScore < 75 ? "Needs Attention" : "Active";

      return {
        id: student._id.toString(),
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        language: student.preferredLanguage || "English",
        score: avgScore,
        totalAttempts,
        lastAttempt,
        status,
        weakArea: avgScore < 75 && totalAttempts > 0 ? "Pronunciation" : "None",
      };
    });

    return sendSuccess(res, 200, { students: studentsWithStats }, "Teacher students retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reading attempts for teacher's students
 * @route   GET /api/teacher/reading-attempts
 * @access  Private (Teacher, Admin)
 */
const getTeacherReadingAttempts = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    let targetTeacherId = teacherId;

    if (req.user.role === "admin" && req.query.teacherId) {
      targetTeacherId = req.query.teacherId;
    }

    const teacherDoc = await User.findById(targetTeacherId).select("assignedStudents");
    const teacherStudentList = teacherDoc?.assignedStudents || [];

    const otherTeachers = await User.find({ role: "teacher", _id: { $ne: targetTeacherId } }).select("_id");
    const otherTeacherIds = otherTeachers.map((t) => t._id);

    const query = { role: "student" };
    if (req.user.role !== "admin" || req.query.teacherId) {
      query.$or = [
        { assignedTeacher: targetTeacherId },
        { assignedTeacher: { $nin: otherTeacherIds } },
        { assignedTeacher: null },
        { assignedTeacher: { $exists: false } },
        { _id: { $in: teacherStudentList } },
      ];
    }

    const students = await User.find(query).select("_id name").lean();
    const studentIds = students.map((s) => s._id);
    const studentMap = {};
    students.forEach((s) => {
      studentMap[s._id.toString()] = s.name;
    });

    const attempts = await ReadingAttempt.find({ studentId: { $in: studentIds } })
      .sort({ createdAt: -1 })
      .populate("exerciseId", "title language difficulty")
      .lean();

    const formatted = attempts.map((a) => ({
      id: a._id.toString(),
      _id: a._id.toString(),
      student: studentMap[a.studentId?.toString()] || "Student",
      studentId: a.studentId,
      exercise: a.exerciseId?.title || "Reading Exercise",
      language: a.exerciseId?.language || "English",
      score: a.score || 0,
      mistakes: Array.isArray(a.mistakes) ? a.mistakes.length : 0,
      date: new Date(a.createdAt).toLocaleDateString(),
      createdAt: a.createdAt,
    }));

    return sendSuccess(res, 200, { attempts: formatted }, "Reading attempts retrieved successfully");
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
  getTeacherAnalytics: getTeacherDashboard,
  getTeacherStudents,
  getTeacherReadingAttempts,
  getStudentPerformance,
};

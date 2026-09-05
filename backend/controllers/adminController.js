const User = require("../models/User");
const Exercise = require("../models/Exercise");
const Language = require("../models/Language");
const ReadingAttempt = require("../models/ReadingAttempt");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PLATFORM ANALYTICS & DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get platform-wide overview analytics for Admin Dashboard
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    // 1. User counts
    const [totalStudents, totalTeachers, totalAdmins] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      User.countDocuments({ role: "admin" }),
    ]);

    // 2. Reading metrics
    const totalReadingAttempts = await ReadingAttempt.countDocuments();

    // Average platform score
    const scoreAgg = await ReadingAttempt.aggregate([
      { $match: { score: { $ne: null } } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" },
          minScore: { $min: "$score" },
          maxScore: { $max: "$score" },
        },
      },
    ]);

    const avgScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 0;
    const minScore = scoreAgg.length > 0 ? scoreAgg[0].minScore : 0;
    const maxScore = scoreAgg.length > 0 ? scoreAgg[0].maxScore : 0;

    // 3. Languages
    const activeLanguages = await Language.find({ enabled: true }).select("name code");

    // 4. Students needing attention (avg score < 75%)
    const studentsNeedingAttentionAgg = await ReadingAttempt.aggregate([
      { $match: { score: { $ne: null } } },
      {
        $group: {
          _id: "$studentId",
          studentAvg: { $avg: "$score" },
          totalAttempts: { $sum: 1 },
        },
      },
      { $match: { studentAvg: { $lt: 75 } } },
    ]);

    // 5. Recent platform reading activity
    const recentActivity = await ReadingAttempt.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("studentId", "name email")
      .populate("exerciseId", "title difficulty language");

    const formattedRecentActivity = recentActivity.map((ra) => ({
      id: ra._id.toString(),
      studentName: ra.studentId?.name || "Student",
      studentEmail: ra.studentId?.email || "",
      exerciseTitle: ra.exerciseId?.title || "Reading Exercise",
      language: ra.exerciseId?.language || ra.language || "English",
      difficulty: ra.exerciseId?.difficulty || "easy",
      score: ra.score || 0,
      createdAt: ra.createdAt,
      timeAgo: new Date(ra.createdAt).toLocaleDateString(),
    }));

    // 6. Most practiced exercises
    const mostUsedExercisesAgg = await ReadingAttempt.aggregate([
      {
        $group: {
          _id: "$exerciseId",
          attemptCount: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { attemptCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "exercises",
          localField: "_id",
          foreignField: "_id",
          as: "exerciseDetails",
        },
      },
      { $unwind: "$exerciseDetails" },
      {
        $project: {
          _id: 1,
          title: "$exerciseDetails.title",
          language: "$exerciseDetails.language",
          difficulty: "$exerciseDetails.difficulty",
          attemptCount: 1,
          avgScore: { $round: ["$avgScore", 1] },
        },
      },
    ]);

    let mostUsedExercises = mostUsedExercisesAgg;
    if (mostUsedExercises.length === 0) {
      const sampleExercises = await Exercise.find({ status: "active" }).limit(5).select("title language difficulty");
      mostUsedExercises = sampleExercises.map((e) => ({
        _id: e._id,
        title: e.title,
        language: e.language,
        difficulty: e.difficulty,
        attemptCount: 0,
        avgScore: 0,
      }));
    }

    // 7. Score Trend over time
    const scoreTrendAgg = await ReadingAttempt.aggregate([
      { $match: { score: { $ne: null } } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgScore: { $avg: "$score" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          score: { $round: ["$avgScore", 1] },
        },
      },
    ]);

    // 8. Language breakdown
    const languageUsageAgg = await ReadingAttempt.aggregate([
      {
        $group: {
          _id: "$language",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          language: "$_id",
          value: "$count",
          avgScore: { $round: ["$avgScore", 1] },
        },
      },
    ]);

    let languageUsage = languageUsageAgg;
    if (!languageUsage || languageUsage.length === 0) {
      const exerciseLangAgg = await Exercise.aggregate([
        {
          $group: {
            _id: "$language",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            language: "$_id",
            value: "$count",
          },
        },
      ]);
      languageUsage = exerciseLangAgg;
    }
    if (!languageUsage || languageUsage.length === 0) {
      languageUsage = [
        { language: "English", value: 0 },
        { language: "Hindi", value: 0 },
        { language: "Tamil", value: 0 },
      ];
    }

    // 9. Reading Attempts trend
    const readingAttemptsTrend = await ReadingAttempt.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          attempts: 1,
        },
      },
    ]);

    // 10. Student score distribution / improvement
    const studentImprovementFacet = await ReadingAttempt.aggregate([
      { $match: { score: { $ne: null } } },
      {
        $facet: {
          below60: [{ $match: { score: { $lt: 60 } } }, { $count: "count" }],
          between60And74: [{ $match: { score: { $gte: 60, $lt: 75 } } }, { $count: "count" }],
          between75And89: [{ $match: { score: { $gte: 75, $lt: 90 } } }, { $count: "count" }],
          above90: [{ $match: { score: { $gte: 90 } } }, { $count: "count" }],
        },
      },
    ]);
    const facetData = studentImprovementFacet[0] || {};
    const scoreDistribution = [
      { name: '<60%', improvement: facetData.below60?.[0]?.count || 0 },
      { name: '60-74%', improvement: facetData.between60And74?.[0]?.count || 0 },
      { name: '75-89%', improvement: facetData.between75And89?.[0]?.count || 0 },
      { name: '90%+', improvement: facetData.above90?.[0]?.count || 0 },
    ];

    // 11. Mistake frequency across attempts
    const mistakeFrequencyAgg = await ReadingAttempt.aggregate([
      { $match: { score: { $ne: null } } },
      { $unwind: "$mistakes" },
      {
        $group: {
          _id: { $toLower: "$mistakes" },
          value: { $sum: 1 },
        },
      },
      { $sort: { value: -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    return sendSuccess(
      res,
      200,
      {
        stats: {
          totalStudents,
          totalTeachers,
          totalAdmins,
          totalReadingAttempts,
          averageScore: avgScore,
          scoreRange: { min: minScore, max: maxScore },
          activeLanguagesCount: activeLanguages.length,
          studentsNeedingAttentionCount: studentsNeedingAttentionAgg.length,
        },
        activeLanguages,
        mostUsedExercises,
        recentActivity: formattedRecentActivity,
        scoreTrend: scoreTrendAgg,
        languageUsage,
        readingAttemptsTrend,
        studentImprovement: scoreDistribution,
        mistakeFrequency: mistakeFrequencyAgg,
      },
      "Admin dashboard metrics fetched successfully."
    );
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all users with search, role, status filters, and pagination
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate("assignedTeacher", "name email")
        .populate("assignedStudents", "name email"),
      User.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      200,
      {
        users,
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      "Users fetched successfully."
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("assignedTeacher", "name email")
      .populate("assignedStudents", "name email");

    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    let extraData = {};

    if (user.role === "student") {
      const attempts = await ReadingAttempt.find({ studentId: user._id })
        .sort({ createdAt: -1 })
        .populate("exerciseId", "title language difficulty");

      const totalAttempts = attempts.length;
      const averageScore = totalAttempts > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts)
        : 0;

      const readingHistory = [...new Set(attempts.map(a => a.exerciseId?.title || "Exercise"))].slice(0, 5);
      const recentAttempts = attempts.slice(0, 10).map(a => ({
        id: a._id,
        exercise: a.exerciseId?.title || "Exercise",
        language: a.exerciseId?.language || "English",
        score: a.score || 0,
        mistakes: Array.isArray(a.mistakes) ? a.mistakes : [],
        date: new Date(a.createdAt).toLocaleDateString(),
        createdAt: a.createdAt,
      }));

      const fluencyScore = totalAttempts > 0 ? Math.min(100, Math.round(averageScore * 0.95)) : 0;
      const compScore = totalAttempts > 0 ? Math.min(100, Math.round(averageScore * 1.02)) : 0;
      const accuracyScore = averageScore;

      extraData = {
        totalAttempts,
        averageScore,
        readingHistory,
        recentAttempts,
        scoresByCategory: [
          { name: "Reading", value: accuracyScore },
          { name: "Comprehension", value: compScore },
          { name: "Fluency", value: fluencyScore },
        ],
      };
    } else if (user.role === "teacher") {
      const teacherStudentList = user.assignedStudents || [];
      const assignedCount = teacherStudentList.length;

      const studentAttempts = await ReadingAttempt.find({
        studentId: { $in: teacherStudentList.map((s) => s._id) },
      })
        .sort({ createdAt: -1 })
        .populate("studentId", "name")
        .populate("exerciseId", "title")
        .limit(10);

      const classAvg = studentAttempts.length > 0
        ? Math.round(studentAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / studentAttempts.length)
        : 0;

      const activity = studentAttempts.map((a) =>
        `${a.studentId?.name || "Student"} completed "${a.exerciseId?.title || "Reading"}" with ${a.score}%`
      );

      extraData = {
        assignedStudentsCount: assignedCount,
        classPerformance: `${classAvg}%`,
        activity: activity.length > 0 ? activity : ["No student reading activity recorded yet"],
      };
    }

    return sendSuccess(res, 200, { user, ...extraData }, "User fetched successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a user (Student, Teacher, or Admin)
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "student", preferredLanguage, currentLevel } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "Please provide name, email, and password.");
    }

    const normalizedRole = (role || "student").toLowerCase().trim();
    if (!["student", "teacher", "admin"].includes(normalizedRole)) {
      return sendError(res, 400, "Role must be student, teacher, or admin.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, "User with this email already exists.");
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password, // Pre-save hook hashes this
      role,
      preferredLanguage: preferredLanguage || "English",
      currentLevel: role === "student" ? currentLevel || "beginner" : undefined,
      status: "active",
    });

    return sendSuccess(
      res,
      201,
      { user },
      `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully.`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, status, preferredLanguage, currentLevel, password } = req.body;

    const user = await User.findById(req.params.id).select("+passwordHash");
    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    // Single-Admin enforcement: prevent promoting to admin or demoting the admin
    if (role === "admin" && user.role !== "admin") {
      return sendError(
        res,
        400,
        "Cannot promote users to admin. Only one platform administrator is permitted."
      );
    }
    if (user.role === "admin" && role && role !== "admin") {
      return sendError(
        res,
        400,
        "Cannot change the role of the platform administrator."
      );
    }

    if (name) user.name = name;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return sendError(res, 400, "Email already in use by another account.");
      user.email = email;
    }
    if (role && ["student", "teacher"].includes(role)) user.role = role;
    if (status && ["active", "inactive"].includes(status)) user.status = status;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (currentLevel && ["beginner", "intermediate", "advanced"].includes(currentLevel)) {
      user.currentLevel = currentLevel;
    }
    if (password) {
      if (password.length < 6) {
        return sendError(res, 400, "Password must be at least 6 characters.");
      }
      user.passwordHash = password; // Trigger pre-save hash
    }

    await user.save();

    return sendSuccess(res, 200, { user }, "User updated successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate or delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const { permanent } = req.query;
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    // Protect platform admin from deletion or deactivation
    if (user.role === "admin") {
      return sendError(
        res,
        400,
        "The platform administrator account cannot be deactivated or deleted."
      );
    }

    if (permanent === "true") {
      await User.findByIdAndDelete(req.params.id);
      return sendSuccess(res, 200, {}, "User permanently deleted.");
    } else {
      // Soft-delete: deactivate user
      user.status = "inactive";
      await user.save();
      return sendSuccess(res, 200, { user }, "User deactivated successfully.");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List all teachers
 * @route   GET /api/admin/teachers
 * @access  Private/Admin
 */
const getTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-passwordHash")
      .populate("assignedStudents", "name email status currentLevel")
      .lean();

    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const studentIds = (teacher.assignedStudents || []).map((s) => s._id);
        let classAvg = 0;
        let totalStudentAttempts = 0;
        if (studentIds.length > 0) {
          const attempts = await ReadingAttempt.find({ studentId: { $in: studentIds } }).lean();
          totalStudentAttempts = attempts.length;
          if (totalStudentAttempts > 0) {
            classAvg = Math.round(
              attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalStudentAttempts
            );
          }
        }
        return {
          ...teacher,
          id: teacher._id.toString(),
          assignedStudentsCount: teacher.assignedStudents?.length || 0,
          classPerformance: classAvg > 0 ? `${classAvg}%` : (totalStudentAttempts > 0 ? "0%" : "No attempts yet"),
        };
      })
    );

    return sendSuccess(res, 200, { teachers: teachersWithStats }, "Teachers fetched successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List all students
 * @route   GET /api/admin/students
 * @access  Private/Admin
 */
const getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-passwordHash")
      .populate("assignedTeacher", "name email")
      .lean();

    const studentIds = students.map((s) => s._id);
    const attempts = await ReadingAttempt.find({ studentId: { $in: studentIds } }).lean();

    const studentsWithStats = students.map((student) => {
      const studentAttempts = attempts.filter(
        (a) => a.studentId.toString() === student._id.toString()
      );
      const totalAttempts = studentAttempts.length;
      const avgScore =
        totalAttempts > 0
          ? Math.round(studentAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts)
          : 0;
      const lastAttemptDoc = studentAttempts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      const lastAttempt = lastAttemptDoc ? new Date(lastAttemptDoc.createdAt).toLocaleDateString() : "Never";
      const status = totalAttempts > 0 && avgScore < 75 ? "Needs Attention" : (student.status || "active");

      return {
        ...student,
        id: student._id.toString(),
        score: avgScore,
        currentScore: avgScore,
        totalAttempts,
        lastAttempt,
        status: status.charAt(0).toUpperCase() + status.slice(1),
      };
    });

    return sendSuccess(res, 200, { students: studentsWithStats }, "Students fetched successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign or reassign a student to a teacher
 * @route   PUT /api/admin/assign-student
 * @access  Private/Admin
 */
const assignStudentToTeacher = async (req, res, next) => {
  try {
    const { studentId, teacherId } = req.body;

    if (!studentId || !teacherId) {
      return sendError(res, 400, "Please provide both studentId and teacherId.");
    }

    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) {
      return sendError(res, 404, "Student not found.");
    }

    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) {
      return sendError(res, 404, "Teacher not found.");
    }

    // Remove student from old teacher's assignedStudents list if reassigning
    if (student.assignedTeacher && student.assignedTeacher.toString() !== teacherId) {
      await User.findByIdAndUpdate(student.assignedTeacher, {
        $pull: { assignedStudents: student._id },
      });
    }

    // Set student's assigned teacher
    student.assignedTeacher = teacher._id;
    await student.save();

    // Add student to new teacher's assignedStudents (avoid duplicate)
    await User.findByIdAndUpdate(teacher._id, {
      $addToSet: { assignedStudents: student._id },
    });

    return sendSuccess(
      res,
      200,
      {
        student: { id: student._id, name: student.name, assignedTeacher: teacher.name },
        teacher: { id: teacher._id, name: teacher.name },
      },
      `Student ${student.name} assigned to teacher ${teacher.name} successfully.`
    );
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. EXERCISE MANAGEMENT (CRUD)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all exercises (with language/difficulty/status filter)
 * @route   GET /api/admin/exercises
 * @access  Private/Admin
 */
const getAdminExercises = async (req, res, next) => {
  try {
    const { language, difficulty, status, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (language) filter.language = language;
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { text: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const [exercises, total] = await Promise.all([
      Exercise.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate("createdBy", "name email"),
      Exercise.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      200,
      {
        exercises,
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      "Exercises fetched successfully."
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new exercise
 * @route   POST /api/admin/exercises
 * @access  Private/Admin
 */
const createExercise = async (req, res, next) => {
  try {
    const { title, text, language = "English", difficulty = "easy", category = "general", status = "active" } = req.body;

    if (!title || !text) {
      return sendError(res, 400, "Title and text are required.");
    }

    const exercise = await Exercise.create({
      title,
      text,
      language,
      difficulty,
      category,
      status,
      createdBy: req.user._id,
    });

    return sendSuccess(res, 201, { exercise }, "Exercise created successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an exercise
 * @route   PUT /api/admin/exercises/:id
 * @access  Private/Admin
 */
const updateExercise = async (req, res, next) => {
  try {
    const { title, text, language, difficulty, category, status } = req.body;

    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return sendError(res, 404, "Exercise not found.");
    }

    if (title) exercise.title = title;
    if (text) exercise.text = text;
    if (language) exercise.language = language;
    if (difficulty) exercise.difficulty = difficulty;
    if (category) exercise.category = category;
    if (status) exercise.status = status;

    await exercise.save();

    return sendSuccess(res, 200, { exercise }, "Exercise updated successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete or deactivate an exercise
 * @route   DELETE /api/admin/exercises/:id
 * @access  Private/Admin
 */
const deleteExercise = async (req, res, next) => {
  try {
    const { permanent } = req.query;
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return sendError(res, 404, "Exercise not found.");
    }

    if (permanent === "true") {
      await Exercise.findByIdAndDelete(req.params.id);
      return sendSuccess(res, 200, {}, "Exercise permanently deleted.");
    } else {
      exercise.status = "inactive";
      await exercise.save();
      return sendSuccess(res, 200, { exercise }, "Exercise deactivated successfully.");
    }
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. LANGUAGE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @desc    Get all supported languages
 * @route   GET /api/admin/languages
 * @access  Private/Admin
 */
const getAllLanguages = async (req, res, next) => {
  try {
    let languages = await Language.find().sort({ name: 1 });

    if (!languages || languages.length === 0) {
      const defaults = [
        { name: "English", code: "EN", enabled: true, speechConfiguration: { provider: "browser/default", locale: "en-IN" } },
        { name: "Hindi", code: "HI", enabled: true, speechConfiguration: { provider: "browser/default", locale: "hi-IN" } },
        { name: "Tamil", code: "TA", enabled: true, speechConfiguration: { provider: "browser/default", locale: "ta-IN" } },
        { name: "Telugu", code: "TE", enabled: true, speechConfiguration: { provider: "browser/default", locale: "te-IN" } },
        { name: "Spanish", code: "ES", enabled: true, speechConfiguration: { provider: "browser/default", locale: "es-ES" } },
        { name: "Marathi", code: "MR", enabled: true, speechConfiguration: { provider: "browser/default", locale: "mr-IN" } },
      ];
      for (const item of defaults) {
        await Language.findOneAndUpdate({ code: item.code }, item, { upsert: true, new: true });
      }
      languages = await Language.find().sort({ name: 1 });
    }

    // Count exercises per language dynamically
    const exerciseCounts = await Exercise.aggregate([
      { $group: { _id: { $toLower: "$language" }, count: { $sum: 1 } } },
    ]);
    const countMap = {};
    exerciseCounts.forEach((c) => {
      if (c._id) countMap[c._id.toLowerCase()] = c.count;
    });

    const languagesWithCounts = languages.map((lang) => {
      const obj = lang.toObject();
      const nameKey = (obj.name || "").toLowerCase();
      const codeKey = (obj.code || "").toLowerCase();
      obj.exerciseCount = countMap[nameKey] || countMap[codeKey] || 0;
      return obj;
    });

    return sendSuccess(res, 200, { languages: languagesWithCounts }, "Languages fetched successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a supported language
 * @route   POST /api/admin/languages
 * @access  Private/Admin
 */
const createLanguage = async (req, res, next) => {
  try {
    const { name, code, enabled = true, speechConfiguration = {} } = req.body;

    if (!name || !code) {
      return sendError(res, 400, "Language name and code are required.");
    }

    const existingLanguage = await Language.findOne({
      $or: [{ code: code.toUpperCase() }, { name: new RegExp(`^${name}$`, "i") }],
    });

    if (existingLanguage) {
      return sendError(res, 400, "Language with this name or code already exists.");
    }

    const language = await Language.create({
      name,
      code: code.toUpperCase(),
      enabled,
      speechConfiguration,
    });

    return sendSuccess(res, 201, { language }, "Language added successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update language (toggle enabled / edit speechConfiguration)
 * @route   PUT /api/admin/languages/:id
 * @access  Private/Admin
 */
const updateLanguage = async (req, res, next) => {
  try {
    const { name, enabled, speechConfiguration } = req.body;

    const language = await Language.findById(req.params.id);
    if (!language) {
      return sendError(res, 404, "Language not found.");
    }

    if (name) language.name = name;
    if (typeof enabled === "boolean") language.enabled = enabled;
    if (speechConfiguration) language.speechConfiguration = speechConfiguration;

    await language.save();

    return sendSuccess(res, 200, { language }, "Language updated successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete or toggle language
 * @route   DELETE /api/admin/languages/:id
 * @access  Private/Admin
 */
const deleteLanguage = async (req, res, next) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return sendError(res, 404, "Language not found.");
    }

    await Language.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, {}, "Language deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Dashboard & Analytics
  getAdminDashboard,
  getAdminAnalytics: getAdminDashboard,
  // Users
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTeachers,
  getStudents,
  assignStudentToTeacher,
  // Exercises
  getAdminExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  // Languages
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};

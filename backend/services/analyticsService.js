const mongoose = require("mongoose");
const ReadingAttempt = require("../models/ReadingAttempt");
const ImprovementPlan = require("../models/ImprovementPlan");
const User = require("../models/User");

/**
 * Analytics Service
 *
 * Encapsulates Mongoose aggregation pipelines for Teacher Dashboard,
 * Student Performance Tracking, and Platform Analytics.
 */

/**
 * Convert string or ObjectId to mongoose.Types.ObjectId safely
 * @param {string|mongoose.Types.ObjectId} id 
 * @returns {mongoose.Types.ObjectId}
 */
const toObjectId = (id) => {
  if (id instanceof mongoose.Types.ObjectId) return id;
  return new mongoose.Types.ObjectId(String(id));
};

/**
 * Aggregates overview metrics for a teacher's assigned students.
 *
 * Computes:
 * - Class average score
 * - Total students & total attempts
 * - Recent reading attempts (with student & exercise details)
 * - Students needing attention (< 75% average score, < 70% latest score, or 0 attempts)
 * - Score distribution buckets (<60, 60-74, 75-89, 90-100)
 * - Language-wise performance breakdown
 *
 * @param {string|mongoose.Types.ObjectId} teacherId 
 * @param {Array<string|mongoose.Types.ObjectId>} studentIds 
 * @returns {Promise<Object>}
 */
const getTeacherDashboardData = async (teacherId, studentIds = []) => {
  if (!studentIds || studentIds.length === 0) {
    return {
      totalStudents: 0,
      totalAttempts: 0,
      classAverageScore: 0,
      recentAttempts: [],
      studentsNeedingAttention: [],
      scoreDistribution: {
        below60: 0,
        between60And74: 0,
        between75And89: 0,
        above90: 0,
      },
      languageBreakdown: [],
    };
  }

  const studentObjectIds = studentIds.map(toObjectId);

  // ── 1. Class Overview: Average score, total attempts, min/max score ─────────
  const overviewPromise = ReadingAttempt.aggregate([
    {
      $match: {
        studentId: { $in: studentObjectIds },
        score: { $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        averageScore: { $avg: "$score" },
        totalAttempts: { $sum: 1 },
        highestScore: { $max: "$score" },
        lowestScore: { $min: "$score" },
      },
    },
  ]);

  // ── 2. Recent Reading Attempts (latest 10) ──────────────────────────────────
  const recentAttemptsPromise = ReadingAttempt.aggregate([
    {
      $match: {
        studentId: { $in: studentObjectIds },
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $lookup: {
        from: "exercises",
        localField: "exerciseId",
        foreignField: "_id",
        as: "exercise",
      },
    },
    {
      $project: {
        attemptId: "$_id",
        studentId: 1,
        studentName: { $ifNull: [{ $arrayElemAt: ["$student.name", 0] }, "Unknown Student"] },
        exerciseId: 1,
        exerciseTitle: { $ifNull: [{ $arrayElemAt: ["$exercise.title", 0] }, "Reading Exercise"] },
        difficulty: { $ifNull: [{ $arrayElemAt: ["$exercise.difficulty", 0] }, "easy"] },
        language: 1,
        score: 1,
        mistakesCount: { $size: { $ifNull: ["$mistakes", []] } },
        status: 1,
        createdAt: 1,
      },
    },
  ]);

  // ── 3. Per-student stats for "Needs Attention" detection ─────────────────────
  const studentStatsPromise = ReadingAttempt.aggregate([
    {
      $match: {
        studentId: { $in: studentObjectIds },
        score: { $ne: null },
      },
    },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$studentId",
        averageScore: { $avg: "$score" },
        totalAttempts: { $sum: 1 },
        latestScore: { $last: "$score" },
        latestAttemptDate: { $last: "$createdAt" },
      },
    },
  ]);

  // ── 4. Score Distribution Facet ─────────────────────────────────────────────
  const distributionPromise = ReadingAttempt.aggregate([
    {
      $match: {
        studentId: { $in: studentObjectIds },
        score: { $ne: null },
      },
    },
    {
      $facet: {
        below60: [{ $match: { score: { $lt: 60 } } }, { $count: "count" }],
        between60And74: [{ $match: { score: { $gte: 60, $lt: 75 } } }, { $count: "count" }],
        between75And89: [{ $match: { score: { $gte: 75, $lt: 90 } } }, { $count: "count" }],
        above90: [{ $match: { score: { $gte: 90 } } }, { $count: "count" }],
      },
    },
  ]);

  // ── 5. Language Breakdown ───────────────────────────────────────────────────
  const languagePromise = ReadingAttempt.aggregate([
    {
      $match: {
        studentId: { $in: studentObjectIds },
        score: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$language",
        averageScore: { $avg: "$score" },
        totalAttempts: { $sum: 1 },
      },
    },
    { $sort: { totalAttempts: -1 } },
    {
      $project: {
        _id: 0,
        language: "$_id",
        averageScore: { $round: ["$averageScore", 1] },
        totalAttempts: 1,
      },
    },
  ]);

  // ── 6. Fetch Student User Details to cross-reference ────────────────────────
  const studentsPromise = User.find({
    _id: { $in: studentObjectIds },
  }).select("name email currentLevel preferredLanguage status");

  const [
    overviewResult,
    recentAttempts,
    studentStats,
    distributionResult,
    languageBreakdown,
    studentsList,
  ] = await Promise.all([
    overviewPromise,
    recentAttemptsPromise,
    studentStatsPromise,
    distributionPromise,
    languagePromise,
    studentsPromise,
  ]);

  const overview = overviewResult[0] || {
    averageScore: 0,
    totalAttempts: 0,
    highestScore: 0,
    lowestScore: 0,
  };

  // Map student stats by id string
  const statsMap = new Map();
  studentStats.forEach((stat) => {
    statsMap.set(String(stat._id), stat);
  });

  // Determine which students need attention
  const studentsNeedingAttention = [];
  studentsList.forEach((student) => {
    const stat = statsMap.get(String(student._id));
    if (!stat || stat.totalAttempts === 0) {
      studentsNeedingAttention.push({
        studentId: student._id,
        name: student.name,
        email: student.email,
        currentLevel: student.currentLevel,
        averageScore: null,
        latestScore: null,
        totalAttempts: 0,
        reason: "No reading attempts completed yet",
      });
    } else {
      const avg = Math.round(stat.averageScore * 10) / 10;
      const latest = stat.latestScore;
      let reasons = [];

      if (avg < 75) reasons.push(`Class average below threshold (${avg}%)`);
      if (latest < 70) reasons.push(`Recent attempt struggling (${latest}%)`);

      if (reasons.length > 0) {
        studentsNeedingAttention.push({
          studentId: student._id,
          name: student.name,
          email: student.email,
          currentLevel: student.currentLevel,
          averageScore: avg,
          latestScore: latest,
          totalAttempts: stat.totalAttempts,
          latestAttemptDate: stat.latestAttemptDate,
          reason: reasons.join(", "),
        });
      }
    }
  });

  // Sort students needing attention by averageScore ascending (nulls/lowest first)
  studentsNeedingAttention.sort((a, b) => {
    if (a.averageScore === null) return -1;
    if (b.averageScore === null) return 1;
    return a.averageScore - b.averageScore;
  });

  // Format score distribution
  const facetData = distributionResult[0] || {};
  const scoreDistribution = {
    below60: facetData.below60?.[0]?.count || 0,
    between60And74: facetData.between60And74?.[0]?.count || 0,
    between75And89: facetData.between75And89?.[0]?.count || 0,
    above90: facetData.above90?.[0]?.count || 0,
  };

  return {
    totalStudents: studentIds.length,
    totalAttempts: overview.totalAttempts,
    classAverageScore: overview.totalAttempts > 0 ? Math.round(overview.averageScore * 10) / 10 : 0,
    highestScore: overview.highestScore || 0,
    lowestScore: overview.lowestScore || 0,
    recentAttempts,
    studentsNeedingAttention,
    scoreDistribution,
    languageBreakdown,
  };
};

/**
 * Detailed student performance tracking for Teacher and Student Views.
 *
 * Computes:
 * - Chronological score history array (75 → 78 → 80 → 82)
 * - Absolute score change (+7) & relative improvement percentage (+9.3%)
 * - Trend evaluation ("improving", "declining", "stable")
 * - Weak vocabulary frequency aggregation unwound from mistakes
 * - Active improvement plans
 *
 * @param {string|mongoose.Types.ObjectId} studentId 
 * @returns {Promise<Object>}
 */
const getStudentPerformanceData = async (studentId) => {
  const studentObjectId = toObjectId(studentId);

  // Student Profile
  const student = await User.findById(studentObjectId).select(
    "name email preferredLanguage currentLevel assignedTeacher createdAt"
  );
  if (!student) return null;

  // ── 1. Chronological Attempt History Pipeline ──────────────────────────────
  const attempts = await ReadingAttempt.aggregate([
    {
      $match: {
        studentId: studentObjectId,
        score: { $ne: null },
      },
    },
    { $sort: { createdAt: 1 } },
    {
      $lookup: {
        from: "exercises",
        localField: "exerciseId",
        foreignField: "_id",
        as: "exercise",
      },
    },
    {
      $project: {
        attemptId: "$_id",
        exerciseId: 1,
        exerciseTitle: { $ifNull: [{ $arrayElemAt: ["$exercise.title", 0] }, "Reading Exercise"] },
        difficulty: { $ifNull: [{ $arrayElemAt: ["$exercise.difficulty", 0] }, "easy"] },
        language: 1,
        score: 1,
        mistakes: { $ifNull: ["$mistakes", []] },
        feedback: 1,
        createdAt: 1,
      },
    },
  ]);

  // Extract score history (e.g., [75, 78, 80, 82])
  const scores = attempts.map((a) => a.score);
  const scoreProgressionString = scores.length > 0 ? scores.join(" → ") : "No scores recorded";

  // Calculate improvement metrics
  let initialScore = null;
  let currentScore = null;
  let scoreDifference = 0;
  let improvementPercentage = 0;
  let trend = "insufficient_data";
  let averageScore = 0;
  let highestScore = 0;
  let lowestScore = 0;

  if (scores.length > 0) {
    initialScore = scores[0];
    currentScore = scores[scores.length - 1];
    scoreDifference = currentScore - initialScore;
    highestScore = Math.max(...scores);
    lowestScore = Math.min(...scores);
    const sum = scores.reduce((acc, val) => acc + val, 0);
    averageScore = Math.round((sum / scores.length) * 10) / 10;

    if (scores.length === 1) {
      trend = "baseline_established";
      improvementPercentage = 0;
    } else {
      improvementPercentage =
        initialScore > 0
          ? Math.round(((currentScore - initialScore) / initialScore) * 100 * 10) / 10
          : 0;

      if (scoreDifference > 0) trend = "improving";
      else if (scoreDifference < 0) trend = "declining";
      else trend = "stable";
    }
  }

  // ── 2. Weak Vocabulary Aggregation Pipeline ────────────────────────────────
  // Unwinds mistakes, groups by lowercased word, counts occurrences
  const weakVocabularyResult = await ReadingAttempt.aggregate([
    {
      $match: {
        studentId: studentObjectId,
        mistakes: { $exists: true, $type: "array", $ne: [] },
      },
    },
    { $unwind: "$mistakes" },
    {
      $project: {
        cleanWord: {
          $trim: {
            input: { $toLower: "$mistakes" },
          },
        },
      },
    },
    {
      $match: {
        cleanWord: { $ne: "" },
      },
    },
    {
      $group: {
        _id: "$cleanWord",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 15 },
    {
      $project: {
        _id: 0,
        word: "$_id",
        frequency: "$count",
      },
    },
  ]);

  const weakVocabularyWords = weakVocabularyResult.map((v) => v.word);

  // ── 3. Active Improvement Plans ────────────────────────────────────────────
  const activePlans = await ImprovementPlan.find({
    studentId: studentObjectId,
    status: "active",
  })
    .populate("readingAttemptId", "score expectedText recognizedText mistakes createdAt")
    .sort({ createdAt: -1 });

  return {
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
      preferredLanguage: student.preferredLanguage,
      currentLevel: student.currentLevel,
    },
    scoreHistory: {
      scores,
      progression: scoreProgressionString,
      attempts,
    },
    improvement: {
      initialScore,
      currentScore,
      scoreDifference: scoreDifference > 0 ? `+${scoreDifference}` : `${scoreDifference}`,
      improvementPercentage:
        improvementPercentage > 0
          ? `+${improvementPercentage}%`
          : `${improvementPercentage}%`,
      trend,
      averageScore,
      highestScore,
      lowestScore,
      totalAttempts: attempts.length,
    },
    weakVocabulary: weakVocabularyWords,
    weakVocabularyDetailed: weakVocabularyResult,
    activeImprovementPlans: activePlans,
  };
};

/**
 * Returns student progress history for the student progress flow.
 *
 * @param {string|mongoose.Types.ObjectId} studentId 
 * @returns {Promise<Object>}
 */
const getStudentProgressHistory = async (studentId) => {
  return getStudentPerformanceData(studentId);
};

/**
 * Platform-wide analytics placeholder for Admin (maintained for compatibility)
 */
const getAdminDashboardData = async () => {
  const [totalStudents, totalTeachers, totalAttempts, avgResult] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    ReadingAttempt.countDocuments(),
    ReadingAttempt.aggregate([
      { $match: { score: { $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalReadingAttempts: totalAttempts,
    averagePlatformScore:
      avgResult[0]?.avgScore ? Math.round(avgResult[0].avgScore * 10) / 10 : 0,
    activeLanguages: 0,
    studentsNeedingAttentionCount: 0,
    recentActivity: [],
  };
};

module.exports = {
  getTeacherDashboardData,
  getStudentPerformanceData,
  getStudentProgressHistory,
  getAdminDashboardData,
};

require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
const User = require("./models/User");
const Exercise = require("./models/Exercise");
const ReadingAttempt = require("./models/ReadingAttempt");
const ImprovementPlan = require("./models/ImprovementPlan");
const generateToken = require("./utils/generateToken");

// Build an isolated test database URI to guarantee platform/dev data in 'vopa' is NEVER touched
let TEST_DB_URI = process.env.TEST_MONGO_URI;
if (!TEST_DB_URI && process.env.MONGO_URI) {
  TEST_DB_URI = process.env.MONGO_URI.replace(/\/vopa(\?|$)/, "/vopa_test_teacher_analytics$1");
}
if (!TEST_DB_URI) {
  TEST_DB_URI = "mongodb://localhost:27017/vopa_test_teacher_analytics";
}

// Safety check: Never allow running against the production/development database named "vopa"
if (TEST_DB_URI.includes("/vopa?") || TEST_DB_URI.endsWith("/vopa")) {
  throw new Error("CRITICAL SAFETY ERROR: Cannot run test suite against the main 'vopa' database!");
}

let server;
let baseUrl;

const startServer = () => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
};

async function runTests() {
  console.log("=== STARTING TEACHER DASHBOARD & ANALYTICS TESTS ===");

  await mongoose.connect(TEST_DB_URI);
  console.log("Connected to test database");

  // Clean collections
  await Promise.all([
    User.deleteMany({}),
    Exercise.deleteMany({}),
    ReadingAttempt.deleteMany({}),
    ImprovementPlan.deleteMany({}),
  ]);

  await startServer();
  console.log(`Test server running at ${baseUrl}`);

  try {
    // ── 1. Create Users ───────────────────────────────────────────────────────
    // Teacher
    const teacher = await User.create({
      name: "Mrs. Sharma",
      email: "sharma@teacher.vopa",
      passwordHash: "password123",
      role: "teacher",
    });

    // Students
    const rahul = await User.create({
      name: "Rahul",
      email: "rahul@student.vopa",
      passwordHash: "password123",
      role: "student",
      preferredLanguage: "Hindi",
      currentLevel: "intermediate",
      assignedTeacher: teacher._id,
    });

    const priya = await User.create({
      name: "Priya",
      email: "priya@student.vopa",
      passwordHash: "password123",
      role: "student",
      preferredLanguage: "English",
      currentLevel: "advanced",
      assignedTeacher: teacher._id,
    });

    const arjun = await User.create({
      name: "Arjun",
      email: "arjun@student.vopa",
      passwordHash: "password123",
      role: "student",
      preferredLanguage: "Hindi",
      currentLevel: "beginner",
      assignedTeacher: teacher._id,
    });

    // Unassigned student (different class / teacher)
    const sneha = await User.create({
      name: "Sneha",
      email: "sneha@student.vopa",
      passwordHash: "password123",
      role: "student",
      preferredLanguage: "English",
      assignedTeacher: new mongoose.Types.ObjectId(), // Other teacher
    });

    // Link assignedStudents to teacher document as well
    teacher.assignedStudents = [rahul._id, priya._id, arjun._id];
    await teacher.save();

    console.log("Created users: Teacher and 4 students (3 assigned, 1 unassigned)");

    // ── 2. Create Exercises ───────────────────────────────────────────────────
    const exHindiEasy = await Exercise.create({
      title: "Hindi Bal Geet",
      text: "एक छोटा सा बच्चा था।",
      language: "Hindi",
      difficulty: "easy",
      category: "stories",
      status: "active",
    });

    const exHindiMedium = await Exercise.create({
      title: "Hindi Kahani",
      text: "जंगल में एक शेर रहता था। वह बहुत शक्तिशाली था।",
      language: "Hindi",
      difficulty: "medium",
      category: "animals",
      status: "active",
    });

    const exEnglishEasy = await Exercise.create({
      title: "Playing Football",
      text: "The boy is playing football in the garden.",
      language: "English",
      difficulty: "easy",
      category: "sports",
      status: "active",
    });

    const exEnglishMedium = await Exercise.create({
      title: "Morning Sun",
      text: "The sun rises in the east and shines brightly.",
      language: "English",
      difficulty: "medium",
      category: "nature",
      status: "active",
    });

    console.log("Created 4 sample exercises across languages and difficulty levels");

    // ── 3. Create Reading Attempts ───────────────────────────────────────────
    // Rahul's score progression: 75 -> 78 -> 80 -> 82 (as specified in requirements!)
    const rahulDate1 = new Date(Date.now() - 4 * 86400000);
    const rahulDate2 = new Date(Date.now() - 3 * 86400000);
    const rahulDate3 = new Date(Date.now() - 2 * 86400000);
    const rahulDate4 = new Date(Date.now() - 1 * 86400000);

    const att1 = await ReadingAttempt.create({
      studentId: rahul._id,
      exerciseId: exEnglishEasy._id,
      language: "English",
      expectedText: "The boy is playing football in the garden.",
      recognizedText: "The boy is football in garden.",
      score: 75,
      mistakes: ["playing", "football"],
      status: "completed",
      createdAt: rahulDate1,
    });

    const att2 = await ReadingAttempt.create({
      studentId: rahul._id,
      exerciseId: exEnglishEasy._id,
      language: "English",
      expectedText: "The boy is playing football in the garden.",
      recognizedText: "The boy is playing in the garden.",
      score: 78,
      mistakes: ["football"],
      status: "completed",
      createdAt: rahulDate2,
    });

    const att3 = await ReadingAttempt.create({
      studentId: rahul._id,
      exerciseId: exEnglishEasy._id,
      language: "English",
      expectedText: "The boy is playing football in the garden.",
      recognizedText: "The boy playing football garden.",
      score: 80,
      mistakes: ["is", "football"],
      status: "completed",
      createdAt: rahulDate3,
    });

    const att4 = await ReadingAttempt.create({
      studentId: rahul._id,
      exerciseId: exEnglishEasy._id,
      language: "English",
      expectedText: "The boy is playing football in the garden.",
      recognizedText: "The boy is playing football garden.",
      score: 82,
      mistakes: ["in"],
      status: "completed",
      createdAt: rahulDate4,
    });

    // Active Improvement Plan for Rahul
    await ImprovementPlan.create({
      studentId: rahul._id,
      readingAttemptId: att4._id,
      weakAreas: ["difficult vocabulary", "pronunciation"],
      recommendations: ["Practice 'football' 3 times", "Read aloud daily"],
      difficulty: "medium",
      status: "active",
    });

    // Priya's attempts (high performer: 91, 95)
    await ReadingAttempt.create({
      studentId: priya._id,
      exerciseId: exEnglishMedium._id,
      language: "English",
      expectedText: "The sun rises in the east and shines brightly.",
      recognizedText: "The sun rises in east shines brightly.",
      score: 91,
      mistakes: ["the"],
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 86400000),
    });

    await ReadingAttempt.create({
      studentId: priya._id,
      exerciseId: exEnglishMedium._id,
      language: "English",
      expectedText: "The sun rises in the east and shines brightly.",
      recognizedText: "The sun rises in the east and shines brightly.",
      score: 95,
      mistakes: [],
      status: "completed",
      createdAt: new Date(),
    });

    // Arjun's attempts (struggling performer: 65, 68 - needing attention!)
    await ReadingAttempt.create({
      studentId: arjun._id,
      exerciseId: exHindiEasy._id,
      language: "Hindi",
      expectedText: "एक छोटा सा बच्चा था।",
      recognizedText: "एक बच्चा था।",
      score: 65,
      mistakes: ["छोटा", "सा"],
      status: "completed",
      createdAt: new Date(Date.now() - 3 * 86400000),
    });

    await ReadingAttempt.create({
      studentId: arjun._id,
      exerciseId: exHindiEasy._id,
      language: "Hindi",
      expectedText: "एक छोटा सा बच्चा था।",
      recognizedText: "एक छोटा बच्चा था।",
      score: 68,
      mistakes: ["सा"],
      status: "completed",
      createdAt: new Date(),
    });

    console.log("Seeded reading attempts and improvement plans");

    // Generate JWT Tokens
    const teacherToken = generateToken({ id: teacher._id, role: "teacher" });
    const rahulToken = generateToken({ id: rahul._id, role: "student" });
    const priyaToken = generateToken({ id: priya._id, role: "student" });

    // ── TEST 1: GET /api/teacher/dashboard ────────────────────────────────────
    console.log("\n--- TEST 1: GET /api/teacher/dashboard ---");
    const dashRes = await fetch(`${baseUrl}/api/teacher/dashboard`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const dashData = await dashRes.json();
    console.log("Status:", dashRes.status);
    console.log("Dashboard Summary:", {
      totalStudents: dashData.data.totalStudents,
      classAverageScore: dashData.data.classAverageScore,
      totalAttempts: dashData.data.totalAttempts,
      recentAttemptsCount: dashData.data.recentAttempts.length,
      needingAttentionCount: dashData.data.studentsNeedingAttention.length,
      needingAttentionNames: dashData.data.studentsNeedingAttention.map((s) => s.name),
    });

    if (dashRes.status !== 200 || !dashData.success) throw new Error("Dashboard failed");
    if (dashData.data.totalStudents !== 3) throw new Error(`Expected 3 total students, got ${dashData.data.totalStudents}`);
    if (dashData.data.studentsNeedingAttention.length !== 1 || dashData.data.studentsNeedingAttention[0].name !== "Arjun") {
      throw new Error("Students needing attention did not properly identify Arjun");
    }
    console.log("PASS: Teacher Dashboard overview metrics verified!");

    // ── TEST 2: GET /api/teacher/students/:id (Rahul's Detailed Performance) ─
    console.log("\n--- TEST 2: GET /api/teacher/students/:id (Rahul) ---");
    const rahulPerfRes = await fetch(`${baseUrl}/api/teacher/students/${rahul._id}`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const rahulPerf = await rahulPerfRes.json();
    console.log("Status:", rahulPerfRes.status);
    console.log("Score History Progression:", rahulPerf.data.scoreHistory.progression);
    console.log("Scores Array:", rahulPerf.data.scoreHistory.scores);
    console.log("Improvement Details:", rahulPerf.data.improvement);
    console.log("Weak Vocabulary Aggregation:", rahulPerf.data.weakVocabularyDetailed);
    console.log("Active Plans Count:", rahulPerf.data.activeImprovementPlans.length);

    if (rahulPerfRes.status !== 200 || !rahulPerf.success) throw new Error("Student performance failed");
    const expectedScores = [75, 78, 80, 82];
    if (JSON.stringify(rahulPerf.data.scoreHistory.scores) !== JSON.stringify(expectedScores)) {
      throw new Error(`Expected scores ${expectedScores}, got ${JSON.stringify(rahulPerf.data.scoreHistory.scores)}`);
    }
    if (rahulPerf.data.scoreHistory.progression !== "75 → 78 → 80 → 82") {
      throw new Error(`Progression string mismatch: ${rahulPerf.data.scoreHistory.progression}`);
    }
    if (rahulPerf.data.improvement.scoreDifference !== "+7") {
      throw new Error(`Expected +7 scoreDifference, got ${rahulPerf.data.improvement.scoreDifference}`);
    }
    if (!rahulPerf.data.weakVocabulary.includes("football")) {
      throw new Error("Weak vocabulary should include 'football'");
    }
    const footballEntry = rahulPerf.data.weakVocabularyDetailed.find((v) => v.word === "football");
    if (!footballEntry || footballEntry.frequency !== 3) {
      throw new Error(`Expected 'football' frequency 3, got ${footballEntry?.frequency}`);
    }
    console.log("PASS: Detailed student performance 75 → 78 → 80 → 82 & weak vocabulary verified!");

    // ── TEST 3: Security - Teacher accessing unassigned student ───────────────
    console.log("\n--- TEST 3: Teacher accessing unassigned student (Sneha) ---");
    const unauthRes = await fetch(`${baseUrl}/api/teacher/students/${sneha._id}`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const unauthData = await unauthRes.json();
    console.log("Status (expected 403):", unauthRes.status, unauthData.message);
    if (unauthRes.status !== 403) throw new Error("Teacher should not access unassigned student");
    console.log("PASS: Teacher unauthorized student access correctly rejected with 403!");

    // ── TEST 4: GET /api/exercises?language=Hindi&difficulty=easy ─────────────
    console.log("\n--- TEST 4: Exercise filtering (Hindi & easy) ---");
    const exRes = await fetch(`${baseUrl}/api/exercises?language=Hindi&difficulty=easy`, {
      headers: { Authorization: `Bearer ${rahulToken}` },
    });
    const exData = await exRes.json();
    console.log("Status:", exRes.status);
    console.log("Filtered exercises count:", exData.data.exercises.length);
    console.log("Exercise Titles:", exData.data.exercises.map((e) => `${e.title} (${e.language}, ${e.difficulty})`));

    if (exRes.status !== 200 || !exData.success) throw new Error("Exercise retrieval failed");
    if (exData.data.exercises.length !== 1 || exData.data.exercises[0].title !== "Hindi Bal Geet") {
      throw new Error("Language and difficulty filtering failed");
    }
    console.log("PASS: Exercise filtering by language & difficulty verified!");

    // ── TEST 5: GET /api/students/:id/progress (Rahul viewing self) ───────────
    console.log("\n--- TEST 5: Student Progress (Rahul viewing own progress) ---");
    const progRes = await fetch(`${baseUrl}/api/students/${rahul._id}/progress`, {
      headers: { Authorization: `Bearer ${rahulToken}` },
    });
    const progData = await progRes.json();
    console.log("Status:", progRes.status);
    console.log("Student Progress:", {
      name: progData.data.student.name,
      totalAttempts: progData.data.improvement.totalAttempts,
      scores: progData.data.scoreHistory.scores,
      activePlans: progData.data.activeImprovementPlans.length,
    });

    if (progRes.status !== 200 || !progData.success) throw new Error("Self progress failed");
    if (progData.data.improvement.totalAttempts !== 4) throw new Error("Expected 4 attempts for Rahul");
    console.log("PASS: Student self progress retrieval verified!");

    // ── TEST 6: Student Isolation (Rahul trying to view Priya's progress) ─────
    console.log("\n--- TEST 6: Student Isolation (Rahul viewing Priya's progress) ---");
    const breachRes = await fetch(`${baseUrl}/api/students/${priya._id}/progress`, {
      headers: { Authorization: `Bearer ${rahulToken}` },
    });
    const breachData = await breachRes.json();
    console.log("Status (expected 403):", breachRes.status, breachData.message);
    if (breachRes.status !== 403) throw new Error("Student should not access other student's progress");
    console.log("PASS: Student isolation verified (403 Forbidden)!");

    // ── TEST 7: Teacher viewing assigned student's progress ───────────────────
    console.log("\n--- TEST 7: Teacher viewing assigned student progress ---");
    const teacherStudentProgRes = await fetch(`${baseUrl}/api/students/${rahul._id}/progress`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const teacherStudentProg = await teacherStudentProgRes.json();
    console.log("Status:", teacherStudentProgRes.status);
    if (teacherStudentProgRes.status !== 200 || !teacherStudentProg.success) {
      throw new Error("Teacher should be able to view assigned student progress");
    }
    console.log("PASS: Teacher access to assigned student progress verified!");

    console.log("\n==========================================");
    console.log("ALL 7 VERIFICATION TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================\n");
  } finally {
    await stopServer();
    try {
      if (TEST_DB_URI.includes("vopa_test_teacher_analytics")) {
        await mongoose.connection.dropDatabase();
        console.log("Cleaned up isolated test database.");
      }
    } catch (e) {
      // drop error ignored
    }
    await mongoose.connection.close();
  }
}

runTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});

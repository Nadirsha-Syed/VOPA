/**
 * Automated Verification Script for Admin Management Module
 * Run with: node tests/testAdmin.js
 */
require("dotenv").config();
const http = require("http");
const app = require("../app");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const User = require("../models/User");
const Exercise = require("../models/Exercise");
const Language = require("../models/Language");

const runAdminTests = async () => {
  console.log("==================================================");
  console.log("     VOPA Admin Management Verification Test      ");
  console.log("==================================================\n");

  await connectDB();

  // Start test server on ephemeral port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running on ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = "") => {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ""}`);
      failed++;
    }
  };

  try {
    let adminToken = "";
    let studentToken = "";

    // ─────────────────────────────────────────────────────────────
    // SETUP: Authenticate as Admin and Student
    // ─────────────────────────────────────────────────────────────
    console.log("1. Authenticating Admin & Student for Tests...");
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@vopa.org", password: "Admin@123456" }),
    });
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.data?.token;
    assert(!!adminToken, "Admin token obtained successfully");

    const studentLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student@vopa.org", password: "Student@123456" }),
    });
    const studentLoginData = await studentLoginRes.json();
    studentToken = studentLoginData.data?.token;
    assert(!!studentToken, "Student token obtained successfully");

    // ─────────────────────────────────────────────────────────────
    // TEST: Security - Student Access to Admin Routes Blocked
    // ─────────────────────────────────────────────────────────────
    console.log("\n2. Testing RBAC Security on Admin Endpoints...");
    const studentBlockedRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(
      studentBlockedRes.status === 403,
      "Student blocked from GET /api/admin/users with HTTP 403 Forbidden"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST: Admin Dashboard Platform Metrics
    // ─────────────────────────────────────────────────────────────
    console.log("\n3. Testing Admin Dashboard Metrics...");
    const dashRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const dashData = await dashRes.json();
    assert(
      dashRes.status === 200 &&
        dashData.data.stats.totalStudents >= 1 &&
        dashData.data.stats.totalTeachers >= 1 &&
        dashData.data.activeLanguages.length >= 1,
      "GET /api/admin/dashboard returns comprehensive platform analytics"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST: User Management (CRUD & Assignment)
    // ─────────────────────────────────────────────────────────────
    console.log("\n4. Testing Admin User Management...");
    const testTeacherEmail = `temp.teacher.${Date.now()}@vopa.test`;

    // A. Create User via Admin
    const createUserRes = await fetch(`${baseUrl}/api/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Temporary Teacher",
        email: testTeacherEmail,
        password: "TeacherPassword@123",
        role: "teacher",
        preferredLanguage: "English",
      }),
    });
    const createUserData = await createUserRes.json();
    const createdTeacherId = createUserData.data?.user?._id;
    assert(
      createUserRes.status === 201 && createdTeacherId,
      "POST /api/admin/users creates a new Teacher account"
    );

    // B. Get Users List with Pagination
    const listUsersRes = await fetch(`${baseUrl}/api/admin/users?role=teacher`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listUsersData = await listUsersRes.json();
    assert(
      listUsersRes.status === 200 && listUsersData.data.users.length >= 1,
      "GET /api/admin/users with role=teacher returns filtered users"
    );

    // C. Get Single User
    const getSingleRes = await fetch(`${baseUrl}/api/admin/users/${createdTeacherId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      getSingleRes.status === 200,
      "GET /api/admin/users/:id fetches individual user profile"
    );

    // D. Update User
    const updateUserRes = await fetch(`${baseUrl}/api/admin/users/${createdTeacherId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name: "Updated Teacher Name" }),
    });
    const updateUserData = await updateUserRes.json();
    assert(
      updateUserRes.status === 200 && updateUserData.data.user.name === "Updated Teacher Name",
      "PUT /api/admin/users/:id successfully updates user attributes"
    );

    // E. Assign Student to Teacher
    const defaultStudent = await User.findOne({ email: "student@vopa.org" });
    const assignRes = await fetch(`${baseUrl}/api/admin/assign-student`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        studentId: defaultStudent._id,
        teacherId: createdTeacherId,
      }),
    });
    const assignData = await assignRes.json();
    assert(
      assignRes.status === 200 && assignData.success,
      "PUT /api/admin/assign-student successfully assigns student to teacher"
    );

    // F. Deactivate User (Soft-delete)
    const deactRes = await fetch(`${baseUrl}/api/admin/users/${createdTeacherId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const deactData = await deactRes.json();
    assert(
      deactRes.status === 200 && deactData.data.user.status === "inactive",
      "DELETE /api/admin/users/:id soft-deactivates user"
    );

    // G. Single-Admin Policy Enforcements
    const tryCreateAdminRes = await fetch(`${baseUrl}/api/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Second Admin",
        email: "secondadmin@vopa.test",
        password: "Admin@123456",
        role: "admin",
      }),
    });
    assert(
      tryCreateAdminRes.status === 400,
      "POST /api/admin/users blocks creating additional admin accounts (Single-Admin Policy)"
    );

    const adminUser = await User.findOne({ role: "admin" });
    const tryDeleteAdminRes = await fetch(`${baseUrl}/api/admin/users/${adminUser._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      tryDeleteAdminRes.status === 400,
      "DELETE /api/admin/users blocks deleting or deactivating the platform administrator"
    );

    const tryDemoteAdminRes = await fetch(`${baseUrl}/api/admin/users/${adminUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ role: "teacher" }),
    });
    assert(
      tryDemoteAdminRes.status === 400,
      "PUT /api/admin/users blocks changing role of the platform administrator"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST: Exercise Management (CRUD)
    // ─────────────────────────────────────────────────────────────
    console.log("\n5. Testing Admin Exercise Management...");
    // A. Create Exercise
    const createExRes = await fetch(`${baseUrl}/api/admin/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Test Reading Story",
        text: "The quick brown fox jumps over the lazy dog.",
        language: "English",
        difficulty: "medium",
        category: "animals",
      }),
    });
    const createExData = await createExRes.json();
    const createdExId = createExData.data?.exercise?._id;
    assert(
      createExRes.status === 201 && createdExId,
      "POST /api/admin/exercises creates a new reading exercise"
    );

    // B. List Exercises
    const listExRes = await fetch(`${baseUrl}/api/admin/exercises?difficulty=medium`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      listExRes.status === 200,
      "GET /api/admin/exercises returns exercise bank with filters"
    );

    // C. Update Exercise
    const updateExRes = await fetch(`${baseUrl}/api/admin/exercises/${createdExId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ difficulty: "hard" }),
    });
    const updateExData = await updateExRes.json();
    assert(
      updateExRes.status === 200 && updateExData.data.exercise.difficulty === "hard",
      "PUT /api/admin/exercises/:id updates exercise parameters"
    );

    // D. Permanent Delete Exercise
    const delExRes = await fetch(`${baseUrl}/api/admin/exercises/${createdExId}?permanent=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      delExRes.status === 200,
      "DELETE /api/admin/exercises/:id deletes the exercise"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST: Language Management
    // ─────────────────────────────────────────────────────────────
    console.log("\n6. Testing Admin Language Management...");
    // A. List Languages
    const listLangRes = await fetch(`${baseUrl}/api/admin/languages`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listLangData = await listLangRes.json();
    assert(
      listLangRes.status === 200 && listLangData.data.languages.length >= 3,
      "GET /api/admin/languages returns all supported platform languages"
    );

    // B. Create Language
    const createLangRes = await fetch(`${baseUrl}/api/admin/languages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: "Kannada",
        code: "KN",
        enabled: true,
        speechConfiguration: { locale: "kn-IN" },
      }),
    });
    const createLangData = await createLangRes.json();
    const createdLangId = createLangData.data?.language?._id;
    assert(
      createLangRes.status === 201 && createdLangId,
      "POST /api/admin/languages adds a new supported language"
    );

    // C. Toggle Language Enabled/Disabled
    const toggleLangRes = await fetch(`${baseUrl}/api/admin/languages/${createdLangId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ enabled: false }),
    });
    const toggleLangData = await toggleLangRes.json();
    assert(
      toggleLangRes.status === 200 && toggleLangData.data.language.enabled === false,
      "PUT /api/admin/languages/:id toggles language enabled status"
    );

    // D. Delete Language
    const delLangRes = await fetch(`${baseUrl}/api/admin/languages/${createdLangId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      delLangRes.status === 200,
      "DELETE /api/admin/languages/:id deletes language"
    );

    // Cleanup created temporary teacher
    await User.findByIdAndDelete(createdTeacherId);

    console.log("\n==================================================");
    console.log(`Admin Tests Completed: ${passed} Passed, ${failed} Failed`);
    console.log("==================================================\n");

    server.close();
    await mongoose.connection.close();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test execution error:", err);
    server.close();
    await mongoose.connection.close();
    process.exit(1);
  }
};

runAdminTests();

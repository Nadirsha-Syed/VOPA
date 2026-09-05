/**
 * Automated Verification Script for Authentication & Role-Based Access Control
 * Run with: node tests/testAuth.js
 */
require("dotenv").config();
const http = require("http");
const app = require("../app");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const User = require("../models/User");

const runTests = async () => {
  console.log("==================================================");
  console.log("   VOPA Authentication & RBAC Verification Test   ");
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
    const testStudentEmail = `test.student.${Date.now()}@vopa.test`;
    let studentToken = "";
    let adminToken = "";

    // Cleanup any existing test user
    await User.deleteMany({ email: { $regex: /@vopa\.test$/ } });

    // ─────────────────────────────────────────────────────────────
    // TEST 1: Student Registration (Valid)
    // ─────────────────────────────────────────────────────────────
    console.log("1. Testing Student Registration...");
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Student",
        email: testStudentEmail,
        password: "Password@123",
        preferredLanguage: "English",
      }),
    });
    const regData = await regRes.json();
    assert(
      regRes.status === 201 && regData.success && regData.data.token,
      "Student registration succeeds with HTTP 201 and returns token"
    );
    assert(
      regData.data.user.role === "student" && !regData.data.user.passwordHash,
      "Registered user role is 'student' and passwordHash is excluded"
    );
    studentToken = regData.data?.token;

    // ─────────────────────────────────────────────────────────────
    // TEST 2: Registration Validation - Duplicate Email
    // ─────────────────────────────────────────────────────────────
    console.log("\n2. Testing Registration Validations...");
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Another Student",
        email: testStudentEmail,
        password: "Password@123",
      }),
    });
    const dupData = await dupRes.json();
    assert(
      dupRes.status === 400 && !dupData.success,
      "Duplicate email registration rejected with HTTP 400"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 3: Registration Validation - Short Password (< 6 chars)
    // ─────────────────────────────────────────────────────────────
    const shortPassRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Short Pass",
        email: "short@vopa.test",
        password: "123",
      }),
    });
    assert(
      shortPassRes.status === 400,
      "Short password (<6 chars) rejected by express-validator"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 4: Security - Self-registering as Admin Blocked
    // ─────────────────────────────────────────────────────────────
    console.log("\n3. Testing Role Tampering Protection...");
    const fakeAdminRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Hacker Admin",
        email: "fakeadmin@vopa.test",
        password: "Password@123",
        role: "admin",
      }),
    });
    assert(
      fakeAdminRes.status === 403,
      "Public registration as 'admin' blocked with HTTP 403 Forbidden"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 5: Login - Invalid Credentials
    // ─────────────────────────────────────────────────────────────
    console.log("\n4. Testing Login...");
    const wrongPassRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testStudentEmail,
        password: "WrongPassword999",
      }),
    });
    assert(
      wrongPassRes.status === 401,
      "Login with incorrect password rejected with HTTP 401 Unauthorized"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 6: Login - Valid Credentials
    // ─────────────────────────────────────────────────────────────
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testStudentEmail,
        password: "Password@123",
      }),
    });
    const loginData = await loginRes.json();
    assert(
      loginRes.status === 200 && loginData.success && loginData.data.token,
      "Student login succeeds with HTTP 200 and returns valid JWT"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 7: Login - Seeded Admin Account
    // ─────────────────────────────────────────────────────────────
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@vopa.org",
        password: "Admin@123456",
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(
      adminLoginRes.status === 200 && adminLoginData.data.user.role === "admin",
      "Admin login succeeds and confirms 'admin' role"
    );
    adminToken = adminLoginData.data?.token;

    // ─────────────────────────────────────────────────────────────
    // TEST 8: Protected Route - GET /api/auth/me with Bearer Token
    // ─────────────────────────────────────────────────────────────
    console.log("\n5. Testing Protected Routes & Token Authentication...");
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const meData = await meRes.json();
    assert(
      meRes.status === 200 && meData.data.user.email === testStudentEmail,
      "GET /api/auth/me returns current user profile with valid Bearer token"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 9: Protected Route - Deny without Token
    // ─────────────────────────────────────────────────────────────
    const noTokenRes = await fetch(`${baseUrl}/api/auth/me`);
    assert(
      noTokenRes.status === 401,
      "Access denied with HTTP 401 when no token is provided"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 10: Role-Based Authorization - RBAC Guard
    // ─────────────────────────────────────────────────────────────
    console.log("\n6. Testing Role-Based Access Control (RBAC)...");
    // Student tries to access Admin route
    const studentAccessAdminRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(
      studentAccessAdminRes.status === 403,
      "Student token accessing Admin route blocked with HTTP 403 Forbidden"
    );

    // Admin accesses Admin route
    const adminAccessAdminRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      adminAccessAdminRes.status === 200,
      "Admin token accessing Admin route permitted with HTTP 200"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 11: Password Update (PUT /api/auth/update-password)
    // ─────────────────────────────────────────────────────────────
    console.log("\n7. Testing Password Update...");
    const updatePassRes = await fetch(`${baseUrl}/api/auth/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        currentPassword: "Password@123",
        newPassword: "NewSecretPassword@456",
      }),
    });
    const updatePassData = await updatePassRes.json();
    assert(
      updatePassRes.status === 200 && updatePassData.success,
      "Password updated successfully with valid current password"
    );

    // Verify login with new password works
    const newPassLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testStudentEmail,
        password: "NewSecretPassword@456",
      }),
    });
    assert(
      newPassLogin.status === 200,
      "Login with new password succeeds with HTTP 200"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST 12: Logout (POST /api/auth/logout)
    // ─────────────────────────────────────────────────────────────
    console.log("\n8. Testing Logout...");
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
    });
    const logoutData = await logoutRes.json();
    assert(
      logoutRes.status === 200 && logoutData.success,
      "POST /api/auth/logout responds with HTTP 200"
    );

    // Cleanup test user
    await User.deleteMany({ email: { $regex: /@vopa\.test$/ } });

    console.log("\n==================================================");
    console.log(`Tests Completed: ${passed} Passed, ${failed} Failed`);
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

runTests();

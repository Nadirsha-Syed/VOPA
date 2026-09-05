require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Language = require("../models/Language");
const Exercise = require("../models/Exercise");
const connectDB = require("../config/db");

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Seeding database...");

    // 1. Seed Languages
    const defaultLanguages = [
      {
        name: "English",
        code: "EN",
        enabled: true,
        speechConfiguration: { provider: "browser/default", locale: "en-IN" },
      },
      {
        name: "Hindi",
        code: "HI",
        enabled: true,
        speechConfiguration: { provider: "browser/default", locale: "hi-IN" },
      },
      {
        name: "Tamil",
        code: "TA",
        enabled: true,
        speechConfiguration: { provider: "browser/default", locale: "ta-IN" },
      },
    ];

    for (const lang of defaultLanguages) {
      await Language.findOneAndUpdate({ code: lang.code }, lang, {
        upsert: true,
        new: true,
      });
    }
    console.log("✓ Languages seeded.");

    // 2. Seed Default Admin
    let admin = await User.findOne({ email: "admin@vopa.org" });
    if (!admin) {
      admin = await User.create({
        name: "Platform Admin",
        email: "admin@vopa.org",
        passwordHash: "Admin@123456",
        role: "admin",
        preferredLanguage: "English",
        status: "active",
      });
      console.log("✓ Default Admin created: admin@vopa.org / Admin@123456");
    } else {
      console.log("✓ Default Admin already exists.");
    }

    // 3. Seed Default Teacher
    let teacher = await User.findOne({ email: "teacher@vopa.org" });
    if (!teacher) {
      teacher = await User.create({
        name: "Ms. Sharma",
        email: "teacher@vopa.org",
        passwordHash: "Teacher@123456",
        role: "teacher",
        preferredLanguage: "English",
        status: "active",
      });
      console.log("✓ Default Teacher created: teacher@vopa.org / Teacher@123456");
    } else {
      console.log("✓ Default Teacher already exists.");
    }

    // 4. Seed Default Student
    let student = await User.findOne({ email: "student@vopa.org" });
    if (!student) {
      student = await User.create({
        name: "Rahul Kumar",
        email: "student@vopa.org",
        passwordHash: "Student@123456",
        role: "student",
        preferredLanguage: "English",
        assignedTeacher: teacher._id,
        currentLevel: "beginner",
        status: "active",
      });
      console.log("✓ Default Student created: student@vopa.org / Student@123456");
    } else {
      console.log("✓ Default Student already exists.");
    }

    // 4. Seed Starter Exercises
    const defaultExercises = [
      {
        title: "Playing Football",
        text: "The boy is playing football.",
        language: "English",
        difficulty: "easy",
        category: "sports",
        status: "active",
        createdBy: admin._id,
      },
      {
        title: "The Cat on the Mat",
        text: "The cat is sitting on the mat.",
        language: "English",
        difficulty: "easy",
        category: "animals",
        status: "active",
        createdBy: admin._id,
      },
      {
        title: "A Sunny Morning Walk",
        text: "The sun shines brightly in the clear blue sky every morning.",
        language: "English",
        difficulty: "medium",
        category: "nature",
        status: "active",
        createdBy: admin._id,
      },
      {
        title: "बिल्ली और दूध",
        text: "बिल्ली मेज़ पर बैठकर दूध पी रही है।",
        language: "Hindi",
        difficulty: "easy",
        category: "animals",
        status: "active",
        createdBy: admin._id,
      },
    ];

    for (const ex of defaultExercises) {
      await Exercise.findOneAndUpdate(
        { title: ex.title, language: ex.language },
        ex,
        { upsert: true, new: true }
      );
    }
    console.log("✓ Default Exercises seeded.");

    console.log("\nDatabase seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

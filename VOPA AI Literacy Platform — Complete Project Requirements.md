# VOPA AI Literacy Platform
## Complete Product & Technical Requirements Document

---

## 1. Project Overview

VOPA is a multilingual AI-powered reading and literacy platform designed to help children improve their reading and pronunciation skills.

The platform has three primary users:

- **Student** — reads words/sentences aloud and receives AI-based reading feedback.
- **Teacher** — monitors students, analyzes their performance, and tracks improvement.
- **Admin** — has complete control over the platform, including users, teachers, students, exercises, languages, system configuration, and overall analytics.

The system uses the **MERN stack** for the main web application and integrates AI/speech-processing services for voice analysis.

### Core Product Flow

```text
Student
   ↓
Select Language
   ↓
Reading Exercise
   ↓
Read Aloud
   ↓
Voice Recording
   ↓
AI/Speech Analysis
   ↓
Reading Score
   ↓
Mistake Detection
   ↓
Personalized Improvement Plan
   ↓
Progress Stored in Database
   ↓
Teacher Dashboard
   ↓
Admin Monitoring & Management
```

The primary objective is to create a working MVP where a student can read aloud, receive a meaningful score and improvement feedback, while the teacher can monitor the student's progress and the admin can manage and monitor the complete platform.

---

# 2. Core Features

The MVP has four major features.

## Feature 1 — AI Reading & Voice Analysis

The student is shown a reading exercise.

Example:

```text
Read this sentence:

"The boy is playing football."
```

The student clicks **Start Reading** and speaks into the microphone.

The system:

1. Records the student's voice.
2. Sends the audio to the backend.
3. Processes the audio using a speech/AI service.
4. Converts speech to text and/or analyzes pronunciation.
5. Compares the student's reading with the expected text.
6. Calculates a reading score.
7. Identifies incorrect/missed words or pronunciation problems.
8. Returns the result to the student.

Example result:

```text
Reading Score: 82%

Correct Words: 4
Mistakes: 1

Problem Area:
football

Feedback:
Practice this word again.
```

The exact AI model/service can be decided during implementation. The architecture must keep the AI service modular so that it can be replaced later.

---

# 3. Personalized Improvement Plan

The score should not be the final output.

The system should use the student's performance to generate an improvement plan.

For example:

```text
Score: 72%

Weak Areas:
- Difficult words
- "th" sound
- Reading speed

Improvement Plan:
1. Practice difficult words.
2. Repeat the sentence 3 times.
3. Practice the identified sound.
4. Complete a slightly easier reading exercise.
5. Retake the exercise.
```

The improvement plan can initially be generated using predefined rules.

Later, AI can make the plan more personalized.

### Important principle

```text
Reading Result
      ↓
Identify Weakness
      ↓
Generate Improvement Plan
      ↓
Practice
      ↓
New Reading
      ↓
Measure Improvement
```

The system should eventually be able to compare previous and current attempts.

---

# 4. Teacher Dashboard

The teacher dashboard provides an overview of students' reading performance.

### Dashboard should show:

- Total students
- Average reading score
- Students needing attention
- Recent reading attempts
- Overall class performance
- Language-wise performance
- Progress over time

Example:

```text
Teacher Dashboard

Students: 25
Average Score: 84%

Needs Attention:
5 students

Recent Activity:
Rahul       82%     Today
Priya       91%     Today
Arjun       74%     Yesterday
```

The teacher should be able to click on a student and view detailed performance.

### Student Progress

```text
Student: Rahul

Current Score: 82%

Previous Scores:
75 → 78 → 80 → 82

Weak Areas:
- Difficult vocabulary
- Pronunciation of specific sounds

Improvement:
+7% this month
```

The dashboard should focus on **actionable information**, not just display large amounts of data.

---

# 5. Multilingual Support

The application should support multiple languages.

The language should affect:

- Reading exercises
- Expected text
- Speech recognition
- Pronunciation analysis
- Student feedback
- Teacher analytics

Example:

```text
Select Language

English
Hindi
Tamil
Other supported languages
```

The architecture should make languages configurable rather than hard-coded throughout the application.

Each exercise should contain information such as:

```text
language
sentence
difficulty
category
```

The AI/speech-processing layer should receive the selected language so that the appropriate speech model/service can be used.

---

# 6. User Roles

The MVP has three roles.

## Student

Students can:

- Log in
- Select a language
- View reading exercises
- Record their voice
- Submit reading attempts
- View their score
- View mistakes
- View improvement plans
- View their own progress

Students must not be able to access other students' information.

---

## Teacher

Teachers can:

- Log in
- View assigned students
- View class statistics
- View individual student performance
- View reading attempts
- View mistakes
- View improvement plans
- Track progress over time

Teachers should only access students/classes they are authorized to view.

---

## Admin

The admin has **complete control over the platform**.

The admin can:

### User Management

- Create users
- View users
- Edit users
- Delete/deactivate users
- Manage students
- Manage teachers
- Assign students to teachers
- Manage user roles
- Reset user access when required

### Student Management

- View all students
- View individual student profiles
- View student performance
- View reading history
- View improvement plans
- Assign/reassign students to teachers
- Deactivate student accounts

### Teacher Management

- View all teachers
- Add teachers
- Edit teacher information
- Deactivate teachers
- Assign students/classes
- View teacher activity and class performance

### Exercise Management

Admin can:

- Create reading exercises
- Edit exercises
- Delete/deactivate exercises
- Set difficulty levels
- Set categories
- Assign exercises to languages
- Manage exercise content

Example:

```text
Exercise
├── Text
├── Language
├── Difficulty
├── Category
└── Status
```

### Language Management

Admin can:

- Enable/disable languages
- Add supported languages
- Manage language-specific exercises
- Configure language-related AI/speech settings

### Platform Analytics

Admin can view:

- Total students
- Total teachers
- Total reading attempts
- Average platform score
- Language usage
- Student improvement
- Most-used exercises
- Students needing attention
- Overall platform activity

### System Control

Admin can control:

- Platform settings
- AI configuration
- Exercise availability
- User access
- System-level configuration

The admin should have a dedicated **Admin Dashboard**.

### Admin Dashboard Example

```text
Admin Dashboard

Total Students: 500
Total Teachers: 35
Total Reading Attempts: 12,450

Average Score: 81%

Active Languages: 4

Students Needing Attention: 72

Recent Activity:
- New teacher added
- 20 students completed exercises
- New Hindi exercise created
```

The admin should be able to navigate from the dashboard into users, teachers, students, exercises, languages, analytics, and system settings.

---

# 7. Authentication

The application should have secure authentication.

### Basic authentication flow

```text
Login
  ↓
Backend verifies credentials
  ↓
Authentication token/session
  ↓
Frontend stores authentication state
  ↓
Protected pages become accessible
```

The backend must perform role-based authorization.

Example:

```text
/student/*
    → Student only

/teacher/*
    → Teacher only

/admin/*
    → Admin only
```

### Authentication requirements

- Registration/login
- Password validation
- Secure password hashing
- Authentication token/session
- Role-based access
- Protected API routes
- Protected frontend routes
- Logout
- Unauthorized-access handling

Passwords must **never be stored as plain text**.

Admin accounts should have stronger access restrictions because they can control the entire platform.

---

# 8. Frontend Requirements

## Technology

```text
React
JavaScript
HTML
CSS
```

Additional libraries can be used where useful.

Recommended frontend structure:

```text
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   └── assets/
│
└── package.json
```

## Main Pages

### 1. Login Page

Allows students, teachers, and admins to authenticate.

### 2. Student Reading Page

Contains:

- Language selection
- Reading exercise
- Sentence/word display
- Start recording
- Stop recording
- Submit
- Reading result

### 3. Student Result Page

Displays:

- Score
- Correct/incorrect words
- Identified weaknesses
- Feedback
- Improvement plan
- Option to practice again

### 4. Teacher Dashboard

Displays:

- Student list
- Average performance
- Recent attempts
- Students requiring attention
- Charts/analytics

### 5. Student Progress Page

Displays detailed historical performance for a selected student.

### 6. Admin Dashboard

Displays:

- Platform statistics
- Student count
- Teacher count
- Reading attempts
- Average platform performance
- Language usage
- System activity

### 7. Admin User Management

Allows admin to:

- View users
- Create users
- Edit users
- Deactivate users
- Assign roles
- Manage students and teachers

### 8. Admin Exercise Management

Allows admin to:

- Create exercises
- Edit exercises
- Delete/deactivate exercises
- Set difficulty
- Set language
- Set categories

### 9. Admin Language Management

Allows admin to:

- View supported languages
- Enable/disable languages
- Manage language-specific content

---

# 9. Backend Requirements

## Technology

```text
Node.js
Express.js
MongoDB
Mongoose
```

The backend is responsible for:

- Authentication
- Authorization
- User management
- Exercise management
- Audio upload/handling
- AI service communication
- Reading-score calculation
- Improvement-plan generation
- Saving results
- Progress retrieval
- Teacher analytics
- Admin management
- Platform analytics

Recommended structure:

```text
backend/
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── services/
├── utils/
├── config/
└── server.js
```

### Backend architecture

```text
React Frontend
      ↓
Express API
      ↓
Controllers
      ↓
Services
      ├── Authentication Service
      ├── Speech/AI Service
      ├── Reading Analysis Service
      ├── Improvement Plan Service
      ├── User Management Service
      └── Analytics Service
      ↓
MongoDB
```

---

# 10. API Requirements

The exact API names can change, but the system should follow a REST API architecture.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Exercises

```text
GET  /api/exercises
GET  /api/exercises/:id
POST /api/exercises
PUT  /api/exercises/:id
DELETE /api/exercises/:id
```

Teacher/admin authorization should be required for exercise creation or modification according to the final permission model.

### Reading

```text
POST /api/readings/submit
GET  /api/readings/:id
GET  /api/students/:id/readings
```

### Progress

```text
GET /api/students/:id/progress
```

### Teacher analytics

```text
GET /api/teacher/dashboard
GET /api/teacher/students
GET /api/teacher/students/:id
```

### Admin

```text
GET    /api/admin/dashboard
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

GET    /api/admin/teachers
GET    /api/admin/students

GET    /api/admin/exercises
POST   /api/admin/exercises
PUT    /api/admin/exercises/:id
DELETE /api/admin/exercises/:id

GET    /api/admin/languages
POST   /api/admin/languages
PUT    /api/admin/languages/:id
DELETE /api/admin/languages/:id
```

All `/admin/*` APIs must be protected by authentication and admin-role authorization.

---

# 11. Database Requirements

MongoDB will be used as the main database.

The main collections should be:

```text
users
students
teachers
exercises
readingAttempts
improvementPlans
languages
```

Some of these can be combined depending on the final schema.

---

## User Schema

```text
User
├── name
├── email
├── passwordHash
├── role
├── preferredLanguage
└── createdAt
```

Role:

```text
student
teacher
admin
```

---

## Student Information

Student-related information can either be stored in the User document or in a separate Student collection.

Possible fields:

```text
Student
├── userId
├── assignedTeacherId
├── preferredLanguage
├── currentLevel
├── status
└── createdAt
```

---

## Teacher Information

```text
Teacher
├── userId
├── assignedStudents
├── classes
├── status
└── createdAt
```

---

## Exercise Schema

```text
Exercise
├── title
├── text
├── language
├── difficulty
├── category
├── status
└── createdAt
```

Example:

```text
{
    text: "The boy is playing football.",
    language: "English",
    difficulty: "easy"
}
```

---

## Reading Attempt Schema

Each time a student reads something, create a reading attempt.

```text
ReadingAttempt
├── studentId
├── exerciseId
├── language
├── audioReference
├── expectedText
├── recognizedText
├── score
├── mistakes
├── feedback
├── pronunciationAnalysis
└── createdAt
```

Example:

```text
{
    studentId: "...",
    exerciseId: "...",
    expectedText: "...",
    recognizedText: "...",
    score: 82,
    mistakes: ["football"],
    feedback: "...",
    createdAt: "..."
}
```

---

## Improvement Plan Schema

```text
ImprovementPlan
├── studentId
├── readingAttemptId
├── weakAreas
├── recommendations
├── difficulty
├── status
└── createdAt
```

---

## Language Schema

```text
Language
├── name
├── code
├── enabled
├── speechModel/configuration
└── createdAt
```

This allows the admin to manage supported languages without changing application code every time.

---

# 12. AI System

AI should be treated as a separate service/module.

```text
Backend
   ↓
AI Service
   ↓
Speech/AI Model
   ↓
Analysis Result
   ↓
Backend
```

The rest of the application should not depend directly on a specific AI provider.

For example:

```text
services/
└── speechAnalysisService.js
```

This allows the team to replace one AI provider/model with another without rewriting the entire application.

---

# 13. AI Analysis Pipeline

The intended pipeline is:

```text
Audio
  ↓
Speech Recognition
  ↓
Transcription
  ↓
Compare with Expected Text
  ↓
Word-Level Analysis
  ↓
Score
  ↓
Identify Weak Areas
  ↓
Generate Feedback
  ↓
Generate Improvement Plan
```

Example:

```text
Expected:
"The cat is sitting on the mat."

Recognized:
"The cat is sitting on mat."

Analysis:
- Missing word: "the"
- Correct words: 7/8
- Score: 87.5%
```

For more advanced pronunciation analysis, the AI layer can additionally evaluate phoneme-level pronunciation.

---

# 14. Scoring System

The scoring system should be consistent and explainable.

The MVP can start with:

```text
Reading Score =
Correctly recognized words
-------------------------- × 100
Total expected words
```

Later, the score can incorporate:

- Word accuracy
- Pronunciation accuracy
- Missing words
- Extra words
- Reading fluency
- Speaking pace

The scoring algorithm should remain isolated in the backend so it can be improved without changing the frontend.

---

# 15. Improvement Plan Logic

The improvement plan should be based on actual performance.

Example:

```text
Score ≥ 90
→ Continue with next difficulty level

Score 75–89
→ Practice difficult words

Score 60–74
→ Repeat exercise + targeted practice

Score < 60
→ Easier exercise + additional guided practice
```

Later, AI can personalize this based on:

- Previous attempts
- Repeated mistakes
- Language
- Difficulty
- Reading history
- Individual weaknesses

The admin should be able to manage the available exercises and difficulty levels used by the improvement system.

---

# 16. Audio Handling

The frontend records audio using the browser microphone.

```text
Browser Microphone
       ↓
Audio Blob
       ↓
Backend
       ↓
Temporary/Object Storage
       ↓
AI Processing
```

The database should store an **audio reference/path**, rather than unnecessarily storing large audio files directly inside MongoDB.

For the MVP, temporary audio storage can be used if permanent audio history is not required.

---

# 17. Security Requirements

The system must:

- Hash passwords.
- Never expose password hashes to the frontend.
- Protect private APIs.
- Validate request data.
- Validate uploaded files.
- Restrict access based on user roles.
- Prevent students from viewing other students' data.
- Prevent teachers from accessing unauthorized classes.
- Prevent non-admin users from accessing admin APIs.
- Prevent teachers/students from modifying admin-controlled resources unless explicitly authorized.
- Store API keys/secrets in environment variables.
- Never expose AI/API keys in React frontend code.
- Use HTTPS in production.

Because the system involves children, privacy and data minimization should be treated as important design requirements.

---

# 18. Frontend ↔ Backend Communication

The frontend should communicate with the backend through REST APIs.

Example:

```text
Student clicks Submit
        ↓
React sends audio + exerciseId
        ↓
POST /api/readings/submit
        ↓
Backend processes audio
        ↓
AI analysis
        ↓
Score generated
        ↓
Result saved in MongoDB
        ↓
Backend returns result
        ↓
React displays result
```

For the teacher:

```text
Teacher opens Dashboard
        ↓
React requests dashboard data
        ↓
GET /api/teacher/dashboard
        ↓
Backend queries MongoDB
        ↓
Analytics calculated
        ↓
Data returned to React
        ↓
Charts displayed
```

For the admin:

```text
Admin opens Dashboard
        ↓
React requests platform analytics
        ↓
GET /api/admin/dashboard
        ↓
Backend queries users/readings/exercises
        ↓
Analytics calculated
        ↓
Admin dashboard displays platform overview
```

---

# 19. Teacher Analytics

Teacher analytics should be generated from stored reading attempts.

Useful metrics:

```text
Average Score
Highest Score
Lowest Score
Number of Attempts
Improvement %
Common Mistakes
Language Performance
Students Needing Attention
```

Charts can include:

- Score over time
- Class average
- Student comparison
- Language performance
- Mistake frequency

---

# 20. Admin Analytics

Admin analytics should provide a **platform-wide view**.

Useful metrics:

```text
Total Students
Total Teachers
Total Reading Attempts
Average Platform Score
Active Languages
Most Used Languages
Most Used Exercises
Students Needing Attention
Overall Improvement
Daily/Weekly Activity
```

Admin analytics should be different from teacher analytics:

```text
Teacher
→ Focuses on their students/classes

Admin
→ Focuses on the entire platform
```

---

# 21. MVP Scope

The team should **not** attempt to build every possible feature initially.

### Required MVP

```text
✓ Authentication
✓ Student role
✓ Teacher role
✓ Admin role
✓ Role-based authorization
✓ Language selection
✓ Reading exercises
✓ Microphone recording
✓ Speech-to-text/voice analysis
✓ Reading score
✓ Mistake detection
✓ Improvement plan
✓ Teacher dashboard
✓ Student progress
✓ Admin dashboard
✓ User management
✓ Exercise management
✓ Language management
✓ MongoDB persistence
```

### Future features

These should be considered after the core MVP works:

```text
- Gamification
- Leaderboards
- Advanced pronunciation/phoneme analysis
- AI tutor/chatbot
- Voice-based conversational practice
- Parent dashboard
- More languages
- Advanced recommendation engine
- Offline learning
- Mobile application
```

---

# 22. Recommended Development Strategy

The group should work using **vertical integration**, rather than everyone building unrelated features.

### Phase 1 — Project Foundation

Set up:

```text
MERN project
MongoDB
Express
React
Node.js
Environment variables
Git/GitHub
```

---

### Phase 2 — Authentication

Build:

```text
Register
Login
Logout
JWT/session
Password hashing
Role-based access
Protected routes
```

Roles:

```text
Student
Teacher
Admin
```

---

### Phase 3 — Student Reading Flow

Build:

```text
Language selection
       ↓
Exercise
       ↓
Microphone
       ↓
Recording
       ↓
Submit
```

Initially use fake analysis results.

---

### Phase 4 — AI Integration

Replace the fake result:

```text
Fake Score
     ↓
Real Speech Analysis
     ↓
Real Score
     ↓
Mistakes
```

---

### Phase 5 — Database

Persist:

```text
Users
Exercises
Reading Attempts
Improvement Plans
Languages
```

---

### Phase 6 — Improvement Engine

Implement:

```text
Score
 ↓
Weak areas
 ↓
Recommendations
 ↓
Personalized plan
```

Start with rules and then integrate AI.

---

### Phase 7 — Teacher Dashboard

Connect the dashboard to real MongoDB data.

```text
Database
   ↓
Backend Analytics APIs
   ↓
Teacher Dashboard
   ↓
Charts + Student Progress
```

---

### Phase 8 — Admin System

Build:

```text
Admin Login
     ↓
Admin Dashboard
     ↓
User Management
     ↓
Teacher Management
     ↓
Student Management
     ↓
Exercise Management
     ↓
Language Management
     ↓
Platform Analytics
```

Admin functionality should be connected to the same backend and database rather than creating a separate system.

---

### Phase 9 — Multilingual Support

Add:

```text
Language
 ↓
Exercise
 ↓
Speech recognition
 ↓
Analysis
 ↓
Feedback
```

Make language a configurable property throughout the system.

---

# 23. Team Division

A practical division for the group could be:

### Member 1 — Frontend / Student

```text
Student UI
Reading exercises
Language selection
Recording UI
Results page
Improvement plan UI
```

### Member 2 — Backend / Authentication

```text
Express
APIs
Authentication
Authorization
JWT/session
Password hashing
User management
Role management
```

### Member 3 — AI / Voice

```text
Audio processing
Speech-to-text
Reading analysis
Scoring
Pronunciation analysis
AI feedback
Improvement-plan generation
```

### Member 4 — Database / Teacher Analytics

```text
MongoDB schemas
Reading history
Teacher APIs
Dashboard
Charts
Progress analytics
```

### Admin Responsibilities

Admin functionality can be distributed among the members according to the implementation, but all members must follow the same admin requirements:

```text
User management
Exercise management
Language management
Platform analytics
Access control
```

Everyone should use **this same requirement document** as the source of truth.

---

# 24. Final Product Architecture

```text
                         VOPA WEB APP
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ↓               ↓               ↓
           STUDENT         TEACHER          ADMIN
              │               │               │
       Reading Interface  Analytics       Full Platform
       Voice Recording    Dashboard       Management
       AI Results         Students        Users
       Improvement        Progress        Teachers
              │               │            Students
              │               │            Exercises
              │               │            Languages
              │               │            Analytics
              └───────────────┼────────────┘
                              ↓
                         REACT APP
                              │
                         REST APIs
                              │
                     NODE + EXPRESS
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
     Auth Service         AI Service         Analytics
          │                   │                   │
          │             Speech Analysis            │
          │             Reading Score              │
          │             AI Feedback                │
          │             Improvement Plan           │
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                           MONGODB
                              │
                  Users + Exercises +
                Reading + Progress Data
```

---

# 25. One-Line Project Definition

**VOPA is a MERN-based multilingual literacy platform that uses AI-powered voice analysis to evaluate children's reading, identify weaknesses, generate personalized improvement plans, and help teachers track student progress through an analytics dashboard, while giving administrators complete control over the platform.**

---

# 26. Golden Rule for the Team

Every feature should ultimately support this loop:

```text
READ
 ↓
ANALYZE
 ↓
SCORE
 ↓
IMPROVE
 ↓
PRACTICE
 ↓
TRACK PROGRESS
```

The **Student** participates in the learning loop.

The **Teacher** observes and supports the learning loop.

The **Admin** manages and monitors the entire system.

If a proposed feature does not meaningfully contribute to this loop or to the teacher/admin's ability to understand and manage student performance, it should **not be a priority for the MVP**.
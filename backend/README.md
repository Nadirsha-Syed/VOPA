# VOPA AI Literacy Platform — Backend API

This repository contains the backend foundation for the VOPA AI Literacy Platform built with **Node.js, Express.js, and MongoDB (Mongoose)**.

---

## 📁 Folder Structure

```text
backend/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/              # Request handlers (auth, exercise, reading, etc.)
├── middleware/
│   ├── authMiddleware.js     # JWT verification & Role authorization
│   └── errorHandler.js       # Centralized global error handling
├── models/                   # Mongoose schemas (User, Exercise, ReadingAttempt, etc.)
├── routes/                   # API endpoint definitions
├── services/                 # Business logic abstraction (Speech, Scoring, Improvement, Analytics)
├── utils/                    # Helper functions (API response formatter, JWT generator)
├── uploads/                  # Temporary local storage for audio files
├── .env.example              # Environment variables template
├── app.js                    # Express application configuration
├── server.js                 # Server entry point
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local instance running or MongoDB Atlas Connection String)

### 2. Installation
Clone the repository and install dependencies:
```bash
cd backend
npm install
```

### 3. Environment Setup
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/vopa_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### 4. Running the Backend
Development mode with automatic reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

---

## 📡 Essential Endpoints

### Health Check
- `GET /api/health` — Check server status

### Authentication
- `POST /api/auth/register` — Register a student account
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Get profile of currently logged-in user (Requires `Bearer <token>`)

---

## 🔐 Role-Based Access Control

The API uses `requireRole(...)` middleware to protect routes based on role:
- `student`
- `teacher`
- `admin`

Pass the JWT in the header:
`Authorization: Bearer <your_jwt_token>`

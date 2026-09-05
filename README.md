# VOPA Frontend Repository

Welcome to the **VOPA (Vowels of the People Association)** Frontend Repository!

**Primary Message:** "Every Voice Learns. Every Child Belongs."

This repository is shared between two core frontend developers:
1. **Student & Authentication Experience** 
2. **Teacher & Admin Experience**

## Technology Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Charts:** Recharts
- **HTTP Client:** Axios

## Current Architecture

The application is structured around role-based access.

### Services & API
All network requests are centralized inside the `src/services/` directory.
- `api.js`: Configures the base Axios instance and authentication interceptors.
- `authService.js`: Handles login, registration, and session management.
- `studentService.js`: Handles data fetching for the student experience.

### Authentication & Routing
We use React Context (`AuthContext.jsx`) to manage user sessions globally. 
- `<ProtectedRoute>` ensures users are logged in.
- `<RoleProtectedRoute>` restricts routes based on role (e.g., `STUDENT`, `TEACHER`, `ADMIN`).

### Student Experience (In Progress)
The student experience focuses on a friendly, accessible, and engaging UI.
- **Components:** Modular, dumb UI components reside in `src/components/student/` and `src/components/common/`.
- **Layout:** `StudentLayout.jsx` provides a responsive sidebar and top navigation for the student dashboard.

## Development Progress (Student & Auth)

- [x] **Phase 0:** Repository inspection
- [x] **Phase 1:** Frontend foundation, Tailwind v4, Router setup, and shared components
- [x] **Phase 2:** Authentication screens (Login, Register, Unauthorized) and Context
- [x] **Phase 3:** Student Layout, Sidebar, Topbar, and Dashboard 
- [x] **Phase 4:** Language Selection
- [x] **Phase 5:** Reading Exercise & Web Speech/Microphone Integration
- [x] **Phase 6:** Reading Result & Score Visualization
- [x] **Phase 7:** Student Progress & Charts
- [x] **Phase 8:** Polish (Responsiveness, Accessibility, Loading/Empty states)
- [x] **Phase 9:** End-to-end Student Journey Testing
- [x] **Phase 10:** Integration Handoff Document preparation

## Running the Application

To run the application locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Git Submission Workflow

When you are ready to save and push your frontend changes to GitHub, follow these exact commands:

1. **Verify your branch**
   Make sure you are on your specific feature branch:
   ```bash
   git branch --show-current
   ```
   *(Expected output: `feature/student-auth-frontend`)*

2. **Check your changes**
   Review what files have been modified:
   ```bash
   git status
   git diff --stat
   ```

3. **Stage your files**
   Do not use `git add .` blindly. Stage the specific files or folders you own:
   ```bash
   git add src/App.jsx src/components/student/ src/pages/student/ src/pages/auth/ src/services/
   ```

4. **Commit your work**
   Write a clear, concise commit message describing what you built or fixed:
   ```bash
   git commit -m "feat: implement authentication and student experience"
   ```

5. **Push to GitHub**
   Push only to your dedicated remote branch (never directly to main):
   ```bash
   git push origin feature/student-auth-frontend
   ```

After pushing, you can navigate to the GitHub repository URL to open a Pull Request!

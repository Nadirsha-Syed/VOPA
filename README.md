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
- [ ] **Phase 4:** Language Selection
- [ ] **Phase 5:** Reading Exercise & Web Speech/Microphone Integration
- [ ] **Phase 6:** Reading Result & Score Visualization
- [ ] **Phase 7:** Student Progress & Charts
- [ ] **Phase 8:** Polish (Responsiveness, Accessibility, Loading/Empty states)
- [ ] **Phase 9:** End-to-end Student Journey Testing
- [ ] **Phase 10:** Integration Handoff Document preparation

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

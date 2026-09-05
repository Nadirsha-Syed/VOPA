import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// ── Public Auth Pages ─────────────────────────────────────────────────────────
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Unauthorized } from './pages/auth/Unauthorized';

// ── Student Experience Pages & Layout ─────────────────────────────────────────
import { StudentLayout } from './layouts/StudentLayout';
import { Dashboard as StudentDashboard } from './pages/student/Dashboard';
import { Languages as StudentLanguages } from './pages/student/Languages';
import { Exercise as StudentExercise } from './pages/student/Exercise';
import { Result as StudentResult } from './pages/student/Result';
import { Progress as StudentProgress } from './pages/student/Progress';
import { Profile as StudentProfile } from './pages/student/Profile';

// ── Teacher Experience Pages & Layout ─────────────────────────────────────────
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherStudentDetails from './pages/teacher/TeacherStudentDetails';
import TeacherReadingAttempts from './pages/teacher/TeacherReadingAttempts';
import TeacherReadingAttemptDetails from './pages/teacher/TeacherReadingAttemptDetails';
import TeacherAnalytics from './pages/teacher/TeacherAnalytics';
import TeacherProfile from './pages/teacher/TeacherProfile';

// ── Admin Control Center Pages & Layout ───────────────────────────────────────
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminStudentDetails from './pages/admin/AdminStudentDetails';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminTeacherDetails from './pages/admin/AdminTeacherDetails';
import AdminExercises from './pages/admin/AdminExercises';
import AdminLanguages from './pages/admin/AdminLanguages';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student Experience Routes */}
          <Route
            path="/student"
            element={
              <RoleProtectedRoute allowedRoles={['student', 'STUDENT']}>
                <StudentLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="languages" element={<StudentLanguages />} />
            <Route path="exercises" element={<StudentExercise />} />
            <Route path="exercises/:id" element={<StudentExercise />} />
            <Route path="exercises/:id/result" element={<StudentResult />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Teacher Experience Routes */}
          <Route
            path="/teacher"
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'TEACHER', 'admin', 'ADMIN']}>
                <TeacherLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="students/:studentId" element={<TeacherStudentDetails />} />
            <Route path="reading-attempts" element={<TeacherReadingAttempts />} />
            <Route path="reading-attempts/:attemptId" element={<TeacherReadingAttemptDetails />} />
            <Route path="analytics" element={<TeacherAnalytics />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>

          {/* Admin Control Center Routes */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'ADMIN']}>
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:studentId" element={<AdminStudentDetails />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="teachers/:teacherId" element={<AdminTeacherDetails />} />
            <Route path="exercises" element={<AdminExercises />} />
            <Route path="languages" element={<AdminLanguages />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Default Landing: Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

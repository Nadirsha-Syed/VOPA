import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import TeacherLayout from './layouts/TeacherLayout'
import AdminLayout from './layouts/AdminLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherStudents from './pages/teacher/TeacherStudents'
import TeacherStudentDetails from './pages/teacher/TeacherStudentDetails'
import TeacherReadingAttempts from './pages/teacher/TeacherReadingAttempts'
import TeacherReadingAttemptDetails from './pages/teacher/TeacherReadingAttemptDetails'
import TeacherAnalytics from './pages/teacher/TeacherAnalytics'
import TeacherProfile from './pages/teacher/TeacherProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminStudents from './pages/admin/AdminStudents'
import AdminStudentDetails from './pages/admin/AdminStudentDetails'
import AdminTeachers from './pages/admin/AdminTeachers'
import AdminTeacherDetails from './pages/admin/AdminTeacherDetails'
import AdminExercises from './pages/admin/AdminExercises'
import AdminLanguages from './pages/admin/AdminLanguages'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />

        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="students/:studentId" element={<TeacherStudentDetails />} />
          <Route path="reading-attempts" element={<TeacherReadingAttempts />} />
          <Route path="reading-attempts/:attemptId" element={<TeacherReadingAttemptDetails />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App

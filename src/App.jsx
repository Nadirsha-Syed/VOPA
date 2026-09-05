import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Unauthorized } from './pages/auth/Unauthorized';

import { StudentLayout } from './layouts/StudentLayout';
import { Dashboard } from './pages/student/Dashboard';

const Languages = () => <div>Language Selection</div>;
const Exercise = () => <div>Reading Exercise</div>;
const Result = () => <div>Reading Result</div>;
const Progress = () => <div>Student Progress</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student Routes */}
          <Route path="/student" element={
            <RoleProtectedRoute allowedRoles={['STUDENT']}>
              <StudentLayout>
                <Dashboard />
              </StudentLayout>
            </RoleProtectedRoute>
          } />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

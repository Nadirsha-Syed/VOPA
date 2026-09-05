import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Auth Pages (Placeholders)
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Unauthorized = () => <div>Unauthorized</div>;

// Student Pages (Placeholders)
const Dashboard = () => <div>Student Dashboard</div>;
const Languages = () => <div>Language Selection</div>;
const Exercise = () => <div>Reading Exercise</div>;
const Result = () => <div>Reading Result</div>;
const Progress = () => <div>Student Progress</div>;

// Layouts (Placeholders)
const StudentLayout = ({ children }) => <div><nav>Student Nav</nav><main>{children}</main></div>;

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

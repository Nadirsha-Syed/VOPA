import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Case-insensitive role comparison so both "student" and "STUDENT" work seamlessly
  const userRole = user.role ? user.role.toLowerCase() : '';
  const normalizedRoles = allowedRoles.map((r) => r.toLowerCase());

  if (!normalizedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

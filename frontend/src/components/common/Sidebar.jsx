import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const teacherLinks = [
  { label: 'Dashboard', to: '/teacher/dashboard' },
  { label: 'Students', to: '/teacher/students' },
  { label: 'Reading Attempts', to: '/teacher/reading-attempts' },
  { label: 'Analytics', to: '/teacher/analytics' },
  { label: 'Profile', to: '/teacher/profile' },
]

const adminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Students', to: '/admin/students' },
  { label: 'Teachers', to: '/admin/teachers' },
  { label: 'Exercises', to: '/admin/exercises' },
  { label: 'Languages', to: '/admin/languages' },
  { label: 'Analytics', to: '/admin/analytics' },
  { label: 'Settings', to: '/admin/settings' },
]

export default function Sidebar({ type = 'teacher', collapsed = false, onToggle, mobileOpen = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = type === 'admin' ? adminLinks : teacherLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-mark">V</div>
        {!collapsed && <div className="brand-text">VOPA</div>}
        <button type="button" className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">☰</button>
      </div>

      <nav className="sidebar-nav" aria-label={`${type} navigation`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/teacher/dashboard' || link.to === '/admin/dashboard'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}

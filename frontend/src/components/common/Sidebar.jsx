import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  Globe,
  TrendingUp,
  Settings,
  User,
  CheckCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const teacherLinks = [
  { label: 'Dashboard', to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/teacher/students', icon: GraduationCap },
  { label: 'Reading Attempts', to: '/teacher/reading-attempts', icon: CheckCircle },
  { label: 'Analytics', to: '/teacher/analytics', icon: TrendingUp },
  { label: 'Profile', to: '/teacher/profile', icon: User },
]

const adminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Students', to: '/admin/students', icon: GraduationCap },
  { label: 'Teachers', to: '/admin/teachers', icon: UserCheck },
  { label: 'Exercises', to: '/admin/exercises', icon: BookOpen },
  { label: 'Languages', to: '/admin/languages', icon: Globe },
  { label: 'Analytics', to: '/admin/analytics', icon: TrendingUp },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export default function Sidebar({ type = 'teacher', collapsed = false, onToggle, mobileOpen = false }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const links = type === 'admin' ? adminLinks : teacherLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLabel = type === 'admin' ? 'Admin' : 'Teacher'
  const roleBadgeColor = type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-extrabold flex items-center gap-0.5 tracking-tight">
            <span className="text-blue-600">V</span>
            <span className="text-orange-500">O</span>
            <span className="text-primary font-black" style={{ color: '#2E8C5C' }}>P</span>
            <span className="text-yellow-500">A</span>
          </div>
          {!collapsed && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${roleBadgeColor}`}>
              {roleLabel}
            </span>
          )}
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label={`${type} navigation`}>
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/teacher/dashboard' || link.to === '/admin/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? link.label : undefined}
            >
              <span className="nav-icon"><Icon size={20} /></span>
              {!collapsed && <span className="nav-label">{link.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button type="button" className="logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <p className="sidebar-quote">
            "Every Voice Learns. Every Child Belongs."
          </p>
        )}
      </div>
    </aside>
  )
}

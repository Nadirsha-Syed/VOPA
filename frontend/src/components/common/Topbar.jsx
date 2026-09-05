import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ title, subtitle, actions, mobileMenuButton }) {
  const { user } = useAuth()
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <header className="topbar">
      <div className="topbar-left">
        {mobileMenuButton}
        {title ? (
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        ) : (
          <div className="text-sm font-semibold text-gray-400 tracking-wide uppercase">
            VOPA Literacy Platform
          </div>
        )}
      </div>

      <div className="topbar-actions">
        {actions}
        <div className="topbar-profile">
          <button type="button" className="topbar-icon-btn" aria-label="Notifications" title="Notifications">
            <Bell size={18} />
            <span className="notification-dot" />
          </button>
          <div className="topbar-user">
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <span className="topbar-user-name">{user?.name || 'User'}</span>
              <span className="topbar-user-role">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

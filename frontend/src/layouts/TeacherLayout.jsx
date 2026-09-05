import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Topbar from '../components/common/Topbar'

export default function TeacherLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell teacher-shell">
      <Sidebar type="teacher" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} mobileOpen={mobileOpen} />
      <div className="app-main">
        <Topbar
          title="Teacher Workspace"
          subtitle="Monitor reading performance and support student growth."
          mobileMenuButton={
            <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen((prev) => !prev)} aria-label="Open navigation">
              ☰
            </button>
          }
          actions={
            <div className="topbar-pills">
              <NavLink to="/teacher/dashboard" className="pill-link">Dashboard</NavLink>
              <NavLink to="/teacher/students" className="pill-link">Students</NavLink>
            </div>
          }
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

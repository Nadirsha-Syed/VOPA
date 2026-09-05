import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Topbar from '../components/common/Topbar'

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell admin-shell">
      <Sidebar
        type="admin"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
      />
      <div className="app-main">
        <Topbar
          mobileMenuButton={
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Open navigation"
            >
              ☰
            </button>
          }
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

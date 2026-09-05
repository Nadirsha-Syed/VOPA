import { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function TeacherProfile() {
  const { user } = useAuth()
  const [studentCount, setStudentCount] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/teacher/dashboard')
        if (res.data?.success) {
          setStudentCount(res.data.data?.totalStudents ?? 0)
        }
      } catch (e) {
        console.warn('Could not fetch teacher stats:', e)
      }
    }
    fetchStats()
  }, [])

  const name = user?.name || 'Teacher'
  const email = user?.email || 'teacher@vopa.org'
  const role = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()) : 'Teacher'
  const preferredLanguage = user?.preferredLanguage || 'English'
  const avatar = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'TC'

  return (
    <div>
      <PageHeader title="Teacher Profile" subtitle="Keep your classroom profile and preferences up to date." />

      <div className="grid-2">
        <div className="profile-card">
          <div className="avatar">{avatar}</div>
          <h3>{name}</h3>
          <p>{email}</p>
          <div className="list-grid" style={{ marginTop: 16 }}>
            <div className="kpi-box">
              <span>Role</span>
              <strong>{role}</strong>
            </div>
            <div className="kpi-box">
              <span>Assigned Students</span>
              <strong>{studentCount}</strong>
            </div>
            <div className="kpi-box">
              <span>Preferred Language</span>
              <strong>{preferredLanguage}</strong>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Edit Profile</h3>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="form-field">
              <label htmlFor="teacher-name">Name</label>
              <input id="teacher-name" defaultValue={name} />
            </div>
            <div className="form-field">
              <label htmlFor="teacher-email">Email</label>
              <input id="teacher-email" defaultValue={email} />
            </div>
            <div className="form-field">
              <label htmlFor="teacher-role">Role</label>
              <input id="teacher-role" defaultValue={role} readOnly />
            </div>
            <div className="form-field">
              <label htmlFor="teacher-language">Preferred Language</label>
              <input id="teacher-language" defaultValue={preferredLanguage} />
            </div>
            <div className="form-field full">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

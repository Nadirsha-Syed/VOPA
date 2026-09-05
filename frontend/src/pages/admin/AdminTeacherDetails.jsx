import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

export default function AdminTeacherDetails() {
  const { teacherId } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const fetchTeacherData = async () => {
    try {
      const [userRes, studentsRes] = await Promise.all([
        api.get(`/admin/users/${teacherId}`),
        api.get(`/teacher/students?teacherId=${teacherId}`).catch(() => ({ data: { data: { students: [] } } })),
      ])

      if (userRes.data?.success) {
        setData(userRes.data.data)
      }
      if (studentsRes.data?.data?.students) {
        setStudents(studentsRes.data.data.students)
      }
    } catch (err) {
      console.warn('Failed to fetch teacher details:', err)
      setError(err.response?.data?.message || 'Failed to load teacher details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeacherData()
  }, [teacherId])

  const handleUpdateTeacher = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await api.put(`/admin/users/${teacherId}`, {
        name: formData.get('name'),
        email: formData.get('email'),
        status: formData.get('status'),
      })
      await fetchTeacherData()
      setEditOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update teacher')
    }
  }

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate this teacher?')) return
    try {
      await api.put(`/admin/users/${teacherId}`, { status: 'inactive' })
      await fetchTeacherData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate teacher')
    }
  }

  if (loading) return <LoadingState message="Loading teacher profile..." />

  if (error || !data?.user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error || 'Teacher not found.'}</p>
        <Button onClick={() => navigate('/admin/teachers')} style={{ marginTop: 12 }}>
          Back to Teachers
        </Button>
      </div>
    )
  }

  const { user, assignedStudentsCount = 0, classPerformance = '0%', activity = [] } = data
  const initials = user.name
    ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'TC'

  return (
    <div>
      <PageHeader
        title={user.name}
        subtitle="Teacher profile, workload, and assigned student overview."
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/students')}>Manage Students</Button>
            <Button variant="danger" onClick={handleDeactivate}>Deactivate</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/teachers')}>Back</Button>
          </div>
        }
      />

      <div className="detail-layout">
        <div className="profile-card">
          <h3>Teacher Profile</h3>
          <div className="avatar">{initials}</div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.status === 'active' ? 'Active' : 'Inactive'}</p>
          <p><strong>Assigned Students:</strong> {assignedStudentsCount}</p>
          <p><strong>Class Performance:</strong> {classPerformance}</p>
          <p><strong>Registered:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>

        <div className="panel">
          <h3>Recent Reading Activity in Class</h3>
          {activity.length === 0 ? (
            <p style={{ color: '#6b7280', padding: '16px 0' }}>No recent student activity for this class yet.</p>
          ) : (
            <ul className="list">
              {activity.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3>Assigned Students ({students.length})</h3>
          <Button size="sm" variant="secondary" onClick={() => navigate('/admin/students')}>
            Assign More Students
          </Button>
        </div>

        {students.length === 0 ? (
          <p style={{ color: '#6b7280', padding: '16px 0' }}>
            No students are currently assigned to this teacher. Use Student Management to assign learners.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Language</th>
                  <th>Avg Score</th>
                  <th>Total Attempts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td><strong>{st.name}</strong></td>
                    <td>{st.email}</td>
                    <td>{st.preferredLanguage || 'English'}</td>
                    <td>{st.currentScore > 0 ? `${st.currentScore}%` : 'No attempts'}</td>
                    <td>{st.totalAttempts ?? 0}</td>
                    <td>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/students/${st.id}`)}>
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editOpen} title="Edit Teacher Profile" onClose={() => setEditOpen(false)}>
        <form onSubmit={handleUpdateTeacher}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="teacherName">Name</label>
              <input id="teacherName" name="name" defaultValue={user.name} required />
            </div>
            <div className="form-field">
              <label htmlFor="teacherEmail">Email</label>
              <input id="teacherEmail" name="email" type="email" defaultValue={user.email} required />
            </div>
            <div className="form-field">
              <label htmlFor="teacherStatus">Status</label>
              <select id="teacherStatus" name="status" defaultValue={user.status || 'active'}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-field full" style={{ marginTop: 12 }}>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

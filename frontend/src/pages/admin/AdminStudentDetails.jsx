import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import Modal from '../../components/common/Modal'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

export default function AdminStudentDetails() {
  const { studentId } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals
  const [assignOpen, setAssignOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [selectedTeacherId, setSelectedTeacherId] = useState('')

  const fetchStudentData = async () => {
    try {
      const res = await api.get(`/admin/users/${studentId}`)
      if (res.data?.success) {
        setData(res.data.data)
      }
    } catch (err) {
      console.warn('Failed to load student details:', err)
      setError(err.response?.data?.message || 'Failed to load student details')
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers')
      if (res.data?.success && Array.isArray(res.data?.data?.teachers)) {
        setTeachers(res.data.data.teachers)
        if (res.data.data.teachers.length > 0) {
          setSelectedTeacherId(res.data.data.teachers[0]._id)
        }
      }
    } catch (e) {
      console.warn('Failed to load teachers for modal:', e)
    }
  }

  useEffect(() => {
    fetchStudentData()
    fetchTeachers()
  }, [studentId])

  const handleAssignTeacher = async () => {
    if (!selectedTeacherId) return
    try {
      await api.put('/admin/assign-student', {
        studentId,
        teacherId: selectedTeacherId,
      })
      await fetchStudentData()
      setAssignOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign teacher')
    }
  }

  const handleUpdateStudent = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await api.put(`/admin/users/${studentId}`, {
        name: formData.get('name'),
        email: formData.get('email'),
        preferredLanguage: formData.get('language'),
        currentLevel: formData.get('level'),
        status: formData.get('status'),
      })
      await fetchStudentData()
      setEditOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update student')
    }
  }

  if (loading) return <LoadingState message="Loading student profile..." />

  if (error || !data?.user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error || 'Student not found.'}</p>
        <Button onClick={() => navigate('/admin/students')} style={{ marginTop: 12 }}>
          Back to Students
        </Button>
      </div>
    )
  }

  const { user, totalAttempts = 0, averageScore = 0, readingHistory = [], recentAttempts = [], scoresByCategory = [] } = data
  const initials = user.name
    ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'ST'

  const progressData = scoresByCategory.length > 0 ? scoresByCategory : [
    { name: 'Reading', value: averageScore },
    { name: 'Comprehension', value: Math.min(100, Math.round(averageScore * 1.05)) },
    { name: 'Fluency', value: Math.min(100, Math.round(averageScore * 0.95)) },
  ]

  return (
    <div>
      <PageHeader
        title={user.name}
        subtitle="Student profile, live reading performance, and history."
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
            <Button variant="secondary" onClick={() => setAssignOpen(true)}>Assign Teacher</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/students')}>Back</Button>
          </div>
        }
      />

      <div className="detail-layout">
        <div className="profile-card">
          <h3>Student Profile</h3>
          <div className="avatar">{initials}</div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teacher:</strong> {user.assignedTeacher?.name || 'Unassigned'}</p>
          <p><strong>Preferred Language:</strong> {user.preferredLanguage || 'English'}</p>
          <p><strong>Current Level:</strong> {user.currentLevel || 'Beginner'}</p>
          <p><strong>Status:</strong> {user.status === 'active' ? 'Active' : 'Inactive'}</p>
          <p><strong>Average Score:</strong> {averageScore > 0 ? `${averageScore}%` : 'No attempts'}</p>
          <p><strong>Total Attempts:</strong> {totalAttempts}</p>
        </div>

        <div className="panel">
          <h3>Overall Accuracy & History</h3>
          <ProgressBar value={averageScore} label={`${averageScore}% Avg`} />
          <div style={{ marginTop: 18 }}>
            <p>
              <strong>Exercises Practiced:</strong>{' '}
              {readingHistory.length > 0 ? readingHistory.join(', ') : 'No exercises completed yet'}
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Recent Activity:</strong>{' '}
              {recentAttempts.length > 0
                ? `${recentAttempts.length} sessions recorded`
                : 'Waiting for first student session'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="panel">
          <h3>Reading Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Bar dataKey="value" fill="#365df5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Recent Reading Attempts</h3>
          {recentAttempts.length === 0 ? (
            <p style={{ color: '#6b7280', padding: '16px 0' }}>No recent attempts found.</p>
          ) : (
            <ul className="list">
              {recentAttempts.slice(0, 5).map((att) => (
                <li key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{att.exercise}</strong> ({att.language})
                    <br />
                    <small style={{ color: '#6b7280' }}>{att.date}</small>
                  </div>
                  <span style={{ fontWeight: 600, color: att.score >= 75 ? '#1e9f67' : '#d99218' }}>
                    {att.score}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Assign Teacher Modal */}
      <Modal isOpen={assignOpen} title="Assign Teacher" onClose={() => setAssignOpen(false)}>
        <p>Assign <strong>{user.name}</strong> to an active teacher:</p>
        <div className="form-field" style={{ marginTop: 16 }}>
          <label htmlFor="teacherSelect">Select Teacher</label>
          <select
            id="teacherSelect"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
          >
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.email})
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button onClick={handleAssignTeacher}>Save Assignment</Button>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={editOpen} title="Edit Student Profile" onClose={() => setEditOpen(false)}>
        <form onSubmit={handleUpdateStudent}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="studentName">Name</label>
              <input id="studentName" name="name" defaultValue={user.name} required />
            </div>
            <div className="form-field">
              <label htmlFor="studentEmail">Email</label>
              <input id="studentEmail" name="email" type="email" defaultValue={user.email} required />
            </div>
            <div className="form-field">
              <label htmlFor="studentLanguage">Preferred Language</label>
              <select id="studentLanguage" name="language" defaultValue={user.preferredLanguage || 'English'}>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Spanish</option>
                <option>Marathi</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="studentLevel">Current Level</label>
              <select id="studentLevel" name="level" defaultValue={user.currentLevel || 'beginner'}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="studentStatus">Status</label>
              <select id="studentStatus" name="status" defaultValue={user.status || 'active'}>
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

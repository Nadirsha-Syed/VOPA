import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

export default function AdminStudents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [teacherValue, setTeacherValue] = useState('')

  const fetchData = async () => {
    try {
      const [stuRes, teachRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/teachers'),
      ])

      if (stuRes.data?.success && Array.isArray(stuRes.data?.data?.students)) {
        setStudents(stuRes.data.data.students.map((s) => ({
          id: s._id,
          _id: s._id,
          name: s.name,
          email: s.email,
          teacher: s.assignedTeacher?.name || 'Unassigned',
          teacherId: s.assignedTeacher?._id || '',
          language: s.preferredLanguage || 'English',
          score: s.score ?? s.currentScore ?? 0,
          totalAttempts: s.totalAttempts ?? 0,
          lastAttempt: s.lastAttempt || 'Never',
          status: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : 'Active',
        })))
      }

      if (teachRes.data?.success && Array.isArray(teachRes.data?.data?.teachers)) {
        setTeachers(teachRes.data.data.teachers)
        if (teachRes.data.data.teachers.length > 0) {
          setTeacherValue(teachRes.data.data.teachers[0]._id)
        }
      }
    } catch (err) {
      console.warn('Could not load live students/teachers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAssignTeacher = async () => {
    if (!selectedStudent || !teacherValue) return
    try {
      await api.put('/admin/assign-student', {
        studentId: selectedStudent.id,
        teacherId: teacherValue,
      })
      await fetchData()
      setAssignOpen(false)
    } catch (err) {
      console.warn('Failed to assign teacher:', err)
    }
  }

  const handleDeactivate = async (studentId) => {
    try {
      await api.put(`/admin/users/${studentId}`, { status: 'inactive' })
      setStudents((prev) => prev.map((item) => (item.id === studentId ? { ...item, status: 'Inactive' } : item)))
    } catch (err) {
      console.warn('Failed to deactivate student:', err)
    }
  }

  if (loading) return <LoadingState message="Loading students..." />

  const total = students.length
  const active = students.filter((student) => student.status === 'Active').length
  const inactive = students.filter((student) => student.status !== 'Active').length
  const attention = students.filter((student) => student.status === 'Needs Attention').length

  return (
    <div>
      <PageHeader title="Student Management" subtitle="Monitor student activity, performance, and assigned teacher support." />

      <div className="stats-grid">
        <StatCard label="Total Students" value={total} change="All enrolled" />
        <StatCard label="Active Students" value={active} change="Current learners" />
        <StatCard label="Inactive Students" value={inactive} change="Pending follow-up" />
        <StatCard label="Students Needing Attention" value={attention} change="Priority review" />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Teacher</th>
              <th>Language</th>
              <th>Current Score</th>
              <th>Last Attempt</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No students registered on the platform yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.email}</td>
                  <td>{student.teacher}</td>
                  <td>{student.language}</td>
                  <td>
                    {student.totalAttempts > 0 ? (
                      <span style={{ fontWeight: 600, color: student.score >= 75 ? '#1e9f67' : '#d99218' }}>
                        {student.score}% ({student.totalAttempts} {student.totalAttempts === 1 ? 'attempt' : 'attempts'})
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>No attempts yet</span>
                    )}
                  </td>
                  <td>{student.lastAttempt}</td>
                  <td>{student.status}</td>
                  <td>
                    <div className="inline-actions">
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/students/${student.id}`)}>View Profile</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedStudent(student); setAssignOpen(true) }}>Assign Teacher</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeactivate(student.id)}>Deactivate</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={assignOpen} title="Assign Teacher" onClose={() => setAssignOpen(false)}>
        <p>Assign <strong>{selectedStudent?.name}</strong> to a teacher:</p>
        <div className="form-field" style={{ marginTop: 16 }}>
          <label htmlFor="teacherSelect">Select Teacher</label>
          <select id="teacherSelect" value={teacherValue} onChange={(event) => setTeacherValue(event.target.value)}>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button onClick={handleAssignTeacher}>Save Assignment</Button>
        </div>
      </Modal>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

export default function AdminTeachers() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isAssignOpen, setAssignOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers')
      if (res.data?.success && Array.isArray(res.data?.data?.teachers)) {
        setTeachers(res.data.data.teachers.map((t) => ({
          id: t._id,
          _id: t._id,
          name: t.name,
          email: t.email,
          assignedStudents: Array.isArray(t.assignedStudents) ? t.assignedStudents.length : 0,
          classPerformance: t.classPerformance || 'Active',
          status: t.status ? (t.status.charAt(0).toUpperCase() + t.status.slice(1)) : 'Active',
        })))
      }
    } catch (err) {
      console.warn('Could not fetch live teachers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleAddTeacher = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = form.elements.name.value
    const email = form.elements.email.value
    const password = form.elements.password.value || 'Teacher@123'
    const status = form.elements.status.value

    try {
      await api.post('/admin/users', {
        name,
        email,
        password,
        role: 'teacher',
        status: status.toLowerCase(),
      })
      await fetchTeachers()
      setModalOpen(false)
    } catch (err) {
      console.warn('Could not create teacher:', err)
    }
  }

  const handleDeactivate = async (teacherId) => {
    try {
      await api.put(`/admin/users/${teacherId}`, { status: 'inactive' })
      setTeachers((prev) => prev.map((t) => (t.id === teacherId ? { ...t, status: 'Inactive' } : t)))
    } catch (err) {
      console.warn('Could not deactivate teacher:', err)
    }
  }

  if (loading) return <LoadingState message="Loading teachers..." />

  const total = teachers.length
  const active = teachers.filter((teacher) => teacher.status === 'Active').length
  const inactive = teachers.filter((teacher) => teacher.status !== 'Active').length

  return (
    <div>
      <PageHeader title="Teacher Management" subtitle="Review staff activity, assignments, and classroom performance." actions={<Button onClick={() => setModalOpen(true)}>Add Teacher</Button>} />

      <div className="stats-grid">
        <StatCard label="Total Teachers" value={total} change="Platform staff" />
        <StatCard label="Active Teachers" value={active} change="Engaged" />
        <StatCard label="Inactive Teachers" value={inactive} change="Requires follow-up" />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assigned Students</th>
              <th>Class Performance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No teachers registered on the platform yet.
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td><strong>{teacher.name}</strong></td>
                  <td>{teacher.email}</td>
                  <td>{teacher.assignedStudents}</td>
                  <td>{teacher.classPerformance}</td>
                  <td>{teacher.status}</td>
                  <td>
                    <div className="inline-actions">
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/teachers/${teacher.id}`)}>View</Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedTeacher(teacher) || setAssignOpen(true)}>Assign Students</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeactivate(teacher.id)}>Deactivate</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title="Add Teacher" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleAddTeacher}>
          <div className="form-grid">
            <div className="form-field"><label>Name</label><input name="name" required /></div>
            <div className="form-field"><label>Email</label><input name="email" type="email" required /></div>
            <div className="form-field"><label>Password</label><input name="password" type="password" defaultValue="Teacher@123" /></div>
            <div className="form-field"><label>Status</label><select name="status" defaultValue="Active"><option>Active</option><option>Inactive</option></select></div>
            <div className="form-field full"><Button type="submit">Save Teacher</Button></div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAssignOpen} title="Assign Students" onClose={() => setAssignOpen(false)}>
        <p>Assign students to {selectedTeacher?.name || 'this teacher'}.</p>
        <div className="form-field" style={{ marginTop: 16 }}>
          <label htmlFor="studentAssignment">Student Group</label>
          <select id="studentAssignment" defaultValue="All students">
            <option>All students</option>
            <option>Level 1</option>
            <option>Level 2</option>
            <option>Needs Attention</option>
          </select>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button onClick={() => setAssignOpen(false)}>Save Assignment</Button>
        </div>
      </Modal>
    </div>
  )
}

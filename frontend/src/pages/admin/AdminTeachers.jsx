import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { adminTeachers } from '../../data/adminMockData'

export default function AdminTeachers() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState(adminTeachers)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isAssignOpen, setAssignOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

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
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.assignedStudents}</td>
                <td>{teacher.classPerformance}</td>
                <td>{teacher.status}</td>
                <td>
                  <div className="inline-actions">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/teachers/${teacher.id}`)}>View</Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedTeacher(teacher) || setAssignOpen(true)}>Assign Students</Button>
                    <Button size="sm" variant="danger" onClick={() => setTeachers((prev) => prev.map((item) => item.id === teacher.id ? { ...item, status: 'Inactive' } : item))}>Deactivate</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title="Add Teacher" onClose={() => setModalOpen(false)}>
        <form>
          <div className="form-grid">
            <div className="form-field"><label>Name</label><input defaultValue="" /></div>
            <div className="form-field"><label>Email</label><input type="email" defaultValue="" /></div>
            <div className="form-field"><label>Password</label><input type="password" defaultValue="" /></div>
            <div className="form-field"><label>Status</label><select defaultValue="Active"><option>Active</option><option>Inactive</option></select></div>
            <div className="form-field full"><Button onClick={() => setModalOpen(false)}>Save Teacher</Button></div>
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

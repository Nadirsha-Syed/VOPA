import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { adminStudents } from '../../data/adminMockData'

export default function AdminStudents() {
  const navigate = useNavigate()
  const [students, setStudents] = useState(adminStudents)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [teacherValue, setTeacherValue] = useState('Aisha Patel')

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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.teacher}</td>
                <td>{student.language}</td>
                <td>{student.score}%</td>
                <td>{student.status}</td>
                <td>
                  <div className="inline-actions">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/students/${student.id}`)}>View Profile</Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedStudent(student) || setAssignOpen(true)}>Assign Teacher</Button>
                    <Button size="sm" variant="danger" onClick={() => setStudents((prev) => prev.map((item) => item.id === student.id ? { ...item, status: 'Inactive' } : item))}>Deactivate</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={assignOpen} title="Assign Teacher" onClose={() => setAssignOpen(false)}>
        <div className="form-field">
          <label htmlFor="teacherSelect">Teacher</label>
          <select id="teacherSelect" value={teacherValue} onChange={(event) => setTeacherValue(event.target.value)}>
            <option value="Aisha Patel">Aisha Patel</option>
            <option value="Nisha Reddy">Nisha Reddy</option>
            <option value="Arun Singh">Arun Singh</option>
          </select>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button onClick={() => {
            setStudents((prev) => prev.map((student) => student.id === selectedStudent?.id ? { ...student, teacher: teacherValue } : student))
            setAssignOpen(false)
          }}>Save Assignment</Button>
        </div>
      </Modal>
    </div>
  )
}

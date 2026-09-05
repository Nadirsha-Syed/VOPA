import { useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import { adminTeacherDetails } from '../../data/adminMockData'

export default function AdminTeacherDetails() {
  const { teacherId } = useParams()
  const teacher = adminTeacherDetails[teacherId] || adminTeacherDetails['teach-301']

  return (
    <div>
      <PageHeader title={teacher.name} subtitle="Teacher profile, workload, and activity overview." actions={<><Button>Edit</Button><Button variant="secondary">Assign Students</Button></>} />

      <div className="detail-layout">
        <div className="profile-card">
          <h3>Teacher Profile</h3>
          <div className="avatar">{teacher.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Status:</strong> {teacher.status}</p>
          <p><strong>Assigned Students:</strong> {teacher.assignedStudents}</p>
          <p><strong>Class Performance:</strong> {teacher.classPerformance}</p>
        </div>

        <div className="panel">
          <h3>Teacher Activity</h3>
          <ul className="list">
            {teacher.activity.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div style={{ marginTop: 18 }}>
            <Button variant="secondary">View Students</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

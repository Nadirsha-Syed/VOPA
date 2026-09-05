import { useParams } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import ProgressBar from '../../components/common/ProgressBar'
import { adminStudentDetails } from '../../data/adminMockData'

const progressData = [
  { name: 'Reading', value: 72 },
  { name: 'Comprehension', value: 80 },
  { name: 'Fluency', value: 76 },
]

export default function AdminStudentDetails() {
  const { studentId } = useParams()
  const student = adminStudentDetails[studentId] || adminStudentDetails['stud-201']

  return (
    <div>
      <PageHeader title={student.name} subtitle="Student profile and progress overview." actions={<><Button>Edit</Button><Button variant="secondary">Assign Teacher</Button></>} />

      <div className="detail-layout">
        <div className="profile-card">
          <h3>Student Profile</h3>
          <div className="avatar">{student.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
          <p><strong>Teacher:</strong> {student.teacher}</p>
          <p><strong>Preferred Language:</strong> {student.preferredLanguage}</p>
          <p><strong>Current Level:</strong> {student.currentLevel}</p>
          <p><strong>Status:</strong> {student.status}</p>
          <p><strong>Current Score:</strong> {student.currentScore}%</p>
        </div>

        <div className="panel">
          <h3>Progress</h3>
          <ProgressBar value={student.progress} label={`${student.progress}%`} />
          <div style={{ marginTop: 18 }}>
            <p><strong>Reading History:</strong> {student.readingHistory.join(', ')}</p>
            <p style={{ marginTop: 10 }}><strong>Improvement Plans:</strong> {student.improvementPlans.join(', ')}</p>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="panel">
          <h3>Reading Performance</h3>
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
          <h3>Improvement Notes</h3>
          <ul className="list">
            {student.improvementPlans.map((plan) => <li key={plan}>{plan}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

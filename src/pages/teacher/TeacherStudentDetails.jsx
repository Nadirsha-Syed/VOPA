import { Link, useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import { studentDetailMap } from '../../data/teacherMockData'

export default function TeacherStudentDetails() {
  const { studentId } = useParams()
  const student = studentDetailMap[studentId] || studentDetailMap['stu-101']

  const scoreData = student.scoreProgress.map((score, index) => ({ name: `W${index + 1}`, score }))

  return (
    <div>
      <div className="row-spread" style={{ marginBottom: 20 }}>
        <Link to="/teacher/students" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>← Back to Students</Link>
      </div>

      <PageHeader title={student.name} subtitle="Student progress overview and reading insights." />

      <div className="stats-grid">
        <StatCard label="Current Score" value={`${student.score}%`} change="Readiness check" />
        <StatCard label="Improvement" value={`+${student.improvement}%`} change="Over 4 weeks" />
        <StatCard label="Total Attempts" value={student.totalAttempts} change="Completed" />
        <StatCard label="Last Attempt" value={student.lastAttempt} change="Latest result" />
      </div>

      <div className="detail-layout">
        <div className="panel">
          <h3>Score Progress</h3>
          <div className="chart-card-body" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis domain={[60, 100]} />
                <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h3>Weak Areas</h3>
          <ul className="list">
            {student.weakAreas.map((area) => <li key={area}>{area}</li>)}
          </ul>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="panel">
          <h3>Reading Attempts</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Language</th>
                  <th>Score</th>
                  <th>Mistakes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {student.attempts.map((attempt, index) => (
                  <tr key={`${attempt.exercise}-${index}`}>
                    <td>{attempt.exercise}</td>
                    <td>{attempt.language}</td>
                    <td>{attempt.score}%</td>
                    <td>{attempt.mistakes}</td>
                    <td>{attempt.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>Improvement Plan</h3>
          <p><strong>Weak Areas:</strong> {student.improvementPlan.weakAreas.join(', ')}</p>
          <ul className="list">
            {student.improvementPlan.recommendations.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p style={{ marginTop: 12 }}><strong>Practice Status:</strong> <StatusBadge status={student.improvementPlan.practiceStatus} /></p>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <h3>Common Mistakes</h3>
        <div className="controls-row">
          {student.commonMistakes.map((mistake) => (
            <span key={mistake} className="status-badge badge-warning" style={{ marginRight: 8 }}>{mistake}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

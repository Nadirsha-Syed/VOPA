import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/charts/ChartCard'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import { teacherDashboardStats, classPerformanceData, languagePerformanceData, teacherStudents, readingAttempts } from '../../data/teacherMockData'

export default function TeacherDashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Good morning, Teacher"
        subtitle="Monitor your students' reading progress and help them improve."
        actions={
          <>
            <Button onClick={() => navigate('/teacher/students')}>View Students</Button>
            <Button variant="secondary" onClick={() => navigate('/teacher/analytics')}>View Analytics</Button>
          </>
        }
      />

      <div className="stats-grid">
        {teacherDashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>

      <div className="grid-2">
        <ChartCard title="Class Performance">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={classPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[60, 100]} />
              <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Language Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={languagePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="language" />
              <YAxis domain={[0, 100]} />
              <Bar dataKey="score" fill="#7b8bf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="row-spread" style={{ marginBottom: 16 }}>
            <h3>Students Needing Attention</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/teacher/students')}>View all</Button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Weak Area</th>
                  <th>Last Attempt</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {teacherStudents.filter((student) => student.status === 'Needs Attention').slice(0, 4).map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.score}%</td>
                    <td>{student.weakArea}</td>
                    <td>{student.lastAttempt}</td>
                    <td><StatusBadge status={student.status} /></td>
                    <td><Button size="sm" variant="secondary" onClick={() => navigate(`/teacher/students/${student.id}`)}>View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="row-spread" style={{ marginBottom: 16 }}>
            <h3>Recent Reading Attempts</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/teacher/reading-attempts')}>View all</Button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exercise</th>
                  <th>Language</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {readingAttempts.slice(0, 4).map((attempt) => (
                  <tr key={attempt.id}>
                    <td>{attempt.student}</td>
                    <td>{attempt.exercise}</td>
                    <td>{attempt.language}</td>
                    <td>{attempt.score}%</td>
                    <td>{attempt.date}</td>
                    <td>
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/teacher/reading-attempts/${attempt.id}`)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

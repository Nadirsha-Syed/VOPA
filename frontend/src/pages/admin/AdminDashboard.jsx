import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/charts/ChartCard'
import { adminDashboardStats, adminStudents, adminAnalytics, recentPlatformActivity } from '../../data/adminMockData'

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Monitor and manage the VOPA platform." />

      <div className="stats-grid">
        {adminDashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>

      <div className="grid-2">
        <ChartCard title="Platform Activity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adminAnalytics.platformScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reading Performance">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adminAnalytics.platformScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[60, 100]} />
              <Line type="monotone" dataKey="score" stroke="#1e9f67" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="Language Usage">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adminAnalytics.languageUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="language" />
              <YAxis />
              <Bar dataKey="value" fill="#7b8bf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="panel">
          <h3>Most Used Exercises</h3>
          <ul className="list">
            {adminAnalytics.exerciseUsage.map((exercise, index) => (
              <li key={exercise.name}><strong>#{index + 1}</strong> {exercise.name} · {exercise.count} uses</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Students Needing Attention</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Teacher</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {adminStudents.filter((student) => student.status === 'Needs Attention').map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.teacher}</td>
                    <td>{student.score}%</td>
                    <td>{student.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>Recent Platform Activity</h3>
          <ul className="list">
            {recentPlatformActivity.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

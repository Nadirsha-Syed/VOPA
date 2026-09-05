import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import ChartCard from '../../components/charts/ChartCard'
import Button from '../../components/common/Button'
import { adminAnalytics } from '../../data/adminMockData'

const COLORS = ['#365df5', '#7b8bf8', '#1e9f67', '#d99218', '#e25161']

export default function AdminAnalytics() {
  return (
    <div>
      <PageHeader title="Platform Analytics" subtitle="Track student growth, exercise usage, and overall platform performance." />

      <div className="controls-row">
        <div className="filter-bar">
          {['7 Days', '30 Days', '3 Months', 'Custom'].map((option) => (
            <Button key={option} variant="ghost" size="sm">{option}</Button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="summary-card"><h3>Total Students</h3><span className="summary-value">{adminAnalytics.totalStudents}</span><small>Active learners</small></div>
        <div className="summary-card"><h3>Total Teachers</h3><span className="summary-value">{adminAnalytics.totalTeachers}</span><small>On platform</small></div>
        <div className="summary-card"><h3>Total Reading Attempts</h3><span className="summary-value">{adminAnalytics.totalAttempts}</span><small>Completed</small></div>
        <div className="summary-card"><h3>Overall Improvement</h3><span className="summary-value">+{adminAnalytics.overallImprovement}%</span><small>Quarterly change</small></div>
      </div>

      <div className="grid-2">
        <ChartCard title="Platform Score Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={adminAnalytics.platformScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[60, 100]} />
              <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reading Attempts Trend">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adminAnalytics.readingAttemptsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="attempts" fill="#1e9f67" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="Language Usage">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={adminAnalytics.languageUsage} dataKey="value" nameKey="language" outerRadius={70} label>
                {adminAnalytics.languageUsage.map((entry, index) => (
                  <Cell key={entry.language} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Student Improvement">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adminAnalytics.studentImprovement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="improvement" fill="#6d5ef6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Mistake Frequency">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={adminAnalytics.mistakeFrequency}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" fill="#d99218" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/charts/ChartCard'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAdminDash = async () => {
      try {
        const res = await api.get('/admin/dashboard')
        if (res.data?.success) {
          setData(res.data.data)
        }
      } catch (err) {
        console.warn('Could not load live admin dashboard:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAdminDash()
  }, [])

  if (isLoading) return <LoadingState message="Loading platform overview..." />

  const stats = [
    { label: 'Total Students', value: data?.stats?.totalStudents ?? 0, change: 'Registered' },
    { label: 'Total Teachers', value: data?.stats?.totalTeachers ?? 0, change: 'Active' },
    { label: 'Reading Attempts', value: data?.stats?.totalReadingAttempts ?? 0, change: 'All-time' },
    { label: 'Avg Platform Score', value: data?.stats?.averageScore ? `${data.stats.averageScore}%` : '0%', change: 'Accuracy' },
  ]

  const languageUsage = (data?.languageUsage && data.languageUsage.length > 0)
    ? data.languageUsage
    : [
        { language: 'English', value: 0 },
        { language: 'Hindi', value: 0 },
        { language: 'Tamil', value: 0 },
      ]

  const scoreTrend = data?.scoreTrend || []
  const mostUsedExercises = data?.mostUsedExercises || []
  const recentActivity = data?.recentActivity || []

  const emptyChartStyle = {
    height: '100%',
    minHeight: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    textAlign: 'center',
    padding: '24px',
    fontSize: '0.9rem',
  }

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Monitor and manage the VOPA platform in real-time." />

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>

      <div className="grid-2">
        <ChartCard title="Platform Score Accuracy">
          {scoreTrend.length === 0 ? (
            <div style={emptyChartStyle}>No score trends recorded yet. Practice sessions will populate this timeline.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Language Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={languageUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="language" />
              <YAxis />
              <Bar dataKey="value" fill="#7b8bf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>Most Practiced Exercises</h3>
          {mostUsedExercises.length === 0 ? (
            <p style={{ color: '#6b7280', padding: '16px 0' }}>No exercises practiced yet. Active sessions will populate here automatically.</p>
          ) : (
            <ul className="list">
              {mostUsedExercises.map((exercise, index) => (
                <li key={exercise._id || exercise.title || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <strong>#{index + 1}</strong> {exercise.title} ({exercise.language || 'English'})
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {exercise.attemptCount ?? exercise.attemptsCount ?? 0} attempts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h3>Recent Platform Activity</h3>
          {recentActivity.length === 0 ? (
            <p style={{ color: '#6b7280', padding: '16px 0' }}>No reading attempts recorded yet on the platform.</p>
          ) : (
            <ul className="list">
              {recentActivity.map((item, idx) => (
                <li key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{item.studentName}</strong> read <em>{item.exerciseTitle}</em> ({item.language})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: item.score >= 75 ? '#1e9f67' : '#d99218' }}>{item.score}%</span>
                    <small style={{ color: '#6b7280' }}>{item.timeAgo}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

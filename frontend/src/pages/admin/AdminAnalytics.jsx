import { useEffect, useState } from 'react'
import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import ChartCard from '../../components/charts/ChartCard'
import Button from '../../components/common/Button'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

const COLORS = ['#365df5', '#7b8bf8', '#1e9f67', '#d99218', '#e25161']

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30 Days')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics')
        if (res.data?.success) {
          setData(res.data.data)
        }
      } catch (err) {
        console.warn('Could not load live admin analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return <LoadingState message="Loading platform analytics..." />

  const totalStudents = data?.stats?.totalStudents ?? 0
  const totalTeachers = data?.stats?.totalTeachers ?? 0
  const totalAttempts = data?.stats?.totalReadingAttempts ?? 0
  const averageScore = data?.stats?.averageScore ? `${data.stats.averageScore}%` : '0%'

  const platformScoreTrend = data?.scoreTrend || []
  const readingAttemptsTrend = data?.readingAttemptsTrend || []
  const languageUsage = (data?.languageUsage && data.languageUsage.length > 0)
    ? data.languageUsage
    : [{ language: 'English', value: 1 }]
  const studentImprovement = data?.studentImprovement || []
  const mistakeFrequency = data?.mistakeFrequency || []

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
      <PageHeader title="Platform Analytics" subtitle="Track student growth, exercise usage, and overall platform performance." />

      <div className="controls-row">
        <div className="filter-bar">
          {['7 Days', '30 Days', '3 Months', 'Custom'].map((option) => (
            <Button key={option} variant={range === option ? 'primary' : 'ghost'} size="sm" onClick={() => setRange(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="summary-card"><h3>Total Students</h3><span className="summary-value">{totalStudents}</span><small>Registered learners</small></div>
        <div className="summary-card"><h3>Total Teachers</h3><span className="summary-value">{totalTeachers}</span><small>On platform</small></div>
        <div className="summary-card"><h3>Total Reading Attempts</h3><span className="summary-value">{totalAttempts}</span><small>Completed</small></div>
        <div className="summary-card"><h3>Average Platform Score</h3><span className="summary-value">{averageScore}</span><small>Accuracy</small></div>
      </div>

      <div className="grid-2">
        <ChartCard title="Platform Score Trend">
          {platformScoreTrend.length === 0 ? (
            <div style={emptyChartStyle}>No score trends recorded yet. Student practice sessions will populate this graph.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platformScoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Reading Attempts Trend">
          {readingAttemptsTrend.length === 0 ? (
            <div style={emptyChartStyle}>No reading attempts trend recorded yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readingAttemptsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="attempts" fill="#1e9f67" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="Language Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={languageUsage} dataKey="value" nameKey="language" outerRadius={70} label>
                {languageUsage.map((entry, index) => (
                  <Cell key={entry.language || index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Score Distribution">
          {studentImprovement.length === 0 ? (
            <div style={emptyChartStyle}>No score distributions evaluated yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentImprovement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="improvement" fill="#6d5ef6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Mistake Frequency">
        {mistakeFrequency.length === 0 ? (
          <div style={emptyChartStyle}>No frequent mistakes recorded across platform sessions.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mistakeFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#d99218" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  )
}

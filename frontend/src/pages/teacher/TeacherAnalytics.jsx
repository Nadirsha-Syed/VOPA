import { useEffect, useState } from 'react'
import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import ChartCard from '../../components/charts/ChartCard'
import Button from '../../components/common/Button'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

const filterOptions = ['7 Days', '30 Days', '3 Months', 'Custom']

export default function TeacherAnalytics() {
  const [range, setRange] = useState('30 Days')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/teacher/analytics')
        if (res.data?.success) {
          setData(res.data.data)
        }
      } catch (e) {
        console.warn('Could not load live analytics:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return <LoadingState message="Loading class analytics..." />

  const averageScore = data?.classAverageScore ?? 0
  const highestScore = data?.highestScore ?? 0
  const lowestScore = data?.lowestScore ?? 0
  const totalAttempts = data?.totalAttempts ?? 0

  const scoreOverTime = data?.scoreOverTime || []
  const classAverage = data?.classAverage || []
  const studentComparison = data?.studentComparison || []
  const languagePerformance = data?.languagePerformance || [
    { name: 'English', score: 0 },
    { name: 'Hindi', score: 0 },
    { name: 'Tamil', score: 0 },
  ]
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
      <PageHeader title="Class Analytics" subtitle="Monitor classroom trends and identify learning gaps across classes." />

      <div className="controls-row">
        <div className="filter-bar">
          {filterOptions.map((option) => (
            <Button key={option} variant={range === option ? 'primary' : 'ghost'} size="sm" onClick={() => setRange(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="summary-card"><h3>Average Score</h3><span className="summary-value">{averageScore}%</span><small>Across all students</small></div>
        <div className="summary-card"><h3>Highest Score</h3><span className="summary-value">{highestScore}%</span><small>Top performer</small></div>
        <div className="summary-card"><h3>Lowest Score</h3><span className="summary-value">{lowestScore}%</span><small>Support needed</small></div>
        <div className="summary-card"><h3>Total Attempts</h3><span className="summary-value">{totalAttempts}</span><small>Submitted</small></div>
      </div>

      <div className="grid-2">
        <ChartCard title="Score Over Time">
          {scoreOverTime.length === 0 ? (
            <div style={emptyChartStyle}>No score trends recorded yet. Completed student practices will populate this timeline.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Class Average by Level">
          {classAverage.length === 0 ? (
            <div style={emptyChartStyle}>No reading exercises evaluated yet for difficulty breakdown.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAverage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Bar dataKey="average" fill="#6d5ef6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="Student Comparison">
          {studentComparison.length === 0 ? (
            <div style={emptyChartStyle}>No students currently enrolled in this class.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Bar dataKey="score" fill="#365df5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Language Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={languagePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Bar dataKey="score" fill="#1e9f67" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Mistake Frequency">
        {mistakeFrequency.length === 0 ? (
          <div style={emptyChartStyle}>No frequent mispronounced words or mistakes identified yet across attempts.</div>
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

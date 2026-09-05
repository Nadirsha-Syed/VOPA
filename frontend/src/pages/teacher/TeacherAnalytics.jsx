import { useState } from 'react'
import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import ChartCard from '../../components/charts/ChartCard'
import Button from '../../components/common/Button'
import { teacherAnalytics } from '../../data/teacherMockData'

const filterOptions = ['7 Days', '30 Days', '3 Months', 'Custom']

export default function TeacherAnalytics() {
  const [range, setRange] = useState('30 Days')

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
        <div className="summary-card"><h3>Average Score</h3><span className="summary-value">{teacherAnalytics.averageScore}%</span><small>Across all students</small></div>
        <div className="summary-card"><h3>Highest Score</h3><span className="summary-value">{teacherAnalytics.highestScore}%</span><small>Top performer</small></div>
        <div className="summary-card"><h3>Lowest Score</h3><span className="summary-value">{teacherAnalytics.lowestScore}%</span><small>Support needed</small></div>
        <div className="summary-card"><h3>Total Attempts</h3><span className="summary-value">{teacherAnalytics.totalAttempts}</span><small>Submitted</small></div>
      </div>

      <div className="grid-2">
        <ChartCard title="Score Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={teacherAnalytics.scoreOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[60, 100]} />
              <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Class Average">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherAnalytics.classAverage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Bar dataKey="average" fill="#6d5ef6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="Student Comparison">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={teacherAnalytics.studentComparison}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar dataKey="score" stroke="#1e9f67" fill="#1e9f67" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Language Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teacherAnalytics.studentComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Bar dataKey="score" fill="#1e9f67" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Mistake Frequency">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={teacherAnalytics.mistakeFrequency}>
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

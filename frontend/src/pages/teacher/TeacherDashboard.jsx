import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/charts/ChartCard'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/teacher/dashboard')
        if (res.data?.success) {
          setData(res.data.data)
        }
      } catch (err) {
        console.warn('Failed to load teacher dashboard API:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const stats = [
    { label: 'Total Students', value: data?.totalStudents ?? 0, change: 'Enrolled' },
    { label: 'Class Average Score', value: data?.classAverageScore ? `${data.classAverageScore}%` : '0%', change: 'Across attempts' },
    { label: 'Total Reading Sessions', value: data?.totalAttempts ?? 0, change: 'Completed' },
    { label: 'Students Needing Attention', value: data?.studentsNeedingAttention?.length ?? 0, change: 'Score < 75%' },
  ]

  const languageChartData = data?.languageBreakdown?.length > 0 
    ? data.languageBreakdown.map(l => ({ language: l.language, score: Math.round(l.averageScore || 0) }))
    : [
        { language: 'English', score: 0 },
        { language: 'Hindi', score: 0 },
        { language: 'Tamil', score: 0 },
      ]

  const scoreDistData = data?.scoreDistribution ? [
    { name: '<60%', count: data.scoreDistribution.below60 || 0 },
    { name: '60-74%', count: data.scoreDistribution.between60And74 || 0 },
    { name: '75-89%', count: data.scoreDistribution.between75And89 || 0 },
    { name: '90%+', count: data.scoreDistribution.above90 || 0 },
  ] : [
    { name: '<60%', count: 0 },
    { name: '60-74%', count: 0 },
    { name: '75-89%', count: 0 },
    { name: '90%+', count: 0 },
  ]

  const studentsNeedingAttention = data?.studentsNeedingAttention || []
  const recentAttempts = data?.recentAttempts || []

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.name || 'Teacher'}`}
        subtitle="Monitor your students' reading progress and help them improve."
        actions={
          <>
            <Button onClick={() => navigate('/teacher/students')}>View Students</Button>
            <Button variant="secondary" onClick={() => navigate('/teacher/analytics')}>View Analytics</Button>
          </>
        }
      />

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>

      <div className="grid-2">
        <ChartCard title="Score Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5efe8" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="count" fill="#2E8C5C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Language Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={languageChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5efe8" />
              <XAxis dataKey="language" />
              <YAxis domain={[0, 100]} />
              <Bar dataKey="score" fill="#4CB582" radius={[8, 8, 0, 0]} />
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
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentsNeedingAttention.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                      No students currently flagged as needing attention.
                    </td>
                  </tr>
                ) : (
                  studentsNeedingAttention.slice(0, 4).map((student) => (
                    <tr key={student.studentId || student._id}>
                      <td>{student.studentName || student.name || 'Student'}</td>
                      <td>{Math.round(student.averageScore || 0)}%</td>
                      <td><StatusBadge status="Needs Attention" /></td>
                      <td><Button size="sm" variant="secondary" onClick={() => navigate(`/teacher/students/${student.studentId || student._id}`)}>View</Button></td>
                    </tr>
                  ))
                )}
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
                  <th>Score</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                      No reading attempts recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentAttempts.slice(0, 4).map((attempt) => (
                    <tr key={attempt._id || attempt.id}>
                      <td>{attempt.studentName || 'Student'}</td>
                      <td>{attempt.score}%</td>
                      <td>{new Date(attempt.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button size="sm" variant="secondary" onClick={() => navigate(`/teacher/reading-attempts/${attempt._id || attempt.id}`)}>View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

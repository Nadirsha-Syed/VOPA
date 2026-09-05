import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingState from '../../components/common/LoadingState'
import ErrorState from '../../components/common/ErrorState'
import api from '../../services/api'

export default function TeacherStudentDetails() {
  const { studentId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const res = await api.get(`/teacher/students/${studentId}`)
        if (res.data?.success && res.data?.data) {
          setData(res.data.data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.warn('Could not load student performance details:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchStudentDetails()
  }, [studentId])

  if (loading) return <LoadingState message="Loading student progress details..." />
  if (error || !data) return <ErrorState message="Could not load student details. Please try again." />

  const { student, scoreHistory, improvement, weakVocabulary, activeImprovementPlans } = data

  const scoreData = (scoreHistory?.scores || []).map((score, index) => ({
    name: `A${index + 1}`,
    score,
  }))

  const totalAttempts = improvement?.totalAttempts ?? 0
  const currentScoreStr = improvement?.currentScore !== null ? `${improvement.currentScore}%` : 'No attempts'
  const improvementStr = improvement?.scoreDifference !== undefined && improvement.scoreDifference !== 0
    ? (Number(improvement.scoreDifference) > 0 ? `+${improvement.scoreDifference}%` : `${improvement.scoreDifference}%`)
    : '0%'

  const attemptsList = scoreHistory?.attempts || []
  const lastAttemptStr = attemptsList.length > 0
    ? new Date(attemptsList[attemptsList.length - 1].createdAt).toLocaleDateString()
    : 'Never'

  return (
    <div>
      <div className="row-spread" style={{ marginBottom: 20 }}>
        <Link to="/teacher/students" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>
          ← Back to Students
        </Link>
      </div>

      <PageHeader
        title={student?.name || 'Student Details'}
        subtitle={`${student?.email || ''} · Preferred Language: ${student?.preferredLanguage || 'English'} · Level: ${student?.currentLevel || 'Beginner'}`}
      />

      <div className="stats-grid">
        <StatCard label="Current Score" value={currentScoreStr} change={totalAttempts > 0 ? "Latest attempt" : "Not started"} />
        <StatCard label="Improvement" value={improvementStr} change="Score trajectory" />
        <StatCard label="Total Attempts" value={totalAttempts} change="Completed" />
        <StatCard label="Last Attempt" value={lastAttemptStr} change="Latest session" />
      </div>

      <div className="detail-layout">
        <div className="panel">
          <h3>Score Progress</h3>
          {scoreData.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', textAlign: 'center' }}>
              No score progression yet. Chart will populate once student completes reading practices.
            </div>
          ) : (
            <div className="chart-card-body" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Line type="monotone" dataKey="score" stroke="#365df5" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Weak Areas</h3>
          {(!weakVocabulary || weakVocabulary.length === 0) ? (
            <p style={{ color: '#6b7280', marginTop: 12 }}>No persistent weak areas identified yet.</p>
          ) : (
            <ul className="list">
              {weakVocabulary.map((item, idx) => (
                <li key={idx}><strong>{item.word}</strong> · {item.count} misses</li>
              ))}
            </ul>
          )}
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
                {attemptsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                      No reading attempts completed yet.
                    </td>
                  </tr>
                ) : (
                  attemptsList.map((attempt, index) => (
                    <tr key={attempt.attemptId || index}>
                      <td>{attempt.exerciseTitle || 'Reading Practice'}</td>
                      <td>{attempt.language || 'English'}</td>
                      <td>{attempt.score}%</td>
                      <td>{Array.isArray(attempt.mistakes) ? attempt.mistakes.length : (attempt.mistakes || 0)}</td>
                      <td>{new Date(attempt.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>Improvement Plan</h3>
          {(!activeImprovementPlans || activeImprovementPlans.length === 0) ? (
            <div style={{ color: '#6b7280', padding: '12px 0' }}>
              <p>No active remediation plan needed.</p>
              <small>System will generate AI recommendations when weak pronunciation or vocabulary patterns are detected.</small>
            </div>
          ) : (
            <div>
              <p><strong>Weak Areas:</strong> {activeImprovementPlans.map(p => (p.weakWords || []).join(', ')).filter(Boolean).join('; ') || 'General'}</p>
              <ul className="list">
                {activeImprovementPlans.map((plan, idx) => (
                  <li key={idx}>{plan.recommendations || 'Practice repeated reading drills daily.'}</li>
                ))}
              </ul>
              <p style={{ marginTop: 12 }}><strong>Practice Status:</strong> <StatusBadge status="In Progress" /></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

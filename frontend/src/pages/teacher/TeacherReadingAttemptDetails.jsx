import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AudioPlayer from '../../components/common/AudioPlayer'
import LoadingState from '../../components/common/LoadingState'
import ErrorState from '../../components/common/ErrorState'
import Button from '../../components/common/Button'
import api from '../../services/api'

const renderTextWithHighlights = (expected = '', recognized = '') => {
  const expectedWords = expected ? expected.split(/\s+/) : []
  const recognizedWords = recognized ? recognized.split(/\s+/) : []

  return (
    <div className="text-comparison">
      <div className="compare-block">
        <strong>Expected Text</strong>
        <p>{expectedWords.map((word, index) => {
          const recognizedWord = recognizedWords[index]
          const isMismatch = recognizedWord?.toLowerCase() !== word?.toLowerCase()
          return <span key={`${word}-${index}`} className={isMismatch ? 'wrong' : ''}> {word}</span>
        })}</p>
      </div>
      <div className="compare-block">
        <strong>Recognized Text</strong>
        <p>{recognizedWords.map((word, index) => {
          const expectedWord = expectedWords[index]
          const isMissing = expectedWord && expectedWord?.toLowerCase() !== word?.toLowerCase()
          return <span key={`${word}-${index}`} className={isMissing ? 'missing' : ''}> {word}</span>
        })}</p>
      </div>
    </div>
  )
}

export default function TeacherReadingAttemptDetails() {
  const { attemptId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await api.get(`/readings/${attemptId}`)
        if (res.data?.success && res.data?.data) {
          setData(res.data.data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.warn('Failed to load reading attempt details:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchAttempt()
  }, [attemptId])

  if (loading) return <LoadingState message="Loading reading attempt details..." />
  if (error || !data?.attempt) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Link to="/teacher/reading-attempts" className="btn btn-ghost btn-sm">← Back to Attempts</Link>
        </div>
        <ErrorState message="Could not find the requested reading attempt." />
      </div>
    )
  }

  const { attempt, improvementPlan } = data
  const studentName = attempt.studentId?.name || 'Student'
  const exerciseTitle = attempt.exerciseId?.title || 'Reading Exercise'
  const mistakesCount = Array.isArray(attempt.mistakes) ? attempt.mistakes.length : (attempt.mistakes || 0)
  const recommendations = improvementPlan?.recommendations || []
  const expectedText = attempt.expectedText || attempt.exerciseId?.text || ''
  const recognizedText = attempt.recognizedText || ''

  return (
    <div>
      <div className="row-spread" style={{ marginBottom: 20 }}>
        <Link to="/teacher/reading-attempts" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>← Back to Attempts</Link>
      </div>

      <div className="stats-grid">
        <div className="summary-card">
          <h3>Student</h3>
          <span className="summary-value">{studentName}</span>
          <small>{exerciseTitle}</small>
        </div>
        <div className="summary-card">
          <h3>Score</h3>
          <span className="summary-value">{attempt.score ?? 0}%</span>
          <small>{mistakesCount} mistakes</small>
        </div>
        <div className="summary-card">
          <h3>Language</h3>
          <span className="summary-value">{attempt.language || 'English'}</span>
          <small>{new Date(attempt.createdAt).toLocaleDateString()}</small>
        </div>
      </div>

      <div className="detail-layout">
        <div className="panel">
          <h3>Text Comparison</h3>
          {renderTextWithHighlights(expectedText, recognizedText)}
        </div>

        <div className="panel">
          <h3>Score Card</h3>
          <div className="kpi-box">
            <span>Overall Score</span>
            <strong>{attempt.score ?? 0}%</strong>
          </div>
          <div className="kpi-box" style={{ marginTop: 12 }}>
            <span>Mistakes</span>
            <strong>{mistakesCount}</strong>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="panel">
          <h3>Feedback</h3>
          <p>{attempt.feedback || 'Reading evaluated.'}</p>
          {attempt.audioReference && (
            <div style={{ marginTop: 12 }}>
              <audio controls src={attempt.audioReference} style={{ width: '100%' }}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Improvement Recommendations</h3>
          {recommendations.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No specific remediation required for this session.</p>
          ) : (
            <ul className="list">
              {recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

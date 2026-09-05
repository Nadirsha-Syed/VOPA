import { Link, useParams } from 'react-router-dom'
import AudioPlayer from '../../components/common/AudioPlayer'
import Button from '../../components/common/Button'
import { readingAttempts } from '../../data/teacherMockData'

const renderTextWithHighlights = (expected, recognized) => {
  const expectedWords = expected.split(' ')
  const recognizedWords = recognized.split(' ')

  return (
    <div className="text-comparison">
      <div className="compare-block">
        <strong>Expected Text</strong>
        <p>{expectedWords.map((word, index) => {
          const recognizedWord = recognizedWords[index]
          const isMismatch = recognizedWord !== word
          return <span key={`${word}-${index}`} className={isMismatch ? 'wrong' : ''}> {word}</span>
        })}</p>
      </div>
      <div className="compare-block">
        <strong>Recognized Text</strong>
        <p>{recognizedWords.map((word, index) => {
          const expectedWord = expectedWords[index]
          const isMissing = expectedWord && expectedWord !== word
          return <span key={`${word}-${index}`} className={isMissing ? 'missing' : ''}> {word}</span>
        })}</p>
      </div>
    </div>
  )
}

export default function TeacherReadingAttemptDetails() {
  const { attemptId } = useParams()
  const attempt = readingAttempts.find((item) => item.id === attemptId) || readingAttempts[0]

  return (
    <div>
      <div className="row-spread" style={{ marginBottom: 20 }}>
        <Link to="/teacher/reading-attempts" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>← Back to Attempts</Link>
      </div>

      <div className="stats-grid">
        <div className="summary-card">
          <h3>Student</h3>
          <span className="summary-value">{attempt.student}</span>
          <small>{attempt.exercise}</small>
        </div>
        <div className="summary-card">
          <h3>Score</h3>
          <span className="summary-value">{attempt.score}%</span>
          <small>{attempt.mistakes} mistakes</small>
        </div>
        <div className="summary-card">
          <h3>Language</h3>
          <span className="summary-value">{attempt.language}</span>
          <small>{attempt.date}</small>
        </div>
      </div>

      <div className="detail-layout">
        <div className="panel">
          <h3>Text Comparison</h3>
          {renderTextWithHighlights(attempt.expectedText, attempt.recognizedText)}
        </div>

        <div className="panel">
          <h3>Score Card</h3>
          <div className="kpi-box">
            <span>Overall Score</span>
            <strong>{attempt.score}%</strong>
          </div>
          <div className="kpi-box" style={{ marginTop: 12 }}>
            <span>Mistakes</span>
            <strong>{attempt.mistakes}</strong>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="panel">
          <h3>Feedback</h3>
          <p>{attempt.feedback}</p>
          <AudioPlayer transcript={attempt.pronunciationAnalysis} />
        </div>

        <div className="panel">
          <h3>Improvement Recommendations</h3>
          <ul className="list">
            <li>Practice repeated word drills for the missed phrase.</li>
            <li>Focus on a slower, clearer pronunciation for final word endings.</li>
            <li>Read the full sentence with emphasis on the keyword rhythm.</li>
          </ul>
          <div style={{ marginTop: 18 }}>
            <Button variant="secondary">Create Practice Plan</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

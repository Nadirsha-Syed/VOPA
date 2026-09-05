import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'
import { readingAttempts } from '../../data/teacherMockData'

const pageSize = 5

export default function TeacherReadingAttempts() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('all')
  const [score, setScore] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => readingAttempts.filter((attempt) => {
    const matchesQuery = attempt.student.toLowerCase().includes(query.toLowerCase())
    const matchesLanguage = language === 'all' || attempt.language === language
    const matchesScore = score === 'all' || (score === 'high' && attempt.score >= 80) || (score === 'mid' && attempt.score >= 70 && attempt.score < 80) || (score === 'low' && attempt.score < 70)
    return matchesQuery && matchesLanguage && matchesScore
  }), [query, language, score])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div>
      <PageHeader title="Reading Attempts" subtitle="Review student performance and identify learning opportunities." />

      <div className="controls-row">
        <SearchBar value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder="Search student" />
        <FilterBar
          filters={[
            { name: 'language', label: 'Language', value: language, onChange: (value) => { setLanguage(value); setPage(1) }, options: [
              { value: 'all', label: 'All' },
              { value: 'English', label: 'English' },
              { value: 'Hindi', label: 'Hindi' },
              { value: 'Tamil', label: 'Tamil' },
            ] },
            { name: 'score', label: 'Score', value: score, onChange: (value) => { setScore(value); setPage(1) }, options: [
              { value: 'all', label: 'All' },
              { value: 'high', label: 'High (80+)' },
              { value: 'mid', label: 'Medium (70-79)' },
              { value: 'low', label: 'Low (<70)' },
            ] },
          ]}
        />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Exercise</th>
              <th>Language</th>
              <th>Score</th>
              <th>Mistakes</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-table">No reading attempts match your filters.</div>
                </td>
              </tr>
            ) : (
              pageData.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.student}</td>
                  <td>{attempt.exercise}</td>
                  <td>{attempt.language}</td>
                  <td>{attempt.score}%</td>
                  <td>{attempt.mistakes}</td>
                  <td>{attempt.date}</td>
                  <td>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/teacher/reading-attempts/${attempt.id}`)}>View Details</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

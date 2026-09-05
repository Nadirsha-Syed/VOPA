import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Button from '../../components/common/Button'
import api from '../../services/api'

const pageSize = 5

export default function TeacherStudents() {
  const navigate = useNavigate()

  const [students, setStudents] = useState([])
  const [query, setQuery] = useState('')
  const [performanceFilter, setPerformanceFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/teacher/students')
        if (res.data?.success && Array.isArray(res.data?.data?.students)) {
          setStudents(res.data.data.students)
        }
      } catch (err) {
        console.warn('Could not fetch teacher students API:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesQuery = (student.name || '').toLowerCase().includes(query.toLowerCase()) ||
                           (student.email || '').toLowerCase().includes(query.toLowerCase())
      const matchesPerformance =
        performanceFilter === 'all' ||
        (performanceFilter === 'high' && student.score >= 85) ||
        (performanceFilter === 'medium' && student.score >= 70 && student.score < 85) ||
        (performanceFilter === 'low' && student.score < 70)
      const matchesLanguage = languageFilter === 'all' || student.language === languageFilter
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter

      return matchesQuery && matchesPerformance && matchesLanguage && matchesStatus
    })
  }, [students, query, performanceFilter, languageFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize))
  const pagedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <LoadingState message="Loading students..." />
  if (error) return <ErrorState message="Something went wrong while loading students." />

  return (
    <div>
      <PageHeader title="My Students" subtitle="Track progress, identify needs, and support every learner." />

      <div className="controls-row">
        <SearchBar value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder="Search student" />
        <div className="filter-bar">
          <FilterBar
            filters={[
              { name: 'performance', label: 'Performance', value: performanceFilter, onChange: (value) => { setPerformanceFilter(value); setPage(1) }, options: [
                { value: 'all', label: 'All' },
                { value: 'high', label: 'High (85+)' },
                { value: 'medium', label: 'Medium (70-84)' },
                { value: 'low', label: 'Low (<70)' },
              ] },
              { name: 'language', label: 'Language', value: languageFilter, onChange: (value) => { setLanguageFilter(value); setPage(1) }, options: [
                { value: 'all', label: 'All' },
                { value: 'English', label: 'English' },
                { value: 'Hindi', label: 'Hindi' },
                { value: 'Tamil', label: 'Tamil' },
              ] },
              { name: 'status', label: 'Status', value: statusFilter, onChange: (value) => { setStatusFilter(value); setPage(1) }, options: [
                { value: 'all', label: 'All' },
                { value: 'Performing Well', label: 'Performing Well' },
                { value: 'Improving', label: 'Improving' },
                { value: 'Needs Attention', label: 'Needs Attention' },
              ] },
            ]}
          />
        </div>
      </div>

      {pagedStudents.length === 0 ? (
        <EmptyState title="No students found" description="Try changing your search or filters." />
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Language</th>
                  <th>Current Score</th>
                  <th>Improvement</th>
                  <th>Last Attempt</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedStudents.map((student) => (
                  <tr key={student.id}>
                    <td><strong>{student.name}</strong><br /><small style={{ color: '#6b7280' }}>{student.email}</small></td>
                    <td>{student.language}</td>
                    <td>{student.totalAttempts > 0 ? `${student.score}%` : 'No attempts yet'}</td>
                    <td>{student.improvement !== undefined && student.improvement !== null ? `+${student.improvement}%` : '—'}</td>
                    <td>{student.lastAttempt}</td>
                    <td><StatusBadge status={student.status} /></td>
                    <td>
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/teacher/students/${student.id}`)}>View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

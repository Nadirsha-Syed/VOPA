import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

export default function AdminExercises() {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchExercises = async () => {
    try {
      const res = await api.get('/admin/exercises?limit=100')
      if (res.data?.success && Array.isArray(res.data?.data?.exercises)) {
        const list = res.data.data.exercises.map((e) => ({
          id: e._id,
          title: e.title,
          text: e.text || e.title,
          language: e.language || 'English',
          difficulty: e.difficulty ? (e.difficulty.charAt(0).toUpperCase() + e.difficulty.slice(1)) : 'Easy',
          category: e.category ? (e.category.charAt(0).toUpperCase() + e.category.slice(1)) : 'General',
          status: e.status === 'active' ? 'Published' : 'Draft',
          createdDate: e.createdAt ? new Date(e.createdAt).toISOString().slice(0, 10) : '2026-09-05',
        }))
        setExercises(list)
      }
    } catch (err) {
      console.warn('Error loading admin exercises:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  const filtered = useMemo(() => exercises.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(search.toLowerCase())
    const matchesLanguage = language === 'all' || exercise.language.toLowerCase() === language.toLowerCase()
    const matchesDifficulty = difficulty === 'all' || exercise.difficulty.toLowerCase() === difficulty.toLowerCase()
    const matchesCategory = category === 'all' || exercise.category.toLowerCase() === category.toLowerCase()
    const matchesStatus = status === 'all' || exercise.status === status
    return matchesSearch && matchesLanguage && matchesDifficulty && matchesCategory && matchesStatus
  }), [exercises, search, language, difficulty, category, status])

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title')?.trim()
    const readingText = formData.get('readingText')?.trim() || title
    const lang = formData.get('language') || 'English'
    const diff = formData.get('difficulty')?.toLowerCase() || 'easy'
    const cat = formData.get('category')?.toLowerCase() || 'fluency'
    const stat = formData.get('status') === 'Published' ? 'active' : 'inactive'

    try {
      if (editing) {
        await api.put(`/admin/exercises/${editing.id}`, {
          title,
          text: readingText,
          language: lang,
          difficulty: diff,
          category: cat,
          status: stat,
        })
      } else {
        await api.post('/admin/exercises', {
          title,
          text: readingText,
          language: lang,
          difficulty: diff,
          category: cat,
          status: stat,
        })
      }
      await fetchExercises()
      setOpen(false)
      setEditing(null)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save exercise')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (exercise) => {
    const newStatus = exercise.status === 'Published' ? 'inactive' : 'active'
    try {
      await api.put(`/admin/exercises/${exercise.id}`, { status: newStatus })
      setExercises((prev) =>
        prev.map((item) =>
          item.id === exercise.id ? { ...item, status: newStatus === 'active' ? 'Published' : 'Draft' } : item
        )
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update exercise status')
    }
  }

  const handleDelete = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to permanently delete this exercise?')) return
    try {
      await api.delete(`/admin/exercises/${exerciseId}?permanent=true`)
      setExercises((prev) => prev.filter((item) => item.id !== exerciseId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete exercise')
    }
  }

  if (loading) return <LoadingState message="Loading exercises..." />

  return (
    <div>
      <PageHeader
        title="Reading Exercises"
        subtitle="Manage exercise library, categories, and publication status."
        actions={<Button onClick={() => { setEditing(null); setOpen(true) }}>Add Exercise</Button>}
      />

      <div className="controls-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search exercises" />
        <FilterBar
          filters={[
            {
              name: 'language',
              label: 'Language',
              value: language,
              onChange: setLanguage,
              options: [
                { value: 'all', label: 'All' },
                { value: 'English', label: 'English' },
                { value: 'Hindi', label: 'Hindi' },
                { value: 'Tamil', label: 'Tamil' },
                { value: 'Telugu', label: 'Telugu' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'Marathi', label: 'Marathi' },
              ],
            },
            {
              name: 'difficulty',
              label: 'Difficulty',
              value: difficulty,
              onChange: setDifficulty,
              options: [
                { value: 'all', label: 'All' },
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' },
              ],
            },
            {
              name: 'category',
              label: 'Category',
              value: category,
              onChange: setCategory,
              options: [
                { value: 'all', label: 'All' },
                { value: 'Fluency', label: 'Fluency' },
                { value: 'Comprehension', label: 'Comprehension' },
                { value: 'Pronunciation', label: 'Pronunciation' },
                { value: 'General', label: 'General' },
              ],
            },
            {
              name: 'status',
              label: 'Status',
              value: status,
              onChange: setStatus,
              options: [
                { value: 'all', label: 'All' },
                { value: 'Published', label: 'Published' },
                { value: 'Draft', label: 'Draft' },
              ],
            },
          ]}
        />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Language</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No exercises match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((exercise) => (
                <tr key={exercise.id}>
                  <td><strong>{exercise.title}</strong></td>
                  <td>{exercise.language}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor:
                          exercise.difficulty === 'Easy'
                            ? '#dcfce7'
                            : exercise.difficulty === 'Medium'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          exercise.difficulty === 'Easy'
                            ? '#15803d'
                            : exercise.difficulty === 'Medium'
                            ? '#b45309'
                            : '#b91c1c',
                      }}
                    >
                      {exercise.difficulty}
                    </span>
                  </td>
                  <td>{exercise.category}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: exercise.status === 'Published' ? '#e0f2fe' : '#f3f4f6',
                        color: exercise.status === 'Published' ? '#0369a1' : '#4b5563',
                      }}
                    >
                      {exercise.status}
                    </span>
                  </td>
                  <td>{exercise.createdDate}</td>
                  <td>
                    <div className="inline-actions">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditing(exercise)
                          setOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(exercise)}
                      >
                        {exercise.status === 'Published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(exercise.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={open} title={editing ? 'Edit Exercise' : 'Add Exercise'} onClose={() => setOpen(false)}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="title">Exercise Title</label>
              <input id="title" name="title" defaultValue={editing?.title || ''} required />
            </div>
            <div className="form-field full">
              <label htmlFor="readingText">Reading Text</label>
              <textarea
                id="readingText"
                name="readingText"
                rows="5"
                defaultValue={editing?.text || ''}
                placeholder="Enter the full sentence or passage the student will read aloud..."
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="language">Language</label>
              <select id="language" name="language" defaultValue={editing?.language || 'English'}>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Spanish</option>
                <option>Marathi</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" name="difficulty" defaultValue={editing?.difficulty || 'Easy'}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" defaultValue={editing?.category || 'Fluency'}>
                <option>Fluency</option>
                <option>Comprehension</option>
                <option>Pronunciation</option>
                <option>General</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={editing?.status || 'Published'}>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
            <div className="form-field full" style={{ marginTop: 12 }}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editing ? 'Update Exercise' : 'Create Exercise'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

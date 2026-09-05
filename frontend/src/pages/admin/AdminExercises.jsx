import { useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { adminExercises } from '../../data/adminMockData'

export default function AdminExercises() {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [exercises, setExercises] = useState(adminExercises)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => exercises.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(search.toLowerCase())
    const matchesLanguage = language === 'all' || exercise.language === language
    const matchesDifficulty = difficulty === 'all' || exercise.difficulty === difficulty
    const matchesCategory = category === 'all' || exercise.category === category
    const matchesStatus = status === 'all' || exercise.status === status
    return matchesSearch && matchesLanguage && matchesDifficulty && matchesCategory && matchesStatus
  }), [exercises, search, language, difficulty, category, status])

  const handleSave = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      id: editing ? editing.id : `ex-${Date.now()}`,
      title: formData.get('title'),
      language: formData.get('language'),
      difficulty: formData.get('difficulty'),
      category: formData.get('category'),
      status: formData.get('status'),
      createdDate: editing ? editing.createdDate : new Date().toISOString().slice(0, 10),
    }

    if (editing) {
      setExercises((prev) => prev.map((item) => (item.id === editing.id ? payload : item)))
    } else {
      setExercises((prev) => [payload, ...prev])
    }
    setOpen(false)
    setEditing(null)
  }

  return (
    <div>
      <PageHeader title="Reading Exercises" subtitle="Manage exercise library, categories, and publication status." actions={<Button onClick={() => { setEditing(null); setOpen(true) }}>Add Exercise</Button>} />

      <div className="controls-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search exercises" />
        <FilterBar
          filters={[
            { name: 'language', label: 'Language', value: language, onChange: setLanguage, options: [
              { value: 'all', label: 'All' },
              { value: 'English', label: 'English' },
              { value: 'Hindi', label: 'Hindi' },
              { value: 'Tamil', label: 'Tamil' },
            ] },
            { name: 'difficulty', label: 'Difficulty', value: difficulty, onChange: setDifficulty, options: [
              { value: 'all', label: 'All' },
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' },
            ] },
            { name: 'category', label: 'Category', value: category, onChange: setCategory, options: [
              { value: 'all', label: 'All' },
              { value: 'Fluency', label: 'Fluency' },
              { value: 'Comprehension', label: 'Comprehension' },
              { value: 'Pronunciation', label: 'Pronunciation' },
            ] },
            { name: 'status', label: 'Status', value: status, onChange: setStatus, options: [
              { value: 'all', label: 'All' },
              { value: 'Published', label: 'Published' },
              { value: 'Draft', label: 'Draft' },
            ] },
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
            {filtered.map((exercise) => (
              <tr key={exercise.id}>
                <td>{exercise.title}</td>
                <td>{exercise.language}</td>
                <td>{exercise.difficulty}</td>
                <td>{exercise.category}</td>
                <td>{exercise.status}</td>
                <td>{exercise.createdDate}</td>
                <td>
                  <div className="inline-actions">
                    <Button size="sm" variant="secondary" onClick={() => { setEditing(exercise); setOpen(true) }}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => setExercises((prev) => prev.map((item) => item.id === exercise.id ? { ...item, status: 'Draft' } : item))}>Deactivate</Button>
                    <Button size="sm" variant="danger" onClick={() => setExercises((prev) => prev.filter((item) => item.id !== exercise.id))}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
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
              <textarea id="readingText" name="readingText" rows="5" defaultValue={editing ? 'Sample reading text' : ''} />
            </div>
            <div className="form-field">
              <label htmlFor="language">Language</label>
              <select id="language" name="language" defaultValue={editing?.language || 'English'}>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
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
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={editing?.status || 'Published'}>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
            <div className="form-field full">
              <Button type="submit">{editing ? 'Update Exercise' : 'Create Exercise'}</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

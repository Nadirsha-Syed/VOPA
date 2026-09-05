import { useEffect, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import LoadingState from '../../components/common/LoadingState'
import api from '../../services/api'

export default function AdminLanguages() {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const fetchLanguages = async () => {
    try {
      const res = await api.get('/admin/languages')
      if (res.data?.success && Array.isArray(res.data?.data?.languages)) {
        setLanguages(res.data.data.languages)
      }
    } catch (err) {
      console.warn('Failed to fetch languages:', err)
      setError(err.response?.data?.message || 'Failed to load languages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

  const handleToggleStatus = async (language) => {
    const newStatus = !language.enabled
    try {
      await api.put(`/admin/languages/${language._id}`, { enabled: newStatus })
      setLanguages((prev) =>
        prev.map((item) => (item._id === language._id ? { ...item, enabled: newStatus } : item))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update language status')
    }
  }

  const handleDelete = async (languageId) => {
    if (!window.confirm('Are you sure you want to delete this language?')) return
    try {
      await api.delete(`/admin/languages/${languageId}`)
      setLanguages((prev) => prev.filter((item) => item._id !== languageId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete language')
    }
  }

  const handleAddLanguage = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')?.trim()
    const code = formData.get('code')?.trim().toUpperCase()
    const enabled = formData.get('enabled') === 'Enabled'
    const providerLocale = formData.get('speechConfig')?.trim() || `${code.toLowerCase()}-IN`

    try {
      const res = await api.post('/admin/languages', {
        name,
        code,
        enabled,
        speechConfiguration: {
          provider: 'browser/default',
          locale: providerLocale,
        },
      })
      if (res.data?.success) {
        await fetchLanguages()
        setModalOpen(false)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add language')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <LoadingState message="Loading supported languages..." />

  return (
    <div>
      <PageHeader
        title="Language Management"
        subtitle="Configure language availability and speech settings for the platform."
        actions={<Button onClick={() => setModalOpen(true)}>Add Language</Button>}
      />

      {error && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Language</th>
              <th>Code</th>
              <th>Exercises</th>
              <th>Speech Configuration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {languages.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No languages configured yet.
                </td>
              </tr>
            ) : (
              languages.map((language) => {
                const speechStr =
                  typeof language.speechConfiguration === 'object'
                    ? language.speechConfiguration?.locale || language.speechConfiguration?.provider || 'Default Speech API'
                    : language.speechConfiguration || 'Default Speech API'

                return (
                  <tr key={language._id}>
                    <td><strong>{language.name}</strong></td>
                    <td><code>{language.code}</code></td>
                    <td>{language.exerciseCount ?? 0}</td>
                    <td>{speechStr}</td>
                    <td>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: language.enabled ? '#dcfce7' : '#fee2e2',
                          color: language.enabled ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {language.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleToggleStatus(language)}
                        >
                          {language.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(language._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title="Add Language" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleAddLanguage}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="langName">Language Name</label>
              <input id="langName" name="name" placeholder="e.g. Marathi, Telugu" required />
            </div>
            <div className="form-field">
              <label htmlFor="langCode">Language Code</label>
              <input id="langCode" name="code" placeholder="e.g. MR, TE" maxLength={6} required />
            </div>
            <div className="form-field">
              <label htmlFor="langEnabled">Status</label>
              <select id="langEnabled" name="enabled" defaultValue="Enabled">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="speechConfig">Speech Locale</label>
              <input id="speechConfig" name="speechConfig" placeholder="e.g. mr-IN, te-IN, es-ES" />
            </div>
            <div className="form-field full" style={{ marginTop: 12 }}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving Language...' : 'Save Language'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

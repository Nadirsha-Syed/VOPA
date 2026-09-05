import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { adminLanguages } from '../../data/adminMockData'

export default function AdminLanguages() {
  const [languages, setLanguages] = useState(adminLanguages)
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <PageHeader title="Language Management" subtitle="Configure language availability and speech settings for the platform." actions={<Button onClick={() => setModalOpen(true)}>Add Language</Button>} />

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
            {languages.map((language) => (
              <tr key={language.id}>
                <td>{language.language}</td>
                <td>{language.code}</td>
                <td>{language.exercises}</td>
                <td>{language.speechConfig}</td>
                <td>{language.status}</td>
                <td>
                  <div className="inline-actions">
                    <Button size="sm" variant="secondary" onClick={() => setLanguages((prev) => prev.map((item) => item.id === language.id ? { ...item, status: item.status === 'Enabled' ? 'Disabled' : 'Enabled' } : item))}>{language.status === 'Enabled' ? 'Disable' : 'Enable'}</Button>
                    <Button size="sm" variant="ghost">Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => setLanguages((prev) => prev.filter((item) => item.id !== language.id))}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title="Add Language" onClose={() => setModalOpen(false)}>
        <div className="form-grid">
          <div className="form-field">
            <label>Language Name</label>
            <input defaultValue="" />
          </div>
          <div className="form-field">
            <label>Language Code</label>
            <input defaultValue="" />
          </div>
          <div className="form-field">
            <label>Enabled</label>
            <select defaultValue="Enabled"><option>Enabled</option><option>Disabled</option></select>
          </div>
          <div className="form-field full">
            <label>Speech/AI Configuration</label>
            <input defaultValue="Placeholder configuration" />
          </div>
          <div className="form-field full">
            <Button onClick={() => setModalOpen(false)}>Save Language</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

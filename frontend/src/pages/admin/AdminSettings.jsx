import { useEffect, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import api from '../../services/api'

const DEFAULT_SETTINGS = {
  platformName: 'VOPA AI Literacy Platform',
  defaultLanguage: 'English',
  welcomeMessage: 'Welcome to VOPA! Practice reading and improve your literacy skills with real-time AI feedback.',
  modelName: 'whisper-large-v3',
  endpoint: 'https://api.vopa.org/v1/speech',
  speechProvider: 'Web Speech API (Native Browser)',
  enableReading: true,
  enablePronunciation: true,
  enableComprehension: true,
  studentSelfService: true,
  teacherAdminAccess: true,
  platformAnnouncements: false,
  sessionTimeout: '60 minutes',
  maintenanceMode: 'Disabled',
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('vopa_platform_settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  const [languages, setLanguages] = useState(['English', 'Hindi', 'Tamil'])
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const res = await api.get('/admin/languages')
        if (res.data?.success && Array.isArray(res.data?.data?.languages)) {
          setLanguages(res.data.data.languages.map((l) => l.name))
        }
      } catch (e) {
        console.warn('Could not load languages for settings:', e)
      }
    }
    loadLanguages()
  }, [])

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem('vopa_platform_settings', JSON.stringify(settings))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      alert('Failed to save settings to browser storage')
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure the VOPA platform, speech models, and feature availability."
      />

      {saveSuccess && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#dcfce7',
            color: '#15803d',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ✓ Platform settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid-2">
          <div className="form-card">
            <h3>Platform Settings</h3>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="form-field">
                <label htmlFor="platName">Platform Name</label>
                <input
                  id="platName"
                  value={settings.platformName}
                  onChange={(e) => handleChange('platformName', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="defLang">Default Language</label>
                <select
                  id="defLang"
                  value={settings.defaultLanguage}
                  onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="welcMsg">Welcome Message</label>
                <textarea
                  id="welcMsg"
                  rows="3"
                  value={settings.welcomeMessage}
                  onChange={(e) => handleChange('welcomeMessage', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-card">
            <h3>AI Configuration</h3>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="form-field">
                <label htmlFor="modelName">Speech AI Model</label>
                <input
                  id="modelName"
                  value={settings.modelName}
                  onChange={(e) => handleChange('modelName', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="endpoint">Speech API Endpoint</label>
                <input
                  id="endpoint"
                  value={settings.endpoint}
                  onChange={(e) => handleChange('endpoint', e.target.value)}
                />
              </div>
              <div className="form-field full">
                <label htmlFor="speechProvider">Speech Provider</label>
                <select
                  id="speechProvider"
                  value={settings.speechProvider}
                  onChange={(e) => handleChange('speechProvider', e.target.value)}
                >
                  <option value="Web Speech API (Native Browser)">Web Speech API (Native Browser)</option>
                  <option value="Google Cloud Speech-to-Text">Google Cloud Speech-to-Text</option>
                  <option value="OpenAI Whisper API">OpenAI Whisper API</option>
                  <option value="Azure Cognitive Speech">Azure Cognitive Speech</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 20 }}>
          <div className="form-card">
            <h3>Exercise Availability</h3>
            <div className="form-grid" style={{ marginTop: 12 }}>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.enableReading}
                  onChange={(e) => handleChange('enableReading', e.target.checked)}
                />{' '}
                Enable reading exercises
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.enablePronunciation}
                  onChange={(e) => handleChange('enablePronunciation', e.target.checked)}
                />{' '}
                Enable pronunciation drills
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.enableComprehension}
                  onChange={(e) => handleChange('enableComprehension', e.target.checked)}
                />{' '}
                Enable comprehension tasks
              </label>
            </div>
          </div>

          <div className="form-card">
            <h3>User Access</h3>
            <div className="form-grid" style={{ marginTop: 12 }}>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.studentSelfService}
                  onChange={(e) => handleChange('studentSelfService', e.target.checked)}
                />{' '}
                Student self-registration
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.teacherAdminAccess}
                  onChange={(e) => handleChange('teacherAdminAccess', e.target.checked)}
                />{' '}
                Teacher portal access
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.platformAnnouncements}
                  onChange={(e) => handleChange('platformAnnouncements', e.target.checked)}
                />{' '}
                Platform-wide announcements banner
              </label>
            </div>
          </div>
        </div>

        <div className="form-card" style={{ marginTop: 20 }}>
          <h3>System Configuration</h3>
          <div className="form-grid" style={{ marginTop: 14 }}>
            <div className="form-field">
              <label htmlFor="timeout">Session Timeout</label>
              <input
                id="timeout"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="maint">Maintenance Mode</label>
              <select
                id="maint"
                value={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.value)}
              >
                <option value="Disabled">Disabled</option>
                <option value="Enabled">Enabled</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Button type="submit">Save Settings</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

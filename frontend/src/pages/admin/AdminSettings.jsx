import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'

export default function AdminSettings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure the VOPA platform without exposing live secrets or API keys." />

      <div className="grid-2">
        <div className="form-card">
          <h3>Platform Settings</h3>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="form-field"><label>Platform Name</label><input defaultValue="VOPA AI Literacy Platform" /></div>
            <div className="form-field"><label>Default Language</label><select defaultValue="English"><option>English</option><option>Hindi</option><option>Tamil</option></select></div>
            <div className="form-field full"><label>Welcome Message</label><textarea rows="3" defaultValue="Welcome to VOPA!" /></div>
          </div>
        </div>

        <div className="form-card">
          <h3>AI Configuration</h3>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="form-field"><label>Model Name</label><input defaultValue="placeholder-model-name" /></div>
            <div className="form-field"><label>Endpoint</label><input defaultValue="https://api.example.com" /></div>
            <div className="form-field full"><label>API Key</label><input type="password" defaultValue="••••••••••••••" /></div>
            <div className="form-field full"><label>Speech Provider</label><select defaultValue="Placeholder Provider"><option>Placeholder Provider</option><option>Alternative Provider</option></select></div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="form-card">
          <h3>Exercise Availability</h3>
          <div className="form-grid" style={{ marginTop: 12 }}>
            <label className="checkbox-row"><input type="checkbox" defaultChecked /> Enable reading exercises</label>
            <label className="checkbox-row"><input type="checkbox" defaultChecked /> Enable pronunciation drills</label>
            <label className="checkbox-row"><input type="checkbox" defaultChecked /> Enable comprehension tasks</label>
          </div>
        </div>

        <div className="form-card">
          <h3>User Access</h3>
          <div className="form-grid" style={{ marginTop: 12 }}>
            <label className="checkbox-row"><input type="checkbox" defaultChecked /> Student self-service</label>
            <label className="checkbox-row"><input type="checkbox" defaultChecked /> Teacher admin access</label>
            <label className="checkbox-row"><input type="checkbox" /> Platform-wide announcements</label>
          </div>
        </div>
      </div>

      <div className="form-card" style={{ marginTop: 20 }}>
        <h3>System Configuration</h3>
        <div className="form-grid" style={{ marginTop: 14 }}>
          <div className="form-field"><label>Session Timeout</label><input defaultValue="30 minutes" /></div>
          <div className="form-field"><label>Maintenance Mode</label><select defaultValue="Disabled"><option>Disabled</option><option>Enabled</option></select></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}

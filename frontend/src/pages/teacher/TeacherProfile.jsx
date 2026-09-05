import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { teacherProfile } from '../../data/teacherMockData'

export default function TeacherProfile() {
  return (
    <div>
      <PageHeader title="Teacher Profile" subtitle="Keep your classroom profile and preferences up to date." />

      <div className="grid-2">
        <div className="profile-card">
          <div className="avatar">{teacherProfile.avatar}</div>
          <h3>{teacherProfile.name}</h3>
          <p>{teacherProfile.email}</p>
          <div className="list-grid" style={{ marginTop: 16 }}>
            <div className="kpi-box">
              <span>Role</span>
              <strong>{teacherProfile.role}</strong>
            </div>
            <div className="kpi-box">
              <span>Assigned Students</span>
              <strong>{teacherProfile.assignedStudents}</strong>
            </div>
            <div className="kpi-box">
              <span>Preferred Language</span>
              <strong>{teacherProfile.preferredLanguage}</strong>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Edit Profile</h3>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="form-field">
              <label htmlFor="teacher-name">Name</label>
              <input id="teacher-name" defaultValue={teacherProfile.name} />
            </div>
            <div className="form-field">
              <label htmlFor="teacher-email">Email</label>
              <input id="teacher-email" defaultValue={teacherProfile.email} />
            </div>
            <div className="form-field">
              <label htmlFor="teacher-role">Role</label>
              <input id="teacher-role" defaultValue={teacherProfile.role} />
            </div>
            <div className="form-field">
              <label htmlFor="teacher-language">Preferred Language</label>
              <input id="teacher-language" defaultValue={teacherProfile.preferredLanguage} />
            </div>
            <div className="form-field full">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

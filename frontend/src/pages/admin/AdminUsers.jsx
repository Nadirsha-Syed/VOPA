import { useMemo, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Pagination from '../../components/common/Pagination'
import { adminUsers } from '../../data/adminMockData'
import api from '../../services/api'

const pageSize = 5

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [isUserModalOpen, setUserModalOpen] = useState(false)
  const [mode, setMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [users, setUsers] = useState(adminUsers)

  const filtered = useMemo(() => users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  }), [users, search, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleSaveUser = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const roleVal = formData.get('role')?.toLowerCase() || 'student'
    const nameVal = formData.get('name')
    const emailVal = formData.get('email')
    const passwordVal = formData.get('password') || 'Password@123'
    const langVal = formData.get('preferredLanguage') || 'English'
    const statusVal = formData.get('status') || 'Active'

    try {
      if (mode === 'create') {
        const res = await api.post('/admin/users', {
          name: nameVal,
          email: emailVal,
          password: passwordVal,
          role: roleVal,
          preferredLanguage: langVal,
        })
        const created = res.data?.data?.user
        const payload = {
          id: created?._id || `usr-${Date.now()}`,
          name: nameVal,
          email: emailVal,
          role: formData.get('role'),
          preferredLanguage: langVal,
          status: statusVal,
          createdDate: new Date().toISOString().slice(0, 10),
        }
        setUsers((prev) => [payload, ...prev])
      } else {
        const payload = {
          id: selectedUser ? selectedUser.id : `usr-${Date.now()}`,
          name: nameVal,
          email: emailVal,
          role: formData.get('role'),
          preferredLanguage: langVal,
          status: statusVal,
          createdDate: selectedUser ? selectedUser.createdDate : new Date().toISOString().slice(0, 10),
        }
        setUsers((prev) => prev.map((item) => (item.id === selectedUser.id ? payload : item)))
      }
    } catch (err) {
      console.warn('API user create fallback to local state:', err)
      const payload = {
        id: selectedUser ? selectedUser.id : `usr-${Date.now()}`,
        name: nameVal,
        email: emailVal,
        role: formData.get('role'),
        preferredLanguage: langVal,
        status: statusVal,
        createdDate: selectedUser ? selectedUser.createdDate : new Date().toISOString().slice(0, 10),
      }
      if (selectedUser) {
        setUsers((prev) => prev.map((item) => (item.id === selectedUser.id ? payload : item)))
      } else {
        setUsers((prev) => [payload, ...prev])
      }
    }

    setUserModalOpen(false)
    setSelectedUser(null)
  }

  const openCreateModal = () => {
    setMode('create');
    setSelectedUser(null);
    setUserModalOpen(true)
  }

  const openEditModal = (user) => {
    setMode('edit');
    setSelectedUser(user);
    setUserModalOpen(true)
  }

  const deactivateUser = (user) => {
    setSelectedUser(user)
    setConfirmOpen(true)
  }

  const confirmDeactivate = () => {
    if (selectedUser) {
      setUsers((prev) => prev.map((user) => user.id === selectedUser.id ? { ...user, status: 'Inactive' } : user))
    }
    setConfirmOpen(false)
    setSelectedUser(null)
  }

  return (
    <div>
      <PageHeader title="User Management" subtitle="Review user access, role assignments, and platform account health." actions={<Button onClick={openCreateModal}>Add User</Button>} />

      <div className="controls-row">
        <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search users" />
        <FilterBar
          filters={[
            { name: 'role', label: 'Role', value: roleFilter, onChange: (value) => { setRoleFilter(value); setPage(1) }, options: [
              { value: 'all', label: 'All' },
              { value: 'Student', label: 'Student' },
              { value: 'Teacher', label: 'Teacher' },
              { value: 'Admin', label: 'Admin' },
            ] },
            { name: 'status', label: 'Status', value: statusFilter, onChange: (value) => { setStatusFilter(value); setPage(1) }, options: [
              { value: 'all', label: 'All' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ] },
          ]}
        />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Preferred Language</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.preferredLanguage}</td>
                <td>{user.status}</td>
                <td>{user.createdDate}</td>
                <td>
                  <div className="inline-actions">
                    <Button size="sm" variant="secondary" onClick={() => openEditModal(user)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => deactivateUser(user)}>Deactivate</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal isOpen={isUserModalOpen} title={mode === 'create' ? 'Add User' : 'Edit User'} onClose={() => setUserModalOpen(false)}>
        <form onSubmit={handleSaveUser}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" defaultValue={selectedUser?.name || ''} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" defaultValue={selectedUser?.email || ''} required />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue={selectedUser?.role || 'Student'}>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="preferredLanguage">Preferred Language</label>
              <select id="preferredLanguage" name="preferredLanguage" defaultValue={selectedUser?.preferredLanguage || 'English'}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={selectedUser?.status || 'Active'}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-field full">
              <Button type="submit">{mode === 'create' ? 'Save User' : 'Update User'}</Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isConfirmOpen} title="Confirm Deactivation" onClose={() => setConfirmOpen(false)}>
        <p>Are you sure you want to deactivate {selectedUser?.name}?</p>
        <div className="inline-actions" style={{ marginTop: 20 }}>
          <Button variant="danger" onClick={confirmDeactivate}>Deactivate</Button>
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

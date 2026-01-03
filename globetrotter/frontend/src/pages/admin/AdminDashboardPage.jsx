import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import './AdminDashboardPage.css'

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [userSearch, setUserSearch] = useState('')
    const [userRole, setUserRole] = useState('all')

    useEffect(() => { loadData() }, [])
    useEffect(() => { loadUsers() }, [userSearch, userRole])

    const loadData = async () => {
        try {
            const [analyticsRes, usersRes] = await Promise.all([
                adminAPI.getAnalytics(),
                adminAPI.getUsers({})
            ])
            setAnalytics(analyticsRes.analytics)
            setUsers(usersRes.users || [])
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const loadUsers = async () => {
        try {
            const res = await adminAPI.getUsers({ search: userSearch, role: userRole })
            setUsers(res.users || [])
        } catch (e) { console.error(e) }
    }

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await adminAPI.updateUser(userId, { role: newRole })
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        } catch (e) { console.error(e) }
    }

    const handleDeleteUser = async (userId) => {
        if (!confirm('Delete this user?')) return
        try {
            await adminAPI.deleteUser(userId)
            setUsers(users.filter(u => u.id !== userId))
        } catch (e) { console.error(e) }
    }

    if (loading) return <div className="page"><div className="loading-spinner"></div></div>

    const a = analytics || {}

    return (
        <div className="page admin-page">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card gradient">
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">{a.users?.total || 0}</p>
                    <p className="stat-sub">+{a.users?.newThisMonth || 0} this month</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Trips</p>
                    <p className="stat-value">{a.trips?.total || 0}</p>
                    <p className="stat-sub">+{a.trips?.thisMonth || 0} this month</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Avg Duration</p>
                    <p className="stat-value">{a.trips?.averageDuration || 0} days</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Avg Budget</p>
                    <p className="stat-value">${a.trips?.averageBudget || 0}</p>
                </div>
            </div>

            {/* Popular Destinations */}
            <div className="card mt-lg">
                <div className="card-header"><h3>Popular Destinations</h3></div>
                <div className="card-body">
                    <div className="popular-dests-list">
                        {a.popularDestinations?.slice(0, 5).map((dest, i) => (
                            <div key={i} className="popular-dest-item">
                                <span className="rank">{i + 1}</span>
                                <span className="name">{dest.city}, {dest.country}</span>
                                <span className="count">{dest.count} trips</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Management */}
            <div className="card mt-lg">
                <div className="card-header">
                    <h3>User Management</h3>
                </div>
                <div className="card-body">
                    <div className="search-filters mb-lg">
                        <input className="form-input" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                        <select className="form-select" value={userRole} onChange={e => setUserRole(e.target.value)}>
                            <option value="all">All Roles</option>
                            <option value="user">Users</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>

                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Trips</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select className="form-select" value={user.role} onChange={e => handleUpdateRole(user.id, e.target.value)}>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>{user.tripCount}</td>
                                    <td>
                                        <button onClick={() => handleDeleteUser(user.id)} className="btn btn-ghost btn-sm text-error">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

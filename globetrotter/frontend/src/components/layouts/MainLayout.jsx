import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './MainLayout.css'

export default function MainLayout() {
    const { user, logout, isAdmin, isDemo } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/trips', label: 'My Trips', icon: '✈️' },
        { path: '/search/cities', label: 'Explore Cities', icon: '🌍' },
        { path: '/search/activities', label: 'Find Activities', icon: '🎯' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ]

    if (isAdmin) {
        navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' })
    }

    return (
        <div className="main-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="sidebar-logo">
                        <span className="logo-icon">🌍</span>
                        <span className="logo-text">GlobeTrotter</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {isDemo && (
                        <div className="demo-badge">
                            <span>🎭</span>
                            <span>Demo Mode</span>
                        </div>
                    )}

                    <div className="user-menu">
                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                            <p className="user-name">{user?.name || 'User'}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}

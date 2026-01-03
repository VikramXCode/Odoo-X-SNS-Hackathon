import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { tripsAPI, citiesAPI } from '../services/api'
import './DashboardPage.css'

export default function DashboardPage() {
    const { user, isDemo } = useAuth()
    const [trips, setTrips] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalTrips: 0,
        upcomingTrips: 0,
        destinations: 0,
        totalBudget: 0
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [tripsRes, citiesRes] = await Promise.all([
                tripsAPI.getAll(),
                citiesAPI.getPopular()
            ])

            setTrips(tripsRes.trips?.slice(0, 4) || [])
            setCities(citiesRes.cities || [])

            // Calculate stats
            const allTrips = tripsRes.trips || []
            const now = new Date()

            const upcoming = allTrips.filter(t => new Date(t.startDate) > now)
            const totalDests = allTrips.reduce((acc, t) => acc + (t.stops?.length || 0), 0)
            const totalBudget = allTrips.reduce((acc, t) => {
                const tripBudget = (t.budget?.food || 0) + (t.budget?.miscellaneous || 0) +
                    (t.stops || []).reduce((s, stop) =>
                        s + (stop.accommodation?.cost || 0) + (stop.transport?.cost || 0) +
                        (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0)
                return acc + tripBudget
            }, 0)

            setStats({
                totalTrips: allTrips.length,
                upcomingTrips: upcoming.length,
                destinations: totalDests,
                totalBudget
            })
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getFirstName = () => {
        return user?.name?.split(' ')[0] || 'Traveler'
    }

    const formatBudget = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="page">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="page dashboard">
            {/* Welcome Section */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {getFirstName()}! 👋</h1>
                    <p className="text-muted">Ready for your next adventure?</p>
                </div>
                <Link to="/trips/new" className="btn btn-primary btn-lg">
                    <span>✈️</span>
                    <span>Plan New Trip</span>
                </Link>
            </div>

            {/* Demo Notice */}
            {isDemo && (
                <div className="alert alert-info">
                    <span>🎭</span>
                    <span>You're using demo mode. Changes won't be saved permanently.</span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card gradient">
                    <p className="stat-label">Total Trips</p>
                    <p className="stat-value">{stats.totalTrips}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Upcoming Trips</p>
                    <p className="stat-value">{stats.upcomingTrips}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Destinations</p>
                    <p className="stat-value">{stats.destinations}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Budget</p>
                    <p className="stat-value">{formatBudget(stats.totalBudget)}</p>
                </div>
            </div>

            {/* Recent Trips */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Recent Trips</h2>
                    <Link to="/trips" className="btn btn-ghost">View All →</Link>
                </div>

                {trips.length > 0 ? (
                    <div className="trips-grid">
                        {trips.map(trip => (
                            <Link to={`/trips/${trip._id}`} key={trip._id} className="trip-card">
                                <div className="trip-card-image">
                                    <img
                                        src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                                        alt={trip.name}
                                    />
                                    <span className={`trip-status badge badge-${getStatusColor(trip.status)}`}>
                                        {trip.status}
                                    </span>
                                </div>
                                <div className="trip-card-content">
                                    <h3 className="trip-name">{trip.name}</h3>
                                    <p className="trip-dates">
                                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                    </p>
                                    <div className="trip-meta">
                                        <span>📍 {trip.stops?.length || 0} stops</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p className="empty-state-icon">🗺️</p>
                        <h3 className="empty-state-title">No trips yet</h3>
                        <p className="empty-state-text">Start planning your first adventure!</p>
                        <Link to="/trips/new" className="btn btn-primary">Create Trip</Link>
                    </div>
                )}
            </section>

            {/* Popular Destinations */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Popular Destinations</h2>
                    <Link to="/search/cities" className="btn btn-ghost">Explore All →</Link>
                </div>

                <div className="cities-grid">
                    {cities.map(city => (
                        <div key={city._id} className="city-card">
                            <div className="city-card-image">
                                <img src={city.image} alt={city.name} />
                            </div>
                            <div className="city-card-content">
                                <h3>{city.name}</h3>
                                <p>{city.country}</p>
                                <span className="city-cost">
                                    {'$'.repeat(city.costIndex)} • ~{formatBudget(city.averageDailyCost)}/day
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <Link to="/trips/new" className="quick-action-card">
                        <span className="quick-action-icon">✈️</span>
                        <span className="quick-action-label">New Trip</span>
                    </Link>
                    <Link to="/search/cities" className="quick-action-card">
                        <span className="quick-action-icon">🌍</span>
                        <span className="quick-action-label">Find Cities</span>
                    </Link>
                    <Link to="/search/activities" className="quick-action-card">
                        <span className="quick-action-icon">🎯</span>
                        <span className="quick-action-label">Browse Activities</span>
                    </Link>
                    <Link to="/profile" className="quick-action-card">
                        <span className="quick-action-icon">👤</span>
                        <span className="quick-action-label">My Profile</span>
                    </Link>
                </div>
            </section>
        </div>
    )
}

function getStatusColor(status) {
    const colors = {
        draft: 'gray',
        planned: 'primary',
        ongoing: 'success',
        completed: 'success',
        cancelled: 'error'
    }
    return colors[status] || 'gray'
}

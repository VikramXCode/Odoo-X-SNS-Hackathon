import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tripsAPI } from '../../services/api'
import './TripsPage.css'

export default function TripsPage() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [deleteModal, setDeleteModal] = useState(null)

    const filters = ['all', 'draft', 'planned', 'ongoing', 'completed']

    useEffect(() => {
        loadTrips()
    }, [filter])

    const loadTrips = async () => {
        try {
            const res = await tripsAPI.getAll(filter)
            setTrips(res.trips || [])
        } catch (error) {
            console.error('Failed to load trips:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await tripsAPI.delete(id)
            setTrips(trips.filter(t => t._id !== id))
            setDeleteModal(null)
        } catch (error) {
            console.error('Failed to delete trip:', error)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatBudget = (trip) => {
        const total = (trip.budget?.food || 0) + (trip.budget?.miscellaneous || 0) +
            (trip.stops || []).reduce((s, stop) =>
                s + (stop.accommodation?.cost || 0) + (stop.transport?.cost || 0) +
                (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0)
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(total)
    }

    const getStatusColor = (status) => {
        const colors = { draft: 'gray', planned: 'primary', ongoing: 'success', completed: 'success', cancelled: 'error' }
        return colors[status] || 'gray'
    }

    if (loading) {
        return <div className="page"><div className="loading-spinner"></div></div>
    }

    return (
        <div className="page trips-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Trips</h1>
                    <p className="page-subtitle">Manage and track all your travel plans</p>
                </div>
                <Link to="/trips/new" className="btn btn-primary">
                    <span>+</span> New Trip
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="tabs">
                {filters.map(f => (
                    <button
                        key={f}
                        className={`tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Trips List */}
            {trips.length > 0 ? (
                <div className="trips-list">
                    {trips.map(trip => (
                        <div key={trip._id} className="trip-list-item">
                            <div className="trip-thumbnail">
                                <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'} alt={trip.name} />
                            </div>

                            <div className="trip-info">
                                <div className="trip-header">
                                    <h3>{trip.name}</h3>
                                    <span className={`badge badge-${getStatusColor(trip.status)}`}>
                                        {trip.status}
                                    </span>
                                </div>
                                {trip.description && (
                                    <p className="trip-description">{trip.description}</p>
                                )}
                                <div className="trip-meta">
                                    <span>📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                                    <span>📍 {trip.stops?.length || 0} destinations</span>
                                    <span>💰 {formatBudget(trip)}</span>
                                </div>
                            </div>

                            <div className="trip-actions">
                                <Link to={`/trips/${trip._id}`} className="btn btn-secondary btn-sm">View</Link>
                                <Link to={`/trips/${trip._id}/itinerary`} className="btn btn-primary btn-sm">Edit Itinerary</Link>
                                <button onClick={() => setDeleteModal(trip)} className="btn btn-ghost btn-sm text-error">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p className="empty-state-icon">🗺️</p>
                    <h3 className="empty-state-title">No trips found</h3>
                    <p className="empty-state-text">
                        {filter === 'all' ? "Start planning your first adventure!" : `No ${filter} trips yet.`}
                    </p>
                    {filter === 'all' && <Link to="/trips/new" className="btn btn-primary">Create Trip</Link>}
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Delete Trip</h3>
                            <button className="modal-close" onClick={() => setDeleteModal(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{deleteModal.name}</strong>?</p>
                            <p className="text-muted text-sm mt-sm">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setDeleteModal(null)} className="btn btn-secondary">Cancel</button>
                            <button onClick={() => handleDelete(deleteModal._id)} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

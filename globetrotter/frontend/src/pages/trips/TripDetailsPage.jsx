import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripsAPI } from '../../services/api'
import './TripDetailsPage.css'

export default function TripDetailsPage() {
    const { id } = useParams()
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareUrl, setShareUrl] = useState('')

    useEffect(() => {
        loadTrip()
    }, [id])

    const loadTrip = async () => {
        try {
            const res = await tripsAPI.getOne(id)
            setTrip(res.trip)
            if (res.trip.isPublic && res.trip.shareId) {
                setShareUrl(`${window.location.origin}/shared/${res.trip.shareId}`)
            }
        } catch (error) {
            console.error('Failed to load trip:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleShare = async () => {
        try {
            const res = await tripsAPI.share(id)
            setShareUrl(res.shareUrl)
            navigator.clipboard.writeText(res.shareUrl)
            alert('Share link copied to clipboard!')
        } catch (error) {
            console.error('Failed to share:', error)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    }

    const formatBudget = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
    }

    const calculateBudgets = () => {
        if (!trip) return { total: 0, accommodation: 0, transport: 0, activities: 0 }

        let accommodation = 0, transport = 0, activities = 0

            (trip.stops || []).forEach(stop => {
                accommodation += stop.accommodation?.cost || 0
                transport += stop.transport?.cost || 0
                    ; (stop.activities || []).forEach(act => activities += act.cost || 0)
            })

        const total = accommodation + transport + activities + (trip.budget?.food || 0) + (trip.budget?.miscellaneous || 0)
        return { total, accommodation, transport, activities }
    }

    const getDuration = () => {
        if (!trip) return 0
        const start = new Date(trip.startDate)
        const end = new Date(trip.endDate)
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    }

    const getStatusColor = (status) => {
        const colors = { draft: 'gray', planned: 'primary', ongoing: 'success', completed: 'success', cancelled: 'error' }
        return colors[status] || 'gray'
    }

    if (loading) return <div className="page"><div className="loading-spinner"></div></div>
    if (!trip) return <div className="page"><p>Trip not found</p></div>

    const budgets = calculateBudgets()

    return (
        <div className="trip-details-page">
            {/* Hero */}
            <div className="trip-hero" style={{ backgroundImage: `url(${trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'})` }}>
                <div className="trip-hero-overlay">
                    <div className="trip-hero-content">
                        <span className={`badge badge-${getStatusColor(trip.status)}`}>{trip.status}</span>
                        <h1>{trip.name}</h1>
                        <div className="trip-hero-meta">
                            <span>📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                            <span>📍 {trip.stops?.length || 0} destinations</span>
                            <span>⏱️ {getDuration()} days</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="page trip-details-content">
                <div className="trip-actions-bar">
                    <div className="flex gap-sm">
                        <Link to={`/trips/${id}/itinerary`} className="btn btn-primary">Build Itinerary</Link>
                        <Link to={`/trips/${id}/view`} className="btn btn-secondary">View Itinerary</Link>
                        <Link to={`/trips/${id}/budget`} className="btn btn-secondary">Budget</Link>
                        <Link to={`/trips/${id}/calendar`} className="btn btn-secondary">Calendar</Link>
                        <Link to={`/trips/${id}/edit`} className="btn btn-ghost">Edit Details</Link>
                    </div>
                    <Link to="/trips" className="btn btn-ghost">← Back to Trips</Link>
                </div>

                {/* Overview & Budget */}
                <div className="trip-overview-grid">
                    <div className="card">
                        <div className="card-header"><h3>Overview</h3></div>
                        <div className="card-body">
                            <p>{trip.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><h3>Budget Summary</h3></div>
                        <div className="card-body">
                            <div className="budget-breakdown">
                                <div className="budget-item"><span>Total</span><strong>{formatBudget(budgets.total)}</strong></div>
                                <div className="budget-item"><span>Accommodation</span><span>{formatBudget(budgets.accommodation)}</span></div>
                                <div className="budget-item"><span>Transport</span><span>{formatBudget(budgets.transport)}</span></div>
                                <div className="budget-item"><span>Activities</span><span>{formatBudget(budgets.activities)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Destinations */}
                <div className="card mt-lg">
                    <div className="card-header"><h3>Destinations</h3></div>
                    <div className="card-body">
                        {trip.stops?.length > 0 ? (
                            <div className="destinations-timeline">
                                {trip.stops.map((stop, i) => (
                                    <div key={stop._id} className="timeline-item">
                                        <div className="timeline-marker">
                                            <span>{i + 1}</span>
                                        </div>
                                        <div className="timeline-content">
                                            <h4>{stop.cityName}</h4>
                                            <p className="text-muted text-sm">{stop.country} • {formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</p>
                                            {stop.activities?.length > 0 && (
                                                <p className="text-sm mt-sm">🎯 {stop.activities.length} activities planned</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No destinations added yet. <Link to={`/trips/${id}/itinerary`}>Start building your itinerary</Link></p>
                        )}
                    </div>
                </div>

                {/* Share */}
                <div className="card mt-lg">
                    <div className="card-header"><h3>Share Trip</h3></div>
                    <div className="card-body">
                        <p className="text-muted mb-md">Generate a public link to share your trip itinerary with friends and family.</p>
                        {shareUrl ? (
                            <div className="share-url-box">
                                <input type="text" readOnly value={shareUrl} className="form-input" />
                                <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Copied!'); }} className="btn btn-primary">Copy</button>
                            </div>
                        ) : (
                            <button onClick={handleShare} className="btn btn-secondary">Generate Share Link</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

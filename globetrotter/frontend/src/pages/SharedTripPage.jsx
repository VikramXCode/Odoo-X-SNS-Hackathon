import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { publicAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './SharedTripPage.css'

export default function SharedTripPage() {
    const { shareId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => { loadTrip() }, [shareId])

    const loadTrip = async () => {
        try {
            const res = await publicAPI.getSharedTrip(shareId)
            setTrip(res.trip)
        } catch (e) {
            setError('Trip not found or not shared')
        }
        finally { setLoading(false) }
    }

    const handleCopy = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        try {
            const res = await publicAPI.copyTrip(shareId)
            navigate(`/trips/${res.trip._id}`)
        } catch (e) { alert('Failed to copy trip') }
    }

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const formatBudget = () => {
        if (!trip) return '$0'
        let total = (trip.budget?.food || 0) + (trip.budget?.miscellaneous || 0)
            ; (trip.stops || []).forEach(s => {
                total += (s.accommodation?.cost || 0) + (s.transport?.cost || 0)
                    ; (s.activities || []).forEach(a => total += a.cost || 0)
            })
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(total)
    }

    if (loading) return <div className="shared-page"><div className="loading-spinner"></div></div>
    if (error) return <div className="shared-page"><div className="error-state"><h2>😕 {error}</h2><Link to="/login" className="btn btn-primary mt-lg">Sign In</Link></div></div>

    return (
        <div className="shared-page">
            <header className="shared-header">
                <div className="shared-header-content">
                    <Link to="/" className="shared-logo">🌍 GlobeTrotter</Link>
                    <div className="shared-header-actions">
                        {user ? (
                            <button onClick={handleCopy} className="btn btn-primary">📋 Copy to My Trips</button>
                        ) : (
                            <Link to="/login" className="btn btn-secondary">Sign In</Link>
                        )}
                    </div>
                </div>
            </header>

            <div className="shared-hero" style={{ backgroundImage: `url(${trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'})` }}>
                <div className="shared-hero-overlay">
                    <h1>{trip.name}</h1>
                    <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                </div>
            </div>

            <div className="shared-content">
                {trip.description && (
                    <div className="card mb-lg">
                        <div className="card-body">
                            <p>{trip.description}</p>
                        </div>
                    </div>
                )}

                <h2 className="mb-md">Itinerary</h2>
                {trip.stops?.map((stop, i) => (
                    <div key={stop._id} className="card mb-md">
                        <div className="card-header">
                            <strong>{i + 1}. {stop.cityName}</strong>, {stop.country}
                            <span className="text-muted text-sm" style={{ marginLeft: 'auto' }}>
                                {formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}
                            </span>
                        </div>
                        <div className="card-body">
                            {stop.accommodation?.name && <p className="text-sm mb-sm">🏨 {stop.accommodation.name}</p>}
                            {stop.activities?.length > 0 && (
                                <div className="shared-activities">
                                    {stop.activities.map(act => (
                                        <span key={act._id} className="badge badge-gray">{act.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="card mt-lg">
                    <div className="card-body text-center">
                        <p className="text-lg font-semibold">Estimated Budget: {formatBudget()}</p>
                    </div>
                </div>
            </div>

            <footer className="shared-footer">
                <p>Shared via <strong>GlobeTrotter</strong> - Smart Travel Planning</p>
            </footer>
        </div>
    )
}

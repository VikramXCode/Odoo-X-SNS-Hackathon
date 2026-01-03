import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripsAPI, citiesAPI } from '../../services/api'
import './ItineraryBuilderPage.css'

export default function ItineraryBuilderPage() {
    const { id } = useParams()
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showStopModal, setShowStopModal] = useState(false)
    const [showActivityModal, setShowActivityModal] = useState(null)
    const [cities, setCities] = useState([])
    const [citySearch, setCitySearch] = useState('')
    const [activities, setActivities] = useState([])
    const [stopForm, setStopForm] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '', accommodationName: '', accommodationCost: '', transportType: 'none', transportCost: '' })

    useEffect(() => { loadTrip() }, [id])

    const loadTrip = async () => {
        try {
            const res = await tripsAPI.getOne(id)
            setTrip(res.trip)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const searchCities = async (q) => {
        setCitySearch(q)
        if (q.length < 2) { setCities([]); return }
        try {
            const res = await citiesAPI.search({ q })
            setCities(res.cities || [])
        } catch (e) { console.error(e) }
    }

    const selectCity = (city) => {
        setStopForm({ ...stopForm, cityName: city.name, country: city.country })
        setCitySearch(city.name)
        setCities([])
    }

    const loadActivities = async (cityName) => {
        try {
            const res = await citiesAPI.getActivities(cityName)
            setActivities(res.activities || [])
        } catch (e) { console.error(e) }
    }

    const handleAddStop = async (e) => {
        e.preventDefault()
        try {
            const res = await tripsAPI.addStop(id, {
                cityName: stopForm.cityName,
                country: stopForm.country,
                arrivalDate: stopForm.arrivalDate,
                departureDate: stopForm.departureDate,
                accommodation: { name: stopForm.accommodationName, cost: parseFloat(stopForm.accommodationCost) || 0 },
                transport: { type: stopForm.transportType, cost: parseFloat(stopForm.transportCost) || 0 }
            })
            setTrip(res.trip)
            setShowStopModal(false)
            setStopForm({ cityName: '', country: '', arrivalDate: '', departureDate: '', accommodationName: '', accommodationCost: '', transportType: 'none', transportCost: '' })
            setCitySearch('')
        } catch (e) { console.error(e) }
    }

    const handleDeleteStop = async (stopId) => {
        if (!confirm('Delete this stop?')) return
        try {
            const res = await tripsAPI.deleteStop(id, stopId)
            setTrip(res.trip)
        } catch (e) { console.error(e) }
    }

    const openActivityModal = (stop) => {
        setShowActivityModal(stop)
        loadActivities(stop.cityName)
    }

    const handleAddActivity = async (activity) => {
        try {
            const res = await tripsAPI.addActivity(id, showActivityModal._id, {
                activityId: activity._id,
                name: activity.name,
                category: activity.category,
                duration: activity.duration,
                cost: activity.estimatedCost || 0
            })
            setTrip(res.trip)
        } catch (e) { console.error(e) }
    }

    const handleDeleteActivity = async (stopId, actId) => {
        try {
            const res = await tripsAPI.deleteActivity(id, stopId, actId)
            setTrip(res.trip)
        } catch (e) { console.error(e) }
    }

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    if (loading) return <div className="page"><div className="loading-spinner"></div></div>
    if (!trip) return <div className="page">Trip not found</div>

    return (
        <div className="page itinerary-builder">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Build Itinerary: {trip.name}</h1>
                    <p className="page-subtitle">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                </div>
                <div className="flex gap-sm">
                    <Link to={`/trips/${id}/view`} className="btn btn-secondary">Preview</Link>
                    <Link to={`/trips/${id}`} className="btn btn-ghost">← Back</Link>
                </div>
            </div>

            <div className="stops-container">
                {trip.stops?.map((stop, i) => (
                    <div key={stop._id} className="stop-card">
                        <div className="stop-header">
                            <div className="stop-number">{i + 1}</div>
                            <div className="stop-info">
                                <h3>{stop.cityName}</h3>
                                <p>{stop.country} • {formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</p>
                            </div>
                            <button onClick={() => handleDeleteStop(stop._id)} className="btn btn-ghost btn-sm text-error">✕</button>
                        </div>

                        {stop.accommodation?.name && (
                            <p className="stop-accommodation">🏨 {stop.accommodation.name} (${stop.accommodation.cost})</p>
                        )}

                        <div className="stop-activities">
                            {stop.activities?.map(act => (
                                <div key={act._id} className="activity-chip">
                                    <span>{act.name}</span>
                                    <span className="text-muted">${act.cost}</span>
                                    <button onClick={() => handleDeleteActivity(stop._id, act._id)}>✕</button>
                                </div>
                            ))}
                            <button onClick={() => openActivityModal(stop)} className="btn btn-ghost btn-sm">+ Add Activity</button>
                        </div>

                        {i < trip.stops.length - 1 && stop.transport?.type !== 'none' && (
                            <div className="transport-indicator">
                                {stop.transport.type === 'flight' ? '✈️' : stop.transport.type === 'train' ? '🚂' : stop.transport.type === 'bus' ? '🚌' : stop.transport.type === 'car' ? '🚗' : '⛴️'}
                                {stop.transport.type} (${stop.transport.cost})
                            </div>
                        )}
                    </div>
                ))}

                <button onClick={() => setShowStopModal(true)} className="add-stop-btn">
                    <span>+</span> Add Destination
                </button>
            </div>

            {/* Add Stop Modal */}
            {showStopModal && (
                <div className="modal-overlay" onClick={() => setShowStopModal(false)}>
                    <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Add Destination</h3>
                            <button className="modal-close" onClick={() => setShowStopModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleAddStop}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input className="form-input" placeholder="Search cities..." value={citySearch} onChange={e => searchCities(e.target.value)} />
                                    {cities.length > 0 && (
                                        <div className="city-dropdown">
                                            {cities.map(c => (
                                                <div key={c._id} className="city-option" onClick={() => selectCity(c)}>
                                                    {c.name}, {c.country}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Arrival Date</label>
                                        <input type="date" className="form-input" value={stopForm.arrivalDate} onChange={e => setStopForm({ ...stopForm, arrivalDate: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Departure Date</label>
                                        <input type="date" className="form-input" value={stopForm.departureDate} onChange={e => setStopForm({ ...stopForm, departureDate: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Accommodation Name</label>
                                        <input className="form-input" placeholder="Hotel name" value={stopForm.accommodationName} onChange={e => setStopForm({ ...stopForm, accommodationName: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Cost ($)</label>
                                        <input type="number" className="form-input" value={stopForm.accommodationCost} onChange={e => setStopForm({ ...stopForm, accommodationCost: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Transport Type</label>
                                        <select className="form-select" value={stopForm.transportType} onChange={e => setStopForm({ ...stopForm, transportType: e.target.value })}>
                                            <option value="none">None</option>
                                            <option value="flight">Flight</option>
                                            <option value="train">Train</option>
                                            <option value="bus">Bus</option>
                                            <option value="car">Car</option>
                                            <option value="ferry">Ferry</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Transport Cost ($)</label>
                                        <input type="number" className="form-input" value={stopForm.transportCost} onChange={e => setStopForm({ ...stopForm, transportCost: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowStopModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={!stopForm.cityName}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Activity Modal */}
            {showActivityModal && (
                <div className="modal-overlay" onClick={() => setShowActivityModal(null)}>
                    <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Add Activity in {showActivityModal.cityName}</h3>
                            <button className="modal-close" onClick={() => setShowActivityModal(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="activities-grid">
                                {activities.map(act => (
                                    <div key={act._id} className="activity-card">
                                        <img src={act.image || 'https://via.placeholder.com/200'} alt={act.name} />
                                        <div className="activity-card-content">
                                            <h4>{act.name}</h4>
                                            <p><span className="badge badge-gray">{act.category}</span> • {act.duration}h • ${act.estimatedCost}</p>
                                            <button onClick={() => handleAddActivity(act)} className="btn btn-primary btn-sm">Add</button>
                                        </div>
                                    </div>
                                ))}
                                {activities.length === 0 && <p className="text-muted">No activities found for this city.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

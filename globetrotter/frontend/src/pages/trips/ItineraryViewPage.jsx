import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripsAPI } from '../../services/api'

export default function ItineraryViewPage() {
    const { id } = useParams()
    const [itinerary, setItinerary] = useState(null)
    const [trip, setTrip] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadData() }, [id])

    const loadData = async () => {
        try {
            const res = await tripsAPI.getItinerary(id)
            setItinerary(res.itinerary)
            setTrip(res.trip)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    if (loading) return <div className="page"><div className="loading-spinner"></div></div>

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Itinerary: {trip?.name}</h1>
                    <p className="page-subtitle">Day-by-day view of your trip</p>
                </div>
                <div className="flex gap-sm">
                    <Link to={`/trips/${id}/itinerary`} className="btn btn-primary">Edit</Link>
                    <Link to={`/trips/${id}`} className="btn btn-ghost">← Back</Link>
                </div>
            </div>

            <div style={{ maxWidth: 800 }}>
                {itinerary?.map(day => (
                    <div key={day.dayNumber} className="card mb-lg">
                        <div className="card-header">
                            <strong>Day {day.dayNumber}</strong> • {formatDate(day.date)}
                        </div>
                        <div className="card-body">
                            {day.stops.length > 0 ? day.stops.map(stop => (
                                <div key={stop._id} className="mb-md">
                                    <div className="flex items-center gap-sm mb-sm">
                                        <strong>{stop.cityName}</strong>
                                        {stop.isArrivalDay && <span className="badge badge-success">Arrive</span>}
                                        {stop.isDepartureDay && <span className="badge badge-error">Depart</span>}
                                    </div>
                                    {stop.activities?.length > 0 && (
                                        <ul style={{ marginLeft: 16 }}>
                                            {stop.activities.map(act => (
                                                <li key={act._id} className="text-sm text-muted">🎯 {act.name} ({act.duration}h)</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )) : <p className="text-muted">No activities for this day</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

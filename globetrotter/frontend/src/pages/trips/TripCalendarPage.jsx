import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripsAPI } from '../../services/api'

export default function TripCalendarPage() {
    const { id } = useParams()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadCalendar() }, [id])

    const loadCalendar = async () => {
        try {
            const res = await tripsAPI.getCalendar(id)
            setEvents(res.events || [])
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
        const date = event.date.split('T')[0]
        if (!acc[date]) acc[date] = []
        acc[date].push(event)
        return acc
    }, {})

    if (loading) return <div className="page"><div className="loading-spinner"></div></div>

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Trip Calendar</h1>
                    <p className="page-subtitle">All events at a glance</p>
                </div>
                <Link to={`/trips/${id}`} className="btn btn-ghost">← Back</Link>
            </div>

            <div style={{ maxWidth: 600 }}>
                {Object.entries(eventsByDate).sort().map(([date, dateEvents]) => (
                    <div key={date} className="card mb-md">
                        <div className="card-header"><strong>{formatDate(date)}</strong></div>
                        <div className="card-body">
                            {dateEvents.map(event => (
                                <div key={event.id} className="flex items-center gap-sm mb-sm" style={{
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    background: event.color + '20',
                                    borderLeft: `4px solid ${event.color}`
                                }}>
                                    <span>{event.type === 'arrival' ? '🛬' : event.type === 'departure' ? '🛫' : '🎯'}</span>
                                    <span>{event.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="empty-state">
                        <p className="empty-state-icon">📅</p>
                        <p>No events yet. Build your itinerary to see calendar events.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

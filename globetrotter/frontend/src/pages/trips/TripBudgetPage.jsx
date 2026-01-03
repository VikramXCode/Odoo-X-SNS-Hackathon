import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tripsAPI } from '../../services/api'

export default function TripBudgetPage() {
    const { id } = useParams()
    const [budget, setBudget] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadBudget() }, [id])

    const loadBudget = async () => {
        try {
            const res = await tripsAPI.getBudget(id)
            setBudget(res.budget)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

    if (loading) return <div className="page"><div className="loading-spinner"></div></div>

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Trip Budget</h1>
                    <p className="page-subtitle">{budget?.duration} day trip • Avg {formatCurrency(budget?.averagePerDay || 0)}/day</p>
                </div>
                <Link to={`/trips/${id}`} className="btn btn-ghost">← Back</Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card gradient">
                    <p className="stat-label">Total Budget</p>
                    <p className="stat-value">{formatCurrency(budget?.total || 0)}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Transport</p>
                    <p className="stat-value">{formatCurrency(budget?.transport || 0)}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Accommodation</p>
                    <p className="stat-value">{formatCurrency(budget?.accommodation || 0)}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Activities</p>
                    <p className="stat-value">{formatCurrency(budget?.activities || 0)}</p>
                </div>
            </div>

            <div className="card mt-lg">
                <div className="card-header"><h3>Budget Breakdown</h3></div>
                <div className="card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { label: 'Transport', value: budget?.transport, color: '#3b82f6' },
                            { label: 'Accommodation', value: budget?.accommodation, color: '#10b981' },
                            { label: 'Activities', value: budget?.activities, color: '#f59e0b' },
                            { label: 'Food', value: budget?.food, color: '#ec4899' },
                            { label: 'Miscellaneous', value: budget?.miscellaneous, color: '#8b5cf6' }
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between mb-xs">
                                    <span>{item.label}</span>
                                    <span>{formatCurrency(item.value || 0)}</span>
                                </div>
                                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4 }}>
                                    <div style={{ height: '100%', width: `${((item.value || 0) / (budget?.total || 1)) * 100}%`, background: item.color, borderRadius: 4 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

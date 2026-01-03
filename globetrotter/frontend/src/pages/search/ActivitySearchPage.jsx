import { useState, useEffect } from 'react'
import { activitiesAPI } from '../../services/api'
import './SearchPages.css'

export default function ActivitySearchPage() {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])

    useEffect(() => { loadInitial() }, [])
    useEffect(() => { searchActivities() }, [search, category])

    const loadInitial = async () => {
        try {
            const [activitiesRes, categoriesRes] = await Promise.all([
                activitiesAPI.search({}),
                activitiesAPI.getCategories()
            ])
            setActivities(activitiesRes.activities || [])
            setCategories(categoriesRes.categories || [])
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const searchActivities = async () => {
        if (!search && !category) return
        setLoading(true)
        try {
            const res = await activitiesAPI.search({ q: search, category })
            setActivities(res.activities || [])
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const formatCost = (n) => `$${n}`

    return (
        <div className="page search-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Find Activities</h1>
                    <p className="page-subtitle">Discover things to do around the world</p>
                </div>
            </div>

            <div className="search-filters">
                <input className="form-input" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
            </div>

            {loading ? <div className="loading-spinner"></div> : (
                <div className="activities-search-grid">
                    {activities.map(act => (
                        <div key={act._id} className="activity-search-card">
                            <div className="activity-search-image">
                                <img src={act.image || 'https://via.placeholder.com/300'} alt={act.name} />
                            </div>
                            <div className="activity-search-content">
                                <h3>{act.name}</h3>
                                <p className="text-sm text-muted">{act.cityName}</p>
                                <div className="flex gap-sm mt-sm">
                                    <span className="badge badge-primary">{act.category}</span>
                                    <span className="text-sm">{act.duration}h</span>
                                    <span className="text-sm">{formatCost(act.estimatedCost)}</span>
                                </div>
                                <div className="flex items-center gap-xs mt-sm">
                                    <span>⭐</span>
                                    <span className="text-sm">{act.rating?.toFixed(1) || '4.0'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && <div className="empty-state"><p>No activities found</p></div>}
                </div>
            )}
        </div>
    )
}

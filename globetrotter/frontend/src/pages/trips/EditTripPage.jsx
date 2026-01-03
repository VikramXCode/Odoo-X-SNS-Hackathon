import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { tripsAPI } from '../../services/api'
import './TripForm.css'

export default function EditTripPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        description: '',
        coverImage: '',
        startDate: '',
        endDate: '',
        status: 'draft',
        foodBudget: '',
        miscBudget: ''
    })

    useEffect(() => {
        loadTrip()
    }, [id])

    const loadTrip = async () => {
        try {
            const res = await tripsAPI.getOne(id)
            const trip = res.trip
            setForm({
                name: trip.name || '',
                description: trip.description || '',
                coverImage: trip.coverImage || '',
                startDate: trip.startDate?.split('T')[0] || '',
                endDate: trip.endDate?.split('T')[0] || '',
                status: trip.status || 'draft',
                foodBudget: trip.budget?.food || '',
                miscBudget: trip.budget?.miscellaneous || ''
            })
        } catch (err) {
            setError('Failed to load trip')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (new Date(form.endDate) < new Date(form.startDate)) {
            setError('End date must be after start date')
            return
        }

        setSaving(true)
        setError('')

        try {
            await tripsAPI.update(id, {
                name: form.name,
                description: form.description,
                coverImage: form.coverImage,
                startDate: form.startDate,
                endDate: form.endDate,
                status: form.status,
                budget: {
                    food: parseFloat(form.foodBudget) || 0,
                    miscellaneous: parseFloat(form.miscBudget) || 0
                }
            })
            navigate(`/trips/${id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update trip')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="page"><div className="loading-spinner"></div></div>
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Edit Trip</h1>
                    <p className="page-subtitle">Update your trip details</p>
                </div>
            </div>

            <div className="card trip-form-card">
                <form onSubmit={handleSubmit} className="trip-form">
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Cover Image URL</label>
                        <input type="url" name="coverImage" className="form-input" value={form.coverImage} onChange={handleChange} />
                        {form.coverImage && <div className="cover-preview"><img src={form.coverImage} alt="Cover" /></div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Trip Name *</label>
                        <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} rows={3} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                            <option value="draft">Draft</option>
                            <option value="planned">Planned</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input type="date" name="startDate" className="form-input" value={form.startDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date *</label>
                            <input type="date" name="endDate" className="form-input" value={form.endDate} onChange={handleChange} min={form.startDate} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Food Budget ($)</label>
                            <input type="number" name="foodBudget" className="form-input" value={form.foodBudget} onChange={handleChange} min="0" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Miscellaneous Budget ($)</label>
                            <input type="number" name="miscBudget" className="form-input" value={form.miscBudget} onChange={handleChange} min="0" />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to={`/trips/${id}`} className="btn btn-secondary">Cancel</Link>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

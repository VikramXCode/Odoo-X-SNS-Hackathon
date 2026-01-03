import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { tripsAPI } from '../../services/api'
import './TripForm.css'

export default function CreateTripPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        description: '',
        coverImage: '',
        startDate: '',
        endDate: '',
        foodBudget: '',
        miscBudget: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (new Date(form.endDate) < new Date(form.startDate)) {
            setError('End date must be after start date')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await tripsAPI.create({
                name: form.name,
                description: form.description,
                coverImage: form.coverImage,
                startDate: form.startDate,
                endDate: form.endDate,
                budget: {
                    food: parseFloat(form.foodBudget) || 0,
                    miscellaneous: parseFloat(form.miscBudget) || 0
                }
            })
            navigate(`/trips/${res.trip._id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create trip')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Create New Trip</h1>
                    <p className="page-subtitle">Plan your next adventure</p>
                </div>
            </div>

            <div className="card trip-form-card">
                <form onSubmit={handleSubmit} className="trip-form">
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Cover Image URL (optional)</label>
                        <input
                            type="url"
                            name="coverImage"
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                            value={form.coverImage}
                            onChange={handleChange}
                        />
                        {form.coverImage && (
                            <div className="cover-preview">
                                <img src={form.coverImage} alt="Cover preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Trip Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="e.g., European Adventure"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-textarea"
                            placeholder="What's this trip about?"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                className="form-input"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date *</label>
                            <input
                                type="date"
                                name="endDate"
                                className="form-input"
                                value={form.endDate}
                                onChange={handleChange}
                                min={form.startDate}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Food Budget ($)</label>
                            <input
                                type="number"
                                name="foodBudget"
                                className="form-input"
                                placeholder="0"
                                value={form.foodBudget}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Miscellaneous Budget ($)</label>
                            <input
                                type="number"
                                name="miscBudget"
                                className="form-input"
                                placeholder="0"
                                value={form.miscBudget}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to="/trips" className="btn btn-secondary">Cancel</Link>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Trip'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

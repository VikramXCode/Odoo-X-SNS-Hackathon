import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usersAPI } from '../services/api'
import './ProfilePage.css'

export default function ProfilePage() {
    const { user, updateUser, isDemo } = useAuth()
    const [name, setName] = useState(user?.name || '')
    const [saving, setSaving] = useState(false)
    const [prefs, setPrefs] = useState({ language: 'en', currency: 'USD', theme: 'system' })
    const [savedDests, setSavedDests] = useState([])

    useEffect(() => {
        if (user?.preferences) setPrefs(user.preferences)
        loadSavedDestinations()
    }, [user])

    const loadSavedDestinations = async () => {
        try {
            const res = await usersAPI.getSavedDestinations()
            setSavedDests(res.destinations || [])
        } catch (e) { console.error(e) }
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await usersAPI.updateProfile({ name })
            updateUser({ name })
            alert('Profile updated!')
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const handleSavePrefs = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await usersAPI.updatePreferences(prefs)
            updateUser({ preferences: prefs })
            alert('Preferences saved!')
        } catch (e) { console.error(e) }
        finally { setSaving(false) }
    }

    const handleRemoveDest = async (cityId) => {
        try {
            await usersAPI.removeDestination(cityId)
            setSavedDests(savedDests.filter(d => d._id !== cityId))
        } catch (e) { console.error(e) }
    }

    return (
        <div className="page profile-page">
            <div className="page-header">
                <h1 className="page-title">My Profile</h1>
            </div>

            {/* Profile Header */}
            <div className="profile-header-card card">
                <div className="card-body">
                    <div className="profile-header-content">
                        <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                        <div>
                            <h2>{user?.name}</h2>
                            <p className="text-muted">{user?.email}</p>
                            <div className="flex gap-sm mt-sm">
                                <span className="badge badge-primary">{user?.role}</span>
                                {isDemo && <span className="badge badge-warning">Demo User</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile */}
            <div className="card mt-lg">
                <div className="card-header"><h3>Edit Profile</h3></div>
                <div className="card-body">
                    <form onSubmit={handleSaveProfile} className="profile-form">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Preferences */}
            <div className="card mt-lg">
                <div className="card-header"><h3>Preferences</h3></div>
                <div className="card-body">
                    <form onSubmit={handleSavePrefs} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Language</label>
                                <select className="form-select" value={prefs.language} onChange={e => setPrefs({ ...prefs, language: e.target.value })}>
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="ja">Japanese</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Currency</label>
                                <select className="form-select" value={prefs.currency} onChange={e => setPrefs({ ...prefs, currency: e.target.value })}>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                    <option value="INR">INR (₹)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Theme</label>
                                <select className="form-select" value={prefs.theme} onChange={e => setPrefs({ ...prefs, theme: e.target.value })}>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={saving}>Save Preferences</button>
                    </form>
                </div>
            </div>

            {/* Saved Destinations */}
            <div className="card mt-lg">
                <div className="card-header"><h3>Saved Destinations</h3></div>
                <div className="card-body">
                    {savedDests.length > 0 ? (
                        <div className="saved-dests-grid">
                            {savedDests.map(dest => (
                                <div key={dest._id} className="saved-dest-card">
                                    <img src={dest.image} alt={dest.name} />
                                    <div className="saved-dest-content">
                                        <h4>{dest.name}</h4>
                                        <p>{dest.country}</p>
                                        <button onClick={() => handleRemoveDest(dest._id)} className="btn btn-ghost btn-sm text-error">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No saved destinations yet. Explore cities and save your favorites!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

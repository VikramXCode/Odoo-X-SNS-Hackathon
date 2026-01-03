import { useState, useEffect } from 'react'
import { citiesAPI, usersAPI } from '../../services/api'
import './SearchPages.css'

export default function CitySearchPage() {
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [country, setCountry] = useState('')
    const [budget, setBudget] = useState('')
    const [countries, setCountries] = useState([])
    const [saved, setSaved] = useState([])

    useEffect(() => { loadInitial() }, [])
    useEffect(() => { searchCities() }, [search, country, budget])

    const loadInitial = async () => {
        try {
            const [citiesRes, countriesRes, savedRes] = await Promise.all([
                citiesAPI.getAll(),
                citiesAPI.getCountries(),
                usersAPI.getSavedDestinations()
            ])
            setCities(citiesRes.cities || [])
            setCountries(countriesRes.countries || [])
            setSaved((savedRes.destinations || []).map(d => d._id))
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const searchCities = async () => {
        if (!search && !country && !budget) return
        setLoading(true)
        try {
            const res = await citiesAPI.search({ q: search, country, budget })
            setCities(res.cities || [])
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const toggleSave = async (cityId) => {
        try {
            if (saved.includes(cityId)) {
                await usersAPI.removeDestination(cityId)
                setSaved(saved.filter(id => id !== cityId))
            } else {
                await usersAPI.saveDestination(cityId)
                setSaved([...saved, cityId])
            }
        } catch (e) { console.error(e) }
    }

    const formatCost = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

    return (
        <div className="page search-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Explore Cities</h1>
                    <p className="page-subtitle">Discover your next destination</p>
                </div>
            </div>

            <div className="search-filters">
                <input className="form-input" placeholder="Search cities..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-select" value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="">All Countries</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="form-select" value={budget} onChange={e => setBudget(e.target.value)}>
                    <option value="">All Budgets</option>
                    <option value="budget">$ Budget</option>
                    <option value="moderate">$$ Moderate</option>
                    <option value="comfort">$$$ Comfort</option>
                    <option value="luxury">$$$$ Luxury</option>
                </select>
            </div>

            {loading ? <div className="loading-spinner"></div> : (
                <div className="cities-search-grid">
                    {cities.map(city => (
                        <div key={city._id} className="city-search-card">
                            <div className="city-search-image">
                                <img src={city.image} alt={city.name} />
                                <button className={`save-btn ${saved.includes(city._id) ? 'saved' : ''}`} onClick={() => toggleSave(city._id)}>
                                    {saved.includes(city._id) ? '❤️' : '🤍'}
                                </button>
                            </div>
                            <div className="city-search-content">
                                <h3>{city.name}</h3>
                                <p className="text-muted">{city.country}</p>
                                <div className="city-meta">
                                    <span>{'$'.repeat(city.costIndex)}</span>
                                    <span>~{formatCost(city.averageDailyCost)}/day</span>
                                </div>
                                <div className="city-tags">
                                    {city.tags?.slice(0, 3).map(tag => <span key={tag} className="badge badge-gray">{tag}</span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {cities.length === 0 && <div className="empty-state"><p>No cities found</p></div>}
                </div>
            )}
        </div>
    )
}

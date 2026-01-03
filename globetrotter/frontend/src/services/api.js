const API_URL = '/api'

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token')

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    }

    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
        const error = new Error(data.message || 'API Error')
        error.response = { data, status: response.status }
        throw error
    }

    return data
}

// Auth API
export const authAPI = {
    login: (email, password) =>
        fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),

    register: (name, email, password) =>
        fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        }),

    getMe: () => fetchAPI('/auth/me'),

    updateProfile: (data) =>
        fetchAPI('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    forgotPassword: (email) =>
        fetchAPI('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        })
}

// Trips API
export const tripsAPI = {
    getAll: (status) =>
        fetchAPI(`/trips${status && status !== 'all' ? `?status=${status}` : ''}`),

    getOne: (id) => fetchAPI(`/trips/${id}`),

    create: (data) =>
        fetchAPI('/trips', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    update: (id, data) =>
        fetchAPI(`/trips/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    delete: (id) =>
        fetchAPI(`/trips/${id}`, { method: 'DELETE' }),

    getItinerary: (id) => fetchAPI(`/trips/${id}/itinerary`),

    getBudget: (id) => fetchAPI(`/trips/${id}/budget`),

    getCalendar: (id) => fetchAPI(`/trips/${id}/calendar`),

    share: (id) =>
        fetchAPI(`/trips/${id}/share`, { method: 'POST' }),

    // Stops
    addStop: (tripId, data) =>
        fetchAPI(`/trips/${tripId}/stops`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    deleteStop: (tripId, stopId) =>
        fetchAPI(`/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' }),

    // Activities
    addActivity: (tripId, stopId, data) =>
        fetchAPI(`/trips/${tripId}/stops/${stopId}/activities`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    deleteActivity: (tripId, stopId, activityId) =>
        fetchAPI(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, { method: 'DELETE' })
}

// Cities API
export const citiesAPI = {
    getAll: () => fetchAPI('/cities'),

    search: (params) => {
        const query = new URLSearchParams(params).toString()
        return fetchAPI(`/cities/search?${query}`)
    },

    getPopular: () => fetchAPI('/cities/popular'),

    getCountries: () => fetchAPI('/cities/countries'),

    getOne: (id) => fetchAPI(`/cities/${id}`),

    getActivities: (cityName) =>
        fetchAPI(`/cities/0/activities?cityName=${encodeURIComponent(cityName)}`)
}

// Activities API
export const activitiesAPI = {
    search: (params) => {
        const query = new URLSearchParams(params).toString()
        return fetchAPI(`/activities/search?${query}`)
    },

    getCategories: () => fetchAPI('/activities/categories'),

    getOne: (id) => fetchAPI(`/activities/${id}`)
}

// Users API
export const usersAPI = {
    getProfile: () => fetchAPI('/users/profile'),

    updateProfile: (data) =>
        fetchAPI('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    updatePreferences: (data) =>
        fetchAPI('/users/preferences', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    getSavedDestinations: () => fetchAPI('/users/saved-destinations'),

    saveDestination: (cityId) =>
        fetchAPI('/users/saved-destinations', {
            method: 'POST',
            body: JSON.stringify({ cityId })
        }),

    removeDestination: (cityId) =>
        fetchAPI(`/users/saved-destinations/${cityId}`, { method: 'DELETE' })
}

// Admin API
export const adminAPI = {
    getAnalytics: () => fetchAPI('/admin/analytics'),

    getUsers: (params) => {
        const query = new URLSearchParams(params).toString()
        return fetchAPI(`/admin/users?${query}`)
    },

    updateUser: (id, data) =>
        fetchAPI(`/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

    deleteUser: (id) =>
        fetchAPI(`/admin/users/${id}`, { method: 'DELETE' })
}

// Public API
export const publicAPI = {
    getSharedTrip: (shareId) => fetchAPI(`/public/trips/${shareId}`),

    copyTrip: (shareId) =>
        fetchAPI(`/public/trips/${shareId}/copy`, { method: 'POST' })
}

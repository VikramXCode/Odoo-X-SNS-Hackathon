import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async () => {
        try {
            const response = await authAPI.getMe()
            setUser(response.user)
        } catch (err) {
            console.error('Failed to fetch user:', err)
            localStorage.removeItem('token')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            setError(null)
            const response = await authAPI.login(email, password)
            localStorage.setItem('token', response.token)
            setUser(response.user)
            return { success: true }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed'
            setError(message)
            return { success: false, message }
        }
    }

    const register = async (name, email, password) => {
        try {
            setError(null)
            const response = await authAPI.register(name, email, password)
            localStorage.setItem('token', response.token)
            setUser(response.user)
            return { success: true }
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed'
            setError(message)
            return { success: false, message }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }))
    }

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isDemo: user?.isDemo
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await login(email, password)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.message)
        }

        setLoading(false)
    }

    const handleDemoLogin = async () => {
        setLoading(true)
        setError('')

        const result = await login('demo@globetrotter.com', 'demo123')

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.message)
        }

        setLoading(false)
    }

    return (
        <div className="auth-form">
            <h2 className="auth-form-title">Welcome Back</h2>

            {error && <div className="auth-error">{error}</div>}

            <button onClick={handleDemoLogin} className="demo-login-btn" disabled={loading}>
                <span>🎭</span>
                <span>Use Demo Credentials</span>
            </button>

            <div className="auth-divider">or sign in with email</div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="auth-link">
                <Link to="/forgot-password">Forgot your password?</Link>
            </p>

            <p className="auth-link mt-md">
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    )
}

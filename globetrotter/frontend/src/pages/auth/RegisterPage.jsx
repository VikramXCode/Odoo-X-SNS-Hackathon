import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        setError('')

        const result = await register(name, email, password)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.message)
        }

        setLoading(false)
    }

    return (
        <div className="auth-form">
            <h2 className="auth-form-title">Create Account</h2>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="auth-link mt-lg">
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </div>
    )
}

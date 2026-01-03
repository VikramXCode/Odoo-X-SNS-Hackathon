import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../services/api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await authAPI.forgotPassword(email)
            setSubmitted(true)
        } catch (error) {
            // Still show success for security
            setSubmitted(true)
        }

        setLoading(false)
    }

    if (submitted) {
        return (
            <div className="auth-form">
                <h2 className="auth-form-title">Check Your Email</h2>

                <div className="text-center mb-lg">
                    <span style={{ fontSize: '3rem' }}>📧</span>
                </div>

                <p className="text-center text-muted mb-lg">
                    If an account with that email exists, we've sent password reset instructions.
                </p>

                <p className="auth-link">
                    <Link to="/login">← Back to Login</Link>
                </p>
            </div>
        )
    }

    return (
        <div className="auth-form">
            <h2 className="auth-form-title">Reset Password</h2>

            <p className="text-center text-muted mb-lg">
                Enter your email address and we'll send you instructions to reset your password.
            </p>

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

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <p className="auth-link mt-lg">
                Remember your password? <Link to="/login">Sign in</Link>
            </p>
        </div>
    )
}

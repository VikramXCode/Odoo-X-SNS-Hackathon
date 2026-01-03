import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

export default function AuthLayout() {
    return (
        <div className="auth-layout">
            <div className="auth-background">
                <div className="auth-gradient"></div>
                <div className="auth-pattern"></div>
            </div>

            <div className="auth-container">
                <div className="auth-brand">
                    <span className="auth-logo">🌍</span>
                    <h1 className="auth-title">GlobeTrotter</h1>
                    <p className="auth-subtitle">Smart Travel Planning</p>
                </div>

                <div className="auth-card">
                    <Outlet />
                </div>

                <p className="auth-footer">
                    © 2026 GlobeTrotter. Plan your perfect adventure.
                </p>
            </div>
        </div>
    )
}

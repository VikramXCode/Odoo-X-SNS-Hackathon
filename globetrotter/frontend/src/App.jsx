import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Main Pages
import DashboardPage from './pages/DashboardPage'
import TripsPage from './pages/trips/TripsPage'
import CreateTripPage from './pages/trips/CreateTripPage'
import EditTripPage from './pages/trips/EditTripPage'
import TripDetailsPage from './pages/trips/TripDetailsPage'
import ItineraryBuilderPage from './pages/trips/ItineraryBuilderPage'
import ItineraryViewPage from './pages/trips/ItineraryViewPage'
import TripBudgetPage from './pages/trips/TripBudgetPage'
import TripCalendarPage from './pages/trips/TripCalendarPage'

// Search Pages
import CitySearchPage from './pages/search/CitySearchPage'
import ActivitySearchPage from './pages/search/ActivitySearchPage'

// Profile
import ProfilePage from './pages/ProfilePage'

// Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

// Public
import SharedTripPage from './pages/SharedTripPage'

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

function App() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading GlobeTrotter...</p>
            </div>
        )
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/shared/:shareId" element={<SharedTripPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/trips/new" element={<CreateTripPage />} />
                <Route path="/trips/:id" element={<TripDetailsPage />} />
                <Route path="/trips/:id/edit" element={<EditTripPage />} />
                <Route path="/trips/:id/itinerary" element={<ItineraryBuilderPage />} />
                <Route path="/trips/:id/view" element={<ItineraryViewPage />} />
                <Route path="/trips/:id/budget" element={<TripBudgetPage />} />
                <Route path="/trips/:id/calendar" element={<TripCalendarPage />} />
                <Route path="/search/cities" element={<CitySearchPage />} />
                <Route path="/search/activities" element={<ActivitySearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute adminOnly><MainLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App

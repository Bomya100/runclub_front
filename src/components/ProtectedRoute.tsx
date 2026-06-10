import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/* ============================================================
   ProtectedRoute – Redirects unauthenticated users to /login
   and enforces profile completion if requireProfile is true.
   ============================================================ */

export default function ProtectedRoute({ children, requireProfile = false }: { children: React.ReactNode, requireProfile?: boolean }) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()
  console.log('ProtectedRoute: isLoggedIn=', isLoggedIn, 'user=', user, 'requireProfile=', requireProfile)
  // 1. Not logged in -> Go to Login
  if (!isLoggedIn) return <Navigate to="/login" replace />

  // 2. Production Guard: If route requires profile but data is missing -> Go to Profile Setup
  if (requireProfile && user) {
    console.log('Checking profile completeness for user:', user)
    const isProfileComplete = Boolean(user.weight && user.height && user.age)
    if (!isProfileComplete) {
      return <Navigate to="/profile-setup" state={{ from: location }} replace />
    }
  }

  return <>{children}</>
}

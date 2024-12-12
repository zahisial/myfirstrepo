import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  //console.log('ProtectedRoute: isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)

  if (isLoading) {
    //console.log('ProtectedRoute: Loading...')
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    //console.log('ProtectedRoute: Not authenticated, redirecting to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  //console.log('ProtectedRoute: Authenticated, rendering children')
  return <>{children}</>
}

export default ProtectedRoute
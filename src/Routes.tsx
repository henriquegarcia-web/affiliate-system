import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import {
  SignInClientPage,
  SignInAdminPage,
  DashboardAdminPage,
  DashboardClientPage
} from './pages'

import { useAdminAuth } from './contexts/AdminAuthContext'
import { useClientAuth } from './contexts/ClientAuthContext'
import Maintence from './pages/Maintence'

const AppRoutes = () => {
  const { isAdminLogged } = useAdminAuth()
  const { isClientLogged } = useClientAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* =============================================================== */}

        <Route path="/" element={<Maintence />} />
        <Route path="/*" element={<Maintence />} />

        {/* <Route path="/" element={<Navigate to="/auth/entrar" />} />
        <Route path="/*" element={<Navigate to="/auth/entrar" />} /> */}

        {/* =============================================================== */}

        {/* <Route
          path="/admin/entrar"
          element={
            <PublicAdminRoute isAuthenticated={isAdminLogged}>
              <SignInAdminPage />
            </PublicAdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute isAuthenticated={isAdminLogged}>
              <DashboardAdminPage />
            </PrivateAdminRoute>
          }
        /> */}

        {/* =============================================================== */}

        {/* <Route
          path="/auth/entrar"
          element={
            <PublicClientRoute isAuthenticated={isClientLogged}>
              <SignInClientPage />
            </PublicClientRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateClientRoute isAuthenticated={isClientLogged}>
              <DashboardClientPage />
            </PrivateClientRoute>
          }
        /> */}

        {/* =============================================================== */}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

// =========================================== ROUTES

interface RouteProps {
  isAuthenticated: boolean
  children: React.ReactNode
}

const PrivateAdminRoute = ({ isAuthenticated, children }: RouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/admin/entrar" replace />
  }

  return children
}

const PublicAdminRoute = ({ isAuthenticated, children }: RouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/admin" />
  }

  return children
}

const PrivateClientRoute = ({ isAuthenticated, children }: RouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/entrar" replace />
  }

  return children
}

const PublicClientRoute = ({ isAuthenticated, children }: RouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return children
}

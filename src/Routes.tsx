import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import {
  SignInClientPage,
  SignInAdminPage,
  DashboardAdminPage,
  DashboardClientPage
} from './pages'

import { useAdminAuth } from './contexts/AdminAuthContext'

const AppRoutes = () => {
  const { isAdminLogged } = useAdminAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* =============================================================== */}

        <Route path="/" element={<SignInClientPage />} />
        <Route path="/*" element={<Navigate to="/" />} />

        {/* =============================================================== */}

        <Route
          path="/admin/entrar"
          element={
            <PublicRoute isAuthenticated={isAdminLogged}>
              <SignInAdminPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute isAuthenticated={isAdminLogged}>
              <DashboardAdminPage />
            </PrivateAdminRoute>
          }
        />

        {/* =============================================================== */}

        <Route
          path="/auth/entrar"
          element={
            <PublicRoute isAuthenticated={isAdminLogged}>
              <SignInClientPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateAdminRoute isAuthenticated={isAdminLogged}>
              <DashboardClientPage />
            </PrivateAdminRoute>
          }
        />

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

const PublicRoute = ({ isAuthenticated, children }: RouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/admin/estabelecimento" />
  }

  return children
}

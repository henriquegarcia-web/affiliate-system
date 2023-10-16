import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { theme } from 'antd'

import {
  SignInClientPage,
  SignInAdminPage,
  DashboardAdminPage,
  DashboardClientPage,
  MaintencePage
} from './pages'

import { useAdminAuth } from './contexts/AdminAuthContext'
import { useClientAuth } from './contexts/ClientAuthContext'

const AppRoutes = () => {
  const { token } = theme.useToken()

  const { isAdminLogged, applicationData } = useAdminAuth()
  const { isClientLogged } = useClientAuth()

  if (!applicationData)
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: token.colorBgElevated
        }}
      ></div>
    )

  if (applicationData?.appMaintanceStatus)
    return (
      <BrowserRouter>
        <Routes>
          {/* =============================================================== */}

          {/* <Route path="/" element={<Maintence />} />
        <Route path="/*" element={<Maintence />} /> */}

          <Route path="/" element={<MaintencePage />} />
          <Route path="/*" element={<MaintencePage />} />

          {/* =============================================================== */}

          <Route
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
          />
          {/* =============================================================== */}
        </Routes>
      </BrowserRouter>
    )

  return (
    <BrowserRouter>
      <Routes>
        {/* =============================================================== */}

        {/* <Route path="/" element={<Maintence />} />
        <Route path="/*" element={<Maintence />} /> */}

        <Route path="/" element={<Navigate to="/auth/entrar" />} />
        <Route path="/*" element={<Navigate to="/auth/entrar" />} />

        {/* =============================================================== */}

        <Route
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
        />

        {/* =============================================================== */}

        <Route
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

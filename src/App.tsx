import AppRoutes from './Routes'

import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext'
import { ClientAuthProvider } from './contexts/ClientAuthContext'

import { ConfigProvider, theme } from 'antd'

function App() {
  return (
    <>
      <AdminAuthProvider>
        <ClientAuthProvider>
          <AppThemed />
        </ClientAuthProvider>
      </AdminAuthProvider>
    </>
  )
}

export default App

const AppThemed = () => {
  const { applicationData } = useAdminAuth()

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: applicationData?.appColor || 'black'
        }
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  )
}

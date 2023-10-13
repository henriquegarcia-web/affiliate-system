import AppRoutes from './Routes'

import { AdminAuthProvider } from './contexts/AdminAuthContext'
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
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#FF7A00'
        }
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  )
}

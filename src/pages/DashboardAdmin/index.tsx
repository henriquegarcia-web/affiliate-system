import * as S from './styles'

import { useAdminAuth } from '@/contexts/AdminAuthContext'

const DashboardAdmin = () => {
  const { handleLogout } = useAdminAuth()

  return (
    <S.DashboardAdmin>
      <button onClick={handleLogout}>Sair</button>
    </S.DashboardAdmin>
  )
}

export default DashboardAdmin

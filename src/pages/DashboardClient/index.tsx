import * as S from './styles'

import { useClientAuth } from '@/contexts/ClientAuthContext'

const DashboardClient = () => {
  const { handleLogout } = useClientAuth()

  return (
    <S.DashboardClient>
      <button onClick={handleLogout}>Sair</button>
    </S.DashboardClient>
  )
}

export default DashboardClient

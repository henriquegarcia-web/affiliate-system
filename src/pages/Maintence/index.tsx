import * as S from './styles'

import { theme } from 'antd'

const Maintence = () => {
  const { token } = theme.useToken()

  return (
    <S.Maintence style={{ backgroundColor: token.colorBgContainer }}>
      <S.MaintenceContainer>
        <img src="/logo_full.png" alt="" />
        <h1
          style={{
            backgroundColor: token.colorPrimary,
            color: token.colorBgContainer
          }}
        >
          Em manutenção
        </h1>
      </S.MaintenceContainer>
    </S.Maintence>
  )
}

export default Maintence

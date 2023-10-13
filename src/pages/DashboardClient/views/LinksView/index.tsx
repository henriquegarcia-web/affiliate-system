import * as S from './styles'
import * as G from '@/utils/styles/globals'

import { Button, Input, theme } from 'antd'
import { IoCreateOutline, IoSearchSharp } from 'react-icons/io5'

const LinksView = () => {
  const { token } = theme.useToken()

  return (
    <S.LinksView>
      <G.View>
        <G.ViewHeader
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <Input
            style={{ width: '100%', maxWidth: '280px' }}
            addonAfter={
              <IoSearchSharp style={{ fontSize: 16, marginBottom: '-3px' }} />
            }
            placeholder="Pesquise aqui..."
          />
          {/* <Button type="default" onClick={() => {}}>
            Novo afiliado
          </Button> */}
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.Link
            style={{
              backgroundColor: token.colorBgElevated,
              border: `1px solid ${token.colorBorderSecondary}`,
              color: token.colorTextSecondary
            }}
          >
            <Button type="primary" size="small">
              Gerar Link
            </Button>
            <p>Link da Homepage</p>

            <span>
              <Button
                size="small"
                icon={
                  <IoCreateOutline
                    style={{ fontSize: 16, marginLeft: '4px' }}
                  />
                }
              />
            </span>
          </S.Link>
          <S.Link
            style={{
              backgroundColor: token.colorBgElevated,
              border: `1px solid ${token.colorBorderSecondary}`,
              color: token.colorTextSecondary
            }}
          >
            <Button type="primary" size="small">
              Gerar Link
            </Button>
            <p>Link do Cassino Homepage</p>

            <span>
              <Button
                size="small"
                icon={
                  <IoCreateOutline
                    style={{ fontSize: 16, marginLeft: '4px' }}
                  />
                }
              />
            </span>
          </S.Link>
        </G.ViewContent>
      </G.View>
    </S.LinksView>
  )
}

export default LinksView

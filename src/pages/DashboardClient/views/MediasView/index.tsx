import * as S from './styles'
import * as G from '@/utils/styles/globals'
import { IoCreateOutline, IoSearchSharp } from 'react-icons/io5'

import { Button, Input, theme } from 'antd'

const MediasView = () => {
  const { token } = theme.useToken()

  return (
    <S.MediasView>
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
          <S.MediasWrapper>
            <S.Link
              style={{
                backgroundColor: token.colorBgElevated,
                border: `1px solid ${token.colorBorderSecondary}`,
                color: token.colorTextSecondary
              }}
            >
              <Button type="primary" size="small">
                Obter Link
              </Button>
              <p>Pasta de arquivos no Google Drive</p>

              <span>
                {/* <Button
                  size="small"
                  icon={
                    <IoCreateOutline
                      style={{ fontSize: 16, marginLeft: '4px' }}
                    />
                  }
                /> */}
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
                Obter Link
              </Button>
              <p>Canal no YouTube de treinamentos</p>

              <span>
                {/* <Button
                  size="small"
                  icon={
                    <IoCreateOutline
                      style={{ fontSize: 16, marginLeft: '4px' }}
                    />
                  }
                /> */}
              </span>
            </S.Link>
          </S.MediasWrapper>
        </G.ViewContent>
      </G.View>
    </S.MediasView>
  )
}

export default MediasView

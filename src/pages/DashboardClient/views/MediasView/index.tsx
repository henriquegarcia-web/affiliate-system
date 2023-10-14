import * as S from './styles'
import * as G from '@/utils/styles/globals'
import { IoOpenOutline, IoSearchSharp } from 'react-icons/io5'

import { Button, Input, message, theme } from 'antd'

import ClipboardJS from 'clipboard'

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
          <S.LinkWrapper>
            <S.LinkWrapperHeader
              style={{
                color: token.colorTextTertiary
              }}
            >
              <S.LinkLine>Ação</S.LinkLine>
              <S.LinkLine>Nome do link</S.LinkLine>
            </S.LinkWrapperHeader>
            <S.LinkWrapperContent>
              <Link
                linkTitle="Pasta de arquivos no Google Drive"
                linkUrl="https://www.youtube.com/"
              />
              <Link
                linkTitle="Canal no YouTube de treinamentos"
                linkUrl="https://www.youtube.com/"
              />
            </S.LinkWrapperContent>
          </S.LinkWrapper>
        </G.ViewContent>
      </G.View>
    </S.MediasView>
  )
}

export default MediasView

// =====================================================

interface ILink {
  linkTitle: string
  linkUrl: string
}

const Link = ({ linkTitle, linkUrl }: ILink) => {
  const { token } = theme.useToken()

  const handleCopyLink = () => {
    const clipboard = new ClipboardJS('.link')

    clipboard.on('success', () => {
      message.open({
        type: 'success',
        content: 'Link copiado com sucesso!'
      })
      clipboard.destroy()
    })

    clipboard.on('error', () => {
      message.open({
        type: 'error',
        content: 'Falha ao copiar o link!'
      })
      clipboard.destroy()
    })
  }

  return (
    <S.Link
      style={{
        backgroundColor: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorTextSecondary
      }}
    >
      <S.LinkLine>
        <Button
          className="link"
          type="primary"
          size="small"
          data-clipboard-text={linkUrl}
          onClick={handleCopyLink}
        >
          Copiar Link
        </Button>
      </S.LinkLine>
      <S.LinkLine>
        <p>{linkTitle}</p>
      </S.LinkLine>
      <S.LinkLine>
        <S.OpenLink
          href={linkUrl}
          target="_blank"
          style={{ color: token.colorTextSecondary }}
        >
          <IoOpenOutline />
        </S.OpenLink>
      </S.LinkLine>
    </S.Link>
  )
}

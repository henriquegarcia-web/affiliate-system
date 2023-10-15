import * as S from './styles'
import * as G from '@/utils/styles/globals'
import { IoOpenOutline, IoSearchSharp } from 'react-icons/io5'

import { Button, Input, message, theme } from 'antd'

import ClipboardJS from 'clipboard'

import { useClientAuth } from '@/contexts/ClientAuthContext'
import { IMedia } from '@/@types/Admin'

const MediasView = () => {
  const { token } = theme.useToken()

  const { mediasList } = useClientAuth()

  return (
    <S.MediasView>
      <G.View>
        <G.ViewHeader
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.SearchInput>
            <Input
              style={{ width: '100%' }}
              addonAfter={
                <IoSearchSharp style={{ fontSize: 16, marginBottom: '-3px' }} />
              }
              placeholder="Pesquise aqui..."
            />
          </S.SearchInput>
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
              {mediasList?.length > 0 ? (
                mediasList?.map((media: IMedia) => (
                  <Link key={media.mediaId} media={media} />
                ))
              ) : (
                <S.EmptyLinks style={{ color: token.colorTextDescription }}>
                  Não há links de mídia registrados
                </S.EmptyLinks>
              )}
            </S.LinkWrapperContent>
          </S.LinkWrapper>
        </G.ViewContent>
      </G.View>
    </S.MediasView>
  )
}

export default MediasView

// =====================================================

// ======================================================= MEDIA ITEM

interface ILinkItem {
  media: IMedia
}

const Link = ({ media }: ILinkItem) => {
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
          data-clipboard-text={media.mediaUrl}
          onClick={handleCopyLink}
        >
          Ver Link
        </Button>
      </S.LinkLine>
      <S.LinkLine>
        <p>{media.mediaLabel}</p>
      </S.LinkLine>

      <span></span>
    </S.Link>
  )
}

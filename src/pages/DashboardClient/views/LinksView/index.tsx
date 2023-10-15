import { useMemo, useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'

import { Button, Input, message, theme } from 'antd'
import { IoSearchSharp } from 'react-icons/io5'

import ClipboardJS from 'clipboard'

import { useClientAuth } from '@/contexts/ClientAuthContext'
import { ILink } from '@/@types/Admin'

const LinksView = () => {
  const { token } = theme.useToken()

  const { userData } = useClientAuth()

  const [linksSearch, setLinksSearch] = useState('')

  const handleSearch = (value: string) => setLinksSearch(value)

  const filteredLinks = useMemo(() => {
    if (!linksSearch) {
      return userData?.userAffiliateLinks
    }

    return userData?.userAffiliateLinks.filter((link) => {
      const objectAsString = JSON.stringify(link).toLowerCase()
      return objectAsString.includes(linksSearch.toLowerCase())
    })
  }, [userData, linksSearch])

  return (
    <S.LinksView>
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
              onChange={(e) => handleSearch(e.target.value)}
              value={linksSearch}
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
              {userData?.userAffiliateLinks ? (
                filteredLinks?.map((link: ILink) => (
                  <Link key={link.linkId} link={link} />
                ))
              ) : (
                <S.EmptyLinks style={{ color: token.colorTextDescription }}>
                  Não há links registrados
                </S.EmptyLinks>
              )}
            </S.LinkWrapperContent>
          </S.LinkWrapper>
        </G.ViewContent>
      </G.View>
    </S.LinksView>
  )
}

export default LinksView

// =====================================================

interface ILinkItem {
  link: ILink
}

const Link = ({ link }: ILinkItem) => {
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
          data-clipboard-text={link.linkUrl}
          onClick={handleCopyLink}
        >
          Copiar Link
        </Button>
      </S.LinkLine>
      <S.LinkLine>
        <p>{link.linkLabel}</p>
      </S.LinkLine>
    </S.Link>
  )
}

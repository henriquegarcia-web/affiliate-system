import { useEffect, useMemo, useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import { IoSearchSharp, IoCloseCircleOutline } from 'react-icons/io5'

import { Button, Input, Modal, Popconfirm, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { handleAddMediaLink, handleDeleteMediaLink } from '@/firebase/admin'

import { IMedia } from '@/@types/Admin'

const AdminMediasView = () => {
  const { token } = theme.useToken()

  const { mediasList } = useAdminAuth()

  const [mediasSearch, setMediasSearch] = useState('')

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)

  const handleSearch = (value: string) => setMediasSearch(value)

  const showMediaModal = () => setIsMediaModalOpen(true)
  const handleMediaModalClose = () => setIsMediaModalOpen(false)

  const handleDeleteMedia = async (mediaId: string) => {
    const deleteLinkResponse = await handleDeleteMediaLink(mediaId)

    if (deleteLinkResponse) {
      handleMediaModalClose()
    }
  }

  const filteredMedias = useMemo(() => {
    if (!mediasSearch) {
      return mediasList
    }

    return mediasList.filter((media) => {
      const objectAsString = JSON.stringify(media).toLowerCase()
      return objectAsString.includes(mediasSearch.toLowerCase())
    })
  }, [mediasList, mediasSearch])

  return (
    <S.AdminMediasView>
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
            onChange={(e) => handleSearch(e.target.value)}
            value={mediasSearch}
          />
          <Button type="default" onClick={showMediaModal}>
            Nova mídia
          </Button>
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
                filteredMedias?.map((media: IMedia) => (
                  <Link
                    key={media.mediaId}
                    media={media}
                    handleDeleteLink={handleDeleteMedia}
                  />
                ))
              ) : (
                <S.EmptyMedias style={{ color: token.colorTextDescription }}>
                  Não há links de mídia registrados
                </S.EmptyMedias>
              )}
            </S.LinkWrapperContent>
          </S.LinkWrapper>
        </G.ViewContent>
      </G.View>

      <CreateMediaModal
        isModalOpen={isMediaModalOpen}
        handleModalClose={handleMediaModalClose}
      />
    </S.AdminMediasView>
  )
}

export default AdminMediasView

// ======================================================= MEDIA ITEM

interface ILinkItem {
  media: IMedia
  handleDeleteLink: (mediaId: string) => void
}

const Link = ({ media, handleDeleteLink }: ILinkItem) => {
  const { token } = theme.useToken()

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
          // onClick={handleCopyLink}
        >
          Ver Link
        </Button>
      </S.LinkLine>
      <S.LinkLine>
        <p>{media.mediaLabel}</p>
      </S.LinkLine>

      <span>
        <Popconfirm
          title="Deletar mídia"
          description="Você tem certeza que deseja excluir esse link de mídia?"
          onConfirm={() => handleDeleteLink(media.mediaId)}
          okText="Sim"
          cancelText="Não"
        >
          <Button
            size="small"
            danger
            icon={
              <IoCloseCircleOutline
                style={{ fontSize: 18, marginTop: '2px' }}
              />
            }
          />
        </Popconfirm>
      </span>
    </S.Link>
  )
}

// ======================================================= MEDIA MODAL

interface ICreateMedia {
  mediaUrl: string
  mediaLabel: string
}

interface ICreateMediaModal {
  isModalOpen: boolean
  handleModalClose: () => void
}

const CreateMediaModal = ({
  isModalOpen,
  handleModalClose
}: ICreateMediaModal) => {
  const { token } = theme.useToken()

  const [creatingMediaLoading, setCreatingMediaLoading] = useState(false)

  const { control, handleSubmit, reset, formState } = useForm<ICreateMedia>()

  const { isValid } = formState

  const handleCreateMedia = async (data: ICreateMedia) => {
    setCreatingMediaLoading(true)

    const createMediaResponse = await handleAddMediaLink({
      mediaUrl: data.mediaUrl,
      mediaLabel: data.mediaLabel
    })

    setCreatingMediaLoading(false)

    if (createMediaResponse) {
      reset()
      handleModalClose()
    }
  }

  return (
    <Modal
      title="Criar link de mídia"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
      afterClose={handleModalClose}
    >
      <S.CreateMediaForm onSubmit={handleSubmit(handleCreateMedia)}>
        <Controller
          name="mediaUrl"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input {...field} placeholder="URL do link" style={{ flex: 1 }} />
          )}
        />
        <Controller
          name="mediaLabel"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input {...field} placeholder="Nome do link" style={{ flex: 1 }} />
          )}
        />
        <S.CreateMediaFormFooter>
          <Button
            type="primary"
            htmlType="submit"
            loading={creatingMediaLoading}
            disabled={!isValid}
          >
            Cadastrar link
          </Button>
        </S.CreateMediaFormFooter>
      </S.CreateMediaForm>
    </Modal>
  )
}

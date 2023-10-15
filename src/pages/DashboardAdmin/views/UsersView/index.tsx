/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import {
  IoSearchSharp,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
  IoLink
} from 'react-icons/io5'

import { Button, Input, Modal, Popconfirm, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import {
  handleAddComission,
  handleAddLinks,
  handleBlockUser,
  handleDeleteComission,
  handleDeleteLink
} from '@/firebase/admin'
import { IComission, ILink } from '@/@types/Admin'
import { timestampToDate } from '@/utils/functions/convertTimestamp'
import { IUserData } from '@/@types/Auth'

const UsersView = () => {
  const { token } = theme.useToken()

  const { affiliatesList } = useAdminAuth()

  const [usersSearch, setUsersSearch] = useState('')

  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false)
  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false)

  const [userSelected, setUserSelected] = useState(null)

  const handleSearch = (value: string) => setUsersSearch(value)

  const showLinksModal = (userData: any) => {
    setIsLinksModalOpen(true)
    setUserSelected(userData)
  }
  const handleLinksModalClose = () => {
    setIsLinksModalOpen(false)
    setUserSelected(null)
  }

  const showComissionModal = (userData: any) => {
    setIsComissionModalOpen(true)
    setUserSelected(userData)
  }
  const handleComissionModalClose = () => {
    setIsComissionModalOpen(false)
    setUserSelected(null)
  }

  const filteredUsers = useMemo(() => {
    if (!usersSearch) {
      return affiliatesList
    }

    return affiliatesList.filter((withdraw) => {
      const objectAsString = JSON.stringify(withdraw).toLowerCase()
      return objectAsString.includes(usersSearch.toLowerCase())
    })
  }, [affiliatesList, usersSearch])

  return (
    <S.UsersView>
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
            value={usersSearch}
          />
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.UsersWrapper>
            {affiliatesList?.length > 0 ? (
              filteredUsers?.map((affiliate) => (
                <User
                  key={affiliate.userId}
                  affiliate={affiliate}
                  showLinksModal={showLinksModal}
                  showComissionModal={showComissionModal}
                />
              ))
            ) : (
              <S.EmptyUsers style={{ color: token.colorTextDescription }}>
                Não há usuários criados
              </S.EmptyUsers>
            )}
          </S.UsersWrapper>
        </G.ViewContent>
      </G.View>

      <LinksAffiliateModal
        userSelected={userSelected}
        isModalOpen={isLinksModalOpen}
        handleModalClose={handleLinksModalClose}
      />
      <ComissionAffiliateModal
        userSelected={userSelected}
        isModalOpen={isComissionModalOpen}
        handleModalClose={handleComissionModalClose}
      />
    </S.UsersView>
  )
}

export default UsersView

// =========================================== USER ITEM

interface IUser {
  affiliate: IUserData
  showLinksModal: (affiliate: IUserData) => void
  showComissionModal: (affiliate: IUserData) => void
}

const User = ({ affiliate, showLinksModal, showComissionModal }: IUser) => {
  const { token } = theme.useToken()

  const handleBlockAffiliate = async () => {
    const blockUserResponse = await handleBlockUser({
      userId: affiliate.userId,
      userEmail: affiliate.userEmail,
      userBlocked: true
    })
  }

  const handleEnableAffiliate = async () => {
    const blockUserResponse = await handleBlockUser({
      userId: affiliate.userId,
      userEmail: affiliate.userEmail,
      userBlocked: false
    })
  }

  return (
    <S.User
      style={{
        backgroundColor: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorTextSecondary
      }}
    >
      <p>
        <b>{affiliate.userName}</b> / {affiliate.userEmail}
        {affiliate.userBlocked && <span>Bloqueado</span>}
      </p>

      <span>
        <Button onClick={() => showLinksModal(affiliate)}>Links</Button>
        <Button onClick={() => showComissionModal(affiliate)}>Comissão</Button>

        {affiliate.userBlocked ? (
          <Button
            onClick={handleEnableAffiliate}
            icon={
              <IoCheckmarkCircleOutline
                style={{ fontSize: 20, marginLeft: '5px' }}
              />
            }
          />
        ) : (
          <Button
            onClick={handleBlockAffiliate}
            icon={
              <IoCloseCircleOutline
                style={{ fontSize: 20, marginLeft: '5px' }}
              />
            }
            danger
          />
        )}
      </span>
    </S.User>
  )
}

// =========================================== LINK AFFILIATE MODAL

interface ILinksForm {
  linkUrl: string
  linkLabel: string
}

interface ILinksAffiliateModal {
  userSelected: any
  isModalOpen: boolean
  handleModalClose: () => void
}

const LinksAffiliateModal = ({
  isModalOpen,
  handleModalClose,
  userSelected
}: ILinksAffiliateModal) => {
  const { token } = theme.useToken()

  const [createLinksLoading, setCreateLinksLoading] = useState(false)

  const { control, handleSubmit, reset, formState } = useForm<ILinksForm>()

  const { isValid } = formState

  const handleCreateLink = async (data: ILinksForm) => {
    setCreateLinksLoading(true)

    if (!userSelected) return

    const createLinkResponse = await handleAddLinks({
      userId: userSelected.userId,
      linkUrl: data.linkUrl,
      linkLabel: data.linkLabel
    })

    setCreateLinksLoading(false)

    if (createLinkResponse) {
      reset()
      handleModalClose()
    }
  }

  const handleDelete = async (linkId: string) => {
    const deleteLinkResponse = await handleDeleteLink({
      userId: userSelected.userId,
      linkId
    })

    if (deleteLinkResponse) {
      handleModalClose()
    }
  }

  return (
    <Modal
      title="Links do afiliado"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
    >
      <S.LinksList
        style={{
          backgroundColor: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`
        }}
      >
        {userSelected?.userAffiliateLinks ? (
          userSelected?.userAffiliateLinks?.map((link: ILink) => (
            <Link
              key={link.linkId}
              link={link}
              handleDeleteLink={handleDelete}
            />
          ))
        ) : (
          <S.EmptyLink style={{ color: token.colorTextDisabled }}>
            Nenhum link criado
          </S.EmptyLink>
        )}
      </S.LinksList>
      <S.LinksFormCreation onSubmit={handleSubmit(handleCreateLink)}>
        <Controller
          name="linkUrl"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input {...field} placeholder="URL do link" style={{ flex: 1 }} />
          )}
        />
        <Controller
          name="linkLabel"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input {...field} placeholder="Nome do link" style={{ flex: 1 }} />
          )}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={createLinksLoading}
          disabled={!isValid}
        >
          Cadastrar link
        </Button>
      </S.LinksFormCreation>
    </Modal>
  )
}

// =========================================== LINK

interface ILinkItem {
  link: ILink
  handleDeleteLink: (linkId: string) => void
}

const Link = ({ link, handleDeleteLink }: ILinkItem) => {
  const { token } = theme.useToken()

  return (
    <S.Link
      style={{
        backgroundColor: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorTextSecondary
      }}
    >
      <Popconfirm
        placement="topLeft"
        title={link.linkLabel}
        description={link.linkUrl}
        onConfirm={() => {}}
        okText="Ok"
        showCancel={false}
        icon={
          <S.LinkIcon>
            <IoLink />
          </S.LinkIcon>
        }
      >
        <Button type="primary" size="small">
          Ver Link
        </Button>
      </Popconfirm>
      <p>{link.linkLabel}</p>

      <span>
        <Popconfirm
          title="Deletar link"
          description="Você tem certeza que deseja excluir esse link?"
          onConfirm={() => handleDeleteLink(link.linkId)}
          okText="Sim"
          cancelText="Não"
        >
          <Button
            size="small"
            danger
            icon={
              <IoCloseCircleOutline
                style={{ fontSize: 16, marginLeft: '3px' }}
              />
            }
          />
        </Popconfirm>
      </span>
    </S.Link>
  )
}

// =========================================== COMISSION AFFILIATE MODAL

interface IComissionForm {
  comissionValue: number
}

interface IComissionAffiliateModal {
  userSelected: any
  isModalOpen: boolean
  handleModalClose: () => void
}

const ComissionAffiliateModal = ({
  isModalOpen,
  handleModalClose,
  userSelected
}: IComissionAffiliateModal) => {
  const { token } = theme.useToken()

  const [createComissionLoading, setCreateComissionLoading] = useState(false)

  const { control, handleSubmit, reset, formState } = useForm<IComissionForm>()

  const { isValid } = formState

  const handleCreateComission = async (data: IComissionForm) => {
    setCreateComissionLoading(true)

    if (!userSelected) return

    const createComissionResponse = await handleAddComission({
      userId: userSelected.userId,
      comissionValue: data.comissionValue
    })

    setCreateComissionLoading(false)

    if (createComissionResponse) {
      reset()
      handleModalClose()
    }
  }

  const handleDelete = async (comissionId: string) => {
    const deleteComissionResponse = await handleDeleteComission({
      userId: userSelected.userId,
      comissionId
    })

    if (deleteComissionResponse) {
      handleModalClose()
    }
  }

  return (
    <Modal
      title="Comissões do afiliado"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
    >
      <S.LinksComission
        style={{
          backgroundColor: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`
        }}
      >
        {userSelected?.userAffiliateComission ? (
          userSelected?.userAffiliateComission?.map((comission: IComission) => (
            <Comission
              key={comission.comissionId}
              link={comission}
              handleDeleteComission={handleDelete}
            />
          ))
        ) : (
          <S.EmptyLink style={{ color: token.colorTextDisabled }}>
            Nenhuma comissão criada
          </S.EmptyLink>
        )}
      </S.LinksComission>
      <S.ComissionFormCreation onSubmit={handleSubmit(handleCreateComission)}>
        <Controller
          name="comissionValue"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={0}
              placeholder="Número de aquisições"
              style={{ flex: 1 }}
            />
          )}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={createComissionLoading}
          disabled={!isValid}
        >
          Adicionar
        </Button>
      </S.ComissionFormCreation>
    </Modal>
  )
}

// =========================================== COMISSION

interface IComissionItem {
  link: IComission
  handleDeleteComission: (linkId: string) => void
}

const Comission = ({ link, handleDeleteComission }: IComissionItem) => {
  const { token } = theme.useToken()

  return (
    <S.Comission
      style={{
        backgroundColor: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorTextSecondary
      }}
    >
      <b>{link.comissionValue} </b> <p>vendas registradas em</p>{' '}
      <b>{timestampToDate(link.comissionRegisteredAt)}</b>
      <span>
        <Popconfirm
          title="Deletar link"
          description="Você tem certeza que deseja excluir essa comissão?"
          onConfirm={() => handleDeleteComission(link.comissionId)}
          okText="Sim"
          cancelText="Não"
        >
          <Button
            size="small"
            danger
            icon={
              <IoCloseCircleOutline
                style={{ fontSize: 16, marginLeft: '3px' }}
              />
            }
          />
        </Popconfirm>
      </span>
    </S.Comission>
  )
}

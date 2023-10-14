/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import {
  IoSearchSharp,
  IoTrashBinOutline,
  IoCreateOutline
} from 'react-icons/io5'

import { Button, Input, Modal, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { handleAddLinks } from '@/firebase/admin'

interface ILinksForm {
  linkUrl: string
}

const UsersView = () => {
  const { token } = theme.useToken()

  const { affiliatesList } = useAdminAuth()

  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false)
  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false)

  const [userSelected, setUserSelected] = useState(null)

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

  const onSearch = (e: any) => console.log(e)

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
          />
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.UsersWrapper>
            {affiliatesList?.map((affiliate) => (
              <User
                key={affiliate.userId}
                affiliate={affiliate}
                showLinksModal={showLinksModal}
                showComissionModal={showComissionModal}
              />
            ))}
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
  affiliate: any
  showLinksModal: (affiliate: any) => void
  showComissionModal: (affiliate: any) => void
}

const User = ({ affiliate, showLinksModal, showComissionModal }: IUser) => {
  const { token } = theme.useToken()

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
      </p>

      <span>
        <Button onClick={showLinksModal}>Links</Button>
        <Button onClick={showComissionModal}>Comissão</Button>
        <Button
          icon={
            <IoTrashBinOutline style={{ fontSize: 16, marginLeft: '7px' }} />
          }
        />
      </span>
    </S.User>
  )
}

// =========================================== LINK AFFILIATE MODAL

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

  const { isValid: isValidLinks } = formState

  const handleCreateLink = async (data: ILinksForm) => {
    setCreateLinksLoading(true)

    if (!userSelected) return

    const signupAdminResponse = await handleAddLinks({
      userEmail: userSelected.userEmail,
      link: data.linkUrl
    })

    setCreateLinksLoading(false)

    if (signupAdminResponse) {
      reset()
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
        <S.Link
          style={{
            backgroundColor: token.colorBgElevated,
            border: `1px solid ${token.colorBorderSecondary}`,
            color: token.colorTextSecondary
          }}
        >
          <Button type="primary" size="small">
            Ver Link
          </Button>
          <p>Link da Homepage</p>

          <span>
            <Button
              size="small"
              icon={
                <IoCreateOutline style={{ fontSize: 16, marginLeft: '4px' }} />
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
            Ver Link
          </Button>
          <p>Link do Cassino Homepage</p>

          <span>
            <Button
              size="small"
              icon={
                <IoCreateOutline style={{ fontSize: 16, marginLeft: '4px' }} />
              }
            />
          </span>
        </S.Link>
      </S.LinksList>
      <S.LinksFormCreation onSubmit={handleSubmit(handleCreateLink)}>
        <Controller
          name="linkUrl"
          control={control}
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <Input {...field} placeholder="Digite o link" style={{ flex: 1 }} />
          )}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={createLinksLoading}
          disabled={!isValidLinks}
        >
          Cadastrar
        </Button>
      </S.LinksFormCreation>
    </Modal>
  )
}

// =========================================== COMISSION AFFILIATE MODAL

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
  const [createComissionLoading, setCreateComissionLoading] = useState(false)

  return (
    <Modal
      title="Comissões do afiliado"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
    ></Modal>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import {
  IoSearchSharp,
  IoTrashBinOutline,
  IoCreateOutline
} from 'react-icons/io5'

import { Button, Form, Input, Modal, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'
import { handleCreateUserAccount } from '@/firebase/auth'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { handleAddLinks } from '@/firebase/admin'

interface ICreateUserForm {
  userName: string
  userEmail: string
}

interface ILinksForm {
  linkUrl: string
}

const UsersView = () => {
  const { token } = theme.useToken()

  const { affiliatesList } = useAdminAuth()

  const [createUserLoading, setCreateUserLoading] = useState(false)
  const [createLinksLoading, setCreateLinksLoading] = useState(false)
  const [createComissionLoading, setCreateComissionLoading] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false)
  const [isComissionModalOpen, setIsComissionModalOpen] = useState(false)

  const [userSelected, setUserSelected] = useState(null)

  const showCreateModal = () => setIsCreateModalOpen(true)
  const handleCreateModalOk = () => setIsCreateModalOpen(false)
  const handleCreateModalCancel = () => setIsCreateModalOpen(false)

  const showLinksModal = (userData: any) => {
    setIsLinksModalOpen(true)
    setUserSelected(userData)
  }
  const handleLinksModalOk = () => {
    setIsLinksModalOpen(false)
    setUserSelected(null)
  }
  const handleLinksModalCancel = () => {
    setIsLinksModalOpen(false)
    setUserSelected(null)
  }

  const showComissionModal = (userData: any) => {
    setIsComissionModalOpen(true)
    setUserSelected(userData)
  }
  const handleComissionModalOk = () => {
    setIsComissionModalOpen(false)
    setUserSelected(null)
  }
  const handleComissionModalCancel = () => {
    setIsComissionModalOpen(false)
    setUserSelected(null)
  }

  const onSearch = (e: any) => console.log(e)

  const { control, handleSubmit, reset, formState } = useForm<ICreateUserForm>()

  const { isValid } = formState

  const handleCreateUser = async (data: ICreateUserForm) => {
    setCreateUserLoading(true)

    const signupAdminResponse = await handleCreateUserAccount({
      userName: data.userName,
      userEmail: data.userEmail,
      userRegisteredAt: Date.now(),
      userIsAdmin: false,
      userIsAuthenticated: false
    })

    setCreateUserLoading(false)

    if (signupAdminResponse) {
      reset()
      handleCreateModalOk()
    }
  }

  const {
    control: controlLinks,
    handleSubmit: handleSubmitLinks,
    reset: resetLinks,
    formState: formStateLinks
  } = useForm<ILinksForm>()

  const { isValid: isValidLinks } = formStateLinks

  const handleCreateLink = async (data: ILinksForm) => {
    setCreateLinksLoading(true)

    const signupAdminResponse = await handleAddLinks({
      userEmail: userSelected.userEmail,
      link: data.linkUrl
    })

    setCreateLinksLoading(false)

    if (signupAdminResponse) {
      resetLinks()
      handleLinksModalOk()
    }
  }

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
          <Button type="default" onClick={showCreateModal}>
            Novo afiliado
          </Button>
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          {affiliatesList?.map((affiliate) => (
            <S.User
              key={affiliate.userId}
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
                    <IoTrashBinOutline
                      style={{ fontSize: 16, marginLeft: '7px' }}
                    />
                  }
                />
              </span>
            </S.User>
          ))}
        </G.ViewContent>
      </G.View>

      <Modal
        title="Cadastrar afiliado"
        open={isCreateModalOpen}
        onOk={handleCreateModalOk}
        onCancel={handleCreateModalCancel}
        footer={null}
        destroyOnClose
      >
        <S.CreateClientForm
          layout="vertical"
          onFinish={handleSubmit(handleCreateUser)}
        >
          <Form.Item label="Nome do afiliado">
            <Controller
              name="userName"
              control={control}
              rules={{ required: 'Este campo é obrigatório' }}
              render={({ field }) => (
                <Input {...field} placeholder="Digite o nome" />
              )}
            />
          </Form.Item>
          <Form.Item label="E-mail do afiliado">
            <Controller
              name="userEmail"
              control={control}
              rules={{ required: 'Este campo é obrigatório' }}
              render={({ field }) => (
                <Input {...field} placeholder="Digite o e-mail" />
              )}
            />
          </Form.Item>

          <S.CreateClientFormFooter>
            <Button
              type="primary"
              htmlType="submit"
              loading={createUserLoading}
              disabled={!isValid}
            >
              Cadastrar
            </Button>
          </S.CreateClientFormFooter>
        </S.CreateClientForm>
      </Modal>

      <Modal
        title="Links do afiliado"
        open={isLinksModalOpen}
        onOk={handleLinksModalOk}
        onCancel={handleLinksModalCancel}
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
              Ver Link
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
        </S.LinksList>
        <S.LinksFormCreation onSubmit={handleSubmitLinks(handleCreateLink)}>
          <Controller
            name="linkUrl"
            control={controlLinks}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Digite o link"
                style={{ flex: 1 }}
              />
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

      <Modal
        title="Comissões do afiliado"
        open={isComissionModalOpen}
        onOk={handleComissionModalOk}
        onCancel={handleComissionModalCancel}
        footer={null}
        destroyOnClose
      ></Modal>
    </S.UsersView>
  )
}

export default UsersView

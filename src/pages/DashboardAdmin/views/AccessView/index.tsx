import { useMemo, useState } from 'react'

import * as S from './styles'
import * as G from '@/utils/styles/globals'
import {
  IoSearchSharp,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
  IoChevronDownOutline
} from 'react-icons/io5'

import { Button, Dropdown, Form, Input, Modal, theme } from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import {
  handleCreateAuthenticatedUser,
  handleBlockAuthenticatedUser
} from '@/firebase/admin'

const AccessView = () => {
  const { token } = theme.useToken()

  const { authenticatedUsersList } = useAdminAuth()

  const [accessSearch, setAccessSearch] = useState('')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const showCreateModal = () => setIsCreateModalOpen(true)
  const handleCreateModalClose = () => setIsCreateModalOpen(false)

  const handleSearch = (value: string) => setAccessSearch(value)

  const filteredAccess = useMemo(() => {
    if (!accessSearch) {
      return authenticatedUsersList
    }

    return authenticatedUsersList.filter((access) => {
      const objectAsString = JSON.stringify(access).toLowerCase()
      return objectAsString.includes(accessSearch.toLowerCase())
    })
  }, [authenticatedUsersList, accessSearch])

  return (
    <S.AccessView>
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
            value={accessSearch}
          />
          <Button type="default" onClick={showCreateModal}>
            Novo acesso
          </Button>
        </G.ViewHeader>
        <G.ViewContent
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.AccessWrapper>
            {authenticatedUsersList?.length > 0 ? (
              filteredAccess?.map((authenticatedUser) => (
                <User
                  key={authenticatedUser.userEmail}
                  authenticatedUser={authenticatedUser}
                />
              ))
            ) : (
              <S.EmptyAccess style={{ color: token.colorTextDescription }}>
                Não há acessos criados
              </S.EmptyAccess>
            )}
          </S.AccessWrapper>
        </G.ViewContent>
      </G.View>

      <CreateAffiliateModal
        isModalOpen={isCreateModalOpen}
        handleModalClose={handleCreateModalClose}
      />
    </S.AccessView>
  )
}

export default AccessView

// =========================================== USER ITEM

interface IUser {
  authenticatedUser: any
}

const User = ({ authenticatedUser }: IUser) => {
  const { token } = theme.useToken()

  const { agreementList } = useAdminAuth()

  const handleBlockUserAccess = async () => {
    const blockUserResponse = await handleBlockAuthenticatedUser({
      userEmail: authenticatedUser.userEmail,
      userBlocked: true
    })
  }

  const handleEnableUserAccess = async () => {
    const blockUserResponse = await handleBlockAuthenticatedUser({
      userEmail: authenticatedUser.userEmail,
      userBlocked: false
    })
  }

  const formattedAgreements: any[] = useMemo(() => {
    return (
      agreementList?.map((item) => ({
        key: item.agreementId,
        label: item.agreementLabel
      })) || []
    )
  }, [agreementList])

  const getAgreementLabel = (key: string): string | null => {
    const item: any = formattedAgreements.find((item) => item.key === key)
    return item ? item.label : null
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
        <b>{authenticatedUser.userName}</b> / {authenticatedUser.userEmail}
        {authenticatedUser?.userAgreement && (
          <span className="agreement">
            {getAgreementLabel(authenticatedUser?.userAgreement)}
          </span>
        )}
        {authenticatedUser.userBlocked && (
          <span className="blocked">Bloqueado</span>
        )}
      </p>

      <span>
        {authenticatedUser.userBlocked ? (
          <Button
            onClick={handleEnableUserAccess}
            icon={
              <IoCheckmarkCircleOutline
                style={{ fontSize: 20, marginLeft: '5px' }}
              />
            }
          />
        ) : (
          <Button
            onClick={handleBlockUserAccess}
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

// =========================================== NEW AFFILIATE MODAL

interface ICreateUserForm {
  userName: string
  userEmail: string
  userAgreement: string
}

interface ICreateAffiliateModal {
  isModalOpen: boolean
  handleModalClose: () => void
}

const CreateAffiliateModal = ({
  isModalOpen,
  handleModalClose
}: ICreateAffiliateModal) => {
  const { agreementList } = useAdminAuth()

  const [createUserLoading, setCreateUserLoading] = useState(false)

  const { control, handleSubmit, reset, formState } = useForm<ICreateUserForm>()

  const { isValid } = formState

  const handleCreateUser = async (data: ICreateUserForm) => {
    setCreateUserLoading(true)

    const signupAdminResponse = await handleCreateAuthenticatedUser({
      userName: data.userName,
      userEmail: data.userEmail,
      userAgreement: data.userAgreement
    })

    setCreateUserLoading(false)

    if (signupAdminResponse) {
      reset()
      handleModalClose()
    }
  }

  const formattedAgreements: any[] = useMemo(() => {
    return (
      agreementList?.map((item) => ({
        key: item.agreementId,
        label: item.agreementLabel
      })) || []
    )
  }, [agreementList])

  const getAgreementLabel = (key: string): string | null => {
    const item: any = formattedAgreements.find((item) => item.key === key)
    return item ? item.label : null
  }

  return (
    <Modal
      title="Cadastrar afiliado"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
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
        <Form.Item label="Acordo do afiliado">
          <Controller
            name="userAgreement"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <Dropdown.Button
                menu={{
                  items: formattedAgreements,
                  onClick: (e) => field.onChange(e.key),
                  style: { width: '100%' }
                }}
                icon={
                  <IoChevronDownOutline
                    style={{ fontSize: 16, marginBottom: '-4px' }}
                  />
                }
                trigger={['click']}
              >
                {field.value
                  ? getAgreementLabel(field.value.toString())
                  : 'Selecione um acordo'}
              </Dropdown.Button>
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
  )
}

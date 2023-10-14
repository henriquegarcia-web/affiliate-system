import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import * as S from './styles'

import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  Spin,
  Tooltip,
  Typography,
  theme
} from 'antd'

import { Controller, useForm } from 'react-hook-form'

import { formatUsername } from '@/utils/functions/formatUsername'
import { useClientAuth } from '@/contexts/ClientAuthContext'

import { IMenuData, adminMenuData, privateAdminMenuData } from '@/data/menu'
import type { MenuProps } from 'antd'

const DashboardClient = () => {
  const { token } = theme.useToken()

  const { userData } = useClientAuth()

  const [menuId, setMenuId] = useState(adminMenuData[0].menuId)

  const viewToRender = useMemo(() => {
    const activeMenuItem = adminMenuData.find(
      (menuItem) => menuItem.menuId === menuId
    )

    return activeMenuItem ? (
      activeMenuItem.menuComponent
    ) : (
      <>View naão encontrada</>
    )
  }, [menuId])

  return (
    <S.DashboardClient
      color={token.colorText}
      background={token.colorBgContainer}
    >
      <S.DashboardMenu
        style={{
          backgroundColor: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`
        }}
      >
        <S.DashboardMenuLogo
          style={{
            backgroundColor: token.colorBgLayout,
            borderBottom: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <img src="/logo_full.png" alt="" />
        </S.DashboardMenuLogo>
        <S.DashboardMenuWrapper>
          <S.DashboardMenuUserInfos
            style={{
              color: token.colorText
            }}
          >
            <b style={{ color: token.colorPrimary }}>{userData.userName}</b>
            <p>{userData.userEmail}</p>
            <span>
              <p>Seu acordo:</p> <b>CPA R$ 60</b>
            </span>
          </S.DashboardMenuUserInfos>

          {adminMenuData.map((menu: IMenuData) => {
            const buttonType = menu.menuId === menuId ? 'primary' : 'default'
            return (
              <Button
                key={menu.menuId}
                type={buttonType}
                icon={menu.menuIcon}
                onClick={() => setMenuId(menu.menuId)}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  fontSize: 13
                }}
              >
                {menu.menuLabel}
              </Button>
            )
          })}
        </S.DashboardMenuWrapper>
      </S.DashboardMenu>
      <S.DashboardView style={{ backgroundColor: token.colorBgElevated }}>
        <S.DashboardViewHeader
          style={{
            backgroundColor: token.colorBgLayout,
            borderBottom: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <UserMenu />
        </S.DashboardViewHeader>
        <S.DashboardViewWrapper>{viewToRender}</S.DashboardViewWrapper>
      </S.DashboardView>
    </S.DashboardClient>
  )
}

export default DashboardClient

// ===============================================

interface IUserMenu {}

const UserMenu = ({}: IUserMenu) => {
  const { token } = theme.useToken()

  const navigate = useNavigate()
  const { handleLogout, userData } = useClientAuth()

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isWithdrawHistoricModalOpen, setIsWithdrawHistoricModalOpen] =
    useState(false)

  const showWithdrawModal = () => setIsWithdrawModalOpen(true)
  const handleWithdrawModalClose = () => setIsWithdrawModalOpen(false)

  const showWithdrawHistoricModal = () => setIsWithdrawHistoricModalOpen(true)
  const handleWithdrawHistoricModalClose = () =>
    setIsWithdrawHistoricModalOpen(false)

  // -----------------------------------------------------

  const formattedPrivateMenus: MenuProps['items'] = useMemo(() => {
    const transformedMenus = privateAdminMenuData.map((menu: any) => {
      return {
        label: menu.menuLabel,
        key: menu.menuId,
        icon: menu.menuIcon,
        disabled: menu.menuDisabled,
        danger: menu.menuDanger
      }
    })

    return transformedMenus
  }, [])

  return (
    <S.HeaderUserMenu>
      <Dropdown
        menu={{
          items: formattedPrivateMenus,
          onClick: (e) => {
            if (e.key === 'withdraw') {
              showWithdrawModal()
              return
            }
            if (e.key === 'withdraw-historic') {
              showWithdrawHistoricModal()
              return
            }
            if (e.key === 'sair') {
              handleLogout()
              return
            }
            navigate(`/admin/${e.key}`)
          }
        }}
      >
        <S.UserMenu>
          <S.UserMenuBalance style={{ color: token.colorText }}>
            R$ 1.500,00
          </S.UserMenuBalance>

          <S.UserMenuName style={{ color: token.colorText }}>
            {!userData ? 'Carregando...' : userData?.userName}
          </S.UserMenuName>
          <Avatar
            size={28}
            style={{
              fontSize: 12,
              backgroundColor: '#fde3cf',
              color: '#f56a00'
            }}
          >
            {!userData ? (
              <Spin size="small" style={{ marginTop: '-4px' }} />
            ) : (
              formatUsername(userData?.userName)
            )}
          </Avatar>
        </S.UserMenu>
      </Dropdown>

      <WithdrawModal
        isModalOpen={isWithdrawModalOpen}
        handleModalClose={handleWithdrawModalClose}
      />

      <WithdrawHistoricModal
        isModalOpen={isWithdrawHistoricModalOpen}
        handleModalClose={handleWithdrawHistoricModalClose}
      />
    </S.HeaderUserMenu>
  )
}

// =========================================== WITHDRAW

interface IWithdrawModal {
  isModalOpen: boolean
  handleModalClose: () => void
}

interface IWithdraw {
  usdtKey: string
}

const WithdrawModal = ({ isModalOpen, handleModalClose }: IWithdrawModal) => {
  const { token } = theme.useToken()

  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false)

  const { control, handleSubmit, reset, formState } = useForm<IWithdraw>()

  const { isValid } = formState

  const handleCreateUser = async (data: IWithdraw) => {
    setIsWithdrawLoading(true)

    // const signupAdminResponse = await handleCreateUserAccount({
    // })

    setIsWithdrawLoading(false)

    // if (signupAdminResponse) {
    //   reset()
    //   handleModalClose()
    // }
  }

  return (
    <Modal
      title="Solicitar saque"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
    >
      <S.WithdrawForm
        layout="vertical"
        onFinish={handleSubmit(handleCreateUser)}
      >
        <S.WithdrawAvailable>
          <p>Disponível para saque:</p>
          <b>R$ 1.500,00</b>
        </S.WithdrawAvailable>
        <Form.Item label="Chave USDT">
          <Controller
            name="usdtKey"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <>
                <Input {...field} placeholder="Digite sua chave USDT" />
                <Tooltip title="Clique para ver o vídeo de como obter a chave USDT">
                  <Typography.Link
                    href="#API"
                    style={{
                      display: 'flex',
                      width: 'fit-content',
                      fontSize: 12,
                      lineHeight: 2.5,
                      margin: '0 0 10px auto',
                      color: token.colorPrimary
                    }}
                  >
                    Precisa de ajuda?
                  </Typography.Link>
                </Tooltip>
              </>
            )}
          />
        </Form.Item>
        <S.WithdrawFormFooter>
          <Button
            type="primary"
            htmlType="submit"
            loading={isWithdrawLoading}
            disabled={!isValid}
          >
            Solicitar
          </Button>
        </S.WithdrawFormFooter>
      </S.WithdrawForm>
    </Modal>
  )
}

// =========================================== WITHDRAW HISTORIC

interface IWithdrawHistoricModal {
  isModalOpen: boolean
  handleModalClose: () => void
}
const WithdrawHistoricModal = ({
  isModalOpen,
  handleModalClose
}: IWithdrawHistoricModal) => {
  const { token } = theme.useToken()

  return (
    <Modal
      title="Histórico de saques"
      open={isModalOpen}
      onOk={handleModalClose}
      onCancel={handleModalClose}
      footer={null}
      destroyOnClose
    >
      <S.WithdrawHistoricWrapper>
        <S.WithdrawHistoricHeader>
          <S.WithdrawLine
            style={{
              color: token.colorTextTertiary
            }}
          >
            <p>Valor sacado</p>
          </S.WithdrawLine>
          <S.WithdrawLine
            style={{
              color: token.colorTextTertiary
            }}
          >
            <p>Data do saque</p>
          </S.WithdrawLine>
          <S.WithdrawLine
            style={{
              color: token.colorTextTertiary
            }}
          >
            <p>Status</p>
          </S.WithdrawLine>
        </S.WithdrawHistoricHeader>
        <S.WithdrawHistoricContent>
          <S.WithdrawHistoric
            style={{
              backgroundColor: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`
            }}
          >
            <S.WithdrawLine>R$ 5.600</S.WithdrawLine>
            <S.WithdrawLine>10/10/2023</S.WithdrawLine>
            <S.WithdrawLine>
              <S.WithdrawHistoricLabel type="concluded">
                Concluído
              </S.WithdrawHistoricLabel>
            </S.WithdrawLine>
          </S.WithdrawHistoric>
          <S.WithdrawHistoric
            style={{
              backgroundColor: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`
            }}
          >
            <S.WithdrawLine>R$ 10.900</S.WithdrawLine>
            <S.WithdrawLine>10/10/2023</S.WithdrawLine>
            <S.WithdrawLine>
              <S.WithdrawHistoricLabel type="pending">
                Pendente
              </S.WithdrawHistoricLabel>
            </S.WithdrawLine>
          </S.WithdrawHistoric>
          <S.WithdrawHistoric
            style={{
              backgroundColor: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`
            }}
          >
            <S.WithdrawLine>R$ 7.400</S.WithdrawLine>
            <S.WithdrawLine>10/10/2023</S.WithdrawLine>
            <S.WithdrawLine>
              <S.WithdrawHistoricLabel type="finished">
                Cancelado
              </S.WithdrawHistoricLabel>
            </S.WithdrawLine>
          </S.WithdrawHistoric>
        </S.WithdrawHistoricContent>
      </S.WithdrawHistoricWrapper>
    </Modal>
  )
}

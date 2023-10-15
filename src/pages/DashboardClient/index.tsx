import { useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'

import * as S from './styles'

import { IoMenu, IoClose } from 'react-icons/io5'

import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  Spin,
  Typography,
  message,
  theme
} from 'antd'
import ReactPlayer from 'react-player'

import { Controller, useForm } from 'react-hook-form'

import { formatUsername } from '@/utils/functions/formatUsername'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import useClickOutside from '@/hooks/useClickOutside'
import { handleRequestWithdraw } from '@/firebase/client'
import { formatCurrency } from '@/utils/functions/formatCurrency'
import { timestampToDate } from '@/utils/functions/convertTimestamp'

import {
  IMenuData,
  affiliateMenuData,
  privateAffiliateMenuData
} from '@/data/menu'
import type { MenuProps } from 'antd'
import { IWithdraw } from '@/@types/Admin'

const DashboardClient = () => {
  const { token } = theme.useToken()

  const { handleLogout, userData, agreementList } = useClientAuth()

  const [menuId, setMenuId] = useState(affiliateMenuData[0].menuId)
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false)

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isWithdrawHistoricModalOpen, setIsWithdrawHistoricModalOpen] =
    useState(false)

  const showWithdrawModal = () => setIsWithdrawModalOpen(true)
  const handleWithdrawModalClose = () => setIsWithdrawModalOpen(false)

  const showWithdrawHistoricModal = () => setIsWithdrawHistoricModalOpen(true)
  const handleWithdrawHistoricModalClose = () =>
    setIsWithdrawHistoricModalOpen(false)

  const toggleMenuMobile = () => setIsMenuMobileOpen(!isMenuMobileOpen)
  const closeMenuMobile = () => setIsMenuMobileOpen(false)

  const menuMobileRef = useRef(null)

  const viewToRender = useMemo(() => {
    const activeMenuItem = affiliateMenuData.find(
      (menuItem) => menuItem.menuId === menuId
    )

    return activeMenuItem ? (
      activeMenuItem.menuComponent
    ) : (
      <>View naão encontrada</>
    )
  }, [menuId])

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

  useClickOutside({
    active: isMenuMobileOpen,
    containerRef: menuMobileRef,
    onClickOutside: () => setIsMenuMobileOpen(false)
  })

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
            <S.UserInfosName style={{ color: token.colorPrimary }}>
              {userData?.userName}
            </S.UserInfosName>
            <S.UserInfosEmail>{userData?.userEmail}</S.UserInfosEmail>
            <span>
              <p>Seu acordo:</p>
              <b>{getAgreementLabel(userData?.userAgreement)}</b>
            </span>
          </S.DashboardMenuUserInfos>

          {affiliateMenuData.map((menu: IMenuData) => {
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
          <S.DashboardMenuLogoMobile
            style={{
              backgroundColor: token.colorBgLayout,
              borderBottom: `1px solid ${token.colorBorderSecondary}`
            }}
          >
            <img src="/logo_full.png" alt="" />
          </S.DashboardMenuLogoMobile>
          <UserMenu
            isWithdrawModalOpen={isWithdrawModalOpen}
            showWithdrawModal={showWithdrawModal}
            handleWithdrawModalClose={handleWithdrawModalClose}
            isWithdrawHistoricModalOpen={isWithdrawHistoricModalOpen}
            showWithdrawHistoricModal={showWithdrawHistoricModal}
            handleWithdrawHistoricModalClose={handleWithdrawHistoricModalClose}
            closeMenuMobile={closeMenuMobile}
          />
          <S.MenuMobileToggle
            style={{ color: token.colorText }}
            onClick={toggleMenuMobile}
          >
            {isMenuMobileOpen ? <IoClose /> : <IoMenu />}
          </S.MenuMobileToggle>
        </S.DashboardViewHeader>
        <S.DashboardViewWrapper>{viewToRender}</S.DashboardViewWrapper>
      </S.DashboardView>

      <S.MenuMobile
        ref={menuMobileRef}
        style={{ backgroundColor: token.colorBgElevated }}
        open={isMenuMobileOpen ? 1 : 0}
      >
        <UserMenu
          isWithdrawModalOpen={isWithdrawModalOpen}
          showWithdrawModal={showWithdrawModal}
          handleWithdrawModalClose={handleWithdrawModalClose}
          isWithdrawHistoricModalOpen={isWithdrawHistoricModalOpen}
          showWithdrawHistoricModal={showWithdrawHistoricModal}
          handleWithdrawHistoricModalClose={handleWithdrawHistoricModalClose}
          mobile
          closeMenuMobile={closeMenuMobile}
        />
        <S.DashboardMenuUserInfos
          style={{
            color: token.colorText
          }}
        >
          <S.UserInfosName style={{ color: token.colorPrimary }}>
            {userData?.userName}
          </S.UserInfosName>
          <S.UserInfosEmail>{userData?.userEmail}</S.UserInfosEmail>
          <span>
            <p>Seu acordo:</p>
            <b>{getAgreementLabel(userData?.userAgreement)}</b>
          </span>
        </S.DashboardMenuUserInfos>
        <S.MainMenu>
          {affiliateMenuData.map((menu: IMenuData) => {
            const buttonType = menu.menuId === menuId ? 'primary' : 'default'
            return (
              <Button
                key={menu.menuId}
                type={buttonType}
                icon={menu.menuIcon}
                onClick={() => {
                  setMenuId(menu.menuId)
                  setIsMenuMobileOpen(false)
                }}
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
        </S.MainMenu>
        <S.BottomMenu>
          <Button
            onClick={() => {
              showWithdrawHistoricModal()
              setIsMenuMobileOpen(false)
            }}
          >
            Histórico de saques
          </Button>
          <Button danger style={{ width: '100%' }} onClick={handleLogout}>
            Sair
          </Button>
        </S.BottomMenu>
      </S.MenuMobile>
    </S.DashboardClient>
  )
}

export default DashboardClient

// ===============================================

interface IUserMenu {
  isWithdrawModalOpen: boolean
  showWithdrawModal: () => void
  handleWithdrawModalClose: () => void
  isWithdrawHistoricModalOpen: boolean
  showWithdrawHistoricModal: () => void
  handleWithdrawHistoricModalClose: () => void
  mobile?: boolean
  closeMenuMobile: () => void
}

const UserMenu = ({
  isWithdrawModalOpen,
  showWithdrawModal,
  handleWithdrawModalClose,
  isWithdrawHistoricModalOpen,
  showWithdrawHistoricModal,
  handleWithdrawHistoricModalClose,
  mobile = false,
  closeMenuMobile
}: IUserMenu) => {
  const { token } = theme.useToken()

  const navigate = useNavigate()
  const { handleLogout, userData, userBalance } = useClientAuth()

  // -----------------------------------------------------

  const formattedPrivateMenus: MenuProps['items'] = useMemo(() => {
    const transformedMenus = privateAffiliateMenuData.map((menu: any) => {
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

  if (mobile)
    return (
      <S.UserMenuMobile>
        <S.UserMenuBalance
          style={{ color: token.colorText }}
          onClick={() => {
            showWithdrawModal()
            closeMenuMobile()
          }}
        >
          <p>{formatCurrency(userBalance)}</p>
          <button
            style={{
              backgroundColor: token.colorBgContainer,
              // border: `1px solid ${token.colorBorderSecondary}`,
              color: token.colorPrimary
            }}
          >
            Sacar
          </button>
        </S.UserMenuBalance>

        {/* <S.UserMenuMobileWrapper
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
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
        </S.UserMenuMobileWrapper> */}
      </S.UserMenuMobile>
    )

  return (
    <S.HeaderUserMenu>
      <Dropdown
        menu={{
          items: formattedPrivateMenus,
          onClick: (e) => {
            if (e.key === 'withdraw') {
              showWithdrawModal()
              closeMenuMobile()
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
          <S.UserMenuBalance
            style={{ color: token.colorText }}
            onClick={() => {
              showWithdrawModal()
              closeMenuMobile()
            }}
          >
            <p>{formatCurrency(userBalance)}</p>
            <button
              style={{
                backgroundColor: token.colorBgContainer,
                // border: `1px solid ${token.colorBorderSecondary}`,
                color: token.colorPrimary
              }}
            >
              Sacar
            </button>
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

const WithdrawModal = ({ isModalOpen, handleModalClose }: IWithdrawModal) => {
  const { token } = theme.useToken()

  const { userId, userBalance } = useClientAuth()

  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false)

  const [isWithdrawVideoModal, setIsWithdrawVideoModal] = useState(false)

  const showWithdrawVideoModal = () => setIsWithdrawVideoModal(true)
  const handleWithdrawVideoModalClose = () => setIsWithdrawVideoModal(false)

  const { control, handleSubmit, reset, formState } = useForm<IWithdraw>()

  const { isValid } = formState

  const handleCreateUser = async (data: IWithdraw) => {
    setIsWithdrawLoading(true)

    if (!userId) {
      setIsWithdrawLoading(false)
      return
    }

    if (data.withdrawAmount <= 0) {
      message.open({
        type: 'error',
        content: 'Valor de saque inválido'
      })

      setIsWithdrawLoading(false)
      return
    }

    if (data.withdrawAmount > userBalance) {
      message.open({
        type: 'error',
        content: 'Saldo insuficiente para saque'
      })

      setIsWithdrawLoading(false)
      return
    }

    const withdrawResponse = await handleRequestWithdraw({
      userId: userId,
      withdrawUsdt: data.withdrawUsdt,
      withdrawAmount: data.withdrawAmount
    })

    setIsWithdrawLoading(false)

    if (withdrawResponse) {
      reset()
      handleModalClose()
    }
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
          <b>{formatCurrency(userBalance)}</b>
        </S.WithdrawAvailable>
        <Form.Item label="Chave USDT TRC20">
          <Controller
            name="withdrawUsdt"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <>
                <Input {...field} placeholder="Digite sua chave USDT TRC20" />
                <Typography
                  onClick={showWithdrawVideoModal}
                  style={{
                    display: 'flex',
                    width: 'fit-content',
                    fontSize: 12,
                    margin: '8px 0 -15px auto',
                    color: token.colorPrimary
                  }}
                >
                  Precisa de ajuda?
                </Typography>
              </>
            )}
          />
        </Form.Item>
        <Form.Item label="Valor do saque">
          <Controller
            name="withdrawAmount"
            control={control}
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="Digite o valor que deseja sacar"
                />
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

      <Modal
        title="Como obter a chave USDT TRC20"
        open={isWithdrawVideoModal}
        onOk={handleWithdrawVideoModalClose}
        onCancel={handleWithdrawVideoModalClose}
        footer={null}
        destroyOnClose
      >
        <ReactPlayer
          url="/usdt_video.mp4"
          playing={true}
          controls={true}
          width="100%"
          height="60vh"
          config={{
            file: {
              forceVideo: true
            }
          }}
        />
      </Modal>
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

  const { userData } = useClientAuth()

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
          {userData?.userAffiliateWithdraws ? (
            userData.userAffiliateWithdraws?.map((withdraw: IWithdraw) => (
              <S.WithdrawHistoric
                key={withdraw.withdrawId}
                style={{
                  backgroundColor: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`
                }}
              >
                <S.WithdrawLine>
                  {formatCurrency(withdraw?.withdrawAmount)}
                </S.WithdrawLine>
                <S.WithdrawLine>
                  {timestampToDate(withdraw?.withdrawRegisteredAt)}
                </S.WithdrawLine>
                <S.WithdrawLine>
                  <S.WithdrawHistoricLabel type={withdraw?.withdrawStatus}>
                    {getStatusLabel(withdraw?.withdrawStatus)}
                  </S.WithdrawHistoricLabel>
                </S.WithdrawLine>
              </S.WithdrawHistoric>
            ))
          ) : (
            <S.EmptyWithdraws style={{ color: token.colorTextDisabled }}>
              Nenhum saque realizado
            </S.EmptyWithdraws>
          )}
        </S.WithdrawHistoricContent>
      </S.WithdrawHistoricWrapper>
    </Modal>
  )
}

const getStatusLabel = (key: string): string | null => {
  const item: any = items.find((item) => item.key === key)
  return item ? item.label : null
}

const items: MenuProps['items'] = [
  {
    key: 'pending',
    label: 'Pendente'
  },
  {
    key: 'concluded',
    label: 'Concluído'
  },
  {
    key: 'finished',
    label: 'Cancelado'
  }
]

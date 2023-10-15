import { useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'

import * as S from './styles'
import { IoClose, IoMenu } from 'react-icons/io5'

import { Avatar, Button, Dropdown, Spin, theme } from 'antd'

import type { MenuProps } from 'antd'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { formatUsername } from '@/utils/functions/formatUsername'
import useClickOutside from '@/hooks/useClickOutside'

import { IMenuData, adminMenuData, privateAdminMenusData } from '@/data/menu'

const DashboardAdmin = () => {
  const navigate = useNavigate()

  const { token } = theme.useToken()

  const { handleLogout, userData } = useAdminAuth()

  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false)

  const [menuId, setMenuId] = useState(adminMenuData[0].menuId)

  const toggleMenuMobile = () => setIsMenuMobileOpen(!isMenuMobileOpen)
  const closeMenuMobile = () => setIsMenuMobileOpen(false)

  const menuMobileRef = useRef(null)

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

  useClickOutside({
    active: isMenuMobileOpen,
    containerRef: menuMobileRef,
    onClickOutside: () => setIsMenuMobileOpen(false)
  })

  return (
    <S.DashboardAdmin
      color={token.colorText}
      background={token.colorBgContainer}
    >
      <S.DashboardMenu
        style={{
          backgroundColor: token.colorBgLayout,
          borderRight: `1px solid ${token.colorBorderSecondary}`
        }}
      >
        <S.DashboardMenuLogo
          style={{
            borderBottom: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <img src="/logo_full.png" alt="" />
        </S.DashboardMenuLogo>
        <S.DashboardMenuWrapper>
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
          <S.DashboardMenuLogoMobile
            style={{
              backgroundColor: token.colorBgLayout,
              borderBottom: `1px solid ${token.colorBorderSecondary}`
            }}
          >
            <img src="/logo_full.png" alt="" />
          </S.DashboardMenuLogoMobile>

          <UserMenu
            // mobile
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
        <UserMenu mobile closeMenuMobile={closeMenuMobile} />
        <S.MainMenu>
          {adminMenuData.map((menu: IMenuData) => {
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
          <Button danger style={{ width: '100%' }} onClick={handleLogout}>
            Sair
          </Button>
        </S.BottomMenu>
      </S.MenuMobile>
    </S.DashboardAdmin>
  )
}

export default DashboardAdmin

// ==========================================================

interface IUserMenu {
  mobile?: boolean
  closeMenuMobile: () => void
}

const UserMenu = ({ mobile = false, closeMenuMobile }: IUserMenu) => {
  const { token } = theme.useToken()

  const navigate = useNavigate()
  const { handleLogout, userData } = useAdminAuth()

  // -----------------------------------------------------

  const formattedPrivateMenus: MenuProps['items'] = useMemo(() => {
    const transformedMenus = privateAdminMenusData.map((menu: any) => {
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
        <S.UserMenuMobileWrapper
          style={{
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          <S.UserMenuName style={{ color: token.colorText }}>
            {!userData ? 'Carregando...' : userData?.userName}
          </S.UserMenuName>
          <Avatar
            size={30}
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
        </S.UserMenuMobileWrapper>
      </S.UserMenuMobile>
    )

  return (
    <S.HeaderUserMenu>
      <Dropdown
        menu={{
          items: formattedPrivateMenus,
          onClick: (e) => {
            if (e.key === 'sair') {
              handleLogout()
              return
            }
            navigate(`/admin/${e.key}`)
          }
        }}
      >
        <S.UserMenu>
          <S.UserMenuName style={{ color: token.colorText }}>
            {!userData ? 'Carregando...' : userData?.userName}
          </S.UserMenuName>
          <Avatar
            size={30}
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
    </S.HeaderUserMenu>
  )
}

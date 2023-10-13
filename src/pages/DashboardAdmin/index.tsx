import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import * as S from './styles'
import { IoExitOutline, IoHomeOutline, IoPeopleOutline } from 'react-icons/io5'

import { Avatar, Button, Dropdown, Spin, theme } from 'antd'
import UsersView from './views/UsersView'

import type { MenuProps } from 'antd'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { formatUsername } from '@/utils/functions/formatUsername'

const DashboardAdmin = () => {
  const navigate = useNavigate()

  const { token } = theme.useToken()

  const { handleLogout, userData } = useAdminAuth()

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

  const formattedPrivateMenus: MenuProps['items'] = useMemo(() => {
    const transformedMenus = privateMenusData.map((menu: any) => {
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
                onClick={() => setMenuId(menu.menuId)}
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
        </S.DashboardViewHeader>
        <S.DashboardViewWrapper>{viewToRender}</S.DashboardViewWrapper>
      </S.DashboardView>
      {/* <button onClick={handleLogout}>Sair</button> */}
    </S.DashboardAdmin>
  )
}

export default DashboardAdmin

interface IMenuData {
  menuId: string
  menuLabel: string
  menuIcon: React.ReactNode
  menuComponent: React.ReactNode
}

const adminMenuData = [
  // {
  //   menuId: 'menu_home',
  //   menuLabel: 'Início',
  //   menuIcon: <IoHomeOutline />,
  //   menuComponent: <></>
  // },
  {
    menuId: 'menu_clients',
    menuLabel: 'Usuários',
    menuIcon: <IoPeopleOutline />,
    menuComponent: <UsersView />
  }
  // {
  //   menuId: '',
  //   menuLabel: '',
  //   menuIcon: <></>,
  //   menuComponent: <></>,
  // },
]

const privateMenusData = [
  // {
  //   menuId: 'minha-conta',
  //   menuLabel: 'Minha conta',
  //   menuIcon: <IoPersonOutline />,
  //   menuDisabled: false,
  //   menuDanger: false
  // },
  {
    menuId: 'sair',
    menuLabel: 'Sair',
    menuIcon: <IoExitOutline />,
    menuDisabled: false,
    menuDanger: true
  }
]

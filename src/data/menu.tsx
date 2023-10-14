import HomeView from '@/pages/DashboardClient/views/HomeView'
import LinksView from '@/pages/DashboardClient/views/LinksView'
import MediasView from '@/pages/DashboardClient/views/MediasView'

import {
  IoExitOutline,
  IoHomeOutline,
  IoLinkOutline,
  IoFolderOpenOutline,
  IoOpenOutline,
  IoReceiptOutline
} from 'react-icons/io5'

export interface IMenuData {
  menuId: string
  menuLabel: string
  menuIcon: React.ReactNode
  menuComponent: React.ReactNode
}

const adminMenuData = [
  {
    menuId: 'menu_home',
    menuLabel: 'Início',
    menuIcon: <IoHomeOutline />,
    menuComponent: <HomeView />
  },
  {
    menuId: 'menu_links',
    menuLabel: 'Links',
    menuIcon: <IoLinkOutline />,
    menuComponent: <LinksView />
  },
  {
    menuId: 'menu_clients',
    menuLabel: 'Mídias/Banners',
    menuIcon: <IoFolderOpenOutline />,
    menuComponent: <MediasView />
  }
]

const privateAdminMenuData = [
  {
    menuId: 'withdraw',
    menuLabel: 'Solicitar saque',
    menuIcon: <IoOpenOutline />,
    menuDisabled: false,
    menuDanger: false
  },
  {
    menuId: 'withdraw-historic',
    menuLabel: 'Histórico de saques',
    menuIcon: <IoReceiptOutline />,
    menuDisabled: false,
    menuDanger: false
  },
  {
    menuId: 'sair',
    menuLabel: 'Sair',
    menuIcon: <IoExitOutline />,
    menuDisabled: false,
    menuDanger: true
  }
]

export { adminMenuData, privateAdminMenuData }

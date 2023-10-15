import HomeView from '@/pages/DashboardClient/views/HomeView'
import LinksView from '@/pages/DashboardClient/views/LinksView'
import MediasView from '@/pages/DashboardClient/views/MediasView'

import UsersView from '@/pages/DashboardAdmin/views/UsersView'
import AccessView from '@/pages/DashboardAdmin/views/AccessView'
import WithdrawView from '@/pages/DashboardAdmin/views/WithdrawView'
import AdminMediasView from '@/pages/DashboardAdmin/views/AdminMediasView'

import {
  IoExitOutline,
  IoHomeOutline,
  IoLinkOutline,
  IoFolderOpenOutline,
  IoOpenOutline,
  IoReceiptOutline,
  IoPersonAddOutline,
  IoPeopleOutline,
  IoFileTrayFullOutline
} from 'react-icons/io5'

export interface IMenuData {
  menuId: string
  menuLabel: string
  menuIcon: React.ReactNode
  menuComponent: React.ReactNode
}

const affiliateMenuData = [
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

const privateAffiliateMenuData = [
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

const adminMenuData = [
  {
    menuId: 'menu_clients',
    menuLabel: 'Usuários',
    menuIcon: <IoPeopleOutline />,
    menuComponent: <UsersView />
  },
  {
    menuId: 'menu_withdraw',
    menuLabel: 'Solicitações',
    menuIcon: <IoFileTrayFullOutline />,
    menuComponent: <WithdrawView />
  },
  {
    menuId: 'menu_medias',
    menuLabel: 'Mídias/Banners',
    menuIcon: <IoFolderOpenOutline />,
    menuComponent: <AdminMediasView />
  },
  {
    menuId: 'menu_access',
    menuLabel: 'Acessos',
    menuIcon: <IoPersonAddOutline />,
    menuComponent: <AccessView />
  }
]

const privateAdminMenusData = [
  {
    menuId: 'sair',
    menuLabel: 'Sair',
    menuIcon: <IoExitOutline />,
    menuDisabled: false,
    menuDanger: true
  }
]

export {
  affiliateMenuData,
  adminMenuData,
  privateAffiliateMenuData,
  privateAdminMenusData
}

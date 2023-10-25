import styled from 'styled-components'
import {
  Window,
  adminMenuWidth,
  adminViewHeader,
  responsiveMobile,
  responsiveTablet
} from '@/utils/styles/globals'

interface IDashboard {
  color: string
  background: string
}

interface IMenuMobile {
  open: number
}

export const DashboardAdmin = styled(Window)<IDashboard>`
  position: relative;
  overflow: hidden;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-background-clip: text;
    -webkit-text-fill-color: ${({ color }) => color};
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: inset 0 0 20px 20px ${({ background }) => background};
  }
`

export const DashboardMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: ${adminMenuWidth};
  height: 100%;

  @media screen and (max-width: ${responsiveTablet}) {
    display: none;
  }
`

export const DashboardMenuLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${adminViewHeader};

  img {
    width: 70%;
  }

  @media screen and (max-width: ${responsiveTablet}) {
    display: none;
  }
`

export const DashboardMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 100%;
  height: calc(100% - ${adminViewHeader});
  padding: 15px;

  svg {
    font-size: 15px;
  }
`

export const DashboardView = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - ${adminMenuWidth});
  height: 100%;

  @media screen and (max-width: ${responsiveTablet}) {
    width: 100%;
  }
`

export const DashboardViewHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${adminViewHeader};
  padding: 0 10px;
`

export const DashboardViewWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - ${adminViewHeader});
`

// ====================================================== MENU MOBILE

export const MenuMobile = styled.div<IMenuMobile>`
  z-index: 1000;
  position: absolute;
  right: ${({ open }) => (open ? '0' : '-100%')};
  top: ${adminViewHeader};
  display: none;
  flex-direction: column;
  row-gap: 6px;
  width: 220px;
  height: calc(100% - ${adminViewHeader});
  padding: 15px;
  transition: 0.3s;

  @media screen and (max-width: ${responsiveTablet}) {
    display: flex;
  }
`

export const UserMenuMobile = styled.div`
  display: none;
  flex-direction: column-reverse;
  align-items: center;
  row-gap: 8px;
  width: 100%;
  height: fit-content;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    p {
      opacity: 1;
    }
  }

  @media screen and (max-width: ${responsiveMobile}) {
    display: flex;
  }
`

export const UserMenuMobileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 14px;
  width: 100%;
  padding: 10px 6px;
  border-radius: 8px;
`

export const MainMenu = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;

  button {
    font-size: 13px !important;
    line-height: 13px !important;
  }
`

export const BottomMenu = styled.div`
  display: none;
  flex-direction: column;
  row-gap: 6px;
  width: 100%;
  margin-top: auto;

  button {
    font-size: 13px !important;
    line-height: 13px !important;
  }

  @media screen and (max-width: ${responsiveMobile}) {
    display: flex;
  }
`

export const MenuMobileToggle = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  margin-left: 10px;
  cursor: pointer;

  svg {
    font-size: 24px;
  }

  @media screen and (max-width: ${responsiveTablet}) {
    display: flex;
  }
`

export const DashboardMenuLogoMobile = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: ${adminViewHeader};
  padding-left: 5px;

  img {
    height: 60%;
  }

  @media screen and (max-width: ${responsiveTablet}) {
    display: flex;
  }
`

// ====================================================== USER

export const HeaderUserMenu = styled.div`
  display: flex;
  width: fit-content;
  height: 100%;
  margin-left: auto;
`

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;

  &:hover {
    p {
      opacity: 1;
    }
  }

  @media screen and (max-width: ${responsiveMobile}) {
    display: none;
  }
`

export const UserMenuName = styled.p`
  display: flex;
  transition: 0.3s;
  opacity: 0.8;

  font-size: 14px;
`

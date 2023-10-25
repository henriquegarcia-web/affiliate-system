import styled from 'styled-components'
import {
  Window,
  adminMenuWidth,
  adminViewHeader,
  responsiveMobile,
  responsiveTablet
} from '@/utils/styles/globals'
import { Form } from 'antd'

interface IDashboard {
  color: string
  background: string
}

interface IMenuMobile {
  open: number
}

interface IWithdrawLabel {
  type: 'concluded' | 'pending' | 'finished'
}

export const DashboardClient = styled(Window)<IDashboard>`
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

export const DashboardMenuUserInfos = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  width: 100%;
  height: fit-content;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 8px;

  background-color: rgba(112, 220, 73, 0.1);
  border: 1px solid rgba(112, 220, 73, 0.4);

  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 3px;
    width: 100%;
    padding: 7px 10px 6px 10px;
    margin-top: 9px;
    border-radius: 6px;
    transition: 0.3s;

    p {
      font-size: 12px;
      line-height: 12px;
      font-weight: 400;
    }

    b {
      font-size: 12px;
      line-height: 12px;
      font-weight: 500;
    }

    background-color: rgba(112, 220, 73, 0.2);
    border: 1px solid rgba(112, 220, 73, 0.4);

    &:hover {
      background-color: rgba(112, 220, 73, 0.4);
      border: 1px solid rgba(112, 220, 73, 0.6);
    }
  }
`

export const UserInfosName = styled.b`
  font-size: 13px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`

export const UserInfosEmail = styled.p`
  font-size: 13px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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
  position: relative;
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

export const UserMenuBalance = styled.div`
  display: flex;
  width: fit-content;
  column-gap: 8px;
  margin-right: 6px;

  p {
    display: flex;
    width: fit-content;
    border-radius: 50px;
    padding: 6px 14px 5px 14px;

    font-size: 12px;
    line-height: 12px;
    font-weight: 500;

    background-color: rgba(112, 220, 73, 0.4);
    border: 1px solid rgba(112, 220, 73, 0.8);
  }

  button {
    display: flex;
    width: fit-content;
    border-radius: 6px;
    padding: 6px 14px 5px 14px;
    cursor: pointer;

    font-size: 12px;
    line-height: 12px;
    font-weight: 500;

    background-color: rgba(112, 220, 73, 0.4);
    border: 1px solid rgba(112, 220, 73, 0.8);
  }

  @media screen and (max-width: ${responsiveMobile}) {
    width: 100%;

    p {
      display: flex;
      justify-content: center;
      flex: 1;
    }
  }
`

export const UserMenuName = styled.p`
  display: flex;
  transition: 0.3s;
  opacity: 0.8;

  font-size: 14px;
`

// ====================================================== WITHDRAW FORM

export const WithdrawForm = styled(Form)`
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  .ant-form-item {
    margin-bottom: 0px;
  }
`

export const WithdrawAvailableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-bottom: 10px;
`

export const WithdrawAvailable = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  padding: 14px 12px;

  font-size: 14px;
  line-height: 14px;

  background-color: rgba(112, 220, 73, 0.4);
  border: 1px solid rgba(112, 220, 73, 0.8);
`

export const WithdrawAvailableAlert = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  padding: 14px 12px;

  font-size: 14px;
  line-height: 14px;

  background-color: rgba(220, 73, 73, 0.4);
  border: 1px solid rgba(220, 73, 73, 0.8);
`

export const WithdrawFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`

// ====================================================== WITHDRAW HISTORIC

const withdrawHeader = '20px'

export const WithdrawHistoricWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
`

export const WithdrawHistoricHeader = styled.div`
  display: flex;
  height: ${withdrawHeader};
  padding: 0 12px;
`

export const WithdrawHistoricContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  height: 360px;
`

export const EmptyWithdraws = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 0;

  font-size: 13px;
  line-height: 13px;
  font-weight: 400;
`

export const WithdrawHistoric = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 12px;
  border-radius: 8px;
  transition: 0.3s;

  &:hover {
    border: 1px solid rgba(112, 220, 73, 0.6) !important;
  }
`

export const WithdrawHistoricLabel = styled.div<IWithdrawLabel>`
  display: flex;
  width: fit-content;
  height: fit-content;
  padding: 5px 8px 4px 8px;
  border-radius: 4px;

  font-size: 12px;
  line-height: 12px;

  background-color: ${({ type }) =>
    type === 'concluded'
      ? 'rgba(112, 220, 73, 0.4)'
      : type === 'pending'
      ? 'rgba(220, 220, 73, 0.4)'
      : 'rgba(220, 73, 73, 0.4)'};

  border: 1px solid
    ${({ type }) =>
      type === 'concluded'
        ? 'rgba(112, 220, 73, 0.8)'
        : type === 'pending'
        ? 'rgba(220, 220, 73, 0.8)'
        : 'rgba(220, 73, 73, 0.8)'};
`

export const WithdrawLine = styled.div`
  display: flex;

  font-size: 13px;
  line-height: 13px;

  p {
    font-size: 11px;
    line-height: 11px;
    text-transform: uppercase;
  }

  &:nth-of-type(1) {
    width: 120px;
    font-weight: 500;
  }

  &:nth-of-type(2) {
    flex: 1;
  }

  &:nth-of-type(3) {
    width: 100px;
  }
`

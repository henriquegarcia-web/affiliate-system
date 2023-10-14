import styled from 'styled-components'
import { Window, adminMenuWidth, adminViewHeader } from '@/utils/styles/globals'

interface IDashboard {
  color: string
  background: string
}

export const DashboardAdmin = styled(Window)<IDashboard>`
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
`

export const DashboardMenuLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${adminViewHeader};

  img {
    height: 60%;
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
`

export const DashboardViewHeader = styled.div`
  display: flex;
  width: 100%;
  height: ${adminViewHeader};
  padding: 0 10px;
`

export const DashboardViewWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - ${adminViewHeader});
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
  cursor: pointer;

  &:hover {
    p {
      opacity: 1;
    }
  }
`

export const UserMenuName = styled.p`
  display: flex;
  transition: 0.3s;
  opacity: 0.8;

  font-size: 14px;
`

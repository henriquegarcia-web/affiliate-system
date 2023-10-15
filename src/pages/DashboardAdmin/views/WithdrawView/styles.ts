// import { Form } from 'antd'

import styled from 'styled-components'

export const WithdrawView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const WithdrawWrapper = styled.main`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const Withdraw = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 10px 12px;
  border-radius: 8px;
  cursor: pointer;

  p {
    font-size: 14px;
    line-height: 14px;
    font-weight: 300;

    b {
      font-weight: 500;
    }
  }

  span {
    display: flex;
    column-gap: 6px;
  }
`

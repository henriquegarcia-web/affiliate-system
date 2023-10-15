// import { Form } from 'antd'

import styled from 'styled-components'

export const WithdrawView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const WithdrawWrapper = styled.div`
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

export const WithdrawDetails = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: fit-content;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`

export const WithdrawEditStatusForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: fit-content;
`

export const WithdrawEditStatusFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`

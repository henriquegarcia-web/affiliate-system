// import { Form } from 'antd'

import styled from 'styled-components'

interface IWithdrawLabel {
  type: 'concluded' | 'pending' | 'finished'
}

export const WithdrawView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const WithdrawList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: 100%;
  padding: 10px;
`

const withdrawListHeader = '20px'

export const WithdrawHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${withdrawListHeader};
  padding: 0 10px;

  /* border: 1px solid red; */
`

export const WithdrawWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: calc(100% - ${withdrawListHeader});
`

export const EmptyWithdraw = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - ${withdrawListHeader});

  font-size: 14px;
  line-height: 14px;
  font-weight: 400;
`

export const WithdrawLine = styled.div`
  display: flex;

  font-size: 13px;
  line-height: 13px;

  p {
    font-size: 12px;
    line-height: 12px;
    text-transform: uppercase;
  }

  &:nth-of-type(1) {
    width: 120px;
  }

  &:nth-of-type(2) {
    width: 160px;
  }

  &:nth-of-type(3) {
    flex: 1;
  }
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
    align-items: center;
    column-gap: 8px;
  }
`

export const WithdrawDetails = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: fit-content;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;

  span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    border-radius: 6px;
  }
`

export const WithdrawEditStatusForm = styled.form`
  display: flex;
  column-gap: 8px;
  width: 100%;
  height: fit-content;

  .ant-btn-compact-first-item {
    flex: 1 !important;
  }
`

export const WithdrawLabel = styled.div<IWithdrawLabel>`
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

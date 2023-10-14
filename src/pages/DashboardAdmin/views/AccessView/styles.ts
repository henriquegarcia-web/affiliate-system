import { Form } from 'antd'

import styled from 'styled-components'

export const AccessView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const AccessWrapper = styled.main`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const CreateClientForm = styled(Form)`
  display: flex;
  flex-direction: column;
  row-gap: 15px;

  .ant-form-item {
    margin-bottom: 0px;
  }
`

export const CreateClientFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`

export const User = styled.div`
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

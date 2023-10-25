import { responsiveMobile, responsiveTablet } from '@/utils/styles/globals'
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

  .ant-btn-compact-first-item {
    flex: 1 !important;
  }
`

export const CreateClientFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`

export const EmptyAccess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  font-size: 14px;
  line-height: 14px;
  font-weight: 400;
`

export const User = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 10px 12px;
  border-radius: 8px;
  cursor: pointer;

  p {
    display: flex;
    align-items: center;
    column-gap: 4px;

    font-size: 14px;
    line-height: 14px;
    font-weight: 300;

    b {
      font-weight: 500;
    }

    span.agreement {
      display: flex;
      width: fit-content;
      height: fit-content;
      padding: 4px 6px 3px 6px;
      border-radius: 4px;
      margin-left: 5px;

      font-size: 12px;
      line-height: 12px;

      color: rgba(21, 102, 174, 1);
      background-color: rgba(21, 102, 174, 0.2);
      border: 1px solid rgba(21, 102, 174, 0.8);
    }

    span.blocked {
      display: flex;
      width: fit-content;
      height: fit-content;
      padding: 4px 6px 3px 6px;
      border-radius: 4px;
      margin-left: 5px;

      font-size: 12px;
      line-height: 12px;

      color: rgba(220, 73, 73, 1);
      background-color: rgba(220, 73, 73, 0.2);
      border: 1px solid rgba(220, 73, 73, 0.8);
    }

    @media screen and (max-width: ${responsiveTablet}) {
      flex-direction: column;
      align-items: flex-start;
      row-gap: 6px;

      span {
        margin-left: 0;
      }
    }
  }

  span {
    display: flex;
    column-gap: 6px;
  }

  @media screen and (max-width: ${responsiveMobile}) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 15px;

    span {
      width: 100%;
    }

    span button {
      margin-left: auto;
    }
  }
`

// export const User = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 10px 10px 10px 12px;
//   border-radius: 8px;
//   cursor: pointer;

//   p {
//     display: flex;
//     align-items: center;
//     column-gap: 4px;

//     font-size: 14px;
//     line-height: 14px;
//     font-weight: 300;

//     b {
//       font-weight: 500;
//     }

//     span {
//       display: flex;
//       width: fit-content;
//       height: fit-content;
//       padding: 4px 6px 3px 6px;
//       border-radius: 4px;
//       margin-left: 5px;

//       font-size: 12px;
//       line-height: 12px;

//       color: rgba(220, 73, 73, 1);
//       background-color: rgba(220, 73, 73, 0.2);
//       border: 1px solid rgba(220, 73, 73, 0.8);
//     }
//   }

//   span {
//     display: flex;
//     column-gap: 6px;
//   }
// `

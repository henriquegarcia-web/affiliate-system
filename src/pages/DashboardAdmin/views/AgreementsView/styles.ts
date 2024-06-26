// import { Form } from 'antd'

import styled from 'styled-components'

const linkWrapperHeader = '20px'

export const AgreementsView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const CreateAgreementForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`

export const CreateAgreementFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const LinkWrapperHeader = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  width: 100%;
  height: ${linkWrapperHeader};
  padding: 0 10px;

  font-size: 14px;
  line-height: 14px;
  font-weight: 400;
`

export const LinkWrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: calc(100% - ${linkWrapperHeader});
`

export const EmptyAgreements = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - ${linkWrapperHeader});

  font-size: 14px;
  line-height: 14px;
  font-weight: 400;
`

export const LinkIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-right: 6px;

  background-color: rgba(21, 102, 174, 0.6);

  svg {
    font-size: 14px;
    color: white;
  }
`

export const Link = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 12px;
  padding: 7px 8px;
  border-radius: 8px;
  transition: 0.3s;

  &:hover {
    border: 1px solid rgba(21, 102, 174, 0.4) !important;

    p {
      color: rgba(21, 102, 174, 0.8);
    }
  }
`

export const LinkLine = styled.div`
  display: flex;

  font-size: 11px;
  line-height: 11px;
  text-transform: uppercase;

  button {
    font-size: 12px !important;
    line-height: 12px !important;
  }

  p {
    font-size: 13px;
    line-height: 13px;
    font-weight: 400;
    text-transform: none;

    b {
      font-weight: 500;
    }
  }

  &:nth-of-type(1) {
    width: 140px;
  }

  &:nth-of-type(2) {
    flex: 1;
  }
`

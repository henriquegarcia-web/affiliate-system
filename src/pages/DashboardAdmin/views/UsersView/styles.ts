import styled from 'styled-components'

export const UsersView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const UsersWrapper = styled.main`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  height: 100%;
  padding: 10px;
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

// ================================================== MODALS

export const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
  row-gap: 6px;
`

export const Link = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 12px;
  padding: 7px 8px;
  border-radius: 8px;
  cursor: pointer;

  p {
    font-size: 13px;
    line-height: 13px;
    font-weight: 400;

    b {
      font-weight: 500;
    }
  }

  span {
    display: flex;
    column-gap: 6px;
    margin-left: auto;
  }

  button {
    font-size: 12px !important;
  }
`

export const LinksFormCreation = styled.form`
  display: flex;
  column-gap: 6px;
`

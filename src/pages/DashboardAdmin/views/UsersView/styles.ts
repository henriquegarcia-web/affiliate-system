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

export const EmptyUsers = styled.div`
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

    span {
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
  }

  span {
    display: flex;
    column-gap: 6px;
  }
`

// ================================================== MODAL LINK

export const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
  row-gap: 8px;
`

// =========================================== LINK

export const LinkIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-right: 6px;

  background-color: rgba(112, 220, 73, 0.6);

  svg {
    font-size: 14px;
    color: white;
  }
`

export const EmptyLink = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 0;

  font-size: 13px;
  line-height: 13px;
  font-weight: 400;
`

export const LinksFormCreation = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 5px;

  button {
    margin: 5px 0 0 auto;
  }
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

// ================================================== MODAL COMISSION

export const LinksComission = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
  row-gap: 8px;
`

// =========================================== COMISSION

export const ComissionFormCreation = styled.form`
  display: flex;
  column-gap: 5px;
`

export const Comission = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 6px;
  padding: 7px 8px;
  border-radius: 8px;
  cursor: pointer;

  font-size: 14px;
  line-height: 14px;

  p {
    font-weight: 300;
  }

  b {
    font-weight: 500;
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

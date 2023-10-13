import styled from 'styled-components'

export const MediasView = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const MediasWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 10px;
`

export const Link = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 12px;
  width: calc(50% - 5px);
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
